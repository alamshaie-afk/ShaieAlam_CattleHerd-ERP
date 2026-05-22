import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Scale, 
  ChefHat, 
  PlusCircle, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  FileText,
  Weight,
  Scissors,
  ChevronDown,
  ChevronUp,
  Coins,
  DollarSign,
  Percent,
  Plus,
  Minus,
  ShoppingCart,
  Tag
} from "lucide-react";

interface Animal {
  id: string;
  type: "Cow" | "Goat" | "Buffalo" | "Sheep" | "Mithun";
  breed: string;
  owner: string;
  weightKg: number;
  purchasePrice: number;
  advancePaid: number;
  due: number;
  dueDate?: string;
  status: "Pending" | "Paid" | "Overdue" | "Processed";
  dateAdded: string;
}

export interface PortionSale {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCode?: string;
  portionsCount: number;
  ratePerPortion: number;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  paymentDueDate?: string;
  date: string;
}

export interface ButcherDispatch {
  id: string;
  animalId: string;
  animalType: "Cow" | "Goat" | "Buffalo" | "Sheep" | "Mithun";
  breed: string;
  liveWeight: number;
  shopName: string;
  dispatchDate: string;
  estimatedYield: number; // based on default/custom dressing percentage
  dressingPercentage: number; // e.g. 58
  actualYield?: number;
  actualBones?: number;
  actualOrgans?: number;
  status: "Pending Slaughter" | "Completed";
  slaughterDate?: string;
  notes?: string;

  // Portioning tracker state variables
  estimatedPortions?: number;
  actualPortions?: number;
  costPerPortion?: number;
  slaughterCost?: number;
  skinningCost?: number;
  portionSalePrice?: number;
  soldPortions?: number;

  sellHeadSeparately?: boolean;
  headPrice?: number;
  headStatus?: "Pending" | "Sold" | "Retained";

  sellChestSeparately?: boolean;
  chestPrice?: number;
  chestStatus?: "Pending" | "Sold" | "Retained";

  sellIntestineSeparately?: boolean;
  intestinePrice?: number;
  intestineStatus?: "Pending" | "Sold" | "Retained";

  sellLegsSeparately?: boolean;
  legsPrice?: number;
  legsStatus?: "Pending" | "Sold" | "Retained";

  portionSales?: PortionSale[];
}

interface ButcherShopsSectionProps {
  animals: Animal[];
  onUpdateAnimalStatus: (animalId: string, status: "Processed") => void;
  onAddMeatStock: (yields: { beef?: number; mutton?: number; buffalo?: number; bones?: number; organs?: number }) => void;
  dispatches?: ButcherDispatch[];
  onUpdateDispatches?: (updated: ButcherDispatch[]) => void;
}

