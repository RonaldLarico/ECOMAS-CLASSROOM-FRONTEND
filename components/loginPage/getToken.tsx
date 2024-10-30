"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

const GetToken: React.FC<{ onToken: (token: string | null) => void }> = ({ onToken }) => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  React.useEffect(() => {
    onToken(token);
  }, [token, onToken]);

  return null;
};

export default GetToken;