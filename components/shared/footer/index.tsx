import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary py-5 px-5 sm:py-5 sm:px-28 w-full">
      {/* Brand */}
      <div className="p-5 flex-center">
        {currentYear} {APP_NAME}. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
