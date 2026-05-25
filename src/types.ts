export type UserRole = "Administrator" | "Livestock Management" | "Butcher Shop" | "Collections" | "Feed Shop" | "Livestock Manager" | "Retail Cashier" | "Investor";

export interface UserSession {
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  authMethod: "Social" | "Email" | "Phone" | "Demo";
  provider?: string;
}

export interface Investor {
  name: string;
  contribution: number;
}

export interface HealthRecord {
  id: string;
  date: string;
  event: string;
  treatment: string;
  vetName: string;
  cost: number;
  notes?: string;
  dueDate?: string;
  doctorConsultationDate?: string;
}

export interface BatchProcessLog {
  id: string;
  date: string;
  animalCount: number;
  animalIds: string[];
  totalWeightKg: number;
  yieldRatio: number;
  addedStock: {
    beef: number;
    mutton: number;
    buffalo: number;
    bones: number;
    organs: number;
  };
  operator: string;
}

export interface Animal {
  id: string;
  type: "Cow" | "Goat" | "Buffalo" | "Sheep" | "Mithun";
  breed: string;
  owner: string;
  weightKg: number;
  purchasePrice: number;
  advancePaid: number;
  due: number;
  status: "Pending" | "Paid" | "Overdue" | "Processed";
  investors: Investor[];
  dateAdded: string;
  ageMonths?: number;
  birthDate?: string;
  feedType?: string;
  healthCondition?: string;
  notes?: string;
  feedingSchedule?: string;
  dueDate?: string;
  isCached?: boolean;
  healthHistory?: HealthRecord[];
  frontImage?: string;
  leftSideImage?: string;
  rightSideImage?: string;
  backsideImage?: string;
  teethImage?: string;
  color?: string;
  appearance?: string;
  isFromBazar?: boolean;
  bazarReceiptImage?: string;
  bazarName?: string;
  feedCost?: number;
  medicineCost?: number;
  maintenanceCost?: number;
  handlingCost?: number;
  slaughterNegotiatedPrice?: number;
  slaughterProfitOrLoss?: number;
}

export interface SaleItem {
  type: string;
  weightKg: number;
  ratePerKg: number;
  amount: number;
}

export interface Installment {
  id: string;
  date: string;
  amount: number;
  paymentMethod: string;
  notes: string;
  upcomingCollectionDate?: string;
  nextCollectionDate?: string;
  specialNotes?: string;
  collectionNotes?: string;
}

export interface Sale {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCode?: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: "Cash" | "bKash" | "Card" | "Due";
  date: string;
  bengaliSms?: string;
  amountPaid?: number;
  amountDue?: number;
  isCached?: boolean;
  dueDate?: string;
  upcomingCollectionDate?: string;
  nextCollectionDate?: string;
  collectionNotes?: string;
  installments?: Installment[];
}
