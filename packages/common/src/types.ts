import { z } from "zod";

export const CreateUserSchema = z.object({
    name : z.string(),
    email : z.string(),
    password : z.string(),
    photo : z.string()
});

export const SignInSchema = z.object({
    username : z.string(),
    password : z.string()
});


export const CreateRommSchema = z.object({
    name : z.string()
})