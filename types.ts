
export interface SKUData {
  id: string;
  name: string;
  category: string;
  sales: number;
  unitsSold: number;
  adSpend: number;
  impressions: number;
  clicks: number;
  conversionRate: number;
  currentStock: number;
  totalCapacity: number;
}

export interface AnalysisResult {
  summary: string;
  overallHealth: 'Excellent' | 'Stable' | 'Caution';
  timestamp: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalAdSpend: number;
  avgROAS: number;
  avgCTR: number;
  avgCPC: number;
}
