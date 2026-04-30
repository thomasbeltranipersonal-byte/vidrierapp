import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";

// ─── USUARIOS ────────────────────────────────────────────────────────────────
const USUARIOS = [
  { usuario: "thomasb",  clave: "beltrani07",  nombre: "Thomas",  rol: "admin",   color: "#64B5F6" },
  { usuario: "Taller1",  clave: "beltrani07",  nombre: "Taller",  rol: "taller",  color: "#CE93D8" },
  { usuario: "Local",    clave: "virasoro2431", nombre: "Local",   rol: "local",   color: "#A5D6A7" },
];

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [showClave, setShowClave] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = USUARIOS.find(u => u.usuario === usuario && u.clave === clave);
      if (user) {
        sessionStorage.setItem("vidrierapp_user", JSON.stringify(user));
        onLogin(user);
      } else {
        setError("Usuario o contraseña incorrectos");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{minHeight:"100vh",background:"#060f1a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans','Segoe UI',sans-serif",padding:16}}>
      <div style={{width:"100%",maxWidth:380}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:60,height:60,background:"linear-gradient(135deg,#1565C0,#0d47a1)",borderRadius:16,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14,boxShadow:"0 8px 32px rgba(21,101,192,0.4)"}}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3h8l4 9H4L8 3z"/><path d="M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/>
            </svg>
          </div>
          <div style={{fontSize:26,fontWeight:800,color:"#e2f0ff",fontFamily:"Georgia,serif",letterSpacing:"0.5px"}}>VidrierApp</div>
          <div style={{fontSize:13,color:"#3a6a9a",marginTop:4}}>La Vidriería Rosario</div>
        </div>

        {/* Card */}
        <div style={{background:"#0d1b2a",border:"1px solid #1e3a5a",borderRadius:16,padding:28,boxShadow:"0 24px 60px rgba(0,0,0,0.5)"}}>
          <div style={{fontSize:16,fontWeight:600,color:"#e2f0ff",marginBottom:22,textAlign:"center"}}>Iniciar sesión</div>

          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:"#5a8ab8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.5px"}}>Usuario</label>
            <input value={usuario} onChange={e=>setUsuario(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              placeholder="Tu usuario..."
              style={{width:"100%",background:"#071220",border:`1px solid ${error?"#7f2020":"#1e3a5a"}`,borderRadius:8,padding:"11px 14px",color:"#c8e0f8",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}
            />
          </div>

          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:"#5a8ab8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.5px"}}>Contraseña</label>
            <div style={{position:"relative"}}>
              <input value={clave} onChange={e=>setClave(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                type={showClave?"text":"password"}
                placeholder="Tu contraseña..."
                style={{width:"100%",background:"#071220",border:`1px solid ${error?"#7f2020":"#1e3a5a"}`,borderRadius:8,padding:"11px 44px 11px 14px",color:"#c8e0f8",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}
              />
              <button onClick={()=>setShowClave(s=>!s)}
                style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",padding:2,display:"flex"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showClave
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {error&&<div style={{background:"#2a0a0a",border:"1px solid #7f2020",borderRadius:8,padding:"9px 14px",color:"#f48fb1",fontSize:13,marginBottom:16,textAlign:"center"}}>{error}</div>}

          <button onClick={handleLogin} disabled={loading||!usuario||!clave}
            style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#1565C0,#0d47a1)",border:"none",borderRadius:8,color:"#fff",fontSize:15,fontWeight:700,cursor:loading||!usuario||!clave?"not-allowed":"pointer",fontFamily:"inherit",opacity:loading||!usuario||!clave?0.7:1,boxShadow:"0 4px 16px rgba(21,101,192,0.4)"}}>
            {loading?"Verificando...":"Ingresar"}
          </button>
        </div>

        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:"#1e3a5a"}}>
          VidrierApp v5.0 · Sistema de Gestión
        </div>
      </div>
    </div>
  );
};

// ─── FIREBASE CONFIG ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCRcoFujqFPX91-EYINKMsq3Or3x8H3bX8",
  authDomain: "vidrieria-rosario-94cbb.firebaseapp.com",
  projectId: "vidrieria-rosario-94cbb",
  storageBucket: "vidrieria-rosario-94cbb.firebasestorage.app",
  messagingSenderId: "223686332525",
  appId: "1:223686332525:web:05c4dc6a249ea9189faf64"
};
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

// ─── FIRESTORE HELPERS ────────────────────────────────────────────────────────
// Save a single document (upsert)
const fsSet = async (col, id, data) => {
  try {
    await setDoc(doc(db, col, id), { ...data, _id: id });
  } catch(e) { console.error("fsSet error", e); }
};
// Delete a document
const fsDel = async (col, id) => {
  try { await deleteDoc(doc(db, col, id)); } catch(e) { console.error("fsDel error", e); }
};
// Subscribe to a collection — returns unsubscribe fn
const fsSub = (col, cb) => {
  return onSnapshot(collection(db, col), snap => {
    const docs = snap.docs.map(d => d.data());
    cb(docs);
  });
};
// Save a config doc (single doc per key)
const fsCfgSet = async (key, value) => fsSet("config", key, { value });
const fsCfgSub = (key, cb) => {
  return onSnapshot(doc(db, "config", key), snap => {
    if (snap.exists()) cb(snap.data().value);
  });
};

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const ESTADOS_DEFAULT = [
  { id: "presupuesto", label: "Presupuesto", color: "#64B5F6", bg: "#1a2a3a" },
  { id: "pendiente", label: "Pendiente", color: "#FFB74D", bg: "#2a1f0a" },
  { id: "taller", label: "En Taller", color: "#4FC3F7", bg: "#0a1f2a" },
  { id: "templador", label: "Templador", color: "#CE93D8", bg: "#1e0a2a" },
  { id: "arenador", label: "Arenador", color: "#F48FB1", bg: "#2a0a1a" },
  { id: "pulido", label: "Pulido", color: "#80CBC4", bg: "#0a2a28" },
  { id: "listo_retirar", label: "Listo p/ Retirar", color: "#A5D6A7", bg: "#0a2a0f" },
  { id: "listo_entregar", label: "Listo p/ Entregar", color: "#C5E1A5", bg: "#162a0a" },
  { id: "entregado", label: "Entregado", color: "#90A4AE", bg: "#1a1f22" },
  { id: "cobrado", label: "Cobrado ✓", color: "#26A69A", bg: "#0a2a26" },
];

const TIPOS_TRABAJO = ["Mampara de Baño","Espejo","Vidrio Ventana/Puerta","Trabajo de Obra","Frente de Cocina","Vidrio Templado","Baranda","Cerramiento","Otro"];
const TIPOS_VIDRIO = ["Float 3mm","Float 4mm","Float 5mm","Float 6mm","Templado 6mm","Templado 8mm","Templado 10mm","Laminado","Espejo 3mm","Espejo 4mm","Satinado","Arenado","Reflectivo","Otro"];

const PLANTILLAS_DEFAULT = [
  { id:"t1", nombre:"Mampara Estándar", tipo:"Mampara de Baño", esCustom:false, campos:[
    {label:"Alto (cm)",key:"alto",tipo:"numero"},{label:"Ancho (cm)",key:"ancho",tipo:"numero"},
    {label:"Tipo de vidrio",key:"vidrio",tipo:"select",opciones:TIPOS_VIDRIO},
    {label:"Perfil",key:"perfil",tipo:"texto"},{label:"Color perfil",key:"color_perfil",tipo:"texto"},
    {label:"Bisagras",key:"bisagras",tipo:"select",opciones:["Con bisagras","Sin bisagras"]},
    {label:"Observaciones",key:"obs",tipo:"textarea"}]},
  { id:"t2", nombre:"Espejo con Medidas", tipo:"Espejo", esCustom:false, campos:[
    {label:"Alto (cm)",key:"alto",tipo:"numero"},{label:"Ancho (cm)",key:"ancho",tipo:"numero"},
    {label:"Tipo de espejo",key:"vidrio",tipo:"select",opciones:["Espejo 3mm","Espejo 4mm","Espejo biselado","Espejo arenado"]},
    {label:"Cantos",key:"cantos",tipo:"select",opciones:["Pulidos","Sin pulir","Biselados"]},
    {label:"Perforaciones",key:"perforaciones",tipo:"texto"},{label:"Observaciones",key:"obs",tipo:"textarea"}]},
  { id:"t3", nombre:"Vidrio Ventana/Puerta", tipo:"Vidrio Ventana/Puerta", esCustom:false, campos:[
    {label:"Alto (cm)",key:"alto",tipo:"numero"},{label:"Ancho (cm)",key:"ancho",tipo:"numero"},
    {label:"Cantidad",key:"cantidad",tipo:"numero"},{label:"Tipo de vidrio",key:"vidrio",tipo:"select",opciones:TIPOS_VIDRIO},
    {label:"Observaciones",key:"obs",tipo:"textarea"}]},
  { id:"t4", nombre:"Trabajo de Obra", tipo:"Trabajo de Obra", esCustom:false, campos:[
    {label:"Descripción del trabajo",key:"descripcion",tipo:"textarea"},{label:"Arquitecto/Obra",key:"obra",tipo:"texto"},
    {label:"Items",key:"items",tipo:"textarea"},{label:"Planos/Referencia",key:"planos",tipo:"texto"},
    {label:"Fecha estimada entrega",key:"fecha_entrega",tipo:"fecha"},{label:"Observaciones",key:"obs",tipo:"textarea"}]},
];

