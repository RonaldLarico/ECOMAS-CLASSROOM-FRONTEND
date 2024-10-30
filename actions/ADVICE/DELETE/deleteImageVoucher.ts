"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function deleteImageVoucher(id: number | undefined, name: string) {
  console.log(id, name);
  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value;

  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quota/graduate/remove/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: { voucherRemove: name }, // Add the name variable to the request body
      }
    );
    console.log(response);

    return response.data?.message; // Assuming axios returns JSON by default
  } catch (error) {
    console.error("Error in deleteQuota:", error);
    throw error;
  }
}
