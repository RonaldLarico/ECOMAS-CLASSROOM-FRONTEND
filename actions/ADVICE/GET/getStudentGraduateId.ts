'use server'
import { StudentGraduate } from "@/lib/definitions";
import { cookies } from "next/headers";
// OBTENER DATOS DE ESTUDIANTE DE DIPLOMADO
interface FetchStudentGraduateDataParams {
  id: string,
}

export const fetchStudentGraduateData = async ({
  id,
}: FetchStudentGraduateDataParams): Promise<StudentGraduate> => {
  console.log("Fetching student with id:", id);
  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/studentGraduate/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data as StudentGraduate;
  } catch (error) {
    console.error("Error fetching student graduate data", error);
    throw error;
  }
};


