import React from "react";
import { User } from "@/lib/definitions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

function LiquidationDoc({ user }: { user: User | null }) {
  if (!user) {
    return <p>No user data available.</p>; // Handle null case
  }

  const openPdf = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
    {/* Archivo Liquidación */}
    <div className="grid grid-cols-1 gap-1.5">
      <Label htmlFor="liquidation">Archivo liquidación</Label>
      <div className="relative">
        <Input
          readOnly
          value={user?.staff?.liquidation?.split("/").pop() ?? ""}
          className="pr-10"
        />
        <Button
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
          variant="ghost"
          onClick={() =>
            openPdf(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}${user?.staff?.liquidation}`
            )
          }
        >
          <Eye />
        </Button>
      </div>
    </div>
    </div>

  );
}

export default LiquidationDoc;
