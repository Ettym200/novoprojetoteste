"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/services/authService";
import { getUserRoleFromToken } from "@/lib/utils/jwt";
import type { UserRole } from "@/types/user";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[]; // Roles permitidos (se não especificado, todos podem ver)
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard Geral",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Afiliados",
    url: "/affiliates",
    icon: Users,
  },
  {
    title: "Jogadores",
    url: "/players",
    icon: UserCircle,
  },
  {
    title: "Campanhas",
    url: "/campaigns",
    icon: Megaphone,
    roles: ["GESTOR"], // Apenas GESTORES podem ver
  },
  {
    title: "Análises",
    url: "/analytics",
    icon: BarChart3,
  },
];

const configItems = [
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
];

interface AppSidebarProps {
  userName?: string;
  userRole?: string;
}

export default function AppSidebar({ userName = "Super Admin", userRole = "Administrador" }: AppSidebarProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const currentUserRole = getUserRoleFromToken();

  const handleSignOut = () => {
    // Limpar cache do React Query antes de fazer logout
    queryClient.clear();
    queryClient.removeQueries();
    queryClient.resetQueries();
    
    // Fazer logout
    signOut();
  };

  // Filtrar itens do menu baseado no role do usuário
  const filteredMenuItems = menuItems.filter((item) => {
    // Se o item não tem restrição de role, todos podem ver
    if (!item.roles) return true;
    // Se tem restrição, verificar se o role atual está na lista
    return currentUserRole && item.roles.includes(currentUserRole);
  });

  return (
    <Sidebar data-testid="app-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="logo-link">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VB</span>
            </div>
            <div>
              <span className="font-bold text-lg">Veloc</span>
              <span className="font-bold text-lg text-primary">Broker</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Métricas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    data-testid={`nav-${item.url.replace("/", "") || "dashboard"}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    data-testid={`nav-${item.url.replace("/", "")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-auto py-2 px-3"
              data-testid="button-user-menu"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userRole}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem data-testid="menu-item-profile">
              <UserCircle className="w-4 h-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-item-settings">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-500" 
              data-testid="menu-item-logout"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
