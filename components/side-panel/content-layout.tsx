import { Navbar } from "@/components/side-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className=" pt-7 pb-0 px-4 sm:px-8">{children}</div>
    </div>
  );
}
