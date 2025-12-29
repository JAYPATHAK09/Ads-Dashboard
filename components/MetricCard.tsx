
import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string;
  subValue: string;
  trend: 'up' | 'down';
  trendValue: string;
  data: any[];
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subValue, trend, trendValue, data }) => {
  const isUp = trend === 'up';

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between">
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-slate-900 font-bold text-sm">{title}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">{value}</span>
            <div className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${isUp ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isUp ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
              {trendValue}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">{subValue}</p>
        </div>
      </div>
      <div className="w-24 h-12 self-end">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`colorGradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isUp ? "#10b981" : "#f43f5e"} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={isUp ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isUp ? "#10b981" : "#f43f5e"} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill={`url(#colorGradient-${title})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricCard;
