"use client";

import { useState } from "react";
import NotesSection from "@/components/NotesSection";
import CalenderGrid from "@/components/CalenderGrid"; // Fix spelling
import { Timer, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { getThemeColor } from "@/lib/utils";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
const theme = getThemeColor(currentDate.getMonth());
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
      {/* Hero */}
      <section className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10">
        <img 
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover grayscale-[20%] brightness-90"
          alt="Nature"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-10 left-10">
         <div className={`${theme.bg} backdrop-blur-md p-8 rounded-2xl transform -rotate-2 border border-white/20 shadow-2xl transition-colors duration-500`}>   <h1 className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
               {format(currentDate, "MMM")} <span className="text-sky-400">{format(currentDate, "yyyy")}</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <CalenderGrid 
            viewDate={currentDate} 
            setViewDate={setCurrentDate} 
          />
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-6">
         <div className={`${theme.bg} text-white p-8 rounded-[2.5rem] shadow-xl transition-colors duration-500`}>    <h3 className="text-xl font-bold mb-2">{format(currentDate, "MMMM")} Focus</h3>
            <p className="text-blue-100 text-sm leading-relaxed italic">
              "Focus on deep work and finishing the UI migration."
            </p>
          </div>
          
          <div className="flex-1 min-h-[400px]">
            <NotesSection currentDate={currentDate} />
          </div>
        </aside>
      </div>

  
     <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatCard 
    icon={<Timer className={theme.text} />} 
    label="Deep Work" 
    value="42.5h" 
    trend="+12%" 
  />
  <StatCard 
    icon={<CheckCircle2 className="text-emerald-500" />} 
    label="Completion" 
    value="84%" 
    trend="+5%" 
  />
  <StatCard 
    icon={<AlertCircle className="text-amber-500" />} 
    label="Pending" 
    value="04" 
    trend="-2" 
  />
</section>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
  const isPositive = trend.startsWith('+');
  const isNegative = trend.startsWith('-');
  
  const trendStyles = isPositive 
    ? "bg-emerald-50 text-emerald-700" 
    : isNegative 
    ? "bg-rose-50 text-rose-700" 
    : "bg-slate-100 text-slate-600";

  return (
    <div className="bg-white p-6 rounded-3xl border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        {/* Added a slight scale effect on the icon when the card is hovered */}
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trendStyles}`}>
          {trend}
        </span>
      </div>
      
      <div>
        <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
}