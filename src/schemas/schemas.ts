
import z from 'zod'



export const loginSchema = z.object({
    email:z.email("Email is not valid"),
    password:z.string().min(1,"please enter your password"),
})


 enum Level  {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced",
    Essential = "Essential"

}

export const trainingSchema = z.object({
    title:z.string().min(1,"title is required"),
    description:z.string().min(1,"description is required"),
    category:z.string().min(1,"category is required"),
    duration:z.string().min(1,"duration is required"),
    content:z.string().min(1,"content is required"),
    level: z.nativeEnum(Level)
})



