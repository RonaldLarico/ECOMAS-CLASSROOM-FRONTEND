import { User } from "@/lib/definitions";
export async function fetchUserData(id: string): Promise<User> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/${id}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.statusText}`);
  }

  const user = await response.json();
  console.log(user);
  return user;
}
