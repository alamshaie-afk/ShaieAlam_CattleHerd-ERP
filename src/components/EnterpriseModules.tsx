import React, { useState } from "react";
import { 
  Shield, Truck, Tag, Users, BarChart2, PieChart, Brain, Globe, 
  Settings, FolderLock, Plus, Trash, AlertTriangle, Check, Mail, 
  Calendar, DollarSign, Activity, FileText, TrendingUp, Sliders, Info, Clock, ExternalLink
} from "lucide-react";
import { Animal, Transaction, Sale, ColdStorageItem, User, Freezer, FreezerElectricityBill } from "../types";

interface EnterpriseModulesProps {
  lang: "en" | "bn";
  currentUser: User;
  animals: Animal[];
  sales: Sale[];
  transactions: Transaction[];
  feedInventory: any[];
  coldStorageInventory: ColdStorageItem[];
  setColdStorageInventory: React.Dispatch<React.SetStateAction<ColdStorageItem[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  activeSubTab: string;
}

// ==========================================
// 5. COLD STORAGE MANAGEMENT MODULE
// ==========================================
export function ColdStorageModule({ 
  lang, coldStorageInventory, setColdStorageInventory, setTransactions, currentUser,
  freezers = [], setFreezers, freezerBills = [], setFreezerBills
}: { 
  lang: "en" | "bn"; 
  coldStorageInventory: ColdStorageItem[]; 
  setColdStorageInventory: React.Dispatch<React.SetStateAction<ColdStorageItem[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currentUser: User;
  freezers: Freezer[];
  setFreezers: React.Dispatch<Freezer[] | ((prev: Freezer[]) => Freezer[])>;
  freezerBills: FreezerElectricityBill[];
  setFreezerBills: React.Dispatch<FreezerElectricityBill[] | ((prev: FreezerElectricityBill[]) => FreezerElectricityBill[])>;
}) {
  const [csSubTab, setCsSubTab] = useState<"inventory" | "freezers" | "electricity">("inventory");
  const [showAddForm, setShowAddForm] = useState(false);
  const [batchId, setBatchId] = useState("");
  const [itemType, setItemType] = useState("Premium Beef Tenderloin");
  const [totalKg, setTotalKg] = useState(150);
  const [temperatureCs, setTemperatureCs] = useState(-18.5);
  const [storageBin, setStorageBin] = useState("Zone B - Freezer Rack 4");
  const [packagingType, setPackagingType] = useState("Vacuum Cryovac Big pack");
  const [notes, setNotes] = useState("");
  const [assignedFreezerId, setAssignedFreezerId] = useState(freezers[0]?.id || "FRZ-001");

  // Transfer states
  const [transferRingItem, setTransferRingItem] = useState<ColdStorageItem | null>(null);
  const [destinationFreezerId, setDestinationFreezerId] = useState("");

  // Add Freezer states
  const [showAddFreezerForm, setShowAddFreezerForm] = useState(false);
  const [newFid, setNewFid] = useState("");
  const [newFname, setNewFname] = useState("");
  const [newFcap, setNewFcap] = useState(1000);
  const [newFtemp, setNewFtemp] = useState(-18.0);
  const [newFnotes, setNewFnotes] = useState("");

  // Add Electricity Bill states
  const [showAddBillForm, setShowAddBillForm] = useState(false);
  const [billFrKey, setBillFrKey] = useState(freezers[0]?.id || "FRZ-001");
  const [billMonth, setBillMonth] = useState("2026-06");
  const [billKwh, setBillKwh] = useState(1200);
  const [billAmountVal, setBillAmountVal] = useState(9600);
  const [billNotes, setBillNotes] = useState("");
  const [billStatus, setBillStatus] = useState<"Paid" | "Pending">("Pending");

  // Selected filter
  const [selectedFreezerFilter, setSelectedFreezerFilter] = useState("All");

  // Occupancy / Storage helpers
  const getFreezerStoredWeight = (frId: string) => {
    return coldStorageInventory
      .filter(item => item.freezerId === frId && item.status !== "Dispatched")
      .reduce((acc, item) => acc + item.totalKg, 0);
  };

  const totalActiveWeight = coldStorageInventory
    .filter(item => item.status !== "Dispatched")
    .reduce((acc, item) => acc + item.totalKg, 0);

  const totalActiveCapacity = freezers
    .filter(f => f.status === "Active")
    .reduce((acc, f) => acc + f.capacityKg, 0);

  const capacityPct = totalActiveCapacity > 0 
    ? Math.round((totalActiveWeight / totalActiveCapacity) * 100) 
    : 0;

  // Recent Month Electricity Expense calculation
  const recentMonthBills = freezerBills.filter(b => b.month === "2026-05");
  const totalRecentBillAmount = recentMonthBills.reduce((acc, b) => acc + b.billAmount, 0);
  const totalRecentKwh = recentMonthBills.reduce((acc, b) => acc + b.kWhConsumed, 0);

  // Ingress lot creation handler
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) return;

    // Capacity limitation validation
    const targetF = freezers.find(f => f.id === assignedFreezerId);
    if (targetF) {
      const currentStored = getFreezerStoredWeight(assignedFreezerId);
      if (currentStored + totalKg > targetF.capacityKg) {
        alert(lang === "bn"
          ? `ভুল: নির্বাচিত ফ্রিজারে পর্যাপ্ত ধারণক্ষমতা নেই! অবশিষ্ট স্থান: ${targetF.capacityKg - currentStored} কেজি, ইনটেক কারার প্রচেষ্টা: ${totalKg} কেজি।`
          : `Error: Selected freezer lacks sufficient capacity! Space left: ${targetF.capacityKg - currentStored} Kg, Attempted intake: ${totalKg} Kg.`
        );
        return;
      }
    }

    const newItem: ColdStorageItem = {
      id: `COLD-${Math.floor(100 + Math.random() * 900)}`,
      batchId,
      itemType,
      totalKg,
      frozenDate: new Date().toISOString().slice(0, 10),
      expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      temperatureCs,
      storageBin,
      packagingType,
      status: "Frozen",
      notes,
      freezerId: assignedFreezerId
    };

    setColdStorageInventory(prev => [newItem, ...prev]);
    setShowAddForm(false);
    setBatchId("");
    setNotes("");

    // Create a transaction of operational maintenance cost in the ERP general ledger
    const logTx: Transaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      type: "Expense",
      category: "Operational",
      amount: totalKg * 2.5, // cold storage loading fee
      date: new Date().toISOString().slice(0, 10),
      description: `Cold storage intake: ${totalKg}Kg of ${itemType} assigned to ${targetF?.name || assignedFreezerId}`,
      department: "Cold Storage"
    };
    setTransactions(prev => [logTx, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: "Frozen" | "Defrosting" | "Dispatched") => {
    setColdStorageInventory(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  // Freezer unit creation handler
  const handleCreateFreezer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFid || !newFname) return;

    // Check duplicate ID
    if (freezers.some(f => f.id.toLowerCase() === newFid.toLowerCase())) {
      alert(lang === "bn" ? "ভুল: এই ফ্রিজার আইডি ইতিমধ্যে বিদ্যমান!" : "Error: This freezer ID already exists!");
      return;
    }

    const newFreezer: Freezer = {
      id: newFid,
      name: newFname,
      capacityKg: newFcap,
      status: "Active",
      targetTempCs: newFtemp,
      notes: newFnotes
    };

    setFreezers((prev: Freezer[]) => [...prev, newFreezer]);
    setShowAddFreezerForm(false);
    setNewFid("");
    setNewFname("");
    setNewFnotes("");

    // Audit logs transaction
    const logTx: Transaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      type: "Expense",
      category: "Operational",
      amount: newFcap * 15, // Asset value estimate / maintenance budget allocation
      date: new Date().toISOString().slice(0, 10),
      description: `Capital asset registry: Installed new freezer unit ${newFname} (capacity: ${newFcap} Kg)`,
      department: "Cold Storage"
    };
    setTransactions(prev => [logTx, ...prev]);
  };

  // Add Electricity bill handler
  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();

    const newBill: FreezerElectricityBill = {
      id: `EBILL-${Math.floor(100 + Math.random() * 900)}`,
      freezerId: billFrKey,
      month: billMonth,
      kWhConsumed: billKwh,
      billAmount: billAmountVal,
      status: billStatus,
      notes: billNotes,
      paymentDate: billStatus === "Paid" ? new Date().toISOString().slice(0, 10) : undefined
    };

    setFreezerBills((prev: FreezerElectricityBill[]) => [newBill, ...prev]);
    setShowAddBillForm(false);
    setBillNotes("");

