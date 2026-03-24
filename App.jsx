import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { 
  Activity, History, Stethoscope, ArrowRight, ArrowLeft,
  CheckCircle2, TrendingUp, AlertCircle, Minus, CheckCircle,
  FlaskConical, Microscope, ScanLine, ClipboardList,
  Building2, User, Save, Download, PlusCircle,
  Search, FileText, X
} from "lucide-react";

// ═══════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════
const T = {
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
  },
  blue: {
    50: "#f0f9ff",
    600: "#0284c7",
    700: "#0369a1",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  }
};

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════

const Button = ({ children, onClick, variant = "primary", className = "", icon: Icon }) => {
  const base = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200";
  const variants = {
    primary: `bg-[${T.green[600]}] text-white hover:bg-[${T.green[700]}] shadow-sm`,
    secondary: `bg-white border border-[${T.gray[200]}] text-[${T.gray[700]}] hover:bg-[${T.gray[50]}]`,
    ghost: `text-[${T.gray[500]}] hover:bg-[${T.gray[100]}]`,
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-[${T.gray[200]}] shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

// ═══════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════

const App = () => {
  const [step, setStep] = useState(1);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [findings, setFindings] = useState({});
  const [results, setResults] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Body Parts Definition
  const bodyParts = [
    { id: "eye", label: "眼（涙腺）", x: "47%", y: "15%", w: "6%", h: "3%" },
    { id: "salivary", label: "唾液腺", x: "45%", y: "21%", w: "10%", h: "4%" },
    { id: "lymph", label: "リンパ節", x: "42%", y: "27%", w: "16%", h: "5%" },
    { id: "lung", label: "肺", x: "38%", y: "35%", w: "24%", h: "12%" },
    { id: "liver", label: "肝・胆道", x: "40%", y: "48%", w: "15%", h: "8%" },
    { id: "pancreas", label: "膵臓", x: "43%", y: "54%", w: "14%", h: "5%" },
    { id: "kidney", label: "腎臓", x: "36%", y: "58%", w: "28%", h: "8%" },
    { id: "retro", label: "後腹膜", x: "44%", y: "65%", w: "12%", h: "8%" },
    { id: "prostate", label: "前立腺", x: "46%", y: "78%", w: "8%", h: "4%" },
  ];

  // Diagnostic Logic
  const diagnosticCriteria = {
    eye: { title: "眼病変（涙腺炎）", items: ["両側性の涙腺腫脹", "上眼瞼の外側腫脹", "眼球突出"] },
    salivary: { title: "唾液腺病変", items: ["両側性の耳下腺・顎下腺腫脹", "持続的な口渇感", "腺体の弾性硬"] },
    pancreas: { title: "膵病変（自己免疫性膵炎）", items: ["びまん性膵腫大（ソーセージ様）", "主膵管の狭細像", "閉塞性黄疸"] },
    kidney: { title: "腎病変", items: ["造影CTでの多発性低吸収域", "腎臓の腫大", "尿細管間質性腎炎の疑い"] },
    retro: { title: "後腹膜線維症 / 動脈周囲炎", items: ["腹部大動脈周囲の軟部影", "尿管閉塞・水腎症", "腰背部痛"] },
  };

  const handleOrganClick = (organId) => {
    setSelectedOrgan(organId);
    setStep(2);
  };

  const toggleFinding = (item) => {
    setFindings(prev => ({
      ...prev,
      [selectedOrgan]: {
        ...prev[selectedOrgan],
        [item]: !prev[selectedOrgan]?.[item]
      }
    }));
  };

  const calculateResults = () => {
    const selectedCount = Object.values(findings).reduce((acc, organFindings) => {
      return acc + Object.values(organFindings).filter(v => v).length;
    }, 0);
    
    setResults({
      score: selectedCount,
      probability: selectedCount >= 2 ? "High" : selectedCount === 1 ? "Moderate" : "Low",
      summary: `${selectedCount} 領域の典型的所見を確認。IgG4関連疾患の可能性を考慮し、血清IgG4測定および生検を検討してください。`
    });
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 px-4 py-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#16A34A] rounded-lg flex items-center justify-center text-white shadow-md">
              <Activity size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[#0F172A]">IgG4-RD Check</h1>
              <p className="text-[10px] text-[#64748B] font-medium tracking-wide uppercase">Diagnostic Support Tool</p>
            </div>
          </div>
          <button className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-full transition-colors">
            <User size={22} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-6">
        {/* Progress Bar */}
        <div className="mb-8 flex justify-between items-center px-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                step >= s ? "bg-[#16A34A] text-white shadow-lg scale-110" : "bg-white text-[#94A3B8] border-2 border-[#E2E8F0]"
              }`}>
                {step > s ? <CheckCircle size={18} /> : s}
              </div>
              {s < 3 && (
                <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-500 ${
                  step > s ? "bg-[#16A34A]" : "bg-[#E2E8F0]"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Human Body Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#0F172A]">罹患部位を選択</h2>
              <p className="text-[#64748B] text-sm mt-1">身体図の部位をタップして所見を確認</p>
            </div>

            <Card className="relative p-8 bg-white overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
              <div className="relative aspect-[3/5] w-full max-w-[280px] mx-auto">
                {/* Human Silhouette SVG */}
                <svg viewBox="0 0 200 500" className="w-full h-full drop-shadow-2xl">
                  <path
                    d="M100,20 C115,20 125,35 125,55 C125,75 115,90 100,90 C85,90 75,75 75,55 C75,35 85,20 100,20 M75,55 L65,70 M125,55 L135,70 M100,90 L100,110 M60,110 L140,110 L150,250 L135,250 L125,110 M60,110 L50,250 L65,250 L75,110 M80,250 L70,480 L95,480 L100,300 M120,250 L130,480 L105,480 L100,300"
                    fill="#F1F5F9"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                  />
                  {bodyParts.map(part => (
                    <g key={part.id} onClick={() => handleOrganClick(part.id)} className="cursor-pointer group/part">
                      <rect
                        x={part.x} y={part.y} width={part.w} height={part.h}
                        className={`transition-all duration-300 ${
                          findings[part.id] && Object.values(findings[part.id]).some(v => v)
                          ? "fill-[#16A34A] filter blur-[2px] opacity-60"
                          : "fill-transparent hover:fill-blue-100"
                        }`}
                      />
                      <circle
                        cx={part.x} cy={part.y} r="4"
                        className={`transition-all duration-300 ${
                          findings[part.id] && Object.values(findings[part.id]).some(v => v)
                          ? "fill-[#16A34A] animate-pulse"
                          : "fill-[#94A3B8] group-hover/part:fill-[#16A34A]"
                        }`}
                      />
                    </g>
                  ))}
                </svg>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {bodyParts.map(part => (
                <button
                  key={part.id}
                  onClick={() => handleOrganClick(part.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedOrgan === part.id 
                    ? "border-[#16A34A] bg-[#F0FDF4] shadow-md scale-[1.02]" 
                    : "border-white bg-white shadow-sm hover:border-[#E2E8F0]"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    findings[part.id] && Object.values(findings[part.id]).some(v => v)
                    ? "bg-[#16A34A] shadow-[0_0_8px_#16A34A]" : "bg-[#CBD5E1]"
                  }`} />
                  <span className="text-sm font-semibold">{part.label}</span>
                </button>
              ))}
            </div>

            <Button 
              onClick={calculateResults}
              className="w-full h-14 text-lg shadow-xl shadow-green-100"
              icon={TrendingUp}
            >
              診断スコアを算出
            </Button>
          </div>
        )}

        {/* Step 2: Findings Checklist */}
        {step === 2 && selectedOrgan && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep(1)}
                className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors"
              >
                <ArrowLeft className="text-[#64748B]" />
              </button>
              <h2 className="text-xl font-bold text-[#0F172A]">{diagnosticCriteria[selectedOrgan]?.title || bodyParts.find(p => p.id === selectedOrgan).label}</h2>
            </div>

            <Card className="p-2">
              <div className="bg-[#F8FAFC] p-4 rounded-lg mb-2">
                <p className="text-sm text-[#64748B] leading-relaxed">以下の典型的所見に当てはまる項目をチェックしてください。</p>
              </div>
              <div className="space-y-1">
                {(diagnosticCriteria[selectedOrgan]?.items || ["CT上の結節・腫大", "組織診でのリンパ球浸潤"]).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleFinding(item)}
                    className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <span className="text-[#334155] font-medium text-left pr-4">{item}</span>
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      findings[selectedOrgan]?.[item] 
                      ? "bg-[#16A34A] border-[#16A34A] scale-110 shadow-md" 
                      : "border-[#E2E8F0] bg-white group-hover:border-[#CBD5E1]"
                    }`}>
                      {findings[selectedOrgan]?.[item] && <CheckCircle2 size={16} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Button onClick={() => setStep(1)} className="w-full h-14" variant="primary">
              選択を確定して身体図に戻る
            </Button>
          </div>
        )}

        {/* Step 3: Diagnostic Results */}
        {step === 3 && results && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <div className="inline-block p-3 bg-[#F0FDF4] rounded-2xl mb-2">
                <Stethoscope size={32} className="text-[#16A34A]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A]">診断サポート結果</h2>
            </div>

            <Card className="p-8 text-center bg-gradient-to-b from-white to-[#F8FAFC]">
              <div className="mb-6">
                <p className="text-[#64748B] font-medium mb-1">IgG4-RD 可能性スコア</p>
                <div className="text-6xl font-black text-[#16A34A] tracking-tighter italic">
                  {results.probability}
                </div>
              </div>
              
              <div className="h-px bg-[#E2E8F0] w-full my-6" />
              
              <div className="text-left space-y-4">
                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                  <div className="mt-1 text-[#16A34A]"><CheckCircle2 size={20} /></div>
                  <p className="text-[#334155] leading-relaxed font-medium">{results.summary}</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="h-14" onClick={() => setShowSummary(true)} icon={FileText}>
                サマリー出力
              </Button>
              <Button className="h-14" onClick={() => setStep(1)} icon={History}>
                再検診
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#0F172A]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl scale-100 animate-in zoom-in-95 duration-300">
            <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-white sticky top-0">
              <h3 className="font-bold text-[#0F172A]">診断サマリー報告</h3>
              <button onClick={() => setShowSummary(false)} className="p-1 hover:bg-[#F1F5F9] rounded-full transition-colors">
                <X size={20} className="text-[#64748B]" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-[#F8FAFC]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Confirmed Findings</p>
                  {Object.entries(findings).map(([organId, items]) => {
                    const activeItems = Object.entries(items).filter(([_, v]) => v);
                    if (activeItems.length === 0) return null;
                    return (
                      <div key={organId} className="bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0]">
                        <p className="font-bold text-[#16A34A] text-sm mb-2 border-b border-[#F0FDF4] pb-1">
                          {bodyParts.find(p => p.id === organId)?.label}
                        </p>
                        <ul className="space-y-2">
                          {activeItems.map(([item]) => (
                            <li key={item} className="text-xs text-[#475569] flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-[#16A34A] rounded-full" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#E2E8F0] bg-white">
              <Button className="w-full h-12" onClick={() => window.print()} icon={Download}>
                PDFとして保存
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#E2E8F0] px-6 py-3 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {[
            { icon: Activity, active: step === 1, label: "診断" },
            { icon: ClipboardList, active: step === 3, label: "結果" },
            { icon: Search, active: false, label: "検索" },
            { icon: Building2, active: false, label: "施設" }
          ].map((item, idx) => (
            <button key={idx} className="flex flex-col items-center gap-1 group">
              <item.icon size={22} className={`transition-all duration-300 ${item.active ? "text-[#16A34A] scale-110" : "text-[#94A3B8] group-hover:text-[#64748B]"}`} />
              <span className={`text-[10px] font-bold transition-all ${item.active ? "text-[#16A34A]" : "text-[#94A3B8]"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
