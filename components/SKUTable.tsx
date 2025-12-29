
import React from 'react';
import { SKUData } from '../types';

interface SKUTableProps {
  data: SKUData[];
}

const SKUTable: React.FC<SKUTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">SKU Details</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Revenue</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">ROAS</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Inventory</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((sku) => {
            const roas = (sku.sales / sku.adSpend).toFixed(2);
            const stockLevel = (sku.currentStock / sku.totalCapacity) * 100;
            const isLowStock = stockLevel < 30;

            return (
              <tr key={sku.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800 text-sm">{sku.name}</div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase">{sku.category}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-slate-900 text-sm">₹{sku.sales.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${Number(roas) >= 3 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                    {roas}x
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-end">
                    <span className={`text-xs font-bold ${isLowStock ? 'text-rose-500' : 'text-slate-600'}`}>
                      {sku.currentStock} Units
                    </span>
                    <div className="w-20 h-1 bg-slate-100 mt-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isLowStock ? 'bg-rose-500' : 'bg-primary'}`} 
                        style={{ width: `${Math.min(stockLevel, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SKUTable;
