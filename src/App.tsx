
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DialogProvider } from "@/contexts/DialogContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Transportes from "@/pages/Transportes";
import NotFound from "./pages/NotFound";
import DialogTest from "@/pages/DialogTest";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <DialogProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Dashboard />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Dashboard />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/dashboard/transportes" element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Transportes />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/dashboard/*" element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <div className="p-6">
                                            <div className="text-center">
                                                <h1 className="text-2xl font-bold mb-4">Módulo en desarrollo</h1>
                                                <p className="text-gray-600">Esta sección estará disponible próximamente.</p>
                                            </div>
                                        </div>
                                    </DashboardLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/dialog-test" element={<DialogTest />} />
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </DialogProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
