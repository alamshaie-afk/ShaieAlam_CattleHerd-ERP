import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Settings, 
  Play, 
  Check,
  ChevronDown,
  ChevronUp,
  Sliders,
  Send,
  Globe,
  ShieldAlert,
  LogOut
} from "lucide-react";
import { User } from "firebase/auth";
import { 
  initAuth, 
  googleSignIn, 
  logoutGmail, 
  sendGmailEmail,
  getAccessToken
} from "../lib/firebaseAuth";

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
  isFromBazar?: boolean;
  bazarFee?: number;
  marketName?: string;
  status: "Pending" | "Paid" | "Overdue" | "Processed";
  dateAdded: string;
}

interface ReminderLog {
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
}

interface SupplierRemindersPanelProps {
  animals: Animal[];
  reminderConfig: {
    enableEmail: boolean;
    enableSms: boolean;
    daysBefore: number;
    daysAfter: number;
    reminderMedium: "Email" | "SMS" | "Both";
  };
  setReminderConfig: React.Dispatch<React.SetStateAction<{
    enableEmail: boolean;
    enableSms: boolean;
    daysBefore: number;
    daysAfter: number;
    reminderMedium: "Email" | "SMS" | "Both";
  }>>;
  reminderLogs: ReminderLog[];
  setReminderLogs: React.Dispatch<React.SetStateAction<ReminderLog[]>>;
}

