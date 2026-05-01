// ═══════════════════════════════════════════════════════════════════════════
//  ORDENFORM_NUEVO.jsx  —  La Vidriería Rosario · VidrierApp
//  Reemplaza el OrdenForm anterior. Estructura:
//    1. Selector de cliente
//    2. Descripción + tabla de vidrios (tipo editable + medidas)
//    3. Canvas de plano (herramientas de vidriería)
//    4. Pagos (seña + saldo)
//    5. Firmas
//    PDF Taller  (sin precios)
//    PDF Instalación (completo)
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from "react";

// ── BIZ CONSTANTS (mismos que el archivo principal) ─────────────────────────
const BIZ_LOGO = "data:image/jpeg;base64,/9j/4QC+RXhpZgAATU0AKgAAAAgABQEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAeQAAAHAAAABDAyMjGRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAAXygAwAEAAAAAQAAAXykBgADAAAAAQAAAAAAAAAAAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAF8AXwDASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAECAwQFBv/EAC4QAQACAQMDAwMEAwEBAAAAAAABAgMREiExBBNBUWEicYGRoTKxwdHh8EL/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAGREBAQEBAQEAAAAAAAAAAAAAAAEREiEx/9oADAMBAAIRAxEAPwD7KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"; // acortado para ejemplo

