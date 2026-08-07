"use client";

import Logo from "@/components/shared/header/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Logo className="hidden lg:flex mb-12" width={80} height={80} />
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-4">Page Not Found</h1>
        <p className="text-destructive text-xl">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <Button
          variant="outline"
          className="mt-4 ml-2 px-8 py-6 text-md cursor-pointer shadow-md hover:bg-accent hover:text-white"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft /> Back To Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
