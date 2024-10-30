"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "../ui/password-input";
import { useState } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/Authcontext";

const formSchema = z.object({
  documentNumber: z.string().min(1, {
    message: "Por favor ingresa el nombre de usuario",
  }),
  password: z.string().min(1, {
    message: "Por favor ingresa la contraseña",
  }),
});

export function MyForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentNumber: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const errorMessage = await login(values.documentNumber, values.password);
      if (errorMessage) {
        setError(errorMessage);
      }
    } catch (error) {
      setError("Error inesperado al iniciar sesión");
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full"
      >
        {error && (
          <div className="bg-destructive/10 flex items-center justify-center py-2 rounded">
            <CircleAlert className="size-5 text-destructive dark:text-[#FF908C] text-center mr-2"/>
            <div className="text-destructive dark:text-[#FF908C] text-center">{error}</div>
          </div>
        )}
        <FormField
          control={form.control}
          name="documentNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa tu nombre de usuario" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <PasswordInput
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button variant="ghost" className="" asChild>
            <Link href="/ForgotPassword">¿Olvidaste tu contraseña?</Link>
          </Button>
        </div>
        <Button disabled={loading} type="submit" className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>
    </Form>
  );
}