// ─── LOCAL FALLBACK (unused, kept for reference) ─────────────────────────────
const newId = () => Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const newOrderNum = (ordenes) => {
  const yr = new Date().getFullYear().toString().slice(-2);
  const existing = ordenes.filter(o=>o.numero?.startsWith(`OT-${yr}`));
  const max = existing.reduce((m,o)=>{ const n=parseInt(o.numero?.split("-")[2]||0); return n>m?n:m; },0);
  return `OT-${yr}-${String(max+1).padStart(4,"0")}`;
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IP = {
  home:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  orders:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
  board:"M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  clients:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 108 0 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  optimize:"M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  plus:"M12 5v14 M5 12h14",
  close:"M18 6L6 18 M6 6l12 12",
  edit:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:"M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6 M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2",
  search:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  glass:"M8 3h8l4 9H4L8 3z M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6",
  template:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  pdf:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M9 15h6 M9 11h6 M9 18h4",
  settings:"M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  refresh:"M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15",
  grip:"M8 6h.01 M8 12h.01 M8 18h.01 M16 6h.01 M16 12h.01 M16 18h.01",
};
const Icon = ({name,size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {IP[name]?.split(" M").map((d,i)=><path key={i} d={i===0?d:"M"+d}/>)}
  </svg>
);

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const iS = {width:"100%",background:"#071220",border:"1px solid #1e3a5a",borderRadius:8,padding:"10px 12px",color:"#c8e0f8",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
const Input = p => <input style={iS} {...p}/>;
const Textarea = p => <textarea style={{...iS,minHeight:80,resize:"vertical"}} {...p}/>;
const Sel = ({children,...p}) => <select style={{...iS,cursor:"pointer"}} {...p}>{children}</select>;

const Btn = ({children,onClick,variant="primary",small,style:s,disabled}) => {
  const base={display:"inline-flex",alignItems:"center",gap:6,cursor:disabled?"not-allowed":"pointer",border:"none",borderRadius:8,fontWeight:600,fontFamily:"inherit",padding:small?"6px 14px":"10px 20px",fontSize:small?13:14,opacity:disabled?0.5:1};
  const V={
    primary:{background:"linear-gradient(135deg,#1565C0,#0d47a1)",color:"#fff",boxShadow:"0 4px 16px rgba(21,101,192,0.3)"},
    secondary:{background:"#0d1b2a",border:"1px solid #1e3a5a",color:"#7ab2e8"},
    danger:{background:"#1a0a0a",border:"1px solid #7f2020",color:"#f48fb1"},
    ghost:{background:"transparent",color:"#5a8ab8"},
    success:{background:"linear-gradient(135deg,#1b5e20,#2e7d32)",color:"#fff"},
  };
  return <button onClick={onClick} disabled={disabled} style={{...base,...V[variant],...s}}>{children}</button>;
};

const Field = ({label,children}) => (
  <div style={{marginBottom:16}}>
    <label style={{display:"block",fontSize:12,fontWeight:600,color:"#5a8ab8",marginBottom:6,letterSpacing:"0.5px",textTransform:"uppercase"}}>{label}</label>
    {children}
  </div>
);

const Badge = ({estado,estados}) => {
  const list = estados||ESTADOS_DEFAULT;
  const e = list.find(x=>x.id===estado)||{label:estado,color:"#64B5F6",bg:"#1a2a3a"};
  return <span style={{background:e.bg,color:e.color,border:`1px solid ${e.color}40`,padding:"2px 10px",borderRadius:99,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{e.label}</span>;
};

const Modal = ({open,onClose,title,children,wide,xwide}) => {
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,10,25,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16,backdropFilter:"blur(4px)"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#0d1b2a",border:"1px solid #1e3a5a",borderRadius:16,width:"100%",maxWidth:xwide?1100:wide?900:600,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,0.7)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",borderBottom:"1px solid #1e3a5a"}}>
          <h2 style={{margin:0,fontSize:18,fontWeight:700,color:"#e2f0ff",fontFamily:"Georgia,serif"}}>{title}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#5a8ab8",cursor:"pointer",padding:4,borderRadius:8,display:"flex"}}><Icon name="close"/></button>
        </div>
        <div style={{overflowY:"auto",padding:24,flex:1}}>{children}</div>
      </div>
    </div>
  );
};

// ─── PDF GENERATORS ───────────────────────────────────────────────────────────
const printOrden = (orden, clienteNombre, plantilla, estados) => {
  const estadoLabel = (estados||ESTADOS_DEFAULT).find(e=>e.id===orden.estado)?.label||orden.estado;
  const camposHTML = plantilla&&orden.campos_plantilla
    ? plantilla.campos.map(c=>`<tr><td style="padding:7px 12px;font-weight:600;color:#1565C0;width:38%;border-bottom:1px solid #e8f0ff;font-size:13px">${c.label}</td><td style="padding:7px 12px;border-bottom:1px solid #e8f0ff;font-size:13px">${orden.campos_plantilla[c.key]||"—"}</td></tr>`).join("")
    : "";
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Orden ${orden.numero||""}</title>
<style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a2e;margin:0;padding:0}
.header{background:linear-gradient(135deg,#0d47a1,#1565C0);color:white;padding:22px 32px;display:flex;justify-content:space-between;align-items:center}
.logo{font-size:20px;font-weight:800;letter-spacing:1px}.numero{font-size:30px;font-weight:900;letter-spacing:2px}
.body{padding:26px 32px}.section{margin-bottom:22px}
.st{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:4px;margin-bottom:14px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.f label{font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;display:block}
.f p{margin:3px 0 0;font-size:14px;font-weight:600;color:#1a1a2e}
table{width:100%;border-collapse:collapse}.badge{display:inline-block;padding:4px 14px;border-radius:99px;font-size:11px;font-weight:700;background:#e3f2fd;color:#1565C0;border:1px solid #90CAF9}
.footer{margin-top:28px;padding-top:14px;border-top:1px solid #e8e8e8;font-size:10px;color:#aaa;text-align:center}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>
<div class="header">
  <div><div class="logo">La Vidriería Rosario</div><div style="font-size:12px;opacity:0.8;margin-top:3px">Orden de Trabajo</div></div>
  <div class="numero">${orden.numero||"—"}</div>
</div>
<div class="body">
  <div class="section"><div class="st">Información General</div>
    <div class="grid">
      <div class="f"><label>Título</label><p>${orden.titulo||"—"}</p></div>
      <div class="f"><label>Estado</label><p><span class="badge">${estadoLabel}</span></p></div>
      <div class="f"><label>Cliente</label><p>${clienteNombre||"—"}</p></div>
      <div class="f"><label>Tipo de Trabajo</label><p>${orden.tipo||"—"}</p></div>
      <div class="f"><label>Fecha</label><p>${orden.fecha||"—"}</p></div>
      <div class="f"><label>Monto</label><p>${orden.monto?"$"+parseFloat(orden.monto).toLocaleString("es-AR"):"—"}</p></div>
    </div>
  </div>
  ${camposHTML?`<div class="section"><div class="st">Especificaciones — ${plantilla?.nombre||""}</div><table>${camposHTML}</table></div>`:""}
  ${orden.notas?`<div class="section"><div class="st">Notas / Observaciones</div><p style="font-size:14px;line-height:1.7;color:#333;background:#f8f9ff;padding:12px 14px;border-radius:6px;border-left:3px solid #1565C0">${orden.notas}</p></div>`:""}
  <div class="footer">Generado el ${new Date().toLocaleString("es-AR")} · VidrierApp — Sistema de Gestión</div>
</div></body></html>`;
  const w=window.open("","_blank","width=860,height=700");
  if(w){w.document.write(html);w.document.close();w.onload=()=>{w.focus();w.print();};}
};

const printOptimizacion = (sheets, hoja, cortes, aprovechamiento) => {
  const COLORS=["#1565C0","#0277BD","#00838F","#00695C","#2E7D32","#558B2F","#F57F17","#E65100","#AD1457","#6A1B9A"];
  const scale=460/Math.max(hoja.ancho,hoja.alto);
  const svgSheets=sheets.map((sheet,idx)=>{
    const W=hoja.ancho*scale,H=hoja.alto*scale;
    const uniqueLabels=[...new Set(sheet.map(i=>i.label))];
    const rects=sheet.map(item=>{
      const ci=uniqueLabels.indexOf(item.label)%COLORS.length;
      const pw=item.pw*scale,ph=item.ph*scale;
      return `<rect x="${item.x*scale}" y="${item.y*scale}" width="${pw}" height="${ph}" fill="${COLORS[ci]}25" stroke="${COLORS[ci]}" stroke-width="1.5" rx="2"/>
${pw>40&&ph>20?`<text x="${item.x*scale+pw/2}" y="${item.y*scale+ph/2}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.max(8,Math.min(13,pw/9))}" fill="${COLORS[ci]}" font-weight="700" font-family="Arial">${item.label}${item.rotated?" ↺":""}</text>`:""}`;
    }).join("");
    return `<div style="margin-bottom:30px;break-inside:avoid;page-break-inside:avoid">
      <div style="font-size:12px;font-weight:700;color:#1565C0;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Hoja #${idx+1} — ${hoja.ancho}×${hoja.alto}mm · ${sheet.length} pieza${sheet.length!==1?"s":""}</div>
      <svg width="${W}" height="${H}" style="border:2px solid #1565C0;border-radius:4px;background:#f8fbff;display:block">
        ${rects}<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#1565C0" stroke-width="2"/>
      </svg>
    </div>`;
  }).join("");
  const lista=cortes.filter(c=>c.ancho&&c.alto).map(c=>`<tr><td style="padding:6px 10px;border-bottom:1px solid #e8f0ff">${c.label||"Sin etiqueta"}</td><td style="padding:6px 10px;border-bottom:1px solid #e8f0ff;text-align:center">${c.ancho}×${c.alto}mm</td><td style="padding:6px 10px;border-bottom:1px solid #e8f0ff;text-align:center">${c.cantidad}</td></tr>`).join("");
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Plan de Cortes</title>
<style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a2e;margin:0;padding:0}
.header{background:linear-gradient(135deg,#0d47a1,#1565C0);color:white;padding:20px 32px;display:flex;justify-content:space-between;align-items:center}
.body{padding:24px 32px}table{width:100%;border-collapse:collapse;font-size:13px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:12mm}}</style></head><body>
<div class="header">
  <div><div style="font-size:19px;font-weight:800">La Vidriería Rosario</div><div style="font-size:12px;opacity:0.75;margin-top:2px">Plan de Cortes · Generado el ${new Date().toLocaleString("es-AR")}</div></div>
  <div style="text-align:right"><div style="font-size:32px;font-weight:900">${aprovechamiento}%</div><div style="font-size:11px;opacity:0.8">aprovechamiento</div></div>
</div>
<div class="body">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px">
    <div style="background:#e3f2fd;border-radius:10px;padding:14px;text-align:center"><div style="font-size:28px;font-weight:800;color:#1565C0">${sheets.length}</div><div style="font-size:12px;color:#555">Hojas necesarias</div></div>
    <div style="background:#e8f5e9;border-radius:10px;padding:14px;text-align:center"><div style="font-size:28px;font-weight:800;color:#2E7D32">${aprovechamiento}%</div><div style="font-size:12px;color:#555">Aprovechamiento</div></div>
    <div style="background:#f3e5f5;border-radius:10px;padding:14px;text-align:center"><div style="font-size:28px;font-weight:800;color:#6A1B9A">${cortes.filter(c=>c.ancho&&c.alto).reduce((s,c)=>s+parseInt(c.cantidad||0),0)}</div><div style="font-size:12px;color:#555">Piezas totales</div></div>
  </div>
  <div style="margin-bottom:24px">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:4px;margin-bottom:10px">Lista de Piezas</div>
    <table><thead><tr style="background:#e3f2fd"><th style="padding:7px 10px;text-align:left;font-size:11px">Etiqueta</th><th style="padding:7px 10px;text-align:center;font-size:11px">Medida</th><th style="padding:7px 10px;text-align:center;font-size:11px">Cant.</th></tr></thead><tbody>${lista}</tbody></table>
  </div>
  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:4px;margin-bottom:18px">Diagrama de Cortes</div>
  ${svgSheets}
</div></body></html>`;
  const w=window.open("","_blank","width=960,height=800");
  if(w){w.document.write(html);w.document.close();w.onload=()=>{w.focus();w.print();};}
};

// ─── FIELD TYPES ─────────────────────────────────────────────────────────────
const FIELD_TYPES=[{value:"texto",label:"Texto corto"},{value:"numero",label:"Número"},{value:"textarea",label:"Texto largo"},{value:"fecha",label:"Fecha"},{value:"select",label:"Lista de opciones"}];

// ─── PLANTILLA BUILDER ────────────────────────────────────────────────────────
const PlantillaBuilder = ({plantilla,onSave,onClose}) => {
  const [nombre,setNombre]=useState(plantilla?.nombre||"");
  const [tipo,setTipo]=useState(plantilla?.tipo||"");
  const [campos,setCampos]=useState(plantilla?.campos||[]);
  const addCampo=()=>setCampos(c=>[...c,{key:"f_"+Date.now(),label:"",tipo:"texto",opciones:[]}]);
  const removeCampo=(i)=>setCampos(c=>c.filter((_,idx)=>idx!==i));
  const updateCampo=(i,k,v)=>setCampos(c=>c.map((x,idx)=>idx===i?{...x,[k]:v}:x));
  const valid=nombre.trim()&&campos.length>0&&campos.every(c=>c.label.trim());
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Field label="Nombre de la plantilla"><Input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: Baranda de Balcón"/></Field>
        <Field label="Tipo de trabajo"><Sel value={tipo} onChange={e=>setTipo(e.target.value)}><option value="">Seleccionar...</option>{TIPOS_TRABAJO.map(t=><option key={t} value={t}>{t}</option>)}</Sel></Field>
      </div>
      <div style={{background:"#071220",borderRadius:12,padding:16,border:"1px solid #1e3a5a",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{color:"#5a8ab8",fontSize:12,fontWeight:600,textTransform:"uppercase"}}>Campos del Formulario</div>
          <Btn small onClick={addCampo}><Icon name="plus" size={14}/> Agregar campo</Btn>
        </div>
        {campos.length===0&&<div style={{color:"#2a4a6a",fontSize:13,padding:"12px 0",textAlign:"center"}}>Agregá al menos un campo</div>}
        {campos.map((campo,i)=>(
          <div key={i} style={{padding:12,background:"#0a1828",borderRadius:9,border:"1px solid #0f2035",marginBottom:8}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 28px",gap:10,alignItems:"end"}}>
              <Field label="Nombre del campo"><Input value={campo.label} onChange={e=>updateCampo(i,"label",e.target.value)} placeholder="Ej: Alto total"/></Field>
              <Field label="Tipo"><Sel value={campo.tipo} onChange={e=>updateCampo(i,"tipo",e.target.value)}>{FIELD_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</Sel></Field>
              <button onClick={()=>removeCampo(i)} style={{background:"none",border:"none",color:"#f48fb1",cursor:"pointer",padding:"10px 4px",marginBottom:16}}><Icon name="trash" size={14}/></button>
            </div>
            {campo.tipo==="select"&&(
              <Field label="Opciones (una por línea)">
                <Textarea value={(campo.opciones||[]).join("\n")} onChange={e=>updateCampo(i,"opciones",e.target.value.split("\n").filter(Boolean))} placeholder={"Opción 1\nOpción 2"} style={{minHeight:60}}/>
              </Field>
            )}
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn disabled={!valid} onClick={()=>onSave({id:plantilla?.id||newId(),nombre,tipo,esCustom:true,campos:campos.map(c=>({...c,key:c.key||"f_"+newId()}))})}><Icon name="template" size={16}/> {plantilla?"Guardar Cambios":"Crear Plantilla"}</Btn>
      </div>
    </div>
  );
};

// ─── DRAWING TEMPLATES ───────────────────────────────────────────────────────
const DrawingTemplates = ({shapes, onLoad}) => {
  const [templates, setTemplates] = useState(()=>load("drawing_templates",[
    { id:"tpl_mampara", name:"Mampara estándar", shapes:[
      {type:"rect",x1:40,y1:40,x2:200,y2:340,id:"r1",corners:[0,0,0,0],label:"Alto"},
      {type:"segment",x1:40,y1:380,x2:200,y2:380,id:"s1",label:"1200mm"},
      {type:"segment",x1:220,y1:40,x2:220,y2:340,id:"s2",label:"2000mm"},
      {type:"text",x:60,y:200,text:"Mampara",id:"t1"},
    ]},
    { id:"tpl_espejo", name:"Espejo rectangular", shapes:[
      {type:"rect",x1:40,y1:40,x2:260,y2:200,id:"r1",corners:[0,0,0,0],label:""},
      {type:"segment",x1:40,y1:220,x2:260,y2:220,id:"s1",label:"Ancho"},
      {type:"segment",x1:280,y1:40,x2:280,y2:200,id:"s2",label:"Alto"},
      {type:"text",x:100,y:125,text:"Espejo",id:"t1"},
    ]},
  ]));
  const [showSave, setShowSave] = useState(false);
  const [saveName, setSaveName] = useState("");

  useEffect(()=>save("drawing_templates",templates),[templates]);

  const saveTemplate = () => {
    if(!saveName.trim()||!shapes.length) return;
    const tpl={id:"tpl_"+newId(), name:saveName.trim(), shapes:[...shapes]};
    setTemplates(t=>[...t,tpl]);
    setSaveName(""); setShowSave(false);
  };
  const deleteTemplate = (id) => setTemplates(t=>t.filter(x=>x.id!==id));

  // Mini SVG preview of a template
  const MiniPreview = ({shapes:sh}) => {
    if(!sh?.length) return <div style={{width:80,height:60,background:"#0a1520",borderRadius:5,border:"1px solid #0f2035"}}/>;
    const allX=sh.flatMap(s=>[s.x1,s.x2,s.x??0].filter(v=>v!=null));
    const allY=sh.flatMap(s=>[s.y1,s.y2,s.y??0].filter(v=>v!=null));
    const minX=Math.min(...allX)-5, minY=Math.min(...allY)-5;
    const maxX=Math.max(...allX)+5, maxY=Math.max(...allY)+5;
    const W=maxX-minX||80, H=maxY-minY||60;
    const scale=Math.min(80/W,60/H);
    return(
      <svg width="80" height="60" style={{background:"#0a1520",borderRadius:5,border:"1px solid #0f2035",display:"block",flexShrink:0}}>
        <g transform={`translate(${-minX*scale},${-minY*scale}) scale(${scale})`}>
          {sh.map((s,i)=>{
            if(s.type==="segment") return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#1e90ff" strokeWidth="2"/>;
            if(s.type==="text") return <text key={i} x={s.x} y={s.y} fontSize="8" fill="#64B5F6">{s.text?.slice(0,8)}</text>;
            if(s.type==="circle"){const cx=(s.x1+s.x2)/2,cy=(s.y1+s.y2)/2,rx=Math.abs(s.x2-s.x1)/2,ry=Math.abs(s.y2-s.y1)/2;return <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#1565C012" stroke="#1e90ff" strokeWidth="1.5"/>;}
            const x=Math.min(s.x1,s.x2),y=Math.min(s.y1,s.y2),w=Math.abs(s.x2-s.x1),h=Math.abs(s.y2-s.y1);
            const corners=s.corners||[0,0,0,0];
            return <path key={i} d={buildRectPath(x,y,w,h,corners)} fill="#1565C012" stroke="#1e90ff" strokeWidth="1.5"/>;
          })}
        </g>
      </svg>
    );
  };

  return(
    <div style={{background:"#071220",border:"1px solid #1e3a5a",borderRadius:10,padding:14}}>
      <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>Plantillas de Plano</div>

      {templates.map(tpl=>(
        <div key={tpl.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"8px 9px",background:"#0a1828",borderRadius:8,border:"1px solid #0f2035"}}>
          <MiniPreview shapes={tpl.shapes}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:"#c8e0f8",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tpl.name}</div>
            <div style={{display:"flex",gap:5}}>
              <button onClick={()=>onLoad([...tpl.shapes.map(s=>({...s,id:newId()}))])}
                style={{padding:"3px 9px",borderRadius:5,border:"none",background:"#1565C020",color:"#64B5F6",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600}}>
                Cargar
              </button>
              <button onClick={()=>deleteTemplate(tpl.id)}
                style={{padding:"3px 7px",borderRadius:5,border:"none",background:"#2a0a0a",color:"#f48fb1",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}

      {!showSave&&(
        <button onClick={()=>{if(shapes.length)setShowSave(true);}}
          disabled={!shapes.length}
          style={{width:"100%",padding:"7px 0",borderRadius:7,border:"1px dashed #1e3a5a",background:"transparent",color:shapes.length?"#5a8ab8":"#1e3a5a",cursor:shapes.length?"pointer":"not-allowed",fontSize:12,fontFamily:"inherit",marginTop:4}}>
          + Guardar plano actual como plantilla
        </button>
      )}
      {showSave&&(
        <div style={{marginTop:6}}>
          <div style={{fontSize:11,color:"#5a8ab8",marginBottom:5}}>Nombre de la plantilla</div>
          <div style={{display:"flex",gap:6}}>
            <input autoFocus value={saveName} onChange={e=>setSaveName(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")saveTemplate();if(e.key==="Escape")setShowSave(false);}}
              placeholder="Ej: Paño fijo esquina curva"
              style={{...iS,padding:"5px 8px",fontSize:12,flex:1}}/>
            <button onClick={saveTemplate} style={{padding:"5px 10px",borderRadius:6,border:"none",background:"#1565C0",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:12}}>✓</button>
            <button onClick={()=>setShowSave(false)} style={{padding:"5px 8px",borderRadius:6,border:"1px solid #1e3a5a",background:"none",color:"#5a8ab8",cursor:"pointer",fontSize:12}}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── DRAWING CANVAS v2 ───────────────────────────────────────────────────────
const CORNER_LABELS = ["↖ Sup-Izq","↗ Sup-Der","↘ Inf-Der","↙ Inf-Izq"];

const buildRectPath = (x,y,w,h,corners=[0,0,0,0]) => {
  const [tl,tr,br,bl] = corners.map(r=>Math.max(0,Math.min(r,Math.min(w,h)/2)));
  return [
    `M ${x+tl} ${y}`,
    `L ${x+w-tr} ${y}`, tr>0?`Q ${x+w} ${y} ${x+w} ${y+tr}`:"",
    `L ${x+w} ${y+h-br}`, br>0?`Q ${x+w} ${y+h} ${x+w-br} ${y+h}`:"",
    `L ${x+bl} ${y+h}`,   bl>0?`Q ${x} ${y+h} ${x} ${y+h-bl}`:"",
    `L ${x} ${y+tl}`,     tl>0?`Q ${x} ${y} ${x+tl} ${y}`:"",
    "Z"
  ].filter(Boolean).join(" ");
};

const DrawingCanvas = ({value, onChange}) => {
  const svgRef   = useRef(null);
  const [tool,   setTool]   = useState("rect");
  const [shapes, setShapes] = useState(value||[]);
  const [drawing,setDrawing]= useState(null);
  const [selId,  setSelId]  = useState(null);
  const [textInput, setTextInput] = useState({show:false,x:0,y:0,val:""});
  const [history,setHistory]= useState([value||[]]);
  const [hIdx,   setHIdx]   = useState(0);
  const [cornerR,setCornerR]= useState([0,0,0,0]); // per-corner radius for selected rect

  const selShape = shapes.find(s=>s.id===selId)||null;

  const commit = (ns) => {
    const next=[...history.slice(0,hIdx+1),ns];
    setHistory(next); setHIdx(next.length-1);
    setShapes(ns); onChange(ns);
  };
  const undo = ()=>{ if(hIdx>0){const s=history[hIdx-1];setHIdx(h=>h-1);setShapes(s);onChange(s);} };
  const redo = ()=>{ if(hIdx<history.length-1){const s=history[hIdx+1];setHIdx(h=>h+1);setShapes(s);onChange(s);} };
  const deleteSelected = ()=>{ if(selId){commit(shapes.filter(s=>s.id!==selId));setSelId(null);} };

  const snap = (v,grid=10) => Math.round(v/grid)*grid;
  const getSVGPos = (e) => {
    const r=svgRef.current.getBoundingClientRect();
    const raw={x:e.clientX-r.left, y:e.clientY-r.top};
    return e.ctrlKey ? raw : {x:snap(raw.x),y:snap(raw.y)};
  };

  const [dragShape,setDragShape] = useState(null); // {id, startMouse, startShape}

  const onMouseDown = (e) => {
    if(e.target.dataset.handle) return;
    const p=getSVGPos(e);
    if(tool==="select") return; // shape click handles selection; drag is handled separately
    if(tool==="text"){ setTextInput({show:true,x:p.x,y:p.y,val:""}); return; }
    setSelId(null);
    const isSquare = tool==="square";
    const type = (tool==="square")?"rect":tool;
    setDrawing({type, x1:p.x,y1:p.y,x2:p.x,y2:p.y, id:newId(), square:isSquare, corners:[0,0,0,0]});
  };

  const onShapeDragStart = (e,id) => {
    if(tool!=="select") return;
    const p=getSVGPos(e);
    const s=shapes.find(x=>x.id===id);
    setDragShape({id, startMouse:p, startShape:{...s}});
    setSelId(id);
    e.stopPropagation();
  };

  const onMouseMove = (e) => {
    const p=getSVGPos(e);
    // move selected shape
    if(dragShape&&tool==="select"){
      const dx=p.x-dragShape.startMouse.x, dy=p.y-dragShape.startMouse.y;
      const s=dragShape.startShape;
      setShapes(sh=>sh.map(x=>x.id===dragShape.id?{...x,
        x1:(s.x1||0)+dx, y1:(s.y1||0)+dy,
        x2:(s.x2||0)+dx, y2:(s.y2||0)+dy,
        x:(s.x||0)+dx, y:(s.y||0)+dy,
        points:s.points?.map(pt=>({x:pt.x+dx,y:pt.y+dy}))
      }:x));
      return;
    }
    if(!drawing) return;
    let x2=p.x,y2=p.y;
    if(drawing.square||e.shiftKey){
      const side=Math.max(Math.abs(p.x-drawing.x1),Math.abs(p.y-drawing.y1));
      x2=drawing.x1+(p.x>=drawing.x1?side:-side);
      y2=drawing.y1+(p.y>=drawing.y1?side:-side);
    }
    setDrawing(d=>({...d,x2,y2}));
  };

  const onMouseUp = () => {
    if(dragShape){
      commit(shapes); // save moved position
      setDragShape(null);
      return;
    }
    if(!drawing) return;
    const dx=Math.abs(drawing.x2-drawing.x1), dy=Math.abs(drawing.y2-drawing.y1);
    if(drawing.type==="segment"&&dx<4&&dy<4){setDrawing(null);return;}
    if(drawing.type!=="segment"&&(dx<8||dy<8)){setDrawing(null);return;}
    commit([...shapes,drawing]);
    setDrawing(null);
  };

  const addText = () => {
    if(!textInput.val.trim()){setTextInput(t=>({...t,show:false}));return;}
    commit([...shapes,{type:"text",x:textInput.x,y:textInput.y,text:textInput.val,id:newId()}]);
    setTextInput({show:false,x:0,y:0,val:""});
  };

  // update per-corner radius on selected rect
  const updateCorner = (idx,val) => {
    const r=[...cornerR]; r[idx]=+val; setCornerR(r);
    commit(shapes.map(s=>s.id===selId?{...s,corners:r}:s));
  };

  const onShapeClick = (e,id) => {
    e.stopPropagation();
    setSelId(id);
    const s=shapes.find(x=>x.id===id);
    if(s?.corners) setCornerR(s.corners);
    else setCornerR([0,0,0,0]);
  };

  // ── RENDER SHAPE ────────────────────────────────────────────────────────────
  const renderShape = (s, preview=false) => {
    const sel = s.id===selId && !preview;
    const stroke = preview?"#42A5F5":"#1e90ff";
    const fill   = preview?"#42A5F518":"#1565C012";
    const sw     = sel?2:1.5;
    const click  = (e)=>onShapeClick(e,s.id);

    if(s.type==="segment"){
      const mx=(s.x1+s.x2)/2, my=(s.y1+s.y2)/2;
      const ang=Math.atan2(s.y2-s.y1,s.x2-s.x1)*180/Math.PI;
      const label = s.medidaLinea||"";
      const lw = Math.max(label.length*7+16, 30);
      return <g key={s.id} onClick={click} onMouseDown={e=>onShapeDragStart(e,s.id)} style={{cursor:tool==="select"?"move":"pointer"}}>
        <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
        <circle cx={s.x1} cy={s.y1} r="3" fill={stroke}/>
        <circle cx={s.x2} cy={s.y2} r="3" fill={stroke}/>
        {label&&<g transform={`translate(${mx},${my}) rotate(${ang>90||ang<-90?ang+180:ang})`}>
          <rect x={-lw/2} y={-11} width={lw} height={14} fill="#071220" rx="3" opacity="0.9"/>
          <text textAnchor="middle" y={0} fontSize="9" fill="#64B5F6" fontWeight="700" fontFamily="Arial">{label}</text>
        </g>}
        {sel&&<><circle cx={s.x1} cy={s.y1} r="6" fill="#42A5F5" opacity="0.9" data-handle="1"/><circle cx={s.x2} cy={s.y2} r="6" fill="#42A5F5" opacity="0.9" data-handle="1"/></>}
      </g>;
    }
    if(s.type==="circle"){
      const cx=Math.min(s.x1,s.x2)+Math.abs(s.x2-s.x1)/2;
      const cy=Math.min(s.y1,s.y2)+Math.abs(s.y2-s.y1)/2;
      const rx=Math.abs(s.x2-s.x1)/2, ry=Math.abs(s.y2-s.y1)/2;
      const hasW=s.medidaAncho, hasH=s.medidaAlto;
      const dimLabel = hasW&&hasH ? `${s.medidaAncho} × ${s.medidaAlto}` : (hasW||hasH||"");
      return <g key={s.id} onClick={click} onMouseDown={e=>onShapeDragStart(e,s.id)} style={{cursor:tool==="select"?"move":"pointer"}}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={sw}/>
        {dimLabel&&rx>20&&<text x={cx} y={cy+4} textAnchor="middle" fontSize="10" fill="#64B5F6" fontFamily="Arial" fontWeight="700">{dimLabel}</text>}
        {sel&&<ellipse cx={cx} cy={cy} rx={rx+3} ry={ry+3} fill="none" stroke="#42A5F5" strokeWidth="1" strokeDasharray="5"/>}
      </g>;
    }
    if(s.type==="text"){
      return <g key={s.id} onClick={click} onMouseDown={e=>onShapeDragStart(e,s.id)} style={{cursor:tool==="select"?"move":"pointer"}}>
        {sel&&<rect x={s.x-4} y={s.y-15} width={Math.max(60,s.text.length*7+8)} height={21} fill="none" stroke="#42A5F5" strokeWidth="1" strokeDasharray="4" rx="3"/>}
        <text x={s.x} y={s.y} fontSize="13" fill="#e2f0ff" fontFamily="Arial" fontWeight="600">{s.text}</text>
      </g>;
    }
    // rect
    const x=Math.min(s.x1,s.x2), y=Math.min(s.y1,s.y2);
    const w=Math.abs(s.x2-s.x1), h=Math.abs(s.y2-s.y1);
    const corners = s.corners||[0,0,0,0];
    const d = buildRectPath(x,y,w,h,corners);
    const hasW=s.medidaAncho, hasH=s.medidaAlto;
    const dimLine1 = hasW ? s.medidaAncho : "";
    const dimLine2 = hasH ? s.medidaAlto : "";
    const bothDims = hasW&&hasH;
    // per-side labels
    const sTop=s.ladoSup||"", sRight=s.ladoDer||"", sBot=s.ladoInf||"", sLeft=s.ladoIzq||"";
    return <g key={s.id} onClick={click} onMouseDown={e=>onShapeDragStart(e,s.id)} style={{cursor:tool==="select"?"move":"pointer"}}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth={sw}/>
      {/* center dims */}
      {bothDims&&w>50&&h>32&&<>
        <text x={x+w/2} y={y+h/2-5} textAnchor="middle" fontSize="11" fill="#64B5F6" fontFamily="Arial" fontWeight="700">{dimLine1}</text>
        <text x={x+w/2} y={y+h/2+9} textAnchor="middle" fontSize="11" fill="#64B5F6" fontFamily="Arial" fontWeight="700">{dimLine2}</text>
      </>}
      {!bothDims&&(dimLine1||dimLine2)&&w>30&&h>18&&
        <text x={x+w/2} y={y+h/2+4} textAnchor="middle" fontSize="11" fill="#64B5F6" fontFamily="Arial" fontWeight="700">{dimLine1||dimLine2}</text>
      }
      {/* per-side labels */}
      {sTop&&<text x={x+w/2} y={y-5} textAnchor="middle" fontSize="10" fill="#FFB74D" fontFamily="Arial" fontWeight="700">{sTop}</text>}
      {sBot&&<text x={x+w/2} y={y+h+13} textAnchor="middle" fontSize="10" fill="#FFB74D" fontFamily="Arial" fontWeight="700">{sBot}</text>}
      {sLeft&&<text x={x-5} y={y+h/2} textAnchor="end" fontSize="10" fill="#FFB74D" fontFamily="Arial" fontWeight="700">{sLeft}</text>}
      {sRight&&<text x={x+w+5} y={y+h/2} textAnchor="start" fontSize="10" fill="#FFB74D" fontFamily="Arial" fontWeight="700">{sRight}</text>}
      {sel&&<path d={buildRectPath(x-3,y-3,w+6,h+6,corners.map(r=>r+3))} fill="none" stroke="#42A5F5" strokeWidth="1" strokeDasharray="5"/>}
    </g>;
  };

  const TOOLS=[
    {id:"select", emoji:"↖", label:"Seleccionar"},
    {id:"rect",   emoji:"▭", label:"Rectángulo"},
    {id:"square", emoji:"□", label:"Cuadrado"},
    {id:"segment",emoji:"╱", label:"Línea"},
    {id:"circle", emoji:"○", label:"Círculo"},
    {id:"text",   emoji:"T", label:"Texto"},
  ];

  const selIsRect = selShape&&(selShape.type==="rect");

  return(
    <div style={{display:"flex",gap:12}}>
      {/* LEFT: canvas */}
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
        {/* toolbar */}
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:4,background:"#071220",border:"1px solid #1e3a5a",borderRadius:9,padding:"4px 6px"}}>
            {TOOLS.map(t=>(
              <button key={t.id} title={t.label} onClick={()=>{setTool(t.id);setSelId(null);}}
                style={{padding:"6px 12px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:tool===t.id?700:500,
                  background:tool===t.id?"linear-gradient(135deg,#1565C0,#0d47a1)":"transparent",
                  color:tool===t.id?"#fff":"#5a8ab8",display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:15}}>{t.emoji}</span>
                <span style={{fontSize:11}}>{t.label}</span>
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:5}}>
            <button onClick={undo} disabled={hIdx===0} style={{padding:"5px 10px",borderRadius:7,border:"1px solid #1e3a5a",background:"#071220",color:hIdx===0?"#1e3a5a":"#7ab2e8",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>↩</button>
            <button onClick={redo} disabled={hIdx>=history.length-1} style={{padding:"5px 10px",borderRadius:7,border:"1px solid #1e3a5a",background:"#071220",color:hIdx>=history.length-1?"#1e3a5a":"#7ab2e8",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>↪</button>
            {selId&&<button onClick={deleteSelected} style={{padding:"5px 10px",borderRadius:7,border:"1px solid #7f2020",background:"#1a0a0a",color:"#f48fb1",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>🗑</button>}
            <button onClick={()=>{commit([]);setSelId(null);}} style={{padding:"5px 10px",borderRadius:7,border:"1px solid #1e3a5a",background:"#071220",color:"#5a8ab8",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Limpiar</button>
          </div>
          <span style={{fontSize:10,color:"#1e3a5a",marginLeft:"auto"}}>Ctrl = sin snap · Shift = proporcional</span>
        </div>

        {/* svg canvas */}
        <div style={{position:"relative",borderRadius:10,overflow:"hidden",border:"1px solid #1e3a5a"}}>
          <svg ref={svgRef} width="100%" height="400" style={{background:"#050d18",cursor:"crosshair",display:"block",userSelect:"none"}}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            onClick={e=>{if(e.target===svgRef.current||e.target.tagName==="rect"&&e.target.getAttribute("fill")==="url(#grid)")setSelId(null);}}>
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0b1e35" strokeWidth="0.5"/>
              </pattern>
              <pattern id="grid5" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#grid)"/>
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#0d2540" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid5)"/>
            {shapes.map(s=>renderShape(s))}
            {drawing&&renderShape(drawing,true)}
          </svg>
          {textInput.show&&(
            <div style={{position:"absolute",top:textInput.y,left:textInput.x,zIndex:10,background:"#0d1b2a",border:"1px solid #1565C0",borderRadius:8,padding:8,display:"flex",gap:6,boxShadow:"0 8px 24px rgba(0,0,0,0.5)"}}>
              <input autoFocus value={textInput.val} onChange={e=>setTextInput(t=>({...t,val:e.target.value}))}
                onKeyDown={e=>{if(e.key==="Enter")addText();if(e.key==="Escape")setTextInput(t=>({...t,show:false}));}}
                style={{...iS,width:180,padding:"5px 9px",fontSize:13}} placeholder="Escribí el texto..."/>
              <button onClick={addText} style={{background:"#1565C0",border:"none",color:"#fff",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:13,fontWeight:600}}>✓</button>
            </div>
          )}
        </div>
        <div style={{fontSize:10,color:"#1e3a5a"}}>💡 Las formas se ajustan a la grilla de 20px automáticamente · Ctrl para desactivar snap</div>
      </div>

      {/* RIGHT: properties panel */}
      <div style={{width:210,flexShrink:0,display:"flex",flexDirection:"column",gap:10,maxHeight:480,overflowY:"auto"}}>

        {/* PROPERTIES */}
        <div style={{background:"#071220",border:"1px solid #1e3a5a",borderRadius:10,padding:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>Medidas y Propiedades</div>
          {!selId&&<div style={{fontSize:12,color:"#2a4a6a",lineHeight:1.6}}>Seleccioná una forma para escribir sus medidas</div>}

          {selId&&(()=>{
            const upd=(k,v)=>commit(shapes.map(s=>s.id===selId?{...s,[k]:v}:s));
            const inp=(label,key,placeholder)=>(
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:"#5a8ab8",fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.3px"}}>{label}</div>
                <input value={selShape?.[key]||""} onChange={e=>upd(key,e.target.value)}
                  placeholder={placeholder}
                  style={{...iS,padding:"7px 10px",fontSize:13,fontWeight:600}}/>
              </div>
            );
            return(<>
              {/* TEXT */}
              {selShape?.type==="text"&&inp("Contenido","text","Escribí el texto...")}

              {/* SEGMENT: one field "medida" shown on the line */}
              {selShape?.type==="segment"&&<>
                {inp("Medida de la línea","medidaLinea","Ej: 1200mm")}
                <div style={{fontSize:10,color:"#2a4a6a",marginBottom:10,lineHeight:1.5}}>El texto aparece sobre la línea en el plano</div>
              </>}

              {/* RECT / SQUARE: ancho + alto shown inside */}
              {selShape?.type==="rect"&&<>
                {inp("Ancho","medidaAncho","Ej: 1200mm")}
                {inp("Alto","medidaAlto","Ej: 2000mm")}
                <div style={{fontSize:10,color:"#2a4a6a",marginBottom:10,lineHeight:1.5}}>Las medidas se muestran dentro de la forma</div>
              </>}

              {/* CIRCLE: diámetro or ancho×alto */}
              {selShape?.type==="circle"&&<>
                {inp("Ancho / Diámetro","medidaAncho","Ej: 800mm")}
                {inp("Alto","medidaAlto","Ej: 800mm")}
              </>}

              {/* Corners — rect only */}
              {selShape?.type==="rect"&&<>
                <div style={{fontSize:11,color:"#FFB74D",fontWeight:700,marginBottom:6,marginTop:4,borderTop:"1px solid #0f2035",paddingTop:10}}>Medidas por lado</div>
                <div style={{fontSize:10,color:"#3a6a9a",marginBottom:8,lineHeight:1.5}}>Cada lado independiente — ideal para falsa escuadra</div>
                {[["ladoSup","↑ Superior"],["ladoDer","→ Derecho"],["ladoInf","↓ Inferior"],["ladoIzq","← Izquierdo"]].map(([key,label])=>(
                  <div key={key} style={{marginBottom:7}}>
                    <div style={{fontSize:10,color:"#FFB74D",marginBottom:3,fontWeight:600}}>{label}</div>
                    <input value={selShape?.[key]||""} onChange={e=>commit(shapes.map(s=>s.id===selId?{...s,[key]:e.target.value}:s))}
                      placeholder="Ej: 1200mm" style={{...iS,padding:"5px 8px",fontSize:12}}/>
                  </div>
                ))}
                <div style={{fontSize:11,color:"#5a8ab8",fontWeight:600,marginBottom:6,marginTop:8,borderTop:"1px solid #0f2035",paddingTop:8}}>Esquinas</div>
                <div style={{fontSize:10,color:"#3a6a9a",marginBottom:8}}>0 = recta · 80 = muy curva</div>
                {CORNER_LABELS.map((label,i)=>(
                  <div key={i} style={{marginBottom:8}}>
                    <div style={{fontSize:10,color:"#5a8ab8",marginBottom:3}}>{label}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <input type="range" min="0" max="80" value={cornerR[i]} onChange={e=>updateCorner(i,e.target.value)}
                        style={{flex:1,accentColor:"#1565C0",cursor:"pointer"}}/>
                      <span style={{fontSize:11,color:"#64B5F6",minWidth:20,textAlign:"right",fontWeight:700}}>{cornerR[i]}</span>
                    </div>
                  </div>
                ))}
                <button onClick={()=>{const r=[0,0,0,0];setCornerR(r);commit(shapes.map(s=>s.id===selId?{...s,corners:r}:s));}}
                  style={{width:"100%",padding:"5px 0",background:"#0d1b2a",border:"1px solid #1e3a5a",borderRadius:6,color:"#5a8ab8",cursor:"pointer",fontSize:11,fontFamily:"inherit",marginTop:2}}>
                  Resetear esquinas
                </button>
              </>}
            </>);
          })()}
        </div>

        {/* DRAWING TEMPLATES */}
        <DrawingTemplates shapes={shapes} onLoad={(tplShapes)=>commit(tplShapes)} />

        {/* TOOLS quick list */}
        <div style={{background:"#071220",border:"1px solid #1e3a5a",borderRadius:10,padding:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>Herramientas</div>
          {TOOLS.map(t=>(
            <button key={t.id} onClick={()=>{setTool(t.id);setSelId(null);}}
              style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 10px",marginBottom:4,borderRadius:7,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:tool===t.id?700:400,
                background:tool===t.id?"#1565C018":"transparent",color:tool===t.id?"#64B5F6":"#3a6a9a",
                borderLeft:tool===t.id?"2px solid #1565C0":"2px solid transparent"}}>
              <span style={{fontSize:16,lineHeight:1}}>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── ORDEN FORM (5 TABS) ─────────────────────────────────────────────────────
const OrdenForm = ({orden,plantillas,clientes,onSave,onClose}) => {
  const [tab,setTab]=useState("presupuesto");
  const EMPTY={titulo:"",cliente:"",tipo:"",fecha:new Date().toISOString().split("T")[0],
    pres_items:[{desc:"",cant:1,precio:""},{desc:"",cant:1,precio:""}],
    pres_condiciones:"50% al confirmar, saldo contra entrega.",pres_validez:"",pres_firmante:"",
    med_plano:[],med_notas:"",med_fecha:"",
    prod_materiales:"",prod_procesos:[],prod_fecha_est:"",prod_notas:"",prod_plantilla_id:"",prod_campos:{},
    inst_fecha:"",inst_direccion:"",inst_responsable:"",inst_notas:"",inst_firmante:"",
    pago_senia:"",pago_senia_fecha:"",pago_senia_metodo:"efectivo",
    pago_total:"",pago_total_fecha:"",pago_total_metodo:"efectivo",pago_notas:"",etapa:"presupuesto"};
  const [form,setForm]=useState(orden?{...EMPTY,...orden}:EMPTY);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const setItem=(i,k,v)=>setForm(f=>{const it=[...f.pres_items];it[i]={...it[i],[k]:v};return{...f,pres_items:it};});
  const addItem=()=>setForm(f=>({...f,pres_items:[...f.pres_items,{desc:"",cant:1,precio:""}]}));
  const removeItem=(i)=>setForm(f=>({...f,pres_items:f.pres_items.filter((_,idx)=>idx!==i)}));
  const tpl=plantillas.find(p=>p.id===form.prod_plantilla_id);
  const setCampo=(k,v)=>setForm(f=>({...f,prod_campos:{...f.prod_campos,[k]:v}}));
  const subTotal=(form.pres_items||[]).reduce((s,i)=>s+(+i.precio*(+i.cant||1)),0);
  const totalConIva=subTotal*1.21;
  const PROCESOS=["Templado","Arenado","Pulido","Biselado","Perforado","Pintado","Vinilado"];
  const ETAPAS=[{id:"presupuesto",label:"Presupuesto"},{id:"medicion",label:"Medición"},{id:"produccion",label:"Producción"},{id:"instalacion",label:"Instalación/Entrega"}];
  const METODOS=["Efectivo","Transferencia","Débito","Crédito","Cheque","Otro"];
  const TABS=[{id:"presupuesto",label:"💰 Presupuesto"},{id:"medicion",label:"📐 Medición"},{id:"produccion",label:"🔧 Producción"},{id:"instalacion",label:"🚚 Instalación"},{id:"pagos",label:"💳 Pagos"}];

  const printOrdenPDF=()=>{
    const cn=clientes.find(c=>c.id===form.cliente)?.nombre||"Sin cliente";
    const etiqueta=ETAPAS.find(e=>e.id===form.etapa)?.label||form.etapa;
    const items=form.pres_items||[];
    const sub=items.reduce((s,i)=>s+(+i.precio*(+i.cant||1)),0);
    const iva=sub*0.21,tot=sub+iva;
    const rows=items.filter(i=>i.desc).map((i,idx)=>`<tr style="background:${idx%2===0?"#f8fbff":"#fff"}"><td style="padding:7px 12px;border-bottom:1px solid #e8f0ff">${i.desc}</td><td style="padding:7px 12px;border-bottom:1px solid #e8f0ff;text-align:center">${i.cant||1}</td><td style="padding:7px 12px;border-bottom:1px solid #e8f0ff;text-align:right">$${(+i.precio||0).toLocaleString("es-AR")}</td><td style="padding:7px 12px;border-bottom:1px solid #e8f0ff;text-align:right;font-weight:600">$${((+i.precio||0)*(+i.cant||1)).toLocaleString("es-AR")}</td></tr>`).join("");
    const senia=+form.pago_senia||0,pagoFinal=+form.pago_total||0;
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Orden ${form.numero||""}</title>
<style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a2e;margin:0}
.hdr{background:linear-gradient(135deg,#0d47a1,#1565C0);color:#fff;padding:22px 32px;display:flex;justify-content:space-between;align-items:flex-start}
.body{padding:24px 32px}.st{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:4px;margin:16px 0 10px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}.f label{font-size:10px;color:#888;font-weight:700;text-transform:uppercase;display:block}.f p{margin:2px 0 0;font-size:14px;font-weight:600}
table{width:100%;border-collapse:collapse;font-size:13px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:12mm}}</style></head><body>
<div class="hdr"><div><div style="font-size:22px;font-weight:900">La Vidriería Rosario</div><div style="font-size:12px;opacity:0.75;margin-top:4px">Vidrios · Espejos · Cerramientos · Instalaciones</div></div>
<div style="text-align:right"><div style="font-size:11px;opacity:0.8">ORDEN DE TRABAJO</div><div style="font-size:28px;font-weight:900">${form.numero||"S/N"}</div><div style="font-size:11px;opacity:0.7">Fecha: ${form.fecha}</div><div style="display:inline-block;margin-top:5px;padding:2px 10px;border-radius:99px;background:rgba(255,255,255,0.2);font-size:11px;font-weight:700">${etiqueta}</div></div></div>
<div class="body">
<div class="st">Datos Generales</div><div class="g2"><div class="f"><label>Título</label><p>${form.titulo||"—"}</p></div><div class="f"><label>Cliente</label><p>${cn}</p></div><div class="f"><label>Tipo</label><p>${form.tipo||"—"}</p></div><div class="f"><label>Etapa</label><p>${etiqueta}</p></div></div>
${rows?`<div class="st">Presupuesto</div><table><thead><tr style="background:#1565C0;color:#fff"><th style="padding:7px 12px;text-align:left">Descripción</th><th style="padding:7px 12px;text-align:center">Cant.</th><th style="padding:7px 12px;text-align:right">P.Unit.</th><th style="padding:7px 12px;text-align:right">Subtotal</th></tr></thead><tbody>${rows}</tbody></table><div style="display:flex;justify-content:flex-end;margin-top:6px"><div style="width:240px"><div style="display:flex;justify-content:space-between;padding:5px 10px;font-size:13px"><span style="color:#555">Subtotal</span><span>$${sub.toLocaleString("es-AR")}</span></div><div style="display:flex;justify-content:space-between;padding:5px 10px;font-size:13px;border-bottom:1px solid #e0e0e0"><span style="color:#555">IVA 21%</span><span>$${iva.toLocaleString("es-AR")}</span></div><div style="display:flex;justify-content:space-between;padding:8px 10px;font-size:15px;font-weight:800;background:#e3f2fd;border-radius:6px;margin-top:3px"><span style="color:#1565C0">TOTAL</span><span style="color:#1565C0">$${tot.toLocaleString("es-AR")}</span></div></div></div>`:""}
${form.med_notas?`<div class="st">Medición</div><p style="font-size:13px;color:#333">${form.med_notas}</p>`:""}
${form.prod_materiales||form.prod_procesos?.length?`<div class="st">Producción</div><div class="g2"><div class="f"><label>Materiales</label><p style="font-size:13px">${form.prod_materiales||"—"}</p></div><div class="f"><label>Procesos</label><p style="font-size:13px">${(form.prod_procesos||[]).join(", ")||"—"}</p></div>${form.prod_fecha_est?`<div class="f"><label>Fecha est.</label><p>${form.prod_fecha_est}</p></div>`:""}</div>`:""}
${form.inst_fecha||form.inst_direccion?`<div class="st">Instalación / Entrega</div><div class="g2"><div class="f"><label>Fecha</label><p>${form.inst_fecha||"—"}</p></div><div class="f"><label>Dirección</label><p>${form.inst_direccion||"—"}</p></div><div class="f"><label>Responsable</label><p>${form.inst_responsable||"—"}</p></div><div class="f"><label>Recibe</label><p>${form.inst_firmante||"—"}</p></div></div>`:""}
${senia||pagoFinal?`<div class="st">Pagos</div><div class="g2"><div class="f"><label>Seña</label><p style="color:#1565C0">$${senia.toLocaleString("es-AR")} — ${form.pago_senia_fecha||"—"} (${form.pago_senia_metodo})</p></div><div class="f"><label>Pago final</label><p style="color:#2e7d32">$${pagoFinal.toLocaleString("es-AR")} — ${form.pago_total_fecha||"—"} (${form.pago_total_metodo})</p></div></div>`:""}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px"><div style="border-top:1.5px solid #1565C0;padding-top:8px;text-align:center"><div style="font-size:11px;color:#888">Firma empresa</div><div style="font-size:13px;font-weight:700;color:#1565C0;margin-top:4px">La Vidriería Rosario</div></div><div style="border-top:1.5px solid #ccc;padding-top:8px;text-align:center"><div style="font-size:11px;color:#888">Conformidad cliente</div><div style="font-size:12px;color:#555;margin-top:4px">${form.inst_firmante||form.pres_firmante||"________________________"}</div></div></div>
<div style="margin-top:18px;text-align:center;font-size:10px;color:#aaa">Generado el ${new Date().toLocaleString("es-AR")} · VidrierApp · La Vidriería Rosario</div>
</div></body></html>`;
    const w=window.open("","_blank","width=920,height=800");
    if(w){w.document.write(html);w.document.close();w.onload=()=>{w.focus();w.print();};}
  };

  return(
    <div>
      {/* HEADER */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,marginBottom:16,padding:"12px 16px",background:"#071220",borderRadius:10,border:"1px solid #1e3a5a",alignItems:"end"}}>
        <Field label="Título de la Orden"><Input value={form.titulo} onChange={e=>set("titulo",e.target.value)} placeholder="Ej: Mampara Baño Principal"/></Field>
        <Field label="Cliente"><Sel value={form.cliente} onChange={e=>set("cliente",e.target.value)}><option value="">Sin asignar</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</Sel></Field>
        <Field label="Etapa actual"><Sel value={form.etapa} onChange={e=>set("etapa",e.target.value)}>{ETAPAS.map(e=><option key={e.id} value={e.id}>{e.label}</option>)}</Sel></Field>
        <div style={{paddingBottom:16}}><Btn small variant="secondary" onClick={printOrdenPDF}><Icon name="pdf" size={14}/> PDF</Btn></div>
      </div>

      {/* TABS */}
      <div style={{display:"flex",gap:2,marginBottom:18,borderBottom:"1px solid #1e3a5a"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"9px 14px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:tab===t.id?700:500,color:tab===t.id?"#64B5F6":"#3a6a9a",borderBottom:tab===t.id?"2px solid #1565C0":"2px solid transparent",marginBottom:-1,whiteSpace:"nowrap"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: PRESUPUESTO */}
      {tab==="presupuesto"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
          <Field label="Tipo de Trabajo"><Sel value={form.tipo} onChange={e=>set("tipo",e.target.value)}><option value="">Seleccionar...</option>{TIPOS_TRABAJO.map(t=><option key={t} value={t}>{t}</option>)}</Sel></Field>
          <Field label="Fecha"><Input type="date" value={form.fecha} onChange={e=>set("fecha",e.target.value)}/></Field>
          <Field label="Válido hasta"><Input type="date" value={form.pres_validez} onChange={e=>set("pres_validez",e.target.value)}/></Field>
        </div>
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase"}}>Ítems</div>
            <Btn small onClick={addItem}><Icon name="plus" size={13}/> Ítem</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 60px 120px 28px",gap:8,marginBottom:5}}>
            {["Descripción","Cant.","Precio unit.",""].map(h=><span key={h} style={{fontSize:10,color:"#3a6a9a",fontWeight:600}}>{h}</span>)}
          </div>
          {(form.pres_items||[]).map((item,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 60px 120px 28px",gap:8,marginBottom:7,alignItems:"center"}}>
              <Input value={item.desc} onChange={e=>setItem(i,"desc",e.target.value)} placeholder="Ej: Vidrio Float 6mm 1200×2000"/>
              <Input type="number" value={item.cant} min="1" onChange={e=>setItem(i,"cant",e.target.value)} style={{textAlign:"center"}}/>
              <Input type="number" value={item.precio} onChange={e=>setItem(i,"precio",e.target.value)} placeholder="$0"/>
              <button onClick={()=>removeItem(i)} disabled={(form.pres_items||[]).length<=1} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,opacity:(form.pres_items||[]).length<=1?0.3:1,display:"flex"}}><Icon name="trash" size={13}/></button>
            </div>
          ))}
          {subTotal>0&&<div style={{marginTop:10,padding:"10px 12px",background:"#0a1828",borderRadius:8,border:"1px solid #1565C025"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5a8ab8",marginBottom:2}}><span>Subtotal</span><span>${subTotal.toLocaleString("es-AR")}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5a8ab8",marginBottom:2}}><span>IVA 21%</span><span>${(subTotal*0.21).toLocaleString("es-AR")}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:700,color:"#64B5F6"}}><span>TOTAL</span><span>${totalConIva.toLocaleString("es-AR")}</span></div>
          </div>}
        </div>
        <Field label="Condiciones de pago"><Textarea value={form.pres_condiciones} onChange={e=>set("pres_condiciones",e.target.value)}/></Field>
        <Field label="Firmante (cliente)"><Input value={form.pres_firmante||""} onChange={e=>set("pres_firmante",e.target.value)} placeholder="Nombre del cliente..."/></Field>
      </div>}

      {/* TAB: MEDICIÓN */}
      {tab==="medicion"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <Field label="Fecha de medición en obra"><Input type="date" value={form.med_fecha||""} onChange={e=>set("med_fecha",e.target.value)}/></Field>
          <Field label="Notas del relevamiento"><Input value={form.med_notas||""} onChange={e=>set("med_notas",e.target.value)} placeholder="Obs. de la medición en obra..."/></Field>
        </div>
        <DrawingCanvas value={form.med_plano||[]} onChange={v=>set("med_plano",v)}/>
      </div>}

      {/* TAB: PRODUCCIÓN */}
      {tab==="produccion"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <Field label="Materiales necesarios"><Textarea value={form.prod_materiales||""} onChange={e=>set("prod_materiales",e.target.value)} placeholder="Ej: Vidrio templado 8mm, burlete D gris..."/></Field>
          <div>
            <Field label="Fecha estimada producción"><Input type="date" value={form.prod_fecha_est||""} onChange={e=>set("prod_fecha_est",e.target.value)}/></Field>
            <Field label="Notas para el taller"><Textarea value={form.prod_notas||""} onChange={e=>set("prod_notas",e.target.value)} style={{minHeight:60}}/></Field>
          </div>
        </div>
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",marginBottom:10}}>Procesos requeridos</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {PROCESOS.map(p=>{const active=(form.prod_procesos||[]).includes(p);return(
              <button key={p} onClick={()=>setForm(f=>({...f,prod_procesos:active?(f.prod_procesos||[]).filter(x=>x!==p):[...(f.prod_procesos||[]),p]}))}
                style={{padding:"6px 14px",borderRadius:99,border:`1px solid ${active?"#1565C0":"#1e3a5a"}`,background:active?"#1565C020":"transparent",color:active?"#64B5F6":"#3a6a9a",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:active?700:400}}>
                {p}
              </button>
            );})}
          </div>
        </div>
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",marginBottom:10}}>Plantilla de producción (opcional)</div>
          <Sel value={form.prod_plantilla_id||""} onChange={e=>set("prod_plantilla_id",e.target.value)}><option value="">Sin plantilla</option>{plantillas.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</Sel>
          {tpl&&<div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {tpl.campos.map(campo=>{const val=form.prod_campos?.[campo.key]||"";return(
              <div key={campo.key} style={{gridColumn:campo.tipo==="textarea"?"span 2":"auto"}}>
                <Field label={campo.label}>{campo.tipo==="select"?<Sel value={val} onChange={e=>setCampo(campo.key,e.target.value)}><option value="">Seleccionar...</option>{(campo.opciones||[]).map(o=><option key={o} value={o}>{o}</option>)}</Sel>:campo.tipo==="textarea"?<Textarea value={val} onChange={e=>setCampo(campo.key,e.target.value)}/>:<Input type={campo.tipo==="numero"?"number":"text"} value={val} onChange={e=>setCampo(campo.key,e.target.value)}/>}</Field>
              </div>
            );})}
          </div>}
        </div>
      </div>}

      {/* TAB: INSTALACIÓN */}
      {tab==="instalacion"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Fecha de instalación / entrega"><Input type="date" value={form.inst_fecha||""} onChange={e=>set("inst_fecha",e.target.value)}/></Field>
          <Field label="Dirección"><Input value={form.inst_direccion||""} onChange={e=>set("inst_direccion",e.target.value)} placeholder="Calle, número, piso..."/></Field>
          <Field label="Responsable instalación"><Input value={form.inst_responsable||""} onChange={e=>set("inst_responsable",e.target.value)} placeholder="Nombre del instalador..."/></Field>
          <Field label="Quién recibe / firma"><Input value={form.inst_firmante||""} onChange={e=>set("inst_firmante",e.target.value)} placeholder="Cliente o encargado..."/></Field>
          <div style={{gridColumn:"span 2"}}><Field label="Observaciones"><Textarea value={form.inst_notas||""} onChange={e=>set("inst_notas",e.target.value)} placeholder="Acceso, horarios, instrucciones..."/></Field></div>
        </div>
      </div>}

      {/* TAB: PAGOS */}
      {tab==="pagos"&&<div>
        {totalConIva>0&&<div style={{background:"#071220",borderRadius:10,padding:"11px 16px",border:"1px solid #1565C030",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:13,color:"#5a8ab8"}}>Total presupuestado</span>
          <span style={{fontSize:18,fontWeight:800,color:"#64B5F6"}}>${totalConIva.toLocaleString("es-AR")}</span>
        </div>}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #FFB74D20",marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:"#FFB74D",textTransform:"uppercase",marginBottom:12}}>💰 Seña / Anticipo</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Field label="Monto ($)"><Input type="number" value={form.pago_senia||""} onChange={e=>set("pago_senia",e.target.value)} placeholder="0"/></Field>
            <Field label="Fecha de cobro"><Input type="date" value={form.pago_senia_fecha||""} onChange={e=>set("pago_senia_fecha",e.target.value)}/></Field>
            <Field label="Forma de pago"><Sel value={form.pago_senia_metodo||"efectivo"} onChange={e=>set("pago_senia_metodo",e.target.value)}>{METODOS.map(m=><option key={m} value={m.toLowerCase()}>{m}</option>)}</Sel></Field>
          </div>
          {+form.pago_senia>0&&totalConIva>0&&<div style={{marginTop:6,padding:"7px 12px",background:"#0a1828",borderRadius:7,fontSize:12,color:"#5a8ab8"}}>
            Resta después de seña: <span style={{color:"#FFB74D",fontWeight:700}}>${Math.max(0,totalConIva-(+form.pago_senia)).toLocaleString("es-AR")}</span>
          </div>}
        </div>
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #A5D6A720",marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:"#A5D6A7",textTransform:"uppercase",marginBottom:12}}>✅ Pago Final / Saldo</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Field label="Monto cobrado ($)"><Input type="number" value={form.pago_total||""} onChange={e=>set("pago_total",e.target.value)} placeholder="0"/></Field>
            <Field label="Fecha de cobro"><Input type="date" value={form.pago_total_fecha||""} onChange={e=>set("pago_total_fecha",e.target.value)}/></Field>
            <Field label="Forma de pago"><Sel value={form.pago_total_metodo||"efectivo"} onChange={e=>set("pago_total_metodo",e.target.value)}>{METODOS.map(m=><option key={m} value={m.toLowerCase()}>{m}</option>)}</Sel></Field>
          </div>
        </div>
        {(()=>{
          const cobrado=(+form.pago_senia||0)+(+form.pago_total||0);
          const pct=totalConIva>0?Math.min(100,Math.round((cobrado/totalConIva)*100)):0;
          const resta=Math.max(0,totalConIva-cobrado);
          const col=pct>=100?"linear-gradient(90deg,#26A69A,#4CAF50)":pct>0?"linear-gradient(90deg,#1565C0,#FFB74D)":"#1e3a5a";
          return totalConIva>0?(
            <div style={{background:"#071220",borderRadius:10,padding:"12px 16px",border:"1px solid #1e3a5a",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <span style={{fontSize:13,color:"#5a8ab8",fontWeight:600}}>Estado de cobro</span>
                <span style={{fontSize:13,fontWeight:700,color:pct>=100?"#26A69A":pct>0?"#64B5F6":"#3a6a9a"}}>{pct}% cobrado{resta>0?` · Resta $${resta.toLocaleString("es-AR")}`:""}</span>
              </div>
              <div style={{height:10,background:"#0a1828",borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:99,background:col,width:pct+"%",transition:"width 0.4s"}}/>
              </div>
              {pct>=100&&<div style={{marginTop:8,fontSize:12,color:"#26A69A",fontWeight:600,textAlign:"center"}}>✅ Orden cobrada en su totalidad</div>}
            </div>
          ):null;
        })()}
        <Field label="Notas de pagos"><Textarea value={form.pago_notas||""} onChange={e=>set("pago_notas",e.target.value)} placeholder="Referencias de transferencia, cheques, observaciones..."/></Field>
      </div>}

      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16,paddingTop:14,borderTop:"1px solid #1e3a5a"}}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={()=>onSave(form)}><Icon name="plus" size={16}/> {orden?"Guardar Cambios":"Crear Orden"}</Btn>
      </div>
    </div>
  );
};

// ─── PROCESS MANAGER ─────────────────────────────────────────────────────────
const ProcessManager = ({estados,onSave,onClose}) => {
  const [list,setList]=useState(estados.map(e=>({...e})));
  const [newLabel,setNewLabel]=useState("");
  const [newColor,setNewColor]=useState("#64B5F6");
  const [dragIdx,setDragIdx]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const add=()=>{if(!newLabel.trim())return;setList(l=>[...l,{id:"proc_"+newId(),label:newLabel.trim(),color:newColor,bg:newColor+"22"}]);setNewLabel("");};
  const remove=(id)=>setList(l=>l.filter(x=>x.id!==id));
  const upLabel=(id,v)=>setList(l=>l.map(x=>x.id===id?{...x,label:v}:x));
  const upColor=(id,v)=>setList(l=>l.map(x=>x.id===id?{...x,color:v,bg:v+"22"}:x));
  const onDrop=(i)=>{if(dragIdx===null||dragIdx===i)return;const l=[...list];const[item]=l.splice(dragIdx,1);l.splice(i,0,item);setList(l);setDragIdx(null);setDragOver(null);};
  return(
    <div>
      <p style={{color:"#5a8ab8",fontSize:13,margin:"0 0 16px"}}>Administrá los procesos del tablero. Podés agregar, renombrar, cambiar color y reordenar arrastrando.</p>
      <div style={{marginBottom:14}}>
        {list.map((e,i)=>(
          <div key={e.id} draggable onDragStart={()=>setDragIdx(i)} onDragOver={ev=>{ev.preventDefault();setDragOver(i);}} onDrop={()=>onDrop(i)} onDragLeave={()=>setDragOver(null)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:dragOver===i?"#0f2a1a":"#071220",borderRadius:8,border:"1px solid #0f2035",marginBottom:6,cursor:"grab",transition:"background 0.15s"}}>
            <span style={{color:"#2a4a6a"}}><Icon name="grip" size={14}/></span>
            <div style={{width:10,height:10,borderRadius:"50%",background:e.color,flexShrink:0}}/>
            <input value={e.label} onChange={ev=>upLabel(e.id,ev.target.value)} style={{...iS,padding:"5px 9px",fontSize:13,flex:1}}/>
            <input type="color" value={e.color} onChange={ev=>upColor(e.id,ev.target.value)} style={{width:28,height:28,border:"none",borderRadius:4,cursor:"pointer",background:"none",padding:0,flexShrink:0}}/>
            <button onClick={()=>remove(e.id)} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4}}><Icon name="trash" size={14}/></button>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,padding:14,background:"#071220",borderRadius:10,border:"1px dashed #1e3a5a",marginBottom:14}}>
        <Input value={newLabel} onChange={e=>setNewLabel(e.target.value)} placeholder="Nombre del nuevo proceso..." onKeyDown={e=>e.key==="Enter"&&add()}/>
        <input type="color" value={newColor} onChange={e=>setNewColor(e.target.value)} style={{width:42,height:42,border:"none",borderRadius:8,cursor:"pointer",background:"none",padding:0,flexShrink:0}}/>
        <Btn onClick={add} style={{flexShrink:0}}><Icon name="plus" size={16}/> Agregar</Btn>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn variant="success" onClick={()=>onSave(list)}><Icon name="refresh" size={16}/> Guardar Cambios</Btn>
      </div>
    </div>
  );
};

// ─── OPTIMIZER ────────────────────────────────────────────────────────────────
const Optimizer = () => {
  const [hoja,setHoja]=useState({ancho:3600,alto:2500});
  const [cortes,setCortes]=useState([{id:1,ancho:"",alto:"",cantidad:1,label:""}]);
  const [resultado,setResultado]=useState(null);
  const [loading,setLoading]=useState(false);
  const addCorte=()=>setCortes(c=>[...c,{id:Date.now(),ancho:"",alto:"",cantidad:1,label:""}]);
  const removeCorte=(id)=>setCortes(c=>c.filter(x=>x.id!==id));
  const upCorte=(id,k,v)=>setCortes(c=>c.map(x=>x.id===id?{...x,[k]:v}:x));
  const optimizar=()=>{
    const valid=cortes.filter(c=>c.ancho&&c.alto&&c.cantidad>0);
    if(!valid.length)return;
    setLoading(true);setResultado(null);
    const items=[];
    valid.forEach(c=>{for(let i=0;i<parseInt(c.cantidad);i++)items.push({w:parseFloat(c.ancho),h:parseFloat(c.alto),label:c.label||`${c.ancho}×${c.alto}`,id:`${c.id}-${i}`});});
    items.sort((a,b)=>(b.w*b.h)-(a.w*a.h));
    const sheets=[],unplaced=[];
    const tryPlace=(si,fr,item)=>{
      for(const[w,h,rotated] of[[item.w,item.h,false],[item.h,item.w,true]]){
        for(let i=0;i<fr.length;i++){
          const r=fr[i];
          if(w<=r.w&&h<=r.h){
            si.push({...item,x:r.x,y:r.y,pw:w,ph:h,rotated});
            const nr=[];
            for(let j=0;j<fr.length;j++){if(j===i){if(r.w-w>0)nr.push({x:r.x+w,y:r.y,w:r.w-w,h});if(r.h-h>0)nr.push({x:r.x,y:r.y+h,w:r.w,h:r.h-h});}else nr.push(fr[j]);}
            return nr;
          }
        }
      }
      return null;
    };
    let rem=[...items];
    while(rem.length>0){
      const si=[];let fr=[{x:0,y:0,w:hoja.ancho,h:hoja.alto}],still=[];
      for(const item of rem){const nf=tryPlace(si,fr,item);if(nf)fr=nf;else still.push(item);}
      sheets.push(si);
      if(still.length===rem.length){unplaced.push(...rem);break;}
      rem=still;
    }
    const totalArea=hoja.ancho*hoja.alto*sheets.length;
    const usedArea=items.filter(i=>!unplaced.find(u=>u.id===i.id)).reduce((s,i)=>s+i.w*i.h,0);
    const apr=Math.round((usedArea/totalArea)*100);
    setTimeout(()=>{setResultado({sheets,unplaced,aprovechamiento:apr,totalHojas:sheets.length});setLoading(false);},500);
  };
  const COLORS=["#1565C0","#0277BD","#00838F","#00695C","#2E7D32","#558B2F","#F57F17","#E65100","#AD1457","#6A1B9A"];
  const renderSheet=(sheet,idx)=>{
    const sc=250/Math.max(hoja.ancho,hoja.alto);
    const W=hoja.ancho*sc,H=hoja.alto*sc;
    const ul=[...new Set(sheet.map(i=>i.label))];
    return(
      <div key={idx} style={{background:"#071220",borderRadius:12,padding:12,border:"1px solid #1e3a5a"}}>
        <div style={{color:"#5a8ab8",fontSize:11,fontWeight:600,marginBottom:7,textTransform:"uppercase"}}>Hoja #{idx+1} — {hoja.ancho}×{hoja.alto}mm</div>
        <svg width={W} height={H} style={{display:"block",border:"1px solid #1e3a5a",borderRadius:4,background:"#0a1520"}}>
          {sheet.map((item,i)=>{
            const ci=ul.indexOf(item.label)%COLORS.length;
            const pw=item.pw*sc, ph=item.ph*sc;
            const cx=item.x*sc+pw/2, cy=item.y*sc+ph/2;
            const fs=Math.max(6,Math.min(9,pw/10));
            const dimW=item.rotated?item.h:item.w;
            const dimH=item.rotated?item.w:item.h;
            const showLabel=pw>32&&ph>16;
            const showDims=pw>44&&ph>28;
            return(
              <g key={i}>
                <rect x={item.x*sc} y={item.y*sc} width={pw} height={ph} fill={COLORS[ci]+"28"} stroke={COLORS[ci]} strokeWidth="1.5" rx="2"/>
                {showLabel&&<text x={cx} y={showDims?cy-fs*0.8:cy} textAnchor="middle" dominantBaseline="middle" fontSize={fs} fill={COLORS[ci]} fontWeight="700">{item.label}{item.rotated?" ↺":""}</text>}
                {showDims&&<text x={cx} y={cy+fs*1.1} textAnchor="middle" dominantBaseline="middle" fontSize={fs*0.9} fill={COLORS[ci]+"cc"} fontWeight="500">{dimW}×{dimH}mm</text>}
              </g>
            );
          })}
        </svg>
        <div style={{fontSize:11,color:"#5a8ab8",marginTop:5}}>{sheet.length} piezas</div>
      </div>
    );
  };
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <h1 style={{margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:24,color:"#e2f0ff"}}>Optimizador de Cortes</h1>
          <p style={{margin:0,color:"#3a6a9a",fontSize:13}}>Calculá cómo cortar la hoja para aprovecharla al máximo.</p>
        </div>
        {resultado&&<Btn variant="secondary" onClick={()=>printOptimizacion(resultado.sheets,hoja,cortes,resultado.aprovechamiento)}><Icon name="pdf" size={16}/> Generar PDF</Btn>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <div>
          <div style={{background:"#071220",borderRadius:12,padding:14,border:"1px solid #1e3a5a",marginBottom:12}}>
            <div style={{color:"#5a8ab8",fontSize:11,fontWeight:600,marginBottom:12,textTransform:"uppercase"}}>Tamaño de Hoja (mm)</div>
            <div style={{display:"flex",gap:12}}>
              <Field label="Ancho"><Input type="number" value={hoja.ancho} onChange={e=>setHoja(h=>({...h,ancho:+e.target.value}))}/></Field>
              <Field label="Alto"><Input type="number" value={hoja.alto} onChange={e=>setHoja(h=>({...h,alto:+e.target.value}))}/></Field>
            </div>
          </div>
          <div style={{background:"#071220",borderRadius:12,padding:14,border:"1px solid #1e3a5a",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{color:"#5a8ab8",fontSize:11,fontWeight:600,textTransform:"uppercase"}}>Piezas a Cortar</div>
              <Btn small onClick={addCorte}><Icon name="plus" size={14}/> Agregar</Btn>
            </div>
            {cortes.map((c,i)=>(
              <div key={c.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 55px 1fr 26px",gap:7,marginBottom:7,alignItems:"end"}}>
                <Field label={i===0?"Ancho":""}><Input type="number" value={c.ancho} onChange={e=>upCorte(c.id,"ancho",e.target.value)} placeholder="mm"/></Field>
                <Field label={i===0?"Alto":""}><Input type="number" value={c.alto} onChange={e=>upCorte(c.id,"alto",e.target.value)} placeholder="mm"/></Field>
                <Field label={i===0?"Cant.":""}><Input type="number" value={c.cantidad} min="1" onChange={e=>upCorte(c.id,"cantidad",e.target.value)}/></Field>
                <Field label={i===0?"Etiqueta":""}><Input value={c.label} onChange={e=>upCorte(c.id,"label",e.target.value)} placeholder="Ej: Baño 1"/></Field>
                <button onClick={()=>removeCorte(c.id)} disabled={cortes.length===1} style={{background:"none",border:"none",color:"#f48fb1",cursor:"pointer",padding:"10px 2px",opacity:cortes.length===1?0.3:1}}><Icon name="trash" size={13}/></button>
              </div>
            ))}
          </div>
          <Btn onClick={optimizar} style={{width:"100%",justifyContent:"center"}}>
            {loading?<><Icon name="refresh" size={16}/> Calculando...</>:<><Icon name="optimize" size={16}/> Optimizar Cortes</>}
          </Btn>
        </div>
        <div>
          {resultado&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
                {[{label:"Hojas",val:resultado.totalHojas,color:"#64B5F6"},{label:"Aprovechamiento",val:resultado.aprovechamiento+"%",color:resultado.aprovechamiento>75?"#A5D6A7":resultado.aprovechamiento>50?"#FFB74D":"#F48FB1"},{label:"Sin colocar",val:resultado.unplaced.length,color:resultado.unplaced.length>0?"#F48FB1":"#A5D6A7"}].map(s=>(
                  <div key={s.label} style={{background:"#071220",borderRadius:10,padding:12,border:"1px solid #1e3a5a",textAlign:"center"}}>
                    <div style={{fontSize:22,fontWeight:800,color:s.color,fontFamily:"Georgia,serif"}}>{s.val}</div>
                    <div style={{fontSize:11,color:"#5a8ab8",marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:460,overflowY:"auto"}}>
                {resultado.sheets.map((s,i)=>renderSheet(s,i))}
              </div>
              {resultado.unplaced.length>0&&<div style={{marginTop:10,background:"#2a0a0a",borderRadius:10,padding:12,border:"1px solid #7f2020"}}><div style={{color:"#f48fb1",fontSize:12,fontWeight:600,marginBottom:4}}>⚠️ No entraron:</div>{resultado.unplaced.map((p,i)=><div key={i} style={{color:"#f48fb180",fontSize:12}}>{p.label} ({p.w}×{p.h}cm)</div>)}</div>}
            </div>
          )}
          {!resultado&&!loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:260,color:"#2a4a6a",textAlign:"center"}}><Icon name="optimize" size={44}/><p style={{marginTop:14,fontSize:13}}>Ingresá las medidas y presioná<br/>Optimizar para ver el plan de cortes</p></div>}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(()=>{
    try { const s=sessionStorage.getItem("vidrierapp_user"); return s?JSON.parse(s):null; } catch{ return null; }
  });

  const handleLogin = (user) => setCurrentUser(user);
  const handleLogout = () => { sessionStorage.removeItem("vidrierapp_user"); setCurrentUser(null); };

  if(!currentUser) return <LoginScreen onLogin={handleLogin}/>;

  return <AppInner currentUser={currentUser} onLogout={handleLogout}/>;
}

function AppInner({ currentUser, onLogout }) {
  const [nav,setNav]=useState("home");
  const [ordenes,setOrdenes]=useState([]);
  const [clientes,setClientes]=useState([]);
  const [plantillas,setPlantillas]=useState(PLANTILLAS_DEFAULT);
  const [estados,setEstados]=useState(ESTADOS_DEFAULT);
  const [cotizaciones,setCotizaciones]=useState([]);
  const [stock,setStock]=useState([]);
  const [modal,setModal]=useState(null);
  const [search,setSearch]=useState("");
  const [filterEstado,setFilterEstado]=useState("all");
  const [loading,setLoading]=useState(true);
  const [online,setOnline]=useState(true);

  // ── FIREBASE SUBSCRIPTIONS (realtime) ──────────────────────────────────────
  useEffect(()=>{
    const unsubs = [];
    // Set loading false after 3 seconds max regardless
    const timeout = setTimeout(()=>setLoading(false), 3000);

    unsubs.push(fsSub("ordenes", docs => { setOrdenes(docs.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""))); }));
    unsubs.push(fsSub("clientes", docs => { setClientes(docs.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""))); }));
    unsubs.push(fsSub("cotizaciones", docs => { setCotizaciones(docs.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""))); }));
    unsubs.push(fsSub("stock_items", docs => { setStock(docs); }));
    unsubs.push(fsCfgSub("plantillas", val => { if(val) setPlantillas(val); }));
    unsubs.push(fsCfgSub("estados", val => { if(val) setEstados(val); }));

    // Mark as loaded once we get first response from any collection
    const firstLoad = onSnapshot(collection(db, "ordenes"), ()=>{ setLoading(false); clearTimeout(timeout); }, ()=>{ setLoading(false); clearTimeout(timeout); });

    // Connection indicator
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      unsubs.forEach(u=>u());
      firstLoad();
      clearTimeout(timeout);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ── DATA OPERATIONS ────────────────────────────────────────────────────────
  const saveOrden = async (form) => {
    const id = form.id || newId();
    const numero = form.numero || newOrderNum(ordenes);
    const data = { ...form, id, numero, createdAt: form.createdAt||new Date().toISOString() };
    await fsSet("ordenes", id, data);
    setModal(null);
  };
  const deleteOrden = (id) => fsDel("ordenes", id);
  const getCliente = (id) => clientes.find(c=>c.id===id);
  const getNombre = (id) => getCliente(id)?.nombre||"Sin cliente";

  const savePlantilla = async (p) => {
    const current = [...plantillas];
    const idx = current.findIndex(x=>x.id===p.id);
    const updated = idx>=0 ? current.map(x=>x.id===p.id?p:x) : [...current,p];
    await fsCfgSet("plantillas", updated);
    setModal(null);
  };
  const deletePlantilla = async (id) => {
    const updated = plantillas.filter(x=>x.id!==id);
    await fsCfgSet("plantillas", updated);
  };

  const saveCliente = async (form) => {
    const id = form.id || newId();
    await fsSet("clientes", id, { ...form, id, createdAt: form.createdAt||new Date().toISOString() });
    setModal(null);
  };
  const deleteCliente = (id) => fsDel("clientes", id);

  const filtered=ordenes.filter(o=>{
    const ms=!search||(o.titulo||"").toLowerCase().includes(search.toLowerCase())||getNombre(o.cliente).toLowerCase().includes(search.toLowerCase())||(o.numero||"").toLowerCase().includes(search.toLowerCase());
    return ms&&(filterEstado==="all"||o.estado===filterEstado);
  });

  // ── LOADING SCREEN ────────────────────────────────────────────────────────
  if(loading) return(
    <div style={{minHeight:"100vh",background:"#060f1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <div style={{width:48,height:48,background:"linear-gradient(135deg,#1565C0,#0d47a1)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Icon name="glass" size={28} color="#fff"/>
      </div>
      <div style={{color:"#e2f0ff",fontSize:20,fontWeight:700,fontFamily:"Georgia,serif"}}>VidrierApp</div>
      <div style={{color:"#3a6a9a",fontSize:13}}>Conectando con La Vidriería Rosario...</div>
      <div style={{display:"flex",gap:6,marginTop:4}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#1565C0",animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`}}/>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
    </div>
  );

  const navItems=[
    {id:"home",label:"Inicio",icon:"home"},
    {id:"cotizaciones",label:"Cotizaciones",icon:"pdf"},
    {id:"ordenes",label:"Órdenes",icon:"orders"},
    {id:"tablero",label:"Tablero",icon:"board"},
    {id:"clientes",label:"Clientes",icon:"clients"},
    {id:"stock",label:"Stock",icon:"glass"},
    {id:"optimize",label:"Optimización",icon:"optimize"},
  ];

  const Sidebar=()=>(
    <div style={{width:218,background:"#071220",borderRight:"1px solid #0f2035",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",flexShrink:0}}>
      <div style={{padding:"22px 20px 18px",borderBottom:"1px solid #0f2035"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:"linear-gradient(135deg,#1565C0,#0d47a1)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="glass" size={20}/></div>
          <div><div style={{fontWeight:800,fontSize:15,color:"#e2f0ff",fontFamily:"Georgia,serif",lineHeight:1.1}}>VidrierApp</div><div style={{fontSize:10,color:"#3a6a9a",letterSpacing:"1px",textTransform:"uppercase"}}>La Vidriería Rosario</div></div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 10px",overflowY:"auto"}}>
        {navItems.map(item=>(
          <button key={item.id} onClick={()=>setNav(item.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",background:nav===item.id?"#1565C018":"transparent",color:nav===item.id?"#64B5F6":"#4a7aa8",borderLeft:nav===item.id?"2px solid #1565C0":"2px solid transparent",marginBottom:2,fontSize:14,fontWeight:nav===item.id?600:400,fontFamily:"inherit"}}>
            <Icon name={item.icon} size={16}/>{item.label}
            {item.id==="ordenes"&&ordenes.length>0&&<span style={{marginLeft:"auto",background:"#1565C0",color:"#fff",borderRadius:99,fontSize:10,padding:"1px 7px",fontWeight:700}}>{ordenes.length}</span>}
            {item.id==="cotizaciones"&&cotizaciones.length>0&&<span style={{marginLeft:"auto",background:"#FFB74D",color:"#1a0a00",borderRadius:99,fontSize:10,padding:"1px 7px",fontWeight:700}}>{cotizaciones.length}</span>}
            {item.id==="stock"&&stock.filter(i=>i.stock<=i.minimo).length>0&&<span style={{marginLeft:"auto",background:"#e65100",color:"#fff",borderRadius:99,fontSize:10,padding:"1px 7px",fontWeight:700}}>⚠</span>}
          </button>
        ))}
      </nav>
      <div style={{padding:"14px 18px",borderTop:"1px solid #0f2035",display:"flex",flexDirection:"column",gap:6}}>
        <Btn small style={{width:"100%",justifyContent:"center"}} onClick={()=>setModal({type:"nueva_cotizacion"})}><Icon name="pdf" size={14}/> Nueva Cotización</Btn>
        <Btn small style={{width:"100%",justifyContent:"center"}} onClick={()=>setModal({type:"nueva_orden"})}><Icon name="plus" size={14}/> Nueva Orden</Btn>
        <div style={{marginTop:4,padding:"8px 10px",background:"#071220",borderRadius:8,border:"1px solid #0f2035"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:currentUser.color+"30",border:`1px solid ${currentUser.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:currentUser.color}}>
                {currentUser.nombre[0].toUpperCase()}
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#c8e0f8"}}>{currentUser.nombre}</div>
                <div style={{fontSize:10,color:"#3a6a9a",textTransform:"capitalize"}}>{currentUser.rol}</div>
              </div>
            </div>
            <button onClick={onLogout} title="Cerrar sesión" style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",padding:4,borderRadius:6,display:"flex"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:6}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:online?"#26A69A":"#F48FB1"}}/>
            <span style={{fontSize:10,color:online?"#26A69A":"#F48FB1"}}>{online?"En línea":"Sin conexión"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const Home=()=>{
    const activas=ordenes.filter(o=>!["entregado","cobrado"].includes(o.estado));
    const ingresos=ordenes.filter(o=>o.estado==="cobrado").reduce((s,o)=>s+(+o.monto||0),0);
    const cotPendientes=cotizaciones.filter(c=>c.estado==="pendiente"||c.estado==="enviada");
    const stockBajo=stock.filter(i=>i.stock<=i.minimo);
    return(
      <div>
        <div style={{marginBottom:26}}>
          <h1 style={{margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#e2f0ff"}}>Panel Central</h1>
          <p style={{margin:0,color:"#3a6a9a",fontSize:13}}>{new Date().toLocaleDateString("es-AR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
          {[
            {label:"Órdenes activas",val:activas.length,color:"#64B5F6",sub:"en proceso",click:()=>setNav("ordenes")},
            {label:"Cotizaciones activas",val:cotPendientes.length,color:"#FFB74D",sub:"pendientes/enviadas",click:()=>setNav("cotizaciones")},
            {label:"Cobrado total",val:"$"+ingresos.toLocaleString("es-AR"),color:"#A5D6A7",sub:"acumulado",click:null},
          ].map(s=>(
            <div key={s.label} onClick={s.click||undefined} style={{background:"#071220",borderRadius:12,padding:"16px 18px",border:"1px solid #0f2035",position:"relative",overflow:"hidden",cursor:s.click?"pointer":"default"}}>
              <div style={{position:"absolute",top:-10,right:-10,width:55,height:55,background:s.color+"08",borderRadius:"50%"}}/>
              <div style={{fontSize:26,fontWeight:800,color:s.color,fontFamily:"Georgia,serif"}}>{s.val}</div>
              <div style={{fontSize:13,fontWeight:600,color:"#c8e0f8",marginTop:2}}>{s.label}</div>
              <div style={{fontSize:11,color:"#3a6a9a",marginTop:2}}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
          {[
            {label:"Clientes",val:clientes.length,color:"#CE93D8",sub:"en base",click:()=>setNav("clientes")},
            {label:"Productos en stock",val:stock.length,color:"#80CBC4",sub:`${stockBajo.length} con stock bajo`,click:()=>setNav("stock")},
            {label:"Total órdenes",val:ordenes.length,color:"#5a8ab8",sub:"historial completo",click:null},
          ].map(s=>(
            <div key={s.label} onClick={s.click||undefined} style={{background:"#071220",borderRadius:12,padding:"16px 18px",border:`1px solid ${s.label==="Productos en stock"&&stockBajo.length>0?"#FFB74D20":"#0f2035"}`,position:"relative",overflow:"hidden",cursor:s.click?"pointer":"default"}}>
              <div style={{fontSize:26,fontWeight:800,color:s.color,fontFamily:"Georgia,serif"}}>{s.val}</div>
              <div style={{fontSize:13,fontWeight:600,color:"#c8e0f8",marginTop:2}}>{s.label}</div>
              <div style={{fontSize:11,color:s.label==="Productos en stock"&&stockBajo.length>0?"#FFB74D":"#3a6a9a",marginTop:2}}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
          <div style={{background:"#071220",borderRadius:12,padding:18,border:"1px solid #0f2035"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#e2f0ff"}}>Últimas Órdenes</h3>
              <button onClick={()=>setNav("ordenes")} style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",fontSize:12}}>Ver todas →</button>
            </div>
            {ordenes.slice(0,5).map(o=>(
              <div key={o.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #0f2035"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,color:"#1565C0",fontWeight:700,fontFamily:"monospace"}}>{o.numero}</span><span style={{fontSize:13,fontWeight:600,color:"#c8e0f8"}}>{o.titulo||"Sin título"}</span></div>
                  <div style={{fontSize:11,color:"#3a6a9a"}}>{getNombre(o.cliente)}</div>
                </div>
                <Badge estado={o.estado} estados={estados}/>
              </div>
            ))}
            {!ordenes.length&&<div style={{color:"#2a4a6a",fontSize:13,padding:"18px 0",textAlign:"center"}}>No hay órdenes aún</div>}
          </div>
          <div style={{background:"#071220",borderRadius:12,padding:18,border:"1px solid #0f2035"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#e2f0ff"}}>Últimas Cotizaciones</h3>
              <button onClick={()=>setNav("cotizaciones")} style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",fontSize:12}}>Ver todas →</button>
            </div>
            {cotizaciones.slice(0,5).map(c=>{
              const ECOL={pendiente:"#FFB74D",enviada:"#64B5F6",aprobada:"#A5D6A7",rechazada:"#F48FB1",convertida:"#26A69A"};
              return(
                <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #0f2035"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,color:"#FFB74D",fontWeight:700,fontFamily:"monospace"}}>{c.numero}</span><span style={{fontSize:13,fontWeight:600,color:"#c8e0f8"}}>{c.titulo||"Sin título"}</span></div>
                    <div style={{fontSize:11,color:"#3a6a9a"}}>{getNombre(c.cliente)}</div>
                  </div>
                  <span style={{fontSize:11,fontWeight:600,color:ECOL[c.estado]||"#FFB74D"}}>{c.estado}</span>
                </div>
              );
            })}
            {!cotizaciones.length&&<div style={{color:"#2a4a6a",fontSize:13,padding:"18px 0",textAlign:"center"}}>No hay cotizaciones aún</div>}
          </div>
        </div>
        {stockBajo.length>0&&<div style={{marginTop:16,background:"#2a1a0a",border:"1px solid #FFB74D30",borderRadius:12,padding:"12px 18px"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#FFB74D",marginBottom:6}}>⚠ Productos con stock bajo</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{stockBajo.map(i=><span key={i.id} style={{background:"#1a0f00",border:"1px solid #FFB74D30",color:"#FFB74D",padding:"3px 10px",borderRadius:99,fontSize:12}}>{i.nombre}: {i.stock} {i.unidad||"u."}</span>)}</div>
        </div>}
      </div>
    );
  };

  const OrdenesList=()=>(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
        <div><h1 style={{margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:24,color:"#e2f0ff"}}>Órdenes de Trabajo</h1><p style={{margin:0,color:"#3a6a9a",fontSize:13}}>{ordenes.length} órdenes en total</p></div>
        <div style={{display:"flex",gap:9}}>
          <Btn variant="secondary" small onClick={()=>setModal({type:"gestionar_plantillas"})}><Icon name="template" size={14}/> Plantillas</Btn>
          <Btn small onClick={()=>setModal({type:"nueva_orden"})}><Icon name="plus" size={14}/> Nueva Orden</Btn>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:12}}>
        <div style={{flex:1,position:"relative"}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#3a6a9a"}}><Icon name="search" size={16}/></div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por número OT, título o cliente..." style={{...iS,paddingLeft:36}}/>
        </div>
        <Sel value={filterEstado} onChange={e=>setFilterEstado(e.target.value)} style={{width:200}}>
          <option value="all">Todos los estados</option>
          {estados.map(e=><option key={e.id} value={e.id}>{e.label}</option>)}
        </Sel>
      </div>
      <div style={{display:"grid",gap:7}}>
        {filtered.map(o=>(
          <div key={o.id} style={{background:"#071220",borderRadius:11,padding:"12px 14px",border:"1px solid #0f2035",display:"flex",alignItems:"center",gap:12}}>
            <div style={{background:"#0a1828",border:"1px solid #1565C025",borderRadius:7,padding:"4px 10px",minWidth:95,textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:11,fontWeight:800,color:"#1565C0",fontFamily:"monospace",letterSpacing:"0.5px"}}>{o.numero||"—"}</div>
              <div style={{fontSize:10,color:"#3a6a9a"}}>{o.fecha}</div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                <span style={{fontSize:14,fontWeight:600,color:"#e2f0ff"}}>{o.titulo||"Sin título"}</span>
                {o.tipo&&<span style={{fontSize:11,color:"#3a6a9a",background:"#0f2035",padding:"1px 7px",borderRadius:99}}>{o.tipo}</span>}
              </div>
              <div style={{fontSize:12,color:"#3a6a9a",marginBottom:+o.monto>0?5:0}}>{getNombre(o.cliente)}{o.monto?` · $${(+o.monto).toLocaleString("es-AR")}`:""}</div>
              {+o.monto>0&&(()=>{
                const pct=Math.min(100,Math.round(((+o.monto_abonado||0)/(+o.monto))*100));
                const barColor=pct>=100?"linear-gradient(90deg,#26A69A,#4CAF50)":pct>0?"linear-gradient(90deg,#1565C0,#42A5F5)":"#1e3a5a";
                const textColor=pct>=100?"#26A69A":pct>0?"#64B5F6":"#3a6a9a";
                return(
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{flex:1,height:5,background:"#0a1828",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:99,background:barColor,width:pct+"%"}}/>
                    </div>
                    <span style={{fontSize:10,fontWeight:700,color:textColor,whiteSpace:"nowrap",minWidth:28}}>{pct}%</span>
                  </div>
                );
              })()}
            </div>
            <Badge estado={o.estado} estados={estados}/>
            <div style={{display:"flex",gap:3}}>
              <button title="Generar PDF" onClick={()=>printOrden(o,getNombre(o.cliente),plantillas.find(p=>p.id===o.plantilla_id),estados)} style={{background:"none",border:"none",color:"#26A69A",cursor:"pointer",padding:6,borderRadius:6,display:"flex"}}><Icon name="pdf" size={15}/></button>
              <button onClick={()=>setModal({type:"editar_orden",data:o})} style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",padding:6,borderRadius:6,display:"flex"}}><Icon name="edit" size={15}/></button>
              <button onClick={()=>deleteOrden(o.id)} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:6,borderRadius:6,display:"flex"}}><Icon name="trash" size={15}/></button>
            </div>
          </div>
        ))}
        {!filtered.length&&<div style={{textAlign:"center",padding:"44px 0",color:"#2a4a6a"}}><Icon name="orders" size={40}/><p style={{marginTop:12,fontSize:14}}>No hay órdenes que coincidan</p><Btn small onClick={()=>setModal({type:"nueva_orden"})} style={{marginTop:8}}><Icon name="plus" size={14}/> Crear primera orden</Btn></div>}
      </div>
    </div>
  );

  const Tablero=()=>{
    const [dragId,setDragId]=useState(null);
    const [dragOver,setDragOver]=useState(null);
    const onDrop=async(estadoId)=>{
      if(dragId){
        const orden=ordenes.find(x=>x.id===dragId);
        if(orden) await fsSet("ordenes",dragId,{...orden,estado:estadoId});
      }
      setDragId(null);setDragOver(null);
    };
    return(
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h1 style={{margin:0,fontFamily:"Georgia,serif",fontSize:24,color:"#e2f0ff"}}>Tablero de Producción</h1>
          <Btn variant="secondary" small onClick={()=>setModal({type:"gestionar_estados"})}><Icon name="settings" size={14}/> Gestionar Procesos</Btn>
        </div>
        <div style={{display:"flex",gap:9,overflowX:"auto",paddingBottom:14}}>
          {estados.map(estado=>{
            const cols=ordenes.filter(o=>o.estado===estado.id);
            return(
              <div key={estado.id} onDragOver={e=>{e.preventDefault();setDragOver(estado.id);}} onDrop={()=>onDrop(estado.id)} onDragLeave={()=>setDragOver(null)}
                style={{minWidth:185,background:dragOver===estado.id?estado.color+"10":"#071220",borderRadius:12,border:`1px solid ${estado.color}${dragOver===estado.id?"60":"18"}`,padding:"11px 9px",flexShrink:0,transition:"all 0.15s"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9,padding:"0 3px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:estado.color,textTransform:"uppercase",letterSpacing:"0.5px",lineHeight:1.3}}>{estado.label}</div>
                  <span style={{background:estado.color+"20",color:estado.color,borderRadius:99,fontSize:10,padding:"1px 6px",fontWeight:700}}>{cols.length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,minHeight:50}}>
                  {cols.map(o=>(
                    <div key={o.id} draggable onDragStart={()=>setDragId(o.id)}
                      style={{background:"#0a1828",borderRadius:8,padding:"8px 10px",border:"1px solid #0f2035",cursor:"grab",borderLeft:`3px solid ${estado.color}`}}>
                      <div style={{fontSize:9,color:estado.color,fontWeight:700,fontFamily:"monospace",marginBottom:2}}>{o.numero}</div>
                      <div style={{fontSize:12,fontWeight:600,color:"#c8e0f8",marginBottom:2,lineHeight:1.3}}>{o.titulo||"Sin título"}</div>
                      <div style={{fontSize:10,color:"#3a6a9a"}}>{getNombre(o.cliente)}</div>
                      {+o.monto>0&&(()=>{
                        const pct=Math.min(100,Math.round(((+o.monto_abonado||0)/(+o.monto))*100));
                        const barColor=pct>=100?"linear-gradient(90deg,#26A69A,#4CAF50)":pct>0?"linear-gradient(90deg,#1565C0,#42A5F5)":"#1e3a5a";
                        return(
                          <div style={{marginTop:5}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                              <span style={{fontSize:9,color:"#3a6a9a"}}>{"$"+(+o.monto).toLocaleString("es-AR")}</span>
                              <span style={{fontSize:9,fontWeight:700,color:pct>=100?"#26A69A":pct>0?"#64B5F6":"#3a6a9a"}}>{pct}%</span>
                            </div>
                            <div style={{height:4,background:"#0a1828",borderRadius:99,overflow:"hidden"}}>
                              <div style={{height:"100%",borderRadius:99,background:barColor,width:pct+"%"}}/>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{color:"#2a4a6a",fontSize:12,marginTop:4}}>💡 Arrastrá las tarjetas para cambiar estado · "Gestionar Procesos" para agregar o editar columnas</p>
      </div>
    );
  };

  const ClienteForm=({cliente,onSave,onClose})=>{
    const [form,setForm]=useState(cliente||{nombre:"",tipo:"cliente",telefono:"",email:"",direccion:"",notas:""});
    const set=(k,v)=>setForm(f=>({...f,[k]:v}));
    return(
      <div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Nombre / Empresa"><Input value={form.nombre} onChange={e=>set("nombre",e.target.value)} placeholder="Nombre completo"/></Field>
          <Field label="Tipo"><Sel value={form.tipo} onChange={e=>set("tipo",e.target.value)}><option value="cliente">Cliente Particular</option><option value="arquitecto">Arquitecto</option><option value="obra">Obra / Constructora</option><option value="empresa">Empresa</option></Sel></Field>
          <Field label="Teléfono"><Input value={form.telefono} onChange={e=>set("telefono",e.target.value)} placeholder="+54 341..."/></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="email@..."/></Field>
          <div style={{gridColumn:"span 2"}}><Field label="Dirección"><Input value={form.direccion} onChange={e=>set("direccion",e.target.value)}/></Field></div>
          <div style={{gridColumn:"span 2"}}><Field label="Notas"><Textarea value={form.notas} onChange={e=>set("notas",e.target.value)}/></Field></div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
          <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={()=>onSave(form)}><Icon name="plus" size={16}/> {cliente?"Guardar":"Crear Cliente"}</Btn>
        </div>
      </div>
    );
  };

  const Clientes=()=>{
    const [selected,setSelected]=useState(null);
    const clienteOrdenes=selected?ordenes.filter(o=>o.cliente===selected.id):[];
    const TC={cliente:"#64B5F6",arquitecto:"#CE93D8",obra:"#FFB74D",empresa:"#80CBC4"};
    return(
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
          <h1 style={{margin:0,fontFamily:"Georgia,serif",fontSize:24,color:"#e2f0ff"}}>Clientes & Obras</h1>
          <Btn small onClick={()=>setModal({type:"nuevo_cliente"})}><Icon name="plus" size={14}/> Nuevo</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:selected?"320px 1fr":"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
          <div style={{display:"grid",gap:8,alignContent:"start"}}>
            {clientes.map(c=>(
              <div key={c.id} onClick={()=>setSelected(s=>s?.id===c.id?null:c)} style={{background:"#071220",borderRadius:11,padding:"13px 15px",border:`1px solid ${selected?.id===c.id?"#1565C040":"#0f2035"}`,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontWeight:600,fontSize:14,color:"#e2f0ff"}}>{c.nombre}</div><div style={{fontSize:11,marginTop:2}}><span style={{color:TC[c.tipo]||"#64B5F6",fontWeight:600}}>{c.tipo}</span>{c.telefono&&<span style={{color:"#3a6a9a"}}> · {c.telefono}</span>}</div></div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={e=>{e.stopPropagation();setModal({type:"editar_cliente",data:c});}} style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",padding:4,display:"flex"}}><Icon name="edit" size={14}/></button>
                    <button onClick={e=>{e.stopPropagation();deleteCliente(c.id);}} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,display:"flex"}}><Icon name="trash" size={14}/></button>
                  </div>
                </div>
              </div>
            ))}
            {!clientes.length&&<div style={{color:"#2a4a6a",fontSize:13,padding:20,textAlign:"center"}}>No hay clientes aún</div>}
          </div>
          {selected&&(
            <div style={{background:"#071220",borderRadius:12,padding:18,border:"1px solid #1565C025"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
                <div><h2 style={{margin:"0 0 3px",color:"#e2f0ff",fontFamily:"Georgia,serif"}}>{selected.nombre}</h2><span style={{fontSize:12,color:TC[selected.tipo]||"#64B5F6",fontWeight:600}}>{selected.tipo}</span></div>
                <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",display:"flex"}}><Icon name="close"/></button>
              </div>
              {selected.telefono&&<div style={{fontSize:13,color:"#5a8ab8",marginBottom:3}}>📞 {selected.telefono}</div>}
              {selected.email&&<div style={{fontSize:13,color:"#5a8ab8",marginBottom:3}}>✉️ {selected.email}</div>}
              {selected.direccion&&<div style={{fontSize:13,color:"#5a8ab8",marginBottom:3}}>📍 {selected.direccion}</div>}
              {selected.notas&&<div style={{fontSize:13,color:"#3a6a9a",marginTop:7,fontStyle:"italic"}}>{selected.notas}</div>}
              <div style={{marginTop:14,borderTop:"1px solid #0f2035",paddingTop:14}}>
                <div style={{fontSize:11,fontWeight:600,color:"#5a8ab8",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:9}}>Historial de Órdenes ({clienteOrdenes.length})</div>
                {clienteOrdenes.length?clienteOrdenes.map(o=>(
                  <div key={o.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #0f2035"}}>
                    <div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,color:"#1565C0",fontWeight:700,fontFamily:"monospace"}}>{o.numero}</span><span style={{fontSize:13,color:"#c8e0f8"}}>{o.titulo||"Sin título"}</span></div><div style={{fontSize:11,color:"#3a6a9a"}}>{o.fecha}{o.monto?` · $${(+o.monto).toLocaleString("es-AR")}`:""}</div></div>
                    <Badge estado={o.estado} estados={estados}/>
                  </div>
                )):<div style={{color:"#2a4a6a",fontSize:13}}>Sin órdenes previas</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const PlantillasManager=()=>(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <p style={{color:"#5a8ab8",fontSize:13,margin:0}}>Plantillas prediseñadas y personalizadas para crear órdenes rápidamente.</p>
        <Btn small onClick={()=>setModal({type:"nueva_plantilla"})}><Icon name="plus" size={14}/> Nueva</Btn>
      </div>
      {plantillas.map(p=>(
        <div key={p.id} style={{background:"#071220",borderRadius:10,padding:"11px 15px",border:"1px solid #0f2035",marginBottom:7}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:600,color:"#e2f0ff",fontSize:14,display:"flex",alignItems:"center",gap:8}}>{p.nombre}{p.esCustom&&<span style={{fontSize:10,background:"#1565C018",color:"#64B5F6",border:"1px solid #1565C035",padding:"1px 7px",borderRadius:99}}>★ Personalizada</span>}</div>
              <div style={{fontSize:12,color:"#3a6a9a"}}>{p.tipo||"Sin tipo"} · {p.campos.length} campos</div>
            </div>
            <div style={{display:"flex",gap:7}}>
              {p.esCustom&&<Btn small variant="secondary" onClick={()=>setModal({type:"editar_plantilla",data:p})}><Icon name="edit" size={13}/></Btn>}
              {p.esCustom&&<Btn small variant="danger" onClick={()=>deletePlantilla(p.id)}><Icon name="trash" size={13}/></Btn>}
              <Btn small onClick={()=>{setModal(null);setTimeout(()=>setModal({type:"nueva_orden",data:{plantilla_id:p.id}}),50);}}>Usar</Btn>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ── COTIZACIONES PAGE ────────────────────────────────────────────────────────
  const newCotNum=(list)=>{
    const yr=new Date().getFullYear().toString().slice(-2);
    const ex=list.filter(c=>c.numero?.startsWith(`PR-${yr}`));
    const max=ex.reduce((m,c)=>{const n=parseInt(c.numero?.split("-")[2]||0);return n>m?n:m;},0);
    return `PR-${yr}-${String(max+1).padStart(4,"0")}`;
  };

  const printCotizacion=(cot,clienteNombre)=>{
    const items=cot.items||[];
    const sub=items.reduce((s,i)=>s+(+i.precio*(+i.cant||1)),0);
    const iva=sub*0.21; const total=sub+iva;
    const rows=items.filter(i=>i.desc).map((i,idx)=>`<tr style="background:${idx%2===0?"#f8fbff":"#fff"}"><td style="padding:8px 12px;border-bottom:1px solid #e8f0ff">${i.desc}</td><td style="padding:8px 12px;border-bottom:1px solid #e8f0ff;text-align:center">${i.cant||1}</td><td style="padding:8px 12px;border-bottom:1px solid #e8f0ff;text-align:right">$${(+i.precio||0).toLocaleString("es-AR")}</td><td style="padding:8px 12px;border-bottom:1px solid #e8f0ff;text-align:right;font-weight:600">$${((+i.precio||0)*(+i.cant||1)).toLocaleString("es-AR")}</td></tr>`).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cotización ${cot.numero}</title>
<style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a2e;margin:0}
.hdr{background:linear-gradient(135deg,#0d47a1,#1565C0);color:#fff;padding:22px 32px;display:flex;justify-content:space-between;align-items:flex-start}
.body{padding:26px 32px}.st{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:4px;margin:18px 0 12px}
table{width:100%;border-collapse:collapse;font-size:13px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>
<div class="hdr">
  <div><div style="font-size:22px;font-weight:900">La Vidriería Rosario</div><div style="font-size:12px;opacity:0.75;margin-top:4px">Vidrios · Espejos · Cerramientos</div></div>
  <div style="text-align:right"><div style="font-size:12px;opacity:0.8">COTIZACIÓN</div><div style="font-size:28px;font-weight:900">${cot.numero}</div><div style="font-size:11px;opacity:0.7">Fecha: ${cot.fecha||""}</div>${cot.validez?`<div style="font-size:11px;opacity:0.7">Válida hasta: ${cot.validez}</div>`:""}</div>
</div>
<div class="body">
  <div class="st">Cliente</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4px">
    <div><span style="font-size:10px;color:#888;font-weight:700;text-transform:uppercase">Cliente / Obra</span><div style="font-size:15px;font-weight:700;margin-top:2px">${clienteNombre||"—"}</div></div>
    <div><span style="font-size:10px;color:#888;font-weight:700;text-transform:uppercase">Descripción</span><div style="font-size:14px;font-weight:600;margin-top:2px">${cot.titulo||"—"}</div></div>
  </div>
  <div class="st">Detalle</div>
  <table><thead><tr style="background:#1565C0;color:#fff"><th style="padding:8px 12px;text-align:left;font-size:12px">Descripción</th><th style="padding:8px 12px;text-align:center;font-size:12px">Cant.</th><th style="padding:8px 12px;text-align:right;font-size:12px">P. Unit.</th><th style="padding:8px 12px;text-align:right;font-size:12px">Subtotal</th></tr></thead><tbody>${rows}</tbody></table>
  <div style="display:flex;justify-content:flex-end;margin-top:8px"><div style="width:260px">
    <div style="display:flex;justify-content:space-between;padding:6px 12px;font-size:13px"><span style="color:#555">Subtotal</span><span>$${sub.toLocaleString("es-AR")}</span></div>
    <div style="display:flex;justify-content:space-between;padding:6px 12px;font-size:13px;border-bottom:1px solid #e0e0e0"><span style="color:#555">IVA 21%</span><span>$${iva.toLocaleString("es-AR")}</span></div>
    <div style="display:flex;justify-content:space-between;padding:10px 12px;font-size:16px;font-weight:800;background:#e3f2fd;border-radius:6px;margin-top:4px"><span style="color:#1565C0">TOTAL</span><span style="color:#1565C0">$${total.toLocaleString("es-AR")}</span></div>
  </div></div>
  ${cot.condiciones?`<div class="st">Condiciones</div><p style="font-size:13px;line-height:1.7;color:#444;background:#f8f9ff;padding:12px;border-radius:6px;border-left:3px solid #1565C0">${cot.condiciones}</p>`:""}
  ${cot.notas?`<div class="st">Notas</div><p style="font-size:13px;color:#555;line-height:1.6">${cot.notas}</p>`:""}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:32px">
    <div style="border-top:1.5px solid #1565C0;padding-top:8px;text-align:center"><div style="font-size:12px;color:#888">Firma empresa</div><div style="font-size:13px;font-weight:700;color:#1565C0;margin-top:4px">La Vidriería Rosario</div></div>
    <div style="border-top:1.5px solid #ccc;padding-top:8px;text-align:center"><div style="font-size:12px;color:#888">Conformidad cliente</div></div>
  </div>
  <div style="margin-top:24px;text-align:center;font-size:10px;color:#aaa">Generado el ${new Date().toLocaleString("es-AR")} · VidrierApp</div>
</div></body></html>`;
    const w=window.open("","_blank","width=900,height=780");
    if(w){w.document.write(html);w.document.close();w.onload=()=>{w.focus();w.print();};}
  };

  const CotizacionForm=({cot,clientes,onSave,onClose})=>{
    const [form,setForm]=useState(cot||{titulo:"",cliente:"",fecha:new Date().toISOString().split("T")[0],validez:"",condiciones:"50% al confirmar, saldo contra entrega.",notas:"",items:[{desc:"",cant:1,precio:""},{desc:"",cant:1,precio:""}],estado:"pendiente"});
    const set=(k,v)=>setForm(f=>({...f,[k]:v}));
    const setItem=(i,k,v)=>setForm(f=>{const it=[...f.items];it[i]={...it[i],[k]:v};return{...f,items:it};});
    const addItem=()=>setForm(f=>({...f,items:[...f.items,{desc:"",cant:1,precio:""}]}));
    const removeItem=(i)=>setForm(f=>({...f,items:f.items.filter((_,idx)=>idx!==i)}));
    const sub=(form.items||[]).reduce((s,i)=>s+(+i.precio*(+i.cant||1)),0);
    return(
      <div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <Field label="Descripción / Título"><Input value={form.titulo} onChange={e=>set("titulo",e.target.value)} placeholder="Ej: Mampara baño planta baja"/></Field>
          <Field label="Cliente"><Sel value={form.cliente} onChange={e=>set("cliente",e.target.value)}><option value="">Sin asignar</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</Sel></Field>
          <Field label="Fecha"><Input type="date" value={form.fecha} onChange={e=>set("fecha",e.target.value)}/></Field>
          <Field label="Válida hasta"><Input type="date" value={form.validez} onChange={e=>set("validez",e.target.value)}/></Field>
        </div>
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase"}}>Ítems</div>
            <Btn small onClick={addItem}><Icon name="plus" size={13}/> Agregar</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 65px 120px 28px",gap:8,marginBottom:5}}>
            {["Descripción","Cant.","Precio unit.",""].map(h=><span key={h} style={{fontSize:11,color:"#3a6a9a",fontWeight:600,textAlign:h==="Precio unit."?"right":"left"}}>{h}</span>)}
          </div>
          {(form.items||[]).map((item,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 65px 120px 28px",gap:8,marginBottom:7,alignItems:"center"}}>
              <Input value={item.desc} onChange={e=>setItem(i,"desc",e.target.value)} placeholder="Ej: Vidrio Float 6mm"/>
              <Input type="number" value={item.cant} min="1" onChange={e=>setItem(i,"cant",e.target.value)} style={{textAlign:"center"}}/>
              <Input type="number" value={item.precio} onChange={e=>setItem(i,"precio",e.target.value)} placeholder="$0"/>
              <button onClick={()=>removeItem(i)} disabled={(form.items||[]).length<=1} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,opacity:(form.items||[]).length<=1?0.3:1,display:"flex"}}><Icon name="trash" size={13}/></button>
            </div>
          ))}
          {sub>0&&<div style={{marginTop:10,padding:"10px 12px",background:"#0a1828",borderRadius:8,border:"1px solid #1565C025"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5a8ab8",marginBottom:2}}><span>Subtotal</span><span>${sub.toLocaleString("es-AR")}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5a8ab8",marginBottom:2}}><span>IVA 21%</span><span>${(sub*0.21).toLocaleString("es-AR")}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:700,color:"#64B5F6"}}><span>TOTAL</span><span>${(sub*1.21).toLocaleString("es-AR")}</span></div>
          </div>}
        </div>
        <Field label="Condiciones de pago"><Textarea value={form.condiciones} onChange={e=>set("condiciones",e.target.value)}/></Field>
        <Field label="Notas internas"><Textarea value={form.notas} onChange={e=>set("notas",e.target.value)} placeholder="Notas que no aparecen en el PDF..."/></Field>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
          <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={()=>onSave(form)}><Icon name="plus" size={16}/> {cot?"Guardar":"Crear Cotización"}</Btn>
        </div>
      </div>
    );
  };

  const Cotizaciones=()=>{
    const ESTADO_COT=[
      {id:"pendiente",label:"Pendiente",color:"#FFB74D",bg:"#2a1f0a"},
      {id:"enviada",label:"Enviada",color:"#64B5F6",bg:"#1a2a3a"},
      {id:"aprobada",label:"Aprobada",color:"#A5D6A7",bg:"#0a2a0f"},
      {id:"rechazada",label:"Rechazada",color:"#F48FB1",bg:"#2a0a0a"},
      {id:"convertida",label:"→ Orden",color:"#26A69A",bg:"#0a2a26"},
    ];
    const BadgeCot=({estado})=>{const e=ESTADO_COT.find(x=>x.id===estado)||ESTADO_COT[0];return <span style={{background:e.bg,color:e.color,border:`1px solid ${e.color}40`,padding:"2px 10px",borderRadius:99,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{e.label}</span>;};

    const convertirAOrden=async(cot)=>{
      const nuevaOrden={titulo:cot.titulo,cliente:cot.cliente,tipo:"",etapa:"presupuesto",fecha:new Date().toISOString().split("T")[0],pres_items:cot.items||[],pres_condiciones:cot.condiciones||"",notas:`Convertida desde cotización ${cot.numero}`,med_plano:[],prod_procesos:[],prod_campos:{}};
      await saveOrden(nuevaOrden);
      await fsSet("cotizaciones",cot.id,{...cot,estado:"convertida"});
      setNav("ordenes");
    };

    return(
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
          <div>
            <h1 style={{margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:24,color:"#e2f0ff"}}>Cotizaciones</h1>
            <p style={{margin:0,color:"#3a6a9a",fontSize:13}}>{cotizaciones.length} cotizaciones · Numeración PR-AÑO-XXXX</p>
          </div>
          <Btn small onClick={()=>setModal({type:"nueva_cotizacion"})}><Icon name="plus" size={14}/> Nueva Cotización</Btn>
        </div>
        <div style={{display:"grid",gap:8}}>
          {cotizaciones.map(c=>{
            const total=(c.items||[]).reduce((s,i)=>s+(+i.precio*(+i.cant||1)),0)*1.21;
            return(
              <div key={c.id} style={{background:"#071220",borderRadius:11,padding:"12px 16px",border:"1px solid #0f2035",display:"flex",alignItems:"center",gap:12}}>
                <div style={{background:"#0a1828",border:"1px solid #FFB74D25",borderRadius:7,padding:"4px 10px",minWidth:105,textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#FFB74D",fontFamily:"monospace"}}>{c.numero}</div>
                  <div style={{fontSize:10,color:"#3a6a9a"}}>{c.fecha}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#e2f0ff",marginBottom:2}}>{c.titulo||"Sin título"}</div>
                  <div style={{fontSize:12,color:"#3a6a9a"}}>{getNombre(c.cliente)}{total>0?` · $${total.toLocaleString("es-AR")}`:""}</div>
                </div>
                <BadgeCot estado={c.estado}/>
                <div style={{display:"flex",gap:4}}>
                  {c.estado!=="convertida"&&<button title="Convertir a Orden" onClick={()=>convertirAOrden(c)} style={{background:"#0a2a26",border:"1px solid #26A69A40",color:"#26A69A",cursor:"pointer",padding:"5px 10px",borderRadius:6,fontSize:11,fontFamily:"inherit",fontWeight:600}}>→ Orden</button>}
                  <button title="PDF" onClick={()=>printCotizacion(c,getNombre(c.cliente))} style={{background:"none",border:"none",color:"#26A69A",cursor:"pointer",padding:6,borderRadius:6,display:"flex"}}><Icon name="pdf" size={15}/></button>
                  <button onClick={()=>setModal({type:"editar_cotizacion",data:c})} style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",padding:6,display:"flex"}}><Icon name="edit" size={15}/></button>
                  <button onClick={()=>fsDel("cotizaciones",c.id)} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:6,display:"flex"}}><Icon name="trash" size={15}/></button>
                </div>
              </div>
            );
          })}
          {!cotizaciones.length&&<div style={{textAlign:"center",padding:"44px 0",color:"#2a4a6a"}}><Icon name="pdf" size={40}/><p style={{marginTop:12,fontSize:14}}>No hay cotizaciones aún</p><Btn small onClick={()=>setModal({type:"nueva_cotizacion"})} style={{marginTop:8}}><Icon name="plus" size={14}/> Crear primera cotización</Btn></div>}
        </div>
      </div>
    );
  };

  // ── STOCK PAGE ───────────────────────────────────────────────────────────────
  const CATEGORIAS_STOCK=["Burletes","Perfilería aluminio","Bisagras y herrajes","Silicona y adhesivos","Vidrios (stock propio)","Espejos (stock propio)","Herramientas","Consumibles","Otro"];

  const printStock=(items)=>{
    const alertas=items.filter(i=>i.stock<=i.minimo);
    const rows=items.map(i=>`<tr style="background:${i.stock<=i.minimo?"#fff8e1":"#fff"}"><td style="padding:7px 12px;border-bottom:1px solid #e8f0ff">${i.nombre}</td><td style="padding:7px 12px;border-bottom:1px solid #e8f0ff;color:#555">${i.categoria||"—"}</td><td style="padding:7px 12px;border-bottom:1px solid #e8f0ff;text-align:center;font-weight:700;color:${i.stock<=i.minimo?"#e65100":"#1a1a2e"}">${i.stock} ${i.unidad||"u."}</td><td style="padding:7px 12px;border-bottom:1px solid #e8f0ff;text-align:center;color:#888">${i.minimo} ${i.unidad||"u."}</td><td style="padding:7px 12px;border-bottom:1px solid #e8f0ff;text-align:center">${i.stock<=i.minimo?'<span style="background:#fff3cd;color:#e65100;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700">⚠ BAJO</span>':'<span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:99px;font-size:11px">OK</span>'}</td></tr>`).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Stock</title>
<style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a2e;margin:0}
.hdr{background:linear-gradient(135deg,#0d47a1,#1565C0);color:#fff;padding:20px 32px;display:flex;justify-content:space-between;align-items:center}
.body{padding:24px 32px}table{width:100%;border-collapse:collapse;font-size:13px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>
<div class="hdr">
  <div><div style="font-size:20px;font-weight:800">La Vidriería Rosario — Stock</div><div style="font-size:12px;opacity:0.75;margin-top:3px">Generado el ${new Date().toLocaleString("es-AR")}</div></div>
  <div style="text-align:right"><div style="font-size:28px;font-weight:900">${items.length}</div><div style="font-size:11px;opacity:0.8">productos</div></div>
</div>
<div class="body">
  ${alertas.length?`<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:12px 16px;margin-bottom:18px;font-size:13px;color:#795548"><strong>⚠ ${alertas.length} producto${alertas.length>1?"s":""} con stock bajo:</strong> ${alertas.map(a=>a.nombre).join(", ")}</div>`:""}
  <table><thead><tr style="background:#1565C0;color:#fff"><th style="padding:8px 12px;text-align:left">Producto</th><th style="padding:8px 12px;text-align:left">Categoría</th><th style="padding:8px 12px;text-align:center">Stock actual</th><th style="padding:8px 12px;text-align:center">Mínimo</th><th style="padding:8px 12px;text-align:center">Estado</th></tr></thead><tbody>${rows}</tbody></table>
  <div style="margin-top:24px;text-align:center;font-size:10px;color:#aaa">VidrierApp · La Vidriería Rosario</div>
</div></body></html>`;
    const w=window.open("","_blank","width=900,height=700");
    if(w){w.document.write(html);w.document.close();w.onload=()=>{w.focus();w.print();};}
  };

  const Stock=()=>{
    const [movModal,setMovModal]=useState(null); // {item, tipo:'entrada'|'salida'}
    const [movCant,setMovCant]=useState("");
    const [movNota,setMovNota]=useState("");
    const [filterCat,setFilterCat]=useState("all");
    const [showForm,setShowForm]=useState(false);
    const [editItem,setEditItem]=useState(null);
    const [form,setForm]=useState({nombre:"",categoria:"Burletes",stock:0,minimo:5,unidad:"u.",descripcion:""});
    const sf=(k,v)=>setForm(f=>({...f,[k]:v}));

    const saveItem=async()=>{
      if(!form.nombre.trim()) return;
      const id=editItem||newId();
      await fsSet("stock_items",id,{...form,id,movimientos:editItem?stock.find(x=>x.id===id)?.movimientos||[]:[],createdAt:new Date().toISOString()});
      setForm({nombre:"",categoria:"Burletes",stock:0,minimo:5,unidad:"u.",descripcion:""});
      setEditItem(null);setShowForm(false);
    };
    const startEdit=(item)=>{setForm({nombre:item.nombre,categoria:item.categoria,stock:item.stock,minimo:item.minimo,unidad:item.unidad||"u.",descripcion:item.descripcion||""});setEditItem(item.id);setShowForm(true);};
    const deleteItem=(id)=>fsDel("stock_items",id);

    const registrarMov=async()=>{
      if(!movCant||+movCant<=0) return;
      const item=movModal.item;
      const delta=movModal.tipo==="entrada"?+movCant:-+movCant;
      const newStock=Math.max(0,item.stock+delta);
      const newMov=[{tipo:movModal.tipo,cant:+movCant,nota:movNota,fecha:new Date().toISOString()},...(item.movimientos||[])].slice(0,50);
      await fsSet("stock_items",item.id,{...item,stock:newStock,movimientos:newMov});
      setMovModal(null);setMovCant("");setMovNota("");
    };

    const alertas=stock.filter(i=>i.stock<=i.minimo);
    const filtered=filterCat==="all"?stock:stock.filter(i=>i.categoria===filterCat);

    return(
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <h1 style={{margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:24,color:"#e2f0ff"}}>Stock de Materiales</h1>
            <p style={{margin:0,color:"#3a6a9a",fontSize:13}}>{stock.length} productos · {alertas.length>0&&<span style={{color:"#FFB74D",fontWeight:600}}>⚠ {alertas.length} con stock bajo</span>}</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn variant="secondary" small onClick={()=>printStock(stock)}><Icon name="pdf" size={14}/> PDF Stock</Btn>
            <Btn small onClick={()=>{setEditItem(null);setForm({nombre:"",categoria:"Burletes",stock:0,minimo:5,unidad:"u.",descripcion:""});setShowForm(s=>!s);}}>
              <Icon name="plus" size={14}/> Nuevo Producto
            </Btn>
          </div>
        </div>

        {alertas.length>0&&<div style={{background:"#2a1a0a",border:"1px solid #FFB74D40",borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:13,color:"#FFB74D"}}>
          ⚠ Stock bajo: {alertas.map(a=><span key={a.id} style={{fontWeight:600,marginRight:8}}>{a.nombre} ({a.stock} {a.unidad||"u."})</span>)}
        </div>}

        {showForm&&(
          <div style={{background:"#071220",borderRadius:12,padding:16,border:"1px solid #1565C040",marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:600,color:"#5a8ab8",textTransform:"uppercase",marginBottom:12}}>{editItem?"Editar Producto":"Nuevo Producto"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px 80px 80px",gap:10,marginBottom:10}}>
              <Field label="Nombre"><Input value={form.nombre} onChange={e=>sf("nombre",e.target.value)} placeholder="Ej: Burlete D gris 9mm"/></Field>
              <Field label="Categoría"><Sel value={form.categoria} onChange={e=>sf("categoria",e.target.value)}>{CATEGORIAS_STOCK.map(c=><option key={c} value={c}>{c}</option>)}</Sel></Field>
              <Field label="Stock"><Input type="number" value={form.stock} onChange={e=>sf("stock",+e.target.value)}/></Field>
              <Field label="Mínimo"><Input type="number" value={form.minimo} onChange={e=>sf("minimo",+e.target.value)}/></Field>
              <Field label="Unidad"><Input value={form.unidad} onChange={e=>sf("unidad",e.target.value)} placeholder="u."/></Field>
            </div>
            <Field label="Descripción / Referencia"><Input value={form.descripcion} onChange={e=>sf("descripcion",e.target.value)} placeholder="Código, proveedor, notas..."/></Field>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:4}}>
              <Btn variant="secondary" small onClick={()=>{setShowForm(false);setEditItem(null);}}>Cancelar</Btn>
              <Btn small onClick={saveItem}><Icon name="plus" size={13}/> {editItem?"Guardar":"Agregar"}</Btn>
            </div>
          </div>
        )}

        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <Sel value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{width:200}}>
            <option value="all">Todas las categorías</option>
            {CATEGORIAS_STOCK.map(c=><option key={c} value={c}>{c}</option>)}
          </Sel>
        </div>

        <div style={{display:"grid",gap:7}}>
          {filtered.map(item=>{
            const bajo=item.stock<=item.minimo;
            const pct=item.minimo>0?Math.min(100,Math.round((item.stock/Math.max(item.minimo*2,1))*100)):100;
            return(
              <div key={item.id} style={{background:"#071220",borderRadius:11,padding:"12px 16px",border:`1px solid ${bajo?"#FFB74D20":"#0f2035"}`,display:"flex",alignItems:"center",gap:12}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontSize:14,fontWeight:600,color:"#e2f0ff"}}>{item.nombre}</span>
                    <span style={{fontSize:11,color:"#3a6a9a",background:"#0f2035",padding:"1px 7px",borderRadius:99}}>{item.categoria}</span>
                    {bajo&&<span style={{fontSize:10,color:"#FFB74D",fontWeight:700}}>⚠ BAJO</span>}
                  </div>
                  {item.descripcion&&<div style={{fontSize:11,color:"#2a4a6a",marginBottom:4}}>{item.descripcion}</div>}
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{flex:1,height:4,background:"#0a1828",borderRadius:99,overflow:"hidden",maxWidth:140}}>
                      <div style={{height:"100%",borderRadius:99,background:bajo?"linear-gradient(90deg,#e65100,#FFB74D)":"linear-gradient(90deg,#1565C0,#42A5F5)",width:pct+"%"}}/>
                    </div>
                    <span style={{fontSize:12,fontWeight:700,color:bajo?"#FFB74D":"#64B5F6"}}>{item.stock} {item.unidad||"u."}</span>
                    <span style={{fontSize:11,color:"#3a6a9a"}}>/ mín {item.minimo}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:5}}>
                  <button onClick={()=>{setMovModal({item,tipo:"entrada"});setMovCant("");setMovNota("");}} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #26A69A40",background:"#0a2a26",color:"#26A69A",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}>+ Entrada</button>
                  <button onClick={()=>{setMovModal({item,tipo:"salida"});setMovCant("");setMovNota("");}} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #F48FB140",background:"#2a0a1a",color:"#F48FB1",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}>− Salida</button>
                  <button onClick={()=>startEdit(item)} style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",padding:6,display:"flex"}}><Icon name="edit" size={14}/></button>
                  <button onClick={()=>deleteItem(item.id)} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:6,display:"flex"}}><Icon name="trash" size={14}/></button>
                </div>
              </div>
            );
          })}
          {!filtered.length&&<div style={{textAlign:"center",padding:"40px 0",color:"#2a4a6a"}}><p style={{fontSize:14}}>No hay productos en esta categoría</p></div>}
        </div>

        {/* Movimiento modal */}
        {movModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,10,25,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={e=>e.target===e.currentTarget&&setMovModal(null)}>
            <div style={{background:"#0d1b2a",border:"1px solid #1e3a5a",borderRadius:14,padding:24,width:340,boxShadow:"0 24px 60px rgba(0,0,0,0.6)"}}>
              <div style={{fontSize:16,fontWeight:700,color:"#e2f0ff",marginBottom:4}}>{movModal.tipo==="entrada"?"+ Entrada de stock":"− Salida de stock"}</div>
              <div style={{fontSize:13,color:"#5a8ab8",marginBottom:16}}>{movModal.item.nombre}</div>
              <Field label="Cantidad"><Input type="number" autoFocus value={movCant} onChange={e=>setMovCant(e.target.value)} placeholder="0" min="1" onKeyDown={e=>e.key==="Enter"&&registrarMov()}/></Field>
              <Field label="Nota / Referencia (opcional)"><Input value={movNota} onChange={e=>setMovNota(e.target.value)} placeholder="Ej: Orden OT-25-0003"/></Field>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
                <Btn variant="secondary" small onClick={()=>setMovModal(null)}>Cancelar</Btn>
                <Btn small onClick={registrarMov}>{movModal.tipo==="entrada"?"Registrar entrada":"Registrar salida"}</Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const pages={home:<Home/>,ordenes:<OrdenesList/>,tablero:<Tablero/>,clientes:<Clientes/>,cotizaciones:<Cotizaciones/>,stock:<Stock/>,optimize:<Optimizer/>};

  return(
    <div style={{minHeight:"100vh",background:"#060f1a",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#c8e0f8",display:"flex"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <Sidebar/>
      <main style={{flex:1,padding:26,overflowY:"auto",minHeight:"100vh"}}>{pages[nav]}</main>

      <Modal open={modal?.type==="nueva_orden"||modal?.type==="editar_orden"} onClose={()=>setModal(null)} title={modal?.type==="editar_orden"?"Editar Orden":"Nueva Orden de Trabajo"} wide xwide>
        <OrdenForm orden={modal?.data} plantillas={plantillas} clientes={clientes} onSave={saveOrden} onClose={()=>setModal(null)}/>
      </Modal>
      <Modal open={modal?.type==="nuevo_cliente"||modal?.type==="editar_cliente"} onClose={()=>setModal(null)} title={modal?.type==="editar_cliente"?"Editar Cliente":"Nuevo Cliente / Obra"}>
        <ClienteForm cliente={modal?.data} onSave={saveCliente} onClose={()=>setModal(null)}/>
      </Modal>
      <Modal open={modal?.type==="gestionar_plantillas"} onClose={()=>setModal(null)} title="Plantillas de Trabajo" wide>
        <PlantillasManager/>
      </Modal>
      <Modal open={modal?.type==="nueva_plantilla"||modal?.type==="editar_plantilla"} onClose={()=>setModal(null)} title={modal?.type==="editar_plantilla"?"Editar Plantilla":"Nueva Plantilla Personalizada"} wide>
        <PlantillaBuilder plantilla={modal?.data} onSave={savePlantilla} onClose={()=>setModal(null)}/>
      </Modal>
      <Modal open={modal?.type==="gestionar_estados"} onClose={()=>setModal(null)} title="Gestionar Procesos del Tablero" wide>
        <ProcessManager estados={estados} onSave={async(list)=>{await fsCfgSet("estados",list);setModal(null);}} onClose={()=>setModal(null)}/>
      </Modal>
      <Modal open={modal?.type==="nueva_cotizacion"||modal?.type==="editar_cotizacion"} onClose={()=>setModal(null)} title={modal?.type==="editar_cotizacion"?"Editar Cotización":"Nueva Cotización"} wide>
        <CotizacionForm cot={modal?.data} clientes={clientes} onSave={async(form)=>{
          const id=form.id||newId();
          const numero=form.numero||newCotNum(cotizaciones);
          await fsSet("cotizaciones",id,{...form,id,numero,createdAt:form.createdAt||new Date().toISOString()});
          setModal(null);
        }} onClose={()=>setModal(null)}/>
      </Modal>
    </div>
  );
}
