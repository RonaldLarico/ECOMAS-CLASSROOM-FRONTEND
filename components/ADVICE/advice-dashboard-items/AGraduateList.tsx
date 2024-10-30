import { ScrollArea } from "@/components/ui/scroll-area";
import GraduateCard from "./A2graduate-copy-Card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchGraduateList } from "@/actions/ADVICE/GET/getGraduateList";
export default async function GraduateList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const limit = 8;
  const offset = (currentPage - 1) * limit;
  const graduates = await fetchGraduateList({
    offset: offset,
    limit: limit,
    search: query,
  });

  if (!graduates) {
    return <div>Not found</div>;
  }

  const error = "";

  return (
    <ScrollArea className="h-[calc(100vh-260px)] w-full overflow-y-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col items-center gap-3">
        {graduates.map((graduate, index) => (
          <GraduateCard key={index} graduate={graduate} />
        ))}
      </div>
    </ScrollArea>
  );
};
