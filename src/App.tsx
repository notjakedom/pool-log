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
import WeeklyReportsPage from "./pages/WeeklyReportsPage";
import Layout from "./components/Layout";
import Login from "./pages/Login"; // Import the new Login page
import { SessionContextProvider } from "./components/SessionContextProvider"; // Import the new SessionContextProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionContextProvider> {/* Wrap the entire app with SessionContextProvider */}
          <Routes>
            <Route path="/login" element={<Login />} /> {/* Add the login route */}
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/customers" element={<Layout><CustomersPage /></Layout>} />
            <Route path="/customer/:customerId" element={<Layout><CustomerDetailPage /></Layout>} />
            <Route path="/daily-logs" element={<Layout><DailyLogsPage /></Layout>} />
            <Route path="/weekly-reports" element={<Layout><WeeklyReportsPage /></Layout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;