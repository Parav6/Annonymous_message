import {z} from "zod";

export const acceptMessageSchema = z.object({
    content : z
        .string()
        .max(300,{message:"content must not be more than 300 characters"})
});