"use server";

import { revalidatePath } from "next/cache";

export async function createStaffUser(data: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    const responseData = responseText ? JSON.parse(responseText) : {};

    console.log(responseData);
    revalidatePath("/users");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en createStaffUser:", error.message);
    } else {
      console.error("Error desconocido", error);
    }
    throw error;
  }
}


export async function editStaffUser(formData: FormData, id: number) {
  console.log(formData);
  formData.delete("id");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/${id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const textResponse = await response.text(); // Handle plain text response
    revalidatePath(`/users`);
    return textResponse;
  } catch (error) {
    console.error("Error in editCorp:", error);
    throw error;
  }
}
