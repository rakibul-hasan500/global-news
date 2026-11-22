import {z} from "zod"


// Register User
export const registerSchema = z.object({

    name: z
        .string()
        .trim()
        .nonempty("Enter your full name")
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters"),

    email: z
        .email("Invalid email address")
        .nonempty("Enter your email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .nonempty("Enter your password")
        .min(8, "Password must be at least 8 characters")
        .regex(/[0-9]/, "Password must contain at least 1 number")
        .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
        .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character")
        .max(100, "Password must not exceed 100 characters"),

    confirmPassword: z
        .string()
        .nonempty("Confirm your password")

}).refine((data: any) => data?.password === data?.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
})


// Login User
export const loginSchema = z.object({

    email: z
        .email("Invalid email address")
        .nonempty("Enter your email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .nonempty("Enter your password")
        .min(8, "Password must be at least 8 characters"),

})


// Forgot Password
export const forgotPasswordSchema = z.object({

    email: z
        .email("Invalid email address")
        .nonempty("Enter your email address")
        .trim()
        .toLowerCase()

})


// Resend OTP Schema
export const resendOtpSchema = z.object({

    token: z
        .string()
        .nonempty("Verification token is required")
        .trim()

})


// Verify OTP Schema
export const verifyOtpSchema = z.object({

    token: z
        .string()
        .nonempty("Verification token is required")
        .trim(),

    otp: z
        .string()
        .nonempty("Enter the OTP")
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^[0-9]+$/, "OTP must contain only numbers")

})


// Reset Password
export const resetPasswordSchema = z.object({

    token: z
        .string()
        .nonempty("Verification token is required")
        .trim(),

    password: z
        .string()
        .nonempty("Enter your password")
        .min(8, "Password must be at least 8 characters")
        .regex(/[0-9]/, "Password must contain at least 1 number")
        .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
        .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character")
        .max(100, "Password must not exceed 100 characters"),

    confirmPassword: z
        .string()
        .nonempty("Confirm your password")

}).refine((data: any) => data?.password === data?.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
})