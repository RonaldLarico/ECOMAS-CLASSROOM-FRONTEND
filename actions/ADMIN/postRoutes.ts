import { revalidatePath } from "next/cache";

export const createGraduate = async (data: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/graduate`,
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
    const res = await response.text();
    const responseData = res ? JSON.parse(res) : {};
    console.log(responseData);
    //revalidatePath("/users");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en createStaffUser:", error.message);
    } else {
      console.error("Error desconocido", error);
    }
    throw error;
  }
};

export const createModule = async (data: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/module`,
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
    const res = await response.text();
    const responseData = res ? JSON.parse(res) : {};
    console.log(responseData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en createStaffUser:", error.message);
    } else {
      console.error("Error desconocido", error);
    }
    throw error;
  }
};
