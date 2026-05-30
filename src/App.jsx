import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, onSnapshot, setDoc, deleteDoc, getDoc } from "firebase/firestore";

// ─── USUARIOS ────────────────────────────────────────────────────────────────
const USUARIOS = [
  { usuario: "thomasb",  clave: "beltrani07",   nombre: "Thomas",   rol: "admin",     color: "#64B5F6" },
  { usuario: "Taller1",  clave: "beltrani07",   nombre: "Taller",   rol: "taller",    color: "#CE93D8" },
  { usuario: "Local1",   clave: "virasoro2431", nombre: "Local 1",  rol: "local",     color: "#A5D6A7" },
  { usuario: "Local2",   clave: "virasoro2431", nombre: "Local 2",  rol: "local",     color: "#80CBC4" },
  { usuario: "EquipoA",  clave: "equipo2025",   nombre: "Equipo A", rol: "colocador", color: "#FFB74D", equipo:"A" },
  { usuario: "EquipoB",  clave: "equipo2025",   nombre: "Equipo B", rol: "colocador", color: "#F48FB1", equipo:"B" },
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
        // Always save the full current user object (including equipo field)
        const freshUser = {...user};
        sessionStorage.setItem("vidrierapp_user", JSON.stringify(freshUser));
        onLogin(freshUser);
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
    cb(snap.exists() ? snap.data().value : null);
  });
};

