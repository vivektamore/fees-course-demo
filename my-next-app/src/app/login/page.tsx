"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type LoginMode = "mobile" | "email" | "userid";

// Demo credentials — replace with real API calls
const DEMO_OTP = "123456";
const DEMO_CREDENTIALS: Record<string, string> = { admin: "admin123", vivek: "fees@123" };

function generateCaptcha(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default function LoginPage() {
  const router = useRouter();
  const [instituteType, setInstituteType] = useState("College");
  const [loginMode, setLoginMode] = useState<LoginMode>("mobile");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [credError, setCredError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [sideTab, setSideTab] = useState<"demo" | "request" | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { setCaptchaCode(generateCaptcha()); }, []);

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp]; newOtp[index] = value; setOtp(newOtp);
    setOtpError("");
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  // Validate CAPTCHA strictly for all modes
  const validateCaptcha = (): boolean => {
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setCaptchaError("❌ Invalid CAPTCHA. Please try again.");
      refreshCaptcha();
      return false;
    }
    setCaptchaError("");
    return true;
  };

  // Handle OTP send (mobile/email)
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCaptcha()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setOtpSent(true); }, 1500);
  };

  // Handle UserID/Password login
  const handleUserIdLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError("");
    if (!validateCaptcha()) return;
    // Validate credentials
    const expectedPassword = DEMO_CREDENTIALS[userId.trim().toLowerCase()];
    if (!expectedPassword || expectedPassword !== password) {
      setCredError("❌ Invalid User ID or Password. Please try again.");
      refreshCaptcha();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("feepayr_auth", JSON.stringify({ userId, loginMode, instituteType, loggedAt: Date.now() }));
      router.push("/");
    }, 1500);
  };

  // Handle OTP verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    const enteredOtp = otp.join("");
    if (enteredOtp !== DEMO_OTP) {
      setOtpError("❌ Invalid OTP. Please try again. (Demo OTP: 123456)");
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("feepayr_auth", JSON.stringify({ mobile, email, loginMode, instituteType, loggedAt: Date.now() }));
      router.push("/");
    }, 1500);
  };

  return (
    <div className="login-root">
      <div className="login-bg" />

      <div className="side-tabs">
        <button className={`side-tab demo-tab${sideTab === "demo" ? " active" : ""}`} onClick={() => setSideTab(sideTab === "demo" ? null : "demo")}><span>Free Demo</span></button>
        <button className={`side-tab request-tab${sideTab === "request" ? " active" : ""}`} onClick={() => setSideTab(sideTab === "request" ? null : "request")}><span>Request</span></button>
      </div>

      <div className="login-container">
        <div className="logo-section">
          <div className="logo-box">
            <span className="logo-f">f</span><span className="logo-text">eepayr</span>
            <div className="logo-badge"><span>fp</span></div>
          </div>
          <p className="logo-tagline">Pay Fees Anytime, Anywhere</p>
        </div>

        <h1 className="login-headline">Start Using<br /><span>Feepayr Now!</span></h1>

        <div className="login-card">
          {!otpSent ? (
            <form onSubmit={loginMode === "userid" ? handleUserIdLogin : handleSendOtp} className="login-form">
              <div className="form-group">
                <label className="form-label">Institute Type</label>
                <div className="select-wrapper">
                  <select id="institute-type" value={instituteType} onChange={e => setInstituteType(e.target.value)} className="form-select">
                    {["College","School","University","Coaching","Other"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="select-arrow">▾</span>
                </div>
              </div>

              <div className="radio-group">
                {(["mobile","email","userid"] as LoginMode[]).map(mode => (
                  <label key={mode} className="radio-label">
                    <input type="radio" name="loginMode" value={mode} checked={loginMode === mode} onChange={() => { setLoginMode(mode); setOtpSent(false); setCredError(""); setCaptchaError(""); refreshCaptcha(); }} className="radio-input" id={`mode-${mode}`} />
                    <span className="radio-dot" />
                    <span className="radio-text">{mode === "mobile" ? "Mobile" : mode === "email" ? "Email" : "UserID/Password"}</span>
                  </label>
                ))}
              </div>

              {loginMode === "mobile" && (
                <div className="form-group">
                  <input id="mobile-input" type="tel" maxLength={10} placeholder="Enter registered mobile number" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/,""))} className="form-input" required />
                </div>
              )}
              {loginMode === "email" && (
                <div className="form-group">
                  <input id="email-input" type="email" placeholder="Enter registered email address" value={email} onChange={e => setEmail(e.target.value)} className="form-input" required />
                </div>
              )}
              {loginMode === "userid" && (
                <>
                  <div className="form-group">
                    <input id="userid-input" type="text" placeholder="Enter User ID" value={userId} onChange={e => { setUserId(e.target.value); setCredError(""); }} className="form-input" required />
                  </div>
                  <div className="form-group password-group">
                    <input id="password-input" type={showPass ? "text" : "password"} placeholder="Enter Password" value={password} onChange={e => { setPassword(e.target.value); setCredError(""); }} className="form-input" required />
                    <button type="button" className="show-pass-btn" onClick={() => setShowPass(!showPass)}>{showPass ? "🙈" : "👁️"}</button>
                  </div>
                  {credError && <p className="error-msg">{credError}</p>}
                </>
              )}

              {/* CAPTCHA shown for ALL login modes */}
              <div className="captcha-display">
                <span className="captcha-code">{captchaCode}</span>
                <button type="button" className="captcha-refresh" onClick={refreshCaptcha} title="Refresh CAPTCHA">↻</button>
              </div>
              <div className="form-group">
                <input id="captcha-input" type="text" placeholder="ENTER CAPTCHA CODE" value={captchaInput} onChange={e => { setCaptchaInput(e.target.value); setCaptchaError(""); }} className={`form-input captcha-input${captchaError ? " input-error" : ""}`} required />
                {captchaError && <p className="error-msg">{captchaError}</p>}
              </div>

              <button id="send-otp-btn" type="submit" className="submit-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : loginMode === "userid" ? "Login" : "Send OTP"}
              </button>
              {loginMode === "userid" && <p className="demo-hint">🔑 Demo: ID <strong>admin</strong> / Pass <strong>admin123</strong></p>}
              {loginMode !== "userid" && <p className="demo-hint">📱 Demo OTP: <strong>123456</strong></p>}
              <p className="login-footer-text">Trouble logging in? <a href="#" className="footer-link">Contact Support</a></p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="login-form">
              <div className="otp-header">
                <div className="otp-icon">📱</div>
                <h2 className="otp-title">OTP Verification</h2>
                <p className="otp-subtitle">Enter the 6-digit OTP sent to <strong>{loginMode === "mobile" ? `+91 ****${mobile.slice(-4)}` : email}</strong></p>
              </div>
              <div className="otp-inputs">
                {otp.map((digit, i) => (
                  <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)} ref={el => { otpRefs.current[i] = el; }} className={`otp-box${otpError ? " otp-box-error" : ""}`} inputMode="numeric" />
                ))}
              </div>
              {otpError && <p className="error-msg" style={{textAlign:"center"}}>{otpError}</p>}
              <button id="verify-otp-btn" type="submit" className="submit-btn" disabled={loading || otp.join("").length < 6}>
                {loading ? <span className="spinner" /> : "Verify & Login"}
              </button>
              <div className="resend-row">
                <span className="resend-text">Did not receive OTP?</span>
                <button type="button" className="resend-btn" onClick={() => { setOtpSent(false); refreshCaptcha(); setOtp(["","","","","",""]); setOtpError(""); }}>Resend OTP</button>
              </div>
            </form>
          )}
        </div>

        <div className="social-row">
          {[{icon:"f",color:"#1877f2",label:"Facebook"},{icon:"t",color:"#1da1f2",label:"Twitter"},{icon:"in",color:"#0a66c2",label:"LinkedIn"},{icon:"✉",color:"#ea4335",label:"Email"}].map(({icon,color,label}) => (
            <a key={label} href="#" className="social-btn" style={{background:color}} aria-label={label} title={label}>{icon}</a>
          ))}
        </div>
        <p className="server-info">Server — 2</p>
      </div>

      {sideTab && (
        <div className="side-modal">
          <div className="side-modal-inner">
            <button className="side-modal-close" onClick={() => setSideTab(null)}>✕</button>
            {sideTab === "demo" ? (
              <><h3>Request a Free Demo</h3><p>Fill out the form and our team will get in touch.</p><input className="form-input" placeholder="Your Name" /><input className="form-input" placeholder="Institute Name" /><input className="form-input" placeholder="Mobile Number" /><button className="submit-btn">Request Demo</button></>
            ) : (
              <><h3>Submit a Request</h3><p>Tell us what you need and we will respond within 24 hours.</p><input className="form-input" placeholder="Your Name" /><input className="form-input" placeholder="Message" /><button className="submit-btn">Submit</button></>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .login-root{min-height:100vh;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif;}
        .login-bg{position:fixed;inset:0;background:url('/login-bg.jpg') center/cover no-repeat;filter:blur(2px) brightness(0.45);transform:scale(1.05);z-index:0;}
        .side-tabs{position:fixed;right:0;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:4px;z-index:50;}
        .side-tab{writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);padding:18px 10px;border:none;cursor:pointer;font-size:13px;font-weight:700;letter-spacing:1px;color:#fff;border-radius:8px 0 0 8px;transition:all 0.3s;box-shadow:-3px 3px 12px rgba(0,0,0,0.3);}
        .demo-tab{background:linear-gradient(180deg,#1e3a6e,#2563eb);}
        .demo-tab:hover,.demo-tab.active{background:linear-gradient(180deg,#1e40af,#3b82f6);transform:rotate(180deg) translateX(4px);}
        .request-tab{background:linear-gradient(180deg,#166534,#22c55e);}
        .request-tab:hover,.request-tab.active{background:linear-gradient(180deg,#15803d,#4ade80);transform:rotate(180deg) translateX(4px);}
        .login-container{position:relative;z-index:10;width:100%;max-width:420px;padding:24px 20px 32px;display:flex;flex-direction:column;align-items:center;}
        .logo-section{display:flex;flex-direction:column;align-items:center;margin-bottom:8px;background:rgba(255,255,255,0.12);backdrop-filter:blur(10px);padding:12px 32px;border-radius:16px;border:1px solid rgba(255,255,255,0.2);}
        .logo-box{display:flex;align-items:center;gap:2px;}
        .logo-f{font-size:2.6rem;font-weight:900;color:#2563eb;font-style:italic;line-height:1;}
        .logo-text{font-size:2rem;font-weight:700;color:#2563eb;font-style:italic;}
        .logo-badge{background:linear-gradient(135deg,#2563eb,#1e3a6e);border-radius:10px;padding:4px 8px;margin-left:6px;box-shadow:0 2px 8px rgba(37,99,235,0.5);}
        .logo-badge span{color:#fff;font-weight:900;font-size:0.85rem;font-style:italic;}
        .logo-tagline{color:rgba(255,255,255,0.85);font-size:0.78rem;margin:4px 0 0;letter-spacing:0.5px;}
        .login-headline{font-size:2rem;font-weight:800;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,0.5);margin:16px 0 12px;line-height:1.2;text-align:left;width:100%;}
        .login-headline span{color:#4ade80;}
        .login-card{width:100%;background:rgba(255,255,255,0.1);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.25);border-radius:20px;padding:24px 20px;box-shadow:0 20px 60px rgba(0,0,0,0.4);}
        .login-form{display:flex;flex-direction:column;gap:14px;}
        .form-group{display:flex;flex-direction:column;gap:4px;position:relative;}
        .form-label{color:rgba(255,255,255,0.9);font-size:0.85rem;font-weight:600;}
        .select-wrapper{position:relative;}
        .form-select{width:100%;padding:12px 40px 12px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.95);color:#1e293b;font-size:0.95rem;appearance:none;cursor:pointer;outline:none;transition:border 0.2s,box-shadow 0.2s;}
        .form-select:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.2);}
        .select-arrow{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#64748b;pointer-events:none;font-size:1.1rem;}
        .form-input{width:100%;padding:12px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.95);color:#1e293b;font-size:0.95rem;outline:none;transition:border 0.2s,box-shadow 0.2s;box-sizing:border-box;}
        .form-input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.2);}
        .form-input::placeholder{color:#94a3b8;}
        .input-error{border-color:#ef4444!important;}
        .error-msg{color:#fca5a5;font-size:0.78rem;margin:2px 0 0;}
        .password-group{position:relative;}
        .show-pass-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:1.1rem;padding:0;}
        .radio-group{display:flex;flex-wrap:wrap;gap:12px;}
        .radio-label{display:flex;align-items:center;gap:8px;cursor:pointer;}
        .radio-input{display:none;}
        .radio-dot{width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,0.7);position:relative;transition:border-color 0.2s;flex-shrink:0;}
        .radio-input:checked + .radio-dot{border-color:#2563eb;background:#2563eb;box-shadow:inset 0 0 0 4px rgba(255,255,255,0.9);}
        .radio-text{color:rgba(255,255,255,0.9);font-size:0.88rem;font-weight:500;}
        .captcha-display{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.95);border-radius:10px;padding:10px 16px;border:1px solid rgba(255,255,255,0.3);}
        .captcha-code{font-family:'Courier New',monospace;font-size:1.5rem;font-weight:900;letter-spacing:6px;color:#1e3a6e;flex:1;user-select:none;}
        .captcha-refresh{background:none;border:none;font-size:1.4rem;cursor:pointer;color:#2563eb;padding:4px;border-radius:6px;transition:transform 0.3s;}
        .captcha-refresh:hover{transform:rotate(180deg);}
        .captcha-input{text-transform:uppercase;letter-spacing:4px;font-weight:700;}
        .submit-btn{width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:1rem;font-weight:700;cursor:pointer;transition:all 0.3s;box-shadow:0 4px 20px rgba(34,197,94,0.4);display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:0.5px;}
        .submit-btn:hover:not(:disabled){background:linear-gradient(135deg,#4ade80,#22c55e);box-shadow:0 6px 28px rgba(34,197,94,0.6);transform:translateY(-1px);}
        .submit-btn:disabled{opacity:0.7;cursor:not-allowed;}
        .spinner{width:20px;height:20px;border:3px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .login-footer-text{color:rgba(255,255,255,0.7);font-size:0.8rem;text-align:center;}
        .footer-link{color:#4ade80;text-decoration:none;font-weight:600;}
        .demo-hint{color:rgba(255,255,255,0.6);font-size:0.78rem;text-align:center;margin:0;background:rgba(255,255,255,0.08);padding:8px 12px;border-radius:8px;border:1px dashed rgba(255,255,255,0.2);}
        .demo-hint strong{color:#fbbf24;}
        .otp-box-error{border-color:#ef4444!important;animation:shake 0.3s ease;}
        @keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        .footer-link:hover{text-decoration:underline;}
        .otp-header{text-align:center;}
        .otp-icon{font-size:2.5rem;margin-bottom:8px;}
        .otp-title{color:#fff;font-size:1.3rem;font-weight:700;margin:0 0 6px;}
        .otp-subtitle{color:rgba(255,255,255,0.8);font-size:0.85rem;margin:0;}
        .otp-subtitle strong{color:#4ade80;}
        .otp-inputs{display:flex;gap:10px;justify-content:center;margin:8px 0;}
        .otp-box{width:46px;height:52px;text-align:center;font-size:1.4rem;font-weight:700;border-radius:10px;border:2px solid rgba(255,255,255,0.4);background:rgba(255,255,255,0.95);color:#1e3a6e;outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
        .otp-box:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.3);}
        .resend-row{display:flex;align-items:center;justify-content:center;gap:8px;}
        .resend-text{color:rgba(255,255,255,0.7);font-size:0.85rem;}
        .resend-btn{background:none;border:none;color:#4ade80;font-size:0.85rem;font-weight:700;cursor:pointer;padding:0;}
        .resend-btn:hover{text-decoration:underline;}
        .social-row{display:flex;gap:14px;margin-top:20px;}
        .social-btn{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.9rem;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,0.3);transition:transform 0.2s,box-shadow 0.2s;}
        .social-btn:hover{transform:translateY(-3px) scale(1.1);box-shadow:0 8px 20px rgba(0,0,0,0.4);}
        .server-info{color:rgba(255,255,255,0.5);font-size:0.75rem;margin-top:10px;text-align:center;}
        .side-modal{position:fixed;right:0;top:0;height:100%;width:300px;background:rgba(15,23,42,0.92);backdrop-filter:blur(20px);border-left:1px solid rgba(255,255,255,0.15);z-index:100;display:flex;align-items:center;animation:slideIn 0.3s ease;}
        @keyframes slideIn{from{transform:translateX(100%);}to{transform:translateX(0);}}
        .side-modal-inner{padding:32px 24px;display:flex;flex-direction:column;gap:14px;width:100%;}
        .side-modal-close{position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.1);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:0.9rem;display:flex;align-items:center;justify-content:center;}
        .side-modal-inner h3{color:#fff;font-size:1.1rem;font-weight:700;margin:0;}
        .side-modal-inner p{color:rgba(255,255,255,0.7);font-size:0.85rem;margin:0;}
        @media (max-width:480px){.login-container{padding:20px 16px 28px;}.login-headline{font-size:1.6rem;}.otp-box{width:40px;height:46px;font-size:1.2rem;}.side-modal{width:100%;}}
      `}</style>
    </div>
  );
}
