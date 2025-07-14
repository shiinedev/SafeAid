
import { useState } from "react"
import { Role, useAuth } from "../hooks/useAuth"
import { Categories, Level, useTraining } from "../hooks/useTraining"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Alert, AlertDescription } from "../components/ui/alert"
import { BookOpen, ArrowLeft, Shield } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { trainingSchema } from "../schemas/schemas"
import z from "zod"
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"


   


export default function AddTrainingForm() {
    const { user } = useAuth()
    const { addModule } = useTraining();

    const navigate = useNavigate()

   
    type TrainingFormValues = z.infer<typeof trainingSchema>

    const form = useForm({
        resolver: zodResolver(trainingSchema),
        defaultValues: {
            title: "",
            description: "",
            category: Categories[0],
            duration: "",
            content: "",
            level: Level.Beginner
        }
    })
   
  const {isSubmitSuccessful, isSubmitting} = form.formState;

    if (!user) {
        navigate("/login")
        return null
    }

    if (![Role.Admin, Role.Trainer].includes(user.role)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Access Denied</CardTitle>
                        <CardDescription className="text-center">
                            Only administrators and trainers can create training modules.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link to="/training">Back to Training</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }


    const onSubmit: SubmitHandler<TrainingFormValues> =async (data) => {
        console.log(data);
        
        try {
             await addModule({
                ...data,
                createdBy:user.email,
                isActive:true
            });
             setTimeout(() => {
             navigate("/training")
            }, 2000)
        } catch (error) {
            console.error("Error creating training module:", error)
        }
       

    }

    if (isSubmitSuccessful) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-green-800">Training Module Created</CardTitle>
                        <CardDescription>
                            The training module has been successfully created and is now available offline.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link to="/training">View All Training</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/training">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Link>
                        </Button>
                        <div className="flex items-center space-x-4">
                            <BookOpen className="h-8 w-8 text-purple-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Create Training Module</h1>
                                <p className="text-gray-600">Add new training content for field teams</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Alert className="mb-6 border-purple-200 bg-purple-50">
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                            Training modules will be encrypted and stored locally for offline access. All team members will be able to
                            access this content.
                        </AlertDescription>
                    </Alert>

                    <Card>
                        <CardHeader>
                            <CardTitle>Training Module Details</CardTitle>
                            <CardDescription>
                                Fill in the information below to create a new training module. Use Markdown formatting for the content.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">

                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Module Title *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g., Advanced Wound Care" {...field} />
                                                        </FormControl>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">

                                            <FormField
                                                control={form.control}
                                                name="category"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Category *</FormLabel>
                                        
                                                         <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select Category " />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    Categories.map((category,index) =>(
                                                                        <SelectItem key={index} value={category}>{category}</SelectItem>
                                                                    ))
                                                                }
                                                                
            
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="duration"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Duration *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g., 30 min, 1 hour" {...field} />
                                                        </FormControl>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="level"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Difficulty Level *</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select Level " />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value={Level.Beginner}>Beginner</SelectItem>
                                                                <SelectItem value={Level.Intermediate}>Intermediate</SelectItem>
                                                                <SelectItem value={Level.Advanced}>Advanced</SelectItem>
                                                                <SelectItem value={Level.Essential}>Essential</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">


                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description *</FormLabel>
                                                    <FormControl>
                                                        <Textarea rows={3} placeholder="Brief description of what this training covers" {...field} />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">

                                        <FormField
                                            control={form.control}
                                            name="content"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Training Content *</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="# Training Module Title

                                ## Learning Objectives
                                - Objective 1
                                - Objective 2

                                ## Module Content
                                ### Section 1
                                Content here...

                                ### Section 2
                                More content..."
                                                            rows={15} {...field} />
                                                    </FormControl>
                                                    <FormDescription>Use Markdown formatting for rich content. Include headings, lists, and emphasis as needed.</FormDescription>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>

                                    <div className="flex space-x-4">
                                        <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                                            {isSubmitting ? "Creating..." : "Create Training Module"}
                                        </Button>
                                        <Button type="button" variant="outline" asChild>
                                            <Link to="/training">Cancel</Link>
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}




