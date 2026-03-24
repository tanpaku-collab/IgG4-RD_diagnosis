import React, { useState } from "react";
import * as Lucide from "lucide-react";

const App = () => {
  const [step, setStep] = useState(1);
  const [findings, setFindings] = useState({});

  // 身体部位の簡易定義
  const bodyParts = [
    { id: "eye", label: "眼（涙腺）" },
    { id: "salivary", label: "唾液腺" },
    { id: "pancreas", label: "膵臓" },
    { id: "kidney", label: "腎臓" }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px', borderBottom: '2px solid #16a34a', paddingBottom: '10px' }}>
        <h1 style={{ color: '#0f172a', margin: 0 }}>IgG4-RD Check</h1>
        <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>Diagnostic Support Tool</p>
      </header>

      {step === 1 && (
        <div style={{ animation: 'fadeIn 0.5s' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>罹患部位を選択してください</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {bodyParts.map(part => (
              <button 
                key={part.id}
                onClick={() => setStep(2)}
                style={{
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  fontWeight: 'bold',
                  textAlign: 'left'
                }}
              >
                ● {part.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => alert('診断スコアを算出します')}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold'
            }}
          >
            診断スコアを算出
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} style={{ marginBottom: '10px', color: '#64748b' }}>← 戻る</button>
          <h2>詳細所見の確認</h2>
          <p>典型的な所見をチェックしてください（簡易版）</p>
          <button onClick={() => setStep(1)} style={{ width: '100%', padding: '15px', backgroundColor: '#16a34a', color: 'white', borderRadius: '10px', border: 'none' }}>
            確定して戻る
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
