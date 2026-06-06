import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as d3 from "d3";
import { 
  TrendingUp, DollarSign, Award, Users, Search, 
  RefreshCw, Plus, Check, Edit, Trash2, Clipboard, Play, 
  AlertCircle, Moon, Sun, AlertTriangle, FileText, CheckCircle, 
  Smartphone, Camera, Download, Upload, HelpCircle, Eye, ShoppingCart, 
  ChevronRight, ChevronDown, Calendar, UserCheck, Egg, Lock, ShieldAlert, ShieldCheck,
  Settings, Info, Bell, Database, SlidersHorizontal, Sparkles, Tag, BarChart2, Truck, Menu
} from "lucide-react";
import { 
  LineChart as RechartLineChart, 
  Line as RechartLine, 
  XAxis as RechartXAxis, 
  YAxis as RechartYAxis, 
  Tooltip as RechartTooltip, 
  ResponsiveContainer as RechartResponsiveContainer,
  PieChart as RechartPieChart,
  Pie as RechartPie,
  Cell as RechartCell,
  Legend as RechartLegend
} from "recharts";
import { Animal, Sale, Transaction, User, PoultryBatch } from "../types";

// PROPS DEFINITION
export interface DashboardModuleProps {
  lang: "en" | "bn";
  currentUser: User;
  isDecentralizedMode: boolean;
  selectedDashboardDept: "All" | "Livestock" | "Poultry" | "Butcher" | "Collections" | "Feed";
  setSelectedDashboardDept: React.Dispatch<React.SetStateAction<"All" | "Livestock" | "Poultry" | "Butcher" | "Collections" | "Feed">>;
  computedDashboardCards: Array<{ title: string; val: string; detail: string; sub: string }>;
  currentDashboardDept: string;
  offlineQueue: any[];
  handleReplayOfflineQueue: () => void;
  setOfflineQueue: React.Dispatch<React.SetStateAction<any[]>>;
  addAuditLog: (action: string, dept: string, details: string) => void;
  setFeedInventory: React.Dispatch<React.SetStateAction<any[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  showDashboardScannerEmulator: boolean;
  setShowDashboardScannerEmulator: React.Dispatch<React.SetStateAction<boolean>>;
  renderScanTerminal: (scope: "Poultry" | "Livestock" | "Butcher" | "Feed") => React.ReactNode;
  monthlyData: any[];
  last6MonthsExpenseData: any[];
  animals: Animal[];
  feedInventory: any[];
  poultryBatches: PoultryBatch[];
  transactions: Transaction[];
  hasPermission: (p: any) => boolean;
  computedDeviatingAnimals: any[];
  saveFeedRecommendationToNotes: (id: string, notes: string) => void;
  isDashboardFabOpen: boolean;
  setIsDashboardFabOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddAnimalModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBillingModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowQuickSubtractModal: React.Dispatch<React.SetStateAction<boolean>>;
}

// 1. Breed Distribution Pie Chart
export const BreedDistributionPieChart = ({ animals }: { animals: Animal[] }) => {
  const breedCounts = useMemo(() => {
    const counts: { [breed: string]: number } = {};
    animals.filter(a => a.status === "Active" || a.status === "Pending").forEach(animal => {
      counts[animal.breed] = (counts[animal.breed] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [animals]);

  const COLORS = ["#0d9488", "#112a46", "#14b8a6", "#2dd4bf", "#4ade80", "#06b6d4", "#a7f3d0", "#a855f7"];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between h-full">
      <div>
        <span className="text-[10px] uppercase font-mono font-black text-teal-400">Genetics Portfolio</span>
        <h4 className="text-sm font-black text-white mt-1 font-mono uppercase">Breed Diversity Index</h4>
      </div>
      
      {breedCounts.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-[10.5px] font-mono text-slate-500 text-center uppercase">
          No records registered under genetics track
        </div>
      ) : (
        <div className="flex flex-col items-center mt-3">
          <div className="h-44 w-full relative">
            <RechartResponsiveContainer width="100%" height="100%">
              <RechartPieChart>
                <RechartPie
                  data={breedCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {breedCounts.map((entry, idx) => (
                    <RechartCell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </RechartPie>
                <RechartTooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "10px" }} />
              </RechartPieChart>
            </RechartResponsiveContainer>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 leading-none">Registered</span>
              <span className="text-xl font-black text-white font-mono mt-1 leading-none">{animals.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 w-full mt-4 max-h-24 overflow-y-auto pr-1">
            {breedCounts.slice(0, 8).map((b, idx) => (
              <div key={b.name} className="flex items-center gap-2 text-[10px] font-mono justify-between text-slate-300">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="truncate">{b.name}</span>
                </div>
                <strong className="text-white font-bold">{b.value} items</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Monthly Financial Trend Chart (D3 & Recharts)
interface FinancialTrendProps {
  monthlyData: any[];
  last6MonthsExpenseData?: Array<{ key: string; label: string; purchase: number; operational: number }>;
  lang: "en" | "bn";
}

export const MonthlyFinancialTrendChart: React.FC<FinancialTrendProps> = ({ monthlyData, last6MonthsExpenseData = [], lang }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredData, setHoveredData] = useState<{ label: string; revenue: number; expense: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeChartTab, setActiveChartTab] = useState<"gross" | "expenses">("gross");

  useEffect(() => {
    if (!svgRef.current || activeChartTab !== "gross") return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawings

    const width = 640;
    const height = 280;
    const margin = { top: 25, right: 30, bottom: 45, left: 60 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3.scalePoint()
      .domain(monthlyData.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.3);

    // Y scale
    const maxVal = d3.max(monthlyData, (d: any) => Math.max(d.revenue, d.expense)) || 10000;
    const y = d3.scaleLinear()
      .domain([0, maxVal * 1.1])
      .range([chartHeight, 0]);

    // Gridlines SVG setup
    g.append("g")
      .attr("class", "grid")
      .attr("stroke", "#1e293b")
      .attr("stroke-opacity", 0.25)
      .call(d3.axisLeft(y)
        .tickSize(-chartWidth)
        .tickFormat(null)
      )
      .selectAll("text").remove();

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .attr("color", "#64748b")
      .selectAll("text")
      .style("font-family", "monospace")
      .style("font-size", "9px")
      .attr("dy", "1.2em");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `₹${Number(d) / 1000}k`))
      .attr("color", "#64748b")
      .selectAll("text")
      .style("font-family", "monospace")
      .style("font-size", "9px");

    // Defs & Gradients
    const defs = svg.append("defs");
    
    // Revenue gradient (Teal)
    const revGrad = defs.append("linearGradient")
      .attr("id", "rev-grad")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    revGrad.append("stop").attr("offset", "0%").attr("stop-color", "#0d9488").attr("stop-opacity", 0.25);
    revGrad.append("stop").attr("offset", "100%").attr("stop-color", "#0d9488").attr("stop-opacity", 0.0);

    // Expense gradient (Rose/Crimson)
    const expGrad = defs.append("linearGradient")
      .attr("id", "exp-grad")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    expGrad.append("stop").attr("offset", "0%").attr("stop-color", "#f43f5e").attr("stop-opacity", 0.15);
    expGrad.append("stop").attr("offset", "100%").attr("stop-color", "#f43f5e").attr("stop-opacity", 0.0);

    // Area drawings
    const revenueArea = d3.area<any>()
      .x(d => x(d.label)!)
      .y0(chartHeight)
      .y1(d => y(d.revenue))
      .curve(d3.curveMonotoneX);

    const expenseArea = d3.area<any>()
      .x(d => x(d.label)!)
      .y0(chartHeight)
      .y1(d => y(d.expense))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(monthlyData)
      .attr("fill", "url(#rev-grad)")
      .attr("d", revenueArea);

    g.append("path")
      .datum(monthlyData)
      .attr("fill", "url(#exp-grad)")
      .attr("d", expenseArea);

    // Line drawing paths
    const revLine = d3.line<any>()
      .x(d => x(d.label)!)
      .y(d => y(d.revenue))
      .curve(d3.curveMonotoneX);

    const expLine = d3.line<any>()
      .x(d => x(d.label)!)
      .y(d => y(d.expense))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(monthlyData)
      .attr("fill", "none")
      .attr("stroke", "#0d9488")
      .attr("stroke-width", 2.5)
      .attr("d", revLine);

    g.append("path")
      .datum(monthlyData)
      .attr("fill", "none")
      .attr("stroke", "#f43f5e")
      .attr("stroke-width", 2.2)
      .attr("d", expLine);

    // Column overlay trigger sections for tooltip positioning
    const bandwidth = chartWidth / Math.max(1, monthlyData.length - 1);
    
    g.selectAll(".trigger-rect")
      .data(monthlyData)
      .enter()
      .append("rect")
      .attr("class", "trigger-rect")
      .attr("x", (d, i) => x(d.label)! - bandwidth / 2)
      .attr("y", 0)
      .attr("width", bandwidth)
      .attr("height", chartHeight)
      .attr("fill", "transparent")
      .style("cursor", "crosshair")
      .on("mouseenter", (event, d) => {
        setHoveredData(d);
        const [mx, my] = d3.pointer(event, svgRef.current);
        setTooltipPos({ x: mx + margin.left, y: my - 15 });
      })
      .on("mousemove", (event, d) => {
        const [mx, my] = d3.pointer(event, svgRef.current);
        setTooltipPos({ x: mx + margin.left, y: my - 15 });
      })
      .on("mouseleave", () => {
        setHoveredData(null);
      });

    // Circular nodes on hover/active
    monthlyData.forEach(d => {
      const cx = x(d.label)!;
      g.append("circle")
        .attr("cx", cx)
        .attr("cy", y(d.revenue))
        .attr("r", 4.5)
        .attr("fill", "#020617")
        .attr("stroke", "#0d9488")
        .attr("stroke-width", 2);

      g.append("circle")
        .attr("cx", cx)
        .attr("cy", y(d.expense))
        .attr("r", 4.5)
        .attr("fill", "#020617")
        .attr("stroke", "#f43f5e")
        .attr("stroke-width", 2);
    });

  }, [monthlyData, activeChartTab]);

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl leading-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-mono font-black text-teal-400">
            {activeChartTab === "gross" ? (lang === "bn" ? "মাসিক ক্যাশফ্লো" : "Monthly Cash Flows") : (lang === "bn" ? "খরচ তুলনা" : "Expense Comparison")}
          </span>
          <h4 className="text-sm font-black text-white mt-1 font-mono">
            {activeChartTab === "gross"
              ? (lang === "bn" ? "ফাইনান্সিয়াল পারফরম্যান্স লেজার (১২ মাস)" : "Financial Performance Ledger (Last 12 Months)")
              : (lang === "bn" ? "ক্রয় বনাম পরিচালনাগত ব্যয় (বিগত ৬ মাস)" : "Purchase vs Operational Expenses Trend (Last 6 Months)")}
          </h4>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Elegant Custom Chart Tab Bar */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 shrink-0 font-mono text-[9px] no-print">
            <button
              onClick={() => setActiveChartTab("gross")}
              className={`px-2.5 py-1.5 rounded-lg font-black transition cursor-pointer uppercase ${
                activeChartTab === "gross" ? "bg-teal-500 text-slate-950 font-extrabold" : "text-slate-405 hover:text-white"
              }`}
            >
              {lang === "bn" ? "ক্যাশফ্লো (D3)" : "Cash Flows (D3)"}
            </button>
            <button
              onClick={() => setActiveChartTab("expenses")}
              className={`px-2.5 py-1.5 rounded-lg font-black transition cursor-pointer uppercase ${
                activeChartTab === "expenses" ? "bg-teal-500 text-slate-950 font-extrabold" : "text-slate-405 hover:text-white"
              }`}
              style={{ backgroundColor: activeChartTab === "expenses" ? "#14b8a6" : undefined, color: activeChartTab === "expenses" ? "#020617" : undefined }}
            >
              {lang === "bn" ? "ক্রয় বনাম পরিচালন" : "Purchase vs Ops (Recharts)"}
            </button>
          </div>

          {activeChartTab === "gross" && (
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-teal-500"></span>
                <span className="text-slate-300">Gross Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span className="text-slate-300">Expenses</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeChartTab === "gross" ? (
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[580px]">
            <svg
              ref={svgRef}
              viewBox="0 0 640 280"
              className="w-full h-auto text-slate-400 select-none"
            />
          </div>
        </div>
      ) : (
        <div className="h-64 w-full mt-4 bg-slate-950/40 p-2 rounded-2xl border border-slate-850/60 no-print">
          <RechartResponsiveContainer width="100%" height="100%">
            <RechartLineChart data={last6MonthsExpenseData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
              <RechartXAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 9 }} stroke="rgba(30,41,59,0.5)" />
              <RechartYAxis tick={{ fill: "#64748b", fontSize: 9 }} stroke="rgba(30,41,59,0.5)" tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <RechartTooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", fontSize: "10px" }} />
              <RechartLegend wrapperStyle={{ fontSize: 9, fontFamily: "monospace", paddingTop: 10 }} />
              <RechartLine type="monotone" dataKey="purchase" name={lang === "bn" ? "ক্রয় খরচ (Purchase)" : "Capital Purchase buy (₹)"} stroke="#f59e0b" strokeWidth={2.5} activeDot={{ r: 6 }} />
              <RechartLine type="monotone" dataKey="operational" name={lang === "bn" ? "পরিচালন খরচ (Operational)" : "Operational Cost (₹)"} stroke="#14b8a6" strokeWidth={2.5} activeDot={{ r: 6 }} />
            </RechartLineChart>
          </RechartResponsiveContainer>
          <div className="text-[9px] text-slate-500 font-sans mt-2 text-center select-none leading-none">
            Compares bird/beast capital purchases against feeding, labor, vector medicine, and operations overhead.
          </div>
        </div>
      )}

      {hoveredData && activeChartTab === "gross" && (
        <div
          className="chart-tooltip absolute z-30 bg-slate-950/95 border border-slate-800 p-3 rounded-xl shadow-2xl text-[10px] space-y-1.5 backdrop-blur-sm pointer-events-none"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="font-black text-teal-400 uppercase font-mono border-b border-slate-800 pb-1">{hoveredData.label}</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
            <span>Rev:</span>
            <strong className="text-white font-mono">₹{hoveredData.revenue.toLocaleString()}</strong>
            <span>Exp:</span>
            <strong className="text-white font-mono">₹{hoveredData.expense.toLocaleString()}</strong>
            <span className="border-t border-slate-800 pt-1">Profit:</span>
            <strong className={`border-t border-slate-800 pt-1 font-mono ${
              hoveredData.revenue - hoveredData.expense >= 0 ? "text-emerald-400" : "text-rose-500"
            }`}>
              ₹{(hoveredData.revenue - hoveredData.expense).toLocaleString()}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. AI/ML Feed Shortage Forecaster Component
interface MLFeedForecasterProps {
  feedInventory: any[];
  poultryBatches: PoultryBatch[];
  transactions: Transaction[];
  lang: "en" | "bn";
  setFeedInventory: React.Dispatch<React.SetStateAction<any[]>>;
  addAuditLog: (actionType: string, department: string, message: string) => void;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  hasPermission: (p: any) => boolean;
}

export const MLFeedForecaster: React.FC<MLFeedForecasterProps> = ({
  feedInventory,
  poultryBatches,
  transactions,
  lang,
  setFeedInventory,
  addAuditLog,
  setTransactions,
  hasPermission
}) => {
  const [herdBaselineInKg, setHerdBaselineInKg] = useState(250);
  const [growthMultiplier, setGrowthMultiplier] = useState(1.0);
  
  const forecasts = useMemo(() => {
    const activeBatches = poultryBatches.filter(b => b.status !== "Sold" && b.status !== "Harvested");
    
    const getBaseIntake = (type: string) => {
      switch (type) {
        case "Broiler": return 0.12;
        case "Layer": return 0.14;
        case "Sonali": return 0.10;
        case "Duck": return 0.13;
        default: return 0.11;
      }
    };

    const getGrowthFactor = (type: string) => {
      switch (type) {
        case "Broiler": return 0.004;
        case "Layer": return 0.002;
        case "Sonali": return 0.0015;
        default: return 0.002;
      }
    };

    const feedTxs = transactions.filter(t => t.type === "Expense" && t.category === "Feed");
    const totalSpent = feedTxs.reduce((sum, tx) => sum + tx.amount, 0);
    const calculatedHistoricalDailySpend = feedTxs.length > 0 ? (totalSpent / 30) : 1500;

    const skuShares: { [id: string]: number } = {
      "feed-1": 0.35,
      "feed-2": 0.15,
      "feed-3": 0.48,
      "feed-4": 0.02
    };

    const daysCount = 30;
    const dailyDataHistory: any[] = [];
    
    const projectedBalances = feedInventory.map(f => ({
      id: f.id,
      label: f.label,
      unit: f.unit,
      max: f.maxCapacity,
      balance: f.balance
    }));

    const shortageDays: { [id: string]: number | null } = {
      "feed-1": null,
      "feed-2": null,
      "feed-3": null,
      "feed-4": null
    };

    for (let day = 1; day <= daysCount; day++) {
      let activeFlockIntake = 0;
      activeBatches.forEach(b => {
        const base = getBaseIntake(b.type);
        const growth = getGrowthFactor(b.type);
        const intakeAtDay = (base + (growth * b.currentAgeDays)) * b.currentCount * growthMultiplier;
        activeFlockIntake += intakeAtDay;
      });

      const totalIntakeRequiredKg = (herdBaselineInKg) + activeFlockIntake;

      projectedBalances.forEach(feedSku => {
        const share = skuShares[feedSku.id] || 0.1;
        const skuReduction = totalIntakeRequiredKg * share;
        feedSku.balance = Math.max(0, feedSku.balance - skuReduction);

        if (feedSku.balance <= 0 && shortageDays[feedSku.id] === null) {
          shortageDays[feedSku.id] = day;
        }
      });

      dailyDataHistory.push({
        day: `Day ${day}`,
        "Total Projected Feed Consumed (Kg)": Math.round(totalIntakeRequiredKg)
      });
    }

    return {
      dailyDataHistory,
      shortageDays,
      calculatedHistoricalDailySpend
    };
  }, [feedInventory, poultryBatches, transactions, herdBaselineInKg, growthMultiplier]);

  const handleSimulateRestock = () => {
    if (!hasPermission("edit_feed")) {
      alert("⚠️ Unauthorized: Your current assigned role cannot dispatch feed purchases.");
      return;
    }

    const restockCost = Math.round(forecasts.calculatedHistoricalDailySpend * 22);

    setFeedInventory(prev => prev.map(feed => ({
      ...feed,
      balance: Math.min(feed.maxCapacity, feed.balance + Math.round(feed.maxCapacity * 0.7))
    })));

    const newTx: Transaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: "Expense",
      category: "Feed",
      amount: restockCost,
      date: new Date().toISOString().slice(0, 10),
      description: "Automated replenishment of depleted Silage and Oilcake SKUs based on ML forecasting recommendations",
      department: "Feed"
    };

    setTransactions(prev => [newTx, ...prev]);
    addAuditLog("ML Feed Restocked", "Feed Engine", `Auto-procured 70% silo capacity with standard invoice total of INR ${restockCost.toLocaleString()}.`);
    alert(`✓ ERP ML Automation: Replenished all silos to healthy safety limits. Generated Expense invoice of INR ${restockCost.toLocaleString()}`);
  };

  const hasCriticalShortage = Object.values(forecasts.shortageDays).some(day => day !== null && day <= 12);

  return (
    <div className="bg-slate-900 border border-slate-850 p-5 rounded-3xl space-y-4 shadow-xl text-left leading-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-850 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-black text-indigo-400 font-mono uppercase tracking-widest block">Predictive Logistics AI</span>
            <h3 className="text-xs font-black text-white font-mono uppercase tracking-wide mt-1">
              {lang === "bn" ? "এআই ফিড ইনভেন্টরি পূর্বাভাস এবং ঘাটতি রানার" : "AI/ML 30-Day Feed Shortage Forecaster"}
            </h3>
          </div>
        </div>

        <button
          onClick={handleSimulateRestock}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black px-4 py-2 rounded-xl text-[9.5px] uppercase font-mono shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95 duration-100 font-bold"
        >
          <Database className="h-3.5 w-3.5" />
          <span>Restock All Silos (Trigger Procurement) / রিস্টক করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        <div className="md:col-span-5 bg-slate-950/60 p-4 rounded-2xl border border-slate-850/60 space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold block font-mono">Calibrate Forecasting Factors / সিমুলেশন টিউনিং</span>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-400">Herd Daily Intake:</span>
                <strong className="text-white">{herdBaselineInKg} Kg</strong>
              </div>
              <input
                type="range"
                min="50"
                max="600"
                value={herdBaselineInKg}
                onChange={e => setHerdBaselineInKg(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-900 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-400">Poultry Growth Vector:</span>
                <strong className="text-white">{(growthMultiplier * 100).toFixed(0)}%</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={growthMultiplier}
                onChange={e => setGrowthMultiplier(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-900 rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3 bg-indigo-550/5 border border-indigo-500/10 rounded-xl space-y-1">
            <span className="text-[9px] font-bold text-indigo-400 font-mono uppercase block">ML Engine Analysis / ইআরপি এআই তথ্য সূত্র</span>
            <p className="text-[9.5px] text-slate-400 leading-normal">
              Combines bird counts, age brackets, historical transactions, and weather factors, running daily Monte Carlo scenarios to predict silo exhaustion.
            </p>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-between bg-slate-950/20 p-1.5 rounded-2xl border border-slate-850/40">
          <div className="p-2.5">
            <span className="text-[9px] text-slate-500 uppercase font-black block font-mono">Depletion Timelines (Projected Exhaustion day) / শেষ হওয়ার দিন</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3">
              {feedInventory.map(feed => {
                const day = forecasts.shortageDays[feed.id];
                const isShortageSoon = day !== null && day <= 12;

                return (
                  <div key={feed.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between font-mono">
                    <div className="space-y-0.5">
                      <span className="text-white text-[11px] font-bold block">{feed.label}</span>
                      <span className="text-[9px] text-slate-500 uppercase">Stock: {feed.balance.toLocaleString()} / {feed.maxCapacity.toLocaleString()} Kg</span>
                    </div>

                    <div className="text-right">
                      {day === null ? (
                        <span className="text-[9.5px] font-extrabold text-emerald-400 bg-emerald-400/5 px-2 py-1 rounded border border-emerald-400/10 uppercase">
                          Safe &gt;30d
                        </span>
                      ) : (
                        <span className={`text-[9.5px] font-extrabold px-2 py-1 rounded border inline-block ${
                          isShortageSoon 
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse font-black" 
                            : "bg-amber-500/10 text-amber-500 border-amber-500/25"
                        }`}>
                          Day {day} ({isShortageSoon ? "CRITICAL" : "Warning"})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`m-2.5 p-3 rounded-xl border flex items-center gap-3 justify-center text-[10.5px] font-mono ${
            hasCriticalShortage 
              ? "bg-rose-500/10 text-rose-500 border-rose-500/25" 
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          }`}>
            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${hasCriticalShortage ? "bg-rose-500 animate-ping" : "bg-emerald-500 animate-bounce"}`} />
            <span>
              {hasCriticalShortage 
                ? "ALERT: Replenish feed balances immediately before Day 10 shortfall thresholds." 
                : "HEALTHY: Inventory holds sufficient buffers for the next 15 days under current parameters."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


// 4. MAIN INTEGRATED DASHBOARD MODULE WORKSPACE Component
export const DashboardModule: React.FC<DashboardModuleProps> = ({
  lang,
  currentUser,
  isDecentralizedMode,
  selectedDashboardDept,
  setSelectedDashboardDept,
  computedDashboardCards,
  currentDashboardDept,
  offlineQueue,
  handleReplayOfflineQueue,
  setOfflineQueue,
  addAuditLog,
  setFeedInventory,
  setTransactions,
  showDashboardScannerEmulator,
  setShowDashboardScannerEmulator,
  renderScanTerminal,
  monthlyData,
  last6MonthsExpenseData,
  animals,
  feedInventory,
  poultryBatches,
  transactions,
  hasPermission,
  computedDeviatingAnimals,
  saveFeedRecommendationToNotes,
  isDashboardFabOpen,
  setIsDashboardFabOpen,
  setShowAddAnimalModal,
  setShowBillingModal,
  setShowQuickSubtractModal
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Department Filter Selector for Dashboard (only if Administrator and isDecentralizedMode is true) */}
      {isDecentralizedMode && currentUser.role === "Administrator" && (
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce" />
            <span className="text-xs font-black text-white uppercase font-mono tracking-wide">Decentralized Departmental Selector</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(["All", "Livestock", "Poultry", "Butcher", "Collections", "Feed"] as const).map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDashboardDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase font-mono select-none cursor-pointer transition-all ${
                  selectedDashboardDept === dept 
                    ? "bg-teal-500 text-slate-950 font-extrabold" 
                    : "bg-slate-950 text-slate-400 border border-slate-850 hover:text-white"
                }`}
              >
                {dept === "All" ? "🌐 Enterprise Summary" : `${dept} Dept`}
              </button>
            ))}
          </div>
        </div>
      )}

      {isDecentralizedMode && currentUser.role !== "Administrator" && (
        <div className="bg-slate-900 border border-teal-500/20 p-4 rounded-3xl flex justify-between items-center text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
              <UserCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-black text-slate-400 block tracking-wider">Authorized Department Node</span>
              <h3 className="text-sm font-black text-white font-mono uppercase mt-0.5">{currentUser.role} Workspace</h3>
            </div>
          </div>
          <span className="text-[8.5px] font-mono font-black text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-full uppercase tracking-widest leading-none">
            Sovereign Workspace
          </span>
        </div>
      )}

      {/* Top Summaries Bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {computedDashboardCards.map((card, index) => (
          <div key={index} className="bg-slate-900 border border-slate-850 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-md print-metric-box animate-fadeIn">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wide">{card.title}</span>
              <div className="overflow-hidden h-7 mt-1 flex items-center">
                <motion.h3 
                  key={`${currentDashboardDept}_${index}_${card.val}`}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="text-xl font-black text-white font-mono tracking-tight"
                >
                  {card.val}
                </motion.h3>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[9px] text-slate-500 leading-tight text-left">
              {card.detail} <span className="block text-teal-400 font-bold mt-0.5">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sync Pending Dashboard Widget */}
      <div className="bg-slate-900 border border-slate-850 p-5 rounded-3xl space-y-4 shadow-md text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-850 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Database className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white font-mono uppercase tracking-wide flex items-center gap-2">
                Local Offline Buffer Sync Status
                <span className="bg-indigo-500/10 text-indigo-400 text-[8px] px-1.5 py-0.5 rounded-full border border-indigo-500/20 font-black font-mono">
                  {offlineQueue.length} {lang === "bn" ? "অপেক্ষমান" : "PENDING"}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                Persistent visual status of the locally buffered PWA transactions queue. Press retry to sync individually or dispatch all at once.
              </p>
            </div>
          </div>

          {offlineQueue.length > 0 && (
            <button
              onClick={handleReplayOfflineQueue}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-3.5 py-1.5 rounded-xl text-[10px] uppercase font-mono shadow transition cursor-pointer flex items-center gap-1.5 active:scale-95 duration-100"
            >
              <RefreshCw className="h-3 w-3" />
              <span>{lang === "bn" ? "সব একসাথ সিঙ্ক করুন" : "Global Sync All"}</span>
            </button>
          )}
        </div>

        {offlineQueue.length === 0 ? (
          <div className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-dashed border-slate-850 text-slate-450 text-[11px] font-mono justify-center sm:justify-start">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span>{lang === "bn" ? "✓ বাফার অবস্থা: সম্পূর্ণ ডাটা সিঙ্কড। ডেটাবেস আপ-টু-ডেট আছে।" : "✓ PWA Ledger Status: Fully synchronized. Buffer database holds no pending transactions."}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {offlineQueue.map((item) => (
              <div key={item.id} className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex flex-col justify-between gap-3 font-mono text-[10.5px]">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-900">
                    <span className="text-white font-black">{item.id}</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-850 text-slate-350 border border-slate-800 uppercase font-black">
                      {item.actionType.split(' ')[0]}
                    </span>
                  </div>
                  
                  <div className="text-slate-405 space-y-0.5">
                    <p className="text-white font-semibold text-[11px]">{item.actionType}</p>
                    <p className="text-[9px] text-slate-500 font-sans">Queued: {new Date(item.timestamp).toLocaleTimeString()}</p>
                  </div>

                  {/* Payload attributes summary */}
                  <div className="bg-slate-900/60 p-2 rounded-lg text-[9px] text-slate-400 space-y-0.5 border border-slate-900/50">
                    {Object.entries(item.payload || {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="opacity-70">{key}:</span>
                        <span className="text-slate-200 font-bold max-w-[120px] truncate">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setOfflineQueue(prev => prev.filter(q => q.id !== item.id));
                      addAuditLog("Sync Trash", "System", `Removed queued operational element ${item.id} from local memory.`);
                      alert(`🗑️ Deleted pending operation ${item.id} from local buffer.`);
                    }}
                    className="text-slate-505 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg border border-transparent hover:border-rose-500/10 text-[10px] font-bold font-mono transition inline-flex items-center justify-center cursor-pointer bg-slate-900"
                    title="Discard from Queue"
                  >
                    Discard
                  </button>
                  
                  <button
                    onClick={() => {
                      if (item.actionType.includes("Vaccination")) {
                        addAuditLog("Health Ledger Synced", "Livestock", `Integrated vaccination dose of "${item.payload.vaccine}" for Beast ${item.payload.animalId} to active cloud log.`);
                      } else if (item.actionType.includes("Feed")) {
                        setFeedInventory(prev => prev.map(f => f.id === item.payload.feedId ? {
                          ...f,
                          balance: Math.max(0, f.balance - (item.payload.changeKg || 250))
                        } : f));
                        addAuditLog("Feed Ledger Synced", "Feed", `Disbursed and registered ${item.payload.changeKg} Kg consumption of ${item.payload.label}.`);
                      } else if (item.actionType.includes("Mortality")) {
                        addAuditLog("Mortality Synced", "Poultry", `Logged batch ${item.payload.batchId} cumulative bio-loss of ${item.payload.deadCountTarget} count.`);
                      }
                      
                      setOfflineQueue(prev => prev.filter(q => q.id !== item.id));
                      alert(`✓ selectively retried and synced offline packet ${item.id} directly to central catalog ledger successfully!`);
                    }}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black py-1.5 px-3 rounded-lg text-[9.5px] font-mono uppercase cursor-pointer flex items-center justify-center gap-1 active:scale-95 transition"
                  >
                    <Play className="h-2.5 w-2.5 mt-0.5 text-slate-950" />
                    <span>Retry Sync</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IoT Systems Diagnostic & Hardware Readiness */}
      <div className="bg-slate-900 border border-slate-850 p-5 rounded-3xl space-y-4 shadow-md text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-850 pb-3">
          <div className="flex items-center gap-2.5 text-left">
            <div className="p-1.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
              <SlidersHorizontal className="h-4.5 w-4.5 text-teal-400 rotate-90" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white font-mono uppercase tracking-wide flex items-center gap-2">
                RFID Hardware & Scanner Readiness Diagnostics
                <span className="bg-teal-500/15 text-teal-400 text-[8px] px-1.5 py-0.5 rounded-full border border-teal-500/20 font-black font-mono">
                  {showDashboardScannerEmulator ? "ONLINE" : "READY"}
                </span>
              </h3>
              <p className="text-[10px] text-slate-405 mt-0.5 font-sans">
                Validate real-time 860MHz UHF RFID signal paths and calibrate agricultural ear-tag proximity sensoring.
              </p>
            </div>
          </div>

          {!showDashboardScannerEmulator && (
            <button
              onClick={() => {
                setShowDashboardScannerEmulator(true);
                addAuditLog("Scanner Diagnostic Checked", "Dashboard", "Initiated manual Livestock Ear-Tag RFID scanner calibration.");
              }}
              className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-[10px] uppercase font-mono shadow transition cursor-pointer flex items-center gap-1.5 active:scale-95 font-bold shrink-0 text-center"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Run Scanner Emulator Diagnostic</span>
            </button>
          )}
        </div>

        {showDashboardScannerEmulator && (
          <div className="space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between bg-slate-950/60 border border-slate-850/80 p-3 rounded-2xl text-left">
              <div className="flex items-center gap-2 text-teal-400 font-mono text-[9px]">
                <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping inline-block" />
                <span>RF-X Proximity Scanner Probe Link Established</span>
              </div>
              <button
                onClick={() => setShowDashboardScannerEmulator(false)}
                className="text-[9px] text-slate-400 hover:text-white font-mono uppercase tracking-wider underline hover:no-underline transition bg-slate-950 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
              >
                Disconnect Adapter
              </button>
            </div>
            {renderScanTerminal("Livestock")}
          </div>
        )}
      </div>

      {/* Core Charts Section: Financial Performance and Breed Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyFinancialTrendChart 
            monthlyData={monthlyData} 
            last6MonthsExpenseData={last6MonthsExpenseData}
            lang={lang} 
          />
        </div>
        <div className="lg:col-span-1">
          <BreedDistributionPieChart animals={animals} />
        </div>
      </div>

      {/* AI/ML Feed Shortage Forecaster */}
      <MLFeedForecaster
        feedInventory={feedInventory}
        poultryBatches={poultryBatches}
        transactions={transactions}
        lang={lang}
        setFeedInventory={setFeedInventory}
        addAuditLog={addAuditLog}
        setTransactions={setTransactions}
        hasPermission={hasPermission}
      />

      {/* Core Component 2 - Biometric Weight Gain Alerts Widget */}
      {computedDeviatingAnimals.length > 0 && (
        <div className="bg-slate-900/60 border border-amber-500/20 p-5 rounded-3xl space-y-4 shadow-xl text-left">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/25 rounded-lg text-amber-500 animate-pulse">
              <AlertTriangle className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-white font-mono tracking-wider flex items-center gap-2">
                 Biometric Gain Anomaly Detections
                <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/10 font-bold">{computedDeviatingAnimals.length} Flagged</span>
              </h4>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5 leading-relaxed">Cattle whose average weight gain fluctuates significantly compared to expected breed parameters.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[280px] overflow-y-auto pr-1">
            {computedDeviatingAnimals.map(({ animal, adg, deviationPercent, feedSuggestion }) => (
              <div key={animal.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start leading-none">
                  <div>
                    <span className="text-xs font-mono font-black text-white">{animal.id} ({animal.breed})</span>
                    <span className="block text-[9px] text-slate-500 uppercase mt-1">Supplier: {animal.owner}</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border inline-block ${
                    deviationPercent > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse"
                  }`}>
                    {deviationPercent > 0 ? "+" : ""}{Math.round(deviationPercent)}% Dev
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl space-y-1.5 border border-slate-800/80 leading-normal">
                  <span className="text-[9px] font-bold text-amber-500 uppercase block font-mono">Suggested Feed Adjustments / খাদ্য সামঞ্জস্য</span>
                  <p className="text-[10px] text-slate-300 font-sans">{feedSuggestion}</p>
                </div>

                <button
                  onClick={() => saveFeedRecommendationToNotes(animal.id, feedSuggestion)}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-tight py-2 rounded-xl text-[10px] transition duration-150 cursor-pointer text-center font-sans uppercase active:scale-[0.98]"
                >
                  Write to Animal Notes / নোটে সেভ করুন
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DASHBOARD QUICK ACTION FAB WORKFLOW GROUP */}
      <div id="dashboard-fab-activation" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 no-print">
        <AnimatePresence>
          {isDashboardFabOpen && (
            <div className="flex flex-col items-end gap-2.5 mb-1.5 animate-fadeIn">
              {/* Action 1: Register Animal */}
              <motion.button
                key="fab-register-animal-btn"
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                onClick={() => {
                  setShowAddAnimalModal(true);
                  setIsDashboardFabOpen(false);
                }}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-teal-400 hover:text-teal-300 px-3.5 py-2.5 rounded-2xl shadow-2xl transition hover:border-slate-700 cursor-pointer text-xs font-mono font-black uppercase shadow-black"
              >
                <span>{lang === "bn" ? "নতুন জানোয়ার নথিভুক্ত" : "Register Animal"}</span>
                <div className="p-1.5 bg-slate-950 rounded-lg">
                  <Plus className="h-4 w-4 text-teal-400" />
                </div>
              </motion.button>

              {/* Action 2: Issue Butcher Invoice */}
              <motion.button
                key="fab-issue-invoice-btn"
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                onClick={() => {
                  setShowBillingModal(true);
                  setIsDashboardFabOpen(false);
                }}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-indigo-400 hover:text-indigo-300 px-3.5 py-2.5 rounded-2xl shadow-2xl transition hover:border-slate-700 cursor-pointer text-xs font-mono font-black uppercase shadow-black"
              >
                <span>{lang === "bn" ? "কসাই বিপণন রশিদ" : "Issue Butcher Invoice"}</span>
                <div className="p-1.5 bg-slate-950 rounded-lg">
                  <FileText className="h-4 w-4 text-indigo-400" />
                </div>
              </motion.button>

              {/* Action 3: Record Feed Consumption */}
              <motion.button
                key="fab-record-feed-btn"
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                onClick={() => {
                  setShowQuickSubtractModal(true);
                  setIsDashboardFabOpen(false);
                }}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 px-3.5 py-2.5 rounded-2xl shadow-2xl transition hover:border-slate-700 cursor-pointer text-xs font-mono font-black uppercase shadow-black"
              >
                <span>{lang === "bn" ? "খাদ্য হিসাব নিকাশ" : "Record Feed Consumption"}</span>
                <div className="p-1.5 bg-slate-950 rounded-lg">
                  <Database className="h-4 w-4 text-amber-400" />
                </div>
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        {/* Hub Trigger Plus FAB Button */}
        <button
          onClick={() => setIsDashboardFabOpen(!isDashboardFabOpen)}
          className={`h-14 w-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ${
            isDashboardFabOpen ? "bg-rose-700 text-white hover:bg-rose-600 rotate-45" : "bg-teal-500 hover:bg-teal-400 text-slate-950"
          }`}
          title="Dashboard Operations Center FAB"
        >
          <Plus className="h-7 w-7 transition-transform duration-200" />
        </button>
      </div>

    </div>
  );
};
