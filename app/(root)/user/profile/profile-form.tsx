"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { updateProfileSchema, UpdateProfile } from "@/lib/validators";
import { updateUserProfile } from "@/lib/actions/user.action";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const ProfileForm = ({
  name,
  email,
  onSuccess,
}: {
  name: string;
  email: string;
  onSuccess?: () => void;
}) => {
  const { update } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data: UpdateProfile) => {
    startTransition(async () => {
      const res = await updateUserProfile(data);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      await update({ name: data.name });

      toast.success(res.message);
      form.reset({
        name: data.name,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      router.refresh();
      onSuccess?.(); // close the dialog if this form is rendered inside one
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="w-full flex gap-4">
        <div className="flex-1 space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} className="h-12" />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <Label>Email</Label>
          <Input
            value={email}
            disabled
            className="h-12 bg-muted text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">
            Email changes aren&apos;t supported yet
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-border" />

      <div className="space-y-1">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          {...form.register("currentPassword")}
          className="h-12"
        />
        {form.formState.errors.currentPassword && (
          <p className="text-xs text-destructive">
            {form.formState.errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="newPassword">New Password (optional)</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...form.register("newPassword")}
          className="h-12"
        />
        {form.formState.errors.newPassword && (
          <p className="text-xs text-destructive">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
        <Input
          id="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          {...form.register("confirmNewPassword")}
          className="h-12"
        />
        {form.formState.errors.confirmNewPassword && (
          <p className="text-xs text-destructive">
            {form.formState.errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 bg-accent hover:text-white cursor-pointer text-white mt-4"
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
};

export default ProfileForm;
