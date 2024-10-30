'use server';
import axios from 'axios';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function editQuota(formData: FormData, id: number | undefined) {
  console.log(formData, id);
  
  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value;

  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quota/graduate/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log(response.data);
    revalidatePath(`/advice-dashboard/graduate`);
    return response.data; // Assuming axios returns JSON by default
  } catch (error) {
    console.error("Error in editQuota:", error);
    throw error;
  }
}
