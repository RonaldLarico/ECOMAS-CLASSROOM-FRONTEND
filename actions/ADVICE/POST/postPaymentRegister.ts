// createPaymentRegister.ts
"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { DuplicatePayment } from "@/lib/definitions";

interface PaymentData {
  nameBank: string;
  amount?: number;
  numberOperation?: string;
  date: Date;
  hour?: string;
  quotaGraduateId: number;
}

interface DuplicateError {
  message: string;
  duplicateDetails: DuplicatePayment[];
}

export async function createPaymentRegister(data: PaymentData) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value;

  if (!authToken) {
    throw new Error("No se encontró el token de autorización");
  }

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payment/register/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as DuplicateError;
      
      if (errorData?.duplicateDetails) {
        // Return a structured error object
        return {
          error: true,
          message: errorData.message || "Se detectaron pagos duplicados",
          duplicateDetails: errorData.duplicateDetails,
          type: "DUPLICATE_PAYMENT"
        };
      }
      
      return {
        error: true,
        message: errorData?.message || "Error al procesar el pago",
        type: "PAYMENT_ERROR"
      };
    }
    
    return {
      error: true,
      message: "Error desconocido al guardar la cuota",
      type: "UNKNOWN_ERROR"
    };
  }
}