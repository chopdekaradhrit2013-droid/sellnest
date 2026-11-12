export const RESERVED_SLUGS = new Set([
  "api",
  "dashboard",
  "login",
  "signin",
  "signup",
  "register",
  "auth",
  "store",
  "verify-email",
  "forgot-password",
  "reset-password",
  "account",
  "admin",
  "settings",
  "overview",
  "help",
  "terms",
  "privacy",
  "contact",
  "refund-policy",
  "refund",
  "billing",
  "pricing",
]);

export interface SlugValidationResult {
  isValid: boolean;
  cleanSlug: string;
  error?: string;
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateSlug(slug: string): SlugValidationResult {
  const clean = sanitizeSlug(slug);

  if (!clean || clean.length < 3) {
    return {
      isValid: false,
      cleanSlug: clean,
      error: "Store URL handle must be at least 3 characters long.",
    };
  }

  if (clean.length > 30) {
    return {
      isValid: false,
      cleanSlug: clean,
      error: "Store URL handle cannot exceed 30 characters.",
    };
  }

  if (RESERVED_SLUGS.has(clean)) {
    return {
      isValid: false,
      cleanSlug: clean,
      error: `"${clean}" is a reserved system name. Please choose another handle.`,
    };
  }

  const validPattern = /^[a-z0-9][a-z0-9_-]*[a-z0-9]$/;
  if (!validPattern.test(clean)) {
    return {
      isValid: false,
      cleanSlug: clean,
      error: "Handle must start and end with a letter or number, using hyphens or underscores.",
    };
  }

  return {
    isValid: true,
    cleanSlug: clean,
  };
}

