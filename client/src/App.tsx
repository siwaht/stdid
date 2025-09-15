import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import IdCardGenerator from "@/pages/id-card-generator";
import MultiCardGenerator from "@/pages/multi-card-generator";
import NotFound from "@/pages/not-found";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Wand2 } from "lucide-react";

function HomePage() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            ID Card Generator Studio
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your preferred card creation experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/basic">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-2">Basic Generator</h2>
                <p className="text-muted-foreground mb-4">
                  Quick and simple ID card creation with essential fields
                </p>
                <Button className="w-full">
                  Start Basic
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/studio">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <Wand2 className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-2">Creative Studio</h2>
                <p className="text-muted-foreground mb-4">
                  Multiple templates, themes, and advanced customization
                </p>
                <Button className="w-full" variant="default">
                  Open Studio
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/basic" component={IdCardGenerator} />
      <Route path="/studio" component={MultiCardGenerator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
