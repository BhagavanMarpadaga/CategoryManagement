import { z } from "zod";

// Zod schema for validating category data


export const validateRoot = z
.object({
  categoryName: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
    isRoot:z.boolean().default(true)
})
.strict();
export const validateCategory = z
  .object({
    categoryName: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name is too long"),
    categoryParentId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid categoryParentId provided"),
  })
  .strict();

export const validateCategoryId = z
  .object({
    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid categoryId provided"),
  })
  .strict();

export const validateCategoryForUpdate = z
  .object({
    categoryName: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name is too long"),
    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid categoryId provided"),
  })
  .strict();
