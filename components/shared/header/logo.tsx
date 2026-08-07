import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { APP_NAME } from "@/lib/constants";

const Logo = ({
  className,
  width = 60,
  height = 60,
  priority = false,
}: {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) => {
  return (
    <div className={className}>
      <Link href="/">
        <Image
          src={logo}
          alt={`${APP_NAME} logo`}
          width={width}
          height={height}
          style={{ height: "auto", width: "auto" }}
          priority={priority}
          loading="eager"
        />
      </Link>
    </div>
  );
};

export default Logo;
