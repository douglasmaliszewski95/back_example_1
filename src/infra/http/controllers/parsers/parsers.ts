import { z } from "zod";

const nonEmptyTrimmedString = (fieldName: string) => {
  return z.string()
    .transform((val: string) => val.trim()) // Trim whitespace
    .refine((val: string) => val.length > 0, { message: `${fieldName} cannot be empty` });
}

const nonEmptyTrimmedUsernameString = (fieldName: string) => {
  return z.string()
    .max(30, "username must have a maximum of 30 characters")
    .transform((val: string) => val.trim()) // Trim whitespace
    .refine((val: string) => val.length > 0, { message: `${fieldName} cannot be empty` });
}

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

export { nonEmptyTrimmedString, nonEmptyTrimmedUsernameString, stripHtml };