import  { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { loginSchema } from "../schemas/schemas";

import {  useNavigate } from "react-router";
import { Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";


const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {login} = useAuth();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  console.log(form);
  

  const navigate = useNavigate();

 

  const onsubmit = async(data:{email:string,password:string}) => {
     setError("")
    setLoading(true)

    try {
      await login(data.email, data.password)
      navigate("/dashboard")
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
    
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
         <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl">SafeAid Login</CardTitle>
          <CardDescription>Secure access to humanitarian data platform</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="bg-red-100 text-center rounded p-2 ">{error}</p>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example @gmail.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="*********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className={"w-full"}
                type="submit"
                disabled={loading}
                >
               {loading? "Login..." : "Login"} 
              </Button>
            </form>
           <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo Credentials:</p>
            <div className="mt-2 space-y-1 text-xs">
              <p>
                <strong>Admin:</strong> admin@safeaid.org / admin123
              </p>
              <p>
                <strong>Field Agent:</strong> agent@safeaid.org / agent123
              </p>
              <p>
                <strong>Medical:</strong> medical@safeaid.org / medical123
              </p>
            </div>
          </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;