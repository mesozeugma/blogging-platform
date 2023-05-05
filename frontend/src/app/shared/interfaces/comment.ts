import { z } from 'zod';

export const commentSchema = z
  .object({
    id: z.string(),
    body: z.string(),
    createdAt: z.string().pipe(z.coerce.date()),
    updatedAt: z.string().pipe(z.coerce.date()),
    createdBy: z.string(),
  })
  .strip();
export type CommentSchema = z.infer<typeof commentSchema>;

export const commentListScema = z
  .object({
    items: z.array(commentSchema),
  })
  .strip();
export type CommentListScema = z.infer<typeof commentListScema>;
