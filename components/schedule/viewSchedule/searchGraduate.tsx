"use client";
import { Input } from "@/components/ui/input";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const SearchGraduate = ({ placeholder, totalGraduates }: { placeholder: string, totalGraduates: number}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [noResults, setNoResults] = useState(false);

  const handleSearch = useDebouncedCallback(async (term: string) => {
    console.log(`Searching...${term}`);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 600);

  useEffect(() => {
    setNoResults(totalGraduates === 0);
  }, [totalGraduates]);

  return (
    <ToastProvider>
      <div className="space-y-0">
        <Input
          className="w-[300px] max-w-96"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
        />
        {noResults && (
          <Toast className="bg-red-500 text-white" duration={3000}>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="mr-2" />
                No hay resultados para la búsqueda.
            </div>
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};
export default SearchGraduate;
