import Logo from "@/components/shared/header/logo";
import Menu from "./menu";
import Actions from "./actions";
import NavLinks from "./navlinks";

const Header = () => {
  return (
    <header className="w-full bg-background lg:mx-auto px-5 md:px-28 py-3 sm:py-5 fixed z-10">
      <div className="flex justify-between items-center">
        <Logo className="hidden lg:flex" width={80} height={80} />
        <Menu />
        <nav className="hidden lg:flex">
          <NavLinks />
        </nav>
        <Logo className="lg:hidden" width={40} height={40} />
        <Actions />
      </div>
    </header>
  );
};

export default Header;
