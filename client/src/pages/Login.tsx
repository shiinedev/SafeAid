import { useState } from "react";
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
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { login, loginSchema } from "../schemas/schemas";

import { useNavigate } from "react-router";
import { Shield } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import { useAuthStore } from "@/lib/store/authStore";
import { errorExtractMessage } from "@/utils/errorExtract";

interface User {
  _id: string;
  email: string;
  role: 'admin' | 'field_agent' | 'medical' | 'trainer';
  username:string | "";
  status:"active"|"deActive"
  password:""
}


const Login = () => {
  const [error, setError] = useState<string | null>(null);

  const { setAuth } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });



  const navigate = useNavigate();


  const loginMutation = useMutation<{ token: string; user: User }, unknown, login>({
    mutationFn: async (data) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("user Login successfully", data);
      if (data.token) {
        const { token, user } = data;
        setAuth(user, token);
        form.reset();
        navigate("/dashboard");
        setError(null);
      }
    },
    onError: (err) => {
      console.log("error", errorExtractMessage(err));
      setError(errorExtractMessage(err));
    },
  });

  const onsubmit: SubmitHandler<login> = (data) => {
    loginMutation.mutate(data);
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
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Login..." : "Login"}
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

export default Login;