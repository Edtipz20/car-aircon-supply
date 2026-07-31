import Image from "next/image";

const badges = [
  { src: "/badges/quality-guaranteed.png", alt: "100% Quality Guaranteed" },
  { src: "/badges/free-shipping.png", alt: "Free Shipping" },
];

const ShippingBadges = () => {
  return (
    <div className="flex items-center gap-6">
      {badges.map((badge) => (
        <Image
          key={badge.src}
          src={badge.src}
          alt={badge.alt}
          width={75}
          height={50}
        />
      ))}
    </div>
  );
};

export default ShippingBadges;
