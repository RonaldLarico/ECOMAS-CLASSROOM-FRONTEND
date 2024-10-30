"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function deleteQuota(id: number | undefined) {
  console.log(id);
  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value;

  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quota/graduate/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log(response);

    return response.data; // Assuming axios returns JSON by default
  } catch (error) {
    console.error("Error in deleteQuota:", error);
    throw error;
  }
}
