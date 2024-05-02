import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.string(),  //identifier can be email or username
    password: z.string(),
  
});
