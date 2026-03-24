import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, TrendingUp, AlertCircle, Menu, ChevronRight, 
  FlaskConical, Microscope, ScanLine, ClipboardList, 
  Building2, User, Save, Download, PlusCircle,
  Search, FileText, X, Trash2, Edit2, RotateCcw
} from "lucide-react";

// --- 1. 共通コンポーネント (SecHead) ---
const SecHead = ({ step, icon: Icon, title, sub, theme = "green" }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-1">
      {step && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          theme === 'green' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {step}
        </span>
      )}
      {Icon && <Icon size={18} className={theme === 'green' ? 'text-emerald-600' : 'text-blue-600'} />}
      <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
    </div>
    {sub && <p className="text-[11px] text-slate-500 leading-relaxed">{sub}</p>}
  </div>
);

// --- 2. メインアプリケーション ---
export default function App() {
  const [view, setView] = useState('top'); // top, diagnosis, save, history
  const [history, setHistory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  // 診断データ
  const [selectedComprehensive, setSelectedComprehensive] = useState([]);
  const [selectedOrgans, setSelectedOrgans] = useState({});
  
  // 保存用入力データ
  const [saveData, setSaveData] = useState({
    hospital: '',
    department: '',
    doctor: '',
    memo: ''
  });

  // ローカルストレージからの読み込み
  useEffect(() => {
    const saved = localStorage.getItem('igg4_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // 履歴の保存
  const saveToHistory = () => {
    const newEntry = {
      id: editingId || Date.now(),
      date: new Date().toLocaleString(),
      ...saveData,
      comprehensive: selectedComprehensive,
      organs: selectedOrgans
    };

    let updatedHistory;
    if (editingId) {
      updatedHistory = history.map(item => item.id === editingId ? newEntry : item);
    } else {
      updatedHistory = [newEntry, ...history];
    }

    setHistory(updatedHistory);
    localStorage.setItem('igg4_history', JSON.stringify(updatedHistory));
    resetDiagnosis();
    setView('history');
  };

  const deleteHistory = (id) => {
    if (window.confirm('この記録を削除してもよろしいですか？')) {
      const updated = history.filter(item => item.id !== id);
      setHistory(updated);
      localStorage.setItem('igg4_history', JSON.stringify(updated));
    }
  };

  const startEdit = (item) => {
    setSaveData({
      hospital: item.hospital,
      department: item.department,
      doctor: item.doctor,
      memo: item.memo
    });
    setSelectedComprehensive(item.comprehensive);
    setSelectedOrgans(item.organs);
    setEditingId(item.id);
    setView('save');
  };

  const resetDiagnosis = () => {
    setSelectedComprehensive([]);
    setSelectedOrgans({});
    setSaveData({ hospital: '', department: '', doctor: '', memo: '' });
    setEditingId(null);
  };

  // --- 黄金比レイアウト・シルエット設定 (LB) ---
  // 変数重複を避け、ここに集約
  const LB = {
    canvas: { w: 340, h: 480 },
    head: { x: 170, y: 75, r: 32 },
    neck: { w: 24, h: 25 },
    shoulder: { w: 105, r: 35, drop: 18 },
    torso: { w: 100, h: 160, r: 15 },
    waist: { w: 92, h: 40 }
  };

  // --- 画面切り替えレンダリング ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      {/* 共通ナビゲーション */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2" onClick={() => setView('top')}>
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
            <FlaskConical className="text-white" size={18} />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">IgG4-RD Support</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView('history')} className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <ClipboardList size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto p-5">
        {view === 'top' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <SecHead step="START" title="IgG4-RD 診断支援" sub="人体モデルから臓器を選択し、診断基準を確認します。" />
             {/* ここに人体シルエットのSVGコードが入る (既存のものを維持) */}
             <div className="flex justify-center py-10 bg-white rounded-3xl shadow-sm border border-slate-50 mb-8 relative overflow-hidden">
                <svg width={LB.canvas.w} height={LB.canvas.h} viewBox={`0 0 ${LB.canvas.w} ${LB.canvas.h}`}>
                  {/* シルエット描画 (省略せず既存のパスを適用してください) */}
                  <path d={`M ${LB.head.x-LB.shoulder.w} ${LB.head.y+LB.neck.h+LB.shoulder.drop} Q ${LB.head.x} ${LB.head.y+LB.neck.h-5} ${LB.head.x+LB.shoulder.w} ${LB.head.y+LB.neck.h+LB.shoulder.drop}`} fill="none" stroke="#E2E8F0" strokeWidth="2" />
                  <circle cx={LB.head.x} cy={LB.head.y} r={LB.head.r} fill="#F1F5F9" />
                  <rect x={LB.head.x-50} y={LB.head.y+LB.neck.h+15} width="100" height="150" rx="15" fill="#F1F5F9" />
                </svg>
                <button 
                  onClick={() => setView('diagnosis')}
                  className="absolute bottom-8 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 flex items-center gap-2 active:scale-95 transition-transform"
                >
                  診断を開始する <ChevronRight size={18} />
                </button>
             </div>
          </div>
        )}

        {view === 'diagnosis' && (
          <div className="animate-in fade-in duration-500">
            <SecHead step="STEP 1" title="診断基準のチェック" sub="該当する項目を選択してください。" theme="blue" />
            <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-50 mb-6">
              <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-500" /> 包括診断基準
              </h4>
              {/* 包括診断基準のチェックボックス群 */}
              <p className="text-xs text-slate-500 italic">※ここに各診断項目が表示されます</p>
            </div>
            
            <div className="flex gap-3 sticky bottom-6">
              <button onClick={resetDiagnosis} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                <RotateCcw size={18} /> リセット
              </button>
              <button onClick={() => setView('save')} className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                <Save size={18} /> 記録を保存
              </button>
            </div>
          </div>
        )}

        {view === 'save' && (
          <div className="animate-in slide-in-from-right duration-500">
            <SecHead step="SAVE" title="診断結果の記録" sub="病院名や医師名を入力して履歴に残します。" theme="blue" />
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5 mb-6">
              <div>
                <label className="text-[11px] font-bold text-slate-400 ml-1 mb-1 block uppercase tracking-wider">Hospital / Dept</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Building2 className="absolute left-3 top-3.5 text-slate-300" size={16} />
                    <input 
                      type="text" placeholder="病院名" 
                      className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20"
                      value={saveData.hospital} onChange={e => setSaveData({...saveData, hospital: e.target.value})}
                    />
                  </div>
                  <input 
                    type="text" placeholder="診療科" 
                    className="w-1/3 bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20"
                    value={saveData.department} onChange={e => setSaveData({...saveData, department: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 ml-1 mb-1 block uppercase tracking-wider">Doctor</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-slate-300" size={16} />
                  <input 
                    type="text" placeholder="医師名" 
                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20"
                    value={saveData.doctor} onChange={e => setSaveData({...saveData, doctor: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 ml-1 mb-1 block uppercase tracking-wider">Memo</label>
                <textarea 
                  placeholder="診断のポイントや次回の予定など..." 
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm h-24 focus:ring-2 focus:ring-blue-500/20"
                  value={saveData.memo} onChange={e => setSaveData({...saveData, memo: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={saveToHistory}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
            >
              {editingId ? '変更を上書き保存' : '履歴に記録を保存'}
            </button>
            <button onClick={() => setView('diagnosis')} className="w-full py-4 text-slate-400 text-sm font-medium">
              判定画面に戻る
            </button>
          </div>
        )}

        {view === 'history' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
              <SecHead step="HISTORY" title="診断履歴" sub="過去の診断結果を管理・閲覧できます。" theme="green" />
              <button onClick={() => setView('top')} className="p-2 bg-slate-100 rounded-full text-slate-500"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <ClipboardList className="mx-auto text-slate-200 mb-3" size={48} />
                  <p className="text-slate-400 text-sm">履歴はまだありません</p>
                </div>
              ) : (
                history.map(item => (
                  <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-800">{item.hospital || '未指定の病院'}</h4>
                        <p className="text-[10px] text-slate-400">{item.date}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                        <button onClick={() => deleteHistory(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{item.department || '一般'}</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{item.doctor || '担当医未設定'}</span>
                    </div>
                    {item.memo && <p className="text-xs text-slate-500 line-clamp-2 mt-2 bg-slate-50 p-2 rounded-lg">{item.memo}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
