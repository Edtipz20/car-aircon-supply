import Image from "next/image";

const badges = [
  { src: "/badges/quality-guaranteed.png", alt: "100% Quality Guaranteed" },
  { src: "/badges/free-shipping.png", alt: "Free Shipping" },
  { src: "/badges/cod.png", alt: "Cash on Delivery" },
];

const ShippingBadges = () => {
  return (
    <div className="flex items-center mx-auto gap-6">
      {badges.map((badge) => (
        <Image
          key={badge.src}
          src={badge.src}
          alt={badge.alt}
          width={60}
          height={60}
          className="h-auto w-auto"
        />
      ))}
    </div>
  );
};

export default ShippingBadges;
