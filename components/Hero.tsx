"use client";

import { format } from "date-fns";

interface HeroProps {
  currentDate: Date;
  heroImage: string;
  primary: string;
  onPrimary: string;
}

export default function Hero({ currentDate, heroImage, primary, onPrimary }: HeroProps) {
  return (
    <section className="relative h-[300px] md:h-[450px] overflow-hidden rounded-b-xl shadow-lg">
      <img
        alt="Month hero"
        className="w-full h-full object-cover"
        src={heroImage}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent flex items-center px-8 md:px-16">
        <div
          className="px-8 py-10 md:px-12 md:py-16 transform -rotate-2 shadow-2xl"
          style={{ backgroundColor: primary }}
        >
          <h1
            className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-none"
            style={{ color: onPrimary }}
          >
            {format(currentDate, "yyyy")}
            <br />
            {format(currentDate, "MMMM").toUpperCase()}
          </h1>
        </div>
      </div>
    </section>
  );
}
