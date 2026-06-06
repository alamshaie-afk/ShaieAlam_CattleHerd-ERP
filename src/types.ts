export interface WeightHistoryItem {
  date: string;
  weightKg: number;
}

export type AnimalStatus = "Pending" | "Active" | "Processed" | "Mortality" | "Overdue" | "Sold" | "Paid" | "Partially Paid" | "Critical";

export interface LivestockHealthLog {
  id: string;
  date: string;
  vaccinationDate?: string;
  symptoms: string;
  vetNotes: string;
}

export interface Animal {
  id: string; // e.g., ANI-001
  type: string; // e.g., "Cow" | "Goat" | "Sheep" | "Buffalo" | "Mithun"
  breed: string; // e.g., "Jersey Cross", "Black Bengal", etc.
  ageMonths: number;
  weightKg: number;
  purchasePrice: number;
  advancePaid: number;
  due: number;
  owner: string; // Supplier name
  status: AnimalStatus;
  weightHistory?: WeightHistoryItem[];
  cumulativeWelfareCost?: number;
  notes?: string;
  insuranceClaimAmount?: number;
  mortalityDate?: string;
  qr_validated?: boolean;
  healthLogs?: LivestockHealthLog[];
  purchaseDate?: string;
  sellerContact?: string;
}

export interface SaleItem {
  type: string; // e.g., "Beef", "Mutton", "Feed", "Byproducts"
  weightKg: number;
  ratePerKg: number;
}

export interface Installment {
  id: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  paidDate?: string;
}

export interface CallLog {
  id: string;
  timestamp: string;
  notes: string;
  agentName: string;
}

export interface Sale {
  id: string; // e.g., INV-001
  customerName: string;
  customerPhone?: string;
  customerCode?: string;
  date: string;
  items: SaleItem[];
  total: number;
  amountPaid: number;
  amountDue: number;
  status: "Paid" | "Partial" | "Overdue" | "Due" | "Unsettled";
  paymentMethod: "Cash" | "bKash" | "UPI" | "Credit" | "Due";
  transactionRefId?: string;
  installments?: Installment[];
  callLogs?: CallLog[];
  promisedPaymentDate?: string;
}

export interface Transaction {
  id: string;
  type: "Revenue" | "Expense";
  category: "Sale" | "Purchase" | "Feed" | "Medical" | "Welfare" | "Operational" | "Salary";
  amount: number;
  date: string;
  description: string;
  referenceId?: string; // e.g., animalId or invoiceId
  department?: "Livestock" | "Poultry" | "Butcher" | "Collections" | "Feed" | "Cold Storage";
}

export interface ColdStorageItem {
  id: string; // e.g., COLD-001
  batchId: string;
  itemType: string; // e.g., "Premium Beef Loin", "Premium Mutton", etc.
  totalKg: number;
  frozenDate: string;
  expiryDate: string;
  temperatureCs: number;
  storageBin: string;
  packagingType: string;
  status: "Frozen" | "Defrosting" | "Dispatched";
  notes?: string;
  freezerId?: string; // Links item to a specific freezer unit
}

export interface Freezer {
  id: string; // e.g., FRZ-001
  name: string; // e.g., "Chamber A - Deep Freeze"
  capacityKg: number; // e.g., 2000
  status: "Active" | "Maintenance" | "Decommissioned";
  targetTempCs: number; // e.g., -18.5
  notes?: string;
}

export interface FreezerElectricityBill {
  id: string; // e.g., EB-001
  freezerId: string;
  month: string; // "YYYY-MM" (e.g., "2026-05")
  kWhConsumed: number;
  billAmount: number; // BDT 
  status: "Paid" | "Pending";
  paymentDate?: string;
  notes?: string;
}

export type UserRole = 
  | "Admin"
  | "Butcher"
  | "Accountant"
  | "Administrator" 
  | "Livestock Management" 
  | "Butcher Shop" 
  | "Collections" 
  | "Feed Shop"
  | "Poultry Management"
  | "Cold Storage Manager";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  email?: string;
}

export type PoultryType = "Broiler" | "Layer" | "Sonali" | "Duck" | "Turkey";

export interface PoultryHealthLog {
  id: string;
  timestamp: string;
  type: "Symptom" | "Vaccination";
  detail: string;
  notes?: string;
}

export interface PoultryBatch {
  id: string;
  type: PoultryType;
  breed: string;
  housingBuilding: string;
  initialCount: number;
  currentCount: number;
  acquisitionDate: string;
  acquisitionAgeDays: number;
  currentAgeDays: number;
  averageWeightKg: number;
  feedConsumedKg: number;
  mortalityCount: number;
  eggsCollectedCumulative?: number;
  purchaseCost: number;
  status: "Chicks" | "Growing" | "Laying" | "Harvested" | "Sold";
  notes?: string;
  salesRevenue?: number;
  healthLogs?: PoultryHealthLog[];
}

export interface AuditLog {
  id: string;
  action: string;
  department: string;
  timestamp: string;
  details: string;
}

export interface FeedSchedule {
  id: string;
  batchId: string;
  feedKg: number;
  intervalMinutes: number;
  lastTriggered?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

