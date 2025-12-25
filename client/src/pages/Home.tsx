import { usePrompts } from "@/hooks/use-prompts";
import { CreatePromptDialog } from "@/components/CreatePromptDialog";
import { PromptCard } from "@/components/PromptCard";
import { Loader2, Terminal } from "lucide-react";

export default function Home() {
  const { data: prompts, isLoading, error } = usePrompts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-destructive">
        Error loading prompts: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                Prompt Studio
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-xl">
              Design, test, and refine your LLM prompts with precision. 
              Manage test cases and track performance over time.
            </p>
          </div>
          <CreatePromptDialog />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts?.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
          
          {prompts?.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-border rounded-2xl bg-secondary/20">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Terminal className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No prompts yet</h3>
              <p className="text-muted-foreground mb-6">Create your first prompt to get started.</p>
              <CreatePromptDialog />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
