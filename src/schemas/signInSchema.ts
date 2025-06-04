import {z} from "zod";

export const signInSchema = z.object({
        validators: z.string(),
        password: z.string()
})