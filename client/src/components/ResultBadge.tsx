import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

interface ResultBadgeProps {
  pass?: boolean | null;
}

export function ResultBadge({ pass }: ResultBadgeProps) {
  if (pass === true) {
    return (
      <div className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-green-400/20">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>PASS</span>
      </div>
    );
  }
  
  if (pass === false) {
    return (
      <div className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-red-400/20">
        <XCircle className="w-3.5 h-3.5" />
        <span>FAIL</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-muted-foreground bg-secondary px-2.5 py-1 rounded-full text-xs font-medium border border-border">
      <MinusCircle className="w-3.5 h-3.5" />
      <span>UNKNOWN</span>
    </div>
  );
}
