import { Link } from "wouter";
import { type Prompt } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { ArrowRight, FileCode2, Clock, Trash2, Loader2 } from "lucide-react";
import { useDeletePrompt } from "@/hooks/use-prompts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const { mutate: deletePrompt, isPending } = useDeletePrompt();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this prompt?")) {
      deletePrompt(prompt.id, {
        onSuccess: () => {
          toast({ title: "Success", description: "Prompt deleted successfully" });
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      });
    }
  };

  return (
    <div className="relative group">
      <Link href={`/prompts/${prompt.id}`} className="block h-full">
        <Card className="h-full glass-card hover:border-primary/50 transition-all duration-300 p-6 flex flex-col cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
          
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="p-3 rounded-xl bg-secondary group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              <FileCode2 className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {prompt.name}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow font-mono bg-black/20 p-3 rounded-md border border-white/5">
            {prompt.content}
          </p>

          <div className="flex items-center text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            <span>Created just now</span>
          </div>
        </Card>
      </Link>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-12 z-20 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
