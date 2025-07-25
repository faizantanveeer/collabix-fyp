// schemas/gigSchema.ts
import { z } from "zod";

export const gigFormSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description is required"),
    price: z.coerce.number().min(1, "Price must be at least $1"),
    deliveryTime: z.coerce.number().min(1, "Delivery time in days is required"),
    revisions: z.coerce.number().min(0),
    category: z.enum(["content creation", "shoutout", "review", "other"]),
    isActive: z.boolean(),
    images: z
        .any()
        .refine((files) => files?.length > 0, { message: "At least one image is required" }),
});



export const updateGigSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.coerce.number().min(1, "Price must be at least $1").optional(),
    deliveryTime: z.coerce.number().min(1, "Delivery time in days is required").optional(),
    revisions: z.coerce.number().min(0).optional(),
    category: z.enum(["content creation", "shoutout", "review", "other"]).optional(),
    isActive: z.boolean().optional(),
    images: z
        .any()
        .optional()
        .refine(
            (files) =>
                files === undefined || files.length === 0 || files.length >= 1,
            {
                message: "Choose at least 1 image",
            }
        ),
});