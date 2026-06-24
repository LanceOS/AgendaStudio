import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number(),
  userId: z.string(),
  name: z.string().min(1).max(255),
  color: z.string().min(1).max(50),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(255),
  color: z.string().min(1).max(50),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();
