import { useState, useMemo } from "react";

const ADMIN_CODE = "20908070";

const CATEGORIES = ["Cause", "Conséquence", "But", "Temps", "Condition", "Comparaison", "Concession", "Opposition"];

const CAT_COLORS = {
  Cause:        { bg: "#FFF3CD", header: "#F0A500", text: "#7A5000" },
  Conséquence:  { bg: "#D4EDDA", header: "#28A745", text: "#155724" },
  But:          { bg: "#D1ECF1", header: "#17A2B8", text: "#0C5460" },
  Temps:        { bg: "#E2D9F3", header: "#7B2D8B", text: "#4A1A5C" },
  Condition:    { bg: "#FFE5D9", header: "#E05C00", text: "#7D3300" },
  Comparaison:  { bg: "#D6E4FF", header: "#2979FF", text: "#0D47A1" },
  Concession:   { bg: "#FCE4EC", header: "#E91E63", text: "#880E4F" },
  Opposition:   { bg: "#E8F5E9", header: "#388E3C", text: "#1B5E20" },
};

const INITIAL_DATA = [
  { id: 1,  subordonnant: "Comme", values: [1,0,0,1,0,1,0,0] },
  { id: 2,  subordonnant: "D'autant plus que", values: [1,0,0,0,0,0,0,0] },
  { id: 3,  subordonnant: "Du fait que", values: [1,0,0,0,0,0,0,0] },
  { id: 4,  subordonnant: "Du moment que", values: [1,1,0,0,0,0,0,0] },
  { id: 5,  subordonnant: "Étant donné que", values: [1,0,0,0,0,0,0,0] },
  { id: 6,  subordonnant: "Parce que", values: [1,0,0,0,0,0,0,0] },
  { id: 7,  subordonnant: "Puisque", values: [1,0,0,0,0,0,0,0] },
  { id: 8,  subordonnant: "Vu que", values: [1,0,0,0,0,0,0,0] },
  { id: 9,  subordonnant: "Sous prétexte que", values: [1,0,0,0,0,0,0,0] },
  { id: 10, subordonnant: "Si", values: [1,0,0,0,1,0,0,0] },
  { id: 11, subordonnant: "Dès lors que", values: [1,0,0,1,0,0,0,0] },
  { id: 12, subordonnant: "Dès l'instant que", values: [1,0,0,1,0,0,0,0] },
  { id: 13, subordonnant: "Pourvu que", values: [0,0,0,0,1,0,0,0] },
  { id: 14, subordonnant: "D'autant plus/moins que", values: [1,0,0,0,0,1,0,0] },
  { id: 15, subordonnant: "Aussi que / Plus…que", values: [0,0,0,0,0,1,0,0] },
  { id: 16, subordonnant: "Moins que / Plus que", values: [0,0,0,0,0,1,0,0] },
  { id: 17, subordonnant: "Autrement que / Plutôt que", values: [0,0,0,0,0,1,0,0] },
  { id: 18, subordonnant: "Dès que / Depuis que / Aussitôt que / Sitôt que / Une fois que / Après que / À peine…que {postériorité}", values: [0,0,0,1,0,0,0,0] },
  { id: 19, subordonnant: "Jusqu'à ce que / Avant que / En attendant que / Jusqu'au moment où {antériorité}", values: [0,0,0,1,0,0,0,0] },
  { id: 20, subordonnant: "Lorsque / Quand / Au moment où / Pendant que / Comme / Aussi longtemps que / Tant que / Chaque fois que / Toutes les fois que / Alors que / Tandis que {simultanéité}", values: [0,0,0,1,0,0,0,0] },
  { id: 21, subordonnant: "Ainsi que", values: [0,0,0,0,0,1,0,0] },
  { id: 22, subordonnant: "Tandis que", values: [0,0,0,1,0,0,0,1] },
  { id: 23, subordonnant: "Quand", values: [0,0,0,1,0,0,0,1] },
  { id: 24, subordonnant: "De même que", values: [0,0,0,0,0,1,0,0] },
  { id: 25, subordonnant: "Alors que", values: [0,0,0,1,0,0,0,1] },
  { id: 26, subordonnant: "Sans que", values: [0,1,0,0,0,0,0,1] },
  { id: 27, subordonnant: "Quand bien même", values: [0,0,0,0,0,0,1,0] },
  { id: 28, subordonnant: "Quoique", values: [0,0,0,0,0,0,1,0] },
  { id: 29, subordonnant: "Bien que", values: [0,0,0,0,0,0,1,0] },
  { id: 30, subordonnant: "Si…que", values: [0,1,0,0,0,0,1,0] },
  { id: 31, subordonnant: "Même si", values: [0,0,0,0,1,0,0,1] },
  { id: 32, subordonnant: "C'est parce que…que / C'est que…que", values: [1,0,0,0,0,0,0,0] },
  { id: 33, subordonnant: ", si bien que", values: [0,1,0,0,0,0,0,0] },
  { id: 34, subordonnant: "Tant et si bien que", values: [0,1,0,0,0,0,0,0] },
  { id: 35, subordonnant: "Tant (tellement) + que", values: [0,1,0,0,0,0,0,0] },
  { id: 36, subordonnant: "Si (tellement) + que", values: [0,1,0,0,0,0,0,0] },
  { id: 37, subordonnant: "Afin que", values: [0,0,1,0,0,0,0,0] },
  { id: 38, subordonnant: "Pour que", values: [0,1,1,0,0,0,0,0] },
  { id: 39, subordonnant: "Dans l'espoir que", values: [0,0,1,0,0,0,0,0] },
  { id: 40, subordonnant: "Pour que…ne…pas / Afin que…ne…pas", values: [0,0,1,0,0,0,0,0] },
  { id: 41, subordonnant: "De crainte que / De peur que", values: [0,0,1,0,0,0,0,0] },
  { id: 42, subordonnant: "De manière que / De sorte que / De façon que", values: [0,1,1,0,0,0,0,0] },
  { id: 43, subordonnant: "À seule fin que", values: [0,0,1,0,0,0,0,0] },
  { id: 44, subordonnant: "Au lieu que", values: [0,0,0,0,0,0,0,1] },
  { id: 45, subordonnant: "Bien loin que / Loin que", values: [0,0,0,0,0,0,0,1] },
  { id: 46, subordonnant: "Excepté que", values: [0,0,0,0,0,0,0,1] },
  { id: 47, subordonnant: "Sauf que", values: [0,0,0,0,0,0,0,1] },
  { id: 48, subordonnant: "Bien que / Quoique / Encore que / Sans que / Quelque…que", values: [0,0,0,0,0,0,1,0] },
  { id: 49, subordonnant: "Sauf si", values: [0,0,0,0,1,0,0,0] },
  { id: 50, subordonnant: "Excepté si", values: [0,0,0,0,1,0,0,0] },
  { id: 51, subordonnant: "Dans la mesure où", values: [0,0,0,0,1,0,0,0] },
  { id: 52, subordonnant: "Selon que…ou / Suivant que…ou", values: [0,0,0,0,1,0,0,0] },
  { id: 53, subordonnant: "À supposer que / À condition que / Soit que…soit que", values: [0,0,0,0,1,0,0,0] },
  { id: 54, subordonnant: "À moins que…(ne)", values: [0,0,0,0,1,0,0,0] },
  { id: 55, subordonnant: "Pour peu que", values: [0,0,0,0,1,0,0,0] },
  { id: 56, subordonnant: "Que…ou que…", values: [0,0,0,0,1,0,0,0] },
  { id: 57, subordonnant: "Tel que", values: [0,0,0,0,0,1,0,0] },
  { id: 58, subordonnant: "Davantage que", values: [0,0,0,0,0,1,0,0] },
  { id: 59, subordonnant: "D'ici à ce que", values: [0,0,0,1,0,0,0,0] },
  { id: 60, subordonnant: "Moyennant que", values: [0,0,0,0,1,0,0,0] },
  { id: 61, subordonnant: "Si tant est que", values: [0,0,0,0,1,0,0,0] },
  { id: 62, subordonnant: "Attendu que", values: [1,0,0,0,0,0,0,0] },
  { id: 63, subordonnant: "Hormis que", values: [0,0,0,0,1,0,0,0] },
];

