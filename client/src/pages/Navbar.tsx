import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Plus,
  Upload,
  MessageSquare,
  Settings,
  BarChart3,
  Menu,
  LogOut,
  User,
  Bell,
  Wallet,
  Home,
  X,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3);
  const { user, isAuthenticated, loading, initialized } = useAuth();

  // Get first letter of name for avatar
  const getInitials = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || "";
  };

  // Navigation items
  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Plus, label: "Add Expense", href: "/add-expense" },
    { icon: Upload, label: "Upload Receipt", href: "/upload-receipt" },
    { icon: MessageSquare, label: "AI Chat", href: "/ai-chat" },
    { icon: BarChart3, label: "Insights", href: "/insights" },
    { icon: DollarSign, label: "All Expense", href: "/all-expense" },
  ];

  const handleNavigation = (href) => {
    setMobileMenuOpen(false);
    window.location.href = href;
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Add logout logic here
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigation("/dashboard")}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
              <span className="text-xl">💰</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent hidden sm:block">
              ExpenseAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => handleNavigation(item.href)}
                className="gap-2 text-slate-700 hover:text-violet-600 hover:bg-violet-50 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <button className="relative p-2 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* User Menu - Desktop */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 hover:bg-violet-50 rounded-lg transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold shadow-md overflow-hidden">
                      {user?.avatar ? (
                        <img
                          src={user?.avatar || ""}
                          alt={user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(user?.name || "")
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden md:block max-w-[100px] truncate">
                      {user?.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-slate-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 font-normal">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/dashboard")}
                    className="cursor-pointer"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/expenses")}
                    className="cursor-pointer"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    My Expenses
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/insights")}
                    className="cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Insights
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/settings")}
                    className="cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <SheetHeader className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-lg shadow-md overflow-hidden">
                        {user?.avatar ? (
                          <img
                            src={user?.avatar}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(user?.name)
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-slate-900">
                          {user?.name}
                        </p>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                      </div>
                    </div>
                  </SheetHeader>

                  {/* Mobile Menu Items */}
                  <div className="flex-1 overflow-y-auto py-4">
                    <div className="space-y-1 px-3">
                      {navItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleNavigation(item.href)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="my-4 border-t border-slate-200"></div>

                    <div className="space-y-1 px-3">
                      <button
                        onClick={() => handleNavigation("/settings")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                      </button>
                      <button
                        onClick={() => handleNavigation("/expenses")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors"
                      >
                        <Wallet className="w-5 h-5" />
                        <span className="font-medium">My Expenses</span>
                      </button>
                    </div>
                  </div>

                  {/* Mobile Menu Footer */}
                  <div className="p-4 border-t border-slate-200">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Quick Action Bar - Mobile Only */}
      <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg">
        <div className="flex items-center justify-around py-2 px-2">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="flex flex-col items-center gap-1 px-3 py-2 text-slate-600 hover:text-violet-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => handleNavigation("/add-expense")}
            className="flex flex-col items-center gap-1 px-3 py-2 text-slate-600 hover:text-violet-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Add</span>
          </button>
          <button
            onClick={() => handleNavigation("/ai-chat")}
            className="flex flex-col items-center gap-1 px-3 py-2 text-slate-600 hover:text-violet-600 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-medium">AI Chat</span>
          </button>
          <button
            onClick={() => handleNavigation("/insights")}
            className="flex flex-col items-center gap-1 px-3 py-2 text-slate-600 hover:text-violet-600 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">Insights</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
