import z from "zod";


export const userSchemaValidation = z.object({
    username:z.string().min(1,"username is required"),
    email:z.email("email is not valid"),
    password:z.string().min(6,"password must be at least 6 characters"),
    role:z.enum(['admin', 'field_agent', 'medical', 'trainer']),
    status:z.enum(["active","deActive"]).default("active")
})