
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from 'recharts';
import { SKUData, AnalysisResult } from './types';
import { SAMPLE_DATA } from './constants';
import { analyzeBusinessData } from './services/geminiService';
import MetricCard from './components/MetricCard';
import SKUTable from './components/SKUTable';

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${active ? 'sidebar-item-active' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

const App: React.FC = () => {
  const [data] = useState<SKUData[]>(SAMPLE_DATA);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.sales, 0);
    const totalAdSpend = data.reduce((acc, curr) => acc + curr.adSpend, 0);
    return {
      totalRevenue,
      totalAdSpend,
      avgROAS: totalRevenue / totalAdSpend,
    };
  }, [data]);

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeBusinessData(data);
      if (result) {
        const healthMatch = result.match(/This week’s overall health: (Excellent|Stable|Caution)/i);
        setAnalysis({
          summary: result,
          overallHealth: (healthMatch ? healthMatch[1] : 'Stable') as any,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err: any) {
      setError("Analysis failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Sort by revenue for the chart and take top 10 to keep it clean
  const chartData = useMemo(() => 
    data.sort((a, b) => b.sales - a.sales).slice(0, 12).map(sku => ({ 
      name: sku.name.length > 15 ? sku.name.substring(0, 15) + '...' : sku.name, 
      value: sku.sales 
    })), [data]);

  const sparklineData = [
    { value: 400 }, { value: 300 }, { value: 600 }, { value: 800 }, { value: 500 }, { value: 900 }
  ];

  const orderStats = [
    { name: 'Shipped', value: 3200, color: '#FF5722' },
    { name: 'Delivered', value: 1800, color: '#FFAB91' },
    { name: 'Returned', value: 430, color: '#FFCCBC' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 hidden lg:flex">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xl">S</div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">Sales.io</span>
        </div>
        
        <nav className="space-y-2 flex-grow">
          <SidebarItem active icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>} label="Home" />
          <SidebarItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>} label="Dashboard" />
          <SidebarItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>} label="Products" />
          <SidebarItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2"/></svg>} label="Analytics" />
        </nav>

        <div className="pt-6 border-t border-slate-100 mt-6 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="flex-grow overflow-hidden">
               <p className="text-xs font-bold text-slate-800 truncate">Alex Alom</p>
               <p className="text-[10px] text-slate-400 font-medium truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto bg-app">
        {/* Navbar */}
        <header className="px-8 py-5 flex items-center justify-between sticky top-0 bg-app z-10">
          <h2 className="text-xl font-bold text-slate-800">Dashborad</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative">
               <input type="text" placeholder="Search" className="bg-white border border-slate-200 rounded-full py-2 px-10 text-sm focus:outline-none focus:border-primary w-64" />
               <svg className="w-4 h-4 text-slate-400 absolute left-4 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary relative">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
               <span className="absolute top-0 right-0 w-3 h-3 bg-primary border-2 border-white rounded-full"></span>
            </div>
            <div className="flex items-center gap-2">
               <img src="https://ui-avatars.com/api/?name=Alex+Alom&background=FF5722&color=fff" className="w-8 h-8 rounded-full" alt="User" />
               <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </header>

        <div className="px-8 pb-10 space-y-6">
          {/* Top Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Total Revenue" value={`₹${metrics.totalRevenue.toLocaleString()}`} subValue="Vs last Month" trend="up" trendValue="25%" data={sparklineData} />
            <MetricCard title="Blended ROAS" value={`${metrics.avgROAS.toFixed(2)}x`} subValue="Portfolio Average" trend="up" trendValue="12%" data={sparklineData} />
            <MetricCard title="Total Ad Spend" value={`₹${metrics.totalAdSpend.toLocaleString()}`} subValue="Vs last Month" trend="up" trendValue="8%" data={sparklineData} />
            <MetricCard title="Orders" value="5,430" subValue="Weekly Total" trend="up" trendValue="5%" data={sparklineData} />
          </div>

          {/* Middle Row: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                 <div>
                   <h3 className="text-lg font-bold text-slate-800">Top Product Performance</h3>
                   <div className="flex items-baseline gap-2 mt-2">
                     <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{metrics.totalRevenue.toLocaleString()}</span>
                     <span className="text-xs font-medium text-slate-400 uppercase">Total Revenue Analysis</span>
                   </div>
                 </div>
                 <select className="bg-slate-50 border-none text-xs font-bold text-slate-600 rounded-lg px-3 py-1.5 outline-none">
                    <option>Weekly View</option>
                 </select>
              </div>

              <div className="flex gap-10 items-center mb-10">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Select by Category</span>
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-slate-700">Top Segment:</span>
                     <span className="text-sm font-black text-slate-900">Oral & Air Care</span>
                   </div>
                 </div>
                 <select className="bg-slate-50 border-none text-[10px] font-black text-slate-600 rounded-lg px-4 py-1.5 outline-none uppercase tracking-widest">
                    <option>Revenue</option>
                 </select>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip cursor={{fill: '#fff7ed'}} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#FF5722' : '#FFCCBC'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <button 
                onClick={handleRunAnalysis}
                disabled={loading}
                className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI Analyzing Portfolio...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    Generate AI Insights
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center">
              <div className="flex justify-between w-full mb-8">
                 <h3 className="text-lg font-bold text-slate-800">Order Information</h3>
                 <svg className="w-5 h-5 text-slate-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
              </div>

              <div className="relative w-full h-[250px] flex items-center justify-center mb-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {orderStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-3xl font-black text-slate-900">5,430</span>
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mt-1">Total Order<br/>On this Weeks</span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                   {orderStats.map(stat => (
                     <div key={stat.name} className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-sm" style={{backgroundColor: stat.color}}></div>
                       <span className="text-slate-500">{stat.name}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: AI Summary & Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col h-[500px]">
               <div className="flex items-center gap-2 mb-6">
                 <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                 <h3 className="text-lg font-bold text-slate-800">AI Business Insights</h3>
               </div>
               {analysis ? (
                 <div className="flex flex-col h-full overflow-hidden">
                    <div className="text-xs text-slate-600 leading-relaxed overflow-y-auto pr-2 scrollbar-thin flex-grow">
                      <div className="whitespace-pre-wrap">{analysis.summary}</div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between flex-shrink-0">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Week Health</span>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         analysis.overallHealth === 'Excellent' ? 'bg-emerald-50 text-emerald-600' :
                         analysis.overallHealth === 'Caution' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                       }`}>{analysis.overallHealth}</span>
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center px-4">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                     Analysis report will be generated<br/>based on real-time SKU data.
                   </p>
                 </div>
               )}
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl p-2 border border-slate-100 shadow-sm overflow-hidden h-[500px]">
               <div className="h-full overflow-y-auto scrollbar-thin">
                 <SKUTable data={data} />
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