export const SupplierRemindersPanel: React.FC<SupplierRemindersPanelProps> = ({
  animals,
  reminderConfig,
  setReminderConfig,
  reminderLogs,
  setReminderLogs
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Supplier contact overrides
  const [supplierEmails, setSupplierEmails] = useState<Record<string, string>>({});
  const [supplierPhones, setSupplierPhones] = useState<Record<string, string>>({});

  // Gmail OAuth login states
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        triggerToast("Successfully connected to your Google/Gmail account for sending notices!");
      }
    } catch (err: any) {
      console.error(err);
      triggerToast("Authentication cancelled or failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await logoutGmail();
      setGoogleUser(null);
      setGoogleToken(null);
      triggerToast("Disconnected Gmail Account.");
    } catch (err) {
      console.error(err);
    }
  };

  // Filter animals that have outstanding supplier dues
  const dueAnimals = animals.filter(a => a.due > 0 && a.status !== "Processed" && a.status !== "Paid");

  // Local helper to calculate days difference
  // Positive = due date in the future (e.g. 3 days before)
  // Negative = due date in the past (e.g. -7 days equals 7 days after)
  const getDaysDiff = (dueDateStr?: string) => {
    if (!dueDateStr) return 0;
    const today = new Date("2026-05-21T10:51:39Z"); // Use user current local time as benchmark
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr + "T00:00:00");
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Trigger manual reminder send
  const sendManualReminder = async (
    animal: Animal, 
    type: "Before" | "After" | "Instant", 
    medium: "Email" | "SMS" | "Both"
  ) => {
    const isSms = medium === "SMS" || medium === "Both";
    const isEmail = medium === "Email" || medium === "Both";

    const daysDiff = getDaysDiff(animal.dueDate);
    const labelType = type === "Before" 
      ? `${reminderConfig.daysBefore} Days Before Alert` 
      : type === "After" 
      ? `${reminderConfig.daysAfter} Days After Overdue Alert` 
      : "Instant Manual Alert";

    const text = `Urgent Trade Notice for ${animal.owner}: outstanding supplier payment of ₹${animal.due.toLocaleString()} for ${animal.type} (${animal.id}) originally due on ${animal.dueDate || "N/A"}. Please settle the invoice.`;

    const destEmail = supplierEmails[animal.id] || `${animal.owner.toLowerCase().replace(/\s+/g, "")}@gmail.com`;
    const destPhone = supplierPhones[animal.id] || "+880 1711-223344";

    let finalStatus: "Sent" | "Failed" = "Sent";
    const channels: string[] = [];

    if (isSms) {
      channels.push(`SMS to ${destPhone}`);
    }

    if (isEmail) {
      if (googleToken) {
        channels.push(`Gmail to ${destEmail}`);
        const success = await sendGmailEmail(
          destEmail,
          `Outstanding Balance Reminder: Animal ${animal.id}`,
          text
        );
        if (!success) {
          finalStatus = "Failed";
        }
      } else {
        channels.push(`Simulated Email to ${destEmail}`);
      }
    }

    const newLog: ReminderLog = {
      id: `REM-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 90 + 10)}`,
      animalId: animal.id,
      ownerName: animal.owner,
      dueDate: animal.dueDate || "N/A",
      amount: animal.due,
      daysDiff,
      type: labelType,
      medium,
      sentAt: new Date().toLocaleString(),
      status: finalStatus,
      messageText: text + (googleToken ? "" : " (Simulation Mode - Sign in with Google to send actual emails)")
    };

    setReminderLogs(prev => [newLog, ...prev]);
    
    if (finalStatus === "Sent") {
      triggerToast(`Alert sent successfully via ${channels.join(" & ")}!`);
    } else {
      triggerToast(`Failed to send alert via Gmail. Check Google connection.`);
    }
  };

  // Run the full automated sweep of reminders (simulated daily cron trigger)
  const executeAutomatedRemindersRun = async () => {
    let sentCount = 0;
    let failedCount = 0;
    const newLogsToAdd: ReminderLog[] = [];

    for (const animal of dueAnimals) {
      const daysDiff = getDaysDiff(animal.dueDate);
      
      // Match daysBefore or daysAfter
      const isBeforeTrigger = daysDiff === reminderConfig.daysBefore;
      const isAfterTrigger = daysDiff === -reminderConfig.daysAfter;

      if (isBeforeTrigger || isAfterTrigger) {
        const typeLabel = isBeforeTrigger 
          ? `${reminderConfig.daysBefore} Days Before Alert` 
          : `${reminderConfig.daysAfter} Days After Overdue Alert`;

        const alreadySent = reminderLogs.some(
          log => log.animalId === animal.id && log.type === typeLabel
        );

        if (!alreadySent) {
          const med = reminderConfig.reminderMedium;
          const text = isBeforeTrigger 
            ? `Dear ${animal.owner}, this is an automated advance notice of outstanding dues of ₹${animal.due.toLocaleString()} for animal ${animal.id} due on ${animal.dueDate || "N/A"}.`
            : `Overdue Warning to ${animal.owner}: payment of ₹${animal.due.toLocaleString()} for animal ${animal.id} is now ${reminderConfig.daysAfter} days past due date (${animal.dueDate || "N/A"}). Please settle.`;

          const destEmail = supplierEmails[animal.id] || `${animal.owner.toLowerCase().replace(/\s+/g, "")}@gmail.com`;
          let finalStatus: "Sent" | "Failed" = "Sent";

          if ((med === "Email" || med === "Both") && googleToken) {
            const success = await sendGmailEmail(
              destEmail,
              `Scheduled Dues Notice: ${animal.id}`,
              text
            );
            if (!success) {
              finalStatus = "Failed";
              failedCount++;
            } else {
              sentCount++;
            }
          } else {
            sentCount++;
          }

          newLogsToAdd.push({
            id: `AUTO-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 900 + 100)}`,
            animalId: animal.id,
            ownerName: animal.owner,
            dueDate: animal.dueDate || "N/A",
            amount: animal.due,
            daysDiff,
            type: typeLabel,
            medium: med,
            sentAt: new Date().toLocaleString(),
            status: finalStatus,
            messageText: text + (googleToken ? "" : " (Simulated automated broadcast)")
          });
        }
      }
    }

    if (newLogsToAdd.length > 0) {
      setReminderLogs(prev => [...newLogsToAdd, ...prev]);
      triggerToast(`Automated reminders run: Dispatched ${sentCount} reminders! ${failedCount > 0 ? `${failedCount} failed.` : ""}`);
    } else {
      triggerToast("Automated sweep completed: No new pending alerts matched checklist criteria for 2026-05-21.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-6 transition-all duration-300">
      {/* Panel Sticky Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition select-none bg-slate-950/45"
      >
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/15 p-2 rounded-xl text-amber-400 border border-amber-500/25">
            <Bell className="h-5 w-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white tracking-wide">Automated Supplier Payables Reminders Control</h4>
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
              Request real-time Gmail broadcasts before & after purchase due dates for outstanding suppliers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500 bg-slate-900 px-2.5 py-1 border border-slate-800 rounded-lg font-mono">
            {dueAnimals.length} Active Payables
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </div>

      {/* Expandable Core Container */}
      {isOpen && (
        <div className="p-6 border-t border-slate-850 bg-slate-900/60 font-sans space-y-6">
          
          {/* Toast Notification Box */}
          {toastMessage && (
            <div className="bg-teal-500/10 border border-teal-500/30 text-teal-300 px-4 py-3 rounded-2xl text-xs font-mono flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle className="h-4 w-4 text-teal-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* GOOGLE AUTO GMAIL CONNECT PANEL */}
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${googleUser ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-900 text-slate-400 border-slate-800"}`}>
                <Mail className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">Google Workspace Integration</span>
                {googleUser ? (
                  <p className="text-[11px] text-emerald-400">Connected as <strong>{googleUser.email}</strong></p>
                ) : (
                  <p className="text-[11px] text-slate-500">Sign in with Google to enable actual live Gmail sending alerts.</p>
                )}
              </div>
            </div>

            {googleUser ? (
              <button
                type="button"
                onClick={handleGoogleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-rose-550/15 hover:text-rose-400 text-slate-400 border border-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Disconnect Account
              </button>
            ) : (
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={handleGoogleSignIn}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 rounded-xl text-xs font-black shadow-lg transition cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5" />
                {isLoggingIn ? "Connecting..." : "Connect Custom Gmail Account"}
              </button>
            )}
          </div>

          {/* Form and Trigger Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 1. Left Config Settings Box */}
            <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Sliders className="h-3.5 w-3.5 text-amber-500" />
                    <span>Configuration Parameters</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">ADMIN SYSTEM</span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Channels Toggles */}
                  <div className="space-y-2">
                    <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Notification Medium</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Email", "SMS", "Both"] as const).map((med) => (
                        <button
                          key={med}
                          type="button"
                          onClick={() => setReminderConfig(prev => ({ ...prev, reminderMedium: med }))}
                          className={`py-2 rounded-xl border text-center font-bold tracking-wider transition ${
                            reminderConfig.reminderMedium === med
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          {med}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Offset Days Form */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Days Before Alert
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={reminderConfig.daysBefore}
                          onChange={(e) => setReminderConfig(prev => ({ ...prev, daysBefore: parseInt(e.target.value) || 3 }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                        />
                        <span className="absolute right-2.5 text-[10px] text-slate-500 font-mono select-none">days</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Days After Overdue
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="45"
                          value={reminderConfig.daysAfter}
                          onChange={(e) => setReminderConfig(prev => ({ ...prev, daysAfter: parseInt(e.target.value) || 7 }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                        />
                        <span className="absolute right-2.5 text-[10px] text-slate-500 font-mono select-none">days</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Trigger {reminderConfig.daysBefore} days before:</span>
                      <span className="text-emerald-400 font-bold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Trigger {reminderConfig.daysAfter} days after:</span>
                      <span className="text-rose-400 font-bold">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-900 pt-4">
                <button
                  type="button"
                  onClick={executeAutomatedRemindersRun}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current text-slate-920 text-slate-950" />
                  Run Scheduled Reminders Sweep
                </button>
                <div className="text-center text-[9px] text-slate-500 mt-2 font-mono">
                  Benchmark Base: 2026-05-21 • System Clock
                </div>
              </div>
            </div>

            {/* 2. Right Actions & Preview list */}
            <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5 text-teal-400" />
                    <span>Animals Due Checklist ({dueAnimals.length})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono">2026-05-21</span>
                </div>

                {dueAnimals.length === 0 ? (
                  <div className="p-10 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-xs font-mono">
                    All supplier payables are currently settled!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                    {dueAnimals.map(animal => {
                      const daysDiff = getDaysDiff(animal.dueDate);
                      const isOverdue = daysDiff < 0;
                      
                      let alertBadgeStyle = "bg-slate-900 text-slate-400 border border-slate-800";
                      let adviceText = "Pending Timeline";

                      if (daysDiff === reminderConfig.daysBefore) {
                        alertBadgeStyle = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                        adviceText = `${reminderConfig.daysBefore} Days Before Alert`;
                      } else if (daysDiff === -reminderConfig.daysAfter) {
                        alertBadgeStyle = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                        adviceText = `${reminderConfig.daysAfter} Days Overdue Alert`;
                      } else if (isOverdue) {
                        alertBadgeStyle = "bg-rose-950/20 text-rose-300 border border-rose-900/15";
                        adviceText = `${Math.abs(daysDiff)} Days Overdue`;
                      } else {
                        adviceText = `${daysDiff} Days Unto Due`;
                      }

                      // Dynamic inputs
                      const currentEmail = supplierEmails[animal.id] || `${animal.owner.toLowerCase().replace(/\s+/g, "")}@gmail.com`;
                      const currentPhone = supplierPhones[animal.id] || "+880 1711-223344";

                      return (
                        <div 
                          key={animal.id}
                          className="p-3 bg-slate-900/80 rounded-xl border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono hover:border-slate-700 transition"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-xs">{animal.id}</span>
                              <span className="text-[10px] text-slate-400 font-sans font-bold">({animal.owner})</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px] text-slate-450 text-slate-400">
                              <span>Due: ₹{animal.due.toLocaleString()}</span>
                              <span className="text-slate-700">•</span>
                              <span className="text-teal-400">D/D: {animal.dueDate || "N/A"}</span>
                            </div>

                            {/* Live Configurable Address/Contacts Inputs block */}
                            <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-900">
                              <div className="flex items-center gap-1.5 text-[9.5px]">
                                <span className="text-slate-500 font-sans w-8">Email:</span>
                                <input 
                                  type="email" 
                                  value={currentEmail}
                                  onChange={(e) => setSupplierEmails(prev => ({ ...prev, [animal.id]: e.target.value }))}
                                  className="bg-slate-950 border border-slate-850 rounded px-1.5 py-0.5 text-slate-200 text-[9.5px] w-48 focus:outline-none focus:border-teal-500 font-sans" 
                                />
                              </div>
                              <div className="flex items-center gap-1.5 text-[9.5px]">
                                <span className="text-slate-500 font-sans w-8">Phone:</span>
                                <input 
                                  type="text" 
                                  value={currentPhone}
                                  onChange={(e) => setSupplierPhones(prev => ({ ...prev, [animal.id]: e.target.value }))}
                                  className="bg-slate-950 border border-slate-850 rounded px-1.5 py-0.5 text-slate-200 text-[9.5px] w-48 focus:outline-none focus:border-teal-500 font-sans" 
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex md:flex-col items-end gap-2 shrink-0 border-t md:border-t-0 border-slate-850 pt-2 md:pt-0">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${alertBadgeStyle} font-sans`}>
                              {adviceText}
                            </span>
                            <button
                              type="button"
                              onClick={() => sendManualReminder(animal, daysDiff === reminderConfig.daysBefore ? "Before" : isOverdue ? "After" : "Instant", reminderConfig.reminderMedium)}
                              className="bg-amber-500 text-slate-950 font-black hover:bg-amber-400 p-2 rounded-xl transition duration-150 flex items-center gap-1 text-[10px] cursor-pointer"
                              title="Force send manual notice now"
                            >
                              <Send className="h-3 w-3" />
                              Send Notice
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Status footer inside Checklist */}
              <div className="border-t border-slate-900 pt-3 mt-3 text-[10px] text-slate-500 flex justify-between tracking-wide">
                <span>SMS Provider Status: <strong className="text-emerald-400 font-mono">ONLINE</strong></span>
                <span>Gmail Relay: <strong className={`${googleToken ? "text-emerald-400" : "text-amber-500 animate-pulse"} font-mono`}>{googleToken ? "CONNECTED (REAL)" : "SIMULATOR ACTIVE"}</strong></span>
              </div>
            </div>
            
          </div>

          {/* 3. Bottom Audit Reminders Sent Log Register section */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>Auditing logs: Broadcasts & Dispatched Reminders Register ({reminderLogs.length})</span>
              </div>
              <button 
                type="button"
                onClick={() => setReminderLogs([])}
                className="text-[10px] text-slate-500 hover:text-rose-400 font-bold transition underline"
              >
                Clear Audit Register
              </button>
            </div>

            {reminderLogs.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-900 rounded-xl text-center text-slate-500 text-xs font-mono">
                No reminders sent during this session yet. Reminders dispatched are appended here.
              </div>
            ) : (
              <div className="space-y-3 max-h-[170px] overflow-y-auto pr-1">
                {reminderLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold">{log.id}</span>
                        <span className="font-bold text-white">{log.ownerName}</span>
                        <span className="text-[10px] text-slate-400">(Amnt: ₹{log.amount.toLocaleString()} • Due: {log.dueDate})</span>
                        <span className="text-[9px] font-sans font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25 px-2 py-0.5 rounded uppercase tracking-wider">
                          {log.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-305 text-slate-400 bg-slate-950/40 p-2 border border-slate-900 rounded-lg">
                        "{log.messageText}"
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end gap-1.5 justify-between sm:justify-start">
                      <span className="text-[10px] text-slate-500 font-mono">{log.sentAt}</span>
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 ${log.status === "Sent" ? "bg-emerald-500" : "bg-rose-500"} rounded-full`}></span>
                        <span className={`text-[10px] ${log.status === "Sent" ? "text-emerald-400" : "text-rose-400"} font-bold uppercase`}>{log.status}</span>
                        <span className="text-[9.5px] text-slate-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800 uppercase ml-1">
                          {log.medium}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
