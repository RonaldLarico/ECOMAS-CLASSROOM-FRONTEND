"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
export async function addParticipant(data: FormData, graduateId: number) {
  console.log(data);
  // Accede a las cookies en el servidor
  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value; // Obtén el token de autorización

  if (!authToken) {
    throw new Error("No se encontró el token de autorización");
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/studentGraduate/${graduateId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error("Error al guardar el participante");
  }

  console.log(res);
  const participantData = await res.json();

  return participantData[0]; // Devuelve los datos del participante
}