    if (billStatus === "Paid") {
      const targetFr = freezers.find(f => f.id === billFrKey);
      const logTx: Transaction = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        type: "Expense",
        category: "Operational",
        amount: billAmountVal,
        date: new Date().toISOString().slice(0, 10),
        description: `Utility bill payment: ${targetFr?.name || billFrKey} for month ${billMonth}`,
        department: "Cold Storage"
      };
      setTransactions(prev => [logTx, ...prev]);
    }
  };

  // Pay existing bill
  const handlePayBill = (billId: string) => {
    setFreezerBills((prev: FreezerElectricityBill[]) => prev.map(b => {
      if (b.id === billId) {
        const updated = { ...b, status: "Paid" as const, paymentDate: new Date().toISOString().slice(0, 10) };
        const fObj = freezers.find(fr => fr.id === b.freezerId);

        // Record expense transaction in ERP ledger
        const logTx: Transaction = {
          id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
          type: "Expense",
          category: "Operational",
          amount: b.billAmount,
          date: new Date().toISOString().slice(0, 10),
          description: `Utility bill paid: ${fObj?.name || b.freezerId} (${b.month})`,
          department: "Cold Storage"
        };
        setTransactions(prev => [logTx, ...prev]);
        return updated;
      }
      return b;
    }));
  };

  // Delete inventory item helper
  const handleDeleteItem = (id: string) => {
    if (confirm(lang === "bn" ? "আপনি কি নিশ্চিত যে আপনি এটি মুছে ফেলতে চান?" : "Are you sure you want to remove this item?")) {
      setColdStorageInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Key Performance Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase font-mono text-slate-500 font-extrabold block">
              {lang === "bn" ? "মোট সংরক্ষিত ওজন" : "TOTAL COLD STOCK"}
            </span>
            <span className="text-xl font-black text-rose-450 font-mono block mt-1">
              {totalActiveWeight.toLocaleString()} Kg
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono mt-1 block">
            {lang === "bn" ? "সক্রিয় ফ্রিজ উপাদান পরিমাণ" : "Active frozen lots on-shelf"}
          </span>
        </div>

        <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase font-mono text-slate-500 font-extrabold">
                {lang === "bn" ? "সক্রিয় ধারণক্ষমতা ব্যবহার" : "CAPACITY UTILIZATION"}
              </span>
              <span className="text-xs font-mono font-bold text-teal-400">{capacityPct}%</span>
            </div>
            <span className="text-xl font-black text-teal-400 font-mono block mt-1">
              {totalActiveCapacity.toLocaleString()} Kg {lang === "bn" ? "ধারণক্ষমতা" : "Limit"}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-500 h-1.5 transition-all duration-500" style={{ width: `${capacityPct}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase font-mono text-slate-500 font-extrabold block">
              {lang === "bn" ? "বিদ্যুৎ খরচ (মে ২০২৬)" : "ENERGY OVERHEAD (MAY 2026)"}
            </span>
            <span className="text-xl font-black text-indigo-400 font-mono block mt-1">
              ৳ {totalRecentBillAmount.toLocaleString()} BDT
            </span>
          </div>
          <span className="text-[9px] text-indigo-400 font-mono mt-1 block">
            ⚡ {totalRecentKwh.toLocaleString()} kWh {lang === "bn" ? "বিদ্যুৎ খরচ" : "Electricity Consumed"}
          </span>
        </div>
      </div>

      {/* Internal Module Level Navigation Selector */}
      <div className="flex border-b border-slate-800 gap-2 mb-6">
        <button 
          onClick={() => setCsSubTab("inventory")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider transition border-b-2 cursor-pointer ${
            csSubTab === "inventory" 
              ? "border-teal-500 text-teal-400" 
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          {lang === "bn" ? "🥩 মাংস স্টক ও ইনটেক" : "🥩 Storage Stock & Ingress"}
        </button>
        <button 
          onClick={() => setCsSubTab("freezers")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider transition border-b-2 cursor-pointer ${
            csSubTab === "freezers" 
              ? "border-teal-500 text-teal-400" 
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          {lang === "bn" ? "❄️ ফ্রিজার রেজিস্ট্রি ও পরিমাপ" : "❄️ Freezer Registries & Capacity"}
        </button>
        <button 
          onClick={() => setCsSubTab("electricity")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider transition border-b-2 cursor-pointer ${
            csSubTab === "electricity" 
              ? "border-teal-500 text-teal-400" 
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          {lang === "bn" ? "⚡ বিদ্যুৎ বিল ও এনার্জি লেজার" : "⚡ Electricity & Power Bills"}
        </button>
      </div>

      {/* SUBTAB 1: STORAGE INVENTORY & INGRESS */}
      {csSubTab === "inventory" && (
        <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-black text-white font-mono uppercase">
                {lang === "bn" ? "মাংস সংরক্ষণ গুদাম ও ফ্রিজার বন্টন" : "Meat Storage Logs & Freezer Allocation"}
              </h3>
              <p className="text-[9px] text-slate-400">
                {lang === "bn" 
                  ? "সংরক্ষিত মাংসের লট, মেয়াদ শেষ হওয়ার সময়সূচী এবং ফ্রিজার স্থানান্তর পরিচালনা করুন।" 
                  : "Manage frozen meat lots, refrigeration temperature alerts, expiry dates, and freezer units."}
              </p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-lg text-[9.5px] uppercase font-mono cursor-pointer transition"
            >
              {showAddForm 
                ? (lang === "bn" ? "বাতিল করুন" : "Cancel Intake") 
                : (lang === "bn" ? "🥩 নতুন মিট লট ইনটেক" : "🥩 Intake Meat Lot")}
            </button>
          </div>

          {/* Intake Intake Form block */}
          {showAddForm && (
            <form onSubmit={handleCreate} className="bg-slate-950 p-4 border border-slate-850 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "ব্যাচ / পশু রেফারেন্স আইডি" : "Batch / Animal Ref ID"}
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. BTC-4021" 
                  value={batchId} 
                  onChange={e => setBatchId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "মাংসের ধরণ ও শ্রেণী" : "Meat Cut Type"}
                </label>
                <select 
                  value={itemType} 
                  onChange={e => setItemType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="Premium Beef Tenderloin">Premium Beef Tenderloin</option>
                  <option value="Choice Beef Sirloin">Choice Beef Sirloin</option>
                  <option value="Premium Ribeye Standard">Premium Ribeye Standard</option>
                  <option value="Whole Poultry Broiler Cleaned">Whole Poultry Broiler Cleaned</option>
                  <option value="Cattle By-product / Offal Lot">Cattle By-product / Offal Lot</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "মোট ওজন (কেজি)" : "Total Weight (Kg)"}
                </label>
                <input 
                  type="number" 
                  value={totalKg} 
                  onChange={e => setTotalKg(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "নির্ধারিত ফ্রিজার ইউনিট" : "Assigned Freezer Unit"}
                </label>
                <select 
                  value={assignedFreezerId}
                  onChange={e => {
                    setAssignedFreezerId(e.target.value);
                    const chosen = freezers.find(f => f.id === e.target.value);
                    if (chosen) setTemperatureCs(chosen.targetTempCs);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                >
                  {freezers.map(f => {
                    const stored = getFreezerStoredWeight(f.id);
                    const available = f.capacityKg - stored;
                    return (
                      <option key={f.id} value={f.id} disabled={f.status !== "Active"}>
                        {f.name} ({lang === "bn" ? "অবশিষ্ট ওজন" : "Available"}: {available} Kg / {f.capacityKg} Kg)
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "ফ্রিজার বিন কলাম / শেলফ নাম্বার" : "Bin Zone / Shelf Slot"}
                </label>
                <input 
                  type="text" 
                  value={storageBin} 
                  onChange={e => setStorageBin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "নির্ধারিত ফ্রিজার তাপমাত্রা (°C)" : "Freezer Temp (°C)"}
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={temperatureCs} 
                  onChange={e => setTemperatureCs(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "প্যাকেজিং স্ট্যান্ডার্ড" : "Packaging Standard"}
                </label>
                <input 
                  type="text" 
                  value={packagingType} 
                  onChange={e => setPackagingType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "কোয়ালিটি ও অবস্থা নোট" : "Quality Ingress Notes"}
                </label>
                <input 
                  type="text" 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Carcass pH checked and sealed."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase rounded-lg cursor-pointer transition text-[10px]"
                >
                  {lang === "bn" ? "সংরক্ষণ কাজ নিশ্চিত করুন" : "Confirm Lot Intake & Store"}
                </button>
              </div>
            </form>
          )}

          {/* Transfer interactive widget */}
          {transferRingItem && (
            <div className="bg-slate-950 p-4 border border-amber-500/45 rounded-xl mb-4 text-xs font-mono space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-amber-500 font-bold uppercase text-[9.5px]">
                  {lang === "bn" ? "ফ্রিজার পরিবর্তন ও নতুন স্থানাংক" : "🚚 Migrate Storage Freezer Unit"}
                </span>
                <button 
                  onClick={() => setTransferRingItem(null)} 
                  className="text-slate-500 hover:text-white uppercase text-[9px] font-black"
                >
                  {lang === "bn" ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                {lang === "bn" 
                  ? `লট ${transferRingItem.id} (${transferRingItem.itemType} - ${transferRingItem.totalKg} কেজি) বর্তমানে ${freezers.find(f => f.id === transferRingItem.freezerId)?.name || 'অপরিচিত'} ফ্রিজারে আছে। এটিকে অন্য চালু ফ্রিজারে নিয়ে যান:`
                  : `Lot ${transferRingItem.id} (${transferRingItem.itemType} - ${transferRingItem.totalKg} Kg) is currently inside ${freezers.find(f => f.id === transferRingItem.freezerId)?.name || 'Unknown'}. Reassign to:`}
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={destinationFreezerId}
                  onChange={e => setDestinationFreezerId(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white px-2.5 py-1.5 rounded text-[11px]"
                >
                  <option value="">-- {lang === "bn" ? "গন্তব্য ফ্রিজার নির্বাচন করুন" : "Select target freezer"} --</option>
                  {freezers.filter(f => f.id !== transferRingItem.freezerId && f.status === "Active").map(f => {
                    const stored = getFreezerStoredWeight(f.id);
                    const av = f.capacityKg - stored;
                    return (
                      <option key={f.id} value={f.id}>
                        {f.name} ({lang === "bn" ? "অবশিষ্ট ক্ষমতা" : "Space Left"}: {av} Kg)
                      </option>
                    );
                  })}
                </select>
                <button
                  onClick={() => {
                    if (!destinationFreezerId) return;
                    const destF = freezers.find(f => f.id === destinationFreezerId);
                    if (destF) {
                      const currentStored = getFreezerStoredWeight(destinationFreezerId);
                      if (currentStored + transferRingItem.totalKg > destF.capacityKg) {
                        alert(lang === "bn" 
                          ? `গন্তব্য ফ্রিজারে জায়গা সংকট! উপলব্ধ রয়েছে মাত্র ${destF.capacityKg - currentStored} কেজি।`
                          : `Selected freezer has insufficient volume! Stored: ${currentStored} Kg, Available: ${destF.capacityKg - currentStored} Kg.`);
                        return;
                      }
                    }
                    setColdStorageInventory(prev => prev.map(it => it.id === transferRingItem.id ? { ...it, freezerId: destinationFreezerId } : it));
                    
                    const origFreezer = freezers.find(f => f.id === transferRingItem.freezerId);
                    const targetFreezer = freezers.find(f => f.id === destinationFreezerId);
                    
                    // Transaction logged
                    const logTx: Transaction = {
                      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
                      type: "Expense",
                      category: "Operational",
                      amount: 150, // transfer labor fee
                      date: new Date().toISOString().slice(0, 10),
                      description: `Meat Lot relocation: Lot ${transferRingItem.id} moved from ${origFreezer?.name || 'original'} to ${targetFreezer?.name || 'new freezer'}`,
                      department: "Cold Storage"
                    };
                    setTransactions(prev => [logTx, ...prev]);

                    setTransferRingItem(null);
                    setDestinationFreezerId("");
                  }}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded uppercase text-[10px]"
                >
                  {lang === "bn" ? "স্থানান্তর নিশ্চিত করুন" : "Execute Migration"}
                </button>
              </div>
            </div>
          )}

          {/* Storage lots table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10.5px] border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="p-3 pl-4">{lang === "bn" ? "লট আইডি" : "LOT ID"}</th>
                  <th className="p-3">{lang === "bn" ? "মাংসের বিবরণ ও প্রকার" : "MEAT LOT SPECIE"}</th>
                  <th className="p-3">{lang === "bn" ? "ওজন" : "WEIGHT"}</th>
                  <th className="p-3">{lang === "bn" ? "ফ্রিজার ইউনিট / শেলফ " : "FREEZER & BIN ZONE"}</th>
                  <th className="p-3">{lang === "bn" ? "মেয়াদোত্তীর্ণ দিন" : "EXPIRED IN"}</th>
                  <th className="p-3">{lang === "bn" ? "সংরক্ষণ তাপমাত্রা" : "TEMP"}</th>
                  <th className="p-3">{lang === "bn" ? "অবস্থা" : "STATUS"}</th>
                  <th className="p-3 pr-4 text-right">{lang === "bn" ? "ব্যবস্থাপনা" : "OPERATION"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {coldStorageInventory.map((item) => {
                  const daysRemaining = Math.max(0, Math.round((new Date(item.expiryDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
                  const assocFreezer = freezers.find(f => f.id === item.freezerId);

                  return (
                    <tr key={item.id} className="hover:bg-slate-950/40 transition">
                      <td className="p-3 pl-4 text-slate-300 font-extrabold">
                        {item.id}
                        <span className="block text-[8.5px] text-slate-500 font-normal">{item.batchId}</span>
                      </td>
                      <td className="p-3 text-white font-semibold">
                        {item.itemType}
                        {item.notes && <span className="block text-[8px] text-slate-500 font-normal mt-0.5">{item.notes}</span>}
                      </td>
                      <td className="p-3 text-rose-400 font-bold">{item.totalKg} Kg</td>
                      <td className="p-3 text-slate-300">
                        <span className="text-teal-400 font-bold block text-[10px] truncate max-w-[160px]">
                          {assocFreezer ? assocFreezer.name : "Unassigned Unit"}
                        </span>
                        <span className="text-[9px] text-slate-500">{item.storageBin}</span>
                      </td>
                      <td className={`p-3 font-semibold ${daysRemaining < 15 ? "text-rose-450 animate-pulse" : "text-amber-500"}`}>
                        {daysRemaining} {lang === "bn" ? "দিন বাকি" : "days"}
                        <span className="block text-[8px] text-slate-500 font-normal">{item.expiryDate}</span>
                      </td>
                      <td className="p-3 text-indigo-400 font-bold">{item.temperatureCs ?? "-18.0"}°C</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase leading-tight ${
                          item.status === "Frozen" ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" :
                          item.status === "Defrosting" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                          "bg-slate-800 text-slate-550 border border-slate-850"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 pr-4 text-right">
                        {item.status !== "Dispatched" ? (
                          <div className="flex justify-end gap-1 text-[9px] flex-wrap md:flex-nowrap">
                            <button 
                              onClick={() => {
                                setTransferRingItem(item);
                                setDestinationFreezerId("");
                              }}
                              title="Migrate freezer unit"
                              className="bg-teal-500/10 hover:bg-teal-500/25 border border-teal-500/30 text-teal-400 px-1.5 py-0.5 rounded uppercase font-black"
                            >
                              🚚 Transfer
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(item.id, "Defrosting")} 
                              className="bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 px-1.5 py-0.5 rounded uppercase font-black"
                            >
                              Defrost
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(item.id, "Dispatched")} 
                              className="bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded uppercase font-black"
                            >
                              Dispatch
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-slate-500 hover:text-rose-400 px-1 py-0.5 transition"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end items-center gap-2">
                            <span className="text-slate-600 italic text-[9px]">{lang === "bn" ? "সরবরাহকৃত" : "Dispatched out"}</span>
                            <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-slate-600 hover:text-rose-400 p-0.5 transition"
                            >
                              <Trash className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: FREEZER UNIT REGISTRY & CAPACITIES */}
      {csSubTab === "freezers" && (
        <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-black text-white font-mono uppercase">
                {lang === "bn" ? "অপারেশনাল ফ্রিজার ইউনিট রেজিষ্ট্রি" : "Operational Freezer Registries"}
              </h3>
              <p className="text-[9px] text-slate-400">
                {lang === "bn" 
                  ? "সক্রিয় ও রক্ষণাবেক্ষণাধীন বিদ্যুৎ চালিত ফ্রিজার ইউনিট এবং ধারণক্ষমতার হিসেব রক্ষা করুন।" 
                  : "Track inventory weights, temperature levels, and live storage limits for each freezer unit."}
              </p>
            </div>
            <button 
              onClick={() => setShowAddFreezerForm(!showAddFreezerForm)}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-lg text-[9.5px] uppercase font-mono cursor-pointer transition"
            >
              {showAddFreezerForm 
                ? (lang === "bn" ? "ফরম বন্ধ করুন" : "Cancel Setup") 
                : (lang === "bn" ? "❄️ নতুন ফ্রিজার সংযোগ" : "❄️ Install New Freezer")}
            </button>
          </div>

          {/* Setup new freezer form */}
          {showAddFreezerForm && (
            <form onSubmit={handleCreateFreezer} className="bg-slate-950 p-4 border border-slate-850 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "ফ্রিজার আইডি (ইউনিক)" : "Freezer Unit ID (Unique)"}
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. FRZ-005" 
                  value={newFid} 
                  onChange={e => setNewFid(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "ফ্রিজার নাম / লেবেল" : "Freezer Label Name"}
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Walk-In Gamma (Poultry)" 
                  value={newFname} 
                  onChange={e => setNewFname(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "সর্বোচ্চ ধারণক্ষমতা (কেজি)" : "Storage Capacity (Kg)"}
                </label>
                <input 
                  type="number" 
                  value={newFcap} 
                  onChange={e => setNewFcap(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "লক্ষ্য তাপমাত্রা (°C)" : "Target Temperature Cs (°C)"}
                </label>
                <input 
                  type="number" 
                  value={newFtemp} 
                  onChange={e => setNewFtemp(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
              <div className="md:col-span-4">
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "মন্তব্য ও কারিগরী বিবরণ" : "System Description / Notes"}
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Heavy-duty double compressor system, holds beef primals." 
                  value={newFnotes} 
                  onChange={e => setNewFnotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase rounded-lg cursor-pointer transition text-[10px]"
                >
                  {lang === "bn" ? "ফ্রিজার সংযুক্ত করুন" : "Initialize Asset Unit"}
                </button>
              </div>
            </form>
          )}

          {/* Grid of Freezers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freezers.map(f => {
              const currentStored = getFreezerStoredWeight(f.id);
              const pct = f.capacityKg > 0 ? Math.min(100, Math.round((currentStored / f.capacityKg) * 100)) : 0;
              const storedLots = coldStorageInventory.filter(item => item.freezerId === f.id && item.status !== "Dispatched");
              
              // Latest monthly bills for efficiency calculation
              const unitBills = freezerBills.filter(b => b.freezerId === f.id);
              const totalKwhPaid = unitBills.reduce((acc, b) => acc + b.kWhConsumed, 0);

              return (
                <div key={f.id} className="bg-slate-950 rounded-2xl p-4 border border-slate-850 space-y-4 font-mono text-xs text-slate-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {f.id}
                        </span>
                        <span className={`h-2 w-2 rounded-full ${
                          f.status === "Active" ? "bg-emerald-500" :
                          f.status === "Maintenance" ? "bg-amber-500" : "bg-rose-500"
                        }`}></span>
                        <span className="text-[9.5px] uppercase font-bold text-slate-400">{f.status}</span>
                      </div>
                      <h4 className="text-sm font-black text-white mt-1.5 leading-none">{f.name}</h4>
                      {f.notes && <p className="text-[9.5px] text-slate-500 mt-1 font-sans">{f.notes}</p>}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-black text-indigo-400 block tracking-wider">
                        {f.targetTempCs}°C
                      </span>
                      <span className="text-[9px] text-slate-500 block">TARGET</span>
                    </div>
                  </div>

                  {/* Operational Status Toggles & Details */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850/60 text-[9.5px]">
                    <div>
                      <span className="text-slate-500 block uppercase text-[8px]">{lang === "bn" ? "তাপমাত্রা ট্রিগার" : "STATUS ADJUST"}</span>
                      <select 
                        value={f.status} 
                        onChange={(e) => {
                          const status = e.target.value as any;
                          setFreezers((prev: Freezer[]) => prev.map(unit => unit.id === f.id ? { ...unit, status } : unit));
                        }}
                        className="bg-slate-950 border border-slate-850 text-slate-300 rounded p-1 text-[9px] mt-1 cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Decommissioned">Decommissioned</option>
                      </select>
                    </div>

                    <div className="text-right flex flex-col justify-center">
                      <span className="text-slate-500 block uppercase text-[8px]">{lang === "bn" ? "টার্গেট থার্মোস্ট্যাট" : "TEMP THERMOSTAT"}</span>
                      <div className="flex justify-end gap-1 items-center mt-1">
                        <button 
                          onClick={() => {
                            setFreezers((prev: Freezer[]) => prev.map(unit => unit.id === f.id ? { ...unit, targetTempCs: Number((unit.targetTempCs - 0.5).toFixed(1)) } : unit));
                          }}
                          className="bg-slate-950 border border-slate-800 text-teal-400 px-1 py-0.5 rounded cursor-pointer text-[10px]"
                        >
                          -
                        </button>
                        <strong className="text-white text-[10.5px] w-12 text-center">{f.targetTempCs}°C</strong>
                        <button 
                          onClick={() => {
                            setFreezers((prev: Freezer[]) => prev.map(unit => unit.id === f.id ? { ...unit, targetTempCs: Number((unit.targetTempCs + 0.5).toFixed(1)) } : unit));
                          }}
                          className="bg-slate-950 border border-slate-800 text-rose-400 px-1 py-0.5 rounded cursor-pointer text-[10px]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Utilization Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9.5px] font-bold">
                      <span className="text-slate-400">
                        {lang === "bn" ? "ইনভেন্টরি ধারণক্ষমতা:" : "Stored Capacity:"}
                      </span>
                      <span className={`${pct > 90 ? "text-rose-450 uppercase animate-pulse" : "text-emerald-400"}`}>
                        {currentStored.toLocaleString()} / {f.capacityKg.toLocaleString()} Kg ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-850">
                      <div 
                        className={`h-2 transition-all duration-300 ${
                          pct > 90 ? "bg-rose-500" :
                          pct > 75 ? "bg-amber-500" : "bg-emerald-500"
                        }`} 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Active Lots Display inside unit */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-900">
                    <span className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider block">
                      {lang === "bn" ? "সংরক্ষিত মাংসের লটসমূহ:" : "Stored Ingress Lots Inside:"}
                    </span>
                    {storedLots.length === 0 ? (
                      <span className="text-[9px] text-slate-600 block italic">-- No storage lots on shelf --</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {storedLots.map(lot => (
                          <span key={lot.id} className="text-[8.5px] font-semibold bg-slate-900/90 text-slate-300 px-2.5 py-1 rounded border border-slate-850 flex items-center gap-1.5">
                            <span className="h-1 w-1 bg-teal-400 rounded-full shrink-0"></span>
                            <strong>{lot.id}</strong> ({lot.itemType.split(' ')[1] || 'Meat'}): {lot.totalKg} Kg
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: MONTHLY ELECTRICITY BILLS LEDGER */}
      {csSubTab === "electricity" && (
        <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-black text-white font-mono uppercase">
                {lang === "bn" ? "মাসিক বিদ্যুৎ বিল ও এনার্জি ট্র্যাকার" : "Monthly Electricity Bills & Energy Audit"}
              </h3>
              <p className="text-[9px] text-slate-400">
                {lang === "bn" 
                  ? "ফ্রিজার প্রতি শক্তির ব্যবহার (kWh), বিদ্যুৎ বিলের হিসাব এবং পরিশোধের ইতিহাস নিয়ন্ত্রণ করুন।" 
                  : "Track power consumption (kWh), record freezer electricity bills, and process operational payment ledgers."}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAddBillForm(!showAddBillForm)}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-lg text-[9.5px] uppercase font-mono cursor-pointer transition"
              >
                {showAddBillForm 
                  ? (lang === "bn" ? "বিল বাতিল করুন" : "Cancel Entry") 
                  : (lang === "bn" ? "⚡ নতুন বিল রেকর্ড" : "⚡ Log Monthly Bill")}
              </button>
            </div>
          </div>

          {/* Add Electricity Bill form */}
          {showAddBillForm && (
            <form onSubmit={handleAddBill} className="bg-slate-950 p-4 border border-slate-850 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "ফ্রিজার ইউনিট" : "Target Freezer Unit"}
                </label>
                <select 
                  value={billFrKey} 
                  onChange={e => setBillFrKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                >
                  {freezers.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "বিলিং মাস (YYYY-MM)" : "Billing Month (YYYY-MM)"}
                </label>
                <input 
                  type="month" 
                  value={billMonth} 
                  onChange={e => setBillMonth(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "শক্তি ব্যবহৃত (kWh)" : "Power Consumed (kWh)"}
                </label>
                <input 
                  type="number" 
                  value={billKwh} 
                  onChange={e => {
                    setBillKwh(Number(e.target.value));
                    // estimate BDT 8.0/kWh
                    setBillAmountVal(Number(e.target.value) * 8);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "বিল ক্যাশ পরিমাণ (৳)" : "Bill Amount Outstanding (৳)"}
                </label>
                <input 
                  type="number" 
                  value={billAmountVal} 
                  onChange={e => setBillAmountVal(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "পরিশোধের অবস্থা" : "Payment Status"}
                </label>
                <select 
                  value={billStatus} 
                  onChange={e => setBillStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white animate-none"
                >
                  <option value="Pending">Pending / unpaid</option>
                  <option value="Paid">Paid out / settled</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="text-slate-400 block mb-1 text-[9px] uppercase">
                  {lang === "bn" ? "বিলিং রসিদ রেফারেন্স বা নোট" : "Invoice Reference / Notes"}
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. DESCO Grid meter reference #89021." 
                  value={billNotes} 
                  onChange={e => setBillNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase rounded-lg cursor-pointer transition text-[10px]"
                >
                  {lang === "bn" ? "বিল সংরক্ষণ করুন" : "Record Power Invoice"}
                </button>
              </div>
            </form>
          )}

          {/* Filtering & visual analytical bars */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex gap-1.5 items-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">{lang === "bn" ? "ফিল্টার ফ্রিজার:" : "Filter Freezer:"}</span>
              <select
                value={selectedFreezerFilter}
                onChange={e => setSelectedFreezerFilter(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1 text-slate-300 text-[11px] cursor-pointer"
              >
                <option value="All">All units</option>
                {freezers.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <span className="text-[9.5px] text-slate-500 italic block font-mono">
              * Average Tariff estimate: BDT ৳8.00 per kilowatt-hour (kWh).
            </span>
          </div>

          {/* Electricity accounts ledger list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10.5px] border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="p-3 pl-4">{lang === "bn" ? "বিল আইডি" : "BILL ID"}</th>
                  <th className="p-3">{lang === "bn" ? "ফ্রিজার ইউনিট" : "FREEZER UNIT"}</th>
                  <th className="p-3">{lang === "bn" ? "মাস" : "MONTH"}</th>
                  <th className="p-3">{lang === "bn" ? "শক্তি ব্যবহৃত" : "POWER USED"}</th>
                  <th className="p-3">{lang === "bn" ? "মোট বিল" : "TOTAL AMOUNT"}</th>
                  <th className="p-3">{lang === "bn" ? "ট্যারিফ গড়" : "POWER TARIFF"}</th>
                  <th className="p-3">{lang === "bn" ? "পরিশোধ" : "PAYMENT STATUS"}</th>
                  <th className="p-3 pr-4 text-right">{lang === "bn" ? "অ্যাকশন" : "ACTIONS"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {freezerBills
                  .filter(b => selectedFreezerFilter === "All" || b.freezerId === selectedFreezerFilter)
                  .map((bill) => {
                    const assocFreezer = freezers.find(f => f.id === bill.freezerId);
                    const avgRate = bill.kWhConsumed > 0 ? (bill.billAmount / bill.kWhConsumed).toFixed(2) : "8.00";
                    
                    return (
                      <tr key={bill.id} className="hover:bg-slate-950/40 transition">
                        <td className="p-3 pl-4 text-slate-300 font-extrabold">{bill.id}</td>
                        <td className="p-3 text-white font-semibold">
                          {assocFreezer ? assocFreezer.name : `Freezer ${bill.freezerId}`}
                        </td>
                        <td className="p-3 text-slate-300 font-bold">{bill.month}</td>
                        <td className="p-3 text-rose-400 font-bold">{bill.kWhConsumed.toLocaleString()} kWh</td>
                        <td className="p-3 text-indigo-400 font-bold">৳ {bill.billAmount.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">৳ {avgRate}/kWh</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase leading-tight flex items-center gap-1.5 w-fit ${
                            bill.status === "Paid" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-505 border border-amber-500/20"
                          }`}>
                            <span className={`h-1 w-1 rounded-full ${bill.status === "Paid" ? "bg-emerald-400" : "bg-amber-500 animate-pulse"}`}></span>
                            {bill.status}
                          </span>
                        </td>
                        <td className="p-3 pr-4 text-right">
                          {bill.status === "Pending" ? (
                            <button
                              onClick={() => handlePayBill(bill.id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase text-[9px] rounded-lg cursor-pointer transition"
                            >
                              ৳ Pay Bill
                            </button>
                          ) : (
                            <div className="text-[9px] text-slate-500">
                              <span className="font-bold uppercase text-emerald-400 block">{lang === "bn" ? "পরিশোধিত" : "Settled"}</span>
                              <span>{bill.paymentDate}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Audit energy diagnostic widgets */}
          <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl space-y-4">
            <div>
              <h4 className="text-[11.5px] font-black text-white uppercase font-mono tracking-tight">
                {lang === "bn" ? "⚡ ফ্রিজার এনার্জি দক্ষতা সূচক (Energy Efficiency Metrics)" : "⚡ Freezer Power Efficiency Analysis"}
              </h4>
              <p className="text-[9px] text-slate-500 font-sans mt-0.5">
                {lang === "bn" 
                  ? "ফ্রিজারের প্রতি কেজি স্টকে বিদ্যুৎ খরচের সূচক। কম খরচ নির্দেশ করে উচ্চতর পরিবেশগত এবং কারিগরী দক্ষতা।" 
                  : "Calculation of energy overhead cost per kilogram of meat. Lower cost-per-kg indicates superior thermal seal and energy efficiency."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {freezers.map(f => {
                const currentWeight = getFreezerStoredWeight(f.id);
                // Latest bill
                const lastBill = freezerBills.filter(b => b.freezerId === f.id).sort((a,b) => b.month.localeCompare(a.month))[0];
                
                // Cost per kg = billAmount / currentWeight (or estimate standard 1000 if weight is 0)
                const costIndex = lastBill && currentWeight > 0 
                  ? (lastBill.billAmount / currentWeight).toFixed(2)
                  : "0.00";

                return (
                  <div key={f.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-850/60 space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <strong className="text-slate-300 font-bold truncate max-w-[170px]">{f.name}</strong>
                      <span className="text-slate-500 text-[9px]">{lastBill ? `${lang === "bn" ? "হিসাব মাস:" : "Latest:"} ${lastBill.month}` : "No bill recorded"}</span>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase">{lang === "bn" ? "বিদ্যুৎ খরচ ইনডেক্স" : "OVERHEAD PER KG"}</span>
                        {lastBill && currentWeight > 0 ? (
                          <span className="text-xs font-mono font-black text-teal-400">
                            ৳ {costIndex} BDT <span className="text-[9.5px] font-normal text-slate-400">/ Kg {lang === "bn" ? "মাংস" : "stored"}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic font-mono">
                            {lang === "bn" ? "হিসাব করার জন্য স্টক নেই" : "No stored stock for audit"}
                          </span>
                        )}
                      </div>

                      <div className="text-right text-[10px] font-mono text-slate-400">
                        <div>{lang === "bn" ? "স্টক ওজন:" : "Stock weight:"} <strong>{currentWeight} Kg</strong></div>
                        {lastBill && <div>{lang === "bn" ? "বিল মূল্য:" : "Bill value:"} <strong>৳{lastBill.billAmount}</strong></div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. LOGISTICS & DELIVERY MANAGEMENT
// ==========================================
export function LogisticsModule({ lang }: { lang: "en" | "bn" }) {
  const [trips, setTrips] = useState([
    { id: "LOG-01", vehicle: "TATA Ultra 1114 Medium Box Truck (DHK-01)", driver: "Mamun Hossain", dest: "Dhaka Central Meat Bazaar", route: "N5 Highway Toll Route", status: "In Transit", fuelCost: 3500 },
    { id: "LOG-02", vehicle: "Standard Cold Reefer Carry-Van (CTG-04)", driver: "Abdul Malek", dest: "Chittagong Cold Supply Chain Store", route: "Dhaka-Chittagong Expressway", status: "Delivered", fuelCost: 4800 },
    { id: "LOG-03", vehicle: "Feed Heavy flatbed truck (SYL-09)", driver: "Sumon Mia", dest: "Sylhet Broiler Farm Hatchery #3", route: "Regional Route R201", status: "Pending", fuelCost: 2200 }
  ]);

  const [newVehicle, setNewVehicle] = useState("");
  const [newDriver, setNewDriver] = useState("");
  const [newDest, setNewDest] = useState("");
  const [newFuel, setNewFuel] = useState(1200);

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle || !newDriver) return;
    setTrips(prev => [
      {
        id: `LOG-${Math.floor(10 + Math.random() * 90)}`,
        vehicle: newVehicle,
        driver: newDriver,
        dest: newDest || "Enterprise Hub",
        route: "Optimized Automated Route GPS",
        status: "Pending",
        fuelCost: newFuel
      },
      ...prev
    ]);
    setNewVehicle("");
    setNewDriver("");
    setNewDest("");
  };

  const handleUpdateStatus = (id: string, status: string) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-950 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono text-teal-400 font-extrabold block">Refrigerated Logistics & Fleet Command</span>
          <h2 className="text-sm font-black text-white font-mono uppercase mt-1">Inter-Branch Transport & Heavy Freight</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Control GPS dispatch schedules, driver manifests, routes, and operational fuel expenses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <form onSubmit={handleAddTrip} className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-3 font-mono text-xs text-left">
          <h3 className="text-[11px] font-black text-white uppercase flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-teal-400" />
            <span>Schedule New Dispatch Route</span>
          </h3>
          
          <div>
            <label className="text-slate-400 block mb-1 text-[9px] uppercase">Vehicle / Carrier Unit</label>
            <select value={newVehicle} onChange={e => setNewVehicle(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white">
              <option value="">-- Choose Truck --</option>
              <option value="TATA Prime Refrigerated Rig (Unit 3)">TATA Prime Refrigerated Rig (Unit 3)</option>
              <option value="Mini-Pickup Feed Carrier (DHK-05)">Mini-Pickup Feed Carrier (DHK-05)</option>
              <option value="Multi-specie Cattle Carrier Deck">Multi-specie Cattle Carrier Deck</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[9px] uppercase">Assigned Driver Roster</label>
            <input type="text" placeholder="Driver name" value={newDriver} onChange={e => setNewDriver(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white" />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[9px] uppercase">Destination Address / Store</label>
            <input type="text" placeholder="e.g. Dhaka Bazar Block-C" value={newDest} onChange={e => setNewDest(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white" />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[9px] uppercase">Allocated Fuel Cash (₹)</label>
            <input type="number" value={newFuel} onChange={e => setNewFuel(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white" />
          </div>

          <button type="submit" className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black uppercase rounded text-[10px] cursor-pointer">
            Route Trip Manifest
          </button>
        </form>

        <div className="md:col-span-2 p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
          <h3 className="text-xs font-black text-white font-mono uppercase">Live Active Freight Manifests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase font-extrabold">
                  <th className="p-2 pb-3">TRIP ID</th>
                  <th className="p-2 pb-3">VEHICLE & RUNNER</th>
                  <th className="p-2 pb-3">DESTINATION</th>
                  <th className="p-2 pb-3">FUEL LOG</th>
                  <th className="p-2 pb-3">STATUS</th>
                  <th className="p-2 pb-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {trips.map(t => (
                  <tr key={t.id} className="hover:bg-slate-900/30">
                    <td className="p-2 text-slate-300 font-extrabold">{t.id}</td>
                    <td className="p-2 text-white font-semibold">
                      {t.vehicle}
                      <span className="block text-[8.5px] text-teal-400 font-normal">Driver: {t.driver}</span>
                    </td>
                    <td className="p-2 text-slate-400">
                      {t.dest}
                      <span className="block text-[8px] text-slate-500">{t.route}</span>
                    </td>
                    <td className="p-2 text-slate-300 font-bold">₹{t.fuelCost.toLocaleString()}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        t.status === "In Transit" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                        t.status === "Delivered" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        "bg-slate-800 text-slate-500"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-2 text-right">
                      {t.status === "Pending" && (
                        <button onClick={() => handleUpdateStatus(t.id, "In Transit")} className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-2 py-1 rounded text-[8.5px] uppercase">
                          Dispatch
                        </button>
                      )}
                      {t.status === "In Transit" && (
                        <button onClick={() => handleUpdateStatus(t.id, "Delivered")} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-2 py-1 rounded text-[8.5px] uppercase">
                          Arrived
                        </button>
                      )}
                      {t.status === "Delivered" && (
                        <span className="text-emerald-500 text-[8.5px] font-black flex items-center justify-end gap-0.5">
                          <Check className="h-3 w-3" /> Job Closed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 9. SALES & CUSTOMER WORKSPACE
// ==========================================
export function SalesCustomersModule({ lang, sales, setSales }: { lang: "en" | "bn"; sales: Sale[]; setSales: React.Dispatch<React.SetStateAction<Sale[]>> }) {
  const [wholesalePrice, setWholesalePrice] = useState(650);
  const [retailPrice, setRetailPrice] = useState(720);
  const [remindedUser, setRemindedUser] = useState<string | null>(null);

  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalPendingReceivables = sales.reduce((acc, s) => acc + s.amountDue, 0);

  const triggerReminder = (customer: string) => {
    setRemindedUser(customer);
    setTimeout(() => setRemindedUser(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl text-left">
          <span className="text-[9px] uppercase font-mono text-slate-500 font-extrabold block">TOTAL SALES REVENUE</span>
          <span className="text-xl font-black text-emerald-400 font-mono block mt-1">₹{totalSalesRevenue.toLocaleString()}</span>
          <span className="text-[8.5px] text-slate-400 font-mono mt-1 block">Value of meat invoice issuances</span>
        </div>
        <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl text-left">
          <span className="text-[9px] uppercase font-mono text-slate-500 font-extrabold block">OUTSTANDING RECEIVABLES</span>
          <span className="text-xl font-black text-rose-455 font-mono block mt-1">₹{totalPendingReceivables.toLocaleString()}</span>
          <span className="text-[8.5px] text-slate-400 font-mono mt-1 block">Active credit line to beef agents</span>
        </div>
        <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl text-left">
          <span className="text-[9px] uppercase font-mono text-slate-500 font-extrabold block">WHOLESALE BEEF / KG</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-black text-white font-mono">₹{wholesalePrice}</span>
            <input type="range" min="500" max="800" value={wholesalePrice} onChange={e => setWholesalePrice(Number(e.target.value))} className="w-16 h-1 bg-slate-800 rounded-lg cursor-pointer accent-teal-500" />
          </div>
          <span className="text-[8.5px] text-slate-500 font-mono mt-0.5 block">Trade rate for tier-1 resellers</span>
        </div>
        <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl text-left">
          <span className="text-[9px] uppercase font-mono text-slate-500 font-extrabold block">RETAIL EX-GATE / KG</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-black text-white font-mono">₹{retailPrice}</span>
            <input type="range" min="600" max="900" value={retailPrice} onChange={e => setRetailPrice(Number(e.target.value))} className="w-16 h-1 bg-slate-800 rounded-lg cursor-pointer accent-teal-500" />
          </div>
          <span className="text-[8.5px] text-slate-500 font-mono mt-0.5 block">Direct retail butcher rate</span>
        </div>
      </div>

      <div className="p-5 bg-slate-900 border border-slate-850 rounded-2xl space-y-4">
        <h3 className="text-xs font-black text-white font-mono uppercase text-left">Sales Invoices & Customer CRM Database</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10.5px] border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="p-3 pl-4">INVOICE ID</th>
                <th className="p-3">BUYER PROFILE</th>
                <th className="p-3">INV DATE</th>
                <th className="p-3">INVOICE TOTAL</th>
                <th className="p-3">BAL OUTSTANDING</th>
                <th className="p-3">COLLECTION ALERTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {sales.map(s => (
                <tr key={s.id} className="hover:bg-slate-950/30">
                  <td className="p-3 pl-4 text-slate-355 font-extrabold">{s.id}</td>
                  <td className="p-3 text-white font-semibold">
                    {s.customerName}
                    <span className="block text-[8.5px] text-slate-500 font-normal">Contact: {s.customerPhone || "Unlisted Ledger"}</span>
                  </td>
                  <td className="p-3 text-slate-400">{s.date}</td>
                  <td className="p-3 text-slate-200 font-bold">₹{s.total.toLocaleString()}</td>
                  <td className={`p-3 font-bold ${s.amountDue > 0 ? "text-rose-450" : "text-emerald-400"}`}>
                    ₹{s.amountDue.toLocaleString()}
                  </td>
                  <td className="p-3">
                    {s.amountDue > 0 ? (
                      <button 
                        onClick={() => triggerReminder(s.customerName)}
                        className={`px-2 py-1 text-[8.5px] rounded uppercase font-black cursor-pointer leading-tight border transition duration-150 ${
                          remindedUser === s.customerName 
                            ? "bg-emerald-500 border-emerald-400 text-slate-950" 
                            : "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400"
                        }`}
                      >
                        {remindedUser === s.customerName ? "✉️ SMS & WA Transmitted!" : "⚡ Dispatch Debt Prompt"}
                      </button>
                    ) : (
                      <span className="text-slate-600 font-bold">✓ Accounts Cleared</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. PROCUREMENT & SUPPLIER MANAGEMENT
// ==========================================
export function ProcurementSuppliersModule() {
  const [suppliers] = useState([
    { id: "SUP-01", name: "Sirajganj Agro Livestock Traders", feedSupply: "Cattle Broodstock / Bull Calves", rateRating: "98% compliance", pendingPay: 145000, activeOrders: 2 },
    { id: "SUP-02", name: "Chittagong Grain Feeds Master", feedSupply: "Wheat Bran, Mineral Supplements", rateRating: "92% compliance", pendingPay: 85000, activeOrders: 1 },
    { id: "SUP-03", name: "Rajshahi Poultry Hatcheries Co.", feedSupply: "DOC Broiler Chicks (1 Day Age)", rateRating: "99% compliance", pendingPay: 0, activeOrders: 0 }
  ]);

  const [orders] = useState([
    { id: "PO-341", supplier: "Sirajganj Agro", item: "30x Jersey Breed Bull Calves", date: "2026-06-01", amount: 480000, status: "Partially Received" },
    { id: "PO-342", supplier: "Chittagong Grain", item: "10,000 Kg Layer Specialized Feed Mash", date: "2026-05-28", amount: 240000, status: "Fulfilled" }
  ]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-950 rounded-2xl flex flex-wrap justify-between items-center gap-4 text-left">
        <div>
          <span className="text-[10px] uppercase font-mono text-teal-400 font-extrabold block">Procurement Ingress & Vendor Accounts</span>
          <h2 className="text-sm font-black text-white font-mono uppercase mt-1">Vendor Contracts, Purchase Orders (PO) & Receivables</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Track raw bulk feed supplies, bull breeder partnerships, outstanding supplier payables, and historical purchase orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4 text-left">
          <h3 className="text-xs font-black text-white font-mono uppercase">Authorized Supplier Database</h3>
          <div className="space-y-2.5">
            {suppliers.map(sup => (
              <div key={sup.id} className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex justify-between items-start gap-2 text-xs font-mono">
                <div>
                  <span className="text-[8px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-teal-400 font-extrabold font-mono uppercase">{sup.id}</span>
                  <p className="text-white font-extrabold mt-1">{sup.name}</p>
                  <p className="text-[9.5px] text-slate-400 mt-0.5">Lines: {sup.feedSupply}</p>
                  <p className="text-[9px] text-emerald-400 font-black tracking-wider uppercase mt-1">✓ Rating: {sup.rateRating}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Outstanding Pay</span>
                  <span className={`text-xs font-black ${sup.pendingPay > 0 ? "text-rose-455" : "text-emerald-400"} font-mono block`}>
                    ₹{sup.pendingPay.toLocaleString()}
                  </span>
                  <span className="text-[8.5px] text-slate-500 font-mono mt-1.5 block uppercase font-medium">{sup.activeOrders} active POs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-slate-950 border border-slate-855 rounded-2xl space-y-4 text-left">
          <h3 className="text-xs font-black text-white font-mono uppercase">Outstanding Supply Requisitions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase font-extrabold">
                  <th className="p-2 pb-3">PO ID</th>
                  <th className="p-2 pb-3">PARTNER VENDOR</th>
                  <th className="p-2 pb-3">ITEMS ORDERED</th>
                  <th className="p-2 pb-3">TOTAL VALUE</th>
                  <th className="p-2 pb-3 text-right">INGRESS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-900/30">
                    <td className="p-2 text-slate-300 font-extrabold">{o.id}</td>
                    <td className="p-2 text-white font-semibold">{o.supplier}</td>
                    <td className="p-2 text-slate-400">{o.item}</td>
                    <td className="p-2 text-slate-300 font-black">₹{o.amount.toLocaleString()}</td>
                    <td className="p-2 text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        o.status === "Fulfilled" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 11. BUSINESS INTELLIGENCE (BI) & ANALYTICS
// ==========================================
export function BusinessIntelligenceModule({ transactions, sales }: { transactions: Transaction[]; sales: Sale[] }) {
  const totalRev = transactions.filter(t => t.type === "Revenue").reduce((acc, t) => acc + t.amount, 0) + sales.reduce((acc, s) => acc + s.amountPaid, 0);
  const totalExp = transactions.filter(t => t.type === "Expense").reduce((acc, t) => acc + t.amount, 0);
  const netEarnings = totalRev - totalExp;
  const netPct = totalRev > 0 ? (netEarnings / totalRev) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-950 rounded-2xl flex flex-wrap justify-between items-center gap-4 text-left">
        <div>
          <span className="text-[10px] uppercase font-mono text-teal-400 font-extrabold block">Executive BI Insights & P&L Tracker</span>
          <h2 className="text-sm font-black text-white font-mono uppercase mt-1">Enterprise Profitability & Operational Costs</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Real-time accounting equations tracing raw revenues, carcass sales, supply expenses, salaries, and net ratios.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-5 bg-slate-955 border border-slate-850 rounded-2xl">
          <span className="text-[9.5px] uppercase font-mono text-slate-500 font-extrabold block">CONSOLIDATED GENERAL INCOME</span>
          <span className="text-xl font-black text-emerald-400 font-mono block mt-1">₹{totalRev.toLocaleString()}</span>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3.5 border border-slate-800">
            <div className="h-full bg-emerald-500" style={{ width: "100%" }} />
          </div>
          <span className="text-[8.5px] text-slate-400 font-mono mt-1.5 block">Sum of cash collections & sales transactions</span>
        </div>

        <div className="p-5 bg-slate-955 border border-slate-850 rounded-2xl">
          <span className="text-[9.5px] uppercase font-mono text-slate-500 font-extrabold block">OPERATIONAL OUTFLOW</span>
          <span className="text-xl font-black text-rose-455 font-mono block mt-1">₹{totalExp.toLocaleString()}</span>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3.5 border border-slate-800">
            <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, totalRev > 0 ? (totalExp / totalRev) * 100 : 50)}%` }} />
          </div>
          <span className="text-[8.5px] text-slate-400 font-mono mt-1.5 block">Feed bulk buys, veterinary wages & cold charges</span>
        </div>

        <div className="p-5 bg-slate-955 border border-slate-850 rounded-2xl">
          <span className="text-[9.5px] uppercase font-mono text-slate-500 font-extrabold block">NET PROFIT / PROFIT MARGIN</span>
          <span className={`text-xl font-black font-mono block mt-1 ${netEarnings >= 0 ? "text-emerald-400" : "text-rose-455"}`}>
            ₹{netEarnings.toLocaleString()}
          </span>
          <div className="mt-3 text-[9px] font-mono leading-none flex justify-between">
            <span className="text-slate-400">NET RETURN RATE:</span>
            <span className={`font-black uppercase h-fit ${netEarnings >= 0 ? "text-emerald-400" : "text-rose-450"}`}>
              {netPct.toFixed(1)}% Margin
            </span>
          </div>
          <span className="text-[8.5px] text-slate-400 font-mono mt-2 block">Actual retained liquidity margin</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
          <h3 className="text-xs font-black text-white font-mono uppercase">Multi-Branch Performance Metrics</h3>
          <div className="space-y-3.5 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                <span>Dhaka Division - Beef Supply Hub</span>
                <span className="text-teal-400">₹3,45,000 Sales (✓ High)</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded mt-1.5 overflow-hidden">
                <div className="bg-teal-500 h-full rounded" style={{ width: "85%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                <span>Chittagong Hatchery & Processing Point</span>
                <span className="text-amber-400">₹1,85,000 Sales (✓ Nominal)</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded mt-1.5 overflow-hidden">
                <div className="bg-amber-500 h-full rounded" style={{ width: "55%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                <span>Sylhet Forage & Silage Processing Unit</span>
                <span className="text-slate-400">₹94,000 Sales (✓ Idle)</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded mt-1.5 overflow-hidden">
                <div className="bg-slate-700 h-full rounded" style={{ width: "30%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4 font-mono text-xs">
          <h3 className="text-xs font-black text-white uppercase">Historical Inflow/Outflow Streams</h3>
          <div className="space-y-2 h-44 overflow-y-auto">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="flex justify-between items-center p-2.5 bg-slate-900 rounded border border-slate-850">
                <div>
                  <p className="text-white text-[11px] font-bold">{tx.description}</p>
                  <span className="text-[8.5px] text-slate-500">{tx.date} • Dept: {tx.department || "General"}</span>
                </div>
                <span className={`text-[11px] font-black ${tx.type === "Revenue" ? "text-emerald-400" : "text-rose-455"}`}>
                  {tx.type === "Revenue" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 12. AI DECISION SUPPORT CENTER
// ==========================================
export function AIDecisionSupportModule({ animals, feedInventory }: { animals: Animal[]; feedInventory: any[] }) {
  const criticalFeed = feedInventory.filter(f => f.balance / f.maxCapacity < 0.2);
  const criticalLivestockCount = animals.filter(ani => ani.status === "Critical").length;

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="p-6 bg-slate-900 border border-slate-950 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono text-teal-400 font-extrabold block">Heuristic Intelligence Engine</span>
          <h2 className="text-sm font-black text-white font-mono uppercase mt-1">AI Operational Diagnostics & Forecasts</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Automated recommendations based on biometric weight trends, historical depletion curves, and risk matrices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-950 border border-slate-855 rounded-2xl space-y-4">
          <span className="text-[11px] font-black text-white font-mono uppercase tracking-wider block flex items-center gap-1.5 text-indigo-400">
            <Brain className="h-4 w-4 shrink-0 text-indigo-400" />
            <span>Biometric Feed & Volume Forecasting</span>
          </span>
          <div className="space-y-3 font-mono text-[10.5px]">
            {criticalFeed.length > 0 ? (
              criticalFeed.map(f => (
                <div key={f.id} className="p-3 bg-rose-950/15 border border-rose-900/30 rounded-xl space-y-1">
                  <span className="text-[9px] text-rose-400 font-black uppercase">⚠️ FEED DEPLETION THREAT DETECTED</span>
                  <p className="text-white font-extrabold mt-1">{f.label} is at {Math.round((f.balance / f.maxCapacity) * 100)}% capacity!</p>
                  <p className="text-slate-400 text-[9.5px]">AI recommendation: Current livestock consumption demands an immediate purchase orders of 1,200 Kg of {f.label.split(" ")[0]} to prevent 6-day stockout.</p>
                </div>
              ))
            ) : (
              <div className="p-3 bg-emerald-950/10 border border-emerald-900/10 rounded-xl">
                <span className="text-[9px] text-emerald-400 font-black uppercase">✓ FEED FLOW HEALTH NOMINAL</span>
                <p className="text-slate-400 mt-1">All grains, crop residue stocks, and green silage reserve levels are safe for the next 14 operating days.</p>
              </div>
            )}

            <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
              <span className="text-[8.5px] uppercase font-bold text-slate-400">Slaughter Allocation recommendation</span>
              <p className="text-slate-300">Estimated feed cost is rising by 4%. The AI recommends scheduled processing of 2 cross-breed bulls having exceeded 600kg (bull ID #A-12, #A-18) to maximize profit margin rates before biometric growth rate plateau.</p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-950 border border-slate-855 rounded-2xl space-y-4 font-mono text-xs">
          <span className="text-[11px] font-black text-white uppercase tracking-wider block flex items-center gap-1.5 text-rose-450">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-455" />
            <span>Epidemic Disease Risk & Infection Matrix</span>
          </span>
          <div className="space-y-3 font-mono text-[10px]">
            <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl">
              <div className="flex justify-between font-black text-[10.5px]">
                <span className="text-slate-200">FOOT & MOUTH DISEASE (FMD) RISK</span>
                <span className="text-emerald-450">LOW RISK (12%)</span>
              </div>
              <p className="text-slate-500 mt-1">Biosecurity checklists are 95% complete. Immunization coverage of cattle stands at 100%.</p>
            </div>
            <div className="p-3 bg-amber-950/15 border border-amber-900/30 rounded-xl">
              <div className="flex justify-between font-black text-[10.5px] text-amber-400">
                <span>AVIAN INFLUENZA OUTBREAK RISK</span>
                <span>MEDIUM RISK (38%)</span>
              </div>
              <p className="text-slate-400 mt-1">Wet monsoon humidity stands at 82%. Ensure dry straw replacement triggers in Hatchery building B-1.</p>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl">
              <div className="flex justify-between font-black text-[10.5px]">
                <span className="text-slate-200">AGENT PAYMENT SETTLEMENT DUE RISK</span>
                <span className="text-rose-450">HIGH CREDIT OUT (₹{criticalLivestockCount > 0 ? "1.2 Lakh" : "Outstanding"})</span>
              </div>
              <p className="text-slate-500 mt-1 font-sans">Certain customer balances exceeded 45 business days. Collective ledger credit risk factor is heightened. Recommended actions check Collections dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 13. MULTI-BRANCH ENTERPRISE MANAGEMENT
// ==========================================
export function MultiBranchModule() {
  const [branches, setBranches] = useState([
    { code: "MB-01", name: "Dhaka Central Bull Farm", type: "Herd Multiplication & Breeding", activeCattle: 18, pendingDues: 145000, capacityPct: 78 },
    { code: "MB-02", name: "Chittagong Coastal Hatchery", type: "Broiler Growing & Slaughterhouse", activeCattle: 0, pendingDues: 0, capacityPct: 62 },
    { code: "MB-03", name: "Sylhet Forage Mill & Feed Depot", type: "Grain Milling & Silage Storage", activeCattle: 0, pendingDues: 85000, capacityPct: 45 }
  ]);

  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6 text-left">
      <div className="p-6 bg-slate-900 border border-slate-950 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono text-teal-400 font-extrabold block">Multi-Site Synchronization Matrix</span>
          <h2 className="text-sm font-black text-white font-mono uppercase mt-1">Multi-Branch Regional Farming Centers & Depots</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Centralized reporting filter supporting multiple cattle farms, feed storages, and logistics hubs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {branches.map(b => (
          <div key={b.code} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
            <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-850">
              <span className="text-[8.5px] font-black text-teal-400 uppercase font-mono">{b.code}</span>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase font-sans">{b.type.split(" ")[0]} Unit</span>
            </div>
            <div>
              <p className="text-white font-extrabold text-xs">{b.name}</p>
              <p className="text-[9.5px] text-slate-500 mt-1">{b.type}</p>
            </div>
            
            <div className="space-y-1 pt-1 border-t border-slate-900">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Space Utilization:</span>
                <span className="text-white font-bold">{b.capacityPct}%</span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded overflow-hidden">
                <div className="bg-teal-500 h-full" style={{ width: `${b.capacityPct}%` }} />
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-[9px] text-slate-500">CATTLE STOCK:</span>
              <span className="text-xs text-white font-black">{b.activeCattle > 0 ? `${b.activeCattle} Heads` : "N/A - Feed Only"}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
        <h3 className="text-xs font-black text-white font-mono uppercase">Inter-Branch Resource Transfer Manifest</h3>
        <p className="text-[10.5px] text-slate-400 font-mono">Move feed, equipment, or biometric cattle lots between farm coordinates with full transit records.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
          <select className="bg-slate-900 border border-slate-800 rounded p-2 text-white">
            <option>From Division: Dhaka Central</option>
            <option>From Division: Sylhet Depot</option>
          </select>
          <select className="bg-slate-900 border border-slate-800 rounded p-2 text-white">
            <option>To Division: Chittagong Hatchery</option>
            <option>To Division: Sylhet Depot</option>
          </select>
          <input type="text" placeholder="Quantity/Description (e.g. 500Kg Maize)" className="bg-slate-900 border border-slate-800 rounded p-2 text-white" />
          <button className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black uppercase text-[10px] rounded cursor-pointer transition">
            Initiate Transfer Requisition
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 14. SECURITY & CUSTOM ROLE PERMISSION MATRIX
// ==========================================
export function SecurityRoleModule() {
  const [roles] = useState([
    { name: "Manager", r: "Full system edit & approval", animal: true, trade: true, audit: true, user: false },
    { name: "Accountant", r: "Register collect ledger invoices", animal: false, trade: true, audit: false, user: false },
    { name: "Veterinary Officer", r: "Record health & biocare charts", animal: true, trade: false, audit: false, user: false },
    { name: "Sales Agent", r: "Lookup customer balances & invoice", animal: false, trade: true, audit: false, user: false },
    { name: "Butcher", r: "Log carcass yields in slaughterhouse", animal: false, trade: false, audit: false, user: false },
    { name: "Feed Store Operator", r: "Add grains and trigger subtracts", animal: false, trade: false, audit: false, user: false }
  ]);

  return (
    <div className="space-y-6 text-left font-mono text-xs">
      <div className="p-6 bg-slate-900 border border-slate-950 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono text-teal-400 font-extrabold block">Access Control & Role Matrix</span>
          <h2 className="text-sm font-black text-white font-mono uppercase mt-1">Multi-User Security & Permission Thresholds</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Map individual roles to read/write constraints across biological inventories, sales invoices, and audit tracking engines.</p>
        </div>
      </div>

      <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
        <h3 className="text-xs font-black text-white uppercase">Security Authorization Permission Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10.5px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="p-3 pl-4">ROLE DEFINITION</th>
                <th className="p-3">SCOPE EXPLANATION</th>
                <th className="p-3 text-center">BIOMASS WRITE</th>
                <th className="p-3 text-center">FINANCIALS WRITE</th>
                <th className="p-3 text-center">AUDIT VISIBILITY</th>
                <th className="p-3 text-center">PRIVILEGE LEVEL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {roles.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="p-3 pl-4 text-white font-extrabold">{r.name}</td>
                  <td className="p-3 text-slate-400">{r.r}</td>
                  <td className="p-3 text-center">{r.animal ? "🟢 Full" : "🔴 Revoked"}</td>
                  <td className="p-3 text-center">{r.trade ? "🟢 Full" : "🔴 Revoked"}</td>
                  <td className="p-3 text-center">{r.audit ? "🟢 View" : "🔴 Blocked"}</td>
                  <td className="p-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[8px] bg-slate-900 text-teal-400 border border-slate-800 font-bold uppercase">
                      {r.name === "Manager" ? "Staff Root" : "Agent L2"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 16. ASSET & EQUIPMENT MANAGEMENT
// ==========================================
export function AssetEquipmentModule() {
  const [assets, setAssets] = useState([
    { id: "EQ-101", name: "Heavy Specie Weighing Platform L2", category: "Weighing Scale", lastMaint: "2026-04-10", nextMaint: "2026-10-10", status: "Calibrated", health: 98 },
    { id: "EQ-102", name: "Ultra-Frozen Freezer Cabinet B-3", category: "Refrigeration Unit", lastMaint: "2026-05-15", nextMaint: "2026-07-20", status: "Functional", health: 85 },
    { id: "EQ-103", name: "TATA Heavy Specie Transport Rig", category: "Freight Vehicle", lastMaint: "2026-02-01", nextMaint: "2026-08-01", status: "Servicing Required", health: 65 }
  ]);

  const triggerCalibrate = (id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status: "Calibrated", health: 100, lastMaint: new Date().toISOString().slice(0, 10) } : a));
  };

  return (
    <div className="space-y-6 text-left font-mono text-xs">
      <div className="p-6 bg-slate-900 border border-slate-950 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono text-teal-400 font-extrabold block">Hardware & Machinery Inventory</span>
          <h2 className="text-sm font-black text-white font-mono uppercase mt-1">Industrial Scale Weighers, Freezers & Machinery</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Supervise electronic weighing calibrations, cooling compressor logs, repairs, and scheduled service history.</p>
        </div>
      </div>

      <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
        <h3 className="text-xs font-black text-white uppercase">Critical Hardware Roster & Maintenance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10.5px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="p-3 pl-4">ASSET CODE</th>
                <th className="p-3">MACHINERY DESCRIPTION</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3">LAST CALIBRATION</th>
                <th className="p-3 font-center text-center">HEALTH RATIO</th>
                <th className="p-3 text-center">STATUS</th>
                <th className="p-3 pr-4 text-right font-bold">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {assets.map(a => (
                <tr key={a.id} className="hover:bg-slate-900/40">
                  <td className="p-3 pl-4 font-bold text-teal-400">{a.id}</td>
                  <td className="p-3 text-white font-semibold">
                    {a.name}
                    <span className="block text-[8px] text-slate-500">Service Due: {a.nextMaint}</span>
                  </td>
                  <td className="p-3 text-slate-400">{a.category}</td>
                  <td className="p-3 text-slate-400">{a.lastMaint}</td>
                  <td className="p-3 text-center">
                    <span className={`font-bold ${a.health < 75 ? "text-rose-450" : "text-emerald-400"}`}>
                      {a.health}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase ${
                      a.status === "Calibrated" || a.status === "Functional" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    <button 
                      onClick={() => triggerCalibrate(a.id)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-slate-350 border border-slate-800 hover:text-white rounded text-[8.5px] uppercase font-black cursor-pointer transition"
                    >
                      🔧 Recalibrate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 17. COMPLIANCE & BIOSECURITY RECORDS
// ==========================================
export function ComplianceBiosecurityModule() {
  const [checklists, setChecklists] = useState([
    { id: "BIO-01", group: "Quarantine Protocol", check: "Fever quarantine bull separation triggers verified daily", status: true, date: "Today" },
    { id: "BIO-02", group: "Hatchery Sanitation", check: "Footbaths sanitizing levels placed at ingress doors", status: true, date: "Today" },
    { id: "BIO-03", group: "Carcass Lab Ingress", check: "Municipal slaughter safety certificate renewed", status: false, date: "Expired" }
  ]);

  const toggleCheck = (id: string) => {
    setChecklists(prev => prev.map(c => c.id === id ? { ...c, status: !c.status } : c));
  };

  return (
    <div className="space-y-6 text-left font-mono text-xs">
      <div className="p-6 bg-slate-900 border border-slate-950 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono text-rose-450 font-extrabold block">Municipal Health Certifications & Sanitation</span>
          <h2 className="text-sm font-black text-white font-mono uppercase mt-1">Biosecurity Audits, Quarantine Logs & Compliance</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Execute biosecurity barrier checks, trace quarantine pens, and retain municipal veterinarian health inspections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase">Active Biosecurity Barriers Checklist</h3>
          <div className="space-y-3">
            {checklists.map(c => (
              <div 
                key={c.id} 
                onClick={() => toggleCheck(c.id)}
                className="p-3.5 bg-slate-900 hover:bg-slate-850/60 border border-slate-850 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition select-none"
              >
                <div>
                  <span className="text-[7.5px] uppercase font-extrabold text-teal-400 bg-slate-955 px-1 rounded">{c.group}</span>
                  <p className="text-white font-semibold text-[11px] mt-1">{c.check}</p>
                </div>
                <div className="shrink-0">
                  {c.status ? (
                    <span className="h-5 w-5 rounded bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                      ✓
                    </span>
                  ) : (
                    <span className="h-5 w-5 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono text-[9px] font-black animate-pulse">
                      X
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-slate-955 border border-slate-850 rounded-2xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase">Regulatory & Veterinary Certificates</h3>
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-slate-200">Municipal Food Sanitary Authorization</span>
              <span className="text-teal-400 font-bold uppercase">Active Licence</span>
            </div>
            <p className="text-slate-450 leading-relaxed text-[9.5px]">Certificate Code: #MUN-SL-2026. Approved by Chief Sanitary Inspector on 12-Feb-2026. Standard inspection logs verified for cattle beef and duck meat yield operations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 18. HUMAN RESOURCE MANAGEMENT (HR)
// ==========================================
export function HumanResourceModule() {
  const [staff, setStaff] = useState([
    { id: "ST-01", name: "Dr. Rafiqul Islam", role: "Veterinary Officer", duty: "Daily biometric veterinary health inspection", attendToday: true, salary: 45000 },
    { id: "ST-02", name: "Anisur Rahman", role: "Master Butcher Shop Head", duty: "Carcass processing & fat trim scaling", attendToday: true, salary: 28000 },
    { id: "ST-03", name: "Milon Miah", role: "Feed Store Operator", duty: "Grains balance monitoring & logistics routing", attendToday: false, salary: 18000 }
  ]);

  const toggleAttend = (id: string) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, attendToday: !s.attendToday } : s));
  };

  return (
    <div className="space-y-6 text-left font-mono text-xs">
      <div className="p-6 bg-slate-900 border border-slate-950 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono text-teal-400 font-extrabold block">Human Resource Payroll & Roster Desk</span>
          <h2 className="text-sm font-black text-white font-mono uppercase mt-1">Staff Registries, Roles, Attendance & Monthly Salaries</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Control employee manifests, biometric entry checks, salary payments, and shift assignments.</p>
        </div>
      </div>

      <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
        <h3 className="text-xs font-black text-white uppercase">Enterprise Staff Manifest & Daily Roster Desk</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10.5px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="p-3 pl-4">STAFF CODE</th>
                <th className="p-3">FULL NAME</th>
                <th className="p-3">ASSIGNED ROLE</th>
                <th className="p-3">MONTHLY WAGES</th>
                <th className="p-3">OPERATIONAL RESPONSIBILITY</th>
                <th className="p-3 text-center">ATTENDANCE TODAY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {staff.map(s => (
                <tr key={s.id} className="hover:bg-slate-900/40">
                  <td className="p-3 pl-4 font-bold text-teal-400">{s.id}</td>
                  <td className="p-3 text-white font-semibold">{s.name}</td>
                  <td className="p-3 text-indigo-400 font-bold">{s.role}</td>
                  <td className="p-3 text-slate-300 font-bold">₹{s.salary.toLocaleString()}</td>
                  <td className="p-3 text-slate-400">{s.duty}</td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => toggleAttend(s.id)}
                      className={`px-3 py-1 text-[8px] font-black uppercase rounded cursor-pointer leading-tight border transition ${
                        s.attendToday 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                          : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      }`}
                    >
                      {s.attendToday ? "● Present Desk" : "○ Off Duty"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
