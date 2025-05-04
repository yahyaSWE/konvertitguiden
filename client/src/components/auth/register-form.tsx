import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRole } from "@shared/schema";

const registerSchema = z.object({
  username: z.string().min(3, "Användarnamnet måste vara minst 3 tecken"),
  email: z.string().email("Ange en giltig e-postadress"),
  password: z.string().min(6, "Lösenordet måste vara minst 6 tecken"),
  fullName: z.string().min(2, "Fullständigt namn krävs"),
  role: z.enum(["student", "teacher"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      role: "student",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/register", data);
      const user = await response.json();
      
      login(user);
      toast({
        title: "Registrering lyckades",
        description: `Välkommen till LäraSmart, ${user.fullName}!`,
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registrering misslyckades",
        description: error.message || "Kunde inte skapa konto. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Skapa ett konto</CardTitle>
        <CardDescription className="text-center">
          Gå med i LäraSmart och börja din inlärningsresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fullständigt namn</FormLabel>
                  <FormControl>
                    <Input placeholder="Ange ditt fullständiga namn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Användarnamn</FormLabel>
                  <FormControl>
                    <Input placeholder="Välj ett användarnamn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Ange din e-postadress" {...field} />
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
                  <FormLabel>Lösenord</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Skapa ett lösenord"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jag vill</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj din roll" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.STUDENT}>Lära mig nya färdigheter</SelectItem>
                      <SelectItem value={UserRole.TEACHER}>Lära andra</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Skapar konto..." : "Skapa konto"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Har du redan ett konto?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
            Logga in
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
