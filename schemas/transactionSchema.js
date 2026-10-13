
import { z } from "zod";

export const transactionSchema = z.object({
  title: z.string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),

  amount: z.number()
    .finite()
    .positive("Amount must be greater than zero"),

  type: z.enum(["income", "expense"]),

  category: z.string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category cannot exceed 50 characters"),

  date: z.iso.datetime({ offset: true })
    .or(z.iso.date())
    .optional(),
});

export const updateTransactionSchema =
  transactionSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: "Provide at least one field to update" }
  );
