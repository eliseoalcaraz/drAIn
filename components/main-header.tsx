import Link from "next/link";

export function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
        <div className="w-72 items-center text-xl font-semibold">
          <Link href={"/"}>pjdsc</Link>
        </div>
        <div className="flex gap-10 font-medium">
          <Link href={"/map"} className="hover:text-primary transition-colors">
            Map
          </Link>
          <Link
            href={"/timeline"}
            className="hover:text-primary transition-colors"
          >
            Timeline
          </Link>
          <Link
            href={"/about"}
            className="hover:text-primary transition-colors"
          >
            About
          </Link>
        </div>
        <div className="w-72 flex justify-end"></div>
      </div>
    </nav>
  );
}
