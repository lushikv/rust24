import "server-only";

import { CartStatus, CurrencyCode, OrderSource, OrderStatus, ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateCartSummary, calculateLineTotals, clampQuantity } from "@/lib/cart/cart-calculations";
import type { CartDto, CartIdentity, CartLocaleOptions } from "@/lib/cart/types";
import type { Currency } from "@/types/content";

type CartWithItems = Awaited<ReturnType<typeof findCartWithItems>>;

export class CartServiceError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

function toCurrencyCode(currency?: Currency) {
  return currency === "EUR" ? CurrencyCode.EUR : CurrencyCode.RUB;
}

function hasIdentity(identity: CartIdentity) {
  return Boolean(identity.userId || identity.sessionId);
}

function getCartWhere(identity: CartIdentity) {
  if (identity.userId) {
    return { userId: identity.userId };
  }

  return { sessionId: identity.sessionId ?? "" };
}

async function findCartWithItems(identity: CartIdentity) {
  if (!hasIdentity(identity)) {
    return null;
  }

  return prisma.cart.findFirst({
    where: {
      ...getCartWhere(identity),
      status: CartStatus.ACTIVE
    },
    orderBy: { updatedAt: "desc" },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
        include: {
          product: {
            include: {
              category: true,
              translations: true
            }
          }
        }
      }
    }
  });
}

function emptyCart(unavailable = false): CartDto {
  return {
    id: null,
    currency: "RUB",
    items: [],
    summary: {
      totalQuantity: 0,
      subtotalRub: 0,
      subtotalEur: 0
    },
    unavailable,
    message: unavailable ? "Cart database is unavailable." : undefined
  };
}

function mapCart(cart: NonNullable<CartWithItems>, locale: CartLocaleOptions["locale"]): CartDto {
  const items = cart.items.map((item) => {
    const translation =
      item.product.translations.find((entry) => entry.locale === (locale === "ru" ? "RU" : "EN")) ??
      item.product.translations[0];
    const totals = calculateLineTotals({
      quantity: item.quantity,
      unitPriceRub: item.unitPriceRub,
      unitPriceEur: item.unitPriceEur
    });

    return {
      id: item.id,
      productSlug: item.product.slug,
      categorySlug: item.product.category.slug,
      title: translation?.title ?? item.product.slug,
      quantity: item.quantity,
      unitPriceRub: item.unitPriceRub,
      unitPriceEur: item.unitPriceEur,
      ...totals
    };
  });

  return {
    id: cart.id,
    currency: cart.currency,
    items,
    summary: calculateCartSummary(items)
  };
}

function handleCartWriteError(error: unknown): never {
  if (error instanceof CartServiceError) {
    throw error;
  }

  if (process.env.NODE_ENV !== "production") {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[cart] write failed: ${message}`);
  }

  throw new CartServiceError("Cart database is unavailable.", 503);
}

export async function getOrCreateCart({
  userId,
  sessionId,
  currency
}: CartIdentity & {
  currency?: Currency;
}) {
  if (!hasIdentity({ userId, sessionId })) {
    throw new CartServiceError("Cart session is required.", 400);
  }

  const existingCart = await findCartWithItems({ userId, sessionId });

  if (existingCart) {
    return existingCart;
  }

  return prisma.cart.create({
    data: {
      userId: userId ?? undefined,
      sessionId: userId ? undefined : sessionId,
      currency: toCurrencyCode(currency)
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              translations: true
            }
          }
        }
      }
    }
  });
}

export async function getCart(options: CartLocaleOptions): Promise<CartDto> {
  if (!hasIdentity(options)) {
    return emptyCart();
  }

  try {
    const cart = await findCartWithItems(options);
    return cart ? mapCart(cart, options.locale) : emptyCart();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[cart] read failed: ${message}; returning empty cart.`);
    }

    return emptyCart(true);
  }
}