const BIZ_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a2e;background:#fff;font-size:13px}
.hdr{background:linear-gradient(135deg,#0a2a5e,#1565C0);padding:18px 28px;display:flex;justify-content:space-between;align-items:center;gap:16px}
.hdr-left{display:flex;align-items:center;gap:12px}
.biz-name{font-size:19px;font-weight:900;color:#fff}
.biz-sub{font-size:10px;color:rgba(255,255,255,0.7);margin-top:2px}
.biz-contact{font-size:10px;color:rgba(255,255,255,0.85);margin-top:2px}
.hdr-right{text-align:right;flex-shrink:0}
.doc-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.7)}
.doc-num{font-size:26px;font-weight:900;color:#fff;display:block}
.doc-date{font-size:10px;color:rgba(255,255,255,0.7);margin-top:3px;display:block}
.divider{height:3px;background:linear-gradient(90deg,#1565C0,#42A5F5,#1565C0)}
.body{padding:20px 28px}
.st{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:4px;margin:16px 0 10px}
table{width:100%;border-collapse:collapse;font-size:13px}
thead tr{background:linear-gradient(135deg,#0a2a5e,#1565C0);color:#fff}
thead th{padding:8px 12px;font-size:11px;font-weight:600;letter-spacing:0.5px}
tbody td{padding:8px 12px;border-bottom:1px solid #e8f0ff}
tbody tr:nth-child(even){background:#f0f6ff}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.f label{font-size:9px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:2px}
.f p{font-size:14px;font-weight:600;color:#1a1a2e}
.nota-box{background:#f8f9ff;border-left:3px solid #1565C0;border-radius:0 6px 6px 0;padding:10px 14px;font-size:13px;line-height:1.7;color:#333}
.sign-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:32px}
.sign-line{border-top:1.5px solid #1565C0;padding-top:8px;text-align:center}
.sign-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.sign-name{font-size:12px;font-weight:600;color:#1565C0;margin-top:3px}
.footer{background:#f0f6ff;border-top:2px solid #e3f2fd;padding:8px 28px;display:flex;justify-content:space-between;font-size:10px;color:#888}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:8mm}}
`;

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

// ── PRIMITIVE STYLES ─────────────────────────────────────────────────────────
const iS = {
  width: "100%",
  background: "#071220",
  border: "1px solid #1e3a5a",
  borderRadius: 8,
  padding: "9px 12px",
  color: "#c8e0f8",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const Input = (p) => <input style={iS} {...p} />;
const Textarea = (p) => <textarea style={{ ...iS, minHeight: 72, resize: "vertical" }} {...p} />;
const Sel = ({ children, ...p }) => (
  <select style={{ ...iS, cursor: "pointer" }} {...p}>
    {children}
  </select>
);

const Btn = ({ children, onClick, variant = "primary", small, style: s, disabled }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none", borderRadius: 8, fontWeight: 600,
    fontFamily: "inherit",
    padding: small ? "6px 14px" : "10px 20px",
    fontSize: small ? 13 : 14,
    opacity: disabled ? 0.5 : 1,
  };
  const V = {
    primary: { background: "linear-gradient(135deg,#1565C0,#0d47a1)", color: "#fff", boxShadow: "0 4px 16px rgba(21,101,192,0.3)" },
    secondary: { background: "#0d1b2a", border: "1px solid #1e3a5a", color: "#7ab2e8" },
    danger: { background: "#1a0a0a", border: "1px solid #7f2020", color: "#f48fb1" },
    taller: { background: "linear-gradient(135deg,#1b3a1f,#2e7d32)", color: "#A5D6A7", boxShadow: "0 4px 12px rgba(46,125,50,0.3)" },
    inst: { background: "linear-gradient(135deg,#1a237e,#283593)", color: "#90CAF9", boxShadow: "0 4px 12px rgba(26,35,126,0.3)" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...V[variant], ...s }}>
      {children}
    </button>
  );
};

const Field = ({ label, children, required }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#5a8ab8", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
      {label} {required && <span style={{ color: "#f48fb1" }}>*</span>}
    </label>
    {children}
  </div>
);

// ── TIPOS DE VIDRIO (editables desde la app) ─────────────────────────────────
const TIPOS_VIDRIO_DEFAULT = [
  "Float 3mm", "Float 4mm", "Float 5mm", "Float 6mm",
  "Templado 6mm", "Templado 8mm", "Templado 10mm",
  "Laminado 6mm", "Laminado 8mm",
  "Espejo 3mm", "Espejo 4mm", "Espejo biselado",
  "Satinado 4mm", "Satinado 6mm",
  "Arenado 4mm", "Arenado 6mm",
  "Reflectivo",
];

// ── VIDRIO TYPE MANAGER (editor de tipos) ────────────────────────────────────
const TiposVidrioPanelInline = ({ tipos, onSave, onClose }) => {
  const [list, setList] = useState([...tipos]);
  const [nuevo, setNuevo] = useState("");
  return (
    <div style={{ background: "#0a1828", borderRadius: 10, border: "1px solid #1565C040", padding: 16, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#64B5F6", textTransform: "uppercase" }}>Editar tipos de vidrio</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#5a8ab8", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>✕</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {list.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, background: "#1565C018", border: "1px solid #1565C040", borderRadius: 99, padding: "3px 10px" }}>
            <span style={{ fontSize: 12, color: "#c8e0f8" }}>{t}</span>
            <button onClick={() => setList(l => l.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#f48fb1", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={nuevo} onChange={e => setNuevo(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && nuevo.trim()) { setList(l => [...l, nuevo.trim()]); setNuevo(""); } }}
          placeholder="Agregar tipo de vidrio..."
          style={{ ...iS, padding: "7px 10px", fontSize: 13, flex: 1 }} />
        <button onClick={() => { if (nuevo.trim()) { setList(l => [...l, nuevo.trim()]); setNuevo(""); } }}
          style={{ padding: "7px 14px", borderRadius: 7, border: "none", background: "#1565C0", color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>
          + Agregar
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <Btn small onClick={() => onSave(list)}>Guardar tipos</Btn>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  CANVAS DE PLANO — herramientas específicas de vidriería
// ══════════════════════════════════════════════════════════════════════════════

// Formas especiales de vidriería predefinidas
const VIDRIO_SHAPES = {
  bisagra: { label: "Bisagra", emoji: "🔩" },
  perforacion: { label: "Perforación", emoji: "⭕" },
  manija: { label: "Manija / Tirador", emoji: "🚪" },
  cota: { label: "Cota / Medida", emoji: "↔️" },
  entrante: { label: "Entrante / Escuadra", emoji: "📐" },
  nota: { label: "Nota de texto", emoji: "📝" },
};

const snap = (v, g = 10) => Math.round(v / g) * g;

const buildPath = (x, y, w, h, corners = [0, 0, 0, 0]) => {
  const [tl, tr, br, bl] = corners.map(r => Math.max(0, Math.min(r, Math.min(w, h) / 2)));
  return [
    `M ${x + tl} ${y}`,
    `L ${x + w - tr} ${y}`, tr > 0 ? `Q ${x + w} ${y} ${x + w} ${y + tr}` : "",
    `L ${x + w} ${y + h - br}`, br > 0 ? `Q ${x + w} ${y + h} ${x + w - br} ${y + h}` : "",
    `L ${x + bl} ${y + h}`, bl > 0 ? `Q ${x} ${y + h} ${x} ${y + h - bl}` : "",
    `L ${x} ${y + tl}`, tl > 0 ? `Q ${x} ${y} ${x + tl} ${y}` : "",
    "Z",
  ].filter(Boolean).join(" ");
};

const PlanoCanvas = ({ value = [], onChange }) => {
  const svgRef = useRef(null);
  const [tool, setTool] = useState("select");
  const [shapes, setShapes] = useState(value);
  const [drawing, setDrawing] = useState(null);
  const [selId, setSelId] = useState(null);
  const [drag, setDrag] = useState(null);
  const [textInput, setTextInput] = useState({ show: false, x: 0, y: 0, val: "" });
  const [history, setHistory] = useState([value]);
  const [hIdx, setHIdx] = useState(0);

  const selShape = shapes.find(s => s.id === selId) || null;

  const commit = useCallback((ns) => {
    const next = [...history.slice(0, hIdx + 1), ns];
    setHistory(next); setHIdx(next.length - 1);
    setShapes(ns); onChange(ns);
  }, [history, hIdx, onChange]);

  const undo = () => { if (hIdx > 0) { const s = history[hIdx - 1]; setHIdx(h => h - 1); setShapes(s); onChange(s); } };
  const redo = () => { if (hIdx < history.length - 1) { const s = history[hIdx + 1]; setHIdx(h => h + 1); setShapes(s); onChange(s); } };
  const del = () => { if (selId) { commit(shapes.filter(s => s.id !== selId)); setSelId(null); } };

  const getSVGPos = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    const raw = { x: e.clientX - r.left, y: e.clientY - r.top };
    return e.ctrlKey ? raw : { x: snap(raw.x), y: snap(raw.y) };
  };

  const onMouseDown = (e) => {
    if (e.target.dataset.handle) return;
    const p = getSVGPos(e);
    if (tool === "select") return;
    if (tool === "text" || tool === "nota") {
      setTextInput({ show: true, x: p.x, y: p.y, val: "" });
      return;
    }
    setSelId(null);
    const typeMap = { rect: "rect", circ: "circ", line: "line", cota: "cota", bisagra: "bisagra", perforacion: "perforacion", entrante: "entrante", manija: "manija" };
    setDrawing({ type: typeMap[tool] || tool, x1: p.x, y1: p.y, x2: p.x, y2: p.y, id: newId(), corners: [0, 0, 0, 0] });
  };

  const onShapeDragStart = (e, id) => {
    if (tool !== "select") return;
    const p = getSVGPos(e);
    const s = shapes.find(x => x.id === id);
    setDrag({ id, startMouse: p, startShape: { ...s } });
    setSelId(id);
    e.stopPropagation();
  };

  const onMouseMove = (e) => {
    const p = getSVGPos(e);
    if (drag && tool === "select") {
      const dx = p.x - drag.startMouse.x, dy = p.y - drag.startMouse.y;
      const s = drag.startShape;
      setShapes(sh => sh.map(x => x.id === drag.id ? {
        ...x,
        x1: (s.x1 || 0) + dx, y1: (s.y1 || 0) + dy,
        x2: (s.x2 || 0) + dx, y2: (s.y2 || 0) + dy,
        x: (s.x || 0) + dx, y: (s.y || 0) + dy,
      } : x));
      return;
    }
    if (!drawing) return;
    let x2 = p.x, y2 = p.y;
    if (e.shiftKey) {
      const side = Math.max(Math.abs(p.x - drawing.x1), Math.abs(p.y - drawing.y1));
      x2 = drawing.x1 + (p.x >= drawing.x1 ? side : -side);
      y2 = drawing.y1 + (p.y >= drawing.y1 ? side : -side);
    }
    setDrawing(d => ({ ...d, x2, y2 }));
  };

  const onMouseUp = () => {
    if (drag) { commit(shapes); setDrag(null); return; }
    if (!drawing) return;
    const dx = Math.abs(drawing.x2 - drawing.x1), dy = Math.abs(drawing.y2 - drawing.y1);
    if ((drawing.type === "line" || drawing.type === "cota") && dx < 4 && dy < 4) { setDrawing(null); return; }
    if (!["line", "cota"].includes(drawing.type) && (dx < 8 || dy < 8)) { setDrawing(null); return; }
    commit([...shapes, drawing]);
    setDrawing(null);
  };

  const addText = () => {
    if (!textInput.val.trim()) { setTextInput(t => ({ ...t, show: false })); return; }
    commit([...shapes, { type: "text", x: textInput.x, y: textInput.y, text: textInput.val, id: newId() }]);
    setTextInput({ show: false, x: 0, y: 0, val: "" });
  };

  const upd = (k, v) => commit(shapes.map(s => s.id === selId ? { ...s, [k]: v } : s));

  // ── RENDER SHAPE ──────────────────────────────────────────────────────────
  const renderShape = (s, preview = false) => {
    const sel = s.id === selId && !preview;
    const stroke = preview ? "#42A5F5" : "#1e90ff";
    const click = (e) => { e.stopPropagation(); setSelId(s.id); };

    if (s.type === "text") return (
      <g key={s.id} onClick={click} onMouseDown={e => onShapeDragStart(e, s.id)} style={{ cursor: "move" }}>
        {sel && <rect x={s.x - 4} y={s.y - 14} width={Math.max(60, (s.text?.length || 0) * 7 + 8)} height={20} fill="none" stroke="#42A5F5" strokeWidth="1" strokeDasharray="4" rx="3" />}
        <text x={s.x} y={s.y} fontSize="13" fill="#e2f0ff" fontFamily="Arial" fontWeight="600">{s.text}</text>
      </g>
    );

    if (s.type === "line") {
      const mx = (s.x1 + s.x2) / 2, my = (s.y1 + s.y2) / 2;
      return (
        <g key={s.id} onClick={click} onMouseDown={e => onShapeDragStart(e, s.id)} style={{ cursor: "move" }}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          {sel && <><circle cx={s.x1} cy={s.y1} r={5} fill="#42A5F5" /><circle cx={s.x2} cy={s.y2} r={5} fill="#42A5F5" /></>}
        </g>
      );
    }

    if (s.type === "cota") {
      const angle = Math.atan2(s.y2 - s.y1, s.x2 - s.x1);
      const mx = (s.x1 + s.x2) / 2, my = (s.y1 + s.y2) / 2;
      const len = Math.sqrt((s.x2 - s.x1) ** 2 + (s.y2 - s.y1) ** 2);
      const deg = angle * 180 / Math.PI;
      const label = s.medida || `${Math.round(len)}`;
      const lw = Math.max(label.length * 7 + 20, 40);
      return (
        <g key={s.id} onClick={click} onMouseDown={e => onShapeDragStart(e, s.id)} style={{ cursor: "move" }}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#FFB74D" strokeWidth="1.5" strokeDasharray="6 3" />
          {/* tick marks */}
          <line x1={s.x1 - Math.sin(angle) * 6} y1={s.y1 + Math.cos(angle) * 6} x2={s.x1 + Math.sin(angle) * 6} y2={s.y1 - Math.cos(angle) * 6} stroke="#FFB74D" strokeWidth="1.5" />
          <line x1={s.x2 - Math.sin(angle) * 6} y1={s.y2 + Math.cos(angle) * 6} x2={s.x2 + Math.sin(angle) * 6} y2={s.y2 - Math.cos(angle) * 6} stroke="#FFB74D" strokeWidth="1.5" />
          <g transform={`translate(${mx},${my}) rotate(${deg > 90 || deg < -90 ? deg + 180 : deg})`}>
            <rect x={-lw / 2} y={-12} width={lw} height={15} fill="#0a1020" rx="3" opacity="0.9" />
            <text textAnchor="middle" y={0} fontSize="10" fill="#FFB74D" fontWeight="800" fontFamily="Arial">{label}</text>
          </g>
        </g>
      );
    }

    if (s.type === "circ") {
      const cx = (s.x1 + s.x2) / 2, cy = (s.y1 + s.y2) / 2;
      const rx = Math.abs(s.x2 - s.x1) / 2, ry = Math.abs(s.y2 - s.y1) / 2;
      return (
        <g key={s.id} onClick={click} onMouseDown={e => onShapeDragStart(e, s.id)} style={{ cursor: "move" }}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={preview ? "#42A5F518" : "#1565C012"} stroke={stroke} strokeWidth="1.5" />
          {s.medida && rx > 20 && <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fill="#64B5F6" fontWeight="700">{s.medida}</text>}
          {sel && <ellipse cx={cx} cy={cy} rx={rx + 3} ry={ry + 3} fill="none" stroke="#42A5F5" strokeWidth="1" strokeDasharray="5" />}
        </g>
      );
    }

    if (s.type === "bisagra") {
      const cx = (s.x1 + s.x2) / 2, cy = (s.y1 + s.y2) / 2;
      const w = Math.abs(s.x2 - s.x1), h = Math.abs(s.y2 - s.y1);
      const x = Math.min(s.x1, s.x2), y = Math.min(s.y1, s.y2);
      return (
        <g key={s.id} onClick={click} onMouseDown={e => onShapeDragStart(e, s.id)} style={{ cursor: "move" }}>
          <rect x={x} y={y} width={w} height={h} fill="#CE93D820" stroke="#CE93D8" strokeWidth="1.5" rx="3" />
          <circle cx={cx} cy={cy} r={Math.min(w, h) / 3} fill="none" stroke="#CE93D8" strokeWidth="1.5" />
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9" fill="#CE93D8" fontWeight="700">B</text>
          {sel && <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill="none" stroke="#42A5F5" strokeWidth="1" strokeDasharray="4" rx="4" />}
        </g>
      );
    }

    if (s.type === "perforacion") {
      const cx = (s.x1 + s.x2) / 2, cy = (s.y1 + s.y2) / 2;
      const r = Math.min(Math.abs(s.x2 - s.x1), Math.abs(s.y2 - s.y1)) / 2;
      return (
        <g key={s.id} onClick={click} onMouseDown={e => onShapeDragStart(e, s.id)} style={{ cursor: "move" }}>
          <circle cx={cx} cy={cy} r={r} fill="#F48FB120" stroke="#F48FB1" strokeWidth="2" />
          <line x1={cx - r * 0.7} y1={cy - r * 0.7} x2={cx + r * 0.7} y2={cy + r * 0.7} stroke="#F48FB1" strokeWidth="1.5" />
          <line x1={cx + r * 0.7} y1={cy - r * 0.7} x2={cx - r * 0.7} y2={cy + r * 0.7} stroke="#F48FB1" strokeWidth="1.5" />
          {s.medida && <text x={cx} y={cy - r - 5} textAnchor="middle" fontSize="9" fill="#F48FB1" fontWeight="700">⌀{s.medida}</text>}
          {sel && <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#42A5F5" strokeWidth="1" strokeDasharray="4" />}
        </g>
      );
    }

    if (s.type === "manija") {
      const cx = (s.x1 + s.x2) / 2, cy = (s.y1 + s.y2) / 2;
      const w = Math.abs(s.x2 - s.x1), h = Math.abs(s.y2 - s.y1);
      const x = Math.min(s.x1, s.x2), y = Math.min(s.y1, s.y2);
      return (
        <g key={s.id} onClick={click} onMouseDown={e => onShapeDragStart(e, s.id)} style={{ cursor: "move" }}>
          <rect x={x} y={y} width={w} height={h} fill="#80CBC420" stroke="#80CBC4" strokeWidth="2" rx="4" />
          <rect x={cx - 3} y={y + h * 0.2} width={6} height={h * 0.6} fill="#80CBC4" rx="3" />
          <text x={cx} y={y + h + 12} textAnchor="middle" fontSize="9" fill="#80CBC4" fontWeight="700">Manija</text>
          {sel && <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill="none" stroke="#42A5F5" strokeWidth="1" strokeDasharray="4" rx="5" />}
        </g>
      );
    }

    if (s.type === "entrante") {
      const x1 = s.x1, y1 = s.y1, x2 = s.x2, y2 = s.y2;
      const midX = (x1 + x2) / 2;
      return (
        <g key={s.id} onClick={click} onMouseDown={e => onShapeDragStart(e, s.id)} style={{ cursor: "move" }}>
          <path d={`M ${x1} ${y1} L ${midX} ${y2} L ${x2} ${y1}`} fill="#FFB74D15" stroke="#FFB74D" strokeWidth="2" strokeLinejoin="round" />
          <text x={midX} y={Math.min(y1, y2) - 6} textAnchor="middle" fontSize="9" fill="#FFB74D" fontWeight="700">Entrante</text>
          {sel && <path d={`M ${x1 - 3} ${y1} L ${midX} ${y2 - 3} L ${x2 + 3} ${y1}`} fill="none" stroke="#42A5F5" strokeWidth="1" strokeDasharray="4" />}
        </g>
      );
    }

    // rect por defecto
    const x = Math.min(s.x1, s.x2), y = Math.min(s.y1, s.y2);
    const w = Math.abs(s.x2 - s.x1), h = Math.abs(s.y2 - s.y1);
    const c = s.corners || [0, 0, 0, 0];
    const d = buildPath(x, y, w, h, c);
    return (
      <g key={s.id} onClick={click} onMouseDown={e => onShapeDragStart(e, s.id)} style={{ cursor: "move" }}>
        <path d={d} fill={preview ? "#42A5F518" : "#1565C012"} stroke={stroke} strokeWidth={sel ? 2 : 1.5} />
        {s.medidaAncho && s.medidaAlto && w > 50 && h > 30 && (
          <>
            <text x={x + w / 2} y={y + h / 2 - 6} textAnchor="middle" fontSize="11" fill="#64B5F6" fontWeight="700">{s.medidaAncho}</text>
            <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle" fontSize="11" fill="#64B5F6" fontWeight="700">{s.medidaAlto}</text>
          </>
        )}
        {(s.ladoSup) && <text x={x + w / 2} y={y - 6} textAnchor="middle" fontSize="10" fill="#FFB74D" fontWeight="700">{s.ladoSup}</text>}
        {(s.ladoInf) && <text x={x + w / 2} y={y + h + 13} textAnchor="middle" fontSize="10" fill="#FFB74D" fontWeight="700">{s.ladoInf}</text>}
        {(s.ladoIzq) && <text x={x - 5} y={y + h / 2} textAnchor="end" fontSize="10" fill="#FFB74D" fontWeight="700">{s.ladoIzq}</text>}
        {(s.ladoDer) && <text x={x + w + 5} y={y + h / 2} textAnchor="start" fontSize="10" fill="#FFB74D" fontWeight="700">{s.ladoDer}</text>}
        {sel && <path d={buildPath(x - 3, y - 3, w + 6, h + 6, c.map(r => r + 3))} fill="none" stroke="#42A5F5" strokeWidth="1" strokeDasharray="5" />}
      </g>
    );
  };

  // ── TOOLS ─────────────────────────────────────────────────────────────────
  const TOOLS = [
    { id: "select", emoji: "↖", label: "Mover" },
    { id: "rect", emoji: "▭", label: "Rectángulo" },
    { id: "circ", emoji: "○", label: "Círculo" },
    { id: "line", emoji: "╱", label: "Línea" },
    { id: "cota", emoji: "↔", label: "Cota" },
    { id: "bisagra", emoji: "🔩", label: "Bisagra" },
    { id: "perforacion", emoji: "⭕", label: "Perforación" },
    { id: "manija", emoji: "🚪", label: "Manija" },
    { id: "entrante", emoji: "📐", label: "Entrante" },
    { id: "text", emoji: "T", label: "Texto" },
  ];

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {/* Canvas side */}
      <div style={{ flex: 1 }}>
        {/* Toolbar */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 3, background: "#071220", border: "1px solid #1e3a5a", borderRadius: 9, padding: "3px 5px" }}>
            {TOOLS.map(t => (
              <button key={t.id} title={t.label} onClick={() => { setTool(t.id); setSelId(null); }}
                style={{ padding: "5px 9px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: tool === t.id ? 700 : 400, background: tool === t.id ? "linear-gradient(135deg,#1565C0,#0d47a1)" : "transparent", color: tool === t.id ? "#fff" : "#5a8ab8", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 14 }}>{t.emoji}</span>
                <span style={{ fontSize: 10, display: "none" }}>{t.label}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={undo} disabled={hIdx === 0} title="Deshacer" style={{ padding: "5px 9px", borderRadius: 7, border: "1px solid #1e3a5a", background: "#071220", color: hIdx === 0 ? "#1e3a5a" : "#7ab2e8", cursor: "pointer", fontSize: 13 }}>↩</button>
            <button onClick={redo} disabled={hIdx >= history.length - 1} title="Rehacer" style={{ padding: "5px 9px", borderRadius: 7, border: "1px solid #1e3a5a", background: "#071220", color: hIdx >= history.length - 1 ? "#1e3a5a" : "#7ab2e8", cursor: "pointer", fontSize: 13 }}>↪</button>
            {selId && <button onClick={del} title="Eliminar" style={{ padding: "5px 9px", borderRadius: 7, border: "1px solid #7f2020", background: "#1a0a0a", color: "#f48fb1", cursor: "pointer", fontSize: 13 }}>🗑</button>}
            <button onClick={() => { commit([]); setSelId(null); }} title="Limpiar todo" style={{ padding: "5px 9px", borderRadius: 7, border: "1px solid #1e3a5a", background: "#071220", color: "#5a8ab8", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Limpiar</button>
          </div>
          <span style={{ fontSize: 10, color: "#1e3a5a", marginLeft: "auto" }}>Ctrl=libre · Shift=proporc.</span>
        </div>

        {/* SVG Canvas */}
        <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid #1e3a5a" }}>
          <svg ref={svgRef} width="100%" height="440" style={{ background: "#050d18", cursor: tool === "select" ? "default" : "crosshair", display: "block", userSelect: "none" }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            onClick={e => { if (e.target === svgRef.current) setSelId(null); }}>
            <defs>
              <pattern id="grid10" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0b1e35" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid100" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#grid10)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#0d2540" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid100)" />
            {shapes.map(s => renderShape(s))}
            {drawing && renderShape(drawing, true)}
          </svg>
          {textInput.show && (
            <div style={{ position: "absolute", top: textInput.y, left: textInput.x, zIndex: 10, background: "#0d1b2a", border: "1px solid #1565C0", borderRadius: 8, padding: 8, display: "flex", gap: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
              <input autoFocus value={textInput.val} onChange={e => setTextInput(t => ({ ...t, val: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") addText(); if (e.key === "Escape") setTextInput(t => ({ ...t, show: false })); }}
                style={{ ...iS, width: 180, padding: "5px 9px", fontSize: 13 }} placeholder="Escribí el texto..." />
              <button onClick={addText} style={{ background: "#1565C0", border: "none", color: "#fff", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>✓</button>
            </div>
          )}
        </div>
        <div style={{ fontSize: 10, color: "#1e3a5a", marginTop: 5, display: "flex", gap: 14, flexWrap: "wrap" }}>
          {TOOLS.map(t => <span key={t.id} style={{ color: tool === t.id ? "#64B5F6" : "#1e3a5a" }}>{t.emoji} {t.label}</span>)}
        </div>
      </div>

      {/* Properties panel */}
      <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: "#071220", border: "1px solid #1e3a5a", borderRadius: 10, padding: 14, maxHeight: 460, overflowY: "auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#5a8ab8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Propiedades</div>
          {!selId && <div style={{ fontSize: 12, color: "#2a4a6a", lineHeight: 1.6 }}>Seleccioná una forma para editar sus propiedades y medidas.</div>}
          {selId && (() => {
            const inp = (label, key, placeholder, type = "text") => (
              <div style={{ marginBottom: 9 }}>
                <div style={{ fontSize: 10, color: "#5a8ab8", fontWeight: 600, marginBottom: 3, textTransform: "uppercase" }}>{label}</div>
                <input value={selShape?.[key] || ""} onChange={e => upd(key, e.target.value)} placeholder={placeholder} type={type}
                  style={{ ...iS, padding: "6px 9px", fontSize: 12 }} />
              </div>
            );
            return (
              <>
                {selShape?.type === "text" && inp("Texto", "text", "Contenido...")}
                {selShape?.type === "cota" && inp("Medida", "medida", "Ej: 1200mm")}
                {selShape?.type === "circ" && inp("Diámetro / Medida", "medida", "Ej: 150mm")}
                {selShape?.type === "perforacion" && inp("Diámetro", "medida", "Ej: 12mm")}
                {selShape?.type === "rect" && (
                  <>
                    {inp("Ancho", "medidaAncho", "Ej: 1200mm")}
                    {inp("Alto", "medidaAlto", "Ej: 2000mm")}
                    <div style={{ borderTop: "1px solid #0f2035", paddingTop: 9, marginTop: 3 }}>
                      <div style={{ fontSize: 10, color: "#FFB74D", fontWeight: 700, marginBottom: 7 }}>Medidas por lado</div>
                      {inp("↑ Superior", "ladoSup", "Ej: 1200mm")}
                      {inp("↓ Inferior", "ladoInf", "Ej: 1180mm")}
                      {inp("← Izquierdo", "ladoIzq", "Ej: 2000mm")}
                      {inp("→ Derecho", "ladoDer", "Ej: 1990mm")}
                      <div style={{ fontSize: 10, color: "#5a8ab8", fontWeight: 700, marginBottom: 7, marginTop: 6 }}>Esquinas (0–80)</div>
                      {["↖ Sup-Izq", "↗ Sup-Der", "↘ Inf-Der", "↙ Inf-Izq"].map((lbl, i) => {
                        const c = selShape?.corners || [0, 0, 0, 0];
                        return (
                          <div key={i} style={{ marginBottom: 7 }}>
                            <div style={{ fontSize: 10, color: "#5a8ab8", marginBottom: 3 }}>{lbl}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <input type="range" min="0" max="80" value={c[i]}
                                onChange={e => { const nc = [...c]; nc[i] = +e.target.value; upd("corners", nc); }}
                                style={{ flex: 1, accentColor: "#1565C0" }} />
                              <span style={{ fontSize: 11, color: "#64B5F6", minWidth: 20, textAlign: "right" }}>{c[i]}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {selShape?.type === "bisagra" && inp("Etiqueta", "label", "Ej: Bisagra 100mm")}
                {selShape?.type === "manija" && inp("Etiqueta", "label", "Ej: Tirador inox")}
              </>
            );
          })()}
        </div>

        {/* Leyenda de herramientas */}
        <div style={{ background: "#071220", border: "1px solid #1e3a5a", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#5a8ab8", textTransform: "uppercase", marginBottom: 10 }}>Herramientas</div>
          {TOOLS.map(t => (
            <button key={t.id} onClick={() => { setTool(t.id); setSelId(null); }}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "6px 8px", marginBottom: 3, borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: tool === t.id ? 700 : 400, background: tool === t.id ? "#1565C018" : "transparent", color: tool === t.id ? "#64B5F6" : "#3a6a9a", borderLeft: tool === t.id ? "2px solid #1565C0" : "2px solid transparent" }}>
              <span style={{ fontSize: 15 }}>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  PDF GENERATORS
// ══════════════════════════════════════════════════════════════════════════════

// Convierte shapes a SVG string para PDF
const shapesToSVG = (shapes) => {
  if (!shapes || !shapes.length) return "";
  const allX = shapes.flatMap(s => [s.x1, s.x2, s.x].filter(v => v != null));
  const allY = shapes.flatMap(s => [s.y1, s.y2, s.y].filter(v => v != null));
  if (!allX.length) return "";
  const minX = Math.min(...allX) - 20, minY = Math.min(...allY) - 20;
  const maxX = Math.max(...allX) + 20, maxY = Math.max(...allY) + 20;
  const W = maxX - minX, H = maxY - minY;

  const renderS = (s) => {
    if (s.type === "text") return `<text x="${s.x}" y="${s.y}" font-size="13" fill="#1a1a2e" font-weight="600" font-family="Arial">${s.text || ""}</text>`;
    if (s.type === "line") return `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="#1565C0" stroke-width="2" stroke-linecap="round"/>`;
    if (s.type === "cota") {
      const mx = (s.x1 + s.x2) / 2, my = (s.y1 + s.y2) / 2;
      const len = Math.round(Math.sqrt((s.x2 - s.x1) ** 2 + (s.y2 - s.y1) ** 2));
      const label = s.medida || String(len);
      return `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="#e65100" stroke-width="1.5" stroke-dasharray="6 3"/>
              <rect x="${mx - 22}" y="${my - 12}" width="44" height="15" fill="white" rx="3"/>
              <text x="${mx}" y="${my}" text-anchor="middle" font-size="10" fill="#e65100" font-weight="800" font-family="Arial">↔ ${label}</text>`;
    }
    if (s.type === "circ") {
      const cx = (s.x1 + s.x2) / 2, cy = (s.y1 + s.y2) / 2, rx = Math.abs(s.x2 - s.x1) / 2, ry = Math.abs(s.y2 - s.y1) / 2;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#e3f2fd" stroke="#1565C0" stroke-width="2"/>
              ${s.medida ? `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="10" fill="#1565C0" font-weight="700">${s.medida}</text>` : ""}`;
    }
    if (s.type === "bisagra") {
      const x = Math.min(s.x1, s.x2), y = Math.min(s.y1, s.y2), w = Math.abs(s.x2 - s.x1), h = Math.abs(s.y2 - s.y1);
      const cx = x + w / 2, cy = y + h / 2;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="2" rx="3"/>
              <circle cx="${cx}" cy="${cy}" r="${Math.min(w, h) / 3}" fill="none" stroke="#7b1fa2" stroke-width="1.5"/>
              <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="9" fill="#7b1fa2" font-weight="700">B</text>`;
    }
    if (s.type === "perforacion") {
      const cx = (s.x1 + s.x2) / 2, cy = (s.y1 + s.y2) / 2, r = Math.min(Math.abs(s.x2 - s.x1), Math.abs(s.y2 - s.y1)) / 2;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fce4ec" stroke="#c62828" stroke-width="2"/>
              <line x1="${cx - r * 0.7}" y1="${cy - r * 0.7}" x2="${cx + r * 0.7}" y2="${cy + r * 0.7}" stroke="#c62828" stroke-width="1.5"/>
              <line x1="${cx + r * 0.7}" y1="${cy - r * 0.7}" x2="${cx - r * 0.7}" y2="${cy + r * 0.7}" stroke="#c62828" stroke-width="1.5"/>
              ${s.medida ? `<text x="${cx}" y="${cy - r - 5}" text-anchor="middle" font-size="9" fill="#c62828" font-weight="700">⌀${s.medida}</text>` : ""}`;
    }
    if (s.type === "manija") {
      const x = Math.min(s.x1, s.x2), y = Math.min(s.y1, s.y2), w = Math.abs(s.x2 - s.x1), h = Math.abs(s.y2 - s.y1);
      const cx = x + w / 2;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e0f2f1" stroke="#00695c" stroke-width="2" rx="4"/>
              <rect x="${cx - 3}" y="${y + h * 0.2}" width="6" height="${h * 0.6}" fill="#00695c" rx="3"/>
              <text x="${cx}" y="${y + h + 12}" text-anchor="middle" font-size="9" fill="#00695c" font-weight="700">Manija</text>`;
    }
    if (s.type === "entrante") {
      const midX = (s.x1 + s.x2) / 2;
      return `<path d="M ${s.x1} ${s.y1} L ${midX} ${s.y2} L ${s.x2} ${s.y1}" fill="#fff3e0" stroke="#e65100" stroke-width="2" stroke-linejoin="round"/>
              <text x="${midX}" y="${Math.min(s.y1, s.y2) - 6}" text-anchor="middle" font-size="9" fill="#e65100" font-weight="700">Entrante</text>`;
    }
    // rect
    const x = Math.min(s.x1, s.x2), y = Math.min(s.y1, s.y2), w = Math.abs(s.x2 - s.x1), h = Math.abs(s.y2 - s.y1);
    const c = s.corners || [0, 0, 0, 0];
    const d = buildPath(x, y, w, h, c);
    const dims = s.medidaAncho && s.medidaAlto
      ? `<text x="${x + w / 2}" y="${y + h / 2 - 5}" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="700">${s.medidaAncho}</text>
         <text x="${x + w / 2}" y="${y + h / 2 + 11}" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="700">${s.medidaAlto}</text>`
      : (s.medidaAncho || s.medidaAlto)
        ? `<text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="700">${s.medidaAncho || s.medidaAlto}</text>`
        : "";
    const sides = [
      s.ladoSup ? `<text x="${x + w / 2}" y="${y - 7}" text-anchor="middle" font-size="11" fill="#e65100" font-weight="700">${s.ladoSup}</text>` : "",
      s.ladoInf ? `<text x="${x + w / 2}" y="${y + h + 15}" text-anchor="middle" font-size="11" fill="#e65100" font-weight="700">${s.ladoInf}</text>` : "",
      s.ladoIzq ? `<text x="${x - 6}" y="${y + h / 2}" text-anchor="end" font-size="11" fill="#e65100" font-weight="700">${s.ladoIzq}</text>` : "",
      s.ladoDer ? `<text x="${x + w + 6}" y="${y + h / 2}" text-anchor="start" font-size="11" fill="#e65100" font-weight="700">${s.ladoDer}</text>` : "",
    ].join("");
    return `<path d="${d}" fill="#e8f4ff" stroke="#1565C0" stroke-width="2"/>${dims}${sides}`;
  };

  const svgContent = shapes.map(renderS).join("\n");
  return `<svg viewBox="${minX} ${minY} ${W} ${H}" width="100%" style="max-height:340px;border:2px solid #1565C0;border-radius:8px;background:#f8fbff;display:block">${svgContent}</svg>`;
};

const openPDFWindow = (html, title) => {
  const w = window.open("", "_blank", "width=940,height=820");
  if (w) { w.document.write(html); w.document.close(); w.onload = () => { w.focus(); w.print(); }; }
};

const generarPDFTaller = (form, clienteNombre) => {
  const planoSVG = shapesToSVG(form.plano || []);
  const vidrios = (form.vidrios || []).filter(v => v.tipo || v.ancho || v.alto);

  const vidriosRows = vidrios.map((v, i) => `
    <tr style="background:${i % 2 === 0 ? "#f8fbff" : "#fff"}">
      <td style="text-align:center;font-size:18px;font-weight:900;color:#0d47a1">${v.cant || 1}</td>
      <td style="font-weight:700;font-size:14px">${v.tipo || "—"}</td>
      <td style="text-align:center;font-size:15px;font-weight:700">${v.ancho || "—"} × ${v.alto || "—"} mm</td>
      <td style="font-size:13px">${v.obs || ""}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Taller — ${form.numero || ""}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a2e;background:#fff;font-size:13px}
.hdr{background:linear-gradient(135deg,#1b5e20,#2e7d32);padding:18px 28px;display:flex;justify-content:space-between;align-items:center}
.biz-name{font-size:19px;font-weight:900;color:#fff;letter-spacing:0.5px}
.doc-num{font-size:28px;font-weight:900;color:#fff;letter-spacing:1px}
.divider{height:4px;background:linear-gradient(90deg,#1b5e20,#66bb6a,#1b5e20)}
.body{padding:20px 28px}
.badge-taller{display:inline-block;background:rgba(255,255,255,0.2);color:#fff;padding:4px 14px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:1px;margin-top:6px}
.client-strip{background:#e8f5e9;border-radius:8px;padding:10px 16px;border:1px solid #a5d6a7;display:flex;gap:24px;margin-bottom:16px}
.cf label{font-size:9px;color:#388e3c;font-weight:700;text-transform:uppercase;display:block;margin-bottom:1px}
.cf p{font-size:14px;font-weight:600;color:#1a1a2e}
.st{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#2e7d32;border-bottom:2px solid #2e7d32;padding-bottom:4px;margin:16px 0 10px}
table{width:100%;border-collapse:collapse}
thead tr{background:linear-gradient(135deg,#1b5e20,#2e7d32);color:#fff}
thead th{padding:9px 12px;font-size:11px;font-weight:700;letter-spacing:0.5px}
tbody td{padding:9px 12px;border-bottom:1px solid #e8f5e9;vertical-align:middle}
.warn-box{background:#fff8e1;border-left:3px solid #ffa000;padding:10px 14px;font-size:13px;line-height:1.7;color:#333;border-radius:0 6px 6px 0;margin-top:4px}
.sign-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:32px}
.sign-line{border-top:2px solid #2e7d32;padding-top:8px;text-align:center}
.sign-label{font-size:10px;color:#555;text-transform:uppercase;letter-spacing:0.5px}
.footer{background:#e8f5e9;border-top:2px solid #c8e6c9;padding:8px 28px;display:flex;justify-content:space-between;font-size:10px;color:#555;margin-top:20px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:7mm}}
</style></head><body>
<div class="hdr">
  <div>
    <div class="biz-name">La Vidriería Rosario — TALLER</div>
    <div style="font-size:10px;color:rgba(255,255,255,0.7);margin-top:2px">Orden de Producción Interna · SIN PRECIOS</div>
    <span class="badge-taller">🔧 PARA TALLER</span>
  </div>
  <div style="text-align:right">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.7)">Orden N°</div>
    <div class="doc-num">${form.numero || "S/N"}</div>
    <div style="font-size:10px;color:rgba(255,255,255,0.7);margin-top:3px">${form.fecha || ""}</div>
    ${form.fechaEntrega ? `<div style="font-size:11px;color:#a5d6a7;font-weight:700;margin-top:4px">📅 Entrega estimada: ${form.fechaEntrega}</div>` : ""}
  </div>
</div>
<div class="divider"></div>
<div class="body">
  <div class="client-strip">
    <div class="cf"><label>Cliente</label><p>${form.contactoNombre || clienteNombre || "—"}</p></div>
    <div class="cf"><label>Teléfono</label><p>${form.contactoTelefono || "—"}</p></div>
    <div class="cf"><label>Domicilio de instalación</label><p>${form.domicilio || "—"}</p></div>
  </div>

  ${form.descripcion ? `<div class="st">Descripción del Trabajo</div>
  <div style="background:#f8fbff;border-left:3px solid #2e7d32;padding:10px 14px;font-size:14px;line-height:1.7;color:#1a1a2e;font-weight:600">${form.descripcion}</div>` : ""}

  ${vidrios.length ? `<div class="st">Vidrios a Producir</div>
  <table>
    <thead><tr>
      <th style="text-align:center;width:60px">Cant.</th>
      <th style="text-align:left">Tipo de vidrio</th>
      <th style="text-align:center;width:160px">Medidas (mm)</th>
      <th style="text-align:left">Borde / Corte / Observaciones</th>
    </tr></thead>
    <tbody>${vidriosRows}</tbody>
  </table>` : ""}

  ${planoSVG ? `<div class="st">Plano / Croquis de Producción</div>
  <div style="margin-top:8px">${planoSVG}</div>
  <div style="font-size:10px;color:#555;margin-top:6px">
    <span style="color:#7b1fa2;font-weight:700">● Bisagra</span> &nbsp;
    <span style="color:#c62828;font-weight:700">⊕ Perforación</span> &nbsp;
    <span style="color:#00695c;font-weight:700">▬ Manija</span> &nbsp;
    <span style="color:#e65100;font-weight:700">↔ Cota</span> &nbsp;
    <span style="color:#1565C0;font-weight:700">■ Vidrio/Marco</span>
  </div>` : ""}

  ${form.notasTaller ? `<div class="st">Instrucciones Especiales para Taller</div>
  <div class="warn-box">${form.notasTaller}</div>` : ""}

  <div class="sign-grid">
    <div class="sign-line">
      <div class="sign-label">Recibido por taller</div>
      <div style="height:32px"></div>
    </div>
    <div class="sign-line">
      <div class="sign-label">Entregado por</div>
      <div style="height:32px"></div>
    </div>
  </div>
</div>
<div class="footer">
  <span>Generado el ${new Date().toLocaleString("es-AR")} · VidrierApp</span>
  <span>La Vidriería Rosario · Mendoza 1783 · 341 425-1007</span>
</div>
</body></html>`;
  openPDFWindow(html, "PDF Taller");
};

const generarPDFInstalacion = (form, clienteNombre) => {
  const planoSVG = shapesToSVG(form.plano || []);
  const vidrios = (form.vidrios || []).filter(v => v.tipo || v.ancho || v.alto);
  const senia = +form.senia || 0;
  const saldo = +form.saldo || 0;
  const total = senia + saldo;

  const vidriosRows = vidrios.map((v, i) => `
    <tr style="background:${i % 2 === 0 ? "#f8fbff" : "#fff"}">
      <td style="text-align:center;font-weight:900;font-size:15px;color:#0d47a1">${v.cant || 1}</td>
      <td style="font-weight:700">${v.tipo || "—"}</td>
      <td style="text-align:center;font-weight:700">${v.ancho || "—"} × ${v.alto || "—"} mm</td>
      <td style="font-size:12px">${v.obs || ""}</td>
    </tr>`).join("");

  const metodoPago = (m) => ({ efectivo: "💵 Efectivo", transferencia: "📲 Transferencia", debito: "💳 Débito", credito: "💳 Crédito", cheque: "📄 Cheque" })[m] || m;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Instalación — ${form.numero || ""}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a2e;background:#fff;font-size:13px}
.hdr{background:linear-gradient(135deg,#0a2a5e,#1565C0);padding:18px 28px;display:flex;justify-content:space-between;align-items:center;gap:16px}
.hdr-left{display:flex;align-items:center;gap:12px}
.biz-name{font-size:19px;font-weight:900;color:#fff}
.biz-sub{font-size:10px;color:rgba(255,255,255,0.7);margin-top:2px}
.biz-contact{font-size:10px;color:rgba(255,255,255,0.85);margin-top:2px}
.hdr-right{text-align:right;flex-shrink:0}
.doc-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.7)}
.doc-num{font-size:28px;font-weight:900;color:#fff;letter-spacing:1px;display:block}
.doc-date{font-size:10px;color:rgba(255,255,255,0.7);margin-top:3px;display:block}
.divider{height:3px;background:linear-gradient(90deg,#1565C0,#42A5F5,#1565C0)}
.body{padding:20px 28px}
.st{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:4px;margin:16px 0 10px}
table{width:100%;border-collapse:collapse}
thead tr{background:linear-gradient(135deg,#0a2a5e,#1565C0);color:#fff}
thead th{padding:8px 12px;font-size:11px;font-weight:600;letter-spacing:0.5px}
tbody td{padding:8px 12px;border-bottom:1px solid #e8f0ff;vertical-align:middle}
tbody tr:nth-child(even){background:#f8fbff}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.f label{font-size:9px;color:#888;font-weight:700;text-transform:uppercase;display:block;margin-bottom:2px}
.f p{font-size:14px;font-weight:600;color:#1a1a2e}
.pago-box{background:#f0f6ff;border-radius:8px;padding:14px 18px;border:1px solid #e0ecff}
.pago-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#555;border-bottom:1px solid #e8f0ff}
.pago-total{display:flex;justify-content:space-between;padding:10px 0 2px;font-size:18px;font-weight:900;color:#0a2a5e;border-top:2px solid #1565C0;margin-top:4px}
.nota-box{background:#f8f9ff;border-left:3px solid #1565C0;padding:10px 14px;font-size:13px;line-height:1.7;color:#333;border-radius:0 6px 6px 0}
.sign-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-top:36px}
.sign-line{border-top:2px solid #1565C0;padding-top:10px;text-align:center}
.sign-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.sign-name{font-size:13px;font-weight:700;color:#1565C0;margin-top:4px}
.sign-acl{font-size:11px;color:#555;margin-top:2px}
.footer{background:#f0f6ff;border-top:2px solid #e3f2fd;padding:8px 28px;display:flex;justify-content:space-between;font-size:10px;color:#888;margin-top:20px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:8mm}}
</style></head><body>
<div class="hdr">
  <div class="hdr-left">
    <div>
      <div class="biz-name">La Vidriería Rosario</div>
      <div class="biz-sub">Vidrios · Espejos · Cerramientos · Instalaciones</div>
      <div class="biz-contact">📍 Mendoza 1783, Rosario, Santa Fe · CP 2000</div>
      <div class="biz-contact">📞 341 425-1007 / 341 508-4921 &nbsp;·&nbsp; ✉️ lavidrieria@gmail.com</div>
      <div class="biz-contact">📸 @lavidrieriarosariooficial &nbsp;·&nbsp; 🕐 Lun-Vie 8-19hs · Sáb 8-13hs</div>
    </div>
  </div>
  <div class="hdr-right">
    <div class="doc-type">Remito de Instalación</div>
    <span class="doc-num">${form.numero || "S/N"}</span>
    <span class="doc-date">Fecha: ${form.fecha || ""}</span>
  </div>
</div>
<div class="divider"></div>
<div class="body">

  <div class="st">Datos del Cliente</div>
  <div class="g3">
    <div class="f"><label>Nombre</label><p>${form.contactoNombre || clienteNombre || "—"}</p></div>
    <div class="f"><label>Teléfono</label><p>${form.contactoTelefono || "—"}</p></div>
    <div class="f"><label>Domicilio de instalación</label><p>${form.domicilio || "—"}</p></div>
  </div>

  ${form.descripcion ? `<div class="st">Descripción del Trabajo</div>
  <div class="nota-box" style="font-weight:600;font-size:14px">${form.descripcion}</div>` : ""}

  ${vidrios.length ? `<div class="st">Materiales y Vidrios</div>
  <table>
    <thead><tr>
      <th style="text-align:center;width:60px">Cant.</th>
      <th style="text-align:left">Tipo de vidrio</th>
      <th style="text-align:center;width:160px">Medidas (mm)</th>
      <th style="text-align:left">Observaciones</th>
    </tr></thead>
    <tbody>${vidriosRows}</tbody>
  </table>` : ""}

  ${planoSVG ? `<div class="st">Plano / Croquis</div>
  <div style="margin-top:8px">${planoSVG}</div>
  <div style="font-size:10px;color:#555;margin-top:6px">
    <span style="color:#7b1fa2;font-weight:700">● Bisagra</span> &nbsp;
    <span style="color:#c62828;font-weight:700">⊕ Perforación</span> &nbsp;
    <span style="color:#00695c;font-weight:700">▬ Manija</span> &nbsp;
    <span style="color:#e65100;font-weight:700">↔ Cota/Medida</span> &nbsp;
    <span style="color:#1565C0;font-weight:700">■ Rectángulo/Marco</span>
  </div>` : ""}

  ${total > 0 ? `<div class="st">Detalle de Pago</div>
  <div style="display:flex;justify-content:flex-end">
    <div style="width:320px">
      <div class="pago-box">
        ${senia > 0 ? `<div class="pago-row">
          <div><span>Seña abonada</span><br><span style="font-size:11px;color:#888">${metodoPago(form.metodoSenia)} · ${form.fechaSenia || ""}</span></div>
          <span style="font-weight:700;color:#1565C0">$${senia.toLocaleString("es-AR")}</span>
        </div>` : ""}
        ${saldo > 0 ? `<div class="pago-row">
          <div><span>Saldo restante</span><br><span style="font-size:11px;color:#888">${metodoPago(form.metodoSaldo)} · ${form.fechaSaldo || ""}</span></div>
          <span style="font-weight:700;color:#e65100">$${saldo.toLocaleString("es-AR")}</span>
        </div>` : ""}
        <div class="pago-total">
          <span>TOTAL</span>
          <span>$${total.toLocaleString("es-AR")}</span>
        </div>
      </div>
    </div>
  </div>` : ""}

  ${form.notasInstalacion ? `<div class="st">Observaciones</div>
  <div class="nota-box">${form.notasInstalacion}</div>` : ""}

  <div class="sign-grid">
    <div class="sign-line">
      <div class="sign-label">Firma del colocador</div>
      <div style="height:40px"></div>
      <div class="sign-name">La Vidriería Rosario</div>
      <div class="sign-acl">Mendoza 1783 · Rosario</div>
    </div>
    <div class="sign-line">
      <div class="sign-label">Conformidad del cliente — recibí conforme</div>
      <div style="height:40px"></div>
      <div class="sign-name">${form.contactoNombre || clienteNombre || "_______________________"}</div>
      <div class="sign-acl">Aclaración / DNI</div>
    </div>
  </div>

</div>
<div class="footer">
  <span>Generado el ${new Date().toLocaleString("es-AR")} · VidrierApp · La Vidriería Rosario</span>
  <span>Mendoza 1783 · Rosario · 341 425-1007</span>
</div>
</body></html>`;
  openPDFWindow(html, "PDF Instalación");
};

// ══════════════════════════════════════════════════════════════════════════════
//  ORDEN FORM PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════

const ESTADOS = [
  { id: "pendiente", label: "Pendiente", color: "#FFB74D", bg: "#2a1f0a" },
  { id: "taller", label: "En Taller", color: "#4FC3F7", bg: "#0a1f2a" },
  { id: "entregado", label: "Entregado", color: "#A5D6A7", bg: "#0a2a0f" },
  { id: "cobrado", label: "Cobrado ✓", color: "#26A69A", bg: "#0a2a26" },
];

const METODOS_PAGO = [
  { id: "efectivo", label: "💵 Efectivo" },
  { id: "transferencia", label: "📲 Transferencia" },
  { id: "debito", label: "💳 Débito" },
  { id: "credito", label: "💳 Crédito" },
  { id: "cheque", label: "📄 Cheque" },
];

export const OrdenFormNuevo = ({ orden, clientes, tiposVidrio: tiposInit, onSave, onClose, newOrderNum }) => {
  const [tiposVidrio, setTiposVidrio] = useState(tiposInit || TIPOS_VIDRIO_DEFAULT);
  const [showTiposEditor, setShowTiposEditor] = useState(false);

  const EMPTY = {
    numero: newOrderNum || "",
    fecha: new Date().toISOString().split("T")[0],
    estado: "pendiente",
    clienteId: "",
    contactoNombre: "",
    contactoTelefono: "",
    domicilio: "",
    descripcion: "",
    vidrios: [{ id: newId(), cant: 1, tipo: "", ancho: "", alto: "", obs: "" }],
    plano: [],
    notasTaller: "",
    notasInstalacion: "",
    fechaEntrega: "",
    senia: "",
    metodoSenia: "efectivo",
    fechaSenia: "",
    saldo: "",
    metodoSaldo: "efectivo",
    fechaSaldo: "",
  };

  const [form, setForm] = useState(orden ? { ...EMPTY, ...orden } : EMPTY);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Cuando cambia el cliente, pre-completa nombre y teléfono
  const onClienteChange = (id) => {
    const c = clientes.find(x => x.id === id);
    setForm(f => ({
      ...f,
      clienteId: id,
      contactoNombre: c?.nombre || f.contactoNombre,
      contactoTelefono: c?.telefono || f.contactoTelefono,
    }));
  };

  const setVidrio = (i, k, v) => setForm(f => {
    const vv = [...f.vidrios];
    vv[i] = { ...vv[i], [k]: v };
    return { ...f, vidrios: vv };
  });
  const addVidrio = () => setForm(f => ({ ...f, vidrios: [...f.vidrios, { id: newId(), cant: 1, tipo: "", ancho: "", alto: "", obs: "" }] }));
  const removeVidrio = (i) => setForm(f => ({ ...f, vidrios: f.vidrios.filter((_, idx) => idx !== i) }));

  const total = (+form.senia || 0) + (+form.saldo || 0);

  const validate = () => {
    const e = {};
    if (!form.clienteId) e.clienteId = "Seleccioná un cliente";
    if (!form.contactoNombre?.trim()) e.contactoNombre = "Requerido";
    if (!form.contactoTelefono?.trim()) e.contactoTelefono = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave(form);
  };

  const clienteActual = clientes.find(c => c.id === form.clienteId);

  // ── SECTION HEADER ──────────────────────────────────────────────────────────
  const SH = ({ n, label, color = "#64B5F6", emoji }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 8, borderBottom: `2px solid ${color}40` }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${color}20`, border: `1.5px solid ${color}60`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color, flexShrink: 0 }}>{emoji || n}</div>
      <span style={{ fontSize: 13, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
    </div>
  );

  return (
    <div>
      {/* ── HEADER BAR ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, padding: "11px 16px", background: "#071220", borderRadius: 10, border: "1px solid #1e3a5a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 800, color: "#1565C0", background: "#0a1828", padding: "6px 14px", borderRadius: 8, border: "1px solid #1565C030" }}>{form.numero || "—"}</div>
          <Sel value={form.estado} onChange={e => set("estado", e.target.value)} style={{ width: 170 }}>
            {ESTADOS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
          </Sel>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#5a8ab8" }}>Fecha:</label>
            <input type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)} style={{ ...iS, width: 145, padding: "7px 10px", fontSize: 13 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="taller" small onClick={() => generarPDFTaller(form, clienteActual?.nombre || "")}>
            🔧 PDF Taller
          </Btn>
          <Btn variant="inst" small onClick={() => generarPDFInstalacion(form, clienteActual?.nombre || "")}>
            🏠 PDF Instalación
          </Btn>
        </div>
      </div>

      {/* ══ 1. CLIENTE ══ */}
      <div style={{ background: "#071220", borderRadius: 12, padding: 18, border: "1px solid #1565C040", marginBottom: 16 }}>
        <SH n={1} label="Cliente" emoji="👤" color="#64B5F6" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label="Seleccionar cliente" required>
            <Sel value={form.clienteId} onChange={e => onClienteChange(e.target.value)}
              style={{ ...iS, borderColor: errors.clienteId ? "#f44336" : "#1e3a5a" }}>
              <option value="">— Elegir cliente —</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </Sel>
            {errors.clienteId && <div style={{ fontSize: 11, color: "#f48fb1", marginTop: 3 }}>⚠ {errors.clienteId}</div>}
          </Field>

          <Field label="Nombre de contacto" required>
            <Input value={form.contactoNombre || ""} onChange={e => set("contactoNombre", e.target.value)} placeholder="Nombre completo..."
              style={{ ...iS, borderColor: errors.contactoNombre ? "#f44336" : "#1e3a5a" }} />
            {errors.contactoNombre && <div style={{ fontSize: 11, color: "#f48fb1", marginTop: 3 }}>⚠ Requerido</div>}
          </Field>

          <Field label="Teléfono" required>
            <Input value={form.contactoTelefono || ""} onChange={e => set("contactoTelefono", e.target.value)} placeholder="341 000-0000..."
              style={{ ...iS, borderColor: errors.contactoTelefono ? "#f44336" : "#1e3a5a" }} />
            {errors.contactoTelefono && <div style={{ fontSize: 11, color: "#f48fb1", marginTop: 3 }}>⚠ Requerido</div>}
          </Field>

          <div style={{ gridColumn: "span 2" }}>
            <Field label="Domicilio de instalación">
              <Input value={form.domicilio || ""} onChange={e => set("domicilio", e.target.value)} placeholder="Calle y número donde se instala..." />
            </Field>
          </div>

          <Field label="Fecha estimada de entrega">
            <input type="date" value={form.fechaEntrega || ""} onChange={e => set("fechaEntrega", e.target.value)} style={iS} />
          </Field>
        </div>
      </div>

      {/* ══ 2. DESCRIPCIÓN + VIDRIOS ══ */}
      <div style={{ background: "#071220", borderRadius: 12, padding: 18, border: "1px solid #1565C030", marginBottom: 16 }}>
        <SH n={2} label="Descripción del trabajo y vidrios" emoji="🔷" color="#4FC3F7" />

        <Field label="Descripción general del trabajo">
          <Textarea value={form.descripcion || ""} onChange={e => set("descripcion", e.target.value)}
            placeholder="Ej: Mampara de baño con puerta corrediza, espejo bisagrado, frente de cocina..."
            style={{ minHeight: 60 }} />
        </Field>

        {/* Tipos de vidrio editables */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, marginTop: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#4FC3F7", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tabla de vidrios</span>
          <button onClick={() => setShowTiposEditor(s => !s)} style={{ background: "none", border: "1px solid #1565C040", borderRadius: 7, color: "#5a8ab8", cursor: "pointer", padding: "4px 12px", fontSize: 12, fontFamily: "inherit" }}>
            {showTiposEditor ? "✕ Cerrar" : "✏️ Editar tipos de vidrio"}
          </button>
        </div>

        {showTiposEditor && (
          <TiposVidrioPanelInline
            tipos={tiposVidrio}
            onSave={(list) => { setTiposVidrio(list); setShowTiposEditor(false); }}
            onClose={() => setShowTiposEditor(false)}
          />
        )}

        {/* Encabezado de tabla */}
        <div style={{ display: "grid", gridTemplateColumns: "55px 1fr 95px 95px 1fr 28px", gap: 8, marginBottom: 6 }}>
          {["Cant.", "Tipo de vidrio", "Ancho mm", "Alto mm", "Observaciones", ""].map(h => (
            <span key={h} style={{ fontSize: 10, color: "#3a6a9a", fontWeight: 700, textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {form.vidrios.map((v, i) => (
          <div key={v.id} style={{ display: "grid", gridTemplateColumns: "55px 1fr 95px 95px 1fr 28px", gap: 8, marginBottom: 8, alignItems: "center" }}>
            <input type="number" min="1" value={v.cant} onChange={e => setVidrio(i, "cant", e.target.value)}
              style={{ ...iS, textAlign: "center" }} />

            <div>
              <Sel value={tiposVidrio.includes(v.tipo) ? v.tipo : (v.tipo ? "__custom__" : "")}
                onChange={e => { if (e.target.value === "__custom__") setVidrio(i, "tipo", "__custom__"); else setVidrio(i, "tipo", e.target.value); }}>
                <option value="">Tipo...</option>
                {tiposVidrio.map(t => <option key={t} value={t}>{t}</option>)}
                <option value="__custom__">✏️ Escribir manual...</option>
              </Sel>
              {(v.tipo === "__custom__" || (!tiposVidrio.includes(v.tipo) && v.tipo && v.tipo !== "")) && (
                <input value={v.tipo === "__custom__" ? "" : v.tipo} onChange={e => setVidrio(i, "tipo", e.target.value)}
                  placeholder="Escribí el tipo de vidrio..." style={{ ...iS, marginTop: 5, fontSize: 13 }} />
              )}
            </div>

            <input type="number" value={v.ancho} onChange={e => setVidrio(i, "ancho", e.target.value)}
              placeholder="0" style={{ ...iS, textAlign: "center" }} />
            <input type="number" value={v.alto} onChange={e => setVidrio(i, "alto", e.target.value)}
              placeholder="0" style={{ ...iS, textAlign: "center" }} />
            <Input value={v.obs} onChange={e => setVidrio(i, "obs", e.target.value)} placeholder="Borde pulido, biselado..." />
            <button onClick={() => removeVidrio(i)} disabled={form.vidrios.length <= 1}
              style={{ background: "none", border: "none", color: form.vidrios.length <= 1 ? "#1e3a5a" : "#f48fb1", cursor: form.vidrios.length <= 1 ? "not-allowed" : "pointer", padding: 4, display: "flex" }}>
              🗑
            </button>
          </div>
        ))}

        <button onClick={addVidrio}
          style={{ marginTop: 4, padding: "7px 16px", borderRadius: 8, border: "1px dashed #1565C040", background: "transparent", color: "#5a8ab8", cursor: "pointer", fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
          + Agregar vidrio
        </button>
      </div>

      {/* ══ 3. PLANO ══ */}
      <div style={{ background: "#071220", borderRadius: 12, padding: 18, border: "1px solid #4FC3F730", marginBottom: 16 }}>
        <SH n={3} label="Plano de producción" emoji="✏️" color="#CE93D8" />
        <div style={{ marginBottom: 12, fontSize: 13, color: "#5a8ab8", lineHeight: 1.6 }}>
          Dibujá el vidrio con todas las medidas: bisagras, perforaciones, manijas, entrantes, cotas. Este plano se imprime en el PDF de Taller.
        </div>
        <PlanoCanvas value={form.plano} onChange={v => set("plano", v)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
          <Field label="Notas para el taller (instrucciones internas)">
            <Textarea value={form.notasTaller || ""} onChange={e => set("notasTaller", e.target.value)}
              placeholder="Instrucciones especiales, procesos, materiales adicionales..." style={{ minHeight: 60 }} />
          </Field>
          <Field label="Observaciones para la instalación">
            <Textarea value={form.notasInstalacion || ""} onChange={e => set("notasInstalacion", e.target.value)}
              placeholder="Acceso, horarios, encargado, observaciones del cliente..." style={{ minHeight: 60 }} />
          </Field>
        </div>
      </div>

      {/* ══ 4. PAGOS ══ */}
      <div style={{ background: "#071220", borderRadius: 12, padding: 18, border: "1px solid #FFB74D20", marginBottom: 16 }}>
        <SH n={4} label="Pagos" emoji="💰" color="#FFB74D" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Seña */}
          <div style={{ background: "#0a1828", borderRadius: 10, padding: 14, border: "1px solid #FFB74D20" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#FFB74D", textTransform: "uppercase", marginBottom: 12 }}>Seña / Anticipo</div>
            <Field label="Monto ($)">
              <input type="number" value={form.senia || ""} onChange={e => set("senia", e.target.value)} placeholder="0"
                style={iS} />
            </Field>
            <Field label="Forma de pago">
              <Sel value={form.metodoSenia} onChange={e => set("metodoSenia", e.target.value)}>
                {METODOS_PAGO.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </Sel>
            </Field>
            <Field label="Fecha">
              <input type="date" value={form.fechaSenia || ""} onChange={e => set("fechaSenia", e.target.value)} style={iS} />
            </Field>
            {/* Botón rápido */}
            <button onClick={() => { set("fechaSenia", new Date().toISOString().split("T")[0]); }}
              style={{ width: "100%", padding: "6px 0", borderRadius: 7, border: "1px solid #FFB74D30", background: "#1a1000", color: "#FFB74D", cursor: "pointer", fontSize: 12, fontFamily: "inherit", marginTop: 2 }}>
              📅 Fecha de hoy
            </button>
          </div>

          {/* Saldo */}
          <div style={{ background: "#0a1828", borderRadius: 10, padding: 14, border: "1px solid #A5D6A720" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#A5D6A7", textTransform: "uppercase", marginBottom: 12 }}>Saldo / Pago Final</div>
            <Field label="Monto ($)">
              <input type="number" value={form.saldo || ""} onChange={e => set("saldo", e.target.value)} placeholder="0"
                style={iS} />
            </Field>
            <Field label="Forma de pago">
              <Sel value={form.metodoSaldo} onChange={e => set("metodoSaldo", e.target.value)}>
                {METODOS_PAGO.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </Sel>
            </Field>
            <Field label="Fecha">
              <input type="date" value={form.fechaSaldo || ""} onChange={e => set("fechaSaldo", e.target.value)} style={iS} />
            </Field>
            <button onClick={() => { set("fechaSaldo", new Date().toISOString().split("T")[0]); }}
              style={{ width: "100%", padding: "6px 0", borderRadius: 7, border: "1px solid #A5D6A730", background: "#0a2a0f", color: "#A5D6A7", cursor: "pointer", fontSize: 12, fontFamily: "inherit", marginTop: 2 }}>
              📅 Fecha de hoy
            </button>
          </div>
        </div>

        {/* Total */}
        {total > 0 && (
          <div style={{ marginTop: 14, padding: "10px 16px", background: "#0a1828", borderRadius: 10, border: "1px solid #1565C030", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 12, color: "#5a8ab8" }}>Total registrado</span>
              {+form.senia > 0 && +form.saldo > 0 && (
                <div style={{ fontSize: 11, color: "#3a6a9a", marginTop: 2 }}>
                  Seña ${(+form.senia).toLocaleString("es-AR")} + Saldo ${(+form.saldo).toLocaleString("es-AR")}
                </div>
              )}
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#64B5F6" }}>${total.toLocaleString("es-AR")}</span>
          </div>
        )}
      </div>

      {/* ══ 5. FIRMAS (preview) ══ */}
      <div style={{ background: "#071220", borderRadius: 12, padding: 18, border: "1px solid #1e3a5a", marginBottom: 16 }}>
        <SH n={5} label="Firmas — aparecen en el PDF de Instalación" emoji="✍️" color="#90A4AE" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ borderTop: "1.5px solid #1565C0", paddingTop: 10, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#5a8ab8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Firma del colocador</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#64B5F6" }}>La Vidriería Rosario</div>
            <div style={{ fontSize: 11, color: "#3a6a9a" }}>Mendoza 1783 · Rosario</div>
          </div>
          <div style={{ borderTop: "1.5px solid #1565C0", paddingTop: 10, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#5a8ab8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Conformidad del cliente</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#c8e0f8" }}>{form.contactoNombre || "________________________"}</div>
            <div style={{ fontSize: 11, color: "#3a6a9a" }}>Aclaración / DNI</div>
          </div>
        </div>
      </div>

      {/* ── BOTONES FINALES ── */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 14, borderTop: "1px solid #1e3a5a" }}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn variant="taller" onClick={() => { if (validate()) generarPDFTaller(form, clienteActual?.nombre || ""); }}>
          🔧 PDF Taller
        </Btn>
        <Btn variant="inst" onClick={() => { if (validate()) generarPDFInstalacion(form, clienteActual?.nombre || ""); }}>
          🏠 PDF Instalación
        </Btn>
        <Btn onClick={handleSave}>
          💾 {orden ? "Guardar cambios" : "Crear orden"}
        </Btn>
      </div>
    </div>
  );
};

export default OrdenFormNuevo;
