import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchStudentGraduateData } from "@/actions/ADVICE/GET/getStudentGraduateId";
import { AdviceGraduateSkeleton } from "@/components/skeletons/advice/skeletonGraduate";
import EditParticipantModal from "../editParticpantGraduate/edit-participant-modal";
import { StudentGraduate } from "@/lib/definitions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ParticipantPrimaryInfo from "./personal-info/personal-info-participant";
import ParticipantFinancialInfo from "./financial-info/finance-info-participant";
import ParticipantAccessInfo from "./access-info/access-info-participant";
import ParticipantCertificateGraduateInfo from "./certificate-info/certificate-info-participant";

interface ParticipantDetailsProps {
  studentId: string;
  graduatePrice: number;
}

export default function ParticipantDetails({
  studentId,
  graduatePrice,
}: ParticipantDetailsProps) {
  const [graduateStudent, setGraduateStudent] =
    useState<StudentGraduate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch data
  const fetchData = async () => {
    if (studentId) {
      setLoading(true); // Set loading state when fetching data
      try {
        const data = await fetchStudentGraduateData({ id: studentId });
        setGraduateStudent(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch data on component mount and when studentId changes
  useEffect(() => {
    fetchData();
  }, [studentId]);

  // Function to handle participant data updates
  const handleParticipantUpdate = async (updatedData: StudentGraduate) => {
    // Option 1: Update state directly with the new data from the modal
    setGraduateStudent(updatedData);

    // Option 2: Refetch data from the server to get the most up-to-date data
    await fetchData(); // This ensures the most accurate data is fetched again
  };

  if (loading) {
    return <AdviceGraduateSkeleton />;
  }

  if (!graduateStudent) {
    return (
      <div>
        No hay datos disponibles para este participante. Recargue la página.
      </div>
    );
  }

  const totalPrice = graduateStudent.graduate?.[0]?.graduate.totalPrice ?? 0;

  return (
    <Card className="mt-4">
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">{graduateStudent.fullName}</h2>
          {/* Pass the update handler to EditParticipantModal */}
          <EditParticipantModal
            participantData={graduateStudent as any}
            onParticipantUpdate={handleParticipantUpdate} // Callback for updates
          />
        </div>
        <Tabs defaultValue="personalInfo">
          <TabsList>
            <TabsTrigger value="personalInfo">Información personal</TabsTrigger>
            <TabsTrigger value="personalFinance">
              Información financiera
            </TabsTrigger>
            <TabsTrigger value="access">Credenciales de acceso</TabsTrigger>
            <TabsTrigger value="certificates">Certificados</TabsTrigger>
            <TabsTrigger value="status">Estado diploma</TabsTrigger>
          </TabsList>
          <TabsContent value="personalInfo">
            <ParticipantPrimaryInfo participant={graduateStudent} />
          </TabsContent>
          <TabsContent value="personalFinance">
            <ParticipantFinancialInfo
              participant={graduateStudent}
              totalPrice={totalPrice}
              onUpdate={fetchData} // Pass the fetchData function
            />
          </TabsContent>
          <TabsContent value="access">
            <ParticipantAccessInfo participant={graduateStudent} onUpdate={fetchData}/>
          </TabsContent>
          <TabsContent value="certificates">
            <ParticipantCertificateGraduateInfo participant={graduateStudent}/>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
