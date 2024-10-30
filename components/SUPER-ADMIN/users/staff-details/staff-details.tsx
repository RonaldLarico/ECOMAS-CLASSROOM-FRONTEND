"use client"; // Ensure this component runs on the client side

import React, { useEffect, useState } from "react";
import { User } from "@/lib/definitions";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfo from "./personal-info";
import { UserInfoTableSkeleton } from "@/components/skeletons/userTable/skeletonUserInfoTable";
import { fetchUserData } from "@/actions/USERSTAFF/getUserById";
import LiquidationDoc from "./access-info";

export default function UserDetails({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null); // User state
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch user data when the component mounts or userId changes
  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const userData = await fetchUserData(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [userId]);

  if (loading) {
    return <UserInfoTableSkeleton />; // Use your skeleton loading component
  }

  if (error) {
    return (
      <Card className="mt-4">
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">{user?.staff?.fullName}</h2>
          {/* <EditParticipantModal user={user} /> */}
        </div>
        <Tabs defaultValue="personalInfo">
          <TabsList>
            <TabsTrigger value="personalInfo">Información personal</TabsTrigger>
            <TabsTrigger value="liquidation">Liquidación</TabsTrigger>
          </TabsList>

          <TabsContent value="personalInfo">
            <PersonalInfo user={user} />
          </TabsContent>

          <TabsContent value="liquidation">
            <LiquidationDoc user={user} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
