import { useState } from "react";
import { useCreateTestCase } from "@/hooks/use-test-cases";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddTestCaseDialogProps {
  promptId: number;
  variableNames: string[];
}

export function AddTestCaseDialog({ promptId, variableNames }: AddTestCaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [expectedOutput, setExpectedOutput] = useState("");
  const { mutate, isPending } = useCreateTestCase();
  const { toast } = useToast();

  const handleVariableChange = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        promptId,
        variables,
        expectedOutput: expectedOutput || null,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setVariables({});
          setExpectedOutput("");
          toast({ title: "Success", description: "Test case added" });
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
        <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/50">
          <Plus className="w-4 h-4" /> Add Test Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl bg-card border-border/50">
        <DialogHeader>
          <DialogTitle>Add Test Case</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          
          {variableNames.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Variables</h4>
              {variableNames.map((varName) => (
                <div key={varName} className="space-y-2">
                  <Label htmlFor={`var-${varName}`} className="text-sm font-mono text-primary">
                    {varName}
                  </Label>
                  <Textarea
                    id={`var-${varName}`}
                    placeholder={`Value for ${varName}`}
                    value={variables[varName] || ""}
                    onChange={(e) => handleVariableChange(varName, e.target.value)}
                    className="input-field min-h-[80px]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-secondary/50 p-4 rounded-lg flex gap-3 items-center text-muted-foreground">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">No variables detected in prompt. Add {"{{variable}}"} to your prompt first.</p>
            </div>
          )}

          <div className="space-y-2 border-t border-border/50 pt-4">
            <Label htmlFor="expected" className="text-base font-medium">
              Expected Output (Optional)
            </Label>
            <p className="text-xs text-muted-foreground">Used for manual comparison</p>
            <Textarea
              id="expected"
              placeholder="What should the model output?"
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              className="input-field min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="btn-primary"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Case"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
