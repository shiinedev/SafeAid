import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Shield, ArrowLeft, EyeOff, Eye, Copy } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, userSchema } from "@/schemas/schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Role, useAuthStore } from "@/lib/store/authStore"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/apiClient"
import { errorExtractMessage } from "@/utils/errorExtract"


interface RegisterInput {
  email: string;
  username: string;
  password: string;
  role: Role;
}


export default function AddUsersForm() {

  const [isSuccess,setIsSuccess] = useState(false)
  const { user } = useAuthStore()


  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      role: Role.Admin,
      password: "",
      confirmPassword:""
    }
  })

 const {isSubmitSuccessful,isSubmitting} = form.formState;
  
  const [showPassword, setShowPassword] = useState(false)

 

  if (!user) {
    navigate("/login")
    return null
  }

  if (user.role !== Role.Admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">Only administrators can create users.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }


    const registerMutation = useMutation<any,unknown,RegisterInput>({
    mutationFn: async (data) =>{
      const response = await api.post("/auth/register",data);
      return response.data;
    },
    onSuccess:(data) =>{
      console.log("user creation successfully",data);
      form.reset();
    },
    onError:(err) =>{
      console.log("error",errorExtractMessage(err));
      
    }
  })


  const generateSecurePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  
    form.setValue("password", password)
    form.setValue("confirmPassword", password)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Password copied to clipboard!")
  }

 
  
    
  const onSubmit:SubmitHandler<User> =async (data) => {
    const { confirmPassword, ...dataToSend } = data;
 
     try {
      
      registerMutation.mutate(dataToSend);
      setIsSuccess(true)
      setTimeout(() => {
        navigate("/users");
        setIsSuccess(false)
      }, 2000) // Give more time to copy credentials
    } catch (error) {
      console.error("Error creating user:", error);
 
    }
    


  }

  
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-800">User Created Successfully</CardTitle>
            <CardDescription>
              The user account has been created. Please share these credentials securely.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>IMPORTANT:</strong> Save these credentials securely. They will not be shown again.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email:</Label>
                  <p className="font-mono text-sm">{form.getValues('email')}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.getValues('email'))}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Password:</Label>
                  <p className="font-mono text-sm">{form.getValues('password')}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.getValues('password'))}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium">Role:</Label>
                <p className="text-sm">{form.getValues("role").replace("_", " ").toUpperCase()}</p>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Share these credentials with the user through a secure channel.</p>
              <p>The user can change their password after first login.</p>
            </div>

            <Button asChild className="w-full">
              <Link to="/users">View All Users</Link>
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
              <Link to="/users">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center space-x-4">
              <UserPlus className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
                <p className="text-gray-600">Add a new user to the SafeAid platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              User accounts will be encrypted and stored locally. Make sure to securely share the login credentials with
              the user.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Fill in the details for the new user account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>

                    <div className="space-y-2">

                      <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Role " />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={Role.Admin}>
                                Admin
                              </SelectItem>
                              <SelectItem value={Role.Field_agent}>
                                Field Agent
                              </SelectItem>
                              <SelectItem value={Role.Medical_staff}>
                                Medical Staff
                              </SelectItem>
                              <SelectItem value={Role.Trainer}>
                                Trainer
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Password Setup</Label>
                      <Button type="button" variant="outline" size="sm" onClick={generateSecurePassword}>
                        Generate Secure Password
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">

                        <FormField
                          name="password"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>password *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password (min 6 characters)"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormField
                          name="confirmPassword"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="confirm Your password"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Role Permissions:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Field Agent:</strong> Register beneficiaries, update records, offline storage
                      </p>
                      <p>
                        <strong>Medical Staff:</strong> View/add medical records for registered individuals
                      </p>
                      <p>
                        <strong>Trainer:</strong> Access and create training content
                      </p>
                      <p>
                        <strong>Administrator:</strong> Full access including user management and data sync
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                      {isSubmitting ? "Creating User..." : "Create User"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link to="/users">Cancel</Link>
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
