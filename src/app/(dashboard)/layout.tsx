// Layout para páginas autenticadas (com sidebar)
import AppSidebar from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <ProtectedRoute>
      <SidebarProvider style={sidebarStyle}>
        <div className="flex h-screen w-full">
          <AppSidebar userName="Super SPACE" userRole="Administrador" />
          <main className="flex-1 flex flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

