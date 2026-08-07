import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized Access",
};

const Unauthorized = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]">
      <h1 className="text-9xl font-bold text-accent mb-4">401</h1>
      <h1 className="text-7xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-destructive text-xl">
        You do not have permission to access to this page
      </p>
      <Button
        asChild
        className="mt-4 ml-2 px-8 py-6 text-md cursor-pointer shadow-md hover:bg-accent hover:text-white"
      >
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  );
};

export default Unauthorized;
