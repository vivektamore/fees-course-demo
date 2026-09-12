"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Power,
  CreditCard,
  Banknote,
  RotateCw,
  Bell,
  Check,
  Share2,
  Bookmark,
  MoreVertical,
  ChevronDown,
  X,
  ArrowDown,
  Download,
  Printer,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export default function FeePayrPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // State for toggling between Image 1 (Pending Payment) and Image 2 (Payment Success)
  const [currentView, setCurrentView] = useState<"pending" | "success">("pending");
  const [feeSelected, setFeeSelected] = useState<boolean>(true);
  const [showFeeBreakdown, setShowFeeBreakdown] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Auth guard — check login on mount
  useEffect(() => {
    const auth = localStorage.getItem("feepayr_auth");
    if (!auth) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Auto-countdown on success screen
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentView === "success" && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [currentView, countdown]);

  const handleLogout = () => {
    localStorage.removeItem("feepayr_auth");
    router.replace("/login");
  };

  const handlePayNow = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCurrentView("success");
      setCountdown(3);
    }, 900);
  };

  // Show loading spinner while checking auth — AFTER all hooks
  if (isAuthenticated === null) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0f172a"}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:"48px",height:"48px",border:"4px solid rgba(255,255,255,0.2)",borderTopColor:"#22c55e",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto"}} />
          <p style={{color:"rgba(255,255,255,0.6)",marginTop:"16px",fontSize:"0.9rem"}}>Loading...</p>
          <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
        </div>
      </div>
    );
  }


  const handleReturnHome = () => {
    setCurrentView("pending");
    setCountdown(3);
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center py-4 px-2 sm:px-4 font-sans antialiased text-slate-800">
      {/* Top Demo Bar / View Switcher */}
      <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-xl shadow-xs p-3 mb-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-700">Views:</span>
        <button
          onClick={() => setCurrentView("pending")}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            currentView === "pending"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          Image 1 (Pending)
        </button>
        <button
          onClick={() => {
            setCurrentView("success");
            setCountdown(3);
          }}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            currentView === "success"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          Image 2 (Success)
        </button>
      </div>

      {/* Main Responsive Container */}
      <div className="w-full max-w-2xl bg-[#f8faf8] shadow-2xl overflow-hidden rounded-2xl border border-slate-300">

        {/* Top Green Brand Navigation Bar */}
        <header className="bg-[#4d836e] text-white px-4 py-2.5 flex items-center justify-between shadow-xs">
          {/* Left: NAAC 'A' Grade College Emblem */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full p-0.5 shadow-sm flex items-center justify-center overflow-hidden border border-amber-300">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Wreath / Outer Circle */}
                <circle cx="50" cy="50" r="46" fill="#fff9e6" stroke="#b45309" strokeWidth="2" />
                {/* Laurel wreath garland */}
                <path
                  d="M50 10 C 20 20 12 60 40 86 C 26 62 26 30 50 18"
                  fill="#d97706"
                  opacity="0.8"
                />
                <path
                  d="M50 10 C 80 20 88 60 60 86 C 74 62 74 30 50 18"
                  fill="#d97706"
                  opacity="0.8"
                />
                {/* Inner emblem */}
                <circle cx="50" cy="50" r="30" fill="#fef08a" stroke="#b45309" strokeWidth="1.5" />
                {/* Sunrays */}
                <g stroke="#f59e0b" strokeWidth="1.5">
                  <line x1="50" y1="24" x2="50" y2="30" />
                  <line x1="50" y1="70" x2="50" y2="76" />
                  <line x1="24" y1="50" x2="30" y2="50" />
                  <line x1="70" y1="50" x2="76" y2="50" />
                </g>
                {/* Book & Lamp */}
                <path
                  d="M36 56 Q 50 50 64 56 Q 50 62 36 56 Z"
                  fill="#b91c1c"
                  stroke="#7f1d1d"
                  strokeWidth="1"
                />
                <path
                  d="M45 44 C 45 40 55 40 55 44 C 55 48 45 48 45 44 Z"
                  fill="#ef4444"
                />
                <circle cx="50" cy="38" r="3.5" fill="#eab308" />
                {/* NAAC banner text arc */}
                <text
                  x="50"
                  y="92"
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#991b1b"
                >
                  NAAC &apos;A&apos; GRADE
                </text>
              </svg>
            </div>
          </div>

          {/* Center: Student Boy Profile Avatar */}
          <div className="relative">
            <div className="w-13 h-13 rounded-full bg-white p-0.5 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* Background */}
                <circle cx="60" cy="60" r="58" fill="#fef3c7" />
                {/* Boy Hair Back */}
                <path d="M30 65 Q 26 28 60 22 Q 94 28 90 65 Z" fill="#6d4c41" />
                {/* Ears */}
                <circle cx="34" cy="64" r="8" fill="#fbcfe8" />
                <circle cx="86" cy="64" r="8" fill="#fbcfe8" />
                {/* Face */}
                <ellipse cx="60" cy="65" rx="28" ry="30" fill="#fed7aa" />
                {/* Front Hair Bangs */}
                <path
                  d="M34 45 Q 48 30 60 38 Q 72 32 86 45 Q 75 35 60 34 Q 44 35 34 45 Z"
                  fill="#5d4037"
                />
                {/* Eyebrows */}
                <path d="M42 54 Q 48 51 54 54" stroke="#4e342e" strokeWidth="2.5" fill="none" />
                <path d="M66 54 Q 72 51 78 54" stroke="#4e342e" strokeWidth="2.5" fill="none" />
                {/* Eyes */}
                <circle cx="48" cy="62" r="3.5" fill="#2d3748" />
                <circle cx="72" cy="62" r="3.5" fill="#2d3748" />
                <circle cx="49" cy="60.5" r="1" fill="#ffffff" />
                <circle cx="73" cy="60.5" r="1" fill="#ffffff" />
                {/* Nose */}
                <path d="M59 66 Q 61 70 63 68" stroke="#f97316" strokeWidth="1.5" fill="none" />
                {/* Smile */}
                <path
                  d="M48 76 Q 60 86 72 76"
                  stroke="#be185d"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Cheeks */}
                <circle cx="42" cy="71" r="3" fill="#f43f5e" opacity="0.3" />
                <circle cx="78" cy="71" r="3" fill="#f43f5e" opacity="0.3" />
                {/* Shirt / Collar (Pink Striped) */}
                <path d="M30 102 Q 60 92 90 102 L 95 120 L 25 120 Z" fill="#f472b6" />
                <path d="M48 94 L 60 108 L 72 94 Z" fill="#ffffff" />
                <path d="M60 98 L 60 120" stroke="#db2777" strokeWidth="2" />
                {/* Stripes on shirt */}
                <line x1="38" y1="102" x2="42" y2="120" stroke="#fda4af" strokeWidth="2.5" />
                <line x1="82" y1="102" x2="78" y2="120" stroke="#fda4af" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Right: Home & Logout / Power Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReturnHome}
              className="text-white/90 hover:text-white transition-colors"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => alert("Logging out of portal...")}
              className="text-white/90 hover:text-white transition-colors"
              title="Logout"
            >
              <Power className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Quick Navigation 3-Card Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Make Payment */}
            <button
              onClick={() => setCurrentView("pending")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                currentView === "pending"
                  ? "bg-white border-amber-300 shadow-sm ring-2 ring-amber-500/20"
                  : "bg-white border-slate-100 shadow-xs hover:border-slate-200"
              }`}
            >
              <span className="text-xl font-bold text-[#8d5b36] mb-1">₹</span>
              <span className="text-xs font-semibold text-slate-700 leading-tight">
                Make
                <br />
                Payment
              </span>
            </button>

            {/* Fees Receipt */}
            <button
              onClick={() => setShowReceiptModal(true)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-100 shadow-xs hover:border-slate-200 transition-all text-center"
            >
              <CreditCard className="w-5 h-5 text-[#8d5b36] mb-1" />
              <span className="text-xs font-semibold text-slate-700 leading-tight">
                Fees
                <br />
                Receipt
              </span>
            </button>

            {/* My Payment Status */}
            <button
              onClick={() => setCurrentView("success")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                currentView === "success"
                  ? "bg-white border-amber-300 shadow-sm ring-2 ring-amber-500/20"
                  : "bg-white border-slate-100 shadow-xs hover:border-slate-200"
              }`}
            >
              <RotateCw className="w-5 h-5 text-[#8d5b36] mb-1" />
              <span className="text-xs font-semibold text-slate-700 leading-tight">
                My Payment
                <br />
                Status
              </span>
            </button>
          </div>

          {/* VIEW 1: PENDING PAYMENTS */}
          {currentView === "pending" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Student Details Card */}
              <div className="bg-transparent pt-1 pb-1 space-y-1 text-left">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                  ESHA SANJAY SHAH
                </h1>

                <div className="space-y-1 text-sm font-medium">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-slate-800">ID:</span>
                    <span className="font-semibold text-[#966946]">5093490</span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-slate-800">Session:</span>
                    <span className="font-semibold text-[#966946]">2026-2027</span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-slate-800">Class:</span>
                    <span className="font-semibold text-[#966946] text-xs sm:text-sm uppercase tracking-tight">
                      BACHELOR OF SCIENCE - INFORMATION TECHNOLOGY (NEP) SEM V
                    </span>
                  </div>
                </div>
              </div>

              {/* Notice Card 1 */}
              <div className="bg-white border border-[#00a877] rounded-md overflow-hidden flex items-stretch shadow-xs">
                <div className="bg-[#00a877] px-3.5 flex items-center justify-center text-white shrink-0">
                  <Bell className="w-5 h-5 fill-white text-[#00a877]" />
                </div>
                <div className="p-2.5 text-xs text-slate-800 leading-relaxed font-normal">
                  <strong className="font-bold text-emerald-800">Note !</strong> Payment will be
                  reflected within{" "}
                  <span className="text-[#d946ef] font-semibold">24 hours</span> after making online
                  payment!
                </div>
              </div>

              {/* Notice Card 2 */}
              <div className="bg-white border border-[#00a877] rounded-md overflow-hidden flex items-stretch shadow-xs">
                <div className="bg-[#00a877] px-3.5 flex items-center justify-center text-white shrink-0">
                  <Bell className="w-5 h-5 fill-white text-[#00a877]" />
                </div>
                <div className="p-2.5 text-xs text-slate-800 leading-relaxed font-normal">
                  <strong className="font-bold text-emerald-800">Note !</strong> If Payment is not
                  reflected on portal within{" "}
                  <span className="text-[#d946ef] font-semibold">24 hours</span>, Go to My Payment
                  Status and verify your payment!
                </div>
              </div>

              {/* Section Header: Pending Payments */}
              <div className="pt-2">
                <h2 className="text-base font-semibold text-slate-900 mb-1">Pending Payments</h2>
                <div className="w-full h-[1.5px] bg-[#cbbaa7]"></div>
              </div>

              {/* Pending Payment Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-3">
                {/* Course Name - Top Right */}
                <div className="text-right">
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-600 uppercase block">
                    BACHELOR OF SCIENCE - INFORMATION TECHNOLOGY (NEP) SEM V
                  </span>
                </div>

                {/* Amount & Checkbox Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="feeSelect"
                      checked={feeSelected}
                      onChange={(e) => setFeeSelected(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-2xl sm:text-3xl font-normal text-[#8d5b36]">
                      ₹ 33700
                    </span>
                  </div>
                </div>

                {/* Admission Fee & Installment Detail */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-[#184e5a]">Admission Fee</span>
                    <button
                      onClick={() => setShowFeeBreakdown(true)}
                      className="w-4 h-4 rounded-xs bg-[#f4ebd9] text-[#8d5b36] text-[11px] font-bold flex items-center justify-center hover:bg-[#ebdcc0] transition-colors"
                      title="View fee breakdown"
                    >
                      ?
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-[#16a34a] font-semibold text-sm">
                    <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />
                    <span>10000</span>
                  </div>
                </div>

                {/* Payable Amount (10000.00) */}
                <div className="text-right pt-1">
                  <span className="text-lg font-bold text-slate-800">10000.00</span>
                </div>
              </div>

              {/* Bottom Action Section */}
              <div className="pt-2 space-y-3">
                <div className="text-right text-[11px] text-slate-500">
                  Last Attempt Time: 9/11/2026 12:14:20 AM
                </div>

                <div className="flex items-center justify-between gap-3">
                  {/* Pay Now Button */}
                  <button
                    onClick={handlePayNow}
                    disabled={!feeSelected || isProcessingPayment}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-medium text-sm text-white shadow-sm transition-all ${
                      feeSelected && !isProcessingPayment
                        ? "bg-[#ba8759] hover:bg-[#a97547] active:scale-[0.98]"
                        : "bg-slate-300 cursor-not-allowed"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isProcessingPayment ? "Processing..." : "Pay Now"}</span>
                  </button>

                  {/* Advanced Payment Link/Button */}
                  <button
                    onClick={() =>
                      alert("Advanced Payment Options: You can make partial or custom installment deposits.")
                    }
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#3b82f6] hover:text-[#2563eb] px-2 py-1 transition-colors"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Advanced Payment</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: PAYMENT SUCCESS */}
          {currentView === "success" && (
            <div className="space-y-6 pt-2 animate-in fade-in duration-200">
              {/* Payment Success Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center space-y-4">
                {/* Large Green Checkmark Circle */}
                <div className="w-16 h-16 mx-auto rounded-full bg-[#38a169] flex items-center justify-center shadow-md">
                  <Check className="w-9 h-9 text-white stroke-[3.5]" />
                </div>

                {/* Heading */}
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payment Success</h2>

                {/* Subtext */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xs mx-auto">
                  ESHA SANJAY SHAH, we have processed payment of Rs.10000.00 successfully.
                </p>

                {/* Transaction ID */}
                <div className="text-xs sm:text-sm text-slate-900">
                  <span className="font-bold">Transaction ID : </span>
                  <span className="font-medium tracking-wide">FEUPII248DC5875DE.</span>
                </div>

                {/* Thank You */}
                <div className="text-sm font-bold text-slate-800 pt-1">Thank You!</div>

                {/* Please Wait Button with Countdown */}
                <div className="pt-2">
                  <button
                    onClick={handleReturnHome}
                    className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 bg-[#2e7d32] hover:bg-[#256a29] text-white py-2.5 px-4 rounded-md font-medium text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Please Wait..</span>
                    <span className="bg-[#fff9e6] text-[#2e7d32] text-[10px] font-bold px-2 py-0.5 rounded-sm ml-1">
                      {countdown} secs
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Policies Links */}
          <footer className="pt-6 pb-2 text-center text-[10px] sm:text-[11px] text-[#2b6cb0] font-medium space-x-1.5 leading-relaxed">
            <a href="#terms" className="hover:underline">
              Terms and Conditions
            </a>
            <span className="text-slate-400">|</span>
            <a href="#refund" className="hover:underline">
              Refund and Cancellation Policy
            </a>
            <span className="text-slate-400">|</span>
            <a href="#privacy" className="hover:underline">
              Privacy Policy
            </a>
          </footer>
        </div>
      </div>

      {/* MODAL 1: Admission Fee Breakdown */}
      {showFeeBreakdown && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#8d5b36]" />
                <h3 className="font-bold text-base text-slate-900">Fee Breakdown Details</h3>
              </div>
              <button
                onClick={() => setShowFeeBreakdown(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Tuition Fee</span>
                <span className="font-semibold">₹ 18,000.00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Laboratory / Computer Lab Fee</span>
                <span className="font-semibold">₹ 8,200.00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>College Development Fund</span>
                <span className="font-semibold">₹ 2,900.00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Semester Examination Fee</span>
                <span className="font-semibold">₹ 2,500.00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Library & E-Resources</span>
                <span className="font-semibold">₹ 1,200.00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Gymkhana & Sports</span>
                <span className="font-semibold">₹ 800.00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Student Identity Card</span>
                <span className="font-semibold">₹ 100.00</span>
              </div>

              <div className="flex justify-between py-2 pt-3 text-sm font-bold text-slate-900 border-t-2 border-slate-200">
                <span>Total Annual Course Fee</span>
                <span className="text-[#8d5b36]">₹ 33,700.00</span>
              </div>
              <div className="flex justify-between py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 rounded-md">
                <span>Installment 1 (Payable Now)</span>
                <span>₹ 10,000.00</span>
              </div>
            </div>

            <button
              onClick={() => setShowFeeBreakdown(false)}
              className="w-full py-2 bg-[#4d836e] text-white rounded-lg text-xs font-medium hover:bg-[#3f6d5a] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Fees Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#38a169]" />
                <h3 className="font-bold text-base text-slate-900">Official Fees Receipt</h3>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Paper */}
            <div className="border border-slate-200 rounded-xl p-4 bg-[#fdfdfb] text-xs space-y-3 font-mono">
              <div className="text-center border-b pb-2">
                <div className="font-bold text-sm text-slate-900">FEEPAYR EDUCATIONAL SERVICES</div>
                <div className="text-[10px] text-slate-500">Receipt No: FPR/2026/09/5875DE</div>
                <div className="text-[10px] text-slate-500">Date: 11-Sep-2026 12:14:20 AM</div>
              </div>

              <div className="space-y-1">
                <div>
                  <span className="text-slate-500">Student Name:</span> ESHA SANJAY SHAH
                </div>
                <div>
                  <span className="text-slate-500">Student ID:</span> 5093490
                </div>
                <div>
                  <span className="text-slate-500">Session:</span> 2026-2027
                </div>
                <div>
                  <span className="text-slate-500">Course:</span> B.Sc. IT (NEP) SEM V
                </div>
                <div>
                  <span className="text-slate-500">Txn ID:</span> FEUPII248DC5875DE
                </div>
                <div>
                  <span className="text-slate-500">Payment Mode:</span> UPI Online
                </div>
              </div>

              <div className="border-t pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Amount Paid:</span>
                <span>₹ 10,000.00</span>
              </div>
              <div className="text-center text-[10px] text-emerald-700 font-semibold">
                Status: SUCCESSFUL / VERIFIED
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => alert("Downloading receipt PDF...")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#4d836e] text-white rounded-lg text-xs font-medium hover:bg-[#3f6d5a] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
