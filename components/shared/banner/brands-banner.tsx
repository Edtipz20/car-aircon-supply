"use client";

const brands = [
  { name: "CHEVROLET", src: "/brands/chevrolet.png" },
  { name: "FORD", src: "/brands/ford.png" },
  { name: "HONDA", src: "/brands/honda.png" },
  { name: "HYUNDAI", src: "/brands/hyundai.png" },
  { name: "ISUZU", src: "/brands/isuzu.png" },
  { name: "KIA", src: "/brands/kia.png" },
  { name: "MERCEDES BENZ", src: "/brands/mercedes.png" },
  { name: "MITSUBISHI", src: "/brands/mitsubishi.png" },
  { name: "SUBARU", src: "/brands/subaru.png" },
  { name: "SUZUKI", src: "/brands/suzuki.png" },
  { name: "TOYOTA", src: "/brands/toyota.png" },
  { name: "UNIVERSAL", src: "/brands/universal.png" },
];

export function BrandsBanner() {
  return (
    <div className="bg-accent py-4 sm:py-12 my-10 overflow-hidden">
      <div className="flex w-max animate-marquee hover:paused">
        {/* Render twice for seamless loop */}
        {[...brands, ...brands].map(({ name }, index) => (
          <div
            key={`${name}-${index}`}
            className="flex items-center mx-10 opacity-40 grayscale hover:opacity-70 hover:grayscale-0 transition-all duration-300 shrink-0"
          >
            {/* <Image
              src={src}
              alt={name}
              width={120}
              height={48}
              className="object-contain h-10 w-auto"
            /> */}
            <p className="text-sm font-bold sm:text-2xl">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
