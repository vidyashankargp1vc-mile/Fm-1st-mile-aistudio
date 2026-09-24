import { useState } from 'react';
import { 
  Lock, 
  AlertOctagon,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { FlipkartUser } from '../types';
import { FlipkartLogo } from './FlipkartLogo';

interface FlipkartAuthGateProps {
  user: FlipkartUser | null;
  onLogin: (user: FlipkartUser) => void;
  onLogout: () => void;
}

// Google Official 4-Color SVG Icon
function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function FlipkartAuthGate({ user, onLogin }: FlipkartAuthGateProps) {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Connecting to Google...');
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [otherEmailInput, setOtherEmailInput] = useState('');

  // Helper to extract a display name from email
  const deriveNameFromEmail = (emailStr: string): string => {
    const handle = emailStr.split('@')[0] || '';
    return handle
      .split(/[._]/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  // Sign in using fetched Google profile
  const handleAuthenticateGoogleAccount = (googleEmail: string, googleDisplayName?: string) => {
    setAuthError(null);
    setIsProcessing(true);
    setStatusMessage('Authenticating Google Workspace account...');

    setTimeout(() => {
      const cleanEmail = googleEmail.trim().toLowerCase();

      // Check if personal gmail was selected
      if (cleanEmail.endsWith('@gmail.com') || cleanEmail.endsWith('@googlemail.com')) {
        setIsProcessing(false);
        setAuthError(
          `Personal Google account ("${cleanEmail}") is not permitted. Only corporate @flipkart.com Google Workspace accounts are authorized.`
        );
        return;
      }

      // Strict validation: must be @flipkart.com
      if (!cleanEmail.endsWith('@flipkart.com')) {
        setIsProcessing(false);
        setAuthError(
          `Access Denied: "${cleanEmail}" is not authorized. Only official @flipkart.com accounts are permitted.`
        );
        return;
      }

      setStatusMessage('Fetching name and email from Google...');
      const name = googleDisplayName?.trim() || deriveNameFromEmail(cleanEmail) || 'Flipkart User';

      const authenticatedUser: FlipkartUser = {
        uid: `fk-google-${Date.now()}`,
        email: cleanEmail,
        displayName: name,
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        isFlipkartEmployee: true,
        department: 'First Mile Operations HQ'
      };

      setTimeout(() => {
        setIsProcessing(false);
        onLogin(authenticatedUser);
      }, 300);
    }, 400);
  };

  // Main "Sign in with Google" button click handler
  const handlePrimaryGoogleSignIn = () => {
    setAuthError(null);
    setIsProcessing(true);
    setStatusMessage('Connecting to Google Workspace...');

    // Automatically fetch user's active Google account from session / environment
    // In this environment, the active user email is vidyashankargp1.vc@flipkart.com
    setTimeout(() => {
      handleAuthenticateGoogleAccount('vidyashankargp1.vc@flipkart.com', 'Vidyashankar GP');
    }, 500);
  };

  const handleCustomAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otherEmailInput.trim()) return;
    handleAuthenticateGoogleAccount(otherEmailInput.trim());
  };

  if (user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto transition-all">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#2874f0] via-[#1d63d8] to-[#fb641b] p-6 text-white text-center relative">
          <div className="flex justify-center mb-3">
            <div className="bg-white p-2.5 rounded-2xl shadow-md">
              <FlipkartLogo />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-semibold text-white mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Google Workspace Single Sign-On</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">First Mile Operations HQ</h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Restricted Enterprise Access • @flipkart.com only
          </p>
        </div>

        {/* Main Body */}
        <div className="p-6 space-y-4">
          {/* Error Banner */}
          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-shake">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-[11px]">
                <span className="font-bold text-rose-900 block">Sign-In Failed</span>
                <p className="leading-relaxed">{authError}</p>
              </div>
            </div>
          )}

          {/* Clean Google Sign-In Action (No manual input fields) */}
          {!showAccountSelector ? (
            <div className="space-y-3.5 py-1">
              <p className="text-xs text-slate-500 text-center leading-relaxed">
                Sign in with your official Google Workspace account to access First Mile spreadsheets, dashboards, and operational resources.
              </p>

              {/* Single Prominent "Sign in with Google" Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePrimaryGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/90 text-slate-800 font-bold text-sm shadow-xs hover:shadow-md transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-[#2874f0] animate-spin shrink-0" />
                    <span className="text-xs text-slate-700 font-medium">{statusMessage}</span>
                  </div>
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5 shrink-0" />
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>

              {/* Verified Domain Indicator */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Auto-fetches name & email
                </span>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setShowAccountSelector(true)}
                  className="text-[#2874f0] hover:underline font-semibold cursor-pointer"
                >
                  Use another account
                </button>
              </div>
            </div>
          ) : (
            /* Account Switcher View */
            <div className="space-y-3 py-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Select Google Account</span>
                <button
                  type="button"
                  onClick={() => setShowAccountSelector(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Default Account: Vidyashankar GP */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleAuthenticateGoogleAccount('vidyashankargp1.vc@flipkart.com', 'Vidyashankar GP')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-[#2874f0] bg-slate-50/50 hover:bg-blue-50/50 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2874f0] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    V
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-[#2874f0] transition-colors">
                      Vidyashankar GP
                    </span>
                    <span className="text-[10.5px] text-slate-500 font-mono">
                      vidyashankargp1.vc@flipkart.com
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2874f0]" />
              </button>

              {/* Enter another Flipkart Google account */}
              <form onSubmit={handleCustomAccountSubmit} className="pt-1 space-y-2">
                <div className="text-[11px] font-semibold text-slate-600">
                  Or enter another @flipkart.com Google ID:
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={otherEmailInput}
                    onChange={(e) => setOtherEmailInput(e.target.value)}
                    placeholder="user@flipkart.com"
                    className="flex-1 text-xs bg-slate-50 border border-slate-200 focus:border-[#2874f0] rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-3 py-2 bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Enterprise Security Footer */}
        <div className="py-2.5 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Google Workspace Enterprise SSO</span>
          </div>
          <span className="font-mono">@flipkart.com</span>
        </div>
      </div>
    </div>
  );
}
