import {z} from "zod";

export const tagSchema = z.object({

    name: z
        .string()
        .trim()
        .nonempty("Category name is required")
        .min(2, "Category name must be at least 2 characters")
        .max(100, "Category name must not exceed 90 characters"),

    status: z
        .boolean({
            error: "Category status is required"
        }),

    slug: z
        .string()
        .trim()
        .min(2, "Category slug must be at least 2 characters")
        .max(100, "Category slug must not exceed 100 characters")
        .optional()
        .or(z.literal("")),

    description: z
        .string()
        .trim()
        .min(2, "Category description must be at least 2 characters")
        .max(500, "Category description must not exceed 500 characters")
        .optional()
        .or(z.literal("")),

})