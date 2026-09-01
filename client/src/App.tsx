import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import AiOpportunityDataReadinessSprint from "@/pages/AiOpportunityDataReadinessSprint";
import CaseStudySportsbookChurnPrediction from "@/pages/CaseStudySportsbookChurnPrediction";
import { DentalReception, DocumentsToData, IncidentSupport, RealTimeEngagement, VenuePlanningAi } from "@/pages/ApprovedCaseStudyPages";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/services/ai-opportunity-data-readiness-sprint" component={AiOpportunityDataReadinessSprint} />
      <Route path="/case-studies/sportsbook-churn-prediction" component={CaseStudySportsbookChurnPrediction} />
      <Route path="/case-studies/real-time-engagement" component={RealTimeEngagement} />
      <Route path="/case-studies/dental-ai-receptionist" component={DentalReception} />
      <Route path="/case-studies/ai-incident-resolution" component={IncidentSupport} />
      <Route path="/case-studies/healthcare-agreement-ai" component={DocumentsToData} />
      <Route path="/case-studies/venue-planning-ai" component={VenuePlanningAi} />
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/admin" component={Admin} />
        </>
      )}
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
