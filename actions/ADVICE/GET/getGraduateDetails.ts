import { Graduate } from "@/lib/definitions";
import { cookies } from "next/headers";
interface FetchGraduateDataParams {
  id: string;
}

export const fetchGraduateData = async ({
  id,
}: FetchGraduateDataParams): Promise<any | null> => {
  console.log("Fetching graduate with id:", id);
    
  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value;
  console.log("Auth token:", authToken);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/graduate/${id}/corporation/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching graduate data", error);
    return null;
  }
};
