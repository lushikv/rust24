import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase URL-safe slugs.");

export function optionalString(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : null;
}

export function requiredString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function optionalInt(value: FormDataEntryValue | null) {
  const text = optionalString(value);
  return text === null ? null : Number(text);
}

export function boolFromForm(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export function linesFromForm(value: FormDataEntryValue | null) {
  return requiredString(value)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function dateFromForm(value: FormDataEntryValue | null) {
  const text = optionalString(value);
  return text ? new Date(text) : null;
}
