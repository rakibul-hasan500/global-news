import { z } from "zod";

// App Settings
export const appSettingsSchema = z.object({

    appName: z
        .string()
        .trim()
        .max(100, "App name must be at most 100 characters")
        .optional()
        .or(z.literal("")),

    tagline: z
        .string()
        .trim()
        .max(200, "Tagline must be at most 200 characters")
        .optional()
        .or(z.literal("")),

    appDescription: z
        .string()
        .trim()
        .max(1000, "App description must be at most 1000 characters")
        .optional()
        .or(z.literal("")),

    metaTitle: z
        .string()
        .trim()
        .max(200, "Meta title must be at most 200 characters")
        .optional()
        .or(z.literal("")),

    metaDescription: z
        .string()
        .trim()
        .max(500, "Meta description must be at most 500 characters")
        .optional()
        .or(z.literal("")),

    metaKeywords: z
        .string()
        .trim()
        .max(500, "Meta keywords must be at most 500 characters")
        .optional()
        .or(z.literal("")),

    logo: z
        .instanceof(File)
        .refine((file) => ["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(file.type), "Logo must be a PNG, JPG, WEBP or SVG file")
        .refine((file) => file.size <= 5 * 1024 * 1024, "Logo size must be less than 5MB")
        .nullable()
        .optional(),

    favicon: z
        .instanceof(File)
        .refine((file) => ["image/png", "image/x-icon", "image/svg+xml"].includes(file.type), "Favicon must be a PNG, ICO or SVG file")
        .refine((file) => file.size <= 1024 * 1024, "Favicon size must be less than 1MB")
        .nullable()
        .optional()

});


// contact Settings
export const contactSettingsSchema = z.object({

    title: z
        .string()
        .trim()
        .max(100, "Title must be at most 100 characters")
        .optional()
        .or(z.literal("")),

    description: z
        .string()
        .trim()
        .max(500, "Description must be at most 500 characters")
        .optional()
        .or(z.literal("")),

    email: z
        .email("Enter a valid email address")
        .trim()
        .max(100, "Email address must be at most 100 characters")
        .optional()
        .or(z.literal("")),

    phone: z
        .string()
        .trim()
        .max(20, "Phone number must be at most 20 characters")
        .optional()
        .or(z.literal("")),

    address: z
        .string()
        .trim()
        .max(250, "Address must be at most 250 characters")
        .optional()
        .or(z.literal("")),

    workingHours: z
        .string()
        .trim()
        .max(250, "Working hours must be at most 250 characters")
        .optional(),

    socialLinks: z.object({

        facebook: z
            .url("Enter a valid Facebook URL")
            .trim()
            .optional()
            .or(z.literal("")),

        instagram: z
            .url("Enter a valid Instagram URL")
            .trim()
            .optional()
            .or(z.literal("")),

        youtube: z
            .url("Enter a valid YouTube URL")
            .trim()
            .optional()
            .or(z.literal("")),

        linkedin: z
            .url("Enter a valid LinkedIn URL")
            .trim()
            .optional()
            .or(z.literal("")),

        twitter: z
            .url("Enter a valid X URL")
            .trim()
            .optional()
            .or(z.literal("")),

    })

});