// ─── DATOS DEL NEGOCIO ───────────────────────────────────────────────────────
const BIZ_LOGO = "data:image/jpeg;base64,/9j/4QC+RXhpZgAATU0AKgAAAAgABQEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAeQAAAHAAAABDAyMjGRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAAXygAwAEAAAAAQAAAXykBgADAAAAAQAAAAAAAAAAAAD/4gI0SUNDX1BST0ZJTEUAAQEAAAIkYXBwbAQAAABtbnRyUkdCIFhZWiAH4QAHAAcADQAWACBhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGzKGpWCJX8QTTiZE9XR6hWCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAAGVjcHJ0AAABZAAAACN3dHB0AAABiAAAABRyWFlaAAABnAAAABRnWFlaAAABsAAAABRiWFlaAAABxAAAABRyVFJDAAAB2AAAACBjaGFkAAAB+AAAACxiVFJDAAAB2AAAACBnVFJDAAAB2AAAACBkZXNjAAAAAAAAAAtEaXNwbGF5IFAzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHRleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTcAAFhZWiAAAAAAAADzUQABAAAAARbMWFlaIAAAAAAAAIPfAAA9v////7tYWVogAAAAAAAASr8AALE3AAAKuVhZWiAAAAAAAAAoOAAAEQsAAMi5cGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltzZjMyAAAAAAABDEIAAAXe///zJgAAB5MAAP2Q///7ov///aMAAAPcAADAbv/bAIQAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBQQEBAQEBQYFBQUFBQUGBgYGBgYGBgcHBwcHBwgICAgICQkJCQkJCQkJCQEBAQECAgIEAgIECQYFBgkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJ/90ABAAY/8AAEQgBfAF8AwEiAAIRAQMRAf/EAaIAAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKCxAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6AQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgsRAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9H+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoorO1fV9L0DS59a1u4jtbS1QySzSsFREXkkk8AUAVvEfiPQ/CGgXnijxNdR2Wn6fC89xPKwVI40GWZiegAr+P/wDaa/4LIftQ/tnftN237Mn/AATa0nUbs2H2i5UWSxpc3a2n355pJmWOGAcBQ7KCWUHLMq1yn/BSr/goN8Y/+Cmf7QVl/wAE5v2CklvrC+uGt7u5jLJDOYz+8ubmRQdllAvzMSDnsGJUH+hb/gm//wAE6fgx/wAE0vgofAPgA/2t4q1sQz+KPEcylZ9V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1XRtUgjubO+tJFlgngkAZJI5EJVlYEEEHBFf54uharbTW7eD/GkXnWbErFdMOYHY4P8AwD2r9JP+CfX/AAUH+Lf/AAT18Sy/C/xNYyeLvhvfSNO+lJIFmtZJMYuLB2BA3Y+eJsI/XKtlq/aeLeEnjb4vBpe16rZT810Uvz69z+ScyyeeGqcjT5X/AOS/8D8j+sP9oT9of4U/sf8Awe1L47fG6/FnpVgPLt7dCDdX90wJjtLSNiPMmkwcDICqGdyqKzD+ND49fHP4q/8ABRr4uS/tE/tB36eG/Behr5VjaId1lpNoWz5UZIU3Fy5AaSQgM7Y4VFRE1/2gfjF8W/8Agof8YJvjn+0PfJovg7w+rJZ2EGTaabZMctHFnG+4fAMsrfM5A+6ioifpV/wTR/4Jkax/wUA8Qab8dfjdpU/hn4KeHpw2heHpPlm1SWMbTLcZ/hGOT36D28epHCcL4N43GtOs9NNbf3Y+fd/pv7XBnB2KzjERgo2gu/XzfZdkbn/BL/8A4Jq6t+3Jr+k/Hn4y6FJ4Y+COgyLLoHhqdcSavOhBFzdBuqZx7N9OK/sy0rStM0LTYNG0aBLW0tUWOKGJQqIijAVQOAAKZoui6R4b0i20DQLaOzsrONYYIIlCpHGgwqqo4AArTr+SOKuKcTm2KeIxD9F0S/rc/tfh/IKGXYdUKK9X3YUUUV80e4FFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/0/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACo5oYbiF7e4QSRuCrKwyCDwQQeCCKkooA/km/4LMf8ABIX+wRqP7Wn7L2lGazJa58RaFbrnHdru3Uc+8i/8C9a/mz8Gax4a0yBNF8erNLpCtu+0243SwFuvFf6kUsUU8bQzKHRwVZWGQQeoIPUV+QnxA/4If/sIfEL4wt8Xr3Rbmxae4+1XGmWc3lWMsuclvLAym49QhA9MV+88B+M08vwzwmPTml8LW68n+jPzHirw6p42r7ahaLe66ep+EX/BND/gmjr37ffiPQ/jZ8bNHk0D4J+FpRJouiXClZdYnjP+ukBxiPPU9+g9v7R9E0PR/DWkW2geH7WKysbONYoIIVCRxoowFVRwAKTQtC0fwxo1r4d8PW0dnY2USwwQRKFSONBhVUDoAK1a/LeK+K8Vm+KeJxL9F0SPssgyChl1BUaC9X3CiiivmD3AooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//U/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9b+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Z";
const BIZ_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a2e;background:#fff}
.hdr{background:linear-gradient(135deg,#0a2a5e,#1565C0);padding:20px 28px;display:flex;justify-content:space-between;align-items:center;gap:16px}
.hdr-left{display:flex;align-items:center;gap:14px}
.hdr-logo{width:68px;height:68px;object-fit:contain;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.3));flex-shrink:0}
.biz-name{font-size:20px;font-weight:900;color:#fff;letter-spacing:0.5px;font-family:'Helvetica Neue',Arial,sans-serif}
.biz-sub{font-size:11px;color:rgba(255,255,255,0.7);margin-top:2px;letter-spacing:0.5px}
.biz-contact{font-size:10.5px;color:rgba(255,255,255,0.85);margin-top:3px}
.hdr-right{text-align:right;flex-shrink:0}
.doc-type{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.7);margin-bottom:4px}
.doc-num{font-size:26px;font-weight:900;color:#fff;letter-spacing:1px;display:block}
.doc-date{font-size:11px;color:rgba(255,255,255,0.7);margin-top:4px;display:block}
.doc-badge{display:inline-block;margin-top:6px;padding:3px 12px;border-radius:99px;background:rgba(255,255,255,0.2);font-size:10px;font-weight:700;color:#fff;letter-spacing:0.5px}
.body{padding:24px 28px}
.divider{height:3px;background:linear-gradient(90deg,#1565C0,#42A5F5,#1565C0);margin-bottom:0}
.st{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:5px;margin:20px 0 12px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.f label{font-size:9px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:3px}
.f p{font-size:14px;font-weight:600;color:#1a1a2e}
table{width:100%;border-collapse:collapse;font-size:13px;margin-top:4px}
thead tr{background:linear-gradient(135deg,#0a2a5e,#1565C0);color:#fff}
thead th{padding:9px 12px;font-size:11px;font-weight:600;letter-spacing:0.5px}
tbody tr:nth-child(even){background:#f0f6ff}
tbody td{padding:8px 12px;border-bottom:1px solid #e4eeff;color:#1a1a2e}
.total-box{background:linear-gradient(135deg,#e3f2fd,#bbdefb);border-radius:8px;padding:10px 14px;margin-top:4px;border:1px solid #90CAF9}
.total-row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}
.total-final{display:flex;justify-content:space-between;padding:8px 0 2px;font-size:17px;font-weight:900;color:#0a2a5e;border-top:2px solid #1565C0;margin-top:4px}
.note-box{background:#f8f9ff;border-left:3px solid #1565C0;border-radius:0 6px 6px 0;padding:10px 14px;font-size:13px;line-height:1.7;color:#333}
.warn-box{background:#fff8e1;border-left:3px solid #FFA000;border-radius:0 6px 6px 0;padding:10px 14px;font-size:13px;line-height:1.7;color:#333}
.process-chip{display:inline-block;padding:4px 12px;background:#e3f2fd;color:#1565C0;border-radius:99px;font-size:11px;font-weight:700;margin:2px;border:1px solid #90CAF9}
.sign-area{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px}
.sign-line{border-top:1.5px solid #1565C0;padding-top:8px;text-align:center}
.sign-label{font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.5px}
.sign-name{font-size:12px;font-weight:600;color:#1565C0;margin-top:3px}
.footer{background:#f0f6ff;border-top:2px solid #e3f2fd;padding:10px 28px;display:flex;justify-content:space-between;align-items:center}
.footer-left{font-size:10px;color:#999}
.footer-right{font-size:10px;color:#1565C0;font-weight:600}
.ref-badge{display:inline-block;padding:2px 9px;border-radius:99px;background:#fff3cd;color:#856404;font-size:11px;font-weight:700;border:1px solid #ffc107;margin-left:8px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:8mm}}
`;

const bizHeader = (docType, numero, fecha, badge) => `
<div class="hdr">
  <div class="hdr-left">
    <img class="hdr-logo" src="${BIZ_LOGO}" alt="LV"/>
    <div>
      <div class="biz-name">La Vidriería Rosario</div>
      <div class="biz-sub">Vidrios · Espejos · Cerramientos · Instalaciones</div>
      <div class="biz-contact">📍 Mendoza 1783, Rosario, Santa Fe · CP 2000</div>
      <div class="biz-contact">📞 341 425-1007 / 341 508-4921 &nbsp;·&nbsp; ✉️ lavidrieria@gmail.com</div>
      <div class="biz-contact">📸 @lavidrieriarosariooficial &nbsp;·&nbsp; 🕐 Lun-Vie 8-19hs · Sáb 8-13hs</div>
    </div>
  </div>
  <div class="hdr-right">
    <div class="doc-type">${docType}</div>
    <span class="doc-num">${numero}</span>
    <span class="doc-date">Fecha: ${fecha}</span>
    ${badge?`<span class="doc-badge">${badge}</span>`:""}
  </div>
</div>
<div class="divider"></div>`;

const bizFooter = () => `
<div class="footer">
  <div class="footer-left">Generado el ${new Date().toLocaleString("es-AR")} · VidrierApp · La Vidriería Rosario</div>
  <div class="footer-right">Mendoza 1783 · Rosario · 341 425-1007</div>
</div>`;

const openPDF = (html) => {
  const w = window.open("","_blank","width=940,height=820");
  if(w){w.document.write(html);w.document.close();w.onload=()=>{w.focus();w.print();};}
};

const mkHTML = (title, body) => `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>${BIZ_CSS}</style></head><body>${body}</body></html>`;


// ─── UI PRIMITIVES ───────────────────────────────────────────────────────────
const iS = {width:"100%",background:"#071220",border:"1px solid #1e3a5a",borderRadius:8,padding:"9px 12px",color:"#c8e0f8",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};

const Input = ({style,...p}) => <input style={{...iS,...style}} {...p}/>;
const Textarea = ({style,...p}) => <textarea style={{...iS,resize:"vertical",minHeight:70,...style}} {...p}/>;
const Sel = ({style,children,...p}) => <select style={{...iS,...style}} {...p}>{children}</select>;

const Btn = ({variant,small,style,children,...p}) => (
  <button style={{display:"inline-flex",alignItems:"center",gap:5,padding:small?"5px 12px":"8px 16px",
    borderRadius:8,border:variant==="secondary"?"1px solid #1e3a5a":"none",
    background:variant==="secondary"?"transparent":"linear-gradient(135deg,#1565C0,#0d47a1)",
    color:variant==="secondary"?"#5a8ab8":"#fff",cursor:"pointer",fontSize:small?12:13,
    fontFamily:"inherit",fontWeight:600,...style}} {...p}>{children}</button>
);

const Field = ({label,children}) => (
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:10,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</label>}
    {children}
  </div>
);

const Modal = ({open,onClose,title,children,wide,xwide}) => {
  if(!open) return null;
  const maxW = xwide?1100:wide?760:480;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px 12px",overflowY:"auto"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#0d1e35",borderRadius:14,width:"100%",maxWidth:maxW,border:"1px solid #1e3a5a",boxShadow:"0 24px 80px rgba(0,0,0,0.6)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:"1px solid #1e3a5a"}}>
          <div style={{fontSize:16,fontWeight:700,color:"#e2f0ff"}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",fontSize:20,padding:"0 4px",lineHeight:1}}>✕</button>
        </div>
        <div style={{padding:"18px 20px",maxHeight:"82vh",overflowY:"auto"}}>{children}</div>
      </div>
    </div>
  );
};

const Icon = ({name,size=18}) => {
  const icons = {
    home:<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>,
    orders:<><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></>,
    board:<><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="4" height="8" rx="1"/></>,
    clients:<><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>,
    glass:<path d="M8 3h8l4 9H4L8 3z"/>,
    pdf:<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit:<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:<><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    optimize:<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    refresh:<><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>,
    template:<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    close:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  };
  return(
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      {icons[name]||icons.glass}
    </svg>
  );
};

const Badge = ({estado,estados}) => {
  const e = (estados||[]).find(x=>x.id===estado)||{label:estado||"—",color:"#90A4AE",bg:"#1a1f22"};
  return <span style={{background:e.bg,color:e.color,border:`1px solid ${e.color}40`,padding:"2px 10px",borderRadius:99,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{e.label}</span>;
};

const ESTADOS_DEFAULT = [
  { id: "presupuesto",   label: "Presupuesto",         color: "#64B5F6", bg: "#1a2a3a" },
  { id: "pendiente",     label: "Pendiente",            color: "#FFB74D", bg: "#2a1f0a" },
  { id: "esp_materiales",label: "Esp. Materiales",      color: "#FF8A65", bg: "#2a1200" },
  { id: "taller",        label: "En Taller",            color: "#4FC3F7", bg: "#0a1f2a" },
  { id: "templador",     label: "Templador",            color: "#CE93D8", bg: "#1e0a2a" },
  { id: "arenador",      label: "Arenador",             color: "#F48FB1", bg: "#2a0a1a" },
  { id: "pulido",        label: "Pulido",               color: "#80CBC4", bg: "#0a2a28" },
  { id: "listo_retirar", label: "Listo p/ Retirar",     color: "#A5D6A7", bg: "#0a2a0f" },
  { id: "listo_entregar",label: "Listo p/ Entregar",    color: "#C5E1A5", bg: "#162a0a" },
  { id: "entregado",     label: "Entregado",            color: "#90A4AE", bg: "#1a1f22" },
  { id: "cobrado",       label: "Cobrado ✓",            color: "#26A69A", bg: "#0a2a26" },
  { id: "cancelada",     label: "Cancelada",            color: "#EF5350", bg: "#2a0a0a", ocultar:true },
];

// Estados que NO aparecen en el tablero Kanban
const ESTADOS_OCULTOS_TABLERO = ["cancelada"];

const TIPOS_TRABAJO = ["Mampara de Baño","Espejo","Vidrio Ventana/Puerta","Trabajo de Obra","Frente de Cocina","Vidrio Templado","Baranda","Cerramiento","Otro"];
const TIPOS_VIDRIO_DEFAULT = ["Float 3mm","Float 4mm","Float 5mm","Float 6mm","Float 8mm","Float 10mm","Templado 6mm","Templado 8mm","Templado 10mm","Templado 12mm","Laminado 4+4","Laminado 6+6","Espejo 3mm","Espejo 4mm","Espejo 5mm","Satinado","Arenado","Reflectivo","DVH","Curvo"];
const TIPOS_VIDRIO = TIPOS_VIDRIO_DEFAULT; // fallback — se sobreescribe con Firebase

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,5);

// ─── CONTADORES GLOBALES (Firebase) ─────────────────────────────────────────
// El contador solo sube — nunca se reutiliza un número aunque se borre el documento
const getNextNum = async (key, prefix) => {
  const yr = new Date().getFullYear().toString().slice(-2);
  const counterRef = doc(db, "config", `counter_${key}_${yr}`);
  try {
    const snap = await getDoc(counterRef);
    const current = snap.exists() ? (snap.data()?.value || 0) : 0;
    const next = current + 1;
    await setDoc(counterRef, { value: next });
    return `${prefix}-${yr}-${String(next).padStart(4,"0")}`;
  } catch(e) {
    // Si falla Firebase, usar timestamp como fallback único
    console.error("Counter error:", e);
    return `${prefix}-${yr}-${Date.now().toString().slice(-4)}`;
  }
};

// Versión sincrónica de fallback (usada como inicial antes de que el async resuelva)
const newOrderNum = (list) => {
  const yr = new Date().getFullYear().toString().slice(-2);
  const ex = (list||[]).filter(o => o.numero?.startsWith(`OT-${yr}`));
  const max = ex.reduce((m,o) => { const n = parseInt(o.numero?.split("-")[2]||0); return n>m?n:m; }, 0);
  return `OT-${yr}-${String(max+1).padStart(4,"0")}`;
};

const PLANTILLAS_DEFAULT = [];

// ─── OBSERVACIONES DEFAULT ──────────────────────────────────────────────────
const OBS_DEFAULT = ["Con forma","Con perforación","En altura","Con bisel","Con pulido","Espejo","Con luz LED","Con marco","Con burletes","Satinado","Con film","Doble vidriado"];
const SERVICIOS_DEFAULT = ["Service de mampara","Service de puerta templada","Instalación estándar","Solo medición","Reparación"];
const PROCESOS_TALLER_DEFAULT = ["Corte","Pulido de borde","Perforación","Templado","Arenado","Biselado","Limpieza","Control de calidad","Embalaje"];



// buildSVGStr — renders shape array as SVG HTML string for PDFs
const buildSVGStr=(shapes)=>{
  if(!shapes||!shapes.length) return "";
  const pts=shapes.flatMap(s=>{
    if(s.cx!=null){const rw=s.rw||s.r||20,rh=(s.h||rw*2)/2;return[[s.cx-rw-20,s.cy-rh-20],[s.cx+rw+20,s.cy+rh+20]];}
    if(s.x!=null&&s.x1==null) return[[s.x-5,s.y-14],[s.x+120,s.y+5]];
    return[[s.x1||0,s.y1||0],[s.x2||0,s.y2||0]];
  });
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
  if(!xs.length) return "";
  const mx=Math.min(...xs)-30,my=Math.min(...ys)-30,Mx=Math.max(...xs)+30,My=Math.max(...ys)+30;
  const DIM="#333",REF="#555",GLASS="#1a4a6e",NOTE="#2d6a2d";
  const toStr=(s)=>{
    if(!s||!s.type) return "";
    if(s.type==="text") return `<text x="${s.x}" y="${s.y}" font-size="${s.size||11}" fill="${DIM}" font-family="monospace" font-weight="600">${s.text||""}</text>`;
    if(s.type==="nota") return `<text x="${s.x}" y="${s.y}" font-size="10" fill="${NOTE}" font-family="Arial" font-style="italic">${s.text||""}</text>`;
    if(s.type==="perf"){const r=s.r||15;return `<circle cx="${s.cx}" cy="${s.cy}" r="${r}" fill="none" stroke="#c62828" stroke-width="1.5"/><line x1="${s.cx-r-4}" y1="${s.cy}" x2="${s.cx+r+4}" y2="${s.cy}" stroke="#c62828" stroke-width="0.7" stroke-dasharray="3 2"/><line x1="${s.cx}" y1="${s.cy-r-4}" x2="${s.cx}" y2="${s.cy+r+4}" stroke="#c62828" stroke-width="0.7" stroke-dasharray="3 2"/><text x="${s.cx+r+6}" y="${s.cy-2}" font-size="9" fill="${DIM}" font-family="monospace" font-weight="700">⌀${r*2}</text>`;}
    if(s.type==="bisagra"){const rw=s.rw||12,hh=(s.h||46)/2,rh=rw;const p=`M ${s.cx-rw} ${s.cy-hh+rh} L ${s.cx-rw} ${s.cy+hh-rh} A ${rw} ${rh} 0 0 0 ${s.cx+rw} ${s.cy+hh-rh} L ${s.cx+rw} ${s.cy-hh+rh} A ${rw} ${rh} 0 0 0 ${s.cx-rw} ${s.cy-hh+rh} Z`;return `<path d="${p}" fill="none" stroke="#006064" stroke-width="1.8"/><line x1="${s.cx-4}" y1="${s.cy}" x2="${s.cx+4}" y2="${s.cy}" stroke="#006064" stroke-width="0.7"/><line x1="${s.cx}" y1="${s.cy-4}" x2="${s.cx}" y2="${s.cy+4}" stroke="#006064" stroke-width="0.7"/>`;}
    if(s.type==="vidrio"){const x=Math.min(s.x1,s.x2),y=Math.min(s.y1,s.y2),w=Math.abs(s.x2-s.x1),h=Math.abs(s.y2-s.y1);const tl=s.cornerTL||0,tr=s.cornerTR||0,br=s.cornerBR||0,bl=s.cornerBL||0;const d=`M ${x+tl} ${y} L ${x+w-tr} ${y} Q ${x+w} ${y} ${x+w} ${y+tr} L ${x+w} ${y+h-br} Q ${x+w} ${y+h} ${x+w-br} ${y+h} L ${x+bl} ${y+h} Q ${x} ${y+h} ${x} ${y+h-bl} L ${x} ${y+tl} Q ${x} ${y} ${x+tl} ${y} Z`;const satDef=s.satinado?`<defs><pattern id="sp${x}${y}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="${GLASS}" stroke-width="1" opacity="0.4"/></pattern></defs>`:"";const cp=`<defs><clipPath id="cp${x}${y}"><path d="${d}"/></clipPath></defs>`;const fill=s.satinado?`url(#sp${x}${y})`:"#e8f4ff";const lT=s.labelT?`<text x="${x+w/2}" y="${y-5}" text-anchor="middle" font-size="10" fill="${DIM}" font-family="monospace">${s.labelT}</text>`:"";const lB=s.labelB?`<text x="${x+w/2}" y="${y+h+13}" text-anchor="middle" font-size="10" fill="${DIM}" font-family="monospace">${s.labelB}</text>`:"";const lL=s.labelL?`<text x="${x-5}" y="${y+h/2}" text-anchor="end" dominant-baseline="middle" font-size="10" fill="${DIM}" font-family="monospace">${s.labelL}</text>`:"";const lR=s.labelR?`<text x="${x+w+5}" y="${y+h/2}" dominant-baseline="middle" font-size="10" fill="${DIM}" font-family="monospace">${s.labelR}</text>`:"";return `${satDef}${cp}<path d="${d}" fill="${fill}" stroke="${GLASS}" stroke-width="1.8"/><line x1="${x}" y1="${y}" x2="${x+w}" y2="${y+h}" stroke="${GLASS}" stroke-width="0.5" opacity="0.2" clip-path="url(#cp${x}${y})"/><line x1="${x+w}" y1="${y}" x2="${x}" y2="${y+h}" stroke="${GLASS}" stroke-width="0.5" opacity="0.2" clip-path="url(#cp${x}${y})"/>${s.satinado?`<text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" font-size="8" fill="${GLASS}" font-weight="700" opacity="0.6">SAT</text>`:""}${lT}${lB}${lL}${lR}`;}
    if(s.type==="cota"){const off=s.offset||18;const dx=s.x2-s.x1,dy=s.y2-s.y1;const len=Math.hypot(dx,dy);if(!len)return"";const px=-dy/len,py=dx/len;const ox1=s.x1+px*off,oy1=s.y1+py*off,ox2=s.x2+px*off,oy2=s.y2+py*off;const ux=dx/len,uy=dy/len,as=5;const lbl=s.label||(Math.round(len)+"");const ang=Math.atan2(dy,dx)*180/Math.PI;const mmx=(ox1+ox2)/2,mmy=(oy1+oy2)/2;return `<line x1="${s.x1+px*3}" y1="${s.y1+py*3}" x2="${ox1+px*3}" y2="${oy1+py*3}" stroke="${DIM}" stroke-width="0.8" stroke-dasharray="2 2"/><line x1="${s.x2+px*3}" y1="${s.y2+py*3}" x2="${ox2+px*3}" y2="${oy2+py*3}" stroke="${DIM}" stroke-width="0.8" stroke-dasharray="2 2"/><line x1="${ox1}" y1="${oy1}" x2="${ox2}" y2="${oy2}" stroke="${DIM}" stroke-width="1.2"/><polygon points="${ox1},${oy1} ${ox1+ux*as-uy*as*0.4},${oy1+uy*as+ux*as*0.4} ${ox1+ux*as+uy*as*0.4},${oy1+uy*as-ux*as*0.4}" fill="${DIM}"/><polygon points="${ox2},${oy2} ${ox2-ux*as-uy*as*0.4},${oy2-uy*as+ux*as*0.4} ${ox2-ux*as+uy*as*0.4},${oy2-uy*as-ux*as*0.4}" fill="${DIM}"/><text x="${mmx}" y="${mmy-4}" text-anchor="middle" font-size="10" fill="${DIM}" font-family="monospace" font-weight="700" transform="rotate(${ang},${mmx},${mmy})">${lbl}</text>`;}
    if(s.type==="linea"||s.type==="line") return `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="${REF}" stroke-width="1.5" stroke-linecap="round"/>${s.label?`<text x="${(s.x1+s.x2)/2}" y="${(s.y1+s.y2)/2-5}" text-anchor="middle" font-size="10" fill="${DIM}" font-family="monospace" transform="rotate(${Math.atan2(s.y2-s.y1,s.x2-s.x1)*180/Math.PI},${(s.x1+s.x2)/2},${(s.y1+s.y2)/2})">${s.label}</text>`:""}`;
    if(s.type==="linea_punteada") return `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="${REF}" stroke-width="1.2" stroke-dasharray="${s.dash||"6 4"}" stroke-linecap="round"/>${s.label?`<text x="${(s.x1+s.x2)/2}" y="${(s.y1+s.y2)/2-5}" text-anchor="middle" font-size="10" fill="${DIM}" font-family="monospace" transform="rotate(${Math.atan2(s.y2-s.y1,s.x2-s.x1)*180/Math.PI},${(s.x1+s.x2)/2},${(s.y1+s.y2)/2})">${s.label}</text>`:""}`;
    if(s.type==="arco"){const cx=(s.x1+s.x2)/2,cy=(s.y1+s.y2)/2,rx=Math.abs(s.x2-s.x1)/2,ry=Math.abs(s.y2-s.y1)/2;return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#e8f4ff" stroke="${GLASS}" stroke-width="1.8"/><text x="${cx+rx+5}" y="${cy}" dominant-baseline="middle" font-size="9" fill="${DIM}" font-family="monospace">R${Math.round(ry)}</text>`;}
    return "";
  };
  return `<svg viewBox="${mx} ${my} ${Mx-mx} ${My-my}" width="100%" style="max-height:260px;border:1.5px solid #1a4a6e;border-radius:4px;background:#f0f8ff;display:block">${shapes.map(toStr).join("")}</svg>`;
};
// ─── COTIZACION / ORDEN FORM ─────────────────────────────────────────────────
// ─── ITEM CANVAS PRO ─────────────────────────────────────────────────────────
const ItemCanvas=({value,onChange,label,itemIdx})=>{
  const svgRef=useRef(null);
  const [tool,setTool]=useState("select");
  const [shapes,setShapes]=useState(value||[]);
  const [drawing,setDrawing]=useState(null);
  const [selId,setSelId]=useState(null);
  const [drag,setDrag]=useState(null);
  const [open,setOpen]=useState(!!(value&&value.length));
  const [scale,setScale]=useState(1); // zoom
  const uid=()=>Math.random().toString(36).slice(2,8);
  const W=600,H=320,SNAP=5;
  const snap=v=>Math.round(v/SNAP)*SNAP;
  const commit=(sh)=>{setShapes(sh);onChange(sh);};

  const getPos=(e)=>{
    if(!svgRef.current)return{x:0,y:0};
    const r=svgRef.current.getBoundingClientRect();
    const sx=W/r.width,sy=H/r.height;
    const src=e.touches?e.touches[0]:e;
    const raw={x:(src.clientX-r.left)*sx,y:(src.clientY-r.top)*sy};
    return e.ctrlKey?raw:{x:snap(raw.x),y:snap(raw.y)};
  };

  const hitTest=(s,p)=>{
    if(s.type==="text"||s.type==="nota") return Math.abs(p.x-s.x)<40&&Math.abs(p.y-s.y)<14;
    if(s.type==="perf") return Math.hypot(p.x-s.cx,p.y-s.cy)<(s.r||15)+8;
    if(s.type==="bisagra"){const hw=s.rw||14,hh=(s.h||50)/2;return p.x>=s.cx-hw-8&&p.x<=s.cx+hw+8&&p.y>=s.cy-hh-8&&p.y<=s.cy+hh+8;}
    if(s.cx!=null) return Math.hypot(p.x-s.cx,p.y-s.cy)<20; // arc center
    if(s.type==="vidrio"||s.type==="poligono"){
      const x=Math.min(s.x1,s.x2),y=Math.min(s.y1,s.y2),w=Math.abs(s.x2-s.x1),h=Math.abs(s.y2-s.y1);
      return p.x>=x-5&&p.x<=x+w+5&&p.y>=y-5&&p.y<=y+h+5;
    }
    if(s.type==="cota"||s.type==="linea"||s.type==="linea_punteada"){
      const dx=s.x2-s.x1,dy=s.y2-s.y1,len=Math.hypot(dx,dy);
      if(!len)return false;
      const t=Math.max(0,Math.min(1,((p.x-s.x1)*dx+(p.y-s.y1)*dy)/(len*len)));
      return Math.hypot(p.x-s.x1-t*dx,p.y-s.y1-t*dy)<10;
    }
    return false;
  };

  const moveShape=(s,dx,dy)=>{
    if(s.type==="text"||s.type==="nota") return{...s,x:snap(s.x+dx),y:snap(s.y+dy)};
    if(s.cx!=null) return{...s,cx:snap(s.cx+dx),cy:snap(s.cy+dy)};
    return{...s,x1:snap(s.x1+dx),y1:snap(s.y1+dy),x2:snap(s.x2+dx),y2:snap(s.y2+dy)};
  };

  const onDown=(e)=>{
    e.preventDefault();
    const p=getPos(e);
    if(tool==="select"){
      const hit=[...shapes].reverse().find(s=>hitTest(s,p));
      if(hit){setSelId(hit.id);setDrag({id:hit.id,px:p.x,py:p.y,orig:shapes.map(s=>({...s}))});}
      else setSelId(null);
      return;
    }
    // Click-place tools
    if(tool==="bisagra"){commit([...shapes,{id:uid(),type:"bisagra",cx:p.x,cy:p.y,rw:12,h:46}]);return;}
    if(tool==="perf"){const d=window.prompt("Diámetro (mm)","30");if(d){commit([...shapes,{id:uid(),type:"perf",cx:p.x,cy:p.y,r:Math.max(4,+d/2)||15}]);}return;}
    if(tool==="text"){const t=window.prompt("Texto:");if(t)commit([...shapes,{id:uid(),type:"text",x:p.x,y:p.y,text:t,size:11}]);return;}
    if(tool==="nota"){const t=window.prompt("Anotación:");if(t)commit([...shapes,{id:uid(),type:"nota",x:p.x,y:p.y,text:t}]);return;}
    // Drag-draw tools
    setDrawing({id:uid(),type:tool,x1:p.x,y1:p.y,x2:p.x,y2:p.y,
      ...(tool==="vidrio"?{cornerTL:0,cornerTR:0,cornerBR:0,cornerBL:0,satinado:false,labelT:"",labelB:"",labelL:"",labelR:""}:{}),
      ...(tool==="cota"?{label:"",offset:18}:{}),
      ...(tool==="linea_punteada"?{label:"",dash:"6 4"}:{}),
      ...(tool==="arco"?{}:{}),
    });
  };

  const onMove=(e)=>{
    if(!drawing&&!drag)return;
    e.preventDefault();
    const p=getPos(e);
    if(drawing){setDrawing(d=>({...d,x2:p.x,y2:p.y}));return;}
    if(drag){
      const dx=p.x-drag.px,dy=p.y-drag.py;
      commit(drag.orig.map(s=>s.id===drag.id?moveShape(s,dx,dy):s));
    }
  };

  const onUp=()=>{
    if(drawing){
      const min=tool==="perf"?0:8;
      if(Math.abs(drawing.x2-drawing.x1)>min||Math.abs(drawing.y2-drawing.y1)>min)commit([...shapes,drawing]);
      setDrawing(null);
    }
    setDrag(null);
  };

  const selShape=shapes.find(s=>s.id===selId);
  const updateSel=(k,v)=>commit(shapes.map(s=>s.id===selId?{...s,[k]:v}:s));

  // ── COLORS ─────────────────────────────────────────────────────────────────
  const C={
    glass:"#4dd0e1",      // cyan for glass outlines
    dim:"#ffd740",        // yellow for dimensions/cotas
    ref:"#6a9fb5",        // blue-grey for reference lines
    note:"#a5d6a7",       // green for notes
    bisagra:"#80cbc4",    // teal for bisagras
    perf:"#ef9a9a",       // red for perforations
    sel:"#ff9500",        // orange for selected
    ghost:"#00bfff",      // light blue for drawing preview
    sat:"rgba(77,208,225,0.18)",
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  const renderShape=(s,ghost)=>{
    const sel=!ghost&&selId===s.id;
    const sw=sel?2.2:1.6;
    const onClick=ghost?undefined:()=>{if(tool==="select")setSelId(sel?null:s.id);};
    const cur=tool==="select"?"pointer":"crosshair";
    const selBox=(x,y,w,h)=>sel?<rect x={x-4} y={y-4} width={w+8} height={h+8} fill="none" stroke={C.sel} strokeWidth="1" strokeDasharray="4 2" rx="2"/>:null;

    // ── TEXT / NOTA ──────────────────────────────────────────────────────────
    if(s.type==="text") return(
      <text key={s.id} x={s.x} y={s.y} fontSize={s.size||11}
        fill={sel?C.sel:C.dim} fontFamily="monospace" fontWeight="600"
        style={{cursor:cur,userSelect:"none"}} onClick={onClick}>{s.text}</text>
    );
    if(s.type==="nota") return(
      <g key={s.id} onClick={onClick} style={{cursor:cur}}>
        <text x={s.x} y={s.y} fontSize="10" fill={sel?C.sel:C.note} fontFamily="Arial" fontStyle="italic">{s.text}</text>
        {sel&&<line x1={s.x-2} y1={s.y+2} x2={s.x+(s.text?.length||0)*6} y2={s.y+2} stroke={C.sel} strokeWidth="0.5"/>}
      </g>
    );

    // ── PERFORACIÓN ──────────────────────────────────────────────────────────
    if(s.type==="perf"){
      const r=s.r||15;
      return(
        <g key={s.id} style={{cursor:cur}} onClick={onClick}>
          <circle cx={s.cx} cy={s.cy} r={r} fill="none" stroke={sel?C.sel:C.perf} strokeWidth={sw}/>
          {/* crosshairs */}
          <line x1={s.cx-r-4} y1={s.cy} x2={s.cx+r+4} y2={s.cy} stroke={sel?C.sel:C.perf} strokeWidth="0.8" strokeDasharray="3 2"/>
          <line x1={s.cx} y1={s.cy-r-4} x2={s.cx} y2={s.cy+r+4} stroke={sel?C.sel:C.perf} strokeWidth="0.8" strokeDasharray="3 2"/>
          {/* diameter label */}
          <text x={s.cx+r+6} y={s.cy-2} fontSize="9" fill={C.dim} fontFamily="monospace" fontWeight="700">⌀{r*2}</text>
        </g>
      );
    }

    // ── BISAGRA ──────────────────────────────────────────────────────────────
    if(s.type==="bisagra"){
      const rw=s.rw||12,hh=(s.h||46)/2,rh=rw;
      const path=`M ${s.cx-rw} ${s.cy-hh+rh} L ${s.cx-rw} ${s.cy+hh-rh} A ${rw} ${rh} 0 0 0 ${s.cx+rw} ${s.cy+hh-rh} L ${s.cx+rw} ${s.cy-hh+rh} A ${rw} ${rh} 0 0 0 ${s.cx-rw} ${s.cy-hh+rh} Z`;
      return(
        <g key={s.id} style={{cursor:cur}} onClick={onClick}>
          <path d={path} fill="none" stroke={sel?C.sel:C.bisagra} strokeWidth={sw}/>
          {/* center mark */}
          <line x1={s.cx-4} y1={s.cy} x2={s.cx+4} y2={s.cy} stroke={sel?C.sel:C.bisagra} strokeWidth="0.8"/>
          <line x1={s.cx} y1={s.cy-4} x2={s.cx} y2={s.cy+4} stroke={sel?C.sel:C.bisagra} strokeWidth="0.8"/>
          {sel&&<rect x={s.cx-rw-5} y={s.cy-hh-5} width={rw*2+10} height={s.h+10} fill="none" stroke={C.sel} strokeWidth="1" strokeDasharray="3 2"/>}
        </g>
      );
    }

    // ── VIDRIO ───────────────────────────────────────────────────────────────
    if(s.type==="vidrio"){
      const x=Math.min(s.x1,s.x2),y=Math.min(s.y1,s.y2);
      const w=Math.abs(s.x2-s.x1),h=Math.abs(s.y2-s.y1);
      if(w<4||h<4) return null;
      const tl=s.cornerTL||0,tr=s.cornerTR||0,br=s.cornerBR||0,bl=s.cornerBL||0;
      const d=`M ${x+tl} ${y} L ${x+w-tr} ${y} Q ${x+w} ${y} ${x+w} ${y+tr} L ${x+w} ${y+h-br} Q ${x+w} ${y+h} ${x+w-br} ${y+h} L ${x+bl} ${y+h} Q ${x} ${y+h} ${x} ${y+h-bl} L ${x} ${y+tl} Q ${x} ${y} ${x+tl} ${y} Z`;
      const fillC=s.satinado?`url(#sat${s.id})`:"rgba(0,40,60,0.45)";
      const sc=sel?C.sel:C.glass;
      // Side labels
      const labels=[];
      if(s.labelT) labels.push(<text key="lt" x={x+w/2} y={y-5} textAnchor="middle" fontSize="10" fill={C.dim} fontFamily="monospace">{s.labelT}</text>);
      if(s.labelB) labels.push(<text key="lb" x={x+w/2} y={y+h+13} textAnchor="middle" fontSize="10" fill={C.dim} fontFamily="monospace">{s.labelB}</text>);
      if(s.labelL) labels.push(<text key="ll" x={x-5} y={y+h/2} textAnchor="end" dominantBaseline="middle" fontSize="10" fill={C.dim} fontFamily="monospace">{s.labelL}</text>);
      if(s.labelR) labels.push(<text key="lr" x={x+w+5} y={y+h/2} dominantBaseline="middle" fontSize="10" fill={C.dim} fontFamily="monospace">{s.labelR}</text>);
      return(
        <g key={s.id} style={{cursor:cur}} onClick={onClick}>
          {s.satinado&&<defs><pattern id={`sat${s.id}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke={C.glass} strokeWidth="1" opacity="0.3"/></pattern></defs>}
          <path d={d} fill={fillC} stroke={sc} strokeWidth={sw}/>
          {/* diagonal hatch lines to indicate glass */}
          <clipPath id={`cp${s.id}`}><path d={d}/></clipPath>
          <line x1={x} y1={y} x2={x+w} y2={y+h} stroke={sc} strokeWidth="0.4" opacity="0.2" clipPath={`url(#cp${s.id})`}/>
          <line x1={x+w} y1={y} x2={x} y2={y+h} stroke={sc} strokeWidth="0.4" opacity="0.2" clipPath={`url(#cp${s.id})`}/>
          {s.satinado&&<text x={x+w/2} y={y+h/2+4} textAnchor="middle" fontSize="8" fill={C.glass} fontFamily="monospace" opacity="0.7">SAT</text>}
          {labels}
        </g>
      );
    }

    // ── COTA (dimension line with arrows) ────────────────────────────────────
    if(s.type==="cota"){
      const off=s.offset||18;
      const dx=s.x2-s.x1,dy=s.y2-s.y1;
      const len=Math.hypot(dx,dy);
      if(len<4) return null;
      // perpendicular direction
      const px=-dy/len,py=dx/len;
      // offset points
      const ox1=s.x1+px*off,oy1=s.y1+py*off;
      const ox2=s.x2+px*off,oy2=s.y2+py*off;
      // arrow size
      const as=5;
      const ux=dx/len,uy=dy/len;
      const sc=sel?C.sel:C.dim;
      const lbl=s.label||(Math.round(len)+"");
      return(
        <g key={s.id} style={{cursor:cur}} onClick={onClick}>
          {/* extension lines */}
          <line x1={s.x1+px*3} y1={s.y1+py*3} x2={ox1+px*3} y2={oy1+py*3} stroke={sc} strokeWidth="0.8" strokeDasharray="2 2"/>
          <line x1={s.x2+px*3} y1={s.y2+py*3} x2={ox2+px*3} y2={oy2+py*3} stroke={sc} strokeWidth="0.8" strokeDasharray="2 2"/>
          {/* dimension line */}
          <line x1={ox1} y1={oy1} x2={ox2} y2={oy2} stroke={sc} strokeWidth="1.2"/>
          {/* arrowheads */}
          <polygon points={`${ox1},${oy1} ${ox1+ux*as-uy*as*0.4},${oy1+uy*as+ux*as*0.4} ${ox1+ux*as+uy*as*0.4},${oy1+uy*as-ux*as*0.4}`} fill={sc}/>
          <polygon points={`${ox2},${oy2} ${ox2-ux*as-uy*as*0.4},${oy2-uy*as+ux*as*0.4} ${ox2-ux*as+uy*as*0.4},${oy2-uy*as-ux*as*0.4}`} fill={sc}/>
          {/* label */}
          <text x={(ox1+ox2)/2} y={(oy1+oy2)/2-4} textAnchor="middle" fontSize="10" fill={sc} fontFamily="monospace" fontWeight="700"
            transform={`rotate(${Math.atan2(dy,dx)*180/Math.PI},${(ox1+ox2)/2},${(oy1+oy2)/2})`}>{lbl}</text>
        </g>
      );
    }

    // ── LÍNEA RECTA ──────────────────────────────────────────────────────────
    if(s.type==="linea"){
      const sc=sel?C.sel:C.ref;
      const dx=s.x2-s.x1,dy=s.y2-s.y1;
      const mx=(s.x1+s.x2)/2,my=(s.y1+s.y2)/2;
      return(
        <g key={s.id} style={{cursor:cur}} onClick={onClick}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={sc} strokeWidth={sw} strokeLinecap="round"/>
          {s.label&&<text x={mx} y={my-5} textAnchor="middle" fontSize="10" fill={C.dim} fontFamily="monospace"
            transform={`rotate(${Math.atan2(dy,dx)*180/Math.PI},${mx},${my})`}>{s.label}</text>}
        </g>
      );
    }

    // ── LÍNEA PUNTEADA ───────────────────────────────────────────────────────
    if(s.type==="linea_punteada"){
      const sc=sel?C.sel:C.ref;
      const dx=s.x2-s.x1,dy=s.y2-s.y1;
      const mx=(s.x1+s.x2)/2,my=(s.y1+s.y2)/2;
      const dash=s.dash||"6 4";
      return(
        <g key={s.id} style={{cursor:cur}} onClick={onClick}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={sc} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round"/>
          {s.label&&<text x={mx} y={my-5} textAnchor="middle" fontSize="10" fill={C.dim} fontFamily="monospace"
            transform={`rotate(${Math.atan2(dy,dx)*180/Math.PI},${mx},${my})`}>{s.label}</text>}
        </g>
      );
    }

    // ── ARCO ─────────────────────────────────────────────────────────────────
    if(s.type==="arco"){
      const sc=sel?C.sel:C.glass;
      const cx=(s.x1+s.x2)/2,cy=(s.y1+s.y2)/2;
      const rx=Math.abs(s.x2-s.x1)/2,ry=Math.abs(s.y2-s.y1)/2;
      if(rx<2||ry<2) return null;
      return(
        <g key={s.id} style={{cursor:cur}} onClick={onClick}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(0,40,60,0.3)" stroke={sc} strokeWidth={sw}/>
          {/* center marks */}
          <line x1={cx-4} y1={cy} x2={cx+4} y2={cy} stroke={sc} strokeWidth="0.6"/>
          <line x1={cx} y1={cy-4} x2={cx} y2={cy+4} stroke={sc} strokeWidth="0.6"/>
          <text x={cx+rx+5} y={cy} dominantBaseline="middle" fontSize="9" fill={C.dim} fontFamily="monospace">R{Math.round(ry)}</text>
        </g>
      );
    }

    // fallback
    return null;
  };

  // ── PDF SVG STRING ──────────────────────────────────────────────────────────
  const shapeToStr=(s)=>{
    const DIM="#333",REF="#555",GLASS="#1a4a6e",NOTE="#2d6a2d";
    if(s.type==="text") return `<text x="${s.x}" y="${s.y}" font-size="${s.size||11}" fill="${DIM}" font-family="monospace" font-weight="600">${s.text}</text>`;
    if(s.type==="nota") return `<text x="${s.x}" y="${s.y}" font-size="10" fill="${NOTE}" font-family="Arial" font-style="italic">${s.text}</text>`;
    if(s.type==="perf"){const r=s.r||15;return `<circle cx="${s.cx}" cy="${s.cy}" r="${r}" fill="none" stroke="#c62828" stroke-width="1.5"/><line x1="${s.cx-r-4}" y1="${s.cy}" x2="${s.cx+r+4}" y2="${s.cy}" stroke="#c62828" stroke-width="0.7" stroke-dasharray="3 2"/><line x1="${s.cx}" y1="${s.cy-r-4}" x2="${s.cx}" y2="${s.cy+r+4}" stroke="#c62828" stroke-width="0.7" stroke-dasharray="3 2"/><text x="${s.cx+r+6}" y="${s.cy-2}" font-size="9" fill="${DIM}" font-family="monospace" font-weight="700">⌀${r*2}</text>`;}
    if(s.type==="bisagra"){const rw=s.rw||12,hh=(s.h||46)/2,rh=rw;const p=`M ${s.cx-rw} ${s.cy-hh+rh} L ${s.cx-rw} ${s.cy+hh-rh} A ${rw} ${rh} 0 0 0 ${s.cx+rw} ${s.cy+hh-rh} L ${s.cx+rw} ${s.cy-hh+rh} A ${rw} ${rh} 0 0 0 ${s.cx-rw} ${s.cy-hh+rh} Z`;return `<path d="${p}" fill="none" stroke="#006064" stroke-width="1.8"/><line x1="${s.cx-4}" y1="${s.cy}" x2="${s.cx+4}" y2="${s.cy}" stroke="#006064" stroke-width="0.7"/><line x1="${s.cx}" y1="${s.cy-4}" x2="${s.cx}" y2="${s.cy+4}" stroke="#006064" stroke-width="0.7"/>`;}
    if(s.type==="vidrio"){
      const x=Math.min(s.x1,s.x2),y=Math.min(s.y1,s.y2),w=Math.abs(s.x2-s.x1),h=Math.abs(s.y2-s.y1);
      const tl=s.cornerTL||0,tr=s.cornerTR||0,br=s.cornerBR||0,bl=s.cornerBL||0;
      const d=`M ${x+tl} ${y} L ${x+w-tr} ${y} Q ${x+w} ${y} ${x+w} ${y+tr} L ${x+w} ${y+h-br} Q ${x+w} ${y+h} ${x+w-br} ${y+h} L ${x+bl} ${y+h} Q ${x} ${y+h} ${x} ${y+h-bl} L ${x} ${y+tl} Q ${x} ${y} ${x+tl} ${y} Z`;
      const satDef=s.satinado?`<defs><pattern id="sp${x}${y}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="${GLASS}" stroke-width="1" opacity="0.4"/></pattern></defs>`:"";
      const fill=s.satinado?`url(#sp${x}${y})`:"#e8f4ff";
      const lT=s.labelT?`<text x="${x+w/2}" y="${y-5}" text-anchor="middle" font-size="10" fill="${DIM}" font-family="monospace">${s.labelT}</text>`:"";
      const lB=s.labelB?`<text x="${x+w/2}" y="${y+h+13}" text-anchor="middle" font-size="10" fill="${DIM}" font-family="monospace">${s.labelB}</text>`:"";
      const lL=s.labelL?`<text x="${x-5}" y="${y+h/2}" text-anchor="end" dominant-baseline="middle" font-size="10" fill="${DIM}" font-family="monospace">${s.labelL}</text>`:"";
      const lR=s.labelR?`<text x="${x+w+5}" y="${y+h/2}" dominant-baseline="middle" font-size="10" fill="${DIM}" font-family="monospace">${s.labelR}</text>`:"";
      const diag1=`<line x1="${x}" y1="${y}" x2="${x+w}" y2="${y+h}" stroke="${GLASS}" stroke-width="0.5" opacity="0.25" clip-path="url(#cp${x}${y})"/>`;
      const diag2=`<line x1="${x+w}" y1="${y}" x2="${x}" y2="${y+h}" stroke="${GLASS}" stroke-width="0.5" opacity="0.25" clip-path="url(#cp${x}${y})"/>`;
      const cp=`<clipPath id="cp${x}${y}"><path d="${d}"/></clipPath>`;
      return `${satDef}<defs>${cp}</defs><path d="${d}" fill="${fill}" stroke="${GLASS}" stroke-width="1.8"/>${diag1}${diag2}${s.satinado?`<text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" font-size="8" fill="${GLASS}" font-weight="700" opacity="0.6">SAT</text>`:""}${lT}${lB}${lL}${lR}`;}
    if(s.type==="cota"){
      const off=s.offset||18;const dx=s.x2-s.x1,dy=s.y2-s.y1;const len=Math.hypot(dx,dy);if(!len)return"";
      const px=-dy/len,py=dx/len;
      const ox1=s.x1+px*off,oy1=s.y1+py*off,ox2=s.x2+px*off,oy2=s.y2+py*off;
      const ux=dx/len,uy=dy/len,as=5;
      const lbl=s.label||(Math.round(len)+"");
      const ang=Math.atan2(dy,dx)*180/Math.PI;
      const mx=(ox1+ox2)/2,my=(oy1+oy2)/2;
      return `<line x1="${s.x1+px*3}" y1="${s.y1+py*3}" x2="${ox1+px*3}" y2="${oy1+py*3}" stroke="${DIM}" stroke-width="0.8" stroke-dasharray="2 2"/><line x1="${s.x2+px*3}" y1="${s.y2+py*3}" x2="${ox2+px*3}" y2="${oy2+py*3}" stroke="${DIM}" stroke-width="0.8" stroke-dasharray="2 2"/><line x1="${ox1}" y1="${oy1}" x2="${ox2}" y2="${oy2}" stroke="${DIM}" stroke-width="1.2"/><polygon points="${ox1},${oy1} ${ox1+ux*as-uy*as*0.4},${oy1+uy*as+ux*as*0.4} ${ox1+ux*as+uy*as*0.4},${oy1+uy*as-ux*as*0.4}" fill="${DIM}"/><polygon points="${ox2},${oy2} ${ox2-ux*as-uy*as*0.4},${oy2-uy*as+ux*as*0.4} ${ox2-ux*as+uy*as*0.4},${oy2-uy*as-ux*as*0.4}" fill="${DIM}"/><text x="${mx}" y="${my-4}" text-anchor="middle" font-size="10" fill="${DIM}" font-family="monospace" font-weight="700" transform="rotate(${ang},${mx},${my})">${lbl}</text>`;}
    if(s.type==="linea") return `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="${REF}" stroke-width="1.5" stroke-linecap="round"/>${s.label?`<text x="${(s.x1+s.x2)/2}" y="${(s.y1+s.y2)/2-5}" text-anchor="middle" font-size="10" fill="${DIM}" font-family="monospace" transform="rotate(${Math.atan2(s.y2-s.y1,s.x2-s.x1)*180/Math.PI},${(s.x1+s.x2)/2},${(s.y1+s.y2)/2})">${s.label}</text>`:""}`;
    if(s.type==="linea_punteada") return `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="${REF}" stroke-width="1.2" stroke-dasharray="${s.dash||"6 4"}" stroke-linecap="round"/>${s.label?`<text x="${(s.x1+s.x2)/2}" y="${(s.y1+s.y2)/2-5}" text-anchor="middle" font-size="10" fill="${DIM}" font-family="monospace" transform="rotate(${Math.atan2(s.y2-s.y1,s.x2-s.x1)*180/Math.PI},${(s.x1+s.x2)/2},${(s.y1+s.y2)/2})">${s.label}</text>`:""}`;
    if(s.type==="arco"){const cx=(s.x1+s.x2)/2,cy=(s.y1+s.y2)/2,rx=Math.abs(s.x2-s.x1)/2,ry=Math.abs(s.y2-s.y1)/2;return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#e8f4ff" stroke="${GLASS}" stroke-width="1.8"/><text x="${cx+rx+5}" y="${cy}" dominant-baseline="middle" font-size="9" fill="${DIM}" font-family="monospace">R${Math.round(ry)}</text>`;}
    return "";
  };

  const getSVGForPDF=()=>{
    if(!shapes.length)return"";
    const pts=shapes.flatMap(s=>{
      if(s.cx!=null){const rw=s.rw||s.r||20,rh=(s.h||rw*2)/2;return[[s.cx-rw-20,s.cy-rh-20],[s.cx+rw+20,s.cy+rh+20]];}
      if(s.x!=null&&!s.x1!=null)return[[s.x-10,s.y-10],[s.x+100,s.y+10]];
      return[[s.x1||0,s.y1||0],[s.x2||0,s.y2||0]];
    });
    const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
    if(!xs.length)return"";
    const mx=Math.min(...xs)-30,my=Math.min(...ys)-30,Mx=Math.max(...xs)+30,My=Math.max(...ys)+30;
    return `<svg viewBox="${mx} ${my} ${Mx-mx} ${My-my}" width="100%" style="max-height:220px;border:1.5px solid #1a4a6e;border-radius:4px;background:#f0f8ff;display:block">${shapes.map(shapeToStr).join("")}</svg>`;
  };

  const printPlano=()=>{
    if(!shapes.length){alert("El plano está vacío.");return;}
    const svgStr=getSVGForPDF().replace('style="max-height:220px;border:1.5px solid #1a4a6e;border-radius:4px;background:#f0f8ff;display:block"','style="max-height:80vh;border:2px solid #1a4a6e;border-radius:6px;background:#f0f8ff;display:block;width:100%"');
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Plano Técnico</title><style>body{margin:16px 20px;font-family:Arial,sans-serif}h2{color:#1a4a6e;margin-bottom:4px;font-size:15px;font-weight:700}p{color:#555;font-size:11px;margin-bottom:14px}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:8mm}}</style></head><body><h2>Plano Técnico — La Vidriería Rosario</h2><p>${label||""}</p>${svgStr}</body></html>`;
    const w=window.open("","_blank","width=860,height=720");
    if(w){w.document.write(html);w.document.close();w.onload=()=>{w.focus();w.print();};}
  };

  // ── TOOLS ──────────────────────────────────────────────────────────────────
  const TOOL_GROUPS=[
    {label:"SELECCIÓN",tools:[{id:"select",label:"↖",tip:"Seleccionar y mover"}]},
    {label:"VIDRIO",tools:[
      {id:"vidrio",label:"▭",tip:"Rectángulo de vidrio"},
      {id:"arco",label:"◯",tip:"Arco / forma curva / círculo"},
    ]},
    {label:"ENTRANTES",tools:[
      {id:"bisagra",label:"⊢",tip:"Bisagra (entrante con puntas semicirculares)"},
      {id:"perf",label:"⊙",tip:"Perforación circular"},
    ]},
    {label:"COTAS",tools:[
      {id:"cota",label:"↔",tip:"Cota con flechas y medida (mm)"},
      {id:"linea",label:"—",tip:"Línea recta de referencia"},
      {id:"linea_punteada",label:"╌",tip:"Línea punteada de referencia"},
    ]},
    {label:"TEXTO",tools:[
      {id:"text",label:"123",tip:"Medida o número"},
      {id:"nota",label:"abc",tip:"Nota o anotación"},
    ]},
  ];

  const btnS=(active)=>({
    padding:"4px 8px",borderRadius:5,
    border:`1px solid ${active?"#4dd0e1":"#21262d"}`,
    background:active?"rgba(77,208,225,0.15)":"transparent",
    color:active?"#4dd0e1":"#6a9fb5",
    cursor:"pointer",fontSize:11,fontFamily:"monospace",fontWeight:active?700:400,
    minWidth:28,textAlign:"center",
  });

  // ── PROPERTIES PANEL ───────────────────────────────────────────────────────
  const PropsPanel=()=>{
    if(!selShape)return null;
    const inp=(k,opts={})=>(
      <input type={opts.type||"text"} value={selShape[k]||""} onChange={e=>updateSel(k,opts.num?+e.target.value:e.target.value)}
        placeholder={opts.ph||""}
        style={{background:"#0d1117",border:"1px solid #30363d",borderRadius:4,color:"#c8e0f8",padding:"2px 6px",fontSize:10,fontFamily:"monospace",width:opts.w||60}}/>
    );
    const rng=(k,min,max,lbl)=>(
      <label style={{display:"flex",alignItems:"center",gap:4,color:"#6a9fb5",fontSize:10}}>
        <span>{lbl}</span>
        <input type="range" min={min} max={max} value={selShape[k]||min} onChange={e=>updateSel(k,+e.target.value)} style={{width:60,accentColor:"#4dd0e1"}}/>
        <span style={{color:"#4dd0e1",minWidth:22}}>{selShape[k]||min}</span>
      </label>
    );
    return(
      <div style={{display:"flex",flexWrap:"wrap",gap:6,padding:"6px 10px",background:"#161b22",borderRadius:7,marginBottom:6,alignItems:"center",fontSize:10,border:"1px solid #21262d"}}>
        <span style={{color:"#ffd740",fontWeight:700,fontSize:9,textTransform:"uppercase",letterSpacing:1}}>{selShape.type}</span>

        {selShape.type==="vidrio"&&<>
          <span style={{color:"#6a9fb5"}}>mm por lado:</span>
          {[["↑",  "labelT"],["↓","labelB"],["←","labelL"],["→","labelR"]].map(([ic,k])=>(
            <label key={k} style={{display:"flex",alignItems:"center",gap:2,color:"#6a9fb5"}}>
              <span style={{fontSize:10}}>{ic}</span>{inp(k,{w:48,ph:"mm"})}
            </label>
          ))}
          <span style={{color:"#6a9fb5"}}>Esquinas:</span>
          {[["↖","cornerTL"],["↗","cornerTR"],["↘","cornerBR"],["↙","cornerBL"]].map(([ic,k])=>(
            <label key={k} style={{display:"flex",alignItems:"center",gap:2,color:"#6a9fb5"}}>
              <span>{ic}</span>{inp(k,{type:"number",num:true,w:32,ph:"0"})}
            </label>
          ))}
          <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",color:selShape.satinado?"#4dd0e1":"#6a9fb5"}}>
            <input type="checkbox" checked={!!selShape.satinado} onChange={e=>updateSel("satinado",e.target.checked)} style={{accentColor:"#4dd0e1"}}/>
            <span>Satinado</span>
          </label>
        </>}

        {selShape.type==="bisagra"&&<>{rng("rw",6,30,"Ancho")}{rng("h",20,120,"Alto")}</>}
        {selShape.type==="perf"&&<>{rng("r",4,60,"Radio")}<span style={{color:"#4dd0e1"}}>⌀{(selShape.r||15)*2}mm</span></>}

        {(selShape.type==="cota")&&<>
          <span style={{color:"#6a9fb5"}}>Medida:</span>{inp("label",{w:50,ph:"auto"})}
          {rng("offset",8,50,"Offset")}
        </>}
        {(selShape.type==="linea"||selShape.type==="linea_punteada")&&<>
          <span style={{color:"#6a9fb5"}}>Texto:</span>{inp("label",{w:70,ph:"(opcional)"})}
          {selShape.type==="linea_punteada"&&<><span style={{color:"#6a9fb5"}}>Trazo:</span>
            <select value={selShape.dash||"6 4"} onChange={e=>updateSel("dash",e.target.value)}
              style={{background:"#0d1117",border:"1px solid #30363d",color:"#c8e0f8",borderRadius:4,fontSize:10,padding:"2px 4px"}}>
              <option value="6 4">Normal — — —</option>
              <option value="2 3">Fino ··· </option>
              <option value="8 3 2 3">Mixto — · —</option>
              <option value="1 4">Punteado · · ·</option>
            </select>
          </>}
        </>}
        {(selShape.type==="text")&&<>
          <span style={{color:"#6a9fb5"}}>Texto:</span>
          <input value={selShape.text||""} onChange={e=>updateSel("text",e.target.value)}
            style={{background:"#0d1117",border:"1px solid #30363d",borderRadius:4,color:"#c8e0f8",padding:"2px 6px",fontSize:10,fontFamily:"monospace",width:80}}/>
          {rng("size",7,18,"Tamaño")}
        </>}
        {(selShape.type==="nota")&&<>
          <span style={{color:"#6a9fb5"}}>Nota:</span>
          <input value={selShape.text||""} onChange={e=>updateSel("text",e.target.value)}
            style={{background:"#0d1117",border:"1px solid #30363d",borderRadius:4,color:"#a5d6a7",padding:"2px 6px",fontSize:10,flex:1,minWidth:100}}/>
        </>}

        <button onClick={()=>{commit(shapes.filter(s=>s.id!==selId));setSelId(null);}}
          style={{marginLeft:"auto",padding:"2px 8px",borderRadius:4,border:"1px solid #7f2020",background:"#1a0808",color:"#f48fb1",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>✕</button>
      </div>
    );
  };

  if(!open) return(
    <button onClick={()=>setOpen(true)} style={{width:"100%",marginTop:6,padding:"5px 0",background:"transparent",border:"1px dashed #21262d",borderRadius:6,color:"#4a6a7a",cursor:"pointer",fontSize:10,fontFamily:"monospace",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
      ✏ {shapes.length>0?`Plano técnico (${shapes.length})`:"+ Plano técnico"}
    </button>
  );

  return(
    <div style={{marginTop:8,background:"#0d1117",borderRadius:9,padding:10,border:"1px solid #21262d"}}>
      {/* TOOLBAR */}
      <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
        {TOOL_GROUPS.map(g=>(
          <div key={g.label} style={{display:"flex",gap:2,alignItems:"center"}}>
            <span style={{fontSize:8,color:"#30363d",marginRight:2,fontFamily:"monospace"}}>{g.label}</span>
            {g.tools.map(t=>(
              <button key={t.id} onClick={()=>setTool(t.id)} title={t.tip} style={btnS(tool===t.id)}>{t.label}</button>
            ))}
          </div>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:3}}>
          {shapes.length>0&&<><button onClick={()=>{if(window.confirm("¿Limpiar?"))commit([]);setSelId(null);}} style={{...btnS(false),color:"#5a3a3a"}}>Limpiar</button>
          <button onClick={printPlano} style={{...btnS(false),border:"1px solid #26A69A",color:"#26A69A",fontWeight:700}}>🖨</button></>}
          <button onClick={()=>setOpen(false)} style={btnS(false)}>▲</button>
        </div>
      </div>

      {/* PROPS */}
      <PropsPanel/>

      {/* CANVAS */}
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`}
        style={{display:"block",background:"#0d1117",borderRadius:6,border:"1px solid #21262d",cursor:tool==="select"?"default":"crosshair",touchAction:"none",minHeight:200}}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
        <defs>
          <pattern id={`mn${itemIdx||0}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#161b22" strokeWidth="0.5"/>
          </pattern>
          <pattern id={`mj${itemIdx||0}`} width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill={`url(#mn${itemIdx||0})`}/>
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1c2631" strokeWidth="0.8"/>
          </pattern>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#ffd740"/>
          </marker>
        </defs>
        <rect width={W} height={H} fill={`url(#mj${itemIdx||0})`}/>
        {shapes.map(s=>renderShape(s,false))}
        {drawing&&renderShape(drawing,true)}
      </svg>

      {/* HINT */}
      <div style={{fontSize:9,color:"#30363d",marginTop:3,display:"flex",justifyContent:"space-between",fontFamily:"monospace"}}>
        <span style={{color:"#21262d"}}>Ctrl = sin snap</span>
        <span>
          {tool==="select"&&"↖ Click selecciona · Arrastrá mueve"}
          {tool==="vidrio"&&"▭ Arrastrá para dibujar el vidrio · Ctrl = libre"}
          {tool==="arco"&&"◯ Arrastrá para dibujar arco/elipse"}
          {tool==="bisagra"&&"⊢ Click para colocar bisagra"}
          {tool==="perf"&&"⊙ Click para colocar perforación"}
          {tool==="cota"&&"↔ Arrastrá para cotar una medida en mm"}
          {tool==="linea"&&"— Arrastrá para trazar línea de referencia"}
          {tool==="linea_punteada"&&"╌ Arrastrá para trazar línea de referencia punteada"}
          {tool==="text"&&"123 Click para agregar número o medida"}
          {tool==="nota"&&"abc Click para agregar anotación"}
        </span>
      </div>
    </div>
  );
};


const MiniCanvas=({value,onChange})=><ItemCanvas value={value} onChange={onChange} label="Plano general" itemIdx={0}/>;

const DocForm=({doc,modo,clientes,tiposVidrio,obsOpciones,serviciosOpciones,estados,onSave,onClose,onConvertir})=>{
  // modo = "cotizacion" | "orden"
  const nid=()=>Math.random().toString(36).slice(2,8);
  const hoy=new Date().toISOString().split("T")[0];

  const emptyItem=()=>({id:nid(),cant:1,tipo_vidrio:"",ancho:"",alto:"",obs:[],servicio:"",colocacion:"con_colocacion",precio:"",plano:[]});

  const EMPTY={
    cliente:"",contacto_nombre:"",contacto_tel:"",contacto_dom:"",
    fecha:hoy,estado:"presupuesto",
    items:[emptyItem()],
    condiciones:"50% al confirmar, saldo contra entrega.",
    pago_senia:"",pago_senia_fecha:"",pago_senia_metodo:"efectivo",
    pago_saldo:"",pago_total:"",
    pagos_parciales:[],
    abonado_completo:false,pago_final_monto:"",pago_final_fecha:"",pago_final_metodo:"efectivo",
    comp_senia:[],comp_final:[],
    equipo_asignado:"",
    incidencias:[],
    inst_notas:"",inst_fecha:"",inst_direccion:"",inst_responsable:"",inst_firmante:"",
    fotos_instalacion:[],
  };

  const [form,setForm]=useState(doc?{...EMPTY,...doc,procesos_taller:doc.procesos_taller||PROCESOS_TALLER_DEFAULT}:EMPTY);
  const [obsExtra,setObsExtra]=useState(obsOpciones||OBS_DEFAULT);
  const [serviciosExtra,setServiciosExtra]=useState(serviciosOpciones||SERVICIOS_DEFAULT);
  const [newObs,setNewObs]=useState("");
  const [newServ,setNewServ]=useState("");
  const [tab,setTab]=useState("pedido");

  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const setItem=(i,k,v)=>setForm(f=>{const arr=[...f.items];arr[i]={...arr[i],[k]:v};return{...f,items:arr};});
  const addItem=()=>setForm(f=>({...f,items:[...f.items,emptyItem()]}));
  const removeItem=(i)=>setForm(f=>({...f,items:f.items.filter((_,idx)=>idx!==i)}));
  const toggleObs=(i,ob)=>setForm(f=>{
    const arr=[...f.items];
    const cur=arr[i].obs||[];
    arr[i]={...arr[i],obs:cur.includes(ob)?cur.filter(x=>x!==ob):[...cur,ob]};
    return{...f,items:arr};
  });

  // Auto-calc total
  const totalCalc=form.items.reduce((s,it)=>s+(+it.precio||0),0);

  // Sync client data when selected
  const onClienteChange=(id)=>{
    const c=clientes.find(x=>x.id===id);
    setForm(f=>({...f,cliente:id,contacto_nombre:c?.nombre||f.contacto_nombre,contacto_tel:c?.telefono||f.contacto_tel,contacto_dom:c?.direccion||f.contacto_dom}));
  };

  const [newProc,setNewProc]=useState("");
  const TABS_COT=[{id:"pedido",label:"📋 Pedido"},{id:"plano",label:"✏️ Plano general"}];
  const hasItemPlanos2=(form.items||[]).some(it=>(it.plano||[]).length>0);
  const TABS_ORD=[{id:"pedido",label:"📋 Pedido"},...(!hasItemPlanos2?[{id:"plano",label:"✏️ Plano general"}]:[]),{id:"produccion",label:"🏭 Producción"},{id:"instalacion",label:"🚚 Instalación"},{id:"actividad",label:"🕐 Actividad"}];
  const TABS=modo==="orden"?TABS_ORD:TABS_COT;

  const COLOCACION=[
    {id:"con_colocacion",label:"Con colocación"},
    {id:"sin_colocacion",label:"Sin colocación"},
    {id:"solo_envio",label:"Solo envío"},
  ];

  // ── PDF TALLER ────────────────────────────────────────────────────────────
  // ── PDF ETIQUETAS 55×44mm ─────────────────────────────────────────────────
  const pdfEtiquetas=()=>{
    const items=form.items||[];
    if(!items.length){alert("No hay ítems en esta orden.");return;}
    const domicilio=form.inst_direccion||form.contacto_dom||"";
    const cliente=form.contacto_nombre||"";
    const numero=form.numero||"";

    // Generate one label per item (repeated by quantity)
    const etiquetas=items.flatMap(it=>{
      const qty=+it.cant||1;
      return Array(qty).fill(null).map((_,qi)=>({
        numero,
        nombre:it.nombre||"",
        tipo:it.tipo_vidrio||"",
        medidas:it.ancho&&it.alto?`${it.ancho} × ${it.alto} mm`:"",
        obs:(it.obs||[]).join(", "),
        domicilio,
        cliente,
        idx:qi+1,
        total:qty,
      }));
    });

    // 55mm × 44mm at 96dpi ≈ 208px × 166px
    // We print 2 columns to fit on A4, but page size set to label size
    const labelHTML=etiquetas.map((e,i)=>`
      <div class="label">
        <div class="orden">${e.numero}</div>
        ${e.nombre?`<div class="nombre">${e.nombre}${e.total>1?` (${e.idx}/${e.total})`:""}</div>`:""}
        <div class="medidas">${e.medidas||e.tipo}</div>
        ${e.medidas?`<div class="tipo">${e.tipo}</div>`:""}
        ${e.obs?`<div class="obs">${e.obs}</div>`:""}
        <div class="domicilio">📍 ${e.domicilio||e.cliente||"—"}</div>
      </div>`).join("");

    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Etiquetas ${numero}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#fff}
  @page{size:55mm 44mm;margin:0}
  .label{
    width:55mm;height:44mm;
    padding:2.5mm 3mm;
    display:flex;flex-direction:column;justify-content:center;gap:0.8mm;
    border:0.3mm solid #ccc;
    page-break-after:always;
    overflow:hidden;
  }
  .orden{font-size:7pt;color:#666;font-weight:600;letter-spacing:0.5px}
  .nombre{font-size:9pt;font-weight:900;color:#000;line-height:1.1;text-transform:uppercase}
  .medidas{font-size:13pt;font-weight:900;color:#000;letter-spacing:0.5px;line-height:1}
  .tipo{font-size:7.5pt;color:#333;font-weight:600}
  .obs{font-size:7pt;color:#555;font-style:italic}
  .domicilio{font-size:7pt;color:#444;margin-top:1mm;border-top:0.2mm solid #eee;padding-top:1mm}
  @media print{
    body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    @page{size:55mm 44mm;margin:0}
    .label{border:none;page-break-after:always}
  }
</style></head><body>${labelHTML}</body></html>`;

    const w=window.open("","_blank","width=600,height=500");
    if(w){
      w.document.write(html);
      w.document.close();
      w.onload=()=>{
        w.focus();
        // Small delay to let browser render before print dialog
        setTimeout(()=>w.print(),300);
      };
    }
  };

  const pdfTaller=()=>{
    const rows=form.items.map((it,i)=>{
      const itemSVG=buildSVGStr(it.plano||[]);
      return`
      <tr style="background:${i%2===0?"#f8fbff":"#fff"}">
        <td style="padding:10px 12px;text-align:center;font-size:18px;font-weight:900;width:50px">${it.cant||1}</td>
        <td style="padding:10px 12px;font-weight:700;font-size:15px">${it.tipo_vidrio||"—"}</td>
        <td style="padding:10px 12px;text-align:center;font-size:15px">${it.ancho&&it.alto?`${it.ancho} × ${it.alto} mm`:"—"}</td>
        <td style="padding:10px 12px;font-size:13px">${(it.obs||[]).join(", ")||"—"}</td>
        <td style="padding:10px 12px;font-size:13px">${it.servicio||"—"}</td>
        <td style="padding:10px 12px;font-size:13px">${COLOCACION.find(c=>c.id===it.colocacion)?.label||"—"}</td>
      </tr>
      ${itemSVG?`<tr><td colspan="6" style="padding:8px 12px;background:#f0f6ff">${itemSVG}</td></tr>`:""}`;
    }).join("");
    const hasItemPlanos=(form.items||[]).some(it=>(it.plano||[]).length>0);
    const planoSVG=!hasItemPlanos?buildSVGStr(form.plano):"";
    const instBloque=form.inst_notas||form.inst_fecha||form.inst_direccion?`
      <div style="margin-top:16px;padding:12px 16px;background:#f8f9ff;border-left:3px solid #1565C0;border-radius:0 6px 6px 0;font-size:13px;line-height:1.8;color:#333">
        <strong style="color:#1565C0">Instalación:</strong><br/>
        ${form.inst_fecha?`Fecha: ${form.inst_fecha}<br/>`:""}
        ${form.inst_direccion?`Dirección: ${form.inst_direccion}<br/>`:""}
        ${form.inst_responsable?`Responsable: ${form.inst_responsable}<br/>`:""}
        ${form.inst_notas?`Notas: ${form.inst_notas}`:""}
      </div>`:"";

    // Checklist compacto — casilleros por ítem y proceso
    const procesos = form.procesos_taller||PROCESOS_TALLER_DEFAULT;
    const procesoHeaders = procesos.map(p=>`<th style="padding:6px 8px;text-align:center;font-size:10px;font-weight:700;letter-spacing:0.3px;border:1px solid #c8d8f0;min-width:52px;max-width:70px;color:#fff">${p}</th>`).join("");
    const procesoRows = (form.items||[]).map((it,i)=>{
      return `<tr style="background:${i%2===0?"#fff":"#f8fbff"}">
        <td style="padding:8px 10px;text-align:center;font-weight:900;font-size:16px;border:1px solid #dde8ff;width:40px">${it.cant||1}</td>
        <td style="padding:8px 10px;font-weight:700;font-size:13px;border:1px solid #dde8ff">${it.tipo_vidrio||"—"}${it.nombre?`<br/><span style="font-size:11px;color:#1565C0;font-weight:400">${it.nombre}</span>`:""}</td>
        <td style="padding:8px 10px;text-align:center;font-size:14px;font-weight:700;border:1px solid #dde8ff;white-space:nowrap;color:#0a2a5e">${it.ancho&&it.alto?`${it.ancho}×${it.alto} mm`:"—"}</td>
        <td style="padding:8px 10px;font-size:12px;border:1px solid #dde8ff;color:#555">${(it.obs||[]).join(", ")||""}</td>
        ${procesos.map(()=>`<td style="padding:8px;text-align:center;border:1px solid #dde8ff"><div style="width:20px;height:20px;border:2px solid #1565C0;border-radius:3px;margin:0 auto;background:#fff"></div></td>`).join("")}
      </tr>`;
    }).join("");

    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Taller ${form.numero||""}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a2e}
.hdr{background:linear-gradient(135deg,#0a2a5e,#1565C0);padding:14px 22px;display:flex;justify-content:space-between;align-items:center}
.logo{width:48px;height:48px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3))}
.biz{color:#fff}.biz-name{font-size:16px;font-weight:900}.biz-sub{font-size:9px;opacity:0.7;margin-top:1px}
.doc-right{text-align:right;color:#fff}.doc-type{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;opacity:0.7}
.doc-num{font-size:26px;font-weight:900;display:block;letter-spacing:1px}
.divider{height:3px;background:linear-gradient(90deg,#1565C0,#42A5F5,#1565C0)}
.body{padding:14px 22px}
.client-row{background:#f0f6ff;border-radius:6px;padding:8px 12px;border:1px solid #e0ecff;display:flex;gap:20px;margin-bottom:12px}
.cf label{font-size:8px;color:#888;font-weight:700;text-transform:uppercase;display:block;margin-bottom:1px}.cf p{font-size:13px;font-weight:600}
table{width:100%;border-collapse:collapse}
.sign-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:20px}
.sign-line{border-top:1.5px solid #1565C0;padding-top:7px;text-align:center;font-size:10px;color:#888;text-transform:uppercase}
.footer{background:#f0f6ff;border-top:1px solid #e3f2fd;padding:6px 22px;display:flex;justify-content:space-between;font-size:9px;color:#888;margin-top:12px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:6mm}}</style></head><body>
<div class="hdr">
  <div style="display:flex;align-items:center;gap:10px">
    <img class="logo" src="BIZ_LOGO" alt="LV"/>
    <div class="biz"><div class="biz-name">La Vidriería Rosario — TALLER</div><div class="biz-sub">Orden de Producción Interna</div></div>
  </div>
  <div class="doc-right"><div class="doc-type">Orden N°</div><span class="doc-num">${form.numero||"S/N"}</span></div>
</div>
<div class="divider"></div>
<div class="body">
  <div class="client-row">
    <div class="cf"><label>Cliente</label><p>${form.contacto_nombre||"—"}</p></div>
    <div class="cf"><label>Teléfono</label><p>${form.contacto_tel||"—"}</p></div>
    <div class="cf"><label>Domicilio</label><p>${form.contacto_dom||"—"}</p></div>
  </div>
  <table>
    <thead>
      <tr style="background:linear-gradient(135deg,#0a2a5e,#1565C0)">
        <th style="padding:7px 10px;text-align:center;font-size:10px;font-weight:700;border:1px solid #1a4a8e;color:#fff;width:40px">Cant.</th>
        <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;border:1px solid #1a4a8e;color:#fff">Tipo de vidrio</th>
        <th style="padding:7px 10px;text-align:center;font-size:10px;font-weight:700;border:1px solid #1a4a8e;color:#fff;width:90px">Medidas mm</th>
        <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;border:1px solid #1a4a8e;color:#fff">Obs.</th>
        ${procesoHeaders}
      </tr>
    </thead>
    <tbody>${procesoRows}</tbody>
  </table>
  ${form.inst_notas||form.inst_fecha?`<div style="margin-top:10px;padding:8px 12px;background:#f8f9ff;border-left:3px solid #1565C0;font-size:12px;line-height:1.7;color:#333">${form.inst_fecha?`<strong>Fecha entrega:</strong> ${form.inst_fecha} &nbsp;`:""}${form.inst_direccion?`<strong>Dirección:</strong> ${form.inst_direccion} &nbsp;`:""}${form.inst_notas?`<strong>Notas:</strong> ${form.inst_notas}`:""}</div>`:""}
  ${planoSVG?`<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1565C0;border-bottom:1.5px solid #1565C0;padding-bottom:3px;margin:12px 0 8px">Plano</div>${planoSVG}`:""}
  <div class="sign-grid">
    <div class="sign-line">Recibido por taller<div style="height:28px"></div></div>
    <div class="sign-line">Entregado por<div style="height:28px"></div></div>
  </div>
</div>
<div class="footer"><span>Generado el ${new Date().toLocaleString("es-AR")} · VidrierApp</span><span>La Vidriería Rosario · Mendoza 1783 · 341 425-1007</span></div>
</body></html>`;
    const w=window.open("","_blank","width=860,height=780");
    if(w){w.document.write(html.replace("BIZ_LOGO",BIZ_LOGO));w.document.close();w.onload=()=>{w.focus();w.print();};}
  };

  // ── PDF COMPLETO ──────────────────────────────────────────────────────────
  const pdfCompleto=()=>{
    const rows=(form.items||[]).map((it,i)=>`
      <tr style="background:${i%2===0?"#f8fbff":"#fff"}">
        <td style="padding:8px 12px;text-align:center;font-weight:700">${it.cant||1}</td>
        <td style="padding:8px 12px;font-weight:600">${it.tipo_vidrio||"—"}${it.nombre?`<br/><span style="font-size:11px;color:#1565C0;font-weight:400">${it.nombre}</span>`:""}</td>
        <td style="padding:8px 12px;text-align:center;font-weight:700;color:#0a2a5e">${it.ancho&&it.alto?`${it.ancho} × ${it.alto} mm`:"—"}</td>
        <td style="padding:8px 12px">${(it.obs||[]).join(", ")||"—"}</td>
        <td style="padding:8px 12px">${it.servicio||"—"}</td>
        <td style="padding:8px 12px">${COLOCACION.find(c=>c.id===it.colocacion)?.label||"—"}</td>
        ${modo==="orden"?`<td style="padding:8px 12px;text-align:right;font-weight:700">${it.precio?`$${(+it.precio).toLocaleString("es-AR")}`:""}</td>`:""}
      </tr>`).join("");
    const planoSVG=buildSVGStr(form.plano);
    const senia=+form.pago_senia||0;
    const saldo=+form.pago_saldo||0;
    const total=+form.pago_total||totalCalc||0;
    const fotosHTML=(form.fotos_instalacion||[]).map(f=>`<img src="${f.data}" style="width:150px;height:115px;object-fit:cover;border-radius:7px;border:1px solid #e0ecff;"/>`).join("");
    const fotosTrabHTML=(form.fotos_trabajo||[]).map(f=>`<img src="${f.data}" style="width:150px;height:115px;object-fit:cover;border-radius:7px;border:1px solid #a5d6a7;"/>`).join("");
    const instBloque=form.inst_notas||form.inst_fecha||form.inst_direccion?`
      <div class="st">Instalación / Entrega</div>
      <div class="g2">
        ${form.inst_fecha?`<div class="f"><label>Fecha</label><p>${form.inst_fecha}</p></div>`:""}
        ${form.inst_direccion?`<div class="f"><label>Dirección</label><p>${form.inst_direccion}</p></div>`:""}
        ${form.inst_responsable?`<div class="f"><label>Responsable</label><p>${form.inst_responsable}</p></div>`:""}
        ${form.inst_firmante?`<div class="f"><label>Recibe</label><p>${form.inst_firmante}</p></div>`:""}
      </div>
      ${form.inst_notas?`<div style="margin-top:8px;padding:10px 14px;background:#f8f9ff;border-left:3px solid #1565C0;border-radius:0 6px 6px 0;font-size:13px;line-height:1.7;color:#333">${form.inst_notas}</div>`:""}`:"";
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${modo==="orden"?"Orden":"Presupuesto"} ${form.numero||""}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a2e;font-size:13px}
.hdr{background:linear-gradient(135deg,#0a2a5e,#1565C0);padding:18px 28px;display:flex;justify-content:space-between;align-items:center;gap:16px}
.hdr-left{display:flex;align-items:center;gap:12px}.logo{width:58px;height:58px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3))}
.biz-name{font-size:19px;font-weight:900;color:#fff}.biz-sub{font-size:10px;color:rgba(255,255,255,0.7);margin-top:2px}.biz-c{font-size:10px;color:rgba(255,255,255,0.85);margin-top:2px}
.hdr-right{text-align:right}.doc-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.7)}.doc-num{font-size:28px;font-weight:900;color:#fff;letter-spacing:1px;display:block}.doc-date{font-size:10px;color:rgba(255,255,255,0.7);margin-top:3px;display:block}
.divider{height:3px;background:linear-gradient(90deg,#1565C0,#42A5F5,#1565C0)}.body{padding:20px 28px}
.st{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:4px;margin:16px 0 10px}
.client-box{background:#f0f6ff;border-radius:8px;padding:12px 16px;border:1px solid #e0ecff;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.f label{font-size:9px;color:#888;font-weight:700;text-transform:uppercase;display:block;margin-bottom:2px}.f p{font-size:14px;font-weight:600}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
table{width:100%;border-collapse:collapse;font-size:13px}thead tr{background:linear-gradient(135deg,#0a2a5e,#1565C0);color:#fff}thead th{padding:8px 12px;font-size:11px;font-weight:600}
.tot-wrap{display:flex;justify-content:flex-end;margin-top:12px}.tot-inner{min-width:260px;background:#f0f6ff;border-radius:8px;padding:14px 18px;border:1px solid #e0ecff}
.t-row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px;color:#555}
.t-total{display:flex;justify-content:space-between;padding:10px 0 2px;font-size:20px;font-weight:900;color:#0a2a5e;border-top:2px solid #1565C0;margin-top:6px}
.sign-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:30px}.sign-line{border-top:1.5px solid #1565C0;padding-top:8px;text-align:center}.sign-label{font-size:10px;color:#888;text-transform:uppercase}.sign-name{font-size:12px;font-weight:600;color:#1565C0;margin-top:3px}
.footer{background:#f0f6ff;border-top:2px solid #e3f2fd;padding:8px 28px;display:flex;justify-content:space-between;font-size:10px;color:#888}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:8mm}}</style></head><body>
<div class="hdr"><div class="hdr-left"><img class="logo" src="BIZ_LOGO" alt="LV"/><div>
  <div class="biz-name">La Vidriería Rosario</div>
  <div class="biz-sub">Vidrios · Espejos · Cerramientos · Instalaciones</div>
  <div class="biz-c">📍 Mendoza 1783, Rosario, Santa Fe · CP 2000</div>
  <div class="biz-c">📞 341 425-1007 / 341 508-4921 &nbsp;·&nbsp; ✉️ lavidrieria@gmail.com</div>
  <div class="biz-c">📸 @lavidrieriarosariooficial &nbsp;·&nbsp; 🕐 Lun-Vie 8-19hs · Sáb 8-13hs</div>
</div></div>
<div class="hdr-right"><div class="doc-type">${modo==="orden"?"Orden de Trabajo":"Presupuesto"}</div><span class="doc-num">${form.numero||"S/N"}</span><span class="doc-date">Fecha: ${form.fecha||""}</span></div>
</div>
<div class="divider"></div>
<div class="body">
  <div class="st">Datos del Cliente</div>
  <div class="client-box">
    <div class="f"><label>Nombre</label><p>${form.contacto_nombre||"—"}</p></div>
    <div class="f"><label>Teléfono</label><p>${form.contacto_tel||"—"}</p></div>
    <div class="f"><label>Domicilio</label><p>${form.contacto_dom||"—"}</p></div>
  </div>
  <div class="st">Pedido</div>
  <table><thead><tr>
    <th style="text-align:center;width:50px">Cant.</th>
    <th style="text-align:left">Tipo de vidrio</th>
    <th style="text-align:center;width:130px">Medidas (mm)</th>
    <th style="text-align:left">Observaciones</th>
    <th style="text-align:left">Servicio</th>
    <th style="text-align:left">Colocación</th>
    ${modo==="orden"?"<th style=\"text-align:right;width:90px\">Precio</th>":""}
  </tr></thead><tbody>${rows||"<tr><td colspan='7' style='padding:12px;text-align:center;color:#888'>Sin ítems</td></tr>"}</tbody></table>
  ${modo==="cotizacion"&&total?`<div class="tot-wrap"><div class="tot-inner"><div class="t-total"><span>TOTAL</span><span>$${total.toLocaleString("es-AR")}</span></div></div></div>`:""}
  ${modo==="orden"&&total?`<div class="tot-wrap"><div class="tot-inner">
    ${senia?`<div class="t-row"><span>Seña abonada</span><span>$${senia.toLocaleString("es-AR")}</span></div>`:""}
    ${saldo?`<div class="t-row"><span>Saldo pendiente</span><span>$${saldo.toLocaleString("es-AR")}</span></div>`:""}
    <div class="t-total"><span>TOTAL</span><span>$${total.toLocaleString("es-AR")}</span></div>
  </div></div>`:""}
  ${form.condiciones?`<div style="margin-top:12px;padding:10px 14px;background:#f8f9ff;border-left:3px solid #1565C0;border-radius:0 6px 6px 0;font-size:12px;color:#555;line-height:1.6">${form.condiciones}</div>`:""}
  ${instBloque}
  ${planoSVG?`<div class="st">Plano Técnico</div><div style="margin-top:8px">${planoSVG}</div>`:""}
  ${fotosHTML?`<div class="st">Fotos del Lugar</div><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px">${fotosHTML}</div>`:""}
  ${fotosTrabHTML?`<div class="st" style="color:#2e7d32;border-color:#2e7d32">Fotos del Trabajo Terminado</div><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px">${fotosTrabHTML}</div>`:""}
  <div class="sign-grid">
    <div class="sign-line"><div class="sign-label">Firma del colocador</div><div style="height:34px"></div><div class="sign-name">La Vidriería Rosario</div></div>
    <div class="sign-line"><div class="sign-label">Conformidad del cliente</div><div style="height:34px"></div><div style="font-size:12px;color:#555">${form.contacto_nombre||"________________________"}</div></div>
  </div>
</div>
<div class="footer"><span>Generado el ${new Date().toLocaleString("es-AR")} · VidrierApp</span><span>Mendoza 1783 · Rosario · 341 425-1007</span></div>
</body></html>`;
    const w=window.open("","_blank","width=940,height=820");
    if(w){w.document.write(html.replace("BIZ_LOGO",BIZ_LOGO));w.document.close();w.onload=()=>{w.focus();w.print();};}
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return(
    <div>
      {/* HEADER: número + fecha + estado */}
      <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr auto",gap:10,alignItems:"end",padding:"12px 16px",background:"#071220",borderRadius:10,border:"1px solid #1e3a5a",marginBottom:14}}>
        <div>
          <div style={{fontSize:9,color:"#3a6a9a",fontWeight:700,marginBottom:4}}>N°</div>
          <div style={{fontFamily:"monospace",fontSize:16,fontWeight:800,color:"#FFB74D",background:"#1a1000",padding:"5px 12px",borderRadius:7,border:"1px solid #FFB74D30",whiteSpace:"nowrap"}}>{doc?.numero||"—"}</div>
        </div>
        <Field label="Fecha"><Input type="date" value={form.fecha} onChange={e=>set("fecha",e.target.value)}/></Field>
        <Field label="Estado">
          <Sel value={form.estado} onChange={e=>set("estado",e.target.value)}>
            {estados.map(e=><option key={e.id} value={e.id}>{e.label}</option>)}
          </Sel>
        </Field>
        <div style={{display:"flex",gap:6,paddingBottom:2}}>
          <button onClick={pdfCompleto} style={{padding:"6px 12px",borderRadius:7,border:"1px solid #1565C040",background:"#0a1828",color:"#64B5F6",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
            📄 PDF {modo==="orden"?"Completo":"Presupuesto"}
          </button>
          {modo==="orden"&&<button onClick={pdfTaller} style={{padding:"6px 12px",borderRadius:7,border:"1px solid #26A69A40",background:"#0a1a10",color:"#26A69A",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600}}>🔧 PDF Taller</button>}
          {modo==="orden"&&<button onClick={pdfEtiquetas} style={{padding:"6px 12px",borderRadius:7,border:"1px solid #FFB74D40",background:"#1a1000",color:"#FFB74D",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600}}>🏷 Etiquetas</button>}
          {modo==="cotizacion"&&onConvertir&&<button onClick={()=>onConvertir(form)} style={{padding:"6px 14px",borderRadius:7,border:"none",background:"#1b5e20",color:"#A5D6A7",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>✅ → Orden</button>}
        </div>
        {modo==="orden"&&<Field label="Equipo asignado">
          <Sel value={form.equipo_asignado||""} onChange={e=>set("equipo_asignado",e.target.value)}>
            <option value="">Sin asignar</option>
            <option value="A">Equipo A</option>
            <option value="B">Equipo B</option>
          </Sel>
        </Field>}
      </div>
      <div style={{display:"flex",gap:2,marginBottom:14,background:"#050d18",borderRadius:8,padding:3}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"7px 10px",borderRadius:6,border:"none",background:tab===t.id?"#0d1e35":"transparent",color:tab===t.id?"#e2f0ff":"#3a6a9a",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:tab===t.id?700:400}}>{t.label}</button>)}
      </div>

      {/* TAB: PEDIDO */}
      {tab==="pedido"&&<div>
        {/* Cliente */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1565C040",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#64B5F6",textTransform:"uppercase",marginBottom:10}}>Datos del Cliente</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <Field label="Seleccionar cliente">
              <Sel value={form.cliente} onChange={e=>onClienteChange(e.target.value)}>
                <option value="">Sin asignar</option>
                {clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
              </Sel>
            </Field>
            <Field label="Nombre *"><Input value={form.contacto_nombre} onChange={e=>set("contacto_nombre",e.target.value)} placeholder="Nombre completo..."/></Field>
            <Field label="Teléfono *"><Input value={form.contacto_tel} onChange={e=>set("contacto_tel",e.target.value)} placeholder="341 000-0000"/></Field>
            <Field label="Domicilio *"><Input value={form.contacto_dom} onChange={e=>set("contacto_dom",e.target.value)} placeholder="Calle y número..."/></Field>
          </div>
        </div>

        {/* Ítems */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase"}}>🔷 Pedido de Vidrios</div>
            <Btn small onClick={addItem}><Icon name="plus" size={13}/> Agregar ítem</Btn>
          </div>

          {form.items.map((item,i)=>(
            <div key={item.id||i} style={{background:"#0a1828",borderRadius:9,padding:12,marginBottom:10,border:`1px solid ${item.medida_confirmada?"#26A69A30":"#0f2035"}`}}>
              {/* Badge medida confirmada */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <Field label="Nombre / Referencia" style={{flex:1,marginRight:10}}>
                  <Input value={item.nombre||""} onChange={e=>setItem(i,"nombre",e.target.value)} placeholder='Ej: Baño planta alta, Ventana living...'/>
                </Field>
                <div style={{paddingTop:18}}>
                  {item.medida_confirmada
                    ?<span style={{fontSize:10,fontWeight:700,color:"#26A69A",background:"#0a2a0a",border:"1px solid #26A69A40",padding:"2px 8px",borderRadius:99,whiteSpace:"nowrap"}}>✓ Medida confirmada</span>
                    :(item.ancho||item.alto)&&<span style={{fontSize:10,color:"#5a8ab8",background:"#0a1020",border:"1px solid #1e3a5a",padding:"2px 8px",borderRadius:99,whiteSpace:"nowrap"}}>⏳ Sin confirmar</span>
                  }
                </div>
              </div>
              {/* Fila 1: cant, tipo, medidas */}
              <div style={{display:"grid",gridTemplateColumns:"60px 1fr 100px 100px 28px",gap:8,alignItems:"end",marginBottom:8}}>
                <Field label="Cant."><Input type="number" min="1" value={item.cant} onChange={e=>setItem(i,"cant",e.target.value)} style={{textAlign:"center"}}/></Field>
                <Field label="Tipo de vidrio">
                  <Sel value={tiposVidrio.includes(item.tipo_vidrio)?item.tipo_vidrio:item.tipo_vidrio?"__otro__":""}
                    onChange={e=>{if(e.target.value==="__otro__")setItem(i,"tipo_vidrio","");else setItem(i,"tipo_vidrio",e.target.value);}}>
                    <option value="">Seleccionar...</option>
                    {tiposVidrio.map(t=><option key={t} value={t}>{t}</option>)}
                    <option value="__otro__">✏️ Escribir...</option>
                  </Sel>
                  {(!tiposVidrio.includes(item.tipo_vidrio)&&item.tipo_vidrio!=="")&&
                    <Input value={item.tipo_vidrio} onChange={e=>setItem(i,"tipo_vidrio",e.target.value)} placeholder="Tipo personalizado..." style={{marginTop:5}}/>}
                </Field>
                <Field label="Ancho (mm)"><Input type="number" value={item.ancho} onChange={e=>setItem(i,"ancho",e.target.value)} placeholder="0"/></Field>
                <Field label="Alto (mm)"><Input type="number" value={item.alto} onChange={e=>setItem(i,"alto",e.target.value)} placeholder="0"/></Field>
                <div style={{paddingBottom:2,display:"flex",flexDirection:"column",gap:4}}>
                  <button onClick={()=>{
                    const copy={...form.items[i],id:Math.random().toString(36).slice(2,8),plano:[]};
                    setForm(f=>{const arr=[...f.items];arr.splice(i+1,0,copy);return{...f,items:arr};});
                  }} title="Duplicar ítem" style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",padding:4,marginTop:18,display:"flex",fontSize:13}}>⧉</button>
                  <button onClick={()=>removeItem(i)} disabled={form.items.length<=1} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,opacity:form.items.length<=1?0.3:1,display:"flex"}}><Icon name="trash" size={14}/></button>
                </div>
              </div>

              {/* Fila 2: observaciones (chips) */}
              <div style={{marginBottom:8}}>
                <div style={{fontSize:10,color:"#3a6a9a",fontWeight:600,marginBottom:5}}>OBSERVACIONES</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,alignItems:"center"}}>
                  {obsExtra.map(ob=>{
                    const sel=(item.obs||[]).includes(ob);
                    return <button key={ob} onClick={()=>toggleObs(i,ob)} style={{padding:"4px 10px",borderRadius:99,border:`1px solid ${sel?"#64B5F6":"#1e3a5a"}`,background:sel?"#1565C020":"transparent",color:sel?"#64B5F6":"#3a6a9a",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:sel?700:400}}>{ob}</button>;
                  })}
                  <div style={{display:"flex",gap:4}}>
                    <input value={newObs} onChange={e=>setNewObs(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newObs.trim()){setObsExtra(o=>[...o,newObs.trim()]);setNewObs("");}}}
                      placeholder="+ Nueva obs..." style={{...iS,padding:"3px 8px",fontSize:11,width:120}}/>
                  </div>
                </div>
              </div>

              {/* Fila 3: servicio + colocación + precio */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 120px",gap:8,alignItems:"end"}}>
                <Field label="Servicio">
                  <div style={{display:"flex",gap:4}}>
                    <Sel value={serviciosExtra.includes(item.servicio)?item.servicio:item.servicio?"__otro__":""}
                      onChange={e=>{if(e.target.value==="__otro__")setItem(i,"servicio","");else setItem(i,"servicio",e.target.value);}} style={{flex:1}}>
                      <option value="">Sin servicio</option>
                      {serviciosExtra.map(s=><option key={s} value={s}>{s}</option>)}
                      <option value="__otro__">✏️ Escribir...</option>
                    </Sel>
                  </div>
                  {(!serviciosExtra.includes(item.servicio)&&item.servicio!=="")&&
                    <Input value={item.servicio} onChange={e=>setItem(i,"servicio",e.target.value)} placeholder="Servicio personalizado..." style={{marginTop:5}}/>}
                </Field>
                <Field label="Colocación">
                  <div style={{display:"flex",gap:4}}>
                    {COLOCACION.map(c=><button key={c.id} onClick={()=>setItem(i,"colocacion",c.id)} style={{flex:1,padding:"6px 4px",borderRadius:6,border:`1px solid ${item.colocacion===c.id?"#1565C0":"#1e3a5a"}`,background:item.colocacion===c.id?"#1565C020":"transparent",color:item.colocacion===c.id?"#64B5F6":"#3a6a9a",cursor:"pointer",fontSize:10,fontFamily:"inherit",fontWeight:item.colocacion===c.id?700:400,textAlign:"center"}}>{c.label}</button>)}
                  </div>
                </Field>
                {modo==="orden"&&<Field label="Precio $"><Input type="number" value={item.precio||""} onChange={e=>setItem(i,"precio",e.target.value)} placeholder="0"/></Field>}
              </div>
              {/* Plano individual por ítem */}
              <ItemCanvas
                value={item.plano||[]}
                onChange={v=>setItem(i,"plano",v)}
                label={`${item.cant||1}× ${item.tipo_vidrio||"Vidrio"} ${item.ancho&&item.alto?`${item.ancho}×${item.alto}mm`:""}`}
                itemIdx={i+1}
              />
            </div>
          ))}

          {/* Servicios: gestión rápida */}
          <div style={{marginTop:8,padding:"8px 12px",background:"#050d18",borderRadius:7,display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:10,color:"#3a6a9a"}}>+ Servicio:</span>
            <input value={newServ} onChange={e=>setNewServ(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newServ.trim()){setServiciosExtra(s=>[...s,newServ.trim()]);setNewServ("");}}}
              placeholder="Agregar servicio..." style={{...iS,padding:"3px 8px",fontSize:11,flex:1}}/>
          </div>
        </div>

        {/* Pagos */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",marginBottom:12}}>
            {modo==="orden"?"💳 Pagos y Comprobantes":"💰 Total"}
          </div>

          {modo==="orden"&&<>
            {/* ── TOTAL ── */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <Field label="💰 Total de la orden $">
                <Input type="number" value={form.pago_total} onChange={e=>set("pago_total",e.target.value)} placeholder="0"/>
              </Field>
              <Field label="Condiciones">
                <Input value={form.condiciones} onChange={e=>set("condiciones",e.target.value)} placeholder="50% inicio, 50% entrega..."/>
              </Field>
            </div>

            {/* ── SEÑA ── */}
            <div style={{background:"#0a1828",borderRadius:9,padding:12,marginBottom:10,border:"1px solid #1e3a5a"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#FFB74D",marginBottom:10}}>🤝 Seña</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                <Field label="Monto $"><Input type="number" value={form.pago_senia} onChange={e=>set("pago_senia",e.target.value)} placeholder="0"/></Field>
                <Field label="Fecha"><Input type="date" value={form.pago_senia_fecha||""} onChange={e=>set("pago_senia_fecha",e.target.value)}/></Field>
                <Field label="Método">
                  <Sel value={form.pago_senia_metodo||"efectivo"} onChange={e=>set("pago_senia_metodo",e.target.value)}>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="cheque">Cheque</option>
                    <option value="mercadopago">Mercado Pago</option>
                  </Sel>
                </Field>
              </div>
              {/* Comprobante seña */}
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:"#3a6a9a"}}>Comprobante:</span>
                {(form.comp_senia||[]).map((f,i)=>(
                  <div key={i} style={{position:"relative"}}>
                    <img src={f.data} alt="" style={{width:60,height:60,objectFit:"cover",borderRadius:6,border:"1px solid #FFB74D40",cursor:"pointer"}} onClick={()=>window.open(f.data,"_blank")}/>
                    <button onClick={()=>setForm(fr=>({...fr,comp_senia:(fr.comp_senia||[]).filter((_,idx)=>idx!==i)}))}
                      style={{position:"absolute",top:-5,right:-5,width:16,height:16,borderRadius:"50%",background:"#7f2020",border:"none",color:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  </div>
                ))}
                <label style={{width:60,height:60,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0a1020",borderRadius:6,border:"1px dashed #FFB74D40",cursor:"pointer"}}>
                  <span style={{fontSize:18}}>📎</span>
                  <span style={{fontSize:8,color:"#3a6a9a"}}>Subir</span>
                  <input type="file" accept="image/*,application/pdf" multiple style={{display:"none"}} onChange={e=>{
                    Array.from(e.target.files).forEach(f=>{
                      if(f.size>5*1024*1024){alert("Máx 5MB");return;}
                      const r=new FileReader();
                      r.onload=ev=>setForm(fr=>({...fr,comp_senia:[...(fr.comp_senia||[]),{data:ev.target.result,nombre:f.name,tipo:f.type}]}));
                      r.readAsDataURL(f);
                    });
                  }}/>
                </label>
              </div>
            </div>

            {/* ── HISTORIAL DE PAGOS PARCIALES ── */}
            <div style={{background:"#0a1828",borderRadius:9,padding:12,marginBottom:10,border:"1px solid #1e3a5a"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:"#64B5F6"}}>📋 Pagos parciales</div>
                <Btn small onClick={()=>{
                  const monto=window.prompt("Monto $:");
                  if(!monto||!+monto) return;
                  const nuevo={id:Math.random().toString(36).slice(2,8),monto:+monto,fecha:new Date().toISOString().split("T")[0],metodo:"efectivo",nota:"",comp:[]};
                  set("pagos_parciales",[...(form.pagos_parciales||[]),nuevo]);
                }}><Icon name="plus" size={13}/> Agregar pago</Btn>
              </div>
              {(form.pagos_parciales||[]).length===0&&<div style={{fontSize:12,color:"#2a4a6a"}}>Sin pagos parciales registrados</div>}
              {(form.pagos_parciales||[]).map((p,i)=>(
                <div key={p.id||i} style={{display:"grid",gridTemplateColumns:"100px 90px 1fr auto",gap:8,alignItems:"center",padding:"6px 0",borderBottom:"1px solid #0f2035"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#A5D6A7"}}>${(+p.monto).toLocaleString("es-AR")}</div>
                  <div style={{fontSize:11,color:"#3a6a9a"}}>{p.fecha}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <Sel value={p.metodo||"efectivo"} onChange={e=>{const arr=[...(form.pagos_parciales||[])];arr[i]={...arr[i],metodo:e.target.value};set("pagos_parciales",arr);}} style={{fontSize:11,padding:"2px 6px"}}>
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="mercadopago">MP</option>
                    </Sel>
                    {/* comprobante del pago parcial */}
                    {(p.comp||[]).map((c,ci)=>(
                      <img key={ci} src={c.data} alt="" style={{width:32,height:32,objectFit:"cover",borderRadius:4,cursor:"pointer",border:"1px solid #64B5F640"}} onClick={()=>window.open(c.data,"_blank")}/>
                    ))}
                    <label style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",background:"#071220",borderRadius:4,border:"1px dashed #1e3a5a",cursor:"pointer",flexShrink:0}}>
                      <span style={{fontSize:14}}>📎</span>
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                        const f=e.target.files[0];if(!f)return;
                        const r=new FileReader();
                        r.onload=ev=>{const arr=[...(form.pagos_parciales||[])];arr[i]={...arr[i],comp:[...(arr[i].comp||[]),{data:ev.target.result,nombre:f.name}]};set("pagos_parciales",arr);};
                        r.readAsDataURL(f);
                      }}/>
                    </label>
                  </div>
                  <button onClick={()=>set("pagos_parciales",(form.pagos_parciales||[]).filter((_,idx)=>idx!==i))}
                    style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,display:"flex"}}><Icon name="trash" size={13}/></button>
                </div>
              ))}
              {(form.pagos_parciales||[]).length>0&&<div style={{marginTop:8,fontSize:12,color:"#64B5F6",fontWeight:700}}>
                Subtotal parciales: ${(form.pagos_parciales||[]).reduce((s,p)=>s+(+p.monto||0),0).toLocaleString("es-AR")}
              </div>}
            </div>

            {/* ── PAGO FINAL / ABONADO COMPLETO ── */}
            <div style={{background:"#0a1828",borderRadius:9,padding:12,border:`1px solid ${form.abonado_completo?"#26A69A40":"#1e3a5a"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:form.abonado_completo?10:0}}>
                <div style={{fontSize:11,fontWeight:700,color:form.abonado_completo?"#26A69A":"#5a8ab8"}}>
                  {form.abonado_completo?"✅ ABONADO COMPLETO":"💳 Pago final / saldo"}
                </div>
                <button onClick={()=>{
                  if(form.abonado_completo){set("abonado_completo",false);}
                  else{set("abonado_completo",true);set("pago_final_fecha",new Date().toISOString().split("T")[0]);}
                }} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${form.abonado_completo?"#26A69A":"#1565C0"}`,
                  background:form.abonado_completo?"#0a2a1a":"#0a1828",
                  color:form.abonado_completo?"#26A69A":"#64B5F6",
                  cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:700}}>
                  {form.abonado_completo?"↩ Revertir":"✅ Marcar como abonado"}
                </button>
              </div>
              {form.abonado_completo&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                <Field label="Monto final $"><Input type="number" value={form.pago_final_monto||""} onChange={e=>set("pago_final_monto",e.target.value)} placeholder="0"/></Field>
                <Field label="Fecha"><Input type="date" value={form.pago_final_fecha||""} onChange={e=>set("pago_final_fecha",e.target.value)}/></Field>
                <Field label="Método">
                  <Sel value={form.pago_final_metodo||"efectivo"} onChange={e=>set("pago_final_metodo",e.target.value)}>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="mercadopago">Mercado Pago</option>
                  </Sel>
                </Field>
              </div>}
              {form.abonado_completo&&<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:"#3a6a9a"}}>Comprobante:</span>
                {(form.comp_final||[]).map((f,i)=>(
                  <div key={i} style={{position:"relative"}}>
                    <img src={f.data} alt="" style={{width:60,height:60,objectFit:"cover",borderRadius:6,border:"1px solid #26A69A40",cursor:"pointer"}} onClick={()=>window.open(f.data,"_blank")}/>
                    <button onClick={()=>setForm(fr=>({...fr,comp_final:(fr.comp_final||[]).filter((_,idx)=>idx!==i)}))}
                      style={{position:"absolute",top:-5,right:-5,width:16,height:16,borderRadius:"50%",background:"#7f2020",border:"none",color:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  </div>
                ))}
                <label style={{width:60,height:60,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0a1020",borderRadius:6,border:"1px dashed #26A69A40",cursor:"pointer"}}>
                  <span style={{fontSize:18}}>📎</span>
                  <span style={{fontSize:8,color:"#3a6a9a"}}>Subir</span>
                  <input type="file" accept="image/*,application/pdf" multiple style={{display:"none"}} onChange={e=>{
                    Array.from(e.target.files).forEach(f=>{
                      if(f.size>5*1024*1024){alert("Máx 5MB");return;}
                      const r=new FileReader();
                      r.onload=ev=>setForm(fr=>({...fr,comp_final:[...(fr.comp_final||[]),{data:ev.target.result,nombre:f.name}]}));
                      r.readAsDataURL(f);
                    });
                  }}/>
                </label>
              </div>}

              {/* Resumen financiero */}
              {(+form.pago_total||0)>0&&<div style={{marginTop:10,padding:"8px 0",borderTop:"1px solid #1e3a5a"}}>
                {(()=>{
                  const total=+form.pago_total||0;
                  const senia=+form.pago_senia||0;
                  const parciales=(form.pagos_parciales||[]).reduce((s,p)=>s+(+p.monto||0),0);
                  const final=+form.pago_final_monto||0;
                  const cobrado=senia+parciales+final;
                  const resta=Math.max(0,total-cobrado);
                  return<>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5a8ab8",marginBottom:3}}>
                      <span>Total: ${total.toLocaleString("es-AR")}</span>
                      <span>Cobrado: ${cobrado.toLocaleString("es-AR")}</span>
                    </div>
                    <div style={{height:6,background:"#0f2035",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(100,total>0?cobrado/total*100:0)}%`,background:resta===0?"#26A69A":"#FFB74D",borderRadius:3,transition:"width 0.3s"}}/>
                    </div>
                    <div style={{fontSize:12,fontWeight:700,color:resta===0?"#26A69A":"#FFB74D",marginTop:4,textAlign:"right"}}>
                      {resta===0?"✅ Pagado completo":`Saldo: $${resta.toLocaleString("es-AR")}`}
                    </div>
                  </>;
                })()}
              </div>}
            </div>
          </>}

          {modo==="cotizacion"&&<>
            <Field label="Total"><Input type="number" value={form.pago_total||totalCalc} onChange={e=>set("pago_total",e.target.value)} placeholder="$0"/></Field>
            <Field label="Condiciones de pago" style={{marginTop:10}}><Textarea value={form.condiciones} onChange={e=>set("condiciones",e.target.value)}/></Field>
          </>}
        </div>
      </div>}

      {/* TAB: PLANO */}
      {tab==="plano"&&<div>
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1565C040"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#64B5F6",textTransform:"uppercase",marginBottom:10}}>✏️ Plano Técnico</div>
          <MiniCanvas value={form.plano||[]} onChange={v=>set("plano",v)}/>
        </div>
      </div>}

      {/* TAB: PRODUCCIÓN (solo en orden) */}
      {tab==="produccion"&&modo==="orden"&&<div>
        <div style={{background:"#071220",borderRadius:10,padding:16,border:"1px solid #FFB74D30"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#FFB74D",textTransform:"uppercase",marginBottom:6}}>
            ✂️ Checklist de procesos — aparece en el PDF Taller
          </div>
          <div style={{fontSize:12,color:"#5a8ab8",marginBottom:14,lineHeight:1.6}}>
            Estos son los procesos que el taller tiene que completar para esta orden. Se imprimen con casilleros para tildar a mano. Podés agregar, reordenar o eliminar los que no aplican.
          </div>

          {/* Lista de procesos */}
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
            {(form.procesos_taller||[]).map((proc,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#0a1828",borderRadius:8,border:"1px solid #0f2035"}}>
                <div style={{width:18,height:18,border:"2px solid #FFB74D",borderRadius:4,flexShrink:0,background:"#fff"}}/>
                <div style={{flex:1,fontSize:13,color:"#c8e0f8",fontWeight:600}}>{i+1}. {proc}</div>
                <div style={{display:"flex",gap:4}}>
                  {i>0&&<button onClick={()=>{
                    const arr=[...(form.procesos_taller||[])];
                    [arr[i-1],arr[i]]=[arr[i],arr[i-1]];
                    set("procesos_taller",arr);
                  }} style={{background:"none",border:"1px solid #1e3a5a",color:"#3a6a9a",cursor:"pointer",padding:"2px 6px",borderRadius:5,fontSize:11}}>↑</button>}
                  {i<(form.procesos_taller||[]).length-1&&<button onClick={()=>{
                    const arr=[...(form.procesos_taller||[])];
                    [arr[i],arr[i+1]]=[arr[i+1],arr[i]];
                    set("procesos_taller",arr);
                  }} style={{background:"none",border:"1px solid #1e3a5a",color:"#3a6a9a",cursor:"pointer",padding:"2px 6px",borderRadius:5,fontSize:11}}>↓</button>}
                  <button onClick={()=>set("procesos_taller",(form.procesos_taller||[]).filter((_,idx)=>idx!==i))}
                    style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,display:"flex"}}><Icon name="trash" size={13}/></button>
                </div>
              </div>
            ))}
          </div>

          {/* Agregar proceso */}
          <div style={{display:"flex",gap:8}}>
            <Input value={newProc} onChange={e=>setNewProc(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&newProc.trim()){set("procesos_taller",[...(form.procesos_taller||[]),newProc.trim()]);setNewProc("");}}}
              placeholder="Agregar proceso... (ej: Templado, Embalaje)" style={{flex:1}}/>
            <Btn small onClick={()=>{
              if(!newProc.trim()) return;
              set("procesos_taller",[...(form.procesos_taller||[]),newProc.trim()]);
              setNewProc("");
            }}><Icon name="plus" size={13}/> Agregar</Btn>
          </div>

          {/* Botón para restaurar defaults */}
          <button onClick={()=>set("procesos_taller",PROCESOS_TALLER_DEFAULT)}
            style={{marginTop:10,background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",fontSize:11,padding:0,textDecoration:"underline"}}>
            Restaurar procesos por defecto
          </button>
        </div>
      </div>}

      {/* TAB: INSTALACIÓN (solo en orden) */}
      {tab==="instalacion"&&modo==="orden"&&<div>
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",marginBottom:12}}>🚚 Datos de Instalación / Entrega</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <Field label="Fecha de instalación"><Input type="date" value={form.inst_fecha||""} onChange={e=>set("inst_fecha",e.target.value)}/></Field>
            <Field label="Dirección"><Input value={form.inst_direccion||""} onChange={e=>set("inst_direccion",e.target.value)} placeholder="Calle y número..."/></Field>
            <Field label="Responsable"><Input value={form.inst_responsable||""} onChange={e=>set("inst_responsable",e.target.value)} placeholder="Instalador..."/></Field>
            <Field label="Recibe / Firma"><Input value={form.inst_firmante||""} onChange={e=>set("inst_firmante",e.target.value)} placeholder="Cliente o encargado..."/></Field>
            <div style={{gridColumn:"span 2"}}>
              <Field label="Notas de instalación (aparecen en ambos PDFs)">
                <Textarea value={form.inst_notas||""} onChange={e=>set("inst_notas",e.target.value)} placeholder="Detalles del acceso, instrucciones especiales, observaciones..."/>
              </Field>
            </div>
          </div>
        </div>

        {/* Fotos */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #CE93D830"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#CE93D8",textTransform:"uppercase",marginBottom:8}}>📷 Fotos de instalación</div>
          <div style={{fontSize:12,color:"#5a8ab8",marginBottom:10}}>Fotos del cliente o del lugar. Aparecen en el PDF Completo.</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {(form.fotos_instalacion||[]).map((f,i)=>(
              <div key={i} style={{position:"relative"}}>
                <img src={f.data} alt="" style={{width:90,height:90,objectFit:"cover",borderRadius:8,border:"1px solid #CE93D830",cursor:"pointer"}} onClick={()=>window.open(f.data,"_blank")}/>
                <button onClick={()=>setForm(fr=>({...fr,fotos_instalacion:(fr.fotos_instalacion||[]).filter((_,idx)=>idx!==i)}))}
                  style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:"#7f2020",border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            ))}
            <label style={{width:90,height:90,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,background:"#0a1020",borderRadius:8,border:"2px dashed #CE93D840",cursor:"pointer"}}>
              <span style={{fontSize:22}}>📷</span>
              <span style={{fontSize:9,color:"#3a6a9a"}}>Agregar foto</span>
              <input type="file" accept="image/*" capture="environment" multiple style={{display:"none"}} onChange={e=>{
                Array.from(e.target.files).forEach(f=>{
                  if(f.size>4*1024*1024){alert("Máx 4MB por foto");return;}
                  const r=new FileReader();
                  r.onload=ev=>setForm(fr=>({...fr,fotos_instalacion:[...(fr.fotos_instalacion||[]),{data:ev.target.result,nombre:f.name}]}));
                  r.readAsDataURL(f);
                });
              }}/>
            </label>
          </div>
        </div>
      </div>}

      {/* TAB: ACTIVIDAD (solo en orden) */}
      {tab==="actividad"&&modo==="orden"&&<div>
        {/* Incidencias */}
        {(form.incidencias||[]).length>0&&<div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #FFB74D30",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#FFB74D",textTransform:"uppercase",marginBottom:10}}>⚠ Problemas reportados</div>
          {(form.incidencias||[]).map((inc,i)=>(
            <div key={inc.id||i} style={{display:"flex",gap:10,padding:"8px 10px",borderRadius:8,background:inc.resuelto?"#0a2a0a":"#1a0800",border:`1px solid ${inc.resuelto?"#26A69A30":"#FFB74D30"}`,marginBottom:6,alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:inc.resuelto?"#26A69A":"#FFB74D"}}>{inc.tipo}</div>
                {inc.nota&&<div style={{fontSize:12,color:"#5a8ab8",marginTop:2}}>{inc.nota}</div>}
                <div style={{fontSize:10,color:"#3a6a9a",marginTop:3}}>{inc.usuario} · {new Date(inc.fecha).toLocaleString("es-AR")}</div>
              </div>
              {!inc.resuelto&&<button onClick={()=>{
                const arr=[...(form.incidencias||[])];
                arr[i]={...arr[i],resuelto:true,resuelto_por:currentUser.nombre,resuelto_fecha:new Date().toISOString()};
                set("incidencias",arr);
              }} style={{padding:"4px 10px",borderRadius:6,border:"1px solid #26A69A",background:"#0a2a0a",color:"#26A69A",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:700,whiteSpace:"nowrap"}}>
                ✓ Resolver
              </button>}
              {inc.resuelto&&<span style={{fontSize:10,color:"#26A69A",whiteSpace:"nowrap"}}>✅ Resuelto</span>}
            </div>
          ))}
        </div>}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",marginBottom:12}}>🕐 Historial de Actividad</div>
          {(doc?.actividad||[]).length===0&&<div style={{color:"#2a4a6a",fontSize:13}}>Sin actividad registrada aún.</div>}
          {(doc?.actividad||[]).map((a,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #0f2035",alignItems:"flex-start"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#1565C0",marginTop:5,flexShrink:0}}/>
              <div>
                <div style={{fontSize:12,color:"#c8e0f8",fontWeight:600}}>{a.accion}</div>
                <div style={{fontSize:11,color:"#3a6a9a"}}>{a.usuario} · {new Date(a.fecha).toLocaleString("es-AR")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>}

      {/* GUARDAR */}
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16,paddingTop:14,borderTop:"1px solid #1e3a5a"}}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={()=>{
          if(!form.contacto_nombre?.trim()){alert("El nombre del cliente es obligatorio.");return;}
          onSave(form);
        }}><Icon name="plus" size={16}/> {doc?"Guardar Cambios":"Crear"}</Btn>
      </div>
    </div>
  );
};

// ─── COTIZACIONES PAGE ───────────────────────────────────────────────────────

// ─── PLANTILLA BUILDER ──────────────────────────────────────────────────────
const PlantillaBuilder=({plantilla,onSave,onClose})=>{
  const [form,setForm]=useState(plantilla||{nombre:"",tipo:"",campos:[]});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const addCampo=()=>setForm(f=>({...f,campos:[...f.campos,{key:"campo_"+Date.now(),label:"",tipo:"texto",opciones:[]}]}));
  const setCampo=(i,k,v)=>setForm(f=>{const c=[...f.campos];c[i]={...c[i],[k]:v};return{...f,campos:c};});
  const removeCampo=(i)=>setForm(f=>({...f,campos:f.campos.filter((_,idx)=>idx!==i)}));
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <Field label="Nombre de la plantilla"><Input value={form.nombre} onChange={e=>set("nombre",e.target.value)} placeholder="Ej: Mampara de baño..."/></Field>
        <Field label="Tipo de trabajo"><Input value={form.tipo} onChange={e=>set("tipo",e.target.value)} placeholder="Ej: Mampara..."/></Field>
      </div>
      <div style={{marginBottom:10}}>
        {form.campos.map((c,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 28px",gap:8,marginBottom:8,alignItems:"end"}}>
            <Field label="Etiqueta"><Input value={c.label} onChange={e=>setCampo(i,"label",e.target.value)} placeholder="Nombre del campo"/></Field>
            <Field label="Tipo"><Sel value={c.tipo} onChange={e=>setCampo(i,"tipo",e.target.value)}><option value="texto">Texto</option><option value="numero">Número</option><option value="select">Selección</option><option value="textarea">Texto largo</option></Sel></Field>
            <button onClick={()=>removeCampo(i)} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,marginBottom:2,display:"flex"}}><Icon name="trash" size={14}/></button>
          </div>
        ))}
        <Btn small variant="secondary" onClick={addCampo}><Icon name="plus" size={13}/> Agregar campo</Btn>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:12,borderTop:"1px solid #1e3a5a"}}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={()=>onSave({...form,id:form.id||("tpl_"+Date.now())})}><Icon name="plus" size={16}/> Guardar plantilla</Btn>
      </div>
    </div>
  );
};

// ─── PROCESS MANAGER ────────────────────────────────────────────────────────
const ProcessManager=({estados,onSave,onClose})=>{
  const [lista,setLista]=useState([...estados]);
  const [nuevo,setNuevo]=useState("");
  const agregar=()=>{
    if(!nuevo.trim()) return;
    const id=nuevo.trim().toLowerCase().replace(/\s+/g,"_");
    setLista(l=>[...l,{id,label:nuevo.trim(),color:"#90A4AE",bg:"#1a1f22"}]);
    setNuevo("");
  };
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <Input value={nuevo} onChange={e=>setNuevo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&agregar()} placeholder="Nuevo estado..." style={{flex:1}}/>
        <Btn small onClick={agregar}><Icon name="plus" size={13}/> Agregar</Btn>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:340,overflowY:"auto"}}>
        {lista.map((e,i)=>(
          <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#0a1020",borderRadius:8,border:"1px solid #0f2035"}}>
            <span style={{width:10,height:10,borderRadius:"50%",background:e.color,flexShrink:0}}/>
            <div style={{flex:1,fontSize:13,color:"#c8e0f8",fontWeight:500}}>{e.label}</div>
            {!e.ocultar&&<button onClick={()=>setLista(l=>l.filter((_,idx)=>idx!==i))} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,display:"flex"}}><Icon name="trash" size={13}/></button>}
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:14,paddingTop:12,borderTop:"1px solid #1e3a5a"}}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={()=>onSave(lista)}>✓ Guardar ({lista.length} estados)</Btn>
      </div>
    </div>
  );
};

// ─── OPTIMIZADOR DE CORTES ───────────────────────────────────────────────────
const Optimizer=()=>{
  const [sheetW,setSheetW]=useState(3600);
  const [sheetH,setSheetH]=useState(2500);
  const [piezas,setPiezas]=useState([{w:"",h:"",qty:1,label:""}]);
  const [result,setResult]=useState(null);
  const addPieza=()=>setPiezas(p=>[...p,{w:"",h:"",qty:1,label:""}]);
  const setP=(i,k,v)=>setPiezas(p=>{const a=[...p];a[i]={...a[i],[k]:v};return a;});
  const optimizar=()=>{
    const pieces=piezas.filter(p=>+p.w>0&&+p.h>0).flatMap(p=>Array(+p.qty||1).fill({w:+p.w,h:+p.h,label:p.label||`${p.w}×${p.h}`}));
    if(!pieces.length){alert("Agregá piezas con medidas.");return;}
    // Simple shelf-first algorithm
    const sheets=[];
    let sheet={placed:[],spaceX:0,spaceY:0,rowH:0};
    let x=0,y=0,rowH=0;
    const sorted=[...pieces].sort((a,b)=>b.h-a.h||b.w-a.w);
    for(const p of sorted){
      if(x+p.w>sheetW){x=0;y+=rowH;rowH=0;}
      if(y+p.h>sheetH){sheets.push({placed:sheet.placed});sheet={placed:[]};x=0;y=0;rowH=0;}
      sheet.placed.push({...p,x,y});
      x+=p.w;rowH=Math.max(rowH,p.h);
    }
    if(sheet.placed.length) sheets.push(sheet);
    setResult(sheets);
  };
  return(
    <div>
      <h1 style={{margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:24,color:"#e2f0ff"}}>Optimización de Cortes</h1>
      <p style={{margin:"0 0 18px",color:"#3a6a9a",fontSize:13}}>Calculá cuántas hojas necesitás y cómo distribuir los cortes</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14,maxWidth:400}}>
        <Field label="Ancho hoja (mm)"><Input type="number" value={sheetW} onChange={e=>setSheetW(+e.target.value)}/></Field>
        <Field label="Alto hoja (mm)"><Input type="number" value={sheetH} onChange={e=>setSheetH(+e.target.value)}/></Field>
      </div>
      {piezas.map((p,i)=>(
        <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 60px 1fr 28px",gap:8,marginBottom:8,alignItems:"end"}}>
          <Field label="Ancho mm"><Input type="number" value={p.w} onChange={e=>setP(i,"w",e.target.value)}/></Field>
          <Field label="Alto mm"><Input type="number" value={p.h} onChange={e=>setP(i,"h",e.target.value)}/></Field>
          <Field label="Cant."><Input type="number" min="1" value={p.qty} onChange={e=>setP(i,"qty",e.target.value)}/></Field>
          <Field label="Etiqueta"><Input value={p.label} onChange={e=>setP(i,"label",e.target.value)} placeholder="Opcional"/></Field>
          <button onClick={()=>setPiezas(pp=>pp.filter((_,idx)=>idx!==i))} disabled={piezas.length<=1} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,marginBottom:2,opacity:piezas.length<=1?0.3:1,display:"flex"}}><Icon name="trash" size={14}/></button>
        </div>
      ))}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        <Btn small variant="secondary" onClick={addPieza}><Icon name="plus" size={13}/> Agregar pieza</Btn>
        <Btn small onClick={optimizar}>✂️ Calcular</Btn>
        {result&&<Btn small variant="secondary" onClick={()=>setResult(null)}>Limpiar</Btn>}
      </div>
      {result&&<div>
        <p style={{color:"#A5D6A7",fontWeight:700,marginBottom:12}}>Se necesitan <span style={{fontSize:20}}>{result.length}</span> hoja{result.length>1?"s":""}</p>
        {result.map((sheet,si)=>(
          <div key={si} style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#64B5F6",marginBottom:6}}>Hoja {si+1}</div>
            <svg viewBox={`0 0 ${sheetW} ${sheetH}`} width="100%" style={{maxHeight:200,border:"1px solid #1565C0",borderRadius:6,background:"#f8fbff",display:"block"}}>
              {sheet.placed.map((p,pi)=>{
                const hue=(pi*47)%360;
                return <g key={pi}><rect x={p.x} y={p.y} width={p.w} height={p.h} fill={`hsl(${hue},60%,80%)`} stroke="#1565C0" strokeWidth="8"/><text x={p.x+p.w/2} y={p.y+p.h/2} textAnchor="middle" dominantBaseline="middle" fontSize={Math.min(p.w,p.h)*0.2} fill="#1565C0" fontWeight="700">{p.label}</text></g>;
              })}
            </svg>
          </div>
        ))}
      </div>}
    </div>
  );
};

function AppInner({ currentUser, onLogout }) {
  const [nav,setNav]=useState("home");
  const [globalSearch,setGlobalSearch]=useState("");
  const [ordenes,setOrdenes]=useState([]);
  const [clientes,setClientes]=useState([]);
  const [plantillas,setPlantillas]=useState(PLANTILLAS_DEFAULT);
  const [estados,setEstados]=useState(ESTADOS_DEFAULT);
  const [tiposVidrio,setTiposVidrio]=useState(TIPOS_VIDRIO_DEFAULT);
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
    // Safety timeout — if Firebase takes too long, just show the app
    const timeout = setTimeout(()=>setLoading(false), 4000);
    let loaded = false;
    const markLoaded = () => { if(!loaded){loaded=true; setLoading(false); clearTimeout(timeout);} };

    unsubs.push(fsSub("ordenes", docs => { setOrdenes(docs.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""))); markLoaded(); }));
    unsubs.push(fsSub("clientes", docs => { setClientes(docs.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""))); }));
    unsubs.push(fsSub("cotizaciones", docs => { setCotizaciones(docs.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""))); }));
    unsubs.push(fsSub("stock_items", docs => { setStock(docs); }));
    unsubs.push(fsCfgSub("plantillas", val => { if(val) setPlantillas(val); }));
    unsubs.push(fsCfgSub("estados", val => { if(val) setEstados(val); }));
    unsubs.push(fsCfgSub("tipos_vidrio", val => {
      if(val&&val.length) {
        setTiposVidrio(val);
      } else {
        fsCfgSet("tipos_vidrio", TIPOS_VIDRIO_DEFAULT);
        setTiposVidrio(TIPOS_VIDRIO_DEFAULT);
      }
    }));

    // Connection indicator
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      unsubs.forEach(u=>{ try{u();}catch(e){} });
      clearTimeout(timeout);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ── DATA OPERATIONS ────────────────────────────────────────────────────────
  const saveOrden = async (form) => {
    const id = form.id || newId();
    const numero = form.numero || await getNextNum("ordenes", "OT");
    const anterior = ordenes.find(o=>o.id===id);
    // Log de actividad
    const logEntry = {
      usuario: currentUser.nombre,
      rol: currentUser.rol,
      fecha: new Date().toISOString(),
      accion: anterior ? `Editó la orden (etapa: ${form.etapa})` : "Creó la orden",
    };
    const actividad = [...(anterior?.actividad||[]), logEntry].slice(-50);
    const data = { ...form, id, numero, createdAt: form.createdAt||new Date().toISOString(), actividad };
    await fsSet("ordenes", id, data);

    // Descontar stock automáticamente si hay materiales usados nuevos
    const matsNuevos = form.prod_materiales_usados||[];
    const matsAnteriores = anterior?.prod_materiales_usados||[];
    // Solo descontar los materiales que no estaban en la versión anterior
    const matsADescontar = matsNuevos.filter(m=>{
      const ant = matsAnteriores.find(x=>x.id===m.id);
      return !ant || ant.cant !== m.cant;
    });
    for(const mat of matsADescontar){
      const item = stock.find(s=>s.id===mat.id);
      if(!item) continue;
      const cantAnterior = matsAnteriores.find(x=>x.id===mat.id)?.cant||0;
      const diferencia = mat.cant - cantAnterior;
      if(diferencia===0) continue;
      const newStk = Math.max(0, item.stock - diferencia);
      const mov = {tipo:"salida",cant:diferencia,nota:`Usado en orden ${numero}`,fecha:new Date().toISOString()};
      await fsSet("stock_items", mat.id, {...item, stock:newStk, movimientos:[mov,...(item.movimientos||[])].slice(0,50)});
    }
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
    const ms=!search||(o.numero||"").toLowerCase().includes(search.toLowerCase())||getNombre(o.cliente).toLowerCase().includes(search.toLowerCase())||(o.numero||"").toLowerCase().includes(search.toLowerCase());
    return ms&&(filterEstado==="all"||o.estado===filterEstado);
  });

  // ── LOADING SCREEN ────────────────────────────────────────────────────────
  if(loading && currentUser.rol!=="colocador") return(
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
    {id:"reportes",label:"Reportes",icon:"optimize"},
    {id:"optimize",label:"Optimización",icon:"refresh"},
    {id:"ayuda",label:"❓ Ayuda",icon:"template"},
  ];

  const Sidebar=()=>{
    const gsResults = globalSearch.trim().length>=2 ? (()=>{
      const q=globalSearch.toLowerCase();
      const ords=ordenes.filter(o=>
        (o.numero||"").toLowerCase().includes(q)||
        (o.numero||"").toLowerCase().includes(q)||
        getNombre(o.cliente).toLowerCase().includes(q)||
        (o.contacto_nombre||"").toLowerCase().includes(q)||
        (o.contacto_telefono||"").toLowerCase().includes(q)
      ).slice(0,4);
      const clis=clientes.filter(c=>
        (c.nombre||"").toLowerCase().includes(q)||
        (c.telefono||"").toLowerCase().includes(q)||
        (c.email||"").toLowerCase().includes(q)
      ).slice(0,3);
      const cots=cotizaciones.filter(c=>
        (c.numero||"").toLowerCase().includes(q)||
        (c.titulo||"").toLowerCase().includes(q)||
        getNombre(c.cliente).toLowerCase().includes(q)
      ).slice(0,2);
      return {ords,clis,cots,total:ords.length+clis.length+cots.length};
    })() : null;

    return(
    <div style={{width:218,background:"#071220",borderRight:"1px solid #0f2035",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",flexShrink:0}}>
      <div style={{padding:"18px 16px 14px",borderBottom:"1px solid #0f2035"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:36,height:36,background:"linear-gradient(135deg,#1565C0,#0d47a1)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="glass" size={20}/></div>
          <div><div style={{fontWeight:800,fontSize:15,color:"#e2f0ff",fontFamily:"Georgia,serif",lineHeight:1.1}}>VidrierApp</div><div style={{fontSize:10,color:"#3a6a9a",letterSpacing:"1px",textTransform:"uppercase"}}>La Vidriería Rosario</div></div>
        </div>
        {/* BUSCADOR GLOBAL */}
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#3a6a9a",pointerEvents:"none"}}><Icon name="search" size={14}/></div>
          <input value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)}
            placeholder="Buscar órdenes, clientes..."
            style={{...iS,paddingLeft:30,paddingRight:globalSearch?28:10,fontSize:12,padding:"7px 10px 7px 28px"}}/>
          {globalSearch&&<button onClick={()=>setGlobalSearch("")} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",padding:2,display:"flex"}}><Icon name="close" size={12}/></button>}
        </div>

        {/* RESULTADOS */}
        {gsResults&&gsResults.total>0&&(
          <div style={{position:"absolute",left:8,right:8,top:110,background:"#0d1b2a",border:"1px solid #1e3a5a",borderRadius:10,zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",maxHeight:340,overflowY:"auto"}}>
            {gsResults.ords.length>0&&<>
              <div style={{fontSize:9,fontWeight:700,color:"#3a6a9a",textTransform:"uppercase",letterSpacing:"1px",padding:"8px 12px 4px"}}>Órdenes</div>
              {gsResults.ords.map(o=>(
                <button key={o.id} onClick={()=>{setGlobalSearch("");setNav("ordenes");setModal({type:"editar_orden",data:o});}}
                  style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",background:"none",border:"none",cursor:"pointer",textAlign:"left",borderBottom:"1px solid #0f2035"}}>
                  <span style={{fontSize:10,color:"#1565C0",fontFamily:"monospace",fontWeight:700,flexShrink:0}}>{o.numero}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,color:"#c8e0f8",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.numero||"Sin número"}</div>
                    <div style={{fontSize:10,color:"#3a6a9a"}}>{getNombre(o.cliente)}</div>
                  </div>
                  <Badge estado={o.estado} estados={estados}/>
                </button>
              ))}
            </>}
            {gsResults.clis.length>0&&<>
              <div style={{fontSize:9,fontWeight:700,color:"#3a6a9a",textTransform:"uppercase",letterSpacing:"1px",padding:"8px 12px 4px"}}>Clientes</div>
              {gsResults.clis.map(c=>(
                <button key={c.id} onClick={()=>{setGlobalSearch("");setNav("clientes");}}
                  style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",background:"none",border:"none",cursor:"pointer",textAlign:"left",borderBottom:"1px solid #0f2035"}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:"#1565C020",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#64B5F6",flexShrink:0}}>{(c.nombre||"?")[0].toUpperCase()}</div>
                  <div>
                    <div style={{fontSize:12,color:"#c8e0f8",fontWeight:600}}>{c.nombre}</div>
                    <div style={{fontSize:10,color:"#3a6a9a"}}>{c.telefono||c.email||c.tipo}</div>
                  </div>
                </button>
              ))}
            </>}
            {gsResults.cots.length>0&&<>
              <div style={{fontSize:9,fontWeight:700,color:"#3a6a9a",textTransform:"uppercase",letterSpacing:"1px",padding:"8px 12px 4px"}}>Cotizaciones</div>
              {gsResults.cots.map(c=>(
                <button key={c.id} onClick={()=>{setGlobalSearch("");setNav("cotizaciones");setModal({type:"editar_cotizacion",data:c});}}
                  style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:10,color:"#FFB74D",fontFamily:"monospace",fontWeight:700,flexShrink:0}}>{c.numero}</span>
                  <div style={{fontSize:12,color:"#c8e0f8",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.titulo||"Sin título"}</div>
                </button>
              ))}
            </>}
          </div>
        )}
        {gsResults&&gsResults.total===0&&(
          <div style={{position:"absolute",left:8,right:8,top:110,background:"#0d1b2a",border:"1px solid #1e3a5a",borderRadius:10,zIndex:200,padding:"14px 12px",textAlign:"center",fontSize:12,color:"#2a4a6a"}}>
            Sin resultados para "{globalSearch}"
          </div>
        )}
      </div>
      <nav style={{flex:1,padding:"10px 10px",overflowY:"auto"}}>
        {navItems.map(item=>(
          <button key={item.id} onClick={()=>setNav(item.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",background:nav===item.id?"#1565C018":"transparent",color:nav===item.id?"#64B5F6":"#4a7aa8",borderLeft:nav===item.id?"2px solid #1565C0":"2px solid transparent",marginBottom:2,fontSize:14,fontWeight:nav===item.id?600:400,fontFamily:"inherit"}}>
            <Icon name={item.icon} size={16}/>{item.label}
            {item.id==="ordenes"&&ordenes.filter(o=>o.estado!=="cancelada").length>0&&<span style={{marginLeft:"auto",background:"#1565C0",color:"#fff",borderRadius:99,fontSize:10,padding:"1px 7px",fontWeight:700}}>{ordenes.filter(o=>o.estado!=="cancelada").length}</span>}
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
  );};

  const Home=()=>{
    const activas=ordenes.filter(o=>!["entregado","cobrado","cancelada"].includes(o.estado));
    const ingresos=ordenes.filter(o=>o.estado==="cobrado").reduce((s,o)=>s+(+o.pago_total||0),0);
    const cotPendientes=cotizaciones.filter(c=>c.estado==="pendiente"||c.estado==="enviada");
    const stockBajo=stock.filter(i=>i.stock<=i.minimo);
    const hoy=new Date().toISOString().split("T")[0];
    const hoyInstalaciones=ordenes.filter(o=>o.inst_fecha===hoy&&!["entregado","cobrado","cancelada"].includes(o.estado));
    const incidenciasPendientes=ordenes.filter(o=>(o.incidencias||[]).some(i=>!i.resuelto));
    const sinCobrar=ordenes.filter(o=>!o.abonado_completo&&(+o.pago_total||0)>0&&!["cobrado","cancelada"].includes(o.estado));
    return(
      <div>
        <div style={{marginBottom:20}}>
          <h1 style={{margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#e2f0ff"}}>Panel Central</h1>
          <p style={{margin:0,color:"#3a6a9a",fontSize:13}}>{new Date().toLocaleDateString("es-AR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>

        {/* ALERTAS URGENTES */}
        {(incidenciasPendientes.length>0||hoyInstalaciones.length>0)&&(
          <div style={{marginBottom:16,display:"flex",flexDirection:"column",gap:8}}>
            {hoyInstalaciones.length>0&&<div onClick={()=>setNav("ordenes")} style={{background:"#0a2a1a",borderRadius:10,padding:"12px 16px",border:"1px solid #26A69A40",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#26A69A"}}>🚚 {hoyInstalaciones.length} instalación{hoyInstalaciones.length>1?"es":""} para HOY</div>
                <div style={{fontSize:11,color:"#3a6a9a",marginTop:2}}>{hoyInstalaciones.map(o=>o.numero).join(" · ")}</div>
              </div>
              <div style={{color:"#26A69A",fontSize:16}}>→</div>
            </div>}
            {incidenciasPendientes.length>0&&<div onClick={()=>setNav("ordenes")} style={{background:"#1a0800",borderRadius:10,padding:"12px 16px",border:"1px solid #FFB74D40",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#FFB74D"}}>⚠ {incidenciasPendientes.length} problema{incidenciasPendientes.length>1?"s":""} sin resolver</div>
                <div style={{fontSize:11,color:"#3a6a9a",marginTop:2}}>{incidenciasPendientes.map(o=>o.numero).join(" · ")}</div>
              </div>
              <div style={{color:"#FFB74D",fontSize:16}}>→</div>
            </div>}
          </div>
        )}
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
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,color:"#1565C0",fontWeight:700,fontFamily:"monospace"}}>{o.numero}</span><span style={{fontSize:13,fontWeight:600,color:"#c8e0f8"}}>{o.numero||"Sin número"}</span></div>
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
        {filtered.map(o=>{
          const total=+o.pago_total||0;
          const senia=+o.pago_senia||0;
          const parciales=(o.pagos_parciales||[]).reduce((s,p)=>s+(+p.monto||0),0);
          const final=+o.pago_final_monto||0;
          const cobrado=senia+parciales+final;
          const resta=Math.max(0,total-cobrado);
          const pagoEstado=o.abonado_completo||resta===0&&total>0?"completo":cobrado>0?"parcial":"sinpagar";
          const pagoColor=pagoEstado==="completo"?"#26A69A":pagoEstado==="parcial"?"#FFB74D":"#5a8ab8";
          const pagoIcon=pagoEstado==="completo"?"✅":pagoEstado==="parcial"?"🟡":"🔴";
          return(
          <div key={o.id} style={{background:"#071220",borderRadius:11,padding:"12px 14px",border:`1px solid ${o.estado==="cancelada"?"#EF535020":"#0f2035"}`,display:"flex",alignItems:"center",gap:12,opacity:o.estado==="cancelada"?0.6:1}}>
            <div style={{background:"#0a1828",border:"1px solid #1565C025",borderRadius:7,padding:"4px 10px",minWidth:95,textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:11,fontWeight:800,color:"#1565C0",fontFamily:"monospace",letterSpacing:"0.5px"}}>{o.numero||"—"}</div>
              <div style={{fontSize:10,color:"#3a6a9a"}}>{o.fecha}</div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2,flexWrap:"wrap"}}>
                <span style={{fontSize:14,fontWeight:600,color:"#e2f0ff"}}>{getNombre(o.cliente)||"Sin cliente"}</span>
                {o.equipo_asignado&&<span style={{fontSize:10,fontWeight:700,padding:"1px 8px",borderRadius:99,background:o.equipo_asignado==="A"?"#FFB74D20":"#F48FB120",color:o.equipo_asignado==="A"?"#FFB74D":"#F48FB1",border:`1px solid ${o.equipo_asignado==="A"?"#FFB74D40":"#F48FB140"}`}}>Eq.{o.equipo_asignado}</span>}
                {(o.incidencias||[]).filter(i=>!i.resuelto).length>0&&<span style={{fontSize:10,fontWeight:700,padding:"1px 8px",borderRadius:99,background:"#2a1000",color:"#FFB74D",border:"1px solid #FFB74D40"}}>⚠ {(o.incidencias||[]).filter(i=>!i.resuelto).length} problema{(o.incidencias||[]).filter(i=>!i.resuelto).length>1?"s":""}</span>}
                {o.ref_cotizacion&&<span style={{fontSize:10,color:"#FFB74D",background:"#2a1a00",border:"1px solid #FFB74D30",padding:"1px 8px",borderRadius:99}}>ref. {o.ref_cotizacion}</span>}
              </div>
              {total>0&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                <div style={{flex:1,height:4,background:"#0a1828",borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:99,background:pagoEstado==="completo"?"#26A69A":pagoEstado==="parcial"?"#FFB74D":"#1e3a5a",width:`${Math.min(100,total>0?cobrado/total*100:0)}%`,transition:"width 0.3s"}}/>
                </div>
                <span style={{fontSize:10,fontWeight:700,color:pagoColor,whiteSpace:"nowrap"}}>
                  {pagoIcon} {pagoEstado==="completo"?"Pagado":pagoEstado==="parcial"?`$${cobrado.toLocaleString("es-AR")} / $${total.toLocaleString("es-AR")}`:`$${total.toLocaleString("es-AR")}`}
                </span>
              </div>}
            </div>
            <Badge estado={o.estado} estados={estados}/>
            <div style={{display:"flex",gap:3}}>
              <button onClick={()=>setModal({type:"editar_orden",data:o})} style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",padding:6,borderRadius:6,display:"flex"}}><Icon name="edit" size={15}/></button>
              <button onClick={()=>deleteOrden(o.id)} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:6,borderRadius:6,display:"flex"}}><Icon name="trash" size={15}/></button>
            </div>
          </div>
          );
        })}
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
          {estados.filter(e=>!ESTADOS_OCULTOS_TABLERO.includes(e.id)).map(estado=>{
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
                      <div style={{fontSize:12,fontWeight:600,color:"#c8e0f8",marginBottom:2,lineHeight:1.3}}>{o.numero||"Sin número"}</div>
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
                {/* Totales del cliente */}
                {clienteOrdenes.length>0&&(()=>{
                  const totalFacturado=clienteOrdenes.reduce((s,o)=>{const sub=(o.pres_items||[]).reduce((a,i)=>a+(+i.precio*(+i.cant||1)),0)*1.21;return s+sub;},0);
                  const totalCobrado=clienteOrdenes.reduce((s,o)=>s+(+o.pago_senia||0)+(+o.pago_total||0),0);
                  const totalPend=Math.max(0,totalFacturado-totalCobrado);
                  return(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                      {[{label:"Facturado",val:"$"+totalFacturado.toLocaleString("es-AR"),color:"#64B5F6"},
                        {label:"Cobrado",val:"$"+totalCobrado.toLocaleString("es-AR"),color:"#A5D6A7"},
                        {label:"Pendiente",val:"$"+totalPend.toLocaleString("es-AR"),color:totalPend>0?"#FFB74D":"#3a6a9a"}
                      ].map(s=>(
                        <div key={s.label} style={{background:"#0a1828",borderRadius:8,padding:"8px 10px",textAlign:"center",border:`1px solid ${s.color}20`}}>
                          <div style={{fontSize:13,fontWeight:700,color:s.color}}>{s.val}</div>
                          <div style={{fontSize:10,color:"#3a6a9a",marginTop:2}}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                {clienteOrdenes.length?clienteOrdenes.map(o=>{
                  const sub=(o.pres_items||[]).reduce((a,i)=>a+(+i.precio*(+i.cant||1)),0)*1.21;
                  const cobrado=(+o.pago_senia||0)+(+o.pago_total||0);
                  const pct=sub>0?Math.min(100,Math.round(cobrado/sub*100)):0;
                  return(
                    <div key={o.id} style={{padding:"8px 0",borderBottom:"1px solid #0f2035"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:10,color:"#1565C0",fontWeight:700,fontFamily:"monospace"}}>{o.numero}</span>
                          <span style={{fontSize:13,color:"#c8e0f8",fontWeight:600}}>{o.numero||"Sin número"}</span>
                        </div>
                        <Badge estado={o.estado} estados={estados}/>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{fontSize:11,color:"#3a6a9a",flex:1}}>{o.fecha}{sub>0?` · $${sub.toLocaleString("es-AR")}`:""}</div>
                        {sub>0&&<div style={{display:"flex",alignItems:"center",gap:5}}>
                          <div style={{width:60,height:4,background:"#0a1828",borderRadius:99,overflow:"hidden"}}>
                            <div style={{height:"100%",borderRadius:99,background:pct>=100?"#26A69A":pct>0?"#1565C0":"#1e3a5a",width:pct+"%"}}/>
                          </div>
                          <span style={{fontSize:10,color:pct>=100?"#26A69A":pct>0?"#64B5F6":"#3a6a9a",fontWeight:700}}>{pct}%</span>
                        </div>}
                      </div>
                    </div>
                  );
                }):<div style={{color:"#2a4a6a",fontSize:13}}>Sin órdenes previas</div>}
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
  // newCotNum ahora usa el contador global de Firebase (no se repiten números al borrar)
  const newCotNum = async () => getNextNum("cotizaciones", "PR");

  // ── COTIZACIONES PAGE ────────────────────────────────────────────────────
  const Cotizaciones=()=>{
    const ESTADO_COT=[
      {id:"pendiente",label:"Pendiente",color:"#FFB74D",bg:"#2a1f0a"},
      {id:"enviada",label:"Enviada",color:"#64B5F6",bg:"#1a2a3a"},
      {id:"aceptada",label:"Aceptada",color:"#A5D6A7",bg:"#0a2a0f"},
      {id:"rechazada",label:"Rechazada",color:"#F48FB1",bg:"#2a0a0a"},
      {id:"convertida",label:"→ Orden",color:"#26A69A",bg:"#0a2a26"},
    ];
    const BadgeCot=({estado})=>{const e=ESTADO_COT.find(x=>x.id===estado)||ESTADO_COT[0];return <span style={{background:e.bg,color:e.color,border:`1px solid ${e.color}40`,padding:"2px 10px",borderRadius:99,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{e.label}</span>;};
    return(
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
          <div>
            <h1 style={{margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:24,color:"#e2f0ff"}}>Cotizaciones</h1>
            <p style={{margin:0,color:"#3a6a9a",fontSize:13}}>{cotizaciones.length} cotizaciones</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn small variant="secondary" onClick={()=>setModal({type:"tipos_vidrio"})}><Icon name="settings" size={14}/> Tipos de vidrio</Btn>
            <Btn small onClick={()=>setModal({type:"nueva_cotizacion"})}><Icon name="plus" size={14}/> Nueva Cotización</Btn>
          </div>
        </div>
        <div style={{display:"grid",gap:8}}>
          {cotizaciones.map(c=>{
            const total=+c.pago_total||0;
            const nombre=c.contacto_nombre||getNombre(c.cliente)||"Sin cliente";
            return(
              <div key={c.id} style={{background:"#071220",borderRadius:11,padding:"12px 16px",border:"1px solid #0f2035",display:"flex",alignItems:"center",gap:12}}>
                <div style={{background:"#0a1828",border:"1px solid #FFB74D25",borderRadius:7,padding:"4px 10px",minWidth:105,textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#FFB74D",fontFamily:"monospace"}}>{c.numero}</div>
                  <div style={{fontSize:10,color:"#3a6a9a"}}>{c.fecha}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#e2f0ff",marginBottom:2}}>{nombre}</div>
                  <div style={{fontSize:12,color:"#3a6a9a"}}>{c.items?.length||0} ítem(s){total>0?` · $${total.toLocaleString("es-AR")}`:""}</div>
                </div>
                <BadgeCot estado={c.estado}/>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={()=>setModal({type:"editar_cotizacion",data:c})} style={{background:"none",border:"1px solid #1565C040",color:"#64B5F6",cursor:"pointer",padding:"5px 10px",borderRadius:7,fontSize:12,fontFamily:"inherit",fontWeight:600}}>✏️ Abrir</button>
                  <button onClick={()=>fsDel("cotizaciones",c.id)} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:6,display:"flex",borderRadius:6}}><Icon name="trash" size={15}/></button>
                </div>
              </div>
            );
          })}
          {!cotizaciones.length&&<div style={{textAlign:"center",padding:"44px 0",color:"#2a4a6a"}}><p style={{marginTop:12,fontSize:14}}>No hay cotizaciones aún</p><Btn small onClick={()=>setModal({type:"nueva_cotizacion"})} style={{marginTop:8}}><Icon name="plus" size={14}/> Crear primera cotización</Btn></div>}
        </div>
      </div>
    );
  };

  // ── STOCK PAGE ───────────────────────────────────────────────────────────────
  const CATEGORIAS_STOCK=["Burletes","Perfilería aluminio","Bisagras y herrajes","Silicona y adhesivos","Vidrios (stock propio)","Espejos (stock propio)","Herramientas","Consumibles","Otro"];

  const printStock=(items)=>{
    const alertas=items.filter(i=>i.stock<=i.minimo);
    const rows=items.map(i=>`<tr style="${i.stock<=i.minimo?"background:#fff8e1":""}"><td>${i.nombre}</td><td style="color:#555">${i.categoria||"—"}</td><td style="text-align:center;font-weight:700;color:${i.stock<=i.minimo?"#e65100":"#1a1a2e"}">${i.stock} ${i.unidad||"u."}</td><td style="text-align:center;color:#888">${i.minimo} ${i.unidad||"u."}</td><td style="text-align:center">${i.stock<=i.minimo?'<span style="background:#fff3cd;color:#e65100;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700">⚠ BAJO</span>':'<span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600">✓ OK</span>'}</td></tr>`).join("");
    const body=`
${bizHeader("Inventario de Stock","",new Date().toLocaleDateString("es-AR"),`${items.length} productos · ${alertas.length} con stock bajo`)}
<div class="body">
  ${alertas.length?`<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#795548"><strong>⚠ ${alertas.length} producto${alertas.length>1?"s":""} con stock bajo:</strong> ${alertas.map(a=>a.nombre).join(", ")}</div>`:""}
  <table>
    <thead><tr><th style="text-align:left">Producto</th><th style="text-align:left">Categoría</th><th style="text-align:center">Stock actual</th><th style="text-align:center">Mínimo</th><th style="text-align:center">Estado</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>
${bizFooter()}`;
    openPDF(mkHTML("Stock — La Vidriería Rosario",body));
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

  // ── REPORTES ──────────────────────────────────────────────────────────────
  const Reportes=()=>{
    const MESES=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const hoy=new Date();
    const [mesIdx,setMesIdx]=useState(hoy.getMonth());
    const [anio,setAnio]=useState(hoy.getFullYear());

    const anioStr=String(anio);
    const mesStr=String(mesIdx+1).padStart(2,"0");

    // Filter by month/year using createdAt
    const inMes=(fecha)=>{
      if(!fecha) return false;
      const d=new Date(fecha);
      return d.getMonth()===mesIdx && d.getFullYear()===anio;
    };

    const ordenesDelMes = ordenes.filter(o=>inMes(o.createdAt));
    const cotDelMes = cotizaciones.filter(c=>inMes(c.createdAt));

    // Financials
    const totalCotizado = cotDelMes.reduce((s,c)=>{
      const sub=(c.items||[]).reduce((a,i)=>a+(+i.precio*(+i.cant||1)),0);
      return s+sub*1.21;
    },0);
    const totalOrdenado = ordenesDelMes.reduce((s,o)=>{
      const sub=(o.pres_items||[]).reduce((a,i)=>a+(+i.precio*(+i.cant||1)),0);
      return s+sub*1.21;
    },0);
    const totalCobrado = ordenesDelMes.reduce((s,o)=>(s+(+o.pago_senia||0)+(+o.pago_total||0)),0);
    const totalPendCobro = ordenesDelMes.reduce((s,o)=>{
      const sub=(o.pres_items||[]).reduce((a,i)=>a+(+i.precio*(+i.cant||1)),0)*1.21;
      const cobrado=(+o.pago_senia||0)+(+o.pago_total||0);
      return s+Math.max(0,sub-cobrado);
    },0);

    // Orders by stage
    const ETAPAS_REPORTE=[{id:"presupuesto",label:"Presupuesto"},{id:"medicion",label:"Medición"},{id:"produccion",label:"Producción"},{id:"instalacion",label:"Instalación"}];
    const porEtapa = ETAPAS_REPORTE.map(e=>({
      ...e, count: ordenesDelMes.filter(o=>o.etapa===e.id).length
    }));

    // Top clients this month
    const clienteMap={};
    ordenesDelMes.forEach(o=>{
      if(!o.cliente) return;
      if(!clienteMap[o.cliente]) clienteMap[o.cliente]={count:0,total:0};
      clienteMap[o.cliente].count++;
      const sub=(o.pres_items||[]).reduce((a,i)=>a+(+i.precio*(+i.cant||1)),0)*1.21;
      clienteMap[o.cliente].total+=sub;
    });
    const topClientes=Object.entries(clienteMap)
      .map(([id,v])=>({id,nombre:getNombre(id),...v}))
      .sort((a,b)=>b.total-a.total).slice(0,5);

    // Unpaid orders (all time, not just this month)
    const impagas=ordenes.filter(o=>{
      const sub=(o.pres_items||[]).reduce((a,i)=>a+(+i.precio*(+i.cant||1)),0)*1.21;
      const cobrado=(+o.pago_senia||0)+(+o.pago_total||0);
      return sub>0 && cobrado<sub && !["cobrado"].includes(o.estado);
    });

    const printReporte=()=>{
      const rows=ordenesDelMes.map(o=>{
        const sub=(o.pres_items||[]).reduce((a,i)=>a+(+i.precio*(+i.cant||1)),0)*1.21;
        const cobrado=(+o.pago_senia||0)+(+o.pago_total||0);
        const resta=Math.max(0,sub-cobrado);
        return `<tr><td style="font-family:monospace;font-size:11px">${o.numero||"—"}</td><td>${o.numero||"—"}</td><td>${getNombre(o.cliente)}</td><td style="text-align:right">$${sub.toLocaleString("es-AR")}</td><td style="text-align:right;color:#1565C0">$${cobrado.toLocaleString("es-AR")}</td><td style="text-align:right;color:${resta>0?"#e65100":"#2e7d32"}">${resta>0?"$"+resta.toLocaleString("es-AR"):"✓ Cobrado"}</td></tr>`;
      }).join("");
      const rowsImp=impagas.map(o=>{
        const sub=(o.pres_items||[]).reduce((a,i)=>a+(+i.precio*(+i.cant||1)),0)*1.21;
        const cobrado=(+o.pago_senia||0)+(+o.pago_total||0);
        return `<tr><td style="font-family:monospace;font-size:11px">${o.numero||"—"}</td><td>${o.numero||"—"}</td><td>${getNombre(o.cliente)}</td><td style="text-align:right">$${sub.toLocaleString("es-AR")}</td><td style="text-align:right">$${cobrado.toLocaleString("es-AR")}</td><td style="text-align:right;color:#e65100;font-weight:700">$${Math.max(0,sub-cobrado).toLocaleString("es-AR")}</td></tr>`;
      }).join("");
      const body=`
${bizHeader(`Reporte Mensual — ${MESES[mesIdx]} ${anio}`,"",new Date().toLocaleDateString("es-AR"),`${ordenesDelMes.length} órdenes · ${cotDelMes.length} cotizaciones`)}
<div class="body">
  <div class="g3" style="margin-bottom:20px">
    <div style="background:#e3f2fd;border-radius:10px;padding:14px;text-align:center;border:1px solid #90CAF9"><div style="font-size:11px;color:#1565C0;font-weight:700;text-transform:uppercase;margin-bottom:4px">Total Cotizado</div><div style="font-size:22px;font-weight:900;color:#0a2a5e">$${totalCotizado.toLocaleString("es-AR")}</div><div style="font-size:11px;color:#888">${cotDelMes.length} cotizaciones</div></div>
    <div style="background:#e8f5e9;border-radius:10px;padding:14px;text-align:center;border:1px solid #a5d6a7"><div style="font-size:11px;color:#2e7d32;font-weight:700;text-transform:uppercase;margin-bottom:4px">Total Cobrado</div><div style="font-size:22px;font-weight:900;color:#1b5e20">$${totalCobrado.toLocaleString("es-AR")}</div><div style="font-size:11px;color:#888">${ordenesDelMes.length} órdenes</div></div>
    <div style="background:#fff3e0;border-radius:10px;padding:14px;text-align:center;border:1px solid #ffcc80"><div style="font-size:11px;color:#e65100;font-weight:700;text-transform:uppercase;margin-bottom:4px">Pendiente de Cobro</div><div style="font-size:22px;font-weight:900;color:#bf360c">$${totalPendCobro.toLocaleString("es-AR")}</div><div style="font-size:11px;color:#888">del mes</div></div>
  </div>
  <div class="st">Órdenes del mes</div>
  <table><thead><tr><th>N°</th><th style="text-align:left">Título</th><th style="text-align:left">Cliente</th><th style="text-align:right">Total</th><th style="text-align:right">Cobrado</th><th style="text-align:right">Resta</th></tr></thead><tbody>${rows||"<tr><td colspan='6' style='text-align:center;color:#999;padding:16px'>Sin órdenes este mes</td></tr>"}</tbody></table>
  ${impagas.length?`<div class="st" style="color:#e65100;border-color:#e65100">⚠ Órdenes con saldo pendiente (todos los meses)</div>
  <table><thead><tr><th>N°</th><th style="text-align:left">Título</th><th style="text-align:left">Cliente</th><th style="text-align:right">Total</th><th style="text-align:right">Cobrado</th><th style="text-align:right">Debe</th></tr></thead><tbody>${rowsImp}</tbody></table>`:""}
</div>
${bizFooter()}`;
      openPDF(mkHTML(`Reporte ${MESES[mesIdx]} ${anio}`,body));
    };

    const ETAPAS_MAP={presupuesto:"Presupuesto",medicion:"Medición",produccion:"Producción",instalacion:"Instalación"};

    return(
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
          <div>
            <h1 style={{margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:24,color:"#e2f0ff"}}>Reporte Mensual</h1>
            <p style={{margin:0,color:"#3a6a9a",fontSize:13}}>Resumen financiero y operativo del negocio</p>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <Sel value={mesIdx} onChange={e=>setMesIdx(+e.target.value)} style={{width:130}}>
              {MESES.map((m,i)=><option key={i} value={i}>{m}</option>)}
            </Sel>
            <Sel value={anio} onChange={e=>setAnio(+e.target.value)} style={{width:90}}>
              {[2024,2025,2026,2027].map(y=><option key={y} value={y}>{y}</option>)}
            </Sel>
            <Btn small variant="secondary" onClick={printReporte}><Icon name="pdf" size={14}/> PDF</Btn>
          </div>
        </div>

        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
          {[
            {label:"Cotizado",val:"$"+totalCotizado.toLocaleString("es-AR"),sub:cotDelMes.length+" cotizaciones",color:"#64B5F6"},
            {label:"Ordenado",val:"$"+totalOrdenado.toLocaleString("es-AR"),sub:ordenesDelMes.length+" órdenes",color:"#CE93D8"},
            {label:"Cobrado",val:"$"+totalCobrado.toLocaleString("es-AR"),sub:"en el mes",color:"#A5D6A7"},
            {label:"Pendiente cobro",val:"$"+totalPendCobro.toLocaleString("es-AR"),sub:"del mes",color:"#FFB74D"},
          ].map(s=>(
            <div key={s.label} style={{background:"#071220",borderRadius:12,padding:"16px 18px",border:`1px solid ${s.color}20`}}>
              <div style={{fontSize:11,fontWeight:700,color:s.color,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>{s.label}</div>
              <div style={{fontSize:22,fontWeight:800,color:"#e2f0ff",fontFamily:"Georgia,serif"}}>{s.val}</div>
              <div style={{fontSize:11,color:"#3a6a9a",marginTop:3}}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          {/* Órdenes del mes */}
          <div style={{background:"#071220",borderRadius:12,padding:16,border:"1px solid #0f2035"}}>
            <h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#e2f0ff"}}>Órdenes del mes</h3>
            {ordenesDelMes.length===0&&<div style={{color:"#2a4a6a",fontSize:13,padding:"12px 0",textAlign:"center"}}>Sin órdenes en {MESES[mesIdx]}</div>}
            {ordenesDelMes.slice(0,8).map(o=>{
              const sub=(o.pres_items||[]).reduce((a,i)=>a+(+i.precio*(+i.cant||1)),0)*1.21;
              const cobrado=(+o.pago_senia||0)+(+o.pago_total||0);
              const pct=sub>0?Math.min(100,Math.round(cobrado/sub*100)):0;
              return(
                <div key={o.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #0f2035"}}>
                  <span style={{fontSize:10,color:"#1565C0",fontWeight:700,fontFamily:"monospace",minWidth:90}}>{o.numero}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#c8e0f8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.numero||"Sin número"}</div>
                    <div style={{fontSize:10,color:"#3a6a9a"}}>{getNombre(o.cliente)}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:12,fontWeight:700,color:pct>=100?"#26A69A":pct>0?"#FFB74D":"#5a8ab8"}}>{pct}%</div>
                    <div style={{fontSize:10,color:"#3a6a9a"}}>${sub.toLocaleString("es-AR")}</div>
                  </div>
                </div>
              );
            })}
            {ordenesDelMes.length>8&&<div style={{fontSize:11,color:"#3a6a9a",marginTop:8,textAlign:"center"}}>+{ordenesDelMes.length-8} más</div>}
          </div>

          {/* Top clientes + impagas */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:"#071220",borderRadius:12,padding:16,border:"1px solid #0f2035",flex:1}}>
              <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:700,color:"#e2f0ff"}}>Top clientes del mes</h3>
              {topClientes.length===0&&<div style={{color:"#2a4a6a",fontSize:13}}>Sin datos</div>}
              {topClientes.map((c,i)=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid #0f2035"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"#1565C020",border:"1px solid #1565C040",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#64B5F6",flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1,fontSize:13,color:"#c8e0f8",fontWeight:600}}>{c.nombre}</div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#64B5F6"}}>${c.total.toLocaleString("es-AR")}</div>
                    <div style={{fontSize:10,color:"#3a6a9a"}}>{c.count} orden{c.count>1?"es":""}</div>
                  </div>
                </div>
              ))}
            </div>

            {impagas.length>0&&<div style={{background:"#1a0a00",borderRadius:12,padding:16,border:"1px solid #FFB74D30"}}>
              <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:700,color:"#FFB74D"}}>⚠ Saldos pendientes</h3>
              {impagas.slice(0,5).map(o=>{
                const sub=(o.pres_items||[]).reduce((a,i)=>a+(+i.precio*(+i.cant||1)),0)*1.21;
                const cobrado=(+o.pago_senia||0)+(+o.pago_total||0);
                const resta=sub-cobrado;
                return(
                  <div key={o.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #2a1500"}}>
                    <div>
                      <div style={{fontSize:11,color:"#FFB74D",fontWeight:700,fontFamily:"monospace"}}>{o.numero}</div>
                      <div style={{fontSize:12,color:"#c8e0f8"}}>{getNombre(o.cliente)}</div>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:"#FF8A65"}}>${resta.toLocaleString("es-AR")}</div>
                  </div>
                );
              })}
              {impagas.length>5&&<div style={{fontSize:11,color:"#3a6a9a",marginTop:6,textAlign:"center"}}>+{impagas.length-5} más con saldo pendiente</div>}
            </div>}
          </div>
        </div>
      </div>
    );
  };

  // ── AYUDA ──────────────────────────────────────────────────────────────────
  const Ayuda=()=>{
    const [open,setOpen]=useState(null);
    const toggle=(id)=>setOpen(o=>o===id?null:id);

    const SECCIONES=[
      {
        id:"cotizaciones",
        emoji:"💰",
        titulo:"Cómo hacer una Cotización",
        color:"#FFB74D",
        pasos:[
          {n:1,t:"Ir a Cotizaciones",d:'Hacé click en "Cotizaciones" en el menú izquierdo.'},
          {n:2,t:"Crear nueva cotización",d:'Click en el botón azul "Nueva Cotización" arriba a la derecha.'},
          {n:3,t:"Completar los datos",d:"Escribí el título del trabajo, elegí el cliente de la lista (o agregalo si es nuevo), poné la fecha de hoy y la fecha hasta cuándo vale el presupuesto."},
          {n:4,t:"Agregar los ítems",d:'En la tabla de ítems escribí qué es lo que se va a hacer, la cantidad y el precio unitario. Si necesitás más líneas, click en "Agregar ítem". El sistema calcula el total con IVA automáticamente.'},
          {n:5,t:"Condiciones de pago",d:'Escribí las condiciones, por ejemplo: "50% al confirmar, saldo contra entrega".'},
          {n:6,t:"Guardar",d:'Click en "Crear Cotización". La cotización queda guardada con un número automático tipo PR-25-0001.'},
          {n:7,t:"Generar PDF",d:'Para mandárselo al cliente, buscá la cotización en la lista y hacé click en el ícono verde de PDF. Se abre para imprimir o guardar.'},
          {n:8,t:"Cuando el cliente acepta",d:'Buscá la cotización y hacé click en el botón naranja "→ Orden". Eso convierte la cotización en una orden de trabajo con todos los datos ya cargados.'},
        ],
        alertas:[
          "Si el cliente no aparece en la lista, primero tenés que cargarlo en la sección Clientes.",
          "Una cotización convertida en orden queda marcada como 'Convertida' y no se puede volver a convertir.",
        ]
      },
      {
        id:"ordenes",
        emoji:"📋",
        titulo:"Cómo crear y manejar una Orden",
        color:"#64B5F6",
        pasos:[
          {n:1,t:"Crear la orden",d:'Click en "Nueva Orden" en el menú izquierdo o desde el botón del sidebar. También podés convertir una cotización aprobada en orden con un click.'},
          {n:2,t:"Datos obligatorios",d:"Al abrir la orden, lo primero que vas a ver es una sección azul con tres campos que SÍ O SÍ hay que completar: Nombre del contacto, Teléfono y Domicilio. Sin eso el sistema no deja guardar."},
          {n:3,t:"Tab Presupuesto",d:"Completá el título, elegí el cliente, el tipo de trabajo y la fecha. Si ya tenés una cotización convertida, estos datos vienen precargados."},
          {n:4,t:"Tab Medición",d:"Acá vas a cargar el plano del vidrio. Podés dibujar rectángulos, líneas, círculos y agregar medidas. También podés escribir notas del relevamiento en obra."},
          {n:5,t:"Tab Producción",d:"Escribí los materiales que se necesitan, tildá los procesos (templado, arenado, etc.) y poné la fecha estimada de entrega al taller."},
          {n:6,t:"Tab Instalación",d:"Completá la fecha de instalación, la dirección y quién va a recibir el trabajo. Cuando el trabajo se entregó, tildá la casilla 'Marcar como entregado'."},
          {n:7,t:"Tab Pagos",d:"Registrá la seña y el pago final. Hay botones rápidos: 'Abonó en efectivo' o 'Abonó por transferencia' que completan los campos solos con la fecha de hoy."},
          {n:8,t:"Cambiar el estado",d:"Arriba de la orden hay un selector de etapa. Cambialo según en qué momento está el trabajo: Presupuesto → Medición → Producción → Instalación."},
          {n:9,t:"PDF Completo y PDF Taller",d:"El botón 'PDF Completo' genera el documento con todos los datos. El botón verde 'PDF Taller' genera solo el plano y los materiales, sin precios, para darle al operario."},
        ],
        alertas:[
          "Si cambiás la etapa y guardás, queda registrado en el historial de Actividad con tu nombre y la hora.",
          "Los campos de nombre, teléfono y domicilio son obligatorios. Si no los completás, la orden no se guarda.",
        ]
      },
      {
        id:"tablero",
        emoji:"📊",
        titulo:"Cómo usar el Tablero",
        color:"#CE93D8",
        pasos:[
          {n:1,t:"Qué es el tablero",d:"El tablero muestra todas las órdenes activas organizadas por columnas según su estado. De un vistazo ves todo lo que está en proceso."},
          {n:2,t:"Mover una orden",d:"Para cambiar el estado de una orden, simplemente arrastrá la tarjeta de una columna a otra. Los cambios se guardan automáticamente."},
          {n:3,t:"Ver los detalles",d:"Las tarjetas muestran el número de orden, el título, el cliente y la barra de cobro. Si querés ver o editar todos los datos, entrá a la sección Órdenes y buscala por número."},
          {n:4,t:"Órdenes canceladas",d:"Las órdenes canceladas no aparecen en el tablero. Solo se ven en la lista de Órdenes y en el historial del cliente."},
          {n:5,t:"Agregar o cambiar procesos",d:'Si necesitás agregar una columna nueva (por ejemplo un proceso nuevo), click en el botón "Gestionar Procesos" arriba a la derecha. Podés agregar, renombrar y reordenar.'},
        ],
        alertas:[
          "El tablero no muestra las órdenes Canceladas ni las Cobradas para que no se llene.",
          "Arrastrando las tarjetas también queda registrado el cambio en el historial de la orden.",
        ]
      },
      {
        id:"clientes",
        emoji:"👥",
        titulo:"Cómo cargar y consultar Clientes",
        color:"#80CBC4",
        pasos:[
          {n:1,t:"Agregar un cliente nuevo",d:'Ir a "Clientes" en el menú. Click en "Nuevo". Completá nombre, tipo (cliente, arquitecto, obra o empresa), teléfono, email y dirección. Guardá.'},
          {n:2,t:"Ver el historial de un cliente",d:"Click en el nombre del cliente en la lista. Se abre su ficha completa a la derecha con todos sus datos y abajo el historial de todas las órdenes que hizo, cuánto facturó, cuánto pagó y cuánto debe."},
          {n:3,t:"Editar un cliente",d:"Click en el ícono del lápiz al lado del nombre del cliente. Modificá lo que necesités y guardá."},
          {n:4,t:"Buscar un cliente rápido",d:"Usá el buscador global en el sidebar (arriba del menú). Escribís el nombre o el teléfono y aparece instantáneamente."},
        ],
        alertas:[
          "Siempre cargá primero el cliente antes de crear una cotización u orden a su nombre.",
          "El historial del cliente muestra también las órdenes canceladas para tener registro completo.",
        ]
      },
      {
        id:"stock",
        emoji:"📦",
        titulo:"Cómo manejar el Stock",
        color:"#A5D6A7",
        pasos:[
          {n:1,t:"Agregar un producto",d:'Ir a "Stock". Click en "Nuevo Producto". Completá nombre, categoría, stock actual, stock mínimo y unidad. El stock mínimo es la cantidad a partir de la cual el sistema te avisa que está bajo.'},
          {n:2,t:"Registrar una entrada",d:'Cuando llega mercadería, buscá el producto y click en "+ Entrada". Ponés la cantidad que entró y podés agregar una nota (ej: "Compra proveedor X"). El stock se actualiza solo.'},
          {n:3,t:"Registrar una salida manual",d:'Si usaste materiales sin asociarlos a una orden, click en "− Salida", ponés la cantidad y listo.'},
          {n:4,t:"Descontar desde una orden",d:"En el tab Producción de cualquier orden, hay una sección verde 'Materiales del stock a usar'. Tildás los materiales que vas a usar, ponés la cantidad, y al guardar la orden el stock se descuenta automáticamente."},
          {n:5,t:"Ver alertas de stock bajo",d:"En el home y en el sidebar aparece un aviso naranja cuando algún producto está por debajo del mínimo. También en la sección Stock los ves destacados."},
          {n:6,t:"PDF de inventario",d:'En la sección Stock, el botón "PDF Stock" genera un listado completo del inventario actual con los productos en rojo que tienen stock bajo.'},
        ],
        alertas:[
          "El stock mínimo es una alerta, no un bloqueo. El sistema avisa pero deja seguir operando.",
          "Cuando descontás materiales desde una orden, queda registrado el movimiento con el número de orden como referencia.",
        ]
      },
      {
        id:"reportes",
        emoji:"📈",
        titulo:"Cómo leer los Reportes",
        color:"#F48FB1",
        pasos:[
          {n:1,t:"Seleccionar el mes",d:'Ir a "Reportes". Arriba a la derecha elegís el mes y el año que querés ver.'},
          {n:2,t:"Los 4 números clave",d:"Cotizado: todo lo que se presupuestó ese mes. Ordenado: las órdenes que se crearon. Cobrado: lo que efectivamente entró en caja. Pendiente: lo que falta cobrar del mes."},
          {n:3,t:"Lista de órdenes del mes",d:"Debajo de los números ves cada orden del mes con su barra de cobro. Verde = cobrado, naranja = parcial, azul = sin cobrar."},
          {n:4,t:"Saldos pendientes",d:"A la derecha hay un recuadro naranja con todas las órdenes de cualquier mes que tienen deuda pendiente. Eso es lo que tenés que cobrar."},
          {n:5,t:"PDF del reporte",d:'Click en "PDF" arriba a la derecha. Genera el reporte completo del mes para mostrar o archivar.'},
        ],
        alertas:[
          "Los reportes se arman automáticamente con los datos que ya cargaste en el sistema.",
          "Si una orden no tiene monto presupuestado, no aparece en los totales financieros.",
        ]
      },
      {
        id:"buscador",
        emoji:"🔍",
        titulo:"Cómo usar el Buscador Global",
        color:"#90A4AE",
        pasos:[
          {n:1,t:"Dónde está",d:"El buscador está en el sidebar izquierdo, debajo del logo. Siempre visible desde cualquier pantalla."},
          {n:2,t:"Qué podés buscar",d:"Buscás por número de orden (OT-25-0001), nombre del cliente, título de la orden o cotización, teléfono de contacto. Con escribir 2 letras ya aparecen resultados."},
          {n:3,t:"Abrir un resultado",d:"Hacés click en cualquier resultado y la app te lleva directo a ese elemento y lo abre. No hace falta navegar por los menús."},
          {n:4,t:"Cerrar la búsqueda",d:"Click en la X que aparece al lado del texto o borrá lo que escribiste."},
        ],
        alertas:[
          "El buscador busca en órdenes, clientes y cotizaciones al mismo tiempo.",
        ]
      },
      {
        id:"optimizador",
        emoji:"✂️",
        titulo:"Cómo usar el Optimizador de Cortes",
        color:"#CE93D8",
        pasos:[
          {n:1,t:"Ir al optimizador",d:'Click en "Optimización" en el menú.'},
          {n:2,t:"Tamaño de la hoja",d:"El tamaño predeterminado es 3600×2500mm (hoja estándar). Si usás otra medida, cambiala en los campos Ancho y Alto."},
          {n:3,t:"Agregar las piezas",d:'Por cada pieza que necesitás cortar, ponés el ancho, el alto, la cantidad y una etiqueta (ej: "Baño principal"). Click en "+ Agregar" para sumar más piezas.'},
          {n:4,t:"Calcular",d:'Click en "Optimizar Cortes". El sistema calcula cuántas hojas necesitás y cómo distribuir los cortes para aprovechar al máximo el vidrio.'},
          {n:5,t:"Leer el resultado",d:"Aparece el diagrama visual de cada hoja con las piezas ubicadas. Las piezas con ↺ fueron rotadas por el sistema para que entren mejor."},
          {n:6,t:"PDF del plan de cortes",d:'Click en "Generar PDF". Imprimís el plano de cortes para llevarlo al taller.'},
        ],
        alertas:[
          "Todas las medidas van en milímetros (mm), igual que trabajamos en la vidriería.",
          "Si una pieza no entra en ninguna hoja, aparece en rojo abajo como 'No entró'.",
        ]
      },
      {
        id:"usuarios",
        emoji:"👤",
        titulo:"Usuarios y accesos",
        color:"#64B5F6",
        pasos:[
          {n:1,t:"Usuarios del sistema",d:"El sistema tiene 4 usuarios: Thomas (admin), Taller1, Local1 y Local2. Cada uno tiene su usuario y contraseña."},
          {n:2,t:"Iniciar sesión",d:"Al entrar a la app, se pide usuario y contraseña. Sin eso no se puede acceder."},
          {n:3,t:"Cerrar sesión",d:"Abajo del menú, al lado de tu nombre, hay un ícono de salida. Click ahí para cerrar sesión."},
          {n:4,t:"Quién hizo qué",d:"Cada orden tiene un tab 'Actividad' donde se registra quién la creó, quién la editó y cuándo, con fecha y hora exacta."},
          {n:5,t:"Si olvidás la contraseña",d:"Contactar a Thomas. Él es el administrador del sistema y puede ver o cambiar las credenciales."},
        ],
        alertas:[
          "No compartir la contraseña con otras personas.",
          "Si alguien deja de trabajar en el local, Thomas debe ser notificado para desactivar el acceso.",
        ]
      },
    ];

    return(
      <div>
        <div style={{marginBottom:24}}>
          <h1 style={{margin:"0 0 6px",fontFamily:"Georgia,serif",fontSize:24,color:"#e2f0ff"}}>Centro de Ayuda</h1>
          <p style={{margin:0,color:"#3a6a9a",fontSize:13}}>Guía paso a paso para usar VidrierApp · La Vidriería Rosario</p>
        </div>

        {/* Contacto de emergencia */}
        <div style={{background:"#0a1828",borderRadius:12,padding:"14px 18px",border:"1px solid #1565C040",marginBottom:22,display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#1565C0,#0d47a1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>T</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#e2f0ff"}}>¿No encontrás la respuesta acá?</div>
            <div style={{fontSize:12,color:"#5a8ab8",marginTop:2}}>Revisá primero esta guía completa. Si el problema no está explicado o no podés resolverlo, contactá a <strong style={{color:"#64B5F6"}}>Thomas</strong>.</div>
          </div>
        </div>

        {/* Secciones */}
        <div style={{display:"grid",gap:8}}>
          {SECCIONES.map(sec=>(
            <div key={sec.id} style={{background:"#071220",borderRadius:12,border:`1px solid ${open===sec.id?sec.color+"40":"#0f2035"}`,overflow:"hidden",transition:"border-color 0.2s"}}>
              {/* Header */}
              <button onClick={()=>toggle(sec.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                <div style={{width:36,height:36,borderRadius:9,background:sec.color+"18",border:`1px solid ${sec.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{sec.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#e2f0ff"}}>{sec.titulo}</div>
                  <div style={{fontSize:11,color:"#3a6a9a",marginTop:2}}>{sec.pasos.length} pasos explicados</div>
                </div>
                <div style={{fontSize:18,color:sec.color,transition:"transform 0.2s",transform:open===sec.id?"rotate(180deg)":"rotate(0deg)"}}>▾</div>
              </button>

              {/* Content */}
              {open===sec.id&&<div style={{padding:"0 18px 18px"}}>
                <div style={{borderTop:"1px solid #0f2035",paddingTop:16,display:"flex",flexDirection:"column",gap:10}}>
                  {sec.pasos.map(paso=>(
                    <div key={paso.n} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <div style={{width:26,height:26,borderRadius:"50%",background:sec.color+"20",border:`1px solid ${sec.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:sec.color,flexShrink:0,marginTop:1}}>{paso.n}</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:"#c8e0f8",marginBottom:3}}>{paso.t}</div>
                        <div style={{fontSize:13,color:"#7ab2e8",lineHeight:1.6}}>{paso.d}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {sec.alertas?.length>0&&<div style={{marginTop:16,background:"#1a1a00",borderRadius:8,padding:"10px 14px",border:"1px solid #FFB74D20"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#FFB74D",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>💡 Tener en cuenta</div>
                  {sec.alertas.map((a,i)=>(
                    <div key={i} style={{fontSize:12,color:"#c8b06a",lineHeight:1.6,marginBottom:i<sec.alertas.length-1?6:0}}>· {a}</div>
                  ))}
                </div>}
              </div>}
            </div>
          ))}
        </div>

        <div style={{marginTop:20,padding:"12px 16px",background:"#071220",borderRadius:10,border:"1px solid #0f2035",textAlign:"center"}}>
          <div style={{fontSize:11,color:"#2a4a6a"}}>VidrierApp · La Vidriería Rosario · Desarrollado a medida para el negocio</div>
        </div>
      </div>
    );
  };

  // ── TIPOS DE VIDRIO CRUD ────────────────────────────────────────────────────
  const TiposVidrioManager=()=>{
    const [lista,setLista]=useState([...tiposVidrio]);
    const [nuevo,setNuevo]=useState("");
    const [editIdx,setEditIdx]=useState(null);
    const [editVal,setEditVal]=useState("");
    const guardar=async()=>{ await fsCfgSet("tipos_vidrio",lista); setModal(null); };
    const agregar=()=>{
      if(!nuevo.trim()) return;
      setLista(l=>[...l,nuevo.trim()]);
      setNuevo("");
    };
    const eliminar=(i)=>setLista(l=>l.filter((_,idx)=>idx!==i));
    const startEdit=(i)=>{setEditIdx(i);setEditVal(lista[i]);};
    const saveEdit=()=>{
      if(!editVal.trim()) return;
      setLista(l=>l.map((x,i)=>i===editIdx?editVal.trim():x));
      setEditIdx(null);setEditVal("");
    };
    return(
      <div>
        <p style={{color:"#5a8ab8",fontSize:13,margin:"0 0 14px"}}>
          Estos tipos aparecen en el selector de todas las cotizaciones y órdenes. Los cambios afectan a toda la empresa.
        </p>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <Input value={nuevo} onChange={e=>setNuevo(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&agregar()}
            placeholder="Ej: Doble vidriado hermético 4-12-4..." style={{flex:1}}/>
          <Btn small onClick={agregar}><Icon name="plus" size={14}/> Agregar</Btn>
        </div>
        <div style={{maxHeight:360,overflowY:"auto",display:"flex",flexDirection:"column",gap:5}}>
          {lista.map((tipo,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#0a1020",borderRadius:8,border:"1px solid #0f2035"}}>
              {editIdx===i?(
                <>
                  <Input value={editVal} onChange={e=>setEditVal(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditIdx(null);}}
                    style={{flex:1}} autoFocus/>
                  <button onClick={saveEdit} style={{background:"#1565C0",border:"none",color:"#fff",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12}}>✓</button>
                  <button onClick={()=>setEditIdx(null)} style={{background:"none",border:"1px solid #1e3a5a",color:"#5a8ab8",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:12}}>✕</button>
                </>
              ):(
                <>
                  <div style={{flex:1,fontSize:13,color:"#c8e0f8",fontWeight:500}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:"#1565C0",display:"inline-block",marginRight:8}}/>
                    {tipo}
                  </div>
                  <button onClick={()=>startEdit(i)} style={{background:"none",border:"none",color:"#3a6a9a",cursor:"pointer",padding:4,display:"flex"}}><Icon name="edit" size={13}/></button>
                  <button onClick={()=>eliminar(i)} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,display:"flex"}}><Icon name="trash" size={13}/></button>
                </>
              )}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:14,paddingTop:12,borderTop:"1px solid #1e3a5a"}}>
          <Btn variant="secondary" onClick={()=>setModal(null)}>Cancelar</Btn>
          <Btn onClick={guardar}>✓ Guardar lista ({lista.length} tipos)</Btn>
        </div>
      </div>
    );
  };

  // ── VISTA COLOCADOR ──────────────────────────────────────────────────────────
  // Sub-component: editable items for colocador (hooks used correctly here)
  const ItemEditor=({orden,tiposVidrio,currentUser,saveOrden})=>{
    const [editando,setEditando]=useState(false);
    const [itemsEdit,setItemsEdit]=useState(null);
    const nid2=()=>Math.random().toString(36).slice(2,8);

    const iniciarEdicion=()=>{setItemsEdit((orden.items||[]).map(it=>({...it})));setEditando(true);};
    const guardarMedidas=async()=>{
      const problemaMedidas=(orden.incidencias||[]).filter(i=>!i.resuelto&&i.tipo==="Medidas no coinciden");
      let incAct=[...(orden.incidencias||[])];
      if(problemaMedidas.length>0){
        const resolver=window.confirm("Hay un problema de 'Medidas no coinciden' abierto.\n¿Las nuevas medidas están correctas y resuelven el problema?");
        if(resolver) incAct=incAct.map(i=>(!i.resuelto&&i.tipo==="Medidas no coinciden")?{...i,resuelto:true,resuelto_por:currentUser.nombre,resuelto_fecha:new Date().toISOString()}:i);
      }
      const log={id:nid2(),tipo:"Medidas actualizadas en campo",nota:`Por ${currentUser.nombre}`,fecha:new Date().toISOString(),usuario:currentUser.nombre,resuelto:true};
      await saveOrden({...orden,items:itemsEdit,incidencias:[...incAct,log]});
      setEditando(false);setItemsEdit(null);
    };
    const setItem2=(i,k,v)=>setItemsEdit(arr=>{const a=[...arr];a[i]={...a[i],[k]:v};return a;});
    const addItem=()=>setItemsEdit(arr=>[...arr,{id:nid2(),cant:1,tipo_vidrio:"",ancho:"",alto:"",obs:[],servicio:"",colocacion:"con_colocacion",precio:"",plano:[]}]);
    const removeItem=(i)=>setItemsEdit(arr=>arr.filter((_,idx)=>idx!==i));
    const inpS={background:"#050d18",border:"1px solid #1e3a5a",borderRadius:5,color:"#c8e0f8",padding:"4px 7px",fontSize:12,fontFamily:"inherit",width:"100%"};

    return(
      <div style={{background:"#0a1828",borderRadius:8,padding:10,marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:10,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase"}}>
            📐 Medidas
            {(orden.items||[]).some(it=>it.medida_confirmada)&&<span style={{color:"#26A69A",marginLeft:6}}>✓ Confirmadas</span>}
          </div>
          {!editando
            ?<button onClick={iniciarEdicion} style={{padding:"3px 10px",borderRadius:6,border:"1px solid #1565C040",background:"#0a1828",color:"#64B5F6",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:700}}>✏ Editar medidas</button>
            :<div style={{display:"flex",gap:6}}>
              <button onClick={()=>{setEditando(false);setItemsEdit(null);}} style={{padding:"3px 10px",borderRadius:6,border:"1px solid #1e3a5a",background:"transparent",color:"#5a8ab8",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Cancelar</button>
              <button onClick={guardarMedidas} style={{padding:"3px 10px",borderRadius:6,border:"none",background:"#1565C0",color:"#fff",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:700}}>✓ Guardar</button>
            </div>
          }
        </div>
        {!editando&&(orden.items||[]).map((it,i)=>(
          <div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:i<(orden.items||[]).length-1?"1px solid #0f2035":"none",alignItems:"flex-start"}}>
            <div style={{background:"#1565C020",color:"#64B5F6",borderRadius:5,padding:"2px 8px",fontSize:13,fontWeight:700,flexShrink:0}}>{it.cant||1}×</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:"#c8e0f8",fontWeight:600}}>{it.tipo_vidrio||"—"}</div>
              {it.nombre&&<div style={{fontSize:12,color:"#FFB74D",fontWeight:700,marginTop:1}}>📍 {it.nombre}</div>}
              {(it.ancho||it.alto)&&<div style={{fontSize:12,color:it.medida_confirmada?"#26A69A":"#3a6a9a",fontWeight:it.medida_confirmada?700:400}}>{it.ancho}×{it.alto} mm{it.medida_confirmada?" ✓":""}</div>}
              {(it.obs||[]).length>0&&<div style={{fontSize:11,color:"#5a8ab8"}}>{it.obs.join(", ")}</div>}
            </div>
          </div>
        ))}
        {editando&&itemsEdit&&<>
          {itemsEdit.map((it,i)=>(
            <div key={it.id||i} style={{background:"#071220",borderRadius:8,padding:10,marginBottom:8,border:"1px solid #1565C030"}}>
              <div style={{display:"grid",gridTemplateColumns:"50px 1fr 80px 80px 28px",gap:6,marginBottom:6,alignItems:"end"}}>
                <div><div style={{fontSize:9,color:"#3a6a9a",marginBottom:2}}>CANT.</div><input type="number" min="1" value={it.cant||1} onChange={e=>setItem2(i,"cant",e.target.value)} style={{...inpS,textAlign:"center"}}/></div>
                <div>
                  <div style={{fontSize:9,color:"#3a6a9a",marginBottom:2}}>TIPO DE VIDRIO</div>
                  <select value={tiposVidrio.includes(it.tipo_vidrio)?it.tipo_vidrio:it.tipo_vidrio?"__otro__":""} onChange={e=>{if(e.target.value==="__otro__")setItem2(i,"tipo_vidrio","");else setItem2(i,"tipo_vidrio",e.target.value);}} style={inpS}>
                    <option value="">Seleccionar...</option>
                    {tiposVidrio.map(t=><option key={t} value={t}>{t}</option>)}
                    <option value="__otro__">✏ Otro...</option>
                  </select>
                  {!tiposVidrio.includes(it.tipo_vidrio)&&it.tipo_vidrio!==""&&<input value={it.tipo_vidrio} onChange={e=>setItem2(i,"tipo_vidrio",e.target.value)} placeholder="Tipo..." style={{...inpS,marginTop:4}}/>}
                </div>
                <div><div style={{fontSize:9,color:"#FFB74D",marginBottom:2}}>ANCHO mm</div><input type="number" value={it.ancho||""} onChange={e=>setItem2(i,"ancho",e.target.value)} placeholder="0" style={inpS}/></div>
                <div><div style={{fontSize:9,color:"#FFB74D",marginBottom:2}}>ALTO mm</div><input type="number" value={it.alto||""} onChange={e=>setItem2(i,"alto",e.target.value)} placeholder="0" style={inpS}/></div>
                <button onClick={()=>removeItem(i)} disabled={itemsEdit.length<=1} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,opacity:itemsEdit.length<=1?0.3:1,marginTop:14}}>✕</button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1}}><div style={{fontSize:9,color:"#3a6a9a",marginBottom:2}}>NOMBRE</div><input value={it.nombre||""} onChange={e=>setItem2(i,"nombre",e.target.value)} placeholder="Ej: Baño planta alta..." style={inpS}/></div>
                <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",color:it.medida_confirmada?"#26A69A":"#3a6a9a",fontSize:11,whiteSpace:"nowrap",marginTop:14}}>
                  <input type="checkbox" checked={!!it.medida_confirmada} onChange={e=>setItem2(i,"medida_confirmada",e.target.checked)} style={{accentColor:"#26A69A"}}/>
                  ✓ Medida ok
                </label>
              </div>
            </div>
          ))}
          <button onClick={addItem} style={{width:"100%",padding:"7px",borderRadius:7,border:"1px dashed #1565C040",background:"transparent",color:"#64B5F6",cursor:"pointer",fontSize:12,fontFamily:"inherit",marginTop:2}}>+ Agregar vidrio</button>
        </>}
      </div>
    );
  };

  const ColocadorView=()=>{
    // Always get fresh user data from USUARIOS to handle old sessions
    const userData = USUARIOS.find(u=>u.usuario===currentUser.usuario)||currentUser;
    const equipo = userData.equipo || currentUser.equipo;
    const misOrdenes=ordenes.filter(o=>
      o.equipo_asignado===equipo &&
      !["cobrado","cancelada"].includes(o.estado)
    ).sort((a,b)=>(a.inst_fecha||"").localeCompare(b.inst_fecha||""));

    // DEBUG — remove after fixing
    const debugInfo = {
      usuario: currentUser.usuario,
      equipo_detectado: equipo,
      total_ordenes: ordenes.length,
      ordenes_con_equipo: ordenes.filter(o=>o.equipo_asignado).length,
      mis_ordenes: misOrdenes.length,
      sample: ordenes.slice(0,3).map(o=>({num:o.numero,eq:o.equipo_asignado,est:o.estado})),
    };

    const reportarProblema=async(orden)=>{
      const tipos=["Medidas no coinciden","Cliente ausente","Material defectuoso","Vidrio roto en traslado","Acceso complicado","Otro"];
      const tipo=window.prompt(`Tipo de problema para ${orden.numero}:\n${tipos.map((t,i)=>`${i+1}. ${t}`).join("\n")}\n\nEscribí el número:`);
      if(!tipo)return;
      const idx=parseInt(tipo)-1;
      const tipoText=tipos[idx]||tipo;
      const nota=window.prompt("Detalle adicional (opcional):")||"";
      const incidencia={id:newId(),tipo:tipoText,nota,fecha:new Date().toISOString(),equipo,usuario:currentUser.nombre,resuelto:false};
      const updated={...orden,incidencias:[...(orden.incidencias||[]),incidencia],estado:"pendiente"};
      await saveOrden(updated);
      alert("⚠ Problema reportado. El local fue notificado.");
    };

    const marcarInstalado=async(orden)=>{
      if(!window.confirm(`¿Marcar ${orden.numero} como instalado?`))return;
      const updated={...orden,estado:"entregado",inst_fecha_real:new Date().toISOString().split("T")[0]};
      await saveOrden(updated);
    };

    const ESTADO_COLOR={pendiente:"#FFB74D",esp_materiales:"#64B5F6",taller:"#CE93D8",listo_entregar:"#A5D6A7",entregado:"#26A69A"};

    return(
      <div style={{maxWidth:600,margin:"0 auto",padding:"0 4px"}}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#0a1828,#071220)",borderRadius:12,padding:"16px 18px",marginBottom:16,border:"1px solid #1e3a5a"}}>
          <div style={{fontSize:18,fontWeight:800,color:"#e2f0ff",marginBottom:2}}>
            {currentUser.nombre} — Órdenes asignadas
          </div>
          <div style={{fontSize:12,color:"#3a6a9a"}}>{misOrdenes.length} orden{misOrdenes.length!==1?"es":""} pendiente{misOrdenes.length!==1?"s":""}</div>
        </div>

        {misOrdenes.length===0&&(
          <div style={{textAlign:"center",padding:"40px 20px",color:"#2a4a6a"}}>
            <div style={{fontSize:40,marginBottom:10}}>✅</div>
            <div style={{fontSize:16,fontWeight:600,color:"#3a6a9a"}}>No tenés órdenes asignadas</div>
            <div style={{fontSize:13,color:"#2a4a6a",marginTop:6}}>Cuando te asignen trabajo aparecerá acá</div>
            {/* DEBUG PANEL */}
            <div style={{marginTop:20,padding:12,background:"#0a1020",borderRadius:8,border:"1px solid #1e3a5a",textAlign:"left",fontSize:11,fontFamily:"monospace",color:"#64B5F6"}}>
              <div style={{color:"#FFB74D",fontWeight:700,marginBottom:6}}>🔍 Debug (solo visible temporalmente)</div>
              <div>Usuario: {debugInfo.usuario}</div>
              <div>Equipo detectado: "{debugInfo.equipo_detectado}"</div>
              <div>Total órdenes en Firebase: {debugInfo.total_ordenes}</div>
              <div>Órdenes con equipo asignado: {debugInfo.ordenes_con_equipo}</div>
              <div>Mis órdenes: {debugInfo.mis_ordenes}</div>
              <div style={{marginTop:6,color:"#A5D6A7"}}>Últimas 3 órdenes:</div>
              {debugInfo.sample.map((o,i)=>(
                <div key={i} style={{color:"#c8e0f8"}}>  {o.num} → equipo="{o.eq}" estado={o.est}</div>
              ))}
            </div>
          </div>
        )}

        {misOrdenes.map(orden=>{
          const total=+orden.pago_total||0;
          const cobrado=(+orden.pago_senia||0)+(orden.pagos_parciales||[]).reduce((s,p)=>s+(+p.monto||0),0)+(+orden.pago_final_monto||0);
          const saldo=Math.max(0,total-cobrado);
          const estadoColor=ESTADO_COLOR[orden.estado]||"#5a8ab8";
          const incPendientes=(orden.incidencias||[]).filter(i=>!i.resuelto).length;

          return(
            <div key={orden.id} style={{background:"#071220",borderRadius:12,padding:16,marginBottom:12,border:`1px solid ${incPendientes>0?"#FFB74D40":"#1e3a5a"}`}}>
              {/* Orden header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{fontFamily:"monospace",fontSize:15,fontWeight:800,color:"#64B5F6"}}>{orden.numero}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#e2f0ff",marginTop:2}}>{orden.contacto_nombre||getNombre(orden.cliente)||"Sin cliente"}</div>
                  {orden.contacto_tel&&<div style={{fontSize:12,color:"#3a6a9a"}}>📞 {orden.contacto_tel}</div>}
                  {orden.inst_fecha&&<div style={{fontSize:12,color:"#FFB74D",marginTop:2}}>📅 Instalación: {orden.inst_fecha}</div>}
                  {orden.inst_direccion&&<div style={{fontSize:12,color:"#3a6a9a"}}>📍 {orden.inst_direccion}</div>}
                </div>
                <span style={{background:estadoColor+"20",color:estadoColor,border:`1px solid ${estadoColor}40`,padding:"3px 10px",borderRadius:99,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>
                  {estados.find(e=>e.id===orden.estado)?.label||orden.estado}
                </span>
              </div>

              {/* Vidrios — EDITABLES */}
              <ItemEditor orden={orden} tiposVidrio={tiposVidrio} currentUser={currentUser} saveOrden={saveOrden}/>

              {/* Incidencias — visibles y resolvibles por el colocador */}
              {(orden.incidencias||[]).filter(i=>!i.resuelto).length>0&&(
                <div style={{background:"#1a0800",borderRadius:8,padding:10,marginBottom:10,border:"1px solid #FFB74D40"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#FFB74D",textTransform:"uppercase",marginBottom:8}}>⚠ Problemas abiertos</div>
                  {(orden.incidencias||[]).filter(i=>!i.resuelto).map((inc,i)=>(
                    <div key={inc.id||i} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"6px 0",borderBottom:i<(orden.incidencias||[]).filter(x=>!x.resuelto).length-1?"1px solid #2a1500":"none"}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#FFB74D"}}>{inc.tipo}</div>
                        {inc.nota&&<div style={{fontSize:11,color:"#8a6a3a",marginTop:2}}>{inc.nota}</div>}
                        <div style={{fontSize:10,color:"#5a4a2a",marginTop:2}}>{new Date(inc.fecha).toLocaleString("es-AR")}</div>
                      </div>
                      <button onClick={async()=>{
                        if(!window.confirm(`¿Marcar "${inc.tipo}" como resuelto?`))return;
                        const updated=(orden.incidencias||[]).map(x=>
                          x.id===inc.id?{...x,resuelto:true,resuelto_por:currentUser.nombre,resuelto_fecha:new Date().toISOString()}:x
                        );
                        await saveOrden({...orden,incidencias:updated});
                      }} style={{padding:"4px 10px",borderRadius:6,border:"1px solid #26A69A40",background:"#0a2a0a",color:"#26A69A",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>
                        ✓ Resolver
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Notas de instalación */}
              {orden.inst_notas&&(
                <div style={{background:"#0a1020",borderRadius:8,padding:10,marginBottom:10,border:"1px solid #1565C020"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#5a8ab8",marginBottom:4}}>📋 NOTAS</div>
                  <div style={{fontSize:13,color:"#c8e0f8",lineHeight:1.5}}>{orden.inst_notas}</div>
                </div>
              )}

              {/* Fotos del lugar */}
              {(orden.fotos_instalacion||[]).length>0&&(
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#CE93D8",marginBottom:6}}>📷 FOTOS DEL LUGAR</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {orden.fotos_instalacion.map((f,i)=>(
                      <img key={i} src={f.data} alt="" style={{width:80,height:80,objectFit:"cover",borderRadius:7,cursor:"pointer",border:"1px solid #CE93D820"}} onClick={()=>window.open(f.data,"_blank")}/>
                    ))}
                  </div>
                </div>
              )}

              {/* Precios */}
              <div style={{background:"#0a1020",borderRadius:8,padding:10,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:10,color:"#3a6a9a",fontWeight:700,textTransform:"uppercase"}}>Total</div>
                  <div style={{fontSize:18,fontWeight:800,color:"#e2f0ff"}}>${total.toLocaleString("es-AR")}</div>
                </div>
                {cobrado>0&&<div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#3a6a9a",fontWeight:700}}>Cobrado</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#A5D6A7"}}>${cobrado.toLocaleString("es-AR")}</div>
                </div>}
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:saldo>0?"#FFB74D":"#26A69A"}}>
                    {saldo>0?"Saldo a cobrar":"✅ Pagado"}
                  </div>
                  {saldo>0&&<div style={{fontSize:18,fontWeight:800,color:"#FFB74D"}}>${saldo.toLocaleString("es-AR")}</div>}
                </div>
              </div>

              {/* Incidencias pendientes */}
              {incPendientes>0&&(
                <div style={{background:"#2a1000",borderRadius:8,padding:10,marginBottom:10,border:"1px solid #FFB74D40"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#FFB74D"}}>⚠ {incPendientes} problema{incPendientes>1?"s":""} reportado{incPendientes>1?"s":""}</div>
                  {(orden.incidencias||[]).filter(i=>!i.resuelto).map((inc,i)=>(
                    <div key={i} style={{fontSize:11,color:"#FFB74D",opacity:0.8,marginTop:3}}>• {inc.tipo}{inc.nota?` — ${inc.nota}`:""}</div>
                  ))}
                </div>
              )}

              {/* Fotos del trabajo — subir desde campo */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:"#5a8ab8",marginBottom:6}}>📸 FOTOS DEL TRABAJO</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {(orden.fotos_trabajo||[]).map((f,i)=>(
                    <div key={i} style={{position:"relative"}}>
                      <img src={f.data} alt="" style={{width:70,height:70,objectFit:"cover",borderRadius:7,border:"1px solid #1e3a5a"}} onClick={()=>window.open(f.data,"_blank")}/>
                    </div>
                  ))}
                  <label style={{width:70,height:70,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,background:"#0a1020",borderRadius:7,border:"2px dashed #1e3a5a",cursor:"pointer"}}>
                    <span style={{fontSize:20}}>📷</span>
                    <span style={{fontSize:8,color:"#3a6a9a",textAlign:"center"}}>Agregar</span>
                    <input type="file" accept="image/*" capture="environment" multiple style={{display:"none"}} onChange={e=>{
                      Array.from(e.target.files).forEach(f=>{
                        if(f.size>5*1024*1024){alert("Máx 5MB");return;}
                        const r=new FileReader();
                        r.onload=ev=>saveOrden({...orden,fotos_trabajo:[...(orden.fotos_trabajo||[]),{data:ev.target.result,nombre:f.name,fecha:new Date().toISOString()}]});
                        r.readAsDataURL(f);
                      });
                    }}/>
                  </label>
                </div>
              </div>

              {/* Botones de acción */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button onClick={()=>reportarProblema(orden)}
                  style={{padding:"10px",borderRadius:9,border:"1px solid #FFB74D40",background:"#1a0800",color:"#FFB74D",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:700}}>
                  ⚠ Reportar problema
                </button>
                <button onClick={()=>marcarInstalado(orden)}
                  disabled={orden.estado==="entregado"}
                  style={{padding:"10px",borderRadius:9,border:"none",background:orden.estado==="entregado"?"#0a2a1a":"#26A69A",color:orden.estado==="entregado"?"#26A69A":"#fff",cursor:orden.estado==="entregado"?"default":"pointer",fontSize:13,fontFamily:"inherit",fontWeight:700,opacity:orden.estado==="entregado"?0.7:1}}>
                  {orden.estado==="entregado"?"✅ Instalado":"✅ Marcar instalado"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ── COLOCADOR: vista simplificada ─────────────────────────────────────────
  if(currentUser.rol==="colocador") return(
    <div style={{minHeight:"100vh",background:"#050d18",padding:"12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,padding:"8px 12px",background:"#071220",borderRadius:10,border:"1px solid #1e3a5a"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:currentUser.color}}/>
          <span style={{fontSize:13,fontWeight:700,color:"#e2f0ff"}}>{currentUser.nombre}</span>
        </div>
        <button onClick={onLogout} style={{background:"none",border:"1px solid #1e3a5a",color:"#3a6a9a",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Salir</button>
      </div>
      {loading
        ? <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 0",gap:12}}>
            <div style={{display:"flex",gap:6}}>
              {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#1565C0",animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`}}/>)}
            </div>
            <div style={{color:"#3a6a9a",fontSize:13}}>Cargando órdenes...</div>
            <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
          </div>
        : <ColocadorView/>
      }
    </div>
  );

  const pages={home:<Home/>,ordenes:<OrdenesList/>,tablero:<Tablero/>,clientes:<Clientes/>,cotizaciones:<Cotizaciones/>,stock:<Stock/>,reportes:<Reportes/>,optimize:<Optimizer/>,ayuda:<Ayuda/>};

  return(
    <div style={{minHeight:"100vh",background:"#060f1a",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#c8e0f8",display:"flex"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <Sidebar/>
      <main style={{flex:1,padding:26,overflowY:"auto",minHeight:"100vh"}}>{pages[nav]}</main>

      <Modal open={modal?.type==="nueva_orden"||modal?.type==="editar_orden"} onClose={()=>setModal(null)} title={modal?.type==="editar_orden"?"Editar Orden":"Nueva Orden de Trabajo"} wide xwide>
        <DocForm doc={modal?.data} modo="orden" clientes={clientes} tiposVidrio={tiposVidrio} estados={estados} onSave={saveOrden} onClose={()=>setModal(null)}/>
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
      <Modal open={modal?.type==="tipos_vidrio"} onClose={()=>setModal(null)} title="Gestionar Tipos de Vidrio" wide>
        <TiposVidrioManager/>
      </Modal>
      <Modal open={modal?.type==="gestionar_estados"} onClose={()=>setModal(null)} title="Gestionar Procesos del Tablero" wide>
        <ProcessManager estados={estados} onSave={async(list)=>{await fsCfgSet("estados",list);setModal(null);}} onClose={()=>setModal(null)}/>
      </Modal>
      <Modal open={modal?.type==="nueva_cotizacion"||modal?.type==="editar_cotizacion"} onClose={()=>setModal(null)} title={modal?.type==="editar_cotizacion"?"Editar Cotización":"Nueva Cotización"} wide>
        <DocForm doc={modal?.data} modo="cotizacion" clientes={clientes} tiposVidrio={tiposVidrio} estados={estados}
          onSave={async(form)=>{
            const id=form.id||newId();
            const numero=form.numero||(await newCotNum());
            const logEntry={usuario:currentUser.nombre,rol:currentUser.rol,fecha:new Date().toISOString(),accion:form.id?"Editó la cotización":"Creó la cotización"};
            const actividad=[...(form.actividad||[]),logEntry].slice(-50);
            await fsSet("cotizaciones",id,{...form,id,numero,actividad,createdAt:form.createdAt||new Date().toISOString()});
            setModal(null);
          }}
          onClose={()=>setModal(null)}
          onConvertir={async(form)=>{
            const id=form.id||newId();
            const numero=form.numero||(await newCotNum());
            await fsSet("cotizaciones",id,{...form,id,numero,estado:"convertida",createdAt:form.createdAt||new Date().toISOString()});
            const nuevaOrden={...form,id:newId(),numero:undefined,estado:"pendiente",etapa:"presupuesto",ref_cotizacion:numero,createdAt:new Date().toISOString()};
            await saveOrden(nuevaOrden);
            setModal(null);
            setNav("ordenes");
          }}/>
      </Modal>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = React.useState(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem("vidrierapp_user"));
      if (!stored) return null;
      // Always refresh from USUARIOS to get latest fields (like equipo)
      const fresh = USUARIOS.find(u => u.usuario === stored.usuario && u.clave === stored.clave);
      if (fresh) {
        sessionStorage.setItem("vidrierapp_user", JSON.stringify(fresh));
        return fresh;
      }
      return stored;
    } catch { return null; }
  });
  const handleLogout = () => {
    sessionStorage.removeItem("vidrierapp_user");
    setCurrentUser(null);
  };
  if (!currentUser) return <LoginScreen onLogin={setCurrentUser}/>;
  return <AppInner currentUser={currentUser} onLogout={handleLogout}/>;
}
