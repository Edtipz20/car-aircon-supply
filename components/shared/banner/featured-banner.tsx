import { Truck, BadgeCheck, RefreshCw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free home delivery",
    description: "Provide free home delivery for all products over $100",
  },
  {
    icon: BadgeCheck,
    title: "Quality Products",
    description: "We ensure the product quality that is our main goal",
  },
  {
    icon: RefreshCw,
    title: "7 Days Return",
    description: "Return product within 3 days for any product you buy",
  },
  {
    icon: Headphones,
    title: "Online Support",
    description: "We ensure the product quality that you can trust easily",
  },
];

export function FeatureBanner() {
  return (
    <div className="mx-5 md:mx-10 shadow-2xl px-2 md:px-6 py-8 my-10">
      <div className="grid grid-cols-2 md:grid-cols-4 space-y-3 md:space-y-0 md:divide-x divide-border">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-4 md:px-6 ">
            <Icon
              className="w-8 h-8 mt-1 shrink-0 text-muted-foreground"
              strokeWidth={1.5}
            />
            <div className="space-y-1">
              <p className="font-bold text-sm">{title}</p>
              <p className="text-sm text-muted-foreground leading-snug">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
