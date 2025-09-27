import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import DailyLogsPage from "./pages/DailyLogsPage";
import Layout from "./components/Layout"; // Import the new Layout component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout> {/* Wrap the Routes with the Layout component */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customer/:customerId" element={<CustomerDetailPage />} />
            <Route path="/daily-logs" element={<DailyLogsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;