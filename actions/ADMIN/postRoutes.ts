import { GraduateForm } from "@/components/schedule/createSchedule/createGraduate";
import { revalidatePath } from "next/cache";

export const createGraduate = async (data: GraduateForm) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/graduate`;
    console.log("URL de la API:", url);
    console.log("Enviando datos a la API:", data);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Verificar estado de la respuesta
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta: ${errorText}`);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    // Analizar la respuesta en caso de éxito
    const res = await response.text();
    const responseData = res ? JSON.parse(res) : {};
    console.log("Respuesta exitosa de la API:", responseData);
    return responseData;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en createGraduate:", error.message);
    } else {
      console.error("Error desconocido en createGraduate", error);
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
