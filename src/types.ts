export interface WeightHistoryItem {
  date: string;
  weightKg: number;
}

export type AnimalStatus = "Pending" | "Active" | "Processed" | "Mortality" | "Overdue" | "Sold" | "Paid" | "Partially Paid" | "Critical";

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
  department?: "Livestock" | "Poultry" | "Butcher" | "Collections" | "Feed";
}

export type UserRole = 
  | "Administrator" 
  | "Livestock Management" 
  | "Butcher Shop" 
  | "Collections" 
  | "Feed Shop"
  | "Poultry Management";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  email?: string;
}

export type PoultryType = "Broiler" | "Layer" | "Sonali" | "Duck" | "Turkey";

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
}

export interface AuditLog {
  id: string;
  action: string;
  department: string;
  timestamp: string;
  details: string;
}

