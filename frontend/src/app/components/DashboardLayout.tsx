import { Outlet, Link, useLocation } from "react-router";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Upload, 
  BarChart3,
  Menu
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

export function DashboardLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Alumnos", href: "/students", icon: Users },
    { name: "Calificaciones", href: "/grades", icon: BookOpen },
    { name: "Importar Excel", href: "/import", icon: Upload },
    { name: "Reportes", href: "/reports", icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              active
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                      <GraduationCap className="w-8 h-8 text-blue-600" />
                      <h1 className="text-xl">Control Escolar</h1>
                    </div>
                    <nav className="space-y-2">
                      <NavLinks />
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
              
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl">Sistema de Control Escolar</h1>
            </div>
            <div className="text-sm text-gray-600">
              Ciclo Escolar 2025-2026
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            <NavLinks />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
