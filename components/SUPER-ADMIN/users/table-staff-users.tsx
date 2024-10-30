import React from "react";
import { User } from "@/lib/definitions";
import TableBodyClient from "./table-staff-details";

export default async function TableStaffUser() {
  let users: User[] = [];
  let error: string | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    try {
      users = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      throw new Error("Invalid JSON response from server");
    }
  } catch (e) {
    console.error("An error occurred:", e);
    error = e instanceof Error ? e.message : String(e);
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* Renderiza el TableBody desde el componente cliente */}
      <TableBodyClient users={users} />
    </>
  );
}
