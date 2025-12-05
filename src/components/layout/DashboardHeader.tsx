"use client"

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import DateRangeSelector from "@/components/dashboard/DateRangeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  showSearch?: boolean;
  showDatePicker?: boolean;
}

export default function DashboardHeader({
  title,
  subtitle,
  onRefresh,
  showSearch = false,
  showDatePicker = true,
}: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  // todo: remove mock functionality
  const notifications = [
    { id: "1", title: "Queda de ROI detectada", description: "Afiliado Cordeiro com ROI -15%", time: "5 min" },
    { id: "2", title: "Novo FTD", description: "Player João realizou primeiro depósito", time: "12 min" },
    { id: "3", title: "Meta atingida", description: "Afiliado Raman atingiu meta mensal", time: "1h" },
  ];

  return (
    <header className="sticky top-0 z-40 flex flex-col border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-4">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <div className="relative">
              {searchOpen ? (
                <Input
                  placeholder="Buscar..."
                  className="w-64"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                  data-testid="input-global-search"
                />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  data-testid="button-open-search"
                >
                  <Search className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px]">
                  {notifications.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 border-b border-border">
                <p className="font-semibold text-sm">Notificações</p>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-3"
                  data-testid={`notification-${notification.id}`}
                >
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {showDatePicker && (
        <div className="px-6 pb-3 border-t border-border/50">
          <DateRangeSelector />
        </div>
      )}
    </header>
  );
}
