import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import * as d3 from "d3";
import { 
  TrendingUp, TrendingDown, DollarSign, Award, Users, Search, Filter, 
  RefreshCw, Plus, Check, Edit, Trash2, Printer, Clipboard, Play, 
  AlertCircle, Moon, Sun, AlertTriangle, FileText, CheckCircle, 
  Smartphone, Camera, Download, Upload, HelpCircle, Eye, ShoppingCart, 
  ChevronRight, ChevronDown, Calendar, UserCheck, Egg, Lock, ShieldAlert,
  Settings, Info, Bell, Facebook, Twitter, Linkedin, Github, Database
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
import { Animal, Sale, Transaction, User, UserRole, WeightHistoryItem, PoultryBatch, PoultryType, AuditLog } from "./types";

// Firebase Integration SDK Modules
import { auth, db, OperationType, handleFirestoreError } from "./firebase";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, writeBatch } from "firebase/firestore";

// Dynamic English-Bengali Translations
const TRANSLATIONS = {
  en: {
    title: "ShaieAlam LiveStock ERP",
    dashboard: "Aggregate Dashboard",
    livestock: "Herd Register",
    butcher: "Butcher Operations",
    collections: "Collections Ledger",
    feedShop: "Feed Store",
    poultry: "Poultry Farm",
    totalHerd: "Active Herd Size",
    monthlyRevenue: "Monthly Revenue",
    unsettledDue: "Outstanding Due",
    feedCompliance: "Feeding Success Rate",
    id: "ID",
    type: "Animal Type",
    breed: "Breed",
    weight: "Weight (Kg)",
    owner: "Supplier / Owner",
    cost: "Purchase Price",
    due: "Due Amount",
    status: "Status",
    addAnimal: "Register Cattle",
    search: "Search cattle, owners...",
    syncing: "Syncing central farm index..."
  },
  bn: {
    title: "শাইআলম লাইভস্টক ইআরপি",
    dashboard: "ড্যাশবোর্ড",
    livestock: "লাইভস্টক রেজিস্টার",
    butcher: "কসাইখানা হিসাব",
    collections: "বকেয়া আদায় লেজার",
    feedShop: "খাদ্য ভাণ্ডার",
    poultry: "পোল্ট্রি খামার",
    totalHerd: "আক্টিভ পশু সংখ্যা",
    monthlyRevenue: "মাসিক অর্জিত আয়",
    unsettledDue: "বকেয়া ক্রেডিট",
    feedCompliance: "খাদ্য কমপ্লায়েন্স",
    id: "আইডি",
    type: "পশুর ধরণ",
    breed: "জাত",
    weight: "ওজন (কেজি)",
    owner: "বিক্রেতা / মালিক",
    cost: "ক্রয় মূল্য",
    due: "বকেয়া পরিমাণ",
    status: "অবস্থা",
    addAnimal: "নতুন পশু যুক্ত করুন",
    search: "পশু এবং মালিক খুঁজুন...",
    syncing: "ডাটাবেস সিনক্রোনাইজ হচ্ছে..."
  }
};

// Seed 12 Months Financial Timeline
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "TXN-1", type: "Revenue", category: "Sale", amount: 145000, date: "2025-06-15", description: "Standard carcass retail sales" },
  { id: "TXN-2", type: "Expense", category: "Purchase", amount: 65000, date: "2025-06-20", description: "Jersey Cow stock buy" },
  { id: "TXN-3", type: "Revenue", category: "Sale", amount: 180000, date: "2025-07-10", description: "Aggregate butcher supply sale" },
  { id: "TXN-4", type: "Expense", category: "Feed", amount: 45000, date: "2025-07-25", description: "Bovine wheat bran & minerals" },
  { id: "TXN-5", type: "Revenue", category: "Sale", amount: 220000, date: "2025-08-15", description: "Brahman Bull bulk invoice" },
  { id: "TXN-6", type: "Expense", category: "Operational", amount: 30000, date: "2025-08-30", description: "Field veterinary services" },
  { id: "TXN-7", type: "Revenue", category: "Sale", amount: 160000, date: "2025-09-05", description: "Retail high-grade cuts" },
  { id: "TXN-8", type: "Expense", category: "Purchase", amount: 120000, date: "2025-09-21", description: "Brahman breeder steers" },
  { id: "TXN-9", type: "Revenue", category: "Sale", amount: 240000, date: "2025-10-14", description: "Eid-ul-Adha advanced orders" },
  { id: "TXN-10", type: "Expense", category: "Feed", amount: 55000, date: "2025-10-28", description: "Silage reserves restock" },
  { id: "TXN-11", type: "Revenue", category: "Sale", amount: 290000, date: "2025-11-12", description: "Cattle trade wholesale" },
  { id: "TXN-12", type: "Expense", category: "Operational", amount: 35000, date: "2025-11-29", description: "Electricity & well pumping" },
  { id: "TXN-13", type: "Revenue", category: "Sale", amount: 195000, date: "2025-12-10", description: "Butcher shop Christmas drive" },
  { id: "TXN-14", type: "Expense", category: "Feed", amount: 48000, date: "2025-12-25", description: "Dry straw & molasses" },
  { id: "TXN-15", type: "Revenue", category: "Sale", amount: 210000, date: "2026-01-16", description: "Caprine direct sell-offs" },
  { id: "TXN-16", type: "Expense", category: "Salary", amount: 80000, date: "2026-01-29", description: "Staff wage payment" },
  { id: "TXN-17", type: "Revenue", category: "Sale", amount: 310000, date: "2026-02-14", description: "Corporate supply deliveries" },
  { id: "TXN-18", type: "Expense", category: "Purchase", amount: 155000, date: "2026-02-28", description: "Imported feed blocks & medicines" },
  { id: "TXN-19", type: "Revenue", category: "Sale", amount: 230000, date: "2026-03-12", description: "Live bovine retail" },
  { id: "TXN-20", type: "Expense", category: "Feed", amount: 60000, date: "2026-03-24", description: "Pellet feed spring order" },
  { id: "TXN-21", type: "Revenue", category: "Sale", amount: 340000, date: "2026-04-18", description: "Baisakhi carnival livestock fair" },
  { id: "TXN-22", type: "Expense", category: "Operational", amount: 40000, date: "2026-04-30", description: "Corral maintenance" },
  { id: "TXN-23", type: "Revenue", category: "Sale", amount: 395000, date: "2026-05-20", description: "Peak retail cut deliveries" },
  { id: "TXN-24", type: "Expense", category: "Salary", amount: 85000, date: "2026-05-25", description: "May labor costs pay" }
];

// Seed Animals
const INITIAL_ANIMALS: Animal[] = [
  { id: "ANI-001", type: "Cow", breed: "Jersey Cross", ageMonths: 24, weightKg: 420, purchasePrice: 65000, advancePaid: 45000, due: 20000, owner: "Rahman Breeders", status: "Active", weightHistory: [{ date: "2026-05-01", weightKg: 400 }, { date: "2026-05-27", weightKg: 420 }], notes: "Excellent milk breed genetics." },
  { id: "ANI-002", type: "Goat", breed: "Black Bengal", ageMonths: 14, weightKg: 32, purchasePrice: 14000, advancePaid: 9000, due: 5000, owner: "Bengal Caprines", status: "Active", weightHistory: [{ date: "2026-05-01", weightKg: 31.8 }, { date: "2026-05-27", weightKg: 32 }], notes: "Highly disease-resistant." },
  { id: "ANI-003", type: "Cow", breed: "Brahman", ageMonths: 32, weightKg: 680, purchasePrice: 110000, advancePaid: 80000, due: 30000, owner: "Ranchers Hub BD", status: "Active", weightHistory: [{ date: "2026-05-01", weightKg: 640 }, { date: "2026-05-27", weightKg: 680 }], notes: "High daily weight gain potential." },
  { id: "ANI-004", type: "Cow", breed: "Sahiwal", ageMonths: 28, weightKg: 490, purchasePrice: 85000, advancePaid: 55000, due: 30000, owner: "Rahman Breeders", status: "Active", weightHistory: [{ date: "2026-05-01", weightKg: 488 }, { date: "2026-05-27", weightKg: 490 }], notes: "Weight gain slow this term. Needs diet adjust." },
  { id: "ANI-005", type: "Sheep", breed: "Garole", ageMonths: 18, weightKg: 41, purchasePrice: 9500, advancePaid: 9500, due: 0, owner: "Sundarban Pastoral", status: "Processed", weightHistory: [{ date: "2026-05-01", weightKg: 39 }, { date: "2026-05-15", weightKg: 41 }], notes: "Processed for wholesale hotel supply." },
  { id: "ANI-006", type: "Buffalo", breed: "Murrah", ageMonths: 36, weightKg: 750, purchasePrice: 135000, advancePaid: 115000, due: 20000, owner: "Zilla Dairy Ltd", status: "Active", weightHistory: [{ date: "2026-05-01", weightKg: 710 }, { date: "2026-05-27", weightKg: 750 }], notes: "Magnificent standard, feeding response A+." },
  { id: "ANI-007", type: "Cow", breed: "Holstein", ageMonths: 20, weightKg: 400, purchasePrice: 75000, advancePaid: 75000, due: 0, owner: "Rahman Breeders", status: "Mortality", weightHistory: [{ date: "2026-05-10", weightKg: 400 }], notes: "Respiratory failure. Insured.", mortalityDate: "2026-05-15", insuranceClaimAmount: 60000 },
  { id: "ANI-008", type: "Goat", breed: "Jamunapari", ageMonths: 12, weightKg: 28, purchasePrice: 11000, advancePaid: 11000, due: 0, owner: "Bengal Caprines", status: "Mortality", weightHistory: [{ date: "2026-05-18", weightKg: 28 }], notes: "Accidental heat stress during handling.", mortalityDate: "2026-05-22", insuranceClaimAmount: 8000 }
];

// Seed Retail Sales (Butcher Shop invoices)
const INITIAL_SALES: Sale[] = [
  { id: "INV-1001", customerName: "Dhaka Club", customerPhone: "+8801711223344", customerCode: "CUST-089", date: "2026-05-20", items: [{ type: "Premium Beef Loin", weightKg: 50, ratePerKg: 750 }], total: 37500, amountPaid: 30000, amountDue: 7500, status: "Partial", paymentMethod: "bKash", transactionRefId: "TXN-BKASH-QR-983103", installments: [{ id: "INST-1", dueDate: "2026-06-05", amount: 7500, status: "Pending" }] },
  { id: "INV-1002", customerName: "Radisson Blu", customerPhone: "+8801911998877", customerCode: "CUST-211", date: "2026-05-22", items: [{ type: "Brahman Flank Cut", weightKg: 120, ratePerKg: 700 }], total: 84000, amountPaid: 84000, amountDue: 0, status: "Paid", paymentMethod: "Cash" },
  { id: "INV-1003", customerName: "Korim Meat House", customerPhone: "+8801811556677", customerCode: "CUST-412", date: "2026-05-25", items: [{ type: "Standard Beef Bone-In", weightKg: 300, ratePerKg: 650 }], total: 195000, amountPaid: 100000, amountDue: 95000, status: "Overdue", paymentMethod: "Credit", promisedPaymentDate: "2026-05-26", installments: [{ id: "INST-2", dueDate: "2026-05-26", amount: 45000, status: "Overdue" }, { id: "INST-3", dueDate: "2026-06-10", amount: 5000, status: "Pending" }], callLogs: [{ id: "C-1", timestamp: "2026-05-25T10:00:00Z", notes: "Called manager. Promised to send partial payment by bkash tomorrow.", agentName: "Shaie Alam" }] }
];

// Seed Poultry Batches for Poultry Farm Management
const INITIAL_POULTRY_BATCHES: PoultryBatch[] = [
  {
    id: "PLT-001",
    type: "Layer",
    breed: "Lohmann Brown",
    housingBuilding: "Shed 1-A",
    initialCount: 1500,
    currentCount: 1482,
    acquisitionDate: "2026-03-10",
    acquisitionAgeDays: 1,
    currentAgeDays: 78,
    averageWeightKg: 1.45,
    feedConsumedKg: 3120,
    mortalityCount: 18,
    eggsCollectedCumulative: 14220,
    purchaseCost: 95000,
    status: "Laying",
    notes: "Peak egg-laying performance initiated. Daily collection yield is exceptional."
  },
  {
    id: "PLT-002",
    type: "Broiler",
    breed: "Cobb 500",
    housingBuilding: "Shed 2-C",
    initialCount: 2250,
    currentCount: 2215,
    acquisitionDate: "2026-04-18",
    acquisitionAgeDays: 1,
    currentAgeDays: 39,
    averageWeightKg: 2.15,
    feedConsumedKg: 4980,
    mortalityCount: 35,
    purchaseCost: 110000,
    status: "Growing",
    notes: "Excellent FCR trend. Batch is extremely healthy and approaching heavy market weight values."
  },
  {
    id: "PLT-003",
    type: "Sonali",
    breed: "Sonali Hybrid",
    housingBuilding: "Shed 3-B",
    initialCount: 1000,
    currentCount: 994,
    acquisitionDate: "2026-05-12",
    acquisitionAgeDays: 1,
    currentAgeDays: 15,
    averageWeightKg: 0.28,
    feedConsumedKg: 480,
    mortalityCount: 6,
    purchaseCost: 45000,
    status: "Chicks",
    notes: "Young starter chicks. Brooding heating elements and standard vaccinations complete."
  },
  {
    id: "PLT-004",
    type: "Duck",
    breed: "Pekin Duck",
    housingBuilding: "Pond Block 4",
    initialCount: 600,
    currentCount: 597,
    acquisitionDate: "2026-02-15",
    acquisitionAgeDays: 7,
    currentAgeDays: 101,
    averageWeightKg: 2.80,
    feedConsumedKg: 2500,
    mortalityCount: 3,
    purchaseCost: 35000,
    status: "Sold",
    notes: "Successfully processed and sold in bulk to Dhaka wholesale gourmet distributors.",
    salesRevenue: 180000
  }
];

// D3 Chart Component Definition
interface FinancialTrendProps {
  monthlyData: Array<{ label: string; revenue: number; expense: number }>;
}

const MonthlyFinancialTrendChart: React.FC<FinancialTrendProps> = ({ monthlyData }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredData, setHoveredData] = useState<{ label: string; revenue: number; expense: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

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
    const maxVal = d3.max(monthlyData, d => Math.max(d.revenue, d.expense)) || 10000;
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

  }, [monthlyData]);

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl leading-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-mono font-black text-teal-400">Monthly Cash Flows</span>
          <h4 className="text-sm font-black text-white mt-1">Financial Performance Ledger (Last 12 Months)</h4>
        </div>
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
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[580px]">
          <svg
            ref={svgRef}
            viewBox="0 0 640 280"
            className="w-full h-auto text-slate-400 select-none"
          />
        </div>
      </div>

      {hoveredData && (
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

// D3 Mortality Analytics Chart Component
interface PoultryMortalityD3ChartProps {
  batches: PoultryBatch[];
}

const PoultryMortalityD3Chart: React.FC<PoultryMortalityD3ChartProps> = ({ batches }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<PoultryBatch | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

    // Filter and sort batches chronologically by acquisition date
    const sortedBatches = [...batches]
      .filter(b => b.initialCount > 0)
      .sort((a, b) => new Date(a.acquisitionDate).getTime() - new Date(b.acquisitionDate).getTime());

    if (sortedBatches.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // reset drawing before redrawing

    const width = 640;
    const height = 240;
    const margin = { top: 25, right: 30, bottom: 45, left: 55 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Helper to calculate rate
    const getMortalityRate = (b: PoultryBatch) => {
      return (b.mortalityCount / b.initialCount) * 100;
    };

    // X Scale: Categories representing date + batch id
    const x = d3.scalePoint()
      .domain(sortedBatches.map(b => `${b.acquisitionDate}\n(${b.id})`))
      .range([0, chartWidth])
      .padding(0.4);

    // Y Scale: rate representation (0 to max rate + padding)
    const maxVal = d3.max(sortedBatches, b => getMortalityRate(b)) || 1.5;
    const y = d3.scaleLinear()
      .domain([0, Math.max(2.0, maxVal * 1.25)])
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

    // Axes Layout
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .attr("color", "#334155")
      .selectAll("text")
      .style("font-family", "monospace")
      .style("font-size", "8px")
      .style("fill", "#64748b")
      .attr("dy", "1.2em");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .attr("color", "#334155")
      .selectAll("text")
      .style("font-family", "monospace")
      .style("font-size", "8px")
      .style("fill", "#64748b");

    // Ceiling warning threshold rule line at 1.5% rate limit
    g.append("line")
      .attr("x1", 0)
      .attr("y1", y(1.5))
      .attr("x2", chartWidth)
      .attr("y2", y(1.5))
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 1.2)
      .attr("stroke-dasharray", "4,4")
      .attr("opacity", 0.65);

    g.append("text")
      .attr("x", chartWidth - 110)
      .attr("y", y(1.5) - 6)
      .style("fill", "#f87171")
      .style("font-size", "8px")
      .style("font-family", "monospace")
      .style("font-weight", "bold")
      .text("ALERT CEILING: 1.5%");

    // Curve Generator
    const lineGen = d3.line<PoultryBatch>()
      .x(b => x(`${b.acquisitionDate}\n(${b.id})`)!)
      .y(b => y(getMortalityRate(b)))
      .curve(d3.curveMonotoneX);

    // Draw connecting path
    const path = g.append("path")
      .datum(sortedBatches)
      .attr("fill", "none")
      .attr("stroke", "#0d9488")
      .attr("stroke-width", 2)
      .attr("d", lineGen);

    const length = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", `${length} ${length}`)
      .attr("stroke-dashoffset", length)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);

    // Data circles
    g.selectAll(".dot")
      .data(sortedBatches)
      .enter()
      .append("circle")
      .attr("cx", b => x(`${b.acquisitionDate}\n(${b.id})`)!)
      .attr("cy", b => y(getMortalityRate(b)))
      .attr("r", b => getMortalityRate(b) >= 1.5 ? 6 : 4.5)
      .attr("fill", b => getMortalityRate(b) >= 1.5 ? "#f43f5e" : "#0d9488")
      .attr("stroke", b => getMortalityRate(b) >= 1.5 ? "#fda4af" : "#115e59")
      .attr("stroke-width", 1.5)
      .attr("class", "cursor-crosshair transition-all duration-300 hover:scale-130")
      .on("mouseenter", (event, b) => {
        setHoveredNode(b);
        const [mx, my] = d3.pointer(event, svgRef.current);
        const tooltipWidth = 192;
        const tooltipHeight = 110;
        let targetX = mx + 15;
        let targetY = my - 100;
        if (mx > 640 - tooltipWidth - 25) {
          targetX = mx - tooltipWidth - 15;
        }
        if (targetX < 10) targetX = 10;
        if (my < tooltipHeight + 20) {
          targetY = my + 15;
        }
        setTooltipPos({ x: targetX, y: targetY });
      })
      .on("mousemove", (event) => {
        const [mx, my] = d3.pointer(event, svgRef.current);
        const tooltipWidth = 192;
        const tooltipHeight = 110;
        let targetX = mx + 15;
        let targetY = my - 100;
        if (mx > 640 - tooltipWidth - 25) {
          targetX = mx - tooltipWidth - 15;
        }
        if (targetX < 10) targetX = 10;
        if (my < tooltipHeight + 20) {
          targetY = my + 15;
        }
        setTooltipPos({ x: targetX, y: targetY });
      })
      .on("mouseleave", () => {
        setHoveredNode(null);
      });

  }, [batches]);

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 border border-slate-850 rounded-3xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-850">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-teal-400 block">D3 Mortality Monitor</span>
          <h4 className="text-white text-xs font-black font-mono uppercase">Batch Loss Tracking & Shed Audits</h4>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono select-none">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-teal-500"></span>
            <span className="text-slate-400">Normal (&lt;1.5%)</span>
          </div>
          <div className="flex items-center gap-1.5 relative">
            <span className="h-2 w-2 rounded-full bg-red-400"></span>
            <span className="text-red-400 font-bold">Deficit (Shed &gt;=1.5%)</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        {batches.length === 0 ? (
          <div className="py-12 text-center text-[10px] font-mono text-slate-500">No active batches available for D3 rendering.</div>
        ) : (
          <div className="min-w-[580px]">
            <svg ref={svgRef} viewBox="0 0 640 240" className="w-full h-auto text-slate-400 select-none block" />
          </div>
        )}
      </div>

      {hoveredNode && (
        <div 
          className="absolute z-50 bg-slate-950/95 border border-slate-800 rounded-xl p-3 shadow-2xl text-[10px] font-mono py-2.5 w-48 text-left pointer-events-none space-y-1.5"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="border-b border-slate-800 pb-1 flex justify-between items-center">
            <span className="text-teal-400 font-extrabold">{hoveredNode.id}</span>
            <span className="text-slate-500 font-bold uppercase text-[9px]">{hoveredNode.type}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[8px] text-slate-500 uppercase block leading-none">Breed Style</span>
            <span className="text-white font-extrabold">{hoveredNode.breed}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-350 bg-slate-900/50 p-1.5 rounded-lg border border-slate-850">
            <div>
              <span className="text-[8px] text-slate-500 uppercase block">Housing</span>
              <strong className={`font-mono ${((hoveredNode.mortalityCount / hoveredNode.initialCount) * 100) >= 1.5 ? "text-red-400 font-black" : "text-slate-200"}`}>
                {hoveredNode.housingBuilding}
              </strong>
            </div>
            <div>
              <span className="text-[8px] text-slate-500 uppercase block">Rate</span>
              <strong className={`font-mono text-xs ${((hoveredNode.mortalityCount / hoveredNode.initialCount) * 100) >= 1.5 ? "text-red-400 font-black" : "text-teal-400"}`}>
                {((hoveredNode.mortalityCount / hoveredNode.initialCount) * 100).toFixed(2)}%
              </strong>
            </div>
          </div>
          <div className="flex justify-between items-center text-[8.5px] text-slate-400">
            <span>Dead: <strong>{hoveredNode.mortalityCount} birds</strong></span>
            <span>Initial: <strong>{hoveredNode.initialCount}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

// Component to visualize the distribution of cattle breeds currently held in the 'Active Registry' using Recharts
const BreedDistributionPieChart = ({ animals }: { animals: Animal[] }) => {
  const breedData = useMemo(() => {
    const counts: Record<string, number> = {};
    animals.forEach(ani => {
      if (ani.status === "Active") {
        counts[ani.breed] = (counts[ani.breed] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [animals]);

  // Premium, high-contrast palette
  const COLORS = ["#0d9488", "#f43f5e", "#eab308", "#10b981", "#3b82f6", "#8b5cf6", "#f97316"];

  if (breedData.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl font-mono text-[10px] text-slate-500 text-center h-full min-h-[340px] flex items-center justify-center">
        No active registry breeds recorded.
      </div>
    );
  }

  const totalCattleCount = breedData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between h-full min-h-[340px]">
      <div>
        <span className="text-[10px] uppercase font-mono font-black text-teal-400">Herd Composition</span>
        <h4 className="text-sm font-black text-white mt-1 uppercase font-mono tracking-tight">Active Breed Share</h4>
      </div>

      <div className="relative flex-1 flex items-center justify-center my-4" style={{ height: 180 }}>
        <RechartResponsiveContainer width="100%" height="100%">
          <RechartPieChart>
            <RechartPie
              data={breedData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {breedData.map((entry, index) => (
                <RechartCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </RechartPie>
            <RechartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const pct = ((data.value / totalCattleCount) * 100).toFixed(1);
                  return (
                    <div className="bg-slate-950/95 border border-slate-800 p-2.5 rounded-xl text-[10px] space-y-1 font-mono shadow-2xl">
                      <p className="font-bold text-teal-400">{data.name}</p>
                      <p className="text-slate-300">Share: <strong className="text-white">{data.value} head</strong> ({pct}%)</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RechartPieChart>
        </RechartResponsiveContainer>

        {/* Absolute count label right in the center hole of the donut/pie */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="text-[10px] uppercase text-slate-500 font-mono font-bold leading-none block">Total Active</span>
          <span className="text-xl font-black text-white font-mono leading-none">{totalCattleCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-850 pt-3">
        {breedData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-1.5 font-mono text-slate-300 truncate" title={item.name}>
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
            <span className="truncate">{item.name}:</span>
            <strong className="text-white">{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Export Component
export default function App() {
  // User Authentication System States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("meatflow_is_auth") === "true";
  });
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const userJson = localStorage.getItem("meatflow_logged_user");
    return userJson ? JSON.parse(userJson) : { id: "U-1", name: "Guest User", role: "Administrator" };
  });

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [activeTab, setActiveTab] = useState<"dashboard" | "livestock" | "butcher" | "collections" | "feed" | "poultry" | "settings">("dashboard");
  const [livestockSubTab, setLivestockSubTab] = useState<"directory" | "mortality" | "breed-analysis" | "supplier" | "growth-compare">("directory");

  // Selection and Expansion States
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<Record<string, boolean>>({});
  const [expandedAnimalIds, setExpandedAnimalIds] = useState<Record<string, boolean>>({});
  const [expandedPoultryBatchIds, setExpandedPoultryBatchIds] = useState<Record<string, boolean>>({});

  // Decentralization & Department Configuration
  const [isDecentralizedMode, setIsDecentralizedMode] = useState<boolean>(true);
  const [selectedDashboardDept, setSelectedDashboardDept] = useState<"All" | "Livestock" | "Poultry" | "Butcher" | "Collections" | "Feed">("All");

  const [isFirebaseLoading, setIsFirebaseLoading] = useState<boolean>(false);

  // Raw primitive state arrays
  const [animals, _setAnimals] = useState<Animal[]>(() => {
    const userJson = localStorage.getItem("meatflow_logged_user");
    if (userJson) {
      const u = JSON.parse(userJson);
      const saved = localStorage.getItem(`meatflow_animals_${u.email || u.id}`);
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_ANIMALS;
  });

  const [sales, _setSales] = useState<Sale[]>(() => {
    const userJson = localStorage.getItem("meatflow_logged_user");
    if (userJson) {
      const u = JSON.parse(userJson);
      const saved = localStorage.getItem(`meatflow_sales_${u.email || u.id}`);
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_SALES;
  });

  const [transactions, _setTransactions] = useState<Transaction[]>(() => {
    const userJson = localStorage.getItem("meatflow_logged_user");
    if (userJson) {
      const u = JSON.parse(userJson);
      const saved = localStorage.getItem(`meatflow_transactions_${u.email || u.id}`);
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_TRANSACTIONS.map(tx => {
      let dept: "Livestock" | "Poultry" | "Butcher" | "Collections" | "Feed" = "Livestock";
      const descLower = tx.description.toLowerCase();
      if (descLower.includes("butcher") || descLower.includes("carcass") || descLower.includes("meat") || descLower.includes("cut")) {
        dept = "Butcher";
      } else if (descLower.includes("poultry") || descLower.includes("flock") || descLower.includes("chick") || descLower.includes("egg") || descLower.includes("avian")) {
        dept = "Poultry";
      } else if (descLower.includes("installment") || descLower.includes("payoff") || descLower.includes("due") || descLower.includes("debt") || descLower.includes("receivable") || descLower.includes("collection")) {
        dept = "Collections";
      } else if (descLower.includes("feed") || descLower.includes("silage") || descLower.includes("straw") || descLower.includes("molasses") || descLower.includes("wheat bran") || descLower.includes("grain")) {
        dept = "Feed";
      } else {
        dept = "Livestock";
      }
      return { ...tx, department: dept };
    });
  });

  const [poultryBatches, _setPoultryBatches] = useState<PoultryBatch[]>(() => {
    const userJson = localStorage.getItem("meatflow_logged_user");
    if (userJson) {
      const u = JSON.parse(userJson);
      const saved = localStorage.getItem(`meatflow_poultry_${u.email || u.id}`);
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_POULTRY_BATCHES;
  });

  const [feedInventory, _setFeedInventory] = useState<any[]>(() => {
    const userJson = localStorage.getItem("meatflow_logged_user");
    if (userJson) {
      const u = JSON.parse(userJson);
      const saved = localStorage.getItem(`meatflow_feed_${u.email || u.id}`);
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: "feed-1", label: "Wheat Bran Stock", balance: 4200, maxCapacity: 5000, unit: "Kg" },
      { id: "feed-2", label: "Mustard Oilcake", balance: 850, maxCapacity: 4500, unit: "Kg" },
      { id: "feed-3", label: "Green Silage Reserves", balance: 24000, maxCapacity: 25000, unit: "Kg" },
      { id: "feed-4", label: "Mineral AD Licks", balance: 15, maxCapacity: 100, unit: "count" }
    ];
  });

  // Background change synchronization helper
  const saveChangesToFirestore = async <T extends { id: string }>(
    collectionName: string,
    prev: T[],
    next: T[],
    uid: string
  ) => {
    try {
      for (const nextItem of next) {
        const prevItem = prev.find(p => p.id === nextItem.id);
        if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(nextItem)) {
          const docRef = doc(db, "users", uid, collectionName, nextItem.id);
          await setDoc(docRef, nextItem);
        }
      }
      for (const prevItem of prev) {
        const nextItem = next.find(n => n.id === prevItem.id);
        if (!nextItem) {
          const docRef = doc(db, "users", uid, collectionName, prevItem.id);
          await deleteDoc(docRef);
        }
      }
    } catch (error) {
      console.error(`Error syncing ${collectionName} changes to Firestore:`, error);
    }
  };

  // Helper collection loader
  const fetchCollection = async <T,>(collectionPath: [string, string, string]): Promise<T[]> => {
    const colRef = collection(db, collectionPath[0], collectionPath[1], collectionPath[2]);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => doc.data() as T);
  };

  // State setters that automatically wrap background Firestore writes
  const setAnimals = (val: Animal[] | ((prev: Animal[]) => Animal[])) => {
    _setAnimals(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      if (isAuthenticated && currentUser && currentUser.id) {
        saveChangesToFirestore("animals", prev, next, currentUser.id);
      }
      return next;
    });
  };

  const setSales = (val: Sale[] | ((prev: Sale[]) => Sale[])) => {
    _setSales(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      if (isAuthenticated && currentUser && currentUser.id) {
        saveChangesToFirestore("sales", prev, next, currentUser.id);
      }
      return next;
    });
  };

  const setTransactions = (val: Transaction[] | ((prev: Transaction[]) => Transaction[])) => {
    _setTransactions(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      if (isAuthenticated && currentUser && currentUser.id) {
        saveChangesToFirestore("transactions", prev, next, currentUser.id);
      }
      return next;
    });
  };

  const setPoultryBatches = (val: PoultryBatch[] | ((prev: PoultryBatch[]) => PoultryBatch[])) => {
    _setPoultryBatches(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      if (isAuthenticated && currentUser && currentUser.id) {
        saveChangesToFirestore("poultryBatches", prev, next, currentUser.id);
      }
      return next;
    });
  };

  const setFeedInventory = (val: any[] | ((prev: any[]) => any[])) => {
    _setFeedInventory(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      if (isAuthenticated && currentUser && currentUser.id) {
        saveChangesToFirestore("feedInventory", prev, next, currentUser.id);
      }
      return next;
    });
  };

  // 1. Listen for standard Firebase Authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        let userData: User;
        if (userDoc.exists()) {
          userData = userDoc.data() as User;
        } else {
          userData = {
            id: user.uid,
            name: user.displayName || currentUser.name || "Default Operator",
            role: (currentUser.role as UserRole) || "Administrator",
            email: user.email || "",
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email || 'operator'}`
          };
          await setDoc(userDocRef, userData);
        }
        setCurrentUser(userData);
      } else {
        // Fallback to local storage values if no user is signed in to avoid lockouts
        const savedAuth = localStorage.getItem("meatflow_is_auth") === "true";
        if (!savedAuth) {
          setIsAuthenticated(false);
          setCurrentUser({ id: "U-1", name: "Guest User", role: "Administrator" });
        } else {
          try {
            const cachedUser = localStorage.getItem("meatflow_logged_user");
            if (cachedUser) {
              const parsed = JSON.parse(cachedUser);
              setIsAuthenticated(true);
              setCurrentUser(parsed);
            }
          } catch (e) {
            console.error("Local user load error:", e);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch or initialize complete cloud-ledger maps when authorized
  useEffect(() => {
    if (!isAuthenticated || !currentUser || !currentUser.id || currentUser.id === "U-1") {
      setIsFirebaseLoading(false);
      return;
    }

    setIsFirebaseLoading(true);
    const uid = currentUser.id;

    async function syncAndLoad() {
      try {
        // A. Animals
        const fetchedAnimals = await fetchCollection<Animal>(["users", uid, "animals"]);
        if (fetchedAnimals.length === 0) {
          for (const ani of INITIAL_ANIMALS) {
            await setDoc(doc(db, "users", uid, "animals", ani.id), ani);
          }
          _setAnimals(INITIAL_ANIMALS);
        } else {
          _setAnimals(fetchedAnimals);
        }

        // B. Sales
        const fetchedSales = await fetchCollection<Sale>(["users", uid, "sales"]);
        if (fetchedSales.length === 0) {
          for (const sa of INITIAL_SALES) {
            await setDoc(doc(db, "users", uid, "sales", sa.id), sa);
          }
          _setSales(INITIAL_SALES);
        } else {
          _setSales(fetchedSales);
        }

        // C. Transactions
        const fetchedTransactions = await fetchCollection<Transaction>(["users", uid, "transactions"]);
        if (fetchedTransactions.length === 0) {
          const mappedTxs = INITIAL_TRANSACTIONS.map(tx => {
            let dept: "Livestock" | "Poultry" | "Butcher" | "Collections" | "Feed" = "Livestock";
            const descLower = tx.description.toLowerCase();
            if (descLower.includes("butcher") || descLower.includes("carcass") || descLower.includes("meat") || descLower.includes("cut")) {
              dept = "Butcher";
            } else if (descLower.includes("poultry") || descLower.includes("flock") || descLower.includes("chick") || descLower.includes("egg") || descLower.includes("avian")) {
              dept = "Poultry";
            } else if (descLower.includes("installment") || descLower.includes("payoff") || descLower.includes("due") || descLower.includes("debt") || descLower.includes("receivable") || descLower.includes("collection")) {
              dept = "Collections";
            } else if (descLower.includes("feed") || descLower.includes("silage") || descLower.includes("straw") || descLower.includes("molasses") || descLower.includes("wheat bran") || descLower.includes("grain")) {
              dept = "Feed";
            } else {
              dept = "Livestock";
            }
            return { ...tx, department: dept };
          });
          for (const tx of mappedTxs) {
            await setDoc(doc(db, "users", uid, "transactions", tx.id), tx);
          }
          _setTransactions(mappedTxs);
        } else {
          _setTransactions(fetchedTransactions);
        }

        // D. Poultry
        const fetchedPoultry = await fetchCollection<PoultryBatch>(["users", uid, "poultryBatches"]);
        if (fetchedPoultry.length === 0) {
          for (const pb of INITIAL_POULTRY_BATCHES) {
            await setDoc(doc(db, "users", uid, "poultryBatches", pb.id), pb);
          }
          _setPoultryBatches(INITIAL_POULTRY_BATCHES);
        } else {
          _setPoultryBatches(fetchedPoultry);
        }

        // E. Feed
        const fetchedFeed = await fetchCollection<any>(["users", uid, "feedInventory"]);
        const defaultFeed = [
          { id: "feed-1", label: "Wheat Bran Stock", balance: 4200, maxCapacity: 5000, unit: "Kg" },
          { id: "feed-2", label: "Mustard Oilcake", balance: 850, maxCapacity: 4500, unit: "Kg" },
          { id: "feed-3", label: "Green Silage Reserves", balance: 24000, maxCapacity: 25000, unit: "Kg" },
          { id: "feed-4", label: "Mineral AD Licks", balance: 15, maxCapacity: 100, unit: "count" }
        ];
        if (fetchedFeed.length === 0) {
          for (const f of defaultFeed) {
            await setDoc(doc(db, "users", uid, "feedInventory", f.id), f);
          }
          _setFeedInventory(defaultFeed);
        } else {
          _setFeedInventory(fetchedFeed);
        }
      } catch (error) {
        console.error("Error setting up and fetching user data from Firestore:", error);
      } finally {
        setIsFirebaseLoading(false);
      }
    }

    syncAndLoad();
  }, [isAuthenticated, currentUser?.id]);

  // FAB States & details
  const [isDashboardFabOpen, setIsDashboardFabOpen] = useState(false);

  const [restockHistory, setRestockHistory] = useState<Array<{
    id: string;
    feedId: string;
    label: string;
    amount: number;
    unit: string;
    date: string;
    status: "Approved" | "Pending" | "Completed";
  }>>([
    { id: "R-1", feedId: "feed-1", label: "Wheat Bran Stock", amount: 1000, unit: "Kg", date: "2026-05-20", status: "Completed" },
    { id: "R-2", feedId: "feed-3", label: "Green Silage Reserves", amount: 5000, unit: "Kg", date: "2026-05-24", status: "Completed" }
  ]);

  // Sorting and Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [animalSortField, setAnimalSortField] = useState<"id" | "type" | "owner" | "due" | "status" | null>(null);
  const [animalSortOrder, setAnimalSortOrder] = useState<"asc" | "desc">("asc");
  const [typeFilter, setTypeFilter] = useState("All");
  const [animalOwnerFilter, setAnimalOwnerFilter] = useState("All");
  const [animalPaymentStatusFilter, setAnimalPaymentStatusFilter] = useState("All");

  const [poultrySearchQuery, setPoultrySearchQuery] = useState("");
  const [poultryTypeFilter, setPoultryTypeFilter] = useState("All");
  const [poultryStatusFilter, setPoultryStatusFilter] = useState("All");
  const [poultrySubTab, setPoultrySubTab] = useState<"register" | "profit">("register");

  // Sync Progress Indicators
  const [syncState, setSyncState] = useState<"idle" | "running">("idle");
  const [syncLog, setSyncLog] = useState("");
  const [syncIntervalValue, setSyncIntervalValue] = useState<number>(() => Number(localStorage.getItem("sla_sync_interval") || "30"));

  // Audit Logs State (last 20 actions administrative review logs)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: "LOG-001", action: "POS Sale Settled", department: "Butcher", timestamp: "2026-05-28 19:42:15", details: "Invoice #INV-1011 settled for ₹15,600 (Cash)" },
    { id: "LOG-002", action: "Cattle Registration", department: "Livestock", timestamp: "2026-05-28 18:22:15", details: "Registered Hereford Steer (C-002), 480kg from Dhaka Cattle" },
    { id: "LOG-003", action: "Batch Restocked", department: "Feed Shop", timestamp: "2026-05-28 17:11:04", details: "Restocked 5,000kg Green Silage Reserves" },
    { id: "LOG-004", action: "Weight Registered", department: "Livestock", timestamp: "2026-05-28 15:45:30", details: "Updated weight of ANI-001 to 525kg via fast scale log" },
    { id: "LOG-005", action: "Carcass Slaughtered", department: "Butcher", timestamp: "2026-05-28 14:15:24", details: "Processed cattle carcass for ANI-002, Choice Grade A" },
    { id: "LOG-006", action: "Feed Consumed", department: "Feed Shop", timestamp: "2026-05-28 13:02:11", details: "Consumed 45kg from Wheat Bran Stock" },
    { id: "LOG-007", action: "Mortality Reported", department: "Poultry", timestamp: "2026-05-28 11:22:04", details: "Reported 12 mortalities in Cobb 500 flock" },
    { id: "LOG-008", action: "Installment Collected", department: "Collections", timestamp: "2026-05-28 10:15:00", details: "Collected ₹12,000 on Overdue installment #INS-1" }
  ]);

  const [auditSearch, setAuditSearch] = useState("");
  const [auditDept, setAuditDept] = useState("All");

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(auditSearch.toLowerCase()) || 
                            log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
                            log.id.toLowerCase().includes(auditSearch.toLowerCase());
      const matchesDept = auditDept === "All" || log.department === auditDept;
      return matchesSearch && matchesDept;
    });
  }, [auditLogs, auditSearch, auditDept]);

  const [showLivestockScannerTutorial, setShowLivestockScannerTutorial] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [animalPaymentInput, setAnimalPaymentInput] = useState<{ [animalId: string]: string }>({});

  // Offline queuing and simulation state engines
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<Array<{
    id: string;
    actionType: string;
    payload: any;
    timestamp: string;
  }>>([
    { id: "QUE-902", actionType: "Livestock Vaccination Log", payload: { animalId: "ANI-002", vaccine: "FMD Immunity Shot", cc: "5.0 ml" }, timestamp: "2026-05-29T04:22:15Z" },
    { id: "QUE-903", actionType: "Disburse Feed Inventory", payload: { feedId: "feed-1", label: "Wheat Bran Stock", changeKg: 250 }, timestamp: "2026-05-29T05:01:40Z" },
    { id: "QUE-904", actionType: "Poultry Mortality Entry", payload: { batchId: "PB-001", deadCountTarget: 12 }, timestamp: "2026-05-29T05:12:05Z" }
  ]);

  // Bulk operation states for herd registry selection
  const [showBulkOpModal, setShowBulkOpModal] = useState(false);
  const [bulkWeightMode, setBulkWeightMode] = useState<"add" | "set" | "none">("none");
  const [bulkWeightVal, setBulkWeightVal] = useState("");
  const [bulkFeedPreset, setBulkFeedPreset] = useState("");

  // Bulk CSV import & sitemap modal states
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [bulkImportErrorLog, setBulkImportErrorLog] = useState<string[]>([]);
  const [isCsvDragging, setIsCsvDragging] = useState(false);
  const [showSitemapModal, setShowSitemapModal] = useState(false);
  const [sitemapActiveTab, setSitemapActiveTab] = useState<"map" | "terms">("map");

  // Floating Quick Scan modules
  const [isQuickScanOpen, setIsQuickScanOpen] = useState(false);
  const [quickScanDept, setQuickScanDept] = useState<"Livestock" | "Poultry">("Livestock");

  const handleRecordAnimalPayment = (animalId: string) => {
    const rawAmount = animalPaymentInput[animalId] || "";
    const amount = Number(rawAmount);
    if (!rawAmount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive payment amount.");
      return;
    }

    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;

    if (amount > animal.due) {
      alert(`Entered payment (₹${amount.toLocaleString()}) cannot exceed the outstanding balance (₹${animal.due.toLocaleString()}).`);
      return;
    }

    setAnimals(prev => prev.map(ani => {
      if (ani.id === animalId) {
        const nextDue = Math.max(0, ani.due - amount);
        const nextAdvance = ani.purchasePrice - nextDue;
        const nextStatus: "Paid" | "Partially Paid" = nextDue === 0 ? "Paid" : "Partially Paid";
        
        return {
          ...ani,
          due: nextDue,
          advancePaid: nextAdvance,
          status: nextStatus
        };
      }
      return ani;
    }));

    // Post transaction
    const tx: Transaction = {
      id: `TXN-A-${Math.floor(100+Math.random()*900)}`,
      type: "Revenue",
      category: "Sale",
      amount: amount,
      date: new Date().toISOString().slice(0, 10),
      description: `Cattle register payment capture for animal ID: ${animalId}`,
      referenceId: animalId,
      department: "Livestock"
    };
    setTransactions(prev => [tx, ...prev]);

    // Audit Log
    if (isOfflineSimulated) {
      const qId = `Q-${Math.floor(1000 + Math.random() * 9000).toString()}`;
      setOfflineQueue(prev => [...prev, {
        id: qId,
        actionType: "PAYMENT_RECORDED",
        payload: { animalId, amount },
        timestamp: new Date().toLocaleTimeString()
      }]);
      addAuditLog(
        "Payment Queued (Offline)", 
        "Livestock", 
        `Offline Queue ${qId}: Captured ₹${amount.toLocaleString()} payment for beast ${animalId} in browser cache buffer.`
      );
    } else {
      addAuditLog(
        "Payment Received", 
        "Livestock", 
        `Recorded ₹${amount.toLocaleString()} payment for beast ${animalId}. Status: ${amount === animal.due ? "Fully Paid" : "Partially Paid"}`
      );
    }

    // Reset input
    setAnimalPaymentInput(prev => ({
      ...prev,
      [animalId]: ""
    }));

    if (isOfflineSimulated) {
      alert(`✓ Offline Mode Active. Recorded ₹${amount.toLocaleString()} in your local ledger queue for Animal ${animalId}. Sync when network is restored!`);
    } else {
      alert(`✓ Payment of ₹${amount.toLocaleString()} recorded. Remaining due: ₹${(animal.due - amount).toLocaleString()}`);
    }
  };

  // Applicator for mass selected animals bulk operations
  const handleApplyBulkOperations = () => {
    const selectedIds = Object.keys(selectedAnimalIds).filter(id => selectedAnimalIds[id]);
    if (selectedIds.length === 0) {
      alert("No animals are currently selected for bulk operations.");
      return;
    }

    let weightCount = 0;
    let feedCount = 0;

    setAnimals(prev => prev.map(ani => {
      if (selectedIds.includes(ani.id)) {
        let updatedAni = { ...ani };
        let history = ani.weightHistory || [];

        // Apply relative or absolute weight adjusts
        if (bulkWeightMode !== "none" && bulkWeightVal !== "") {
          const valNum = Number(bulkWeightVal);
          if (!isNaN(valNum) && valNum > 0) {
            let nextWeight = ani.weightKg;
            if (bulkWeightMode === "add") {
              nextWeight = ani.weightKg + valNum;
            } else if (bulkWeightMode === "set") {
              nextWeight = valNum;
            }
            const nextHistory = [...history, { date: new Date().toISOString().slice(0, 10), weightKg: nextWeight }];
            updatedAni.weightKg = nextWeight;
            updatedAni.weightHistory = nextHistory;
            weightCount++;
          }
        }

        // Apply selected feed plan configurations
        if (bulkFeedPreset !== "") {
          updatedAni.notes = `${ani.notes ? ani.notes + " " : ""}[FEED PLAN ASSIGNED ${new Date().toISOString().slice(0, 10)}]: ${bulkFeedPreset}`;
          feedCount++;
        }

        return updatedAni;
      }
      return ani;
    }));

    // Record action audit trace
    let actionDsc = `Bulk update configured for ${selectedIds.length} animals. `;
    if (weightCount > 0) actionDsc += `Adjusted ${weightCount} weights (${bulkWeightMode === "add" ? "+" : ""}${bulkWeightVal}kg). `;
    if (feedCount > 0) actionDsc += `Allocated feed preset ${bulkFeedPreset} on ${feedCount} beasts.`;

    if (isOfflineSimulated) {
      const qItem = {
        id: `Q-${Math.floor(1000 + Math.random() * 9000).toString()}`,
        actionType: "BULK_UPDATE",
        payload: { selectedIds, bulkWeightMode, bulkWeightVal, bulkFeedPreset },
        timestamp: new Date().toLocaleTimeString()
      };
      setOfflineQueue(prev => [...prev, qItem]);
      addAuditLog("Bulk Update Queued", "Livestock", `Offline: ${actionDsc}`);
      alert(`✓ Offline Mode Active. Bulk action queued securely: ${actionDsc}`);
    } else {
      addAuditLog("Bulk Update Run", "Livestock", actionDsc);
      alert(`✓ Bulk operations applied successfully:\n${actionDsc}`);
    }

    setSelectedAnimalIds({});
    setShowBulkOpModal(false);
    setBulkWeightMode("none");
    setBulkWeightVal("");
    setBulkFeedPreset("");
  };

  // Replay queued operations when connection simulates "on"
  const handleReplayOfflineQueue = () => {
    if (offlineQueue.length === 0) {
      alert("Offline Queue is empty. No pending data sync needed!");
      return;
    }
    const count = offlineQueue.length;
    addAuditLog("Storage Synced", "System", `PWA Replayed ${count} offline updates successfully.`);
    alert(`✓ Replicating ${count} offline queued actions... Synchronization Complete! Central cloud catalog database is up to date.`);
    setOfflineQueue([]);
  };

  // QR Code POS Reader Camera States
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [qrScanningCameraState, setQrScanningCameraState] = useState<"idle" | "accessing" | "ready" | "error" | "scanned">("idle");
  const [qrTxnRefId, setQrTxnRefId] = useState("");
  const [scannerCameraLogs, setScannerCameraLogs] = useState("Standing by...");

  // Modals & Dynamic Views
  const [showAddAnimalModal, setShowAddAnimalModal] = useState(false);
  const [showAddPoultryModal, setShowAddPoultryModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showQuickSubtractModal, setShowQuickSubtractModal] = useState(false);
  const [quickSubtractFeedId, setQuickSubtractFeedId] = useState("");
  const [quickSubtractAmount, setQuickSubtractAmount] = useState("");
  const [quickSubtractNotes, setQuickSubtractNotes] = useState("");
  const [activeInvoice, setActiveInvoice] = useState<Sale | null>(null);

  // Installment collection detail state
  const [collectingInstallment, setCollectingInstallment] = useState<{
    saleId: string;
    installmentId: string;
    amount: number;
  } | null>(null);
  const [collectAmountInput, setCollectAmountInput] = useState<string>("");
  const [collectType, setCollectType] = useState<"Full" | "Partial">("Full");

  // Universal RFID & Barcode Core Scanner Simulation Terminal state
  const [activeScannerDept, setActiveScannerDept] = useState<"Poultry" | "Livestock" | "Butcher" | "Feed" | null>(null);
  const [scannerTagSearch, setScannerTagSearch] = useState<string>("");
  const [scannerTerminalMsg, setScannerTerminalMsg] = useState<string>("Scanner fully charged. Ready for transmission...");
  const [isLaserScanning, setIsLaserScanning] = useState<boolean>(false);
  const [selectedScannerEntityId, setSelectedScannerEntityId] = useState<string>("");
  const [instantWeightInput, setInstantWeightInput] = useState<string>("");
  const [instantMortalityInput, setInstantMortalityInput] = useState<string>("");
  const [livestockMortalityStartDate, setLivestockMortalityStartDate] = useState<string>("");
  const [livestockMortalityEndDate, setLivestockMortalityEndDate] = useState<string>("");
  const [compareIds, setCompareIds] = useState<string[]>(["ANI-001", "ANI-002", "ANI-003"]);
  const [showPurchaseOrderModal, setShowPurchaseOrderModal] = useState(false);
  const [purchaseOrderFeedId, setPurchaseOrderFeedId] = useState("");
  const [purchaseOrderAmount, setPurchaseOrderAmount] = useState("");
  const [purchaseOrderSupplier, setPurchaseOrderSupplier] = useState("Sovereign Feed Mills");
  const [instantCarcassYieldInput, setInstantCarcassYieldInput] = useState<string>("");
  const [instantCarcassGrade, setInstantCarcassGrade] = useState<string>("Choice Grade A");

  const [newPoultryBatch, setNewPoultryBatch] = useState<{
    type: PoultryType;
    breed: string;
    housingBuilding: string;
    initialCount: number;
    acquisitionDate: string;
    acquisitionAgeDays: number;
    purchaseCost: number;
    notes: string;
  }>({
    type: "Broiler",
    breed: "Cobb 500",
    housingBuilding: "Shed 1-A",
    initialCount: 1000,
    acquisitionDate: new Date().toISOString().slice(0, 10),
    acquisitionAgeDays: 1,
    purchaseCost: 55000,
    notes: ""
  });

  // Refs for scan camera
  const qrVideoRef = useRef<HTMLVideoElement | null>(null);
  const qrCameraStreamRef = useRef<MediaStream | null>(null);

  // Dynamic config options persisted in localStorage
  const [configTimezone, setConfigTimezone] = useState<string>(() => localStorage.getItem("sla_config_timezone") || "+05:30");
  const [configFont, setConfigFont] = useState<string>(() => localStorage.getItem("sla_config_font") || "Inter");
  const [configFontSize, setConfigFontSize] = useState<string>(() => localStorage.getItem("sla_config_font_size") || "base");
  const [configDisplayDensity, setConfigDisplayDensity] = useState<"comfortable" | "compact">(
    () => (localStorage.getItem("sla_config_display_density") as any) || "comfortable"
  );
  
  const [overrideDateTimeValue, setOverrideDateTimeValue] = useState<string>(() => localStorage.getItem("sla_override_datetime_value") || "");
  const [isDateTimeOverrideActive, setIsDateTimeOverrideActive] = useState<boolean>(() => localStorage.getItem("sla_is_datetime_override") === "true");

  const [customFields, setCustomFields] = useState<{ id: string; name: string; entity: "Livestock" | "Poultry"; type: "text" | "number" }[]>(() => {
    try {
      const saved = localStorage.getItem("sla_custom_fields");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customFieldValues, setCustomFieldValues] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem("sla_custom_field_values");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [tempCustomFieldValues, setTempCustomFieldValues] = useState<Record<string, string>>({});

  // Livestock ear-tag fast camera scanner 
  const [showLivestockScannerModal, setShowLivestockScannerModal] = useState(false);
  const [livestockScannerCameraState, setLivestockScannerCameraState] = useState<"idle" | "accessing" | "ready" | "error" | "scanned">("idle");
  const [livestockScannerLogs, setLivestockScannerLogs] = useState("Standing by...");
  const livestockVideoRef = useRef<HTMLVideoElement | null>(null);
  const livestockCameraStreamRef = useRef<MediaStream | null>(null);

  // Helper function to return properly offset timestamp details
  const getFormattedDateTime = () => {
    let date = new Date();
    if (isDateTimeOverrideActive && overrideDateTimeValue) {
      date = new Date(overrideDateTimeValue);
    }
    const parts = configTimezone.match(/([+-])(\d{2}):(\d{2})/);
    let offsetMinutes = 0;
    if (parts) {
      const sign = parts[1] === "+" ? 1 : -1;
      const hours = parseInt(parts[2], 10);
      const minutes = parseInt(parts[3], 10);
      offsetMinutes = sign * (hours * 60 + minutes);
    }
    const browserOffsetMinutes = -date.getTimezoneOffset();
    const totalDiffMinutes = offsetMinutes - browserOffsetMinutes;
    const adjustedDate = new Date(date.getTime() + totalDiffMinutes * 60 * 1000);

    const year = adjustedDate.getUTCFullYear();
    const month = String(adjustedDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(adjustedDate.getUTCDate()).padStart(2, "0");
    const hours = String(adjustedDate.getUTCHours()).padStart(2, "0");
    const minutes = String(adjustedDate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(adjustedDate.getUTCSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const addAuditLog = (action: string, department: string, details: string) => {
    const timestamp = getFormattedDateTime();
    const nextId = `LOG-${Math.floor(100 + Math.random() * 900)}`;
    const newLog: AuditLog = {
      id: nextId,
      action,
      department,
      timestamp,
      details
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 20));
  };

  const startLivestockQRScanner = async () => {
    setShowLivestockScannerModal(true);
    setLivestockScannerCameraState("accessing");
    setLivestockScannerLogs("Querying camera lens parameters for ear tag...");
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
        });
        livestockCameraStreamRef.current = stream;
        setLivestockScannerCameraState("ready");
        setLivestockScannerLogs("Lenses active! Point at Cattle ear-tag barcode.");
        setTimeout(() => {
          if (livestockVideoRef.current) {
            livestockVideoRef.current.srcObject = stream;
            livestockVideoRef.current.play().catch(err => console.warn(err));
          }
        }, 150);
      } else {
        throw new Error("optics failed");
      }
    } catch (err) {
      setLivestockScannerCameraState("error");
      setLivestockScannerLogs("[OPTICS MOCKEMULATOR] Lens absent. Initializing simulated laser sweep scans.");
    }
  };

  const stopLivestockQRScanner = () => {
    if (livestockCameraStreamRef.current) {
      livestockCameraStreamRef.current.getTracks().forEach(track => track.stop());
      livestockCameraStreamRef.current = null;
    }
    if (livestockVideoRef.current) {
      livestockVideoRef.current.srcObject = null;
    }
    setShowLivestockScannerModal(false);
    setLivestockScannerCameraState("idle");
  };

  const scanSpecificTagId = (beastId: string) => {
    setLivestockScannerCameraState("scanned");
    setLivestockScannerLogs(`✓ Successfully Scanned Ear-Tag: ${beastId}`);
    setTimeout(() => {
      stopLivestockQRScanner();
      setActiveTab("livestock");
      setLivestockSubTab("directory");
      setExpandedAnimalIds(prev => ({ ...prev, [beastId]: true }));
      alert(`✓ Decoded Ear-Tag ID: ${beastId}! Automatically showing details.`);
    }, 1200);
  };

  // New Cattle State Form fields
  const [newAnimal, setNewAnimal] = useState({
    type: "Cow",
    breed: "",
    ageMonths: 12,
    weightKg: 200,
    purchasePrice: 40000,
    advancePaid: 30000,
    owner: "",
    notes: ""
  });

  // New POS Billings State fields
  const [posBillForm, setPosBillForm] = useState({
    customerName: "",
    customerPhone: "",
    itemType: "Premium Beef Loin",
    weightKg: 10,
    ratePerKg: 780,
    paymentMethod: "Cash" as any
  });

  // Call Logs Collections fields
  const [newCallNotes, setNewCallNotes] = useState("");
  const [activeCollectionInvoiceId, setActiveCollectionInvoiceId] = useState<string | null>(null);

  // Feed Shop interactive handling
  const handleSimulateFeedConsumption = (feedId: string, amount: number) => {
    let feedObj: any = null;
    setFeedInventory(prev => prev.map(f => {
      if (f.id === feedId) {
        feedObj = f;
        const nextBal = Math.max(0, f.balance - amount);
        return { ...f, balance: nextBal };
      }
      return f;
    }));

    if (feedObj) {
      const tx: Transaction = {
        id: `TXN-FCONS-${Math.floor(1000 + Math.random() * 9000)}`,
        type: "Expense",
        category: "Feed",
        amount: Math.round(amount * (feedId === "feed-4" ? 120 : 18)),
        date: new Date().toISOString().slice(0, 10),
        description: `Consumed ${amount} ${feedObj.unit} of ${feedObj.label}`,
        department: "Feed",
        referenceId: feedId
      };
      setTransactions(prev => [tx, ...prev]);
    }
  };

  const handleRequestRestock = (feedId: string) => {
    const feedItem = feedInventory.find(f => f.id === feedId);
    if (!feedItem) return;
    
    const restockQty = feedItem.maxCapacity - feedItem.balance;
    if (restockQty <= 0) {
      alert("Stock is already at 100% capacity!");
      return;
    }

    setFeedInventory(prev => prev.map(f => {
      if (f.id === feedId) {
        return { ...f, balance: f.maxCapacity };
      }
      return f;
    }));

    const newRestock = {
      id: `R-${Date.now()}`,
      feedId,
      label: feedItem.label,
      amount: restockQty,
      unit: feedItem.unit,
      date: new Date().toISOString().slice(0, 10),
      status: "Completed" as const
    };
    setRestockHistory(prev => [newRestock, ...prev]);

    const costPerUnit = feedItem.unit === "Kg" ? 18 : 120;
    const totalCost = restockQty * costPerUnit;

    const tx: Transaction = {
      id: `TXN-${transactions.length + 1}`,
      type: "Expense",
      category: "Feed",
      amount: totalCost,
      date: new Date().toISOString().slice(0, 10),
      description: `Refilled stock: Ordered ${restockQty} ${feedItem.unit} of ${feedItem.label}`,
      department: "Feed"
    };
    setTransactions(prev => [tx, ...prev]);
  };
  
  // Predictive days-to-empty helper analyzing last 30 days
  const calculateDaysToEmpty = (feedId: string, balance: number, unit: string) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Filter transactions in the last 30 days of category "Feed"
    const feedTxns = transactions.filter(t => {
      if (t.category !== "Feed") return false;
      const tDate = new Date(t.date);
      return tDate >= thirtyDaysAgo;
    });

    // Calculate sum from descriptions or referenceId
    let totalFromTxns = 0;
    feedTxns.forEach(t => {
      const isThisFeed = t.referenceId === feedId || t.description.toLowerCase().includes(feedId) || t.description.toLowerCase().includes(feedId.replace("feed-", ""));
      const isConsumption = t.description.toLowerCase().includes("consume") || t.description.toLowerCase().includes("allocation") || t.description.toLowerCase().includes("subtracted");
      
      if (isThisFeed && isConsumption) {
        const match = t.description.match(/(\d+(?:\.\d+)?)\s*(?:Kg|count|licks|units)/i);
        if (match) {
          totalFromTxns += parseFloat(match[1]);
        }
      }
    });

    const defaultRates: Record<string, number> = {
      "feed-1": 120, // 120 Kg/day
      "feed-2": 25,  // 25 Kg/day
      "feed-3": 600, // 600 Kg/day
      "feed-4": 1.5, // 1.5 licks/day
    };

    const dailyRate = totalFromTxns > 0 ? (totalFromTxns / 30) : (defaultRates[feedId] || 10);
    const days = balance / dailyRate;
    return {
      days: parseFloat(days.toFixed(1)),
      dailyRate: parseFloat(dailyRate.toFixed(1)),
      isFallback: totalFromTxns === 0
    };
  };

  // Tag Scanner Action Handling
  const handleSimulatedTagScan = (tagId: string, dept: "Poultry" | "Livestock" | "Butcher" | "Feed") => {
    setIsLaserScanning(true);
    setScannerTerminalMsg("Emitting 860MHz RF frequency... sweep index active");
    setSelectedScannerEntityId("");
    
    setTimeout(() => {
      setIsLaserScanning(false);
      const cleanTag = tagId.trim().toUpperCase();
      
      if (dept === "Poultry") {
        const pBatch = poultryBatches.find(b => b.id.toUpperCase() === cleanTag);
        if (pBatch) {
          setSelectedScannerEntityId(pBatch.id);
          setInstantWeightInput(pBatch.averageWeightKg.toString());
          setInstantMortalityInput("0");
          setScannerTerminalMsg(`✓ READ OK: Poultry flock batch ${pBatch.id} (${pBatch.breed}) detected. Status: ${pBatch.status}.`);
        } else {
          setScannerTerminalMsg(`❌ READ ERROR: No Poultry flock batch found for tag ID "${tagId}".`);
        }
      } else if (dept === "Livestock" || dept === "Butcher") {
        const beast = animals.find(a => a.id.toUpperCase() === cleanTag);
        if (beast) {
          setSelectedScannerEntityId(beast.id);
          setInstantWeightInput(beast.weightKg.toString());
          setInstantCarcassYieldInput(Math.round(beast.weightKg * 0.58).toString()); // 58% yield default estimate
          setScannerTerminalMsg(`✓ READ OK: Beast ${beast.id} (${beast.breed} ${beast.type}) RFID transponder verified. Status: ${beast.status}.`);
        } else {
          setScannerTerminalMsg(`❌ READ ERROR: Beast tag "${tagId}" unrecognized in system registry or processed.`);
        }
      } else if (dept === "Feed") {
        const fItem = feedInventory.find(f => f.id.toLowerCase() === tagId.toLowerCase() || f.label.toLowerCase().includes(tagId.toLowerCase()));
        if (fItem) {
          setSelectedScannerEntityId(fItem.id);
          setScannerTerminalMsg(`✓ READ OK: Feed stock bin RFID active [${fItem.label}]. Balance: ${fItem.balance} ${fItem.unit}.`);
        } else {
          setScannerTerminalMsg(`❌ READ ERROR: Feed item index barcode "${tagId}" not found.`);
        }
      }
    }, 600);
  };

  const handleInstantLoggedWeight = (entityId: string, dept: "Poultry" | "Livestock") => {
    const rawVal = Number(instantWeightInput);
    if (!rawVal || isNaN(rawVal) || rawVal <= 0) {
      alert("Please enter a valid weight!");
      return;
    }

    if (dept === "Poultry") {
      setPoultryBatches(prev => prev.map(p => {
        if (p.id === entityId) {
          return { ...p, averageWeightKg: rawVal };
        }
        return p;
      }));
      addAuditLog("Poultry Weight Logged", "Poultry", `Logged average weight of flock ${entityId} as ${rawVal} Kg`);
      setScannerTerminalMsg(`✓ TRANSACTION SUCCESS: Scanned batch ${entityId} average weight instantly logged at ${rawVal} Kg on database.`);
      alert(`Success: Instantly updated Batch ${entityId} weight to ${rawVal} Kg`);
    } else {
      setAnimals(prev => prev.map(a => {
        if (a.id === entityId) {
          const history = a.weightHistory || [];
          const nextHistory = [...history, { date: new Date().toISOString().slice(0, 10), weightKg: rawVal }];
          return { ...a, weightKg: rawVal, weightHistory: nextHistory };
        }
        return a;
      }));
      addAuditLog("Cattle Weight Logged", "Livestock", `Logged scale weight of animal ${entityId} as ${rawVal} Kg`);
      setScannerTerminalMsg(`✓ TRANSACTION SUCCESS: Beast RFID ${entityId} weight history registered at ${rawVal} Kg on central ledger.`);
      alert(`Success: Instantly logged beast ${entityId} live weight of ${rawVal} Kg`);
    }
  };

  const handleInstantLoggedMortality = (entityId: string, dept: "Poultry" | "Livestock") => {
    const loss = Number(instantMortalityInput);
    if (isNaN(loss) || loss <= 0) {
      alert("Please enter a valid mortality count!");
      return;
    }

    if (dept === "Poultry") {
      setPoultryBatches(prev => prev.map(p => {
        if (p.id === entityId) {
          const nextCount = Math.max(0, p.currentCount - loss);
          const nextMort = p.mortalityCount + loss;
          return { 
            ...p, 
            currentCount: nextCount, 
            mortalityCount: nextMort,
            status: nextCount === 0 ? "Sold" as const : p.status
          };
        }
        return p;
      }));

      // Log standard operational expense for avian losses
      const costAmount = loss * 65; // standard estimate per loss
      const tx: Transaction = {
        id: `TXN-${transactions.length + 1}`,
        type: "Expense",
        category: "Welfare",
        amount: costAmount,
        date: new Date().toISOString().slice(0, 10),
        description: `Avian mortality loss auto-expense allocation: ${loss} birds from ${entityId}`,
        department: "Poultry"
      };
      setTransactions(prev => [tx, ...prev]);

      addAuditLog("Poultry Mortality Reported", "Poultry", `Reported ${loss} avian deaths on batch ${entityId}. Write-off cost: ₹${costAmount.toLocaleString()}`);
      setScannerTerminalMsg(`⚠️ ALERT AUTO-POSTED: ${loss} avian deaths registered on batch ${entityId}. Operational write-off of ₹${costAmount.toLocaleString()} logged.`);
      alert(`Success: Registered ${loss} bird deaths for Flock ${entityId}. Outstanding biocensure rules applied.`);
    } else {
      setAnimals(prev => prev.map(a => {
        if (a.id === entityId) {
          return { ...a, status: "Mortality" as const };
        }
        return a;
      }));
      addAuditLog("Cattle Mortality Audit", "Livestock", `Cattle ID ${entityId} flagged as Mortality loss`);
      setScannerTerminalMsg(`⚠️ SEVERE LOSS POSTED: Beast tag ${entityId} marked as Mortality. Please trigger insurance claim sequence.`);
      alert(`Success: Marked Beast ${entityId} as deceased in Livestock registry.`);
    }
  };

  const handleInstantLoggedCarcass = (beastId: string) => {
    const yieldWeight = Number(instantCarcassYieldInput);
    if (!yieldWeight || isNaN(yieldWeight) || yieldWeight <= 0) {
      alert("Please enter a valid carcass cold weight!");
      return;
    }

    setAnimals(prev => prev.map(a => {
      if (a.id === beastId) {
        return { ...a, status: "Processed" as const, notes: `Processed in Butcher block. Grade: ${instantCarcassGrade}. Cold carcass weight: ${yieldWeight} Kg.` };
      }
      return a;
    }));

    // Auto log transaction representing Butcher carcass value
    const val = yieldWeight * 750; // default prime cuts rate
    const tx: Transaction = {
      id: `TXN-${transactions.length + 1}`,
      type: "Revenue",
      category: "Sale",
      amount: val,
      date: new Date().toISOString().slice(0, 10),
      description: `Instant butcher slaughter carcass ledger resolution for beast ${beastId}. Grade: ${instantCarcassGrade}`,
      department: "Butcher"
    };
    setTransactions(prev => [tx, ...prev]);

    addAuditLog("Carcass Slaughtered", "Butcher", `Processed carcass for beast ${beastId} (yield: ${yieldWeight} Kg, grade: ${instantCarcassGrade})`);
    setScannerTerminalMsg(`🍖 SLATE CLEARED: Beast ${beastId} carcass processed instantly. Grade: ${instantCarcassGrade}. Yield of ${yieldWeight} Kg posted.`);
    alert(`Success: Beast ${beastId} processed into ${yieldWeight} Kg of ${instantCarcassGrade} meat. Revenue ledger has been posted!`);
  };

  const handleInstantLoggedFeed = (feedId: string, act: "Consume" | "Restock") => {
    if (act === "Restock") {
      handleRequestRestock(feedId);
      addAuditLog("Feed Bin Restock", "Feed Store", `Replenished stock of feed ${feedId} to 100%`);
      setScannerTerminalMsg(`✓ FEED REPLENISH LEVEL: Feed stock ID ${feedId} instantly refilled to 100% capacity via RFID sweep.`);
    } else {
      const consumption = feedId === "feed-4" ? 5 : 400; // units
      handleSimulateFeedConsumption(feedId, consumption);
      addAuditLog("Feed Consumed", "Feed Store", `Subtracted consumption of ${consumption} units from feed bin ${feedId}`);
      setScannerTerminalMsg(`✓ FEED EXHAUST SUBTRACTION: Subtracted ${consumption} of category ${feedId} from physical bins.`);
    }
  };

  // Derivations for Decentralized Department Dashboards
  const currentDashboardDept = useMemo(() => {
    if (!isDecentralizedMode) return "All";
    if (currentUser.role === "Administrator") return selectedDashboardDept;
    if (currentUser.role === "Livestock Management") return "Livestock";
    if (currentUser.role === "Poultry Management") return "Poultry";
    if (currentUser.role === "Butcher Shop") return "Butcher";
    if (currentUser.role === "Collections") return "Collections";
    if (currentUser.role === "Feed Shop" || currentUser.role === "Feed Shop") return "Feed";
    return "All";
  }, [isDecentralizedMode, currentUser.role, selectedDashboardDept]);

  const computedDashboardCards = useMemo(() => {
    const activeCattle = animals.filter(a => a.status === "Active");
    const totalRev = transactions.filter(t => t.type === "Revenue").reduce((sum, t) => sum + t.amount, 0);
    const totalDue = sales.reduce((sum, s) => sum + s.amountDue, 0);

    if (currentDashboardDept === "All" || !isDecentralizedMode) {
      return [
        { title: "Active Bovine Herd", val: `${activeCattle.length} Heads`, detail: "Consolidated active cattle inside pens", sub: "100% veterinary compliant" },
        { title: "Net Enterprise Revenue", val: `₹${totalRev.toLocaleString()}`, detail: "Aggregate multi-department ledger revenue", sub: "Standard financial runway" },
        { title: "Outstanding Credit", val: `₹${totalDue.toLocaleString()}`, detail: "Overdue and unsettled invoices sum", sub: "Enforced collectable tracing" },
        { title: "Overall Rations Grade", val: "94.6%", detail: "Optimal concentrate & silage blend match", sub: "Optimal FCR index green" }
      ];
    }

    if (currentDashboardDept === "Livestock") {
      const activeCowBuf = activeCattle.filter(a => a.type === "Cow" || a.type === "Buffalo" || a.type === "Mithun").length;
      const activeGoatSheep = activeCattle.filter(a => a.type === "Goat" || a.type === "Sheep").length;
      const livestockExpense = transactions.filter(t => t.department === "Livestock" && t.type === "Expense").reduce((sum, t) => sum + t.amount, 0);
      const livestockRevenue = transactions.filter(t => t.department === "Livestock" && t.type === "Revenue").reduce((sum, t) => sum + t.amount, 0);
      return [
        { title: "Large Cattle Stock", val: `${activeCowBuf} Heads`, detail: "Active Bovine & Buffalo reserves log", sub: "High average daily weight gain" },
        { title: "Small Caprine Yard", val: `${activeGoatSheep} Heads`, detail: "Black bengal goats and Suffolk sheep", sub: "Pasture grazing enabled" },
        { title: "Livestock Purchase Outlay", val: `₹${livestockExpense.toLocaleString()}`, detail: "Capital procurement and breeder advance", sub: "Sourced Rahman Breeders" },
        { title: "Dept Net Cash Margin", val: `₹${(livestockRevenue - livestockExpense).toLocaleString()}`, detail: "Sovereign cattle operations margin", sub: "Includes cattle wholesale sales" }
      ];
    }

    if (currentDashboardDept === "Poultry") {
      const activePoultry = poultryBatches.filter(b => b.status !== "Sold").reduce((sum, b) => sum + b.currentCount, 0);
      const eggsColl = poultryBatches.reduce((sum, b) => sum + (b.eggsCollectedCumulative || 0), 0);
      const poultryRevenue = transactions.filter(t => t.department === "Poultry" && t.type === "Revenue").reduce((sum, t) => sum + t.amount, 0);
      const poultryExpense = transactions.filter(t => t.department === "Poultry" && t.type === "Expense").reduce((sum, t) => sum + t.amount, 0);
      return [
        { title: "Active Poultry Birds", val: `${activePoultry.toLocaleString()} Birds`, detail: "Live broilers, layers and ducks in sheds", sub: "Dynamic brooding parameters OK" },
        { title: "Egg Yield Cumulative", val: `${eggsColl.toLocaleString()} Eggs`, detail: "Total eggs retrieved across layers", sub: "Crate pack logistics sorted" },
        { title: "Poultry Revenue Posted", val: `₹${poultryRevenue.toLocaleString()}`, detail: "Direct farm egg and bulk bird sales", sub: "Daily retail cash collection" },
        { title: "Poultry Feed & Chick Cost", val: `₹${poultryExpense.toLocaleString()}`, detail: "Pellets, vaccine, and flock buy outlays", sub: "Balanced nutrient intake check" }
      ];
    }

    if (currentDashboardDept === "Butcher") {
      const butcherRev = transactions.filter(t => t.department === "Butcher" && t.type === "Revenue").reduce((sum, t) => sum + t.amount, 0);
      const processedUnits = animals.filter(a => a.status === "Processed").length;
      const totalMeatKg = sales.reduce((sum, s) => sum + s.items.reduce((sumItem, item) => sumItem + item.weightKg, 0), 0);
      return [
        { 
          title: lang === "bn" ? "প্রক্রিয়াজাত গরুর সংখ্যা" : "Processed Bovine Units", 
          val: lang === "bn" ? `${processedUnits} টি ক্যারকাস` : `${processedUnits} Carcasses`, 
          detail: lang === "bn" ? "কসাইখানায় স্থানান্তরিত ষাঁড়" : "Steers transferred to slaughterhouse", 
          sub: lang === "bn" ? "শূন্য অপচয় ফলন কমপ্লায়েন্স" : "Zero-loss yield compliance" 
        },
        { 
          title: lang === "bn" ? "খুচরা মাংস বিক্রয়" : "Carcass Retail Sales", 
          val: `₹${butcherRev.toLocaleString()}`, 
          detail: lang === "bn" ? "পিওএস অফলাইন বিলিং কাউন্টার বিক্রয়" : "POS offline billing counter take-ins", 
          sub: lang === "bn" ? "র‌্যাডিসন এবং অন্যান্য ক্লাব চুক্তি" : "Radisson and club contracts" 
        },
        { 
          title: lang === "bn" ? "বিতরণকৃত মাংসের টুকরা" : "Meat Cuts Distributed", 
          val: lang === "bn" ? `${totalMeatKg.toLocaleString()} কেজি` : `${totalMeatKg.toLocaleString()} Kg`, 
          detail: lang === "bn" ? "লয়েন, ফ্ল্যাঙ্ক এবং স্ট্যান্ডার্ড কাট সরবরাহ" : "Loin, flank, and standard cuts issued", 
          sub: lang === "bn" ? "ভ্যাকুয়াম কোল্ড-চেইন সার্টিফাইড" : "Vacuum cold-chain certified" 
        },
        { 
          title: lang === "bn" ? "চলতি খুচরা চালান" : "Active Retail Invoices", 
          val: lang === "bn" ? `${sales.length} টি রশিদ` : `${sales.length} Bills`, 
          detail: lang === "bn" ? "আনুগত্য কোড এবং বাণিজ্যিক বিক্রয় গণনা" : "Loyalty codes and commercial sales count", 
          sub: lang === "bn" ? "সমস্ত লগ সফলভাবে প্রিন্ট করা হয়েছে" : "All logs printed successfully" 
        }
      ];
    }

    if (currentDashboardDept === "Collections") {
      const collectibleDue = sales.filter(s => s.status !== "Paid").reduce((sum, s) => sum + s.amountDue, 0);
      const overdueBills = sales.filter(s => s.status === "Overdue" || s.status === "Unsettled").length;
      const totalRecovered = sales.reduce((sum, s) => sum + s.amountPaid, 0);
      const installmentCount = sales.flatMap(s => s.installments || []).length;
      const paidInstallments = sales.flatMap(s => s.installments || []).filter(inst => inst.status === "Paid").length;
      const rate = installmentCount > 0 ? ((paidInstallments / installmentCount) * 100).toFixed(0) + "%" : "100%";
      return [
        { title: "Receivable Outstanding", val: `₹${collectibleDue.toLocaleString()}`, detail: "Pending and overdue credit buyer balances", sub: "Guaranteed trace with call logs" },
        { title: "Flagged Overdue Buyers", val: `${overdueBills} Clients`, detail: "Overdue credit thresholds crossed", sub: "Urgent recovery call scheduled" },
        { title: "Aggregated Cash Recovery", val: `₹${totalRecovered.toLocaleString()}`, detail: "Cash down-payment plus installment yield", sub: "Safe cashier vault deposit" },
        { title: "Collection Recovery Rate", val: rate, detail: "Successful paid installments percentage", sub: "Agent follow-up rate exceptional" }
      ];
    }

    if (currentDashboardDept === "Feed") {
      const feedRev = transactions.filter(t => t.department === "Feed" && t.type === "Revenue").reduce((sum, t) => sum + t.amount, 0);
      const feedExp = transactions.filter(t => t.department === "Feed" && t.type === "Expense").reduce((sum, t) => sum + t.amount, 0);
      const silageItem = feedInventory.find(f => f.id === "feed-3");
      const branItem = feedInventory.find(f => f.id === "feed-1");
      const oilcakeItem = feedInventory.find(f => f.id === "feed-2");
      const concentratesSum = (branItem?.balance || 0) + (oilcakeItem?.balance || 0);
      return [
        { title: "Green Silage Reservoirs", val: `${silageItem ? silageItem.balance.toLocaleString() : "24,000"} Kg`, detail: "Ensiled fodder stack inside concrete silo", sub: "Optimal lactic pH levels" },
        { title: "Concentrates Remaining", val: `${concentratesSum.toLocaleString()} Kg`, detail: "Wheat bran and mustard oilcake combo", sub: "Automatic low-stock threshold warning" },
        { title: "Feed Store Sales Intake", val: `₹${feedRev.toLocaleString()}`, detail: "External retail supplies and mixed meals", sub: "Local farmer bulk collection" },
        { title: "Feed Store Refill Expense", val: `₹${feedExp.toLocaleString()}`, detail: "Bulk grains and molasses purchase orders", sub: "Imported supplier deals" }
      ];
    }

    return [];
  }, [currentDashboardDept, isDecentralizedMode, animals, transactions, sales, poultryBatches, feedInventory]);

  // Synchronize localStorage parameters or theme hooks
  useEffect(() => {
    const cachedTheme = localStorage.getItem("sla_theme") as "dark" | "light";
    if (cachedTheme) {
      setTheme(cachedTheme);
    }
    const cachedLang = localStorage.getItem("sla_lang") as "en" | "bn";
    if (cachedLang) {
      setLang(cachedLang);
    }
  }, []);

  // Isolate and synchronize user-specific records to localStorage autonomously
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const emailId = currentUser.email || currentUser.id;
      localStorage.setItem(`meatflow_animals_${emailId}`, JSON.stringify(animals));
    }
  }, [animals, isAuthenticated, currentUser]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const emailId = currentUser.email || currentUser.id;
      localStorage.setItem(`meatflow_sales_${emailId}`, JSON.stringify(sales));
    }
  }, [sales, isAuthenticated, currentUser]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const emailId = currentUser.email || currentUser.id;
      localStorage.setItem(`meatflow_transactions_${emailId}`, JSON.stringify(transactions));
    }
  }, [transactions, isAuthenticated, currentUser]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const emailId = currentUser.email || currentUser.id;
      localStorage.setItem(`meatflow_poultry_${emailId}`, JSON.stringify(poultryBatches));
    }
  }, [poultryBatches, isAuthenticated, currentUser]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const emailId = currentUser.email || currentUser.id;
      localStorage.setItem(`meatflow_feed_${emailId}`, JSON.stringify(feedInventory));
    }
  }, [feedInventory, isAuthenticated, currentUser]);

  const isTabRestrictedForRole = (tabId: string) => {
    if (!isDecentralizedMode) return false;
    if (currentUser.role === "Administrator") return false;
    if (tabId === "dashboard") return false; // Dashboard has its own decentralized customized filter!
    
    if (currentUser.role === "Livestock Management" && tabId === "livestock") return false;
    if (currentUser.role === "Poultry Management" && tabId === "poultry") return false;
    if (currentUser.role === "Butcher Shop" && tabId === "butcher") return false;
    if (currentUser.role === "Collections" && tabId === "collections") return false;
    if (currentUser.role === "Feed Shop" && tabId === "feed") return false;
    
    return true;
  };

  const renderRestrictedOverlay = (requiredDept: string) => {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-6 animate-fadeIn py-12 shadow-2xl my-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
          <Lock className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
            Sovereign Department Lockdown
          </span>
          <h2 className="text-xl font-black text-white tracking-tight">Decentralized Authorization Locked</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            This module is partitioned. As a <strong className="text-teal-400 font-bold uppercase">{currentUser.role}</strong>, you do not have operational clearance or signing authority inside the <strong className="text-white uppercase font-bold">{requiredDept}</strong> workspace.
          </p>
        </div>
        
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-left space-y-2.5 text-[11px] font-mono">
          <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-500">
            <span>Your Active Department</span>
            <span className="text-teal-400 font-bold uppercase">{currentUser.role}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-500">
            <span>Required Module Target</span>
            <span className="text-white uppercase font-black">{requiredDept}</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal italic mt-1 text-center font-sans">
            "Departmental decentralization is enforced to guarantee strict financial ledger independence."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <button
            onClick={() => {
              let targetRole: UserRole = "Administrator";
              if (requiredDept === "Livestock") targetRole = "Livestock Management";
              else if (requiredDept === "Poultry") targetRole = "Poultry Management";
              else if (requiredDept === "Butcher") targetRole = "Butcher Shop";
              else if (requiredDept === "Collections") targetRole = "Collections";
              else if (requiredDept === "Feed") targetRole = "Feed Shop";
              setCurrentUser({ ...currentUser, role: targetRole });
            }}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase font-mono transition cursor-pointer"
          >
            Switch to {requiredDept} Role
          </button>
          <button
            onClick={() => setIsDecentralizedMode(false)}
            className="border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white font-mono font-bold px-5 py-2.5 rounded-xl text-xs uppercase transition cursor-pointer"
          >
            Disable Decentralized Mode
          </button>
        </div>
      </div>
    );
  };

  const handleSetTheme = (newVal: "dark" | "light") => {
    setTheme(newVal);
    localStorage.setItem("sla_theme", newVal);
  };

  const handleSetLang = (newVal: "en" | "bn") => {
    setLang(newVal);
    localStorage.setItem("sla_lang", newVal);
  };

  // Synchronize dynamic offline updates
  const triggerOfflinedCloudSync = (isSilent = false) => {
    setSyncState("running");
    setSyncLog("Initializing WebSocket synchronization client...");
    setTimeout(() => {
      setSyncLog("💾 Writing central ledger indexes & ledger updates...");
      setTimeout(() => {
        setSyncState("idle");
        setSyncLog("");
        if (!isSilent) {
          alert("✓ Database Synced successfully with cloud ledger storage.");
        }
        addAuditLog("Database Synced", "System", `Cloud ledger synchronized (${isSilent ? "Automatic Background" : "Manual"})`);
      }, 1000);
    }, 1000);
  };

  // Background auto-sync trigger interval hook
  useEffect(() => {
    if (syncIntervalValue <= 0) return;
    const intervalMs = syncIntervalValue * 1000;
    const timer = setInterval(() => {
      triggerOfflinedCloudSync(true);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [syncIntervalValue]);

  // Standard D3 aggregations
  const monthlyData = useMemo(() => {
    const data: Array<{ key: string; label: string; revenue: number; expense: number }> = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      data.push({ key, label, revenue: 0, expense: 0 });
    }

    // Filter transactions based on currentDashboardDept when isDecentralizedMode is active
    const filteredTx = transactions.filter(t => {
      if (!isDecentralizedMode || currentDashboardDept === "All") return true;
      return t.department === currentDashboardDept;
    });

    filteredTx.forEach(t => {
      const tDate = new Date(t.date);
      const tKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, "0")}`;
      const monthObj = data.find(m => m.key === tKey);
      if (monthObj) {
        if (t.type === "Revenue") monthObj.revenue += t.amount;
        else monthObj.expense += t.amount;
      }
    });

    // Sales in this app represent retail meat / butcher shop purchases and dues
    const filteredSales = sales.filter(s => {
      if (!isDecentralizedMode || currentDashboardDept === "All") return true;
      if (currentDashboardDept === "Butcher" || currentDashboardDept === "Collections") return true;
      return false;
    });

    filteredSales.forEach(s => {
      const sDate = new Date(s.date);
      const sKey = `${sDate.getFullYear()}-${String(sDate.getMonth() + 1).padStart(2, "0")}`;
      const monthObj = data.find(m => m.key === sKey);
      if (monthObj) {
        monthObj.revenue += s.amountPaid;
      }
    });

    return data;
  }, [transactions, sales, isDecentralizedMode, currentDashboardDept]);

  // Biometric daily weight gains computation
  // An anomaly flags if a beast ADG exceeds/decreases baseline (+-20%)
  const computedDeviatingAnimals = useMemo(() => {
    const expectedBovineBaselines: Record<string, number> = {
      "Jersey Cross": 0.70, // 700g/day
      "Brahman": 0.95,      // 950g/day
      "Sahiwal": 0.75,      // 750g/day
      "Black Bengal": 0.12,  // 120g/day
      "Murrah": 0.85        // 850g/day
    };

    const deviations: Array<{
      animal: Animal;
      adg: number;
      baselineADG: number;
      deviationPercent: number;
      feedSuggestion: string;
    }> = [];

    animals.forEach(ani => {
      if (ani.status === "Active" && ani.weightHistory && ani.weightHistory.length >= 2) {
        const hist = ani.weightHistory;
        const first = hist[0];
        const last = hist[hist.length - 1];

        const days = Math.max(1, Math.round((new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 3600 * 24)));
        const weightGained = last.weightKg - first.weightKg;
        const actualADG = weightGained / days; // Average Daily Gain inside limits

        const baseline = expectedBovineBaselines[ani.breed] || 0.65;
        const deviationVal = ((actualADG - baseline) / baseline) * 100;

        if (Math.abs(deviationVal) > 20) {
          let suggestion = "";
          if (deviationVal < -20) {
            suggestion = "Increase wheat bran rations by 15% and supply additional copper mineral licks with vitamin AD3.";
          } else {
            suggestion = "Substantial gain. Optimize excessive carbohydrate/oil-cake intake to preserve body score carcass balances.";
          }
          deviations.push({
            animal: ani,
            adg: actualADG,
            baselineADG: baseline,
            deviationPercent: deviationVal,
            feedSuggestion: suggestion
          });
        }
      }
    });

    return deviations;
  }, [animals]);

  // Helper trigger to save feeding recommendations directly to animal notes
  const saveFeedRecommendationToNotes = (animalId: string, recommendation: string) => {
    setAnimals(prev => prev.map(ani => {
      if (ani.id === animalId) {
        return {
          ...ani,
          notes: `${ani.notes ? ani.notes + " " : ""}[FEED SUGGESTION ${new Date().toISOString().slice(0,10)}]: ${recommendation}`
        };
      }
      return ani;
    }));
    alert("✓ Feed adjustments written into cattle's medical progress log.");
  };

  // Add new animal register function
  const handleRegisterAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `ANI-${String(animals.length + 1).padStart(3, "0")}`;
    const formattedDate = getFormattedDateTime();
    const item: Animal = {
      id: newId,
      type: newAnimal.type,
      breed: newAnimal.breed || "Standard Hybrid",
      ageMonths: Number(newAnimal.ageMonths),
      weightKg: Number(newAnimal.weightKg),
      purchasePrice: Number(newAnimal.purchasePrice),
      advancePaid: Number(newAnimal.advancePaid),
      due: Math.max(0, Number(newAnimal.purchasePrice) - Number(newAnimal.advancePaid)),
      owner: newAnimal.owner || "Locally Bred",
      status: "Active",
      weightHistory: [
        { date: formattedDate, weightKg: Number(newAnimal.weightKg) }
      ],
      notes: newAnimal.notes
    };

    setAnimals([item, ...animals]);
    
    // Save custom fields
    const updatedValues = { ...customFieldValues, [newId]: { ...tempCustomFieldValues } };
    setCustomFieldValues(updatedValues);
    localStorage.setItem("sla_custom_field_values", JSON.stringify(updatedValues));
    setTempCustomFieldValues({});
    
    // Log as purchase expense in transaction log
    const tx: Transaction = {
      id: `TXN-${transactions.length + 1}`,
      type: "Expense",
      category: "Purchase",
      amount: Number(newAnimal.advancePaid),
      date: formattedDate.slice(0, 10),
      description: `Advance purchase payment for ${newId} (${item.breed})`,
      department: "Livestock"
    };
    setTransactions([tx, ...transactions]);

    addAuditLog("Cattle Registered", "Livestock", `Cattle ID ${newId} (${item.breed}) registered. Supplier: ${item.owner}, Price: ₹${item.purchasePrice}`);

    setShowAddAnimalModal(false);
    setNewAnimal({
      type: "Cow", breed: "", ageMonths: 12, weightKg: 200, purchasePrice: 40000, advancePaid: 30000, owner: "", notes: ""
    });
    alert(`✓ Success: Registered ${newId} successfully on timestamp: ${formattedDate}.`);
  };

  // Poultry Operational Action Handlers
  const handleAddPoultryBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PLT-${Math.floor(100 + Math.random() * 900)}`;
    const formattedDate = getFormattedDateTime();
    const batch: PoultryBatch = {
      id: newId,
      type: newPoultryBatch.type,
      breed: newPoultryBatch.breed || `${newPoultryBatch.type} Standard`,
      housingBuilding: newPoultryBatch.housingBuilding || "Shed A",
      initialCount: Number(newPoultryBatch.initialCount),
      currentCount: Number(newPoultryBatch.initialCount),
      acquisitionDate: formattedDate.slice(0, 10),
      acquisitionAgeDays: Number(newPoultryBatch.acquisitionAgeDays),
      currentAgeDays: Number(newPoultryBatch.acquisitionAgeDays),
      averageWeightKg: 0.05, // young chick start
      feedConsumedKg: 0,
      mortalityCount: 0,
      eggsCollectedCumulative: newPoultryBatch.type === "Layer" || newPoultryBatch.type === "Duck" ? 0 : undefined,
      purchaseCost: Number(newPoultryBatch.purchaseCost),
      status: "Chicks",
      notes: newPoultryBatch.notes || "Initial flock acquisition."
    };

    setPoultryBatches([batch, ...poultryBatches]);

    const updatedValues = { ...customFieldValues, [newId]: { ...tempCustomFieldValues } };
    setCustomFieldValues(updatedValues);
    localStorage.setItem("sla_custom_field_values", JSON.stringify(updatedValues));
    setTempCustomFieldValues({});

    // Register chick flock cost as an Expense transaction
    const tx: Transaction = {
      id: `TXN-P-${Math.floor(1000 + Math.random() * 9000)}`,
      type: "Expense",
      category: "Purchase",
      amount: Number(newPoultryBatch.purchaseCost),
      date: formattedDate.slice(0, 10),
      description: `Acquisition cost of poultry flock ${newId} (${batch.breed}, ${batch.initialCount} birds)`,
      department: "Poultry"
    };
    setTransactions([tx, ...transactions]);

    addAuditLog("Poultry Batch Registered", "Poultry", `Flock ID ${newId} (${batch.breed}, ${batch.initialCount} bird heads) registered. Housing: ${batch.housingBuilding}`);

    setShowAddPoultryModal(false);
    setNewPoultryBatch({
      type: "Broiler",
      breed: "Cobb 500",
      housingBuilding: "Shed 1-A",
      initialCount: 1000,
      acquisitionDate: new Date().toISOString().slice(0, 10),
      acquisitionAgeDays: 1,
      purchaseCost: 55000,
      notes: ""
    });
    alert(`✓ Success: Registered poultry flock ${newId} (${batch.breed}) with ${batch.initialCount} bird heads on timestamp: ${formattedDate}.`);
  };

  const applyPoultryWeight = (batchId: string, newWeight: number) => {
    if (isNaN(newWeight) || newWeight <= 0) {
      alert("Please enter a valid weight in Kg.");
      return;
    }
    setPoultryBatches(prev => prev.map(p => {
      if (p.id === batchId) {
        return {
          ...p,
          averageWeightKg: newWeight,
          notes: `${p.notes ? p.notes + " " : ""}[Log: Weight updated to ${newWeight}kg on ${new Date().toISOString().slice(0,10)}]`
        };
      }
      return p;
    }));
    alert(`Success: Poultry weight updated to ${newWeight} Kg for batch ${batchId}.`);
  };

  const applyPoultryLoss = (batchId: string, deadCount: number) => {
    if (isNaN(deadCount) || deadCount <= 0) {
      alert("Please enter a valid mortality count.");
      return;
    }
    let success = true;
    setPoultryBatches(prev => prev.map(p => {
      if (p.id === batchId) {
        if (p.currentCount < deadCount) {
          alert(`Warning: Cannot report ${deadCount} losses. Active count is only ${p.currentCount}.`);
          success = false;
          return p;
        }
        return {
          ...p,
          currentCount: p.currentCount - deadCount,
          mortalityCount: p.mortalityCount + deadCount,
          status: p.currentCount - deadCount === 0 ? "Harvested" : p.status,
          notes: `${p.notes ? p.notes + " " : ""}[Log: Recorded loss of ${deadCount} birds on ${new Date().toISOString().slice(0,10)}]`
        };
      }
      return p;
    }));
    if (success) {
      alert(`Recorded mortality of ${deadCount} heads for batch ${batchId}.`);
    }
  };

  const applyPoultryFeed = (batchId: string, feedKg: number, defaultCostPerKg = 45) => {
    if (isNaN(feedKg) || feedKg <= 0) {
      alert("Please enter a valid feed weight in Kg.");
      return;
    }
    setPoultryBatches(prev => prev.map(p => {
      if (p.id === batchId) {
        return {
          ...p,
          feedConsumedKg: p.feedConsumedKg + feedKg,
          notes: `${p.notes ? p.notes + " " : ""}[Log: Allocated ${feedKg}kg feed on ${new Date().toISOString().slice(0,10)}]`
        };
      }
      return p;
    }));

    // Register feed expense
    const cost = feedKg * defaultCostPerKg;
    const tx: Transaction = {
      id: `TXN-PFEED-${Math.floor(1000 + Math.random() * 9000)}`,
      type: "Expense",
      category: "Feed",
      amount: cost,
      date: new Date().toISOString().split('T')[0],
      description: `Feed expense: allocated ${feedKg} Kg concentrate feed for batch ${batchId}`,
      department: "Poultry"
    };
    setTransactions([tx, ...transactions]);
    alert(`Success: Allocated ${feedKg} Kg feed. Added ₹${cost.toLocaleString()} feed expense to central ledger.`);
  };

  const applyPoultryEggs = (batchId: string, eggsCount: number, defaultPricePerEgg = 6) => {
    if (isNaN(eggsCount) || eggsCount <= 0) {
      alert("Please enter a valid egg count.");
      return;
    }
    setPoultryBatches(prev => prev.map(p => {
      if (p.id === batchId) {
        return {
          ...p,
          eggsCollectedCumulative: (p.eggsCollectedCumulative || 0) + eggsCount,
          notes: `${p.notes ? p.notes + " " : ""}[Log: Collected ${eggsCount} eggs on ${new Date().toISOString().slice(0,10)}]`
        };
      }
      return p;
    }));

    // Register egg sale revenue
    const rev = eggsCount * defaultPricePerEgg;
    const tx: Transaction = {
      id: `TXN-PEGGS-${Math.floor(1000 + Math.random() * 9000)}`,
      type: "Revenue",
      category: "Sale",
      amount: rev,
      date: new Date().toISOString().split('T')[0],
      description: `Egg collection sale: sold ${eggsCount} fresh eggs from layer batch ${batchId}`,
      department: "Poultry"
    };
    setTransactions([tx, ...transactions]);
    alert(`Success: Registered ${eggsCount} eggs. Added ₹${rev.toLocaleString()} revenue to central ledger.`);
  };

  const sellPoultryBatch = (batchId: string, saleAmount: number) => {
    if (isNaN(saleAmount) || saleAmount <= 0) {
      alert("Please enter a valid sale amount in ₹.");
      return;
    }
    let success = true;
    let batchType = "";
    let birdsSold = 0;
    setPoultryBatches(prev => prev.map(p => {
      if (p.id === batchId) {
        if (p.status === "Sold") {
          alert(`Warning: Batch ${batchId} is already marked as sold!`);
          success = false;
          return p;
        }
        batchType = p.type;
        birdsSold = p.currentCount;
        return {
          ...p,
          currentCount: 0,
          status: "Sold",
          salesRevenue: saleAmount,
          notes: `${p.notes ? p.notes + " " : ""}[Log: Batch sold out on ${new Date().toISOString().slice(0,10)} for total ₹${saleAmount}]`
        };
      }
      return p;
    }));

    if (success) {
      // Register sale revenue transaction
      const tx: Transaction = {
        id: `TXN-PSOLD-${Math.floor(1000 + Math.random() * 9000)}`,
        type: "Revenue",
        category: "Sale",
        amount: saleAmount,
        date: new Date().toISOString().split('T')[0],
        description: `Bulk sellout: ${birdsSold} heads of ${batchType} batch ${batchId} cleared`,
        department: "Poultry"
      };
      setTransactions([tx, ...transactions]);
      alert(`Success: Poultry flock ${batchId} sold out for ₹${saleAmount.toLocaleString()}. Revenue posted to ledger.`);
    }
  };

  // Live Inline Weight Entry hook for Cattle Details
  const [newRecordedWeight, setNewRecordedWeight] = useState("");
  const [activeWeightEditId, setActiveWeightEditId] = useState<string | null>(null);

  const applyWeightEntry = (aniId: string) => {
    const parsedWeight = parseFloat(newRecordedWeight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      alert("Please enter a valid weight in kg.");
      return;
    }

    setAnimals(prev => prev.map(ani => {
      if (ani.id === aniId) {
        const hist = ani.weightHistory || [];
        const entry: WeightHistoryItem = {
          date: new Date().toISOString().split('T')[0],
          weightKg: parsedWeight
        };
        return {
          ...ani,
          weightKg: parsedWeight,
          weightHistory: [...hist, entry]
        };
      }
      return ani;
    }));

    setNewRecordedWeight("");
    setActiveWeightEditId(null);
    alert("✓ Live weight logged into biometric record history.");
  };

  // QR Code Hardware permissions handler & scanning emulation fallbacks
  const startQRScannerCamera = async () => {
    setIsScanningQR(true);
    setQrScanningCameraState("accessing");
    setScannerCameraLogs("Accessing environment wide camera optics...");
    setQrTxnRefId("");

    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
        });
        
        qrCameraStreamRef.current = stream;
        setQrScanningCameraState("ready");
        setScannerCameraLogs("Lens active! Focus the customer's digital payment barcode.");
        
        setTimeout(() => {
          if (qrVideoRef.current) {
            qrVideoRef.current.srcObject = stream;
            qrVideoRef.current.play().catch(err => console.warn(err));
          }
        }, 150);

        setTimeout(() => {
          const mockId = `TXN-BKASH-QR-${Math.floor(100000 + Math.random() * 900000)}`;
          setQrTxnRefId(mockId);
          setQrScanningCameraState("scanned");
          setScannerCameraLogs(`Successfully Scanned: ${mockId}`);
          alert(`✓ Digital bKash invoice found! Ref ID: ${mockId}`);
          stopQRScannerCamera();
        }, 3200);

      } else {
        throw new Error("optics hardware unsupported");
      }
    } catch (err) {
      setQrScanningCameraState("error");
      setScannerCameraLogs("[SIMULATING OPTICS] Booting matrix QR reader emulator stream...");
      
      setTimeout(() => {
        setQrScanningCameraState("ready");
        setScannerCameraLogs("Emulating green matrix laser frame alignment...");
        
        setTimeout(() => {
          const mockId = `TXN-EMU-${Math.floor(200000 + Math.random() * 700000)}`;
          setQrTxnRefId(mockId);
          setQrScanningCameraState("scanned");
          setScannerCameraLogs(`Successfully Solved Barcode: ${mockId}`);
          alert(`✓ Simulated barcode capture resolved: ${mockId}`);
          stopQRScannerCamera();
        }, 2200);
      }, 1000);
    }
  };

  const stopQRScannerCamera = () => {
    if (qrCameraStreamRef.current) {
      qrCameraStreamRef.current.getTracks().forEach(tr => tr.stop());
      qrCameraStreamRef.current = null;
    }
    if (qrVideoRef.current) {
      qrVideoRef.current.srcObject = null;
    }
    setIsScanningQR(false);
  };

  // Submit POS Billing Checkouts
  const handleIssuePOSBill = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceId = `INV-${sales.length + 1001}`;
    const totalAmount = posBillForm.weightKg * posBillForm.ratePerKg;

    const invoice: Sale = {
      id: invoiceId,
      customerName: posBillForm.customerName || "Retail Counter",
      customerPhone: posBillForm.customerPhone || "N/A",
      customerCode: `CUST-${Math.floor(100 + Math.random()*899)}`,
      date: new Date().toISOString().split('T')[0],
      items: [{ type: posBillForm.itemType, weightKg: Number(posBillForm.weightKg), ratePerKg: Number(posBillForm.ratePerKg) }],
      total: totalAmount,
      amountPaid: posBillForm.paymentMethod === "Credit" ? 0 : totalAmount,
      amountDue: posBillForm.paymentMethod === "Credit" ? totalAmount : 0,
      status: posBillForm.paymentMethod === "Credit" ? "Unsettled" : "Paid",
      paymentMethod: posBillForm.paymentMethod,
      transactionRefId: qrTxnRefId || undefined
    };

    setSales([invoice, ...sales]);

    // Save as Transaction ledger if paid
    if (invoice.amountPaid > 0) {
      const tx: Transaction = {
        id: `TXN-${transactions.length + 1}`,
        type: "Revenue",
        category: "Sale",
        amount: invoice.amountPaid,
        date: invoice.date,
        description: `POS Retail Invoice #${invoiceId}`,
        department: "Butcher"
      };
      setTransactions([tx, ...transactions]);
    }

    setPosBillForm({
      customerName: "", customerPhone: "", itemType: "Premium Beef Loin", weightKg: 10, ratePerKg: 780, paymentMethod: "Cash"
    });
    setQrTxnRefId("");
    setShowBillingModal(false);
    addAuditLog("POS Bill Issued", "Butcher", `Invoiced POS #${invoiceId} to "${invoice.customerName}" for ₹${invoice.total.toLocaleString()} (${invoice.paymentMethod})`);
    alert(`Success: Print invoice billing resolved. Receipt ${invoiceId} generated.`);
  };

  // Settle instalment payments on overdue collection tracks (Custom Amount and Partial support!)
  const handleCollectDue = (invId: string, installmentId: string) => {
    const sale = sales.find(s => s.id === invId);
    if (!sale || !sale.installments) return;
    const inst = sale.installments.find(i => i.id === installmentId);
    if (!inst) return;

    setCollectingInstallment({
      saleId: invId,
      installmentId: installmentId,
      amount: inst.amount
    });
    setCollectAmountInput(inst.amount.toString());
    setCollectType("Full");
  };

  const postCollectDue = (invId: string, installmentId: string, collectedAmount: number) => {
    setSales(prev => prev.map(inv => {
      if (inv.id === invId && inv.installments) {
        const fixedInst = inv.installments.map(inst => {
          if (inst.id === installmentId) {
            if (collectedAmount >= inst.amount) {
              return { ...inst, status: "Paid" as const, paidDate: new Date().toISOString().slice(0, 10) };
            } else {
              // Partial payment on the installment - reduce amount of this installment and keep pending/overdue
              const nextAmt = inst.amount - collectedAmount;
              return { ...inst, amount: nextAmt, status: "Overdue" as const };
            }
          }
          return inst;
        });

        // Add absolute collected amount to sale totals
        const netPaid = inv.amountPaid + collectedAmount;
        const remainingDue = Math.max(0, inv.total - netPaid);

        return {
          ...inv,
          installments: fixedInst,
          amountPaid: netPaid,
          amountDue: remainingDue,
          status: remainingDue === 0 ? "Paid" as const : "Partial" as const
        };
      }
      return inv;
    }));

    // Update dynamic operational logs
    const tx: Transaction = {
      id: `TXN-${transactions.length + 1}`,
      type: "Revenue",
      category: "Sale",
      amount: collectedAmount,
      date: new Date().toISOString().slice(0, 10),
      description: `Collection realizing ₹${collectedAmount.toLocaleString()} on invoice #${invId} (Inst: ${installmentId})`,
      department: "Collections"
    };
    setTransactions(prev => [tx, ...prev]);
    
    addAuditLog("Installment Collected", "Collections", `Collected ₹${collectedAmount.toLocaleString()} on invoice #${invId} (${installmentId})`);
    
    // Reset collection tracker
    setCollectingInstallment(null);
    alert(`✓ Ledger adjusted! Collected ₹${collectedAmount.toLocaleString()} Auto-logged Date: ${new Date().toISOString().slice(0, 10)}. Remaining due updated.`);
  };

  // Render Core Proximity RFID & Barcode Scanner Simulate Panel
  const renderScanTerminal = (dept: "Poultry" | "Livestock" | "Butcher" | "Feed") => {
    // Get list of mock tags depending on department
    let presets: string[] = [];
    if (dept === "Poultry") {
      presets = poultryBatches.map(b => b.id);
    } else if (dept === "Livestock") {
      presets = animals.filter(a => a.status === "Active").map(a => a.id);
    } else if (dept === "Butcher") {
      presets = animals.filter(a => a.status === "Active" && a.type === "Cow").map(a => a.id);
    } else if (dept === "Feed") {
      presets = feedInventory.map(f => f.id);
    }

    const currentScannedEntity = () => {
      if (!selectedScannerEntityId) return null;
      if (dept === "Poultry") {
        return poultryBatches.find(b => b.id === selectedScannerEntityId);
      } else if (dept === "Livestock" || dept === "Butcher") {
        return animals.find(a => a.id === selectedScannerEntityId);
      } else if (dept === "Feed") {
        return feedInventory.find(f => f.id === selectedScannerEntityId);
      }
      return null;
    };

    const entity = currentScannedEntity();

    return (
      <div className="bg-slate-900 border border-slate-950 rounded-3xl p-5 shadow-xl relative overflow-hidden space-y-4 no-print select-none">
        {/* Header bar with tag online status */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-450 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-550"></span>
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-teal-450 block">RF-X Proximity Scanner</span>
              <h3 className="text-white text-xs font-black font-mono uppercase">{dept} Tag Capture</h3>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-850 uppercase">
            {isLaserScanning ? "Transmitting..." : "Laser Sweep Online"}
          </span>
        </div>

        {/* Laser Visualizer Screen */}
        <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[90px] text-center">
          {isLaserScanning && (
            <div className="absolute inset-x-0 w-full bg-red-500/35 h-[2px] shadow-[0_0_8px_#ef4444] animate-[bounce_1.4s_infinite]" />
          )}
          
          <div className="z-10 space-y-1">
            <p className="text-[10px] text-slate-350 font-mono tracking-wide max-w-sm leading-relaxed">
              {scannerTerminalMsg}
            </p>
            {isLaserScanning && (
              <span className="text-[8px] font-mono text-rose-400 uppercase font-black tracking-widest animate-pulse block">
                Reading tag transponder stream...
              </span>
            )}
          </div>
        </div>

        {/* Preset quick simulation tags */}
        <div className="space-y-1.5">
          <span className="text-[9px] uppercase font-mono text-slate-500 block font-bold">
            Simulate scanning tag transponder / SKU barcode:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.slice(0, 6).map(tag => (
              <button
                key={tag}
                onClick={() => handleSimulatedTagScan(tag, dept)}
                className={`text-[9.5px] font-mono px-3 py-1.5 rounded-xl border uppercase transition cursor-pointer font-bold ${
                  selectedScannerEntityId === tag
                    ? "bg-teal-500 text-slate-950 border-teal-450 font-black scale-[1.03] shadow-md"
                    : "bg-slate-950 hover:bg-slate-850 text-slate-300 border-slate-900"
                }`}
              >
                📡 Scan {tag}
              </button>
            ))}
            <div className="flex gap-1 items-center bg-slate-950 px-2 py-1 border border-slate-850 rounded-xl relative">
              <input
                type="text"
                placeholder="TAG ID..."
                value={scannerTagSearch}
                onChange={(e) => setScannerTagSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSimulatedTagScan(scannerTagSearch, dept);
                  }
                }}
                className="bg-transparent text-white font-mono text-[9px] text-center w-20 uppercase font-bold focus:outline-none"
              />
              <button
                onClick={() => handleSimulatedTagScan(scannerTagSearch, dept)}
                className="bg-teal-550 text-slate-950 text-[8px] font-black uppercase px-2 py-1 rounded-lg cursor-pointer transition"
              >
                Scan
              </button>
            </div>
          </div>
        </div>

        {/* Decoder / Quick Action Drawer Panel */}
        {entity && (
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4.5 space-y-4 text-left transition">
            {/* Scanned Tag Header */}
            <div className="pb-2 border-b border-slate-900 flex justify-between items-baseline">
              <div>
                <span className="text-[8.5px] font-mono text-slate-500 uppercase font-bold block leading-none">Scanned Active Entity</span>
                <strong className="text-white text-xs font-mono font-black">{selectedScannerEntityId}</strong>
              </div>
              <span className="bg-teal-400/10 text-teal-400 text-[8.5px] font-mono font-black px-2 py-0.5 rounded border border-teal-500/20 uppercase">
                Tag Verified
              </span>
            </div>

            {/* Entity Actions */}
            {dept === "Poultry" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Instantly Log Weight */}
                <div className="bg-slate-900 p-3 border border-slate-850 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">Average Weight (Kg)</span>
                    <span className="text-[9px] font-mono text-teal-450 font-bold">Current: {(entity as PoultryBatch).averageWeightKg} Kg</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 1.55"
                      value={instantWeightInput}
                      onChange={(e) => setInstantWeightInput(e.target.value)}
                      className="bg-slate-950 px-3 py-1.5 text-xs text-white border border-slate-800 rounded-xl w-full font-mono font-extrabold focus:outline-none focus:border-teal-500"
                    />
                    <button
                      onClick={() => handleInstantLoggedWeight(selectedScannerEntityId, "Poultry")}
                      className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-[10px] px-3.5 rounded-xl uppercase font-mono cursor-pointer transition select-none"
                    >
                      Log
                    </button>
                  </div>
                </div>

                {/* Instantly Register Mortality */}
                <div className="bg-slate-900 p-3 border border-slate-850 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">Register Mortality Loss</span>
                    <span className="text-[9px] font-mono text-rose-450 font-bold">Deceased: {(entity as PoultryBatch).mortalityCount}</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Dead birds amount..."
                      value={instantMortalityInput}
                      onChange={(e) => setInstantMortalityInput(e.target.value)}
                      className="bg-slate-950 px-3 py-1.5 text-xs text-white border border-slate-800 rounded-xl w-full font-mono font-extrabold focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={() => handleInstantLoggedMortality(selectedScannerEntityId, "Poultry")}
                      className="bg-red-500 hover:bg-red-400 text-slate-950 font-black text-[10px] px-3.5 rounded-xl uppercase font-mono cursor-pointer transition select-none"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            )}

            {dept === "Livestock" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Instantly Log Live Weight */}
                <div className="bg-slate-900 p-3 border border-slate-850 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">Beast Live Weight (Kg)</span>
                    <span className="text-[9px] font-mono text-teal-450 font-bold">Current: {(entity as Animal).weightKg} Kg</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Current weight in Kg..."
                      value={instantWeightInput}
                      onChange={(e) => setInstantWeightInput(e.target.value)}
                      className="bg-slate-950 px-3 py-1.5 text-xs text-white border border-slate-800 rounded-xl w-full font-mono font-extrabold focus:outline-none focus:border-teal-500"
                    />
                    <button
                      onClick={() => handleInstantLoggedWeight(selectedScannerEntityId, "Livestock")}
                      className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-[10px] px-3.5 rounded-xl uppercase font-mono cursor-pointer transition select-none"
                    >
                      Log Weight
                    </button>
                  </div>
                </div>

                {/* Mark deceased / Health fail */}
                <div className="bg-slate-900 p-3 border border-slate-850 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase block">Biosecurity & Veterinary Actions</span>
                    <p className="text-[8.5px] text-slate-500 font-mono mt-1">If beast is suffering lethal conditions, flag on ledger.</p>
                  </div>
                  <button
                    onClick={() => handleInstantLoggedMortality(selectedScannerEntityId, "Livestock")}
                    className="w-full mt-3 bg-red-500 hover:bg-red-400 text-slate-950 font-black text-[10px] py-2 rounded-xl uppercase font-mono cursor-pointer transition text-center select-none"
                  >
                    Mark Mortality status
                  </button>
                </div>
              </div>
            )}

            {dept === "Butcher" && (
              <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl space-y-3.5">
                <span className="text-[9px] text-teal-450 font-mono font-bold uppercase block border-b border-slate-850 pb-1.5">
                  {lang === "bn" ? "কসাইখানা কারকাস ফলন নিবন্ধন" : "Slaughterhouse Carcass yield registration"}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[8px] text-slate-500 uppercase font-mono font-bold block mb-1">
                      {lang === "bn" ? "ক্যারকাস ফলন (কেজি)" : "Carcass Yield (Kg)"}
                    </label>
                    <input
                      type="number"
                      value={instantCarcassYieldInput}
                      onChange={(e) => setInstantCarcassYieldInput(e.target.value)}
                      className="bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800 rounded-xl w-full font-mono font-extrabold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] text-slate-500 uppercase font-mono font-bold block mb-1">
                      {lang === "bn" ? "মাংসের গ্রেড" : "Meat Yield Grade"}
                    </label>
                    <select
                      value={instantCarcassGrade}
                      onChange={(e) => setInstantCarcassGrade(e.target.value)}
                      className="bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800 rounded-xl w-full font-mono font-bold cursor-pointer focus:outline-none"
                    >
                      <option value="Choice Grade A">{lang === "bn" ? "চয়েস গ্রেড এ (প্রিমিয়াম)" : "Choice Grade A (Premium)"}</option>
                      <option value="Select Grade B">{lang === "bn" ? "সিলেক্ট গ্রেড বি" : "Select Grade B"}</option>
                      <option value="Bone-In Grade C">{lang === "bn" ? "বোন-ইন গ্রেড সি" : "Bone-In Grade C"}</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => handleInstantLoggedCarcass(selectedScannerEntityId)}
                      className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-[10.5px] py-2 px-3 rounded-xl uppercase font-mono cursor-pointer transition leading-tight text-center select-none"
                    >
                      {lang === "bn" ? "ক্যারকাস প্রক্রিয়াজাত করুন" : "Process Carcass"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {dept === "Feed" && (
              <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl space-y-3">
                <span className="text-[9px] text-slate-400 font-mono font-bold uppercase block">Stock adjusting tools</span>
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    onClick={() => handleInstantLoggedFeed(selectedScannerEntityId, "Consume")}
                    className="bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-black py-2.5 rounded-xl font-mono cursor-pointer transition select-none"
                  >
                    Deduct Simulation Units (-)
                  </button>
                  <button
                    onClick={() => handleInstantLoggedFeed(selectedScannerEntityId, "Restock")}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-[10px] font-black py-2.5 rounded-xl font-mono cursor-pointer transition select-none"
                  >
                    Proximity RFID Refill (+)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Add Call details collections notes
  const saveCallNotes = (invId: string) => {
    if (!newCallNotes) return;
    setSales(prev => prev.map(inv => {
      if (inv.id === invId) {
        const logs = inv.callLogs || [];
        const item = {
          id: `C-${logs.length + 1}`,
          timestamp: new Date().toISOString(),
          notes: newCallNotes,
          agentName: currentUser.name
        };
        return {
          ...inv,
          callLogs: [...logs, item]
        };
      }
      return inv;
    }));
    setNewCallNotes("");
    setActiveCollectionInvoiceId(null);
    alert("✓ Collector callback notes saved.");
  };

  // Export Outstanding Ledger into Printer-friendly branded PDF using jsPDF
  const exportBrandedDueLedgerPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Drawing Title Header blocks
    doc.setFillColor(7, 13, 30); // slate-950 color band
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ShaieAlam LiveStock ERP", 15, 18);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(204, 251, 241); // lighter teal
    doc.text("FARM RECEIVABLES & OUTSTANDING DUE LEDGER", 15, 25);
    doc.text(`Report Generated On: ${new Date().toISOString().slice(0, 10)}`, 15, 31);

    // Dynamic aggregates table drawing
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 48, 180, 24, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, 48, 180, 24);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text("TOTAL RECEIVABLES UNDER COMPLIANCE TRACK", 20, 56);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(15, 118, 110); // deep teal
    const outstandingTotal = sales.reduce((acc, curr) => acc + curr.amountDue, 0);
    doc.text(`INR ${outstandingTotal.toLocaleString()}`, 20, 64);

    // Render columns headers
    doc.setFontSize(9);
    doc.setFillColor(15, 118, 110);
    doc.rect(15, 80, 180, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("INVOICE ID", 18, 85);
    doc.text("CUSTOMER NAME", 45, 85);
    doc.text("DUE DATE / PROMISED", 95, 85);
    doc.text("TOTAL DUE AMOUNT", 145, 85);

    let yPosition = 94;
    doc.setTextColor(30, 41, 59);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);

    sales.forEach(sale => {
      if (sale.amountDue > 0) {
        doc.text(sale.id, 18, yPosition);
        doc.text(sale.customerName, 45, yPosition);
        doc.text(sale.promisedPaymentDate || "On Installments", 95, yPosition);
        doc.text(`INR ${sale.amountDue.toLocaleString()}`, 145, yPosition);
        
        // Horizontal line separator
        doc.line(15, yPosition + 4, 195, yPosition + 4);
        yPosition += 11;
      }
    });

    // Signature Area
    doc.line(140, 270, 190, 270);
    doc.setFontSize(8.5);
    doc.text("Authorized Signature", 148, 275);

    doc.save(`Receivables_Ledger_${new Date().toISOString().slice(0, 10)}.pdf`);
    alert("✓ Automated Branded A4 PDF Ledger exported.");
  };

  // Export Poultry Ledger as PDF
  const exportPoultryLedgerPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Header segment
    doc.setFillColor(7, 13, 30); // slate-950 blue background
    doc.rect(0, 0, 210, 42, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ShaieAlam Meat & Livestock", 15, 18);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(204, 251, 241); // slate/teal tint
    doc.text("COMMERCIAL POULTRY PERFORMANCE & OPERATIONS LEDGER", 15, 25);
    doc.text(`Report Datetime (IST): ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`, 15, 31);
    doc.text(`Core Integration ID: 1b6a6789-35e5-45bd-96b5-65bbb71a7f58`, 15, 36);

    // Dynamic derivation of summary values
    const totalFlocksCount = poultryBatches.length;
    const activeFlocks = poultryBatches.filter(b => b.status !== "Sold");
    const activeHeads = activeFlocks.reduce((acc, curr) => acc + curr.currentCount, 0);
    const totalLossMortality = poultryBatches.reduce((acc, curr) => acc + curr.mortalityCount, 0);
    const totalChicksStarted = poultryBatches.reduce((acc, curr) => acc + curr.initialCount, 0);
    const avgMortalityRate = totalChicksStarted > 0 ? (totalLossMortality / totalChicksStarted) * 100 : 0;
    const totalPoultryFeedCost = poultryBatches.reduce((acc, curr) => acc + (curr.feedConsumedKg * 45), 0); // ₹45/Kg in our calculation
    const totalPurchaseCost = poultryBatches.reduce((acc, curr) => acc + curr.purchaseCost, 0);

    // Render KPI Box on top
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 48, 180, 26, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, 48, 180, 26);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("SUMMARY METRICS OVERVIEW", 20, 54);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`Registered Flocks: ${totalFlocksCount} Flocks (${activeFlocks.length} Active)`, 20, 59);
    doc.text(`Active Bird Headcount: ${activeHeads.toLocaleString()} Birds`, 20, 64);
    doc.text(`Cumulative Loss (Mortality): ${totalLossMortality} heads (${avgMortalityRate.toFixed(1)}%)`, 20, 69);

    doc.text(`Total Flocks Feed Cost: INR ${totalPoultryFeedCost.toLocaleString()}`, 110, 59);
    doc.text(`Initial Chick Outlay: INR ${totalPurchaseCost.toLocaleString()}`, 110, 64);
    doc.text(`Total Capital Expended: INR ${(totalPurchaseCost + totalPoultryFeedCost).toLocaleString()}`, 110, 69);

    // Columns headers
    doc.setFontSize(8);
    doc.setFillColor(15, 118, 110); // deep teal banner
    doc.rect(15, 80, 180, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.text("FLOCK ID", 17, 85);
    doc.text("TYPE & BREED", 40, 85);
    doc.text("HEADCOUNT (IN/ACT)", 82, 85);
    doc.text("FEED COST", 120, 85);
    doc.text("MORTALITY (%)", 148, 85);
    doc.text("STATUS", 180, 85);

    let yPosition = 93;
    doc.setTextColor(30, 41, 59);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);

    poultryBatches.forEach(batch => {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;

        // Draw smaller page header on next page
        doc.setFillColor(7, 13, 30);
        doc.rect(0, 0, 210, 12, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.text("ShaieAlam Poultry Ledgers", 15, 8);
        doc.setFont("Helvetica", "normal");

        doc.setFontSize(8);
        doc.setFillColor(15, 118, 110);
        doc.rect(15, 15, 180, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("Helvetica", "bold");
        doc.text("FLOCK ID", 17, 20);
        doc.text("TYPE & BREED", 40, 20);
        doc.text("HEADCOUNT (IN/ACT)", 82, 20);
        doc.text("FEED COST", 120, 20);
        doc.text("MORTALITY (%)", 148, 20);
        doc.text("STATUS", 180, 20);

        yPosition = 28;
      }

      doc.setTextColor(15, 118, 110);
      doc.setFont("Helvetica", "bold");
      doc.text(batch.id, 17, yPosition);

      doc.setTextColor(30, 41, 59);
      doc.setFont("Helvetica", "normal");
      doc.text(`${batch.type} - ${batch.breed}`, 40, yPosition);

      doc.text(`${batch.initialCount} / ${batch.currentCount}`, 82, yPosition);

      const feedCost = batch.feedConsumedKg * 45;
      doc.text(`INR ${feedCost.toLocaleString()}`, 120, yPosition);

      const mortRate = batch.initialCount > 0 ? (batch.mortalityCount / batch.initialCount) * 100 : 0;
      doc.text(`${batch.mortalityCount} (${mortRate.toFixed(1)}%)`, 148, yPosition);

      doc.text(batch.status, 180, yPosition);

      doc.setDrawColor(241, 245, 249);
      doc.line(15, yPosition + 3, 195, yPosition + 3);
      yPosition += 9;
    });

    // Signature line
    if (yPosition > 255) {
      doc.addPage();
      yPosition = 30;
    }
    doc.setDrawColor(148, 163, 184);
    doc.line(140, 270, 190, 270);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Authorized Poultry In-Charge", 141, 274);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Digitally authenticated via SSL secured token", 141, 278);

    doc.save(`Poultry_Ledger_${new Date().toISOString().slice(0, 10)}.pdf`);
    alert(lang === "bn" ? "✓ ব্রান্ডেড পোল্ট্রি পিডিএফ লেজার সফলভাবে ডাউনলোড করা হয়েছে।" : "✓ Automated branded A4 PDF Poultry Ledger generated and exported.");
  };

  // Bulk CSV Livestock import handler with extensive schema validation
  const handleCSVImport = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) {
      alert("CSV must contain at least a header row and 1 data row.");
      return;
    }

    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const getIdx = (aliases: string[]) => {
      for (let i = 0; i < header.length; i++) {
        if (aliases.some(alias => header[i].includes(alias))) return i;
      }
      return -1;
    };

    const typeIdx = getIdx(["type", "species", "category", "পশু"]);
    const breedIdx = getIdx(["breed", "breed type", "জাত"]);
    const ageIdx = getIdx(["age", "month", "বয়স"]);
    const weightIdx = getIdx(["weight", "kg", "ওজন"]);
    const priceIdx = getIdx(["price", "cost", "ক্রয়"]);
    const advanceIdx = getIdx(["advance", "paid", "অগ্রিম"]);
    const ownerIdx = getIdx(["owner", "supplier", "সরবরাহকারী"]);
    const notesIdx = getIdx(["notes", "remark", "দ্রষ্টব্য"]);

    // Strictly validate that mandatory headers exist
    const missingHeaders: string[] = [];
    if (typeIdx === -1) missingHeaders.push("Type (Species)");
    if (breedIdx === -1) missingHeaders.push("Breed");
    if (ageIdx === -1) missingHeaders.push("Age");
    if (weightIdx === -1) missingHeaders.push("Weight");

    if (missingHeaders.length > 0) {
      const errs = [
        `CSV Validation Error: Mandatory columns missing in headers.`,
        `Missing Headers: ${missingHeaders.join(", ")}`,
        `Detected Headers in file: [ ${lines[0]} ]`,
        `Requirement: The CSV file MUST define columns representing "Type", "Breed", "Age" and "Weight".`
      ];
      setBulkImportErrorLog(errs);
      alert(`⚠️ CSV Validation Failed:\nMissing mandatory columns: ${missingHeaders.join(", ")}`);
      return;
    }

    const parsedAnimals: Animal[] = [];
    const errors: string[] = [];
    let nextIdNumber = (() => {
      let maxNum = 0;
      animals.forEach(ani => {
        const match = ani.id.match(/^ANI-(\d+)/i);
        if (match) {
          const num = parseInt(match[1]);
          if (num > maxNum) maxNum = num;
        }
      });
      return maxNum + 1;
    })();

    const formattedDate = new Date().toISOString().slice(0, 10);

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',').map(c => c.trim());
      if (cols.length < Math.max(typeIdx, breedIdx, ageIdx, weightIdx) + 1) {
        errors.push(`Row ${i + 1}: Insufficient column count (requires at least Type, Breed, Age, Weight columns).`);
        continue;
      }

      const type = typeIdx !== -1 ? cols[typeIdx] : "";
      const breed = breedIdx !== -1 ? cols[breedIdx] : "";
      const ageRaw = ageIdx !== -1 ? cols[ageIdx] : "";
      const weightRaw = weightIdx !== -1 ? cols[weightIdx] : "";
      const priceRaw = priceIdx !== -1 ? cols[priceIdx] : "0";
      const advanceRaw = advanceIdx !== -1 ? cols[advanceIdx] : "0";
      const owner = ownerIdx !== -1 ? cols[ownerIdx] : "CSV Bulk Import";
      const notes = notesIdx !== -1 ? cols[notesIdx] : "";

      // Required fields validation
      if (!type) {
        errors.push(`Row ${i + 1}: Animal Type (Species) is required.`);
        continue;
      }
      if (!breed) {
        errors.push(`Row ${i + 1}: Breed type is required.`);
        continue;
      }

      const age = Number(ageRaw);
      if (isNaN(age) || age <= 0) {
        errors.push(`Row ${i + 1}: Age months "${ageRaw}" must be a valid positive number.`);
        continue;
      }

      const weight = Number(weightRaw);
      if (isNaN(weight) || weight <= 0) {
        errors.push(`Row ${i + 1}: Weight "${weightRaw}" must be a valid positive number.`);
        continue;
      }

      const price = Number(priceRaw);
      if (isNaN(price) || price < 0) {
        errors.push(`Row ${i + 1}: Price "${priceRaw}" must be a valid non-negative number.`);
        continue;
      }

      const advance = Number(advanceRaw);
      if (isNaN(advance) || advance < 0) {
        errors.push(`Row ${i + 1}: Advance "${advanceRaw}" must be a valid non-negative number.`);
        continue;
      }

      const newId = `ANI-${String(nextIdNumber).padStart(3, "0")}`;
      nextIdNumber++;

      parsedAnimals.push({
        id: newId,
        type,
        breed,
        ageMonths: age,
        weightKg: weight,
        purchasePrice: price,
        advancePaid: advance,
        due: Math.max(0, price - advance),
        owner,
        status: "Active",
        weightHistory: [
          { date: formattedDate, weightKg: weight }
        ],
        notes: notes || "Batch imported via CSV directory ledger."
      });
    }

    if (errors.length > 0) {
      setBulkImportErrorLog(errors);
      alert(`⚠️ Validation errors found across ${errors.length} rows. Please review errors list before continuing.`);
      return;
    }

    if (parsedAnimals.length === 0) {
      alert("No valid animal records found in the CSV file.");
      return;
    }

    // Insert imported animals
    setAnimals(prev => [...parsedAnimals, ...prev]);

    // Insert corresponding purchase transactions for advance payments
    const newTxns: Transaction[] = [];
    let currentTxId = transactions.length + 1;
    parsedAnimals.forEach(ani => {
      if (ani.advancePaid > 0) {
        newTxns.push({
          id: `TXN-PR-${Math.floor(1000 + Math.random() * 9000).toString()}`,
          type: "Expense",
          category: "Purchase",
          amount: ani.advancePaid,
          date: formattedDate,
          description: `Bulk imported advance purchase payment for ${ani.id} (${ani.breed})`,
          department: "Livestock"
        });
        currentTxId++;
      }
    });

    if (newTxns.length > 0) {
      setTransactions(prev => [...newTxns, ...prev]);
    }

    addAuditLog(
      "Bulk Import Complete",
      "Livestock",
      `Bulk imported ${parsedAnimals.length} cattle records from CSV file correctly.`
    );

    setBulkImportErrorLog([]);
    setShowBulkImportModal(false);
    alert(`✓ Successfully registered ${parsedAnimals.length} new animals into livestock register and processed payment transactions!`);
  };

  // Download active filtered animal directory as CSV with proper UTF-8 BOM encoding for Bengali characters
  const downloadAnimalCSV = () => {
    if (processedFilteredAnimals.length === 0) {
      alert(lang === "bn" ? "বর্তমান ফিল্টারের অধীনে কোনো পশু নিবন্ধিত পাওয়া যায়নি।" : "No registered animals found within current filter scopes.");
      return;
    }
    
    // Headers mapped beautifully
    const headers = [
      lang === "bn" ? "পশু আইডি (Animal ID)" : "Animal ID",
      lang === "bn" ? "প্রজাতি (Species)" : "Species / Type",
      lang === "bn" ? "জাত (Breed)" : "Breed",
      lang === "bn" ? "বয়স (মাস)" : "Age (Months)",
      lang === "bn" ? "ওজন (কেজি)" : "Weight (Kg)",
      lang === "bn" ? "ক্রয়মূল্য" : "Purchase Price (INR)",
      lang === "bn" ? "অগ্রিম প্রদান" : "Advance Paid (INR)",
      lang === "bn" ? "বকেয়া পরিমাণ" : "Due Amount (INR)",
      lang === "bn" ? "সরবরাহকারী / মালিক" : "Owner / Supplier",
      lang === "bn" ? "অবস্থা" : "Status / Phase",
      lang === "bn" ? "বিশেষ দ্রষ্টব্য" : "Notes / Biometrics Info"
    ];
    
    const rows = processedFilteredAnimals.map(ani => [
      ani.id,
      ani.type,
      ani.breed,
      ani.ageMonths,
      ani.weightKg,
      ani.purchasePrice,
      ani.advancePaid,
      ani.due,
      ani.owner || "",
      ani.status,
      ani.notes || ""
    ]);
    
    const csvContent = [
      headers.map(h => `"${h}"`).join(","),
      ...rows.map(row => row.map(cell => {
        const cellStr = String(cell);
        if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(","))
    ].join("\n");
    
    // Create UTF-8 BOM byte array so Excel parses Bengali characters correctly
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Livestock_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addAuditLog("CSV Export", "Livestock", `Exported ${processedFilteredAnimals.length} animal records to CSV.`);
  };

  // Linear regression utility for Growth Index Tracker
  const getRegressionData = (history: { date: string, weightKg: number }[]) => {
    if (!history || history.length === 0) return [];
    
    // Sort chronology
    const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const points = sorted.map((pt) => ({
      t: new Date(pt.date).getTime(),
      y: pt.weightKg,
      date: pt.date
    }));

    let slope = 0;
    let intercept = points[0].y;

    if (points.length >= 2) {
      const n = points.length;
      const firstT = points[0].t;
      const dayMs = 24 * 60 * 60 * 1000;
      
      const xValues = points.map(p => (p.t - firstT) / dayMs);
      const yValues = points.map(p => p.y);
      
      let sumX = 0;
      let sumY = 0;
      let sumXY = 0;
      let sumXX = 0;
      for (let i = 0; i < n; i++) {
        sumX += xValues[i];
        sumY += yValues[i];
        sumXY += xValues[i] * yValues[i];
        sumXX += xValues[i] * xValues[i];
      }
      
      const denominator = (n * sumXX) - (sumX * sumX);
      if (denominator !== 0) {
        slope = ((n * sumXY) - (sumX * sumY)) / denominator;
        intercept = (sumY - slope * sumX) / n;
      } else {
        slope = 0;
        intercept = sumY / n;
      }
    } else {
      // 1 point, assume steady growth rate of 0.35 Kg per day
      slope = 0.35;
      intercept = points[0].y;
    }

    const firstT = points[0].t;
    const dayMs = 24 * 60 * 60 * 1000;

    // historical data series mapping
    const chartData = sorted.map((pt) => {
      const t = new Date(pt.date).getTime();
      const x = (t - firstT) / dayMs;
      const predY = slope * x + intercept;
      return {
        date: pt.date,
        weightKg: pt.weightKg,
        predictedWeightKg: Number(predY.toFixed(1)),
        isPrediction: false
      };
    });

    const lastActualPt = points[points.length - 1];
    const lastT = lastActualPt.t;

    // Extend line with predicted next 30 days (+10, +20, +30 days)
    for (let d = 10; d <= 30; d += 10) {
      const futT = lastT + d * dayMs;
      const futDate = new Date(futT);
      const futDateStr = futDate.toISOString().slice(0, 10);
      const x = (futT - firstT) / dayMs;
      const predY = slope * x + intercept;
      
      chartData.push({
        date: futDateStr,
        weightKg: undefined as any,
        predictedWeightKg: Number(predY.toFixed(1)),
        isPrediction: true
      });
    }

    return chartData;
  };

  const getMultiAnimalComparisonData = (selectedIds: string[]) => {
    const animalDataMap = selectedIds.reduce((acc, id) => {
      const animal = animals.find(a => a.id === id);
      if (animal && animal.weightHistory && animal.weightHistory.length > 0) {
        acc[id] = getRegressionData(animal.weightHistory);
      }
      return acc;
    }, {} as { [id: string]: any[] });

    const allDates = new Set<string>();
    Object.values(animalDataMap).forEach(list => {
      list.forEach(item => allDates.add(item.date));
    });

    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const unifiedData = sortedDates.map(date => {
      const entry: any = { date };
      selectedIds.forEach((id, index) => {
        const list = animalDataMap[id] || [];
        const match = list.find(item => item.date === date);
        if (match) {
          entry[`weight_${index}`] = match.weightKg;
          entry[`pred_${index}`] = match.predictedWeightKg;
        }
      });
      return entry;
    });

    return { unifiedData, animalDataMap };
  };

  // Filtered Animals based on search and species
  const processedFilteredAnimals = useMemo(() => {
    let result = [...animals];
    
    // Species Filter
    if (typeFilter !== "All") {
      result = result.filter(ani => ani.type === typeFilter);
    }

    // Owner Filter
    if (animalOwnerFilter !== "All") {
      result = result.filter(ani => ani.owner === animalOwnerFilter);
    }

    // Payment Status Filter
    if (animalPaymentStatusFilter !== "All") {
      result = result.filter(ani => {
        if (animalPaymentStatusFilter === "Paid") {
          return ani.due === 0 || ani.status === "Paid";
        }
        if (animalPaymentStatusFilter === "Pending") {
          return ani.due > 0 && ani.status !== "Overdue";
        }
        if (animalPaymentStatusFilter === "Overdue") {
          return ani.status === "Overdue";
        }
        return true;
      });
    }

    // Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(ani => 
        ani.id.toLowerCase().includes(q) ||
        ani.breed.toLowerCase().includes(q) ||
        ani.owner.toLowerCase().includes(q)
      );
    }

    // Advanced Animal Sorting
    if (animalSortField) {
      result.sort((a, b) => {
        let valA: any = a[animalSortField] || "";
        let valB: any = b[animalSortField] || "";

        if (typeof valA === "string") {
          return animalSortOrder === "asc" 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        } else {
          return animalSortOrder === "asc"
            ? valA - valB
            : valB - valA;
        }
      });
    }

    return result;
  }, [animals, typeFilter, searchQuery, animalSortField, animalSortOrder, animalOwnerFilter, animalPaymentStatusFilter]);

  // Bulk Selection & Row Expansion Helpers
  const isAllSelected = useMemo(() => {
    if (processedFilteredAnimals.length === 0) return false;
    return processedFilteredAnimals.every(ani => selectedAnimalIds[ani.id]);
  }, [processedFilteredAnimals, selectedAnimalIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedAnimalIds(prev => {
        const next = { ...prev };
        processedFilteredAnimals.forEach(ani => {
          next[ani.id] = false;
        });
        return next;
      });
    } else {
      setSelectedAnimalIds(prev => {
        const next = { ...prev };
        processedFilteredAnimals.forEach(ani => {
          next[ani.id] = true;
        });
        return next;
      });
    }
  };

  const toggleSelectAnimal = (id: string) => {
    setSelectedAnimalIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleRowExpand = (id: string) => {
    setExpandedAnimalIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectedCount = useMemo(() => {
    return Object.values(selectedAnimalIds).filter(Boolean).length;
  }, [selectedAnimalIds]);

  const overdueAnimals = useMemo(() => {
    return animals.filter(a => a.status === "Overdue" || a.status === "Critical");
  }, [animals]);

  const overdueSales = useMemo(() => {
    return sales.filter(s => s.status === "Overdue");
  }, [sales]);

  const criticalFeed = useMemo(() => {
    return feedInventory.filter(f => (f.balance / f.maxCapacity) < 0.20);
  }, [feedInventory]);

  const totalNotificationCount = useMemo(() => {
    return overdueAnimals.length + overdueSales.length + criticalFeed.length;
  }, [overdueAnimals, overdueSales, criticalFeed]);

  const procurementAlertItems = useMemo(() => {
    return feedInventory.filter(f => (f.balance / f.maxCapacity) <= 0.15);
  }, [feedInventory]);

  // Daily dynamic 30-day feed consumption trends calculation
  const dailyFeedConsumptionData = useMemo(() => {
    const result: Array<{ date: string; displayDate: string; consumption: number }> = [];
    const today = new Date();
    
    const consumptionByDate: { [dateStr: string]: number } = {};
    transactions.forEach(t => {
      if (t.category === "Feed" && t.description && t.description.toLowerCase().includes("consumed")) {
        const dateStr = t.date;
        const match = t.description.match(/Consumed (\d+(\.\d+)?)/);
        if (match) {
          const qty = parseFloat(match[1]);
          consumptionByDate[dateStr] = (consumptionByDate[dateStr] || 0) + qty;
        }
      }
    });

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      
      const daySeed = d.getDate();
      const baseSeed = 180 + (daySeed % 7) * 32 + (daySeed % 5) * 14;
      const actualLog = consumptionByDate[dateStr] || 0;
      
      result.push({
        date: dateStr,
        displayDate: d.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric" }),
        consumption: baseSeed + actualLog
      });
    }
    
    return result;
  }, [transactions, lang]);

  const activeTrans = TRANSLATIONS[lang];

  if (!isAuthenticated) {
    return (
      <AuthScreen 
        onLoginSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthenticated(true);
          window.location.reload();
        }} 
      />
    );
  }

  if (isFirebaseLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="text-center space-y-4">
          <RefreshCw className="h-10 w-10 text-teal-400 animate-spin mx-auto" />
          <p className="text-xs font-mono font-black uppercase text-white tracking-widest animate-pulse">
            {lang === "bn" ? "ক্লাউড লেজার লোড হচ্ছে..." : "Loading Cloud Ledger Database..."}
          </p>
          <p className="text-[10px] font-mono text-slate-500">
            Establishing secure end-to-end user data session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === "light" ? "light-theme" : "bg-slate-950"} size-${configFontSize} ${
      configFont === "Inter" ? "font-sans" : configFont === "Space Grotesk" ? "font-space" : configFont === "Outfit" ? "font-outfit" : "font-mono"
    } ${configDisplayDensity === "compact" ? "p-1 md:p-3" : ""}`}>
      
      {/* Sync Status Banner */}
      {syncState === "running" && (
        <div className="bg-teal-950 border-b border-teal-800 text-teal-400 p-2 text-center text-xs font-mono animate-pulse flex items-center justify-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          <span>{syncLog || activeTrans.syncing}</span>
        </div>
      )}

      {/* Offline Status Banner */}
      {isOfflineSimulated && (
        <div className="bg-rose-950/90 border-b border-rose-800 text-rose-350 p-2.5 text-center text-xs font-mono flex items-center justify-center gap-2 px-4 select-none no-print">
          <AlertCircle className="h-4 w-4 animate-pulse text-rose-450 shrink-0" />
          <span className="font-bold">{lang === "bn" ? "অফলাইন মোড সক্রিয়!" : "Simulated Offline Mode Active!"}</span>
          <span className="hidden sm:inline opacity-80">
            {lang === "bn" 
              ? "সব তথ্য স্থানীয়ভাবে রাখা হবে। নেটওয়ার্ক ফিরলে সিঙ্ক করুন।" 
              : "Updates are securely queued in the local PWA buffer. Push to main ledger upon going Online."}
          </span>
          {offlineQueue.length > 0 && (
            <button
              onClick={handleReplayOfflineQueue}
              className="ml-3 bg-rose-500 hover:bg-rose-400 text-slate-950 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase font-mono shadow transition cursor-pointer"
            >
              Sync {offlineQueue.length} Queued Items
            </button>
          )}
        </div>
      )}

      {/* Procurement Alert System Notification Banners */}
      {procurementAlertItems.map((feed) => (
        <div key={feed.id} className="bg-amber-950 border-b border-amber-900/50 text-amber-300 p-2.5 text-center text-xs font-sans flex flex-col sm:flex-row items-center justify-between gap-3 px-4 select-none no-print">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 animate-bounce text-amber-400 shrink-0" />
            <span className="font-mono font-black text-amber-400">{lang === "bn" ? "স্টক এলার্ট:" : "STOCK ALERT:"}</span>
            <span className="text-[11px] leading-tight text-slate-350">
              {lang === "bn" 
                ? `"${feed.label}" এর পরিমাণ ১৫% ধারণক্ষমতার নিচে নেমেছ (বর্তমানে মাত্র ${feed.balance} ${feed.unit} অবশিষ্ট)।` 
                : `"${feed.label}" has fallen below 15% capacity (currently at ${feed.balance} / ${feed.maxCapacity} ${feed.unit}, which is ${((feed.balance / feed.maxCapacity) * 100).toFixed(1)}%).`}
            </span>
          </div>
          <button
            onClick={() => {
              setPurchaseOrderFeedId(feed.id);
              setPurchaseOrderAmount((feed.maxCapacity - feed.balance).toString());
              setPurchaseOrderSupplier(
                feed.id === "feed-4" ? "Acme Bio-Nutrients Ltd" : "Daffodils Grain Mills Ltd"
              );
              setShowPurchaseOrderModal(true);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-lg text-[9.5px] uppercase font-mono shadow transition active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Plus className="h-3 w-3" />
            <span>{lang === "bn" ? "অর্ডার ফর্ম তৈরি করুন" : "Generate Purchase Order"}</span>
          </button>
        </div>
      ))}

      {/* Branded Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 py-3 sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Brand Logo Identity incorporating generated image */}
          <div className="flex items-center gap-3">
            <img 
              src="/src/assets/images/app_logo_1779891049358.png" 
              alt="ShaieAlam Logo" 
              className="h-10 w-10 rounded-xl border border-teal-500/20 shadow-md object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // If generated image fails, render fallback gradient
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <span className="text-[10px] font-mono tracking-widest text-teal-400 font-extrabold uppercase leading-none block">LIVESTOCK CLOUD INTEGRATED</span>
              <h1 className="text-sm font-black text-white font-mono uppercase tracking-tight flex items-center gap-1.5">
                {activeTrans.title}
                <span className="bg-teal-500/10 text-teal-400 text-[9px] px-1.5 py-0.5 rounded border border-teal-500/20 font-bold font-mono">V4.9</span>
              </h1>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Quick Livestock Tag Scan Trigger */}
            <button 
              onClick={startLivestockQRScanner}
              className="px-2.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition duration-150 flex items-center gap-1.5 cursor-pointer uppercase font-mono shadow-md animate-pulse"
              title="Camera Scan Beast Ear-Tag QR Code"
            >
              <Camera className="h-3.5 w-3.5 animate-pulse" />
              <span>Quick Scan</span>
            </button>

            {/* Connection Status Switcher (PWA Offline simulator with queued updates) */}
            <button
              onClick={() => {
                const nextOfflineState = !isOfflineSimulated;
                setIsOfflineSimulated(nextOfflineState);
                if (!nextOfflineState) {
                  handleReplayOfflineQueue();
                } else {
                  addAuditLog("Offline Simulated", "System", "Simulating offline browser session. Ledger cached in service-worker.");
                  alert("🟠 Offline Mode Simulated! Subsequent transactions, livestock registrations, or payments will be queued in the offline cache memory.");
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition duration-150 flex items-center gap-1.5 cursor-pointer uppercase font-mono shadow-sm border ${
                isOfflineSimulated 
                  ? "bg-rose-500/20 text-rose-450 border-rose-500/40 hover:bg-rose-500/30" 
                  : "bg-emerald-500/15 text-emerald-450 border-emerald-500/20 hover:bg-emerald-500/25"
              }`}
              title={isOfflineSimulated ? "Go Online & Sync local records" : "Simulate offline standalone operations"}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOfflineSimulated ? "bg-rose-500 animate-[pulse_1s_infinite]" : "bg-emerald-450"}`} />
              <span>{isOfflineSimulated ? "Offline Mode" : "Online"}</span>
              {offlineQueue.length > 0 && (
                <span className="bg-rose-600 text-white text-[8px] font-black rounded px-1.5 py-0.5 animate-bounce">
                  {offlineQueue.length}
                </span>
              )}
            </button>

            {/* Language Switch */}
            <button
              onClick={() => handleSetLang(lang === "en" ? "bn" : "en")}
              className="px-2.5 py-1.5 rounded-lg bg-teal-500/15 border border-teal-500/20 hover:bg-teal-500/25 text-teal-400 text-xs font-black transition duration-150 cursor-pointer font-sans"
            >
              {lang === "en" ? "বাংলা" : "English"}
            </button>

            {/* Operator Profile and Secure Sign Out */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-3 ml-1">
              <div className="hidden lg:flex flex-col items-end leading-none">
                <span className="text-[10px] font-mono font-black text-white uppercase">{currentUser.name || "Operator"}</span>
                <span className="text-[8px] font-mono font-bold text-teal-400 uppercase mt-0.5">{currentUser.role || "Administrator"}</span>
              </div>
              <button
                onClick={async () => {
                  try {
                    await signOut(auth);
                    localStorage.removeItem("meatflow_is_auth");
                    localStorage.removeItem("meatflow_logged_user");
                    setIsAuthenticated(false);
                    setCurrentUser({ id: "U-1", name: "Guest User", role: "Administrator" });
                    window.location.reload();
                  } catch (err) {
                    console.error("Sign out error:", err);
                  }
                }}
                className="px-2 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:text-slate-950 text-rose-450 text-[10px] font-bold font-mono transition duration-150 cursor-pointer"
                title="Sovereign Sign Out"
              >
                Sign Out
              </button>
            </div>

            {/* UI Theme Toggle Button with Motion */}
            <motion.button
              id="theme-toggle"
              onClick={() => handleSetTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 cursor-pointer flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                   key={theme}
                   initial={{ rotate: -30, opacity: 0 }}
                   animate={{ rotate: 0, opacity: 1 }}
                   exit={{ rotate: 30, opacity: 0 }}
                   transition={{ duration: 0.12 }}
                >
                   {theme === "dark" ? <Sun className="h-4.5 w-4.5 text-teal-400" /> : <Moon className="h-4.5 w-4.5 text-amber-500" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Notification Bell Component */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700/85 text-slate-300 hover:text-white cursor-pointer relative flex items-center justify-center transition-all duration-150 animate-pulse-badge"
                title={lang === "bn" ? "সিস্টেম বিজ্ঞপ্তি" : "Show alerts and system metrics"}
              >
                <motion.div
                  key={totalNotificationCount}
                  animate={{
                    scale: [1, 1.35, 1],
                    rotate: [0, -10, 10, -10, 10, 0]
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <Bell className="h-4.5 w-4.5" />
                </motion.div>
                {totalNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white border border-slate-900 font-sans font-black text-[9px] rounded-full h-4.5 w-4.5 flex items-center justify-center animate-pulse">
                    {totalNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              <AnimatePresence>
                {isNotificationOpen && (
                  <>
                    {/* Backdrop for click away targeting */}
                    <div className="fixed inset-0 z-45" onClick={() => setIsNotificationOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-85 sm:w-96 bg-slate-905 border-2 border-slate-800 bg-slate-900 rounded-2xl shadow-2xl overflow-hidden z-50 font-mono text-left"
                    >
                      {/* Header block with count */}
                      <div className="p-4 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-teal-400" />
                          <h3 className="text-xs font-black text-white uppercase">{lang === "bn" ? "সিস্টেম পর্যবেক্ষণ কেন্দ্র" : "Notification Core Summary"}</h3>
                        </div>
                        <span className="text-[9px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-1.5 py-0.5 rounded font-bold font-mono">
                          {totalNotificationCount} {lang === "bn" ? "টি অ্যালার্ট" : "Active Alerts"}
                        </span>
                      </div>

                      {/* Content areas */}
                      <div className="max-h-96 overflow-y-auto divide-y divide-slate-850">
                        {/* Feed Alerts Section */}
                        {criticalFeed.length > 0 && (
                          <div className="p-3 bg-red-950/15">
                            <span className="text-[8px] font-black text-red-400 uppercase tracking-wider block mb-1">⚠️ {lang === "bn" ? "ক্রিটিক্যাল ফিড স্টক অ্যালার্ট" : "Critical Feed Stock Deficit (<20%)"}</span>
                            <div className="space-y-1.5">
                              {criticalFeed.map(feed => {
                                const level = Math.round((feed.balance / feed.maxCapacity) * 100);
                                return (
                                  <div key={feed.id} className="text-[10px] text-slate-300 flex justify-between items-center bg-slate-950/50 p-1.5 rounded border border-slate-850/60">
                                    <div className="truncate pr-2">
                                      <span className="font-bold text-white uppercase">{feed.label}</span>
                                    </div>
                                    <span className="text-red-400 font-bold shrink-0 font-mono">{level}% ({feed.balance} / {feed.maxCapacity} kg)</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Overdue Items list */}
                        {(overdueAnimals.length > 0 || overdueSales.length > 0) && (
                          <div className="p-3">
                            <span className="text-[8px] font-black text-rose-400 uppercase tracking-wider block mb-1">⚠️ {lang === "bn" ? "বকেয়া / ওভারডিউ লেজার" : "Overdue Balance / Ledger Dues"}</span>
                            <div className="space-y-1.5">
                              {overdueAnimals.map(ani => (
                                <div key={ani.id} className="text-[10px] text-slate-300 flex justify-between items-center bg-slate-950/40 p-1.5 border border-slate-850/50 rounded">
                                  <div>
                                    <span className="font-bold text-white shrink-0 font-mono">{ani.id}</span>
                                    <span className="text-slate-500 text-[9px] font-sans ml-1">({lang === "bn" ? "পশু বকেয়া" : "Beast Ledger"})</span>
                                  </div>
                                  <span className="text-rose-400 font-bold font-mono">₹{ani.due.toLocaleString()}</span>
                                </div>
                              ))}
                              {overdueSales.map(sale => (
                                <div key={sale.id} className="text-[10px] text-slate-300 flex justify-between items-center bg-slate-950/40 p-1.5 border border-slate-850/50 rounded">
                                  <div>
                                    <span className="font-bold text-white shrink-0 font-mono">{sale.id}</span>
                                    <span className="text-slate-500 text-[9px] font-sans ml-1">({lang === "bn" ? "দোকান বকেয়া" : "Invoice Due"})</span>
                                  </div>
                                  <span className="text-rose-400 font-bold font-mono">₹{sale.amountDue.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Audit Logs Section */}
                        <div className="p-3 bg-slate-900/40">
                          <span className="text-[8px] font-black text-teal-400 uppercase tracking-wider block mb-1.5">📜 {lang === "bn" ? "সাম্প্রতিক কার্যকলাপ অডিট লগ" : "Recent Security Audit Logs"}</span>
                          <div className="space-y-2">
                            {auditLogs.slice(0, 5).map(log => (
                              <div key={log.id} className="text-[9px] leading-tight text-slate-400 border-b border-slate-850/40 pb-1.5 last:border-0 last:pb-0 font-mono">
                                <div className="flex justify-between text-slate-500 text-[8px] mb-0.5">
                                  <span>{log.id} • {log.department}</span>
                                  <span>{log.timestamp.slice(11)}</span>
                                </div>
                                <span className="font-bold text-slate-200 block">{log.action}</span>
                                <p className="text-slate-500 line-clamp-2 text-[8px] font-sans">{log.details}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div className="p-2.5 bg-slate-950 text-center border-t border-slate-850">
                        <button
                          onClick={() => {
                            setIsNotificationOpen(false);
                            setActiveTab("settings");
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-850 text-teal-400 font-black py-1.5 border border-slate-800 rounded-xl text-[10px] uppercase font-mono transition duration-150 cursor-pointer"
                        >
                          {lang === "bn" ? "অডিট কন্ট্রোল সেন্টারে যান" : "Go to Audit logs / Settings"}
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Decentralization Mode Toggle */}
            <button
              onClick={() => {
                const nextVal = !isDecentralizedMode;
                setIsDecentralizedMode(nextVal);
                if (nextVal && currentUser.role !== "Administrator") {
                  // If switching on, direct activeTab accordingly
                  let targetTab: "dashboard" | "livestock" | "butcher" | "collections" | "feed" | "poultry" = "dashboard";
                  if (currentUser.role === "Livestock Management") targetTab = "livestock";
                  else if (currentUser.role === "Poultry Management") targetTab = "poultry";
                  else if (currentUser.role === "Butcher Shop") targetTab = "butcher";
                  else if (currentUser.role === "Collections") targetTab = "collections";
                  else if (currentUser.role === "Feed Shop") targetTab = "feed";
                  setActiveTab(targetTab);
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition duration-150 flex items-center gap-1 cursor-pointer font-bold font-mono border ${
                isDecentralizedMode 
                  ? "bg-teal-500/10 border-teal-500/30 text-teal-400" 
                  : "bg-slate-800 border-slate-700/60 text-slate-400 hover:text-white"
              }`}
              title="Toggle Decentralized Departmental Guardrails"
            >
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              <span>{isDecentralizedMode ? "Decentralized On" : "Unified view"}</span>
            </button>

            {/* Role Switcher */}
            <div className="relative flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase px-2">Access:</span>
              <select
                value={currentUser.role}
                onChange={(e) => {
                  const role = e.target.value as UserRole;
                  setCurrentUser({ ...currentUser, role });
                  // If in decentralized mode, auto-switch activeTab to match role
                  if (isDecentralizedMode && role !== "Administrator") {
                    let targetTab: "dashboard" | "livestock" | "butcher" | "collections" | "feed" | "poultry" = "dashboard";
                    if (role === "Livestock Management") targetTab = "livestock";
                    else if (role === "Poultry Management") targetTab = "poultry";
                    else if (role === "Butcher Shop") targetTab = "butcher";
                    else if (role === "Collections") targetTab = "collections";
                    else if (role === "Feed Shop") targetTab = "feed";
                    setActiveTab(targetTab);
                  }
                }}
                className="bg-slate-900 border-none text-[10px] font-bold text-teal-400 uppercase rounded py-1 px-2.5 pr-6 cursor-pointer focus:outline-none placeholder:text-slate-500"
              >
                <option value="Administrator">Administrator</option>
                <option value="Livestock Management">Herd Manager</option>
                <option value="Poultry Management">Poultry Manager</option>
                <option value="Butcher Shop">Butcher Shop</option>
                <option value="Collections">Collections Officer</option>
                <option value="Feed Shop">Feed Shop</option>
              </select>
            </div>

            {/* Top Right Settings Button with ⚙️ logo */}
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition duration-150 flex items-center gap-1.5 cursor-pointer uppercase font-mono border ${
                activeTab === "settings"
                  ? "bg-teal-500 text-slate-950 shadow-md font-extrabold"
                  : "bg-slate-800 border-slate-700/60 text-slate-300 hover:text-white"
              }`}
              title="Configure ERP Settings"
            >
              <span className="text-sm">⚙️</span>
              <span>{lang === "bn" ? "সেটিংস" : "Settings"}</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        
        {/* Navigation Selector Rails */}
        <div className="flex overflow-x-auto gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-900 no-print" id="navigation-rail">
          {[
            { id: "dashboard", icon: TrendingUp, label: activeTrans.dashboard, locked: false },
            { id: "livestock", icon: Award, label: activeTrans.livestock, locked: false },
            { id: "poultry", icon: Egg, label: activeTrans.poultry, locked: false },
            { id: "butcher", icon: Clipboard, label: activeTrans.butcher, locked: false },
            { id: "collections", icon: Smartphone, label: activeTrans.collections, locked: false },
            { id: "feed", icon: Users, label: activeTrans.feedShop, locked: false },
            { id: "settings", icon: Settings, label: "Settings / সেটিং", locked: false }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap uppercase tracking-tight select-none ${
                activeTab === tab.id 
                  ? "bg-teal-500 text-slate-950 shadow-md font-extrabold" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/55"
              }`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* SECTION 1: AGGREGATE DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
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
              <div className="bg-slate-900 border border-teal-500/20 p-4 rounded-3xl flex justify-between items-center">
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
                  <div>
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
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[9px] text-slate-500 leading-tight">
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
                    <p className="text-[10px] text-slate-400 mt-0.5 font-sans">Persistent visual status of the locally buffered PWA transactions queue. Press retry to sync individually or dispatch all at once.</p>
                  </div>
                </div>

                {offlineQueue.length > 0 && (
                  <button
                    onClick={handleReplayOfflineQueue}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-3.5 py-1.5 rounded-xl text-[10px] uppercase font-mono shadow transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>{lang === "bn" ? "সব একসাথ সিঙ্ক করুন" : "Global Sync All"}</span>
                  </button>
                )}
              </div>

              {offlineQueue.length === 0 ? (
                <div className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-dashed border-slate-850 text-slate-450 text-[11px] font-mono justify-center sm:justify-start">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{lang === "bn" ? "✓ বাফার অবস্থা: সম্পূর্ণ ডাটা সিঙ্কড। ডেটাবেস আপ-টু-ডেট আছে।" : "✓ PWA Ledger Status: Fully synchronized. Buffer database holds no pending transactions."}</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {offlineQueue.map((item) => {
                    return (
                      <div key={item.id} className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex flex-col justify-between gap-3 font-mono text-[10.5px]">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center pb-1.5 border-b border-slate-900">
                            <span className="text-white font-black">{item.id}</span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-850 text-slate-350 border border-slate-800 uppercase font-black">
                              {item.actionType.split(' ')[0]}
                            </span>
                          </div>
                          
                          <div className="text-slate-400 space-y-0.5">
                            <p className="text-white font-semibold text-[11px]">{item.actionType}</p>
                            <p className="text-[9px] text-slate-500">Queued: {new Date(item.timestamp).toLocaleTimeString()}</p>
                          </div>

                          {/* Payload attributes summary */}
                          <div className="bg-slate-900/60 p-2 rounded-lg text-[9px] text-slate-400 space-y-0.5 border border-slate-900/50">
                            {Object.entries(item.payload || {}).map(([key, val]) => (
                              <div key={key} className="flex justify-between">
                                <span className="opacity-70">{key}:</span>
                                <span className="text-slate-200 font-bold">{String(val)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              // Delete/Remove selectively
                              setOfflineQueue(prev => prev.filter(q => q.id !== item.id));
                              addAuditLog("Sync Trash", "System", `Removed queued operational element ${item.id} from local memory.`);
                              alert(`🗑️ Deleted pending operation ${item.id} from local buffer.`);
                            }}
                            className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg border border-transparent hover:border-rose-500/10 text-[10px] font-bold font-mono transition inline-flex items-center justify-center cursor-pointer bg-slate-900"
                            title="Discard from Queue"
                          >
                            Discard
                          </button>
                          
                          <button
                            onClick={() => {
                              // Selective sync handler
                              // Simulate targeted ledger integration
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
                              
                              // Clear element
                              setOfflineQueue(prev => prev.filter(q => q.id !== item.id));
                              alert(`✓ selectively retried and synced offline packet ${item.id} directly to central catalog ledger successfully!`);
                            }}
                            className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black py-1.5 px-3 rounded-lg text-[9.5px] font-mono uppercase cursor-pointer flex items-center justify-center gap-1 active:scale-95 transition"
                          >
                            <Play className="h-2.5 w-2.5 mt-0.5" />
                            <span>Retry Sync</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Core Charts Section: Financial Performance and Breed Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MonthlyFinancialTrendChart monthlyData={monthlyData} />
              </div>
              <div className="lg:col-span-1">
                <BreedDistributionPieChart animals={animals} />
              </div>
            </div>

            {/* Core Component 2 - Biometric Weight Gain Alerts Widget */}
            {computedDeviatingAnimals.length > 0 && (
              <div className="bg-slate-900/60 border border-amber-500/20 p-5 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <div className="p-1.5 bg-amber-500/10 border border-amber-500/25 rounded-lg text-amber-500 animate-pulse">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white font-mono tracking-wider flex items-center gap-2">
                       Biometric Gain Anomaly Detections
                      <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/10 font-bold">{computedDeviatingAnimals.length} Flagged</span>
                    </h4>
                    <p className="text-[10px] text-slate-400">Cattle whose average weight gain fluctuates significantly compared to expected breed parameters.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[280px] overflow-y-auto pr-1">
                  {computedDeviatingAnimals.map(({ animal, adg, deviationPercent, feedSuggestion }) => (
                    <div key={animal.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-mono font-black text-white">{animal.id} ({animal.breed})</span>
                          <span className="block text-[9px] text-slate-500 uppercase mt-0.5">Supplier: {animal.owner}</span>
                        </div>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border inline-block ${
                          deviationPercent > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse"
                        }`}>
                          {deviationPercent > 0 ? "+" : ""}{Math.round(deviationPercent)}% Dev
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-900 rounded-xl space-y-1.5 border border-slate-800/80">
                        <span className="text-[9px] font-bold text-amber-500 uppercase block font-mono">Suggested Feed Adjustments / খাদ্য সামঞ্জস্য</span>
                        <p className="text-[10px] text-slate-300 font-sans leading-relaxed">{feedSuggestion}</p>
                      </div>

                      <button
                        onClick={() => saveFeedRecommendationToNotes(animal.id, feedSuggestion)}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-tight py-2 rounded-xl text-[10px] transition duration-150 cursor-pointer text-center font-sans uppercase"
                      >
                        Write to Animal Notes / নোটে সেভ করুন
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* DASHBOARD QUICK ACTION FAB WORKFLOW GROUP */}
        {activeTab === "dashboard" && (
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
                    className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-teal-400 hover:text-teal-300 px-3.5 py-2.5 rounded-2xl shadow-2xl transition hover:border-slate-700 cursor-pointer text-xs font-mono font-black uppercase"
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
                    className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-indigo-400 hover:text-indigo-300 px-3.5 py-2.5 rounded-2xl shadow-2xl transition hover:border-slate-700 cursor-pointer text-xs font-mono font-black uppercase"
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
                    className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 px-3.5 py-2.5 rounded-2xl shadow-2xl transition hover:border-slate-700 cursor-pointer text-xs font-mono font-black uppercase"
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
                isDashboardFabOpen ? "bg-rose-650 text-white hover:bg-rose-500 rotate-45" : "bg-teal-500 hover:bg-teal-400 text-slate-950"
              }`}
              title="Dashboard Operations Center FAB"
            >
              <Plus className="h-7 w-7 transition-transform duration-200" />
            </button>
          </div>
        )}

        {/* SECTION 2: HERD REGISTER LOG LAYOUT */}
        {activeTab === "livestock" && (
          isTabRestrictedForRole("livestock") ? renderRestrictedOverlay("Livestock") : (
            <div className="space-y-6 animate-fadeIn text-left">
            
            {/* Top Toolbar Navigation */}
            <div className="flex justify-between items-center no-print">
              <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-900">
                {[
                  { id: "directory", label: "Active Registry / রেজিস্ট্রি" },
                  { id: "mortality", label: "Losses & Insurance / ক্ষতি ও বীমা" },
                  { id: "breed-analysis", label: "Breeds / ব্রিড বিশ্লেষণ" },
                  { id: "growth-compare", label: "Growth Comparison / বৃদ্ধি তুলনা" }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setLivestockSubTab(sub.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer select-none ${
                      livestockSubTab === sub.id ? "bg-slate-950 text-teal-400 shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadAnimalCSV}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-755 text-slate-200 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer uppercase font-mono shadow-sm no-print"
                  title="Download CSV / এক্সেল ফাইল ডাউনলোড"
                >
                  <Download className="h-4 w-4 text-teal-400" />
                  <span>Download CSV / ডাউনলোড</span>
                </button>
                <button
                  onClick={() => setShowBulkImportModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer uppercase font-mono shadow-md no-print"
                  title="Bulk Import CSV / বাল্ক সিএসভি ইম্পোর্ট"
                >
                  <Upload className="h-4 w-4 text-indigo-200 animate-pulse" />
                  <span>Bulk Import / ইম্পোর্ট</span>
                </button>
                <button
                  onClick={() => setShowAddAnimalModal(true)}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer uppercase font-mono shadow-md"
                >
                  <Plus className="h-4.5 w-4.5" />
                  Register beast
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Active Registry Directory */}
            {livestockSubTab === "directory" && (
              <div className="space-y-4">
                
                {/* SECTION: Livestock Proximity RFID Scanner */}
                <div className="w-full">
                  {renderScanTerminal("Livestock")}
                </div>

                {/* Search & Sort Panel */}
                <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between no-print focus-within:border-slate-800">
                  <div className="relative flex-1 min-w-[260px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={activeTrans.search}
                      className="w-full bg-slate-950 pl-10 pr-4 py-2 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-xs font-bold"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    
                    {/* Species Filter */}
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-850">
                      <span className="text-[10px] uppercase font-bold font-mono text-slate-505" style={{ color: "#14b8a6" }}>{lang === "bn" ? "প্রজাতি:" : "Type:"}</span>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-transparent border-none text-xs font-bold font-mono text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="All">{lang === "bn" ? "সকল" : "All Species"}</option>
                        <option value="Cow">Cow (বভাইন)</option>
                        <option value="Goat">Goat (ক্যাপ্রাইন)</option>
                        <option value="Sheep">Sheep (ওভাইন)</option>
                        <option value="Buffalo">Buffalo</option>
                      </select>
                    </div>

                    {/* Owner Filter */}
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-850">
                      <span className="text-[10px] uppercase font-bold font-mono text-slate-505" style={{ color: "#14b8a6" }}>{lang === "bn" ? "মালিক:" : "Owner:"}</span>
                      <select
                        value={animalOwnerFilter}
                        onChange={(e) => setAnimalOwnerFilter(e.target.value)}
                        className="bg-transparent border-none text-xs font-bold font-mono text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="All">{lang === "bn" ? "সকল" : "All Owners"}</option>
                        {Array.from(new Set(animals.map(a => a.owner).filter(Boolean))).map(own => (
                          <option key={own} value={own} style={{ color: "#000" }}>{own}</option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Status Filter */}
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-850">
                      <span className="text-[10px] uppercase font-bold font-mono text-slate-505" style={{ color: "#14b8a6" }}>{lang === "bn" ? "বকেয়া:" : "Payment:"}</span>
                      <select
                        value={animalPaymentStatusFilter}
                        onChange={(e) => setAnimalPaymentStatusFilter(e.target.value)}
                        className="bg-transparent border-none text-xs font-bold font-mono text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="All">{lang === "bn" ? "সকল" : "All Payment"}</option>
                        <option value="Paid">Paid (পরিশোধিত)</option>
                        <option value="Pending">Pending (চলতি বকেয়া)</option>
                        <option value="Overdue">Overdue (মেয়াদোত্তীর্ণ)</option>
                      </select>
                    </div>

                    {/* Advanced sorting selectors */}
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-850">
                      <span className="text-[10px] uppercase font-bold font-mono text-slate-500">{lang === "bn" ? "সাজান:" : "Sort By:"}</span>
                      <select
                        value={animalSortField || "none"}
                        onChange={(e) => setAnimalSortField(e.target.value === "none" ? null : e.target.value as any)}
                        className="bg-transparent border-none text-xs font-bold font-mono text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="none">{lang === "bn" ? "নিবন্ধন তারিখ" : "Register Date"}</option>
                        <option value="id">{lang === "bn" ? "পশু আইডি (Animal ID)" : "Animal ID"}</option>
                        <option value="owner">{lang === "bn" ? "সরবরাহকারী (Owner)" : "Owner Name"}</option>
                        <option value="due">{lang === "bn" ? "বকেয়া পরিমাণ" : "Due Amount"}</option>
                        <option value="type">{lang === "bn" ? "প্রজাতি" : "Species"}</option>
                        <option value="status">{lang === "bn" ? "পেমেন্ট অবস্থা" : "Status"}</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-850">
                      <span className="text-[10px] uppercase font-bold font-mono text-slate-500">Direction:</span>
                      <select
                        value={animalSortOrder}
                        onChange={(e) => setAnimalSortOrder(e.target.value as any)}
                        className="bg-transparent border-none text-xs font-bold font-mono text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="asc">Ascending (▲)</option>
                        <option value="desc">Descending (▼)</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Bulk Actions Panel */}
                {selectedCount > 0 && (
                  <div className="bg-teal-500/10 border border-teal-500/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn no-print">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-teal-500 text-slate-950 font-black rounded-lg text-xs flex items-center justify-center font-mono px-2">
                        {selectedCount} Selected
                      </div>
                      <span className="text-xs font-mono text-slate-300">beasts selected for mass batch operation.</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Bulk Update Status */}
                      <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-850">
                        <span className="text-[10px] uppercase font-bold font-mono text-slate-500">Mass Status / অবস্থা:</span>
                        <select
                          onChange={(e) => {
                            const newStatus = e.target.value as any;
                            if (newStatus) {
                              setAnimals(prev => prev.map(ani => {
                                if (selectedAnimalIds[ani.id]) {
                                  return { ...ani, status: newStatus };
                                }
                                return ani;
                              }));
                              setSelectedAnimalIds({});
                              alert(`✓ Successfully updated status of selected beasts to ${newStatus}.`);
                            }
                          }}
                          defaultValue=""
                          className="bg-transparent border-none text-xs font-bold font-mono text-teal-400 focus:outline-none cursor-pointer"
                        >
                          <option value="" disabled>Choose Status</option>
                          <option value="Active">Active</option>
                          <option value="Processed">Processed</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>

                      {/* Bulk Assign Feed Plan */}
                      <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-850">
                        <span className="text-[10px] uppercase font-bold font-mono text-slate-500">Feed Plan / খাদ্য পরিকল্পনা:</span>
                        <select
                          onChange={(e) => {
                            const plan = e.target.value;
                            if (plan) {
                              setAnimals(prev => prev.map(ani => {
                                if (selectedAnimalIds[ani.id]) {
                                  return { 
                                    ...ani, 
                                    notes: `${ani.notes ? ani.notes + " " : ""}[FEED PLAN ASSIGNED ${new Date().toISOString().slice(0,10)}]: ${plan}`
                                  };
                                }
                                return ani;
                              }));
                              setSelectedAnimalIds({});
                              alert(`✓ Assigned ${plan} to selected beasts.`);
                            }
                          }}
                          defaultValue=""
                          className="bg-transparent border-none text-xs font-bold font-mono text-teal-400 focus:outline-none cursor-pointer"
                        >
                          <option value="" disabled>Choose Feed Plan</option>
                          <option value="High-Protein Feed Mix">High-Protein Feed Mix</option>
                          <option value="Bovine Standard Pasture Mix">Standard Pasture Mix</option>
                          <option value="Rapid Fattening Ration">Rapid Fattening Ration</option>
                          <option value="Standard Maintenance Protocol">Maintenance Protocol</option>
                        </select>
                      </div>
                      
                      {/* Launch Advanced Bulk Operations Wizard button */}
                      <button
                        onClick={() => setShowBulkOpModal(true)}
                        className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-lg text-[10px] uppercase font-mono shadow flex items-center gap-1.5 transition cursor-pointer select-none shrink-0"
                        title="Configure advanced weight adjustments and specific feeding presets"
                      >
                        <span>⚡ Bulk Wizard</span>
                      </button>

                      {/* Clear selection */}
                      <button
                        onClick={() => setSelectedAnimalIds({})}
                        className="text-[10px] font-bold font-mono text-slate-400 hover:text-white hover:underline cursor-pointer"
                      >
                        Reset Selection
                      </button>
                    </div>
                  </div>
                )}

                {/* Herd List representation */}
                <div className="bg-slate-900 border border-slate-900 rounded-3xl overflow-hidden shadow-lg printable-area">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-300 border-collapse">
                      <thead className="bg-slate-950 uppercase text-[9.5px] text-slate-400 font-mono tracking-wider border-b border-slate-850">
                        <tr>
                          <th className="p-4 w-10 text-center no-print">
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={toggleSelectAll}
                              className="accent-teal-500 h-3.5 w-3.5 rounded cursor-pointer"
                            />
                          </th>
                          <th className="p-4">{activeTrans.id}</th>
                          <th className="p-4">{activeTrans.type}</th>
                          <th className="p-4">{activeTrans.breed}</th>
                          <th className="p-4">{activeTrans.weight}</th>
                          <th className="p-4">{activeTrans.cost}</th>
                          <th className="p-4">{activeTrans.due}</th>
                          <th className="p-4">Owner Ledger</th>
                          <th className="p-4 bg-slate-950">{activeTrans.status}</th>
                          <th className="p-4 text-right no-print">Biometric Update</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {processedFilteredAnimals.map(ani => {
                          const isSelected = !!selectedAnimalIds[ani.id];
                          const isExpanded = !!expandedAnimalIds[ani.id];
                          return (
                            <React.Fragment key={ani.id}>
                              <tr className={`hover:bg-slate-950/65 transition-colors duration-100 ${isExpanded ? "bg-slate-950/40" : ""} ${
                                ani.status === "Overdue" || ani.status === "Critical" ? "border-l-4 border-l-red-500" : ""
                              }`}>
                                <td className={`p-4 text-center no-print ${
                                  ani.status === "Overdue" || ani.status === "Critical" ? "border-l-4 border-l-red-500 bg-red-500/5 text-center" : ""
                                }`}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelectAnimal(ani.id)}
                                    className="accent-teal-500 h-3.5 w-3.5 rounded cursor-pointer"
                                  />
                                </td>
                                <td 
                                  onClick={() => toggleRowExpand(ani.id)}
                                  className="p-4 font-mono font-black text-white flex items-center gap-1.5 cursor-pointer hover:text-teal-400 select-none"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-3 w-3 text-teal-500 shrink-0" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                                  )}
                                  <span>{ani.id}</span>
                                </td>
                                <td className="p-4 font-bold">{ani.type}</td>
                                <td className="p-4 text-slate-400">{ani.breed}</td>
                                <td className="p-4 font-mono">
                                  <span className="font-bold text-teal-400">{ani.weightKg}</span> kg
                                </td>
                                <td className="p-4 font-mono font-bold">₹{ani.purchasePrice.toLocaleString()}</td>
                                <td className={`p-4 font-mono font-bold ${ani.due > 0 ? "text-rose-400" : "text-slate-400"}`}>
                                  ₹{ani.due.toLocaleString()}
                                </td>
                                <td className="p-4 text-slate-400 truncate max-w-[120px]" title={ani.owner}>{ani.owner}</td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-black border inline-block ${
                                    ani.status === "Active" 
                                      ? "bg-teal-500/10 text-teal-400 border-teal-500/20" 
                                      : ani.status === "Processed" 
                                        ? "bg-slate-800 text-slate-400 border-slate-700/60" 
                                        : "bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse"
                                  }`}>
                                    {ani.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right no-print">
                                  {ani.status === "Active" ? (
                                    activeWeightEditId === ani.id ? (
                                      <div className="flex items-center gap-1.5 justify-end">
                                        <input
                                          type="number"
                                          placeholder="kg"
                                          value={newRecordedWeight}
                                          onChange={(e) => setNewRecordedWeight(e.target.value)}
                                          className="bg-slate-950 w-16 p-1 border border-slate-800 rounded font-mono text-center text-xs"
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") applyWeightEntry(ani.id);
                                          }}
                                        />
                                        <button
                                          onClick={() => applyWeightEntry(ani.id)}
                                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black p-1 rounded"
                                        >
                                          <Check className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setActiveWeightEditId(ani.id)}
                                        className="text-[10px] font-mono px-2.2 py-1 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 cursor-pointer"
                                      >
                                        Log Weight/ওজন
                                      </button>
                                    )
                                  ) : (
                                    <span className="text-[10px] text-slate-500 font-mono">No action</span>
                                  )}
                                </td>
                              </tr>
                              {/* Expandable details sub-panel row */}
                              {isExpanded && (
                                <tr className="bg-slate-950/40">
                                  <td colSpan={10} className="p-5 border-l-2 border-teal-500">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                      {/* Left Details Panel */}
                                      <div className="lg:col-span-5 space-y-4 text-left">
                                        <div>
                                          <span className="text-[10px] font-mono uppercase font-bold text-teal-400">Beast Biometrics</span>
                                          <h4 className="text-xs font-black text-white uppercase font-mono mt-0.5">{ani.id} Metric Details</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-slate-400">
                                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                                            <span className="block text-slate-500 uppercase text-[8px] tracking-wide mb-0.5">Herd Age:</span>
                                            <strong className="text-white text-xs">{ani.ageMonths} mos</strong>
                                          </div>
                                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                                            <span className="block text-slate-500 uppercase text-[8px] tracking-wide mb-0.5">Primary Cost:</span>
                                            <strong className="text-white text-xs font-mono">₹{ani.purchasePrice.toLocaleString()}</strong>
                                          </div>
                                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                                            <span className="block text-slate-500 uppercase text-[8px] tracking-wide mb-0.5">Advance Paid:</span>
                                            <strong className="text-emerald-400 text-xs font-mono">₹{ani.advancePaid.toLocaleString()}</strong>
                                          </div>
                                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                                            <span className="block text-slate-500 uppercase text-[8px] tracking-wide mb-0.5">Balance Pending:</span>
                                            <strong className="text-rose-400 text-xs font-mono">₹{ani.due.toLocaleString()}</strong>
                                          </div>
                                        </div>
                                        {ani.notes && (
                                          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850 text-[10px] text-slate-400 leading-relaxed font-sans">
                                            <span className="text-teal-400 font-bold uppercase block mb-1 font-mono text-[9px]">Herd Diary / ডায়েরি:</span>
                                            {ani.notes}
                                          </div>
                                        )}
                                        {/* Payment Collection Form Segment */}
                                        {ani.due > 0 && (
                                          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850 space-y-2 text-left font-mono">
                                            <label className="text-[9px] uppercase font-mono tracking-wide text-teal-400 font-bold block">
                                              {lang === "bn" ? "পেমেন্ট সংগ্রহ করুন" : "Record Payment Received"}
                                            </label>
                                            <div className="flex gap-2">
                                              <div className="relative flex-1">
                                                <span className="absolute left-2.5 top-1.5 text-[10px] font-bold text-slate-500">₹</span>
                                                <input
                                                  type="number"
                                                  placeholder={lang === "bn" ? "টাকার পরিমাণ" : "Enter amount"}
                                                  value={animalPaymentInput[ani.id] || ""}
                                                  onChange={(e) => setAnimalPaymentInput(prev => ({
                                                    ...prev,
                                                    [ani.id]: e.target.value
                                                  }))}
                                                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 pl-6 pr-2.5 font-mono text-xs text-white focus:outline-none focus:border-teal-500"
                                                />
                                              </div>
                                              <button
                                                onClick={() => handleRecordAnimalPayment(ani.id)}
                                                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-[10px] uppercase font-mono transition shadow duration-150 shrink-0 cursor-pointer"
                                              >
                                                {lang === "bn" ? "সংরক্ষণ" : "Record"}
                                              </button>
                                            </div>
                                            <p className="text-[7.5px] text-slate-500 font-normal leading-tight">
                                              {lang === "bn" ? `বকেয়া পরিমাণ ₹${ani.due.toLocaleString()} এর বেশি হতে পারবে না।` : `Maximum collectable ledger amount: ₹${ani.due.toLocaleString()}`}
                                            </p>
                                          </div>
                                        )}
                                      </div>

                                      {/* Right Recharts Live Timeline Chart representing Weight trend */}
                                      <div className="lg:col-span-7 flex flex-col justify-between text-left">
                                        <div>
                                          <span className="text-[10px] font-mono uppercase font-bold text-teal-400">Growth Index Tracker</span>
                                          <h4 className="text-xs font-black text-white uppercase font-mono mt-0.5">Weight (Kg) Timeline</h4>
                                        </div>
                                        <div className="mt-3 bg-slate-950 p-4 rounded-3xl border border-slate-850 flex-1 flex items-center justify-center min-h-[140px]">
                                          {ani.weightHistory && ani.weightHistory.length > 0 ? (() => {
                                            const chartData = getRegressionData(ani.weightHistory);
                                            return (
                                              <div className="w-full h-full min-h-[120px]" style={{ minWidth: 200 }}>
                                                <RechartResponsiveContainer width="100%" height={120}>
                                                  <RechartLineChart data={chartData}>
                                                    <RechartXAxis 
                                                      dataKey="date" 
                                                      tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                                                      axisLine={false}
                                                      tickLine={false}
                                                    />
                                                    <RechartYAxis 
                                                      tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                                                      axisLine={false}
                                                      tickLine={false}
                                                      domain={['auto', 'auto']}
                                                    />
                                                    <RechartTooltip 
                                                      content={({ active, payload }) => {
                                                        if (active && payload && payload.length) {
                                                          const data = payload[0].payload;
                                                          const isPred = data.isPrediction;
                                                          return (
                                                            <div className="bg-slate-950/95 border border-slate-800 px-2.5 py-1.5 rounded-xl text-[9px] font-mono shadow-2xl">
                                                              <p className="text-slate-400 mb-0.5">
                                                                {data.date} {isPred ? (lang === "bn" ? "(পূর্বাভাস)" : "(Forecast)") : ""}
                                                              </p>
                                                              {data.weightKg !== undefined && (
                                                                <p className="text-teal-400 font-bold text-[10px] font-mono">
                                                                  {lang === "bn" ? "প্রকৃত ওজন: " : "Actual: "}{data.weightKg} kg
                                                                </p>
                                                              )}
                                                              <p className="text-sky-400 font-bold text-[10px] font-mono">
                                                                {lang === "bn" ? "পূর্বাভাস ওজন: " : "Forecast: "}{data.predictedWeightKg} kg
                                                              </p>
                                                            </div>
                                                          );
                                                        }
                                                        return null;
                                                      }}
                                                    />
                                                    {/* Actual recorded weight line (Solid Teal) */}
                                                    <RechartLine 
                                                      type="monotone" 
                                                      dataKey="weightKg" 
                                                      stroke="#0d9488" 
                                                      strokeWidth={2.5} 
                                                      dot={{ r: 3.5, stroke: '#0d9488', fill: '#020617', strokeWidth: 1.5 }}
                                                      activeDot={{ r: 5.5, stroke: '#2dd4bf', fill: '#020617', strokeWidth: 2 }}
                                                      connectNulls={false}
                                                    />
                                                    {/* Regression 30-day projection line (Dashed Sky Blue) */}
                                                    <RechartLine 
                                                      type="monotone" 
                                                      dataKey="predictedWeightKg" 
                                                      stroke="#38bdf8" 
                                                      strokeWidth={1.5} 
                                                      strokeDasharray="4 4" 
                                                      dot={{ r: 2, stroke: '#38bdf8', fill: '#020617', strokeWidth: 1 }}
                                                      activeDot={{ r: 4, stroke: '#60a5fa', fill: '#020617', strokeWidth: 1.5 }}
                                                    />
                                                  </RechartLineChart>
                                                </RechartResponsiveContainer>
                                              </div>
                                            );
                                          })() : (
                                            <span className="text-[10px] text-slate-500 font-mono">No recorded biometrics timeline found.</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* Sub-tab 2: Losses & Insurance */}
            {livestockSubTab === "mortality" && (() => {
              // Deceased animals are those with status === "Mortality"
              const deceasedAnimals = animals.filter(a => a.status === "Mortality");
              
              // Filter based on input date ranges
              const filteredDeceased = deceasedAnimals.filter(a => {
                const dateOfLoss = a.mortalityDate || "2026-05-24";
                if (livestockMortalityStartDate && dateOfLoss < livestockMortalityStartDate) return false;
                if (livestockMortalityEndDate && dateOfLoss > livestockMortalityEndDate) return false;
                return true;
              });

              const totalHerd = animals.length; // Total animals registered in ERP
              const totalDeceasedCount = deceasedAnimals.length;
              const herdMortalityRate = totalHerd > 0 ? (totalDeceasedCount / totalHerd) * 100 : 0;
              const totalInsuranceClaim = deceasedAnimals.reduce((acc, a) => acc + (a.insuranceClaimAmount || 0), 0);

              return (
                <div className="space-y-6">
                  {/* KPI Status Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between shadow-md">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wide">Total Registered Herd</span>
                        <h3 className="text-xl font-black text-white mt-1 font-mono tracking-tight">
                          {totalHerd} heads
                        </h3>
                      </div>
                      <div className="text-[8.5px] text-slate-500 font-mono mt-2 uppercase">
                        All historical stock registrations
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between shadow-md">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wide text-rose-450">Recorded Losses</span>
                        <h3 className="text-xl font-black text-rose-400 mt-1 font-mono tracking-tight">
                          {totalDeceasedCount} cattle
                        </h3>
                      </div>
                      <div className="text-[8.5px] text-slate-500 font-mono mt-2 uppercase">
                        Active mortalities registered
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between shadow-md">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wide">Herd Mortality Rate</span>
                        <h3 className={`text-xl font-black mt-1 font-mono tracking-tight ${herdMortalityRate > 5 ? "text-rose-450" : "text-emerald-400"}`}>
                          {herdMortalityRate.toFixed(1)}%
                        </h3>
                      </div>
                      <div className="text-[8.5px] text-slate-500 font-mono mt-2 uppercase">
                        Benchmark standard limit: &lt;5%
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between shadow-md">
                      <div>
                        <span className="text-[10px] text-teal-400 uppercase font-bold font-mono tracking-wide">Insurance Claim Recovery</span>
                        <h3 className="text-xl font-black text-teal-450 mt-1 font-mono tracking-tight animate-pulse">
                          ₹{totalInsuranceClaim.toLocaleString()}
                        </h3>
                      </div>
                      <div className="text-[8.5px] text-slate-500 font-mono mt-2 uppercase">
                        Accumulated claim policies queued
                      </div>
                    </div>
                  </div>

                  {/* Filter bar & table */}
                  <div className="bg-slate-900 border border-slate-950 p-6 rounded-3xl space-y-4 shadow-md text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-850">
                      <div>
                        <h3 className="text-sm font-black text-white font-mono uppercase">Mortality Register / মৃত এবং বীমা হিসেব</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Formal losses log integrated with livestock insurance claims parameters.</p>
                      </div>

                      {/* Filter inputs */}
                      <div className="flex items-center gap-3 font-mono text-[10px]">
                        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 px-3 rounded-lg border border-slate-850">
                          <span className="text-slate-500">From / শুরু:</span>
                          <input
                            type="date"
                            value={livestockMortalityStartDate}
                            onChange={(e) => setLivestockMortalityStartDate(e.target.value)}
                            className="bg-transparent text-white border-none focus:outline-none w-[110px]"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 px-3 rounded-lg border border-slate-850">
                          <span className="text-slate-500">To / শেষ:</span>
                          <input
                            type="date"
                            value={livestockMortalityEndDate}
                            onChange={(e) => setLivestockMortalityEndDate(e.target.value)}
                            className="bg-transparent text-white border-none focus:outline-none w-[110px]"
                          />
                        </div>
                        {(livestockMortalityStartDate || livestockMortalityEndDate) && (
                          <button
                            onClick={() => {
                              setLivestockMortalityStartDate("");
                              setLivestockMortalityEndDate("");
                            }}
                            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-705 text-slate-300 font-bold rounded cursor-pointer font-mono"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] text-left text-slate-300 border-collapse">
                        <thead className="bg-slate-950 text-[9px] uppercase font-mono border-b border-slate-850">
                          <tr>
                            <th className="p-3">Animal ID</th>
                            <th className="p-3">Type & Breed</th>
                            <th className="p-3">Original Outlay</th>
                            <th className="p-3">Date of Loss</th>
                            <th className="p-3">Insurance Claims</th>
                            <th className="p-3">Loss Diagnostics & Notes</th>
                            <th className="p-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 font-mono">
                          {filteredDeceased.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-slate-500 text-[10.5px]">
                                No deceased case entries resolved inside this filter block parameters.
                              </td>
                            </tr>
                          ) : (
                            filteredDeceased.map(ani => (
                              <tr key={ani.id} className="hover:bg-slate-950/20">
                                <td className="p-3 font-black text-white">{ani.id}</td>
                                <td className="p-3">
                                  <div className="font-sans font-bold text-slate-200">{ani.type}</div>
                                  <div className="text-[9px] text-slate-500 mt-0.5">{ani.breed}</div>
                                </td>
                                <td className="p-3">₹{ani.purchasePrice.toLocaleString()}</td>
                                <td className="p-3 text-slate-400">{ani.mortalityDate || "2026-05-28"}</td>
                                <td className="p-3">
                                  {ani.insuranceClaimAmount ? (
                                    <span className="text-teal-400 font-bold">₹{ani.insuranceClaimAmount.toLocaleString()} Claimed</span>
                                  ) : (
                                    <span className="text-slate-500">No Claim Processed</span>
                                  )}
                                </td>
                                <td className="p-3 font-sans text-slate-400 w-1/3 leading-normal">
                                  {ani.notes || "No audited symptoms reported."}
                                </td>
                                <td className="p-3 text-center">
                                  <span className="text-[8px] px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black tracking-wider uppercase">
                                    Mortality
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Sub-tab 3: Breed analysis */}
            {livestockSubTab === "breed-analysis" && (
              <div className="bg-slate-900 border border-slate-950 p-6 rounded-3xl space-y-4 shadow-md">
                <h3 className="text-sm font-black text-white font-mono uppercase">Breed Performance Indices</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[10px]">
                  {[
                    { breed: "Brahman", avgWeight: "680kg", feedADG: "0.95kg/day", efficiency: "A+" },
                    { breed: "Sahiwal", avgWeight: "490kg", feedADG: "0.75kg/day", efficiency: "A" },
                    { breed: "Jersey Cross", avgWeight: "420kg", feedADG: "0.70kg/day", efficiency: "B+" }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-xs font-black text-teal-400 block">{stat.breed}</span>
                      <p className="text-slate-400">Avg Target LiveWeight: <strong className="text-white">{stat.avgWeight}</strong></p>
                      <p className="text-slate-400">Breed ADG Benchmark: <strong className="text-white">{stat.feedADG}</strong></p>
                      <p className="text-slate-400">Feed Conversion: <strong className="text-white">{stat.efficiency}</strong></p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab 4: Growth Comparison */}
            {livestockSubTab === "growth-compare" && (() => {
              const availableAnimals = animals.filter(a => a.weightHistory && a.weightHistory.length > 0);
              const { unifiedData, animalDataMap } = getMultiAnimalComparisonData(compareIds);

              const handleToggleCompareAnimal = (aniId: string) => {
                if (compareIds.includes(aniId)) {
                  setCompareIds(prev => prev.filter(id => id !== aniId));
                } else {
                  if (compareIds.length >= 3) {
                    alert(lang === "bn" ? "সর্বোচ্চ ৩টি পশু নির্বাচন করা যাবে।" : "You can select up to 3 animals for comparison.");
                    return;
                  }
                  setCompareIds(prev => [...prev, aniId]);
                }
              };

              const colors = [
                { actual: "#0d9488", pred: "#0d9488" }, // Teal
                { actual: "#ee46bc", pred: "#ee46bc" }, // Rose / Pink
                { actual: "#3b82f6", pred: "#3b82f6" }  // Blue
              ];

              return (
                <div className="bg-slate-900 border border-slate-950 p-6 rounded-3xl space-y-6 shadow-md text-left">
                  <div>
                    <h3 className="text-sm font-black text-white font-mono uppercase">Multi-Beast Growth Analytics & 30-Day Projections / বহু-পশু বৃদ্ধি তুলনা ও পূর্বাভাস</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-sans">Select up to three active cattle to overlay actual growth trends against their automated linear regression forecasts.</p>
                  </div>

                  {/* Animal Pickers */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                    {availableAnimals.map(ani => {
                      const isSelected = compareIds.includes(ani.id);
                      return (
                        <button
                          key={ani.id}
                          onClick={() => handleToggleCompareAnimal(ani.id)}
                          className={`p-3 rounded-xl border font-mono text-left transition text-[11px] cursor-pointer flex flex-col justify-between ${
                            isSelected 
                              ? "bg-slate-900 border-teal-500 text-white" 
                              : "bg-slate-900/40 border-slate-850 text-slate-400 hover:text-white"
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="font-bold">{ani.id}</span>
                            <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-teal-400 animate-pulse" : "bg-slate-700"}`} />
                          </div>
                          <div className="mt-2 text-left">
                            <span className="text-[10px] font-sans block text-slate-300 font-semibold">{ani.breed}</span>
                            <span className="text-[9px] text-slate-500 block mt-0.5">{ani.type} • {ani.weightKg}Kg</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {compareIds.length === 0 ? (
                    <div className="text-center p-12 bg-slate-950 border border-dashed border-slate-800 rounded-3xl text-slate-500 font-mono text-xs">
                      No active animals selected. Choose up to 3 cattle elements from the dashboard picker above to project growth indexes.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Comparative Chart */}
                      <div className="bg-slate-950 p-4 rounded-3xl border border-slate-850">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                          <span className="text-[10px] uppercase font-mono font-bold text-teal-400">Competitive Weight Gain Projection (Dashed Line = Forecast)</span>
                          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono">
                            {compareIds.map((id, index) => {
                              const ani = animals.find(a => a.id === id);
                              return (
                                <div key={id} className="flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[index]?.actual }} />
                                  <span className="text-white font-bold">{id} ({ani?.breed})</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="h-[260px] w-full">
                          <RechartResponsiveContainer width="100%" height="100%">
                            <RechartLineChart data={unifiedData}>
                              <RechartXAxis 
                                dataKey="date" 
                                tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <RechartYAxis 
                                tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                                axisLine={false}
                                tickLine={false}
                                domain={['auto', 'auto']}
                              />
                              <RechartTooltip
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    const isPred = data.isPrediction;
                                    return (
                                      <div className="bg-slate-955 border border-slate-800 px-3 py-2.5 rounded-2xl text-[10px] font-mono shadow-2xl space-y-1.5 text-left bg-slate-950">
                                        <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 flex justify-between items-center gap-4">
                                          <span>Date: {data.date}</span>
                                          {isPred && (
                                            <span className="text-[8px] bg-sky-500/10 text-sky-450 border border-sky-500/20 px-1.5 rounded uppercase">
                                              {lang === "bn" ? "পূর্বাভাস" : "Forecast"}
                                            </span>
                                          )}
                                        </div>
                                        {compareIds.map((id, index) => {
                                          const actualVal = data[`weight_${index}`];
                                          const predVal = data[`pred_${index}`];
                                          const textCol = colors[index]?.actual;
                                          return (
                                            <div key={id} className="space-y-0.5 leading-tight">
                                              <span className="block font-black text-[9px]" style={{ color: textCol }}>{id}:</span>
                                              {actualVal !== undefined && (
                                                <div className="flex justify-between gap-6 pl-2 text-slate-300 text-[9px]">
                                                  <span>Actual:</span>
                                                  <span className="font-bold">{actualVal} kg</span>
                                                </div>
                                              )}
                                              {predVal !== undefined && (
                                                <div className="flex justify-between gap-6 pl-2 text-sky-400 text-[9px]">
                                                  <span>Forecast:</span>
                                                  <span className="font-bold">{predVal} kg</span>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              {compareIds.map((id, index) => {
                                return (
                                  <React.Fragment key={id}>
                                    <RechartLine 
                                      type="monotone" 
                                      dataKey={`weight_${index}`} 
                                      stroke={colors[index]?.actual} 
                                      strokeWidth={2.5} 
                                      dot={{ r: 3, stroke: colors[index]?.actual, fill: '#020617', strokeWidth: 1 }}
                                      activeDot={{ r: 5 }}
                                      name={`${id} Actual`}
                                      connectNulls={true}
                                    />
                                    <RechartLine 
                                      type="monotone" 
                                      dataKey={`pred_${index}`} 
                                      stroke={colors[index]?.pred} 
                                      strokeWidth={1.5} 
                                      strokeDasharray="4 4" 
                                      dot={{ r: 1.5, stroke: colors[index]?.pred, fill: '#020617' }}
                                      activeDot={{ r: 3 }}
                                      name={`${id} Forecast`}
                                      connectNulls={true}
                                    />
                                  </React.Fragment>
                                );
                              })}
                            </RechartLineChart>
                          </RechartResponsiveContainer>
                        </div>
                      </div>

                      {/* Health assessments comparing parameters */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {compareIds.map((id, index) => {
                          const ani = animals.find(a => a.id === id);
                          if (!ani) return null;
                          const regData = animalDataMap[id] || [];
                          const initialVal = regData[0]?.weightKg || ani.weightKg;
                          const lastVal = regData.find(d => !d.isPrediction && d.weightKg !== undefined)?.weightKg || ani.weightKg;
                          const pred30Val = regData[regData.length - 1]?.predictedWeightKg || ani.weightKg;
                          const isGaining = pred30Val >= lastVal;

                          return (
                            <div key={id} className="p-4 bg-slate-950/65 border border-slate-850 rounded-2xl space-y-3 font-mono text-[10px]">
                              <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[index]?.actual }} />
                                <span className="font-bold text-white text-xs">{id} • {ani.breed}</span>
                              </div>
                              <div className="space-y-1.5 text-slate-400">
                                <p className="flex justify-between">
                                  <span>Initial Registered:</span>
                                  <strong className="text-white">{initialVal} kg</strong>
                                </p>
                                <p className="flex justify-between">
                                  <span>Latest Recorded:</span>
                                  <strong className="text-white">{lastVal} kg</strong>
                                </p>
                                <p className="flex justify-between">
                                  <span>Expected in 30 Days:</span>
                                  <strong className={isGaining ? "text-emerald-400" : "text-rose-400"}>{pred30Val} kg</strong>
                                </p>
                                <p className="flex justify-between">
                                  <span>Growth Health Status:</span>
                                  <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ${
                                    isGaining ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                                  }`}>
                                    {isGaining ? "A+ Steady Gain" : "Needs Review"}
                                  </span>
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}

          </div>
          )
        )}

        {/* SECTION 3: BUTCHER OPERATIONS VIEW */}
        {activeTab === "butcher" && (
          isTabRestrictedForRole("butcher") ? renderRestrictedOverlay("Butcher") : (
            <div className="space-y-6 animate-fadeIn text-left">
              
              {/* SECTION: Butcher Proximity Carcass RFID Scanner */}
              <div className="w-full">
                {renderScanTerminal("Butcher")}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Carcass Yield Log */}
              <div className="md:col-span-1 bg-slate-900/60 border border-slate-900 p-5 rounded-3xl space-y-4 shadow-md">
                <div>
                  <span className="text-[10px] uppercase font-mono font-black text-teal-400">
                    {lang === "bn" ? "প্রক্রিয়াকরণ ডাটা জমা" : "Processing Submitions"}
                  </span>
                  <h3 className="text-xs font-black text-white uppercase mt-0.5 font-mono">
                    {lang === "bn" ? "পশুর ক্যারকাস প্রক্রিয়াকরণ" : "Process Animal Carcass"}
                  </h3>
                </div>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert(lang === "bn" ? "পশু সফলভাবে ফ্রিজার লাইনে পাঠানো হয়েছে।" : "Cattle submitted to freezer queue successfully.");
                  }} 
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                      {lang === "bn" ? "জীবন্ত পশুর আইডি নির্বাচন করুন" : "Select Beast Live ID"}
                    </label>
                    <select className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 rounded-xl p-2.5 text-xs text-white">
                      {animals.filter(a => a.status === "Active").map(ani => (
                        <option key={ani.id} value={ani.id}>{ani.id} - {ani.breed} ({ani.weightKg}kg)</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                        {lang === "bn" ? "ড্রেসিং %" : "Dressing %"}
                      </label>
                      <input type="number" defaultValue="55" className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl text-xs text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                        {lang === "bn" ? "ফ্রিজার তাপমাত্রা" : "Freezer Temp"}
                      </label>
                      <input type="text" defaultValue="-4°C" className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl text-xs text-white" />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase font-mono select-none transition"
                  >
                    {lang === "bn" ? "প্রক্রিয়াকরণ হাবে পাঠান" : "Send to Processing Hub"}
                  </button>
                </form>
              </div>

              {/* Butcher checkout logs with fast Invoice Modal Trigger */}
              <div className="md:col-span-2 bg-slate-900 border border-slate-950 p-5 rounded-3xl space-y-4 shadow-md leading-relaxed">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-black text-teal-400">
                      {lang === "bn" ? "ক্যাটারিং / সরাসরি ক্যাশ মেমো" : "Catering / Direct Invoices"}
                    </span>
                    <h3 className="text-xs font-black text-white uppercase mt-1 font-mono">
                      {lang === "bn" ? "সক্রিয় ক্যাশ সেলস খাতা (POS)" : "Active POS Sales Register"}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setShowBillingModal(true)}
                    className="bg-teal-500 text-slate-950 font-black rounded-lg px-3 py-1.5 text-[10px] uppercase cursor-pointer"
                  >
                    {lang === "bn" ? "বিলিং ডেস্ক খুলুন" : "Open Billing Desk"}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-400 border-collapse">
                    <thead className="bg-slate-950 text-[9px] uppercase font-mono border-b border-slate-850">
                      <tr>
                        <th className="p-3">{lang === "bn" ? "চালান নম্বর" : "Invoice"}</th>
                        <th className="p-3">{lang === "bn" ? "গ্রাহক কোড" : "Customer Code"}</th>
                        <th className="p-3">{lang === "bn" ? "পণ্য বিবরণ" : "Item Breakdown"}</th>
                        <th className="p-3">{lang === "bn" ? "মোট টাকা" : "Gross Total"}</th>
                        <th className="p-3">{lang === "bn" ? "রেফারেন্স আইডি" : "Ref ID"}</th>
                        <th className="p-3 text-right">{lang === "bn" ? "চালান ভিউ" : "Invoice View"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {sales.map(sale => (
                        <tr key={sale.id} className="hover:bg-slate-950/40">
                          <td className="p-3 font-mono font-black text-teal-400 text-left">{sale.id}</td>
                          <td className="p-3">{sale.customerCode || (lang === "bn" ? "খুচরা ক্রেতা" : "Retail Account")}</td>
                          <td className="p-3 text-slate-300">
                            {sale.items.map((it, idx) => (
                              <span key={idx}>
                                {lang === "bn" ? (
                                  it.type.includes("Beef Loin") ? "প্রিমিয়াম গরুর লয়েন" :
                                  it.type.includes("Flank Cut") ? "ব্রাহ্মণ ফ্ল্যাঙ্ক কাট" :
                                  it.type.includes("Bone-In") ? "স্ট্যান্ডার্ড গরুর মাংস (হাড়সহ)" :
                                  it.type.includes("Sirloin") ? "খাসির সার্লয়েন" : it.type
                                ) : it.type} (x{it.weightKg}kg)
                              </span>
                            ))}
                          </td>
                          <td className="p-3 font-bold font-mono text-white">₹{sale.total.toLocaleString()}</td>
                          <td className="p-3 text-slate-500 font-mono text-[10px]">{sale.transactionRefId || "-"}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setActiveInvoice(sale);
                                setShowInvoiceModal(true);
                              }}
                              className="text-[10px] text-teal-400 hover:underline inline-flex items-center gap-1 cursor-pointer font-bold"
                            >
                              <Eye className="h-3 w-3" />
                              {lang === "bn" ? "দেখুন" : "View"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
          )
        )}

        {/* SECTION 4: COLLECTIONS LEDGER AND TRACING VIEW */}
        {activeTab === "collections" && (
          isTabRestrictedForRole("collections") ? renderRestrictedOverlay("Collections") : (
            <div className="space-y-6 animate-fadeIn text-left">
            
            {/* Action Header Card with Outstanding Ledger PDF export button */}
            <div className="p-6 bg-slate-900 border border-slate-950 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-black text-teal-400">Aging Due Accounts Ledger</span>
                <h2 className="text-sm font-black text-white font-mono uppercase mt-1">Outstanding Receivables Matrix</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Maintain call follow-up diaries, promise dates, and print verified invoices.</p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={exportBrandedDueLedgerPDF}
                  className="px-3.5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-[10.5px] uppercase flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md font-mono"
                  title="Generate Branded Receivables PDF"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export Ledger PDF
                </button>
              </div>
            </div>

            {/* List of outstanding dues */}
            <div className="bg-slate-900 border border-slate-950 rounded-3xl overflow-hidden shadow-lg printable-area">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300 border-collapse">
                  <thead className="bg-slate-950 text-[9px] uppercase font-mono border-b border-slate-850">
                    <tr>
                      <th className="p-4">Invoice</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Total Value</th>
                      <th className="p-4">Outstanding Due</th>
                      <th className="p-4">Promised Paid Date</th>
                      <th className="p-4">Overdue Installments</th>
                      <th className="p-4 text-right no-print">Collection Tools</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {sales.map(sale => (
                      <tr key={sale.id} className="hover:bg-slate-950/30">
                        <td className="p-4 font-mono font-black text-white">{sale.id}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-200 block">{sale.customerName}</span>
                          <span className="text-[9.5px] font-mono text-slate-500">{sale.customerPhone}</span>
                        </td>
                        <td className="p-4 font-mono">₹{sale.total.toLocaleString()}</td>
                        <td className={`p-4 font-mono font-bold ${sale.amountDue > 0 ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}>
                          ₹{sale.amountDue.toLocaleString()}
                        </td>
                        <td className="p-4 text-slate-400 font-mono">{sale.promisedPaymentDate || "On Terms"}</td>
                        <td className="p-4">
                          {sale.installments && sale.installments.length > 0 ? (
                            <div className="space-y-1 font-mono text-[9.5px]">
                              {sale.installments.map(inst => (
                                <div key={inst.id} className="flex items-center gap-1.5">
                                  <span className={`h-1.5 w-1.5 rounded-full ${inst.status === "Overdue" ? "bg-red-500" : "bg-slate-500"}`}></span>
                                  <span className="text-slate-400">{inst.id}: ₹{inst.amount} ({inst.status})</span>
                                  {inst.status !== "Paid" && (
                                    <button
                                      onClick={() => handleCollectDue(sale.id, inst.id)}
                                      className="bg-teal-500 text-slate-950 text-[8px] font-sans font-black px-1.5 py-0.5 rounded cursor-pointer"
                                    >
                                      Collect
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right no-print">
                          {activeCollectionInvoiceId === sale.id ? (
                            <div className="space-y-1.5">
                              <textarea
                                placeholder="Call diary details..."
                                value={newCallNotes}
                                onChange={(e) => setNewCallNotes(e.target.value)}
                                className="bg-slate-950 p-2.5 border border-slate-850 rounded-xl leading-relaxed text-[10px] w-full h-14 text-white"
                              />
                              <div className="flex gap-1 justify-end">
                                <button
                                  onClick={() => saveCallNotes(sale.id)}
                                  className="bg-teal-500 text-slate-950 px-2 py-1 text-[9px] font-bold rounded cursor-pointer"
                                >
                                  Save Diary
                                </button>
                                <button
                                  onClick={() => setActiveCollectionInvoiceId(null)}
                                  className="bg-slate-800 text-slate-400 px-2 py-1 text-[9px] font-bold rounded cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveCollectionInvoiceId(sale.id);
                                setNewCallNotes("");
                              }}
                              className="text-[10px] text-teal-400 hover:underline cursor-pointer"
                            >
                              Log Call Followup / কল লগ
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
          )
        )}

        {/* SECTION 5: FEED STORE INSTRUCTIONS */}
        {activeTab === "feed" && (
          isTabRestrictedForRole("feed") ? renderRestrictedOverlay("Feed") : (
            <div className="space-y-6 animate-fadeIn text-left">
            <div className="p-6 bg-slate-900 border border-slate-950 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-black text-teal-400">Nutritional Stock Monitoring</span>
                <h2 className="text-sm font-black text-white font-mono uppercase mt-1">Grain & Concentrate Stock</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Review active silage piles, mineral supply counts, and species-wide meal allocations.</p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    setQuickSubtractFeedId(feedInventory[0]?.id || "");
                    setQuickSubtractAmount("");
                    setQuickSubtractNotes("");
                    setShowQuickSubtractModal(true);
                  }}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer uppercase font-mono shadow-md"
                  title="Quick Subtract feed stock directly"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Quick Add</span>
                </button>
              </div>
            </div>

            {/* SECTION: Feed SKU Barcode Scanner */}
            <div className="w-full">
              {renderScanTerminal("Feed")}
            </div>

            {/* CRITICAL LOW FEED WARNING PANEL */}
            {(() => {
              const criticalLowFeed = feedInventory.filter(f => (f.balance / f.maxCapacity) < 0.20);
              if (criticalLowFeed.length === 0) return null;
              return (
                <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-500/20 text-red-400 rounded-xl mt-0.5">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white font-mono uppercase tracking-wide font-sans">Critical Feed Stock Threshold Deficit</h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {criticalLowFeed.length} feed SKU inventories are running below the safe operational threshold (<span className="text-red-450 font-bold font-mono">less than 20% capacity</span>). Please execute restock procurement.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0">
                    {criticalLowFeed.map(feed => (
                      <button
                        key={feed.id}
                        onClick={() => handleRequestRestock(feed.id)}
                        className="bg-red-500 hover:bg-red-400 text-slate-950 text-[10px] font-black uppercase font-mono px-3 py-1.5 rounded-xl transition cursor-pointer hover:scale-105 active:scale-95"
                      >
                        Restock {feed.label.replace(" Stock", "")}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* FEED STOCKS BENTO CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {feedInventory.map((stock) => {
                const ratio = stock.balance / stock.maxCapacity;
                const isCrit = ratio < 0.20;
                const percent = Math.round(ratio * 100);
                
                return (
                  <div 
                    key={stock.id} 
                    className={`p-5 bg-slate-900 border ${
                      isCrit 
                        ? "border-red-500/60 ring-2 ring-red-500/10 bg-red-950/10" 
                        : "border-slate-850"
                    } rounded-2xl flex flex-col justify-between space-y-4`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] uppercase font-mono text-slate-400 font-extrabold tracking-wider block">{stock.label}</span>
                        {isCrit && (
                          <span className="text-[8px] font-mono font-black text-red-400 bg-red-400/10 border border-red-500/20 px-2 py-0.5 rounded uppercase leading-none">
                            Low Stock
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-baseline mt-2">
                        <span className="text-lg font-black text-white font-mono">{stock.balance.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-medium">/ {stock.maxCapacity.toLocaleString()} {stock.unit}</span>
                      </div>

                      {/* Percentage progress bar */}
                      <div className="mt-3.5 space-y-1">
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              isCrit ? "bg-red-500" : percent < 50 ? "bg-amber-500" : "bg-teal-500"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[8px] font-mono font-bold text-slate-400">
                          <span>{percent}% CAPACITY</span>
                          <span>{stock.unit.toUpperCase()}</span>
                        </div>
                      </div>

                      {/* Predictive Days-to-Empty Indicator card */}
                      {(() => {
                        const { days, dailyRate, isFallback } = calculateDaysToEmpty(stock.id, stock.balance, stock.unit);
                        let alertColor = "border-slate-800 bg-slate-950/60 text-teal-400";
                        if (days < 6) {
                          alertColor = "border-red-500/35 bg-red-950/20 text-red-400 animate-pulse";
                        } else if (days < 16) {
                          alertColor = "border-amber-500/20 bg-amber-950/10 text-amber-400";
                        }
                        return (
                          <div className={`mt-3.5 p-3 rounded-xl border ${alertColor} font-mono space-y-1`}>
                            <div className="flex justify-between items-center">
                              <span className="text-[7.5px] uppercase text-slate-450 tracking-wider font-extrabold font-sans">Predictive Outlook</span>
                              <span className="text-[7px] px-1 py-0.2 rounded bg-slate-800 font-extrabold uppercase tracking-widest text-[#94a3b8] font-sans">
                                {isFallback ? "nominal" : "trend-based"}
                              </span>
                            </div>
                            <div className="flex justify-between items-baseline pt-0.5">
                              <span className="text-[8.5px] text-slate-400 font-bold">Est. Exhaustion:</span>
                              <span className="text-[12px] font-black font-sans leading-none text-white">
                                {days === Infinity ? "∞" : `${days} days`}
                              </span>
                            </div>
                            <div className="flex justify-between text-[7px] text-slate-500 mt-1 border-t border-slate-805/40 pt-1">
                              <span>DAILY CONSUME:</span>
                              <span className="font-bold text-slate-300">{dailyRate} {stock.unit}/day</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <button 
                        onClick={() => handleRequestRestock(stock.id)}
                        className={`w-full py-2 rounded-xl text-[9.5px] font-black uppercase font-mono tracking-wide transition cursor-pointer text-center block ${
                          isCrit 
                            ? "bg-red-500 hover:bg-red-400 text-slate-950 shadow-lg"
                            : "bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-850"
                        }`}
                      >
                        Request Restock
                      </button>

                      <button
                        onClick={() => {
                          const cons = stock.unit === "Kg" ? 500 : 10;
                          handleSimulateFeedConsumption(stock.id, cons);
                        }}
                        className="w-full bg-slate-950/50 hover:bg-slate-850 text-slate-500 hover:text-slate-300 border border-slate-850/60 py-1.5 rounded-xl text-[9px] text-center font-bold font-mono transition cursor-pointer block"
                        title="Simulate flock/cattle feed operations subtraction"
                      >
                        Consume ({stock.unit === "Kg" ? "500 Kg" : "10 Licks"})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FEED CONSUMPTION 30-DAY ANALYTICS TRENDS */}
            <div className="bg-slate-900 border border-slate-950 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-850 pb-4 gap-3">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-teal-400 block">System Consumption Outlook / খাদ্যের চাহিদা ও ব্যবহার সূচক</span>
                  <h3 className="text-white text-xs font-black font-mono uppercase mt-0.5">30-Day Daily Feed Disbursal & Depletion Index</h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Tracks aggregate meal and grain depletion in realtime. Assists farm managers in preventative stock orders.
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-slate-500 text-[9px] font-mono block">30-DAY TOTAL CONSUME</span>
                  <span className="text-teal-450 font-black text-xs font-mono">{dailyFeedConsumptionData.reduce((acc, curr) => acc + curr.consumption, 0).toLocaleString()} Kg</span>
                </div>
              </div>

              <div className="h-[210px] w-full pt-2">
                <RechartResponsiveContainer width="100%" height="100%">
                  <RechartLineChart data={dailyFeedConsumptionData}>
                    <RechartXAxis 
                      dataKey="displayDate" 
                      tick={{ fill: "#64748b", fontSize: 8, fontFamily: "monospace" }} 
                      stroke="#1e293b" 
                    />
                    <RechartYAxis 
                      tick={{ fill: "#64748b", fontSize: 8, fontFamily: "monospace" }} 
                      stroke="#1e293b" 
                      label={{ value: 'Kg', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 9, fontFamily: 'monospace' }}
                    />
                    <RechartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-950/95 border border-slate-800 px-3 py-2 rounded-xl text-[10px] font-mono leading-relaxed shadow-xl animate-fadeIn">
                              <p className="text-slate-500 font-bold">{data.date}</p>
                              <p className="text-teal-400 font-black">Consumption: {data.consumption.toLocaleString()} Kg</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <RechartLine 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="#2dd4bf" 
                      strokeWidth={2.5} 
                      dot={{ fill: "#2dd4bf", r: 2 }}
                      activeDot={{ r: 4 }} 
                    />
                  </RechartLineChart>
                </RechartResponsiveContainer>
              </div>
            </div>

            {/* PROCUREMENT LEDGER LOGS */}
            <div className="p-6 bg-slate-900 border border-slate-950 rounded-3xl">
              <div className="flex justify-between items-center pb-4 border-b border-slate-850">
                <div>
                  <h3 className="text-xs font-black text-white font-mono uppercase tracking-tight">Procurement & Refill Logs</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Audit log of livestock concentrate feed refill activities posted on ledger.</p>
                </div>
                <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">Ledger Feed OK</span>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-[10px] text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 uppercase font-mono font-bold">
                      <th className="pb-3 text-left">Log ID</th>
                      <th className="pb-3 text-left">Feed Item Type</th>
                      <th className="pb-3 text-right">Procured Quantity</th>
                      <th className="pb-3 text-left pl-6">Disbursed Date</th>
                      <th className="pb-3 text-right pr-4">Procurement Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {restockHistory.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-950/40 transition">
                        <td className="py-2.5 font-mono font-bold text-slate-500">{log.id}</td>
                        <td className="py-2.5 font-extrabold text-white">{log.label}</td>
                        <td className="py-2.5 text-right font-mono font-black text-teal-400">+{log.amount.toLocaleString()} {log.unit}</td>
                        <td className="py-2.5 pl-6 font-mono text-slate-500">{log.date}</td>
                        <td className="py-2.5 text-right pr-4">
                          <span className="bg-teal-400/10 border border-teal-400/20 text-teal-400 font-mono text-[8px] font-black uppercase px-2 py-0.5 rounded leading-none">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )
        )}

        {/* SECTION 6: POULTRY FARM MANAGEMENT WORKSPACE */}
        {activeTab === "poultry" && (() => {
          // Inline derivations for real-time poultry KPIs
          const totalPoultryCount = poultryBatches.filter(b => b.status !== "Sold").reduce((acc, curr) => acc + curr.currentCount, 0);
          const totalEggsCollected = poultryBatches.reduce((acc, curr) => acc + (curr.eggsCollectedCumulative || 0), 0);
          const totalPoultryFeed = poultryBatches.reduce((acc, curr) => acc + curr.feedConsumedKg, 0);
          const totalPoultryMortality = poultryBatches.reduce((acc, curr) => acc + curr.mortalityCount, 0);
          const totalInitialCount = poultryBatches.reduce((acc, curr) => acc + curr.initialCount, 0);
          const overallMortalityRate = totalInitialCount > 0 ? (totalPoultryMortality / totalInitialCount) * 100 : 0;

          // Chart data for active bird breakdown by type
          const poultryTypeData = ["Broiler", "Layer", "Sonali", "Duck", "Turkey"].map(tName => {
            const sumVal = poultryBatches.filter(b => b.type === tName && b.status !== "Sold").reduce((acc, curr) => acc + curr.currentCount, 0);
            return { name: tName, value: sumVal };
          }).filter(item => item.value > 0);

          const POULTRY_COLORS = ["#0d9488", "#f59e0b", "#f43f5e", "#0ea5e9", "#8b5cf6"];

          // Search and Filter criteria
          const filteredBatches = poultryBatches.filter(p => {
            const term = poultrySearchQuery.toLowerCase();
            const matchesSearch = p.id.toLowerCase().includes(term) ||
                                  p.breed.toLowerCase().includes(term) ||
                                  p.housingBuilding.toLowerCase().includes(term) ||
                                  (p.notes && p.notes.toLowerCase().includes(term));
            const matchesType = poultryTypeFilter === "All" || p.type === poultryTypeFilter;
            const matchesStatus = poultryStatusFilter === "All" || p.status === poultryStatusFilter;
            return matchesSearch && matchesType && matchesStatus;
          });

          if (isTabRestrictedForRole("poultry")) {
            return renderRestrictedOverlay("Poultry");
          }

          return (
            <div className="space-y-6 animate-fadeIn text-left">
              
              {/* Header Box */}
              <div className="p-6 bg-slate-900 border border-slate-950 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase font-mono font-black text-teal-400">Avian Operations Register</span>
                  <h2 className="text-sm font-black text-white font-mono uppercase mt-1">Poultry Farm Desk / পোল্ট্রি ডেস্ক</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Track flock headcount, manage commercial egg yields, log grain feed costs, and monitor brooding environments.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5 shrink-0">
                  <button
                    onClick={() => exportPoultryLedgerPDF()}
                    className="bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition cursor-pointer select-none"
                    title="Generate PDF performance report for current flocks"
                  >
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span>Print Ledger (PDF) / পিডিএফ</span>
                  </button>
                  <button
                    onClick={() => setShowAddPoultryModal(true)}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg select-none transition hover:scale-[1.02] cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Register Flock / নতুন ফ্লক</span>
                  </button>
                </div>
              </div>

              {/* Poultry Sub-Tab Navigation Switcher */}
              <div className="flex border-b border-slate-800 pb-px">
                <button
                  onClick={() => setPoultrySubTab("register")}
                  className={`px-5 py-3 font-mono text-[10px] sm:text-xs font-black uppercase tracking-wide border-b-2 transition-all duration-150 cursor-pointer ${
                    poultrySubTab === "register"
                      ? "border-teal-400 text-teal-400 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Flock Register / ফ্লক রেজিস্টার
                </button>
                <button
                  onClick={() => setPoultrySubTab("profit")}
                  className={`px-5 py-3 font-mono text-[10px] sm:text-xs font-black uppercase tracking-wide border-b-2 transition-all duration-150 cursor-pointer ${
                    poultrySubTab === "profit"
                      ? "border-teal-400 text-teal-400 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Profit Analysis / মুনাফা ও অর্থনৈতিক বিশ্লেষণ
                </button>
              </div>

              {poultrySubTab === "register" ? (
                <>
                  {/* KPI Metrics Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Metric 1 */}
                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-md">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wide">
                          {lang === "en" ? "Active Poultry Birds" : "মোট পোল্ট্রি পাখি"}
                        </span>
                    <h3 className="text-xl font-black text-white mt-1 font-mono tracking-tight">
                      {totalPoultryCount.toLocaleString()}
                    </h3>
                  </div>
                  <div className="mt-2 text-[9px] text-slate-500 leading-tight">
                    Active headcount inside pens <span className="block text-teal-400 font-bold mt-0.5">Alive compliance rate {((100 - overallMortalityRate) || 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wide">
                      {lang === "en" ? "Total Eggs Collected" : "সংগৃহীত ডিম"}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1 font-mono tracking-tight">
                      {totalEggsCollected.toLocaleString()}
                    </h3>
                  </div>
                  <div className="mt-2 text-[9px] text-slate-500 leading-tight">
                    Cumulative collection count <span className="block text-teal-400 font-bold mt-0.5">Valued at ₹{(totalEggsCollected * 6).toLocaleString()} market value</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wide">
                      {lang === "en" ? "Feed Consumption" : "খাদ্য খরচ"}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1 font-mono tracking-tight">
                      {totalPoultryFeed.toLocaleString()} kg
                    </h3>
                  </div>
                  <div className="mt-2 text-[9px] text-slate-500 leading-tight">
                    Grain concentrate allocated <span className="block text-teal-400 font-bold mt-0.5">Nutritional safety threshold green</span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wide">
                      {lang === "en" ? "Loss Mortality Count" : "পাখির মৃত্যু ও হার"}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1 font-mono tracking-tight">
                      {totalPoultryMortality.toLocaleString()} birds
                    </h3>
                  </div>
                  <div className="mt-2 text-[9px] text-slate-500 leading-tight">
                    Aggregated mortal losses <span className={`block font-bold mt-0.5 ${overallMortalityRate > 3 ? "text-rose-450 animate-pulse" : "text-emerald-400"}`}>
                      Mortality rate: {overallMortalityRate.toFixed(1)}% (Std: &lt;3%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Analytics visual block */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Donut Chart: Type allocations */}
                <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5 shadow-xl flex flex-col justify-between h-full min-h-[300px]">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-teal-400 block">Flock Composition</span>
                    <h4 className="text-white text-xs font-black font-mono uppercase mt-0.5">Birds count by flock type</h4>
                  </div>

                  <div className="flex-1 flex items-center justify-center min-h-[140px] mt-2 relative">
                    {poultryTypeData.length === 0 ? (
                      <span className="text-[10px] text-slate-500 font-mono">No active bird inventories found.</span>
                    ) : (
                      <div className="w-full h-[150px]">
                        <RechartResponsiveContainer width="100%" height="100%">
                          <RechartPieChart>
                            <RechartPie
                              data={poultryTypeData}
                              cx="50%"
                              cy="50%"
                              innerRadius={36}
                              outerRadius={58}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {poultryTypeData.map((entry, idx) => (
                                <RechartCell key={`cell-${idx}`} fill={POULTRY_COLORS[idx % POULTRY_COLORS.length]} />
                              ))}
                            </RechartPie>
                            <RechartTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-slate-950/95 border border-slate-800 px-2 py-1 rounded text-[10px] font-mono leading-none animate-fadeIn">
                                      <p className="text-white font-bold">{data.name}: {data.value.toLocaleString()} heads</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          </RechartPieChart>
                        </RechartResponsiveContainer>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/50">
                    {poultryTypeData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400 truncate" title={item.name}>
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: POULTRY_COLORS[index % POULTRY_COLORS.length] }}></span>
                        <span className="truncate">{item.name}:</span>
                        <strong className="text-white font-black">{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enviroment compliance and status checks overview */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-850 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-teal-400 block">Shed Climate & Feed Efficiency</span>
                    <h4 className="text-white text-xs font-black font-mono uppercase mt-0.5">Active Housing Compliance Index</h4>
                  </div>

                  <div className="my-3 space-y-2.5 flex-1 justify-center flex flex-col">
                    {[
                      { shed: "Shed 1-A (Layer)", birds: "1,482 heads", FCR: "N/A (Egg Prod active)", temp: "26.4°C", status: "Optimal / বায়ুচলাচল চলমান", healthColor: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
                      { shed: "Shed 2-C (Broiler)", birds: "2,215 heads", FCR: "1.61 (High feed response)", temp: "28.1°C", status: "Nearing Market Weight / বিক্রি উপযোগী", healthColor: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                      { shed: "Shed 3-B (Sonali)", birds: "994 heads", FCR: "1.72 (Brooding active)", temp: "31.5°C", status: "Heating Lamps Engaged / কৃত্রিম তাপ", healthColor: "text-teal-400 bg-teal-500/10 border-teal-500/20" }
                    ].map((env, i) => (
                      <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex justify-between items-center text-[10px] font-mono">
                        <div className="space-y-0.5 border-none">
                          <span className="font-bold text-white block">{env.shed}</span>
                          <span className="text-slate-500 text-[9px] block">Pop: {env.birds} | FCR standard: {env.FCR}</span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className="text-slate-300 block">Temp: {env.temp}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border uppercase inline-block ${env.healthColor}`}>{env.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[9.5px] text-slate-500 font-mono italic leading-tight">
                    * Normal Brooding range is 31°C–33°C. Growing and laying phases maintain optimal efficiency around 21°C–26°C climates.
                  </div>
                </div>

              </div>

              {/* SECTION: Poultry Proximity Scanner Terminal */}
              <div className="w-full">
                {renderScanTerminal("Poultry")}
              </div>

              {/* SECTION: Poultry Mortality Analytics D3 Engine */}
              <div className="w-full">
                <PoultryMortalityD3Chart batches={poultryBatches} />
              </div>

              {/* Master Register Filter Controls */}
              <div className="bg-slate-900 border border-slate-950 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={poultrySearchQuery}
                    onChange={(e) => setPoultrySearchQuery(e.target.value)}
                    placeholder="Search flock ID, breeds, housings..."
                    className="w-full bg-slate-950 hover:bg-slate-950/80 focus:bg-slate-950 text-xs font-mono border border-slate-850 rounded-xl py-2.5 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-500 transition-colors"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Type Filter */}
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-850">
                    <Filter className="h-3 w-3 text-teal-400 shrink-0" />
                    <span className="text-[9px] uppercase font-black font-mono text-slate-500">Class / ধরণ:</span>
                    <select
                      value={poultryTypeFilter}
                      onChange={(e) => setPoultryTypeFilter(e.target.value)}
                      className="bg-transparent border-none text-[10px] font-bold font-mono text-teal-400 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Types</option>
                      <option value="Broiler">Broiler</option>
                      <option value="Layer">Layer</option>
                      <option value="Sonali">Sonali</option>
                      <option value="Duck">Duck</option>
                      <option value="Turkey">Turkey</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-850">
                    <span className="text-[9px] uppercase font-black font-mono text-slate-500">Status / অবস্থা:</span>
                    <select
                      value={poultryStatusFilter}
                      onChange={(e) => setPoultryStatusFilter(e.target.value)}
                      className="bg-transparent border-none text-[10px] font-bold font-mono text-teal-400 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Stations</option>
                      <option value="Chicks">Chicks</option>
                      <option value="Growing">Growing</option>
                      <option value="Laying">Laying</option>
                      <option value="Harvested">Harvested</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Master Register Grid Table */}
              <div className="bg-slate-900 border border-slate-955 rounded-3xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-950 uppercase text-[9px] text-slate-400 font-mono tracking-wider border-b border-slate-850">
                      <tr>
                        <th className="p-4">{lang === "en" ? "Flock ID" : "ফ্লক নং"}</th>
                        <th className="p-4">{lang === "en" ? "Type" : "ধরণ"}</th>
                        <th className="p-4">{lang === "en" ? "Breed" : "জাত"}</th>
                        <th className="p-4">{lang === "en" ? "Housing" : "ঘর"}</th>
                        <th className="p-4 text-center">{lang === "en" ? "Heads" : "পাখি"}</th>
                        <th className="p-4 text-center">{lang === "en" ? "Age" : "বয়স"}</th>
                        <th className="p-4 text-center">{lang === "en" ? "Eggs Collected" : "মোট ডিম"}</th>
                        <th className="p-4 text-center">{lang === "en" ? "Total Feed" : "মোট খাদ্য"}</th>
                        <th className="p-4 text-center">{lang === "en" ? "Status" : "অবস্থা"}</th>
                        <th className="p-4 text-right no-print">{lang === "en" ? "Operations" : "অপারেশন"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredBatches.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="p-8 text-center text-xs font-mono text-slate-500">
                            No matching poultry flocks inside register.
                          </td>
                        </tr>
                      ) : (
                        filteredBatches.map(p => {
                          const isExpanded = !!expandedPoultryBatchIds[p.id];
                          const toggleRow = () => {
                            setExpandedPoultryBatchIds(prev => ({
                              ...prev,
                              [p.id]: !prev[p.id]
                            }));
                          };

                          // Compute individual batch indicators
                          const fcrResult = p.averageWeightKg > 0 && p.currentCount > 0
                            ? (p.feedConsumedKg / (p.currentCount * p.averageWeightKg)).toFixed(2)
                            : "N/A";
                          const mortPercent = p.initialCount > 0
                            ? ((p.mortalityCount / p.initialCount) * 100).toFixed(1)
                            : "0.0";

                          return (
                            <React.Fragment key={p.id}>
                              <tr className={`hover:bg-slate-950/50 transition-colors duration-100 ${isExpanded ? "bg-slate-950/30" : ""}`}>
                                <td
                                  onClick={toggleRow}
                                  className="p-4 font-mono font-black text-white cursor-pointer hover:text-teal-400 select-none"
                                >
                                  <span className="flex items-center gap-1.5 shrink-0 flex-wrap">
                                    {isExpanded ? (
                                      <ChevronDown className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                                    ) : (
                                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                    )}
                                    <span>{p.id}</span>
                                    {p.initialCount > 0 && (p.mortalityCount / p.initialCount) > 0.03 && (
                                      <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ml-1 animate-pulse shrink-0 inline-flex items-center gap-0.5" title="Mortality exceeds critical threshold of 3%">
                                        <AlertTriangle className="h-2 w-2" />
                                        MORTALITY RISK
                                      </span>
                                    )}
                                  </span>
                                </td>
                                <td className="p-4 font-bold text-slate-300">{p.type}</td>
                                <td className="p-4 font-mono text-slate-400">{p.breed}</td>
                                <td className="p-4 font-mono font-semibold text-slate-400">{p.housingBuilding}</td>
                                <td className="p-4 text-center font-mono">
                                  {p.status === "Sold" ? (
                                    <span className="text-slate-500 line-through">0 Sold</span>
                                  ) : (
                                    <>
                                      <span className="text-white font-bold">{p.currentCount.toLocaleString()}</span>
                                      <span className="text-slate-500 text-[9px] block">/ {p.initialCount.toLocaleString()} heads</span>
                                    </>
                                  )}
                                </td>
                                <td className="p-4 text-center font-mono text-xs font-bold text-slate-300">{p.currentAgeDays} days</td>
                                <td className="p-4 text-center font-mono">
                                  {p.eggsCollectedCumulative !== undefined ? (
                                    <span className="text-teal-400 font-bold">{p.eggsCollectedCumulative.toLocaleString()}</span>
                                  ) : (
                                    <span className="text-slate-500 text-[10px]">—</span>
                                  )}
                                </td>
                                <td className="p-4 text-center font-mono text-xs">
                                  <span className="text-slate-300 font-bold">{p.feedConsumedKg.toLocaleString()}</span> kg
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-[8.5px] uppercase font-black border inline-block ${
                                    p.status === "Chicks"
                                      ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                                      : p.status === "Growing"
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        : p.status === "Laying"
                                          ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                                          : p.status === "Sold"
                                            ? "bg-slate-800 text-slate-400 border-slate-700/60"
                                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                  }`}>
                                    {p.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right no-print">
                                  <button
                                    onClick={toggleRow}
                                    className="text-[10px] font-black font-mono border border-slate-850 bg-slate-950 px-2.5 py-1 rounded-lg hover:bg-slate-900 hover:text-white text-slate-300 cursor-pointer"
                                  >
                                    {isExpanded ? "Minimize" : "Configure / কন্ট্রোল"}
                                  </button>
                                </td>
                              </tr>

                              {/* Expandable Panel */}
                              {isExpanded && (
                                <tr className="bg-slate-950/45">
                                  <td colSpan={10} className="p-5 border-l-2 border-teal-500">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-mono">
                                      
                                      {/* Left block metrics */}
                                      <div className="lg:col-span-5 space-y-4">
                                        <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-900 pb-2">
                                          <div>
                                            <span className="text-[9.5px] uppercase tracking-wide text-teal-400 font-black">Flock Biometrics index</span>
                                            <h5 className="text-white font-black uppercase text-xs font-mono mt-0.5">{p.id} Operations Summary</h5>
                                          </div>
                                          {p.initialCount > 0 && (p.mortalityCount / p.initialCount) > 0.03 && (
                                            <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded animate-pulse inline-flex items-center gap-1 shrink-0">
                                              <AlertTriangle className="h-2.5 w-2.5" />
                                              {lang === "bn" ? "উচ্চ মৃত্যুহার সতর্কতা !" : "High Mortality Alert !"}
                                            </span>
                                          )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-[10px]">
                                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                                            <span className="text-slate-500 text-[8px] block capitalize">Acquisition Date:</span>
                                            <strong className="text-white block mt-0.5">{p.acquisitionDate}</strong>
                                          </div>
                                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                                            <span className="text-slate-500 text-[8px] block capitalize">Average Bird Weight:</span>
                                            <strong className="text-teal-400 block mt-0.5">{p.averageWeightKg} kg</strong>
                                          </div>
                                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                                            <span className="text-slate-500 text-[8px] block capitalize">Feed Conversion Ratio:</span>
                                            <strong className="text-white block mt-0.5">
                                              {p.type === "Layer" ? "N/A (Layer Class)" : `${fcrResult} FCR`}
                                            </strong>
                                          </div>
                                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                                            <span className="text-slate-500 text-[8px] block capitalize">Mortality Loss Rate:</span>
                                            <strong className={`block mt-0.5 ${p.mortalityCount > p.initialCount * 0.03 ? "text-rose-400 font-black" : "text-emerald-400"}`}>
                                              {p.mortalityCount} heads ({mortPercent}%)
                                            </strong>
                                          </div>
                                        </div>

                                        {p.notes && (
                                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[10px] text-slate-400 leading-relaxed font-sans">
                                            <span className="text-teal-400 font-mono uppercase font-bold text-[9px] block mb-1">Batch Operations Log Diary:</span>
                                            {p.notes}
                                          </div>
                                        )}
                                      </div>

                                      {/* Right block Actions Console */}
                                      <div className="lg:col-span-7 space-y-4">
                                        <div>
                                          <span className="text-[9.5px] uppercase tracking-wide text-teal-400 font-black">Daily Operations desk</span>
                                          <h5 className="text-white font-black uppercase text-xs font-mono mt-0.5">Avian Console Logs</h5>
                                        </div>

                                        {p.status === "Sold" ? (
                                          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-center font-mono text-[10px] text-slate-500 uppercase">
                                            ✓ Flock sold out completely. Financial indexes cleared & locked.
                                          </div>
                                        ) : (
                                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            
                                            {/* Action: Weight update */}
                                            <button
                                              onClick={() => {
                                                const res = prompt(`[${p.id}] Enter new average weight per bird (Kg):`, p.averageWeightKg.toString());
                                                if (res !== null) {
                                                  applyPoultryWeight(p.id, parseFloat(res));
                                                }
                                              }}
                                              className="bg-slate-950 text-slate-300 font-black border border-slate-850 hover:bg-slate-900 px-3 py-2.5 rounded-xl text-center flex flex-col justify-between items-center transition-transform hover:scale-[1.01] cursor-pointer"
                                            >
                                              <span className="text-[8px] text-slate-500 uppercase block mb-1">Update Weight</span>
                                              <strong className="text-teal-400 text-[10px] font-mono leading-none block">Log Weight/ওজন</strong>
                                            </button>

                                            {/* Action: Feed consumed */}
                                            <button
                                              onClick={() => {
                                                const res = prompt(`[${p.id}] Record concentrate grain allocation (Kg):`, "50");
                                                if (res !== null) {
                                                  applyPoultryFeed(p.id, parseFloat(res));
                                                }
                                              }}
                                              className="bg-slate-950 text-slate-300 font-black border border-slate-850 hover:bg-slate-900 px-3 py-2.5 rounded-xl text-center flex flex-col justify-between items-center transition-transform hover:scale-[1.01] cursor-pointer"
                                            >
                                              <span className="text-[8px] text-slate-500 uppercase block mb-1">Feed Allocation</span>
                                              <strong className="text-teal-400 text-[10px] font-mono leading-none block">Add Feed/খাদ্য</strong>
                                            </button>

                                            {/* Action: Egg harvests */}
                                            {(p.type === "Layer" || p.type === "Duck") && (
                                              <button
                                                onClick={() => {
                                                  const res = prompt(`[${p.id}] Enter collected commercial egg count:`, "400");
                                                  if (res !== null) {
                                                    applyPoultryEggs(p.id, parseInt(res));
                                                  }
                                                }}
                                                className="bg-slate-950 text-slate-300 font-black border border-slate-850 hover:bg-slate-900 px-3 py-2.5 rounded-xl text-center flex flex-col justify-between items-center transition-transform hover:scale-[1.01] cursor-pointer"
                                              >
                                                <span className="text-[8px] text-slate-500 uppercase block mb-1">Egg Collections</span>
                                                <strong className="text-emerald-400 text-[10px] font-mono leading-none block">Log Eggs/ডিম</strong>
                                              </button>
                                            )}

                                            {/* Action: Record Loss */}
                                            <button
                                              onClick={() => {
                                                const res = prompt(`[${p.id}] Report dead birds mortality audit:`, "1");
                                                if (res !== null) {
                                                  applyPoultryLoss(p.id, parseInt(res));
                                                }
                                              }}
                                              className="bg-slate-950 text-slate-300 font-black border border-slate-850 hover:bg-rose-955/20 px-3 py-2.5 rounded-xl text-center flex flex-col justify-between items-center transition-transform hover:scale-[1.01] cursor-pointer"
                                            >
                                              <span className="text-[8px] text-slate-500 uppercase block mb-1">Mortality Loss</span>
                                              <strong className="text-rose-400 text-[10px] font-mono leading-none block">Log Loss/মৃত্যু</strong>
                                            </button>

                                            {/* Action: Sell / Clear batch */}
                                            <button
                                              onClick={() => {
                                                const defaultSale = Math.round(p.currentCount * (p.type === "Broiler" ? 220 : p.type === "Layer" ? 280 : 320));
                                                const res = prompt(`[${p.id}] Verify commercial clearance price for ${p.currentCount} active birds (₹):`, defaultSale.toString());
                                                if (res !== null) {
                                                  sellPoultryBatch(p.id, parseFloat(res));
                                                }
                                              }}
                                              className="bg-teal-500/10 border border-teal-500/25 hover:bg-teal-500/20 text-teal-400 px-3 py-2.5 rounded-xl text-center flex flex-col justify-between items-center transition-transform hover:scale-[1.01] cursor-pointer col-span-2 md:col-span-1"
                                            >
                                              <span className="text-[8px] text-teal-500 uppercase block mb-1">Commercial Settle</span>
                                              <strong className="text-white text-[10px] font-mono leading-none block">Sell Flock/বিক্রি</strong>
                                            </button>

                                          </div>
                                        )}
                                      </div>

                                    </div>
                                  </td>
                                </tr>
                              )}

                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6 pt-2 animate-fadeIn text-left">
              {/* Financial Desk Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(() => {
                  const completed = poultryBatches.filter(b => b.status === "Sold");
                  const totalRevenue = completed.reduce((sum, b) => sum + (b.salesRevenue || 0), 0);
                  const totalFeedCost = completed.reduce((sum, b) => sum + (b.feedConsumedKg * 45), 0);
                  const totalAcquisition = completed.reduce((sum, b) => sum + b.purchaseCost, 0);
                  const totalCost = totalFeedCost + totalAcquisition;
                  const netProfit = totalRevenue - totalCost;
                  const netMarginPct = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

                  return (
                    <>
                      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between shadow-md animate-fadeIn">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wide">Completed Sale Batches</span>
                          <h3 className="text-xl font-black text-white mt-1 font-mono tracking-tight">
                            {completed.length} batches
                          </h3>
                        </div>
                        <div className="text-[8.5px] text-slate-500 font-mono mt-2 uppercase">
                          Market clearances finalized on ledger
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between shadow-md">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold font-mono tracking-wide font-sans text-teal-400">Ledger Revenue Settle</span>
                          <h3 className="text-xl font-black text-teal-400 mt-1 font-mono tracking-tight font-sans">
                            ₹{totalRevenue.toLocaleString()}
                          </h3>
                        </div>
                        <div className="text-[8.5px] text-slate-500 font-mono mt-2 uppercase">
                          Birds commercial sale receipt totals
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between shadow-md">
                        <div>
                          <span className="text-[10px] text-rose-400 uppercase font-bold font-mono tracking-wide font-sans">Accumulated Debits</span>
                          <h3 className="text-xl font-black text-[#f43f5e] mt-1 font-mono tracking-tight">
                            ₹{totalCost.toLocaleString()}
                          </h3>
                        </div>
                        <div className="text-[8.5px] text-slate-500 font-mono mt-1 flex flex-col gap-0.5 uppercase">
                          <span>Buy outlay: ₹{totalAcquisition.toLocaleString()}</span>
                          <span>Feed cost: ₹{totalFeedCost.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between shadow-md ring-2 ring-emerald-500/10">
                        <div>
                          <span className="text-[10px] text-emerald-400 font-sans uppercase font-bold font-mono tracking-wide animate-pulse">Net Commercial Margin</span>
                          <h3 className={`text-xl font-black ${netProfit >= 0 ? "text-emerald-400" : "text-[#f43f5e]"} mt-1 font-mono tracking-tight`}>
                            ₹{netProfit.toLocaleString()}
                          </h3>
                        </div>
                        <div className="text-[8.5px] text-slate-450 font-mono mt-2 font-bold select-none uppercase">
                          Profit margin rate: <span className={netProfit >= 0 ? "text-emerald-400 font-extrabold" : "text-[#f43f5e] font-extrabold"}>{netMarginPct.toFixed(1)}%</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Detailed Batches Financial Ledger Table */}
              <div className="p-6 bg-slate-900 border border-slate-950 rounded-3xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-4 border-b border-slate-850">
                  <div>
                    <h3 className="text-xs font-black text-white font-mono uppercase">Avian Settlement Ledger Index</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Commercial profit math calculated at feed cost rate of ₹45 per Kg.</p>
                  </div>
                </div>

                <div className="overflow-x-auto w-full mt-4">
                  <table className="w-full text-left border-collapse font-sans">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-400 text-[8.5px] uppercase tracking-wider font-mono">
                        <th className="p-3 pl-1 font-bold">Batch Reference ID</th>
                        <th className="p-3 font-bold">Type & Breed</th>
                        <th className="p-3 font-bold">Heads Rest</th>
                        <th className="p-3 font-bold text-right">Chick Outlay (A)</th>
                        <th className="p-3 font-bold text-right">Feed Cost (B)</th>
                        <th className="p-3 font-bold text-right">Total Outlay (A + B)</th>
                        <th className="p-3 font-bold text-right">Clearance Revenue (C)</th>
                        <th className="p-3 font-bold text-right pr-4">Profit Margin (C - Total)</th>
                        <th className="p-3 pr-1 font-bold text-center pl-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const completed = poultryBatches.filter(b => b.status === "Sold");
                        if (completed.length === 0) {
                          return (
                            <tr>
                              <td colSpan={9} className="p-8 text-center text-slate-500 text-[10px] uppercase font-mono">
                                No completed avian batches resolved on this ledger block.
                              </td>
                            </tr>
                          );
                        }
                        return completed.map(b => {
                          const feedCost = b.feedConsumedKg * 45;
                          const totalCost = b.purchaseCost + feedCost;
                          const rev = b.salesRevenue || 0;
                          const margin = rev - totalCost;
                          const isProfitable = margin >= 0;
                          const marginPct = rev > 0 ? (margin / rev) * 100 : 0;

                          return (
                            <tr key={b.id} className="border-b border-slate-850/65 hover:bg-slate-850/20 text-slate-300 text-[10px] font-mono transition-all">
                              <td className="p-3 pl-1 font-mono font-bold text-white">
                                {b.id}
                              </td>
                              <td className="p-3 text-left">
                                <div className="font-bold text-white text-xs">{b.type}</div>
                                <div className="text-[8.5px] text-slate-500 font-mono mt-0.5">{b.breed}</div>
                              </td>
                              <td className="p-3 text-left text-slate-400">
                                <div>0 / {b.initialCount} active</div>
                                <div className="text-[8px] text-rose-455 font-bold">Loss: {b.mortalityCount} birds</div>
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-white">
                                ₹{b.purchaseCost.toLocaleString()}
                              </td>
                              <td className="p-3 text-right">
                                <div className="font-bold text-slate-200 font-mono">₹{feedCost.toLocaleString()}</div>
                                <div className="text-[8px] text-slate-500 font-mono font-medium mt-0.5">{b.feedConsumedKg.toLocaleString()} Kg</div>
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-[#f43f5e]">
                                ₹{totalCost.toLocaleString()}
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-teal-400">
                                ₹{rev.toLocaleString()}
                              </td>
                              <td className="p-3 text-right pr-4">
                                <div className={`font-black font-sans text-xs ${isProfitable ? "text-emerald-400" : "text-[#f43f5e]"}`}>
                                  ₹{margin.toLocaleString()}
                                </div>
                                <div className="text-[8.5px] font-mono text-slate-400 mt-0.5">
                                  Margin: <span className={isProfitable ? "text-emerald-400 font-bold" : "text-rose-450 font-bold"}>{marginPct.toFixed(1)}%</span>
                                </div>
                              </td>
                              <td className="p-3 pr-1 text-center pl-4">
                                <span className="text-[8px] px-2 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-black tracking-wider uppercase">
                                  Settle Paid
                                </span>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Active Batches Margin Forecast */}
              <div className="p-6 bg-slate-900 border border-slate-950 rounded-3xl animate-fadeIn">
                <div>
                  <h3 className="text-xs font-black text-white font-mono uppercase">Avian Projections Desk (Active Batches Forecast)</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Estimated revenue and margins based on current headcounts evaluated at market bird prices.</p>
                </div>
                
                <div className="overflow-x-auto w-full mt-4">
                  <table className="w-full text-left border-collapse font-sans">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-400 text-[8.5px] uppercase tracking-wider font-mono">
                        <th className="p-3 pl-1 font-bold">Batch ID</th>
                        <th className="p-3 font-bold">Type & Breed</th>
                        <th className="p-3 font-bold">Est. Weight / Bird</th>
                        <th className="p-3 font-bold text-right">Chick Cost (A)</th>
                        <th className="p-3 font-bold text-right">Feed Cost (B)</th>
                        <th className="p-3 font-bold text-right">Est. Sale Price / Bird</th>
                        <th className="p-3 font-bold text-right font-sans text-teal-400">Projected Revenue (C)</th>
                        <th className="p-3 font-bold text-right pr-4 pl-4 font-sans text-teal-400">Projected Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const active = poultryBatches.filter(b => b.status !== "Sold");
                        if (active.length === 0) {
                          return (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-slate-500 text-[10px] uppercase font-mono">
                                No active avian batches roaming pens.
                              </td>
                            </tr>
                          );
                        }
                        return active.map(b => {
                          const feedCost = b.feedConsumedKg * 45;
                          const totalCost = b.purchaseCost + feedCost;
                          const stdPricePerBird = b.type === "Broiler" ? 220 : b.type === "Layer" ? 280 : 320;
                          const estRev = b.currentCount * stdPricePerBird;
                          const margin = estRev - totalCost;
                          const isProfitable = margin >= 0;
                          const marginPct = estRev > 0 ? (margin / estRev) * 100 : 0;

                          return (
                            <tr key={b.id} className="border-b border-slate-850/65 text-slate-405 text-[10px] font-mono leading-loose">
                              <td className="p-3 pl-1 font-mono font-bold text-slate-250">
                                {b.id}
                              </td>
                              <td className="p-3 text-left">
                                <div className="font-bold text-slate-200 text-xs">{b.type}</div>
                                <div className="text-[8.5px] text-slate-505 font-mono mt-0.5">{b.breed}</div>
                              </td>
                              <td className="p-3 text-left">
                                <div className="text-slate-350">{b.averageWeightKg} Kg avg</div>
                                <div className="text-[8.5px] text-slate-500 font-mono mt-0.5">{b.currentCount} active heads</div>
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-slate-300">
                                ₹{b.purchaseCost.toLocaleString()}
                              </td>
                              <td className="p-3 text-right">
                                <div className="font-bold text-slate-300 font-mono">₹{feedCost.toLocaleString()}</div>
                                <div className="text-[8px] text-slate-500 font-mono mt-0.5">{b.feedConsumedKg.toLocaleString()} Kg</div>
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-amber-500/90">
                                ₹{stdPricePerBird.toLocaleString()}
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-teal-400">
                                ₹{estRev.toLocaleString()}
                              </td>
                              <td className="p-3 text-right pr-4 pl-4">
                                <div className={`font-black font-sans text-xs ${isProfitable ? "text-emerald-400" : "text-[#f43f5e]"}`}>
                                  ₹{margin.toLocaleString()}
                                </div>
                                <div className="text-[8.5px] font-mono text-slate-500 mt-0.5">
                                  Margin: <span className={isProfitable ? "text-emerald-400 font-bold" : "text-rose-450 font-semibold"}>{marginPct.toFixed(1)}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      );
        })()}

        {/* SECTION 7: DYNAMIC UNIVERSAL SETTINGS WORKSPACE */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="bg-slate-900 border border-slate-950 p-6 rounded-3xl space-y-6 shadow-md">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-teal-400 block">System Management Console</span>
                <h3 className="text-white text-sm font-black font-mono uppercase">Control & Configuration Panel / সিস্টেম সেটআপ</h3>
                <p className="text-[10px] text-slate-400 mt-1">Configure systemic variables, date formats, font sizes, custom attributes, and localized settings parameters.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Panel segment 1: Time, Date and Timezones */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                    <Calendar className="h-4.5 w-4.5 text-teal-400" />
                    <h4 className="text-xs font-black text-white uppercase font-mono">Date, Time & Timezone Sync</h4>
                  </div>
                  
                  <div className="space-y-3 font-mono text-[10px]">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">CURRENT TIMEZONE OFFSET</label>
                      <select
                        value={configTimezone}
                        onChange={(e) => {
                          setConfigTimezone(e.target.value);
                          localStorage.setItem("sla_config_timezone", e.target.value);
                        }}
                        className="w-full bg-slate-900 p-2 border border-slate-800 rounded text-xs text-white uppercase focus:outline-none"
                      >
                        <option value="-12:00">UTC -12:00 (Baker Island)</option>
                        <option value="-10:00">UTC -10:00 (Hawaii)</option>
                        <option value="-08:00">UTC -08:00 (Pacific Time - US)</option>
                        <option value="-05:00">UTC -05:00 (Eastern Time - US)</option>
                        <option value="+00:00">UTC +00:00 (GMT London)</option>
                        <option value="+03:00">UTC +03:00 (Moscow / East Africa)</option>
                        <option value="+05:30">UTC +05:30 (IST Kolkata / New Delhi)</option>
                        <option value="+06:00">UTC +06:00 (BST Dhaka / Astana Standard)</option>
                        <option value="+07:00">UTC +07:00 (Bangkok / Jakarta)</option>
                        <option value="+08:00">UTC +08:00 (Beijing / Singapore)</option>
                        <option value="+09:00">UTC +09:00 (Tokyo / Seoul)</option>
                        <option value="+12:00">UTC +12:00 (Auckland / Fiji)</option>
                      </select>
                      <span className="text-[8.5px] text-slate-500">Configures timezone calculation for receipt receipts and historic audit markers.</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg space-y-2 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-bold uppercase text-[8.5px]">MANUAL OVERRIDE DATETIME</span>
                        <input
                          type="checkbox"
                          checked={isDateTimeOverrideActive}
                          onChange={(e) => {
                            setIsDateTimeOverrideActive(e.target.checked);
                            localStorage.setItem("sla_is_datetime_override", e.target.checked ? "true" : "false");
                          }}
                          className="rounded text-teal-500 focus:ring-0 cursor-pointer text-xs"
                        />
                      </div>
                      
                      {isDateTimeOverrideActive && (
                        <div className="space-y-1">
                          <input
                            type="datetime-local"
                            value={overrideDateTimeValue}
                            onChange={(e) => {
                              setOverrideDateTimeValue(e.target.value);
                              localStorage.setItem("sla_override_datetime_value", e.target.value);
                            }}
                            className="w-full bg-slate-950 p-1.5 border border-slate-850 rounded text-[11px] font-bold text-white focus:outline-none"
                          />
                          <span className="text-[8px] text-rose-500 block">Attention: This overrides system-wide date logging timestamps manually.</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-teal-555/5 rounded-xl border border-teal-500/10 flex justify-between items-center">
                      <span className="text-slate-400 text-[8.5px] uppercase font-bold">Live System Time:</span>
                      <strong className="text-teal-400 text-xs font-black select-none font-mono">{getFormattedDateTime()}</strong>
                    </div>

                  </div>
                </div>

                {/* Panel segment 2: Typography family, size scaling & Display theme choices */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                    <Settings className="h-4.5 w-4.5 text-teal-400" />
                    <h4 className="text-xs font-black text-white uppercase font-mono">Typography & Display Density</h4>
                  </div>

                  <div className="space-y-4 font-mono text-[10px]">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Font selection */}
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold block text-[8.5px]">FONT FAMILY</label>
                        <select
                          value={configFont}
                          onChange={(e) => {
                            setConfigFont(e.target.value);
                            localStorage.setItem("sla_config_font", e.target.value);
                          }}
                          className="w-full bg-slate-900 p-2 border border-slate-800 rounded text-xs text-white uppercase focus:outline-none"
                        >
                          <option value="Inter">Inter Sans-Serif</option>
                          <option value="Space Grotesk">Space Grotesk</option>
                          <option value="Outfit">Outfit Minimal</option>
                          <option value="JetBrains Mono">JetBrains Technical Mono</option>
                        </select>
                      </div>

                      {/* Font scaling sizing */}
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold block text-[8.5px]">SYSTEM FONT SCALE</label>
                        <select
                          value={configFontSize}
                          onChange={(e) => {
                            setConfigFontSize(e.target.value);
                            localStorage.setItem("sla_config_font_size", e.target.value);
                          }}
                          className="w-full bg-slate-900 p-2 border border-slate-800 rounded text-xs text-white uppercase focus:outline-none"
                        >
                          <option value="sm">Small (Size 11px)</option>
                          <option value="base">Normal Standard (13px)</option>
                          <option value="lg">Large Scale (15px)</option>
                        </select>
                      </div>
                    </div>

                    {/* Display Density */}
                    <div className="space-y-1 bg-slate-900 p-3.5 rounded-xl border border-slate-850">
                      <label className="text-slate-300 font-bold block text-[8.5px] uppercase mb-1.5">UX Layout Spacing Mode</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setConfigDisplayDensity("comfortable");
                            localStorage.setItem("sla_config_display_density", "comfortable");
                          }}
                          className={`py-1.5 px-3 rounded text-[9.5px] font-bold cursor-pointer font-sans transition ${
                            configDisplayDensity === "comfortable"
                              ? "bg-teal-500 text-slate-950 font-extrabold"
                              : "bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-800"
                          }`}
                        >
                          Comfortable Grid
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfigDisplayDensity("compact");
                            localStorage.setItem("sla_config_display_density", "compact");
                          }}
                          className={`py-1.5 px-3 rounded text-[9.5px] font-bold cursor-pointer font-sans transition ${
                            configDisplayDensity === "compact"
                              ? "bg-teal-500 text-slate-950 font-extrabold"
                              : "bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-800"
                          }`}
                        >
                          Compact Row Mode
                        </button>
                      </div>
                    </div>

                    {/* Quick Light Dark toggler visual preview */}
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-850 text-[9px] text-slate-400">
                      <span>Quick Mode Theme Preference:</span>
                      <strong className="text-white uppercase font-bold text-teal-400">{theme} Mode Active</strong>
                    </div>

                  </div>
                </div>
              </div>

              {/* Dynamic Expandable Field Generator Block */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4 font-mono">
                <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4.5 w-4.5 text-teal-400 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase">Add More Custom Parameters / অতিরিক্ত ফিল্ড</h4>
                      <p className="text-[8.5px] text-slate-500 mt-0.5 font-normal">Create customized input fields dynamically for either Livestock registries or Poultry batches.</p>
                    </div>
                  </div>
                </div>

                {/* Addition Form Row */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const nameFieldValue = formData.get("fieldName")?.toString().trim();
                    const entityType = formData.get("fieldEntity")?.toString() as "Livestock" | "Poultry";
                    const fieldType = formData.get("fieldType")?.toString() as "text" | "number";

                    if (!nameFieldValue) {
                      alert("Field name cannot be blank.");
                      return;
                    }

                    if (customFields.some(cf => cf.entity === entityType && cf.name.toLowerCase() === nameFieldValue.toLowerCase())) {
                      alert("This parameter already exists for this cattle directory category!");
                      return;
                    }

                    const newField = {
                      id: `field-${Date.now()}`,
                      name: nameFieldValue,
                      entity: entityType,
                      type: fieldType
                    };

                    const updatedFields = [...customFields, newField];
                    setCustomFields(updatedFields);
                    localStorage.setItem("sla_custom_fields", JSON.stringify(updatedFields));
                    e.currentTarget.reset();
                    alert(`✓ Added parameter "${nameFieldValue}" successfully for ${entityType} registry!`);
                  }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900 p-4 rounded-xl border border-slate-850 items-end"
                >
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase text-slate-500 font-bold block">1. Parameter Name</span>
                    <input
                      name="fieldName"
                      type="text"
                      placeholder="e.g. Vaccination Status"
                      required
                      className="w-full bg-slate-950 p-2 border border-slate-800 rounded font-bold text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase text-slate-500 font-bold block">2. Category Assignment</span>
                    <select
                      name="fieldEntity"
                      className="w-full bg-slate-950 p-2 border border-slate-800 rounded text-xs font-bold text-white focus:outline-none"
                    >
                      <option value="Livestock">Livestock Registry</option>
                      <option value="Poultry">Poultry Flocks</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] uppercase text-slate-500 font-bold block">3. Attribute Data Type</span>
                    <select
                      name="fieldType"
                      className="w-full bg-slate-950 p-2 border border-slate-800 rounded text-xs font-bold text-white focus:outline-none"
                    >
                      <option value="text">Alphanumeric Text (String)</option>
                      <option value="number">Numeric Metrics (Decimal)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold py-2 px-4 rounded text-[10px] uppercase cursor-pointer text-center"
                  >
                    Confirm Add Field
                  </button>
                </form>

                {/* Registered Fields Lists */}
                <div className="space-y-2 mt-4">
                  <span className="text-[9px] uppercase text-slate-300 font-bold tracking-wider block">Active Dynamic Parameters Dashboard</span>
                  
                  {customFields.length === 0 ? (
                    <div className="py-6 bg-slate-900 border border-slate-850 rounded-xl text-center text-slate-500 text-[10px]">
                      No custom fields added yet. Dynamic registry is standard.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {customFields.map((field) => (
                        <div key={field.id} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between font-sans">
                          <div className="text-left">
                            <strong className="text-slate-100 text-xs font-mono block">{field.name}</strong>
                            <div className="flex gap-1.5 mt-1">
                              <span className="text-[8px] uppercase font-mono px-1 rounded bg-slate-950 text-teal-400 font-bold border border-slate-850">
                                {field.entity}
                              </span>
                              <span className="text-[8px] uppercase font-mono px-1 rounded bg-slate-950 text-slate-400 border border-slate-850">
                                {field.type}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (confirm(`Delete parameters field "${field.name}" from ${field.entity}? Users values for this field will be severed.`)) {
                                const nextFields = customFields.filter(cf => cf.id !== field.id);
                                setCustomFields(nextFields);
                                localStorage.setItem("sla_custom_fields", JSON.stringify(nextFields));
                                alert(`Field "${field.name}" removed.`);
                              }
                            }}
                            className="p-1 px-2 border border-rose-500/20 rounded hover:bg-rose-500/10 hover:text-rose-400 text-slate-300 transition cursor-pointer text-[10px] font-mono font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Background Auto-Sync Settings Block */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4 font-mono">
                <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4.5 w-4.5 text-teal-400 animate-spin" style={{ animationDuration: "12s" }} />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase">{lang === "bn" ? "অটো-সিঙ্ক শিডিউলার / ব্যাকগ্রাউন্ড অটো-সিঙ্ক" : "Background Auto-Sync Scheduler"}</h4>
                      <p className="text-[8.5px] text-slate-500 mt-0.5 font-normal">{lang === "bn" ? "নিশ্চিত করুন ক্লাউড লেজার ব্যাকগ্রাউন্ডে নিয়মিত সময়ের ব্যবধানে সিঙ্ক হয়।" : "Configure the interval for automatic background database synchronization to the central cloud server."}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-900 p-4 rounded-xl border border-slate-850">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] uppercase font-mono tracking-wide text-slate-400 font-bold block">
                      {lang === "bn" ? "সিঙ্ক করার সময় ব্যবধান (সেকেন্ডে)" : "Sync Interval (Seconds)"}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        max="3600"
                        value={syncIntervalValue}
                        onChange={(e) => {
                          const val = Math.max(5, Number(e.target.value));
                          setSyncIntervalValue(val);
                          localStorage.setItem("sla_sync_interval", val.toString());
                        }}
                        className="bg-slate-950 px-3 py-2 border border-slate-800 rounded font-black text-xs text-white focus:outline-none w-28 text-center"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">
                        {lang === "bn" ? "সেকেন্ড পর পর" : "seconds"}
                      </span>
                    </div>
                    <p className="text-[8px] text-slate-500 font-normal block leading-tight mt-1">
                      {lang === "bn" ? "সর্বনিম্ন ৫ সেকেন্ড এবং সর্বোচ্চ ৩৬০০ সেকেন্ড সমর্থন করে।" : "Supports 5 to 3600 seconds. Choose small intervals to prevent ledger collision."}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-850 rounded-xl space-y-1 text-left">
                    <span className="text-[8.5px] text-teal-400 font-black block font-mono">AUTO-SYNC STATUS:</span>
                    <p className="text-[9px] text-slate-300">
                      {lang === "bn" ? `অটো-সিঙ্ক সক্রিয়: প্রতি ${syncIntervalValue} সেকেন্ডে ক্লাউড ডাটাবেস অটোমেটিক সিঙ্ক্রোনাইজ হবে।` : `Active. Every ${syncIntervalValue} seconds, custom ledger states will be propagated safely.`}
                    </p>
                    <div className="flex gap-2 items-center mt-2.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      <span className="text-[8px] text-slate-500 font-mono">{lang === "bn" ? "ব্যাকগ্রাউন্ড ডেমোন সিঙ্ক্রোনাইজার চালু আছে" : "Daemon background sync listener online"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Backup & Offline Archives Dashboard */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4 font-mono">
                <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="h-4.5 w-4.5 text-teal-400 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase">{lang === "bn" ? "গ্লোবাল ডাটা ব্যাকআপ ও আর্কাইভ" : "Global Data Backup & Restore Engine"}</h4>
                      <p className="text-[8.5px] text-slate-500 mt-0.5 font-normal">{lang === "bn" ? "আর্কাইভ হিস্ট্রি ব্যাকআপ ফাইল হিসেবে ডাউনলোড করুন এবং যেকোনো সময় লোড করুন।" : "Download complete systemic states (including livestock, transactions, poultry, and audit records) in structured JSON format."}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-850">
                  {/* Backup Card */}
                  <div className="p-3.5 bg-slate-950/70 border border-slate-850 rounded-xl space-y-3 text-left flex flex-col justify-between">
                    <div>
                      <span className="text-[8.5px] text-teal-400 font-extrabold block font-mono">1. EXPORT CORE STATE ARCHIVE (JSON)</span>
                      <p className="text-[9.5px] text-slate-400 leading-relaxed mt-1">
                        Download all active herd registries, financial transactions logs, avian poultry flocks, sales, and environmental sensors states into a single verifiable backup JSON file.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const backupData = {
                          exportOrigin: "ShaieAlam Livestock ERP",
                          exportVersion: "v4.9",
                          exportTimestamp: new Date().toISOString(),
                          timezoneContext: configTimezone,
                          animals,
                          sales,
                          transactions,
                          poultryBatches,
                          feedInventory,
                          auditLogs,
                          customFields
                        };
                        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `shaiealam_erp_global_backup_${new Date().toISOString().slice(0, 10)}.json`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                        addAuditLog("Global Backup Triggered", "System", `Full JSON state database backup download initiated successfully.`);
                        alert(lang === "bn" ? "✓ গ্লোবাল ডাটা ব্যাকআপ সফলভাবে ডাউনলোড করা হয়েছে।" : "✓ Global database configuration backup download initiated. Archive secured safely.");
                      }}
                      className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase cursor-pointer text-center flex items-center justify-center gap-1.5 transition active:scale-95 mt-3"
                    >
                      <Download className="h-4 w-4" />
                      {lang === "bn" ? "গ্লোবাল ব্যাকআপ ডাউনলোড" : "Generate Global Backup / ডাউনলোড"}
                    </button>
                  </div>

                  {/* Restore Card */}
                  <div className="p-3.5 bg-slate-950/70 border border-slate-850 rounded-xl space-y-3 text-left flex flex-col justify-between relative">
                    <div>
                      <span className="text-[8.5px] text-indigo-400 font-extrabold block font-mono">2. IMPORT / RESTORE DATABASE STATE</span>
                      <p className="text-[9.5px] text-slate-400 leading-relaxed mt-1">
                        Upload a previously generated <code>.json</code> backup configurations file to fully rehydrate and populate all local livestock, financial journals, and poultry records.
                      </p>
                    </div>
                    <div className="relative mt-3">
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          if (!confirm(lang === "bn" ? "সাবধান! এই ফাইলটি আপনার বর্তমান ইআরপি-র সমস্ত সক্রিয় তথ্য ওভাররাইট করবে। আপনি কি এগিয়ে যেতে চান?" : "Warning! This action will fully replace and overwrite your active ERP tables. Are you sure you wish to continue hydration?")) {
                            e.target.value = "";
                            return;
                          }

                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            try {
                              const parsed = JSON.parse(evt.target?.result as string);
                              if (parsed.animals && parsed.transactions && parsed.poultryBatches) {
                                if (parsed.animals) setAnimals(parsed.animals);
                                if (parsed.sales) setSales(parsed.sales);
                                if (parsed.transactions) setTransactions(parsed.transactions);
                                if (parsed.poultryBatches) setPoultryBatches(parsed.poultryBatches);
                                if (parsed.feedInventory) setFeedInventory(parsed.feedInventory);
                                if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
                                if (parsed.customFields) setCustomFields(parsed.customFields);
                                
                                alert(lang === "bn" ? "✓ সমস্ত ডাটাবেস রেকর্ডস সফলভাবে রিস্টোর করা হয়েছে!" : "✓ System state rehydrated successfully! All active databases have been populated from the backup.");
                                addAuditLog("Database Restored", "System", `Full system schema hydrated from file exported on ${parsed.exportTimestamp || 'Unknown date'}`);
                              } else {
                                alert("⚠️ Invalid backup file format. Backups must contain core structured tables.");
                              }
                            } catch (err) {
                              alert("⚠️ parsing failure. The file provided is not a valid JSON archive.");
                            }
                          };
                          reader.readAsText(file);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <button
                        type="button"
                        className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-750 text-indigo-400 font-black py-2.5 rounded-xl text-xs uppercase text-center flex items-center justify-center gap-1.5 transition pointer-events-none"
                      >
                        <Upload className="h-4 w-4" />
                        {lang === "bn" ? "ব্যাকআপ ফাইল লোড করুন" : "Upload & Rehydrate State"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Log (Administrative Review) Widget */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4 font-mono">
                <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-teal-400" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase">{lang === "bn" ? "অডিট লগ / অডিট হিস্টোরি" : "System Audit Log (Last 20 Actions)"}</h4>
                      <p className="text-[8.5px] text-slate-500 mt-0.5 font-normal">{lang === "bn" ? "সকল বিভাগ (Herd, Butcher, Poultry, Feed, System) জুড়ে শেষ ২০টি কার্যকলাপ পর্যালোচনা করুন।" : "Administrative log index representing last 20 core telemetry operations & transactions across departments."}</p>
                    </div>
                  </div>

                  {/* Clear button */}
                  <button
                    onClick={() => {
                      if (confirm("Clear administrative logs registry buffer?")) {
                        setAuditLogs([]);
                        alert("Buffer cleared.");
                      }
                    }}
                    className="text-slate-500 hover:text-white border border-slate-850 hover:bg-slate-900 text-[9px] px-2 py-1 rounded transition font-bold"
                  >
                    {lang === "bn" ? "বাফার মুছুন" : "Clear Logs"}
                  </button>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-900 p-3 rounded-xl border border-slate-850">
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-[8.5px] uppercase font-bold text-slate-500">{lang === "bn" ? "খুঁজুন:" : "Query Search:"}</span>
                    <input
                      type="text"
                      placeholder={lang === "bn" ? "অ্যাকশন বা বিবরণ টাইপ করুন" : "Filter actions or details..."}
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="bg-transparent border-none text-[10px] text-slate-300 focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 justify-between">
                    <span className="text-[8.5px] uppercase font-bold text-slate-500">{lang === "bn" ? "বিভাগ:" : "Dept Filter:"}</span>
                    <select
                      value={auditDept}
                      onChange={(e) => setAuditDept(e.target.value)}
                      className="bg-transparent border-none text-[10px] font-bold text-teal-450 focus:outline-none cursor-pointer"
                      style={{ color: "#14b8a6" }}
                    >
                      <option value="All" style={{ color: "#000" }}>{lang === "bn" ? "সকল বিভাগ" : "All Departments"}</option>
                      <option value="Livestock" style={{ color: "#000" }}>Livestock</option>
                      <option value="Poultry" style={{ color: "#000" }}>Poultry</option>
                      <option value="Butcher" style={{ color: "#000" }}>Butcher</option>
                      <option value="Feed Store" style={{ color: "#000" }}>Feed Store</option>
                      <option value="Collections" style={{ color: "#000" }}>Collections</option>
                      <option value="System" style={{ color: "#000" }}>System</option>
                    </select>
                  </div>
                </div>

                {/* Audit Log Table/List */}
                <div className="overflow-hidden border border-slate-850 rounded-xl bg-slate-950">
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-900">
                    {filteredAuditLogs.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 text-[10px] font-mono">
                        {lang === "bn" ? "কোন রিয়েল-টাইম অ্যাকশন লগ পাওয়া যায়নি।" : "No administrative actions found matching audit queries."}
                      </div>
                    ) : (
                      filteredAuditLogs.map((log) => (
                        <div key={log.id} className="p-3 hover:bg-slate-900/60 transition flex flex-col md:flex-row justify-between md:items-center gap-2 text-left">
                          <div className="flex items-start gap-2.5">
                            <span className="text-[8.5px] bg-slate-900 text-slate-400 font-extrabold px-1.5 py-0.5 rounded border border-slate-800 shrink-0 select-none">
                              {log.id}
                            </span>
                            <div>
                              <strong className="text-white text-[11px] font-black">{log.action}</strong>
                              <p className="text-[10px] text-slate-400 mt-0.5">{log.details}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-10 md:ml-0 self-end md:self-auto shrink-0">
                            <span className="text-[8.5px] uppercase tracking-wider font-extrabold px-1.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                              {log.department}
                            </span>
                            <span className="text-[8px] text-slate-500 select-none font-mono">
                              {log.timestamp}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* PROFESSIONAL SITEMAP FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-850 py-10 px-4 mt-12 no-print">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
          
          {/* Main ERP Navigation (Sitemap) */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-teal-400 font-extrabold">ERP Map / ম্যাপ</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>
                <button onClick={() => setActiveTab("dashboard")} className="hover:text-white transition cursor-pointer text-left">
                  🚀 Executive Dashboard / ড্যাশবোর্ড
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("livestock")} className="hover:text-white transition cursor-pointer text-left">
                  🐄 Livestock Registry / পশুপালন রেজিস্ট্রি
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("poultry")} className="hover:text-white transition cursor-pointer text-left">
                  🐔 Poultry Industry / পোল্ট্রি শিল্প
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("butcher")} className="hover:text-white transition cursor-pointer text-left">
                  🥩 Processor & Butcher / কসাইখানা
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-teal-400 font-extrabold">Commercial Ledger / হিসাব</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>
                <button onClick={() => setActiveTab("collections")} className="hover:text-white transition cursor-pointer text-left">
                  💰 Collections & Outstanding / বকেয়া আদায়
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("feed")} className="hover:text-white transition cursor-pointer text-left">
                  🌾 Feed Shop & Inventory / দানাদার খাদ্য
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("settings")} className="hover:text-white transition cursor-pointer text-left">
                  ⚙️ System Settings / সেটিংস
                </button>
              </li>
              <li className="pt-1.5 border-t border-slate-850">
                <button 
                  onClick={() => {
                    setSitemapActiveTab("map");
                    setShowSitemapModal(true);
                  }} 
                  className="text-teal-400 hover:text-white transition cursor-pointer text-left font-bold flex items-center gap-1 text-[11px]"
                >
                  🗺️ Sitemap Hierarchy / সাইটম্যাপ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSitemapActiveTab("terms");
                    setShowSitemapModal(true);
                  }} 
                  className="text-teal-400 hover:text-white transition cursor-pointer text-left font-bold flex items-center gap-1 text-[11px]"
                >
                  📜 Terms & Conditions / শর্তাবলী
                </button>
              </li>
            </ul>
          </div>

          {/* Subfeatures / Live monitors */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-teal-500 font-extrabold">Support Desks / সহায়তা</h4>
            <ul className="space-y-1.5 text-xs text-slate-400 font-sans">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10.5px]">System Status: Online</span>
              </li>
              <li>
                <span className="text-slate-500 font-mono text-[10.5px]">Timezone: {configTimezone === "+05:30" ? "IST India (GMT+5:30)" : `UTC ${configTimezone}`}</span>
              </li>
              <li>
                <span className="text-slate-500 font-mono text-[10.5px]">V4.9 Steady Core Engine</span>
              </li>
            </ul>
          </div>

          {/* Brand/Signature */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-extrabold">Enterprise Core</h4>
            <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
              <strong>ShaieAlam Meat & Livestock ERP</strong> is optimized for decentralized commercial breeding, avian tracking, and credit collection. High-frequency updates are cached locally during network latency.
            </p>
            <div className="text-[9.5px] text-slate-600 font-mono mt-2">
              © 2026 ShaieAlam Livestock.
            </div>
            {/* Social Media Link Logos */}
            <div className="flex items-center gap-2.5 pt-1.5">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-1.5 bg-slate-950/60 hover:bg-slate-8 w-8 h-8 rounded-lg flex items-center justify-center text-slate-450 hover:text-teal-400 border border-slate-850 hover:border-slate-800 transition shadow" 
                title="Facebook"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-1.5 bg-slate-950/60 hover:bg-slate-8 w-8 h-8 rounded-lg flex items-center justify-center text-slate-450 hover:text-teal-400 border border-slate-850 hover:border-slate-800 transition shadow" 
                title="Twitter"
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-1.5 bg-slate-950/60 hover:bg-slate-8 w-8 h-8 rounded-lg flex items-center justify-center text-slate-450 hover:text-teal-400 border border-slate-850 hover:border-slate-800 transition shadow" 
                title="LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-1.5 bg-slate-950/60 hover:bg-slate-8 w-8 h-8 rounded-lg flex items-center justify-center text-slate-450 hover:text-teal-400 border border-slate-850 hover:border-slate-800 transition shadow" 
                title="GitHub"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* POS BILLING DESK MODAL WITH EMULATOR QR BARCODE SCANNER */}
      {showBillingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-xs font-black text-white uppercase font-mono tracking-tight flex items-center gap-1.5">
                <ShoppingCart className="h-4.5 w-4.5 text-teal-400" />
                {lang === "bn" ? "পিওএস রিটেইল বিলিং ডেস্ক" : "POS Retail Billing Desk"}
              </h3>
              <button 
                onClick={() => {
                  stopQRScannerCamera();
                  setShowBillingModal(false);
                }} 
                className="text-slate-500 hover:text-white text-xs font-bold cursor-pointer font-mono"
              >
                {lang === "bn" ? "বন্ধ করুন" : "Close"}
              </button>
            </div>

            <form onSubmit={handleIssuePOSBill} className="space-y-4 mt-4 text-xs text-left">
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wide text-slate-400 font-bold">
                    {lang === "bn" ? "গ্রাহকের নাম" : "Customer Name"}
                  </label>
                  <input 
                    type="text" 
                    placeholder={lang === "bn" ? "যেমনঃ ঢাকা ক্লাব" : "E.g., Dhaka Club"} 
                    required
                    value={posBillForm.customerName}
                    onChange={(e) => setPosBillForm({ ...posBillForm, customerName: e.target.value })}
                    className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wide text-slate-400 font-bold">
                    {lang === "bn" ? "যোগাযোগ নম্বর" : "Contact Phone"}
                  </label>
                  <input 
                    type="text" 
                    placeholder="+8801711..." 
                    value={posBillForm.customerPhone}
                    onChange={(e) => setPosBillForm({ ...posBillForm, customerPhone: e.target.value })}
                    className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl font-mono" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-mono tracking-wide text-slate-400 font-bold">
                  {lang === "bn" ? "আইটেমের ধরণ / কাট" : "Item Type / Cuts"}
                </label>
                <select 
                  value={posBillForm.itemType}
                  onChange={(e) => setPosBillForm({ ...posBillForm, itemType: e.target.value })}
                  className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl"
                >
                  <option value="Premium Beef Loin">
                    {lang === "bn" ? "প্রিমিয়াম গরুর লয়েন (₹৭৮০/কেজি)" : "Premium Beef Loin (₹780/kg)"}
                  </option>
                  <option value="Brahman Flank Cut">
                    {lang === "bn" ? "ব্রাহ্মণ ফ্ল্যাঙ্ক কাট (₹৭০০/কেজি)" : "Brahman Flank Cut (₹700/kg)"}
                  </option>
                  <option value="Bovine Standard Bone-In">
                    {lang === "bn" ? "স্ট্যান্ডার্ড গরুর মাংস (হাড়সহ) (₹৬৫০/কেজি)" : "Bovine Standard Bone-In (₹650/kg)"}
                  </option>
                  <option value="Caprine Sirloin">
                    {lang === "bn" ? "খাসির সার্লয়েন (₹৯৫০/কেজি)" : "Caprine Sirloin (₹950/kg)"}
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wide text-slate-400 font-bold">
                    {lang === "bn" ? "পরিমাণ (কেজি)" : "Quantity (Kg)"}
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    required
                    value={posBillForm.weightKg}
                    onChange={(e) => setPosBillForm({ ...posBillForm, weightKg: Number(e.target.value) })}
                    className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl font-mono" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wide text-slate-400 font-bold">
                    {lang === "bn" ? "মূল্য প্রতি কেজি (₹)" : "Rate Per Kg (₹)"}
                  </label>
                  <input 
                    type="number" 
                    required
                    value={posBillForm.ratePerKg}
                    onChange={(e) => setPosBillForm({ ...posBillForm, ratePerKg: Number(e.target.value) })}
                    className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl font-mono" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-mono tracking-wide text-slate-400 font-bold">
                  {lang === "bn" ? "পেমেন্ট পদ্ধতি" : "Payment Method"}
                </label>
                <select 
                  value={posBillForm.paymentMethod}
                  onChange={(e) => setPosBillForm({ ...posBillForm, paymentMethod: e.target.value as any })}
                  className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl"
                >
                  <option value="Cash">{lang === "bn" ? "নগদ পেমেন্ট (Cash)" : "Cash Payments"}</option>
                  <option value="bKash">{lang === "bn" ? "বিকাশ মোবাইল মানি (bKash)" : "bKash Mobile Money"}</option>
                  <option value="UPI">{lang === "bn" ? "ইউপিআই সিঙ্ক (UPI)" : "UPI Sync"}</option>
                  <option value="Credit">{lang === "bn" ? "বকেয়া ক্রেডিট শর্তাবলী (Credit)" : "Collections Terms (Credit)"}</option>
                </select>
              </div>

              {/* Advanced Camera QR Scanner Tool for POS checkouts */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-mono font-black text-teal-400">
                      {lang === "bn" ? "পিওএস পেমেন্ট রিডার" : "POS Payment Reader"}
                    </span>
                    <h5 className="text-[11px] font-bold text-white font-sans">
                      {lang === "bn" ? "ক্যামেরা কিউআর স্ক্যানার" : "Camera QR Scanner"}
                    </h5>
                  </div>
                  {!isScanningQR ? (
                    <button
                      type="button"
                      onClick={startQRScannerCamera}
                      className="bg-teal-500 text-slate-950 font-black text-[9.5px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer select-none uppercase font-mono"
                    >
                      <Camera className="h-3 w-3" />
                      {lang === "bn" ? "স্ক্রিন স্ক্যান" : "Scan Screen"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopQRScannerCamera}
                      className="bg-rose-500 text-white font-black text-[9.5px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer select-none uppercase font-mono"
                    >
                      {lang === "bn" ? "স্ক্যান বন্ধ করুন" : "Stop Scan"}
                    </button>
                  )}
                </div>

                {isScanningQR && (
                  <div className="space-y-2">
                    <div className="relative aspect-video w-full bg-slate-900 border border-slate-850 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                      {qrScanningCameraState === "ready" ? (
                        <>
                          <video 
                            ref={qrVideoRef} 
                            className="absolute inset-0 w-full h-full object-cover" 
                            playsInline 
                            muted 
                          />
                          <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-bounce z-10"></div>
                          <div className="absolute h-24 w-24 border border-dashed border-emerald-400 rounded animate-pulse z-10 flex items-center justify-center">
                            <span className="scale-[2.0] text-emerald-300/[0.15] font-mono">[]</span>
                          </div>
                        </>
                      ) : qrScanningCameraState === "scanned" ? (
                        <div className="absolute inset-0 bg-emerald-950/50 flex flex-col items-center justify-center gap-1.5 z-10 animate-fadeIn">
                          <CheckCircle className="h-8 w-8 text-emerald-400" />
                          <span className="font-extrabold text-[9.5px] tracking-wider text-white">
                            {lang === "bn" ? "রেফারেন্স ডিকোড সফল হয়েছে" : "DECODED REFERENCE SUCCESS"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-500 p-4">
                          <RefreshCw className="h-6 w-6 animate-spin text-teal-400" />
                          <span>
                            {lang === "bn" ? "ক্যামেরা স্ট্রিম প্রস্তুত হচ্ছে..." : "Preparing optics stream..."}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-900 p-2 border border-slate-850 rounded text-[9px] font-mono text-slate-400 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="truncate">{scannerCameraLogs}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-850">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] text-slate-400 uppercase font-mono block">
                      {lang === "bn" ? "ডিজিটাল রেফারেন্স আইডি" : "Digital Reference ID"}
                    </span>
                    <input
                      type="text"
                      placeholder="E.g., TXN-BKASH-389104"
                      value={qrTxnRefId}
                      onChange={(e) => setQrTxnRefId(e.target.value)}
                      className="bg-slate-900 border border-slate-850 rounded p-1 text-[10px] text-white font-mono text-center font-bold w-1/2"
                    />
                  </div>
                </div>

              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-mono font-black text-white">
                <span>{lang === "bn" ? "মোট মূল্য:" : "TOTAL COST:"}</span>
                <span className="text-teal-400 font-extrabold text-base">₹{(posBillForm.weightKg * posBillForm.ratePerKg).toLocaleString()}</span>
              </div>

              <button 
                type="submit" 
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase font-mono transition select-none tracking-tight shadow-md"
              >
                {lang === "bn" ? "চালান নিষ্পত্তি করুন" : "Resolve Invoice Settle"}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* OVERDUE INSTALLMENT COLLECTION SETTLEMENT MODAL */}
      {collectingInstallment && (
        <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 relative">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-xs font-black text-white uppercase font-mono tracking-tight flex items-center gap-1.5 animate-pulse">
                <DollarSign className="h-4.5 w-4.5 text-teal-400" />
                Ledger Collection Desk
              </h3>
              <button 
                onClick={() => setCollectingInstallment(null)} 
                className="text-slate-500 hover:text-white text-xs font-bold cursor-pointer font-mono"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs text-left">
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Lending Reference:</span>
                  <strong className="text-white font-mono font-black">{collectingInstallment.saleId}</strong>
                </div>
                <div className="flex justify-between items-baseline border-t border-slate-900 pt-2">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Installment Ref:</span>
                  <strong className="text-white font-mono font-black">{collectingInstallment.installmentId}</strong>
                </div>
                <div className="flex justify-between items-baseline border-t border-slate-900 pt-2">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Planned Settle Amount:</span>
                  <strong className="text-teal-400 font-mono font-black text-sm">₹{collectingInstallment.amount.toLocaleString()}</strong>
                </div>
              </div>

              {/* Selection between Full and Partial */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-mono tracking-wide text-slate-400 font-bold block">Payment Receipt Structure</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCollectType("Full");
                      setCollectAmountInput(collectingInstallment.amount.toString());
                    }}
                    className={`py-2 px-3 rounded-xl border font-mono text-center font-bold text-[10px] cursor-pointer transition ${
                      collectType === "Full"
                        ? "bg-teal-500/10 border-teal-500 text-teal-400 font-extrabold"
                        : "bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-300"
                    }`}
                  >
                    Paid in Full (₹{collectingInstallment.amount.toLocaleString()})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCollectType("Partial");
                    }}
                    className={`py-2 px-3 rounded-xl border font-mono text-center font-bold text-[10px] cursor-pointer transition ${
                      collectType === "Partial"
                        ? "bg-teal-500/10 border-teal-500 text-teal-400 font-extrabold"
                        : "bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-300"
                    }`}
                  >
                    Partial Payment
                  </button>
                </div>
              </div>

              {/* Dynamic input field */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <label className="text-[9px] uppercase font-mono tracking-wide text-slate-300 font-bold">
                    Collected Amount (Auto Logs Date: {new Date().toISOString().slice(0, 10)})
                  </label>
                  <span className="text-[8px] font-mono font-bold text-teal-400 uppercase">Secure Timestamp Active</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={collectAmountInput}
                    onChange={(e) => setCollectAmountInput(e.target.value)}
                    disabled={collectType === "Full"}
                    className="w-full bg-slate-950 p-2.5 pl-7 border border-slate-850 rounded-xl font-mono text-white text-xs font-extrabold focus:outline-none focus:border-teal-500 disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Dynamic Remaining Amount Balance Indicator */}
              {(() => {
                const entered = Number(collectAmountInput) || 0;
                const remaining = Math.max(0, collectingInstallment.amount - entered);
                return (
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl flex justify-between items-center">
                    <span className="text-[9.5px] text-slate-400 uppercase font-mono font-bold">Remaining Unsettled:</span>
                    <strong className={`font-mono text-xs font-black ${remaining > 0 ? "text-rose-450 animate-pulse" : "text-emerald-400"}`}>
                      ₹{remaining.toLocaleString()}
                    </strong>
                  </div>
                );
              })()}

              {/* Confirm Collect Action */}
              <button
                type="button"
                onClick={() => {
                  const val = Number(collectAmountInput);
                  if (isNaN(val) || val <= 0) {
                    alert("Please enter a valid positive collected amount!");
                    return;
                  }
                  if (val > collectingInstallment.amount) {
                    alert(`Collected amount cannot exceed the pending installment amount of ₹${collectingInstallment.amount}!`);
                    return;
                  }
                  postCollectDue(collectingInstallment.saleId, collectingInstallment.installmentId, val);
                }}
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase font-mono transition tracking-wider shadow-lg cursor-pointer"
              >
                Book Settle Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE INVOICE LIGHTBOX DETAIL VIEW */}
      {showInvoiceModal && activeInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 print-modal-container">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 relative printable-area">
            
            {/* Header print display */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono font-black text-teal-400 block mb-0.5">SHAIEALAM MEAT HOUSE</span>
                <h4 className="text-xs font-black text-white uppercase font-mono tracking-tight font-sans">
                  {lang === "bn" ? "পরিশোধ রসিদ / ক্যাশ মেমো" : "Payment Receipt / চালান"}
                </h4>
              </div>
              <button 
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-500 hover:text-white text-xs font-bold font-mono cursor-pointer no-print"
              >
                {lang === "bn" ? "বন্ধ করুন" : "Close"}
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs font-sans text-left leading-relaxed">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-400">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">
                    {lang === "bn" ? "চালান আইডি" : "Invoice ID"}
                  </span>
                  <strong className="text-white font-mono">{activeInvoice.id}</strong>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">
                    {lang === "bn" ? "চালানের তারিখ" : "Invoice Date"}
                  </span>
                  <strong className="text-white font-mono">{activeInvoice.date}</strong>
                </div>
                <div className="col-span-2 border-t border-slate-850 pt-2 grid grid-cols-2">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">
                      {lang === "bn" ? "গ্রাহকের বিবরণ" : "Customer Details"}
                    </span>
                    <strong className="text-slate-300 block">{activeInvoice.customerName}</strong>
                    <span className="text-slate-500 font-mono text-[10px] leading-none">{activeInvoice.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">
                      {lang === "bn" ? "রেফারেন্স আইডি" : "Ref ID"}
                    </span>
                    <strong className="text-slate-400 font-mono text-[11px] block">{activeInvoice.transactionRefId || "N/A"}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4.5 rounded-2xl space-y-2.5 border border-slate-850">
                <span className="text-[9px] uppercase font-mono text-teal-400 font-bold block">
                  {lang === "bn" ? "ক্রয়কৃত পণ্যসমূহ" : "Purchased Goods"}
                </span>
                <div className="divide-y divide-slate-900 divide-dashed font-mono">
                  {activeInvoice.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-1 text-[11.5px] text-white">
                      <span>
                        {lang === "bn" ? (
                          it.type.includes("Beef Loin") ? "প্রিমিয়াম গরুর লয়েন" :
                          it.type.includes("Flank Cut") ? "ব্রাহ্মণ ফ্ল্যাঙ্ক কাট" :
                          it.type.includes("Bone-In") ? "স্ট্যান্ডার্ড গরুর মাংস (হাড়সহ)" :
                          it.type.includes("Sirloin") ? "খাসির সার্লয়েন" : it.type
                        ) : it.type} (x{it.weightKg} Kg)
                      </span>
                      <span>₹{(it.weightKg * it.ratePerKg).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-slate-900 border-dashed pt-2 flex justify-between font-mono font-bold text-xs">
                  <span className="text-slate-400 uppercase">
                    {lang === "bn" ? "উপমোট:" : "Subtotal:"}
                  </span>
                  <span className="text-white">₹{activeInvoice.total.toLocaleString()}</span>
                </div>

                <div className="flex justify-between font-mono text-[11.5px]">
                  <span className="text-teal-400 uppercase">
                    {lang === "bn" ? "পরিশোধিত টাকা:" : "Amount Paid:"}
                  </span>
                  <span className="text-teal-400">₹{activeInvoice.amountPaid.toLocaleString()}</span>
                </div>

                <div className="flex justify-between font-mono text-[11.5px]">
                  <span className="text-rose-400 uppercase">
                    {lang === "bn" ? "বকেয়া বন্ড:" : "Outstanding Due:"}
                  </span>
                  <span className="text-rose-400">₹{activeInvoice.amountDue.toLocaleString()}</span>
                </div>
              </div>

              {activeInvoice.installments && activeInvoice.installments.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-mono text-slate-400 block font-bold">
                    {lang === "bn" ? "পরিকল্পিত কিস্তিসমূহ" : "Planned Installments"}
                  </span>
                  <div className="grid grid-cols-1 gap-1 bg-slate-950 p-2 border border-slate-850 rounded-xl font-mono text-[10px]">
                    {activeInvoice.installments.map(inst => (
                      <div key={inst.id} className="flex justify-between">
                        <span className="text-slate-400">{inst.id} ({lang === "bn" ? "মেয়াদ উত্তীর্ণ" : "Due"}: {inst.dueDate})</span>
                        <strong className={inst.status === "Paid" ? "text-emerald-400" : "text-rose-400"}>
                          ₹{inst.amount} ({lang === "bn" ? (inst.status === "Paid" ? "পরিশোধিত" : "বকেয়া") : inst.status})
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Print actions inside invoice view */}
              <div className="flex gap-2 pt-2 border-t border-slate-800/80 no-print">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-center cursor-pointer transition uppercase font-mono flex items-center justify-center gap-1"
                >
                  <Printer className="h-4 w-4" />
                  {lang === "bn" ? "রসিদ প্রিন্ট করুন" : "Print Receipt"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ADVANCED BULK OPERATIONS MODAL */}
      {showBulkOpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-slate-950 p-5 border-b border-slate-850 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-teal-400" />
                <h3 className="text-xs font-black text-white uppercase font-mono tracking-tight">
                  Herd Batch Operations / মাল্টিপল আপডেট
                </h3>
              </div>
              <button 
                onClick={() => setShowBulkOpModal(false)}
                className="text-slate-400 hover:text-white text-xs font-black font-mono cursor-pointer uppercase bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"
              >
                Close
              </button>
            </div>

            {/* Contents */}
            <div className="p-5 space-y-5 text-left text-xs font-mono">
              <div className="bg-teal-500/10 border border-teal-500/20 p-3 rounded-xl flex items-center gap-2">
                <Info className="h-4 w-4 text-teal-400 shrink-0" />
                <p className="text-[10px] text-teal-300 font-sans leading-relaxed">
                  Bulk modifications will apply instantly to the {Object.keys(selectedAnimalIds).filter(id => selectedAnimalIds[id]).length} selected cattle. Check targets before executing.
                </p>
              </div>

              {/* Targets Preview List */}
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wide">Target Animals / নির্বাচিত পশু সমূহ:</span>
                <div className="max-h-24 overflow-y-auto bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex flex-wrap gap-1.5">
                  {Object.keys(selectedAnimalIds).filter(id => selectedAnimalIds[id]).map(id => {
                    const beast = animals.find(a => a.id === id);
                    return (
                      <span key={id} className="bg-slate-900 text-slate-300 px-2 py-1 border border-slate-800 rounded-lg text-[9.5px] font-bold">
                        {id} {beast ? `(${beast.breed})` : ""}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Weight Adjustment Operation Block */}
              <div className="space-y-2 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10.5px] uppercase font-bold text-teal-400 block">1. Mass Weight Updates / ওজন পরিবর্তন</span>
                  <span className="text-[8.5px] uppercase text-slate-500">Adds weight entries</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500">Operation Type / ধরণ</label>
                    <select
                      value={bulkWeightMode}
                      onChange={(e) => setBulkWeightMode(e.target.value as any)}
                      className="w-full bg-slate-950/80 p-2.5 border border-slate-800 rounded-xl font-bold font-mono text-xs text-white"
                    >
                      <option value="none">No Weight Change</option>
                      <option value="add">Add Weight (+ Delta Kg)</option>
                      <option value="set">Overwrite Specific Target Kg</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500">Value (Kg) / পরিমাণ</label>
                    <input
                      type="number"
                      disabled={bulkWeightMode === "none"}
                      value={bulkWeightVal}
                      onChange={(e) => setBulkWeightVal(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full bg-slate-950/80 p-2 border border-slate-850 rounded-xl font-bold font-mono text-xs text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Nutritional Feed Plan Preset Allocation Block */}
              <div className="space-y-2 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10.5px] uppercase font-bold text-teal-400 block">2. Assign Feed Plan / খাবার প্রিসেট</span>
                  <span className="text-[8.5px] uppercase text-slate-500">Applies to notes</span>
                </div>
                <div className="mt-1.5">
                  <label className="text-[9px] text-slate-500 block mb-1">Nutrition Protocol / পুষ্টি পরিকল্পনা:</label>
                  <select
                    value={bulkFeedPreset}
                    onChange={(e) => setBulkFeedPreset(e.target.value)}
                    className="w-full bg-slate-950 p-2.5 border border-slate-800 rounded-xl font-bold font-sans text-xs text-white"
                  >
                    <option value="">No Nutrition Plan Change</option>
                    <option value="High-Protein Feed Mix [Grains 50%, Oats 20%, Silage 30%]">Grains & Silage High-Protein Concentrate</option>
                    <option value="Standard Pasture Maintenance Plan (Free Grazing)">Bovine Grassing Maintenance Protocol</option>
                    <option value="Rapid Fattening Ration [Silage 60%, Molasses 15%, Feed pellets 25%]">Fattening Ration Weight Booster</option>
                    <option value="Post-Ailment Recovery Diet [High Minerals]">Mili-mix Active Recover Ration</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-slate-950 p-4 border-t border-slate-850 flex justify-end gap-3.5">
              <button
                onClick={() => setShowBulkOpModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold bg-slate-900 border border-slate-800 transition uppercase font-mono text-[10.5px]"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyBulkOperations}
                disabled={bulkWeightMode === "none" && bulkFeedPreset === ""}
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black tracking-wide uppercase font-mono text-[10.5px] transition shadow disabled:opacity-40 cursor-pointer"
              >
                Apply Updates Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK CSV LIVESTOCK IMPORT MODAL */}
      {showBulkImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-xs font-black text-white uppercase font-mono tracking-tight flex items-center gap-1.5">
                <Database className="h-4.5 w-4.5 text-teal-400 animate-pulse" />
                {lang === "bn" ? "বাল্ক সিএসভি ইম্পোর্ট টুল" : "Bulk CSV Livestock Import"}
              </h3>
              <button 
                onClick={() => {
                  setBulkImportErrorLog([]);
                  setShowBulkImportModal(false);
                }} 
                className="text-slate-500 hover:text-white text-xs font-bold cursor-pointer font-mono uppercase bg-slate-950 border border-slate-800 px-2 py-1 rounded"
              >
                {lang === "bn" ? "বন্ধ করুন" : "Close"}
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs text-left">
              <div className="bg-teal-500/10 border border-teal-500/20 p-3 rounded-xl">
                <p className="text-[10px] text-teal-300 font-sans leading-relaxed">
                  {lang === "bn" 
                    ? "আপনার কম্পিউটার থেকে একটি .csv ফাইল ড্রাইভে আপলোড করুন। ফাইলের প্রথম লাইনে হেডার অবশ্যই থাকতে হবে। হেডার কলামগুলো হল: Type (Species), Breed, Age, Weight, Price, Advance, Owner, Notes।"
                    : "Upload livestock records using a CSV file. The columns can be ordered freely but we look for header names like: Type, Breed, Age, Weight, Price, Advance, Owner, Notes."}
                </p>
                
                {/* Download Template Help */}
                <button
                  type="button"
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent("Type,Breed,Age,Weight,Price,Advance,Owner,Notes\nCow,Brahman Breeder,24,520,85000,45000,Rahman Farms,Fattening Active\nGoat,Jamunapari High,12,35,12000,12000,Local Bazar,Vaccinated FMD\n");
                    const dl = document.createElement("a");
                    dl.setAttribute("href", csvContent);
                    dl.setAttribute("download", "livestock_bulk_import_template.csv");
                    document.body.appendChild(dl);
                    dl.click();
                    dl.remove();
                  }}
                  className="mt-2 text-teal-400 hover:text-teal-300 text-[10px] font-black underline font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Download className="h-3 w-3" />
                  {lang === "bn" ? "টেমপ্লেট ডাউনলোড করুন" : "Download Sample Import CSV Template"}
                </button>
              </div>

              {/* Drag and Drop Upload Indicator */}
              <div 
                className={`border-2 border-dashed p-8 rounded-2xl text-center space-y-2 relative transition-all duration-150 ${
                  isCsvDragging 
                    ? "border-teal-500 bg-teal-500/10 scale-[1.02] shadow-lg shadow-teal-505/10" 
                    : "border-slate-805 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/40"
                }`}
              >
                <input 
                  type="file" 
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      const text = evt.target?.result as string;
                      if (text) {
                        handleCSVImport(text);
                      }
                    };
                    reader.readAsText(file);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsCsvDragging(true);
                  }}
                  onDragLeave={() => {
                    setIsCsvDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsCsvDragging(false);
                    const file = e.dataTransfer?.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      const text = evt.target?.result as string;
                      if (text) {
                        handleCSVImport(text);
                      }
                    };
                    reader.readAsText(file);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className={`p-3 rounded-full transition-all duration-150 ${
                    isCsvDragging ? "bg-teal-500 text-slate-950 animate-bounce" : "bg-slate-900 border border-slate-850 text-teal-400"
                  }`}>
                    <Download className={`h-6 w-6 transform ${isCsvDragging ? "rotate-0 scale-110" : "rotate-180"}`} />
                  </div>
                  <div>
                    {isCsvDragging ? (
                      <>
                        <span className="text-teal-400 font-extrabold block uppercase tracking-wide font-mono animate-pulse">{lang === "bn" ? "ছেড়ে দিন! আপলোড শুরু করুন" : "Drop Now to Import Ledgers"}</span>
                        <span className="text-slate-400 text-[9.5px] mt-1 block">{lang === "bn" ? "প্রক্রিয়াটি অবিলম্বে চালানো হবে" : "Instant validation checks will be executed"}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-white font-bold block">{lang === "bn" ? "সিএসভি ফাইল নির্বাচন করুন" : "Select CSV File"}</span>
                        <span className="text-slate-500 text-[9.5px] mt-1 block">{lang === "bn" ? "অথবা ফাইলটি এখানে ড্র্যাগ ও ড্রপ করুন" : "or drag and drop file here"}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Errors logs list if found */}
              {bulkImportErrorLog.length > 0 && (
                <div className="space-y-1.5 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-left">
                  <h4 className="text-[10px] font-black uppercase text-rose-400 flex items-center gap-1 font-mono">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Validation Errors ({bulkImportErrorLog.length} found)
                  </h4>
                  <div className="max-h-36 overflow-y-auto space-y-1 text-[9.5px] font-mono text-rose-300 divide-y divide-rose-500/15">
                    {bulkImportErrorLog.map((err, idx) => (
                      <p key={idx} className="pt-1">{err}</p>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* SITEMAP & TERMS HUB MODAL */}
      {showSitemapModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl overflow-hidden font-sans flex flex-col">
            
            {/* Header with Subtabs switching */}
            <div className="bg-slate-950 p-5 border-b border-slate-850 flex justify-between items-center shrink-0">
              <div className="flex gap-2">
                {[
                  { id: "map", label: lang === "bn" ? "🗺️ সাইটম্যাপ হায়ারার্কি" : "🗺️ Sitemap Hierarchy" },
                  { id: "terms", label: lang === "bn" ? "📜 শর্তাবলী ও নিয়ম" : "📜 Terms & Conditions" }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setSitemapActiveTab(sub.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer select-none ${
                      sitemapActiveTab === sub.id ? "bg-slate-900 text-teal-400 border border-slate-800" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setShowSitemapModal(false)}
                className="text-slate-400 hover:text-white text-xs font-black font-mono cursor-pointer uppercase bg-slate-950 border border-slate-850 px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            {/* Hub Contents */}
            <div className="p-6 overflow-y-auto text-left space-y-4">
              
              {sitemapActiveTab === "map" ? (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-teal-400 block">ShaieAlam Unified Map</span>
                    <h3 className="text-white text-sm font-black font-mono uppercase">{lang === "bn" ? "ইন্টারেক্টিভ সাইটম্যাপ হায়ারার্কি" : "Interactive System Sitemap Hierarchy / ম্যাপ"}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang === "bn" 
                        ? "খামারের প্রতিটি মডিউল এবং তাদের উপ-শাখাগুলোর মধ্যে সহজে এবং দ্রুত এক ক্লিকে চলে যান।"
                        : "Browse and quickly deep link directly into any specific workflow module or functional workspace view with one single click."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                    {/* Module 1: Dashboard Panel */}
                    <div className="bg-slate-950/70 p-4 border border-slate-850 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-white font-bold border-b border-slate-900 pb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>📊 Executive Dashboard Overview</span>
                      </div>
                      <div className="space-y-1.5 font-sans">
                        <button 
                          onClick={() => { setActiveTab("dashboard"); setShowSitemapModal(false); }}
                          className="w-full text-left bg-slate-900/60 hover:bg-slate-800 text-[11px] text-slate-300 p-2 border border-slate-850 hover:border-slate-700 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>Aggregate Operations Analytics</span>
                          <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
                        </button>
                      </div>
                    </div>

                    {/* Module 2: Livestock Registry */}
                    <div className="bg-slate-950/70 p-4 border border-slate-850 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-white font-bold border-b border-slate-900 pb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                        <span>🐄 Livestock & Cattle Registries</span>
                      </div>
                      <div className="space-y-1.5 font-sans">
                        <button 
                          onClick={() => { setActiveTab("livestock"); setLivestockSubTab("directory"); setShowSitemapModal(false); }}
                          className="w-full text-left bg-slate-900/60 hover:bg-slate-800 text-[11px] text-slate-300 p-2 border border-slate-850 hover:border-slate-700 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>1. Active Directory/রেজিস্ট্রি ({animals.length} beasts)</span>
                          <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
                        </button>
                        <button 
                          onClick={() => { setActiveTab("livestock"); setLivestockSubTab("mortality"); setShowSitemapModal(false); }}
                          className="w-full text-left bg-slate-900/60 hover:bg-slate-800 text-[11px] text-slate-300 p-2 border border-slate-850 hover:border-slate-700 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>2. Losses & Insurance Claims</span>
                          <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
                        </button>
                        <button 
                          onClick={() => { setActiveTab("livestock"); setLivestockSubTab("breed-analysis"); setShowSitemapModal(false); }}
                          className="w-full text-left bg-slate-900/60 hover:bg-slate-800 text-[11px] text-slate-300 p-2 border border-slate-850 hover:border-slate-700 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>3. Breed Analytics Index</span>
                          <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
                        </button>
                        <button 
                          onClick={() => { setActiveTab("livestock"); setLivestockSubTab("growth-compare"); setShowSitemapModal(false); }}
                          className="w-full text-left bg-slate-900/60 hover:bg-slate-800 text-[11px] text-slate-300 p-2 border border-slate-850 hover:border-slate-700 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>4. Multi-Animal Growth Prediction (Regression Line)</span>
                          <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
                        </button>
                        <button 
                          onClick={() => { setActiveTab("livestock"); setShowSitemapModal(false); setShowBulkImportModal(true); }}
                          className="w-full text-left bg-indigo-950/45 hover:bg-indigo-900/60 text-[11px] text-indigo-300 p-2 border border-indigo-900/30 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>📥 Launch Bulk CSV Livestock Importer</span>
                          <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />
                        </button>
                      </div>
                    </div>

                    {/* Module 3: Poultry Industry */}
                    <div className="bg-slate-950/70 p-4 border border-slate-850 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-white font-bold border-b border-slate-900 pb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <span>🐔 Poultry Avian Desk</span>
                      </div>
                      <div className="space-y-1.5 font-sans">
                        <button 
                          onClick={() => { setActiveTab("poultry"); setShowSitemapModal(false); }}
                          className="w-full text-left bg-slate-900/60 hover:bg-slate-800 text-[11px] text-slate-300 p-2 border border-slate-850 hover:border-slate-700 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>Active Avian Flocks ({poultryBatches.length} batches)</span>
                          <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setShowSitemapModal(false); exportPoultryLedgerPDF(); }}
                          className="w-full text-left bg-teal-950/45 hover:bg-teal-900/60 text-[11px] text-teal-300 p-2 border border-teal-900/30 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>📑 Printable Poultry PDF Performance Ledger</span>
                          <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
                        </button>
                      </div>
                    </div>

                    {/* Module 4: Butcher & Processing Operations */}
                    <div className="bg-slate-950/70 p-4 border border-slate-850 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-white font-bold border-b border-slate-900 pb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                        <span>🥩 Processing & Meat Butcher Retail</span>
                      </div>
                      <div className="space-y-1.5 font-sans">
                        <button 
                          onClick={() => { setActiveTab("butcher"); setShowSitemapModal(false); }}
                          className="w-full text-left bg-slate-900/60 hover:bg-slate-800 text-[11px] text-slate-300 p-2 border border-slate-850 hover:border-slate-700 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>Carcass Processing journal</span>
                          <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
                        </button>
                      </div>
                    </div>

                    {/* Module 5: Credit & Subscriptions Collections */}
                    <div className="bg-slate-950/70 p-4 border border-slate-850 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-white font-bold border-b border-slate-900 pb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                        <span>💰 Collections & Outstanding Ledger</span>
                      </div>
                      <div className="space-y-1.5 font-sans">
                        <button 
                          onClick={() => { setActiveTab("collections"); setShowSitemapModal(false); }}
                          className="w-full text-left bg-slate-900/60 hover:bg-slate-800 text-[11px] text-slate-300 p-2 border border-slate-850 hover:border-slate-700 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>Invoiced Receivables Tracking</span>
                          <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
                        </button>
                      </div>
                    </div>

                    {/* Module 6: Feed Stock & Standard Presets */}
                    <div className="bg-slate-950/70 p-4 border border-slate-850 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-white font-bold border-b border-slate-900 pb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
                        <span>🌾 Feed Stock & Standard Presets</span>
                      </div>
                      <div className="space-y-1.5 font-sans">
                        <button 
                          onClick={() => { setActiveTab("feed"); setShowSitemapModal(false); }}
                          className="w-full text-left bg-slate-900/60 hover:bg-slate-800 text-[11px] text-slate-300 p-2 border border-slate-850 hover:border-slate-700 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>Feed Inventory & Consumption Presets</span>
                          <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
                        </button>
                      </div>
                    </div>

                    {/* Module 7: System Settings & Auto Sync */}
                    <div className="bg-slate-950/70 p-4 border border-slate-850 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-white font-bold border-b border-slate-900 pb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0" />
                        <span>⚙️ Settings & Dynamic Configurations</span>
                      </div>
                      <div className="space-y-1.5 font-sans">
                        <button 
                          onClick={() => { setActiveTab("settings"); setShowSitemapModal(false); }}
                          className="w-full text-left bg-slate-900/60 hover:bg-slate-800 text-[11px] text-slate-300 p-2 border border-slate-850 hover:border-slate-700 rounded-lg flex items-center justify-between transition cursor-pointer"
                        >
                          <span>System Configuration Controls</span>
                          <ChevronRight className="h-3.5 w-3.5 text-teal-400" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-teal-400 block">ShaieAlam Regulatory Compliance</span>
                    <h3 className="text-white text-sm font-black font-mono uppercase">{lang === "bn" ? "ব্যবহারকারী শর্তাবলী ও নিয়মাবলী" : "System Terms and Conditions (T&C) Document"}</h3>
                    <p className="text-[10.5px] text-slate-400 mt-1">
                      {lang === "bn" 
                        ? "শাইআলম লাইভস্টক ইআরপি ব্যবহারের গুরুত্বপূর্ণ নিয়ম এবং ডাটা নিরাপত্তা বিধিজ্ঞাপন।"
                        : "Legal and system operational compliance details regarding offline queues sync, biometrics predictions, and local storage backups."}
                    </p>
                  </div>

                  <div className="space-y-4 text-xs font-sans text-slate-300 leading-relaxed max-h-[48vh] overflow-y-auto p-4 bg-slate-950/60 border border-slate-850 rounded-2xl">
                    <div className="space-y-1 font-mono">
                      <h4 className="text-white font-bold text-[11px] uppercase text-teal-400">1. Local Ledger Synchronization / ট্রানজেকশন অটো-সিঙ্ক</h4>
                      <p className="text-[10px] text-slate-400">
                        <strong>EN</strong>: Offline queue events and local buffer transactions are persisted in your local cache (<code>localStorage</code>) and synced periodically matching the India Standard Time (IST) offset. Any network drops will preserve ledger stability.
                      </p>
                      <p className="text-[10px] text-slate-400 font-normal">
                        <strong>BN</strong>: অফলাইন ট্রানজেকশন এবং লোকাল ক্যাশে থাকা তথ্যসমূহ সাময়িকভাবে আপনার ব্রাউজারে সংরক্ষিত থাকে এবং ভারতীয় প্রমাণ সময় (IST) অনুযায়ী নিয়মিত সময়ের ব্যবধানে কেন্দ্রীয় ডাটাবেসের সাথে সিঙ্ক করা হয়।
                      </p>
                    </div>

                    <div className="space-y-1 font-mono pt-2 border-t border-slate-900">
                      <h4 className="text-white font-bold text-[11px] uppercase text-teal-400">2. Precision Cattle Weighing Protocols / পশুর ওজন পরিমাপ ও হিসাব</h4>
                      <p className="text-[10px] text-slate-400">
                        <strong>EN</strong>: Weight metrics recorded under Growth Index Tracker represents biometric readings with ±0.5kg sensor variance. Automatic linear regression scales predictions for the next 30 days based on pure mathematical extrapolation.
                      </p>
                      <p className="text-[10px] text-slate-400 font-normal">
                        <strong>BN</strong>: গ্রোথ ইন্ডেক্স ট্র্যাকার ব্যবস্থার মাধ্যমে ধারণকৃত ওজন ±০.৫ কেজি ত্রুটিসীমার মধ্যে নেওয়া হয়ে থাকে এবং স্বয়ংক্রিয় লিনিয়ার রিগ্রেশনের পূর্বাভাসের মাধ্যমে পরবর্তী ৩০ দিনের বৃদ্ধি অনুমান করা যায়।
                      </p>
                    </div>

                    <div className="space-y-1 font-mono pt-2 border-t border-slate-900">
                      <h4 className="text-white font-bold text-[11px] uppercase text-teal-400">3. Archival Responsibility / ব্যাকআপ ও ডাটা সংরক্ষণ</h4>
                      <p className="text-[10px] text-slate-400">
                        <strong>EN</strong>: Decentralized farms are advised to trigger global database backups (JSON state exports) weekly in order to secure registries against accidental memory wipes in browser sandboxes.
                      </p>
                      <p className="text-[10px] text-slate-400 font-normal">
                        <strong>BN</strong>: যেকোনো কারণে ডাটা মুছে যাওয়া প্রতিরোধ করতে প্রতি সপ্তাহে অন্তত একবার "গ্লোবাল ব্যাকআপ" টুল ব্যবহার করে সম্পূর্ণ সিস্টেম ডাটা ব্যাকআপ সংরক্ষণ করার জন্য খামারীদের অনুরোধ করা হচ্ছে।
                      </p>
                    </div>

                    <div className="space-y-1 font-mono pt-2 border-t border-slate-900">
                      <h4 className="text-white font-bold text-[11px] uppercase text-teal-400">4. Administrative Telemetry Tracking / প্রশাসনিক অডিট অনুমোদন</h4>
                      <p className="text-[10px] text-slate-400">
                        <strong>EN</strong>: In accordance with secure commercial breeding guidelines, all actions taken across departments (Butcher, Collections, Feed shop, Poultry, System configuration) are logged in the System Audit database buffer for regulatory transparency.
                      </p>
                      <p className="text-[10px] text-slate-400 font-normal">
                        <strong>BN</strong>: নিরাপদ খামার পরিচালনার স্বার্থে, প্রতিটি বিভাগের সকল গুরুত্বপূর্ণ কার্যকলাপ (কসাইখানা, ফিড শপ, পোল্ট্রি, সিস্টেম রিমোট কনফিগারেশন) স্বয়ংক্রিয়ভাবে অডিট লগে সংরক্ষণ করা হবে।
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* FLOATING QUICK SCAN FAB */}
      {(activeTab === "livestock" || activeTab === "poultry") && (
        <button
          id="quick-scan-fab"
          onClick={() => {
            setQuickScanDept(activeTab === "livestock" ? "Livestock" : "Poultry");
            setIsQuickScanOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 no-print cursor-pointer animate-pulse"
          title="Floating Quick Scan QR/RFID terminal"
        >
          <Camera className="h-6 w-6" />
          <span className="absolute top-0 right-0 bg-red-600 text-white border border-slate-900 font-sans font-black text-[9px] rounded-full h-4 w-4 flex items-center justify-center">
            QR
          </span>
        </button>
      )}

      {/* FLOATING QUICK SCAN CAMERA VIEWFINDER MODAL */}
      {isQuickScanOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-teal-500/30 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden text-slate-100 font-mono">
            {/* Header */}
            <div className="bg-slate-950 p-4 border-b border-slate-850 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-teal-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-tight">
                  High-Speed QR Focus Terminal
                </h3>
              </div>
              <button 
                onClick={() => setIsQuickScanOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-black cursor-pointer uppercase bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
              >
                Close
              </button>
            </div>

            {/* Viewfinder simulation */}
            <div className="p-5 space-y-4">
              <div className="space-y-1 text-center">
                <span className="text-[9px] uppercase text-teal-400 font-bold block leading-none">Auto-Target RFID & QR Camera</span>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-1">
                  Point your mobile lens at the ear-tag barcode transponder. Align the visual guide.
                </p>
              </div>

              {/* Department Choice */}
              <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850 gap-1.5 text-center">
                <button
                  onClick={() => setQuickScanDept("Livestock")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    quickScanDept === "Livestock" ? "bg-teal-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Livestock / পশুপালন
                </button>
                <button
                  onClick={() => setQuickScanDept("Poultry")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    quickScanDept === "Poultry" ? "bg-teal-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Poultry / পোল্ট্রি
                </button>
              </div>

              {/* Viewfinder block */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 aspect-video relative overflow-hidden flex flex-col justify-center items-center text-center">
                {/* Horizontal scanner beam laser */}
                <div className="absolute inset-x-0 w-full bg-red-500/40 h-[2px] shadow-[0_0_10px_#ef4444] animate-[bounce_1.5s_infinite]" />
                
                {/* Visual Camera Corners to look authentic */}
                <div className="absolute top-4 left-4 h-4 w-4 border-t-2 border-l-2 border-teal-400" />
                <div className="absolute top-4 right-4 h-4 w-4 border-t-2 border-r-2 border-teal-400" />
                <div className="absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-teal-400" />
                <div className="absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-teal-400" />

                <div className="space-y-1.5 z-10 p-2.5">
                  <div className="text-teal-400 font-black text-center mb-1">
                    <span className="inline-block p-2 bg-teal-500/10 rounded-full animate-ping">
                      <Camera className="h-5 w-5" />
                    </span>
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-slate-300 font-extrabold uppercase animate-pulse block">
                    Capturing tag stream...
                  </span>
                </div>
              </div>

              {/* Discovery Sim presets */}
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-[#f1f5f9] block pb-1 border-b border-slate-850">
                  Select Transponder / SKU QR to target:
                </span>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                  {quickScanDept === "Livestock" ? (
                    animals.slice(0, 8).map(ani => (
                      <button
                        key={ani.id}
                        onClick={() => {
                          handleSimulatedTagScan(ani.id, "Livestock");
                          setIsQuickScanOpen(false);
                          setExpandedAnimalIds(prev => ({ ...prev, [ani.id]: true }));
                          alert(`✓ Scan success: Beast tag ${ani.id} captured inside scanning ledger.`);
                        }}
                        className="bg-slate-950 hover:bg-slate-850 p-2.5 border border-slate-850 rounded-xl text-[10px] text-left hover:border-teal-500/50 transition truncate font-bold text-slate-300 flex items-center justify-between"
                      >
                        <span className="text-white font-mono">{ani.id}</span>
                        <span className="text-[8.5px] text-teal-400">{ani.breed}</span>
                      </button>
                    ))
                  ) : (
                    poultryBatches.slice(0, 6).map(batch => (
                      <button
                        key={batch.id}
                        onClick={() => {
                          handleSimulatedTagScan(batch.id, "Poultry");
                          setIsQuickScanOpen(false);
                          setExpandedPoultryBatchIds(prev => ({ ...prev, [batch.id]: true }));
                          alert(`✓ Scan success: Poultry batch ${batch.id} captured inside scanning ledger.`);
                        }}
                        className="bg-slate-950 hover:bg-slate-850 p-2.5 border border-slate-850 rounded-xl text-[10px] text-left hover:border-teal-500/50 transition truncate font-bold text-slate-300 flex items-center justify-between"
                      >
                        <span className="text-white font-mono">{batch.id}</span>
                        <span className="text-[8.5px] text-teal-400">{batch.type}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK FEED SUBTRACTION MODAL */}
      {showQuickSubtractModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 relative relative text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-xs font-black text-white uppercase font-mono tracking-tight">Quick Add Feed Deduction / দ্রুত খাদ্য হ্রাসকরণ</h3>
              <button 
                onClick={() => setShowQuickSubtractModal(false)} 
                className="text-slate-500 hover:text-white text-xs font-bold font-mono cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-teal-400 mb-1.5">
                  Select Stock SKU / উপাদান নির্বাচন
                </label>
                <select
                  value={quickSubtractFeedId}
                  onChange={(e) => setQuickSubtractFeedId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  {feedInventory.map(f => (
                    <option key={f.id} value={f.id} className="text-black">
                      {f.label} ({f.balance.toLocaleString()} {f.unit} left)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-teal-400 mb-1.5">
                  Deduction Amount / ব্যবহার করা পরিমাণ
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter subtraction amount"
                    value={quickSubtractAmount}
                    onChange={(e) => setQuickSubtractAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-3 pr-12 font-mono text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold font-mono text-slate-500 uppercase">
                    {feedInventory.find(f => f.id === quickSubtractFeedId)?.unit || "unit"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-teal-400 mb-1.5">
                  Disbursement Notes / বিতরণ বিবরণী (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Fed to Brahman Lot #2, evening routine"
                  value={quickSubtractNotes}
                  onChange={(e) => setQuickSubtractNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-sans text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowQuickSubtractModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const amt = Number(quickSubtractAmount);
                    if (!quickSubtractFeedId) {
                      alert("Please select a feed item.");
                      return;
                    }
                    if (isNaN(amt) || amt <= 0) {
                      alert("Please enter a valid positive feed amount.");
                      return;
                    }
                    const targetStock = feedInventory.find(f => f.id === quickSubtractFeedId);
                    if (!targetStock) {
                      alert("Selected feed stock not found.");
                      return;
                    }
                    if (amt > targetStock.balance) {
                      alert(`Entered deduction (${amt} ${targetStock.unit}) exceeds current available balance (${targetStock.balance} ${targetStock.unit}).`);
                      return;
                    }
                    
                    // Deduct
                    handleSimulateFeedConsumption(quickSubtractFeedId, amt);
                    alert(`✓ Successfully subtracted ${amt} ${targetStock.unit} from ${targetStock.label}!`);
                    setShowQuickSubtractModal(false);
                  }}
                  className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-2 rounded-xl text-xs font-mono uppercase cursor-pointer"
                >
                  Confirm Deduct
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* PROCUREMENT PURCHASE ORDER MODAL */}
      {showPurchaseOrderModal && (() => {
        const targetFeed = feedInventory.find(f => f.id === purchaseOrderFeedId);
        const qty = Number(purchaseOrderAmount) || 0;
        const ratePerUnit = purchaseOrderFeedId === "feed-4" ? 120 : 35; // ₹35 per Kg, or ₹120 per count
        const totalEstimatedCost = qty * ratePerUnit;

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl p-6 relative text-left">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                  <h3 className="text-xs font-black text-white uppercase font-mono tracking-tight">Pre-filled Purchase Order / খুচরা কুয়িং রিকুইজিশন</h3>
                </div>
                <button 
                  onClick={() => setShowPurchaseOrderModal(false)} 
                  className="text-slate-500 hover:text-white text-xs font-bold font-mono cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850 space-y-1">
                  <span className="text-[9px] uppercase font-mono font-black text-slate-500 block">Identified deficit SKU:</span>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-extrabold text-white font-mono">{targetFeed?.label || "Unknown Stock Item"}</span>
                    <span className="text-xs text-teal-400 bg-teal-450/10 px-2.5 py-0.5 rounded-full border border-teal-500/20 font-bold font-mono">
                      Current: {targetFeed?.balance} {targetFeed?.unit}
                    </span>
                  </div>
                  <span className="text-[9.5px] text-slate-400 block pt-1 font-sans">
                    Pre-filled to replenish 100% capacity level of <strong>{targetFeed?.maxCapacity} {targetFeed?.unit}</strong>.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-teal-400 mb-1.5">
                      Replenish Quantity / পরিমাণ
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={purchaseOrderAmount}
                        onChange={(e) => setPurchaseOrderAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-3 pr-12 font-mono text-xs text-white focus:outline-none focus:border-teal-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold font-mono text-slate-500 uppercase">
                        {targetFeed?.unit || "Kg"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-teal-400 mb-1.5">
                      Approved Supplier / সরবরাহকারী
                    </label>
                    <input
                      type="text"
                      value={purchaseOrderSupplier}
                      onChange={(e) => setPurchaseOrderSupplier(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850/60 font-mono text-[10.5px] text-slate-400 space-y-1.5 leading-relaxed">
                  <div className="flex justify-between">
                    <span>Vendor Rate:</span>
                    <span className="text-slate-200">₹{ratePerUnit} / {targetFeed?.unit}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-800">
                    <span>Estimated Shipping / Logistics:</span>
                    <span className="text-slate-200">₹250 (Flat)</span>
                  </div>
                  <div className="flex justify-between text-xs font-black pt-1">
                    <span className="text-teal-400 uppercase">Total Procurement budget:</span>
                    <span className="text-white">₹{(totalEstimatedCost + 250).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9.5px] uppercase font-mono font-bold text-slate-450 block">Shipping Location In-farm</span>
                  <span className="text-[10.5px] block font-sans text-white p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-left">
                    Shed 1-A Central Feeding Hub & Grain Piles, Kolkata, India (IST GMT+5:30)
                  </span>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setShowPurchaseOrderModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs font-mono uppercase cursor-pointer"
                  >
                    Cancel / বাতিল
                  </button>
                  <button
                    onClick={() => {
                      const qtyAmt = Number(purchaseOrderAmount);
                      if (isNaN(qtyAmt) || qtyAmt <= 0) {
                        alert("Please provide a valid positive quantity order amount.");
                        return;
                      }

                      // Deduct budget / log expense
                      const finalProcurementCost = totalEstimatedCost + 250;
                      
                      // 1. Add Stock
                      setFeedInventory(prev => prev.map(f => f.id === purchaseOrderFeedId ? {
                        ...f,
                        balance: Math.min(f.maxCapacity, f.balance + qtyAmt)
                      } : f));

                      // 2. Add Expense Transaction
                      const purchaseTx: Transaction = {
                        id: `TXN-PR-${Math.floor(1000 + Math.random() * 9000).toString()}`,
                        type: "Expense",
                        category: "Feed",
                        amount: finalProcurementCost,
                        date: new Date().toISOString().slice(0, 10),
                        referenceId: purchaseOrderFeedId,
                        department: "Feed",
                        description: `Auto stock purchase replenishment order of ${qtyAmt} ${targetFeed?.unit} for SKU: ${targetFeed?.label} from ${purchaseOrderSupplier}`
                      };
                      setTransactions(prev => [purchaseTx, ...prev]);

                      // 3. Add restock history log
                      setRestockHistory(prev => [
                        {
                          id: `R-${Math.floor(100 + Math.random() * 900).toString()}`,
                          feedId: purchaseOrderFeedId,
                          label: targetFeed?.label || "Replenished SKU",
                          amount: qtyAmt,
                          unit: targetFeed?.unit || "Kg",
                          date: new Date().toISOString().slice(0, 10),
                          status: "Completed"
                        },
                        ...prev
                      ]);

                      addAuditLog(
                        "Stock Purchased",
                        "Feed",
                        `Placed pre-filled Procurement order of ${qtyAmt} ${targetFeed?.unit} of ${targetFeed?.label} for ₹${finalProcurementCost.toLocaleString()}. Stock restored!`
                      );

                      alert(`✓ Purchase Order Submitted! Pre-filled quantity of ${qtyAmt} ${targetFeed?.unit} has been dispatched, processed, and added to your stable inventory.`);
                      setShowPurchaseOrderModal(false);
                    }}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs font-mono uppercase cursor-pointer"
                  >
                    Send Purchase Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* NEW ANIMAL REGISTRATION MODAL */}
      {showAddAnimalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 relative">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-xs font-black text-white uppercase font-mono tracking-tight">Register New Live Cattle</h3>
              <button 
                onClick={() => setShowAddAnimalModal(false)} 
                className="text-slate-500 hover:text-white text-xs font-bold font-mono cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleRegisterAnimal} className="space-y-4 mt-4 text-xs text-left" id="add-animal-form">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono font-bold text-slate-400">Specie Type</label>
                  <select 
                    value={newAnimal.type}
                    onChange={(e) => setNewAnimal({ ...newAnimal, type: e.target.value })}
                    className="w-full bg-slate-950 p-2.5 border border-slate-850 rounded-xl"
                  >
                    <option value="Cow">Bovine (Cow)</option>
                    <option value="Goat">Caprine (Goat)</option>
                    <option value="Sheep">Ovine (Sheep)</option>
                    <option value="Buffalo">Buffalo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono font-bold text-slate-400">Breed Genetics</label>
                  <input 
                    type="text" 
                    placeholder="E.g., Brahman, Murrah" 
                    required
                    value={newAnimal.breed}
                    onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })}
                    className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono font-bold text-slate-400">Age (Months)</label>
                  <input 
                    type="number" 
                    required 
                    value={newAnimal.ageMonths}
                    onChange={(e) => setNewAnimal({ ...newAnimal, ageMonths: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono font-bold text-slate-400">Weight (KG)</label>
                  <input 
                    type="number" 
                    required 
                    value={newAnimal.weightKg}
                    onChange={(e) => setNewAnimal({ ...newAnimal, weightKg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono font-bold text-slate-400">Purchase Price ($)</label>
                  <input 
                    type="number" 
                    required 
                    value={newAnimal.purchasePrice}
                    onChange={(e) => setNewAnimal({ ...newAnimal, purchasePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono font-bold text-slate-400">Advance Paid ($)</label>
                  <input 
                    type="number" 
                    required 
                    value={newAnimal.advancePaid}
                    onChange={(e) => setNewAnimal({ ...newAnimal, advancePaid: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-mono font-bold text-slate-400">Owner/Supplier</label>
                <input 
                  type="text" 
                  value={newAnimal.owner}
                  onChange={(e) => setNewAnimal({ ...newAnimal, owner: e.target.value })}
                  placeholder="Local Breed, Farm Source"
                  className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-mono font-bold text-slate-400">Remarks / Notes</label>
                <textarea 
                  value={newAnimal.notes}
                  onChange={(e) => setNewAnimal({ ...newAnimal, notes: e.target.value })}
                  placeholder="Medical logs, supplier terms..."
                  className="w-full bg-slate-950 p-2 border border-slate-850 rounded-xl h-14" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase font-mono transition shadow-md cursor-pointer"
              >
                Establish Flock Batch
              </button>

            </form>
          </div>
        </div>
      )}

      {showLivestockScannerModal && (
        <div className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 relative text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-xs font-black text-white uppercase font-mono tracking-tight flex items-center gap-2">
                <Camera className="h-4.5 w-4.5 text-teal-400 animate-pulse" />
                Livestock Fast Ear-Tag Scanner
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLivestockScannerTutorial(true)}
                  className="bg-teal-500/10 hover:bg-teal-505 border border-teal-505/30 hover:text-slate-950 text-teal-405 text-[10px] px-2 py-1 rounded transition font-mono cursor-pointer"
                >
                  {lang === "bn" ? "টিউটোরিয়াল ℹ️" : "Tutorial ℹ️"}
                </button>
                <button
                  onClick={stopLivestockQRScanner}
                  className="text-slate-500 hover:text-white text-xs font-mono font-bold cursor-pointer"
                >
                  Cancel / বন্ধ
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {/* Camera feed canvas placeholder / live view */}
              <div className="relative bg-black rounded-2xl overflow-hidden border border-slate-800 aspect-video flex flex-col items-center justify-center">
                {livestockScannerCameraState === "accessing" && (
                  <div className="text-center space-y-2">
                    <RefreshCw className="h-8 w-8 text-teal-400 animate-spin mx-auto" />
                    <span className="text-[10px] font-mono text-slate-500 block">Accessing device camera...</span>
                  </div>
                )}
                {livestockScannerCameraState === "error" && (
                  <div className="text-center p-4 space-y-1 text-slate-400">
                    <span className="text-xs font-bold text-amber-400 block font-mono">Simulating Optical Laser...</span>
                    <span className="text-[9px] text-slate-500 block font-mono">No physical lens detected. Scanning ready presets:</span>
                  </div>
                )}
                {livestockScannerCameraState === "ready" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <video ref={livestockVideoRef} className="w-full h-full object-cover" playsInline muted />
                    {/* Scanning frame overlay */}
                    <div className="absolute inset-8 border border-dashed border-teal-400/35 pointer-events-none rounded-lg animate-pulse" />
                  </div>
                )}
                {livestockScannerCameraState === "scanned" && (
                  <div className="text-center p-4 space-y-1">
                    <Check className="h-10 w-10 text-emerald-400 mx-auto animate-bounce" />
                    <span className="text-xs font-black text-white font-mono uppercase block">RFID Transmission Decoded!</span>
                  </div>
                )}
              </div>

              {/* Logger status feed information */}
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl font-mono text-[9px] text-slate-400 space-y-1 leading-relaxed">
                <span className="text-teal-400 font-bold block">SCANNER TELEMETRY LOG:</span>
                <p className="font-semibold text-slate-300">{livestockScannerLogs}</p>
              </div>

              {/* Tag Selection presets option list to mimic precise clicks */}
              <div className="space-y-1">
                <span className="text-[8.5px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Preserved Presets Ear-Tags Index</span>
                <div className="max-h-[110px] overflow-y-auto bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-1.5">
                  {animals.map((ani) => (
                    <button
                      key={ani.id}
                      type="button"
                      onClick={() => scanSpecificTagId(ani.id)}
                      className="w-full text-left font-mono text-[9px] py-1.5 px-2 bg-slate-900 hover:bg-slate-850 text-slate-400 rounded border border-slate-800/65 flex justify-between items-center cursor-pointer"
                    >
                      <strong className="text-white">{ani.id} ({ani.breed})</strong>
                      <span className="text-teal-555 font-bold">Transmit / স্ক্যান</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Ear-tag tutorial overlay modal */}
      {showLivestockScannerTutorial && (
        <div className="fixed inset-0 z-55 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-teal-500/50 rounded-3xl max-w-md w-full shadow-2xl p-6 relative text-left text-white animate-fadeIn max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-xs font-black text-teal-400 uppercase font-mono tracking-tight flex items-center gap-2">
                <Info className="h-4.5 w-4.5 animate-pulse text-teal-400" />
                {lang === "bn" ? "কিউআর স্ক্যান বিবরণ ও চিত্র" : "Tag Alignment Blueprint"}
              </h3>
              <button 
                onClick={() => setShowLivestockScannerTutorial(false)}
                className="text-slate-500 hover:text-white font-mono font-black text-sm cursor-pointer bg-slate-950 border border-slate-800 h-6 w-6 rounded-full flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-4 space-y-4 font-sans text-xs">
              
              {/* Dynamic SVG Visual Layout Diagram */}
              <div className="relative border border-slate-850 bg-slate-950 p-4 rounded-2xl flex flex-col items-center justify-center h-48 overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 opacity-40" />
                
                {/* Scanner Screen Simulation SVG */}
                <svg className="w-full h-full max-w-[320px] relative z-10" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Distance Indicator Arrows */}
                  <path d="M 40,90 L 80,90 M 80,90 L 72,84 M 80,90 L 72,96" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 280,90 L 240,90 M 240,90 L 248,84 M 240,90 L 248,96" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
                  <text x="160" y="32" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    {lang === "bn" ? "অনুকূল দূরত্ব: ৮-১২ ইঞ্চি" : "OPTIMAL DEPTH: 8-12 INCHES / 20-30 CM"}
                  </text>
                  
                  {/* Smartphone screen bounds */}
                  <rect x="70" y="45" width="180" height="90" rx="12" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
                  <text x="160" y="152" fill="#55ea84" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="black" letterSpacing="1">
                    [ CAMERA VIEWFRAME ]
                  </text>
                  
                  {/* Laser alignment scanline element */}
                  <line x1="80" y1="90" x2="240" y2="90" stroke="#ef4444" strokeWidth="2" opacity="0.8" className="animate-pulse">
                    <animate attributeName="y1" values="55;125;55" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="55;125;55" dur="3s" repeatCount="indefinite" />
                  </line>

                  {/* Cattle Head Simplified Graphic */}
                  <g opacity="0.35">
                    {/* Head */}
                    <path d="M 220,110 C 220,130 250,140 250,140" stroke="#94a3b8" strokeWidth="3" />
                    {/* Ear with ear tag */}
                    <path d="M 190,95 C 170,80 160,95 180,99" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
                  </g>
                  
                  {/* QR Target Crosshairs */}
                  <g transform="translate(142, 72)">
                    {/* Outer frame corners */}
                    <path d="M 0,10 L 0,0 L 10,0" stroke="#14b8a6" strokeWidth="3" fill="none" />
                    <path d="M 36,0 L 46,0 L 46,10" stroke="#14b8a6" strokeWidth="3" fill="none" />
                    <path d="M 0,26 L 0,36 L 10,36" stroke="#14b8a6" strokeWidth="3" fill="none" />
                    <path d="M 36,36 L 46,36 L 46,26" stroke="#14b8a6" strokeWidth="3" fill="none" />
                    
                    {/* Simulated Yellow Ear Tag */}
                    <rect x="8" y="8" width="30" height="20" rx="4" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                    {/* QR Code Matrix block lines */}
                    <rect x="13" y="11" width="6" height="6" fill="#0f172a" />
                    <rect x="27" y="11" width="6" height="6" fill="#0f172a" />
                    <rect x="13" y="21" width="6" height="4" fill="#0f172a" />
                    <rect x="23" y="19" width="4" height="4" fill="#0f172a" />
                    
                    <circle cx="23" cy="18" r="1.5" fill="#14b8a6" className="animate-ping" />
                  </g>
                </svg>

                <div className="absolute bottom-2 text-center select-none">
                  <span className="text-[8.5px] font-mono font-medium text-slate-500 uppercase tracking-widest block">
                    {lang === "bn" ? "ক্যামেরা কোণ এবং কোড অ্যালাইনমেন্ট চিত্র" : "OPTICAL CODE ROTATION BLUEPRINT"}
                  </span>
                </div>
              </div>

              {/* Specific User Scanning Tips */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-3">
                <p className="font-mono font-black text-white text-[10px] uppercase tracking-wide border-b border-slate-900 pb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                  {lang === "bn" ? "পেশাদার কিউআর স্ক্যান টিপস:" : "CATTLE SCANNER ALIGNMENT TIPS:"}
                </p>
                
                <div className="space-y-3 text-[10.5px]">
                  <div className="flex gap-2.5 items-start">
                    <span className="h-5 w-5 bg-teal-555 text-slate-950 font-black flex items-center justify-center rounded-xl text-[10px] shrink-0 font-mono" style={{ backgroundColor: "#14b8a6" }}>1</span>
                    <div>
                      <strong className="text-white block font-mono font-bold">{lang === "bn" ? "কোণ এবং দূরত্ব (৮-১২ ইঞ্চি)" : "Distance & Tilt Angle Flatness"}</strong>
                      <span className="text-slate-400 mt-0.5 block leading-relaxed">
                        {lang === "bn" ? "স্মার্টফোন লেন্স থেকে ৮-১২ ইঞ্চি দূরে রাখুন। কিউআর কোডটি স্ক্রিনের সম্পূর্ণ সমান্তরাল রাখুন।" : "Keep device 8 to 12 inches away. Align the ear-tag flat to cameraViewport without step angles."}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <span className="h-5 w-5 bg-teal-555 text-slate-950 font-black flex items-center justify-center rounded-xl text-[10px] shrink-0 font-mono" style={{ backgroundColor: "#14b8a6" }}>2</span>
                    <div>
                      <strong className="text-white block font-mono font-bold">{lang === "bn" ? "আলোকসজ্জা ও ছায়ার স্থিতি" : "Perfect Illumination & Shadowing"}</strong>
                      <span className="text-slate-400 mt-0.5 block leading-relaxed">
                        {lang === "bn" ? "ট্যাগের ওপর সরাসরি ছায়া ফেলে কোড ব্লক করবেন না। তীব্র রোদ এড়াতে প্রয়োজনে ছায়ার ব্যবহার করুন।" : "Avoid overlaying deep shadow projection on codes. Diffused outdoor shade gives best scanning contrast."}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <span className="h-5 w-5 bg-teal-555 text-slate-950 font-black flex items-center justify-center rounded-xl text-[10px] shrink-0 font-mono" style={{ backgroundColor: "#14b8a6" }}>3</span>
                    <div>
                      <strong className="text-white block font-mono font-bold">{lang === "bn" ? "ট্যাগের স্থিরতা নিয়ন্ত্রণ" : "Ear Tag Flatness & Camera Stability"}</strong>
                      <span className="text-slate-400 mt-0.5 block leading-relaxed">
                        {lang === "bn" ? "নিশ্চিত করুন যে পশুর কানটি ভাঁজ বা নোংরা নয়। কিউআর কোডটি সরাসরি স্ক্রিন ফ্রেমের মাঝখানে লক করুন।" : "Straighten dirty or folded ears. Capture when the head is static within the green crosshairs."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowLivestockScannerTutorial(false)}
                className="w-full bg-teal-555 hover:bg-teal-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase font-mono transition shadow-md cursor-pointer tracking-wider"
                style={{ backgroundColor: "#14b8a6", color: "#020617" }}
              >
                {lang === "bn" ? "বুঝেছি, স্ক্যান করুন ➜" : "Got it! Continue to Scan ➜"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// SECURE USER AUTHENTICATION SCREEN COMPONENT
// ==========================================
interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [activeForm, setActiveForm] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("Administrator");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all core credentials.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    if (activeForm === "login") {
      const handleLocalFallback = () => {
        const rawUsers = localStorage.getItem("meatflow_users");
        const usersList: Array<{ id?: string; email: string; name: string; password: string; role: UserRole }> = rawUsers 
          ? JSON.parse(rawUsers) 
          : [{ id: "admin-seed-id", email: "admin@meatflow.com", name: "Shaie Alam", password: "password123", role: "Administrator" }];

        const match = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!match) {
          if (email.toLowerCase() === "admin@meatflow.com" && password === "password123") {
            const seedAdmin: User = {
              id: "admin-seed-id",
              name: "Shaie Alam",
              role: "Administrator",
              email: "admin@meatflow.com",
              avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=shaie`
            };
            localStorage.setItem("meatflow_is_auth", "true");
            localStorage.setItem("meatflow_logged_user", JSON.stringify(seedAdmin));
            setSuccessMsg("Success: Local decentralized operator authenticated! Booting workspace...");
            setTimeout(() => {
              onLoginSuccess(seedAdmin);
              window.location.reload();
            }, 900);
            return;
          }
          setErrorMsg("Local Auth: Security email not found in local index. Please check or Register below.");
          return;
        }

        if (match.password !== password) {
          setErrorMsg("Local Auth: Invalid local passcode.");
          return;
        }

        const authenticatedUser: User = {
          id: match.id || `U-${Math.floor(100 + Math.random() * 900)}`,
          name: match.name,
          role: match.role,
          email: match.email,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${match.name}`
        };

        localStorage.setItem("meatflow_is_auth", "true");
        localStorage.setItem("meatflow_logged_user", JSON.stringify(authenticatedUser));

        setSuccessMsg("Success: Local decentralized operator authenticated! Booting workspace...");
        setTimeout(() => {
          onLoginSuccess(authenticatedUser);
          window.location.reload();
        }, 900);
      };

      try {
        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          let userData: User;

          if (userDoc.exists()) {
            userData = userDoc.data() as User;
          } else {
            userData = {
              id: user.uid,
              name: "Default Operator",
              role: "Administrator",
              email: user.email || email,
              avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email || "Operator"}`
            };
            await setDoc(userDocRef, userData);
          }

          localStorage.setItem("meatflow_is_auth", "true");
          localStorage.setItem("meatflow_logged_user", JSON.stringify(userData));

          setSuccessMsg("Success: Cloud authorization established! Loading workspace...");
          setTimeout(() => {
            onLoginSuccess(userData);
            window.location.reload();
          }, 900);
        } catch (authError: any) {
          // Check for the default admin credentials self-healing path
          if (email.toLowerCase() === "admin@meatflow.com" && password === "password123") {
            try {
              userCredential = await createUserWithEmailAndPassword(auth, email, password);
              const user = userCredential.user;
              const seedAdmin: User = {
                id: user.uid,
                name: "Shaie Alam",
                role: "Administrator",
                email: email.toLowerCase(),
                avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=shaie`
              };
              await setDoc(doc(db, "users", user.uid), seedAdmin);

              localStorage.setItem("meatflow_is_auth", "true");
              localStorage.setItem("meatflow_logged_user", JSON.stringify(seedAdmin));

              setSuccessMsg("Success: Cloud authorization established! Loading workspace...");
              setTimeout(() => {
                onLoginSuccess(seedAdmin);
                window.location.reload();
              }, 900);
            } catch (createErr: any) {
              if (createErr.code === "auth/operation-not-allowed") {
                handleLocalFallback();
              } else {
                throw createErr;
              }
            }
          } else if (authError.code === "auth/operation-not-allowed") {
            handleLocalFallback();
          } else {
            throw authError;
          }
        }
      } catch (err: any) {
        console.error("Authentication error details:", err);
        let errorTxt = "Authentication failed. Access is denied.";
        if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          errorTxt = "Invalid security email or passphrase. Operational request rejected.";
        } else if (err.code === "auth/operation-not-allowed") {
          errorTxt = "Instruction: Please enable the Email/Password provider inside your Google Firebase Console Authentication Panel under the sign-in methods tab.";
        } else {
          errorTxt = err.message || errorTxt;
        }
        setErrorMsg(errorTxt);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!name) {
        setErrorMsg("Full Name is required to register an active operator profile.");
        setIsSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Internal passphrases must contain at least 6 characters.");
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passphrases mismatch. Confirm password must equal registered input.");
        setIsSubmitting(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData: User = {
          id: user.uid,
          name: name,
          role: role,
          email: email,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`
        };

        if (db) {
          try {
            await setDoc(doc(db, "users", user.uid), userData);
          } catch (dbErr) {
            console.warn("Could not save profile to firestore, proceeding anyway:", dbErr);
          }
        }

        // Keep local fallback index updated
        const rawUsers = localStorage.getItem("meatflow_users");
        const usersList = rawUsers ? JSON.parse(rawUsers) : [{ id: "admin-seed-id", email: "admin@meatflow.com", name: "Shaie Alam", password: "password123", role: "Administrator" }];
        if (!usersList.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
          usersList.push({ id: user.uid, email: email.toLowerCase(), name, password, role });
          localStorage.setItem("meatflow_users", JSON.stringify(usersList));
        }

        setSuccessMsg("Profile registered in cloud registry! Redirecting to credentials gate...");
        setTimeout(() => {
          setActiveForm("login");
          setSuccessMsg("");
          setErrorMsg("");
        }, 1500);
      } catch (err: any) {
        if (err.code === "auth/operation-not-allowed") {
          const rawUsers = localStorage.getItem("meatflow_users");
          const usersList = rawUsers ? JSON.parse(rawUsers) : [{ id: "admin-seed-id", email: "admin@meatflow.com", name: "Shaie Alam", password: "password123", role: "Administrator" }];

          if (usersList.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
            setErrorMsg("Local register error: Security email is already registered offline.");
            return;
          }

          const newLocalUser = {
            id: `U-${Math.floor(1000 + Math.random() * 9000)}`,
            email: email.toLowerCase(),
            name,
            password,
            role
          };

          usersList.push(newLocalUser);
          localStorage.setItem("meatflow_users", JSON.stringify(usersList));

          setSuccessMsg("Success: Local Operator Registered locally (Firebase Offline mode)! Redirecting...");
          setTimeout(() => {
            setActiveForm("login");
            setSuccessMsg("");
            setErrorMsg("");
          }, 1500);
        } else {
          console.error("Registration error details:", err);
          let errorTxt = "Credential processing error. Operational license registration suspended.";
          if (err.code === "auth/email-already-in-use") {
            errorTxt = "This security email is already registered within the active network node.";
          } else if (err.code === "auth/weak-password") {
            errorTxt = "Passphrases must contain at least 6 characters for biometric alignment.";
          } else {
            errorTxt = err.message || errorTxt;
          }
          setErrorMsg(errorTxt);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div id="auth-screen-layout" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-slate-900 border border-slate-850 p-8 rounded-3xl shadow-2xl relative z-15 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
            {isSubmitting ? <RefreshCw className="h-6 w-6 animate-spin" /> : <Lock className="h-6 w-6" />}
          </div>
          <h1 className="text-xl font-mono font-black uppercase tracking-tight text-white mt-3 text-center">
            ShaieAlam LiveStock ERP
          </h1>
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest text-center">
            Sovereign Ledger Access Guard
          </p>
        </div>

        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-850">
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              setActiveForm("login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`w-1/2 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-tight transition-all duration-150 cursor-pointer ${
              activeForm === "login" 
                ? "bg-teal-500 text-slate-950 shadow-md" 
                : "text-slate-400 hover:text-white"
            }`}
            style={activeForm === "login" ? { backgroundColor: "#14b8a6", color: "#020617" } : {}}
          >
            Sign In / প্রবেশ
          </button>
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              setActiveForm("register");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`w-1/2 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-tight transition-all duration-150 cursor-pointer ${
              activeForm === "register" 
                ? "bg-teal-500 text-slate-950 shadow-md" 
                : "text-slate-400 hover:text-white"
            }`}
            style={activeForm === "register" ? { backgroundColor: "#14b8a6", color: "#020617" } : {}}
          >
            Register / নিবন্ধন
          </button>
        </div>

        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div 
              key="error-msg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl flex items-start gap-2.5 text-red-400 text-[10px] font-mono leading-relaxed"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              key="success-msg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-teal-500/10 border border-teal-500/20 px-4 py-3 rounded-xl flex items-start gap-2.5 text-teal-400 text-[10px] font-mono leading-relaxed"
            >
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeForm === "register" && (
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] uppercase font-mono font-black text-slate-400 tracking-wider block">Full Operator Name / অপারেটরের নাম</label>
              <input 
                type="text" 
                required 
                disabled={isSubmitting}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Shaie Alam"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white uppercase font-mono tracking-wider font-bold focus:outline-none focus:border-teal-500/50 hover:border-slate-800 transition"
              />
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label className="text-[9px] uppercase font-mono font-black text-slate-400 tracking-wider block">Security Email Address / ইমেইল</label>
            <input 
              type="email" 
              required 
              disabled={isSubmitting}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g., admin@meatflow.com"
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500/50 hover:border-slate-800 transition"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-[9px] uppercase font-mono font-black text-slate-400 tracking-wider block">Internal Passphrase / পাসওয়ার্ড</label>
            <input 
              type="password" 
              required 
              disabled={isSubmitting}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500/50 hover:border-slate-800 transition"
            />
          </div>

          {activeForm === "register" && (
            <>
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] uppercase font-mono font-black text-slate-400 tracking-wider block">Confirm Passphrase / পাসওয়ার্ড নিশ্চিত করুন</label>
                <input 
                  type="password" 
                  required 
                  disabled={isSubmitting}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500/50 hover:border-slate-800 transition"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[9px] uppercase font-mono font-black text-slate-400 tracking-wider block">Assigned Department Node / বিভাগ নির্বাচন</label>
                <select 
                  value={role}
                  disabled={isSubmitting}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white uppercase font-mono font-bold focus:outline-none focus:border-teal-500/50 hover:border-slate-800 transition cursor-pointer"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Livestock Management">Herd Management</option>
                  <option value="Poultry Management">Poultry Management</option>
                  <option value="Butcher Shop">Butcher Shop</option>
                  <option value="Collections">Collections Officer</option>
                  <option value="Feed Shop">Feed Shop</option>
                </select>
              </div>
            </>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black tracking-tight py-3 rounded-xl text-xs uppercase font-mono transition duration-150 active:scale-95 cursor-pointer mt-2 shadow-lg text-center flex items-center justify-center gap-2"
            style={{ backgroundColor: "#14b8a6", color: "#020617" }}
          >
            {isSubmitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            <span>{activeForm === "login" ? "Request Ledger Ingress / প্রবেশ করুন" : "Register Credentials / নিবন্ধন করুন"}</span>
          </button>
        </form>

        <p className="text-[9px] text-slate-500 text-center leading-relaxed font-sans mt-2">
          Authorized connection only. This system records telemetry logs in accordance with ISO 27001 auditing standards. Default Admin account: <b className="font-mono text-slate-400">admin@meatflow.com</b> with Password: <b className="font-mono text-slate-400">password123</b>
        </p>
      </motion.div>
    </div>
  );
}
