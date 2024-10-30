"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function updateStatusStudentGraduate(
  state: boolean,
  id: number | undefined
) {
  console.log("update password", state, id);
  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value;

  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/studentGraduate/${id}`,
      { state },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log(response);

    return response.data; // Assuming axios returns JSON by default
  } catch (error) {
    console.error("Error in updatePassword:", error);
    throw error;
  }
}
