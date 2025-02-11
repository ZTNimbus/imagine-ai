import { Button } from "./ui/button";
import Colors from "@/data/Colors";

function Header() {
  return (
    <div className="p-4 flex justify-between items-center">
      <span>LOGO</span>

      <div className={"flex gap-5"}>
        <Button variant="ghost">Sign In</Button>
        <Button className="text-white" style={{ backgroundColor: Colors.BLUE }}>
          Get Started
        </Button>
      </div>
    </div>
  );
}

export default Header;
