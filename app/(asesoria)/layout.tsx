import AdminPanelLayout from "@/components/side-panel/admin-panel-layout";

export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
