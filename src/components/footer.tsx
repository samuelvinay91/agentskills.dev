import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-8 mt-auto">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            AgentSkills — Discover AI agent skills and tools
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <a
              href="https://github.com/samuelvinay91/agentskills.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
