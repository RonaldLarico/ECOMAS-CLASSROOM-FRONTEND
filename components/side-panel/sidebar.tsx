import Link from "next/link";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/side-panel/menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/side-panel/sidebar-toggle";
import { useUser } from "@/context/dataUserContext";
import Image from "next/image";
import { useImageStore } from "@/hooks/corpo-img-store";
import { useEffect } from 'react';

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const { corporationImg: userCorporationImg } = useUser();
  const { corporationImg: storedImg, setCorporationImg } = useImageStore();

  useEffect(() => {
    if (userCorporationImg && !storedImg) {
      const fullImageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${userCorporationImg}`;
      setCorporationImg(fullImageUrl);
    }
  }, [userCorporationImg, storedImg, setCorporationImg]);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="" className="flex items-center gap-2">
            {storedImg && (
              <Image
                src={storedImg}
                alt="Corporation Image"
                width={200}
                height={100}
                priority
                className="w-40 h-10"
              />
            )}
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}