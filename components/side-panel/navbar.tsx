"use client";
import { ModeToggle } from "@/components/themeChange";
import { UserNav } from "@/components/side-panel/user-nav";
import { SheetMenu } from "@/components/side-panel/sheet-menu";
import { useUser } from "@/context/dataUserContext";
import { NavNotification } from "@/components/Notifications/nav-notification";
interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const userName = useUser().userName;

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">
            {userName ? `Hola ${userName}` : "Bienvenido"}
          </h1>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <NavNotification />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
