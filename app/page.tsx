"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MyForm } from "@/components/loginPage/formAuth";
import { ModeToggle } from "@/components/themeChange";

const imagesSrc = [
  "/images/UNRJFrontis.jpg",
  "/images/UNPFrontis.jpg",
  "/images/UNITFrontis.jpg",
];

export default function Home() {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <main className="flex h-svh md:h-screen flex-col items-center justify-between p-0 md:p-20 dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative bg-gray-100 dark:bg-transparent">
      <div className="w-full h-full shadow-xl bg-white dark:bg-[#09080a] items-center flex lg:flex border-slate-300 dark:border-gray-800 md:border md:rounded-xl relative">
        <div className="w-full md:w-1/2 h-full overflow-hidden md:rounded-l-xl">
          <Carousel plugins={[plugin.current]} className="w-full h-full">
            <CarouselContent className="h-full">
              {imagesSrc.map((src, index) => (
                <CarouselItem key={src} className="h-full">
                  <div className="relative w-auto h-[100vh] md:h-[85vh]">
                    <Image
                      src={src}
                      alt={`Universidad ${index + 1}`}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="absolute right-5 top-5 z-20">
          <ModeToggle />
        </div>
        <div className="bg-white/75 dark:bg-black/70 md:bg-white md:dark:bg-transparent absolute inset-0 md:relative md:w-1/2 flex flex-col items-center justify-center px-5 md:px-12 lg:px-14 xl:px-16 2xl:px-56 mx-auto md:rounded-r-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center">
            AULA VIRTUAL
          </h1>
          <p className="text-center my-4">
            Por favor ingresa tus credenciales para iniciar sesión.
          </p>
          <MyForm />
        </div>
      </div>
    </main>
  );
}