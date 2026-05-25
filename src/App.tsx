import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Calculator,
  DollarSign, 
  AlertTriangle, 
  Activity, 
  Award, 
  Layers, 
  Users, 
  PlusCircle, 
  Search, 
  ArrowRightLeft, 
  ChefHat, 
  BookOpen, 
  ShoppingCart, 
  Receipt, 
  Sparkles, 
  MessageSquare,
  RefreshCw,
  Printer,
  Edit,
  XCircle,
  PiggyBank,
  Coins,
  CreditCard,
  Smartphone,
  Wallet,
  Clock,
  CheckCircle2,
  Calendar,
  Layers3,
  Globe,
  Wifi,
  WifiOff,
  Lock,
  Shield,
  User,
  LogOut,
  Key,
  Phone,
  Mail,
  UserCheck,
  ShieldCheck,
  Check,
  ChevronRight,
  Fingerprint,
  Barcode,
  Zap,
  Camera,
  Download,
  CheckCircle,
  X,
  History,
  Wheat,
  Scale,
  Heart
} from "lucide-react";

import { SupplierRemindersPanel } from "./components/SupplierRemindersPanel";
import { ButcherShopsSection } from "./components/ButcherShopsSection";
import { BrandLogo } from "./components/BrandLogo";

import { 
  COW_BREEDS, 
  GOAT_BREEDS, 
  BUFFALO_BREEDS, 
  SHEEP_BREEDS, 
  MITHUN_BREEDS, 
  getBreedsForType 
} from "./constants/breeds";

import { translations } from "./constants/translations";

import type { 
  UserRole, 
  UserSession, 
  Investor, 
  HealthRecord, 
  BatchProcessLog, 
  Animal, 
  SaleItem, 
  Installment, 
  Sale 
} from "./types";





const DEMO_PROFILES: UserSession[] = [
  {
    uid: "usr-001",
    name: "Anis Chowdhury",
    email: "anis@meatflow.com",
    phone: "+880 1712-345678",
    role: "Administrator",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=anis",
    authMethod: "Demo"
  },
  {
    uid: "usr-002",
    name: "Salim Mia",
    email: "salim.manager@meatflow.com",
    phone: "+880 1815-555121",
    role: "Livestock Management",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=salim",
    authMethod: "Demo"
  },
  {
    uid: "usr-003",
    name: "Tariqul Islam",
    email: "tariqul.butcher@meatflow.com",
    phone: "+880 1511-999888",
    role: "Butcher Shop",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=tariqul",
    authMethod: "Demo"
  },
  {
    uid: "usr-004",
    name: "Shaie Rahman",
    email: "shaie.collections@meatflow.com",
    phone: "+880 1912-777666",
    role: "Collections",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=shaie",
    authMethod: "Demo"
  },
  {
    uid: "usr-005",
    name: "Hasan Ali",
    email: "hasan.feed@meatflow.com",
    phone: "+880 1612-888999",
    role: "Feed Shop",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=hasan",
    authMethod: "Demo"
  }
];

function isTabAllowed(tabId: string, role?: UserRole): boolean {
  if (tabId === "home") return true;
  if (!role) return false;
  if (role === "Administrator") return true;

  // Department-specific authorizations
  if (role === "Livestock Management") {
    return tabId === "dashboard" || tabId === "livestock";
  }
  if (role === "Butcher Shop") {
    return tabId === "dashboard" || tabId === "butchers";
  }
  if (role === "Collections") {
    return tabId === "dashboard" || tabId === "retail";
  }
  if (role === "Feed Shop") {
    return tabId === "dashboard" || tabId === "cattle-feed";
  }

  // Legacy preset compatibility
  if (role === "Livestock Manager") {
    return tabId === "dashboard" || tabId === "livestock" || tabId === "cattle-feed" || tabId === "butchers";
  }
  if (role === "Retail Cashier") {
    return tabId === "dashboard" || tabId === "retail" || tabId === "butchers" || tabId === "cattle-feed";
  }
  if (role === "Investor") {
    return tabId === "dashboard" || tabId === "livestock" || tabId === "cattle-feed";
  }
  return false;
}

const initialAnimals: Animal[] = [
  { 
    id: "ANI-001", 
    type: "Cow", 
    breed: "Jersey Cross", 
    owner: "Shaie", 
    weightKg: 280, 
    purchasePrice: 65000, 
    advancePaid: 65000, 
    due: 0, 
    status: "Paid", 
    investors: [{ name: "Anis", contribution: 30000 }, { name: "Rafiq", contribution: 23000 }], 
    dateAdded: "2026-05-15", 
    ageMonths: 24, 
    birthDate: "2024-05-15", 
    dueDate: "2026-05-25",
    healthCondition: "Excellent",
    feedingSchedule: "07:30 AM: Rye Grass, 04:00 PM: Silage with dry straw & 2.5kg concentrates",
    healthHistory: [
      { id: "HLT-101", date: "2026-05-16", event: "Routine Vaccination", treatment: "FMD Vaccine", vetName: "Vet Dr. Rahman", cost: 1500, notes: "Healthy head. Next booster dose recommended in 6 months." }
    ]
  },
  { 
    id: "ANI-002", 
    type: "Goat", 
    breed: "Black Bengal", 
    owner: "Karim", 
    weightKg: 35, 
    purchasePrice: 14000, 
    advancePaid: 14000, 
    due: 0, 
    status: "Paid", 
    investors: [], 
    dateAdded: "2026-05-18", 
    ageMonths: 12, 
    birthDate: "2025-05-18",
    healthCondition: "Good",
    feedingSchedule: "Ad-libitum grazing, Evening: 200g grain mix with mineral blocks",
    healthHistory: []
  },
  { 
    id: "ANI-003", 
    type: "Buffalo", 
    breed: "Murrah", 
    owner: "Rafiq", 
    weightKg: 380, 
    purchasePrice: 85000, 
    advancePaid: 83000, 
    due: 2000, 
    status: "Pending", 
    investors: [{ name: "Anis", contribution: 65000 }], 
    dateAdded: "2026-05-10", 
    ageMonths: 36, 
    birthDate: "2023-05-10", 
    dueDate: "2026-05-18",
    healthCondition: "Under treatment",
    feedingSchedule: "06:00 AM: Green Napier grass, 12:00 PM: Straw soak, 05:00 PM: Concentrates & Cottonseed cake",
    healthHistory: [
      { id: "HLT-102", date: "2026-05-12", event: "Deworming Cycle", treatment: "Ivermectin Oral Sol.", vetName: "Vet Dr. Rahman", cost: 600, notes: "Successful deworming. Appetite improved." }
    ]
  },
];

const initialStock = {
  beef: 48.5,
  mutton: 18.0,
  buffalo: 12.0,
  bones: 30.0,
  organs: 8.5
};

const initialSales: Sale[] = [
  { 
    id: "SALE-101", 
    customerName: "Abdur Rahman", 
    customerPhone: "01712345678", 
    customerCode: "1001",
    items: [{ type: "beef", weightKg: 3, ratePerKg: 720, amount: 2160 }], 
    totalAmount: 2160, 
    paymentMethod: "Cash", 
    date: "2026-05-19", 
    amountPaid: 2160, 
    amountDue: 0,
    installments: []
  },
  { 
    id: "SALE-102", 
    customerName: "Hasan Mahmud", 
    customerPhone: "01823456789", 
    customerCode: "1002",
    items: [
      { type: "mutton", weightKg: 13, ratePerKg: 1100, amount: 14300 }, 
      { type: "bones", weightKg: 2, ratePerKg: 250, amount: 500 }
    ], 
    totalAmount: 14800, 
    paymentMethod: "Due", 
    date: "2026-05-18", 
    amountPaid: 6000, 
    amountDue: 8800,
    dueDate: "2026-05-25",
    upcomingCollectionDate: "2026-05-22",
    nextCollectionDate: "2026-05-22",
    collectionNotes: "Arranged split installment payments; promised ₹3,000 on Friday.",
    installments: [
      { id: "INST-101", date: "2026-05-18", amount: 6000, paymentMethod: "bKash", notes: "Initial partial deposit on purchase." }
    ]
  },
  { 
    id: "SALE-103", 
    customerName: "Farid Uddin", 
    customerPhone: "01998765432", 
    customerCode: "1003",
    items: [{ type: "buffalo", weightKg: 8, ratePerKg: 680, amount: 5440 }], 
    totalAmount: 5440, 
    paymentMethod: "Due", 
    date: "2026-05-14", 
    amountPaid: 1000, 
    amountDue: 4440,
    dueDate: "2026-05-19",
    upcomingCollectionDate: "2026-05-19",
    nextCollectionDate: "2026-05-19",
    collectionNotes: "Delayed payment. Customer requested follow up near week-end.",
    installments: [
      { id: "INST-102", date: "2026-05-14", amount: 1000, paymentMethod: "Cash", notes: "Token deposit at checkout." }
    ]
  },
  {
    id: "SALE-104",
    customerName: "Asab - Hita Monaf Mamu Son",
    customerPhone: "01844556677",
    customerCode: "1004",
    items: [{ type: "Beef Extra Lean", weightKg: 2, ratePerKg: 750, amount: 1500 }],
    totalAmount: 1500,
    paymentMethod: "Due",
    date: "2026-05-23T11:00:00Z",
    amountPaid: 1200,
    amountDue: 300,
    dueDate: "2026-05-30",
    installments: [
      { id: "INST-104", date: "2026-05-24", amount: 1200, paymentMethod: "Cash", notes: "Part payment received" }
    ]
  },
  {
    id: "SALE-105",
    customerName: "Sabir ( Gous's Son - Khastilla - DHARMANAGAR )",
    customerPhone: "01788990011",
    customerCode: "1005",
    items: [{ type: "Premium Mutton Slices", weightKg: 6.7, ratePerKg: 1000, amount: 6700 }],
    totalAmount: 6700,
    paymentMethod: "Due",
    date: "2026-05-19T15:28:00Z",
    amountPaid: 0,
    amountDue: 6700,
    dueDate: "2026-05-26",
    installments: []
  },
  {
    id: "SALE-106",
    customerName: "Rahul Uddin Poson Mamu Son",
    customerPhone: "01911223344",
    customerCode: "1006",
    items: [{ type: "Buffalo High Choice", weightKg: 5, ratePerKg: 760, amount: 3800 }],
    totalAmount: 3800,
    paymentMethod: "Due",
    date: "2026-05-19T09:45:00Z",
    amountPaid: 200,
    amountDue: 3600,
    dueDate: "2026-05-26",
    installments: [
      { id: "INST-106", date: "2026-05-19", amount: 200, paymentMethod: "bKash", notes: "Booking token" }
    ]
  },
  {
    id: "SALE-107",
    customerName: "Kaloi Mamu Khastilla - Dharmanagar",
    customerPhone: "01655667788",
    customerCode: "1007",
    items: [{ type: "Special Ribs & Chops", weightKg: 10, ratePerKg: 650, amount: 6500 }],
    totalAmount: 6500,
    paymentMethod: "Due",
    date: "2026-05-19T18:15:00Z",
    amountPaid: 0,
    amountDue: 6500,
    dueDate: "2026-05-26",
    installments: []
  },
  {
    id: "SALE-108",
    customerName: "Fakru Mama Mangalkhali Borobari Near Masjid",
    customerPhone: "01733445566",
    customerCode: "1008",
    items: [{ type: "Beef Soup Bones & Fat", weightKg: 1.8, ratePerKg: 250, amount: 450 }],
    totalAmount: 450,
    paymentMethod: "Due",
    date: "2026-05-18T10:30:00Z",
    amountPaid: 0,
    amountDue: 450,
    dueDate: "2026-05-25",
    installments: []
  },
  {
    id: "SALE-109",
    customerName: "Motin Bhai - Fakrul Bhai's Brother",
    customerPhone: "01855667799",
    customerCode: "1009",
    items: [{ type: "Prime Ribeye & Round", weightKg: 4, ratePerKg: 500, amount: 2000 }],
    totalAmount: 2000,
    paymentMethod: "Due",
    date: "2026-05-17T11:20:00Z",
    amountPaid: 400,
    amountDue: 1600,
    dueDate: "2026-05-24",
    installments: [
      { id: "INST-109", date: "2026-05-17", amount: 400, paymentMethod: "Cash", notes: "Cash advance" }
    ]
  },
  {
    id: "SALE-110",
    customerName: "Niyaz -Mangalkhali Monaf",
    customerPhone: "01522334455",
    customerCode: "1010",
    items: [{ type: "Goat Tenderloin Pack", weightKg: 1.0, ratePerKg: 1000, amount: 1000 }],
    totalAmount: 1000,
    paymentMethod: "Due",
    date: "2026-05-17T16:40:00Z",
    amountPaid: 0,
    amountDue: 1000,
    dueDate: "2026-05-24",
    installments: []
  },
  {
    id: "SALE-111",
    customerName: "Jakir Bhai Khas Tilla",
    customerPhone: "01988776655",
    customerCode: "1011",
    items: [{ type: "Assorted Tripe & Organs", weightKg: 1.7, ratePerKg: 300, amount: 510 }],
    totalAmount: 510,
    paymentMethod: "Due",
    date: "2026-05-17T13:45:00Z",
    amountPaid: 0,
    amountDue: 510,
    dueDate: "2026-05-24",
    installments: []
  },
  {
    id: "SALE-112",
    customerName: "Aklas Mama Eklatilla Jubarajnagar (Arifs Father)",
    customerPhone: "01722338877",
    customerCode: "1012",
    items: [{ type: "Bazar Stallment Wholesale Halal", weightKg: 4.35, ratePerKg: 1000, amount: 4350 }],
    totalAmount: 4350,
    paymentMethod: "Due",
    date: "2026-05-17T08:15:00Z",
    amountPaid: 0,
    amountDue: 4350,
    dueDate: "2026-05-24",
    installments: []
  },
  {
    id: "SALE-113",
    customerName: "Nural Islam",
    customerPhone: "01811663322",
    customerCode: "1013",
    items: [{ type: "Restaurant Sourcing Order Bulk", weightKg: 59.7, ratePerKg: 1000, amount: 59700 }],
    totalAmount: 59700,
    paymentMethod: "Due",
    date: "2026-05-15T10:00:00Z",
    amountPaid: 0,
    amountDue: 59700,
    dueDate: "2026-05-22",
    installments: []
  }
];

const initialInvestorsData = [
  { name: "Anis", balance: 95000, profitEarned: 14000 },
  { name: "Rafiq", balance: 53000, profitEarned: 8200 },
  { name: "Imran", balance: 40000, profitEarned: 3500 },
];

export function triggerCSVDownload<T>(
  data: T[],
  columns: { header: string; accessor: (row: T) => any }[],
  fileName: string
) {
  const headers = columns.map(col => `"${col.header.replace(/"/g, '""')}"`).join(",");
  const rows = data.map(row => {
    return columns.map(col => {
      const val = col.accessor(row);
      const strVal = val === null || val === undefined ? "" : String(val);
      return `"${strVal.replace(/"/g, '""')}"`;
    }).join(",");
  });

  const csvString = [headers, ...rows].join("\n font-sans \n").replace(/\n font-sans \n/g, "\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ShaieAlamDashboard() {
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [activeTab, setActiveTab] = useState<"home" | "dashboard" | "livestock" | "retail" | "investors" | "ai-assistant" | "butchers" | "cattle-feed">("home");

  // Screenshot specific navigation and dashboard modes
  const [homeSubView, setHomeSubView] = useState<"widgets" | "dashboard">("widgets");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  // Dynamic user-customized tasks list matching "Upcoming Tasks" in the screenshots
  const [upcomingTasks, setUpcomingTasks] = useState<Array<{ id: string; name: string; date: string; category: string }>>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Livestock & Health");

  const [collapsedAccordions, setCollapsedAccordions] = useState({
    financial: false, // Financial Overview is EXPANDED by default as shown in the mockup
    livestock: true,
    production: true,
    inventory: true,
    alerts: true,
  });

  // States for interactive sub-dashboard forms and dynamic tables
  const [breedingLogs, setBreedingLogs] = useState<Array<{ id: string; animalId: string; bullId: string; serviceDate: string; expectedDate: string; status: string; notes: string }>>([
    { id: "B-1", animalId: "ANI-001", bullId: "BULL-99", serviceDate: "2026-02-10", expectedDate: "2026-11-15", status: "Active Gestation", notes: "First trimester ultrasound verified." },
    { id: "B-2", animalId: "ANI-003", bullId: "BULL-32", serviceDate: "2026-03-05", expectedDate: "2026-12-10", status: "Active Gestation", notes: "Normal fetal growth observed." }
  ]);
  const [milkLogs, setMilkLogs] = useState<Array<{ id: string; date: string; animalId: string; liters: number; ratePerLiter: number; totalAmount: number }>>([
    { id: "M-1", date: "2026-05-23", animalId: "ANI-001", liters: 15, ratePerLiter: 80, totalAmount: 1200 },
    { id: "M-2", date: "2026-05-24", animalId: "ANI-002", liters: 18, ratePerLiter: 82, totalAmount: 1476 }
  ]);
  const [customAlerts, setCustomAlerts] = useState<Array<{ id: string; subject: string; details: string; urgency: "Low" | "Medium" | "High"; department: string; date: string }>>([
    { id: "A-1", subject: "Humid Temperature Alert", details: "Protect animals from extreme moisture build-up in grazing fields. Ensure fans are active inside cowsheds.", urgency: "High", department: "Livestock Management", date: "2026-05-24" },
    { id: "A-2", subject: "Gabtoli Sourcing Index Alert", details: "Local cattle bazar prices remain average for prime cattle breeds today.", urgency: "Medium", department: "Department Owner / Investors", date: "2026-05-24" }
  ]);

  // Section-specific form open/close toggles
  const [showFinForm, setShowFinForm] = useState(false);
  const [showLiveForm, setShowLiveForm] = useState(false);
  const [showMedForm, setShowMedForm] = useState(false);
  const [showBreedForm, setShowBreedForm] = useState(false);
  const [showDairyForm, setShowDairyForm] = useState(false);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);

  // Home Section Form Input States
  // 1. Financial Overview Form Inputs
  const [finType, setFinType] = useState<"Income" | "Expense">("Income");
  const [finAmount, setFinAmount] = useState("");
  const [finCategory, setFinCategory] = useState("Sales Revenue");
  const [finDescription, setFinDescription] = useState("");

  // 2. Livestock / Animal Inputs
  const [liveType, setLiveType] = useState<"Cow" | "Goat" | "Buffalo" | "Sheep" | "Mithun">("Cow");
  const [liveBreed, setLiveBreed] = useState("");
  const [liveWeight, setLiveWeight] = useState("");
  const [livePrice, setLivePrice] = useState("");
  const [liveOwner, setLiveOwner] = useState("Farm Central");

  // 2B. Medical Inputs
  const [medAnimalId, setMedAnimalId] = useState("");
  const [medType, setMedType] = useState("");
  const [medCost, setMedCost] = useState("");
  const [medCondition, setMedCondition] = useState("Good");

  // 3. Breeding Inputs
  const [breedAnimalId, setBreedAnimalId] = useState("");
  const [breedBullId, setBreedBullId] = useState("");
  const [breedServiceDate, setBreedServiceDate] = useState("");
  const [breedNotes, setBreedNotes] = useState("");

  // 3B. Daily Dairy Inputs
  const [dairyAnimalId, setDairyAnimalId] = useState("");
  const [dairyLiters, setDairyLiters] = useState("");
  const [dairyRate, setDairyRate] = useState("80");

  // 4. Feed Inputs
  const [feedItemId, setFeedItemId] = useState("");
  const [feedOperation, setFeedOperation] = useState<"Deposit" | "Disburse">("Deposit");
  const [feedSacksChange, setFeedSacksChange] = useState("");

  // 5. External Custom Alert Inputs
  const [alertFormSubject, setAlertFormSubject] = useState("");
  const [alertFormDetails, setAlertFormDetails] = useState("");
  const [alertFormUrgency, setAlertFormUrgency] = useState<"Low" | "Medium" | "High">("Medium");
  const [alertFormDept, setAlertFormDept] = useState("All Hands");

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("mf_user_session");
    return saved ? JSON.parse(saved) : null;
  });

  // Flow states for multi-mode authentication
  const [authSmsPhone, setAuthSmsPhone] = useState("");
  const [authSmsSent, setAuthSmsSent] = useState(false);
  const [authSmsCode, setAuthSmsCode] = useState("");
  const [authEmailInput, setAuthEmailInput] = useState("");
  const [authEmailSent, setAuthEmailSent] = useState(false);
  const [incomingSmsBannerCode, setIncomingSmsBannerCode] = useState<string | null>(null);

  const [authMode, setAuthMode] = useState<"social" | "email" | "phone">("social");
  const [selectedRoleForCustomAuth, setSelectedRoleForCustomAuth] = useState<UserRole>("Administrator");
  const [customLoginName, setCustomLoginName] = useState("");
  const [enteredOtpCode, setEnteredOtpCode] = useState("");
  const [permissionErrorMsg, setPermissionErrorMsg] = useState<{
    action: string;
    requiredRoles: string[];
  } | null>(null);

  // Social Auth popup simulation modal states
  const [socialPopup, setSocialPopup] = useState<{
    open: boolean;
    provider: string;
    step: "connecting" | "roles" | "authenticating";
  } | null>(null);

  // Sync session state to localstorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("mf_user_session", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("mf_user_session");
    }
  }, [currentUser]);

  // App States with persistent fallback
  const [animals, setAnimals] = useState<Animal[]>(() => {
    const saved = localStorage.getItem("mf_animals");
    const loaded = saved ? JSON.parse(saved) : initialAnimals;
    return loaded.map((ani: any) => {
      if (!ani.birthDate) {
        const months = ani.ageMonths || 24;
        const bDate = new Date();
        bDate.setMonth(bDate.getMonth() - months);
        ani.birthDate = bDate.toISOString().split("T")[0];
      }
      return ani;
    });
  });

  const [meatStock, setMeatStock] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("mf_stock");
    return saved ? JSON.parse(saved) : initialStock;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem("mf_sales");
    let loadedSales: Sale[] = saved ? JSON.parse(saved) : initialSales;

    // Track assigned customer code per customer to avoid duplicates
    const customerMap: Record<string, string> = {
      "abdur rahman": "1001",
      "hasan mahmud": "1002",
      "farid uddin": "1003",
    };
    let nextAvailableCode = 1004;

    // First scan to see what codes already exist in restored data
    loadedSales = loadedSales.map(s => {
      if (s.customerCode) {
        const numericCode = parseInt(s.customerCode, 10);
        if (!isNaN(numericCode) && numericCode >= nextAvailableCode) {
          nextAvailableCode = numericCode + 1;
        }
        const key = s.customerPhone && s.customerPhone !== "N/A" 
          ? s.customerPhone.trim() 
          : s.customerName.trim().toLowerCase();
        customerMap[key] = s.customerCode;
        customerMap[s.customerName.trim().toLowerCase()] = s.customerCode;
      }
      return s;
    });

    // Ensure all items have a unique customer code
    return loadedSales.map(s => {
      if (s.customerCode) return s;
      
      const phoneKey = s.customerPhone && s.customerPhone !== "N/A" ? s.customerPhone.trim() : null;
      const nameKey = s.customerName.trim().toLowerCase();
      
      let matchedCode = "";
      if (phoneKey && customerMap[phoneKey]) {
        matchedCode = customerMap[phoneKey];
      } else if (customerMap[nameKey]) {
        matchedCode = customerMap[nameKey];
      } else {
        matchedCode = String(nextAvailableCode++);
        if (phoneKey) customerMap[phoneKey] = matchedCode;
        customerMap[nameKey] = matchedCode;
      }
      
      return {
        ...s,
        customerCode: matchedCode
      };
    });
  });

  const [investors, setInvestors] = useState(() => {
    const saved = localStorage.getItem("mf_investors");
    return saved ? JSON.parse(saved) : initialInvestorsData;
  });

  const [butcherDispatches, setButcherDispatches] = useState(() => {
    const saved = localStorage.getItem("mf_butcher_dispatches");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse butcher dispatches", e);
      }
    }
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
        notes: "Excellent muscle definition. Yield exceeded estimates by 2.8kg."
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
        notes: "Scheduled for morning slaughter cycle."
      }
    ];
  });

  const [payoutLogs, setPayoutLogs] = useState(() => {
    const saved = localStorage.getItem("mf_payout_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse payout logs", e);
      }
    }
    return [
      {
        id: "PAY-001",
        date: "2026-05-10",
        totalProfit: 15400,
        type: "Cash Distribution",
        split: [
          { name: "Anis", percentage: 50.5, amount: 7782 },
          { name: "Rafiq", percentage: 28.2, amount: 4341 },
          { name: "Imran", percentage: 21.3, amount: 3277 }
        ]
      }
    ];
  });

  // Departmental states for Cattle Feed & Internal Transfers
  const [feedStock, setFeedStock] = useState<any[]>(() => {
    const saved = localStorage.getItem("mf_feed_stock");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed[0].category) {
          return parsed;
        }
      } catch (e) { console.error(e); }
    }
    return [
      { id: "FEED-001", type: "Rice Bran", category: "Feed", sackCount: 45, sackWeightKg: 50, unitCostPerSack: 950, sellingPricePerSack: 1200, supplier: "Savar Agribusiness" },
      { id: "FEED-002", type: "Wheat Bran", category: "Feed", sackCount: 30, sackWeightKg: 45, unitCostPerSack: 1400, sellingPricePerSack: 1750, supplier: "Bogura Feed Mill" },
      { id: "FEED-003", type: "Mustard Oil Cake", category: "Feed", sackCount: 25, sackWeightKg: 40, unitCostPerSack: 1100, sellingPricePerSack: 1400, supplier: "Tejgaon Food & Grain" },
      { id: "FEED-004", type: "Maize Barley Mash", category: "Feed", sackCount: 50, sackWeightKg: 50, unitCostPerSack: 1200, sellingPricePerSack: 1550, supplier: "Aftab Feed Products" },
      { id: "FEED-005", type: "Grass Hay Bales", category: "Feed", sackCount: 60, sackWeightKg: 20, unitCostPerSack: 300, sellingPricePerSack: 450, supplier: "Savar Agribusiness" },
      { id: "FEED-006", type: "Liquid Calcium Syrup", category: "Medicine", sackCount: 100, sackWeightKg: 1, unitCostPerSack: 180, sellingPricePerSack: 240, supplier: "ACI Animal Health" },
      { id: "FEED-007", type: "Dewormer Broad-Spectrum", category: "Medicine", sackCount: 80, sackWeightKg: 0.5, unitCostPerSack: 120, sellingPricePerSack: 160, supplier: "Square Vet Pharma" },
      { id: "FEED-008", type: "Vitamin AD3H Syrup", category: "Medicine", sackCount: 60, sackWeightKg: 1, unitCostPerSack: 250, sellingPricePerSack: 335, supplier: "Incepta Vet Care" },
      { id: "FEED-009", type: "FMD Vaccine Vials", category: "Medicine", sackCount: 40, sackWeightKg: 0.2, unitCostPerSack: 600, sellingPricePerSack: 800, supplier: "ACI Animal Health" }
    ];
  });

  const [feedSubTab, setFeedSubTab] = useState<"inventory" | "sales" | "customers" | "transactions">("inventory");
  const [feedCustomers, setFeedCustomers] = useState<any[]>(() => {
    const saved = localStorage.getItem("mf_feed_customers");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: "CUST-F01", name: "Rahat Ali (Dairy Eco)", phone: "+880 1715-112233", village: "Savar Dairy Zone", totalPurchased: 48000, dueAmount: 5000 },
      { id: "CUST-F02", name: "Kabir Hossain (Green Agro)", phone: "+880 1912-445566", village: "Bogura Farmstead", totalPurchased: 35000, dueAmount: 0 },
      { id: "CUST-F03", name: "Jasim Uddin (Local Stock)", phone: "+880 1511-778899", village: "Ashulia Fields", totalPurchased: 12000, dueAmount: 2200 },
      { id: "CUST-F04", name: "Mofizul Islam (Mofiz Farms)", phone: "+880 1813-001122", village: "Dhamrai Green", totalPurchased: 24000, dueAmount: 4000 }
    ];
  });

  const [feedStoreSales, setFeedStoreSales] = useState<any[]>(() => {
    const saved = localStorage.getItem("mf_feed_store_sales");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: "FSL-001",
        customerName: "Rahat Ali (Dairy Eco)",
        customerPhone: "+880 1715-112233",
        date: "2026-05-20",
        items: [
          { feedId: "FEED-001", feedType: "Rice Bran", quantitySacks: 10, pricePerSack: 1200, subtotal: 12000 },
          { feedId: "FEED-003", feedType: "Mustard Oil Cake", quantitySacks: 5, pricePerSack: 1400, subtotal: 7000 }
        ],
        totalAmount: 19000,
        amountPaid: 14000,
        amountDue: 5000,
        paymentMethod: "bKash"
      },
      {
        id: "FSL-002",
        customerName: "Kabir Hossain (Green Agro)",
        customerPhone: "+880 1912-445566",
        date: "2026-05-21",
        items: [
          { feedId: "FEED-002", feedType: "Wheat Bran", quantitySacks: 20, pricePerSack: 1750, subtotal: 35000 }
        ],
        totalAmount: 35000,
        amountPaid: 35000,
        amountDue: 0,
        paymentMethod: "Cash"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("mf_feed_customers", JSON.stringify(feedCustomers));
  }, [feedCustomers]);

  useEffect(() => {
    localStorage.setItem("mf_feed_store_sales", JSON.stringify(feedStoreSales));
  }, [feedStoreSales]);

  const [feedAllocations, setFeedAllocations] = useState<any[]>(() => {
    const saved = localStorage.getItem("mf_feed_allocations");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: "ALL-001", animalId: "ANI-001", feedType: "Rye Grass", quantityKg: 5, cost: 90, allocatedDate: "2026-05-18" },
      { id: "ALL-002", animalId: "ANI-001", feedType: "Oat Silage", quantityKg: 10, cost: 212.5, allocatedDate: "2026-05-19" },
      { id: "ALL-003", animalId: "ANI-003", feedType: "Wheat Bran", quantityKg: 15, cost: 420, allocatedDate: "2026-05-20" }
    ];
  });

  const [farmTransactions, setFarmTransactions] = useState<any[]>(() => {
    const saved = localStorage.getItem("mf_farm_transactions");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: "TX-001", animalId: "ANI-001", animalType: "Cow", breed: "Jersey Cross", purchasePrice: 65000, cumulativeWelfareCost: 3000, negotiatedPrice: 75000, netProfit: 7000, date: "2026-05-20" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("mf_feed_stock", JSON.stringify(feedStock));
  }, [feedStock]);

  useEffect(() => {
    localStorage.setItem("mf_feed_allocations", JSON.stringify(feedAllocations));
  }, [feedAllocations]);

  useEffect(() => {
    localStorage.setItem("mf_farm_transactions", JSON.stringify(farmTransactions));
  }, [farmTransactions]);

  useEffect(() => {
    localStorage.setItem("mf_payout_logs", JSON.stringify(payoutLogs));
  }, [payoutLogs]);

  useEffect(() => {
    localStorage.setItem("mf_butcher_dispatches", JSON.stringify(butcherDispatches));
  }, [butcherDispatches]);

  const [batchLogs, setBatchLogs] = useState<BatchProcessLog[]>(() => {
    const saved = localStorage.getItem("mf_batch_process_logs");
    return saved ? JSON.parse(saved) : [];
  });

  // Local capital pool (simulating cash-on-hand)
  const [cashBalance, setCashBalance] = useState<number>(128400);

  // Online / Offline synchronization states
  const [isOnline, setIsOnline] = useState(typeof window !== "undefined" ? window.navigator.onLine : true);
  const [simulateOffline, setSimulateOffline] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("mf_simulate_offline");
    return saved === "true";
  });
  const [syncStatus, setSyncStatus] = useState<"Online" | "Offline" | "Offline - Syncing" | "Sync Complete" | "Changes Cached">("Online");
  const [cachedQueue, setCachedQueue] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("mf_cached_queue");
    return saved ? JSON.parse(saved) : [];
  });
  const [syncProgressIndex, setSyncProgressIndex] = useState<number>(-1);
  const [syncItemProgress, setSyncItemProgress] = useState<number>(0);
  const [prevCachedQueue, setPrevCachedQueue] = useState<string[]>([]);

  const effectiveOnline = isOnline && !simulateOffline;

  // Track physical network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync simulated state to local storage
  useEffect(() => {
    localStorage.setItem("mf_simulate_offline", String(simulateOffline));
  }, [simulateOffline]);

  useEffect(() => {
    localStorage.setItem("mf_cached_queue", JSON.stringify(cachedQueue));
  }, [cachedQueue]);

  // Derive sync status based on connection & queue
  useEffect(() => {
    if (syncStatus === "Offline - Syncing" || syncStatus === "Sync Complete") {
      // Let manual/animated sync sequence finish its states
      return;
    }
    if (!effectiveOnline) {
      if (cachedQueue.length > 0) {
        setSyncStatus("Changes Cached");
      } else {
        setSyncStatus("Offline");
      }
    } else {
      setSyncStatus("Online");
    }
  }, [effectiveOnline, cachedQueue.length, syncStatus]);

  const recordOfflineChange = (description: string) => {
    if (!effectiveOnline) {
      setCachedQueue(prev => [...prev, description]);
    }
  };

  // Profit distribution states & actions
  const [distributeProfitAmount, setDistributeProfitAmount] = useState("");
  const [reinvestProfitAmount, setReinvestProfitAmount] = useState(false);
  const [showDistributionModal, setShowDistributionModal] = useState(false);

  const handleShowDistributionConfirm = () => {
    const profitVal = Number(distributeProfitAmount) || 0;
    if (profitVal <= 0) {
      alert("Please enter a valid profit amount to distribute.");
      return;
    }
    const totalCapital = investors.reduce((sum, inv) => sum + inv.balance, 0);
    if (totalCapital <= 0) {
      alert("No active capital pool balance available to calculate splits. Please make a deposit first.");
      return;
    }
    setShowDistributionModal(true);
  };

  const handleConfirmDistribution = () => {
    const profitVal = Number(distributeProfitAmount) || 0;
    if (profitVal <= 0) return;

    const totalCapital = investors.reduce((sum, inv) => sum + inv.balance, 0);
    if (totalCapital <= 0) return;

    const calculatedSplits = investors.map(inv => {
      const pct = (inv.balance / totalCapital) * 100;
      const amt = (inv.balance / totalCapital) * profitVal;
      return {
        name: inv.name,
        percentage: Math.round(pct * 10) / 10,
        amount: Math.round(amt)
      };
    });

    setInvestors(prev => prev.map(inv => {
      const splitItem = calculatedSplits.find(s => s.name === inv.name);
      if (splitItem) {
        return {
          ...inv,
          balance: reinvestProfitAmount ? inv.balance + splitItem.amount : inv.balance,
          profitEarned: inv.profitEarned + splitItem.amount
        };
      }
      return inv;
    }));

    const newPayoutLog = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
      totalProfit: profitVal,
      type: reinvestProfitAmount ? "Capital Reinvestment" : "Cash Dividend Distribution",
      split: calculatedSplits
    };

    setPayoutLogs(prev => [newPayoutLog, ...prev]);
    recordOfflineChange(`Distributed profit dividend: ₹${profitVal} distributed. Mode: ${newPayoutLog.type}`);

    if (!reinvestProfitAmount) {
      setCashBalance(prev => Math.max(0, prev - profitVal));
    }

    setDistributeProfitAmount("");
    setShowDistributionModal(false);
  };

  const handleExportLivestockCSV = () => {
    const columns = [
      { header: "Animal ID", accessor: (row: Animal) => row.id },
      { header: "Type", accessor: (row: Animal) => row.type },
      { header: "Breed", accessor: (row: Animal) => row.breed },
      { header: "Live Weight (kg)", accessor: (row: Animal) => row.weightKg },
      { header: "Purchase Price (₹)", accessor: (row: Animal) => row.purchasePrice },
      { header: "Advance Paid (₹)", accessor: (row: Animal) => row.advancePaid },
      { header: "Pending Due (₹)", accessor: (row: Animal) => row.due },
      { header: "Status", accessor: (row: Animal) => row.status },
      { header: "Owner / Supplier", accessor: (row: Animal) => row.owner },
      { header: "Date Added", accessor: (row: Animal) => row.dateAdded },
      { header: "Due Date", accessor: (row: Animal) => row.dueDate || "" },
      { header: "Age (Months)", accessor: (row: Animal) => row.ageMonths || "" }
    ];

    triggerCSVDownload(filteredAnimals, columns, `livestock_directory_export_${new Date().toISOString().split("T")[0]}.csv`);
  };

  const handleExportSalesCSV = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayTime = new Date(todayStr + "T00:00:00").getTime();

    const listToExport = sales.filter(sale => {
      const matchesSearch = 
        sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.customerPhone.includes(searchQuery);

      const sVal = sale.amountDue || 0;
      const matchesStatus = 
        collectionFilterStatus === "All" ? true :
        collectionFilterStatus === "Overdue" ? sVal > 0 && sale.dueDate && sale.dueDate < todayStr :
        collectionFilterStatus === "Upcoming" ? sVal > 0 && ((sale.dueDate && sale.dueDate >= todayStr) || (sale.nextCollectionDate && sale.nextCollectionDate >= todayStr)) :
        collectionFilterStatus === "Settled" ? sVal === 0 && (sale.installments || []).length > 0 :
        true;

      let matchesDueDate = true;
      if (collectionDueDateFilter !== "All") {
        if (sVal <= 0 || !sale.dueDate) {
          matchesDueDate = false;
        } else {
          const saleTime = new Date(sale.dueDate + "T00:00:00").getTime();
          const diffMs = saleTime - todayTime;
          const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
          if (collectionDueDateFilter === "Overdue") {
            matchesDueDate = sale.dueDate < todayStr;
          } else if (collectionDueDateFilter === "Within7") {
            matchesDueDate = sale.dueDate >= todayStr && diffDays >= 0 && diffDays <= 7;
          } else if (collectionDueDateFilter === "Within30") {
            matchesDueDate = sale.dueDate >= todayStr && diffDays >= 0 && diffDays <= 30;
          }
        }
      }

      let matchesCategory = true;
      if (collectionFilterCategory !== "All") {
        matchesCategory = sale.items.some(it => it.category === collectionFilterCategory);
      }

      return matchesSearch && matchesStatus && matchesDueDate && matchesCategory;
    });

    const columns = [
      { header: "Invoice ID", accessor: (row: any) => row.id },
      { header: "Customer Name", accessor: (row: any) => row.customerName },
      { header: "Customer Code", accessor: (row: any) => row.customerCode },
      { header: "Customer Phone", accessor: (row: any) => row.customerPhone },
      { header: "Purchase Date", accessor: (row: any) => row.date },
      { 
        header: "Cuts Breakdown", 
        accessor: (row: any) => row.items.map((it: any) => `${it.category.toUpperCase()} (${it.qty}kg x ₹${it.price})`).join(" | ") 
      },
      { header: "Gross Total (₹)", accessor: (row: any) => row.totalAmount },
      { header: "Amount Paid (₹)", accessor: (row: any) => row.amountPaid },
      { header: "Outstanding Due (₹)", accessor: (row: any) => row.amountDue },
      { header: "Final Due Date", accessor: (row: any) => row.dueDate || "N/A" },
      { header: "Scheduled Follow-up", accessor: (row: any) => row.nextCollectionDate || "N/A" }
    ];

    triggerCSVDownload(listToExport, columns, `pos_sales_collection_export_${new Date().toISOString().split("T")[0]}.csv`);
  };

  const checkPermissionAndRun = (
    action: "add-animal" | "process-animal" | "settle-due" | "retail-checkout" | "inject-capital",
    callback: () => void
  ) => {
    const role = currentUser?.role;
    let allowed = false;
    let required: string[] = [];

    if (!currentUser) {
      allowed = false;
      required = ["Any Authenticated Role"];
    } else if (role === "Administrator") {
      allowed = true;
    } else {
      switch (action) {
        case "add-animal":
          allowed = role === "Livestock Manager";
          required = ["Administrator", "Livestock Manager"];
          break;
        case "process-animal":
          allowed = role === "Livestock Manager";
          required = ["Administrator", "Livestock Manager"];
          break;
        case "settle-due":
          allowed = false; // Only Admin
          required = ["Administrator"];
          break;
        case "retail-checkout":
          allowed = role === "Retail Cashier";
          required = ["Administrator", "Retail Cashier"];
          break;
        case "inject-capital":
          allowed = role === "Investor";
          required = ["Administrator", "Investor"];
          break;
      }
    }

    if (allowed) {
      callback();
    } else {
      setPermissionErrorMsg({ action, requiredRoles: required });
    }
  };

  const handleTriggerSocialLogin = (provider: string) => {
    setSocialPopup({ open: true, provider, step: "connecting" });
    
    // Step-by-step federated handshake simulation
    setTimeout(() => {
      setSocialPopup(prev => prev ? { ...prev, step: "roles" } : null);
    }, 1200);
  };

  const renderAccessRestricted = (section: string, allowedRoles: string[]) => {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl my-6">
        <div className="h-20 w-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-lg shadow-amber-500/5">
          <Shield className="h-10 w-10 text-amber-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white tracking-tight">
            {activeTrans.permissionDenied}
          </h3>
          <p className="text-sm text-slate-400">
            {activeTrans.restrictedSection} <span className="text-amber-400 font-bold font-mono">{section}</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl text-xs space-y-2 max-w-md mx-auto">
          <p className="text-slate-500 uppercase tracking-widest font-bold font-mono">Security Enforcement Audit</p>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Active Session Role:</span>
            <span className="text-rose-450 text-rose-400 font-bold">{currentUser?.role}</span>
          </div>
          <div className="flex justify-between pt-1 text-left">
            <span className="text-slate-400 shrink-0 mr-4">Required Security Clearance:</span>
            <span className="text-white font-mono font-bold">{allowedRoles.join(" OR ")}</span>
          </div>
        </div>

        <div className="text-slate-400 text-xs">
          {activeTrans.currentRoleLabel} <span className="text-teal-400 font-mono font-black shrink-0">{currentUser?.role}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              if (currentUser) {
                setCurrentUser({
                  ...currentUser,
                  role: "Administrator"
                });
              }
            }}
            className="bg-amber-500 text-slate-900 hover:bg-amber-400 font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <Key className="h-4 w-4" />
            {activeTrans.requestOverrideBtn}
          </button>
          
          <button
            onClick={() => {
              setActiveTab("dashboard");
            }}
            className="bg-slate-800 hover:bg-slate-700 font-bold py-2.5 px-5 rounded-xl text-xs text-white transition cursor-pointer"
          >
            Return to Authorized Dashboard
          </button>
        </div>
      </div>
    );
  };

  const renderLoginScreen = () => {
    const handlePresetLogin = (profile: UserSession) => {
      setCurrentUser(profile);
      setActiveTab("dashboard");
    };

    const handleSmsSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!authSmsPhone.trim()) {
        alert("Please enter a valid mobile number.");
        return;
      }
      const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
      setAuthSmsCode(demoCode);
      setAuthSmsSent(true);
      setIncomingSmsBannerCode(demoCode);
    };

    const handleSmsVerifyAndLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (enteredOtpCode.trim() === authSmsCode && authSmsCode !== "") {
        const phoneSfx = authSmsPhone.slice(-4);
        const name = customLoginName.trim() || `User ${phoneSfx}`;
        setCurrentUser({
          uid: `phone-${Date.now()}`,
          name,
          phone: authSmsPhone,
          role: selectedRoleForCustomAuth,
          avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`,
          authMethod: "Phone"
        });
        setAuthSmsSent(false);
        setIncomingSmsBannerCode(null);
        setEnteredOtpCode("");
        setActiveTab("dashboard");
      } else {
        alert("Verification code is incorrect. Please check the simulated SMS alert!");
      }
    };

    const handleEmailSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!authEmailInput.includes("@")) {
        alert("Please enter a valid corporate email.");
        return;
      }
      setAuthEmailSent(true);
    };

    const handleEmailVerifyAndLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const emailPrefix = authEmailInput.split("@")[0];
      const name = customLoginName.trim() || emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      setCurrentUser({
        uid: `mail-${Date.now()}`,
        name,
        email: authEmailInput,
        role: selectedRoleForCustomAuth,
        avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`,
        authMethod: "Email"
      });
      setAuthEmailSent(false);
      setActiveTab("dashboard");
    };

    const handleSocialSelectAndLogin = (provider: string) => {
      const randomNames: Record<string, string> = {
        Google: "Ananya Sen (Google Workspace)",
        Microsoft: "Imtiaz Ahmed (Microsoft Azure)",
        Facebook: "Zayan Haider (Meta Social)"
      };
      const name = randomNames[provider] || "Social Profile";
      setCurrentUser({
        uid: `social-${Date.now()}`,
        name,
        role: selectedRoleForCustomAuth,
        avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`,
        authMethod: "Social",
        provider
      });
      setActiveTab("dashboard");
    };

    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-900 antialiased relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated Background Ornaments */}
        <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-teal-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[120px]" />

        {/* SMS Broadcast Notification alert (Banner Simulation on Top) */}
        {incomingSmsBannerCode && (
          <div id="simulated-sms-banner" className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce max-w-sm w-full mx-auto px-4">
            <div className="bg-slate-950 border-2 border-amber-500/40 text-left p-4 rounded-2xl shadow-2xl flex gap-3.5 items-center">
              <div className="h-10 w-10 shrink-0 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 font-bold border border-amber-500/25">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex justify-between font-bold text-slate-400 font-mono text-[9px] uppercase tracking-wider mb-0.5">
                  <span>Simulated SMS Gateway</span>
                  <span className="text-amber-500">Just Now</span>
                </div>
                <p className="text-white font-medium text-[11px] leading-relaxed">
                  [ShaieAlam Security] Use Code <strong className="text-amber-400 font-black font-mono text-sm tracking-widest">{incomingSmsBannerCode}</strong> to authorize your device.
                </p>
              </div>
              <button
                onClick={() => setIncomingSmsBannerCode(null)}
                className="text-slate-500 hover:text-white transition p-1"
                title="Dismiss Banner"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 my-auto">
          
          {/* COL 1: Branding Left Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 lg:p-8 shrink-0">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <BrandLogo size={48} variant="full" />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h2 className="text-xl font-black text-white leading-tight">
                  {lang === "en" ? "Traceable Halal Cattle & Clean Retail Supply Chain ERP" : "নিরাপদ গবাদি পশু ও মাংস সরবরাহ চেইন ইআরপি ও হিসাব কোষ"}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our system verifies digital livestock ownership ledgers, calculated butchering dressing yields via our Gemini module, and instant invoice-payment compliance.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-8 lg:pt-0">
              <div className="flex gap-4 items-center bg-slate-950/40 border border-slate-800/60 p-3 rounded-2xl animate-pulse">
                <Fingerprint className="h-8 w-8 text-teal-400 shrink-0" />
                <div className="text-[10px] space-y-0.5">
                  <p className="font-bold text-slate-300 uppercase tracking-widest font-mono">Active Cryptography</p>
                  <p className="text-slate-500">AES-256 State-Enforced Database Sessions. Permissions comply with South Asian Butchering & Retail protocols.</p>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-[10px] font-bold text-slate-500 font-mono uppercase">Language / ভাষা</span>
                <button
                  onClick={() => setLang(lang === "en" ? "bn" : "en")}
                  className="bg-slate-800 text-teal-400 font-bold px-3 py-1 rounded-lg text-[10px] uppercase border border-slate-700 hover:bg-slate-705 cursor-pointer transition select-none"
                >
                  {lang === "en" ? "বাংলা সংস্করণ" : "English Version"}
                </button>
              </div>
            </div>
          </div>

          {/* COL 2: Custom Multi-Mode Auth Controls and Demo bypass */}
          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8 backdrop-blur-md">
            
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Lock className="h-4.5 w-4.5 text-teal-400" />
                {activeTrans.credAuthTitle}
              </h3>
              <p className="text-[11px] text-slate-400">
                Authorized ShaieAlam personnel: Select authentication mode to access your station.
              </p>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              {[
                { id: "social", label: "Federated Social", icon: Globe },
                { id: "email", label: "Email Bypass", icon: Mail },
                { id: "phone", label: "SMS Device Key", icon: Phone }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAuthMode(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold transition select-none cursor-pointer ${
                    authMode === tab.id 
                      ? "bg-slate-800 text-teal-400 shadow-sm shadow-black" 
                      : "text-slate-450 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Box */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl">
              
              {/* Optional Registration Customizer: Displayed for Email or Phone mode so user can set who they are and choose role! */}
              {authMode !== "social" && (
                <div className="mb-4 pb-4 border-b border-slate-800 space-y-3.5 text-left font-sans">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    Step 1: Assign Station Identity
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Salim Siddique"
                        value={customLoginName}
                        onChange={(e) => setCustomLoginName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 text-left"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                        Select Corporate Role (clearance)
                      </label>
                      <select
                        value={selectedRoleForCustomAuth}
                        onChange={(e) => setSelectedRoleForCustomAuth(e.target.value as UserRole)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                      >
                        <option value="Administrator">1. Administrator (All Access)</option>
                        <option value="Livestock Management">2. Livestock Management</option>
                        <option value="Butcher Shop">3. Butcher Shop</option>
                        <option value="Collections">4. Collections (POS & Ledger)</option>
                        <option value="Feed Shop">5. Feed Shop (Welfare & Store)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE: SOCIAL AUTH */}
              {authMode === "social" && (
                <div className="space-y-4 text-center">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 text-left">
                    Assigned Role for Social handshake:
                  </p>
                  <div className="flex gap-3 justify-start mb-4 overflow-x-auto pb-1">
                    {["Administrator", "Livestock Management", "Butcher Shop", "Collections", "Feed Shop"].map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRoleForCustomAuth(role as any)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition select-none cursor-pointer shrink-0 ${
                          selectedRoleForCustomAuth === role
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/30 font-black"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { name: "Google", color: "hover:bg-red-500/10 hover:border-red-500/30" },
                      { name: "Microsoft", color: "hover:bg-blue-500/10 hover:border-blue-500/30" },
                      { name: "Facebook", color: "hover:bg-sky-600/10 hover:border-sky-600/30" }
                    ].map(prov => (
                      <button
                        key={prov.name}
                        onClick={() => handleSocialSelectAndLogin(prov.name)}
                        className={`bg-slate-950 border border-slate-800 p-4 rounded-xl text-center cursor-pointer transition flex flex-col items-center gap-2 ${prov.color}`}
                      >
                        <Globe className="h-5 w-5 text-teal-500 animate-pulse" />
                        <span className="text-[11px] font-black">{prov.name} Log In</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* MODE: EMAIL AUTH */}
              {authMode === "email" && (
                <div className="text-left space-y-4">
                  {!authEmailSent ? (
                    <form onSubmit={handleEmailSend} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-450 text-slate-400 tracking-wider uppercase mb-1">
                          Role-Based Corporate Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder={activeTrans.emailPlaceholder}
                          value={authEmailInput}
                          onChange={(e) => setAuthEmailInput(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 font-mono text-left"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer select-none"
                      >
                        <Mail className="h-4 w-4" />
                        {activeTrans.emailLinkBtn}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-4 space-y-4 animate-fadeIn">
                      <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                        <Check className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white leading-tight">Magic Activation Link Dispatched!</p>
                        <p className="text-[10px] text-slate-450 text-slate-400 leading-normal max-w-sm mx-auto">
                          A simulation login link has been piped immediately to <span className="font-mono text-teal-400 font-bold">{authEmailInput}</span>. You can bypass this check to enter immediately:
                        </p>
                      </div>
                      <button
                        onClick={handleEmailVerifyAndLogin}
                        className="bg-emerald-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs hover:bg-emerald-400 transition cursor-pointer"
                      >
                        Click to Activate Session as {selectedRoleForCustomAuth}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MODE: PHONE AUTH */}
              {authMode === "phone" && (
                <div className="text-left space-y-4">
                  {!authSmsSent ? (
                    <form onSubmit={handleSmsSend} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-450 text-slate-400 tracking-wider uppercase mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder={activeTrans.phonePlaceholder}
                          value={authSmsPhone}
                          onChange={(e) => setAuthSmsPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 font-mono text-left"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer select-none"
                      >
                        <Phone className="h-4 w-4" />
                        {activeTrans.phoneOtpBtn}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSmsVerifyAndLogin} className="space-y-4 animate-fadeIn">
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl py-2 px-3.5 text-[10px] text-amber-400 flex items-center gap-2 leading-tight">
                        <span className="h-2 w-2 bg-amber-500 rounded-full animate-ping shrink-0" />
                        <div>
                          <strong>Verification Code Generated:</strong> Look closely at the top SMS notification banner or type: <span className="font-mono font-bold bg-slate-950 px-1 py-0.5 rounded text-white tracking-widest text-xs border border-slate-800">{authSmsCode}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-450 text-slate-400 tracking-wider uppercase mb-1">
                          {activeTrans.otpPrompt}
                        </label>
                        <input
                          type="text"
                          required
                          pattern="\d{6}"
                          placeholder={activeTrans.otpPlaceholder}
                          value={enteredOtpCode}
                          onChange={(e) => setEnteredOtpCode(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-center tracking-widest text-white focus:outline-none focus:border-teal-500 font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer select-none"
                      >
                        <UserCheck className="h-4 w-4" />
                        {activeTrans.otpVerifyBtn}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>

            {/* DEMO BYPASS SECTION */}
            <div className="space-y-4 pt-4 border-t border-slate-800 text-left">
              <div>
                <p className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                  {activeTrans.presetTitle}
                </p>
                <p className="text-[11px] text-slate-450 text-slate-400 mt-0.5">
                  {activeTrans.presetSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {DEMO_PROFILES.map(profile => {
                  let badgeColor = "bg-rose-500/15 text-rose-400 border border-rose-500/25";
                  if (profile.role === "Livestock Management") badgeColor = "bg-teal-500/15 text-teal-400 border border-teal-500/25";
                  if (profile.role === "Butcher Shop") badgeColor = "bg-orange-500/15 text-orange-400 border border-orange-500/25";
                  if (profile.role === "Collections") badgeColor = "bg-blue-500/15 text-blue-400 border border-blue-500/25";
                  if (profile.role === "Feed Shop") badgeColor = "bg-amber-500/15 text-amber-500 border border-amber-500/25";

                  return (
                    <button
                      key={profile.uid}
                      onClick={() => handlePresetLogin(profile)}
                      className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-left hover:border-teal-500/30 transition shadow-sm hover:shadow-black flex gap-3.5 items-start cursor-pointer group"
                    >
                      <img src={profile.avatarUrl} alt={profile.name} className="h-9 w-9 rounded-lg border border-slate-800 shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center bg-slate-900 gap-2">
                          <span className="font-bold text-white text-xs max-w-[120px] truncate group-hover:text-teal-400 transition">{profile.name}</span>
                          <span className={`${badgeColor} text-[8px] font-mono font-black py-0.5 px-2 rounded-full uppercase tracking-wider scale-95 origin-right shrink-0`}>
                            {profile.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">
                          {profile.role === "Administrator" ? activeTrans.adminDesc :
                           profile.role === "Livestock Management" ? "Livestock department operations only." :
                           profile.role === "Butcher Shop" ? "Butcher outlet tracking and actual carcass portion credits." :
                           profile.role === "Collections" ? "Retail sales checkout counter and money collections ledger." :
                           profile.role === "Feed Shop" ? "Nutritional bags allocation, medicines & store-front terminal." :
                           "Department clearance access level."}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  };

  const handleSyncNow = () => {
    if (!isOnline) {
      alert("Cannot synchronize right now. Your physical network is offline! Please enable your network internet connection first or turn off offline simulation.");
      return;
    }
    if (simulateOffline) {
      // Reconnect by disabling artificial offline simulation
      setSimulateOffline(false);
    }
    
    setSyncStatus("Offline - Syncing");
    
    const queueLength = cachedQueue.length;
    if (queueLength === 0) {
      setSyncProgressIndex(-1);
      setSyncItemProgress(0);
      setTimeout(() => {
        setSyncStatus("Sync Complete");
        setTimeout(() => {
          setSyncStatus("Online");
        }, 1500);
      }, 800);
      return;
    }

    // Keep a copy of cachedQueue for UI presentation even if we empty it at the end
    setPrevCachedQueue([...cachedQueue]);
    setSyncProgressIndex(0);
    setSyncItemProgress(0);

    let currentIndex = 0;
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 25;
      if (currentProgress > 100) {
        currentProgress = 0;
        currentIndex += 1;
        if (currentIndex >= queueLength) {
          clearInterval(interval);
          setCachedQueue([]);
          setAnimals(prev => prev.map(a => ({ ...a, isCached: false })));
          setSales(prev => prev.map(s => ({ ...s, isCached: false })));
          setSyncStatus("Sync Complete");
          setSyncProgressIndex(-1);
          setSyncItemProgress(0);
          
          setTimeout(() => {
            setSyncStatus("Online");
          }, 2000);
          return;
        }
      }
      setSyncProgressIndex(currentIndex);
      setSyncItemProgress(currentProgress);
    }, 200);
  };

  // Sync state to localstorage
  useEffect(() => {
    localStorage.setItem("mf_animals", JSON.stringify(animals));
  }, [animals]);

  useEffect(() => {
    localStorage.setItem("mf_stock", JSON.stringify(meatStock));
  }, [meatStock]);

  useEffect(() => {
    localStorage.setItem("mf_sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("mf_investors", JSON.stringify(investors));
  }, [investors]);

  useEffect(() => {
    localStorage.setItem("mf_batch_process_logs", JSON.stringify(batchLogs));
  }, [batchLogs]);

  // UI Filters / Modals logic
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [showAddAnimalModal, setShowAddAnimalModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showSyncDropdown, setShowSyncDropdown] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Sale | null>(null);

  // Money Collections Outstanding Ledger States
  const [retailSubTab, setRetailSubTab] = useState<"counter" | "collections" | "customers" >("counter");
  const [feedPosCustSelect, setFeedPosCustSelect] = useState<string>("WalkIn");
  const [feedPosCustName, setFeedPosCustName] = useState<string>("");
  const [feedPosCustPhone, setFeedPosCustPhone] = useState<string>("");
  const [feedPosCustVillage, setFeedPosCustVillage] = useState<string>("");
  const [feedPosSelectedFeedId, setFeedPosSelectedFeedId] = useState<string>("");
  const [feedPosQtySacks, setFeedPosQtySacks] = useState<string>("");
  const [feedPosAmountPaid, setFeedPosAmountPaid] = useState<string>("");
  const [feedPosPaymentMethod, setFeedPosPaymentMethod] = useState<string>("Cash");
  const [showFeedInvoiceModel, setShowFeedInvoiceModel] = useState<boolean>(false);
  const [selectedFeedStoreSale, setSelectedFeedStoreSale] = useState<any>(null);
  const [paymentRecCustId, setPaymentRecCustId] = useState<string | null>(null);
  const [paymentRecAmount, setPaymentRecAmount] = useState<string>("");
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [activeCollectionSale, setActiveCollectionSale] = useState<Sale | null>(null);
  const [collectionFilterStatus, setCollectionFilterStatus] = useState<string>("All");
  const [collectionFilterCategory, setCollectionFilterCategory] = useState<string>("All");
  const [collectionDueDateFilter, setCollectionDueDateFilter] = useState<string>("All");
  const [supplierDueFilter, setSupplierDueFilter] = useState<string>("All");

  // Record Collection Form
  const [installmentAmount, setInstallmentAmount] = useState<string>("");
  const [installmentNotes, setInstallmentNotes] = useState<string>("");
  const [installmentMethod, setInstallmentMethod] = useState<string>("Cash");
  const [installmentNextDate, setInstallmentNextDate] = useState<string>("");
  const [installmentUpcomingDate, setInstallmentUpcomingDate] = useState<string>("");
  const [installmentSpecialNotes, setInstallmentSpecialNotes] = useState<string>("");

  // Modals Forms
  const [newAnimal, setNewAnimal] = useState<Partial<Animal>>({
    type: "Cow",
    breed: "Local Desi",
    owner: "",
    weightKg: 200,
    purchasePrice: 45005,
    advancePaid: 35000,
    due: 10005,
    feedType: "Natural Grass",
    healthCondition: "8/10 (Good)",
    birthDate: "2024-05-20",
    ageMonths: 24,
    color: "",
    appearance: "",
    notes: "",
    dueDate: "2026-05-27",
    dateAdded: new Date().toISOString().split("T")[0],
    feedingSchedule: "Morning: 08:30 AM Green grass, Afternoon: Bran & Husk wash"
  });

  const [frontImage, setFrontImage] = useState<string>("");
  const [leftSideImage, setLeftSideImage] = useState<string>("");
  const [rightSideImage, setRightSideImage] = useState<string>("");
  const [backsideImage, setBacksideImage] = useState<string>("");
  const [teethImage, setTeethImage] = useState<string>("");
  const [isAnalyzingCattle, setIsAnalyzingCattle] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string>("");
  const [isFromBazar, setIsFromBazar] = useState<boolean>(false);
  const [bazarName, setBazarName] = useState<string>("");
  const [bazarReceiptImage, setBazarReceiptImage] = useState<string>("");

  // Investment Calculator States
  const [showInvestmentCalcModal, setShowInvestmentCalcModal] = useState(false);
  const [calcAnimalType, setCalcAnimalType] = useState<string>("Cow");
  const [calcInitialWeight, setCalcInitialWeight] = useState<number>(250);
  const [calcPurchasePrice, setCalcPurchasePrice] = useState<number>(65000);
  const [calcGrowthWeeks, setCalcGrowthWeeks] = useState<number>(24);
  const [calcDailyWeightGain, setCalcDailyWeightGain] = useState<number>(0.8);
  const [calcDailyFeedCost, setCalcDailyFeedCost] = useState<number>(150);
  const [calcMedicineCost, setCalcMedicineCost] = useState<number>(2500);
  const [calcOtherCosts, setCalcOtherCosts] = useState<number>(1500);
  const [calcDressingPercent, setCalcDressingPercent] = useState<number>(52);
  const [calcProjectedMeatPrice, setCalcProjectedMeatPrice] = useState<number>(650);
  const [calcProjectedByproducts, setCalcProjectedByproducts] = useState<number>(4500);

  const openInvestmentCalculator = (type?: string, weight?: number, price?: number) => {
    if (type) setCalcAnimalType(type);
    if (weight) setCalcInitialWeight(weight);
    if (price) setCalcPurchasePrice(price);
    
    // Set smart defaults based on animal type if customized
    const animalLower = (type || "Cow").toLowerCase();
    if (animalLower.includes("goat") || animalLower.includes("sheep")) {
      setCalcInitialWeight(weight || 25);
      setCalcPurchasePrice(price || 8500);
      setCalcDailyWeightGain(0.15);
      setCalcDailyFeedCost(25);
      setCalcMedicineCost(800);
      setCalcOtherCosts(500);
      setCalcDressingPercent(48);
      setCalcProjectedMeatPrice(750);
      setCalcProjectedByproducts(850);
    } else if (animalLower.includes("buffalo") || animalLower.includes("mithun")) {
      setCalcInitialWeight(weight || 320);
      setCalcPurchasePrice(price || 85000);
      setCalcDailyWeightGain(0.9);
      setCalcDailyFeedCost(180);
      setCalcMedicineCost(3500);
      setCalcOtherCosts(2500);
      setCalcDressingPercent(50);
      setCalcProjectedByproducts(6500);
    } else { // Cow / standard
      setCalcInitialWeight(weight || 220);
      setCalcPurchasePrice(price || 55000);
      setCalcDailyWeightGain(0.75);
      setCalcDailyFeedCost(140);
      setCalcMedicineCost(2500);
      setCalcOtherCosts(1800);
      setCalcDressingPercent(52);
      setCalcProjectedByproducts(4500);
    }
    setShowInvestmentCalcModal(true);
  };

  const handleCompressAndSetImage = (file: File, setter: (val: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          setter(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const [processTarget, setProcessTarget] = useState<Animal | null>(null);
  const [customYieldRatio, setCustomYieldRatio] = useState<number>(0.52);

  // Batch Slicing & Processing state
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [bulkHealthCondition, setBulkHealthCondition] = useState("");
  const [bulkHealthConditionCustom, setBulkHealthConditionCustom] = useState("");
  const [bulkOwner, setBulkOwner] = useState("");
  const [bulkOwnerCustom, setBulkOwnerCustom] = useState("");
  const [showBatchProcessModal, setShowBatchProcessModal] = useState(false);
  const [batchYieldRatio, setBatchYieldRatio] = useState<number>(0.52);

  // Health and Treatment states
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [activeHealthAnimal, setActiveHealthAnimal] = useState<Animal | null>(null);
  const [healthEvent, setHealthEvent] = useState("");
  const [healthTreatment, setHealthTreatment] = useState("");
  const [healthVetName, setHealthVetName] = useState("");
  const [healthCost, setHealthCost] = useState("");
  const [healthNotes, setHealthNotes] = useState("");
  const [healthDate, setHealthDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [healthDueDate, setHealthDueDate] = useState("");
  const [doctorConsultationDate, setDoctorConsultationDate] = useState("");
  const [healthConditionUpdate, setHealthConditionUpdate] = useState("Good");
  const [editingHealthRecord, setEditingHealthRecord] = useState<HealthRecord | null>(null);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [viewingAnimalDetail, setViewingAnimalDetail] = useState<Animal | null>(null);
  const [showEditAnimalModal, setShowEditAnimalModal] = useState(false);
  const [healthSubView, setHealthSubView] = useState<"list" | "form">("list");
  const [healthGroupMode, setHealthGroupMode] = useState<"none" | "date" | "event">("event");

  // Cattle Feed allocation form states
  const [allocateAnimalId, setAllocateAnimalId] = useState("");
  const [allocateFeedId, setAllocateFeedId] = useState("");
  const [allocateQtyKg, setAllocateQtyKg] = useState("");
  
  // Custom welfare logging input state variables
  const [welfareAnimalId, setWelfareAnimalId] = useState("");
  const [welfareLogType, setWelfareLogType] = useState<"Medicine" | "Maintenance" | "Handling">("Medicine");
  const [welfareCostAmt, setWelfareCostAmt] = useState("");
  const [welfareDescription, setWelfareDescription] = useState("");

  // Feed Purchase form states
  const [newFeedType, setNewFeedType] = useState("");
  const [newFeedSackCount, setNewFeedSackCount] = useState("");
  const [newFeedSackWeight, setNewFeedSackWeight] = useState("25");
  const [newFeedUnitCost, setNewFeedUnitCost] = useState("");
  const [newFeedSupplier, setNewFeedSupplier] = useState("");

  // Slaughter Interdepartmental Negotiation Modal states
  const [negotiationActiveAnimal, setNegotiationActiveAnimal] = useState<Animal | null>(null);
  const [negotiatedInternalPrice, setNegotiatedInternalPrice] = useState("");
  const [negotiationNotes, setNegotiationNotes] = useState("");

  const [reminderConfig, setReminderConfig] = useState({
    enableEmail: true,
    enableSms: true,
    daysBefore: 3,
    daysAfter: 7,
    reminderMedium: "Both" as "Email" | "SMS" | "Both"
  });

  const [reminderLogs, setReminderLogs] = useState<Array<{
    id: string;
    animalId: string;
    ownerName: string;
    dueDate: string;
    amount: number;
    daysDiff: number;
    type: string;
    medium: "Email" | "SMS" | "Both";
    sentAt: string;
    status: "Sent" | "Failed";
    messageText: string;
  }>>([
    {
      id: "REM-3902",
      animalId: "ANI-101",
      ownerName: "Abul Kalam",
      dueDate: "2026-05-13",
      amount: 10000,
      daysDiff: -7,
      type: "7 Days After Overdue Alert",
      medium: "Both",
      sentAt: "2026-05-20 09:12 AM",
      status: "Sent",
      messageText: "Overdue Warning to Abul Kalam: payment of ₹10,000 for animal ANI-101 is now 7 days past due date (2026-05-13). Please settle."
    },
    {
      id: "REM-4821",
      animalId: "ANI-102",
      ownerName: "Siddique Rahman",
      dueDate: "2026-05-23",
      amount: 12000,
      daysDiff: 3,
      type: "3 Days Before Alert",
      medium: "SMS",
      sentAt: "2026-05-20 10:02 AM",
      status: "Sent",
      messageText: "Dear Siddique Rahman, this is an automated 3-day advance notice of outstanding dues of ₹12,000 for animal ANI-102 due on 2026-05-23."
    }
  ]);

  const [newSale, setNewSale] = useState({
    customerCode: "",
    customerName: "",
    customerPhone: "",
    items: [{ type: "beef", weightKg: 1, ratePerKg: 720 }],
    paymentMethod: "Cash" as const
  });

  // Helper utility to resolve or compile a unique customer code
  const resolveOrGenerateCustomerCode = (name: string, phone: string, typedCode?: string): string => {
    if (typedCode && typedCode.trim()) {
      return typedCode.trim();
    }

    // Lookup existing sale matching name or phone
    const existing = sales.find(s => {
      const isSamePhone = phone && phone !== "N/A" && s.customerPhone && s.customerPhone !== "N/A" && s.customerPhone.trim() === phone.trim();
      const isSameName = s.customerName.trim().toLowerCase() === name.trim().toLowerCase();
      return isSamePhone || isSameName;
    });

    if (existing && existing.customerCode) {
      return existing.customerCode;
    }

    // Auto-generate next sequential code starting from 1001
    let maxCode = 1000;
    sales.forEach(s => {
      if (s.customerCode) {
        const num = parseInt(s.customerCode, 10);
        if (!isNaN(num) && num > maxCode) {
          maxCode = num;
        }
      }
    });

    return String(maxCode + 1);
  };

  const [customAmountPaid, setCustomAmountPaid] = useState<number | "">("");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [selectedTrackerCode, setSelectedTrackerCode] = useState<string>("");
  const [showGaveForm, setShowGaveForm] = useState(false);
  const [showGotForm, setShowGotForm] = useState(false);
  const [gaveAmount, setGaveAmount] = useState("");
  const [gaveDescription, setGaveDescription] = useState("");
  const [gaveDate, setGaveDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [gotAmount, setGotAmount] = useState("");
  const [gotDescription, setGotDescription] = useState("");
  const [gotDate, setGotDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [gotPaymentMethod, setGotPaymentMethod] = useState<"Cash" | "bKash" | "Card">("Cash");
  const [showReminderOptionsId, setShowReminderOptionsId] = useState<string | null>(null);
  const [showCashbookModal, setShowCashbookModal] = useState(false);
  const [dateReminderSettingId, setDateReminderSettingId] = useState<string | null>(null);
  const [reminderSelectedDate, setReminderSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerStatusMsg, setScannerStatusMsg] = useState<string | null>(null);

  // Default dates for new transaction outstanding dues
  const [posDueDate, setPosDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [posNextCollection, setPosNextCollection] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [posCollectionNotes, setPosCollectionNotes] = useState<string>("");

  // AI states
  const [predictInputs, setPredictInputs] = useState({
    type: "Cow",
    breed: "Jersey Cross",
    weightKg: "310",
    purchasePrice: "72000",
    feedType: "Husk + Silage Oats",
    healthCondition: "Excellent",
    ageMonths: "26"
  });

  const [aiPrediction, setAiPrediction] = useState<any>(null);
  const [predicting, setPredicting] = useState(false);

  // States for individual animal smart forecasting on-the-fly via Gemini
  const [selectedForecastAnimal, setSelectedForecastAnimal] = useState<Animal | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState<any>(null);

  const [docLoading, setDocLoading] = useState(false);
  const [serverDoc, setServerDoc] = useState<any>(null);

  // Calculate dynamic metrics
  const totalSalesVal = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPendingDues = animals.reduce((acc, curr) => curr.status !== "Processed" && curr.status !== "Paid" ? acc + curr.due : acc, 0);
  const activeAnimalsCount = animals.filter(a => a.status === "Pending" || a.status === "Paid" || a.status === "Overdue").length;
  const lowStockCount = Object.keys(meatStock).filter(key => (meatStock[key] as number) < 10).length;

  const handleUpdateAnimalStatusFromButcher = (animalId: string, status: "Processed") => {
    setAnimals(prev => prev.map(ani => {
      if (ani.id === animalId) {
        return { ...ani, status };
      }
      return ani;
    }));
    recordOfflineChange(`Processed animal ${animalId} via Butcher Shop slaughter`);
  };

  // Add Animal submit
  const handleAddAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    checkPermissionAndRun("add-animal", () => {
      const id = `ANI-${String(animals.length + 1).padStart(3, "0")}`;
      const purchaseAmount = Number(newAnimal.purchasePrice) || 0;
      const advanceAmount = Number(newAnimal.advancePaid) || 0;
      const calculatedDue = Math.max(0, purchaseAmount - advanceAmount);

      const computedAgeMonths = newAnimal.birthDate ? getMonthsFromBirthdate(newAnimal.birthDate) : (Number(newAnimal.ageMonths) || 24);
      const computedBirthDate = newAnimal.birthDate || new Date(Date.now() - (Number(newAnimal.ageMonths) || 24) * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      const created: Animal = {
        id,
        type: (newAnimal.type || "Cow") as any,
        breed: newAnimal.breed || "Desi",
        owner: newAnimal.owner || "Walk-In Trader",
        weightKg: Number(newAnimal.weightKg) || 150,
        purchasePrice: purchaseAmount,
        advancePaid: advanceAmount,
        due: calculatedDue,
        status: calculatedDue > 0 ? "Pending" : "Paid",
        investors: [],
        dateAdded: newAnimal.dateAdded || new Date().toISOString().split("T")[0],
        feedType: newAnimal.feedType,
        healthCondition: newAnimal.healthCondition,
        ageMonths: computedAgeMonths,
        birthDate: computedBirthDate,
        notes: newAnimal.notes,
        feedingSchedule: newAnimal.feedingSchedule || "",
        dueDate: calculatedDue > 0 ? (newAnimal.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]) : undefined,
        isCached: !effectiveOnline,
        frontImage: frontImage || undefined,
        leftSideImage: leftSideImage || undefined,
        rightSideImage: rightSideImage || undefined,
        backsideImage: backsideImage || undefined,
        teethImage: teethImage || undefined,
        color: newAnimal.color || undefined,
        appearance: newAnimal.appearance || undefined,
        isFromBazar: isFromBazar,
        bazarName: isFromBazar ? (bazarName || "Local Bazar") : undefined,
        bazarReceiptImage: isFromBazar ? (bazarReceiptImage || undefined) : undefined
      };

      setAnimals([created, ...animals]);
      setCashBalance(prev => prev - advanceAmount);
      setShowAddAnimalModal(false);
      if (!effectiveOnline) {
        recordOfflineChange(`Added Animal ${id} (${created.type} - ${created.breed})`);
      }
      // Reset image and bazar fields
      setFrontImage("");
      setLeftSideImage("");
      setRightSideImage("");
      setBacksideImage("");
      setTeethImage("");
      setAiAnalysisResult("");
      setIsFromBazar(false);
      setBazarName("");
      setBazarReceiptImage("");

      // Reset form
      setNewAnimal({
        type: "Cow",
        breed: "Local Desi",
        owner: "",
        weightKg: 200,
        purchasePrice: 45000,
        advancePaid: 35000,
        due: 10000,
        feedType: "Natural Grass",
        healthCondition: "8/10 (Good)",
        birthDate: "2024-05-20",
        ageMonths: 24,
        color: "",
        appearance: "",
        notes: "",
        dueDate: "",
        dateAdded: new Date().toISOString().split("T")[0],
        feedingSchedule: ""
      });
    });
  };

  // Settle supplier dues
  const handleSettleDue = (animalId: string) => {
    const target = animals.find(a => a.id === animalId);
    if (!target || target.due <= 0) return;

    setAnimals(animals.map(a => {
      if (a.id === animalId) {
        return { ...a, advancePaid: a.purchasePrice, due: 0, status: a.status === "Pending" || a.status === "Overdue" ? "Paid" : a.status };
      }
      return a;
    }));
    setCashBalance(prev => prev - target.due);
    if (!effectiveOnline) {
      recordOfflineChange(`Settled ₹${target.due} supplier dues for Animal ${animalId}`);
    }
  };

  // Convert active animal into retail items (slicing cattle, storing yields in cold display room)
  const handleProcessAnimalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!processTarget) return;

    checkPermissionAndRun("process-animal", () => {
      const estimatedDressingYield = Math.round(processTarget.weightKg * customYieldRatio);
      
      // Allocate processed meat into our active inventory based on typical South Asian butchering ratios
      // Premium meat: 65%, Bones/Soup cuts: 25%, Organs/offal: 10%
      const itemType = processTarget.type.toLowerCase();
      const targetMeatKey = itemType === "cow" ? "beef" : (itemType === "buffalo" ? "buffalo" : "mutton");
      
      const premiumWeight = Math.round(estimatedDressingYield * 0.65 * 10) / 10;
      const boneWeight = Math.round(estimatedDressingYield * 0.25 * 10) / 10;
      const organWeight = Math.round(estimatedDressingYield * 0.10 * 10) / 10;

      setMeatStock(prev => ({
        ...prev,
        [targetMeatKey]: (prev[targetMeatKey] || 0) + premiumWeight,
        bones: (prev.bones || 0) + boneWeight,
        organs: (prev.organs || 0) + organWeight
      }));

      setAnimals(animals.map(a => {
        if (a.id === processTarget.id) {
          return { ...a, status: "Processed" };
        }
        return a;
      }));

      setShowProcessModal(false);
      if (!effectiveOnline) {
        recordOfflineChange(`Processed Animal ${processTarget.id} (${processTarget.type}) into cold stock yield of ${estimatedDressingYield}kg`);
      }
      setProcessTarget(null);
    });
  };

  // 1. Record Feed Purchase to Inventory Stock
  const handleRecordFeedPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedType) return;
    const count = Number(newFeedSackCount) || 1;
    const wt = Number(newFeedSackWeight) || 25;
    const cost = Number(newFeedUnitCost) || 0;
    
    const newItem = {
      id: `FEED-${Math.floor(100 + Math.random() * 900)}`,
      type: newFeedType,
      sackCount: count,
      sackWeightKg: wt,
      unitCostPerSack: cost,
      supplier: newFeedSupplier || "Raw Material Market"
    };

    setFeedStock([...feedStock, newItem]);
    setNewFeedType("");
    setNewFeedSackCount("");
    setNewFeedUnitCost("");
    setNewFeedSupplier("");
  };

  // 2. Allocate Feed to specific Animal in Cattle Farm
  const handleAllocateFeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocateAnimalId || !allocateFeedId || !allocateQtyKg) return;

    const qty = Number(allocateQtyKg);
    if (qty <= 0) return;

    const feedItem = feedStock.find(f => f.id === allocateFeedId);
    if (!feedItem) return;

    // Calculate cost: count is qty / sackWeight
    const sackFrac = qty / (feedItem.sackWeightKg || 25);
    const costAllocated = Math.round(sackFrac * feedItem.unitCostPerSack);

    // Update animal's feed cost
    setAnimals(animals.map(a => {
      if (a.id === allocateAnimalId) {
        return {
          ...a,
          feedCost: (a.feedCost || 0) + costAllocated,
          feedType: feedItem.type
        };
      }
      return a;
    }));

    // Deduct feed stock sacks
    setFeedStock(feedStock.map(f => {
      if (f.id === allocateFeedId) {
        return {
          ...f,
          sackCount: Math.max(0, parseFloat((f.sackCount - sackFrac).toFixed(2)))
        };
      }
      return f;
    }));

    // Record allocation log
    const newAllocLog = {
      id: `ALL-${Math.floor(1000 + Math.random() * 9000)}`,
      animalId: allocateAnimalId,
      feedType: feedItem.type,
      quantityKg: qty,
      cost: costAllocated,
      allocatedDate: new Date().toISOString().split("T")[0]
    };

    setFeedAllocations([newAllocLog, ...feedAllocations]);
    setAllocateQtyKg("");
    
    // Add transaction or audit trace to offline log
    if (!effectiveOnline) {
      recordOfflineChange(`Allocated ${qty}kg of ${feedItem.type} to animal ${allocateAnimalId} (Cost: ₹${costAllocated})`);
    }
  };

  // 3. Log Extra Welfare Parameters (Medicine, Maintenance, Handling)
  const handleLogExtraWelfareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!welfareAnimalId || !welfareCostAmt) return;

    const amount = Number(welfareCostAmt) || 0;
    if (amount <= 0) return;

    setAnimals(animals.map(a => {
      if (a.id === welfareAnimalId) {
        if (welfareLogType === "Medicine") {
          const updatedHist = a.healthHistory || [];
          const healthLog = {
            id: `HLT-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toISOString().split("T")[0],
            event: "Medicine/Welfare Injection",
            treatment: welfareDescription || "Special Supplement/Care",
            vetName: "Internal Staff",
            cost: amount,
            notes: "Logged via Cattle Welfare Centre"
          };
          return {
            ...a,
            medicineCost: (a.medicineCost || 0) + amount,
            healthHistory: [...updatedHist, healthLog]
          };
        } else if (welfareLogType === "Maintenance") {
          return {
            ...a,
            maintenanceCost: (a.maintenanceCost || 0) + amount,
            notes: `${a.notes || ""}\n[Maint Log: ₹${amount} - ${welfareDescription || "Facility maintenance"}]`.trim()
          };
        } else if (welfareLogType === "Handling") {
          return {
            ...a,
            handlingCost: (a.handlingCost || 0) + amount,
            notes: `${a.notes || ""}\n[Handling Log: ₹${amount} - ${welfareDescription || "Handling Labor"}]`.trim()
          };
        }
      }
      return a;
    }));

    setWelfareCostAmt("");
    setWelfareDescription("");
  };

  // 3b. Cattle Feed Store Front: Process POS Checkout
  const handleFeedPOSCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedPosSelectedFeedId || !feedPosQtySacks) return;

    const qty = Number(feedPosQtySacks);
    if (qty <= 0) return;

    const feedItem = feedStock.find(f => f.id === feedPosSelectedFeedId);
    if (!feedItem) return;

    if (feedItem.sackCount < qty) {
      alert(`Insufficient stock! Standard inventory only has ${feedItem.sackCount} remaining.`);
      return;
    }

    // Determine customer info
    let finalCustName = "";
    let finalCustPhone = "";
    let finalCustVillage = "";

    if (feedPosCustSelect === "WalkIn") {
      finalCustName = feedPosCustName.trim() || "Walk-In Customer";
      finalCustPhone = feedPosCustPhone.trim() || "+880 ----";
      finalCustVillage = feedPosCustVillage.trim() || "Local Trade";
    } else {
      const existing = feedCustomers.find(c => c.id === feedPosCustSelect);
      if (existing) {
        finalCustName = existing.name;
        finalCustPhone = existing.phone;
        finalCustVillage = existing.village;
      } else {
        finalCustName = "Walk-In Customer";
        finalCustPhone = "+880 ----";
        finalCustVillage = "Local Trade";
      }
    }

    const price = feedItem.sellingPricePerSack || Math.round(feedItem.unitCostPerSack * 1.25);
    const total = qty * price;
    const paid = Number(feedPosAmountPaid) || 0;
    const due = Math.max(0, total - paid);

    // Update stock count
    setFeedStock(feedStock.map(f => {
      if (f.id === feedPosSelectedFeedId) {
        return {
          ...f,
          sackCount: parseFloat((f.sackCount - qty).toFixed(2))
        };
      }
      return f;
    }));

    // Update customer total purchases and dues if selected
    if (feedPosCustSelect !== "WalkIn") {
      setFeedCustomers(feedCustomers.map(c => {
        if (c.id === feedPosCustSelect) {
          return {
            ...c,
            totalPurchased: (c.totalPurchased || 0) + total,
            dueAmount: (c.dueAmount || 0) + due
          };
        }
        return c;
      }));
    } else if (feedPosCustName.trim()) {
      // Create a new registered customer if they provided details
      const newCustId = `CUST-F${Math.floor(100 + Math.random() * 900)}`;
      const newCust = {
        id: newCustId,
        name: finalCustName,
        phone: finalCustPhone,
        village: finalCustVillage,
        totalPurchased: total,
        dueAmount: due
      };
      setFeedCustomers(prev => [...prev, newCust]);
    }

    // Increase system cash on hand
    if (paid > 0) {
      setCashBalance(prev => prev + paid);
    }

    // Record invoice
    const newInvoice = {
      id: `FSL-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: finalCustName,
      customerPhone: finalCustPhone,
      date: new Date().toISOString().split("T")[0],
      items: [
        {
          feedId: feedItem.id,
          feedType: feedItem.type,
          quantitySacks: qty,
          pricePerSack: price,
          subtotal: total
        }
      ],
      totalAmount: total,
      amountPaid: paid,
      amountDue: due,
      paymentMethod: feedPosPaymentMethod
    };

    setFeedStoreSales([newInvoice, ...feedStoreSales]);
    setSelectedFeedStoreSale(newInvoice);
    setShowFeedInvoiceModel(true);

    // Reset checkout form fields
    setFeedPosQtySacks("");
    setFeedPosAmountPaid("");
    setFeedPosCustName("");
    setFeedPosCustPhone("");
    setFeedPosCustVillage("");

    // Audit logs
    recordOfflineChange(`Sold retail ${qty} units of ${feedItem.type} to ${finalCustName} for ₹${total} (Cash received: ₹${paid})`);
  };

  // 3c. Cattle Feed Store Front: Record customer payment installments
  const handleCollectFeedDueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentRecCustId || !paymentRecAmount) return;

    const amt = Number(paymentRecAmount);
    if (amt <= 0) return;

    const customer = feedCustomers.find(c => c.id === paymentRecCustId);
    if (!customer) return;

    const actualRec = Math.min(customer.dueAmount, amt);

    setFeedCustomers(feedCustomers.map(c => {
      if (c.id === paymentRecCustId) {
        return {
          ...c,
          dueAmount: c.dueAmount - actualRec
        };
      }
      return c;
    }));

    // Update sales records to credit this customer's feed transaction
    setFeedStoreSales(feedStoreSales.map(s => {
      if (s.customerName === customer.name && s.amountDue > 0 && actualRec > 0) {
        // Simple decrement on the first due sale
        const applyAmt = Math.min(s.amountDue, actualRec);
        return {
          ...s,
          amountPaid: s.amountPaid + applyAmt,
          amountDue: s.amountDue - applyAmt
        };
      }
      return s;
    }));

    // Increase system cash on hand
    setCashBalance(prev => prev + actualRec);
    
    setPaymentRecCustId(null);
    setPaymentRecAmount("");

    recordOfflineChange(`Collected ₹${actualRec} cash installment on feed account for ${customer.name}`);
  };

  // 4. Commit Slaughter Interdepartmental Price Negotiation and Transfer to dispatch
  const handleCommitNegotiationSlaughter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!negotiationActiveAnimal) return;

    const purchasePrice = negotiationActiveAnimal.purchasePrice || 0;
    const fCost = negotiationActiveAnimal.feedCost || 0;
    const mCost = (negotiationActiveAnimal.medicineCost || 0) + (negotiationActiveAnimal.healthHistory || []).reduce((sum, h) => sum + (h.cost || 0), 0);
    const mtCost = negotiationActiveAnimal.maintenanceCost || 0;
    const hCost = negotiationActiveAnimal.handlingCost || 0;
    const totalBaseCost = purchasePrice + fCost + mCost + mtCost + hCost;

    const negotiatedPrice = Number(negotiatedInternalPrice) || totalBaseCost;
    const netProfit = negotiatedPrice - totalBaseCost;

    // A. Add to Cattle Farm P&L transactions ledger
    const newTx = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      animalId: negotiationActiveAnimal.id,
      animalType: negotiationActiveAnimal.type,
      breed: negotiationActiveAnimal.breed,
      purchasePrice,
      cumulativeWelfareCost: fCost + mCost + mtCost + hCost,
      negotiatedPrice,
      netProfit,
      date: new Date().toISOString().split("T")[0]
    };

    setFarmTransactions([newTx, ...farmTransactions]);

    // B. Transition animal's status
    setAnimals(animals.map(a => {
      if (a.id === negotiationActiveAnimal.id) {
        return {
          ...a,
          status: "Processed",
          slaughterNegotiatedPrice: negotiatedPrice,
          slaughterProfitOrLoss: netProfit
        };
      }
      return a;
    }));

    // C. Create Dispatch for the Butcher Shop
    const estimatedDressingYield = Math.round(negotiationActiveAnimal.weightKg * 0.58);
    const newDispatch = {
      id: `DSP-${Math.floor(100 + Math.random() * 900)}`,
      animalId: negotiationActiveAnimal.id,
      animalType: negotiationActiveAnimal.type,
      breed: negotiationActiveAnimal.breed,
      liveWeight: negotiationActiveAnimal.weightKg,
      shopName: "Central Slaughter Unit (Internal)",
      dispatchDate: new Date().toISOString().split("T")[0],
      estimatedYield: estimatedDressingYield,
      dressingPercentage: 58,
      status: "Pending Slaughter",
      notes: `Internally negotiated from Cattle Farm at ₹${negotiatedPrice.toLocaleString()}. (Profit Booked: ₹${netProfit.toLocaleString()})`
    };

    setButcherDispatches([newDispatch, ...butcherDispatches]);

    // Cleanup & Close UI
    setNegotiationActiveAnimal(null);
    setNegotiatedInternalPrice("");
    setNegotiationNotes("");

    if (!effectiveOnline) {
      recordOfflineChange(`Negotiated slaughter pricing for animal ${negotiationActiveAnimal.id} at ₹${negotiatedPrice}`);
    }
  };

  // Add dynamic health record to animal history
  const handleAddHealthRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeHealthAnimal) return;

    let updatedHistory: HealthRecord[] = [];

    if (editingHealthRecord) {
      // Edit existing medical record
      updatedHistory = (activeHealthAnimal.healthHistory || []).map(rec => {
        if (rec.id === editingHealthRecord.id) {
          return {
            ...rec,
            date: healthDate || new Date().toISOString().split("T")[0],
            event: healthEvent,
            treatment: healthTreatment,
            vetName: healthVetName || "Internal Staff/None",
            cost: Number(healthCost) || 0,
            notes: healthNotes,
            dueDate: healthDueDate || undefined,
            doctorConsultationDate: doctorConsultationDate || undefined
          };
        }
        return rec;
      });
    } else {
      // Create a brand new record
      const newRecord: HealthRecord = {
        id: `HLT-${Date.now().toString().slice(-4)}`,
        date: healthDate || new Date().toISOString().split("T")[0],
        event: healthEvent,
        treatment: healthTreatment,
        vetName: healthVetName || "Internal Staff/None",
        cost: Number(healthCost) || 0,
        notes: healthNotes,
        dueDate: healthDueDate || undefined,
        doctorConsultationDate: doctorConsultationDate || undefined
      };
      updatedHistory = [...(activeHealthAnimal.healthHistory || []), newRecord];
    }

    const finalCondition = healthConditionUpdate.trim() || healthEvent;

    setAnimals(prev => prev.map(ani => {
      if (ani.id === activeHealthAnimal.id) {
        return {
          ...ani,
          healthHistory: updatedHistory,
          healthCondition: finalCondition
        };
      }
      return ani;
    }));

    // Update active animal to reflect immediately in the open dialog
    setActiveHealthAnimal(prev => prev ? {
      ...prev,
      healthHistory: updatedHistory,
      healthCondition: finalCondition
    } : null);

    // Reset fields
    setHealthEvent("");
    setHealthTreatment("");
    setHealthVetName("");
    setHealthCost("");
    setHealthNotes("");
    setHealthDueDate("");
    setDoctorConsultationDate("");
    setEditingHealthRecord(null);
    setHealthSubView("list");

    if (!effectiveOnline) {
      recordOfflineChange(`Updated medical roster for ${activeHealthAnimal.id}: ${healthEvent}`);
    }
  };

  // Submit updated animal edits
  const handleEditAnimalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnimal) return;

    const purchaseAmount = Number(editingAnimal.purchasePrice) || 0;
    const advanceAmount = Number(editingAnimal.advancePaid) || 0;
    const calculatedDue = Math.max(0, purchaseAmount - advanceAmount);

    const computedAgeMonths = editingAnimal.birthDate ? getMonthsFromBirthdate(editingAnimal.birthDate) : (Number(editingAnimal.ageMonths) || 24);
    const computedBirthDate = editingAnimal.birthDate || new Date(Date.now() - (Number(editingAnimal.ageMonths) || 24) * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    setAnimals(prev => prev.map(a => {
      if (a.id === editingAnimal.id) {
        return {
          ...a,
          type: editingAnimal.type,
          breed: editingAnimal.breed,
          owner: editingAnimal.owner,
          weightKg: Number(editingAnimal.weightKg) || 150,
          purchasePrice: purchaseAmount,
          advancePaid: advanceAmount,
          due: calculatedDue,
          status: calculatedDue > 0 ? "Pending" : "Paid",
          feedType: editingAnimal.feedType,
          healthCondition: editingAnimal.healthCondition,
          notes: editingAnimal.notes,
          feedingSchedule: editingAnimal.feedingSchedule || "",
          dateAdded: editingAnimal.dateAdded || a.dateAdded,
          birthDate: computedBirthDate,
          ageMonths: computedAgeMonths,
          dueDate: calculatedDue > 0 ? (editingAnimal.dueDate || a.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]) : undefined,
        };
      }
      return a;
    }));

    setShowEditAnimalModal(false);
    setEditingAnimal(null);

    if (!effectiveOnline) {
      recordOfflineChange(`Updated details for Animal ${editingAnimal.id}`);
    }
  };

  // Bulk edit multiple selected animals
  const handleBulkUpdate = () => {
    if (selectedAnimalIds.length === 0) {
      alert("No animals selected for bulk update.");
      return;
    }

    const finalHealth = (bulkHealthConditionCustom.trim() || bulkHealthCondition) || "";
    const finalOwner = (bulkOwnerCustom.trim() || bulkOwner) || "";

    if (!finalHealth && !finalOwner) {
      alert("Please select or enter either a Health Condition or Owner/Supplier to bulk update.");
      return;
    }

    setAnimals(prev => prev.map(a => {
      if (selectedAnimalIds.includes(a.id) && a.status !== "Processed") {
        return {
          ...a,
          healthCondition: finalHealth ? finalHealth : a.healthCondition,
          owner: finalOwner ? finalOwner : a.owner
        };
      }
      return a;
    }));

    // Record changes
    let descLog = `Bulk edited ${selectedAnimalIds.length} animals: ${selectedAnimalIds.join(", ")}.`;
    if (finalHealth) descLog += ` Health condition set to '${finalHealth}'.`;
    if (finalOwner) descLog += ` Owner set to '${finalOwner}'.`;
    
    if (!effectiveOnline) {
      recordOfflineChange(descLog);
    }

    // Reset inputs & selection
    setBulkHealthCondition("");
    setBulkHealthConditionCustom("");
    setBulkOwner("");
    setBulkOwnerCustom("");
    setSelectedAnimalIds([]);
    alert(`Successfully updated attributes for the selected ${selectedAnimalIds.length} animals.`);
  };

  // Process selected animals in batch
  const handleBatchProcessAnimals = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnimalIds.length === 0) {
      alert("No animals selected for batch processing.");
      return;
    }

    checkPermissionAndRun("process-animal", () => {
      const selectedAnimals = animals.filter(ani => selectedAnimalIds.includes(ani.id) && ani.status !== "Processed");
      if (selectedAnimals.length === 0) {
        alert("The selected animals are already processed or could not be found.");
        return;
      }

      let totalBeefPremium = 0;
      let totalMuttonPremium = 0;
      let totalBuffaloPremium = 0;
      let totalBones = 0;
      let totalOrgans = 0;
      let totalWeight = 0;

      selectedAnimals.forEach(ani => {
        const dressingYield = Math.round(ani.weightKg * batchYieldRatio);
        const itemType = ani.type.toLowerCase();

        const premiumWeight = Math.round(dressingYield * 0.65 * 10) / 10;
        const boneWeight = Math.round(dressingYield * 0.25 * 10) / 10;
        const organWeight = Math.round(dressingYield * 0.10 * 10) / 10;

        totalWeight += ani.weightKg;
        totalBones += boneWeight;
        totalOrgans += organWeight;

        if (itemType === "cow" || itemType === "mithun") {
          totalBeefPremium += premiumWeight;
        } else if (itemType === "buffalo") {
          totalBuffaloPremium += premiumWeight;
        } else {
          totalMuttonPremium += premiumWeight;
        }
      });

      // Update actual stock
      setMeatStock(prev => ({
        ...prev,
        beef: (prev.beef || 0) + totalBeefPremium,
        mutton: (prev.mutton || 0) + totalMuttonPremium,
        buffalo: (prev.buffalo || 0) + totalBuffaloPremium,
        bones: (prev.bones || 0) + totalBones,
        organs: (prev.organs || 0) + totalOrgans
      }));

      // Update animal status
      setAnimals(prev => prev.map(ani => {
        if (selectedAnimalIds.includes(ani.id) && ani.status !== "Processed") {
          return { ...ani, status: "Processed" };
        }
        return ani;
      }));

      // Create a batch processing log
      const batchLogId = `BAT-${Date.now().toString().slice(-4)}`;
      const newBatchLog: BatchProcessLog = {
        id: batchLogId,
        date: new Date().toISOString().split("T")[0],
        animalCount: selectedAnimals.length,
        animalIds: selectedAnimals.map(a => a.id),
        totalWeightKg: totalWeight,
        yieldRatio: batchYieldRatio,
        addedStock: {
          beef: Math.round(totalBeefPremium * 10) / 10,
          mutton: Math.round(totalMuttonPremium * 10) / 10,
          buffalo: Math.round(totalBuffaloPremium * 10) / 10,
          bones: Math.round(totalBones * 10) / 10,
          organs: Math.round(totalOrgans * 10) / 10
        },
        operator: currentUser?.name || "System Operator"
      };

      setBatchLogs(prev => [newBatchLog, ...prev]);

      // Reset selection and close modal
      setSelectedAnimalIds([]);
      setShowBatchProcessModal(false);

      if (!effectiveOnline) {
        recordOfflineChange(`Batch Processed ${selectedAnimals.length} Animals: ${selectedAnimals.map(a => a.id).join(", ")}. Added ${Math.round((totalBeefPremium + totalMuttonPremium + totalBuffaloPremium) * 10) / 10}kg of pure cuts.`);
      }

      alert(`Successfully processed batch of ${selectedAnimals.length} animals. Retail stocks updated!`);
    });
  };

  // Clean custom printable iframe utility for seamless receipt and history print formats
  const printElement = (htmlContent: string, title = "Print Document") => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>\${title}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                color: #0f172a;
                margin: 20px;
                line-height: 1.4;
              }
              .header {
                text-align: center;
                border-bottom: 2px dashed #94a3b8;
                padding-bottom: 12px;
                margin-bottom: 16px;
              }
              .title {
                font-size: 16px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin: 0;
              }
              .subtitle {
                font-size: 11px;
                color: #475569;
                margin: 3px 0 0 0;
              }
              .meta {
                font-size: 11px;
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;
                gap: 12px;
              }
              .meta-col {
                display: flex;
                flex-direction: column;
                gap: 2px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                margin-bottom: 16px;
              }
              th, td {
                padding: 6px 2px;
                text-align: left;
                border-bottom: 1px solid #e2e8f0;
              }
              th {
                font-weight: 700;
                color: #475569;
                text-transform: uppercase;
                font-size: 9px;
                letter-spacing: 0.05em;
              }
              .text-right {
                text-align: right;
              }
              .totals {
                margin-top: 12px;
                border-top: 2px dashed #94a3b8;
                padding-top: 10px;
                font-size: 12px;
                font-weight: 600;
              }
              .totals-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
              }
              .grand-total {
                font-size: 14px;
                font-weight: 900;
                color: #000000;
                border-top: 1px solid #cbd5e1;
                padding-top: 5px;
                margin-top: 5px;
              }
              .footer {
                text-align: center;
                font-size: 10px;
                color: #64748b;
                margin-top: 24px;
                border-top: 1px solid #f1f5f9;
                padding-top: 12px;
              }
              @media print {
                body { margin: 10px; }
              }
            </style>
          </head>
          <body>
            \${htmlContent}
            <script>
              setTimeout(() => {
                window.focus();
                window.print();
                setTimeout(() => {
                  window.parent.document.body.removeChild(window.frameElement);
                }, 500);
              }, 300);
            </script>
          </body>
        </html>
      `);
      doc.close();
    }
  };

  const printSaleReceipt = (sale: Sale) => {
    const paidAmt = sale.amountPaid !== undefined ? sale.amountPaid : sale.totalAmount;
    const dueAmt = sale.amountDue !== undefined ? sale.amountDue : 0;
    
    const itemsHtml = sale.items.map(item => {
      const bngLabel = item.type === 'beef' ? 'গরুর মাংস' : item.type === 'mutton' ? 'খাসির মাংস' : item.type === 'buffalo' ? 'মহিষের মাংস' : item.type === 'bones' ? 'হাড়' : 'কলিজা/চর্বি';
      return `
        <tr>
          <td>
            <strong style="text-transform: uppercase;">${item.type}</strong><br/>
            <span style="font-size: 9px; color: #64748b;">${bngLabel}</span>
          </td>
          <td class="text-right">${item.weightKg} kg</td>
          <td class="text-right">₹${item.ratePerKg}</td>
          <td class="text-right">₹${(item.weightKg * item.ratePerKg).toLocaleString()}</td>
        </tr>
      `;
    }).join("");

    const dueSectionHtml = dueAmt > 0 
      ? `
        <div class="totals-row" style="color: #b45309; font-weight: 800;">
          <span>Outstanding Due (বাকি):</span>
          <span>₹${dueAmt.toLocaleString()}</span>
        </div>
      `
      : `
        <div class="totals-row" style="color: #16a34a; font-size: 10px; font-weight: 800; text-transform: uppercase;">
          <span>Payment Status:</span>
          <span>PAID IN FULL (সম্পূর্ণ পরিশোধিত)</span>
        </div>
      `;

    const html = `
      <div class="header">
        <div class="title">MEATFLOW RETAIL</div>
        <div class="subtitle">Standard South Asian Halal Fresh Cuts</div>
        <div class="subtitle">Phone: +880 1712-345678 | POS Terminal Receipt</div>
      </div>
      
      <div class="meta">
        <div class="meta-col">
          <strong>Invoice ID:</strong> ${sale.id}<br/>
          <strong>Date:</strong> ${sale.date}<br/>
          <strong>Time-Stamp:</strong> ${new Date().toLocaleTimeString()}
        </div>
        <div class="meta-col text-right" style="text-align: right;">
          <strong>Customer:</strong> ${sale.customerName}<br/>
          <strong>Cust Code:</strong> ${sale.customerCode || "N/A"}<br/>
          <strong>Phone:</strong> ${sale.customerPhone}<br/>
          <strong>Method:</strong> ${sale.paymentMethod}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Meat Cut Category</th>
            <th class="text-right">Weight</th>
            <th class="text-right">Price/Kg</th>
            <th class="text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row">
          <span>Gross Total (মোট মূল্য):</span>
          <span>₹${sale.totalAmount.toLocaleString()}</span>
        </div>
        <div class="totals-row" style="color: #0f766e; font-weight: bold;">
          <span>Received Cash (পরিশোধিত):</span>
          <span>₹${paidAmt.toLocaleString()}</span>
        </div>
        ${dueSectionHtml}
      </div>

      <div class="footer">
        <p>Thank you for purchasing premium cuts!</p>
        <p style="font-size: 8px; margin-top: 4px; color: #94a3b8;">Unified Cloud POS Engine • Offline Authorized System</p>
      </div>
    `;

    printElement(html, `Invoice - ${sale.id}`);
  };

  const printTransactionHistory = (salesHistoryList: Sale[]) => {
    const totalOutstanding = salesHistoryList.reduce((sum, s) => sum + (s.amountDue !== undefined ? s.amountDue : 0), 0);
    const totalCollected = salesHistoryList.reduce((sum, s) => sum + (s.amountPaid !== undefined ? s.amountPaid : s.totalAmount), 0);
    const totalSales = salesHistoryList.reduce((sum, s) => sum + s.totalAmount, 0);

    const rowsHtml = salesHistoryList.map(sale => {
      const paidAmt = sale.amountPaid !== undefined ? sale.amountPaid : sale.totalAmount;
      const dueAmt = sale.amountDue !== undefined ? sale.amountDue : 0;
      const itemsSummary = sale.items.map(it => `${it.type.toUpperCase()}(${it.weightKg}kg)`).join(", ");
      const dueColorStyle = dueAmt > 0 ? "color: #ea580c; font-weight: bold;" : "color: #334155;";
      
      return `
        <tr>
          <td style="font-family: monospace; font-weight: bold; font-size: 10px;">${sale.id}</td>
          <td>${sale.date}</td>
          <td>
            <strong>${sale.customerName}</strong><br/>
            <span style="font-size: 9px; color: #475569;">${sale.customerPhone}</span>
          </td>
          <td style="font-size: 9px; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${itemsSummary}</td>
          <td class="text-right font-mono text-xs">${sale.paymentMethod}</td>
          <td class="text-right">₹${sale.totalAmount.toLocaleString()}</td>
          <td class="text-right" style="color: #0d9488;">₹${paidAmt.toLocaleString()}</td>
          <td class="text-right" style="${dueColorStyle}">₹${dueAmt.toLocaleString()}</td>
        </tr>
      `;
    }).join("");

    const html = `
      <div class="header">
        <div class="title" style="font-size: 16px;">MEATFLOW RETAIL POS TRANSACTIONS LEDGER</div>
        <div class="subtitle" style="font-size: 11px; margin-top: 4px;">Unified Day-End Settlement & Audit Log</div>
        <div class="subtitle">Printed on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
      </div>

      <div style="display: flex; gap: 10px; margin-bottom: 20px; font-size: 11px;">
        <div style="flex: 1; background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px; border-radius: 6px; text-align: center;">
          <span style="color: #475569; text-transform: uppercase; font-size: 8px; font-weight: bold;">Gross Revenue</span>
          <div style="font-size: 14px; font-weight: 800; color: #000; margin-top: 3px;">₹${totalSales.toLocaleString()}</div>
        </div>
        <div style="flex: 1; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px; border-radius: 6px; text-align: center;">
          <span style="color: #166534; text-transform: uppercase; font-size: 8px; font-weight: bold;">Total Collected</span>
          <div style="font-size: 14px; font-weight: 800; color: #166534; margin-top: 3px;">₹${totalCollected.toLocaleString()}</div>
        </div>
        <div style="flex: 1; background: #fffbeb; border: 1px solid #fef3c7; padding: 8px; border-radius: 6px; text-align: center;">
          <span style="color: #b45309; text-transform: uppercase; font-size: 8px; font-weight: bold;">Outstanding Dues</span>
          <div style="font-size: 14px; font-weight: 800; color: #9a3412; margin-top: 3px;">₹${totalOutstanding.toLocaleString()}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Date</th>
            <th>Customer Info</th>
            <th>Cuts / Items Sum</th>
            <th class="text-right">Method</th>
            <th class="text-right">Total</th>
            <th class="text-right">Paid</th>
            <th class="text-right">Remaining Due</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div style="margin-top: 20px; padding: 8px; border-top: 2px dashed #94a3b8; text-align: right; font-size: 11px; font-weight: bold;">
        Transaction Counts: ${salesHistoryList.length} receipts issued
      </div>

      <div class="footer">
        <p>© 2026 ShaieAlam LiveStock ERP - Back-office Settlement Ledger Copy</p>
      </div>
    `;

    printElement(html, "Transaction History Ledger");
  };

  const handleCallCustomer = (phone: string) => {
    if (!phone || phone === "N/A" || phone === "N/A/No-Phone") {
      alert("This customer has no contact phone registered in this ERP entry.");
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsAppBill = (sale: Sale) => {
    const phone = sale.customerPhone;
    if (!phone || phone === "N/A" || phone === "N/A/No-Phone") {
      alert("This customer has no valid cell phone number recorded on their profile.");
      return;
    }
    
    const formattedPhone = phone.replace(/[^0-9]/g, ""); 
    const cleanPhone = formattedPhone.startsWith("01") ? "88" + formattedPhone : formattedPhone;
    
    const paidAmt = sale.amountPaid || 0;
    const dueAmt = sale.amountDue || 0;
    
    const text = `*SHAIEALAM LIVESTOCK ERP - OUTSTANDING BILL REMINDER*
---------------------------------------
*Invoice Ref ID:* ${sale.id}
*Customer Name:* ${sale.customerName}
*Transaction Date:* ${sale.date}

*Items Summarized:*
${sale.items.map(it => `• ${it.type.toUpperCase()} Cut: ${it.weightKg} kg (at ₹${it.ratePerKg}/kg)`).join("\n")}

---------------------------------------
*Original Total Bill:* ₹${sale.totalAmount.toLocaleString()}
*Cash Collected:* ₹${paidAmt.toLocaleString()}
*Outstanding Due:* ₹${dueAmt.toLocaleString()}
${sale.dueDate ? `*Due Date for Collection:* ${sale.dueDate}` : ''}
${sale.nextCollectionDate ? `*Next Follow-up:* ${sale.nextCollectionDate}` : ''}
${sale.collectionNotes ? `\n*Collector Notes:* _"${sale.collectionNotes}"_` : ''}

Please arrange dynamic split or full settlement at your earliest convenience.
Thank you for your valued trade relationship!
---------------------------------------
_Empowered by ShaieAlam ERP Systems_`;

    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const printInstallmentReceipt = (sale: Sale, installment: Installment) => {
    const remainingDueVal = sale.amountDue || 0;

    const html = `
      <div style="border: 2px dashed #0f766e; padding: 20px; border-radius: 12px; max-width: 400px; margin: auto; font-family: monospace; color: #1e293b;">
        <h2 style="text-align: center; color: #0f766e; margin-bottom: 5px; font-size: 16px;">SHAIEALAM LIVESTOCK</h2>
        <p style="text-align: center; font-size: 11px; margin-top: 0; color: #64748b;">Split Payment Collection Receipt</p>
        <hr style="border: 1px dashed #cbd5e1; margin: 15px 0;" />
        
        <table style="width: 100%; font-size: 12px; line-height: 1.6;">
          <tr>
            <td><strong>Receipt ID:</strong></td>
            <td style="text-align: right; font-family: monospace;">${installment.id}</td>
          </tr>
          <tr>
            <td><strong>Sale Ref ID:</strong></td>
            <td style="text-align: right; font-family: monospace;">${sale.id}</td>
          </tr>
          <tr>
            <td><strong>Receipt Date:</strong></td>
            <td style="text-align: right;">${installment.date}</td>
          </tr>
          <tr>
            <td><strong>Retail Customer:</strong></td>
            <td style="text-align: right;">${sale.customerName}</td>
          </tr>
          <tr>
            <td><strong>Contact Phone:</strong></td>
            <td style="text-align: right;">${sale.customerPhone}</td>
          </tr>
        </table>
        
        <hr style="border: 1px dashed #cbd5e1; margin: 15px 0;" />
        
        <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; padding: 12px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
          <span style="font-size: 10px; color: #0d9488; font-weight: bold; text-transform: uppercase; tracking: 0.5px;">Amount Collected</span>
          <h1 style="margin: 5px 0; color: #0f766e; font-size: 26px;">₹${installment.amount.toLocaleString()}</h1>
          <p style="margin: 0; font-size: 11px; color: #115e59;">Paid via: <strong>${installment.paymentMethod}</strong></p>
        </div>
        
        <table style="width: 100%; font-size: 11px; line-height: 1.8; color: #475569;">
          <tr>
            <td>Original Transaction Bill:</td>
            <td style="text-align: right;">₹${sale.totalAmount.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Cumulative Paid to Date:</td>
            <td style="text-align: right; color: #0d9488; font-weight: 600;">₹${(sale.amountPaid || 0).toLocaleString()}</td>
          </tr>
          <tr style="font-weight: bold; color: #ea580c; border-top: 1px solid #e2e8f0;">
            <td style="padding-top: 4px;">Remaining Outstanding Due:</td>
            <td style="text-align: right; padding-top: 4px;">₹${remainingDueVal.toLocaleString()}</td>
          </tr>
          ${sale.nextCollectionDate ? `
          <tr style="font-weight: bold; color: #0f766e;">
            <td>Next Scheduled Follow-up:</td>
            <td style="text-align: right;">${sale.nextCollectionDate}</td>
          </tr>
          ` : ''}
          ${installment.upcomingCollectionDate ? `
          <tr style="color: #0d9488; font-size: 11px;">
            <td>Upcoming Collection Date:</td>
            <td style="text-align: right;">${installment.upcomingCollectionDate}</td>
          </tr>
          ` : ''}
          ${installment.nextCollectionDate ? `
          <tr style="color: #0d9488; font-size: 11px;">
            <td>Next Collection Date:</td>
            <td style="text-align: right;">${installment.nextCollectionDate}</td>
          </tr>
          ` : ''}
        </table>
        
        ${installment.notes ? `
          <div style="margin-top: 15px; padding: 10px; border-left: 3px solid #0d9488; background-color: #f8fafc; font-size: 11px; color: #475569; border-radius: 0 4px 4px 0;">
            <strong>Collection Remarks:</strong><br/>
            "${installment.notes}"
          </div>
        ` : ''}
        
        ${installment.specialNotes ? `
          <div style="margin-top: 10px; padding: 10px; border-left: 3px solid #e11d48; background-color: #fff1f2; font-size: 11px; color: #9f1239; border-radius: 0 4px 4px 0;">
            <strong>Special Notes for Entry:</strong><br/>
            "${installment.specialNotes}"
          </div>
        ` : ''}
        
        <hr style="border: 1px dashed #cbd5e1; margin: 15px 0;" />
        <p style="text-align: center; font-size: 9px; color: #94a3b8; margin: 0;">Verified Offline-Ready ERP Settlement Log</p>
        <p style="text-align: center; font-size: 10px; color: #0d9488; font-weight: bold; margin: 5px 0 0 0;">ShaieAlam LiveStock ERP</p>
      </div>
    `;
    printElement(html, `Collection Receipt - ${installment.id}`);
  };

  const handleRecordCollectionInstallment = (
    saleId: string, 
    amount: number, 
    paymentMethod: string, 
    notes: string, 
    nextDate: string,
    upcomingDate?: string,
    specialNotes?: string
  ) => {
    if (amount <= 0) {
      alert("Please specify a valid collection amount greater than zero.");
      return;
    }
    
    setSales(prevSales => {
      return prevSales.map(sale => {
        if (sale.id === saleId) {
          const currentDue = sale.amountDue || 0;
          const collectAmt = Math.min(currentDue, amount);
          const newDue = Math.max(0, currentDue - collectAmt);
          
          const newInst: Installment = {
            id: `INST-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toISOString().split("T")[0],
            amount: collectAmt,
            paymentMethod,
            notes: notes || "Manual installment received",
            collectionNotes: notes || "Manual installment received",
            upcomingCollectionDate: upcomingDate || nextDate,
            nextCollectionDate: nextDate,
            specialNotes: specialNotes
          };
          
          const updatedInstallments = [...(sale.installments || []), newInst];
          
          setCashBalance(prev => prev + collectAmt);
          recordOfflineChange(`Recorded Split Payment Receipt ${newInst.id} for ${sale.customerName} (₹${collectAmt}, Remaining: ₹${newDue})`);
          
          const updatedSale: Sale = {
            ...sale,
            amountPaid: (sale.amountPaid || 0) + collectAmt,
            amountDue: newDue,
            nextCollectionDate: nextDate || sale.nextCollectionDate,
            upcomingCollectionDate: upcomingDate || sale.upcomingCollectionDate,
            collectionNotes: notes || sale.collectionNotes,
            installments: updatedInstallments
          };
          
          // Trigger split installment receipt printing
          setTimeout(() => {
            printInstallmentReceipt(updatedSale, newInst);
          }, 300);

          // Update activeCollectionSale state for immediate rendering update inside modal
          setActiveCollectionSale(updatedSale);
          
          alert(`Successfully registered a split installment payment of ₹${collectAmt.toLocaleString()}! A printed receipt has been generated.`);
          return updatedSale;
        }
        return sale;
      });
    });
  };

  const getMonthsFromBirthdate = (birthDateStr: string): number => {
    const birth = new Date(birthDateStr);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (today.getDate() < birth.getDate()) {
      months--;
    }
    return Math.max(0, years * 12 + months);
  };

  const calculatePreciseAge = (birthDateStr?: string, ageMonthsFallback?: number) => {
    if (!birthDateStr) {
      const totalMonths = ageMonthsFallback || 0;
      return {
        years: Math.floor(totalMonths / 12),
        months: totalMonths % 12
      };
    }
    const birth = new Date(birthDateStr);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (today.getDate() < birth.getDate()) {
      months--;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years < 0) {
      years = 0;
      months = 0;
    }
    return { years, months };
  };

  const exportSalesToCsv = (salesHistoryList: Sale[]) => {
    const headers = [
      "Sale ID",
      "Date",
      "Customer Name",
      "Customer Phone",
      "Cuts Category Summary",
      "Payment Method",
      "Total Amount (INR)",
      "Amount Paid (INR)",
      "Amount Due (INR)"
    ];

    const rows = salesHistoryList.map(sale => {
      const paidAmt = sale.amountPaid !== undefined ? sale.amountPaid : sale.totalAmount;
      const dueAmt = sale.amountDue !== undefined ? sale.amountDue : 0;
      const itemsSummary = sale.items.map(it => `${it.type.toUpperCase()}(${it.weightKg}kg)`).join(" | ");
      return [
        `"${sale.id}"`,
        `"${sale.date}"`,
        `"${sale.customerName.replace(/"/g, '""')}"`,
        `"${sale.customerPhone.replace(/"/g, '""')}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        `"${sale.paymentMethod}"`,
        sale.totalAmount,
        paidAmt,
        dueAmt
      ];
    });

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ShaieAlam_Sales_Log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Item in retail billing
  const addSaleItemField = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { type: "beef", weightKg: 1, ratePerKg: 720 }]
    });
  };

  const BARCODE_DATABASE: Record<string, { type: string, label: string, ratePerKg: number, weightKg: number }> = {
    "BE-501": { type: "beef", label: "Premium Beef Ribeye Cut (BE-501)", ratePerKg: 720, weightKg: 1.0 },
    "BE-502": { type: "beef", label: "Premium Beef Tenderloin (BE-502)", ratePerKg: 750, weightKg: 1.0 },
    "MU-601": { type: "mutton", label: "Premium Mutton Solid (MU-601)", ratePerKg: 1100, weightKg: 1.0 },
    "MU-602": { type: "mutton", label: "Mutton Chops (MU-602)", ratePerKg: 1150, weightKg: 1.0 },
    "BU-701": { type: "buffalo", label: "Buffalo Steak Cut (BU-701)", ratePerKg: 680, weightKg: 1.0 },
    "BO-801": { type: "bones", label: "Beef Soup Bones (BO-801)", ratePerKg: 250, weightKg: 1.0 },
    "OR-901": { type: "organs", label: "Beef Liver / Organs (OR-901)", ratePerKg: 350, weightKg: 1.0 }
  };

  const quickAddMeatCut = (type: string, weightKg: number, ratePerKg: number) => {
    const hasUnchangedBeefDefault = newSale.items.length === 1 && 
      newSale.items[0].type === "beef" && 
      newSale.items[0].weightKg === 1 && 
      newSale.items[0].ratePerKg === 720;

    const existingIndex = newSale.items.findIndex(it => it.type === type && it.ratePerKg === ratePerKg);
    
    if (existingIndex !== -1) {
      const updated = [...newSale.items];
      updated[existingIndex] = {
        ...updated[existingIndex],
        weightKg: Math.round((updated[existingIndex].weightKg + weightKg) * 10) / 10
      };
      setNewSale({ ...newSale, items: updated });
    } else if (hasUnchangedBeefDefault) {
      setNewSale({
        ...newSale,
        items: [{ type, weightKg: Number(weightKg), ratePerKg: Number(ratePerKg) }]
      });
    } else {
      setNewSale({
        ...newSale,
        items: [...newSale.items, { type, weightKg: Number(weightKg), ratePerKg: Number(ratePerKg) }]
      });
    }
    
    setScannerStatusMsg(`Added ${type.toUpperCase()} Cut (${weightKg} kg @ ₹${ratePerKg}/kg) via Quick Add`);
    setTimeout(() => setScannerStatusMsg(null), 3000);
  };

  const handleBarcodeScan = (code: string) => {
    const uppercaseCode = code.trim().toUpperCase();
    if (!uppercaseCode) return;

    if (BARCODE_DATABASE[uppercaseCode]) {
      const entry = BARCODE_DATABASE[uppercaseCode];
      quickAddMeatCut(entry.type, entry.weightKg, entry.ratePerKg);
      setScannerStatusMsg(`Scanned: ${entry.label} - Added to Cart!`);
      setBarcodeInput("");
    } else {
      setScannerStatusMsg(`Unknown Barcode scanned: "${code}". Try BE-501 or MU-601!`);
    }
    setTimeout(() => setScannerStatusMsg(null), 5500);
  };

  const handleSettleCustomerDue = (saleId: string, settleAmount?: number) => {
    setSales(prevSales => {
      return prevSales.map(sale => {
        if (sale.id === saleId) {
          const currentDue = sale.amountDue || 0;
          const payNow = settleAmount !== undefined ? Math.min(currentDue, settleAmount) : currentDue;
          if (payNow > 0) {
            setCashBalance(cb => cb + payNow);
          }
          return {
            ...sale,
            amountPaid: (sale.amountPaid || 0) + payNow,
            amountDue: Math.max(0, currentDue - payNow),
            paymentMethod: Math.max(0, currentDue - payNow) === 0 ? "Cash" : sale.paymentMethod
          };
        }
        return sale;
      });
    });
  };

  const removeSaleItemField = (index: number) => {
    if (newSale.items.length <= 1) return;
    const filtered = newSale.items.filter((_, i) => i !== index);
    setNewSale({ ...newSale, items: filtered });
  };

  const updateSaleItemField = (index: number, field: string, val: any) => {
    const updated = [...newSale.items];
    updated[index] = { ...updated[index], [field]: val };
    setNewSale({ ...newSale, items: updated });
  };

  // Issue POS Bill
  const handleIssueSale = (e: React.FormEvent) => {
    e.preventDefault();
    
    checkPermissionAndRun("retail-checkout", () => {
      // Calculate final billing weights & subtract from retail displays
      let finalAmount = 0;
      let tempStock = { ...meatStock };
      let isValid = true;

      const populatedItems = newSale.items.map(it => {
        const subtotal = Number(it.weightKg) * Number(it.ratePerKg);
        finalAmount += subtotal;
        
        // Stock subtraction
        const stockKey = it.type;
        if (tempStock[stockKey] < it.weightKg) {
          alert(`Insufficient stock in display for ${stockKey}. Available: ${tempStock[stockKey]} kg, Requested: ${it.weightKg} kg.`);
          isValid = false;
        } else {
          tempStock[stockKey] = Math.round((tempStock[stockKey] - it.weightKg) * 10) / 10;
        }

        return {
          type: it.type,
          weightKg: Number(it.weightKg),
          ratePerKg: Number(it.ratePerKg),
          amount: subtotal
        };
      });

      if (!isValid) return;

      const saleId = `SALE-${sales.length + 101}`;
      
      const amountPaidVal = customAmountPaid === "" ? (newSale.paymentMethod === "Due" ? 0 : finalAmount) : Number(customAmountPaid);
      const amountDueVal = Math.max(0, finalAmount - amountPaidVal);

      const instId = `INST-${Math.floor(1000 + Math.random() * 9000)}`;
      const saleCustomerCode = resolveOrGenerateCustomerCode(
        newSale.customerName || "Walk-In Buyer",
        newSale.customerPhone || "N/A",
        newSale.customerCode
      );

      const generatedReceipt: Sale = {
        id: saleId,
        customerName: newSale.customerName || "Walk-In Buyer",
        customerPhone: newSale.customerPhone || "N/A",
        customerCode: saleCustomerCode,
        items: populatedItems,
        totalAmount: finalAmount,
        paymentMethod: newSale.paymentMethod,
        date: new Date().toISOString().split("T")[0],
        bengaliSms: `মিটফ্লো ইনভয়েস: আপনার (${newSale.customerName || "কাস্টমার"}) ক্রয় রশিদ তৈরি হয়েছে। মোট মূল্য: ${finalAmount} টাকা। পেইড: ₹${amountPaidVal}, বকেয়া: ₹${amountDueVal}। ধন্যবাদ!`,
        amountPaid: amountPaidVal,
        amountDue: amountDueVal,
        isCached: !effectiveOnline,
        dueDate: amountDueVal > 0 ? posDueDate : undefined,
        upcomingCollectionDate: amountDueVal > 0 ? posNextCollection : undefined,
        nextCollectionDate: amountDueVal > 0 ? posNextCollection : undefined,
        collectionNotes: amountDueVal > 0 ? (posCollectionNotes || "Initial balance recorded.") : undefined,
        installments: amountPaidVal > 0 ? [
          {
            id: instId,
            date: new Date().toISOString().split("T")[0],
            amount: amountPaidVal,
            paymentMethod: newSale.paymentMethod === "Due" ? "Cash" : newSale.paymentMethod,
            notes: "Initial payment recorded at checkout."
          }
        ] : []
      };

      setSales([generatedReceipt, ...sales]);
      setMeatStock(tempStock);
      // Add actual amount paid to cash register
      if (amountPaidVal > 0) {
        setCashBalance(prev => prev + amountPaidVal);
      }
      
      setShowBillingModal(false);
      if (!effectiveOnline) {
        recordOfflineChange(`Issued Retail Sale ${saleId} to ${generatedReceipt.customerName} (₹${finalAmount}, Paid: ₹${amountPaidVal}, Due: ₹${amountDueVal})`);
      }
      
      // Reset billing counter
      setNewSale({
        customerCode: "",
        customerName: "",
        customerPhone: "",
        items: [{ type: "beef", weightKg: 1, ratePerKg: 720 }],
        paymentMethod: "Cash"
      });
      setCustomAmountPaid("");
      
      const d = new Date();
      d.setDate(d.getDate() + 7);
      const defaultDate = d.toISOString().split("T")[0];
      setPosDueDate(defaultDate);
      setPosNextCollection(defaultDate);
      setPosCollectionNotes("");

      // Automatically trigger receipt review
      setSelectedInvoice(generatedReceipt);
      setShowInvoiceModal(true);
      fetchReceiptDocument(generatedReceipt);
    });
  };

  // Generate printable doc + SMS from Gemini server side
  const fetchReceiptDocument = async (receipt: Sale) => {
    setDocLoading(true);
    setServerDoc(null);
    try {
      const response = await fetch("/api/generate-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: "receipt",
          details: {
            customerName: receipt.customerName,
            customerPhone: receipt.customerPhone,
            paymentMethod: receipt.paymentMethod,
            totalAmount: receipt.totalAmount,
            items: receipt.items,
            date: receipt.date,
            smsTemplate: receipt.bengaliSms
          }
        })
      });
      const data = await response.json();
      setServerDoc(data);
    } catch (e) {
      console.error(e);
    } finally {
      setDocLoading(false);
    }
  };

  // Perform custom profitability prediction and premium strategy locally
  const runAiPreEstimate = async () => {
    setPredicting(true);
    setAiPrediction(null);
    
    // Simulate brief processing delay
    setTimeout(() => {
      const weight = parseFloat(predictInputs.weightKg) || 0;
      const price = parseFloat(predictInputs.purchasePrice) || 0;
      const type = predictInputs.type;
      
      const standardRatio = type.toLowerCase().includes("goat") || type.toLowerCase().includes("sheep") ? 0.46 : 0.52;
      const expectedYieldKg = Math.round(weight * standardRatio * 10) / 10;
      const pricePerKg = type.toLowerCase().includes("goat") || type.toLowerCase().includes("sheep") ? 850 : 450;
      const expectedRevenue = Math.round(expectedYieldKg * pricePerKg);
      const predictedProfit = expectedRevenue - price;
      
      setAiPrediction({
        expectedYieldKg,
        yieldRatio: standardRatio,
        expectedRevenue,
        predictedProfit,
        yieldBreakdown: [
          { item: "Premium Choice Cuts / Solid Steak Meat", quantityKg: Math.round(expectedYieldKg * 0.7 * 10) / 10, estimatedPricePerKg: pricePerKg, subtotal: Math.round(expectedYieldKg * 0.7 * pricePerKg) },
          { item: "Soup Bones & High Gelatin Trimming", quantityKg: Math.round(expectedYieldKg * 0.2 * 10) / 10, estimatedPricePerKg: 180, subtotal: Math.round(expectedYieldKg * 0.2 * 180) },
          { item: "Organs / Halal Offal & Tripe", quantityKg: Math.round(expectedYieldKg * 0.1 * 10) / 10, estimatedPricePerKg: 320, subtotal: Math.round(expectedYieldKg * 0.1 * 320) }
        ],
        aiAnalysis: `Dressing yield is standard ${Math.round(standardRatio * 100)}% based on scientific class specifications for ${type} (${predictInputs.breed}). Feed intake: ${predictInputs.feedType}.`,
        bengaliAnalysis: `পশুর জাত ও ওজনের ভিত্তিতে স্ট্যান্ডার্ড ড্রেসিং হার ${Math.round(standardRatio * 100)}% নির্ধারণ করা হয়েছে। খাদ্য: ${predictInputs.feedType}।`
      });
      setPredicting(false);
    }, 500);
  };

  // Perform smart investment profit forecasting for individual directory animals on-the-fly via Gemini
  const handleForecastAnimal = async (animal: Animal) => {
    setSelectedForecastAnimal(animal);
    setForecastLoading(true);
    setForecastResult(null);
    try {
      const response = await fetch("/api/predict-profit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: animal.type,
          breed: animal.breed,
          weightKg: animal.weightKg,
          purchasePrice: animal.purchasePrice,
          feedType: animal.feedType || "Natural grass & silage",
          healthCondition: animal.healthCondition || "Excellent",
          ageMonths: animal.ageMonths || 24
        })
      });
      const data = await response.json();
      setForecastResult(data);
    } catch (err) {
      console.error("Failed to execute smart forecast for animal", err);
    } finally {
      setForecastLoading(false);
    }
  };

  // Shareholder investment add
  const [fundingAmount, setFundingAmount] = useState("10000");
  const [selectedFundingInvestor, setSelectedFundingInvestor] = useState("Anis");

  const addFundingToPool = (e: React.FormEvent) => {
    e.preventDefault();
    checkPermissionAndRun("inject-capital", () => {
      const sum = Number(fundingAmount) || 0;
      setInvestors(investors.map(inv => {
        if (inv.name === selectedFundingInvestor) {
          return { ...inv, balance: inv.balance + sum };
        }
        return inv;
      }));
      setCashBalance(prev => prev + sum);
      if (!effectiveOnline) {
        recordOfflineChange(`Injected Stakeholder Capital: ₹${sum} from ${selectedFundingInvestor}`);
      }
      setFundingAmount("10000");
    });
  };

  // Search filter
  const uniqueOwners = Array.from(new Set(animals.map(ani => ani.owner).filter(Boolean)));

  const filteredAnimals = animals.filter(ani => {
    const q = searchQuery.toLowerCase();
    
    // Search query matches
    const matchesSearch = (
      ani.id.toLowerCase().includes(q) ||
      ani.type.toLowerCase().includes(q) ||
      ani.breed.toLowerCase().includes(q) ||
      ani.owner.toLowerCase().includes(q)
    );
    
    // Status filter matches
    const matchesStatus = statusFilter === "All" || ani.status === statusFilter;
    
    // Owner filter matches
    const matchesOwner = ownerFilter === "All" || ani.owner === ownerFilter;

    // Supplier due status filter matches
    let matchesSupplierDue = true;
    if (supplierDueFilter !== "All") {
      const todayStr = "2026-05-20";
      const todayTime = new Date(todayStr + "T00:00:00").getTime();
      
      if (ani.due <= 0) {
        matchesSupplierDue = false;
      } else {
        // Find due date or fall back to 10 days after dateAdded
        let dDate = ani.dueDate;
        if (!dDate) {
          try {
            const d = new Date(ani.dateAdded);
            d.setDate(d.getDate() + 10);
            dDate = d.toISOString().split("T")[0];
          } catch {
            dDate = "2026-05-30";
          }
        }
        
        const dTime = new Date(dDate + "T00:00:00").getTime();
        const diffMs = dTime - todayTime;
        const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
        
        if (supplierDueFilter === "Overdue") {
          matchesSupplierDue = dDate < todayStr;
        } else if (supplierDueFilter === "Upcoming7") {
          matchesSupplierDue = dDate >= todayStr && diffDays >= 0 && diffDays <= 7;
        } else if (supplierDueFilter === "Upcoming30") {
          matchesSupplierDue = dDate >= todayStr && diffDays >= 0 && diffDays <= 30;
        } else if (supplierDueFilter === "SortChronological") {
          matchesSupplierDue = true;
        }
      }
    }
    
    return matchesSearch && matchesStatus && matchesOwner && matchesSupplierDue;
  }).sort((a, b) => {
    // Determine due date helper
    const getDueDateStr = (ani: typeof a) => {
      if (ani.dueDate) return ani.dueDate;
      try {
        const d = new Date(ani.dateAdded);
        d.setDate(d.getDate() + 10);
        return d.toISOString().split("T")[0];
      } catch {
        return "2026-05-30";
      }
    };

    if (supplierDueFilter === "SortChronological") {
      const dateA = getDueDateStr(a);
      const dateB = getDueDateStr(b);
      return dateA.localeCompare(dateB);
    }

    // Animals with zero/negative dues go to the bottom
    const aHasDue = a.due > 0;
    const bHasDue = b.due > 0;
    
    if (aHasDue && !bHasDue) return -1;
    if (!aHasDue && bHasDue) return 1;
    if (!aHasDue && !bHasDue) return 0;

    // Both have dues, sort chronologically by supplier due date (earliest due dates first)
    const dateA = getDueDateStr(a);
    const dateB = getDueDateStr(b);
    return dateA.localeCompare(dateB);
  });

  const activeTrans = translations[lang];

  if (!currentUser) {
    return renderLoginScreen();
  }

  return (
    <div className={`min-h-screen flex flex-col selection:bg-teal-500 selection:text-slate-900 antialiased font-sans transition-colors duration-300 ${
      activeTab === "home" ? "bg-[#f4f6fa] text-slate-800" : "bg-[#070d1e] text-slate-100"
    }`}>
      
      {/* Upper Navigation Bar */}
      {activeTab !== "home" && (
        <header className="border-b border-slate-800/60 bg-slate-950/65 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <BrandLogo size={42} variant="logo-only" />
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                {activeTrans.appTitle}
                <span className="text-[10px] bg-teal-400/10 text-teal-400 border border-teal-500/20 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ERP v1.1
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">
                {activeTrans.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            
            {/* Quick Balance Account Display */}
            <div className="bg-slate-900/80 rounded-xl px-4 py-2 border border-slate-800/80 flex items-center gap-2.5 shadow-inner">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <div className="font-mono text-xs">
                <span className="text-slate-500 uppercase text-[9px] tracking-wider">Cash Reserves:</span>{" "}
                <span className="text-emerald-400 font-extrabold font-mono text-sm ml-1">₹{cashBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Sync Now Quick Button if changes are pending */}
            {cachedQueue.length > 0 && (
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={syncStatus === "Offline - Syncing" || !effectiveOnline}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg border outline-none ${
                  !effectiveOnline
                    ? "bg-rose-500/5 text-rose-400/80 border-rose-500/20 cursor-not-allowed"
                    : "bg-teal-500 text-slate-950 border-teal-400 hover:bg-teal-400 animate-pulse"
                }`}
                title={!effectiveOnline ? "Physical network is disconnected" : "Push cached modifications to central database server"}
              >
                <RefreshCw className={`h-3 w-3 ${syncStatus === 'Offline - Syncing' ? 'animate-spin' : ''}`} />
                <span>Sync Now ({cachedQueue.length})</span>
              </button>
            )}

            {/* Sync Status Pill with Floating Interactive Control Dropdown */}
            <div className="relative">
              <button
                id="sync-status-indicator"
                onClick={() => setShowSyncDropdown(!showSyncDropdown)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition duration-200 cursor-pointer ${
                  syncStatus === "Online" 
                    ? "bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/15" 
                    : syncStatus === "Offline - Syncing"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse font-bold"
                    : syncStatus === "Sync Complete"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold"
                    : syncStatus === "Changes Cached"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/15 font-bold animate-pulse"
                    : "bg-stone-500/10 text-stone-400 border-stone-500/20 hover:bg-stone-500/15"
                }`}
                title="View Sync Status & Offline Simulation Controls"
              >
                {syncStatus === "Online" && <Wifi className="h-3.5 w-3.5" />}
                {syncStatus === "Offline" && <WifiOff className="h-3.5 w-3.5 text-stone-400" />}
                {syncStatus === "Offline - Syncing" && <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />}
                {syncStatus === "Sync Complete" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                {syncStatus === "Changes Cached" && <WifiOff className="h-3.5 w-3.5 text-rose-400" />}
                
                <span className="hidden sm:inline">
                  {syncStatus === "Online" && activeTrans.syncOnline}
                  {syncStatus === "Offline" && activeTrans.syncOffline}
                  {syncStatus === "Offline - Syncing" && activeTrans.syncSyncing}
                  {syncStatus === "Sync Complete" && activeTrans.syncComplete}
                  {syncStatus === "Changes Cached" && `${cachedQueue.length} ${activeTrans.syncChangesCached}`}
                </span>
                
                <span className="sm:hidden">
                  {syncStatus === "Online" && "Online"}
                  {syncStatus === "Offline" && "Offline"}
                  {syncStatus === "Offline - Syncing" && "Syncing"}
                  {syncStatus === "Sync Complete" && "Ready"}
                  {syncStatus === "Changes Cached" && `Cached (${cachedQueue.length})`}
                </span>
                
                {cachedQueue.length > 0 && syncStatus !== "Offline - Syncing" && syncStatus !== "Sync Complete" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                )}
                {syncStatus === "Online" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
                )}
              </button>

              {showSyncDropdown && (
                <div className="absolute right-0 mt-2.5 w-72 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 space-y-4 text-slate-100 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <span className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">
                      ERP Sync Settings
                    </span>
                    <button 
                      onClick={() => setShowSyncDropdown(false)}
                      className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded-md hover:bg-slate-800 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Live Network Info */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Live Network Status:</span>
                      <span className={isOnline ? "text-teal-400 font-bold" : "text-rose-400 font-bold"}>
                        {isOnline ? "Online" : "Offline"}
                      </span>
                    </div>

                    {/* Simulation Switch */}
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">{activeTrans.simulateOfflineLabel}</p>
                        <p className="text-[10px] text-slate-500">Simulate offline retail logging</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={simulateOffline}
                          onChange={(e) => setSimulateOffline(e.target.checked)}
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500 peer-checked:after:bg-slate-950"></div>
                      </label>
                    </div>

                    {/* Caching status listing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">{activeTrans.cachedCountLabel}:</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded-md font-bold text-teal-400">
                          {syncStatus === "Offline - Syncing" ? prevCachedQueue.length : cachedQueue.length}
                        </span>
                      </div>
                      
                      {((syncStatus === "Offline - Syncing" ? prevCachedQueue : cachedQueue).length > 0) ? (
                        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 max-h-56 overflow-y-auto space-y-2 font-mono text-[10px] text-slate-300">
                          <p className="text-[9px] uppercase text-stone-400 font-extrabold border-b border-slate-850 pb-1.5 flex justify-between items-center select-none">
                            <span>{syncStatus === "Offline - Syncing" ? "Syncing Sequence" : activeTrans.cachedListTitle}</span>
                            {syncStatus === "Offline - Syncing" && (
                              <span className="text-amber-400 animate-pulse font-mono font-black">
                                {Math.round((Math.max(0, syncProgressIndex) / prevCachedQueue.length) * 100)}%
                              </span>
                            )}
                          </p>
                          {(syncStatus === "Offline - Syncing" ? prevCachedQueue : cachedQueue).map((item, index) => {
                            const isSyncing = syncStatus === "Offline - Syncing";
                            const isDone = isSyncing && index < syncProgressIndex;
                            const isActive = isSyncing && index === syncProgressIndex;
                            const isPending = isSyncing && index > syncProgressIndex;

                            return (
                              <div 
                                key={index} 
                                className={`rounded-xl p-2 border transition-all duration-300 leading-normal flex flex-col gap-1.5 ${
                                  isActive 
                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-200 shadow-md shadow-amber-500/5" 
                                    : isDone 
                                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 opacity-90"
                                    : "bg-slate-950/40 border-slate-900/60 text-slate-400"
                                }`}
                              >
                                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider">
                                  <div className="flex items-center gap-1.5">
                                    <span className={isActive ? "text-amber-400 font-black animate-bounce" : isDone ? "text-emerald-400" : "text-slate-500"}>
                                      {isDone ? "✓" : `#${index + 1}`}
                                    </span>
                                    <span className={isDone ? "line-through text-slate-500" : ""}>
                                      {item.length > 20 ? item.substring(0, 20) + "..." : item}
                                    </span>
                                  </div>
                                  <div>
                                    {isActive ? (
                                      <span className="text-amber-400 flex items-center gap-1 font-mono font-bold animate-pulse">
                                        SYNCING ({syncItemProgress}%)
                                      </span>
                                    ) : isDone ? (
                                      <span className="text-emerald-400 font-bold">
                                        FINISHED
                                      </span>
                                    ) : isPending ? (
                                      <span className="text-slate-500 font-medium">
                                        QUEUED
                                      </span>
                                    ) : (
                                      <span className="text-teal-400 font-semibold text-[8px] bg-teal-500/10 px-1 py-0.2 rounded border border-teal-500/20">
                                        LOCAL
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {isActive && (
                                  <div className="w-full bg-slate-950/60 h-1.5 rounded-full overflow-hidden border border-slate-850">
                                    <div 
                                      className="bg-amber-500 h-full transition-all duration-150 rounded-full"
                                      style={{ width: `${syncItemProgress}%` }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500 italic text-center py-2">
                          All local records are synced up.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Manual Sync Button */}
                  <button
                    disabled={syncStatus === "Offline - Syncing" || (!isOnline && simulateOffline)}
                    onClick={handleSyncNow}
                    className={`w-full font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 border transition ${
                      syncStatus === "Offline - Syncing"
                        ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
                        : cachedQueue.length > 0
                        ? "bg-teal-500 text-slate-950 border-teal-400 hover:bg-teal-400 cursor-pointer"
                        : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-805 cursor-pointer"
                    }`}
                  >
                    <RefreshCw className={`h-3 w-3 ${syncStatus === 'Offline - Syncing' ? 'animate-spin' : ''}`} />
                    {activeTrans.syncTriggerBtn}
                  </button>
                </div>
              )}
            </div>

            {currentUser && (
              <div id="user-profile-header-widget" className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-1.5 shrink-0 select-none">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-7 w-7 rounded-lg border border-slate-700 shrink-0" />
                <div className="hidden md:block text-left text-[10px] leading-tight shrink-0">
                  <p className="font-bold text-white max-w-[120px] truncate">{currentUser.name}</p>
                  <p className="text-slate-450 text-slate-400 font-mono text-[9px] font-black">{currentUser.role}</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    // Also clear potential cached tab views to return to dashboard
                    setActiveTab("dashboard");
                  }}
                  title="Sign Out / প্রস্থান করুন"
                  className="bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 p-1.5 rounded-lg transition duration-150 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Language Switch */}
            <button 
              id="language-toggle"
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white border border-slate-700 flex items-center gap-2 transition duration-200 cursor-pointer"
              title="Switch Language / ভাষা পরিবর্তন করুন"
            >
              <Globe className="h-4 w-4 text-teal-400 shrink-0" />
              <span className="font-semibold hidden sm:inline">{lang === 'en' ? 'বাংলা (BN)' : 'English (EN)'}</span>
              <span className="font-semibold sm:hidden">{lang === 'en' ? 'BN' : 'EN'}</span>
            </button>
          </div>
        </div>
      </header>
      )}

      {/* Main Container Layout */}
      <main className={`flex-1 w-full mx-auto flex flex-col transition-all duration-300 ${
        activeTab === "home" ? "max-w-2xl px-0 pt-0 pb-36 gap-0" : "max-w-7xl px-4 md:px-6 py-4 md:py-6 gap-4 md:gap-6"
      }`}>
        
        {/* Navigation Tabs Bar */}
        {activeTab !== "home" && (
          <div className="border border-slate-800 bg-slate-950/65 backdrop-blur-md p-1 rounded-xl flex overflow-x-auto whitespace-nowrap scrollbar-none gap-1 shadow-lg shadow-black/30">
          {[
            { id: "dashboard", label: activeTrans.dashboard, icon: Activity },
            { id: "livestock", label: activeTrans.livestock, icon: Layers },
            { id: "cattle-feed", label: activeTrans.cattleFeed, icon: Wheat },
            { id: "retail", label: activeTrans.retail, icon: ShoppingCart },
            { id: "butchers", label: activeTrans.butchers, icon: ChefHat },
            { id: "investors", label: activeTrans.investments || "Shares & Investors", icon: Users },
            { id: "ai-assistant", label: activeTrans.aiAssistant || "Smart AI Assistant", icon: Sparkles }
          ].filter(tab => isTabAllowed(tab.id, currentUser?.role)).map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-1.5 md:gap-2 px-3.5 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer select-none outline-none ${
                  isActive 
                  ? "bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-md shadow-teal-500/25 font-black tracking-wide transform scale-[1.02]" 
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80 hover:shadow-inner"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 md:h-4.5 md:w-4.5 transition-colors ${isActive ? "text-slate-950" : "text-slate-400 group-hover:text-slate-300"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
        )}

        {/* Offline Banner & Sync Controller */}
        {activeTab !== "home" && (!effectiveOnline || cachedQueue.length > 0) && (
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg ${
            syncStatus === "Offline - Syncing"
              ? "bg-amber-950/20 border-amber-800/60 text-amber-300 animate-pulse"
              : cachedQueue.length > 0
              ? "bg-rose-950/20 border-rose-800/50 text-rose-300 shadow-rose-950/10"
              : "bg-slate-900/80 border-slate-800 text-slate-300"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                syncStatus === "Offline - Syncing"
                  ? "bg-amber-500/10 text-amber-400"
                  : cachedQueue.length > 0
                  ? "bg-rose-500/10 text-rose-400 animate-pulse"
                  : "bg-stone-500/10 text-stone-400"
              }`}>
                {syncStatus === "Offline - Syncing" ? (
                  <RefreshCw className="h-5 w-5 animate-spin text-amber-400" />
                ) : cachedQueue.length > 0 ? (
                  <WifiOff className="h-5 w-5 text-rose-400" />
                ) : (
                  <WifiOff className="h-5 w-5 text-stone-405" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap flex-row font-sans">
                  {syncStatus === "Offline - Syncing" ? (
                    "Syncing Cached Transactions..."
                  ) : cachedQueue.length > 0 ? (
                    <span>Offline Mode Active • {cachedQueue.length} Pending Actions Cached</span>
                  ) : (
                    "Fully Functional Offline Mode Active"
                  )}
                  {cachedQueue.length > 0 && (
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-md text-[9px] font-mono tracking-widest uppercase animate-pulse">
                      Changes Cached
                    </span>
                  )}
                </p>
                <div className="text-xs text-slate-400 mt-1.5 leading-normal font-sans">
                  {syncStatus === "Offline - Syncing" ? (
                    <div className="space-y-2">
                      <p className="text-amber-200 font-semibold flex items-center gap-1.5">
                        <span className="inline-block h-1.5 w-1.5 bg-amber-400 rounded-full animate-ping"></span>
                        Synchronizing item {syncProgressIndex + 1} of {prevCachedQueue.length}:{" "}
                        <span className="text-[11px] font-mono text-white tracking-wide bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {prevCachedQueue[syncProgressIndex] || "Finishing handshake..."}
                        </span>
                      </p>
                      <div className="flex items-center gap-3 w-80 max-w-full">
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-teal-400 h-full transition-all duration-150 rounded-full"
                            style={{ 
                              width: `${Math.round(((syncProgressIndex * 100 + syncItemProgress) / (prevCachedQueue.length * 100)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono shrink-0 text-amber-300 font-black">
                          {Math.round(((syncProgressIndex * 100 + syncItemProgress) / (prevCachedQueue.length * 100)) * 100)}%
                        </span>
                      </div>
                    </div>
                  ) : cachedQueue.length > 0 ? (
                    <p>All data edits, invoices, and sales processed are locked in secure localStorage and queued for final settlement transfer.</p>
                  ) : (
                    <p>You are currently disconnected from internet, but can safely create sales, manage sheep/cattle weights, and print bills.</p>
                  )}
                </div>
              </div>
            </div>
            {effectiveOnline && cachedQueue.length > 0 && (
              <button
                onClick={handleSyncNow}
                disabled={syncStatus === "Offline - Syncing"}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer self-start md:self-auto shadow-md shadow-teal-500/10"
              >
                <RefreshCw className={`h-4 w-4 ${syncStatus === 'Offline - Syncing' ? 'animate-spin' : ''}`} />
                SYNC NOW ({cachedQueue.length} changes)
              </button>
            )}
          </div>
        )}

        {/* TAB: PREMIUM SCREENSHOT REPLICA (HOME VIEW) */}
        {activeTab === "home" && (
          <div className="flex flex-col bg-[#f4f6fa] text-slate-800 animate-fadeIn min-h-screen relative shadow-[0_0_50px_rgba(0,0,0,0.06)] overflow-hidden">
            
            {/* Custom Screenshot-Perfect Header */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
              <div className="flex items-center gap-3">
                {/* Custom stylized Chicken logo matching the brand in the mockup */}
                <div className="h-10 w-10 bg-gradient-to-tr from-amber-100/60 to-amber-200/50 rounded-full flex items-center justify-center border border-amber-200/40 shadow-xs">
                  <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -scale-x-102">
                    <path d="M14 36c0-10 8-18 18-18s18 8 18 18c0 4-4 8-8 10" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round"/>
                    <path d="M42 22c2-2 5-2 7 0s2 5 0 7l-5 2" stroke="#ef4444" strokeWidth="3" strokeLinejoin="round"/>
                    <path d="M26 12c2-4 5-4 7-1" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="34" cy="24" r="3" fill="#1e293b"/>
                    <path d="M14 34c0 10 8 18 18 18s18-8 18-18" fill="#ffffff" stroke="#e2e8f0" strokeWidth="3.5"/>
                    <path d="M32 52v8m-4 0h8" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-lg font-black font-sans text-slate-800 tracking-tight">ShaieAlam'sFarm</span>
              </div>
              
              {/* Notification / Tasks link on top right */}
              <button 
                onClick={() => {
                  setHomeSubView("dashboard");
                  setCollapsedAccordions(prev => ({ ...prev, alerts: false }));
                }}
                className="flex items-center gap-1.5 text-[#f59e0b] hover:text-amber-600 font-extrabold text-sm transition focus:outline-none cursor-pointer select-none"
              >
                <span>Tasks</span>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.07 6.07 0 00-3.578-5.559V5a1.5 1.5 0 10-3 0v1.441A6.07 6.07 0 008 11v3c0 .825-.333 1.6-1.405 1.742" />
                    <path strokeLinejoin="round" d="M12 21a2 2 0 002-2H10a2 2 0 002 2z" />
                  </svg>
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full text-[9px] font-black h-4 w-4 flex items-center justify-center border-2 border-white shadow-xs">
                    19
                  </span>
                </div>
              </button>
            </header>

            {/* Selector bar under header */}
            <div className="max-w-md mx-auto w-full px-5 mt-5">
              <div className="flex items-center justify-between mb-4">
                
                {/* Edit Widgets Toggle Button */}
                <button 
                  onClick={() => {
                    setIsScheduleModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 hover:border-slate-350 hover:bg-slate-50 text-[11px] font-bold text-slate-600 rounded-xl shadow-xs transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span>Edit Widgets</span>
                </button>
                
                {/* Selector switch */}
                <div className="bg-white border border-slate-200/85 rounded-xl p-1 flex gap-0.5 shadow-xs">
                  <button 
                    onClick={() => setHomeSubView("widgets")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition duration-200 ${
                      homeSubView === "widgets" 
                        ? "bg-[#fbbf24] text-white shadow-xs font-black" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Widgets
                  </button>
                  <button 
                    onClick={() => setHomeSubView("dashboard")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition duration-200 ${
                      homeSubView === "dashboard" 
                        ? "bg-[#fbbf24] text-white shadow-xs font-black" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* VIEW A: WIDGETS DISPLAY (Screenshot 1) */}
            {homeSubView === "widgets" && (
              <div className="max-w-md mx-auto w-full px-5 space-y-6 pb-20">
                
                {/* 2-Column Grid matching UI Layout exactly */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* WIDGET 1: Batches */}
                  <button 
                    onClick={() => setActiveTab("livestock")}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition hover:scale-[1.01] duration-150 cursor-pointer"
                  >
                    <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-3 text-2xl shadow-inner border border-amber-100/20">
                      🏡
                    </div>
                    <span className="text-xs font-black text-slate-700 tracking-tight">Batches</span>
                  </button>

                  {/* WIDGET 2: My Farm Shop */}
                  <button 
                    onClick={() => setActiveTab("retail")}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition hover:scale-[1.01] duration-150 cursor-pointer"
                  >
                    <div className="h-14 w-14 bg-amber-100/30 rounded-2xl flex items-center justify-center mb-3 text-2xl shadow-inner border border-amber-100/10">
                      🏪
                    </div>
                    <span className="text-xs font-black text-slate-700 tracking-tight">My Farm Shop</span>
                  </button>

                  {/* WIDGET 3: Finances */}
                  <button 
                    onClick={() => setActiveTab("investors")}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition hover:scale-[1.01] duration-150 cursor-pointer"
                  >
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3 text-2xl shadow-inner">
                      💰
                    </div>
                    <span className="text-xs font-black text-slate-700 tracking-tight">Finances</span>
                  </button>

                  {/* WIDGET 4: Health Records */}
                  <button 
                    onClick={() => {
                      setActiveTab("livestock");
                      alert("Opening Livestock Ledger. Check individual animals profiles to inspect and edit veterinary vaccination/health histories.");
                    }}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition hover:scale-[1.01] duration-150 cursor-pointer"
                  >
                    <div className="h-14 w-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-3 text-2xl shadow-inner">
                      💉
                    </div>
                    <span className="text-xs font-black text-slate-700 tracking-tight">Health Records</span>
                  </button>

                  {/* WIDGET 5: Records */}
                  <button 
                    onClick={() => setActiveTab("retail")}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition hover:scale-[1.01] duration-150 cursor-pointer"
                  >
                    <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3 text-2xl shadow-inner">
                      📋
                    </div>
                    <span className="text-xs font-black text-slate-700 tracking-tight">Records</span>
                  </button>

                  {/* WIDGET 6: Schedules */}
                  <button 
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition hover:scale-[1.01] duration-150 cursor-pointer"
                  >
                    <div className="h-14 w-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-3 text-2xl shadow-inner">
                      📅
                    </div>
                    <span className="text-xs font-black text-slate-700 tracking-tight">Schedules</span>
                  </button>

                  {/* WIDGET 7: Download Reports */}
                  <button 
                    onClick={() => {
                      // Trigger functional CSV export report
                      const columns = [
                        { header: "Animal ID", accessor: (a: any) => a.id },
                        { header: "Breed", accessor: (a: any) => a.breed },
                        { header: "Type", accessor: (a: any) => a.type },
                        { header: "Weight (KG)", accessor: (a: any) => a.weightKg || 150 },
                        { header: "Purchase Price (₹)", accessor: (a: any) => a.purchasePrice },
                        { header: "Owner / Dept", accessor: (a: any) => a.owner || "Farm Central" }
                      ];
                      triggerCSVDownload(animals, columns, "ShaieAlam_Farm_Ledger_Report.csv");
                    }}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition hover:scale-[1.01] duration-150 cursor-pointer col-span-2"
                  >
                    <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-3 text-2xl shadow-inner border border-amber-150">
                      📊
                    </div>
                    <span className="text-xs font-black text-slate-700 tracking-tight">Download Reports</span>
                  </button>
                </div>

                {/* Upcoming Tasks Section (Mockup Matching) */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                    <span className="text-sm font-black text-slate-800">Upcoming Tasks</span>
                    <button 
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="text-xs font-black text-[#fbbf24] flex items-center hover:text-amber-600 transition"
                    >
                      View All &gt;
                    </button>
                  </div>
                  
                  <div className="py-6 flex flex-col items-center justify-center text-center">
                    {upcomingTasks.length === 0 ? (
                      <>
                        <p className="text-xs text-slate-400 font-medium">All clear here. For now.</p>
                        <button 
                          onClick={() => setIsScheduleModalOpen(true)}
                          className="mt-4 px-6 py-2.5 border border-[#fbbf24]/50 hover:bg-amber-50/20 text-[#fbbf24] text-xs font-black rounded-xl transition duration-150 cursor-pointer shadow-xs"
                        >
                          Schedule Tasks
                        </button>
                      </>
                    ) : (
                      <div className="w-full text-left space-y-2.5">
                        {upcomingTasks.map(task => (
                          <div key={task.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/40 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🎯</span>
                              <div>
                                <p className="font-extrabold text-slate-800">{task.name}</p>
                                <p className="text-[10px] text-slate-500">{task.category}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-slate-600 bg-white border border-slate-200/80 px-2 py-0.5 rounded-lg shadow-2xs">{task.date}</span>
                          </div>
                        ))}
                        <button 
                          onClick={() => setIsScheduleModalOpen(true)}
                          className="w-full text-center py-2.5 mt-2 text-xs font-bold text-slate-500 bg-slate-50 border border-dashed border-slate-200 hover:bg-slate-100 rounded-xl transition"
                        >
                          + Add Custom Task
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* VIEW B: DASHBOARD VIEW (Screenshot 2) */}
            {homeSubView === "dashboard" && (
              <div className="max-w-md mx-auto w-full px-5 space-y-5 pb-20">
                
                {/* Success Banner */}
                <div className="bg-emerald-50/80 border-2 border-emerald-500/35 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-2xs select-none">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Check className="h-5 w-5 stroke-[3]" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-emerald-950 leading-tight">All systems running smoothly</p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">There are no critical alerts for your farm at this time.</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 hidden sm:block" />
                </div>

                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4">Status at a Glance</h3>

                {/* ACCORDION 1: Financial Overview (Expanded by default) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                  <button 
                    onClick={() => setCollapsedAccordions(prev => ({ ...prev, financial: !prev.financial }))}
                    className="w-full px-4 py-3.5 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition text-left"
                  >
                    <span className="text-xs font-black text-[#f59e0b] flex items-center gap-2 tracking-wide uppercase">
                      💵 Financial Overview
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 ${!collapsedAccordions.financial ? 'rotate-180' : ''}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {!collapsedAccordions.financial && (
                    <div className="p-4 bg-slate-50/40 space-y-4">
                      <div className="grid grid-cols-2 gap-3.5">
                        
                        {/* Metric 1: Net Profit (30d) representing user values */}
                        <div className="bg-white border border-slate-200/60 rounded-xl p-3 shadow-xs flex flex-col justify-between">
                          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider font-extrabold">Net Profit (30d)</span>
                          <span className="text-base font-black text-emerald-500 font-mono mt-1">+₹{(cashBalance > 128400 ? (cashBalance - 128400) : 0).toLocaleString()}</span>
                          <div className="mt-2 text-[9px] text-slate-500">Wallet reserves stable</div>
                        </div>

                        {/* Metric 2: Financial Health */}
                        <div className="bg-white border border-slate-200/60 rounded-xl p-3 shadow-xs flex flex-col justify-between">
                          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider font-extrabold">Financial Health</span>
                          <span className="text-xs font-black text-[#fbbf24] mt-1 uppercase tracking-widest">{cashBalance > 100005 ? "Healthy" : "N/A"}</span>
                          <div className="mt-2 text-[9px] text-slate-500">Central capital ready</div>
                        </div>

                        {/* Metric 3: Today's Tasks */}
                        <div className="bg-white border border-slate-200/60 rounded-xl p-3 shadow-xs flex flex-col justify-between">
                          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider font-extrabold">Today's Tasks</span>
                          <span className="text-base font-black text-slate-700 font-mono mt-1">{upcomingTasks.length}</span>
                          <div className="mt-2 text-[9px] text-slate-500">Pending events</div>
                        </div>

                        {/* Metric 4: Income (30d) values fetched from sales list! */}
                        <div className="bg-white border border-slate-200/60 rounded-xl p-3 shadow-xs flex flex-col justify-between">
                          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider font-extrabold">Income (30d)</span>
                          <span className="text-base font-black text-slate-700 font-mono mt-1">₹{sales.reduce((acc, s) => acc + s.grandTotal, 0).toLocaleString()}</span>
                          <div className="mt-2 text-[9px] text-emerald-500 font-black">↑ Live transactions</div>
                        </div>

                        {/* Metric 5: Expense (30d) values calculated from registered livestock */}
                        <div className="bg-white border border-slate-200/60 rounded-xl p-3 shadow-xs flex flex-col justify-between col-span-2">
                          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider font-extrabold">Expense (30d)</span>
                          <span className="text-base font-black text-slate-700 font-mono mt-1">₹{animals.reduce((acc, a) => acc + a.purchasePrice, 0).toLocaleString()}</span>
                          <div className="mt-2 text-[9px] text-slate-500">Registered Sourcing Purchases Capital</div>
                        </div>

                      </div>

                      {/* Interactive finance form toggle button */}
                      <button 
                        type="button"
                        onClick={() => setShowFinForm(!showFinForm)}
                        className="w-full py-2 bg-amber-500/10 hover:bg-[#fbbf24]/20 text-[#f59e0b] font-black text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer select-none"
                      >
                        {showFinForm ? "✕ Close Sourcing Form" : "➕ Record Capital Transaction / লেনদেন সংরক্ষণ"}
                      </button>

                      {/* Sourcing form */}
                      {showFinForm && (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            const amt = Number(finAmount);
                            if (!amt || amt <= 0) {
                              alert("Please specify a valid monetary amount.");
                              return;
                            }
                            if (finType === "Income") {
                              setCashBalance(prev => prev + amt);
                              const newSale = {
                                id: `SAL-${Date.now()}`,
                                customerName: "Farm Sourcing Buyer",
                                customerPhone: "N/A",
                                customerCode: "9999",
                                items: [{ type: finCategory, weightKg: 0, ratePerKg: 0, amount: amt }],
                                subtotal: amt,
                                chargeWeight: 0,
                                carryingCharge: 0,
                                grandTotal: amt,
                                date: new Date().toISOString().split("T")[0]
                              };
                              setSales(prev => [newSale, ...prev]);
                            } else {
                              setCashBalance(prev => Math.max(0, prev - amt));
                            }
                            recordOfflineChange(`Registered capital ${finType} of ₹${amt} under ${finCategory}`);
                            alert(`Successfully processed ${finType} of ₹${amt.toLocaleString()}!`);
                            setFinAmount("");
                            setFinDescription("");
                            setShowFinForm(false);
                          }}
                          className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3.5 text-xs text-slate-705 animate-fadeIn"
                        >
                          <p className="font-extrabold text-slate-800">New Financial Sourcing Log / নতুন লেনদেন</p>
                          
                          <div className="flex gap-2">
                            <button 
                              type="button"
                              onClick={() => setFinType("Income")}
                              className={`flex-1 py-1.5 rounded-lg text-center font-bold text-xs border ${finType === "Income" ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "bg-white border-slate-200 text-slate-600"}`}
                            >
                              Income
                            </button>
                            <button 
                              type="button"
                              onClick={() => setFinType("Expense")}
                              className={`flex-1 py-1.5 rounded-lg text-center font-bold text-xs border ${finType === "Expense" ? "bg-rose-50 border-rose-500 text-rose-600" : "bg-white border-slate-200 text-slate-600"}`}
                            >
                              Expense
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] uppercase font-black font-mono text-slate-400 mb-1">Amount / পরিমাণ (₹)</label>
                              <input 
                                type="number" 
                                required
                                value={finAmount}
                                onChange={(e) => setFinAmount(e.target.value)}
                                placeholder="e.g. 1500" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs font-mono font-bold"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[10px] uppercase font-black font-mono text-slate-400 mb-1">Category / খাত</label>
                              <select 
                                value={finCategory} 
                                onChange={(e) => setFinCategory(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                              >
                                <option value="Sales Revenue">Sales Revenue</option>
                                <option value="Feed Sourcing">Feed Sourcing</option>
                                <option value="Veterinary Medicines">Veterinary Medicines</option>
                                <option value="Herdsmen Maintenance">Herdsmen Maintenance</option>
                                <option value="Investor Capital Transfer">Investor Capital Transfer</option>
                                <option value="Utility Outflow">Utility Outflow</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-black font-mono text-slate-400 mb-1">Memo Comments / বর্ণনা</label>
                            <input 
                              type="text" 
                              value={finDescription}
                              onChange={(e) => setFinDescription(e.target.value)}
                              placeholder="Describe transaction context..." 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none text-xs"
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full bg-[#fbbf24] hover:bg-amber-500 text-slate-900 font-black py-2 rounded-lg text-xs cursor-pointer select-none"
                          >
                            Save Transaction Log
                          </button>
                        </form>
                      )}

                    </div>
                  )}
                </div>

                {/* ACCORDION 2: Livestock & Health (Collapsed by default) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                  <button 
                    onClick={() => setCollapsedAccordions(prev => ({ ...prev, livestock: !prev.livestock }))}
                    className="w-full px-4 py-3.5 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition text-left"
                  >
                    <span className="text-xs font-extrabold text-slate-600 flex items-center gap-2 uppercase tracking-wide">
                      🐾 Livestock & Health
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 ${!collapsedAccordions.livestock ? 'rotate-180' : ''}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {!collapsedAccordions.livestock && (
                    <div className="p-4 bg-slate-50/20 text-xs text-slate-600 space-y-4 font-sans text-left">
                      <div className="space-y-1.5 border-b border-slate-200 pb-3">
                        <div className="flex justify-between"><span>Live Herd heads:</span><b>{animals.filter(a => a.status !== "Processed").length} Units</b></div>
                        <div className="flex justify-between"><span>Cattle Registered:</span><b>{animals.filter(a=> a.type==="Cow" || a.type==="Buffalo").length} Heads</b></div>
                        <div className="flex justify-between"><span>Goat & Sheep Pen:</span><b>{animals.filter(a=> a.type==="Goat" || a.type==="Sheep").length} Heads</b></div>
                      </div>

                      {/* Form options toggles */}
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => { setShowLiveForm(!showLiveForm); setShowMedForm(false); }}
                          className="flex-1 py-1.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-[#f59e0b] font-black text-[11px] rounded-xl text-center select-none"
                        >
                          {showLiveForm ? "✕ Close" : "➕ Register Head"}
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setShowMedForm(!showMedForm); setShowLiveForm(false); }}
                          className="flex-1 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-105 text-indigo-600 font-extrabold text-[11px] rounded-xl text-center select-none"
                        >
                          {showMedForm ? "✕ Close" : "➕ Log Medicine"}
                        </button>
                      </div>

                      {/* Register Head form */}
                      {showLiveForm && (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!liveBreed.trim()) {
                              alert("Please specify the breed.");
                              return;
                            }
                            const price = Number(livePrice) || 0;
                            const weight = Number(liveWeight) || 120;
                            const newId = `ANI-${String(animals.length + 1).padStart(3, "0")}`;
                            
                            const createdHead: Animal = {
                              id: newId,
                              type: liveType,
                              breed: liveBreed,
                              owner: liveOwner || "Farm Central",
                              weightKg: weight,
                              purchasePrice: price,
                              advancePaid: price,
                              due: 0,
                              status: "Paid",
                              investors: [],
                              dateAdded: new Date().toISOString().split("T")[0],
                              healthCondition: "9/10 (Excellent)",
                              isCached: !effectiveOnline
                            };

                            setAnimals(prev => [createdHead, ...prev]);
                            setCashBalance(cb => Math.max(0, cb - price));
                            recordOfflineChange(`Registered head ${newId} (${liveType} - ${liveBreed}) via Dashboard QuickForm`);
                            alert(`Registered Animal Head ${newId} successfully added to central record registry!`);
                            setLiveBreed("");
                            setLivePrice("");
                            setLiveWeight("");
                            setShowLiveForm(false);
                          }}
                          className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3.5 text-xs text-slate-700 font-sans"
                        >
                          <p className="font-extrabold text-slate-800">Register Livestock Head / পশু নিবন্ধন</p>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 mb-0.5">Type</label>
                              <select 
                                value={liveType}
                                onChange={(e) => setLiveType(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                              >
                                <option value="Cow">Cow</option>
                                <option value="Buffalo">Buffalo</option>
                                <option value="Goat">Goat</option>
                                <option value="Sheep">Sheep</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 mb-0.5">Breed / জাত</label>
                              <input 
                                type="text"
                                required
                                placeholder="e.g. Sahiwal"
                                value={liveBreed}
                                onChange={(e) => setLiveBreed(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 mb-0.5">Weight (KG)</label>
                              <input 
                                type="number"
                                placeholder="e.g. 180"
                                value={liveWeight}
                                onChange={(e) => setLiveWeight(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-205 rounded-lg p-1.5 text-xs text-slate-700"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 mb-0.5">Cost Price (₹)</label>
                              <input 
                                type="number"
                                placeholder="e.g. 45000"
                                value={livePrice}
                                onChange={(e) => setLivePrice(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-205 rounded-lg p-1.5 text-xs text-slate-700"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 mb-0.5">Merchant / বিক্রেতা</label>
                            <input 
                              type="text"
                              value={liveOwner}
                              onChange={(e) => setLiveOwner(e.target.value)}
                              placeholder="e.g. Sourcing Brokerage"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full bg-[#fbbf24] hover:bg-amber-500 text-slate-900 font-extrabold py-2 rounded-lg text-xs"
                          >
                            Add Animal Head
                          </button>
                        </form>
                      )}

                      {/* Log medicine form */}
                      {showMedForm && (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!medAnimalId) {
                              alert("Please select a target Animal.");
                              return;
                            }
                            if (!medType.trim()) {
                              alert("Please specify checking details (e.g. Dewormer dose).");
                              return;
                            }
                            const cost = Number(medCost) || 0;
                            
                            setAnimals(prev => prev.map(a => {
                              if (a.id === medAnimalId) {
                                const history = a.healthHistory || [];
                                const record = {
                                  id: `MED-${Date.now()}`,
                                  date: new Date().toISOString().split("T")[0],
                                  diagnosis: medType,
                                  treatment: "Administered treatment prescribed.",
                                  cost,
                                  notes: `Condition updated to: ${medCondition}`,
                                  operator: "Veterinary Officer"
                                };
                                return {
                                  ...a,
                                  healthCondition: medCondition,
                                  healthHistory: [...history, record],
                                  medicineCost: (a.medicineCost || 0) + cost
                                };
                              }
                              return a;
                            }));

                            if (cost > 0) {
                              setCashBalance(cb => Math.max(0, cb - cost));
                            }
                            recordOfflineChange(`Logged medical checkup for ${medAnimalId}: ${medType}`);
                            alert(`Medical check registered successfully for animal ID ${medAnimalId}!`);
                            setMedType("");
                            setMedCost("");
                            setShowMedForm(false);
                          }}
                          className="bg-white border text-xs text-slate-700 rounded-xl p-3.5 space-y-3 font-sans"
                        >
                          <p className="font-extrabold text-slate-800">Cattle Vaccination & Treatment / চিকিৎসা রেকর্ড</p>
                          
                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 mb-0.5">Select Animal ID</label>
                            <select 
                              value={medAnimalId}
                              onChange={(e) => setMedAnimalId(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                            >
                              <option value="">-- Choose Animal --</option>
                              {animals.map(ani => (
                                <option key={ani.id} value={ani.id}>{ani.id} ({ani.type} - {ani.breed})</option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 mb-0.5">Vaccine/Medicine</label>
                              <input 
                                type="text"
                                required
                                value={medType}
                                onChange={(e) => setMedType(e.target.value)}
                                placeholder="e.g. Vitamin AD3H"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 mb-0.5">Health Condition</label>
                              <select 
                                value={medCondition}
                                onChange={(e) => setMedCondition(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                              >
                                <option value="Excellent">Excellent</option>
                                <option value="Healthy">Healthy</option>
                                <option value="Recovering">Recovering</option>
                                <option value="Isolated">Isolated</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 mb-0.5">Treatment Cost (₹)</label>
                            <input 
                              type="number"
                              value={medCost}
                              onChange={(e) => setMedCost(e.target.value)}
                              placeholder="e.g. 250"
                              className="w-full bg-slate-50 border border-slate-202 rounded-lg p-1.5 text-xs text-slate-705"
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full bg-indigo-600 text-white font-extrabold py-2 rounded-lg text-xs"
                          >
                            Save Medical Log
                          </button>
                        </form>
                      )}

                      <button onClick={() => { setActiveTab("livestock"); }} className="text-amber-500 font-bold block pt-1 hover:underline">Inspect entire pen &rarr;</button>
                    </div>
                  )}
                </div>

                {/* ACCORDION 3: Production & Breeding (Collapsed) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                  <button 
                    onClick={() => setCollapsedAccordions(prev => ({ ...prev, production: !prev.production }))}
                    className="w-full px-4 py-3.5 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition text-left"
                  >
                    <span className="text-xs font-extrabold text-slate-600 flex items-center gap-2 uppercase tracking-wide">
                      🥚 Production & Breeding
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 ${!collapsedAccordions.production ? 'rotate-180' : ''}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {!collapsedAccordions.production && (
                    <div className="p-4 bg-slate-50/20 text-xs text-slate-600 space-y-4 font-sans text-left">
                      <p className="text-slate-500 font-bold">Currently tracked gestations and raw milk harvests:</p>

                      {/* Active Gestations List */}
                      <div className="space-y-2 border border-slate-200 rounded-xl p-2.5 bg-white">
                        <span className="text-[10px] uppercase font-black font-mono text-slate-400 block mb-1">Active Gestation Registry</span>
                        {breedingLogs.length === 0 ? (
                          <p className="text-[10px] text-slate-400">0 active gestations registered on custom dashboard.</p>
                        ) : (
                          breedingLogs.map(log => (
                            <div key={log.id} className="flex justify-between items-center bg-slate-50 text-[10px] p-2 rounded border border-slate-100">
                              <div>
                                <p className="font-extrabold text-slate-800">Cow: {log.animalId} (Bull: {log.bullId})</p>
                                <p className="text-[9px] text-slate-400 font-normal">Status: {log.status}</p>
                              </div>
                              <span className="font-mono text-[#f59e0b] font-bold text-[9px]">Birth: {log.expectedDate}</span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Daily Harvests List */}
                      <div className="space-y-2 border border-slate-200 rounded-xl p-2.5 bg-white">
                        <span className="text-[10px] uppercase font-black font-mono text-slate-400 block mb-1 font-bold">Raw Milk Yield Collection Logs</span>
                        {milkLogs.length === 0 ? (
                          <p className="text-[10px] text-slate-400">No raw milk collection logged today.</p>
                        ) : (
                          milkLogs.map(m => (
                            <div key={m.id} className="flex justify-between items-center bg-slate-50 text-[10px] p-2 rounded border border-slate-105">
                              <div>
                                <p className="font-extrabold text-slate-800">{m.liters} Liters from {m.animalId}</p>
                                <p className="text-[9px] text-slate-400 font-normal">{m.date}</p>
                              </div>
                              <span className="font-mono text-emerald-500 font-bold text-[10px]">+₹{m.totalAmount}</span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Form Triggers */}
                      <div className="flex gap-2 font-normal">
                        <button 
                          type="button"
                          onClick={() => { setShowBreedForm(!showBreedForm); setShowDairyForm(false); }}
                          className="flex-1 py-1.5 bg-indigo-50 border border-slate-200 text-indigo-700 font-bold text-[10px] rounded-lg text-center"
                        >
                          {showBreedForm ? "✕ Close" : "🍼 Log Gestation"}
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setShowDairyForm(!showDairyForm); setShowBreedForm(false); }}
                          className="flex-1 py-1.5 bg-emerald-50 border border-slate-200 text-emerald-700 font-bold text-[10px] rounded-lg text-center"
                        >
                          {showDairyForm ? "✕ Close" : "🥛 Record Dairy Yield"}
                        </button>
                      </div>

                      {/* Breeding form */}
                      {showBreedForm && (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!breedAnimalId || !breedBullId) {
                              alert("Please selectCow ID and enter Bull semen.");
                              return;
                            }
                            const sDate = new Date().toISOString().split("T")[0];
                            const servObj = new Date();
                            servObj.setDate(servObj.getDate() + 280); 
                            const expDate = servObj.toISOString().split("T")[0];

                            const newGestationLog = {
                              id: `B-${breedingLogs.length + 1}`,
                              animalId: breedAnimalId,
                              bullId: breedBullId,
                              serviceDate: sDate,
                              expectedDate: expDate,
                              status: "Active Gestation",
                              notes: breedNotes || "Healthy gestation"
                            };

                            setBreedingLogs([newGestationLog, ...breedingLogs]);
                            recordOfflineChange(`Registered breeding gestation cycle for ${breedAnimalId}`);
                            alert(`Gestation cycle reported! Expected calving delivery calculated: ${expDate}`);
                            setBreedNotes("");
                            setShowBreedForm(false);
                          }}
                          className="bg-white border rounded-xl p-3.5 space-y-3 text-xs text-slate-700 font-sans"
                        >
                          <p className="font-bold text-slate-800">Artificial Insemination Gestation / প্রজনন রেকর্ড</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5">Mother Cow ID</label>
                              <select 
                                value={breedAnimalId} 
                                onChange={(e) => setBreedAnimalId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 p-1 text-[11px] rounded"
                              >
                                <option value="">-- Choose Cow --</option>
                                {animals.filter(a => a.type === "Cow" || a.type === "Bull").map(c => (
                                  <option key={c.id} value={c.id}>{c.id} ({c.breed})</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5">Bull Semen ID</label>
                              <input 
                                type="text"
                                required
                                placeholder="e.g. BULL-55"
                                value={breedBullId}
                                onChange={(e) => setBreedBullId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[11px]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5">Insemination notes</label>
                            <input 
                              type="text"
                              placeholder="e.g. Ultra high index semen straw"
                              value={breedNotes}
                              onChange={(e) => setBreedNotes(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[11px]"
                            />
                          </div>

                          <button type="submit" className="w-[100%] bg-[#fbbf24] hover:bg-amber-500 text-slate-900 font-extrabold py-2 rounded text-[11px]">
                            Save Pregnancy Log
                          </button>
                        </form>
                      )}

                      {/* Dairy form */}
                      {showDairyForm && (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            const liters = Number(dairyLiters);
                            const r = Number(dairyRate) || 80;
                            if (!dairyAnimalId || !liters || liters <= 0) {
                              alert("Please fill all valid details.");
                              return;
                            }
                            const totalVal = liters * r;
                            const createdLog = {
                              id: `M-${milkLogs.length + 1}`,
                              date: new Date().toISOString().split("T")[0],
                              animalId: dairyAnimalId,
                              liters,
                              ratePerLiter: r,
                              totalAmount: totalVal
                            };

                            setMilkLogs([createdLog, ...milkLogs]);
                            setCashBalance(cb => cb + totalVal);
                            recordOfflineChange(`Recorded milk output harvest: ${liters}L from cow ${dairyAnimalId}`);
                            alert(`Daily Dairy yields logged successfully. ₹{totalVal.toLocaleString()} added to cash balance!`);
                            setDairyLiters("");
                            setShowDairyForm(false);
                          }}
                          className="bg-white border rounded-xl p-3.5 space-y-3 text-xs text-slate-700 font-sans"
                        >
                          <p className="font-bold text-slate-800 font-sans">Organic Raw Milk Production yields / দুগ্ধ উৎপাদন</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5 font-bold">Cow ID / মাদী গরু</label>
                              <select 
                                value={dairyAnimalId} 
                                onChange={(e) => setDairyAnimalId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[11px]"
                              >
                                <option value="">-- Choose Cow --</option>
                                {animals.filter(a => a.type === "Cow").map(c => (
                                  <option key={c.id} value={c.id}>{c.id} ({c.breed})</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5">Quantity (Liters)</label>
                              <input 
                                type="number"
                                required
                                placeholder="e.g. 15"
                                value={dairyLiters}
                                onChange={(e) => setDairyLiters(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 p-1 text-[11px] rounded"
                              />
                            </div>
                          </div>

                          <button type="submit" className="w-[100%] bg-[#fbbf24] hover:bg-amber-500 text-slate-900 font-extrabold py-2 rounded text-[11px]">
                            Log Collection Yield
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                {/* ACCORDION 4: Inventory & Supplies (Collapsed) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                  <button 
                    onClick={() => setCollapsedAccordions(prev => ({ ...prev, inventory: !prev.inventory }))}
                    className="w-full px-4 py-3.5 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition text-left"
                  >
                    <span className="text-xs font-extrabold text-slate-600 flex items-center gap-2 uppercase tracking-wide">
                      📦 Inventory & Supplies
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 ${!collapsedAccordions.inventory ? 'rotate-180' : ''}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {!collapsedAccordions.inventory && (
                    <div className="p-4 bg-slate-50/20 text-xs text-slate-600 space-y-4 font-sans text-left">
                      <p className="font-bold text-slate-705">Grain Silos Inventory Levels / গো-খাদ্য মজুদ:</p>
                      
                      <div className="space-y-1 bg-white border border-slate-200 rounded-xl p-2 font-mono text-[10px]">
                        {feedStock.slice(0, 5).map(f => (
                          <div key={f.id} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-none">
                            <span className="text-slate-700 font-sans font-medium">{f.type}</span>
                            <span className="font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{f.sackCount} sacks</span>
                          </div>
                        ))}
                      </div>

                      <button 
                        type="button"
                        onClick={() => setShowFeedForm(!showFeedForm)}
                        className="w-full py-2 bg-amber-500/10 hover:bg-[#fbbf24]/20 text-[#fbbf24] font-black rounded-lg text-[10px] select-none text-center cursor-pointer"
                      >
                        {showFeedForm ? "✕ Close Silo Form" : "🛠️ Record Sacks Intake / Consumption Update"}
                      </button>

                      {showFeedForm && (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!feedItemId) {
                              alert("Please choose a silo feed stock.");
                              return;
                            }
                            const cnt = parseInt(feedSacksChange, 10);
                            if (!cnt || cnt <= 0) {
                              alert("Please enter a valid count of sacks.");
                              return;
                            }

                            setFeedStock(prev => prev.map(item => {
                              if (item.id === feedItemId) {
                                const initialVal = item.sackCount || 0;
                                let afterChange = initialVal;
                                if (feedOperation === "Deposit") {
                                  afterChange = initialVal + cnt;
                                  const cost = cnt * (item.unitCostPerSack || 1000);
                                  setCashBalance(cb => Math.max(0, cb - cost));
                                } else {
                                  if (initialVal < cnt) {
                                    alert(`Insufficient silo stocks. Only ${initialVal} sacks remaining.`);
                                    return item;
                                  }
                                  afterChange = initialVal - cnt;
                                }
                                return { ...item, sackCount: afterChange };
                              }
                              return item;
                            }));

                            recordOfflineChange(`${feedOperation}ed ${cnt} sacks of ${feedItemId} Silo stock.`);
                            alert(`Stock levels processed and dynamically synced inside feed database!`);
                            setFeedSacksChange("");
                            setShowFeedForm(false);
                          }}
                          className="bg-white border rounded-xl p-3 text-xs space-y-3 font-normal text-slate-700"
                        >
                          <p className="font-extrabold text-slate-800">Silo Husk Logistics Form / গো-খাদ্য আপডেট</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5">Select Feed Silo</label>
                              <select 
                                value={feedItemId}
                                onChange={(e) => setFeedItemId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[11px]"
                              >
                                <option value="">-- Choose Stock --</option>
                                {feedStock.map(f => (
                                  <option key={f.id} value={f.id}>{f.type}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5">Operation Type</label>
                              <select 
                                value={feedOperation}
                                onChange={(e) => setFeedOperation(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[11px]"
                              >
                                <option value="Deposit">Deposit (+ Add)</option>
                                <option value="Disburse">Disburse (- Consume)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5">Quantity of Sacks / বস্তা সংখ্যা</label>
                            <input 
                              type="number"
                              required
                              placeholder="e.g. 10"
                              value={feedSacksChange}
                              onChange={(e) => setFeedSacksChange(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[11px]"
                            />
                          </div>

                          <button type="submit" className="w-[100%] bg-slate-900 text-white font-extrabold py-2 rounded text-[11px]">
                            Process Silo Adjustment
                          </button>
                        </form>
                      )}

                      <button onClick={() => { setActiveTab("cattle-feed"); }} className="text-amber-500 font-bold hover:underline block text-center">Cattle Feed Silos Dashboard &rarr;</button>
                    </div>
                  )}
                </div>

                {/* ACCORDION 5: External Alerts (Collapsed) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                  <button 
                    onClick={() => setCollapsedAccordions(prev => ({ ...prev, alerts: !prev.alerts }))}
                    className="w-full px-4 py-3.5 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition text-left"
                  >
                    <span className="text-xs font-extrabold text-slate-600 flex items-center gap-2 uppercase tracking-wide">
                      🚨 External Alerts
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 ${!collapsedAccordions.alerts ? 'rotate-180' : ''}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {!collapsedAccordions.alerts && (
                    <div className="p-4 bg-slate-50/20 text-xs text-rose-600 space-y-4 font-sans text-left">
                      
                      {/* Active warnings list */}
                      <div className="space-y-2 border border-rose-100 rounded-xl p-2.5 bg-white font-normal text-slate-705">
                        <span className="text-[9px] uppercase font-bold tracking-wide font-mono text-slate-400 block mb-1">Active Alerts / জরুরী সতর্কতা</span>
                        {customAlerts.map(alertItem => (
                          <div key={alertItem.id} className="p-2 rounded bg-rose-50/50 border border-rose-100 text-[11px] leading-snug">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-rose-800">{alertItem.subject}</span>
                              <span className="text-[8px] px-1 bg-rose-100 text-rose-600 rounded font-bold font-mono uppercase text-[7px]">{alertItem.urgency}</span>
                            </div>
                            <p className="text-slate-600 text-[10px]">{alertItem.details}</p>
                            <p className="text-[9px] text-slate-400 font-mono mt-1 font-bold">Target audience: {alertItem.department}</p>
                          </div>
                        ))}
                      </div>

                      <button 
                        type="button"
                        onClick={() => setShowAlertForm(!showAlertForm)}
                        className="w-full py-1.5 bg-rose-100 text-rose-600 font-bold rounded-lg text-[10px] select-none text-center block"
                      >
                        {showAlertForm ? "✕ Close Broadcast Form" : "🚨 Broadcast New Herdsmen Telegram Alert / সতর্কতা"}
                      </button>

                      {showAlertForm && (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!alertFormSubject.trim() || !alertFormDetails.trim()) {
                              alert("Please fill all alert values.");
                              return;
                            }
                            const createdAlertObj = {
                              id: `A-${customAlerts.length + 1}`,
                              subject: alertFormSubject,
                              details: alertFormDetails,
                              urgency: alertFormUrgency,
                              department: alertFormDept,
                              date: new Date().toISOString().split("T")[0]
                            };

                            setCustomAlerts([createdAlertObj, ...customAlerts]);
                            recordOfflineChange(`Sent warning alert inside network: ${alertFormSubject}`);
                            alert(`Broadcast warning sent inside entire farm grid coordinates successfully.`);
                            setAlertFormSubject("");
                            setAlertFormDetails("");
                            setShowAlertForm(false);
                          }}
                          className="bg-white border rounded-xl p-3 text-xs text-slate-700 space-y-3"
                        >
                          <p className="font-bold text-rose-750 font-sans text-rose-700">Dispatched Active Alarm Service / নতুন সতর্কতা</p>
                          <div>
                            <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5">Warning Alert Subject</label>
                            <input 
                              type="text"
                              required
                              placeholder="e.g. Gale Warning Forecast"
                              value={alertFormSubject}
                              onChange={(e) => setAlertFormSubject(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[11px]"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5 font-bold">Alert Description</label>
                            <textarea
                              required
                              rows={2}
                              value={alertFormDetails}
                              onChange={(e) => setAlertFormDetails(e.target.value)}
                              placeholder="Describe warning details..."
                              className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[11px]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5">Urgency Level</label>
                              <select 
                                value={alertFormUrgency}
                                onChange={(e) => setAlertFormUrgency(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[11px]"
                              >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[8px] uppercase font-black text-slate-400 mb-0.5 font-bold">Target Audience</label>
                              <select 
                                value={alertFormDept}
                                onChange={(e) => setAlertFormDept(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[11px]"
                              >
                                <option value="All Hands">All Hands</option>
                                <option value="Livestock Management">Livestock Management</option>
                                <option value="Sourcing Sinks">Sourcing Sinks</option>
                              </select>
                            </div>
                          </div>

                          <button type="submit" className="w-[100%] bg-rose-600 text-white font-extrabold py-2 rounded text-[11px]">
                            Disseminate Active Telemetry Alert
                          </button>
                        </form>
                      )}

                    </div>
                  )}
                </div>

              </div>
            )}

            {/* INTERACTIVE FLOATING ACTION CHAT BUTTON */}
            <button 
              onClick={() => {
                setActiveTab("ai-assistant");
                setIsMoreMenuOpen(false);
              }}
              className="fixed bottom-[88px] right-5 z-40 bg-[#fbbf24] hover:bg-amber-500 hover:scale-105 active:scale-95 text-slate-900 font-black px-4 py-3.5 rounded-full flex items-center gap-2 shadow-lg transition duration-200 select-none outline-none focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-mono tracking-wide uppercase">Chat to Record</span>
            </button>

            {/* DYNAMIC INTERACTIVE SCHEDULE TASKS MODAL */}
            {isScheduleModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-scaleIn text-slate-800">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                      📅 Schedule New Farm Task
                    </span>
                    <button 
                      onClick={() => setIsScheduleModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 font-mono mb-1.5">Task Description / নাম</label>
                      <input 
                        type="text" 
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        placeholder="e.g., Feed calves in Pen 2, checkup bulls..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 font-mono mb-1.5">Task Category / বিভাগ</label>
                      <select 
                        value={newTaskCategory}
                        onChange={(e) => setNewTaskCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-805"
                      >
                        <option value="Livestock & Health">Livestock & Health</option>
                        <option value="Production & Breeding">Production & Breeding</option>
                        <option value="Inventory & Supplies">Inventory & Supplies</option>
                        <option value="Financial & Sourcing">Financial & Sourcing</option>
                      </select>
                    </div>

                    <button 
                      onClick={() => {
                        if (!newTaskName.trim()) {
                          alert("Please specify a valid task description first.");
                          return;
                        }
                        const newTask = {
                          id: Date.now().toString(),
                          name: newTaskName,
                          category: newTaskCategory,
                          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        };
                        setUpcomingTasks(prev => [...prev, newTask]);
                        setNewTaskName("");
                        setIsScheduleModalOpen(false);
                      }}
                      className="w-full bg-[#fbbf24] hover:bg-amber-500 text-slate-900 font-black text-xs py-3 rounded-xl transition shadow-xs select-none"
                    >
                      Process & Register Task
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* COOPERATIVE COMMUNITY UPDATE MODAL */}
            {isCommunityModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-scaleIn text-slate-800">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                      👥 Cooperative Community Forum
                    </span>
                    <button 
                      onClick={() => setIsCommunityModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4 pt-4 text-xs text-slate-600 leading-relaxed font-sans">
                    <p className="font-extrabold text-[#f59e0b]">Updates from the Farm Cooperative Collective:</p>
                    
                    <div className="space-y-3">
                      <div className="p-2.5 bg-amber-50/50 border border-amber-100 rounded-xl">
                        <p className="font-bold text-slate-800">🌽 Cooperative Silage Bulk Sourcing</p>
                        <p className="text-[11px] mt-0.5 text-slate-500">We are combining silage and husk forage procurement logs next Friday to receive wholesale discount offsets from verified regional traders.</p>
                      </div>
                      
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="font-bold text-slate-800">🐃 Gabtoli Sourcing Security Protocol</p>
                        <p className="text-[11px] mt-0.5 text-slate-500">Always record front/side photos and bazar receipts immediately upon loading cattle on logistics trucks.</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsCommunityModalOpen(false)}
                      className="w-full mt-2 bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-xl font-bold transition select-none"
                    >
                      Acknowledge updates
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MORE TABS BOTTOM SLIDING DRAWER MENU */}
            {isMoreMenuOpen && (
              <div className="fixed inset-x-0 bottom-16 z-50 p-4 bg-white border-t border-slate-200 rounded-t-3xl shadow-[0_-10px_35px_rgba(0,0,0,0.1)] max-w-2xl mx-auto animate-fadeIn text-slate-800">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider font-mono">Navigate Farm Divisions / বিভাগসমূহ</span>
                  <button onClick={() => setIsMoreMenuOpen(false)} className="text-slate-400 p-1">✕</button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pb-2">
                  <button 
                    onClick={() => { setActiveTab("cattle-feed"); setIsMoreMenuOpen(false); }}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-amber-50/30 transition text-left cursor-pointer"
                  >
                    <span className="text-xl">🌾</span>
                    <div>
                      <p className="text-xs font-bold text-slate-850">Cattle Feed Silos</p>
                      <p className="text-[10px] text-slate-400">Grains & Silage Stocks</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setActiveTab("butchers"); setIsMoreMenuOpen(false); }}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-amber-50/30 transition text-left cursor-pointer"
                  >
                    <span className="text-xl">🥩</span>
                    <div>
                      <p className="text-xs font-bold text-slate-850">Butcher Despatches</p>
                      <p className="text-[10px] text-slate-400">Yield yields tracking</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setActiveTab("ai-assistant"); setIsMoreMenuOpen(false); }}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-amber-50/30 transition text-left cursor-pointer"
                  >
                    <span className="text-xl">✨</span>
                    <div>
                      <p className="text-xs font-bold text-slate-850">Smart AI Assistant</p>
                      <p className="text-[10px] text-slate-400">Gemini-driven audit</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setActiveTab("dashboard"); setIsMoreMenuOpen(false); }}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-amber-50/30 transition text-left cursor-pointer"
                  >
                    <span className="text-xl">📊</span>
                    <div>
                      <p className="text-xs font-bold text-slate-850">Advanced Dashboard</p>
                      <p className="text-[10px] text-slate-400">Centralized metrics</p>
                    </div>
                  </button>

                  {/* Language switch */}
                  <button 
                    onClick={() => { setLang(lang === "en" ? "bn" : "en"); setIsMoreMenuOpen(false); }}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-150 bg-amber-50/50 hover:bg-amber-100/30 transition text-left cursor-pointer col-span-2 justify-center"
                  >
                    <span className="text-sm font-black text-[#f59e0b]">Translate / {lang === 'en' ? 'বাংলা রূপান্তর' : 'English View'}</span>
                  </button>
                  
                  {/* Logout admin */}
                  <button 
                    onClick={() => { setCurrentUser(null); setActiveTab("home"); setIsMoreMenuOpen(false); }}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-rose-100 hover:bg-rose-50 text-rose-500 font-bold transition text-xs col-span-2 justify-center cursor-pointer"
                  >
                    Exit Application / লগ-আউট করুন
                  </button>

                </div>
              </div>
            )}

            {/* PERSISTENT BEAUTIFUL BOTTOM NAVIGATION (Screenshot 1 / 2) */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 py-3.5 px-4 flex justify-around items-center shadow-[0_-5px_15px_rgba(0,0,0,0.04)] select-none">
              
              {/* TAB 1: HOME */}
              <button 
                onClick={() => {
                  setActiveTab("home");
                  setIsMoreMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center gap-1 shrink-0 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${activeTab === "home" ? "text-amber-500" : "text-slate-400"}`} fill={activeTab === "home" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activeTab === "home" ? 2.5 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className={`text-[10px] font-sans font-extrabold ${activeTab === "home" ? "text-amber-500" : "text-slate-400"}`}>Home</span>
              </button>

              {/* TAB 2: BATCHES */}
              <button 
                onClick={() => {
                  setActiveTab("livestock");
                  setIsMoreMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center gap-1 shrink-0 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${activeTab === "livestock" ? "text-amber-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className={`text-[10px] font-sans font-extrabold ${activeTab === "livestock" ? "text-amber-500" : "text-slate-400"}`}>Batches</span>
              </button>

              {/* TAB 3: FINANCES */}
              <button 
                onClick={() => {
                  setActiveTab("investors");
                  setIsMoreMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center gap-1 shrink-0 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${activeTab === "investors" ? "text-amber-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-[10px] font-sans font-extrabold ${activeTab === "investors" ? "text-amber-500" : "text-slate-400"}`}>Finances</span>
              </button>

              {/* TAB 4: RECORDS */}
              <button 
                onClick={() => {
                  setActiveTab("retail");
                  setIsMoreMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center gap-1 shrink-0 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${activeTab === "retail" ? "text-amber-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className={`text-[10px] font-sans font-extrabold ${activeTab === "retail" ? "text-amber-500" : "text-slate-400"}`}>Records</span>
              </button>

              {/* TAB 5: COMMUNITY */}
              <button 
                onClick={() => {
                  setIsCommunityModalOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center gap-1 shrink-0 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-[10px] font-sans font-extrabold text-slate-400">Community</span>
              </button>

              {/* TAB 6: MORE... */}
              <button 
                onClick={() => {
                  setIsMoreMenuOpen(!isMoreMenuOpen);
                }}
                className="flex flex-col items-center justify-center gap-1 shrink-0 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isMoreMenuOpen ? "text-[#fbbf24]" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className={`text-[10px] font-sans font-extrabold ${isMoreMenuOpen ? "text-[#fbbf24]" : "text-slate-400"}`}>More...</span>
              </button>

            </div>

          </div>
        )}

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "dashboard" && (
          currentUser?.role === "Livestock Management" ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Specialized Cattle Herd Dashboard Header */}
              <div className="bg-gradient-to-r from-teal-900/30 via-slate-900 to-slate-950 p-6 rounded-3xl border border-teal-505/20 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase font-extrabold bg-teal-500/10 px-2 py-1 rounded border border-teal-500/20">Livestock Dept Control Panel</span>
                    <h2 className="text-xl font-black text-white mt-1">Cattle Herd Management & Pen Operations</h2>
                    <p className="text-xs text-slate-400 mt-0.5 font-sans">Real-time stats for grazing, feeding schedules, medical metrics, and on-site cattle audits.</p>
                  </div>
                  <button
                    onClick={() => checkPermissionAndRun("add-animal", () => setShowAddAnimalModal(true))}
                    className="bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer self-stretch md:self-auto font-sans"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Register New Cattle (AI Scanning Enabled)</span>
                  </button>
                </div>
              </div>

              {/* Core Cattle Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Total Active Herd", value: animals.filter(a => a.status !== "Processed").length.toString(), desc: "Cattle in pen state", icon: Award, color: "text-teal-400" },
                  { title: "Average Herd Weight", value: `${Math.round(animals.filter(a => a.status !== "Processed").reduce((acc, a) => acc + (a.weightKg || 150), 0) / Math.max(1, animals.filter(a => a.status !== "Processed").length))} kg`, desc: "Live mass average", icon: Layers, color: "text-blue-400" },
                  { title: "Excellent Welfare", value: animals.filter(a => a.status !== "Processed" && (a.healthCondition?.includes("10/") || a.healthCondition?.includes("9/") || a.healthCondition?.includes("8/"))).length.toString(), desc: "Optimal health rate", icon: Activity, color: "text-emerald-400" },
                  { title: "Outstanding Supplier Dues", value: `₹${animals.reduce((acc, a) => acc + (a.due || 0), 0).toLocaleString()}`, desc: "Bazar and trader dues", icon: DollarSign, color: "text-amber-400" }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono text-slate-400 font-black">{stat.title}</span>
                        <div className={`p-1.5 bg-slate-900 border border-slate-800 rounded-lg ${stat.color}`}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-2xl font-black font-mono text-white leading-none">{stat.value}</h3>
                        <p className="text-[9px] text-slate-500 font-mono mt-1">&bull; {stat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Livestock Management Specific Content: Active Pen Map & Urgent Medical Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Pen Roster */}
                <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers3 className="h-4.5 w-4.5 text-teal-400" />
                      Active Herd Roster / মূল রেজিস্ট্রি
                    </h3>
                    <button onClick={() => setActiveTab("livestock")} className="text-teal-400 hover:text-teal-300 text-xs font-bold font-mono">
                      View Advanced Herd Directory &rarr;
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {animals.filter(a => a.status !== "Processed").map(animal => (
                      <div 
                        key={animal.id} 
                        onClick={() => setViewingAnimalDetail(animal)}
                        className="bg-slate-900 border border-slate-850 hover:border-teal-500/30 p-3 rounded-xl flex items-center justify-between gap-4 transition-all duration-150 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                            {animal.frontImage ? (
                              <img src={animal.frontImage} alt="Cattle front" className="h-full w-full object-cover" />
                            ) : (
                              <Award className="h-5 w-5 text-teal-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white font-mono">{animal.id}</span>
                              <span className="px-1.5 py-0.5 bg-slate-950 text-teal-400 border border-teal-500/20 rounded font-mono text-[9px] font-bold">{animal.type}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">Breed: <strong>{animal.breed}</strong> | Weight: <strong>{animal.weightKg} kg</strong></p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            animal.healthCondition?.includes("Sick") || animal.healthCondition?.includes("Critical")
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {animal.healthCondition || "Healthy"}
                          </span>
                          <p className="text-[9px] text-slate-400 font-mono mt-1">Age: {animal.ageMonths || 24} mo</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Herd Nutrition & Feeding Shifts Summary */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="border-b border-slate-900 pb-3">
                    <h4 className="text-xs uppercase tracking-wider font-extrabold text-teal-400 flex items-center gap-1.5">
                      <Activity className="h-4 w-4 animate-pulse text-teal-400" />
                      Welfare Feeding & Medicine Schedules
                    </h4>
                  </div>
                  <div className="space-y-3.5 text-xs text-slate-300">
                    <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-1">
                      <span className="font-bold text-white block text-[11px] uppercase text-teal-300">08:00 AM - Green Graze Shift</span>
                      <p className="text-[10px] text-slate-400">Primary distribution of organic dry straw and mineral-infused green grass mix (4kg per adult cattle).</p>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-1">
                      <span className="font-bold text-white block text-[11px] uppercase text-amber-500">12:30 PM - Veterinary Health Audit</span>
                      <p className="text-[10px] text-slate-400">Regular on-pen temperature testing and anthelmintic medication checkups for pregnant heifers.</p>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-1">
                      <span className="font-bold text-white block text-[11px] uppercase text-teal-300">17:00 PM - Concentrates Shift</span>
                      <p className="text-[10px] text-slate-400">Washed wheat bran, mustard oil cakes, and pulse husk concentrates distribution for optimal milk/meat content ratio.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6 animate-fadeIn">
              
              {/* Top Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {[
                  { title: activeTrans.todaysSales, value: `₹${totalSalesVal.toLocaleString()}`, change: "+14.2% today", icon: TrendingUp, glow: "shadow-emerald-500/5 hover:border-emerald-500/30", color: "text-emerald-400" },
                  { title: activeTrans.pendingDues, value: `₹${totalPendingDues.toLocaleString()}`, change: "Owed to suppliers", icon: DollarSign, glow: "shadow-amber-500/5 hover:border-amber-500/30", color: "text-amber-400" },
                  { title: activeTrans.activeCount, value: activeAnimalsCount.toString(), change: "Animals in pen", icon: Award, glow: "shadow-teal-500/5 hover:border-teal-500/30", color: "text-teal-400" },
                  { title: activeTrans.lowStockAlerts, value: lowStockCount.toString(), change: "Display shortages", icon: AlertTriangle, glow: "shadow-rose-500/5 hover:border-rose-500/30", color: "text-rose-450" }
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className={`bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/40 p-4 md:p-5 rounded-2xl border border-slate-800/85 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.glow}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-mono font-bold">{card.title}</p>
                        <div className={`p-1.5 md:p-2 rounded-lg bg-slate-900 border border-slate-800/80 ${card.color}`}>
                          <Icon className="h-4 w-4 md:h-4.5 md:w-4.5 shrink-0" />
                        </div>
                      </div>
                      <div className="mt-3 md:mt-5 flex flex-col md:flex-row md:items-baseline justify-between gap-1.5">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-black font-mono text-white leading-none tracking-tight">{card.value}</h2>
                        <span className="text-[8px] md:text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 border border-slate-850 rounded font-mono self-start md:self-auto">{card.change}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
  
              {/* Quick Command Control Panel */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-950 to-slate-900/30 border border-slate-800/85 p-5 rounded-2xl md:rounded-3xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-lg shadow-black/15">
                <div>
                  <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2 font-sans">
                    <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_#2dd4bf]" />
                    Quick POS Actions
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                    Speed up market operations for purchase logging and counter sales.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                  <button
                    id="action-btn-add-animal"
                    onClick={() => checkPermissionAndRun("add-animal", () => setShowAddAnimalModal(true))}
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black px-4.5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer flex-1 md:flex-none font-sans shadow-md shadow-teal-500/10 hover:shadow-teal-500/20"
                  >
                    <PlusCircle className="h-4 w-4" />
                    {activeTrans.addAnimalBtn}
                  </button>
                  <button
                    id="action-btn-billing"
                    onClick={() => checkPermissionAndRun("retail-checkout", () => setShowBillingModal(true))}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-800 hover:border-slate-700 px-4.5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer flex-1 md:flex-none font-sans"
                  >
                    <ShoppingCart className="h-4 w-4 text-teal-450" />
                    {activeTrans.checkout}
                  </button>
                </div>
              </div>
  
              {/* Two Column Layout: Local Live Displays and Live Mithun Strategy */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Smart Alerts column (2 cols span) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Dashboard Secondary Info: Live stock items display indicator block */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Layers3 className="h-5 w-5 text-teal-400" />
                        {activeTrans.meatDisplays}
                      </h3>
                      <LinkTab tab="retail" text="Sell Cuts &rarr;" />
                    </div>
  
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {Object.entries(meatStock).map(([key, rawQty]) => {
                        const qty = rawQty as number;
                        const percentage = Math.min(100, (qty / 100) * 100);
                        let colorClass = "bg-teal-500";
                        if (qty < 10) colorClass = "bg-rose-500";
                        else if (qty < 20) colorClass = "bg-amber-500";
  
                        return (
                          <div key={key} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
                            <span className="text-xs text-slate-400 font-mono uppercase">{key}</span>
                            <div className="mt-2.5">
                              <span className="text-xl font-bold font-mono text-white">{qty}</span>
                              <span className="text-xs text-slate-400 font-mono font-bold"> kg</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                              <div className={`h-full ${colorClass}`} style={{ width: `${percentage}%` }} />
                            </div>
                            {qty < 10 && (
                              <span className="text-[9px] text-rose-400 bg-rose-500/10 rounded-md font-bold px-1.5 py-0.5 mt-2 text-center">
                                Low Stock
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
  
                </div>
  
                {/* Right secondary column: mini prediction view */}
                <div className="space-y-6">
  
                  {/* Profit Prediction preview block */}
                  <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-teal-500/20 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-teal-500/5 rounded-full blur-2xl" />
                    <span className="text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-md font-bold px-2 py-0.5 uppercase tracking-wide">
                      Live Mithun Strategy
                    </span>
                    
                    <div className="mt-5 space-y-3.5 text-sm">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Specimen Type</span>
                        <span className="font-bold text-white">Mithun (গয়াল)</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Expected Yield</span>
                        <span className="font-bold text-white font-mono">135 kg</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Expected Revenue</span>
                        <span className="font-bold text-white font-mono">₹64,800</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-slate-400">Predicted Profit</span>
                        <span className="font-black text-emerald-400 text-lg font-mono">₹14,200</span>
                      </div>
                    </div>
  
                    <button 
                      onClick={() => setActiveTab("ai-assistant")}
                      className="w-full mt-4 text-center text-xs font-bold text-slate-950 bg-teal-500 hover:bg-teal-400 rounded-xl py-2.5 flex items-center justify-center gap-1.5 transition"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Predict Customize Breed
                    </button>
                  </div>
  
                </div>
              </div>
  
            </div>
          )
        )}

        {/* TAB 2: LIVESTOCK TRADE LOG */}
        {activeTab === "livestock" && (
          isTabAllowed("livestock", currentUser?.role) ? (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800 mb-2">
                <div>
                  <h3 className="text-lg font-black text-white">{activeTrans.livestock}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Log animal purchase contracts, weigh-ins, trace outstanding supplier dues, and process live animals into counter cold displays.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto self-stretch md:self-auto">
                  <button
                    onClick={() => openInvestmentCalculator("Cow")}
                    className="bg-slate-900 text-teal-400 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 text-xs flex items-center gap-2 border border-slate-800 hover:border-slate-700 transition cursor-pointer justify-center"
                  >
                    <Calculator className="h-4 w-4 text-teal-400" />
                    <span>Investment Calculator</span>
                  </button>
                  <button
                    onClick={() => checkPermissionAndRun("add-animal", () => setShowAddAnimalModal(true))}
                    className="bg-teal-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl hover:bg-teal-400 text-xs flex items-center gap-2 transition cursor-pointer justify-center"
                  >
                    <PlusCircle className="h-4 w-4" />
                    {activeTrans.addAnimalBtn}
                  </button>
                </div>
              </div>

              {/* Administrator Supplier Due Reminders Panel */}
              {currentUser?.role === "Administrator" && (
                <SupplierRemindersPanel 
                  animals={animals}
                  reminderConfig={reminderConfig}
                  setReminderConfig={setReminderConfig}
                  reminderLogs={reminderLogs}
                  setReminderLogs={setReminderLogs}
                />
              )}

              {/* Filter Search tools bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-[11px] h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder={activeTrans.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 rounded-xl pl-10 pr-4 py-2 text-sm border border-slate-800 text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
                
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 uppercase shrink-0">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-950 text-slate-300 font-sans text-xs font-bold py-2.5 px-3 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="All">All Statuses / সকল অবস্থা</option>
                    <option value="Pending">Pending / বকেয়া</option>
                    <option value="Paid">Paid / পরিশোধিত</option>
                    <option value="Overdue">Overdue / মেয়াদোত্তীর্ণ</option>
                    <option value="Processed">Processed / প্রসেসড</option>
                  </select>
                </div>

                {/* Owner Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 uppercase shrink-0">Owner:</span>
                  <select
                    value={ownerFilter}
                    onChange={(e) => setOwnerFilter(e.target.value)}
                    className="bg-slate-950 text-slate-300 font-sans text-xs font-bold py-2.5 px-3 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 cursor-pointer min-w-[130px]"
                  >
                    <option value="All">All Owners / সকল মালিক</option>
                    {uniqueOwners.map(owner => (
                      <option key={owner} value={owner}>{owner}</option>
                    ))}
                  </select>
                </div>

                {/* Supplier Due Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 uppercase shrink-0">Supplier Due:</span>
                  <select
                    value={supplierDueFilter}
                    onChange={(e) => setSupplierDueFilter(e.target.value)}
                    className="bg-slate-950 text-slate-300 font-sans text-xs font-bold py-2.5 px-3 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="All">All Dues / সকল বকেয়া</option>
                    <option value="Overdue">🔴 Overdue / বিগত মেয়াদ</option>
                    <option value="Upcoming7">📅 Upcoming (7 Days)</option>
                    <option value="Upcoming30">📅 Upcoming (30 Days)</option>
                    <option value="SortChronological">⏳ Sort Chronologically / ক্রমানুসারে সাজান</option>
                  </select>
                </div>

                {/* Export CSV Button */}
                <button
                  type="button"
                  onClick={handleExportLivestockCSV}
                  className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer self-stretch md:self-auto min-w-[110px]"
                >
                  <Download className="h-4 w-4 text-teal-400" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Batch Slicing & Bulk Actions panel */}
              {selectedAnimalIds.length > 0 && (
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-4 animate-fadeIn mb-4">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-500 text-slate-950 p-2.5 rounded-2xl shrink-0 shadow-lg">
                        <Layers className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase font-mono tracking-wider flex items-center gap-2">
                          <span>Batch Operations & Slicing Panel</span>
                          <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            {selectedAnimalIds.length} Animals Selected
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium whitespace-normal">
                          Perform a bulk attribute update (Health / Owner) or process the selected animals into counter cold stock simultaneously.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5 w-full lg:w-auto self-stretch lg:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setBatchYieldRatio(0.52);
                          setShowBatchProcessModal(true);
                        }}
                        className="flex-1 lg:flex-none px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-lg select-none cursor-pointer text-center"
                      >
                        <ChefHat className="h-4 w-4" />
                        Process Selected Batch
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAnimalIds([]);
                        }}
                        className="flex-1 lg:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-xl text-xs transition active:scale-95 select-none cursor-pointer text-center"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  {/* Bulk Edit Attribute Updates Grid */}
                  <div className="border-t border-slate-800/80 pt-4 mt-1">
                    <div className="bg-slate-950/80 p-4 border border-slate-850 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-950 text-xs font-mono font-bold tracking-wide uppercase text-teal-400">
                        <Edit className="h-4 w-4" />
                        <span>Bulk Update Attributes (Health / Owner)</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* Column 1: Bulk Health Condition */}
                        <div className="space-y-2">
                          <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block font-bold">
                            1. Bulk Update Health Condition
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              value={bulkHealthCondition}
                              onChange={(e) => {
                                setBulkHealthCondition(e.target.value);
                                if (e.target.value) setBulkHealthConditionCustom("");
                              }}
                              className="flex-1 bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500 cursor-pointer font-sans min-h-[36px]"
                              style={{ padding: '8px 12px' }}
                            >
                              <option value="">-- Select Preset Condition --</option>
                              <option value="9/10 (Excellent health condition)">Excellent Welfare (9/10)</option>
                              <option value="8/10 (Good health condition)">Good Health (8/10)</option>
                              <option value="6/10 (Ok health condition)">Satisfactory (6/10)</option>
                              <option value="Under Veterinary Care">Veterinary Watch (Sick)</option>
                              <option value="Quarantined">Under Quarantine (Restricted)</option>
                            </select>
                            
                            <div className="relative flex-1">
                              <input
                                type="text"
                                placeholder="Or enter custom health state..."
                                value={bulkHealthConditionCustom}
                                onChange={(e) => {
                                  setBulkHealthConditionCustom(e.target.value);
                                  if (e.target.value) setBulkHealthCondition("");
                                }}
                                className="w-full bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500 font-sans min-h-[36px]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Bulk Owner Update */}
                        <div className="space-y-2">
                          <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block font-bold">
                            2. Bulk Update Sourcing Owner / Supplier
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              value={bulkOwner}
                              onChange={(e) => {
                                setBulkOwner(e.target.value);
                                if (e.target.value) setBulkOwnerCustom("");
                              }}
                              className="flex-1 bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500 cursor-pointer font-sans min-h-[36px]"
                              style={{ padding: '8px 12px' }}
                            >
                              <option value="">-- Select Existing Owner --</option>
                              {uniqueOwners.map(owner => (
                                <option key={owner} value={owner}>{owner}</option>
                              ))}
                            </select>
                            
                            <div className="relative flex-1">
                              <input
                                type="text"
                                placeholder="Or enter new owner name..."
                                value={bulkOwnerCustom}
                                onChange={(e) => {
                                  setBulkOwnerCustom(e.target.value);
                                  if (e.target.value) setBulkOwner("");
                                }}
                                className="w-full bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500 font-sans min-h-[36px]"
                              />
                            </div>
                          </div>
                        </div>
                        
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2.5 border-t border-slate-900">
                        <span className="text-[10px] text-slate-500 font-mono">
                          ℹ️ All selected active animals will be set with the entered health state or supplier name. Unfilled attributes are skipped.
                        </span>
                        
                        <button
                          type="button"
                          onClick={handleBulkUpdate}
                          className="w-full sm:w-auto px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 shadow-lg select-none cursor-pointer uppercase"
                        >
                          ⚡ Apply Bulk Changes
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            {/* Data Grid Table layout */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase bg-slate-900/40">
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          className="rounded bg-slate-950 border-slate-800 text-teal-500 focus:ring-teal-500 h-4 w-4 cursor-pointer"
                          checked={filteredAnimals.length > 0 && filteredAnimals.filter(a => a.status !== "Processed").every(a => selectedAnimalIds.includes(a.id))}
                          onChange={(e) => {
                            const unprocessed = filteredAnimals.filter(a => a.status !== "Processed");
                            if (e.target.checked) {
                              const newIds = Array.from(new Set([...selectedAnimalIds, ...unprocessed.map(a => a.id)]));
                              setSelectedAnimalIds(newIds);
                            } else {
                              setSelectedAnimalIds(selectedAnimalIds.filter(id => !unprocessed.some(a => a.id === id)));
                            }
                          }}
                        />
                      </th>
                      <th className="p-4">{activeTrans.id}</th>
                      <th className="p-4">{activeTrans.type}</th>
                      <th className="p-4">{activeTrans.breed}</th>
                      <th className="p-4">{activeTrans.weight}</th>
                      <th className="p-4">{activeTrans.owner}</th>
                      <th className="p-4">{activeTrans.cost}</th>
                      <th className="p-4">{activeTrans.due}</th>
                      <th className="p-4">{activeTrans.status}</th>
                      <th className="p-4 text-right">{activeTrans.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredAnimals.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-slate-500 text-sm font-mono">
                          {activeTrans.noRecords}
                        </td>
                      </tr>
                    ) : (
                      filteredAnimals.map((animal) => {
                        let statusColor = "bg-sky-500/10 text-sky-400 border border-sky-500/20";
                        let statusLabel = activeTrans.active;

                        if (animal.status === "Paid") {
                          statusColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                          statusLabel = activeTrans.paid;
                        } else if (animal.status === "Overdue") {
                          statusColor = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                          statusLabel = activeTrans.overdue;
                        } else if (animal.status === "Pending") {
                          statusColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                          statusLabel = activeTrans.pending;
                        } else if (animal.status === "Processed") {
                          statusColor = "bg-slate-800 text-slate-400 border border-slate-700";
                          statusLabel = activeTrans.processed;
                        }

                        return (
                          <tr key={animal.id} className="hover:bg-slate-900/50 transition font-sans">
                            <td className="p-4 w-10">
                              {animal.status !== "Processed" ? (
                                <input
                                  type="checkbox"
                                  className="rounded bg-slate-950 border-slate-800 text-teal-500 focus:ring-teal-500 h-4 w-4 cursor-pointer"
                                  checked={selectedAnimalIds.includes(animal.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedAnimalIds([...selectedAnimalIds, animal.id]);
                                    } else {
                                      setSelectedAnimalIds(selectedAnimalIds.filter(id => id !== animal.id));
                                    }
                                  }}
                                />
                              ) : (
                                <input
                                  type="checkbox"
                                  disabled
                                  className="rounded bg-slate-900 border-slate-950 h-4 w-4 cursor-not-allowed opacity-15"
                                />
                              )}
                            </td>
                            <td className="p-4">
                              <button
                                type="button"
                                onClick={() => setViewingAnimalDetail(animal)}
                                className="flex items-center gap-2 text-left hover:text-teal-400 group transition cursor-pointer"
                              >
                                {animal.frontImage ? (
                                  <img 
                                    src={animal.frontImage} 
                                    alt="Front" 
                                    className="w-10 h-10 object-cover rounded-lg border border-slate-800 group-hover:border-teal-500/50 transition shrink-0" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-teal-500/30 transition">
                                    <Camera className="h-4 w-4 text-slate-600" />
                                  </div>
                                )}
                                <div className="font-mono font-bold text-white group-hover:text-teal-400 transition text-xs">
                                  {animal.id}
                                  {animal.isFromBazar && (
                                    <span className="ml-1 text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 py-0.5 rounded uppercase font-sans tracking-wide">Bazar</span>
                                  )}
                                </div>
                              </button>
                            </td>
                            <td className="p-4 text-sm font-bold text-teal-400">
                              <button
                                type="button"
                                onClick={() => setViewingAnimalDetail(animal)}
                                className="hover:underline hover:text-teal-300 font-bold text-left transition cursor-pointer"
                              >
                                {animal.type}
                              </button>
                            </td>
                            <td className="p-4">
                              <div className="text-xs font-mono text-slate-300">{animal.breed}</div>
                              <div className="text-[10px] text-slate-400 font-sans mt-1">
                                Age: {(() => {
                                  const { years, months } = calculatePreciseAge(animal.birthDate, animal.ageMonths);
                                  return `${years > 0 ? `${years} yr ` : ""}${months} mo`;
                                })()}
                                <span className="text-slate-500 ml-1">({animal.birthDate || "N/A"})</span>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-sm text-white">{animal.weightKg} kg</td>
                            <td className="p-4 text-sm font-semibold">{animal.owner}</td>
                            <td className="p-4 font-mono text-xs">
                              <span className="text-white font-bold block text-sm">₹{animal.purchasePrice.toLocaleString()}</span>
                              {(() => {
                                const fCost = animal.feedCost || 0;
                                const mCost = (animal.medicineCost || 0) + (animal.healthHistory || []).reduce((sum, h) => sum + (h.cost || 0), 0);
                                const mtCost = animal.maintenanceCost || 0;
                                const hCost = animal.handlingCost || 0;
                                const welfareTotal = fCost + mCost + mtCost + hCost;
                                if (welfareTotal > 0) {
                                  return (
                                    <span className="text-[10px] text-emerald-400 block mt-1 hover:text-emerald-300 transition cursor-help font-sans" title={`Feed: ₹${fCost}, Med: ₹${mCost}, Maint: ₹${mtCost}, Handling: ₹${hCost}`}>
                                      Welfare: +₹{welfareTotal.toLocaleString()}
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                            </td>
                            <td className="p-4">
                              <div className="font-mono text-sm text-amber-400">
                                {animal.due > 0 ? `₹${animal.due.toLocaleString()}` : "—"}
                              </div>
                              {animal.due > 0 && (
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  Due: {(() => {
                                    if (animal.dueDate) return animal.dueDate;
                                    try {
                                      const d = new Date(animal.dateAdded);
                                      d.setDate(d.getDate() + 10);
                                      return d.toISOString().split("T")[0];
                                    } catch {
                                      return "2026-05-30";
                                    }
                                  })()}
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                                  {statusLabel}
                                </span>
                                {animal.isCached && (
                                  <span className="px-1.5 py-0.5 bg-amber-500/15 border border-amber-500/25 text-amber-405 text-amber-400 rounded text-[9px] font-mono tracking-wider uppercase animate-pulse" title="Added offline. Enqueued for next Synchronization.">
                                    Cached
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">

                                {/* View details button */}
                                <button
                                  type="button"
                                  onClick={() => setViewingAnimalDetail(animal)}
                                  className="px-2 py-1 text-[10px] bg-slate-950 hover:bg-slate-900 text-teal-400 border border-teal-500/25 hover:border-teal-500/55 rounded-md transition flex items-center gap-1 font-bold cursor-pointer font-sans"
                                  title="View animal multi-angle photos, bazar receipt details, and key stats"
                                >
                                  <Camera className="h-3 w-3 text-teal-400" />
                                  <span>Photos & Receipt</span>
                                </button>

                                {/* Edit animal details button */}
                                {animal.status !== "Processed" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingAnimal(animal);
                                      setShowEditAnimalModal(true);
                                    }}
                                    className="px-2 py-1 text-[10px] bg-slate-950 hover:bg-slate-900 text-amber-400 border border-amber-500/25 hover:border-amber-500/55 rounded-md transition flex items-center gap-1 font-bold cursor-pointer font-sans"
                                    title="Edit animal breed, weight, cost, owner, due date or notes"
                                  >
                                    <Edit className="h-3 w-3 text-amber-400" />
                                    <span>Edit</span>
                                  </button>
                                )}

                                {/* Animal veterinary health log button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveHealthAnimal(animal);
                                    setHealthEvent("");
                                    setHealthTreatment("");
                                    setHealthVetName("");
                                    setHealthCost("");
                                    setHealthNotes("");
                                    setHealthDate(new Date().toISOString().split("T")[0]);
                                    setHealthConditionUpdate(animal.healthCondition || "Good");
                                    setShowHealthModal(true);
                                  }}
                                  className="px-2 py-1 text-[10px] bg-slate-950 hover:bg-slate-900 text-emerald-400 border border-emerald-500/25 hover:border-emerald-500/55 rounded-md transition flex items-center gap-1 font-bold cursor-pointer font-sans"
                                  title="View health history, treatments, veterinary visits, or record a new medical log entry"
                                >
                                  <Activity className="h-3 w-3 text-emerald-400" />
                                  <span>Health ({animal.healthHistory?.length || 0})</span>
                                </button>

                                {/* Live Gemini Profit Forecast button */}
                                <button
                                  type="button"
                                  onClick={() => handleForecastAnimal(animal)}
                                  className="px-2 py-1 text-[10px] bg-slate-950 hover:bg-slate-900 text-teal-400 border border-teal-500/25 hover:border-teal-500/55 rounded-md transition flex items-center gap-1 font-bold cursor-pointer font-sans"
                                  title="Calculate live Yield estimates, potential earnings, and optimal feed schedules with Gemini"
                                >
                                  <Sparkles className="h-3 w-3 animate-pulse text-teal-400" />
                                  <span>Forecast</span>
                                </button>

                                {animal.due > 0 && animal.status !== "Processed" && (
                                  <button
                                    onClick={() => checkPermissionAndRun("settle-due", () => handleSettleDue(animal.id))}
                                    className="px-2.5 py-1 text-[10px] bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-md transition"
                                    title="Mark animal due as settled / paid off"
                                  >
                                    Pay ₹{animal.due}
                                  </button>
                                )}

                                {animal.status !== "Processed" ? (
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => checkPermissionAndRun("process-animal", () => {
                                        const fCost = animal.feedCost || 0;
                                        const mCost = (animal.medicineCost || 0) + (animal.healthHistory || []).reduce((sum, h) => sum + (h.cost || 0), 0);
                                        const mtCost = animal.maintenanceCost || 0;
                                        const hCost = animal.handlingCost || 0;
                                        const totalBase = animal.purchasePrice + fCost + mCost + mtCost + hCost;
                                        
                                        setNegotiationActiveAnimal(animal);
                                        setNegotiatedInternalPrice(String(totalBase + 5500));
                                      })}
                                      className="px-2.5 py-1 text-[10px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-md transition duration-150"
                                      title="Negotiate internal transfer price and transfer this cattle to the slaughter house department"
                                    >
                                      Slaughter Transfer
                                    </button>
                                    <button
                                      onClick={() => checkPermissionAndRun("process-animal", () => {
                                        setProcessTarget(animal);
                                        setShowProcessModal(true);
                                      })}
                                      className="px-2.5 py-1 text-[10px] bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-md transition"
                                      title="Slice animal directly into cold meat inventory stock"
                                    >
                                      {activeTrans.processAnimalBtn}
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-right leading-snug shrink-0">
                                    {animal.slaughterNegotiatedPrice ? (
                                      <div>
                                        <span className="text-[10px] font-bold text-slate-400 font-mono block">Negotiated: ₹{animal.slaughterNegotiatedPrice.toLocaleString()}</span>
                                        <span className={`text-[10.5px] font-black font-mono block ${animal.slaughterProfitOrLoss && animal.slaughterProfitOrLoss >= 0 ? "text-emerald-400" : "text-rose-450 text-rose-400"}`}>
                                          Farm P&L: {animal.slaughterProfitOrLoss && animal.slaughterProfitOrLoss >= 0 ? "+" : ""}₹{animal.slaughterProfitOrLoss ? animal.slaughterProfitOrLoss.toLocaleString() : "0"}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-slate-500 font-mono italic block">Direct Sliced & Sourced</span>
                                    )}
                                  </div>
                                )}

                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Batch Processing History & Logs */}
            {batchLogs.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-teal-400" />
                      Batch Processing History & Logs ({batchLogs.length})
                    </h4>
                    <p className="text-[11px] text-slate-400">Historic record of livestock processed in bulk loads, including yields and added stocks.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to clear historic batch logs?")) {
                        setBatchLogs([]);
                      }
                    }}
                    className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline font-mono cursor-pointer"
                  >
                    Clear Log History
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {batchLogs.map((log) => (
                    <div key={log.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-3 relative hover:border-slate-800 transition font-mono">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-white font-bold">{log.id}</span>
                          <span className="text-[10px] text-slate-550 text-slate-500 font-mono ml-2">{log.date}</span>
                        </div>
                        <span className="text-[10px] text-teal-400 font-semibold font-mono bg-teal-500/5 px-2 py-0.5 rounded border border-teal-500/10">
                          Yield: {Math.round(log.yieldRatio * 100)}%
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block">Animals Processed</span>
                          <span className="text-white font-bold">{log.animalCount} heads ({log.animalIds.join(", ")})</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block">Total Weight</span>
                          <span className="text-white font-bold font-mono">{log.totalWeightKg} kg</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-900/60 rounded-xl space-y-1 text-[10px] border border-slate-905">
                        <span className="text-[9px] text-teal-400 uppercase font-black tracking-wide block mb-1">Carcass Yield Allocated:</span>
                        <div className="grid grid-cols-3 gap-1.5 text-center">
                          <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                            <span className="text-[8px] text-slate-500 block">BEEF</span>
                            <span className="text-white font-bold">{log.addedStock.beef} kg</span>
                          </div>
                          <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                            <span className="text-[8px] text-slate-500 block">MUTTON</span>
                            <span className="text-white font-bold">{log.addedStock.mutton} kg</span>
                          </div>
                          <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                            <span className="text-[8px] text-slate-500 block">BUFFALO</span>
                            <span className="text-white font-bold">{log.addedStock.buffalo} kg</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-center mt-1.5 border-t border-slate-900/40 pt-1.5">
                          <div className="bg-slate-950 p-1 rounded border border-slate-900">
                            <span className="text-[8px] text-slate-500">BONES: </span>
                            <span className="text-slate-350 font-bold">{log.addedStock.bones} kg</span>
                          </div>
                          <div className="bg-slate-950 p-1 rounded border border-slate-900">
                            <span className="text-[8px] text-slate-500">ORGANS: </span>
                            <span className="text-slate-350 font-bold">{log.addedStock.organs} kg</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-[9px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-slate-900/40">
                        <span>Operator: {log.operator}</span>
                        <span className="text-[8px] bg-slate-900 p-0.5 px-1.5 rounded border border-slate-800 uppercase tracking-widest text-emerald-450 text-emerald-400 font-bold">SUCCESSFUL</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
          ) : renderAccessRestricted("Livestock Inventory & process counter", ["Administrator", "Livestock Management"])
        )}

        {/* TAB 3: RETAIL POINT OF SALES */}
        {activeTab === "retail" && (
          isTabAllowed("retail", currentUser?.role) ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Dual-Mode Toggle Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-950 border border-slate-800 rounded-3xl gap-4">
                <div>
                  <h2 className="text-xl font-mono font-black text-white tracking-tight flex items-center gap-2">
                    <TrendingUp className="h-5.5 w-5.5 text-teal-400" />
                    SHAIEALAM RETAIL DEPOT
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Dual-mode retail sales checkout and money collections tracking terminal.</p>
                </div>
                <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-stretch sm:self-auto gap-1">
                  <button
                    type="button"
                    onClick={() => setRetailSubTab("counter")}
                    className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                      retailSubTab === "counter" 
                        ? "bg-teal-500 text-slate-950 shadow-md font-black" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    POS Terminal
                  </button>
                  <button
                    type="button"
                    onClick={() => setRetailSubTab("collections")}
                    className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                      retailSubTab === "collections" 
                        ? "bg-teal-500 text-slate-950 shadow-md font-black" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Coins className="h-4 w-4" />
                    Collections Center
                    {sales.filter(s => (s.amountDue || 0) > 0).length > 0 && (
                      <span className="px-2 py-0.5 text-[9px] font-mono bg-rose-500 text-white rounded-full font-black animate-pulse">
                        {sales.filter(s => (s.amountDue || 0) > 0).length}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRetailSubTab("customers")}
                    className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                      retailSubTab === "customers" 
                        ? "bg-teal-500 text-slate-950 shadow-md font-black" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                    }`}
                  >
                    <UserCheck className="h-4 w-4" />
                    Customer Tracker
                  </button>
                </div>
              </div>

              {retailSubTab === "counter" ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: POS Terminal Form */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-teal-400" />
                      {activeTrans.checkout}
                    </h3>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg">POS-2026</span>
                  </div>

                  <form onSubmit={handleIssueSale} className="space-y-5">
                    
                    {/* Customer Code search and auto-fill row */}
                    <div className="bg-slate-905 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <label className="block text-xs text-slate-300 font-bold font-mono uppercase tracking-wider">
                            Customer Code / ক্রেতা কোড (1001+)
                          </label>
                          <p className="text-[10px] text-slate-500">
                            Enter code to load returning customer, or leave blank to auto-generate
                          </p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            placeholder="e.g. 1001"
                            value={newSale.customerCode}
                            onChange={(e) => {
                              const code = e.target.value;
                              // Update State
                              setNewSale(prev => {
                                const updated = { ...prev, customerCode: code };
                                // Look up in existing sales
                                const matched = sales.find(s => s.customerCode === code.trim());
                                if (matched) {
                                  updated.customerName = matched.customerName;
                                  updated.customerPhone = matched.customerPhone;
                                }
                                return updated;
                              });
                            }}
                            className="bg-slate-950 border border-slate-850 border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-center tracking-widest text-teal-400 focus:outline-none focus:border-teal-500 w-full sm:w-32 font-bold"
                          />
                        </div>
                      </div>

                      {/* Info alert if customer matches */}
                      {(() => {
                        const codeTrim = newSale.customerCode.trim();
                        if (codeTrim) {
                          const matchedCustomerSales = sales.filter(s => s.customerCode === codeTrim);
                          if (matchedCustomerSales.length > 0) {
                            const sampleSale = matchedCustomerSales[0];
                            const totalAmountPurchased = matchedCustomerSales.reduce((acc, s) => acc + s.totalAmount, 0);
                            const totalDue = matchedCustomerSales.reduce((acc, s) => acc + (s.amountDue || 0), 0);
                            return (
                              <div className="text-[11px] bg-teal-950/20 border border-teal-850/40 border-teal-800/40 p-2.5 rounded-xl flex items-center justify-between text-teal-300 font-sans">
                                <div>
                                  <span className="font-bold">Returning Customer:</span> {sampleSale.customerName} ({sampleSale.customerPhone})
                                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                    History: {matchedCustomerSales.length} visits • Total: ₹{totalAmountPurchased.toLocaleString()} • Outstanding: ₹{totalDue.toLocaleString()}
                                  </div>
                                </div>
                                <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase font-black">
                                  LINKED
                                </span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="text-[11px] bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-amber-400/90 font-mono flex items-center justify-between">
                                <span>No matching customer for code "{codeTrim}". This code will be assigned to this new user.</span>
                                <span className="bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded text-[9px] font-mono font-bold">NEW CODE</span>
                              </div>
                            );
                          }
                        }
                        return null;
                      })()}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 font-mono uppercase mb-2">{activeTrans.customerName}</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Shaheen Alam"
                          value={newSale.customerName}
                          onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-teal-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-mono uppercase mb-2">{activeTrans.customerPhone}</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 017XXXXXXXX"
                          value={newSale.customerPhone}
                          onChange={(e) => setNewSale({ ...newSale, customerPhone: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-teal-500 text-white"
                        />
                      </div>
                    </div>

                    {/* Barcode Scanner Tool */}
                    <div id="barcode-scanner-widget" className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <Barcode className="h-4 w-4 text-teal-400" /> Barcode Integration / বারকোড স্ক্যানার
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setScannerActive(!scannerActive);
                            if(!scannerActive) {
                              setScannerStatusMsg("Camera initializing... Simulated scan lines active.");
                            } else {
                              setScannerStatusMsg(null);
                            }
                          }}
                          className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md transition duration-150 flex items-center gap-1.5 cursor-pointer ${
                            scannerActive 
                              ? "bg-rose-500/15 text-rose-400 border border-rose-500/35 hover:bg-rose-500/25" 
                              : "bg-teal-500/10 text-teal-400 border border-teal-500/35 hover:bg-teal-500/20"
                          }`}
                        >
                          <Camera className="h-3 w-3" />
                          {scannerActive ? "Close Camera Viewfinder" : "Simulate Camera Scanner"}
                        </button>
                      </div>

                      {/* Scanning Camera Viewport */}
                      {scannerActive && (
                        <div className="relative h-28 bg-black rounded-xl overflow-hidden border border-teal-500/30 flex items-center justify-center">
                          {/* Pulsing Grid overlay */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.8),transparent_50%),radial-gradient(ellipse_at_center,transparent_20%,#000_90%)] z-10 opacity-70" />
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,180,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,180,0.06)_1px,transparent_1px)] bg-[size:12px_12px]" />
                          
                          {/* Neon Red Scan Laser Line */}
                          <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_2px_#ff0000] animate-[pulse_1.5s_infinite] top-1/2 -translate-y-1/2 z-20" />
                          
                          {/* Technical crosshairs */}
                          <div className="absolute top-2 left-2 text-teal-500 font-mono text-[9px] tracking-wider uppercase z-20">AGC ON // FPS: 60</div>
                          <div className="absolute top-2 right-2 text-teal-500 font-mono text-[9px] tracking-wider uppercase z-20">TARGET DETECT</div>
                          <div className="absolute bottom-2 left-2 text-slate-500 font-mono text-[9px] uppercase z-20">CAM_01_LIVESTOCK</div>
                          <div className="absolute h-4 w-4 border-t-2 border-l-2 border-teal-400 top-4 left-4 z-20" />
                          <div className="absolute h-4 w-4 border-t-2 border-r-2 border-teal-400 top-4 right-4 z-20" />
                          <div className="absolute h-4 w-4 border-b-2 border-l-2 border-teal-400 bottom-4 left-4 z-20" />
                          <div className="absolute h-4 w-4 border-b-2 border-r-2 border-teal-400 bottom-4 right-4 z-20" />

                          {/* Trigger scans quick tap */}
                          <div className="relative z-30 text-center space-y-1.5 px-4">
                            <p className="text-[10px] font-mono text-teal-400 bg-slate-950/80 px-2 py-0.5 rounded border border-teal-500/20 max-w-xs mx-auto animate-pulse">
                              [VIEWFINDER ACTIVE] Position barcode in center
                            </p>
                            
                            <div className="flex gap-1.5 justify-center flex-wrap max-w-md">
                              <span className="text-[9px] font-mono font-bold text-slate-400 self-center">Quick-scan click:</span>
                              {Object.keys(BARCODE_DATABASE).map(code => (
                                <button
                                  key={code}
                                  type="button"
                                  onClick={() => handleBarcodeScan(code)}
                                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono font-black text-[9px] px-2 py-1 rounded transition select-none cursor-pointer border border-teal-600"
                                >
                                  {code}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Keyboard / USB Scanner Input */}
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono select-none">SCAN IN:</span>
                          <input
                            type="text"
                            placeholder="Type barcode (e.g., BE-501, MU-601) and press [Enter]"
                            value={barcodeInput}
                            onChange={(e) => setBarcodeInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleBarcodeScan(barcodeInput);
                              }
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-20 pr-10 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleBarcodeScan(barcodeInput)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-teal-400 hover:text-white"
                          >
                            <Zap className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Feedback Broadcast message */}
                      {scannerStatusMsg && (
                        <div className="bg-slate-950/80 text-[10px] border border-slate-800 text-teal-400 font-mono p-2.5 rounded-xl animate-fadeIn flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
                            <span>{scannerStatusMsg}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setScannerStatusMsg(null)}
                            className="text-slate-500 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quick Add Section */}
                    <div id="quick-add-meat-cuts" className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="h-4 w-4 animate-bounce" /> Quick-Add Cuts / দ্রুত যুক্ত করুন
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Click to increment cart</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { label: "Beef Solid (1 kg)", icon: "🥩", type: "beef", weightKg: 1, rate: 720 },
                          { label: "Beef Ribeye (2 kg)", icon: "🍖", type: "beef", weightKg: 2, rate: 720 },
                          { label: "Premium Mutton (1 kg)", icon: "🐐", type: "mutton", weightKg: 1, rate: 1100 },
                          { label: "Soup Bones (1 kg)", icon: "🦴", type: "bones", weightKg: 1, rate: 250 },
                          { label: "Fresh Organs (1 kg)", icon: "🥓", type: "organs", weightKg: 1, rate: 350 },
                          { label: "Buffalo Steak (1 kg)", icon: "🐃", type: "buffalo", weightKg: 1, rate: 680 }
                        ].map((cut, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => quickAddMeatCut(cut.type, cut.weightKg, cut.rate)}
                            className="bg-slate-950/80 border border-slate-805 border-slate-800 hover:border-teal-500/40 p-2.5 rounded-xl transition flex flex-col items-center justify-center text-center hover:bg-slate-900 group cursor-pointer"
                          >
                            <span className="text-lg group-hover:scale-110 transition">{cut.icon}</span>
                            <span className="text-[11px] font-bold text-white mt-1 group-hover:text-teal-400 transition">{cut.label}</span>
                            <span className="text-[9px] text-slate-400 font-mono font-bold mt-0.5">₹{cut.rate}/kg</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Multi-item Cuts grid list */}
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-300 font-bold ml-1">Cart Items / বিক্রয় তালিকা</span>
                        <button
                          type="button"
                          onClick={addSaleItemField}
                          className="text-xs text-teal-400 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                        >
                          + Add Item
                        </button>
                      </div>

                      {newSale.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3.5 items-center p-3.5 bg-slate-900 border border-slate-800 rounded-2xl relative">
                          
                          {/* Item Type selection */}
                          <div className="col-span-12 sm:col-span-4">
                            <label className="block text-[10px] text-slate-500 uppercase mb-1">{activeTrans.item}</label>
                            <select
                              value={item.type}
                              onChange={(e) => updateSaleItemField(index, "type", e.target.value)}
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                            >
                              <option value="beef">Beef (গরু)</option>
                              <option value="mutton">Mutton (খাসি/Goat)</option>
                              <option value="buffalo">Buffalo Meat (মহিষ)</option>
                              <option value="bones">Soup Bones (হাড়)</option>
                              <option value="organs">Organs & Fat (কলিজা/চর্বি)</option>
                            </select>
                          </div>

                          {/* Weight input with available quick displays helper */}
                          <div className="col-span-6 sm:col-span-4">
                            <label className="block text-[10px] text-slate-500 uppercase mb-1">
                              {activeTrans.weightKg} (Max: {meatStock[item.type] || 0} kg)
                            </label>
                            <input
                              type="number"
                              required
                              step="0.1"
                              min="0.1"
                              max={meatStock[item.type] || 0}
                              value={item.weightKg}
                              onChange={(e) => updateSaleItemField(index, "weightKg", Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white text-center font-mono"
                            />
                          </div>

                          {/* Rate price per kg */}
                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-[10px] text-slate-500 uppercase mb-1">{activeTrans.ratePerKg} (₹)</label>
                            <input
                              type="number"
                              required
                              min="10"
                              value={item.ratePerKg}
                              onChange={(e) => updateSaleItemField(index, "ratePerKg", Number(e.target.value))}
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white text-center font-mono font-bold"
                            />
                          </div>

                          {/* Delete Item Field */}
                          <div className="col-span-12 sm:col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeSaleItemField(index)}
                              className="text-stone-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/15"
                            >
                              <XCircle className="h-4.5 w-4.5" />
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-slate-800 pt-5">
                      <div className="w-full sm:max-w-xs">
                        <span className="text-xs text-slate-400 block mb-1">{activeTrans.paymentMethod}</span>
                        <div className="flex flex-wrap gap-2">
                          {["Cash", "bKash", "Card", "Due"].map(p => {
                            const icon = p === "Cash" ? <Wallet className="h-3.5 w-3.5 shrink-0" /> :
                                         p === "bKash" ? <Smartphone className="h-3.5 w-3.5 shrink-0" /> :
                                         p === "Card" ? <CreditCard className="h-3.5 w-3.5 shrink-0" /> :
                                         <Clock className="h-3.5 w-3.5 shrink-0" />;
                            return (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setNewSale({ ...newSale, paymentMethod: p as any })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                                  newSale.paymentMethod === p 
                                  ? "bg-teal-500 text-slate-950 font-black font-extrabold" 
                                  : "bg-slate-900 text-slate-400 hover:text-white"
                                }`}
                              >
                                {icon}
                                <span>{p}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Partial Payment Configuration */}
                        <div className="mt-3.5 space-y-1.5">
                          <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                            Amount Paid by Customer (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Leave blank for full standard amount"
                            value={customAmountPaid}
                            onChange={(e) => {
                              const v = e.target.value;
                              setCustomAmountPaid(v === "" ? "" : Number(v));
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        {/* Adjust and configure outstanding dues parameters on active checkout */}
                        {(() => {
                          const total = newSale.items.reduce((sum, item) => sum + (Number(item.weightKg) * Number(item.ratePerKg)), 0);
                          const paid = customAmountPaid === "" ? (newSale.paymentMethod === "Due" ? 0 : total) : Number(customAmountPaid);
                          const due = Math.max(0, total - paid);
                          if (due > 0) {
                            return (
                              <div className="mt-3.5 p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2.5 animate-fadeIn">
                                <span className="text-[9px] text-teal-400 font-bold uppercase tracking-wider block font-mono">
                                  Configure Outstanding Dues
                                </span>
                                
                                <div className="grid grid-cols-2 gap-2.5">
                                  <div className="space-y-1">
                                    <label className="block text-[8px] text-slate-400 uppercase font-mono">Collection Due Date</label>
                                    <input 
                                      type="date"
                                      value={posDueDate}
                                      onChange={(e) => setPosDueDate(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-800 text-[10px] rounded-lg p-2 text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="block text-[8px] text-slate-400 uppercase font-mono">Next Follow-Up</label>
                                    <input 
                                      type="date"
                                      value={posNextCollection}
                                      onChange={(e) => setPosNextCollection(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-800 text-[10px] rounded-lg p-2 text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[8px] text-slate-400 uppercase font-mono">Special Collection Notes</label>
                                  <input 
                                    type="text"
                                    placeholder="e.g. Promised next bank delivery"
                                    value={posCollectionNotes}
                                    onChange={(e) => setPosCollectionNotes(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 text-[10px] rounded-lg p-2 text-slate-205 text-white focus:outline-none focus:border-teal-500"
                                  />
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      <div className="text-right w-full sm:w-auto space-y-1.5">
                        <div className="flex justify-between sm:justify-end gap-3.5 items-center">
                          <span className="text-xs text-slate-400 font-mono">Invoice Total:</span>
                          <span className="text-lg font-black font-mono text-white">
                            ₹{newSale.items.reduce((sum, item) => sum + (Number(item.weightKg) * Number(item.ratePerKg)), 0).toLocaleString()}
                          </span>
                        </div>
                        
                        {(() => {
                          const total = newSale.items.reduce((sum, item) => sum + (Number(item.weightKg) * Number(item.ratePerKg)), 0);
                          const paid = customAmountPaid === "" ? (newSale.paymentMethod === "Due" ? 0 : total) : Number(customAmountPaid);
                          const due = Math.max(0, total - paid);
                          return (
                            <>
                              <div className="flex justify-between sm:justify-end gap-3.5 items-center">
                                <span className="text-xs text-slate-400 font-mono">Amount Paid right now:</span>
                                <span className="text-xs font-bold font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                                  ₹{paid.toLocaleString()}
                                </span>
                              </div>
                              {due > 0 ? (
                                <div className="flex justify-between sm:justify-end gap-3.5 items-center bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                                  <span className="text-[10px] text-amber-400 font-mono font-bold uppercase">Customer Outstanding Due:</span>
                                  <span className="text-xs font-black font-mono text-amber-400">
                                    ₹{due.toLocaleString()}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-green-400 font-mono font-bold uppercase block text-right mt-1">Paid In Full</span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold py-3.5 rounded-xl text-center text-sm shadow-xl flex items-center justify-center gap-2 transition"
                    >
                      <Receipt className="h-5 w-5" />
                      {activeTrans.issueInvoice}
                    </button>

                  </form>
                </div>

              </div>

              {/* Right Column: Fresh stock updates & Recent Receipts list */}
              <div className="space-y-6">
                
                {/* Visual stocks list */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <Layers className="h-4.5 w-4.5 text-teal-400" />
                    Display Stock Availability
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    {Object.entries(meatStock).map(([key, rawVal]) => {
                      const value = rawVal as number;
                      let color = "text-teal-400";
                      if (value < 10) color = "text-rose-400 font-bold";
                      else if (value < 20) color = "text-amber-400";

                      return (
                        <div key={key} className="flex justify-between items-center border-b border-slate-900 pb-2.5">
                          <span className="text-slate-400 uppercase">{key}</span>
                          <span className={`${color}`}>{value} kg available</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                 {/* Recent Receipts Log and Print drawer */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-900 pb-2.5">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Receipt className="h-4.5 w-4.5 text-teal-400" />
                      {activeTrans.recentSales}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          printTransactionHistory(sales);
                        }}
                        className="px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-400 font-mono font-bold text-[10px] rounded-lg border border-teal-500/20 hover:border-transparent transition flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="h-3 w-3" />
                        Print History
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          exportSalesToCsv(sales);
                        }}
                        className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-mono font-bold text-[10px] rounded-lg border border-emerald-500/20 hover:border-transparent transition flex items-center gap-1 cursor-pointer animate-fadeIn"
                        title="Export recent transactions to a CSV file for analytical software"
                      >
                        <Download className="h-3 w-3" />
                        Export CSV
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3.5 max-h-[350px] overflow-y-auto">
                    {sales.map(sale => {
                      const paidAmt = sale.amountPaid !== undefined ? sale.amountPaid : sale.totalAmount;
                      const dueAmt = sale.amountDue !== undefined ? sale.amountDue : 0;
                      return (
                        <div 
                          key={sale.id} 
                          onClick={() => {
                            setSelectedInvoice(sale);
                            setShowInvoiceModal(true);
                            fetchReceiptDocument(sale);
                          }}
                          className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-teal-500/20 hover:bg-slate-850 cursor-pointer transition flex items-center justify-between animate-fadeIn"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-xs font-bold text-white font-mono">{sale.id}</p>
                              {sale.isCached && (
                                <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded text-[8px] font-mono tracking-wider uppercase animate-pulse" title="This sale was processed offline. Enqueued for synchronization.">
                                  Cached
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">{sale.customerName}</p>
                            <p className="text-[9px] text-slate-500 font-mono mt-0.5">{sale.items.length} items • {sale.paymentMethod}</p>
                            
                            {/* Dues breakdown indicators */}
                            <div className="mt-1.5 flex flex-wrap gap-1 items-center font-mono">
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 font-bold">
                                Paid: ₹{paidAmt.toLocaleString()}
                              </span>
                              {dueAmt > 0 ? (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold animate-pulse">
                                  Due: ₹{dueAmt.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">
                                  Settled
                                </span>
                              )}
                              {sale.installments && sale.installments.length > 0 && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">
                                  📑 {sale.installments.length} Split Payments
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right flex flex-col items-end gap-1.5">
                            <p className="text-xs font-bold text-teal-400 font-mono">₹{sale.totalAmount.toLocaleString()}</p>
                            <span className="text-[9px] text-slate-500 font-mono italic block">Invoice Info</span>
                            
                            {/* In-place quick dues payoff */}
                            {dueAmt > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Do not trigger receipt document modal open
                                  if (confirm(`Accept cash payment to settle outstanding due of ₹${dueAmt} from ${sale.customerName}?`)) {
                                    handleSettleCustomerDue(sale.id);
                                    alert(`Successfully collected ₹${dueAmt} from ${sale.customerName}. Dues fully settled!`);
                                  }
                                }}
                                className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[9px] rounded-md transition select-none cursor-pointer"
                              >
                                Settle ₹{dueAmt}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
              ) : retailSubTab === "collections" ? (
                /* NEW COLLECTIONS MANAGER SCREEN */
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Collection Metrics Bento Cards */}
                  {(() => {
                    const todayStr = new Date().toISOString().split("T")[0];
                    const totalOutstanding = sales.reduce((sum, s) => sum + (s.amountDue || 0), 0);
                    const overdueAmt = sales.filter(s => (s.amountDue || 0) > 0 && s.dueDate && s.dueDate < todayStr).reduce((sum, s) => sum + (s.amountDue || 0), 0);
                    const overdueCount = sales.filter(s => (s.amountDue || 0) > 0 && s.dueDate && s.dueDate < todayStr).length;
                    const upcomingCount = sales.filter(s => (s.amountDue || 0) > 0 && s.nextCollectionDate && s.nextCollectionDate >= todayStr).length;
                    const settledCount = sales.filter(s => (s.amountDue || 0) === 0 && (s.installments || []).length > 0).length;

                    return (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Gross Outstanding Dues</span>
                          <div>
                            <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md mt-1.5 inline-block font-mono">
                              Under Collection
                            </span>
                            <p className="text-2xl font-black text-white font-mono mt-2 font-mono">₹{totalOutstanding.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-rose-400">Overdue Collections</span>
                          <div>
                            <span className="text-[9px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md mt-1.5 inline-block font-mono font-mono">
                              {overdueCount} Enforcements Due
                            </span>
                            <p className="text-2xl font-black text-rose-400 font-mono mt-2 font-mono">₹{overdueAmt.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between font-mono">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Upcoming follow-ups</span>
                          <div>
                            <span className="text-[9px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                              {upcomingCount} customers today / week
                            </span>
                            <p className="text-2xl font-black text-white mt-2 font-mono">{upcomingCount}</p>
                          </div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between font-mono">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Split Collections Settled</span>
                          <div>
                            <span className="text-[9px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-md mt-1.5 inline-block uppercase">
                              Settlements Active
                            </span>
                            <p className="text-2xl font-black text-green-400 mt-2">{settledCount}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Filters & Direct Actions Deck */}
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-teal-400" />
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Collections Ledger Filters</h4>
                        </div>
                        <button
                          type="button"
                          onClick={handleExportSalesCSV}
                          className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition select-none cursor-pointer"
                        >
                          <Download className="h-3 w-3 text-teal-400" />
                          <span>Export CSV</span>
                        </button>
                      </div>
                      
                      {/* Search matches inputs */}
                      <div className="relative w-full md:max-w-xs">
                        <input
                          type="text"
                          placeholder="Search customer, ID, phone..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-teal-500 text-white font-mono"
                        />
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-900">
                      
                      {/* Sub-Category-wise filter */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
                          Filter by Bought Category (ক্যাটাগরি ফিল্টার)
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { key: "All", label: "All Categories (সব)" },
                            { key: "beef", label: "Beef (গরু)" },
                            { key: "mutton", label: "Mutton (খাসি)" },
                            { key: "buffalo", label: "Buffalo (মহিষ)" },
                            { key: "bones", label: "Bones (হাড়)" },
                            { key: "organs", label: "Organs (কলিজা)" }
                          ].map(opt => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => setCollectionFilterCategory(opt.key)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition select-none cursor-pointer ${
                                collectionFilterCategory === opt.key 
                                  ? "bg-teal-500 text-slate-950 font-black" 
                                  : "bg-slate-900 text-slate-400 hover:text-white"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Collection Due Status filtering */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
                          Filter by Collection Status (আদায় স্ট্যাটাস ফিল্টার)
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { key: "All", label: "Show All (সব)" },
                            { key: "Overdue", label: "🔴 Overdue (অতিক্রান্ত)" },
                            { key: "Upcoming", label: "🟡 Upcoming (আসন্ন)" },
                            { key: "Settled", label: "🟢 Fully Settled (পরিশোধিত)" }
                          ].map(opt => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => setCollectionFilterStatus(opt.key)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition select-none cursor-pointer ${
                                collectionFilterStatus === opt.key 
                                  ? "bg-teal-500 text-slate-950 font-black" 
                                  : "bg-slate-900 text-slate-400 hover:text-white"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Customer Due Date filtering */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5 font-mono">
                          Filter by Customer Due Date (বকেয়ার তারিখ ফিল্টার)
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { key: "All", label: "Show All (সব)" },
                            { key: "Overdue", label: "🔴 Overdue" },
                            { key: "Within7", label: "📅 Upcoming (7 Days)" },
                            { key: "Within30", label: "📅 Upcoming (30 Days)" }
                          ].map(opt => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => setCollectionDueDateFilter(opt.key)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition select-none cursor-pointer ${
                                collectionDueDateFilter === opt.key 
                                  ? "bg-teal-500 text-slate-950 font-black" 
                                  : "bg-slate-900 text-slate-400 hover:text-white"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Collections List Layout */}
                  <div className="space-y-4">
                    {(() => {
                      const todayStr = new Date().toISOString().split("T")[0];
                      const todayTime = new Date(todayStr + "T00:00:00").getTime();
                      const list = sales.filter(sale => {
                        const matchesSearch = 
                          sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sale.customerPhone.includes(searchQuery);

                        const sVal = sale.amountDue || 0;
                        const matchesStatus = 
                          collectionFilterStatus === "All" ? true :
                          collectionFilterStatus === "Overdue" ? sVal > 0 && sale.dueDate && sale.dueDate < todayStr :
                          collectionFilterStatus === "Upcoming" ? sVal > 0 && ((sale.dueDate && sale.dueDate >= todayStr) || (sale.nextCollectionDate && sale.nextCollectionDate >= todayStr)) :
                          collectionFilterStatus === "Settled" ? sVal === 0 && (sale.installments || []).length > 0 :
                          true;

                        let matchesDueDate = true;
                        if (collectionDueDateFilter !== "All") {
                          if (sVal <= 0 || !sale.dueDate) {
                            matchesDueDate = false;
                          } else {
                            const saleTime = new Date(sale.dueDate + "T00:00:00").getTime();
                            const diffMs = saleTime - todayTime;
                            const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
                            if (collectionDueDateFilter === "Overdue") {
                              matchesDueDate = sale.dueDate < todayStr;
                            } else if (collectionDueDateFilter === "Within7") {
                              matchesDueDate = sale.dueDate >= todayStr && diffDays >= 0 && diffDays <= 7;
                            } else if (collectionDueDateFilter === "Within30") {
                              matchesDueDate = sale.dueDate >= todayStr && diffDays >= 0 && diffDays <= 30;
                            }
                          }
                        }

                        const matchesCategory = 
                          collectionFilterCategory === "All" ? true :
                          sale.items.some(item => item.type === collectionFilterCategory);

                        return matchesSearch && matchesStatus && matchesDueDate && matchesCategory;
                      });

                      if (list.length === 0) {
                        return (
                          <div className="bg-slate-950 border border-slate-800 p-12 rounded-3xl text-center text-slate-500 space-y-2">
                            <Coins className="h-10 w-10 text-slate-700 mx-auto animate-bounce mb-2" />
                            <p className="text-sm font-bold text-white uppercase tracking-wider">No Outstanding Collections Matches</p>
                            <p className="text-xs text-slate-400 font-mono">All retail accounts are currently settled under the selected category filters.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {list.map(sale => {
                            const dueVal = sale.amountDue || 0;
                            const isOverdue = dueVal > 0 && sale.dueDate && sale.dueDate < todayStr;
                            const cutsSummary = sale.items.map(it => `${it.type.toUpperCase()} (${it.weightKg}kg)`).join(" • ");
                            
                            return (
                              <div key={sale.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl relative flex flex-col justify-between hover:border-slate-700 transition">
                                
                                <div>
                                  {/* Ref header and badges */}
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded">
                                        {sale.id}
                                      </span>
                                      <span className="text-[10px] font-mono text-slate-400 ml-1.5">{sale.date}</span>
                                    </div>

                                    {dueVal > 0 ? (
                                      isOverdue ? (
                                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold font-mono tracking-wider uppercase animate-pulse">
                                          🚨 OVERDUE
                                        </span>
                                      ) : (
                                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold font-mono tracking-wider uppercase">
                                          ⚠️ PENDING
                                        </span>
                                      )
                                    ) : (
                                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 font-bold font-mono tracking-wider uppercase">
                                        ✅ FULLY SETTLED
                                      </span>
                                    )}
                                  </div>

                                  {/* Customer Info */}
                                  <div className="mt-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="text-sm font-semibold text-white">{sale.customerName}</h4>
                                        <p className="text-xs text-slate-400 font-mono mt-0.5">{sale.customerPhone}</p>
                                      </div>
                                      {dueVal > 0 && sale.dueDate && (
                                        <div className="text-right">
                                          <span className="text-[8px] text-slate-500 uppercase font-mono block">Final Due Date</span>
                                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isOverdue ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-550/20'}`}>
                                            {sale.dueDate}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-mono mt-2 bg-slate-900/60 p-2 rounded-lg border border-slate-900">
                                      <strong className="text-slate-400">Purchased Cuts:</strong> {cutsSummary}
                                    </p>
                                  </div>

                                  {/* Ledger Dates and Notes */}
                                  <div className="mt-4 space-y-1.5 border-t border-slate-900 pt-3 text-[11px]">
                                    {sale.dueDate && (
                                      <div className="flex justify-between font-mono">
                                        <span className="text-slate-400">Final Collection Due:</span>
                                        <span className={`font-mono font-bold ${isOverdue ? 'text-rose-400' : 'text-slate-200'}`}>
                                          {sale.dueDate}
                                        </span>
                                      </div>
                                    )}
                                    {sale.nextCollectionDate && (
                                      <div className="flex justify-between font-mono">
                                        <span className="text-slate-400">Next Scheduled Follow-up:</span>
                                        <span className="font-mono text-teal-400 font-bold">
                                          {sale.nextCollectionDate}
                                        </span>
                                      </div>
                                    )}
                                    {sale.upcomingCollectionDate && (
                                      <div className="flex justify-between font-mono">
                                        <span className="text-slate-400">Upcoming Collection Date:</span>
                                        <span className="font-mono text-emerald-400 font-bold">
                                          {sale.upcomingCollectionDate}
                                        </span>
                                      </div>
                                    )}
                                    {sale.collectionNotes && (
                                      <div className="mt-2.5 p-2 bg-slate-900 border-l-2 border-teal-500 text-[10px] text-slate-300 italic rounded-r-md">
                                        <span className="text-[8px] uppercase tracking-wider font-bold text-teal-400 block mb-0.5 font-mono">Collection note:</span>
                                        "{sale.collectionNotes}"
                                      </div>
                                    )}
                                    {sale.specialNotes && (
                                      <div className="mt-2 p-2 bg-slate-900 border-l-2 border-rose-500/80 text-[10px] text-slate-300 italic rounded-r-md">
                                        <span className="text-[8px] uppercase tracking-wider font-bold text-rose-400 block mb-0.5 font-mono">Special instructions:</span>
                                        "{sale.specialNotes}"
                                      </div>
                                    )}

                                    {/* Inline split installments sub-list */}
                                    {sale.installments && sale.installments.length > 0 && (
                                      <div className="mt-4 pt-3.5 border-t border-slate-900 space-y-2">
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block font-mono">
                                          Collected Installments Ledger ({sale.installments.length})
                                        </span>
                                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                                          {sale.installments.map((inst) => (
                                            <div key={inst.id} className="flex justify-between items-center bg-slate-900/50 border border-slate-900/80 p-2.5 rounded-xl text-[10px] hover:border-slate-800 transition">
                                              <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                  <span className="text-teal-400 font-bold font-mono">{inst.id}</span>
                                                  <span className="text-slate-500">•</span>
                                                  <span className="text-slate-400 font-mono">{inst.date}</span>
                                                  <span className="text-[8px] px-1 py-0.2 bg-slate-800 rounded font-bold uppercase font-mono text-slate-400">
                                                    {inst.paymentMethod}
                                                  </span>
                                                </div>
                                                <p className="text-[9.5px] text-white font-medium mt-1">
                                                  <span className="text-[8px] uppercase tracking-wider font-bold text-teal-400 mr-1.5">Note:</span>
                                                  "{inst.collectionNotes || inst.notes || 'No notes logged.'}"
                                                </p>
                                                {(inst.upcomingCollectionDate || inst.nextCollectionDate || inst.specialNotes) && (
                                                  <div className="mt-1 pl-1.5 border-l border-teal-500/30 space-y-0.5 text-[8.5px] text-slate-500 font-mono">
                                                    {inst.upcomingCollectionDate && (
                                                      <div>Upcoming: <span className="text-teal-400/90 font-semibold">{inst.upcomingCollectionDate}</span></div>
                                                    )}
                                                    {inst.nextCollectionDate && (
                                                      <div>Next: <span className="text-teal-400/90 font-semibold">{inst.nextCollectionDate}</span></div>
                                                    )}
                                                    {inst.specialNotes && (
                                                      <div className="text-rose-400 italic">Note: "{inst.specialNotes}"</div>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                              <div className="flex items-center gap-2 font-mono ml-2">
                                                <span className="font-extrabold text-teal-400 text-xs text-right whitespace-nowrap">₹{inst.amount.toLocaleString()}</span>
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    printInstallmentReceipt(sale, inst);
                                                  }}
                                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-teal-500/20 rounded-lg transition cursor-pointer select-none"
                                                  title="Print detailed receipt for this installment"
                                                >
                                                  <Printer className="h-3 w-3 text-slate-400 hover:text-teal-400" />
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Financial breakdowns */}
                                <div className="mt-5 border-t border-slate-900 pt-4">
                                  <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                                    <div className="bg-slate-900 p-2 rounded-lg">
                                      <span className="text-[8px] text-slate-500 block uppercase font-mono">Invoice</span>
                                      <span className="text-white font-bold">₹{sale.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="bg-slate-900 p-2 rounded-lg">
                                      <span className="text-[8px] text-teal-500 block uppercase font-mono">Paid</span>
                                      <span className="text-teal-400 font-bold">₹{(sale.amountPaid || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="bg-slate-900 p-2 rounded-lg col-span-1">
                                      <span className="text-[8px] text-amber-500 block uppercase font-mono">Outstanding</span>
                                      <span className={`font-black ${dueVal > 0 ? 'text-amber-500 font-bold' : 'text-slate-500'}`}>
                                        ₹{dueVal.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Direct Action triggers */}
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleCallCustomer(sale.customerPhone)}
                                      className="flex-1 min-w-[80px] px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 border border-slate-800 hover:border-slate-700 transition cursor-pointer select-none"
                                      title="Initiate cellular voice-call to customer phone"
                                    >
                                      <Phone className="h-3 w-3 text-slate-400" />
                                      Call Dial
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleWhatsAppBill(sale)}
                                      className="flex-1 min-w-[80px] px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 border border-emerald-500/20 hover:border-transparent transition cursor-pointer select-none"
                                      title="Launch WhatsApp Web chat with auto formatted Invoice details"
                                    >
                                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                      WhatsApp
                                    </button>

                                    {dueVal > 0 ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setInstallmentAmount(dueVal.toString());
                                          setInstallmentNotes("");
                                          const nextD = new Date();
                                          nextD.setDate(nextD.getDate() + 7);
                                          setInstallmentNextDate(nextD.toISOString().split("T")[0]);
                                          setInstallmentUpcomingDate(nextD.toISOString().split("T")[0]);
                                          setInstallmentSpecialNotes("");
                                          setActiveCollectionSale(sale);
                                          setShowCollectionModal(true);
                                        }}
                                        className="flex-2 min-w-[120px] px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[11px] font-black flex items-center justify-center gap-1 cursor-pointer transition shadow-lg select-none"
                                      >
                                        <Coins className="h-3.5 w-3.5" />
                                        Collect Money
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedInvoice(sale);
                                          setShowInvoiceModal(true);
                                          fetchReceiptDocument(sale);
                                        }}
                                        className="flex-2 min-w-[120px] px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition select-none"
                                      >
                                        <Printer className="h-3 w-3 text-slate-400" />
                                        Print Invoice
                                      </button>
                                    )}
                                  </div>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                </div>
              ) : (
                /* NEW CUSTOMER TRACKER WORKSPACE */
                <div className="space-y-6 animate-fadeIn">
                    
                    {/* Customer Ledger Top Header Cards (Screenshot 1 Format) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* You will give Card (Green theme) */}
                      <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800/80 flex items-center justify-between shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-6 -mt-6 transition group-hover:bg-emerald-500/10"></div>
                        <div className="space-y-1 z-10">
                          <span className="text-[10px] text-emerald-500 uppercase font-mono tracking-widest font-black block">
                            You will give (আপনার দেনা)
                          </span>
                          <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight block">
                            ₹{animals.reduce((sum, a) => sum + (a.due || 0), 0).toLocaleString()}
                          </span>
                          <span className="text-[9px] text-slate-500 block">Outstanding dues to sellers & suppliers</span>
                        </div>
                        <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                          <ArrowRightLeft className="h-5 w-5" />
                        </div>
                      </div>

                      {/* You will get Card (Red theme) */}
                      <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl -mr-6 -mt-6 transition group-hover:bg-rose-500/10"></div>
                        <div className="space-y-1 z-10">
                          <span className="text-[10px] text-rose-500 uppercase font-mono tracking-widest font-black block">
                            You will get (আপনার পাওনা)
                          </span>
                          <span className="text-3xl font-black text-rose-500 font-mono tracking-tight block">
                            ₹{sales.reduce((sum, s) => sum + (s.amountDue || 0), 0).toLocaleString()}
                          </span>
                          <span className="text-[9px] text-slate-500 block">Receivables from retail credit buyers</span>
                        </div>
                        <div className="h-12 w-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 animate-pulse">
                          <Coins className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Report card and Quick Actions (View Reports / Reset Panel) */}
                      <div className="bg-slate-955 p-5 rounded-3xl border border-slate-800/80 flex flex-col justify-between shadow-xl sm:col-span-2 lg:col-span-1 gap-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase font-mono">Ledger Master Controls</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">Generate statements or reset layout dataset</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Reset current credit balances to screenshot default mock values? This will wipe local changes for collections.")) {
                                setSales(initialSales);
                                setAnimals(initialAnimals);
                                localStorage.removeItem("mf_sales");
                                localStorage.removeItem("mf_animals");
                                setSelectedTrackerCode("");
                                alert("Accounts ledger reset to pristine screenshot values successfully!");
                              }
                            }}
                            className="text-[9px] border border-slate-800 hover:border-slate-700 bg-slate-900 px-2 py-1 rounded-lg text-slate-400 hover:text-white font-mono active:scale-95 transition"
                          >
                            Reset Data
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Trigger a print block for all outstanding customers
                              const printWindow = window.open("", "_blank");
                              if (printWindow) {
                                const dueCustomers = sales.filter(s => (s.amountDue || 0) > 0);
                                const totalAmt = dueCustomers.reduce((sum, s) => sum + (s.amountDue || 0), 0);
                                printWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>Ledger Summary Report</title>
                                      <style>
                                        body { font-family: monospace; padding: 20px; background: #fff; color: #000; }
                                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                                        th { background: #f2f2f2; }
                                        h2 { text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 5px; }
                                      </style>
                                    </head>
                                    <body onload="window.print()">
                                      <h2>SHAIE ALAM LIVESTOCK CO. - COLLECTION RECEIVABLES REPORT</h2>
                                      <p>Date Generated: ${new Date().toLocaleDateString()}</p>
                                      <p>Total Receivables ("You will get"): <strong>₹${totalAmt.toLocaleString()}</strong></p>
                                      <table>
                                        <thead>
                                          <tr>
                                            <th>Code</th>
                                            <th>Customer Name</th>
                                            <th>Phone Number</th>
                                            <th>Outstanding Balance</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          ${dueCustomers.map(c => `
                                            <tr>
                                              <td>${c.customerCode || "N/A"}</td>
                                              <td>${c.customerName}</td>
                                              <td>${c.customerPhone}</td>
                                              <td>₹${(c.amountDue || 0).toLocaleString()}</td>
                                            </tr>
                                          `).join("")}
                                        </tbody>
                                      </table>
                                    </body>
                                  </html>
                                `);
                                printWindow.document.close();
                              }
                            }}
                            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition select-none active:scale-95 cursor-pointer"
                          >
                            <Receipt className="h-3.5 w-3.5 text-teal-400" />
                            View Reports
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Main Grid Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      
                      {/* Left Column: Register list of customers */}
                      <div className="lg:col-span-1 bg-slate-950 border border-slate-800 p-5 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4 text-teal-400" />
                            Customer Directory
                          </h4>
                          <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-slate-400">
                            By latest visit
                          </span>
                        </div>

                        {/* Interactive Search Tool */}
                        <div className="relative">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Type customer code, name, phone..."
                            value={customerSearchQuery}
                            onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-teal-500 text-white placeholder-slate-500"
                          />
                          {customerSearchQuery && (
                            <button
                              onClick={() => setCustomerSearchQuery("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {/* Customer list container */}
                        <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                          {(() => {
                            const aggregatedDirectory = (() => {
                              const map: Record<string, {
                                code: string;
                                name: string;
                                phone: string;
                                totalSpent: number;
                                totalDue: number;
                                lastVisit: string;
                                transactionsCount: number;
                              }> = {};

                              // 1. Retail Sales
                              sales.forEach(sale => {
                                const code = sale.customerCode || "N/A";
                                const phone = sale.customerPhone || "N/A";
                                const name = sale.customerName || "Walk-In Buyer";
                                const due = sale.amountDue !== undefined ? sale.amountDue : 0;
                                const key = code !== "N/A" ? code.toLowerCase() : `${name.toLowerCase()}_${phone}`;

                                if (!map[key]) {
                                  map[key] = {
                                    code,
                                    name,
                                    phone,
                                    totalSpent: 0,
                                    totalDue: 0,
                                    lastVisit: sale.date,
                                    transactionsCount: 0,
                                  };
                                }

                                map[key].totalSpent += sale.totalAmount;
                                map[key].totalDue += due;
                                map[key].transactionsCount += 1;
                                if (sale.date > map[key].lastVisit) {
                                  map[key].lastVisit = sale.date;
                                }
                              });

                              // 2. Portion sales under dispatcher
                              butcherDispatches.forEach(disp => {
                                if (disp.portionSales) {
                                  disp.portionSales.forEach(sale => {
                                    const code = sale.customerCode || "N/A";
                                    const phone = sale.customerPhone || "N/A";
                                    const name = sale.customerName || "Portion Buyer";
                                    const key = code !== "N/A" ? code.toLowerCase() : `${name.toLowerCase()}_${phone}`;

                                    if (!map[key]) {
                                      map[key] = {
                                        code,
                                        name,
                                        phone,
                                        totalSpent: 0,
                                        totalDue: 0,
                                        lastVisit: sale.date || disp.slaughterDate || disp.dispatchDate || "",
                                        transactionsCount: 0,
                                      };
                                    }

                                    map[key].totalSpent += sale.totalAmount;
                                    map[key].totalDue += sale.amountDue;
                                    map[key].transactionsCount += 1;
                                    const dateStr = sale.date || disp.slaughterDate || disp.dispatchDate || "";
                                    if (dateStr > map[key].lastVisit) {
                                      map[key].lastVisit = dateStr;
                                    }
                                  });
                                }
                              });

                              // 3. Procurement Credits (seller/supplier matching by name)
                              animals.forEach(ani => {
                                const name = ani.owner || "";
                                if (!name || name.toLowerCase().includes("bazar") || name.toLowerCase() === "unknown") return;

                                const phone = "N/A";
                                const key = name.toLowerCase();
                                let foundKey = key;

                                const existing = Object.entries(map).find(([k, v]) => v.name.toLowerCase() === key);
                                if (existing) {
                                  foundKey = existing[0];
                                }

                                if (!map[foundKey]) {
                                  map[foundKey] = {
                                    code: "N/A",
                                    name,
                                    phone,
                                    totalSpent: 0,
                                    totalDue: 0, // due to us (this represents supplier credit, which is negative since we owe them, we can display this cleanly)
                                    lastVisit: ani.dateAdded,
                                    transactionsCount: 0,
                                  };
                                }

                                // We treat procurement events as supplier relationships
                                map[foundKey].transactionsCount += 1;
                                if (ani.dateAdded > map[foundKey].lastVisit) {
                                  map[foundKey].lastVisit = ani.dateAdded;
                                }
                              });

                              return Object.values(map).sort((a,b) => b.lastVisit.localeCompare(a.lastVisit));
                            })();

                            const filtered = aggregatedDirectory.filter(c => {
                              const q = customerSearchQuery.toLowerCase().trim();
                              if (!q) return true;
                              return (
                                c.code.toLowerCase().includes(q) ||
                                c.name.toLowerCase().includes(q) ||
                                c.phone.toLowerCase().includes(q)
                              );
                            });

                            if (filtered.length === 0) {
                              return (
                                <div className="text-center py-10 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
                                  <Users className="h-8 w-8 text-slate-500 mx-auto opacity-40 mb-2" />
                                  <p className="text-xs text-slate-500 font-medium">No customers or suppliers found</p>
                                </div>
                              );
                            }

                            return filtered.map(c => {
                              const selectionId = c.code !== "N/A" ? c.code : c.name;
                              const isSelected = selectedTrackerCode === selectionId;
                              const supplierRecords = animals.filter(ani => ani.owner && ani.owner.toLowerCase() === c.name.toLowerCase());
                              const supplierCreditCount = supplierRecords.filter(a => a.due > 0).length;

                              return (
                                <div
                                  key={c.code !== "N/A" ? c.code : `${c.name}_${c.phone}`}
                                  onClick={() => setSelectedTrackerCode(selectionId)}
                                  className={`p-4 border rounded-2xl cursor-pointer transition flex items-center justify-between text-left ${
                                    isSelected 
                                      ? "bg-teal-500/10 border-teal-500" 
                                      : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                                  }`}
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[10px] font-mono bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded text-teal-400 font-bold">
                                        {c.code !== "N/A" ? `CODE ${c.code}` : "PARTNER"}
                                      </span>
                                      <span className="text-[9px] text-slate-500 font-mono italic">
                                        {c.lastVisit}
                                      </span>
                                    </div>
                                    <h5 className="text-xs font-bold text-white pt-1">{c.name}</h5>
                                    <p className="text-[10px] text-slate-400 font-mono">{c.phone}</p>
                                    
                                    <div className="pt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-[9px]">
                                      <span className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300 border border-slate-800">
                                        📑 {c.transactionsCount} entries
                                      </span>
                                      {c.totalDue > 0 && (
                                        <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold font-mono">
                                          Due: ₹{c.totalDue.toLocaleString()}
                                        </span>
                                      )}
                                      {supplierCreditCount > 0 && (
                                        <span className="bg-rose-500/15 text-rose-400 px-1.5 py-0.5 rounded font-bold font-mono border border-rose-500/10">
                                          Credit Sourcing: {supplierCreditCount}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right flex flex-col items-end">
                                    <p className="text-xs font-mono font-bold text-teal-400">₹{c.totalSpent.toLocaleString()}</p>
                                    <span className="text-[8px] text-slate-505 font-mono uppercase mt-1">Total Spent</span>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      {/* Right Column: Detailed Transaction Ledger Sheets */}
                      <div className="lg:col-span-2 space-y-6">
                        {(() => {
                          if (!selectedTrackerCode) {
                            return (
                              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                                <Users className="h-12 w-12 text-slate-600 mb-3 opacity-40" />
                                <h4 className="text-sm font-bold text-slate-300 font-mono uppercase">LIVESTOCK PARTNER CENTRAL</h4>
                                <p className="text-xs text-slate-500 max-w-xs mt-1">
                                  Select a customer or supplier from the list on the left to inspect detailed billing statements, log dynamic cash collections, or schedule reminders.
                                </p>
                              </div>
                            );
                          }

                          // 1. Resolve Target Profile Dets
                          const customerSales = sales.filter(s => {
                            if (s.customerCode === selectedTrackerCode) return true;
                            const selectionKey = `${s.customerName.toLowerCase()}_${s.customerPhone}`;
                            if (selectionKey === selectedTrackerCode.toLowerCase()) return true;
                            if (s.customerName.toLowerCase() === selectedTrackerCode.toLowerCase()) return true;
                            return false;
                          });

                          let targetName = "";
                          let targetPhone = "N/A";
                          let targetCode = selectedTrackerCode;

                          if (customerSales.length > 0) {
                            targetName = customerSales[0].customerName;
                            targetPhone = customerSales[0].customerPhone;
                            targetCode = customerSales[0].customerCode || targetCode;
                          } else {
                            // Sourcing owner search
                            const matchedAnimal = animals.find(a => a.owner && a.owner.toLowerCase() === selectedTrackerCode.toLowerCase());
                            if (matchedAnimal) {
                              targetName = matchedAnimal.owner;
                              targetPhone = "N/A";
                              targetCode = "N/A";
                            } else {
                              targetName = selectedTrackerCode;
                            }
                          }

                          // 2. Build complete virtual chronological ledger matrix
                          const ledgerRows: Array<{
                            id: string;
                            dateStr: string;
                            type: "GAVE" | "GOT";
                            notes: string;
                            amount: number;
                            runningBalance: number;
                          }> = [];

                          // Sale debits & partial payment credits
                          customerSales.forEach(sale => {
                            ledgerRows.push({
                              id: `${sale.id}-DEBIT`,
                              dateStr: sale.date,
                              type: "GAVE",
                              notes: sale.items.map(it => `${it.type} (${it.weightKg}kg)`).join(", ") || "Credit invoice purchase",
                              amount: sale.totalAmount,
                              runningBalance: 0
                            });

                            if (sale.installments) {
                              sale.installments.forEach(inst => {
                                ledgerRows.push({
                                  id: inst.id,
                                  dateStr: inst.date,
                                  type: "GOT",
                                  notes: inst.notes || "Recorded collection installment credit payoff",
                                  amount: inst.amount,
                                  runningBalance: 0
                                });
                              });
                            }
                          });

                          // Butcher dispatches portion sales 
                          butcherDispatches.forEach(disp => {
                            if (disp.portionSales) {
                              const customerPortions = disp.portionSales.filter(p => {
                                if (p.customerCode === selectedTrackerCode) return true;
                                const selectionKey = `${p.customerName.toLowerCase()}_${p.customerPhone}`;
                                if (selectionKey === selectedTrackerCode.toLowerCase()) return true;
                                if (p.customerName.toLowerCase() === selectedTrackerCode.toLowerCase()) return true;
                                return false;
                              });

                              customerPortions.forEach(p => {
                                ledgerRows.push({
                                  id: `${p.id}-PORTION`,
                                  dateStr: p.date || disp.slaughterDate || disp.dispatchDate || "",
                                  type: "GAVE",
                                  notes: `Portion dispatch: ${p.weightKg}kg Meat transfer`,
                                  amount: p.totalAmount,
                                  runningBalance: 0
                                });

                                if (p.amountPaid > 0) {
                                  ledgerRows.push({
                                    id: `${p.id}-PORTION-PAY`,
                                    dateStr: p.date || disp.slaughterDate || disp.dispatchDate || "",
                                    type: "GOT",
                                    notes: `Portion dispatch downpayment received`,
                                    amount: p.amountPaid,
                                    runningBalance: 0
                                  });
                                }
                              });
                            }
                          });

                          // Suppliers sourcing credit (where we owe supplier, represented as negative due)
                          const matchedSupplierAnimals = animals.filter(a => a.owner && a.owner.toLowerCase() === targetName.toLowerCase());
                          matchedSupplierAnimals.forEach(a => {
                            if (a.due > 0) {
                              ledgerRows.push({
                                id: `${a.id}-SOURCING-DUE`,
                                dateStr: a.dateAdded,
                                type: "GOT", // Sourcing animal is money they gave us
                                notes: `Sourced livestock head ${a.id} (${a.type} - ${a.breed})`,
                                amount: a.due,
                                runningBalance: 0
                              });
                            }
                          });

                          // Sort chronologically
                          const sortedLedgerRows = ledgerRows.sort((a,b) => a.dateStr.localeCompare(b.dateStr));

                          // Apply running balance additions/subtractions
                          let rBl = 0;
                          sortedLedgerRows.forEach(row => {
                            if (row.type === "GAVE") {
                              rBl += row.amount;
                            } else {
                              rBl -= row.amount;
                            }
                            row.runningBalance = rBl;
                          });

                          const netOutstanding = rBl;
                          const displayLedgerRows = [...sortedLedgerRows].reverse();

                          return (
                            <>
                              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative flex flex-col">
                              
                              {/* Top Profile block (Screenshot 2 Format) */}
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-800/80">
                                <div>
                                  <span className="text-[10px] font-mono font-black text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                                    Customer Account ledger
                                  </span>
                                  <h4 className="text-base font-black text-white mt-1.5 font-mono uppercase tracking-wide">
                                    {targetName}
                                  </h4>
                                  <p className="text-xs text-slate-550 font-mono mt-0.5">Cell: {targetPhone} • Ref ID: {targetCode}</p>
                                </div>
                                <div className="text-right bg-slate-900 border border-slate-800 rounded-2xl p-3 w-full sm:w-auto">
                                  <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-rose-500 block">
                                    You will get (আপনার পাওনা)
                                  </span>
                                  <span className="text-2xl font-black text-rose-500 font-mono block mt-0.5">
                                    ₹{netOutstanding.toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              {/* Set collection reminder Ribbon (Screenshot 2 Format) */}
                              <div className="p-3.5 bg-slate-900/60 border border-slate-800/60 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-blue-400 animate-pulse" />
                                  <div>
                                    <span className="text-xs font-semibold text-white block">Collection follow up due date</span>
                                    <span className="text-[10px] text-slate-505 font-mono">
                                      {customerSales[0].dueDate ? `Scheduled for: ${customerSales[0].dueDate}` : "No follow-up reminder date assigned"}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                                  {dateReminderSettingId === targetCode ? (
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="date"
                                        value={reminderSelectedDate}
                                        onChange={(e) => {
                                          setReminderSelectedDate(e.target.value);
                                          // Update dueDate on matching customer sales live!
                                          setSales(prev => prev.map(s => {
                                            if (s.customerCode === targetCode) {
                                              return { ...s, dueDate: e.target.value };
                                            }
                                            return s;
                                          }));
                                          setDateReminderSettingId(null);
                                          alert(`Collection dues reminder rescheduled to ${e.target.value} successfully.`);
                                        }}
                                        className="bg-slate-950 border border-slate-800 text-xs px-2 py-1.5 rounded-lg text-white font-mono focus:outline-none focus:border-blue-400"
                                      />
                                      <button
                                        onClick={() => setDateReminderSettingId(null)}
                                        className="text-[10px] text-red-400 font-bold hover:underline font-mono"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDateReminderSettingId(targetCode);
                                        setReminderSelectedDate(customerSales[0].dueDate || new Date().toISOString().split("T")[0]);
                                      }}
                                      className="px-3 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-700 rounded-xl text-[10px] font-black text-white hover:text-blue-300 transition cursor-pointer select-none"
                                    >
                                      SET DATE
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Quick interactive Actions deck (Screenshot 2 Buttons bar) */}
                              <div className="grid grid-cols-3 gap-3 border-y border-slate-800/60 py-2.5">
                                {/* Print single statement */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const printWindow = window.open("", "_blank");
                                    if (printWindow) {
                                      printWindow.document.write(`
                                        <html>
                                          <head>
                                            <title>Statement of Account - ${targetName}</title>
                                            <style>
                                              body { font-family: monospace; padding: 25px; line-height: 1.4; color:#000;background:#fff;}
                                              .hed { border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 15px;}
                                              table { width: 100%; border-collapse: collapse; margin-top: 20px;}
                                              th, td { border: 1px solid #ccc; padding: 8px; text-align: left;}
                                              th { background: #f2f2f2; }
                                              .bold { font-weight: bold;}
                                            </style>
                                          </head>
                                          <body onload="window.print()">
                                            <div class="hed">
                                              <h2>STATEMENT OF HEALTH / TRANSACTION RECORD</h2>
                                              <p><strong>Customer:</strong> ${targetName}</p>
                                              <p><strong>Contact cell:</strong> ${targetPhone}</p>
                                              <p><strong>Ref Code:</strong> ${targetCode}</p>
                                            </div>
                                            <p>Outstanding Unsettled Balance (You will get): <strong>₹${netOutstanding.toLocaleString()}</strong></p>
                                            <table>
                                              <thead>
                                                <tr>
                                                  <th>Date Logged</th>
                                                  <th>Entry Type</th>
                                                  <th>Detailed Description</th>
                                                  <th>YOU GAVE (Debit)</th>
                                                  <th>YOU GOT (Credit)</th>
                                                  <th>Running Balance</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                ${ledgerRows.map(row => `
                                                  <tr>
                                                    <td>${new Date(row.dateStr).toLocaleDateString()} ${row.dateStr.includes("T") ? new Date(row.dateStr).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</td>
                                                    <td><strong>${row.type}</strong></td>
                                                    <td>${row.notes}</td>
                                                    <td>${row.type === "GAVE" ? `₹${row.amount.toLocaleString()}` : "-"}</td>
                                                    <td>${row.type === "GOT" ? `₹${row.amount.toLocaleString()}` : "-"}</td>
                                                    <td><strong>₹${row.runningBalance.toLocaleString()}</strong></td>
                                                  </tr>
                                                `).join("")}
                                              </tbody>
                                            </table>
                                          </body>
                                        </html>
                                      `);
                                      printWindow.document.close();
                                    }
                                  }}
                                  className="py-2.5 px-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 rounded-2xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition select-none active:scale-95 cursor-pointer"
                                >
                                  <Printer className="h-4 w-4 text-emerald-400" />
                                  <span>Report</span>
                                </button>

                                {/* Pre-form WhatsApp Text reminder */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const rawMessage = `Dear ${targetName}, your outstanding collections ledger statement under Shaie Alam Livestock stands at ₹${netOutstanding.toLocaleString()}. Please arrange split payment at your earliest convenience. Thank you!`;
                                    const encoded = encodeURIComponent(rawMessage);
                                    window.open(`https://wa.me/${targetPhone.replace(/[^0-9]/g, "")}?text=${encoded}`, "_blank");
                                  }}
                                  className="py-2.5 px-3 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 rounded-2xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition select-none active:scale-95 cursor-pointer"
                                >
                                  <Smartphone className="h-4 w-4 text-emerald-400 animate-pulse" />
                                  <span>Reminder</span>
                                </button>

                                {/* SMS Template helper popup */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const template = `[SMS SMS] SHAIE ALAM LIVESTOCK CO:\nDear ${targetName}, outstanding balance is ₹${netOutstanding.toLocaleString()}. Settle easily via bKash or cash. Link: sh-alam.com/dues/${targetCode}`;
                                    alert(`Prepared SMS Broadcast Packet for customer cellular router:\n\n${template}`);
                                  }}
                                  className="py-2.5 px-3 bg-blue-500/10 border border-blue-500/25 hover:bg-blue-500/20 hover:border-blue-500/40 text-blue-400 rounded-2xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition select-none active:scale-95 cursor-pointer"
                                >
                                  <MessageSquare className="h-4 w-4 text-blue-400" />
                                  <span>SMS</span>
                                </button>
                              </div>

                              {/* Interactive Inline Forms for giving / getting logs */}
                              <div className="space-y-3">
                                {/* YOU GAVE credit addition form */}
                                {showGaveForm && (
                                  <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl space-y-3 animate-slideDown">
                                    <div className="flex justify-between items-center pb-2 border-b border-rose-500/10">
                                      <h5 className="text-xs font-black text-rose-400 uppercase font-mono">
                                        🔴 Log Credit Entry (YOU GAVE GOODS / আপনি উধার দিয়েছেন)
                                      </h5>
                                      <button onClick={() => setShowGaveForm(false)} className="text-slate-500 hover:text-white text-[10px] font-mono">✕ Close</button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                      <div className="space-y-1">
                                        <label className="block text-[9px] text-slate-400 uppercase font-mono">Credit Amount (₹)</label>
                                        <input
                                          type="number"
                                          placeholder="₹ amount"
                                          value={gaveAmount}
                                          onChange={(e) => setGaveAmount(e.target.value)}
                                          className="w-full bg-slate-950 border border-rose-500/20 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-rose-500 text-white placeholder-slate-600"
                                        />
                                      </div>
                                      <div className="space-y-1 sm:col-span-2">
                                        <label className="block text-[9px] text-slate-400 uppercase font-mono">Detailed Description (items, cuts, weights)</label>
                                        <input
                                          type="text"
                                          placeholder="e.g. 5kg Bovine cuts, special rib pack"
                                          value={gaveDescription}
                                          onChange={(e) => setGaveDescription(e.target.value)}
                                          className="w-full bg-slate-950 border border-rose-500/20 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500 text-white placeholder-slate-600"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!gaveAmount || Number(gaveAmount) <= 0) {
                                            alert("Please enter a valid credit quantity amount.");
                                            return;
                                          }
                                          const numAmt = Number(gaveAmount);
                                          const timestampStr = new Date().toISOString();
                                          const newSaleObj: Sale = {
                                            id: `SALE-${Math.floor(1001 + Math.random() * 8999)}`,
                                            customerName: targetName,
                                            customerPhone: targetPhone,
                                            customerCode: targetCode,
                                            items: [{ type: gaveDescription || "Direct Credit Sale", weightKg: 1, ratePerKg: numAmt, amount: numAmt }],
                                            totalAmount: numAmt,
                                            paymentMethod: "Due",
                                            date: timestampStr,
                                            amountPaid: 0,
                                            amountDue: numAmt,
                                            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                                            installments: []
                                          };
                                          setSales(prev => [newSaleObj, ...prev]);
                                          // Clear fields
                                          setGaveAmount("");
                                          setGaveDescription("");
                                          setShowGaveForm(false);
                                          recordOfflineChange(`Logged credit balance account additions (₹${numAmt}) to ${targetName}`);
                                        }}
                                        className="px-4 py-1.5 bg-rose-500 text-slate-955 text-xs font-black rounded-xl active:scale-95 transition cursor-pointer"
                                      >
                                        Save Log
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* YOU GOT payment recording form */}
                                {showGotForm && (
                                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl space-y-3 animate-slideDown">
                                    <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10">
                                      <h5 className="text-xs font-black text-emerald-400 uppercase font-mono">
                                        🟢 Log Collection/Payment Entry (YOU GOT CASH / টাকা আদায় হয়েছে)
                                      </h5>
                                      <button onClick={() => setShowGotForm(false)} className="text-slate-500 hover:text-white text-[10px] font-mono">✕ Close</button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                      <div className="space-y-1">
                                        <label className="block text-[9px] text-slate-400 uppercase font-mono">Collected (₹)</label>
                                        <input
                                          type="number"
                                          placeholder="Settle amount"
                                          value={gotAmount}
                                          onChange={(e) => setGotAmount(e.target.value)}
                                          className="w-full bg-slate-955 border border-emerald-500/25 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="block text-[9px] text-slate-400 uppercase font-mono">Channel</label>
                                        <select
                                          value={gotPaymentMethod}
                                          onChange={(e: any) => setGotPaymentMethod(e.target.value)}
                                          className="w-full bg-slate-955 border border-emerald-500/25 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                        >
                                          <option value="Cash">💵 Cash</option>
                                          <option value="bKash">📱 bKash</option>
                                          <option value="Card">💳 Card</option>
                                        </select>
                                      </div>
                                      <div className="space-y-1 sm:col-span-2">
                                        <label className="block text-[9px] text-slate-400 uppercase font-mono">Notes / Remarks</label>
                                        <input
                                          type="text"
                                          placeholder="e.g. Settle partial beef credit"
                                          value={gotDescription}
                                          onChange={(e) => setGotDescription(e.target.value)}
                                          className="w-full bg-slate-955 border border-emerald-500/25 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!gotAmount || Number(gotAmount) <= 0) {
                                            alert("Please state a valid collected cash amount.");
                                            return;
                                          }
                                          const settleAmtNum = Number(gotAmount);
                                          let runningPayoff = settleAmtNum;
                                          const localToday = new Date().toISOString().split("T")[0];

                                          // Distribute collected payments chronologically over matching due transactions
                                          setSales(prevSales => {
                                            return prevSales.map(sale => {
                                              const isThisCustomer = sale.customerCode === targetCode;
                                              if (isThisCustomer && runningPayoff > 0) {
                                                const currentDue = sale.amountDue || 0;
                                                if (currentDue > 0) {
                                                  const portionSettle = Math.min(currentDue, runningPayoff);
                                                  runningPayoff -= portionSettle;
                                                  const newDue = currentDue - portionSettle;
                                                  const newInst: Installment = {
                                                    id: `INST-${Math.floor(1001 + Math.random() * 8999)}`,
                                                    date: localToday,
                                                    amount: portionSettle,
                                                    paymentMethod: gotPaymentMethod,
                                                    notes: gotDescription || "Split installment callback payment",
                                                    collectionNotes: gotDescription || "Split installment callback payment"
                                                  };
                                                  
                                                  // Increase general cash reserves
                                                  setCashBalance(prev => prev + portionSettle);

                                                  return {
                                                    ...sale,
                                                    amountPaid: (sale.amountPaid || 0) + portionSettle,
                                                    amountDue: newDue,
                                                    installments: [...(sale.installments || []), newInst]
                                                  };
                                                }
                                              }
                                              return sale;
                                            });
                                          });

                                          alert(`Distributed ₹${settleAmtNum.toLocaleString()} payment over outstanding debit vouchers for ${targetName}`);
                                          setGotAmount("");
                                          setGotDescription("");
                                          setShowGotForm(false);
                                          recordOfflineChange(`Registered payment payoff collection (₹${settleAmtNum}) for ${targetName}`);
                                        }}
                                        className="px-4 py-1.5 bg-emerald-500 text-slate-955 text-xs font-black rounded-xl active:scale-95 transition cursor-pointer"
                                      >
                                        Save Log
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Entries Table layout (Screenshot 2 Format) */}
                              <div className="space-y-3.5">
                                <div className="flex justify-between items-center text-xs text-slate-400 font-mono font-bold tracking-wide border-b border-slate-900 pb-2">
                                  <span>ENTRIES REGISTER (লেনদেন বিবরণী)</span>
                                  <div className="flex gap-14 pr-8 uppercase tracking-widest text-[9px]">
                                    <span className="text-rose-400 font-bold">You Gave</span>
                                    <span className="text-emerald-400 font-bold">You Got</span>
                                  </div>
                                </div>

                                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                                  {sortedLedgerRows.map(row => {
                                    const rawD = new Date(row.dateStr);
                                    const dateOptions: any = { day: '2-digit', month: 'short', year: '2-digit' };
                                    const timeOptions: any = { hour: '2-digit', minute: '2-digit', hour12: true };
                                    const formattedDate = !isNaN(rawD.getTime()) 
                                      ? `${rawD.toLocaleDateString('en-GB', dateOptions)} • ${rawD.toLocaleTimeString('en-US', timeOptions)}`
                                      : row.dateStr;

                                    return (
                                      <div key={row.id} className="p-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-2xl flex items-center justify-between gap-4 transition-all duration-155">
                                        <div className="space-y-1.5 text-left min-w-0 flex-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[10px] text-slate-300 font-mono font-semibold">
                                              {formattedDate}
                                            </span>
                                          </div>
                                          
                                          <p className="text-[10px] text-slate-500 font-mono truncate max-w-[200px] sm:max-w-xs" title={row.notes}>
                                            📚 {row.notes}
                                          </p>

                                          <div className="inline-block bg-slate-950 border border-slate-900 text-slate-400 px-2 py-0.5 rounded-lg text-[9px] font-mono">
                                            Bal. ₹{row.runningBalance.toLocaleString()}
                                          </div>
                                        </div>

                                        <div className="flex gap-4 shrink-0 items-center justify-end w-36 sm:w-44 pr-1 text-right">
                                          <div className="w-16 sm:w-20 text-center">
                                            {row.type === "GAVE" ? (
                                              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-2.5 py-1 rounded-xl text-xs font-black font-mono">
                                                ₹{row.amount.toLocaleString()}
                                              </div>
                                            ) : (
                                              <span className="text-slate-800 font-mono">-</span>
                                            )}
                                          </div>

                                          <div className="w-16 sm:w-20 text-center">
                                            {row.type === "GOT" ? (
                                              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-xl text-xs font-black font-mono">
                                                ₹{row.amount.toLocaleString()}
                                              </div>
                                            ) : (
                                              <span className="text-slate-800 font-mono">-</span>
                                            )}
                                          </div>
                                        </div>

                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-slate-900">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowGaveForm(true);
                                    setShowGotForm(false);
                                  }}
                                  className="py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 shadow-lg select-none cursor-pointer"
                                >
                                  🔴 YOU GAVE ₹
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowGotForm(true);
                                    setShowGaveForm(false);
                                  }}
                                  className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 shadow-lg select-none cursor-pointer"
                                >
                                  🟢 YOU GOT ₹
                                </button>
                              </div>

                            </div>

                            {/* Historical Original Invoice Dues Matrix */}
                            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                              <h4 className="text-sm font-black text-white uppercase font-mono tracking-wider border-b border-slate-900 pb-2 flex items-center gap-1.5">
                                <Receipt className="h-4 w-4 text-emerald-400" />
                                Original Dues & Invoice Vouchers
                              </h4>
                              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                                {customerSales.length === 0 ? (
                                  <p className="text-xs text-slate-500 italic font-mono text-center py-6">No matching retail billing counter invoices.</p>
                                ) : (
                                  customerSales.map(sale => {
                                    const paidAmt = sale.amountPaid !== undefined ? sale.amountPaid : sale.totalAmount;
                                    const dueAmt = sale.amountDue !== undefined ? sale.amountDue : 0;
                                    return (
                                      <div key={sale.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-3">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-mono font-bold text-white">{sale.id}</span>
                                              <span className="text-[10px] text-slate-400 font-mono">{sale.date}</span>
                                            </div>
                                            <div className="flex flex-wrap mt-2 gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-900">
                                              {sale.items.map((it, idx) => (
                                                <span key={idx} className="text-[10px] text-slate-300 font-mono">
                                                  {it.type} ({it.weightKg}kg x ₹{it.ratePerKg}){idx < sale.items.length - 1 ? " • " : ""}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <span className="text-sm font-bold text-teal-400 font-mono">₹{sale.totalAmount.toLocaleString()}</span>
                                            <span className="text-[9px] text-slate-505 font-mono block mt-1 uppercase font-semibold">{sale.paymentMethod}</span>
                                          </div>
                                        </div>

                                        {/* Due breakdown */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-500">Breakdown:</span>
                                            <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 font-bold">
                                              Paid: ₹{paidAmt.toLocaleString()}
                                            </span>
                                            {dueAmt > 0 ? (
                                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
                                                Due: ₹{dueAmt.toLocaleString()}
                                              </span>
                                            ) : (
                                              <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">
                                                Settled
                                              </span>
                                            )}
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSelectedInvoice(sale);
                                              setShowInvoiceModal(true);
                                              fetchReceiptDocument(sale);
                                            }}
                                            className="text-[10px] text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
                                          >
                                            <Printer className="h-3 w-3" />
                                            View Invoice
                                          </button>
                                        </div>

                                        {/* Historical installment schedules */}
                                        {sale.installments && sale.installments.length > 0 && (
                                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 mt-2 space-y-2">
                                            <span className="text-[9px] text-slate-505 uppercase font-black tracking-wide block">
                                              📑 Instalment History Matrix ({sale.installments.length} logs)
                                            </span>
                                            <div className="space-y-1.5">
                                              {sale.installments.map((inst) => (
                                                <div key={inst.id} className="flex justify-between items-center text-[10px] border-b border-slate-900 pb-1 last:border-0 font-mono text-slate-400">
                                                  <span>📅 {inst.date} ({inst.paymentMethod})</span>
                                                  <span className="text-white font-bold">Received ₹{inst.amount.toLocaleString()}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>

                          </>
                        );
                      })()}
                      </div>

                    </div>

                  </div>
                )}

            </div>
          ) : renderAccessRestricted("Retail POS Sales billing counter", ["Administrator", "Collections"])
        )}

        {/* TAB 3B: CATTLE FEED & WELFARE DEPARTMENT */}
        {activeTab === "cattle-feed" && (
          isTabAllowed("cattle-feed", currentUser?.role) ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Department Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Wheat className="h-6 w-6 text-amber-500" />
                    Cattle Feed & Welfare Department
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-functional department running in-house farm nutrition & healthcare transfers, alongside a public feed & medicine store-front terminal.
                  </p>
                </div>

                {/* Sub-Tabs Selector Navigation */}
                <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 self-stretch md:self-auto gap-0.5">
                  <button
                    type="button"
                    onClick={() => setFeedSubTab("inventory")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition duration-155 select-none cursor-pointer flex items-center gap-1.5 ${
                      feedSubTab === "inventory" ? "bg-teal-500 text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Wheat className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Farm Sacks & Alloc</span>
                    <span className="sm:hidden">Stock</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedSubTab("sales")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition duration-155 select-none cursor-pointer flex items-center gap-1.5 ${
                      feedSubTab === "sales" ? "bg-teal-500 text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Store POS Terminal</span>
                    <span className="sm:hidden">POS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedSubTab("customers")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition duration-155 select-none cursor-pointer flex items-center gap-1.5 ${
                      feedSubTab === "customers" ? "bg-teal-500 text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Customers Ledger</span>
                    <span className="sm:hidden">Customers</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedSubTab("transactions")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition duration-155 select-none cursor-pointer flex items-center gap-1.5 ${
                      feedSubTab === "transactions" ? "bg-teal-500 text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <History className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Voucher Registers</span>
                    <span className="sm:hidden">Vouchers</span>
                  </button>
                </div>
              </div>

              {/* Feed & Welfare Stats Summary Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono">Feed stock variety</span>
                  <p className="text-2xl font-black text-white mt-1">{feedStock.length} items</p>
                  <span className="text-[9px] text-teal-400 font-mono mt-1">In-house stock categories</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono">Total Feed Sacks</span>
                  <p className="text-2xl font-black text-amber-500 mt-1">
                    {feedStock.reduce((sum, f) => sum + f.sackCount, 0).toFixed(1)} sacks
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono mt-1">Available for distribution</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono">Feed Allocations logged</span>
                  <p className="text-2xl font-black text-white mt-1">{feedAllocations.length} records</p>
                  <span className="text-[9px] text-emerald-400 font-mono mt-1">Directly assigned to heads</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono">Cumulative Welfare Spends</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">
                    ₹{animals.reduce((sum, a) => {
                      const fCost = a.feedCost || 0;
                      const mCost = (a.medicineCost || 0) + (a.healthHistory || []).reduce((s, h) => s + (h.cost || 0), 0);
                      const maintCost = a.maintenanceCost || 0;
                      const hndlCost = a.handlingCost || 0;
                      return sum + fCost + mCost + maintCost + hndlCost;
                    }, 0).toLocaleString()}
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono mt-1">Welfare capital recorded</span>
                </div>
              </div>

              {/* Main Content Split Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Left Action Column: Allocation & Purchase forms */}
                <div className="space-y-6 lg:col-span-1">
                  
                  {/* Form A: Allocate Daily Feed to Cattle */}
                  <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-850 pb-2">
                      <Scale className="h-4 w-4 text-teal-400" />
                      Allocate Feed to Cattle Head
                    </h4>

                    <form onSubmit={handleAllocateFeedSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">Select Active Cattle *</label>
                        <select
                          required
                          value={allocateAnimalId}
                          onChange={(e) => setAllocateAnimalId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400 cursor-pointer font-mono"
                        >
                          <option value="">-- Choose active animal --</option>
                          {animals.filter(a => a.status !== "Processed").map(a => (
                            <option key={a.id} value={a.id}>
                              {a.id} ({a.type} - {a.breed}, {a.weightKg}kg)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">Select Raw Feed *</label>
                        <select
                          required
                          value={allocateFeedId}
                          onChange={(e) => setAllocateFeedId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400 cursor-pointer font-mono"
                        >
                          <option value="">-- Choose from stock --</option>
                          {feedStock.filter(f => f.sackCount > 0).map(f => (
                            <option key={f.id} value={f.id}>
                              {f.type} (Stock: {f.sackCount} Sacks, {f.sackWeightKg}kg/sack)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase font-bold">Qty (in Kilograms) *</label>
                        <input
                          type="number"
                          required
                          min="0.1"
                          step="0.1"
                          placeholder="e.g. 5.5"
                          value={allocateQtyKg}
                          onChange={(e) => setAllocateQtyKg(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold text-teal-400 focus:outline-none focus:border-teal-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black tracking-wider rounded-xl uppercase transition cursor-pointer text-[10px]"
                      >
                        Register Feed Allocation
                      </button>
                    </form>
                  </div>

                  {/* Form B: Log Extra Welfare Parameters */}
                  <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-850 pb-2">
                      <Heart className="h-4 w-4 text-emerald-400" />
                      Record Medical & Welfare Charges
                    </h4>

                    <form onSubmit={handleLogExtraWelfareSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">Select Cattle Head *</label>
                        <select
                          required
                          value={welfareAnimalId}
                          onChange={(e) => setWelfareAnimalId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 cursor-pointer font-mono"
                        >
                          <option value="">-- Choose active animal --</option>
                          {animals.filter(a => a.status !== "Processed").map(a => (
                            <option key={a.id} value={a.id}>
                              {a.id} ({a.type} - {a.breed})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">Action Roster *</label>
                        <select
                          required
                          value={welfareLogType}
                          onChange={(e) => setWelfareLogType(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                        >
                          <option value="Medicine">Medicine & Veterinary Checks</option>
                          <option value="Maintenance">Stall/Spacial Maintenance</option>
                          <option value="Handling">Handling & Grooming Overheads</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">Cost Amount (₹) *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="e.g. 1200"
                          value={welfareCostAmt}
                          onChange={(e) => setWelfareCostAmt(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">Treatment Details / Specifications</label>
                        <textarea
                          placeholder="e.g. Deworming booster vaccine, Grooming session, etc."
                          value={welfareDescription}
                          onChange={(e) => setWelfareDescription(e.target.value)}
                          rows={2}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-wider rounded-xl uppercase transition cursor-pointer text-[10px]"
                      >
                        Log Welfare Cost
                      </button>
                    </form>
                  </div>

                  {/* Form C: Procure/Purchase Feed Stock */}
                  <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-850 pb-2">
                      <PlusCircle className="h-4 w-4 text-amber-500" />
                      Procure New Feed Sacks
                    </h4>

                    <form onSubmit={handleRecordFeedPurchase} className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1 font-mono text-[9px] uppercase">Feed Variety Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Soymeal"
                            value={newFeedType}
                            onChange={(e) => setNewFeedType(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1 font-mono text-[9px] uppercase">Sack Count *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={newFeedSackCount}
                            onChange={(e) => setNewFeedSackCount(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1 font-mono text-[9px] uppercase">Sack Weight (Kg)</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={newFeedSackWeight}
                            onChange={(e) => setNewFeedSackWeight(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1 font-mono text-[9px] uppercase">Cost Per Sack (₹) *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="e.g. 1500"
                            value={newFeedUnitCost}
                            onChange={(e) => setNewFeedUnitCost(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">Supplier/Mill Agent Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Rajshahi Feed Importers"
                          value={newFeedSupplier}
                          onChange={(e) => setNewFeedSupplier(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-wider rounded-xl uppercase transition cursor-pointer text-[10px]"
                      >
                        Procure Stock Sacks
                      </button>
                    </form>
                  </div>

                </div>

                {/* 2. Middle & Right: Listings and details */}
                <div className="space-y-6 lg:col-span-2">
                  
                  {/* Ledger A: Current Feed Stock */}
                  <div className="bg-slate-950 hover:border-slate-800 transition p-6 rounded-3xl border border-slate-850 space-y-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-850 pb-2 font-mono">
                      🌾 Real-Time Feed Sacks Inventory
                    </span>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans whitespace-nowrap">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px] tracking-wider font-mono">
                            <th className="py-2.5">Feed SKU</th>
                            <th className="py-2.5">Feed Type Variety</th>
                            <th className="py-2.5 text-center">Remaining Stock</th>
                            <th className="py-2.5 text-center">Sack Specs</th>
                            <th className="py-2.5 text-right font-bold">Purchase Price</th>
                            <th className="py-2.5 text-right">Raw Supplier</th>
                            <th className="py-2.5 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/60 text-slate-200">
                          {feedStock.map((feed) => (
                            <tr key={feed.id} className="hover:bg-slate-900/30">
                              <td className="py-3 text-slate-400 font-mono text-[10px] font-bold">{feed.id}</td>
                              <td className="py-3 font-bold text-white flex items-center gap-2">
                                <Wheat className="h-3.5 w-3.5 text-amber-500" />
                                {feed.type}
                              </td>
                              <td className="py-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                  feed.sackCount <= 0 
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                    : feed.sackCount < 5 
                                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse" 
                                      : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                                }`}>
                                  {feed.sackCount} sacks
                                </span>
                              </td>
                              <td className="py-3 text-center font-mono text-slate-400 text-[11px]">{feed.sackWeightKg} kg / sack</td>
                              <td className="py-3 text-right font-bold font-mono text-white">₹{feed.unitCostPerSack.toLocaleString()}</td>
                              <td className="py-3 text-right text-slate-400 text-[11px]">{feed.supplier}</td>
                              <td className="py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => setFeedStock(feedStock.filter(f => f.id !== feed.id))}
                                  className="text-[10px] text-red-400 hover:text-white hover:bg-red-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded cursor-pointer font-bold transition"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Ledger B: Recent Consumption logs */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-slate-850 space-y-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-850 pb-2 font-mono">
                      📋 Nutritional Consumption Logs (Welfare Allocated)
                    </span>

                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left text-xs font-sans whitespace-nowrap">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px] tracking-wider font-mono">
                            <th className="py-2">Alloc ID</th>
                            <th className="py-2">Cattle Target</th>
                            <th className="py-2">Feed Variety</th>
                            <th className="py-2 text-center">Qty Assigned</th>
                            <th className="py-2 text-right">Cost Assigned</th>
                            <th className="py-2 text-right">Timestamp</th>
                            <th className="py-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/60 text-slate-200">
                          {feedAllocations.map((alloc) => (
                            <tr key={alloc.id} className="hover:bg-slate-900/30">
                              <td className="py-2 text-slate-500 font-mono text-[10px]">{alloc.id}</td>
                              <td className="py-2 text-slate-200 font-bold font-mono">{alloc.animalId}</td>
                              <td className="py-2 font-sans font-semibold text-slate-300">{alloc.feedType}</td>
                              <td className="py-2 text-center font-bold font-mono text-white">{alloc.quantityKg} kg</td>
                              <td className="py-2 text-right text-teal-400 font-bold font-mono">₹{alloc.cost.toLocaleString()}</td>
                              <td className="py-2 text-right text-slate-500 font-mono text-[11px]">{alloc.allocatedDate}</td>
                              <td className="py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => setFeedAllocations(feedAllocations.filter(fa => fa.id !== alloc.id))}
                                  className="text-[9px] text-red-400 hover:text-white hover:bg-red-500 px-1 py-0.5 rounded cursor-pointer font-bold"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Ledger C: Cattle-wise Welfare Ledger Overview */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-slate-850 space-y-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-850 pb-2 font-mono">
                      🩺 Cumulative Welfare Spends per Live Animal
                    </span>

                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left text-xs font-sans whitespace-nowrap font-mono">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px] tracking-wider">
                            <th className="py-2">Animal SKU</th>
                            <th className="py-2">Purchase Cost</th>
                            <th className="py-2 text-right">Feed cost</th>
                            <th className="py-2 text-right">Medical cost</th>
                            <th className="py-2 text-right">Maintenance cost</th>
                            <th className="py-2 text-right">Handling cost</th>
                            <th className="py-2 text-right text-white font-bold">Base Investment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/60 text-slate-200">
                          {animals.filter(a => a.status !== "Processed").map((a) => {
                            const fCost = a.feedCost || 0;
                            const mCost = (a.medicineCost || 0) + (a.healthHistory || []).reduce((sum, h) => sum + (h.cost || 0), 0);
                            const mtCost = a.maintenanceCost || 0;
                            const hCost = a.handlingCost || 0;
                            const baseInvestment = a.purchasePrice + fCost + mCost + mtCost + hCost;

                            return (
                              <tr key={a.id} className="hover:bg-slate-900/30">
                                <td className="py-2 font-bold text-white">{a.id}</td>
                                <td className="py-2 text-slate-300">₹{a.purchasePrice.toLocaleString()}</td>
                                <td className="py-2 text-right text-amber-500">₹{fCost.toLocaleString()}</td>
                                <td className="py-2 text-right text-emerald-400">₹{mCost.toLocaleString()}</td>
                                <td className="py-2 text-right text-cyan-400">₹{mtCost.toLocaleString()}</td>
                                <td className="py-2 text-right text-fuchsia-400">₹{hCost.toLocaleString()}</td>
                                <td className="py-2 text-right text-teal-400 font-black">₹{baseInvestment.toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
              
            </div>
          ) : renderAccessRestricted("Nutritional Sacks Allocation and Welfare Counter", ["Administrator", "Feed Shop"])
        )}

        {/* TAB 4: SHAREHOLDERS & CAPITAL INVESTMENTS */}
        {activeTab === "investors" && (
          isTabAllowed("investors", currentUser?.role) ? (
            <div className="space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Primary investor list */}
              <div className="lg:col-span-2 space-y-6 bg-slate-950 border border-slate-800 p-6 rounded-3xl">
                <div>
                  <h3 className="text-lg font-black text-white">{activeTrans.investorsTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage crowd-pooled investments from trade partners to acquire high dressing percentage varieties. Retain profits directly within dynamic shared accounts.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 font-mono text-xs uppercase bg-slate-900/30">
                        <th className="p-3">{activeTrans.investorName}</th>
                        <th className="p-3 text-right">Fund Balance Available</th>
                        <th className="p-3 text-right">Dividends Distributed</th>
                        <th className="p-3 text-right">Fund Allocation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 font-mono text-sm text-slate-300">
                      {investors.map((inv, i) => {
                        const totalCapital = investors.reduce((sum, v) => sum + v.balance, 0);
                        const pct = totalCapital > 0 ? (inv.balance / totalCapital) * 100 : 0;
                        return (
                          <tr key={i} className="hover:bg-slate-900/20">
                            <td className="p-3">
                              <span className="font-semibold text-white block">{inv.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">Weight: {Math.round(pct * 10) / 10}%</span>
                            </td>
                            <td className="p-3 text-right font-bold text-teal-400">₹{inv.balance.toLocaleString()}</td>
                            <td className="p-3 text-right font-bold text-emerald-400">₹{inv.profitEarned.toLocaleString()}</td>
                            <td className="p-3 text-right">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/10 uppercase font-black uppercase tracking-wider">
                                Fully Active
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Profit Distribution & Dividend Payout Logs */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                    <History className="h-4.5 w-4.5 text-teal-400" />
                    Profit Distribution & Dividend Payout Logs
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Audited ledger of automated dividend transactions disbursed down to trade shareholders.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 font-mono text-[10px] uppercase bg-slate-900/30">
                        <th className="p-3">Ref ID</th>
                        <th className="p-3">Payout Date</th>
                        <th className="p-3">Distribution Type</th>
                        <th className="p-3 text-right">Dividend Sum</th>
                        <th className="p-3 text-left">Shareholders Split</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 font-mono text-xs text-slate-300">
                      {payoutLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500 font-sans text-xs">
                            No dividend payouts initiated yet.
                          </td>
                        </tr>
                      ) : (
                        payoutLogs.map((log: any, index: number) => (
                          <tr key={index} className="hover:bg-slate-900/10">
                            <td className="p-3 font-bold text-teal-400">{log.id}</td>
                            <td className="p-3">{log.date}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                                log.type === "Capital Reinvestment" 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                  : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                              }`}>
                                {log.type}
                              </span>
                            </td>
                            <td className="p-3 text-right font-bold text-white">₹{log.totalProfit.toLocaleString()}</td>
                            <td className="p-3 text-left font-sans">
                              <div className="flex flex-wrap gap-1.5">
                                {log.split.map((s: any, si: number) => (
                                  <span key={si} className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-inner font-mono">
                                    {s.name}: <span className="font-bold text-emerald-400">₹{s.amount.toLocaleString()}</span> ({s.percentage}%)
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Livestock Profit Allocation Directory */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-6">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                    <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
                    Livestock Sales Profit Allocation Directory
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Calculate and display total profit earned by each investor, based on their contribution percentage and the total profit generated from livestock sales.
                  </p>
                </div>

                {/* Real-time statistics cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(() => {
                    const totalSalesRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
                    const totalProcessedAnimalsCost = animals
                      .filter(a => a.status === "Processed")
                      .reduce((sum, a) => sum + a.purchasePrice, 0);
                    const livestockProfitFromErp = Math.max(38500, totalSalesRevenue - totalProcessedAnimalsCost);
                    
                    return (
                      <>
                        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850">
                          <span className="text-[10px] text-slate-400 block uppercase font-mono">Total Sales Revenue</span>
                          <span className="text-base font-bold text-white font-mono">₹{totalSalesRevenue.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850">
                          <span className="text-[10px] text-slate-400 block uppercase font-mono">Total Processed Animal Cost</span>
                          <span className="text-base font-bold text-slate-300 font-mono">₹{totalProcessedAnimalsCost.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850">
                          <span className="text-[10px] text-emerald-400 block uppercase font-mono">Total Profit Generated</span>
                          <span className="text-base font-bold text-emerald-400 font-mono">₹{livestockProfitFromErp.toLocaleString()}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 font-mono text-[10px] uppercase bg-slate-900/30 font-bold">
                        <th className="p-3">Partner Name</th>
                        <th className="p-3 text-right font-mono">Contribution %</th>
                        <th className="p-3 text-right font-mono">Total Invested Capital</th>
                        <th className="p-3 text-right font-mono text-emerald-400">Profit Earned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 font-mono text-xs text-slate-300">
                      {(() => {
                        const totalSalesRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
                        const totalProcessedAnimalsCost = animals
                          .filter(a => a.status === "Processed")
                          .reduce((sum, a) => sum + a.purchasePrice, 0);
                        const livestockProfitFromErp = Math.max(38500, totalSalesRevenue - totalProcessedAnimalsCost);
                        const totalCapital = investors.reduce((sum, v) => sum + v.balance, 0);

                        return investors.map((inv, i) => {
                          const pct = totalCapital > 0 ? (inv.balance / totalCapital) * 100 : 0;
                          const profitShareEarned = (pct / 100) * livestockProfitFromErp;
                          return (
                            <tr key={i} className="hover:bg-slate-900/10">
                              <td className="p-3 font-semibold text-white font-sans">{inv.name}</td>
                              <td className="p-3 text-right font-medium text-slate-400">{Math.round(pct * 10) / 10}%</td>
                              <td className="p-3 text-right font-bold text-teal-400">₹{inv.balance.toLocaleString()}</td>
                              <td className="p-3 text-right font-bold text-emerald-400">₹{Math.round(profitShareEarned).toLocaleString()}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Capital Deposit */}
              <div className="space-y-6">
                
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-teal-400" />
                    {activeTrans.contributionAmount}
                  </h3>
                  
                  <form onSubmit={addFundingToPool} className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-500 uppercase mb-2">Select Shareholder Partner</label>
                      <select
                        value={selectedFundingInvestor}
                        onChange={(e) => setSelectedFundingInvestor(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      >
                        {investors.map((inv, i) => (
                          <option key={i} value={inv.name}>{inv.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-500 uppercase mb-2">Deposit Amount (₹)</label>
                      <input
                        type="number"
                        required
                        value={fundingAmount}
                        onChange={(e) => setFundingAmount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-teal-500 text-white font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold py-2.5 rounded-xl text-center text-xs transition"
                    >
                      Process Capital Deposit
                    </button>
                  </form>
                </div>

                {currentUser?.role === "Administrator" ? (
                  <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Coins className="h-5 w-5 text-teal-400" />
                        Initiate Profit Distribution
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Distribute accrued trade profits proportionally among shareholders based on current active contribution percentages.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-mono">Gross Profit Earned (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 25000"
                          value={distributeProfitAmount}
                          onChange={(e) => setDistributeProfitAmount(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-teal-500 text-white font-bold"
                        />
                      </div>

                      <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60 select-none">
                        <input
                          type="checkbox"
                          id="reinvestCheck"
                          checked={reinvestProfitAmount}
                          onChange={(e) => setReinvestProfitAmount(e.target.checked)}
                          className="h-4 w-4 bg-slate-900 rounded border-slate-800 text-teal-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <label htmlFor="reinvestCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                          Auto-Reinvest Dividend into Capital Balance
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={handleShowDistributionConfirm}
                        className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold py-2.5 rounded-xl text-center text-xs transition cursor-pointer"
                      >
                        Calculate & Distribute Dividend
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/40 border border-slate-900 p-5 rounded-3xl text-center">
                    <Lock className="h-5 w-5 mx-auto text-slate-600 opacity-40 mb-2" />
                    <p className="text-[11px] text-slate-500 font-mono">Administrator credentials required to distribute earnings.</p>
                  </div>
                )}

                <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h4 className="text-xs font-mono uppercase text-slate-400 tracking-widest font-bold">Community Rules</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Livestock trading shares are calculated proportionally based on carcass dressing metrics. AI splits the premium yields automatically upon physical processing.
                  </p>
                </div>

              </div>

            </div>

            {/* Profit Distribution Confirmation Modal */}
            {showDistributionModal && (
              <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 animate-scaleIn">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-amber-500" />
                        Confirm Profit Distribution
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Review the calculated proportional dividend payments before initiating payout ledger entries.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDistributionModal(false)}
                      className="text-slate-500 hover:text-white transition cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between text-[10px] font-mono border-b border-slate-900 pb-2">
                      <span className="text-slate-500 font-bold uppercase">Shareholder Partner</span>
                      <span className="text-slate-500 font-bold uppercase">Proportional Share (₹)</span>
                    </div>

                    <div className="space-y-2.5">
                      {(() => {
                        const profitVal = Number(distributeProfitAmount) || 0;
                        const totalCapital = investors.reduce((sum, inv) => sum + inv.balance, 0);
                        return investors.map((inv, idx) => {
                          const pct = totalCapital > 0 ? (inv.balance / totalCapital) * 100 : 0;
                          const amt = totalCapital > 0 ? (inv.balance / totalCapital) * profitVal : 0;
                          return (
                            <div key={idx} className="flex justify-between items-center text-xs font-mono">
                              <div className="space-y-0.5">
                                <span className="text-white font-bold block">{inv.name}</span>
                                <span className="text-[10px] text-slate-500">Weight: {Math.round(pct * 10) / 10}%</span>
                              </div>
                              <span className="text-emerald-400 font-black text-sm">₹{Math.round(amt).toLocaleString()}</span>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    <div className="border-t border-slate-900 pt-3 flex justify-between items-center text-xs font-mono font-bold text-white">
                      <span>Total Distributed Profit:</span>
                      <span className="text-amber-500 text-base font-black">₹{(Number(distributeProfitAmount) || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5">
                    <span className="p-1 rounded bg-amber-500/10 text-amber-500 text-xs inline-block">💡</span>
                    <p className="leading-relaxed">
                      Mode is set to <strong className="text-white font-mono">{reinvestProfitAmount ? "Capital Reinvestment" : "Cash Dividend Distribution"}</strong>.
                      {reinvestProfitAmount 
                        ? " Accrued dividend credits will automatically roll back into the active investment capital balances of each shareholder." 
                        : " Disbursed cash will be subtracted from the company's dynamic vault cash reserves."}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDistributionModal(false)}
                      className="flex-1 bg-slate-950 border border-slate-800 hover:bg-slate-850 hover:text-white text-slate-300 font-bold py-2.5 rounded-xl text-center text-xs transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDistribution}
                      className="flex-1 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold py-2.5 rounded-xl text-center text-xs transition cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      Confirm & Pay
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
          ) : renderAccessRestricted("Shareholders & Investor Capital Ledger", ["Administrator"])
        )}

        {/* TAB 5: SCIENTIFIC YIELD ESTIMATOR */}
        {activeTab === "ai-assistant" && (
          isTabAllowed("ai-assistant", currentUser?.role) ? (
            <div className="space-y-8 animate-fadeIn text-slate-100">
            
              {/* Scientific carcass dressing calculator */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Input Panel Card */}
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-5">
                  <div className="border-b border-slate-900 pb-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Scale className="h-5.5 w-5.5 text-teal-400" />
                      Carcass Yield Calculator
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Calculate standard edible dressing yields and expected wholesale-to-retail cuts margins based on live animal weight and class coefficients.
                    </p>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-500 uppercase font-mono mb-1">Livestock Class</label>
                        <select 
                          value={predictInputs.type}
                          onChange={(e) => {
                            const selectedType = e.target.value;
                            const breeds = getBreedsForType(selectedType);
                            setPredictInputs({ ...predictInputs, type: selectedType, breed: breeds[0] });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                        >
                          <option value="Cow">Cattle / Cow (গরু)</option>
                          <option value="Goat">Black Bengal Goat (ছাগল)</option>
                          <option value="Buffalo">Buffalo (মহিষ)</option>
                          <option value="Sheep">Sheep (ভেড়া)</option>
                          <option value="Mithun">Mithun (গয়াল)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-500 uppercase font-mono mb-1">Breed / জাত</label>
                        <select 
                          value={predictInputs.breed}
                          onChange={(e) => setPredictInputs({...predictInputs, breed: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none"
                        >
                          {getBreedsForType(predictInputs.type).map((breed) => (
                            <option key={breed} value={breed}>
                              {breed}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-500 uppercase font-mono mb-1">Live Weight (kg)</label>
                        <input 
                          type="number" 
                          value={predictInputs.weightKg}
                          onChange={(e) => setPredictInputs({...predictInputs, weightKg: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-center font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 uppercase font-mono mb-1">Purchase Valuation (₹)</label>
                        <input 
                          type="number" 
                          value={predictInputs.purchasePrice}
                          onChange={(e) => setPredictInputs({...predictInputs, purchasePrice: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-teal-400 text-center font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 uppercase font-mono mb-1">Feed Regimen</label>
                        <input 
                          type="text" 
                          value={predictInputs.feedType}
                          onChange={(e) => setPredictInputs({...predictInputs, feedType: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 uppercase font-mono mb-1">Age in Months</label>
                        <input 
                          type="text" 
                          value={predictInputs.ageMonths}
                          onChange={(e) => setPredictInputs({...predictInputs, ageMonths: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-center"
                        />
                      </div>
                    </div>

                    <button
                      onClick={runAiPreEstimate}
                      disabled={predicting}
                      className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400 font-extrabold py-3.5 rounded-xl uppercase tracking-wider transition text-xs mt-3 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${predicting ? 'animate-spin' : ''}`} />
                      {predicting ? "Processing Weights..." : "Calculate Yield"}
                    </button>

                  </div>
                </div>

                {/* Calculation Output Panel Card */}
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl min-h-[400px] flex flex-col">
                  <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-900 pb-2.5">
                    <TrendingUp className="h-5 w-5 text-teal-400" />
                    Estimation Output
                  </h4>

                  {predicting ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-500 text-sm py-12">
                      <span className="h-10 w-10 border-4 border-t-teal-500 border-r-transparent border-slate-800 rounded-full animate-spin" />
                      <p className="font-mono text-center px-6">Evaluating South Asian dressing coefficients, breed variables & current retail margin rate...</p>
                    </div>
                  ) : aiPrediction ? (
                    <div className="space-y-5 flex-1 flex flex-col justify-between text-xs">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                          <span className="text-[10px] text-slate-500 uppercase">Estimated Yield Weight</span>
                          <p className="text-xl font-black text-white font-mono mt-1">{aiPrediction.expectedYieldKg} kg</p>
                          <span className="text-[10px] text-teal-400 font-bold">({Math.round(aiPrediction.yieldRatio * 100)}% Dressing Rate)</span>
                        </div>
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                          <span className="text-[10px] text-slate-500 uppercase">Target Revenue</span>
                          <p className="text-xl font-black text-emerald-400 font-mono mt-1">₹{aiPrediction.expectedRevenue.toLocaleString()}</p>
                          <span className="text-[10px] text-slate-400 font-mono">Profit: ₹{aiPrediction.predictedProfit.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Breakdown listing */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Retail Cuts Breakup</h5>
                        <div className="space-y-1 max-h-[140px] overflow-y-auto">
                          {aiPrediction.yieldBreakdown?.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between items-center bg-slate-900 border border-slate-800 p-2 text-xs font-mono rounded">
                              <span className="text-slate-300 font-semibold">{item.item}</span>
                              <span className="text-white">{item.quantityKg} kg • ₹{item.estimatedPricePerKg}/kg &rarr; ₹{item.subtotal}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Regional Strategy Info */}
                      <div className="p-3.5 bg-slate-900 rounded-xl text-xs space-y-2 border border-slate-800">
                        <div className="flex justify-between border-b border-slate-800 pb-1 mb-1">
                          <span className="text-teal-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Retail Strategy Advice
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-sans">{aiPrediction.aiAnalysis}</p>
                        <p className="text-slate-400 leading-relaxed pt-2 border-t border-slate-800/60 font-medium">{aiPrediction.bengaliAnalysis}</p>
                      </div>

                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-600 font-mono">
                      <Activity className="h-10 w-10 text-slate-700/60 mb-3 animate-pulse" />
                      <p className="text-xs">Provide live weight parameters and tap 'Calculate Yield' to instantly evaluate carcass dressed portions and target sales margins.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ) : renderAccessRestricted("Scientific Yield Estimator", ["Administrator"])
        )}

        {/* TAB 6: BUTCHER SHOPS & OUTLETS SLAUGHTER COLS */}
        {activeTab === "butchers" && (
          isTabAllowed("butchers", currentUser?.role) ? (
            <div className="space-y-6 animate-fadeIn">
              <ButcherShopsSection 
                animals={animals}
                onUpdateAnimalStatus={handleUpdateAnimalStatusFromButcher}
                onAddMeatStock={(yields) => {
                  setMeatStock(prev => ({
                    ...prev,
                    beef: (prev.beef || 0) + (yields.beef || 0),
                    mutton: (prev.mutton || 0) + (yields.mutton || 0),
                    buffalo: (prev.buffalo || 0) + (yields.buffalo || 0),
                    bones: (prev.bones || 0) + (yields.bones || 0),
                    organs: (prev.organs || 0) + (yields.organs || 0)
                  }));
                  recordOfflineChange(`Credited actual carcass portions to counter stock display (beef/buffalo/mutton)`);
                }}
                dispatches={butcherDispatches}
                onUpdateDispatches={setButcherDispatches}
              />
            </div>
          ) : renderAccessRestricted("Butcher Shops Outlet Tracker", ["Administrator", "Butcher Shop"])
        )}

      </main>

      {/* FOOTER BAR */}
      <footer className="border-t border-slate-800 py-6 px-6 bg-slate-950/40 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 ShaieAlam LiveStock ERP. Solid Offline Availability System for remote markets.</p>
          <div className="flex gap-4 font-mono">
            <span className="text-teal-500">Halal Hygienic Standard compliant</span>
            <span>•</span>
            <span className="text-teal-500">Bilingual Module</span>
          </div>
        </div>
      </footer>

      {/* DIALOG DICTIONARY MODALS */}

      {/* INVESTMENT CALCULATOR MODAL */}
      {showInvestmentCalcModal && (
        <div id="investment-calculator-modal" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl w-full max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 bg-teal-500/10 rounded-xl flex items-center justify-center border border-teal-500/20">
                  <Calculator className="h-5.5 w-5.5 text-teal-400 font-bold" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white leading-normal">
                    Herd Capital Investment & Growth Profit Calculator
                  </h4>
                  <p className="text-xs text-slate-400">
                    Simulate nutrition-driven mass accrual, feeding regimens, and projected commercial returns.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowInvestmentCalcModal(false)} 
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Calculator Body GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs text-slate-300">
              
              {/* Left Column: Parameter Inputs (Col span 5) */}
              <div className="lg:col-span-5 space-y-5 border-r border-slate-800/60 pr-0 lg:pr-6">
                <div id="calc-inputs" className="space-y-4">
                  <h5 className="text-[11px] font-black uppercase text-teal-400 tracking-wider font-mono">
                    1. Growth & Asset Baseline
                  </h5>

                  {/* Animal Type Selector */}
                  <div>
                    <label className="block text-slate-400 uppercase text-[9px] font-bold tracking-wider mb-1">Livestock Class</label>
                    <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl">
                      {["Cow", "Goat", "Buffalo"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setCalcAnimalType(t);
                            // auto-tune parameters depending on type
                            if (t === "Goat") {
                              setCalcInitialWeight(25);
                              setCalcPurchasePrice(8500);
                              setCalcDailyWeightGain(0.15);
                              setCalcDailyFeedCost(25);
                              setCalcMedicineCost(805);
                              setCalcOtherCosts(500);
                              setCalcDressingPercent(48);
                              setCalcProjectedMeatPrice(750);
                              setCalcProjectedByproducts(850);
                            } else if (t === "Buffalo") {
                              setCalcInitialWeight(320);
                              setCalcPurchasePrice(85000);
                              setCalcDailyWeightGain(0.9);
                              setCalcDailyFeedCost(180);
                              setCalcMedicineCost(3500);
                              setCalcOtherCosts(2500);
                              setCalcDressingPercent(50);
                              setCalcProjectedByproducts(6500);
                            } else {
                              setCalcInitialWeight(220);
                              setCalcPurchasePrice(55000);
                              setCalcDailyWeightGain(0.75);
                              setCalcDailyFeedCost(140);
                              setCalcMedicineCost(2500);
                              setCalcOtherCosts(1800);
                              setCalcDressingPercent(52);
                              setCalcProjectedByproducts(4505);
                            }
                          }}
                          className={`py-1.5 rounded-lg text-center font-bold text-[10px] uppercase transition ${
                            calcAnimalType === t 
                              ? "bg-teal-500 text-slate-950 font-black" 
                              : "text-slate-400 hover:text-white hover:bg-slate-900"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Baseline Parameters Input Row */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-slate-400 uppercase text-[9px] font-bold tracking-wider mb-1">
                        Initial Weight (Kg)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1200"
                        value={calcInitialWeight}
                        onChange={(e) => setCalcInitialWeight(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 uppercase text-[9px] font-bold tracking-wider mb-1">
                        Purchase Cost (৳)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={calcPurchasePrice}
                        onChange={(e) => setCalcPurchasePrice(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Growth Duration Range */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-slate-400 uppercase text-[9px] font-bold tracking-wider">
                        Growth Period (Weeks)
                      </label>
                      <span className="text-teal-400 font-mono font-bold">{calcGrowthWeeks} Weeks ({calcGrowthWeeks * 7} Days)</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="52"
                      step="4"
                      value={calcGrowthWeeks}
                      onChange={(e) => setCalcGrowthWeeks(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono px-0.5 mt-1">
                      <span>4W (1mo)</span>
                      <span>24W (6mo)</span>
                      <span>52W (1yr)</span>
                    </div>
                  </div>

                  <hr className="border-slate-800/65" />

                  <h5 className="text-[11px] font-black uppercase text-teal-400 tracking-wider font-mono">
                    2. Nutrition & Feed Scenarios
                  </h5>

                  {/* Feed Quality Presets */}
                  <div>
                    <label className="block text-slate-400 uppercase text-[9px] font-bold tracking-wider mb-1.5">
                      Operational Rations Preset
                    </label>
                    <div className="space-y-1.5">
                      {[
                        {
                          id: "grazing",
                          name: "Low-Cost Free Grazing",
                          desc: "Mainly grass. Slow weight gain, micro overhead.",
                          gain: calcAnimalType === "Goat" ? 0.08 : calcAnimalType === "Buffalo" ? 0.5 : 0.4,
                          feedCost: calcAnimalType === "Goat" ? 10 : calcAnimalType === "Buffalo" ? 80 : 60,
                        },
                        {
                          id: "standard",
                          name: "Standard Concentrates",
                          desc: "Daily straw, wheat bran & standard concentrates.",
                          gain: calcAnimalType === "Goat" ? 0.15 : calcAnimalType === "Buffalo" ? 0.9 : 0.75,
                          feedCost: calcAnimalType === "Goat" ? 25 : calcAnimalType === "Buffalo" ? 180 : 140,
                        },
                        {
                          id: "premium",
                          name: "High-Protein Premium Feed",
                          desc: "Commercial silage, corn meals, mineral blocks.",
                          gain: calcAnimalType === "Goat" ? 0.22 : calcAnimalType === "Buffalo" ? 1.3 : 1.1,
                          feedCost: calcAnimalType === "Goat" ? 45 : calcAnimalType === "Buffalo" ? 280 : 220,
                        }
                      ].map((preset) => {
                        const isSelected = Math.abs(calcDailyFeedCost - preset.feedCost) < 5 && Math.abs(calcDailyWeightGain - preset.gain) < 0.05;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setCalcDailyWeightGain(preset.gain);
                              setCalcDailyFeedCost(preset.feedCost);
                            }}
                            className={`w-full text-left p-2 rounded-xl transition border text-[10px] leading-tight flex justify-between items-center ${
                              isSelected 
                                ? "bg-teal-500/10 border-teal-500/35 text-teal-300" 
                                : "bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-400"
                            }`}
                          >
                            <div className="max-w-[70%] text-left">
                              <p className="font-bold text-white">{preset.name}</p>
                              <p className="text-[8px] text-slate-500 font-sans mt-0.5">{preset.desc}</p>
                            </div>
                            <div className="text-right font-mono">
                              <p className="text-teal-400 font-bold">+{preset.gain} Kg/day</p>
                              <p className="text-[9px] text-slate-500 font-black">৳{preset.feedCost}/day</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Manual Override Slider for feed cost & gains */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-950/45 p-2.5 rounded-xl border border-slate-850/80">
                    <div>
                      <label className="block text-slate-400 uppercase text-[8px] mb-0.5 font-bold">
                        Daily Feed Cost (৳)
                      </label>
                      <input
                        type="number"
                        value={calcDailyFeedCost}
                        onChange={(e) => setCalcDailyFeedCost(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white font-mono focus:border-teal-500 outline-none text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 uppercase text-[8px] mb-0.5 font-bold">
                        Avg Weight Gain (Kg/day)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={calcDailyWeightGain}
                        onChange={(e) => setCalcDailyWeightGain(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white font-mono focus:border-teal-500 outline-none text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Outcomes & Metrics Displays (Col span 7) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                
                {/* Math Calculations */}
                {(() => {
                  const totalDays = calcGrowthWeeks * 7;
                  const totalFeedCost = totalDays * calcDailyFeedCost;
                  const totalInvestment = calcPurchasePrice + totalFeedCost + calcMedicineCost + calcOtherCosts;
                  
                  const weightAcquired = totalDays * calcDailyWeightGain;
                  const finalWeight = calcInitialWeight + weightAcquired;
                  const dressingWeight = finalWeight * (calcDressingPercent / 100);
                  
                  const usableMeatRevenues = dressingWeight * calcProjectedMeatPrice;
                  const totalRevenues = usableMeatRevenues + calcProjectedByproducts;
                  
                  const netProfit = totalRevenues - totalInvestment;
                  const percentageROI = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
                  const isProfit = netProfit >= 0;

                  return (
                    <div className="space-y-5 flex-1">
                      
                      {/* Interactive Live Metrics Bento Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-950 border border-slate-850 rounded-2xl p-3 flex flex-col justify-between">
                          <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-sans">Final Total Weight</p>
                          <div className="mt-1">
                            <span className="text-xl font-black font-mono text-teal-400">{finalWeight.toFixed(1)}</span>
                            <span className="text-[9px] text-slate-500 font-bold uppercase ml-0.5">Kg</span>
                          </div>
                          <p className="text-[8px] text-slate-400 mt-1 font-mono font-sans">
                            +{weightAcquired.toFixed(1)} Kg gain ({totalDays} days)
                          </p>
                        </div>

                        <div className="bg-slate-950 border border-slate-850 rounded-2xl p-3 flex flex-col justify-between">
                          <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-sans">Dressing Yield</p>
                          <div className="mt-1">
                            <span className="text-xl font-black font-mono text-teal-300">{dressingWeight.toFixed(1)}</span>
                            <span className="text-[9px] text-slate-500 font-bold uppercase ml-0.5">Kg</span>
                          </div>
                          <p className="text-[8px] text-slate-400 mt-1 font-mono font-sans">
                            At {calcDressingPercent}% dressing ratio
                          </p>
                        </div>

                        <div className="bg-slate-950 border border-slate-850 rounded-2xl p-3 flex flex-col justify-between">
                          <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-sans">Total Operation Cost</p>
                          <div className="mt-1">
                            <span className="text-xl font-black font-mono text-white">৳{Math.round(totalFeedCost).toLocaleString()}</span>
                          </div>
                          <p className="text-[8px] text-slate-400 mt-1 font-mono font-sans text-amber-400">
                            Feed: ৳{totalFeedCost.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Main ROI Impact Banner Card */}
                      <div className={`rounded-3xl p-4 border flex items-center justify-between gap-4 shadow-lg ${
                        isProfit 
                          ? "bg-slate-950 border-emerald-500/20 text-emerald-400 shadow-emerald-950/5" 
                          : "bg-slate-950 border-rose-500/20 text-rose-400 shadow-rose-950/5"
                      }`}>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Projected Net Returns</p>
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className={`text-3xl font-black font-mono ${isProfit ? "text-emerald-400" : "text-rose-400"}`}>
                              ৳{isProfit ? "+" : ""}{Math.round(netProfit).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-505 font-bold font-sans uppercase">Net profit</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[9px] leading-tight text-slate-400">
                            <span>Total Outlay: ৳{Math.round(totalInvestment).toLocaleString()}</span>
                            <span>•</span>
                            <span>Gross Rev: ৳{Math.round(totalRevenues).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className={`px-4 py-2.5 rounded-2xl border text-center shrink-0 min-w-[90px] ${
                          isProfit 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" 
                            : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                        }`}>
                          <p className="text-[8px] uppercase font-black tracking-widest font-sans opacity-75">ROI Rate</p>
                          <p className="text-xl font-bold font-mono mt-0.5">{percentageROI.toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* Commercial Modeling Details */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-950/30 p-3.5 border border-slate-850/80 rounded-2xl">
                        <div className="space-y-3">
                          <h6 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-850/60 pb-1 font-mono">
                            Revenues Breakdown
                          </h6>
                          <div className="space-y-1.5 text-[11px] font-mono p-0.5 font-sans">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Boneless Meat Yield:</span>
                              <span className="text-white">৳{Math.round(usableMeatRevenues).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500" title="Includes leather hide, bones & organic fertilizer value">Byproducts & Hides:</span>
                              <span className="text-white">৳{calcProjectedByproducts.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-850/50 pt-1 text-teal-400 font-extrabold text-[11px]">
                              <span>Gross Revenue:</span>
                              <span>৳{Math.round(totalRevenues).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h6 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-850/60 pb-1 font-mono">
                            Expenditure Breakdown
                          </h6>
                          <div className="space-y-1.5 text-[11px] font-mono p-0.5 font-sans">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Purchase Cost:</span>
                              <span className="text-white">৳{calcPurchasePrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Feeding Overheads:</span>
                              <span className="text-teal-400">৳{totalFeedCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Vet & Medicines:</span>
                              <span className="text-white">৳{calcMedicineCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-850/50 pt-1 text-slate-400 font-extrabold text-[11px]">
                              <span>Total Capital Outlay:</span>
                              <span>৳{Math.round(totalInvestment).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Yield Fine-Tuning controls */}
                      <div className="grid grid-cols-3 gap-3 bg-slate-950/20 p-2.5 rounded-xl border border-slate-850/50">
                        <div>
                          <label className="block text-slate-500 uppercase text-[8px] mb-0.5 font-bold">Dressing %</label>
                          <input
                            type="number"
                            value={calcDressingPercent}
                            onChange={(e) => setCalcDressingPercent(Number(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white font-mono text-[10px]"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 uppercase text-[8px] mb-0.5 font-bold">Projected Meat ৳/kg</label>
                          <input
                            type="number"
                            value={calcProjectedMeatPrice}
                            onChange={(e) => setCalcProjectedMeatPrice(Number(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white font-mono text-[10px]"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 uppercase text-[8px] mb-0.5 font-bold font-sans">Skin/Dung Val ৳</label>
                          <input
                            type="number"
                            value={calcProjectedByproducts}
                            onChange={(e) => setCalcProjectedByproducts(Number(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white font-mono text-[10px]"
                          />
                        </div>
                      </div>

                    </div>
                  );
                })()}

                {/* Simulated Pricing Action Bar */}
                <div className="border-t border-slate-800/60 pt-4 flex gap-3.5 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowInvestmentCalcModal(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Dismiss Simulator
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Apply computed statistics model back to the livestock creation state
                      const totalDays = calcGrowthWeeks * 7;
                      const totalFeed = totalDays * calcDailyFeedCost;
                      const weightGain = totalDays * calcDailyWeightGain;
                      const finalEstimatedWeight = calcInitialWeight + weightGain;

                      setNewAnimal(prev => ({
                        ...prev,
                        type: calcAnimalType as any,
                        weightKg: Math.round(finalEstimatedWeight),
                        purchasePrice: calcPurchasePrice,
                        feedType: calcDailyFeedCost > 200 ? "Premium Feed (Silage)" : "Standard Concentrates",
                        feedCost: totalFeed,
                        medicineCost: calcMedicineCost,
                        maintenanceCost: calcOtherCosts,
                        notes: `Simulated with growth model: +${calcDailyWeightGain} Kg/day over ${calcGrowthWeeks} weeks. Est. Initial Weight: ${calcInitialWeight} Kg.`
                      }));
                      
                      setShowInvestmentCalcModal(false);
                      // If Add Animal Modal is not open, trigger it so user can complete finalizing!
                      if (!showAddAnimalModal) {
                        setShowAddAnimalModal(true);
                      }
                    }}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-5 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 select-none shadow-md shadow-teal-500/10"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Apply Model to Purchase Draft
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* Modal 1: Add Animal Purchase Custom Sheet */}
      {showAddAnimalModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-teal-400" />
                {activeTrans.addAnimalBtn}
              </h4>
              <button onClick={() => setShowAddAnimalModal(false)} className="text-slate-400 p-1 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddAnimal} className="space-y-4 text-xs">
              
              {/* Investment Optimizer Simulator integration */}
              <div className="bg-teal-500/10 border border-teal-500/15 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4.5 w-4.5 text-teal-400 shrink-0" />
                  <div>
                    <div className="text-[11px] font-extrabold text-teal-300">Investment Profit Calculator</div>
                    <div className="text-[9px] text-slate-400">Simulate projected weight growth & feed cost scenarios.</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    openInvestmentCalculator(
                      newAnimal.type || "Cow",
                      newAnimal.weightKg || 220,
                      newAnimal.purchasePrice || 45000
                    );
                  }}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[9px] uppercase tracking-wide transition flex items-center gap-1 shrink-0 select-none shadow"
                >
                  <TrendingUp className="h-3 w-3" />
                  Simulate Profits
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Animal Class</label>
                  <select
                    value={newAnimal.type}
                    onChange={(e) => {
                      const selectedType = e.target.value as any;
                      const breeds = getBreedsForType(selectedType);
                      setNewAnimal({ ...newAnimal, type: selectedType, breed: breeds[0] });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Cow">Cow (গরু)</option>
                    <option value="Goat">Goat (ছাগল)</option>
                    <option value="Buffalo">Buffalo (মহিষ)</option>
                    <option value="Sheep">Sheep (ভেড়া)</option>
                    <option value="Mithun">Mithun (গয়াল)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Breed / নির্দিষ্ট জাত</label>
                  <select
                    required
                    value={newAnimal.breed || getBreedsForType(newAnimal.type || "Cow")[0]}
                    onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-teal-500"
                  >
                    {getBreedsForType(newAnimal.type || "Cow").map((breed) => (
                      <option key={breed} value={breed}>
                        {breed}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Owner / Seller Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shaie"
                    value={newAnimal.owner}
                    onChange={(e) => setNewAnimal({ ...newAnimal, owner: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Live weight (kg)</label>
                  <input
                    type="number"
                    required
                    value={newAnimal.weightKg}
                    onChange={(e) => setNewAnimal({ ...newAnimal, weightKg: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Total agreed purchase price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newAnimal.purchasePrice}
                    onChange={(e) => setNewAnimal({ ...newAnimal, purchasePrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Advance Token Paid (₹)</label>
                  <input
                    type="number"
                    required
                    value={newAnimal.advancePaid}
                    onChange={(e) => setNewAnimal({ ...newAnimal, advancePaid: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1 font-sans">Purchase Date / ক্রয়ের তারিখ</label>
                  <input
                    type="date"
                    required
                    value={newAnimal.dateAdded || ""}
                    onChange={(e) => setNewAnimal({ ...newAnimal, dateAdded: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-mono text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1 font-sans">Health Condition (Rating 1-10)</label>
                  <select
                    value={newAnimal.healthCondition || "8/10 (Good)"}
                    onChange={(e) => setNewAnimal({ ...newAnimal, healthCondition: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-teal-500 font-mono"
                  >
                    <option value="10/10 (Excellent)">10/10 - Excellent</option>
                    <option value="9/10 (Very Good)">9/10 - Very Good</option>
                    <option value="8/10 (Good)">8/10 - Good</option>
                    <option value="7/10 (Fair)">7/10 - Fair</option>
                    <option value="6/10 (Satisfactory)">6/10 - Satisfactory</option>
                    <option value="5/10 (Average)">5/10 - Average</option>
                    <option value="4/10 (Below Average)">4/10 - Below Average</option>
                    <option value="3/10 (Poor)">3/10 - Poor</option>
                    <option value="2/10 (Sick)">2/10 - Sick</option>
                    <option value="1/10 (Critical)">1/10 - Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1 text-[11px] tracking-wider">Exact Birthdate</label>
                <input
                  type="date"
                  required
                  value={newAnimal.birthDate || ""}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const calculatedMonths = getMonthsFromBirthdate(selectedDate);
                    setNewAnimal({ 
                      ...newAnimal, 
                      birthDate: selectedDate,
                      ageMonths: calculatedMonths
                    });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-mono text-xs focus:outline-none focus:border-teal-500"
                />
                <div className="text-[9px] text-teal-400 mt-1 font-mono text-right">
                  Calculated: {(() => {
                    const { years, months } = calculatePreciseAge(newAnimal.birthDate);
                    return `${years > 0 ? `${years} yr ` : ""}${months} mo`;
                  })()}
                </div>
              </div>

              {/* Optional Supplier Due Date */}
              {Number(newAnimal.purchasePrice) - Number(newAnimal.advancePaid) > 0 && (
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Supplier Due Date (বকেয়ার তারিখ)</label>
                  <input
                    type="date"
                    required
                    value={newAnimal.dueDate || ""}
                    onChange={(e) => setNewAnimal({ ...newAnimal, dueDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono text-center text-xs focus:outline-none focus:border-teal-500"
                  />
                  <p className="text-[9px] text-teal-400/80 mt-1 font-mono">Outstanding balance of ₹{(Number(newAnimal.purchasePrice) - Number(newAnimal.advancePaid)).toLocaleString()} is due to owner on this date.</p>
                </div>
              )}

              {/* Color and Appearance auto-recording fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1 font-sans">Colour / গায়ের রঙ (Auto-recorded by AI)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red-Brown, Black & White"
                    value={newAnimal.color || ""}
                    onChange={(e) => setNewAnimal({ ...newAnimal, color: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1 font-sans">Physical Appearance (Appearance / বাহ্যিক রূপ)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robust hump, glossy coat"
                    value={newAnimal.appearance || ""}
                    onChange={(e) => setNewAnimal({ ...newAnimal, appearance: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-2 border-t border-b border-slate-800 py-3">
                <label className="block text-slate-300 uppercase text-[10px] tracking-wider font-extrabold flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-teal-400" />
                  Animal Photos / প্রাণীর ছবি (Required 4-side view)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: "Front / সামনে", key: "front", state: frontImage, setter: setFrontImage },
                    { label: "Left / বাম দিক", key: "left", state: leftSideImage, setter: setLeftSideImage },
                    { label: "Right / ডান দিক", key: "right", state: rightSideImage, setter: setRightSideImage },
                    { label: "Back / পেছনে", key: "back", state: backsideImage, setter: setBacksideImage }
                  ].map((imgItem) => (
                    <div key={imgItem.key} className="relative group bg-slate-950 border border-slate-800 hover:border-teal-500/50 rounded-xl p-2 flex flex-col items-center justify-center text-center transition min-h-[90px] h-24 overflow-hidden">
                      {imgItem.state ? (
                        <>
                          <img src={imgItem.state} alt={imgItem.label} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-1">
                            <button
                              type="button"
                              onClick={() => imgItem.setter("")}
                              className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 text-[10px]"
                            >
                              Reset
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-1">
                          <Camera className="h-4 w-4 text-slate-500 group-hover:text-teal-400 transition mb-1" />
                          <span className="text-[9px] font-sans text-slate-400 font-bold block">{imgItem.label}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleCompressAndSetImage(f, imgItem.setter);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Teeth Photo Upload Block */}
              <div className="bg-slate-950 p-3 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-teal-500/10 text-teal-400 rounded-lg">
                    <Camera className="h-4 w-4 text-teal-400" />
                  </span>
                  <div>
                    <label className="text-slate-300 font-bold uppercase tracking-wide text-[10px]">Cattle Teeth Photo / দাঁতের ছবি</label>
                    <p className="text-[9px] text-slate-500 mt-0.5">Used by AI Veterinarian to track the cattle age via incisors.</p>
                  </div>
                </div>

                <div className="relative group bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-xl p-3 flex flex-col items-center justify-center text-center transition min-h-[90px] h-28 overflow-hidden">
                  {teethImage ? (
                    <>
                      <img src={teethImage} alt="Teeth Preview" className="absolute inset-0 w-full h-full object-contain rounded-xl" />
                      <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-1">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-805">Uploaded</span>
                        <button
                          type="button"
                          onClick={() => setTeethImage("")}
                          className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 text-[10px] px-2"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-2">
                      <Camera className="h-5 w-5 text-teal-400 group-hover:text-teal-300 transition mb-1.5" />
                      <span className="text-[10px] font-bold text-slate-300 block">Upload Teeth Photo</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">Click to browse teeth photo/brush</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleCompressAndSetImage(f, setTeethImage);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Premium AI Scan button */}
              <div className="bg-slate-950 p-3.5 border border-teal-500/15 rounded-2xl text-center space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-teal-400 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse text-teal-400" />
                    AI Diagnostics
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">Gemini Multimodal Pro</span>
                </div>
                <p className="text-[10px] text-left text-slate-400 leading-relaxed font-sans mt-1">
                  Instruct veterinary vision model to auto-detect cattle breed, coat colors, and count permanent incisors to accurately log age in months.
                </p>

                <button
                  type="button"
                  disabled={isAnalyzingCattle || (!frontImage && !teethImage)}
                  onClick={async () => {
                    setIsAnalyzingCattle(true);
                    setAiAnalysisResult("");
                    try {
                      const res = await fetch("/api/analyze-cattle", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          frontImage,
                          teethImage,
                          animalType: newAnimal.type || "Cow"
                        })
                      });
                      if (res.ok) {
                        const data = await res.json();
                        setNewAnimal(prev => ({
                          ...prev,
                          breed: data.breed,
                          color: data.color,
                          appearance: data.appearance,
                          ageMonths: data.ageMonths,
                          birthDate: new Date(Date.now() - data.ageMonths * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
                        }));
                        setAiAnalysisResult(`Success! Detected ${data.breed} (${data.color}), Age: ~${data.ageMonths} months. Teeth: ${data.ageExplanation}`);
                      } else {
                        throw new Error("Analysis failed");
                      }
                    } catch (err) {
                      setAiAnalysisResult("Error: Unable to connect to diagnostic server. Please verify connections.");
                    } finally {
                      setIsAnalyzingCattle(false);
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition select-none ${
                    isAnalyzingCattle 
                      ? "bg-slate-900 border border-slate-805 text-teal-450" 
                      : (frontImage || teethImage)
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black cursor-pointer shadow-md"
                        : "bg-slate-900 border border-slate-850 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {isAnalyzingCattle ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Veterinary AI Auditing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{(!frontImage && !teethImage) ? "Upload Photos to Unlock AI Scan" : "Analyze Cattle via Gemini"}</span>
                    </>
                  )}
                </button>

                {aiAnalysisResult && (
                  <div className={`text-left p-3 rounded-xl border leading-relaxed font-mono text-[10px] ${
                    aiAnalysisResult.startsWith("Error") 
                      ? "bg-rose-500/10 border-rose-500/25 text-rose-400" 
                      : "bg-teal-500/5 border-teal-500/20 text-teal-300"
                  }`}>
                    {aiAnalysisResult}
                  </div>
                )}
              </div>

              {/* Bazar Purchase Tracking */}
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-slate-300 uppercase text-[10px] tracking-wider font-extrabold flex items-center gap-1.5">
                      <Receipt className="h-3.5 w-3.5 text-amber-500" />
                      Purchased from Bazar / হাট থেকে কেনা?
                    </label>
                    <p className="text-[9px] text-slate-500 mt-0.5">Check if this livestock was purchased from a public livestock bazar.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFromBazar}
                    onChange={(e) => setIsFromBazar(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-teal-500 focus:ring-teal-500 h-5 w-5 cursor-pointer"
                  />
                </div>

                {isFromBazar && (
                  <div className="space-y-3 pt-2.5 border-t border-slate-900 animate-fadeIn">
                    <div>
                      <label className="block text-slate-450 uppercase mb-1 text-[9px] font-extrabold text-slate-400">Bazar Receipt Image / হাটের রসিদ বা হাসিল (Required)</label>
                      <div className="relative group bg-slate-900 border border-slate-800 hover:border-teal-500/55 rounded-xl p-3 flex flex-col items-center justify-center text-center transition min-h-[90px] h-28 overflow-hidden">
                        {bazarReceiptImage ? (
                          <>
                            <img src={bazarReceiptImage} alt="Receipt Preview" className="absolute inset-0 w-full h-full object-contain rounded-xl" />
                            <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-1">
                              <span className="text-[9px] font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Uploaded</span>
                              <button
                                type="button"
                                onClick={() => setBazarReceiptImage("")}
                                className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 text-[10px] px-2"
                              >
                                Remove
                              </button>
                            </div>
                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-2">
                            <Receipt className="h-5 w-5 text-amber-400 group-hover:text-teal-400 transition mb-1.5" />
                            <span className="text-[10px] font-bold text-slate-300 block">Upload Bazar Receipt</span>
                            <span className="text-[9px] text-slate-500 block mt-0.5">Click to upload slip copy (hasel)</span>
                            <input
                              type="file"
                              accept="image/*"
                              required={isFromBazar}
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleCompressAndSetImage(f, setBazarReceiptImage);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 uppercase mb-1 text-[9px] font-extrabold">Bazar Name / হাটের নাম</label>
                      <input
                        type="text"
                        required={isFromBazar}
                        placeholder="e.g. Gabtoli, Basherhat"
                        value={bazarName}
                        onChange={(e) => setBazarName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1 font-sans">Feeding Schedule / ফিডিং শিডিউল</label>
                <textarea
                  value={newAnimal.feedingSchedule || ""}
                  onChange={(e) => setNewAnimal({ ...newAnimal, feedingSchedule: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white h-12 focus:outline-none focus:border-teal-500 font-sans"
                  placeholder="e.g. 08:00 AM: Straw and green grass, 05:00 PM: 2kg concentrates mix"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1">Notes / Trade Details</label>
                <textarea
                  value={newAnimal.notes}
                  onChange={(e) => setNewAnimal({ ...newAnimal, notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white h-12"
                  placeholder="Shareholders notes or specifications..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold py-3 rounded-lg text-center transition uppercase tracking-widest"
              >
                {activeTrans.saveBtn}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Modal 1B: Edit Animal Details */}
      {showEditAnimalModal && editingAnimal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full my-8 space-y-5 animate-scaleUp">
            <div className="flex justify-between items-center border-b border-slate-805 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Edit className="h-5 w-5 text-amber-400" />
                Edit Purchase Details: {editingAnimal.id}
              </h4>
              <button 
                type="button"
                onClick={() => {
                  setShowEditAnimalModal(false);
                  setEditingAnimal(null);
                }} 
                className="text-slate-400 p-1 hover:text-white"
              >✕</button>
            </div>

            <form onSubmit={handleEditAnimalSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Livestock Class</label>
                  <select
                    value={editingAnimal.type}
                    onChange={(e) => {
                      const selectedType = e.target.value;
                      const breeds = getBreedsForType(selectedType);
                      setEditingAnimal({ ...editingAnimal, type: selectedType, breed: breeds[0] });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bull">Bull / ষাঁড়</option>
                    <option value="Cow">Cow / গাভী</option>
                    <option value="Steer">Steer / খাসি ষাঁড়</option>
                    <option value="Heifer">Heifer / বকনা বাছুর</option>
                    <option value="Goat">Goat / ছাগল</option>
                    <option value="Mutton sheep">Sheep / ভেড়া</option>
                    <option value="Buffalo">Buffalo / মহিষ</option>
                    <option value="Mithun">Mithun / গয়াল</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Breed Type</label>
                  <select
                    required
                    value={editingAnimal.breed || getBreedsForType(editingAnimal.type || "Cow")[0]}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, breed: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    {getBreedsForType(editingAnimal.type || "Cow").map((breed) => (
                      <option key={breed} value={breed}>
                        {breed}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Live weight (Kg)</label>
                  <input
                    type="number"
                    required
                    value={editingAnimal.weightKg}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, weightKg: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Supplier / Owner</label>
                  <input
                    type="text"
                    required
                    value={editingAnimal.owner}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, owner: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Purchase Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingAnimal.purchasePrice}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, purchasePrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-amber-400 text-center font-mono font-black"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Advance Token Paid (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingAnimal.advancePaid}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, advancePaid: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Health Condition</label>
                  <input
                    type="text"
                    value={editingAnimal.healthCondition}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, healthCondition: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1 text-[11px] tracking-wider">Exact Birthdate</label>
                  <input
                    type="date"
                    required
                    value={editingAnimal.birthDate || ""}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const calculatedMonths = getMonthsFromBirthdate(selectedDate);
                      setEditingAnimal({ 
                        ...editingAnimal, 
                        birthDate: selectedDate,
                        ageMonths: calculatedMonths
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                  <div className="text-[9px] text-amber-400 mt-1 font-mono text-right">
                    Calculated: {(() => {
                      const { years, months } = calculatePreciseAge(editingAnimal.birthDate);
                      return `${years > 0 ? `${years} yr ` : ""}${months} mo`;
                    })()}
                  </div>
                </div>
              </div>

              {/* Optional Supplier Due Date if there is balance */}
              {Number(editingAnimal.purchasePrice) - Number(editingAnimal.advancePaid) > 0 && (
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Supplier Due Date (বকেয়ার তারিখ)</label>
                  <input
                    type="date"
                    required
                    value={editingAnimal.dueDate || ""}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, dueDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono text-center text-xs focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[9px] text-amber-400/80 mt-1 font-mono font-sans text-right">Outstanding balance of ₹{(Number(editingAnimal.purchasePrice) - Number(editingAnimal.advancePaid)).toLocaleString()} is due to owner on this date.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1 font-sans">Purchase Date / ক্রয়ের তারিখ</label>
                  <input
                    type="date"
                    required
                    value={editingAnimal.dateAdded || ""}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, dateAdded: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1 font-sans">Feeding Schedule / ফিডিং শিডিউল</label>
                  <input
                    type="text"
                    value={editingAnimal.feedingSchedule || ""}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, feedingSchedule: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-amber-500"
                    placeholder="Feed & concentrate routines..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1">Notes / Trade Details</label>
                <textarea
                  value={editingAnimal.notes}
                  onChange={(e) => setEditingAnimal({ ...editingAnimal, notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white h-12 font-sans resize-none"
                  placeholder="Shareholders notes or feeding specifications..."
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditAnimalModal(false);
                    setEditingAnimal(null);
                  }}
                  className="w-1/3 bg-slate-950 text-slate-400 hover:text-white border border-slate-800 font-bold py-3 rounded-lg text-center transition uppercase tracking-wider font-sans cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold py-3 rounded-lg text-center transition uppercase tracking-widest font-sans cursor-pointer"
                >
                  Save Corrections
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal 1C: Viewing Animal Details (Photos and Receipt) */}
      {viewingAnimalDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full my-8 space-y-5 animate-scaleUp text-xs font-sans">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-teal-500/10 text-teal-400 p-1.5 rounded-lg border border-teal-500/10">
                  <Camera className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Livestock Profile: {viewingAnimalDetail.id}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">Date Registered: {viewingAnimalDetail.dateAdded}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setViewingAnimalDetail(null)} 
                className="text-slate-400 p-1 hover:text-white cursor-pointer"
              >✕</button>
            </div>

            {/* Core Stats overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl">
                <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-extrabold mb-1">Animal Class</span>
                <span className="text-xs font-bold text-teal-400">{viewingAnimalDetail.type} ({viewingAnimalDetail.breed})</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl">
                <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-extrabold mb-1">Live Weight</span>
                <span className="text-xs font-bold text-white font-mono">{viewingAnimalDetail.weightKg} kg</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl">
                <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-extrabold mb-1">Health State</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {viewingAnimalDetail.healthCondition || "Good"}
                </span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl">
                <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-extrabold mb-1">Total Cost</span>
                <span className="text-xs font-bold text-white font-mono">₹{viewingAnimalDetail.purchasePrice.toLocaleString()}</span>
              </div>
            </div>

            {/* AI Recorded Parameters Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 border border-teal-500/10 rounded-2xl">
              <div>
                <span className="block text-[8px] text-teal-400 uppercase tracking-widest font-extrabold mb-1">Cattle Colour (Recorded by AI)</span>
                <span className="text-xs font-bold text-white block">{viewingAnimalDetail.color || "N/A (Standard Coat)"}</span>
              </div>
              <div>
                <span className="block text-[8px] text-teal-400 uppercase tracking-widest font-extrabold mb-1">Physical Appearance / বাহ্যিক রূপ</span>
                <span className="text-xs font-bold text-slate-350 block">{viewingAnimalDetail.appearance || "N/A (Standard posture and conformation)"}</span>
              </div>
            </div>

            {/* Husbandry & Medical History Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2.5">
                <h5 className="text-[10px] uppercase text-teal-400 tracking-wider font-extrabold flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  Husbandry & Sourcing Profiles
                </h5>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500 font-medium">Purchase/Registration:</span>
                    <span className="font-bold text-white font-mono">{viewingAnimalDetail.dateAdded || "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500 font-medium">Feeding Schedule:</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded text-[11px] leading-relaxed">
                      {viewingAnimalDetail.feedingSchedule || "Standard organic feeds & graze mix"}
                    </span>
                  </div>
                  {viewingAnimalDetail.notes && (
                    <div className="pt-0.5">
                      <span className="text-slate-500 block font-medium mb-1">Additional Notes:</span>
                      <p className="text-slate-400 italic text-[11px] leading-relaxed bg-slate-900 p-2.5 rounded-xl border border-slate-850">
                        {viewingAnimalDetail.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2.5">
                <h5 className="text-[10px] uppercase text-amber-500 tracking-wider font-extrabold flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                  <Activity className="h-3.5 w-3.5 animate-pulse text-amber-500" />
                  Medical & Vaccination Records ({viewingAnimalDetail.healthHistory?.length || 0})
                </h5>
                {viewingAnimalDetail.healthHistory && viewingAnimalDetail.healthHistory.length > 0 ? (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {viewingAnimalDetail.healthHistory.map((rec, i) => (
                      <div key={rec.id || i} className="text-[11px] bg-slate-900 border border-slate-850 p-2.5 rounded-xl space-y-1">
                        <div className="flex justify-between font-mono font-bold text-white text-[10px]">
                          <span className="text-teal-400 uppercase tracking-wide">{rec.event}</span>
                          <span className="text-slate-500">{rec.date}</span>
                        </div>
                        <div className="text-slate-350 font-medium flex justify-between">
                          <span>Treatment: {rec.treatment}</span>
                          {rec.cost > 0 && <span className="text-amber-400 font-mono">₹{rec.cost}</span>}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">Vet: {rec.vetName}</div>
                        {rec.doctorConsultationDate && <div className="text-[10px] text-teal-400 font-sans">📅 Doctor Consultation: <strong>{rec.doctorConsultationDate}</strong></div>}
                        {rec.dueDate && <div className="text-[10px] text-amber-500 font-sans">⏳ Next Due (Follow-up): <strong>{rec.dueDate}</strong></div>}
                        {rec.notes && <div className="text-stone-500 italic text-[10px] bg-slate-950 p-1 rounded border border-slate-900">{rec.notes}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-600 flex flex-col items-center justify-center gap-1">
                    <Activity className="h-6 w-6 text-slate-750 text-slate-700" />
                    <span className="text-[10px] text-slate-550 italic uppercase font-bold">No medical case is registered.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Photos Display Panel */}
            <div className="space-y-3">
              <h5 className="text-[10px] uppercase text-slate-400 tracking-wider font-extrabold flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-teal-400" />
                Multi-Angle Image Records & Forensic Teeth Scan / প্রাণীর ছবি ও দাঁতের ফরেনসিক রেকর্ড
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { label: "Front / সামনে", img: viewingAnimalDetail.frontImage },
                  { label: "Left / বাম দিক", img: viewingAnimalDetail.leftSideImage },
                  { label: "Right / ডান দিক", img: viewingAnimalDetail.rightSideImage },
                  { label: "Back / পেছনে", img: viewingAnimalDetail.backsideImage },
                  { label: "Teeth / দাঁতের ফরেনসিক", img: viewingAnimalDetail.teethImage }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-850 rounded-2xl p-2 flex flex-col items-center justify-center text-center min-h-[140px] relative overflow-hidden group">
                    {item.img ? (
                      <>
                        <img 
                          src={item.img} 
                          alt={item.label} 
                          className="w-full h-28 object-cover rounded-xl border border-slate-800" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="mt-1.5 text-[9px] font-medium text-slate-400">{item.label}</div>
                        {/* Instant view lightbox on click */}
                        <a 
                          href={item.img} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] text-teal-300 font-bold"
                        >
                          Open Original ↗
                        </a>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-2">
                          <Camera className="h-4 w-4 text-slate-655 text-slate-600" />
                        </div>
                        <span className="text-[9px] text-slate-500 font-semibold uppercase">{item.label}</span>
                        <span className="text-[8px] text-stone-600 italic mt-0.5">Not Uploaded</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bazar Details and Receipt Image if applicable */}
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-amber-500" />
                  <div>
                    <h5 className="text-xs font-black text-slate-200">Bazar Sourcing & Official Hasel Slip</h5>
                    <p className="text-[9px] text-slate-500 font-medium">Bazar trade origin verification slip and legal receipts.</p>
                  </div>
                </div>
                <div>
                  {viewingAnimalDetail.isFromBazar ? (
                    <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/25 rounded-md text-[10px] font-black uppercase tracking-wider">
                      Purchased from Bazar
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-slate-900 text-slate-500 border border-slate-800 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      Direct/Broker Purchase
                    </span>
                  )}
                </div>
              </div>

              {viewingAnimalDetail.isFromBazar ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                  <div className="md:col-span-1 space-y-3">
                    <div>
                      <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-extrabold mb-1">Bazar Name / হাটের নাম</span>
                      <span className="text-xs font-bold text-white bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg block">{viewingAnimalDetail.bazarName || "Gabtoli Sourcing"}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-extrabold mb-1">Trader Name / বিক্রেতার নাম</span>
                      <span className="text-xs font-bold text-slate-350 block">{viewingAnimalDetail.owner}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-extrabold mb-1">Hasel Receipt Copy / হাসিল বা রসিদের কপি</span>
                    {viewingAnimalDetail.bazarReceiptImage ? (
                      <div className="relative group bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-center min-h-[140px] overflow-hidden">
                        <img 
                          src={viewingAnimalDetail.bazarReceiptImage} 
                          alt="Bazar Hasel Receipt" 
                          className="max-h-36 object-contain rounded-lg" 
                          referrerPolicy="no-referrer"
                        />
                        <a 
                          href={viewingAnimalDetail.bazarReceiptImage} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] text-teal-300 font-bold cursor-pointer"
                        >
                          View Original Receipt ↗
                        </a>
                      </div>
                    ) : (
                      <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-8 text-center text-slate-600 flex flex-col items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-amber-550/80 mb-1.5" />
                        <span className="text-[10px] text-slate-500 font-bold">Hasel Slip Missing / কোনো রসিদ যুক্ত করা হয়নি</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">This livestock unit was loaded as an internal farm purchase or walk-in trader direct purchase contract. No central municipal bazar receipt was required.</p>
              )}
            </div>

            {/* Close footer buttons */}
            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setViewingAnimalDetail(null)}
                className="px-5 py-2 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal 2B: Interdepartmental Price Negotiation & Slaughter Transfer */}
      {negotiationActiveAnimal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-amber-500" />
                Price Negotiation & Slaughter Transfer
              </h4>
              <button onClick={() => setNegotiationActiveAnimal(null)} className="text-slate-400 p-1 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCommitNegotiationSlaughter} className="space-y-4 text-xs">
              
              {/* Asset Base Costs breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 font-mono space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Livestock Asset Specs</span>
                  <p className="text-slate-200"><span className="text-slate-500">TAG ID:</span> <span className="font-bold text-white text-xs">{negotiationActiveAnimal.id}</span></p>
                  <p className="text-slate-200"><span className="text-slate-500">TYPE:</span> <span className="font-bold text-white">{negotiationActiveAnimal.type}</span></p>
                  <p className="text-slate-200"><span className="text-slate-500">BREED:</span> <span className="font-bold text-white">{negotiationActiveAnimal.breed}</span></p>
                  <p className="text-slate-200"><span className="text-slate-500">WEIGHT:</span> <span className="font-bold text-white">{negotiationActiveAnimal.weightKg} kg</span></p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 font-mono space-y-1.5 text-[11px]">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Cattle Cost Base Matrix</span>
                  <div className="flex justify-between text-slate-400">
                    <span>Base Purchase:</span>
                    <span className="text-white">₹{(negotiationActiveAnimal.purchasePrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Feed Cost:</span>
                    <span className="text-slate-300">₹{(negotiationActiveAnimal.feedCost || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Medicine / Vet:</span>
                    <span className="text-slate-300">₹{(negotiationActiveAnimal.medicineCost || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Stall Maintenance:</span>
                    <span className="text-slate-300">₹{(negotiationActiveAnimal.maintenanceCost || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Handling / Labor:</span>
                    <span className="text-slate-300">₹{(negotiationActiveAnimal.handlingCost || 0).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-850 pt-1.5 flex justify-between uppercase font-bold text-teal-400">
                    <span>Total Cost Base:</span>
                    <span>
                      ₹{(() => {
                        const baseCost = (negotiationActiveAnimal.purchasePrice || 0) + 
                          (negotiationActiveAnimal.feedCost || 0) + 
                          (negotiationActiveAnimal.medicineCost || 0) + 
                          (negotiationActiveAnimal.maintenanceCost || 0) + 
                          (negotiationActiveAnimal.handlingCost || 0);
                        return baseCost.toLocaleString();
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time price negotiation input */}
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl space-y-2">
                <label className="block text-slate-400 uppercase text-[10px] font-bold font-mono">
                  Slaughter Department Negotiated Price (Internal Sale) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-sm">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full bg-slate-900 border border-slate-800 text-amber-400 font-bold font-mono text-sm rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-amber-400"
                    placeholder="Enter negotiated amount"
                    value={negotiatedInternalPrice}
                    onChange={(e) => setNegotiatedInternalPrice(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-sans leading-tight">
                  Negotiate based on the current live carcass, meat rate values (e.g., ₹720-750/kg for Cow beef) and overall animal meatiness.
                </p>
              </div>

              {/* Computed Farm profit booking widget */}
              {(() => {
                const totalBase = (negotiationActiveAnimal.purchasePrice || 0) + 
                  (negotiationActiveAnimal.feedCost || 0) + 
                  (negotiationActiveAnimal.medicineCost || 0) + 
                  (negotiationActiveAnimal.maintenanceCost || 0) + 
                  (negotiationActiveAnimal.handlingCost || 0);
                const internalPrice = Number(negotiatedInternalPrice) || 0;
                const profitOrLoss = internalPrice - totalBase;

                return (
                  <div className={`p-4 border rounded-2xl flex items-center justify-between ${
                    profitOrLoss >= 0 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider block opacity-70">Cattle Farm Profit Booking Goal</span>
                      <span className="text-xs font-sans mt-0.5 block font-bold leading-none font-bold">
                        {profitOrLoss >= 0 ? "Booked Net Business Profit" : "Booked Net Business Capital Loss"}
                      </span>
                    </div>
                    <span className="text-xl font-black font-mono">
                      {profitOrLoss >= 0 ? "+" : "-"}₹{Math.abs(profitOrLoss).toLocaleString()}
                    </span>
                  </div>
                );
              })()}

              {/* Notes */}
              <div>
                <label className="block text-slate-400 uppercase text-[9px] mb-1 font-bold">Transfer Remarks & Notes</label>
                <textarea
                  placeholder="Insert notes about yield quality or transaction stipulations..."
                  value={negotiationNotes}
                  onChange={(e) => setNegotiationNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              {/* Actions footer wrapper */}
              <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setNegotiationActiveAnimal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl uppercase tracking-wider cursor-pointer"
                >
                  Approve and Settle Transfer
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Slicing Livestock into retail meat stock products */}
      {showProcessModal && processTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-teal-400" />
                {activeTrans.processAnimalBtn}: {processTarget.id}
              </h4>
              <button onClick={() => setShowProcessModal(false)} className="text-slate-400 p-1 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleProcessAnimalSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl space-y-1 font-mono">
                <p><span className="text-slate-500 uppercase">Class:</span> <span className="text-white font-bold">{processTarget.type} ({processTarget.breed})</span></p>
                <p><span className="text-slate-500 uppercase">Live weight:</span> <span className="text-white font-bold">{processTarget.weightKg} kg</span></p>
                <p><span className="text-slate-500 uppercase">Cost purchased:</span> <span className="text-teal-400 font-bold">₹{processTarget.purchasePrice}</span></p>
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-2">
                  Dressing Carcass Percentage (Yield): {Math.round(customYieldRatio * 100)}%
                </label>
                <input
                  type="range"
                  min="0.30"
                  max="0.65"
                  step="0.01"
                  value={customYieldRatio}
                  onChange={(e) => setCustomYieldRatio(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                  <span>30% Low (Mutton)</span>
                  <span>52% Average (Cattle)</span>
                  <span>65% High (Mithun Premium)</span>
                </div>
              </div>

              <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                <p className="font-bold text-teal-400 mb-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Speculated Harvest Output:
                </p>
                <div className="font-mono text-[11px] space-y-1 mt-1 text-slate-300">
                  <p>• Total Edible Meat Yield: <span className="text-white font-bold">{Math.round(processTarget.weightKg * customYieldRatio)} kg</span></p>
                  <p>• Premium pure cuts (65%): <span className="text-white font-bold">{Math.round(processTarget.weightKg * customYieldRatio * 0.65)} kg</span></p>
                  <p>• Soup Bones & frame (25%): <span className="text-white font-bold">{Math.round(processTarget.weightKg * customYieldRatio * 0.25)} kg</span></p>
                  <p>• Organs & offal fat (10%): <span className="text-white font-bold">{Math.round(processTarget.weightKg * customYieldRatio * 0.10)} kg</span></p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold py-3 rounded-lg text-center transition"
              >
                Slaughter & Deposit to Store Counters
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Modal 2B: Animal Veterinary Health Register */}
      {showHealthModal && activeHealthAnimal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full my-8 space-y-5 animate-scaleUp">
            
            {/* Modal Title and General Info Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
                  Medical Register: {activeHealthAnimal.id} 
                </h4>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-mono">
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-850">Class: <strong className="text-white">{activeHealthAnimal.type}</strong></span>
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-850 font-sans">Breed: <strong className="text-white">{activeHealthAnimal.breed}</strong></span>
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-850">Weight: <strong className="text-white">{activeHealthAnimal.weightKg} kg</strong></span>
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-850 font-sans">State: <strong className="text-emerald-400">{activeHealthAnimal.healthCondition || "Healthy"}</strong></span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowHealthModal(false);
                  setActiveHealthAnimal(null);
                }} 
                className="text-slate-400 p-1.5 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >✕</button>
            </div>

            {/* Content Section based on healthSubView */}
            {healthSubView === "list" ? (
              <div className="space-y-4">
                {/* Dashboard Stats & Add Action row */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center p-4 bg-slate-950 border border-slate-850/80 rounded-2xl gap-3">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 shrink-0 font-mono text-center">
                    <div className="text-left border-r border-slate-900 pr-2">
                      <span className="text-[8px] text-slate-500 uppercase font-black block">Total Logs</span>
                      <span className="text-sm font-black text-white">{(activeHealthAnimal.healthHistory || []).length}</span>
                    </div>
                    <div className="text-center border-r border-slate-900 pr-2 px-1">
                      <span className="text-[8px] text-slate-500 uppercase font-black block text-center">Total Costs</span>
                      <span className="text-sm font-black text-rose-400">₹{((activeHealthAnimal.healthHistory || []).reduce((sum, r) => sum + r.cost, 0)).toLocaleString()}</span>
                    </div>
                    <div className="text-right pl-1">
                      <span className="text-[8px] text-slate-500 uppercase font-black block text-right">Condition</span>
                      <span className="text-[10px] font-black text-emerald-450 text-emerald-400 font-sans truncate block">{activeHealthAnimal.healthCondition || "Stable"}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setHealthSubView("form");
                      setHealthEvent("");
                      setHealthTreatment("");
                      setHealthVetName("");
                      setHealthCost("");
                      setHealthNotes("");
                      setHealthDate(new Date().toISOString().split("T")[0]);
                      setHealthConditionUpdate(activeHealthAnimal.healthCondition || "Good");
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-center text-xs transition cursor-pointer select-none flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Record New health event
                  </button>
                </div>

                {/* Sub-header with Grouping controls */}
                <div className="flex justify-between items-center bg-slate-900/50 pt-1.5">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                    Medical Ledger Events Listing
                  </h5>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850 shrink-0 font-mono text-[9px]">
                    <span className="text-slate-500 px-1 uppercase text-[8px] font-black">Group:</span>
                    <button
                      type="button"
                      onClick={() => setHealthGroupMode("none")}
                      className={`px-2 py-1 rounded-md transition ${healthGroupMode === "none" ? "bg-slate-800 text-teal-400 font-bold" : "text-slate-400 hover:text-white"}`}
                    >
                      None
                    </button>
                    <button
                      type="button"
                      onClick={() => setHealthGroupMode("event")}
                      className={`px-2 py-1 rounded-md transition ${healthGroupMode === "event" ? "bg-slate-800 text-teal-400 font-bold" : "text-slate-400 hover:text-white"}`}
                    >
                      Event Type
                    </button>
                    <button
                      type="button"
                      onClick={() => setHealthGroupMode("date")}
                      className={`px-2 py-1 rounded-md transition ${healthGroupMode === "date" ? "bg-slate-800 text-teal-400 font-bold" : "text-slate-400 hover:text-white"}`}
                    >
                      Date
                    </button>
                  </div>
                </div>

                {/* Medical Events History Ledger Details */}
                <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3.5">
                  {(!activeHealthAnimal.healthHistory || activeHealthAnimal.healthHistory.length === 0) ? (
                    <div className="p-10 bg-slate-950 rounded-2xl border border-dashed border-slate-800 text-center font-mono text-slate-500 text-xs">
                      No health records found
                    </div>
                  ) : healthGroupMode === "none" ? (
                    <div className="space-y-3">
                      {activeHealthAnimal.healthHistory.map((rec) => (
                        <div key={rec.id} className="p-3.5 bg-slate-950 border border-slate-850/60 rounded-2xl space-y-2 text-xs font-mono">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                            <span className="font-black text-emerald-400 text-sm flex items-center gap-1.5">{rec.event}</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingHealthRecord(rec);
                                  setHealthEvent(rec.event);
                                  setHealthTreatment(rec.treatment);
                                  setHealthVetName(rec.vetName);
                                  setHealthCost(rec.cost.toString());
                                  setHealthNotes(rec.notes || "");
                                  setHealthDate(rec.date);
                                  setHealthDueDate(rec.dueDate || "");
                                  setDoctorConsultationDate(rec.doctorConsultationDate || "");
                                  setHealthConditionUpdate(activeHealthAnimal?.healthCondition || "Good");
                                  setHealthSubView("form");
                                }}
                                className="text-[10px] text-slate-400 hover:text-teal-400 font-bold font-sans cursor-pointer flex items-center gap-1 mr-2 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition"
                              >
                                Edit
                              </button>
                              <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 border border-slate-850 rounded">{rec.date}</span>
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-300">
                            Treatment: <span className="text-white font-medium font-sans">{rec.treatment}</span>
                          </div>
                          <div className="text-[10px] text-slate-405 flex flex-wrap justify-between pt-1 border-t border-slate-900/50">
                            <span>Vet: {rec.vetName}</span>
                            <span className="text-teal-400 font-black">Cost: ₹{rec.cost.toLocaleString()}</span>
                          </div>
                          {rec.doctorConsultationDate && (
                            <div className="text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded px-2.5 py-1 mt-1 inline-flex items-center gap-1 font-sans">
                              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
                              <span>Doctor Consultation: <strong>{rec.doctorConsultationDate}</strong></span>
                            </div>
                          )}
                          {rec.dueDate && (
                            <div className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded px-2.5 py-1 mt-1 inline-flex items-center gap-1 font-sans">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                              <span>Next Due (Follow-up): <strong>{rec.dueDate}</strong></span>
                            </div>
                          )}
                          {rec.notes && (
                            <p className="text-[10px] text-slate-500 italic border-l-2 border-slate-800 pl-2 mt-2 font-sans">"{rec.notes}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {(() => {
                        const history = activeHealthAnimal.healthHistory || [];
                        let groupedRecords: { [key: string]: HealthRecord[] } = {};

                        if (healthGroupMode === "date") {
                          history.forEach(rec => {
                            const dVal = rec.date || "Unknown Date";
                            if (!groupedRecords[dVal]) groupedRecords[dVal] = [];
                            groupedRecords[dVal].push(rec);
                          });
                        } else {
                          history.forEach(rec => {
                            const eVal = rec.event || "General Treatment";
                            const capEvent = eVal.trim().charAt(0).toUpperCase() + eVal.trim().slice(1);
                            if (!groupedRecords[capEvent]) groupedRecords[capEvent] = [];
                            groupedRecords[capEvent].push(rec);
                          });
                        }

                        return Object.entries(groupedRecords).map(([groupTitle, list]) => (
                          <div key={groupTitle} className="space-y-2 text-xs">
                            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider font-mono border-l-2 border-teal-500 pl-2 bg-teal-500/5 py-1 pr-3 rounded-r-md">
                              {groupTitle} ({list.length})
                            </span>
                            <div className="space-y-2.5 pl-1">
                              {list.map((rec) => (
                                <div key={rec.id} className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl space-y-1.5 font-mono">
                                  <div className="flex justify-between items-center pb-1 border-b border-slate-900/40">
                                    <span className="font-bold text-slate-200 text-xs">{rec.event}</span>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingHealthRecord(rec);
                                          setHealthEvent(rec.event);
                                          setHealthTreatment(rec.treatment);
                                          setHealthVetName(rec.vetName);
                                          setHealthCost(rec.cost.toString());
                                          setHealthNotes(rec.notes || "");
                                          setHealthDate(rec.date);
                                          setHealthDueDate(rec.dueDate || "");
                                          setDoctorConsultationDate(rec.doctorConsultationDate || "");
                                          setHealthConditionUpdate(activeHealthAnimal?.healthCondition || "Good");
                                          setHealthSubView("form");
                                        }}
                                        className="text-[9px] text-slate-400 hover:text-teal-400 font-bold font-sans cursor-pointer flex items-center gap-1 transition"
                                      >
                                        Edit
                                      </button>
                                      <span className="text-[9px] text-slate-500">{rec.date}</span>
                                    </div>
                                  </div>
                                  <div className="text-[11px] text-slate-300">
                                    Treatment: <span className="text-white font-sans">{rec.treatment}</span>
                                  </div>
                                  <div className="text-[9.5px] text-slate-400 flex justify-between pr-1">
                                    <span>Vet: {rec.vetName}</span>
                                    <span className="text-teal-400 font-bold">₹{rec.cost.toLocaleString()}</span>
                                  </div>
                                  {rec.doctorConsultationDate && (
                                    <div className="text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded px-2.5 py-1 mt-1 inline-flex items-center gap-1 font-sans">
                                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
                                      <span>Doctor Consultation: <strong>{rec.doctorConsultationDate}</strong></span>
                                    </div>
                                  )}
                                  {rec.dueDate && (
                                    <div className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded px-2.5 py-1 mt-1 inline-flex items-center gap-1 font-sans">
                                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                      <span>Next Due (Follow-up): <strong>{rec.dueDate}</strong></span>
                                    </div>
                                  )}
                                  {rec.notes && (
                                    <p className="text-[9.5px] text-slate-500 italic border-l border-slate-900 pl-2 mt-1 font-sans">"{rec.notes}"</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
                    {editingHealthRecord ? "Edit Veterinary Treatment / Entry Log" : "Record Veterinary Treatment / Entry Log"}
                  </h5>
                  <button
                    type="button"
                    onClick={() => {
                      setHealthSubView("list");
                      setEditingHealthRecord(null);
                    }}
                    className="text-[10px] text-slate-450 hover:text-white underline font-mono flex items-center gap-1 cursor-pointer"
                  >
                    ← Back to Medical Ledger
                  </button>
                </div>

                {/* Form to add/edit a health record */}
                <form onSubmit={handleAddHealthRecord} className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl space-y-4 text-xs font-mono">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">Medical Event / Title (Type)</label>
                      <input
                        type="text"
                        required
                        maxLength={32}
                        placeholder="e.g. Vaccination, Deworming, Injury"
                        value={healthEvent}
                        onChange={(e) => setHealthEvent(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">Treatment Administered</label>
                      <input
                        type="text"
                        required
                        maxLength={48}
                        placeholder="e.g. Vaccine dose, IV fluids, Surgery"
                        value={healthTreatment}
                        onChange={(e) => setHealthTreatment(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">Event Date / তারিখ</label>
                      <input
                        type="date"
                        required
                        value={healthDate}
                        onChange={(e) => setHealthDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">New Health Condition / স্বাস্থ্য অবস্থা</label>
                      <select
                        value={healthConditionUpdate}
                        onChange={(e) => setHealthConditionUpdate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Excellent">Excellent / চমৎকার</option>
                        <option value="Good">Good / ভালো</option>
                        <option value="Fair">Fair / সাধারণ (মধ্যম)</option>
                        <option value="Poor">Poor / দুর্বল (খারাপ)</option>
                        <option value="Critical">Critical / আশঙ্কাজনক</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">Vet / Attending Specialist</label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Rahman, Staff"
                        value={healthVetName}
                        onChange={(e) => setHealthVetName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">Treatment Cost (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 500"
                        value={healthCost}
                        onChange={(e) => setHealthCost(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">Doctor Consultation Date / ডাক্তারের পরামর্শের তারিখ</label>
                      <input
                        type="date"
                        value={doctorConsultationDate}
                        onChange={(e) => setDoctorConsultationDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">Next Due Date (Follow-up) / পরবর্তী তারিখ (ঐচ্ছিক)</label>
                      <input
                        type="date"
                        value={healthDueDate}
                        onChange={(e) => setHealthDueDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-400 uppercase text-[10px] tracking-wider font-bold">Observations & Veterinary Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Specify diagnostic outcomes, follow-up timelines, medicines"
                      value={healthNotes}
                      onChange={(e) => setHealthNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
                    />
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setHealthSubView("list")}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold py-2.5 rounded-xl text-center text-xs transition border border-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-center text-xs transition cursor-pointer select-none"
                    >
                      Submit Record to History log
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 2C: Batch Processing of Selected Livestock */}
      {showBatchProcessModal && selectedAnimalIds.length > 0 && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 animate-scaleUp">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-teal-400" />
                Batch Slicing & Processing Room ({selectedAnimalIds.length} Animals)
              </h4>
              <button 
                type="button"
                onClick={() => {
                  setShowBatchProcessModal(false);
                  setSelectedAnimalIds([]);
                }} 
                className="text-slate-400 p-1 hover:text-white"
              >✕</button>
            </div>

            <form onSubmit={handleBatchProcessAnimals} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl space-y-1.5 font-mono max-h-[120px] overflow-y-auto border border-slate-800/60">
                <span className="text-[9px] text-slate-500 uppercase block font-bold mb-1">Livestock queue to process:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {animals.filter(ani => selectedAnimalIds.includes(ani.id)).map(ani => (
                    <div key={ani.id} className="text-slate-300">• {ani.id}: <span className="text-white font-bold">{ani.type}</span> ({ani.weightKg}kg)</div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl space-y-1 font-mono border border-slate-800/60">
                <p><span className="text-slate-500 uppercase">Total Count:</span> <span className="text-white font-bold">{animals.filter(ani => selectedAnimalIds.includes(ani.id)).length} heads</span></p>
                <p><span className="text-slate-500 uppercase">Total Weight:</span> <span className="text-white font-bold">{animals.filter(ani => selectedAnimalIds.includes(ani.id)).reduce((sum, a) => sum + a.weightKg, 0)} kg</span></p>
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-2">
                  Dressing Carcass Percentage (Yield): {Math.round(batchYieldRatio * 100)}%
                </label>
                <input
                  type="range"
                  min="0.30"
                  max="0.65"
                  step="0.01"
                  value={batchYieldRatio}
                  onChange={(e) => setBatchYieldRatio(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                  <span>30% Low (Mutton)</span>
                  <span>52% Average (Cattle)</span>
                  <span>65% High (Mithun Premium)</span>
                </div>
              </div>

              <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                <p className="font-bold text-teal-400 mb-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Speculated Batch Yield Allocations:
                </p>
                <div className="font-mono text-[11px] space-y-1 mt-1 text-slate-350">
                  {(() => {
                    const selAnis = animals.filter(ani => selectedAnimalIds.includes(ani.id));
                    let beefYield = 0;
                    let muttonYield = 0;
                    let buffaloYield = 0;
                    let totalCarcass = 0;
                    let bonesWeight = 0;
                    let organsWeight = 0;

                    selAnis.forEach(ani => {
                      const yieldWt = Math.round(ani.weightKg * batchYieldRatio);
                      totalCarcass += yieldWt;

                      const premium = Math.round(yieldWt * 0.65 * 10) / 10;
                      const bones = Math.round(yieldWt * 0.25 * 10) / 10;
                      const organs = Math.round(yieldWt * 0.10 * 10) / 10;
                      
                      bonesWeight += bones;
                      organsWeight += organs;

                      const itemType = ani.type.toLowerCase();
                      if (itemType === "cow" || itemType === "mithun") {
                        beefYield += premium;
                      } else if (itemType === "buffalo") {
                        buffaloYield += premium;
                      } else {
                        muttonYield += premium;
                      }
                    });

                    return (
                      <>
                        <p>• Estimated Edible Yield: <span className="text-white font-bold">{totalCarcass} kg</span></p>
                        {beefYield > 0 && <p>• Beef Retail Counter deposits (+65%): <span className="text-teal-400 font-bold">{Math.round(beefYield * 10) / 10} kg</span></p>}
                        {muttonYield > 0 && <p>• Mutton Retail Counter deposits (+65%): <span className="text-teal-400 font-bold">{Math.round(muttonYield * 10) / 10} kg</span></p>}
                        {buffaloYield > 0 && <p>• Buffalo Retail Counter deposits (+65%): <span className="text-teal-400 font-bold">{Math.round(buffaloYield * 10) / 10} kg</span></p>}
                        <p>• Bone Counters deposits (+25%): <span className="text-white font-bold">{Math.round(bonesWeight * 10) / 10} kg</span></p>
                        <p>• Organ/Offal deposits (+10%): <span className="text-white font-bold">{Math.round(organsWeight * 10) / 10} kg</span></p>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowBatchProcessModal(false);
                    setSelectedAnimalIds([]);
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-lg text-center transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 text-slate-950 hover:bg-teal-400 font-black py-3 rounded-lg text-center transition"
                >
                  Confirm Batch屠宰
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add Sale billing counter */}
      {showBillingModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-teal-400" />
                POS billing counter / রশিদ মেকার
              </h4>
              <button onClick={() => setShowBillingModal(false)} className="text-slate-400 p-1 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleIssueSale} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Customer Customer Name</label>
                  <input
                    type="text"
                    required
                    value={newSale.customerName}
                    onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Customer Customer Phone</label>
                  <input
                    type="text"
                    required
                    value={newSale.customerPhone}
                    onChange={(e) => setNewSale({ ...newSale, customerPhone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                  <span className="font-bold text-slate-300">Sales Items</span>
                  <button type="button" onClick={addSaleItemField} className="text-teal-400 hover:underline">+ Add Product</button>
                </div>

                {newSale.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <select
                      value={item.type}
                      onChange={(e) => updateSaleItemField(idx, "type", e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white flex-1"
                    >
                      <option value="beef">Beef (গরু)</option>
                      <option value="mutton">Mutton (খাসি/ছাগল)</option>
                      <option value="buffalo">Buffalo Meat (মহিষ)</option>
                      <option value="bones">Bones (হাড়)</option>
                      <option value="organs">Organs & Offal (কলিজা/চর্বি)</option>
                    </select>

                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="kg"
                      value={item.weightKg}
                      onChange={(e) => updateSaleItemField(idx, "weightKg", Number(e.target.value))}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white w-20 text-center font-mono"
                    />

                    <input
                      type="number"
                      required
                      placeholder="Price / kg"
                      value={item.ratePerKg}
                      onChange={(e) => updateSaleItemField(idx, "ratePerKg", Number(e.target.value))}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white w-24 text-center font-mono font-bold"
                    />

                    <button 
                      type="button" 
                      onClick={() => removeSaleItemField(idx)}
                      className="text-stone-400 hover:text-red-400 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                <div>
                  <label className="block text-slate-400 mb-1">Payment</label>
                  <select
                    value={newSale.paymentMethod}
                    onChange={(e) => setNewSale({ ...newSale, paymentMethod: e.target.value as any })}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs font-bold"
                  >
                    <option value="Cash">💵 Cash (নগদ)</option>
                    <option value="bKash">📱 bKash (বিকাশ)</option>
                    <option value="Card">💳 Card (কার্ড)</option>
                    <option value="Due">⏳ Due (বাকি)</option>
                  </select>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Bill Payable</p>
                  <p className="text-xl font-bold font-mono text-white">
                    ₹{newSale.items.reduce((sum, item) => sum + (Number(item.weightKg) * Number(item.ratePerKg)), 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 text-slate-950 font-bold py-3 rounded-lg text-center transition"
              >
                Confirm Sale Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Digital Invoice generation & Printable copy displaying */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <Receipt className="h-5 w-5 text-teal-400" />
                Receipt Viewer / চালান-পত্র
              </h4>
              <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 p-1 hover:text-white">✕</button>
            </div>

            {docLoading ? (
              <div className="py-12 text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-teal-400" />
                <span>{activeTrans.draftingDoc}</span>
              </div>
            ) : serverDoc ? (
              <div className="space-y-4 text-xs select-text">
                
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <div>
                    <span className="text-[10px] text-slate-500 block">AI Generated Receipt Specimen</span>
                    <span className="font-bold text-teal-400 font-mono text-xs">{selectedInvoice.id}</span>
                  </div>
                  <button 
                    onClick={() => printSaleReceipt(selectedInvoice)} 
                    className="p-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print Receipt
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  
                  {/* English copy */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3.5 leading-relaxed">
                    <h5 className="font-bold text-white border-b border-slate-900 pb-2">English Specimen</h5>
                    <div className="font-mono text-[11px] text-slate-300 whitespace-pre-wrap">
                      {serverDoc.contentEnglish}
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg mt-2">
                      <p className="text-[9px] text-stone-500 font-bold uppercase tracking-widest mb-1">SMS copy (EN)</p>
                      <p className="font-mono text-[10px] text-teal-400 italic">"{serverDoc.smsEnglish}"</p>
                    </div>
                  </div>

                  {/* Bengali copy */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-teal-500/10 space-y-3.5 leading-relaxed">
                    <h5 className="font-bold text-teal-400 border-b border-slate-900 pb-2">বাংলা রশিদ বিবরণ</h5>
                    <div className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans">
                      {serverDoc.contentBengali}
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg mt-2">
                      <p className="text-[9px] text-stone-500 font-bold uppercase tracking-widest mb-1">বাংলা মোবাইল বার্তা (SMS)</p>
                      <p className="font-sans text-[10px] text-teal-400 italic">"{serverDoc.smsBengali}"</p>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <XCircle className="h-10 w-10 text-slate-700/60 mx-auto mb-2" />
                <p>Failed to retrieve printable invoice templates from full-stack server endpoints. Relying on paper receipts.</p>
              </div>
            )}

            {/* Split Payment Activity Ledger for Recorded Sale */}
            {!docLoading && selectedInvoice && (
              <div className="border-t border-slate-800 pt-4 space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-mono">
                    Split Collection Activity (কিস্তি আদায় বিবরণী)
                  </span>
                  {selectedInvoice.amountDue && selectedInvoice.amountDue > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        // Close invoice modal and open collection modal
                        setShowInvoiceModal(false);
                        const dueVal = selectedInvoice.amountDue || 0;
                        setInstallmentAmount(dueVal.toString());
                        setInstallmentNotes("");
                        const nextD = new Date();
                        nextD.setDate(nextD.getDate() + 7);
                        setInstallmentNextDate(nextD.toISOString().split("T")[0]);
                        setInstallmentUpcomingDate(nextD.toISOString().split("T")[0]);
                        setInstallmentSpecialNotes("");
                        setActiveCollectionSale(selectedInvoice);
                        setShowCollectionModal(true);
                      }}
                      className="text-[9px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer select-none"
                    >
                      <Coins className="h-3 w-3" />
                      Record Collections
                    </button>
                  )}
                </div>

                {(!selectedInvoice.installments || selectedInvoice.installments.length === 0) ? (
                  <div className="text-center p-3 bg-slate-950 border border-slate-850/60 rounded-2xl text-xs text-slate-400 font-sans">
                    No split installment payments collected yet for this transaction.
                    {selectedInvoice.amountDue && selectedInvoice.amountDue > 0 ? (
                      <span className="text-amber-400 font-bold font-mono block mt-1">Remaining Outstanding Due: ₹{selectedInvoice.amountDue.toLocaleString()}</span>
                    ) : (
                      <span className="text-green-400 font-bold font-mono block mt-1">Status: Fully Paid / Settled on checkout</span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {selectedInvoice.installments.map((inst) => (
                      <div key={inst.id} className="flex justify-between items-center p-3.5 bg-slate-950 border border-slate-850 rounded-2xl hover:border-slate-800 transition">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-teal-400">{inst.id}</span>
                            <span className="text-[9px] font-mono text-slate-500">{inst.date}</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-slate-900 border border-slate-800 rounded font-bold uppercase font-mono text-slate-400">
                              {inst.paymentMethod}
                            </span>
                          </div>
                          <p className="text-[11px] text-white font-medium mt-1">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-teal-400 mr-1.5">Remarks:</span>
                            "{inst.collectionNotes || inst.notes || 'No remarks recorded.'}"
                          </p>
                          {(inst.upcomingCollectionDate || inst.nextCollectionDate || inst.specialNotes) && (
                            <div className="mt-1.5 pl-2 border-l border-teal-500/30 space-y-0.5 text-[9px] text-slate-450 font-mono">
                              {inst.upcomingCollectionDate && (
                                <div>Upcoming: <span className="text-teal-400 font-semibold">{inst.upcomingCollectionDate}</span></div>
                              )}
                              {inst.nextCollectionDate && (
                                <div>Next Follow-up: <span className="text-teal-400 font-semibold">{inst.nextCollectionDate}</span></div>
                              )}
                              {inst.specialNotes && (
                                <div className="text-rose-405 italic">Note: "{inst.specialNotes}"</div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3.5 font-mono">
                          <div className="text-right">
                            <span className="font-black text-teal-400 text-xs block">₹{inst.amount.toLocaleString()}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => printInstallmentReceipt(selectedInvoice, inst)}
                            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/30 rounded-xl hover:text-white transition cursor-pointer select-none flex items-center justify-center text-teal-400 hover:text-white"
                            title="Print detailed receipt for this installment"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {selectedInvoice.amountDue !== undefined && (
                      <div className="flex justify-between items-center p-3 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl text-[11px] font-mono">
                        <span className="text-slate-400">Remaining Balance Due:</span>
                        <span className={`font-black ${selectedInvoice.amountDue > 0 ? "text-amber-500 font-bold" : "text-green-400"}`}>
                          ₹{selectedInvoice.amountDue.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setShowInvoiceModal(false)}
              className="w-full bg-slate-800 text-white font-bold py-2.5 rounded-xl text-center text-xs hover:bg-slate-755 transition"
            >
              Close Receipt Review
            </button>

          </div>
        </div>
      )}

      {/* Modal 6: Record Collections & Split Installments Dialog */}
      {showCollectionModal && activeCollectionSale && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[92vh] overflow-y-auto space-y-6 animate-fadeIn">
            
            {/* Header info */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-400" />
                Record Collection Installment / বকেয়া কিস্তি আদায়
              </h4>
              <button 
                onClick={() => {
                  setShowCollectionModal(false);
                  setActiveCollectionSale(null);
                }} 
                className="text-slate-400 p-1 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Customer & Transaction Financial Status Summary */}
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Customer Reference</span>
                <p className="text-sm font-semibold text-white mt-1">{activeCollectionSale.customerName}</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{activeCollectionSale.customerPhone}</p>
                <p className="text-[10px] text-teal-400 mt-2 font-mono">Invoice ID: {activeCollectionSale.id}</p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-900 flex flex-col justify-between">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Total Purchase Bill:</span>
                  <span className="font-bold text-white">₹{activeCollectionSale.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs mt-1 font-mono">
                  <span className="text-slate-400">Paid to date:</span>
                  <span className="font-bold text-teal-400">₹{(activeCollectionSale.amountPaid || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-3 border-t border-slate-800/80 pt-2 font-bold font-mono">
                  <span className="text-amber-500">Remaining Balance:</span>
                  <span className="text-amber-500 text-base">₹{(activeCollectionSale.amountDue || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Split Installment History */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2 font-mono">
                Collection History / কিস্তি আদায়ের ইতিহাস ({activeCollectionSale.installments?.length || 0} Records)
              </span>
              
              {(!activeCollectionSale.installments || activeCollectionSale.installments.length === 0) ? (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-xl border border-slate-900 border-dashed text-center">
                  No subsequent split payments recorded for this transaction yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {activeCollectionSale.installments.map((inst) => (
                    <div key={inst.id} className="flex justify-between items-center p-3 bg-slate-950 border border-slate-850 rounded-xl">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-teal-400">{inst.id}</span>
                          <span className="text-[9px] font-mono text-slate-500">{inst.date}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-slate-900 border border-slate-800 rounded font-bold uppercase font-mono text-slate-400">
                            {inst.paymentMethod}
                          </span>
                        </div>
                        <p className="text-[11px] text-white font-medium mt-1">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-teal-400 mr-1.5">Collector Note:</span>
                          "{inst.collectionNotes || inst.notes || 'No notes.'}"
                        </p>
                        {(inst.upcomingCollectionDate || inst.nextCollectionDate || inst.specialNotes) && (
                          <div className="mt-1 pl-1.5 border-l border-teal-500/30 space-y-0.5 text-[8.5px] text-slate-500 font-mono">
                            {inst.upcomingCollectionDate && (
                              <div>Upcoming: <span className="text-teal-400/90 font-semibold">{inst.upcomingCollectionDate}</span></div>
                            )}
                            {inst.nextCollectionDate && (
                              <div>Next: <span className="text-teal-400/90 font-semibold">{inst.nextCollectionDate}</span></div>
                            )}
                            {inst.specialNotes && (
                              <div className="text-rose-400 italic font-sans text-xs">Note: "{inst.specialNotes}"</div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 font-mono">
                        <span className="font-black text-rose-400 text-xs">₹{inst.amount.toLocaleString()}</span>
                        <button
                          type="button"
                          onClick={() => printInstallmentReceipt(activeCollectionSale, inst)}
                          className="p-1 px-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded hover:text-white transition cursor-pointer select-none"
                          title="Reprint physical split payment receipt copy"
                        >
                          <Printer className="h-3 w-3 text-slate-400 hover:text-teal-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Record New Entry Form */}
            {activeCollectionSale.amountDue && activeCollectionSale.amountDue > 0 ? (
              <div className="border-t border-slate-800 pt-4 space-y-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block font-mono">
                  Record New Split Collection (নতুন কিস্তি আদায় জমা করুন)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Collection Amount */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-mono">Settle Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={activeCollectionSale.amountDue}
                      value={installmentAmount}
                      onChange={(e) => setInstallmentAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Payment channel selector */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-mono">Payment Channel</label>
                    <select
                      value={installmentMethod}
                      onChange={(e) => setInstallmentMethod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-teal-500"
                    >
                      <option value="Cash">💵 Cash (নগদ)</option>
                      <option value="bKash">📱 bKash (বিকাশ)</option>
                      <option value="Card">💳 Card (কার্ড)</option>
                    </select>
                  </div>

                  {/* Upcoming Collection Date */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-mono">Upcoming Collection Date</label>
                    <input
                      type="date"
                      value={installmentUpcomingDate}
                      onChange={(e) => setInstallmentUpcomingDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-2.5 text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Next Collection Scheduled follow up */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-mono">Next Collection Date</label>
                    <input
                      type="date"
                      value={installmentNextDate}
                      onChange={(e) => setInstallmentNextDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-2.5 text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Collection Comments/Remarks & Special Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-mono">Collector Notes / Remarks</label>
                    <input
                      type="text"
                      placeholder="e.g. Cleared 2nd installment"
                      value={installmentNotes}
                      onChange={(e) => setInstallmentNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-mono">Special Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Call customer before visiting"
                      value={installmentSpecialNotes}
                      onChange={(e) => setInstallmentSpecialNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeCollectionSale.amountDue) {
                        handleRecordCollectionInstallment(
                          activeCollectionSale.id,
                          activeCollectionSale.amountDue,
                          installmentMethod,
                          "Fully settled outstanding amount in one collection",
                          "",
                          "",
                          installmentSpecialNotes
                        );
                      }
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-center text-xs transition cursor-pointer select-none"
                  >
                    Settle Full Dues (₹{activeCollectionSale.amountDue.toLocaleString()})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleRecordCollectionInstallment(
                        activeCollectionSale.id,
                        Number(installmentAmount),
                        installmentMethod,
                        installmentNotes,
                        installmentNextDate,
                        installmentUpcomingDate,
                        installmentSpecialNotes
                      );
                    }}
                    className="flex-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-center text-xs shadow-lg transition cursor-pointer select-none lg:text-sm"
                  >
                    Submit Installment Received
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl text-center text-green-400 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider">Account Fully Settled</p>
                <p className="text-[11px] text-slate-400">All outstanding dues for this transaction have been completely recovered and registered.</p>
              </div>
            )}

            <button
              onClick={() => {
                setShowCollectionModal(false);
                setActiveCollectionSale(null);
              }}
              className="w-full bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white font-bold py-2.5 rounded-xl text-center text-xs transition border border-slate-800 cursor-pointer"
            >
              Close Ledger Overlay
            </button>

          </div>
        </div>
      )}

      {/* Modal 5: Smart Profit & Yield Forecast via Gemini AI */}
      {selectedForecastAnimal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl w-full max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-400 animate-pulse" />
                Smart Investment Forecast / বিনিয়োগ পূর্বাভাস: <span className="font-mono text-teal-300">{selectedForecastAnimal.id}</span>
              </h4>
              <button 
                type="button"
                onClick={() => {
                  setSelectedForecastAnimal(null);
                  setForecastResult(null);
                }} 
                className="text-slate-400 p-1 hover:text-white"
              >
                ✕
              </button>
            </div>

            {forecastLoading ? (
              <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-4 font-mono">
                <RefreshCw className="h-10 w-10 animate-spin text-teal-400" />
                <div className="space-y-1.5 max-w-md">
                  <p className="text-white font-bold text-xs animate-bounce">[AI COGNITION SEQUENCE ACTIVE]</p>
                  <p className="text-[11px] text-slate-500">Querying server-side model nodes, feeding live animal mass ratios, and fetching real-time trade trends for optimal carcass value projections...</p>
                </div>
              </div>
            ) : forecastResult ? (
              <div className="space-y-4">
                
                {/* Meta details dashboard */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/60 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Breed Class</span>
                    <span className="font-bold text-white text-xs">{selectedForecastAnimal.type} ({selectedForecastAnimal.breed})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Live Weight</span>
                    <span className="font-bold text-teal-400 text-xs">{selectedForecastAnimal.weightKg} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Purchase Cost</span>
                    <span className="font-semibold text-white text-xs">₹{selectedForecastAnimal.purchasePrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Health Condition</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold inline-block mt-0.5 ${
                      selectedForecastAnimal.healthCondition?.toLowerCase().includes("excellent")
                        ? "bg-teal-500/10 text-teal-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {selectedForecastAnimal.healthCondition || "Excellent"}
                    </span>
                  </div>
                </div>

                {/* Main Double Pane layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 leading-relaxed text-xs">
                  
                  {/* English Specimen column */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                      <h5 className="font-bold text-white text-xs uppercase tracking-wider font-mono">English Forecast Specimen</h5>
                      <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 text-[10px] font-mono rounded font-bold">
                        {Math.round(forecastResult.yieldRatio * 100)}% Dressing Rate
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-900 p-2 rounded-xl">
                        <p className="text-slate-500 text-[9px] uppercase font-mono">Total Yield</p>
                        <p className="font-bold text-white mt-1 font-mono">{forecastResult.expectedYieldKg} kg</p>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-xl">
                        <p className="text-slate-500 text-[9px] uppercase font-mono">Revenue Est</p>
                        <p className="font-bold text-emerald-400 mt-1 font-mono">₹{forecastResult.expectedRevenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-xl">
                        <p className="text-slate-500 text-[9px] uppercase font-mono">Net Profit</p>
                        <p className="font-black text-teal-400 mt-1 font-mono">₹{forecastResult.predictedProfit.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase font-mono border-b border-slate-900 pb-1">Cuts & Meat Value Decomposition</p>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {forecastResult.yieldBreakdown?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-[11px] font-mono py-1 border-b border-slate-900/40">
                            <span className="text-slate-400 text-[10px]" title={item.item}>• {item.item.length > 22 ? `${item.item.slice(0, 22)}...` : item.item}</span>
                            <span className="text-slate-300 font-bold text-right pr-2">{item.quantityKg}kg @ ₹{item.estimatedPricePerKg}/kg</span>
                            <span className="text-white font-bold shrink-0">₹{item.subtotal.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">AI Strategic Feed & Rearing Report</p>
                      <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{forecastResult.aiAnalysis}</p>
                    </div>
                  </div>

                  {/* Bengali copy column */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-teal-500/10 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                      <h5 className="font-bold text-teal-400 text-xs uppercase tracking-wider font-sans">বাংলা বিনিয়োগ ও বাজার বিশ্লেষণ কপি</h5>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-mono rounded font-bold">
                        {Math.round(forecastResult.yieldRatio * 100)}% ড্রেস রেট
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-900 p-2 rounded-xl">
                        <p className="text-slate-500 text-[9px] uppercase font-sans">সম্ভাব্য মাংস</p>
                        <p className="font-bold text-white mt-1 font-mono">{forecastResult.expectedYieldKg} কেজি</p>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-xl">
                        <p className="text-slate-500 text-[9px] uppercase font-sans font-medium">সম্ভাব্য বিক্রয়</p>
                        <p className="font-bold text-emerald-400 mt-1 font-mono">₹{forecastResult.expectedRevenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-xl">
                        <p className="text-slate-500 text-[9px] uppercase font-sans">সম্ভাব্য লাভ</p>
                        <p className="font-black text-teal-450 text-teal-400 mt-1 font-mono">₹{forecastResult.predictedProfit.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase font-sans border-b border-slate-900 pb-1">মাংসের ধরন ও স্থানীয় বাজার মূল্য বিভাজন</p>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 font-mono">
                        {forecastResult.yieldBreakdown?.map((item: any, i: number) => {
                          let itemBn = item.item;
                          if (itemBn.toLowerCase().includes("premium") || itemBn.toLowerCase().includes("solid")) itemBn = "প্রিমিয়াম সলিড মাংস";
                          else if (itemBn.toLowerCase().includes("bones")) itemBn = "হাড় ও স্যুপ বোনস";
                          else if (itemBn.toLowerCase().includes("organs") || itemBn.toLowerCase().includes("offal")) itemBn = "কলিজা / ফুসফুস ও ওফাল";
                          else if (itemBn.toLowerCase().includes("lean")) itemBn = "চর্বিহীন কিমা";
                          
                          return (
                            <div key={i} className="flex justify-between items-center text-[11px] py-1 border-b border-slate-900/40">
                              <span className="text-slate-400 text-[10px]" title={itemBn}>• {itemBn.length > 20 ? `${itemBn.slice(0, 20)}...` : itemBn}</span>
                              <span className="text-slate-300 font-semibold text-right pr-2">{item.quantityKg} কেজি @ ₹{item.estimatedPricePerKg}/কেজি</span>
                              <span className="text-white font-bold shrink-0">₹{item.subtotal.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-bold uppercase font-sans">এআই খামার পরিচালন ও বিক্রয় নির্দেশনা</p>
                      <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{forecastResult.bengaliAnalysis}</p>
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 font-mono">
                <XCircle className="h-10 w-10 text-slate-700/60 mx-auto mb-2" />
                <p>Failed to execute Gemini predictions on full-stack nodes. Ensure process.env.GEMINI_API_KEY is configured.</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setSelectedForecastAnimal(null);
                setForecastResult(null);
              }}
              className="w-full bg-slate-800 hover:bg-slate-750 text-white font-bold py-2.5 rounded-xl text-center text-xs transition"
            >
              Close Strategic Forecast
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

// Compact helper navigation link
function LinkTab({ tab, text }: { tab: string; text: string }) {
  return (
    <span className="text-xs text-teal-400 hover:text-teal-300 transition duration-150 cursor-pointer font-bold font-mono uppercase tracking-wider">
      {text}
    </span>
  );
}
