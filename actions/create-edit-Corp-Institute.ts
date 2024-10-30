"use server";

import { revalidatePath } from "next/cache";
import axios from "axios";

export async function createCorp(formData: FormData) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/corporation`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data);

    // Ensure this is executed only after a successful response
    revalidatePath("/corporations");

    return response.data;
  } catch (error: unknown) {
    console.error("Error creating corporation:", error);

    let errorMessage = "An unknown error occurred";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(`Failed to create corporation: ${errorMessage}`);
  }
}

export async function editCorp(formData: FormData, id: number) {
  console.log(formData);
  formData.delete("id");
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/corporation/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data);

    // Ensure this is executed only after a successful response
    revalidatePath("/corporations");

    return response.data;
  } catch (error: unknown) {
    console.error("Error creating corporation:", error);

    let errorMessage = "An unknown error occurred";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(`Failed to create corporation: ${errorMessage}`);
  }
}

export async function createInstitute(formData: FormData) {
  try {
    console.log(formData);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/institute`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data);

    // Ensure this is executed only after a successful response
    revalidatePath("/corporations");

    return response.data;
  } catch (error: unknown) {
    console.error("Error creating institute:", error);

    let errorMessage = "An unknown error occurred";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(`Failed to create institute: ${errorMessage}`);
  }
}

export async function editInstitute(formData: FormData, id: number) {
  console.log(formData);
  formData.delete("id");
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/updateInstitute/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data);

    // Ensure this is executed only after a successful response
    revalidatePath("/corporations");

    return response.data;
  } catch (error: unknown) {
    console.error("Error creating institute:", error);

    let errorMessage = "An unknown error occurred";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(`Failed to create institute: ${errorMessage}`);
  }
}
