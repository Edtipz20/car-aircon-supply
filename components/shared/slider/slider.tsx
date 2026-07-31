"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../../ui/button";
import Image, { StaticImageData } from "next/image";
import Image1 from "@/public/product-images/slide-image.png";
import Image2 from "@/public/product-images/slide-image2.png";

type Slide = {
  subTitle: string;
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
};

const slides: Slide[] = [
  {
    subTitle: "Welcome to our shop",
    title: "Original High Quality AC Compressor",
    description:
      "Keep your vehicle's cabin cool and comfortable with our Original High Quality AC Compressor. Built to OEM specifications, it ensures reliable performance, optimal cooling efficiency, and a long-lasting fit for your specific car model.",
    image: Image1,
    imageAlt: "Set of tires",
  },
  {
    subTitle: "Welcome to our shop",
    title: "Built To Last Performance",
    description:
      "Our parts are engineered with premium materials to withstand the toughest road conditions and daily wear. Every component is rigorously tested to deliver consistent, long-lasting performance you can depend on mile after mile.",
    image: Image2,
    imageAlt: "Shock absorber",
  },
];

const autoplay = Autoplay({ delay: 3000, stopOnInteraction: true });

export function Slider() {
  return (
    <Carousel
      plugins={[autoplay]}
      className="w-full bg-accent"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.reset()}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center px-6 py-16 lg:py-16 max-w-7xl mx-auto">
              {/* Text */}
              <div className="space-y-5 px-5">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                  {slide.subTitle}
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                  {slide.title}
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {slide.description}
                </p>
                <Button className="rounded-none py-6 md:py-8 px-10 font-bold tracking-wider">
                  SHOP NOW
                </Button>
              </div>

              {/* Image */}
              <div className="flex justify-center px-5">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={600}
                  height={600}
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious
        className="hidden sm:block left-2 lg:left-12 rounded-none hover:bg-primary hover:text-secondary"
        size="xxl"
      />
      <CarouselNext
        className="hidden sm:block right-2 lg:right-12 rounded-none hover:bg-primary hover:text-secondary"
        size="xxl"
      />
    </Carousel>
  );
}
