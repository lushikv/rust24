import "server-only";

const PLACEHOLDER_PATTERN = /\{([a-zA-Z][a-zA-Z0-9]*)\}/g;

export const allowedDeliveryCommandPlaceholders = [
  "steamId",
  "playerName",
  "quantity",
  "durationDays",
  "serverSlug",
  "productSlug",
  "orderId",
  "deliveryJobId"
] as const;

const allowedPlaceholders = new Set<string>(allowedDeliveryCommandPlaceholders);

export type CommandTemplateValidationResult =
  | { valid: true; placeholders: string[] }
  | { valid: false; placeholders: string[]; unknownPlaceholders: string[] };

export function validateCommandTemplatePlaceholders(template: string): CommandTemplateValidationResult {
  const placeholders = Array.from(template.matchAll(PLACEHOLDER_PATTERN), (match) => match[1]);
  const uniquePlaceholders = Array.from(new Set(placeholders));
  const unknownPlaceholders = uniquePlaceholders.filter((placeholder) => !allowedPlaceholders.has(placeholder));

  if (unknownPlaceholders.length) {
    return {
      valid: false,
      placeholders: uniquePlaceholders,
      unknownPlaceholders
    };
  }

  return {
    valid: true,
    placeholders: uniquePlaceholders
  };
}

export function assertValidCommandTemplate(template: string) {
  const result = validateCommandTemplatePlaceholders(template);

  if (!result.valid) {
    throw new Error(`Unknown command template placeholders: ${result.unknownPlaceholders.join(", ")}`);
  }

  return result.placeholders;
}
