import "server-only";

export type AdminRepositoryResult<T> = {
  data: T;
  available: boolean;
  error?: string;
};

export async function adminQuery<T>(
  label: string,
  query: () => Promise<T>,
  fallback: T
): Promise<AdminRepositoryResult<T>> {
  if (!process.env.DATABASE_URL) {
    return {
      data: fallback,
      available: false,
      error: "DATABASE_URL is not configured."
    };
  }

  try {
    return {
      data: await query(),
      available: true
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (process.env.NODE_ENV !== "production") {
      console.warn(`[admin:${label}] ${message}`);
    }

    return {
      data: fallback,
      available: false,
      error: "Database is unavailable."
    };
  }
}
