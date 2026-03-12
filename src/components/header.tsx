import Link from "next/link";
import { Bot } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Bot className="h-6 w-6 text-primary" />
          <span>AgentSkills</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
