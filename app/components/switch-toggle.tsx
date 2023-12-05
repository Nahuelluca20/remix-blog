import { Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";

export default function SwitchToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5" />
      <Switch
        checked={theme === "dark"}
        id="airplane-mode"
        onClick={() =>
          theme === Theme.LIGHT ? setTheme(Theme.DARK) : setTheme(Theme.LIGHT)
        }
      />
      <Moon className="h-5 w-5" />
    </div>
  );
}
