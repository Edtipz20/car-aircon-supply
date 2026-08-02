"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import RegionSelect from "@/components/shared/region-select";
import CitySelect from "@/components/shared/city-select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader, Truck } from "lucide-react";
import { shippingAddressSchema, ShippingAddress } from "@/lib/validators";
import {
  updateUserAddress,
  updateUserPaymentMethod,
} from "@/lib/actions/user.action";
import { toast } from "sonner";
import BarangaySelect from "@/components/shared/barangay-select";

type Cart = {
  items: {
    productId: string;
    name: string;
    slug: string;
    image: string;
    price: string;
    qty: number;
  }[];
  itemsPrice: string;
  shippingPrice: string;
  totalPrice: string;
};

const CheckoutForm = ({
  cart,
  userEmail,
  existingAddress,
}: {
  cart: Cart;
  userEmail: string;
  existingAddress?: ShippingAddress;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [provinceCode, setProvinceCode] = useState("");
  const [cityCode, setCityCode] = useState("");

  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: existingAddress || {
      fullName: "",
      mobileNumber: "",
      streetAddress: "",
      apartment: "",
      barangay: "",
      city: "",
      postalCode: "",
      region: "",
      country: "Philippines",
    },
  });

  const onSubmit = (data: ShippingAddress) => {
    startTransition(async () => {
      const addressRes = await updateUserAddress(data);
      if (!addressRes.success) {
        toast.error(addressRes.message);
        return;
      }

      const paymentRes = await updateUserPaymentMethod("CashOnDelivery");
      if (!paymentRes.success) {
        toast.error(paymentRes.message);
        return;
      }

      router.push("/place-order");
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Left — form */}
      <div className="px-6 md:px-16 py-10 max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <span className="font-heading">{userEmail}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <Checkbox id="news" />
          <Label htmlFor="news" className="text-sm font-normal">
            Email me with news and offers
          </Label>
        </div>

        <h2 className="font-bold text-2xl mb-4">Delivery</h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="fullName" className="text-xs text-muted-foreground">
              Full name
            </Label>
            <Input
              id="fullName"
              {...form.register("fullName")}
              className="h-14 focus-visible:ring focus-visible:ring-accent focus-visible:border-none"
            />
            {form.formState.errors.fullName && (
              <p className="text-xs text-destructive">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>
          {/* Mobile number */}
          <div className="space-y-1">
            <Label
              htmlFor="mobileNumber"
              className="text-xs text-muted-foreground"
            >
              Mobile number
            </Label>
            <Input
              id="mobileNumber"
              placeholder="09XXXXXXXXX"
              {...form.register("mobileNumber")}
              className="h-14"
            />
            {form.formState.errors.mobileNumber && (
              <p className="text-xs text-destructive">
                {form.formState.errors.mobileNumber.message}
              </p>
            )}
          </div>
          {/* Address */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Region</Label>
            <Controller
              name="region"
              control={form.control}
              render={({ field }) => (
                <RegionSelect
                  value={field.value}
                  onChange={(name, code) => {
                    field.onChange(name);
                    setProvinceCode(code);
                    setCityCode("");
                    form.setValue("city", "");
                    form.setValue("barangay", "");
                  }}
                />
              )}
            />
            {form.formState.errors.region && (
              <p className="text-xs text-destructive">
                {form.formState.errors.region.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">City</Label>
              <Controller
                name="city"
                control={form.control}
                render={({ field }) => (
                  <CitySelect
                    provinceCode={provinceCode}
                    value={field.value}
                    onChange={(name, code) => {
                      field.onChange(name);
                      setCityCode(code);
                      form.setValue("barangay", "");
                    }}
                  />
                )}
              />
              {form.formState.errors.city && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Barangay</Label>
              <Controller
                name="barangay"
                control={form.control}
                render={({ field }) => (
                  <BarangaySelect
                    cityCode={cityCode}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {form.formState.errors.barangay && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.barangay.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="postalCode"
                className="text-xs text-muted-foreground"
              >
                Postal code
              </Label>
              <Input
                id="postalCode"
                {...form.register("postalCode")}
                className="h-14 focus-visible:ring focus-visible:ring-accent focus-visible:border-none"
              />
              {form.formState.errors.postalCode && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.postalCode.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="apartment"
                className="text-xs text-muted-foreground"
              >
                Apartment, suite, etc. (optional)
              </Label>
              <Input
                id="apartment"
                {...form.register("apartment")}
                className="h-14 focus-visible:ring focus-visible:ring-accent focus-visible:border-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="streetAddress"
              className="text-xs text-muted-foreground"
            >
              Address
            </Label>
            <Input
              id="streetAddress"
              {...form.register("streetAddress")}
              placeholder="Street Name, Building, Drive"
              className="h-14 focus-visible:ring focus-visible:ring-accent focus-visible:border-none"
            />
            {form.formState.errors.streetAddress && (
              <p className="text-xs text-destructive">
                {form.formState.errors.streetAddress.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <h2 className="font-bold text-lg mb-3">Payment</h2>
            <div className="border-2 border-accent bg-accent/5 rounded-lg p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold">Cash on Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Pay in cash when your order arrives
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-14 bg-accent hover:bg-accent-dark text-lg text-white mt-6"
          >
            {isPending ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Continue to Review"
            )}
          </Button>
        </form>
      </div>

      {/* Right — order summary */}
      <div className="bg-muted/40 px-6 md:px-16 py-10">
        <div className="max-h-100 overflow-y-auto space-y-4 pr-2">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="rounded border bg-white object-cover"
                />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {item.qty}
                </span>
              </div>
              <span className="flex-1 text-sm">{item.name}</span>
              <span className="text-sm">${Number(item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-6 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Subtotal · {cart.items.reduce((acc, i) => acc + i.qty, 0)} items
            </span>
            <span>${Number(cart.itemsPrice).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>
              {Number(cart.shippingPrice) === 0
                ? "Free"
                : `$${Number(cart.shippingPrice).toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-border">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg">
              <span className="text-xs text-muted-foreground font-normal mr-1">
                USD
              </span>
              ${Number(cart.totalPrice).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
