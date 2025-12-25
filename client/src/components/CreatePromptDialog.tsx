import { useState } from "react";
import { useCreatePrompt } from "@/hooks/use-prompts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreatePromptDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const { mutate, isPending } = useCreatePrompt();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    mutate(
      { name, content },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setContent("");
          toast({ title: "Success", description: "Prompt created successfully" });
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-primary gap-2 rounded-full px-6">
          <Plus className="w-5 h-5" /> New Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-card border-border/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Prompt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium text-foreground/80">
              Prompt Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Email Subject Line Generator"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base font-medium text-foreground/80">
              Prompt Template
            </Label>
            <p className="text-sm text-muted-foreground">
              Use <span className="text-primary font-mono bg-primary/10 px-1 rounded">{"{{variable}}"}</span> syntax for dynamic inputs.
            </p>
            <Textarea
              id="content"
              placeholder="Write an email subject line for a product launch about {{productName}}..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field min-h-[200px] font-mono text-sm leading-relaxed"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="btn-primary min-w-[100px]"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
