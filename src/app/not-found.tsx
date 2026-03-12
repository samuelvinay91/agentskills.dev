import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-xl text-muted-foreground mt-4">Skill not found</p>
      <Button asChild className="mt-6">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
