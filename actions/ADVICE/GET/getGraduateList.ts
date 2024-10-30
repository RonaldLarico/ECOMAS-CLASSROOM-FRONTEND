import { Graduate } from "@/lib/definitions";
import { cookies } from "next/headers";
interface FetchGraduatesParams {
  offset: number;
  limit: number;
  search?: string;
}

export const fetchGraduateList = async ({
  offset,
  limit,
  search,
}: FetchGraduatesParams): Promise<Graduate[]> => {

  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value;
  console.log("Auth token:", authToken);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/graduate/corporation/search/?limit=${limit}&offset=${offset}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Error response:", errorBody);
  }

  const data = await response.json();
  console.log("Fetched graduates data:", data);

  if (!Array.isArray(data)) {
    console.error("Unexpected data format:", data);
    throw new Error("Received data is not an array of graduates");
  }

  return data as Graduate[];
};
