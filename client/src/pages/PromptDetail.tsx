import { useParams, Link } from "wouter";
import { usePrompt, useRunPrompt } from "@/hooks/use-prompts";
import { useTestCases } from "@/hooks/use-test-cases";
import { useRuns } from "@/hooks/use-runs";
import { AddTestCaseDialog } from "@/components/AddTestCaseDialog";
import { ResultBadge } from "@/components/ResultBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Play, 
  Loader2, 
  Database, 
  Activity, 
  Code2,
  CheckCircle2,
  AlertTriangle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PromptDetail() {
  const { id } = useParams();
  const promptId = Number(id);
  const { data: prompt, isLoading: loadingPrompt } = usePrompt(promptId);
  const { data: testCases, isLoading: loadingTests } = useTestCases(promptId);
  const { data: runs, isLoading: loadingRuns } = useRuns(promptId);
  const { mutate: runTests, isPending: isRunning } = useRunPrompt(promptId);
  const { toast } = useToast();

  if (loadingPrompt || loadingTests || loadingRuns) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Prompt not found
      </div>
    );
  }

  // Extract variables from prompt content {{varName}}
  const variableNames = Array.from(
    prompt.content.matchAll(/{{([^}]+)}}/g), 
    (m) => m[1].trim()
  );

  const handleRunTests = () => {
    runTests(undefined, {
      onSuccess: () => {
        toast({ title: "Tests Started", description: "Evaluating prompt against test cases..." });
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{prompt.name}</h1>
              <p className="text-xs text-muted-foreground font-mono">ID: {prompt.id}</p>
            </div>
          </div>
          <Button 
            onClick={handleRunTests} 
            disabled={isRunning || !testCases?.length}
            className="btn-primary"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2 fill-current" />
            )}
            Run All Tests
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Prompt Editor & Config */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code2 className="w-5 h-5 text-primary" />
                Prompt Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-black/40 rounded-lg border border-white/5 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {prompt.content.split(/({{.*?}})/g).map((part, i) => 
                  part.startsWith("{{") ? (
                    <span key={i} className="text-primary font-bold">{part}</span>
                  ) : (
                    <span key={i} className="text-muted-foreground">{part}</span>
                  )
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {variableNames.map(v => (
                  <span key={v} className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono border border-primary/20">
                    {v}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tests & Results */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="tests" className="w-full">
            <TabsList className="w-full bg-secondary/50 p-1 mb-6 border border-border/50">
              <TabsTrigger value="tests" className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Database className="w-4 h-4 mr-2" />
                Test Cases ({testCases?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="runs" className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Activity className="w-4 h-4 mr-2" />
                Run History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-4">
              <div className="flex justify-end mb-4">
                <AddTestCaseDialog promptId={promptId} variableNames={variableNames} />
              </div>
              
              <div className="space-y-4">
                {testCases?.map((tc) => (
                  <Card key={tc.id} className="glass-card hover:bg-secondary/30 transition-colors">
                    <CardContent className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variables</h4>
                          <div className="space-y-1.5">
                            {Object.entries(tc.variables).map(([key, val]) => (
                              <div key={key} className="flex text-sm font-mono bg-black/20 p-2 rounded border border-white/5">
                                <span className="text-primary mr-2">{key}:</span>
                                <span className="text-foreground/80 truncate">{String(val)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expected Output</h4>
                          <div className="text-sm bg-black/20 p-2 rounded border border-white/5 min-h-[60px] text-muted-foreground italic">
                            {tc.expectedOutput || "No expectation set"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {testCases?.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
                    <Database className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p>No test cases yet. Add one to start testing.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="runs" className="space-y-6">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {runs?.map((run) => (
                    <Card key={run.id} className="bg-card border-border/50">
                      <CardHeader className="py-3 px-5 border-b border-border/50 bg-secondary/20 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ResultBadge pass={run.isPass} />
                          <span className="text-xs text-muted-foreground font-mono">
                            Run ID: {run.id}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(run.createdAt!).toLocaleString()}
                        </span>
                      </CardHeader>
                      <CardContent className="p-5 space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Model Output</h4>
                          <div className="p-3 bg-secondary/50 rounded-lg border border-border font-mono text-sm whitespace-pre-wrap">
                            {run.output}
                          </div>
                        </div>
                        
                        {/* Find associated test case for variables display is a bit tricky without join in this view, 
                            assuming backend might send it or we just show output for now. 
                            Ideally, we'd join this data. For now, let's keep it simple. */}
                      </CardContent>
                    </Card>
                  ))}

                  {runs?.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
                      <p>No run history found.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
