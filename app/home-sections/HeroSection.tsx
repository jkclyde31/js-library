"use client";

import { usePathname } from "next/navigation";
import Hero from "@/components/Hero";

export default function HeroContainer() {
  const pathname = usePathname();
  
  return (
    pathname === '/' ? (
      <div className="relative w-full min-h-[500px] bg-cover bg-center flex justify-center items-end pb-16"
          style={{ backgroundImage: "url('/images/banner.jpg')" }}>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0.1)_100%)]" />
          
          {/* Hero content */}
          <div className="relative z-10 h-full">
              <div className="mx-auto max-w-[1200px] w-full h-full">
                <Hero />
              </div>
          </div>
      </div>
    ) : (
      <div className="py-[70px]">
        
      </div>
    )
  );
}