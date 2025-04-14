import { z } from "zod";

export const CreateUserSchema = z.object({
    username : z.string(),
    name : z.string(),
    password : z.string()
});

export const SignInSchema = z.object({
    username : z.string(),
    password : z.string()
});


export const CreateRommSchema = z.object({
    name : z.string()
})