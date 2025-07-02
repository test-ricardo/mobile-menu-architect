
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, User, Menu } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="h-full flex w-full bg-gray-50 overflow-hidden">
                <AppSidebar />

                <div className="flex-1 h-full min-h-0 overflow-hidden">
                    {/* Header */}
                    <header className="h-16 bg-neutral1 border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
                        <div className="flex items-center space-x-4">
                            <SidebarTrigger className="lg:hidden">
                                <Menu className="h-6 w-6" />
                            </SidebarTrigger>
                            <div className="hidden lg:block">
                                <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Menu className="h-5 w-5" />
                                </SidebarTrigger>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-neutral1 text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </Button>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-neutral1" />
                                        </div>
                                        <span className="hidden md:block text-sm font-medium">
                                            {user?.name}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-neutral1 border border-gray-200 shadow-lg">
                                    {/* <DropdownMenuItem className="hover:bg-gray-50">
                                        Perfil
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-50">
                                        Configuración
                                    </DropdownMenuItem> */}
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="hover:bg-gray-50 text-red-600"
                                    >
                                        Cerrar sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 h-full min-h-0 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
