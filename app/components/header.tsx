import { Link } from "@remix-run/react";
import SwitchToggle from "./switch-toggle";
import { Button } from "./ui/button";
import { GithubIcon } from "lucide-react";

export default function Header() {
  return (
    <nav className="w-full flex-col-reverse md:flex-row gap-2 flex justify-between items-center">
      <h1 className="font-bold text-2xl text-center">Sider Dev Blog</h1>
      <ul className="flex justify-start md:justify-between items-center gap-2">
        <li className="text-md font-semibold">
          <Button asChild variant={"ghost"}>
            <Link to={"/about"}>About</Link>
          </Button>
        </li>
        <li>
          <SwitchToggle />
        </li>
        <li>
          <Button asChild variant="ghost" size="icon">
            <Link to={"https://github.com/Nahuelluca20"} target="black">
              <GithubIcon className="h-4 w-4" />
            </Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
