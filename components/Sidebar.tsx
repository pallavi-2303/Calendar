"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Calendar, label: "Calendar", active: true },
  { icon: FileText, label: "Notes" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
          <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
        </div>
        <span className="font-black text-xl tracking-tighter text-[#001e2e]">
          EPHEMERA
        </span>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setIsOpen(false)} // Close menu on click (mobile)
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
              item.active 
                ? "bg-primary text-white shadow-xl shadow-blue-900/20 lg:translate-x-1" 
                : "hover:bg-slate-100 text-slate-500 hover:text-primary"
            }`}
          >
            <item.icon size={20} className={item.active ? "text-sky-300" : "group-hover:scale-110 transition-transform"} />
            <span className="font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
      <button className="flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-2xl transition-all group">
        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold tracking-tight">Logout</span>
      </button>
    </div>
  );

  return (
    <>
      {/* --- MOBILE NAVIGATION --- */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-primary hover:bg-slate-50 transition-colors">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6 bg-[#fcfdfe]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="fixed left-0 top-0 h-full w-64 bg-[#fcfdfe] border-r border-slate-200 hidden lg:flex flex-col p-6 z-40">
        <SidebarContent />
      </aside>
    </>
  );
}