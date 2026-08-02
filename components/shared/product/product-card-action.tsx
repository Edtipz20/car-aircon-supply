import { Eye, ShoppingCart, Heart } from "lucide-react";

const actions = [
  { icon: Eye, label: "Quick View" },
  { icon: ShoppingCart, label: "Add to Cart" },
  { icon: Heart, label: "Wishlist" },
];

const ProductCardAction = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pt-16">
      <div className="flex items-center bg-white shadow-lg divide-x divide-gray-200">
        {actions.map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={label}
            className="p-3 hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <Icon className="w-4 h-4" strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductCardAction;
