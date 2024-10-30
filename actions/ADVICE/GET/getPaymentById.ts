'use server'
import { PaymentRegister } from "@/lib/definitions";
import { cookies } from "next/headers";

interface FetchPaymentRegistered {
  id: number;
}

export const fetchPaymentRegistered = async ({
  id,
}: FetchPaymentRegistered): Promise<PaymentRegister | string> => {
  console.log("Fetching payment register with id:", id);
  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payment/register/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Error response:", errorBody);
    try {
      const errorJson = JSON.parse(errorBody);
      return `${errorJson.errorContent}`;
    } catch (e) {
      return `${errorBody}`;
    }
  }

  const data = await response.json();
  console.log("Fetched payment data:", data);

  if (!data || typeof data !== 'object') {
    console.error("Unexpected data format:", data);
    throw new Error("The data is not a valid payment register");
  }

  return data as PaymentRegister;
};
