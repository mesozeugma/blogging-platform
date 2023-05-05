import { z } from 'zod';

export const userInfoSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    isAdmin: z.boolean(),
  })
  .strip();
export type UserInfoSchema = z.infer<typeof userInfoSchema>;

export const userInfoListSchema = z
  .object({
    items: z.array(userInfoSchema),
  })
  .strip();
export type UserInfoListScema = z.infer<typeof userInfoListSchema>;
