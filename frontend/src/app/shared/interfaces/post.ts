import { z } from 'zod';
import { commentSchema } from './comment';

export const postSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
    featuredUntil: z.optional(z.string().pipe(z.coerce.date())),
    createdAt: z.string().pipe(z.coerce.date()),
    updatedAt: z.string().pipe(z.coerce.date()),
    createdBy: z.string(),
    comments: z.optional(z.array(commentSchema)),
  })
  .strip();
export type PostSchema = z.infer<typeof postSchema>;

export const postListScema = z
  .object({
    items: z.array(postSchema),
  })
  .strip();
export type PostListScema = z.infer<typeof postListScema>;
