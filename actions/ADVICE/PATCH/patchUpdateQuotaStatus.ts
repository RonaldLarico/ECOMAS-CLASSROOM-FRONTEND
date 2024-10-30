"use server";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateStatusQuotaGraduate(
  state: boolean,
  id: number | undefined
) {
  console.log("update status quota", state, id);
  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value;
 
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quota/graduate/state/${id}`,
      { state: state },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log(response);
    revalidatePath(`/advice-dashboard/graduate`);
    return response.data; // Assuming axios returns JSON by default
  } catch (error) {
    console.error("Error in updateStatus quota:", error);
    throw error;
  }
}
