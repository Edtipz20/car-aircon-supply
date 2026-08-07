"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import {
  markOrderAsPaid,
  markOrderAsDelivered,
} from "@/lib/actions/order.action";
import { toast } from "sonner";

const OrderActions = ({
  orderId,
  isPaid,
  isDelivered,
}: {
  orderId: string;
  isPaid: boolean;
  isDelivered: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleMarkPaid = () => {
    startTransition(async () => {
      const res = await markOrderAsPaid(orderId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.refresh();
    });
  };

  const handleMarkDelivered = () => {
    startTransition(async () => {
      const res = await markOrderAsDelivered(orderId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.refresh();
    });
  };

  return (
    <div className="flex gap-3">
      {!isPaid && (
        <Button
          onClick={handleMarkPaid}
          disabled={isPending}
          className="bg-accent hover:bg-accent-dark text-white cursor-pointer"
        >
          {isPending ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            "Mark as Paid"
          )}
        </Button>
      )}
      {isPaid && !isDelivered && (
        <Button
          onClick={handleMarkDelivered}
          disabled={isPending}
          className="bg-primary hover:bg-primary/90 text-white cursor-pointer"
        >
          {isPending ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            "Mark as Delivered"
          )}
        </Button>
      )}
    </div>
  );
};

export default OrderActions;