export const ButcherShopsSection: React.FC<ButcherShopsSectionProps> = ({
  animals,
  onUpdateAnimalStatus,
  onAddMeatStock,
  dispatches: externalDispatches,
  onUpdateDispatches
}) => {
  // Local persistence for dispatches
  const [internalDispatches, setInternalDispatches] = useState<ButcherDispatch[]>(() => {
    const saved = localStorage.getItem("mf_butcher_dispatches");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Setup some realistic demo dispatches initially with detailed portion cost audit
    return [
      {
        id: "DSP-001",
        animalId: "ANI-001",
        animalType: "Cow",
        breed: "Jersey Cross",
        liveWeight: 280,
        shopName: "Dhanmondi Traditional Cutters",
        dispatchDate: "2026-05-19",
        estimatedYield: 162.4, // 58%
        dressingPercentage: 58,
        actualYield: 165.2,
        actualBones: 40.5,
        actualOrgans: 12.0,
        status: "Completed",
        slaughterDate: "2026-05-20",
        notes: "Excellent muscle definition. Yield exceeded estimates by 2.8kg.",
        estimatedPortions: 12,
        actualPortions: 12,
        costPerPortion: 12500,
        slaughterCost: 1500,
        skinningCost: 500,
        portionSalePrice: 15000,
        soldPortions: 8,
        sellHeadSeparately: true,
        headPrice: 4000,
        headStatus: "Sold",
        sellChestSeparately: true,
        chestPrice: 6000,
        chestStatus: "Pending",
        sellIntestineSeparately: true,
        intestinePrice: 2000,
        intestineStatus: "Sold",
        sellLegsSeparately: true,
        legsPrice: 3200,
        legsStatus: "Pending"
      },
      {
        id: "DSP-002",
        animalId: "ANI-003",
        animalType: "Buffalo",
        breed: "Murrah",
        liveWeight: 380,
        shopName: "Mirpur Meat Depot",
        dispatchDate: "2026-05-20",
        estimatedYield: 209.0, // 55%
        dressingPercentage: 55,
        status: "Pending Slaughter",
        notes: "Scheduled for morning slaughter cycle.",
        estimatedPortions: 15,
        portionSalePrice: 16000,
        sellHeadSeparately: true,
        headPrice: 5000,
        sellChestSeparately: true,
        chestPrice: 7500,
        sellIntestineSeparately: true,
        intestinePrice: 2500,
        sellLegsSeparately: true,
        legsPrice: 4000
      }
    ];
  });

  const dispatches = externalDispatches || internalDispatches;

  const setDispatches = (action: ButcherDispatch[] | ((prev: ButcherDispatch[]) => ButcherDispatch[])) => {
    const nextVal = typeof action === "function" ? action(dispatches) : action;
    if (onUpdateDispatches) {
      onUpdateDispatches(nextVal);
    } else {
      setInternalDispatches(nextVal);
    }
    localStorage.setItem("mf_butcher_dispatches", JSON.stringify(nextVal));
  };

  const [activeTab, setActiveTab] = useState<"directory" | "dispatch" | "dashboard">("directory");
  
  // Row expansion state for completed portion sales tracking
  const [expandedDispatchId, setExpandedDispatchId] = useState<string | null>(null);

  // Form state
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [selectedShop, setSelectedShop] = useState("Dhanmondi Traditional Cutters");
  const [customShop, setCustomShop] = useState("");
  const [dispatchDate, setDispatchDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [dressingPercentage, setDressingPercentage] = useState(58);
  const [dispatchNotes, setDispatchNotes] = useState("");

  // Portion Forecast in creation of dispatch
  const [dispatchEstimatedPortions, setDispatchEstimatedPortions] = useState("10");
  const [dispatchPortionSalePrice, setDispatchPortionSalePrice] = useState("15000");

  // Outlet/Store options
  const [outlets, setOutlets] = useState<string[]>([
    "Dhanmondi Traditional Cutters",
    "Mirpur Meat Depot",
    "Gulshan Premium Cuts",
    "Banani Fresh Carcass Counter"
  ]);

  // Log Yield modal/row states
  const [slaughteringDispatch, setSlaughteringDispatch] = useState<ButcherDispatch | null>(null);
  const [actualYieldInput, setActualYieldInput] = useState("");
  const [actualBonesInput, setActualBonesInput] = useState("");
  const [actualOrgansInput, setActualOrgansInput] = useState("");
  const [slaughterNotes, setSlaughterNotes] = useState("");
  const [slaughterDateInput, setSlaughterDateInput] = useState(() => new Date().toISOString().split("T")[0]);

  // New detailed slaughter logs form states (for portions and separate pieces)
  const [estimatedPortionsInput, setEstimatedPortionsInput] = useState("10");
  const [actualPortionsInput, setActualPortionsInput] = useState("10");
  const [slaughterCostInput, setSlaughterCostInput] = useState("1500");
  const [skinningCostInput, setSkinningCostInput] = useState("500");
  const [portionSalePriceInput, setPortionSalePriceInput] = useState("15000");

  const [sellHead, setSellHead] = useState(true);
  const [headPrice, setHeadPrice] = useState("4000");
  const [headStatus, setHeadStatus] = useState<"Pending" | "Sold" | "Retained">("Pending");

  const [sellChest, setSellChest] = useState(true);
  const [chestPrice, setChestPrice] = useState("6000");
  const [chestStatus, setChestStatus] = useState<"Pending" | "Sold" | "Retained">("Pending");

  const [sellIntestine, setSellIntestine] = useState(true);
  const [intestinePrice, setIntestinePrice] = useState("2000");
  const [intestineStatus, setIntestineStatus] = useState<"Pending" | "Sold" | "Retained">("Pending");

  const [sellLegs, setSellLegs] = useState(true);
  const [legsPrice, setLegsPrice] = useState("3200");
  const [legsStatus, setLegsStatus] = useState<"Pending" | "Sold" | "Retained">("Pending");

  // Portion customer sales log states
  const [portionCustName, setPortionCustName] = useState("");
  const [portionCustPhone, setPortionCustPhone] = useState("");
  const [portionCustCode, setPortionCustCode] = useState("");
  const [portionQty, setPortionQty] = useState("1");
  const [portionPaidAmt, setPortionPaidAmt] = useState("");
  const [portionDueDate, setPortionDueDate] = useState(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);

  const handleRecordPortionSale = (dispatchId: string, itemPrice: number, availablePortions: number) => {
    if (!portionCustName.trim()) {
      alert("Please enter customer name.");
      return;
    }
    const qty = Number(portionQty) || 1;
    if (qty <= 0) {
      alert("Please enter a valid count of portions.");
      return;
    }
    if (qty > availablePortions) {
      alert(`Cannot sell ${qty} portions. Only ${availablePortions} portions are left in unallocated stock.`);
      return;
    }

    const rate = itemPrice;
    const totalAmount = qty * rate;
    const paid = Number(portionPaidAmt) || 0;
    const due = Math.max(0, totalAmount - paid);
    const statusVal = due === 0 ? "Paid" : paid === 0 ? "Unpaid" : "Partial";

    const newSale: PortionSale = {
      id: "PS-" + Math.floor(1000 + Math.random() * 9000),
      customerName: portionCustName.trim(),
      customerPhone: portionCustPhone.trim() || "N/A",
      customerCode: portionCustCode.trim() || undefined,
      portionsCount: qty,
      ratePerPortion: rate,
      totalAmount,
      amountPaid: paid,
      amountDue: due,
      paymentStatus: statusVal,
      paymentDueDate: due > 0 ? (portionDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]) : undefined,
      date: new Date().toISOString().split("T")[0]
    };

    setDispatches(prev => prev.map(d => {
      if (d.id === dispatchId) {
        const currentSales = d.portionSales || [];
        const newSoldPortions = (d.soldPortions || 0) + qty;
        return {
          ...d,
          soldPortions: newSoldPortions,
          portionSales: [...currentSales, newSale]
        };
      }
      return d;
    }));

    // Reset fields
    setPortionCustName("");
    setPortionCustPhone("");
    setPortionCustCode("");
    setPortionQty("1");
    setPortionPaidAmt("");
    alert("Portion sale logged successfully!");
  };

  const handleDeletePortionSale = (dispatchId: string, saleId: string) => {
    if (!confirm("Are you sure you want to delete this portion sale?")) return;

    setDispatches(prev => prev.map(d => {
      if (d.id === dispatchId) {
        const currentSales = d.portionSales || [];
        const targetSale = currentSales.find(s => s.id === saleId);
        const qtyToDeduct = targetSale ? targetSale.portionsCount : 0;
        return {
          ...d,
          soldPortions: Math.max(0, (d.soldPortions || 0) - qtyToDeduct),
          portionSales: currentSales.filter(v => v.id !== saleId)
        };
      }
      return d;
    }));
  };

  // Save to locale storage on updates
  useEffect(() => {
    localStorage.setItem("mf_butcher_dispatches", JSON.stringify(dispatches));
  }, [dispatches]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending Slaughter" | "Completed">("All");

  // Get active (live) animals from the parent directory
  const activeAnimals = animals.filter(ani => ani.status !== "Processed");

  // Estimated yield logic update when selected animal changes
  useEffect(() => {
    const selectedAnimal = animals.find(a => a.id === selectedAnimalId);
    if (selectedAnimal) {
      if (selectedAnimal.type === "Cow" || selectedAnimal.type === "Mithun") {
        setDressingPercentage(58);
        setDispatchEstimatedPortions("12");
        setDispatchPortionSalePrice("15000");
      } else if (selectedAnimal.type === "Buffalo") {
        setDressingPercentage(55);
        setDispatchEstimatedPortions("15");
        setDispatchPortionSalePrice("14000");
      } else {
        setDressingPercentage(50); // Goat/Sheep
        setDispatchEstimatedPortions("4");
        setDispatchPortionSalePrice("8000");
      }
    }
  }, [selectedAnimalId, animals]);

  const selectedAnimalObj = animals.find(a => a.id === selectedAnimalId);
  const calculatedEstimatedYield = selectedAnimalObj 
    ? Math.round(selectedAnimalObj.weightKg * (dressingPercentage / 100) * 10) / 10 
    : 0;

  // Handle Animal Dispatch
  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimalId) {
      alert("Please select a live animal from the inventory.");
      return;
    }

    const targetAnimal = animals.find(a => a.id === selectedAnimalId);
    if (!targetAnimal) return;

    const shop = selectedShop === "Custom" ? customShop : selectedShop;
    if (selectedShop === "Custom" && !customShop) {
      alert("Please specify custom butcher shop name.");
      return;
    }

    // Add to custom shop options if needed
    if (selectedShop === "Custom" && !outlets.includes(customShop)) {
      setOutlets(prev => [...prev, customShop]);
    }

    const estimatedYieldKg = Math.round(targetAnimal.weightKg * (dressingPercentage / 100) * 10) / 10;
    const newDispatch: ButcherDispatch = {
      id: `DSP-${String(dispatches.length + 1).padStart(3, "0")}`,
      animalId: targetAnimal.id,
      animalType: targetAnimal.type,
      breed: targetAnimal.breed,
      liveWeight: targetAnimal.weightKg,
      shopName: shop,
      dispatchDate: dispatchDate,
      estimatedYield: estimatedYieldKg,
      dressingPercentage: dressingPercentage,
      status: "Pending Slaughter",
      notes: dispatchNotes,
      
      // Projections:
      estimatedPortions: Number(dispatchEstimatedPortions) || 10,
      portionSalePrice: Number(dispatchPortionSalePrice) || 15000,
      sellHeadSeparately: true,
      headPrice: targetAnimal.type === "Cow" ? 4000 : targetAnimal.type === "Buffalo" ? 5000 : 1500,
      headStatus: "Pending",
      sellChestSeparately: true,
      chestPrice: targetAnimal.type === "Cow" ? 6000 : targetAnimal.type === "Buffalo" ? 7500 : 2000,
      chestStatus: "Pending",
      sellIntestineSeparately: true,
      intestinePrice: targetAnimal.type === "Cow" ? 2000 : targetAnimal.type === "Buffalo" ? 2500 : 800,
      intestineStatus: "Pending",
      sellLegsSeparately: true,
      legsPrice: targetAnimal.type === "Cow" ? 3200 : targetAnimal.type === "Buffalo" ? 4000 : 1200,
      legsStatus: "Pending"
    };

    setDispatches(prev => [newDispatch, ...prev]);
    
    // Optional notification/alert
    alert(`Successfully dispatched Animal ${targetAnimal.id} to ${shop}!`);
    
    // Clear states
    setSelectedAnimalId("");
    setDispatchNotes("");
    setActiveTab("directory");
  };

  // Handle Slaughter logging
  const handleLogSlaughterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slaughteringDispatch) return;

    const actualYield = Number(actualYieldInput);
    if (isNaN(actualYield) || actualYield <= 0) {
      alert("Please log a valid weight for actual meat yield.");
      return;
    }

    const actualBones = Number(actualBonesInput) || 0;
    const actualOrgans = Number(actualOrgansInput) || 0;

    const animalObj = animals.find(a => a.id === slaughteringDispatch.animalId);
    const purchaseCost = animalObj ? animalObj.purchasePrice : 85000; // realistic fallback
    
    const sCost = Number(slaughterCostInput) || 0;
    const skCost = Number(skinningCostInput) || 0;
    const actPortions = Number(actualPortionsInput) || 10;
    const calculatedCostPerPortion = Math.ceil((purchaseCost + sCost + skCost) / actPortions);

    // Update dispatch item
    setDispatches(prev => prev.map(d => {
      if (d.id === slaughteringDispatch.id) {
        return {
          ...d,
          status: "Completed",
          actualYield: actualYield,
          actualBones: actualBones,
          actualOrgans: actualOrgans,
          slaughterDate: slaughterDateInput,
          notes: slaughterNotes || d.notes,
          
          // Portions and cost logs
          estimatedPortions: Number(estimatedPortionsInput) || d.estimatedPortions || 10,
          actualPortions: actPortions,
          costPerPortion: calculatedCostPerPortion,
          slaughterCost: sCost,
          skinningCost: skCost,
          portionSalePrice: Number(portionSalePriceInput) || d.portionSalePrice || 15000,
          soldPortions: 0, // starts at 0

          sellHeadSeparately: sellHead,
          headPrice: Number(headPrice) || 0,
          headStatus: headStatus,

          sellChestSeparately: sellChest,
          chestPrice: Number(chestPrice) || 0,
          chestStatus: chestStatus,

          sellIntestineSeparately: sellIntestine,
          intestinePrice: Number(intestinePrice) || 0,
          intestineStatus: intestineStatus,

          sellLegsSeparately: sellLegs,
          legsPrice: Number(legsPrice) || 0,
          legsStatus: legsStatus
        };
      }
      return d;
    }));

    // Update main animal status in the parent directory
    onUpdateAnimalStatus(slaughteringDispatch.animalId, "Processed");

    // Add meat cuts yield and bypasses directly to parent retail dashboard cuts inventory
    const yieldsUpdate: { beef?: number; mutton?: number; buffalo?: number; bones?: number; organs?: number } = {
      bones: actualBones,
      organs: actualOrgans
    };

    const typeLower = slaughteringDispatch.animalType.toLowerCase();
    if (typeLower === "cow" || typeLower === "mithun") {
      yieldsUpdate.beef = actualYield;
    } else if (typeLower === "buffalo") {
      yieldsUpdate.buffalo = actualYield;
    } else {
      yieldsUpdate.mutton = actualYield;
    }

    // Call callback
    onAddMeatStock(yieldsUpdate);

    alert(`Slaughter completed! Marked Animal ${slaughteringDispatch.animalId} as processed and updated counter meat display stock!`);
    
    // Reset states
    setSlaughteringDispatch(null);
    setActualYieldInput("");
    setActualBonesInput("");
    setActualOrgansInput("");
    setSlaughterNotes("");
  };

  // Update portion sales counters and specialty cuts statuses instantly
  const handleUpdateCutsAndPortions = (id: string, updates: Partial<ButcherDispatch>) => {
    setDispatches(prev => prev.map(d => {
      if (d.id === id) {
        const updated = { ...d, ...updates };
        
        // Also sync up corresponding changes internally if required
        return updated;
      }
      return d;
    }));
  };

  // Stats Counters
  const pendingCount = dispatches.filter(d => d.status === "Pending Slaughter").length;
  const completedCount = dispatches.filter(d => d.status === "Completed").length;
  const totalWeightDispatched = dispatches.reduce((acc, curr) => acc + curr.liveWeight, 0);
  
  const totalEstimatedYield = dispatches.reduce((acc, curr) => acc + curr.estimatedYield, 0);
  const totalActualYield = dispatches.reduce((acc, curr) => acc + (curr.actualYield || 0), 0);

  // Dressing ratio efficiency calculation
  const completedDispatches = dispatches.filter(d => d.status === "Completed" && d.actualYield);
  const averageEfficiency = completedDispatches.length > 0 
    ? Math.round(completedDispatches.reduce((acc, d) => acc + ((d.actualYield! / d.estimatedYield) * 100), 0) / completedDispatches.length)
    : 100;

  // Filter lists
  const filteredDispatches = dispatches.filter(d => {
    const matchesSearch = d.animalId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Mini Title Navigation Tab bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-4 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-teal-400" />
              Butcher Shops Dispatch & Yield Manager
            </h3>
            <span className="bg-amber-500/10 text-amber-500 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase tracking-wider">
              Retail Slicing
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track live cattle dispatches sent to local outlets, forecast dressing yield weight, and log physical meat yield output.
          </p>
        </div>

        <div className="flex gap-2">
          {([
            { id: "directory", label: "Dispatches List" },
            { id: "dispatch", label: "Dispatch Cattle" },
            { id: "dashboard", label: "Yield Performance" }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-teal-500 text-slate-950 shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* STATS DECK */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block">Cattle Sent for Slaughter</span>
            <span className="text-xl font-extrabold text-white block">{dispatches.length} Heads</span>
          </div>
          <div className="bg-teal-500/10 p-2 rounded-xl text-teal-400 border border-teal-500/20">
            <ChefHat className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block">Pending Slaughter Cycles</span>
            <span className="text-xl font-extrabold text-amber-400 block">{pendingCount} Active</span>
          </div>
          <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400 border border-amber-500/20">
            <AlertCircle className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block">Estimated vs Actual Yield</span>
            <span className="text-xl font-extrabold text-white block">
              {Math.round(totalEstimatedYield).toLocaleString()} / {Math.round(totalActualYield).toLocaleString()} kg
            </span>
          </div>
          <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Scale className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block">Yield Accuracy Ratio</span>
            <span className={`text-xl font-extrabold block ${averageEfficiency >= 100 ? "text-emerald-400" : "text-amber-400"}`}>
              {averageEfficiency}% Dressing Efficiency
            </span>
          </div>
          <div className="bg-cyan-500/10 p-2 rounded-xl text-cyan-400 border border-cyan-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* CORE ACTIVE VIEW RENDERING */}
      {activeTab === "directory" && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-white">Butcher Shops Dispatch Register</span>
              <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400">
                {filteredDispatches.length} records matching
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <input
                type="text"
                placeholder="Search animal ID, shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs rounded-xl px-3.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 max-w-xs"
              />

              <div className="flex gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-xl">
                {(["All", "Pending Slaughter", "Completed"] as const).map(filt => (
                  <button
                    key={filt}
                    onClick={() => setStatusFilter(filt)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                      statusFilter === filt
                        ? "bg-slate-800 text-teal-400"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {filt === "All" ? "All" : filt === "Pending Slaughter" ? "Pending" : "Completed"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredDispatches.length === 0 ? (
            <div className="p-12 border border-dashed border-slate-900 rounded-3xl text-center text-slate-500 text-xs font-mono">
              No animal dispatches logged yet or matches found for current filter selections.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-400 font-mono text-[10px] uppercase bg-slate-900/30">
                    <th className="p-3">Dispatch Ref</th>
                    <th className="p-3">Animal Info</th>
                    <th className="p-3">Butcher House Outlet</th>
                    <th className="p-3">Dates</th>
                    <th className="p-3 text-right">Live Weight</th>
                    <th className="p-3 text-right">Yield (Est vs Act)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 font-mono text-xs text-slate-300">
                  {filteredDispatches.map((disp) => {
                    const simpleDressingPercent = disp.actualYield
                      ? Math.round((disp.actualYield / disp.liveWeight) * 100)
                      : null;

                    const isExpanded = expandedDispatchId === disp.id;
                    const animalObj = animals.find(a => a.id === disp.animalId);
                    const purchaseCost = animalObj ? animalObj.purchasePrice : 85000;
                    
                    const slaughterCost = disp.slaughterCost || 1500;
                    const skinningCost = disp.skinningCost || 500;
                    const loadedCost = purchaseCost + slaughterCost + skinningCost;

                    // Projected Portion Sells
                    const actPortions = disp.actualPortions || 12;
                    const salePrice = disp.portionSalePrice || 15000;
                    
                    const projectedPortionsRevenue = actPortions * salePrice;
                    const separateCutsMaxPossibleRevenue = 
                      (disp.sellHeadSeparately ? disp.headPrice || 4000 : 0) +
                      (disp.sellChestSeparately ? disp.chestPrice || 6000 : 0) +
                      (disp.sellIntestineSeparately ? disp.intestinePrice || 2000 : 0) +
                      (disp.sellLegsSeparately ? disp.legsPrice || 3200 : 0);
                    const totalProjectedRevenue = projectedPortionsRevenue + separateCutsMaxPossibleRevenue;

                    // Realised revenue currently
                    const soldPortionsCount = disp.soldPortions || 0;
                    const realisedPortionsRevenue = soldPortionsCount * salePrice;
                    const realisedCutsRevenue =
                      (disp.sellHeadSeparately && disp.headStatus === "Sold" ? disp.headPrice || 4000 : 0) +
                      (disp.sellChestSeparately && disp.chestStatus === "Sold" ? disp.chestPrice || 6000 : 0) +
                      (disp.sellIntestineSeparately && disp.intestineStatus === "Sold" ? disp.intestinePrice || 2000 : 0) +
                      (disp.sellLegsSeparately && disp.legsStatus === "Sold" ? disp.legsPrice || 3200 : 0);
                    const totalRealisedRevenue = realisedPortionsRevenue + realisedCutsRevenue;
                    const realisedProfitOrLoss = totalRealisedRevenue - loadedCost;

                    return (
                      <React.Fragment key={disp.id}>
                        <tr className={`border-b border-slate-900/40 hover:bg-slate-900/10 ${isExpanded ? 'bg-slate-950/40' : ''}`}>
                          <td className="p-3 font-bold text-white">
                            <div>{disp.id}</div>
                            <span className="text-[9px] text-slate-500">Animal: {disp.animalId}</span>
                          </td>
                          <td className="p-3 leading-normal">
                            <span className="px-2 py-0.5 bg-slate-900 text-teal-400 border border-slate-800 rounded font-bold mr-1.5 uppercase text-[9px]">
                              {disp.animalType}
                            </span>
                            <span className="text-slate-400">{disp.breed}</span>
                          </td>
                          <td className="p-3 font-semibold text-slate-200">
                            {disp.shopName}
                          </td>
                          <td className="p-3 text-[10px] text-slate-400">
                            <div>Sent: {disp.dispatchDate}</div>
                            {disp.slaughterDate && (
                              <div className="text-emerald-500 mt-0.5 font-bold font-sans">Slaught: {disp.slaughterDate}</div>
                            )}
                          </td>
                          <td className="p-3 text-right font-bold text-slate-300">
                            {disp.liveWeight} kg
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-bold text-slate-400">Est: {disp.estimatedYield} kg ({disp.dressingPercentage}%)</div>
                            {disp.actualYield ? (
                              <div className="text-emerald-400 font-extrabold mt-0.5">
                                Act: {disp.actualYield} kg ({simpleDressingPercent}%)
                              </div>
                            ) : (
                              <div className="text-amber-500 text-[10px] mt-0.5 italic">Awaiting Yield log</div>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${
                              disp.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse"
                            }`}>
                              {disp.status === "Completed" ? "Marked Slaughtered" : "Active Dispatch"}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {disp.status === "Pending Slaughter" ? (
                              <button
                                onClick={() => {
                                  setSlaughteringDispatch(disp);
                                  setActualYieldInput(String(disp.estimatedYield));
                                  setActualBonesInput(String(Math.round(disp.liveWeight * 0.12)));
                                  setActualOrgansInput(String(Math.round(disp.liveWeight * 0.04)));
                                  
                                  setEstimatedPortionsInput(String(disp.estimatedPortions || Math.round(disp.liveWeight / 25) || 12));
                                  setActualPortionsInput(String(disp.estimatedPortions || Math.round(disp.liveWeight / 25) || 12));
                                  setSlaughterCostInput("1500");
                                  setSkinningCostInput("500");
                                  setPortionSalePriceInput(String(disp.portionSalePrice || 15000));
                                  
                                  setSellHead(disp.sellHeadSeparately !== false);
                                  setHeadPrice(String(disp.headPrice || 4000));
                                  setHeadStatus(disp.headStatus || "Pending");
                                  
                                  setSellChest(disp.sellChestSeparately !== false);
                                  setChestPrice(String(disp.chestPrice || 6000));
                                  setChestStatus(disp.chestStatus || "Pending");
                                  
                                  setSellIntestine(disp.sellIntestineSeparately !== false);
                                  setIntestinePrice(String(disp.intestinePrice || 2000));
                                  setIntestineStatus(disp.intestineStatus || "Pending");
                                  
                                  setSellLegs(disp.sellLegsSeparately !== false);
                                  setLegsPrice(String(disp.legsPrice || 3200));
                                  setLegsStatus(disp.legsStatus || "Pending");
                                }}
                                className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1.5 rounded-lg border border-amber-400 hover:bg-amber-400 cursor-pointer"
                              >
                                Log Slaughter Yield
                              </button>
                            ) : (
                              <div className="flex justify-end gap-2 items-center">
                                <button
                                  onClick={() => setExpandedDispatchId(isExpanded ? null : disp.id)}
                                  className={`border text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer font-sans ${
                                    isExpanded 
                                      ? "bg-slate-100 text-slate-900 border-white hover:bg-white" 
                                      : "bg-slate-900 text-teal-400 border-slate-800 hover:bg-slate-850 hover:text-white"
                                  }`}
                                >
                                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                  <span>Portion Ledger</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>

                        {/* Collapsible Portion Ledger Sub-row */}
                        {isExpanded && disp.status === "Completed" && (
                          <tr className="bg-slate-950/60 transition duration-200">
                            <td colSpan={8} className="p-4 border-t border-b border-slate-800/20 font-sans text-left">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-left">
                                
                                {/* Column 1: Core Processing Costs */}
                                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-850 space-y-3">
                                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                                    <Coins className="h-3.5 w-3.5 text-amber-500" />
                                    <span>Processing Cost Sheet</span>
                                  </div>
                                  <div className="space-y-2 text-[11px] text-slate-400">
                                    <div className="flex justify-between">
                                      <span>Animal Purchasing Value:</span>
                                      <strong className="text-white">₹{purchaseCost.toLocaleString()}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Slaughtering Fee (শ্লটার খরচ):</span>
                                      <strong className="text-white">₹{slaughterCost.toLocaleString()}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Skinning / De-skinning:</span>
                                      <strong className="text-white">₹{skinningCost.toLocaleString()}</strong>
                                    </div>
                                    <hr className="border-slate-800/60 my-1" />
                                    <div className="flex justify-between text-xs text-slate-200 font-bold">
                                      <span>Fully Loaded Cost:</span>
                                      <span className="text-amber-400">₹{loadedCost.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Column 2: Portion Allocation & Sales Tracking */}
                                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-850 space-y-3">
                                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                                    <ChefHat className="h-3.5 w-3.5 text-teal-400" />
                                    <span>Portions Slicing (স্লাইস বিক্রয়)</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2 text-[10.5px] text-slate-400 mb-1">
                                    <div>
                                      <span>Cost per Portion:</span>
                                      <div className="text-emerald-400 font-bold">₹{(disp.costPerPortion || Math.ceil(loadedCost / actPortions)).toLocaleString()}</div>
                                    </div>
                                    <div>
                                      <span>Value per Portion:</span>
                                      <div className="text-teal-400 font-bold">₹{salePrice.toLocaleString()}</div>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5 pt-1.5 border-t border-slate-850">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Sell Portions Progress:</span>
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-850">
                                        <button 
                                          disabled={soldPortionsCount <= 0}
                                          onClick={() => handleUpdateCutsAndPortions(disp.id, { soldPortions: soldPortionsCount - 1 })}
                                          className="h-6 w-6 bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded flex items-center justify-center disabled:opacity-30 disabled:hover:bg-slate-900 hover:bg-slate-850 cursor-pointer"
                                        >
                                          -
                                        </button>
                                        <span className="font-mono text-xs font-black text-white px-1">
                                          {soldPortionsCount}
                                        </span>
                                        <button 
                                          disabled={soldPortionsCount >= actPortions}
                                          onClick={() => handleUpdateCutsAndPortions(disp.id, { soldPortions: soldPortionsCount + 1 })}
                                          className="h-6 w-6 bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded flex items-center justify-center disabled:opacity-30 disabled:hover:bg-slate-900 hover:bg-slate-850 cursor-pointer"
                                        >
                                          +
                                        </button>
                                      </div>
                                      
                                      <div className="flex-1">
                                        <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                                          <span>Sold count</span>
                                          <span>{soldPortionsCount}/{actPortions}</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
                                          <div 
                                            className="bg-teal-500 h-full rounded-full transition-all duration-300"
                                            style={{ width: `${Math.min(100, (soldPortionsCount / actPortions) * 100)}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Column 3: Specialty Cuts Statuses & Sells */}
                                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-850 space-y-3">
                                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                                    <ShoppingCart className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>Specialty Sales (মাথা, ভুঁড়ি, পায়া)</span>
                                  </div>

                                  <div className="space-y-2">
                                    {[
                                      { key: 'head', label: 'Head (মাথা)', check: disp.sellHeadSeparately !== false, price: disp.headPrice || 4000, status: disp.headStatus || 'Pending' },
                                      { key: 'chest', label: 'Chest (বुक)', check: disp.sellChestSeparately !== false, price: disp.chestPrice || 6000, status: disp.chestStatus || 'Pending' },
                                      { key: 'intestine', label: 'Vuri (ভুঁড়ি)', check: disp.sellIntestineSeparately !== false, price: disp.intestinePrice || 2000, status: disp.intestineStatus || 'Pending' },
                                      { key: 'legs', label: 'Legs (পায় ৪ টা)', check: disp.sellLegsSeparately !== false, price: disp.legsPrice || 3200, status: disp.legsStatus || 'Pending' }
                                    ].map(item => {
                                      if (!item.check) return null;
                                      return (
                                        <div key={item.key} className="flex items-center justify-between bg-slate-950 p-1.5 rounded-lg border border-slate-850 text-[10.5px]">
                                          <div className="leading-tight">
                                            <span className="text-slate-300 font-bold block">{item.label}</span>
                                            <span className="text-[9px] text-emerald-400/90 font-bold">₹{item.price.toLocaleString()}</span>
                                          </div>
                                          <div className="flex gap-1">
                                            {(['Pending', 'Sold', 'Retained'] as const).map(st => (
                                              <button
                                                key={st}
                                                type="button"
                                                onClick={() => handleUpdateCutsAndPortions(disp.id, { [`${item.key}Status`]: st })}
                                                className={`px-1.5 py-0.5 text-[8px] rounded font-black tracking-wide border transition cursor-pointer ${
                                                  item.status === st
                                                    ? st === 'Sold'
                                                      ? 'bg-emerald-500 text-slate-950 border-emerald-555'
                                                      : st === 'Pending'
                                                        ? 'bg-amber-505 bg-amber-500/30 text-amber-500 border-amber-500/20'
                                                        : 'bg-slate-700 text-slate-200 border-slate-600'
                                                    : 'bg-slate-900 text-slate-500 border-transparent hover:text-slate-400'
                                                }`}
                                              >
                                                {st}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* Ledger summary banner */}
                              <div className="mt-4 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-2xl flex flex-wrap gap-4 items-center justify-between text-xs font-mono text-left">
                                <div className="flex flex-wrap gap-x-6 gap-y-1">
                                  <div>
                                    <span className="text-slate-400">Total Meat Yield:</span>{" "}
                                    <strong className="text-emerald-400 font-bold">{disp.actualYield} kg ({simpleDressingPercent}% actual dressing ratio)</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Projected Value (সর্বমোট সম্ভাব্য বিক্রয়):</span>{" "}
                                    <strong className="text-teal-400 font-bold">₹{totalProjectedRevenue.toLocaleString()}</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">Realised Sells (এ পর্যন্ত বিক্রয়):</span>{" "}
                                    <strong className="text-amber-400 font-bold">₹{totalRealisedRevenue.toLocaleString()}</strong>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="text-slate-400 text-[10px] block font-sans">Current Ledger Balance:</span>
                                  {realisedProfitOrLoss >= 0 ? (
                                    <span className="text-emerald-400 font-black text-sm">
                                      +₹{realisedProfitOrLoss.toLocaleString()} Profit (লাভ)
                                    </span>
                                  ) : (
                                    <span className="text-red-400 font-black text-sm">
                                      -₹{Math.abs(realisedProfitOrLoss).toLocaleString()} Outstanding (ক্ষতি)
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Portions Slices Logging & Sourcing Credit Tracker */}
                              <div className="mt-5 border-t border-slate-850 pt-4 space-y-4 text-left">
                                <div className="flex items-center gap-2">
                                  <Scale className="h-4 w-4 text-teal-400" />
                                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                                    Portions Customer Sales & Sourcing Credit Ledger
                                  </h4>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  {/* Sourcing/Acquisition Credit Tracking */}
                                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
                                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 font-sans">
                                        <Coins className="h-3.5 w-3.5 text-amber-500" />
                                        Procurement Sourcing Credit
                                      </span>
                                      {animalObj ? (
                                        animalObj.due > 0 ? (
                                          <span className="px-2 py-0.5 rounded text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase animate-pulse">
                                            Credit Outstanding
                                          </span>
                                        ) : (
                                          <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-green-500/30 font-bold uppercase">
                                            Paid In Full
                                          </span>
                                        )
                                      ) : null}
                                    </div>

                                    {animalObj ? (
                                      <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Animal Sourced From:</span>
                                          <span className="text-slate-200 font-bold">{animalObj.owner || "Walk-In Supplier"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Purchase Price:</span>
                                          <span className="text-slate-200 font-semibold font-mono">₹{animalObj.purchasePrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Advance Paid:</span>
                                          <span className="text-emerald-400 font-semibold font-mono">₹{animalObj.advancePaid.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between pt-1 border-t border-slate-900">
                                          <span className="text-slate-400 font-bold">Outstanding Credit Due to Owner:</span>
                                          <span className={`font-mono font-bold text-sm ${animalObj.due > 0 ? "text-amber-505 text-amber-550 text-amber-500" : "text-emerald-400"}`}>
                                            ₹{animalObj.due.toLocaleString()}
                                          </span>
                                        </div>
                                        {animalObj.due > 0 && (
                                          <div className="flex items-center gap-1.5 text-[10px] bg-slate-900 border border-slate-850 p-2 rounded-xl text-slate-455 text-slate-400 font-mono">
                                            <Calendar className="h-3.5 w-3.5 text-amber-500" />
                                            <span>
                                              Payment Due Date: <strong className="text-amber-500 text-xs font-bold">{animalObj.dueDate || "Not Specified"}</strong>
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-slate-500 py-6 text-center italic font-mono text-[10px]">
                                        Livestock details unavailable for Animal Reference {disp.animalId}
                                      </div>
                                    )}
                                  </div>

                                  {/* Add Portion Sale Input Form */}
                                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-850 pb-2 flex items-center gap-1.5 font-sans">
                                      <PlusCircle className="h-3.5 w-3.5 text-teal-400" />
                                      Record Portion Sale to Customer
                                    </span>

                                    {soldPortionsCount >= actPortions ? (
                                      <div className="text-center py-6 bg-slate-900/30 border border-dashed border-slate-850 rounded-xl text-slate-500 text-xs font-mono">
                                        🎉 All {actPortions} portions of this dispatch have been fully sold and recorded!
                                      </div>
                                    ) : (
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                                          <div className="space-y-1">
                                            <span className="text-slate-400 text-[10px] block">Customer Name *</span>
                                            <input
                                              type="text"
                                              value={portionCustName}
                                              onChange={(e) => setPortionCustName(e.target.value)}
                                              placeholder="e.g. Salim Uddin"
                                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-teal-500"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <span className="text-slate-400 text-[10px] block">Customer Phone</span>
                                            <input
                                              type="text"
                                              value={portionCustPhone}
                                              onChange={(e) => setPortionCustPhone(e.target.value)}
                                              placeholder="e.g. 0171234567"
                                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-teal-500"
                                            />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-[11px]">
                                          <div className="space-y-1">
                                            <span className="text-slate-400 text-[10px] block">Customer Code</span>
                                            <input
                                              type="text"
                                              value={portionCustCode}
                                              onChange={(e) => setPortionCustCode(e.target.value)}
                                              placeholder="e.g. C-101"
                                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-teal-500 text-center font-mono"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <span className="text-slate-400 text-[10px] block">Portions Qty</span>
                                            <input
                                              type="number"
                                              min="1"
                                              max={actPortions - soldPortionsCount}
                                              value={portionQty}
                                              onChange={(e) => setPortionQty(e.target.value)}
                                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-teal-500 text-center font-bold text-teal-400 font-mono"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <span className="text-slate-400 text-[10px] block">Amt Paid (₹)</span>
                                            <input
                                              type="number"
                                              value={portionPaidAmt}
                                              onChange={(e) => setPortionPaidAmt(e.target.value)}
                                              placeholder={`Max ₹${((Number(portionQty) || 1) * salePrice).toLocaleString()}`}
                                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-teal-500 text-center font-bold text-emerald-400 font-mono"
                                            />
                                          </div>
                                        </div>

                                        {/* Due date if credit has outstanding */}
                                        {((Number(portionQty) || 1) * salePrice - (Number(portionPaidAmt) || 0)) > 0 && (
                                          <div className="space-y-1">
                                            <span className="text-slate-400 text-[10px] block">Credit Due Date for Portion Sells</span>
                                            <input
                                              type="date"
                                              value={portionDueDate}
                                              onChange={(e) => setPortionDueDate(e.target.value)}
                                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-teal-500 font-mono"
                                            />
                                          </div>
                                        )}

                                        <button
                                          type="button"
                                          onClick={() => handleRecordPortionSale(disp.id, salePrice, actPortions - soldPortionsCount)}
                                          className="w-full py-1.5 bg-teal-500 border border-teal-600 hover:bg-teal-400 text-slate-950 font-black tracking-wider rounded-xl uppercase transition shadow cursor-pointer text-[10px] font-sans"
                                        >
                                          Confirm Portion Sells Credit Entry
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* List of portions sold for this carcass */}
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3 mt-4">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-850 pb-2">
                                    📖 Customer Portion Ledger History for carcass {disp.id}
                                  </span>

                                  {!disp.portionSales || disp.portionSales.length === 0 ? (
                                    <div className="text-slate-500 py-6 text-center italic font-mono text-xs">
                                      No customer portion sales have been registered yet under this carcass.
                                    </div>
                                  ) : (
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left text-[11px] font-mono whitespace-nowrap">
                                        <thead>
                                          <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px] tracking-wider">
                                            <th className="py-2">Sale ID</th>
                                            <th className="py-2">Customer & Account Code</th>
                                            <th className="py-2 text-center">Portions Scl.</th>
                                            <th className="py-2 text-right">Total Amount</th>
                                            <th className="py-2 text-right">Amount Paid</th>
                                            <th className="py-2 text-right">Balance Due</th>
                                            <th className="py-2 text-center">Status</th>
                                            <th className="py-2 text-center">Due Date</th>
                                            <th className="py-2 text-center">Action</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-900/60 text-slate-200">
                                          {disp.portionSales.map((sale) => (
                                            <tr key={sale.id} className="hover:bg-slate-905 hover:bg-slate-900/20">
                                              <td className="py-2 text-slate-400 font-bold">{sale.id}</td>
                                              <td className="py-2">
                                                <div className="font-sans font-bold text-white flex items-center gap-1.5">
                                                  {sale.customerName}
                                                  {sale.customerCode && (
                                                    <span className="text-[9px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-1 rounded font-mono uppercase">
                                                      {sale.customerCode}
                                                    </span>
                                                  )}
                                                </div>
                                                <div className="text-[10px] text-slate-500">{sale.customerPhone}</div>
                                              </td>
                                              <td className="py-2 text-center font-bold text-white">{sale.portionsCount}</td>
                                              <td className="py-2 text-right text-slate-300 font-bold">₹{sale.totalAmount.toLocaleString()}</td>
                                              <td className="py-2 text-right text-emerald-400">₹{sale.amountPaid.toLocaleString()}</td>
                                              <td className={`py-2 text-right font-bold ${sale.amountDue > 0 ? "text-amber-500" : "text-slate-400"}`}>
                                                ₹{sale.amountDue.toLocaleString()}
                                              </td>
                                              <td className="py-2 text-center">
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                  sale.paymentStatus === "Paid" 
                                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                    : sale.paymentStatus === "Partial"
                                                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                }`}>
                                                  {sale.paymentStatus}
                                                </span>
                                              </td>
                                              <td className="py-2 text-center text-slate-400 text-[10px] font-semibold">
                                                {sale.paymentDueDate || "-"}
                                              </td>
                                              <td className="py-2 text-center">
                                                <button
                                                  type="button"
                                                  onClick={() => handleDeletePortionSale(disp.id, sale.id)}
                                                  className="text-red-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-red-500 px-1.5 py-0.5 rounded font-bold cursor-pointer text-[10px]"
                                                >
                                                  Delete
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
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
          )}
        </div>
      )}

      {/* LOG SLAUGHTER MODAL DIALOG */}
      {slaughteringDispatch && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl font-mono text-xs">
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Scissors className="h-4 w-4 text-emerald-400" />
                  Log Slaughter & Portions Output (জবাই ও পিস হিসাব)
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Dispatch ID: {slaughteringDispatch.id} • Animal ID: {slaughteringDispatch.animalId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSlaughteringDispatch(null)}
                className="text-slate-400 hover:text-white font-black hover:bg-slate-800 h-6 w-6 rounded-full flex items-center justify-center font-sans text-sm"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleLogSlaughterSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Animal Type / Breed:</span>
                    <strong className="text-white">{slaughteringDispatch.animalType} ({slaughteringDispatch.breed})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Live Weight:</span>
                    <strong className="text-white">{slaughteringDispatch.liveWeight} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Yield:</span>
                    <strong className="text-teal-400">{slaughteringDispatch.estimatedYield} kg ({slaughteringDispatch.dressingPercentage}%)</strong>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Acquisition (ক্রয় মূল্য):</span>
                    <strong className="text-white">₹{(animals.find(a => a.id === slaughteringDispatch.animalId)?.purchasePrice || 85000).toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assumed Total Cost:</span>
                    <span className="text-amber-400 font-bold">
                      ₹{((animals.find(a => a.id === slaughteringDispatch.animalId)?.purchasePrice || 85000) + (Number(slaughterCostInput) || 0) + (Number(skinningCostInput) || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Per Portion:</span>
                    <strong className="text-emerald-400">
                      ₹{Math.ceil(((animals.find(a => a.id === slaughteringDispatch.animalId)?.purchasePrice || 85000) + (Number(slaughterCostInput) || 0) + (Number(skinningCostInput) || 0)) / (Number(actualPortionsInput) || 12)).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                {/* Yield weights */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Carcass Meat (kg) *
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={actualYieldInput}
                        onChange={(e) => setActualYieldInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-white font-bold font-mono text-emerald-400"
                        placeholder="Meat kg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Bones (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={actualBonesInput}
                      onChange={(e) => setActualBonesInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Organs/Tripe (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={actualOrgansInput}
                      onChange={(e) => setActualOrgansInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-white"
                    />
                  </div>
                </div>

                {/* Slicing Portions & Slaughter fee section */}
                <div className="border border-slate-850 p-4 rounded-2xl bg-slate-950/40 space-y-3">
                  <span className="text-[10px] text-amber-500 font-black uppercase tracking-wider block font-sans flex items-center gap-1.5">
                    <Coins className="h-4 w-4" />
                    🪓 Processing Charges & Sliced Portions (স্লাইস ও শ্লটার খরচ)
                  </span>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold">
                        Slaughter Cost (শ্লটার ফি) ₹
                      </label>
                      <input
                        type="number"
                        value={slaughterCostInput}
                        onChange={(e) => setSlaughterCostInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 text-center"
                        placeholder="e.g. 1500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold">
                        Skinning Cost (chamra chharano) ₹
                      </label>
                      <input
                        type="number"
                        value={skinningCostInput}
                        onChange={(e) => setSkinningCostInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 text-center"
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Est. Portions
                      </label>
                      <input
                        type="number"
                        value={estimatedPortionsInput}
                        onChange={(e) => setEstimatedPortionsInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 py-2.5 text-white text-center"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Actual Portions
                      </label>
                      <input
                        type="number"
                        value={actualPortionsInput}
                        onChange={(e) => setActualPortionsInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 py-2.5 text-white text-center font-bold text-teal-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Portion Value (₹)
                      </label>
                      <input
                        type="number"
                        value={portionSalePriceInput}
                        onChange={(e) => setPortionSalePriceInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 py-2.5 text-white text-center font-bold text-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Sell separately organs */}
                <div className="border border-slate-850 p-4 rounded-2xl bg-slate-950/40 space-y-3">
                  <span className="text-[10px] text-amber-500 font-black uppercase tracking-wider block font-sans flex items-center gap-1.5">
                    <ShoppingCart className="h-4 w-4" />
                    🥩 Separate Specialty Cuts (মাথা, বুক, ভুঁড়ি ও পায়া আলাদা বিক্রয়)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Head */}
                    <div className="bg-slate-950 p-3 border border-slate-850 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sellHeadCheck"
                          checked={sellHead}
                          onChange={(e) => setSellHead(e.target.checked)}
                          className="rounded text-teal-550 text-emerald-500 bg-slate-900 border-slate-800 h-4 w-4 cursor-pointer"
                        />
                        <label htmlFor="sellHeadCheck" className="text-[11px] font-bold text-slate-200 cursor-pointer">Sell Head (মাথা)</label>
                      </div>
                      {sellHead && (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={headPrice}
                            onChange={(e) => setHeadPrice(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-[11px] rounded p-1.5 w-1/2 text-white font-bold"
                            placeholder="Price (₹)"
                          />
                          <select
                            value={headStatus}
                            onChange={(e: any) => setHeadStatus(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-[10px] rounded p-1.5 w-1/2 text-slate-300"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Sold">Sold</option>
                            <option value="Retained">Retained</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Chest */}
                    <div className="bg-slate-950 p-3 border border-slate-850 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sellChestCheck"
                          checked={sellChest}
                          onChange={(e) => setSellChest(e.target.checked)}
                          className="rounded text-teal-550 text-emerald-500 bg-slate-900 border-slate-800 h-4 w-4 cursor-pointer"
                        />
                        <label htmlFor="sellChestCheck" className="text-[11px] font-bold text-slate-200 cursor-pointer">Sell Chest (বুক)</label>
                      </div>
                      {sellChest && (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={chestPrice}
                            onChange={(e) => setChestPrice(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-[11px] rounded p-1.5 w-1/2 text-white font-bold"
                            placeholder="Price (₹)"
                          />
                          <select
                            value={chestStatus}
                            onChange={(e: any) => setChestStatus(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-[10px] rounded p-1.5 w-1/2 text-slate-300"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Sold">Sold</option>
                            <option value="Retained">Retained</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Intestine */}
                    <div className="bg-slate-950 p-3 border border-slate-850 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sellIntestineCheck"
                          checked={sellIntestine}
                          onChange={(e) => setSellIntestine(e.target.checked)}
                          className="rounded text-teal-550 text-emerald-500 bg-slate-900 border-slate-800 h-4 w-4 cursor-pointer"
                        />
                        <label htmlFor="sellIntestineCheck" className="text-[11px] font-bold text-slate-200 cursor-pointer">Sell Intestine (ভুঁড়ি)</label>
                      </div>
                      {sellIntestine && (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={intestinePrice}
                            onChange={(e) => setIntestinePrice(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-[11px] rounded p-1.5 w-1/2 text-white font-bold"
                            placeholder="Price (₹)"
                          />
                          <select
                            value={intestineStatus}
                            onChange={(e: any) => setIntestineStatus(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-[10px] rounded p-1.5 w-1/2 text-slate-300"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Sold">Sold</option>
                            <option value="Retained">Retained</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Legs */}
                    <div className="bg-slate-950 p-3 border border-slate-850 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sellLegsCheck"
                          checked={sellLegs}
                          onChange={(e) => setSellLegs(e.target.checked)}
                          className="rounded text-teal-550 text-emerald-500 bg-slate-900 border-slate-800 h-4 w-4 cursor-pointer"
                        />
                        <label htmlFor="sellLegsCheck" className="text-[11px] font-bold text-slate-200 cursor-pointer">Sell Legs (পায়া)</label>
                      </div>
                      {sellLegs && (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={legsPrice}
                            onChange={(e) => setLegsPrice(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-[11px] rounded p-1.5 w-1/2 text-white font-bold"
                            placeholder="Price (₹)"
                          />
                          <select
                            value={legsStatus}
                            onChange={(e: any) => setLegsStatus(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-[10px] rounded p-1.5 w-1/2 text-slate-300"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Sold">Sold</option>
                            <option value="Retained">Retained</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Processing / Slaughter Date
                    </label>
                    <input
                      type="date"
                      required
                      value={slaughterDateInput}
                      onChange={(e) => setSlaughterDateInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Quality Marks / Observations
                    </label>
                    <input
                      placeholder="Carcass fat cover level, grade, feed starved note."
                      value={slaughterNotes}
                      onChange={(e) => setSlaughterNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setSlaughteringDispatch(null)}
                  className="w-1/3 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 py-3 rounded-xl transition duration-150 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl transition duration-150 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  Confirm & Payout Portions Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISPATCH NEW CATTLE SUBVIEW FORM */}
      {activeTab === "dispatch" && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-6">
          <div className="pb-3 border-b border-slate-900">
            <h4 className="text-sm font-black text-white">Create New Cattle Dispatch Gateway Pass</h4>
            <p className="text-[11px] text-slate-400 mt-1">Select alive/live inventory records and allocate directly to the specified retail block layout.</p>
          </div>

          {activeAnimals.length === 0 ? (
            <div className="p-12 border border-dashed border-slate-900 rounded-3xl text-center text-slate-500 text-xs font-mono">
              All inventory heads are processed! No live cattle currently available in pasture registry to dispatch.
            </div>
          ) : (
            <form onSubmit={handleDispatchSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-mono">
              <div className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                    Select Live Cattle Target *
                  </label>
                  <select
                    required
                    value={selectedAnimalId}
                    onChange={(e) => setSelectedAnimalId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Choose active animal --</option>
                    {activeAnimals.map(ani => (
                      <option key={ani.id} value={ani.id}>
                        {ani.id} - {ani.type} ({ani.breed}), Weight: {ani.weightKg}kg [Owner: {ani.owner}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                    Butcher Shop / Outlet Destination *
                  </label>
                  <select
                    required
                    value={selectedShop}
                    onChange={(e) => setSelectedShop(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {outlets.map((out, i) => (
                      <option key={i} value={out}>{out}</option>
                    ))}
                    <option value="Custom">-- Register New Custom Outlet --</option>
                  </select>
                </div>

                {selectedShop === "Custom" && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                      Enter Custom Butcher Shop Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhanmondi Premium Beef Center"
                      value={customShop}
                      onChange={(e) => setCustomShop(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                      Dressing Yield Estimate (%) *
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="20"
                        max="90"
                        required
                        value={dressingPercentage}
                        onChange={(e) => setDressingPercentage(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-center font-bold"
                      />
                      <span className="absolute right-3.5 text-[10px] text-zinc-500">%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                      Dispatch Date
                    </label>
                    <input
                      type="date"
                      required
                      value={dispatchDate}
                      onChange={(e) => setDispatchDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                    Dispatch Gate-Pass Instructions / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={dispatchNotes}
                    onChange={(e) => setDispatchNotes(e.target.value)}
                    placeholder="Provide feed starvation compliance, transport logs, or special handling conditions."
                    className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-3 rounded-2xl transition shadow-lg text-xs"
                >
                  Generate Gate-Pass & Dispatch Cattle
                </button>
              </div>

              {/* ESTIMATION LIVE VISUALIZATION */}
              <div className="border border-slate-850 bg-slate-950 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                <div>
                  <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Scale className="h-4 w-4 text-teal-400" />
                    Carcass Yield Live Forecast Model
                  </h5>
                  <p className="text-[10px] text-slate-500">
                    Calculated using standard biological dressing guidelines for high accuracy across retail counters.
                  </p>
                </div>

                {selectedAnimalObj ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                        <span className="text-[9px] uppercase text-slate-500 select-none">Live Cattle Weight</span>
                        <p className="text-base font-extrabold text-white mt-1">{selectedAnimalObj.weightKg} kg</p>
                      </div>
                      <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                        <span className="text-[9px] uppercase text-slate-500 select-none">Dressing Target Yield</span>
                        <p className="text-base font-extrabold text-teal-400 mt-1">{calculatedEstimatedYield} kg</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Carcass Dressing efficiency ratio</span>
                        <span>{dressingPercentage}%</span>
                      </div>
                      <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-teal-500 transition-all duration-300" 
                          style={{ width: `${dressingPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-850 space-y-1.5 text-[10px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Predicted Prime Trimmings:</span>
                        <strong className="text-teal-400 font-bold">{Math.round(calculatedEstimatedYield * 0.65)} kg</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Bone Weight Allocation:</span>
                        <strong className="text-slate-300 font-bold">{Math.round(calculatedEstimatedYield * 0.25)} kg</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Organs/Offals:</span>
                        <strong className="text-slate-300 font-bold">{Math.round(calculatedEstimatedYield * 0.10)} kg</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center border border-dashed border-slate-900 rounded-2xl text-slate-500 text-[11px]">
                    Select a target animal in the form to initialize dressing yield forecast bars.
                  </div>
                )}

                <div className="text-[10px] text-slate-500 bg-slate-900/40 p-3 border border-slate-850 rounded-xl leading-relaxed">
                  <strong>Biological Guidelines:</strong> Cows/beef type averages around 58% dressing, while murrah buffalos and local breeds yields around 55%. Goat/premium mutton carcasses average around 50%.
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* DASHBOARD GRAPH / YIELD METRICS VIEW */}
      {activeTab === "dashboard" && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-6">
          <div className="pb-3 border-b border-slate-900">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-400" />
              Outlet Performance & Yield Variance Analytics
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Compare forecasted biological estimated meat yield against actual physical carcass weighing values booked at checkout counters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visual Comparative Chart Card */}
            <div className="bg-slate-900/50 p-6 border border-slate-850 rounded-2xl space-y-4">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest block font-sans">
                Yield Comparison: Estimated vs. Actual (kg)
              </h5>

              {completedDispatches.length === 0 ? (
                <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  Log at least one completed slaughter to view comparison bar charts.
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {completedDispatches.slice(0, 5).map(disp => (
                    <div key={disp.id} className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-slate-300 font-bold">{disp.id}: {disp.breed} ({disp.shopName})</span>
                        <div className="flex gap-2">
                          <span className="text-slate-500">Est: {disp.estimatedYield}</span>
                          <span className="text-teal-400 font-bold">Act: {disp.actualYield} kg</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {/* Estimated bar */}
                        <div className="relative w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                          <div 
                            className="absolute left-0 top-0 bottom-0 bg-slate-600 transition-all duration-300" 
                            style={{ width: `${Math.min(100, (disp.estimatedYield / disp.liveWeight) * 100)}%` }}
                          />
                        </div>
                        {/* Actual bar */}
                        <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                          <div 
                            className="absolute left-0 top-0 bottom-0 bg-teal-500 transition-all duration-300" 
                            style={{ width: `${Math.min(100, (disp.actualYield! / disp.liveWeight) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end gap-4 text-[10px] font-sans font-bold select-none pt-2">
                    <span className="flex items-center gap-1 text-slate-500">
                      <span className="w-2 h-2 bg-slate-605 bg-slate-600 rounded-full" /> Biological Estimated Yield
                    </span>
                    <span className="flex items-center gap-1 text-teal-400">
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" /> Actual Sliced Yield
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Performance Variance analysis breakdown */}
            <div className="bg-slate-900/50 p-6 border border-slate-850 rounded-2xl space-y-4">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest block font-sans">
                Variance Registry Audit
              </h5>
              
              <div className="space-y-3">
                {completedDispatches.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    Variance report list is calculated when slaughter is active.
                  </div>
                ) : (
                  completedDispatches.map(disp => {
                    const variance = disp.actualYield! - disp.estimatedYield;
                    const isPositive = variance >= 0;

                    return (
                      <div 
                        key={disp.id}
                        className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="text-slate-200 font-bold">{disp.id} - {disp.shopName}</div>
                          <span className="text-[10px] text-slate-500 font-mono">Animal {disp.animalId} • Live weight {disp.liveWeight}kg</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-mono font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                            {isPositive ? "+" : ""}{variance.toFixed(1)} kg
                          </div>
                          <span className="text-[9px] text-slate-500">
                            {isPositive ? "Excess Output" : "Under Yield"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
