"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ModeToggle } from "@/components/themeChange";
import { CircleAlert } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido",
  }),
});

export default function RequestPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!API_BASE_URL) {
        throw new Error("La URL de la API no está configurada");
      }
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/request/password`,
        values
      );
      setSuccess(
        "Correo enviado exitosamente. Por favor revisa tu bandeja de entrada."
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Error al enviar el correo");
      } else {
        setError("Error inesperado al enviar el correo");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-svh md:h-screen flex-col items-center justify-center p-0 md:p-20 dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative bg-gray-100 dark:bg-transparent">
      <div className="w-full px-4 h-full shadow-xl bg-white dark:bg-[#09080a] items-center flex lg:flex border-slate-300 dark:border-gray-800 md:border md:rounded-xl relative">
        <div className="mx-auto w-full max-w-md space-y-8">
        <div className="absolute right-5 top-5 z-20">
          <ModeToggle />
        </div>
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Ingresa el email asociado a la cuenta y te enviaremos un enlace
              para restablecer tu contraseña.
            </p>
          </div>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              action="#"
              method="POST"
            >
              {error && <div className="bg-destructive/10 flex items-center justify-center py-2 rounded"><CircleAlert className="size-5 text-destructive dark:text-[#FF908C] text-center mr-2"/><div className="text-destructive dark:text-[#FF908C] text-center">{error}</div></div>}
              {success && <div className="text-green-500 text-center">Correo enviado exitosamente. Por favor revisa tu bandeja de entrada.</div>}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingresa tu correo electrónico"
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Restablecer contraseña"}
              </Button>
            </form>
          </Form>
          <div className="flex justify-center">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              prefetch={false}
            >
              Volver a inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