function useLocalStorage(key, init) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : init;
    } catch { return init; }
  });
  const set = (val) => {
    setState(val);
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  };
  return [state, set];
}

export default function App() {
  const [role, setRole] = useState(null); // null | "admin" | "apprenant"
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [rows, setRows] = useLocalStorage("subordonnants_rows", INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newSub, setNewSub] = useState("");
  const [newVals, setNewVals] = useState(Array(8).fill(0));
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleLogin = (selectedRole) => {
    if (selectedRole === "admin") {
      if (code === ADMIN_CODE) {
        setRole("admin");
        setCodeError("");
      } else {
        setCodeError("Code incorrect. Veuillez réessayer.");
      }
    } else {
      setRole("apprenant");
    }
  };

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const matchSearch = r.subordonnant.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === null || r.values[CATEGORIES.indexOf(filterCat)] === 1;
      return matchSearch && matchCat;
    });
  }, [rows, search, filterCat]);

  const saveEdit = () => {
    setRows(rows.map(r => r.id === editRow.id ? editRow : r));
    setEditRow(null);
    showToast("✅ Modification enregistrée");
  };

  const deleteRow = (id) => {
    setRows(rows.filter(r => r.id !== id));
    showToast("🗑️ Ligne supprimée");
  };

  const addRow = () => {
    if (!newSub.trim()) return;
    const newId = Math.max(...rows.map(r => r.id), 0) + 1;
    setRows([...rows, { id: newId, subordonnant: newSub.trim(), values: [...newVals] }]);
    setNewSub("");
    setNewVals(Array(8).fill(0));
    setShowForm(false);
    showToast("✅ Subordonnant ajouté");
  };

  if (!role) {
    return (
      <div style={{
        minHeight: "100vh", background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 40%, #1565c0 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{ background: "white", borderRadius: 20, padding: "48px 40px", width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📚</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a237e", marginBottom: 4 }}>Subordonnants Circonstanciels</h1>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 32 }}>Choisissez votre profil pour accéder au tableau</p>

          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            <button onClick={() => setRole("apprenant")} style={{
              flex: 1, padding: "14px 0", borderRadius: 12, border: "2px solid #e3f2fd",
              background: "#e3f2fd", color: "#1565c0", fontWeight: 700, cursor: "pointer", fontSize: 15,
              transition: "all 0.2s"
            }}>
              👨‍🎓 Apprenant
            </button>
            <button onClick={() => setRole("__admin_pending__")} style={{
              flex: 1, padding: "14px 0", borderRadius: 12, border: "2px solid #fff3e0",
              background: "#fff3e0", color: "#e65100", fontWeight: 700, cursor: "pointer", fontSize: 15
            }}>
              🔐 Administrateur
            </button>
          </div>

          {role === "__admin_pending__" && (
            <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 20 }}>
              <p style={{ fontWeight: 600, color: "#333", marginBottom: 10 }}>Code d'accès administrateur</p>
              <input
                type="password"
                value={code}
                onChange={e => { setCode(e.target.value); setCodeError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin("admin")}
                placeholder="Entrez le code"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8, border: "2px solid #ddd",
                  fontSize: 16, letterSpacing: 4, boxSizing: "border-box", marginBottom: 10, textAlign: "center"
                }}
              />
              {codeError && <p style={{ color: "#c62828", fontSize: 13, marginBottom: 8 }}>{codeError}</p>}
              <button onClick={() => handleLogin("admin")} style={{
                width: "100%", padding: "10px 0", background: "#1a237e", color: "white",
                border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 15
              }}>Valider</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isAdmin = role === "admin";

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: isAdmin
          ? "linear-gradient(90deg, #1a237e, #0d47a1)"
          : "linear-gradient(90deg, #1565c0, #1976d2)",
        color: "white", padding: "18px 28px", display: "flex", alignItems: "center",
        justifyContent: "space-between", boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>📖 Tableau des Subordonnants Circonstanciels</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
            {isAdmin ? "🔐 Mode Administrateur" : "👨‍🎓 Mode Apprenant"} · {rows.length} subordonnants
          </div>
        </div>
        <button onClick={() => { setRole(null); setCode(""); }} style={{
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
          color: "white", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13
        }}>Déconnexion</button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "#212121", color: "white", padding: "12px 24px", borderRadius: 40,
          fontWeight: 600, fontSize: 14, zIndex: 1000, boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
        }}>{toast}</div>
      )}

      <div style={{ padding: "24px 20px", maxWidth: 1400, margin: "0 auto" }}>
        {/* Controls */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Rechercher un subordonnant…"
            style={{
              padding: "10px 16px", borderRadius: 10, border: "2px solid #ddd",
              fontSize: 14, flex: "1 1 220px", minWidth: 180
            }}
          />
          <select
            value={filterCat || ""}
            onChange={e => setFilterCat(e.target.value || null)}
            style={{
              padding: "10px 14px", borderRadius: 10, border: "2px solid #ddd",
              fontSize: 14, background: "white", cursor: "pointer"
            }}
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {isAdmin && (
            <button onClick={() => setShowForm(!showForm)} style={{
              background: "#1a237e", color: "white", border: "none",
              padding: "10px 20px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", gap: 6
            }}>➕ Ajouter</button>
          )}
        </div>

        {/* Add form */}
        {isAdmin && showForm && (
          <div style={{
            background: "white", borderRadius: 14, padding: 20, marginBottom: 20,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)", border: "2px solid #e3f2fd"
          }}>
            <div style={{ fontWeight: 700, color: "#1a237e", marginBottom: 12, fontSize: 15 }}>➕ Nouveau subordonnant</div>
            <input
              value={newSub}
              onChange={e => setNewSub(e.target.value)}
              placeholder="Subordonnant…"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "2px solid #ddd", fontSize: 14, boxSizing: "border-box", marginBottom: 14 }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {CATEGORIES.map((cat, i) => (
                <label key={cat} style={{
                  display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                  padding: "6px 12px", borderRadius: 20,
                  background: newVals[i] ? CAT_COLORS[cat].header : "#f5f5f5",
                  color: newVals[i] ? "white" : "#555",
                  fontWeight: 600, fontSize: 13, transition: "all 0.15s"
                }}>
                  <input type="checkbox" checked={!!newVals[i]}
                    onChange={() => { const v = [...newVals]; v[i] = v[i] ? 0 : 1; setNewVals(v); }}
                    style={{ display: "none" }}
                  />
                  {cat}
                </label>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={addRow} style={{
                background: "#1a237e", color: "white", border: "none", padding: "10px 22px",
                borderRadius: 8, fontWeight: 700, cursor: "pointer"
              }}>Enregistrer</button>
              <button onClick={() => setShowForm(false)} style={{
                background: "#f5f5f5", color: "#333", border: "none", padding: "10px 18px",
                borderRadius: 8, fontWeight: 600, cursor: "pointer"
              }}>Annuler</button>
            </div>
          </div>
        )}

        {/* Category legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {CATEGORIES.map(cat => (
            <span key={cat} onClick={() => setFilterCat(filterCat === cat ? null : cat)} style={{
              padding: "5px 14px", borderRadius: 20,
              background: filterCat === cat ? CAT_COLORS[cat].header : CAT_COLORS[cat].bg,
              color: filterCat === cat ? "white" : CAT_COLORS[cat].text,
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: `2px solid ${CAT_COLORS[cat].header}`,
              transition: "all 0.15s"
            }}>{cat}</span>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto", borderRadius: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{
                  background: "#1a237e", color: "white", padding: "14px 16px",
                  textAlign: "left", fontWeight: 700, fontSize: 14,
                  borderRadius: "14px 0 0 0", position: "sticky", left: 0, zIndex: 2
                }}>Le Subordonnant</th>
                {CATEGORIES.map((cat, i) => (
                  <th key={cat} style={{
                    background: CAT_COLORS[cat].header, color: "white",
                    padding: "14px 10px", textAlign: "center",
                    fontWeight: 700, fontSize: 12, minWidth: 90,
                    borderRadius: i === CATEGORIES.length - 1 && !isAdmin ? "0 14px 0 0" : 0
                  }}>{cat}</th>
                ))}
                {isAdmin && (
                  <th style={{
                    background: "#37474f", color: "white", padding: "14px 10px",
                    textAlign: "center", fontWeight: 700, fontSize: 12,
                    borderRadius: "0 14px 0 0"
                  }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                editRow?.id === row.id ? (
                  <tr key={row.id} style={{ background: "#e3f2fd" }}>
                    <td style={{ padding: "10px 14px", position: "sticky", left: 0, background: "#e3f2fd", zIndex: 1 }}>
                      <input
                        value={editRow.subordonnant}
                        onChange={e => setEditRow({ ...editRow, subordonnant: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "2px solid #90caf9", fontSize: 13, boxSizing: "border-box" }}
                      />
                    </td>
                    {CATEGORIES.map((cat, i) => (
                      <td key={cat} style={{ textAlign: "center", padding: "10px 8px" }}>
                        <input type="checkbox" checked={!!editRow.values[i]}
                          onChange={() => {
                            const v = [...editRow.values]; v[i] = v[i] ? 0 : 1;
                            setEditRow({ ...editRow, values: v });
                          }}
                          style={{ width: 18, height: 18, cursor: "pointer", accentColor: CAT_COLORS[cat].header }}
                        />
                      </td>
                    ))}
                    <td style={{ textAlign: "center", padding: "10px 8px" }}>
                      <button onClick={saveEdit} style={{ background: "#2e7d32", color: "white", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700, marginRight: 6 }}>✓</button>
                      <button onClick={() => setEditRow(null)} style={{ background: "#c62828", color: "white", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>✕</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id} style={{
                    background: idx % 2 === 0 ? "white" : "#f8f9fa",
                    transition: "background 0.15s"
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#e8eaf6"}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "white" : "#f8f9fa"}
                  >
                    <td style={{
                      padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "#212121",
                      borderBottom: "1px solid #eeeeee", position: "sticky", left: 0,
                      background: idx % 2 === 0 ? "white" : "#f8f9fa", zIndex: 1,
                      maxWidth: 320
                    }}>{row.subordonnant}</td>
                    {row.values.map((v, i) => (
                      <td key={i} style={{
                        textAlign: "center", padding: "12px 8px",
                        borderBottom: "1px solid #eeeeee",
                        background: v ? CAT_COLORS[CATEGORIES[i]].bg : "inherit"
                      }}>
                        {v ? <span style={{
                          display: "inline-block", width: 22, height: 22, background: CAT_COLORS[CATEGORIES[i]].header,
                          borderRadius: "50%", lineHeight: "22px", color: "white", fontSize: 13, fontWeight: 800
                        }}>✓</span> : <span style={{ color: "#ccc", fontSize: 16 }}>·</span>}
                      </td>
                    ))}
                    {isAdmin && (
                      <td style={{ textAlign: "center", padding: "12px 8px", borderBottom: "1px solid #eeeeee", whiteSpace: "nowrap" }}>
                        <button onClick={() => setEditRow({ ...row, values: [...row.values] })} style={{
                          background: "#1565c0", color: "white", border: "none", padding: "5px 12px",
                          borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700, marginRight: 5
                        }}>✏️</button>
                        <button onClick={() => deleteRow(row.id)} style={{
                          background: "#c62828", color: "white", border: "none", padding: "5px 12px",
                          borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700
                        }}>🗑️</button>
                      </td>
                    )}
                  </tr>
                )
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={CATEGORIES.length + (isAdmin ? 2 : 1)} style={{ textAlign: "center", padding: 40, color: "#999", fontSize: 15 }}>
                    Aucun résultat trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 28, color: "#90a4ae", fontSize: 12 }}>
          Réalisé par : Omar Salhi / Nouredine Izerane · Morphosyntaxe 2 · Semestre 4 · 27/04/2026
        </div>
      </div>
    </div>
  );
}