export async function addCartItem({
  userId,
  sessionId,
  productSlug,
  categorySlug,
  quantity,
  currency
}: CartIdentity & {
  productSlug: string;
  categorySlug: string;
  quantity: number;
  currency?: Currency;
}) {
  try {
    const safeQuantity = clampQuantity(quantity);

    if (!safeQuantity) {
      throw new CartServiceError("Quantity must be an integer between 1 and 99.", 400);
    }

    const product = await prisma.product.findFirst({
      where: {
        slug: productSlug,
        status: ProductStatus.ACTIVE,
        category: {
          slug: categorySlug,
          isActive: true
        }
      }
    });

    if (!product) {
      throw new CartServiceError("Product was not found.", 404);
    }

    const cart = await getOrCreateCart({ userId, sessionId, currency });

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id
        }
      },
      update: {
        quantity: { increment: safeQuantity },
        unitPriceRub: product.priceRub,
        unitPriceEur: product.priceEur
      },
      create: {
        cartId: cart.id,
        productId: product.id,
        quantity: safeQuantity,
        unitPriceRub: product.priceRub,
        unitPriceEur: product.priceEur
      }
    });
  } catch (error) {
    handleCartWriteError(error);
  }
}

export async function updateCartItemQuantity({
  userId,
  sessionId,
  itemId,
  quantity
}: CartIdentity & {
  itemId: string;
  quantity: number;
}) {
  try {
    const safeQuantity = clampQuantity(quantity);

    if (!safeQuantity) {
      throw new CartServiceError("Quantity must be an integer between 1 and 99.", 400);
    }

    const cart = await findCartWithItems({ userId, sessionId });

    if (!cart) {
      throw new CartServiceError("Cart was not found.", 404);
    }

    await prisma.cartItem.update({
      where: {
        id: itemId,
        cartId: cart.id
      },
      data: { quantity: safeQuantity }
    });
  } catch (error) {
    handleCartWriteError(error);
  }
}

export async function removeCartItem({
  userId,
  sessionId,
  itemId
}: CartIdentity & {
  itemId: string;
}) {
  try {
    const cart = await findCartWithItems({ userId, sessionId });

    if (!cart) {
      throw new CartServiceError("Cart was not found.", 404);
    }

    await prisma.cartItem.delete({
      where: {
        id: itemId,
        cartId: cart.id
      }
    });
  } catch (error) {
    handleCartWriteError(error);
  }
}

export async function clearCart(identity: CartIdentity) {
  try {
    const cart = await findCartWithItems(identity);

    if (!cart) {
      return;
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
  } catch (error) {
    handleCartWriteError(error);
  }
}

export async function createDraftOrderFromCart({
  userId,
  sessionId,
  locale
}: CartLocaleOptions) {
  try {
    if (!userId) {
      throw new CartServiceError("Login with Steam is required before checkout.", 401);
    }

    const cart = await findCartWithItems({ userId, sessionId });

    if (!cart || cart.items.length === 0) {
      throw new CartServiceError("Cart is empty.", 400);
    }

    const dto = mapCart(cart, locale);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          cartId: cart.id,
          status: OrderStatus.DRAFT,
          source: OrderSource.CART,
          currency: cart.currency,
          totalRub: dto.summary.subtotalRub,
          totalEur: dto.summary.subtotalEur,
          expiresAt,
          items: {
            create: cart.items.map((item) => {
              const translation =
                item.product.translations.find((entry) => entry.locale === (locale === "ru" ? "RU" : "EN")) ??
                item.product.translations[0];
              const totals = calculateLineTotals({
                quantity: item.quantity,
                unitPriceRub: item.unitPriceRub,
                unitPriceEur: item.unitPriceEur
              });

              return {
                productId: item.productId,
                productSlug: item.product.slug,
                productTitle: translation?.title ?? item.product.slug,
                quantity: item.quantity,
                unitPriceRub: item.unitPriceRub,
                unitPriceEur: item.unitPriceEur,
                totalRub: totals.totalRub,
                totalEur: totals.totalEur
              };
            })
          }
        }
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: { status: CartStatus.CONVERTED }
      });

      return order;
    });
  } catch (error) {
    handleCartWriteError(error);
  }
}
