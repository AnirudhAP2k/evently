import { z } from 'zod'

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {
        message: 'Password is required'
    }),
    code: z.string(),
})

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(8, { message: 'Minimum 8 characters are required' })
        .regex(/[A-Z]/, { message: "At least one uppercase letter is required" })
        .regex(/[a-z]/, { message: "At least one lowercase letter is required" })
        .regex(/[0-9]/, { message: "At least one digit is required" })
        .regex(/[!@#$%^&*]/, { message: "At least one special character is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    confirmPassword: z.string()
}).refine(({ password, confirmPassword }) => confirmPassword === password, {
    message: "The passwords did not match",
    path: ["confirmPassword"],
});

export const ResetSchema = z.object({
    email: z.string().email()
})

export const SetNewPasswordSchema = z.object({
    password: z.string()
        .min(8, { message: 'Minimum 8 characters are required' })
        .regex(/[A-Z]/, { message: "At least one uppercase letter is required" })
        .regex(/[a-z]/, { message: "At least one lowercase letter is required" })
        .regex(/[0-9]/, { message: "At least one digit is required" })
        .regex(/[!@#$%^&*]/, { message: "At least one special character is required" }),
    confirmPassword: z.string()
}).refine(({ password, confirmPassword }) => confirmPassword === password, {
    message: "The passwords did not match",
    path: ["confirmPassword"],
});

export const EventCreateSchema = z.object({
    title: z.string().min(3, {
        message: "Title should be atlest 3 characters"
    }).max(20, {
        message: "Title should be atmost 20 characters"
    }),
    description: z.string().min(5, {
        message: "Description should be atlest 5 characters"
    }).max(400, {
        message: "Description should be atmost 400 characters"
    }),
    location: z.string().min(3, {
        message: "Location should be atlest 3 characters"
    }).max(100, {
        message: "Location should be atmost 100 characters"
    }),
    image: z.instanceof(File, { message: "An image file is required." })
        .nullable()
        .optional(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string(),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url(),
});

export const EventSubmitSchema = EventCreateSchema.omit({ image: true }).extend({
    userId: z.string(),
    imageUrl: z.string(),
    startDateTime: z.string().transform((str) => new Date(str)),
    endDateTime: z.string().transform((str) => new Date(str)),
});

export const OrganizationCreateSchema = z.object({
    name: z.string().min(2, {
        message: "Organization name must be at least 2 characters"
    }).max(100, {
        message: "Organization name must be at most 100 characters"
    }),
    industryId: z.string().uuid({
        message: "Please select an industry"
    }),
    description: z.string().min(5, {
        message: "Description should be at least 5 characters"
    }).max(500, {
        message: "Description should be at most 500 characters"
    }).optional(),
    website: z.string().url({
        message: "Please enter a valid website URL"
    }).optional().or(z.literal("")),
    location: z.string().max(100, {
        message: "Location should be at most 100 characters"
    }).optional(),
    size: z.enum(["STARTUP", "SME", "ENTERPRISE"]).optional(),
    logo: z.instanceof(File, { message: "An image file is required." })
        .nullable()
        .optional(),
});

export const OrganizationSubmitSchema = OrganizationCreateSchema.omit({ logo: true }).extend({
    userId: z.string(),
    logoUrl: z.string(),
});
