import z from 'zod'

export const loginSchema = z.object({
    email:z.email("Email is not valid"),
    password:z.string().min(1,"please enter your password"),
})