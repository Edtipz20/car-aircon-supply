"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProfileForm from "./profile-form";

const EditProfileDialog = ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-accent text-accent hover:bg-accent hover:text-white mt-2 cursor-pointer"
        >
          <Pencil className="h-3 w-3" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl rounded-none">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Profile</DialogTitle>
        </DialogHeader>
        <ProfileForm
          name={name}
          email={email}
          onSuccess={() => setOpen(false)}
        />
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            Need to update your shipping address?
          </p>
          <Link href="/checkout" className="text-sm text-accent font-medium">
            Edit address at checkout →
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
