"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ModeToggle } from "@/components/themeChange";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import GetToken from "@/components/loginPage/getToken";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .nonempty("Contraseña requerida"),
    confirmPassword: z.string().nonempty("Confirmar contraseña requerida"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const NewPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        router.push("/");
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [success, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      setError("Token no válido");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (!API_BASE_URL) {
        throw new Error("API_BASE_URL no está definida");
      }

      const dataToSend = {
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/reset/password?token=${token}`,
        dataToSend
      );

      if (response.status === 200) {
        setSuccess(true);
      } else {
        setError("Error al restablecer la contraseña");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Error al restablecer la contraseña"
        );
      } else {
        setError("Error inesperado al restablecer la contraseña");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GetToken onToken={setToken} />
      <main className="flex h-screen flex-col items-center justify-center p-0 md:p-20 dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative bg-gray-100 dark:bg-transparent">
        <div className="w-full h-full shadow-xl bg-white dark:bg-[#09080a] justify-center items-center flex lg:flex border-slate-300 dark:border-gray-800 md:border md:rounded-xl relative">
          <div className="w-full max-w-md space-y-6 p-10 rounded-xl">
            <div className="absolute right-5 top-5 z-20">
              <ModeToggle />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              Establece tu nueva contraseña
            </h2>
            <h2 className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Por favor, introduce y confirma tu nueva contraseña
            </h2>
            {error && (
              <div className="bg-destructive/10 flex items-center justify-center py-2 rounded">
                <CircleAlert className="size-5 text-destructive dark:text-[#FF908C] text-center mr-2" />
                <div className="text-destructive dark:text-[#FF908C] text-center">
                  {error}
                </div>
              </div>
            )}
            {success && (
              <div className="text-green-500">
                Contraseña actualizada con éxito. Redirigiendo al inicio en{" "}
                {countdown}...
              </div>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-8 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="current_password"
                          placeholder="Ingresa tu nueva contraseña"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="current_password"
                          placeholder="Confirma tu nueva contraseña"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Actualizando..." : "Actualizar Contraseña"}
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
    </Suspense>
  );
};

export default NewPassword;
