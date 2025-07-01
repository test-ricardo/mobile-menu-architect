
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Package,
  Truck,
  ShoppingCart,
  BarChart3,
  Globe,
  Users,
  Settings,
  ChevronRight
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const menuItems = [
  {
    title: 'Gestión de envíos',
    url: '/dashboard/envios',
    icon: Truck,
    children: [
      { title: 'Seguimiento de envíos', url: '/dashboard/envios/seguimiento' },
      { title: 'Transportes', url: '/dashboard/envios/transportes' },
      { title: 'Zonas', url: '/dashboard/envios/zonas' },
    ]
  },
  {
    title: 'Transportes',
    url: '/dashboard/transportes',
    icon: Truck,
  },
  {
    title: 'Productos',
    url: '/dashboard/productos',
    icon: Package,
    children: [
      { title: 'Catálogo', url: '/dashboard/productos/catalogo' },
      { title: 'Stock', url: '/dashboard/productos/stock' },
      { title: 'Categorías', url: '/dashboard/productos/categorias' },
      { title: 'Atributos generales', url: '/dashboard/productos/atributos' },
      { title: 'Precios', url: '/dashboard/productos/precios' },
      { title: 'Garantías / RMA', url: '/dashboard/productos/garantias' },
      { title: 'Operaciones de productos', url: '/dashboard/productos/operaciones' },
      { title: 'Ranking de productos', url: '/dashboard/productos/ranking' },
      { title: 'Fabricantes', url: '/dashboard/productos/fabricantes' },
    ]
  },
  {
    title: 'Gestión de compras y ventas',
    url: '/dashboard/compras-ventas',
    icon: ShoppingCart,
  },
  {
    title: 'Control de stock',
    url: '/dashboard/stock',
    icon: BarChart3,
  },
  {
    title: 'Sitio Web Ecommerce',
    url: '/dashboard/ecommerce',
    icon: Globe,
  },
  {
    title: 'Panel de clientes',
    url: '/dashboard/clientes',
    icon: Users,
  },
  {
    title: 'Administración y finanzas',
    url: '/dashboard/admin',
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const [isHovered, setIsHovered] = useState(false);

  const isCollapsed = state === "collapsed";
  const showText = isMobile || !isCollapsed || isHovered;

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActiveRoute = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + '/');
  };

  const isGroupActive = (item: any) => {
    if (isActiveRoute(item.url)) return true;
    if (item.children) {
      return item.children.some((child: any) => isActiveRoute(child.url));
    }
    return false;
  };

  return (
    <Sidebar 
      className={`border-r border-gray-200 bg-white transition-all duration-300 ${
        isMobile 
          ? 'w-full' 
          : isCollapsed && !isHovered 
            ? 'w-[67px]' 
            : 'w-64'
      }`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <SidebarContent className="px-0">
        {/* Header */}
        <div className={`p-4 border-b border-gray-200 ${!showText ? 'px-2' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            {showText && (
              <span className="text-lg font-semibold text-gray-800 whitespace-nowrap">BC Sistemas</span>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 p-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <div className="space-y-1">
                      <SidebarMenuButton
                        asChild={!item.children}
                        className={`
                          w-full justify-start rounded-lg transition-all duration-200
                          ${isGroupActive(item) 
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                            : 'hover:bg-gray-50 text-gray-700'
                          }
                          ${!showText ? 'px-2 justify-center' : 'px-3'}
                        `}
                        onClick={() => item.children && toggleGroup(item.title)}
                      >
                        {item.children ? (
                          <div className={`flex items-center ${showText ? 'justify-between' : 'justify-center'} w-full`}>
                            <div className="flex items-center">
                              <item.icon className={`${!showText ? 'h-5 w-5' : 'h-4 w-4 mr-3'} flex-shrink-0`} />
                              {showText && (
                                <span className="text-sm font-medium truncate">{item.title}</span>
                              )}
                            </div>
                            {showText && item.children && (
                              <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${
                                expandedGroups[item.title] ? 'rotate-90' : ''
                              }`} />
                            )}
                          </div>
                        ) : (
                          <NavLink to={item.url} className="flex items-center w-full">
                            <item.icon className={`${!showText ? 'h-5 w-5' : 'h-4 w-4 mr-3'} flex-shrink-0`} />
                            {showText && (
                              <span className="text-sm font-medium truncate">{item.title}</span>
                            )}
                          </NavLink>
                        )}
                      </SidebarMenuButton>

                      {/* Submenu */}
                      {item.children && showText && expandedGroups[item.title] && (
                        <div className="ml-6 space-y-1 border-l-2 border-gray-100 pl-4">
                          {item.children.map((child) => (
                            <SidebarMenuButton key={child.title} asChild>
                              <NavLink 
                                to={child.url}
                                className={`block py-2 px-3 text-sm rounded-md transition-colors duration-200 ${
                                  isActiveRoute(child.url)
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                {child.title}
                              </NavLink>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
