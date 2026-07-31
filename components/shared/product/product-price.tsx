import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const stringValue = value.toFixed(2);
  const [int, float] = stringValue.split(".");
  const intValue = parseInt(int).toLocaleString("en-US");

  return (
    <span
      className={cn("text-sm sm:text-xl text-primary font-mono", className)}
    >
      <span className="text-accent">&#8369;</span>
      <span className="font-semibold text-accent">
        {intValue}.{float}
      </span>
    </span>
  );
};

export default ProductPrice;
