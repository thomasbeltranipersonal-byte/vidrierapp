import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";

// ─── USUARIOS ────────────────────────────────────────────────────────────────
const USUARIOS = [
  { usuario: "thomasb", clave: "beltrani07",  nombre: "Thomas",  rol: "admin",  color: "#64B5F6" },
  { usuario: "Taller1", clave: "beltrani07",  nombre: "Taller",  rol: "taller", color: "#CE93D8" },
  { usuario: "Local1",  clave: "virasoro2431",nombre: "Local 1", rol: "local",  color: "#A5D6A7" },
  { usuario: "Local2",  clave: "virasoro2431",nombre: "Local 2", rol: "local",  color: "#80CBC4" },
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

// ─── CORTES PREDEFINIDOS ─────────────────────────────────────────────────────
const CORTES_PREDEFINIDOS = [
  {
    id:"corte_l", label:"Corte en L", emoji:"⌐",
    desc:"Esquina cortada en ángulo recto",
    buildShapes:(w,h,cx,cy)=>[
      // Vidrio con corte en L en esquina sup-der
      {type:"rect",x1:50,y1:50,x2:50+w-cx,y2:50+h,id:"v1",corners:[0,0,0,0],medidaAncho:`${w}mm`,medidaAlto:`${h}mm`},
      {type:"rect",x1:50+w-cx,y1:50+cy,x2:50+w,y2:50+h,id:"v2",corners:[0,0,0,0]},
      // Cota del corte
      {type:"segment",x1:50+w-cx,y1:30,x2:50+w,y2:30,id:"c1",medidaLinea:`${cx}mm`},
      {type:"segment",x1:50+w+10,y1:50,x2:50+w+10,y2:50+cy,id:"c2",medidaLinea:`${cy}mm`},
      {type:"text",x:50+w/2-20,y:50+h/2+5,text:"CORTE L",id:"lbl"},
    ]
  },
  {
    id:"corte_diagonal", label:"Corte diagonal", emoji:"◺",
    desc:"Esquina en 45°",
    buildShapes:(w,h,cx,cy)=>[
      {type:"rect",x1:50,y1:50,x2:50+w,y2:50+h,id:"v1",corners:[0,0,0,0],medidaAncho:`${w}mm`,medidaAlto:`${h}mm`},
      {type:"segment",x1:50+w-cx,y1:50,x2:50+w,y2:50+cy,id:"diag",medidaLinea:"corte"},
      {type:"segment",x1:50+w-cx,y1:30,x2:50+w,y2:30,id:"c1",medidaLinea:`${cx}mm`},
      {type:"text",x:50+w/2-30,y:50+h/2+5,text:"CORTE DIAGONAL",id:"lbl"},
    ]
  },
  {
    id:"entrante_rect", label:"Entrante rectangular", emoji:"⊓",
    desc:"Mordida rectangular en un lado",
    buildShapes:(w,h,cx,cy)=>[
      {type:"rect",x1:50,y1:50,x2:50+w,y2:50+h,id:"v1",corners:[0,0,0,0],medidaAncho:`${w}mm`,medidaAlto:`${h}mm`},
      {type:"rect",x1:50+Math.round((w-cx)/2),y1:50,x2:50+Math.round((w+cx)/2),y2:50+cy,id:"entrante",corners:[0,0,0,0]},
      {type:"segment",x1:50+Math.round((w-cx)/2),y1:30,x2:50+Math.round((w+cx)/2),y2:30,id:"c1",medidaLinea:`${cx}mm`},
      {type:"segment",x1:50+w+10,y1:50,x2:50+w+10,y2:50+cy,id:"c2",medidaLinea:`${cy}mm`},
      {type:"text",x:50+w/2-30,y:50+h/2+10,text:"ENTRANTE",id:"lbl"},
    ]
  },
  {
    id:"perforacion", label:"Perforación", emoji:"◎",
    desc:"Agujero circular en posición configurable",
    buildShapes:(w,h,cx,cy)=>[
      {type:"rect",x1:50,y1:50,x2:50+w,y2:50+h,id:"v1",corners:[0,0,0,0],medidaAncho:`${w}mm`,medidaAlto:`${h}mm`},
      {type:"circle",x1:50+cx-15,y1:50+cy-15,x2:50+cx+15,y2:50+cy+15,id:"perf",medidaAncho:"∅30"},
      {type:"segment",x1:50,y1:50+cy,x2:50+cx,y2:50+cy,id:"c1",medidaLinea:`${cx}mm`},
      {type:"segment",x1:50+cx,y1:50,x2:50+cx,y2:50+cy,id:"c2",medidaLinea:`${cy}mm`},
      {type:"text",x:50+cx-10,y:50+cy+30,text:"PERF",id:"lbl"},
    ]
  },
  {
    id:"bisagra", label:"Entrada bisagra", emoji:"⊣",
    desc:"Corte de bisagra en lateral",
    buildShapes:(w,h,cx,cy)=>[
      {type:"rect",x1:50,y1:50,x2:50+w,y2:50+h,id:"v1",corners:[0,0,0,0],medidaAncho:`${w}mm`,medidaAlto:`${h}mm`},
      // bisagra sup
      {type:"rect",x1:50,y1:50+cy-10,x2:50+cx,y2:50+cy+10,id:"bis1",corners:[0,0,0,0]},
      // bisagra inf
      {type:"rect",x1:50,y1:50+h-cy-10,x2:50+cx,y2:50+h-cy+10,id:"bis2",corners:[0,0,0,0]},
      {type:"segment",x1:30,y1:50+cy,x2:30,y2:50+h-cy,id:"c1",medidaLinea:`dist: ${h-2*cy}mm`},
      {type:"text",x:53,y:50+cy+5,text:"BIS",id:"lbl1"},
      {type:"text",x:53,y:50+h-cy+5,text:"BIS",id:"lbl2"},
    ]
  },
  {
    id:"arco", label:"Arco superior", emoji:"⌢",
    desc:"Vidrio con arco en la parte superior",
    buildShapes:(w,h,cx,cy)=>[
      {type:"rect",x1:50,y1:50+cy,x2:50+w,y2:50+h,id:"v1",corners:[0,0,0,0],medidaAncho:`${w}mm`,medidaAlto:`${h}mm`},
      {type:"circle",x1:50,y1:50,x2:50+w,y2:50+cy*2,id:"arco"},
      {type:"segment",x1:50,y1:50+h+15,x2:50+w,y2:50+h+15,id:"c1",medidaLinea:`${w}mm`},
      {type:"text",x:50+w/2-20,y:50+cy/2+5,text:"ARCO",id:"lbl"},
    ]
  },
];

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
  const DEFAULT_TEMPLATES = [
    { id:"tpl_mampara", name:"Mampara estándar", shapes:[
      {type:"rect",x1:100,y1:50,x2:300,y2:350,id:"r1",corners:[0,0,0,0]},
      {type:"text",x:150,y:210,text:"Mampara",id:"t1"},
    ]},
    { id:"tpl_espejo", name:"Espejo rectangular", shapes:[
      {type:"rect",x1:100,y1:80,x2:400,y2:280,id:"r1",corners:[0,0,0,0]},
      {type:"text",x:200,y:190,text:"Espejo",id:"t1"},
    ]},
  ];
  const [templates, setTemplates] = useState(()=>{
    try{ const v=localStorage.getItem("drawing_templates"); return v?JSON.parse(v):DEFAULT_TEMPLATES; }
    catch{ return DEFAULT_TEMPLATES; }
  });
  const [showSave, setShowSave] = useState(false);
  const [saveName, setSaveName] = useState("");

  useEffect(()=>{
    try{ localStorage.setItem("drawing_templates",JSON.stringify(templates)); }catch{}
  },[templates]);

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
    if(!svgRef.current) return {x:0,y:0};
    const r = svgRef.current.getBoundingClientRect();
    const vbW = 900, vbH = 450;
    const scaleX = vbW / r.width;
    const scaleY = vbH / r.height;
    const raw = {x:(e.clientX-r.left)*scaleX, y:(e.clientY-r.top)*scaleY};
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

  const [showCortes,setShowCortes]=useState(false);
  const [corteSelId,setCorteSelId]=useState(null);
  const [corteW,setCorteW]=useState(600);
  const [corteH,setCorteH]=useState(400);
  const [corteCX,setCorteCX]=useState(150);
  const [corteCY,setCorteCY]=useState(100);

  const aplicarCorte=()=>{
    const c=CORTES_PREDEFINIDOS.find(x=>x.id===corteSelId);
    if(!c) return;
    const newShapes=c.buildShapes(corteW,corteH,corteCX,corteCY).map(s=>({...s,id:newId()}));
    commit(newShapes);
    setShowCortes(false);
  };

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
            <button onClick={()=>setShowCortes(s=>!s)}
              style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${showCortes?"#FFB74D":"#1e3a5a"}`,
                background:showCortes?"#1a1000":"#071220",color:showCortes?"#FFB74D":"#5a8ab8",
                cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:showCortes?700:400}}>
              ✂️ Cortes
            </button>
          </div>
          <span style={{fontSize:10,color:"#1e3a5a",marginLeft:"auto"}}>Ctrl = sin snap · Shift = proporcional</span>
        </div>

        {/* PANEL CORTES PREDEFINIDOS */}
        {showCortes&&<div style={{background:"#0a1000",borderRadius:10,padding:14,border:"1px solid #FFB74D30",marginBottom:8}}>
          <div style={{fontSize:12,fontWeight:700,color:"#FFB74D",marginBottom:10}}>✂️ Cortes y entrantes predefinidos</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
            {CORTES_PREDEFINIDOS.map(c=>(
              <button key={c.id} onClick={()=>setCorteSelId(c.id)}
                style={{padding:"8px 10px",borderRadius:8,border:`1px solid ${corteSelId===c.id?"#FFB74D":"#2a1a00"}`,
                  background:corteSelId===c.id?"#2a1500":"#0d1000",color:corteSelId===c.id?"#FFB74D":"#7a6a4a",
                  cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                <div style={{fontSize:18,marginBottom:3}}>{c.emoji}</div>
                <div style={{fontSize:11,fontWeight:700}}>{c.label}</div>
                <div style={{fontSize:10,opacity:0.7,marginTop:2}}>{c.desc}</div>
              </button>
            ))}
          </div>
          {corteSelId&&<div style={{background:"#071220",borderRadius:8,padding:12,border:"1px solid #2a1a00"}}>
            <div style={{fontSize:11,fontWeight:600,color:"#FFB74D",marginBottom:10}}>
              Configurar: {CORTES_PREDEFINIDOS.find(c=>c.id===corteSelId)?.label}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:10}}>
              <div>
                <div style={{fontSize:10,color:"#5a8ab8",marginBottom:3}}>Ancho vidrio (mm)</div>
                <input type="number" value={corteW} onChange={e=>setCorteW(+e.target.value)}
                  style={{...iS,padding:"5px 8px",fontSize:12,width:"100%"}}/>
              </div>
              <div>
                <div style={{fontSize:10,color:"#5a8ab8",marginBottom:3}}>Alto vidrio (mm)</div>
                <input type="number" value={corteH} onChange={e=>setCorteH(+e.target.value)}
                  style={{...iS,padding:"5px 8px",fontSize:12,width:"100%"}}/>
              </div>
              <div>
                <div style={{fontSize:10,color:"#FFB74D",marginBottom:3}}>
                  {corteSelId==="perforacion"||corteSelId==="bisagra"?"Pos X (mm)":"Corte ancho (mm)"}
                </div>
                <input type="number" value={corteCX} onChange={e=>setCorteCX(+e.target.value)}
                  style={{...iS,padding:"5px 8px",fontSize:12,width:"100%"}}/>
              </div>
              <div>
                <div style={{fontSize:10,color:"#FFB74D",marginBottom:3}}>
                  {corteSelId==="perforacion"||corteSelId==="bisagra"?"Pos Y (mm)":"Corte alto (mm)"}
                </div>
                <input type="number" value={corteCY} onChange={e=>setCorteCY(+e.target.value)}
                  style={{...iS,padding:"5px 8px",fontSize:12,width:"100%"}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={aplicarCorte}
                style={{padding:"7px 18px",borderRadius:7,border:"none",background:"#FFB74D",color:"#000",
                  cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>
                ✓ Insertar en plano
              </button>
              <button onClick={()=>setCorteSelId(null)}
                style={{padding:"7px 12px",borderRadius:7,border:"1px solid #2a1a00",background:"transparent",
                  color:"#7a6a4a",cursor:"pointer",fontFamily:"inherit",fontSize:12}}>
                Cancelar
              </button>
            </div>
          </div>}
        </div>}

        {/* svg canvas */}
        <div style={{position:"relative",borderRadius:10,overflow:"hidden",border:"1px solid #1e3a5a"}}>
          <svg ref={svgRef} width="100%" viewBox="0 0 900 450"
            style={{background:"#050d18",cursor:tool==="select"?"default":"crosshair",display:"block",userSelect:"none",minHeight:300}}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            onClick={e=>{if(e.target===svgRef.current)setSelId(null);}}>
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0b1e35" strokeWidth="0.5"/>
              </pattern>
              <pattern id="grid5" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#grid)"/>
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#0d2540" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="900" height="450" fill="url(#grid5)"/>
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

// ─── SCANNER REMITO CON IA ───────────────────────────────────────────────────
const ScannerRemito = ({onResult}) => {
  const [loading,setLoading] = useState(false);
  const [preview,setPreview] = useState(null);
  const [result,setResult] = useState(null);
  const [error,setError] = useState("");

  const handleFile = async(e) => {
    const file = e.target.files[0];
    if(!file) return;
    setError(""); setResult(null);
    const reader = new FileReader();
    reader.onload = async(ev) => {
      const b64 = ev.target.result.split(",")[1];
      const mediaType = file.type || "image/jpeg";
      setPreview(ev.target.result);
      setLoading(true);
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            model:"claude-sonnet-4-20250514",
            max_tokens:1000,
            messages:[{
              role:"user",
              content:[
                {type:"image",source:{type:"base64",media_type:mediaType,data:b64}},
                {type:"text",text:`Analizá esta imagen de un remito o nota de pedido de vidriería. 
Extraé SOLO la información técnica de los vidrios y materiales.
Respondé ÚNICAMENTE con un JSON válido sin ningún texto extra, en este formato exacto:
{
  "vidrios": [
    {"cant": 1, "tipo": "Float 6mm", "ancho": "1200", "alto": "2000", "obs": "borde pulido"},
    ...
  ],
  "materiales": "texto libre con accesorios y materiales adicionales"
}
Si no podés leer algo, usá "" en ese campo. Si no hay vidrios, devolvé "vidrios": [].`}
              ]
            }]
          })
        });
        const data = await res.json();
        const text = data.content?.find(c=>c.type==="text")?.text||"";
        const clean = text.replace(/```json|```/g,"").trim();
        const parsed = JSON.parse(clean);
        setResult(parsed);
        setLoading(false);
      } catch(err) {
        setError("No se pudo leer el remito. Asegurate que la imagen sea clara y legible.");
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const aplicar = () => {
    if(result) {
      onResult(result.vidrios||[], result.materiales||"");
      setResult(null); setPreview(null);
    }
  };

  return(
    <div>
      <label style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#0a1020",borderRadius:8,border:"2px dashed #CE93D840",cursor:"pointer"}}>
        <span style={{fontSize:22}}>📷</span>
        <div>
          <div style={{fontSize:13,color:"#CE93D8",fontWeight:600}}>Subir foto del remito físico</div>
          <div style={{fontSize:11,color:"#3a6a9a",marginTop:2}}>Imagen clara del papel — la IA extrae vidrios, medidas y accesorios</div>
        </div>
        <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handleFile}/>
      </label>

      {loading&&<div style={{marginTop:10,padding:"12px 16px",background:"#0a1020",borderRadius:8,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:16,height:16,border:"2px solid #CE93D8",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
        <span style={{fontSize:13,color:"#CE93D8"}}>Analizando el remito con IA...</span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>}

      {error&&<div style={{marginTop:10,padding:"10px 14px",background:"#2a0a0a",borderRadius:8,border:"1px solid #7f2020",fontSize:12,color:"#f48fb1"}}>{error}</div>}

      {result&&!loading&&<div style={{marginTop:10,background:"#0a2a0f",borderRadius:8,border:"1px solid #26A69A40",padding:14}}>
        <div style={{fontSize:12,fontWeight:700,color:"#26A69A",marginBottom:10}}>✅ IA detectó {result.vidrios?.length||0} vidrio(s)</div>
        {(result.vidrios||[]).map((v,i)=>(
          <div key={i} style={{fontSize:12,color:"#c8e0f8",padding:"4px 0",borderBottom:"1px solid #0f2035"}}>
            <span style={{fontWeight:700,color:"#A5D6A7"}}>{v.cant}×</span> {v.tipo} — {v.ancho}×{v.alto}mm {v.obs?`· ${v.obs}`:""}
          </div>
        ))}
        {result.materiales&&<div style={{fontSize:12,color:"#7ab2e8",marginTop:8}}>Materiales: {result.materiales}</div>}
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <Btn small onClick={aplicar}><Icon name="plus" size={14}/> Cargar en la orden</Btn>
          <Btn small variant="secondary" onClick={()=>{setResult(null);setPreview(null);}}>Descartar</Btn>
        </div>
      </div>}
    </div>
  );
};

// ─── ORDEN FORM (5 TABS) ─────────────────────────────────────────────────────
const OrdenForm = ({orden,plantillas,clientes,onSave,onClose,stockItems,onDescontarStock}) => {
  const [tab,setTab]=useState("presupuesto");
  const EMPTY={cliente:"",tipo:"",fecha:new Date().toISOString().split("T")[0],
    // Campos obligatorios
    contacto_nombre:"",contacto_telefono:"",contacto_domicilio:"",
    // Presupuesto
    pres_items:[{desc:"",cant:1,precio:""},{desc:"",cant:1,precio:""}],
    pres_condiciones:"50% al confirmar, saldo contra entrega.",pres_validez:"",pres_firmante:"",
    pres_con_iva:true,
    // Vidrios (tabla técnica)
    vidrios:[{cant:1,tipo:"",ancho:"",alto:"",obs:""}],
    // Medición
    med_plano:[],med_notas:"",med_fecha:"",
    // Producción
    prod_materiales:"",prod_procesos:[],prod_fecha_est:"",prod_notas:"",prod_plantilla_id:"",prod_campos:{},
    prod_materiales_usados:[],
    // Instalación
    inst_fecha:"",inst_direccion:"",inst_responsable:"",inst_notas:"",inst_firmante:"",
    // Pagos
    pago_senia:"",pago_senia_fecha:"",pago_senia_metodo:"efectivo",
    pago_total:"",pago_total_fecha:"",pago_total_metodo:"efectivo",pago_notas:"",etapa:"presupuesto"};
  const [form,setForm]=useState(orden?{...EMPTY,...orden,pres_con_iva:orden.pres_con_iva!==false}:EMPTY);
  const [errors,setErrors]=useState({});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const setItem=(i,k,v)=>setForm(f=>{const it=[...f.pres_items];it[i]={...it[i],[k]:v};return{...f,pres_items:it};});
  const addItem=()=>setForm(f=>({...f,pres_items:[...f.pres_items,{desc:"",cant:1,precio:""}]}));
  const removeItem=(i)=>setForm(f=>({...f,pres_items:f.pres_items.filter((_,idx)=>idx!==i)}));
  const setVidrio=(i,k,v)=>setForm(f=>{const vv=[...(f.vidrios||[])];vv[i]={...vv[i],[k]:v};return{...f,vidrios:vv};});
  const addVidrio=()=>setForm(f=>({...f,vidrios:[...(f.vidrios||[]),{cant:1,tipo:"",ancho:"",alto:"",obs:""}]}));
  const removeVidrio=(i)=>setForm(f=>({...f,vidrios:(f.vidrios||[]).filter((_,idx)=>idx!==i)}));
  const tpl=plantillas.find(p=>p.id===form.prod_plantilla_id);
  const setCampo=(k,v)=>setForm(f=>({...f,prod_campos:{...f.prod_campos,[k]:v}}));
  const subTotal=(form.pres_items||[]).reduce((s,i)=>s+(+i.precio*(+i.cant||1)),0);
  const iva = form.pres_con_iva!==false ? subTotal*0.21 : 0;
  const totalConIva=subTotal+iva;
  const tituloOrden = form.numero || "Nueva Orden";
  const PROCESOS=["Templado","Arenado","Pulido","Biselado","Perforado","Pintado","Vinilado"];
  const ETAPAS=[{id:"presupuesto",label:"Presupuesto"},{id:"medicion",label:"Medición"},{id:"produccion",label:"Producción"},{id:"instalacion",label:"Instalación/Entrega"}];
  const METODOS=["Efectivo","Transferencia","Débito","Crédito","Cheque","Otro"];
  const TABS=[{id:"presupuesto",label:"💰 Presupuesto"},{id:"produccion",label:"🔧 Producción"},{id:"instalacion",label:"🚚 Instalación"},{id:"pagos",label:"💳 Pagos"},{id:"actividad",label:"🕐 Actividad"}];

  const validate=()=>{
    const e={};
    if(!form.contacto_nombre?.trim()) e.contacto_nombre="Requerido";
    if(!form.contacto_telefono?.trim()) e.contacto_telefono="Requerido";
    if(!form.contacto_domicilio?.trim()) e.contacto_domicilio="Requerido";
    setErrors(e);
    if(Object.keys(e).length>0){setTab("presupuesto");return false;}
    return true;
  };

  const printOrdenPDF=()=>{
    const cn=clientes.find(c=>c.id===form.cliente)?.nombre||"Sin cliente";
    const ivaAmt=form.pres_con_iva!==false?(form.pres_items||[]).reduce((s,i)=>s+(+i.precio*(+i.cant||1)),0)*0.21:0;
    const sub=(form.pres_items||[]).reduce((s,i)=>s+(+i.precio*(+i.cant||1)),0);
    const tot=sub+ivaAmt;
    const senia=+form.pago_senia||0;

    const bSVG=(pl)=>{if(!(pl||[]).length)return"";const sh=pl;const ax=sh.flatMap(s=>[s.x1,s.x2,s.x].filter(v=>v!=null));const ay=sh.flatMap(s=>[s.y1,s.y2,s.y].filter(v=>v!=null));if(!ax.length)return"";const mx=Math.min(...ax)-20,my=Math.min(...ay)-20,Mx=Math.max(...ax)+20,My=Math.max(...ay)+20;const ss=sh.map(s=>{if(s.type==="segment")return`<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="#1565C0" stroke-width="2.5" stroke-linecap="round"/>${s.medidaLinea?`<text x="${(s.x1+s.x2)/2}" y="${(s.y1+s.y2)/2-9}" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="700">${s.medidaLinea}</text>`:""}`;if(s.type==="text")return`<text x="${s.x}" y="${s.y}" font-size="13" fill="#1a1a2e" font-weight="600">${s.text}</text>`;if(s.type==="circle"){const cx=(s.x1+s.x2)/2,cy=(s.y1+s.y2)/2,rx=Math.abs(s.x2-s.x1)/2,ry=Math.abs(s.y2-s.y1)/2;return`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#e3f2fd" stroke="#1565C0" stroke-width="2"/>`;}const x=Math.min(s.x1,s.x2),y=Math.min(s.y1,s.y2),w=Math.abs(s.x2-s.x1),h=Math.abs(s.y2-s.y1);const c=s.corners||[0,0,0,0];const d=`M ${x+c[0]} ${y} L ${x+w-c[1]} ${y} ${c[1]>0?`Q ${x+w} ${y} ${x+w} ${y+c[1]}`:""} L ${x+w} ${y+h-c[2]} ${c[2]>0?`Q ${x+w} ${y+h} ${x+w-c[2]} ${y+h}`:""} L ${x+c[3]} ${y+h} ${c[3]>0?`Q ${x} ${y+h} ${x} ${y+h-c[3]}`:""} L ${x} ${y+c[0]} ${c[0]>0?`Q ${x} ${y} ${x+c[0]} ${y}`:""} Z`;const dims=s.medidaAncho&&s.medidaAlto?`<text x="${x+w/2}" y="${y+h/2-5}" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="700">${s.medidaAncho}</text><text x="${x+w/2}" y="${y+h/2+11}" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="700">${s.medidaAlto}</text>`:s.medidaAncho||s.medidaAlto?`<text x="${x+w/2}" y="${y+h/2+5}" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="700">${s.medidaAncho||s.medidaAlto}</text>`:"";const sides=[s.ladoSup?`<text x="${x+w/2}" y="${y-7}" text-anchor="middle" font-size="11" fill="#e65100" font-weight="700">${s.ladoSup}</text>`:"",s.ladoInf?`<text x="${x+w/2}" y="${y+h+15}" text-anchor="middle" font-size="11" fill="#e65100" font-weight="700">${s.ladoInf}</text>`:"",s.ladoIzq?`<text x="${x-6}" y="${y+h/2}" text-anchor="end" font-size="11" fill="#e65100" font-weight="700">${s.ladoIzq}</text>`:"",s.ladoDer?`<text x="${x+w+6}" y="${y+h/2}" text-anchor="start" font-size="11" fill="#e65100" font-weight="700">${s.ladoDer}</text>`:""].join("");return`<path d="${d}" fill="#e8f4ff" stroke="#1565C0" stroke-width="2"/>${dims}${sides}`;}).join("");return`<svg viewBox="${mx} ${my} ${Mx-mx} ${My-my}" width="100%" style="max-height:300px;border:2px solid #1565C0;border-radius:8px;background:#f8fbff;display:block">${ss}</svg>`;}; 
    const plano=bSVG(form.med_plano);
    // Vidrios rows
    const vrows=(form.vidrios||[]).filter(v=>v.tipo||v.ancho||v.alto).map(v=>`
      <tr>
        <td style="text-align:center;font-weight:700;font-size:15px;width:50px">${v.cant||1}</td>
        <td style="font-weight:600">${v.tipo||"—"}</td>
        <td style="text-align:center">${v.ancho||"—"} × ${v.alto||"—"} mm</td>
        <td>${v.obs||""}</td>
      </tr>`).join("");
    // Items presupuesto
    const irows=(form.pres_items||[]).filter(i=>i.desc).map((i,idx)=>`
      <tr style="background:${idx%2===0?"#f8fbff":"#fff"}">
        <td>${i.desc}</td>
        <td style="text-align:center">${i.cant||1}</td>
        <td style="text-align:right">$${(+i.precio||0).toLocaleString("es-AR")}</td>
        <td style="text-align:right;font-weight:700">$${((+i.precio||0)*(+i.cant||1)).toLocaleString("es-AR")}</td>
      </tr>`).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Orden ${form.numero||""}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a2e;background:#fff;font-size:13px}
.hdr{background:linear-gradient(135deg,#0a2a5e,#1565C0);padding:18px 28px;display:flex;justify-content:space-between;align-items:center;gap:16px}
.hdr-left{display:flex;align-items:center;gap:12px}
.hdr-logo{width:60px;height:60px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3));flex-shrink:0}
.biz-name{font-size:19px;font-weight:900;color:#fff;letter-spacing:0.5px}
.biz-sub{font-size:10px;color:rgba(255,255,255,0.7);margin-top:2px}
.biz-contact{font-size:10px;color:rgba(255,255,255,0.85);margin-top:2px}
.hdr-right{text-align:right;flex-shrink:0}
.doc-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.7)}
.doc-num{font-size:28px;font-weight:900;color:#fff;letter-spacing:1px;display:block}
.doc-date{font-size:10px;color:rgba(255,255,255,0.7);margin-top:3px;display:block}
.divider{height:3px;background:linear-gradient(90deg,#1565C0,#42A5F5,#1565C0)}
.body{padding:20px 28px}
.st{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:4px;margin:18px 0 10px}
.st:first-child{margin-top:0}
.client-box{background:#f0f6ff;border-radius:8px;padding:12px 16px;border:1px solid #e0ecff;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.f label{font-size:9px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:2px}
.f p{font-size:14px;font-weight:600;color:#1a1a2e}
table{width:100%;border-collapse:collapse;font-size:13px}
thead tr{background:linear-gradient(135deg,#0a2a5e,#1565C0);color:#fff}
thead th{padding:8px 12px;font-size:11px;font-weight:600;letter-spacing:0.5px}
tbody tr:nth-child(even){background:#f8fbff}
tbody td{padding:8px 12px;border-bottom:1px solid #e8f0ff}
.precio-box{margin-top:12px;display:flex;justify-content:flex-end}
.precio-inner{width:260px;background:#f0f6ff;border-radius:8px;padding:12px 16px;border:1px solid #e0ecff}
.precio-row{display:flex;justify-content:space-between;padding:3px 0;font-size:13px;color:#555}
.precio-total{display:flex;justify-content:space-between;padding:8px 0 2px;font-size:17px;font-weight:900;color:#0a2a5e;border-top:2px solid #1565C0;margin-top:6px}
.senia-box{margin-top:12px;background:#fff8e1;border:1px solid #ffc107;border-radius:8px;padding:10px 16px;display:flex;justify-content:space-between;align-items:center}
.senia-label{font-size:11px;font-weight:700;color:#F57F17;text-transform:uppercase;letter-spacing:0.5px}
.senia-val{font-size:18px;font-weight:900;color:#E65100}
.senia-nota{font-size:11px;color:#795548;margin-top:2px}
.sign-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:32px}
.sign-line{border-top:1.5px solid #1565C0;padding-top:8px;text-align:center}
.sign-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.sign-name{font-size:12px;font-weight:600;color:#1565C0;margin-top:3px}
.footer{background:#f0f6ff;border-top:2px solid #e3f2fd;padding:8px 28px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#888}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:8mm}}
</style></head><body>
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
    <div class="doc-type">Remito de Trabajo</div>
    <span class="doc-num">${form.numero||"S/N"}</span>
    <span class="doc-date">Fecha: ${form.fecha||""}</span>
  </div>
</div>
<div class="divider"></div>
<div class="body">

  <div class="st">Datos del Cliente</div>
  <div class="client-box">
    <div class="f"><label>Nombre</label><p>${form.contacto_nombre||cn||"—"}</p></div>
    <div class="f"><label>Teléfono</label><p>${form.contacto_telefono||"—"}</p></div>
    <div class="f"><label>Domicilio</label><p>${form.contacto_domicilio||"—"}</p></div>
  </div>

  ${vrows?`<div class="st">Descripción de Materiales y Servicio</div>
  <table>
    <thead><tr>
      <th style="text-align:center;width:50px">Cant.</th>
      <th style="text-align:left">Tipo de vidrio</th>
      <th style="text-align:center">Medidas (mm)</th>
      <th style="text-align:left">Detalle / Borde / Accesorios</th>
    </tr></thead>
    <tbody>${vrows}</tbody>
  </table>`:""}

  ${form.prod_materiales?`<div style="margin-top:10px;padding:10px 14px;background:#f8f9ff;border-left:3px solid #1565C0;border-radius:0 6px 6px 0;font-size:13px;line-height:1.7;color:#333">${form.prod_materiales}</div>`:""}

  ${irows?`<div class="st">Servicio e Instalación</div>
  <table>
    <thead><tr>
      <th style="text-align:left">Descripción</th>
      <th style="text-align:center;width:60px">Cant.</th>
      <th style="text-align:right;width:100px">P. Unit.</th>
      <th style="text-align:right;width:110px">Subtotal</th>
    </tr></thead>
    <tbody>${irows}</tbody>
  </table>
  <div class="precio-box">
    <div class="precio-inner">
      <div class="precio-row"><span>Subtotal</span><span>$${sub.toLocaleString("es-AR")}</span></div>
      ${form.pres_con_iva!==false?`<div class="precio-row"><span>IVA (21%)</span><span>$${ivaAmt.toLocaleString("es-AR")}</span></div>`:`<div class="precio-row"><span style="font-style:italic;color:#aaa">Sin IVA — Efectivo</span></div>`}
      <div class="precio-total"><span>TOTAL</span><span>$${tot.toLocaleString("es-AR")}</span></div>
    </div>
  </div>`:""}

  ${senia>0?`<div class="senia-box">
    <div>
      <div class="senia-label">💰 Seña abonada</div>
      <div class="senia-nota">Forma de pago: ${form.pago_senia_metodo||"—"} · Fecha: ${form.pago_senia_fecha||"—"}</div>
    </div>
    <div>
      <div class="senia-val">$${senia.toLocaleString("es-AR")}</div>
      ${tot>0?`<div class="senia-nota" style="text-align:right">Resta: $${Math.max(0,tot-senia).toLocaleString("es-AR")}</div>`:""}
    </div>
  </div>`:""}

  ${plano?`<div class="st">Plano / Croquis</div><div style="margin-top:6px">${plano}</div>`:""}

  ${form.pres_condiciones?`<div style="margin-top:14px;padding:10px 14px;background:#f8f9ff;border-left:3px solid #1565C0;border-radius:0 6px 6px 0;font-size:12px;color:#555;line-height:1.6">${form.pres_condiciones}</div>`:""}

  <div class="sign-grid">
    <div class="sign-line">
      <div class="sign-label">Firma del colocador</div>
      <div style="height:36px"></div>
      <div class="sign-name">La Vidriería Rosario</div>
    </div>
    <div class="sign-line">
      <div class="sign-label">Conformidad del cliente</div>
      <div style="height:36px"></div>
      <div style="font-size:12px;color:#555;margin-top:2px">${form.contacto_nombre||form.inst_firmante||form.pres_firmante||"________________________"}</div>
    </div>
  </div>

</div>
<div class="footer">
  <span>Generado el ${new Date().toLocaleString("es-AR")} · VidrierApp</span>
  <span>Mendoza 1783 · Rosario · 341 425-1007</span>
</div>
</body></html>`;
    const w=window.open("","_blank","width=940,height=820");
    if(w){w.document.write(html.replace("BIZ_LOGO",BIZ_LOGO));w.document.close();w.onload=()=>{w.focus();w.print();};}
  };

  const printProduccionPDF=()=>{
    const cn=clientes.find(c=>c.id===form.cliente)?.nombre||"Sin cliente";

    const bSVG=(pl)=>{if(!(pl||[]).length)return"";const sh=pl;const ax=sh.flatMap(s=>[s.x1,s.x2,s.x].filter(v=>v!=null));const ay=sh.flatMap(s=>[s.y1,s.y2,s.y].filter(v=>v!=null));if(!ax.length)return"";const mx=Math.min(...ax)-20,my=Math.min(...ay)-20,Mx=Math.max(...ax)+20,My=Math.max(...ay)+20;const ss=sh.map(s=>{if(s.type==="segment")return`<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="#1565C0" stroke-width="2.5" stroke-linecap="round"/>${s.medidaLinea?`<text x="${(s.x1+s.x2)/2}" y="${(s.y1+s.y2)/2-9}" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="700">${s.medidaLinea}</text>`:""}`;if(s.type==="text")return`<text x="${s.x}" y="${s.y}" font-size="13" fill="#1a1a2e" font-weight="600">${s.text}</text>`;if(s.type==="circle"){const cx=(s.x1+s.x2)/2,cy=(s.y1+s.y2)/2,rx=Math.abs(s.x2-s.x1)/2,ry=Math.abs(s.y2-s.y1)/2;return`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#e3f2fd" stroke="#1565C0" stroke-width="2"/>`;}const x=Math.min(s.x1,s.x2),y=Math.min(s.y1,s.y2),w=Math.abs(s.x2-s.x1),h=Math.abs(s.y2-s.y1);const c=s.corners||[0,0,0,0];const d=`M ${x+c[0]} ${y} L ${x+w-c[1]} ${y} ${c[1]>0?`Q ${x+w} ${y} ${x+w} ${y+c[1]}`:""} L ${x+w} ${y+h-c[2]} ${c[2]>0?`Q ${x+w} ${y+h} ${x+w-c[2]} ${y+h}`:""} L ${x+c[3]} ${y+h} ${c[3]>0?`Q ${x} ${y+h} ${x} ${y+h-c[3]}`:""} L ${x} ${y+c[0]} ${c[0]>0?`Q ${x} ${y} ${x+c[0]} ${y}`:""} Z`;const dims=s.medidaAncho&&s.medidaAlto?`<text x="${x+w/2}" y="${y+h/2-5}" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="700">${s.medidaAncho}</text><text x="${x+w/2}" y="${y+h/2+11}" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="700">${s.medidaAlto}</text>`:s.medidaAncho||s.medidaAlto?`<text x="${x+w/2}" y="${y+h/2+5}" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="700">${s.medidaAncho||s.medidaAlto}</text>`:"";const sides=[s.ladoSup?`<text x="${x+w/2}" y="${y-7}" text-anchor="middle" font-size="11" fill="#e65100" font-weight="700">${s.ladoSup}</text>`:"",s.ladoInf?`<text x="${x+w/2}" y="${y+h+15}" text-anchor="middle" font-size="11" fill="#e65100" font-weight="700">${s.ladoInf}</text>`:"",s.ladoIzq?`<text x="${x-6}" y="${y+h/2}" text-anchor="end" font-size="11" fill="#e65100" font-weight="700">${s.ladoIzq}</text>`:"",s.ladoDer?`<text x="${x+w+6}" y="${y+h/2}" text-anchor="start" font-size="11" fill="#e65100" font-weight="700">${s.ladoDer}</text>`:""].join("");return`<path d="${d}" fill="#e8f4ff" stroke="#1565C0" stroke-width="2"/>${dims}${sides}`;}).join("");return`<svg viewBox="${mx} ${my} ${Mx-mx} ${My-my}" width="100%" style="max-height:300px;border:2px solid #1565C0;border-radius:8px;background:#f8fbff;display:block">${ss}</svg>`;}; 
    const plano=bSVG(form.med_plano);
    const vrows=(form.vidrios||[]).filter(v=>v.tipo||v.ancho||v.alto).map((v,i)=>`
      <tr style="background:${i%2===0?"#f8fbff":"#fff"}">
        <td style="text-align:center;font-size:18px;font-weight:900;width:50px">${v.cant||1}</td>
        <td style="font-weight:700;font-size:15px">${v.tipo||"—"}</td>
        <td style="text-align:center;font-size:15px;font-weight:600">${v.ancho||"—"} × ${v.alto||"—"} mm</td>
        <td style="font-size:14px">${v.obs||""}</td>
      </tr>`).join("");
    // Split prod_materiales by line for line-items style
    const matLines=(form.prod_materiales||"").split("\n").filter(l=>l.trim()).map((l,i)=>`
      <tr style="background:${i%2===0?"#f8fbff":"#fff"}">
        <td style="font-size:14px;padding:10px 14px">${l}</td>
      </tr>`).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Taller ${form.numero||""}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a2e;background:#fff}
.hdr{background:linear-gradient(135deg,#0a2a5e,#1565C0);padding:16px 28px;display:flex;justify-content:space-between;align-items:center}
.hdr-logo{width:56px;height:56px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3))}
.hdr-center{flex:1;padding:0 16px}
.biz-name{font-size:17px;font-weight:900;color:#fff}
.biz-sub{font-size:10px;color:rgba(255,255,255,0.7);margin-top:2px}
.hdr-right{text-align:right}
.doc-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.7)}
.doc-num{font-size:30px;font-weight:900;color:#fff;letter-spacing:1px;display:block}
.doc-badge{display:inline-block;margin-top:5px;padding:3px 10px;border-radius:99px;background:rgba(255,255,255,0.2);font-size:11px;font-weight:700;color:#fff}
.divider{height:4px;background:linear-gradient(90deg,#1565C0,#42A5F5,#1565C0)}
.body{padding:18px 28px}
.client-strip{background:#f0f6ff;border-radius:8px;padding:10px 16px;border:1px solid #e0ecff;display:flex;gap:24px;align-items:center;margin-bottom:16px}
.cf label{font-size:9px;color:#888;font-weight:700;text-transform:uppercase;display:block;margin-bottom:1px}
.cf p{font-size:14px;font-weight:600;color:#1a1a2e}
.st{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:4px;margin:16px 0 8px}
table{width:100%;border-collapse:collapse}
thead tr{background:linear-gradient(135deg,#0a2a5e,#1565C0);color:#fff}
thead th{padding:10px 14px;font-size:12px;font-weight:600;letter-spacing:0.5px}
tbody td{padding:10px 14px;border-bottom:1px solid #e8f0ff;vertical-align:middle}
.proc-chip{display:inline-block;padding:5px 14px;background:#e3f2fd;color:#1565C0;border-radius:99px;font-size:12px;font-weight:700;margin:3px;border:1px solid #90CAF9}
.warn-box{background:#fff8e1;border-left:3px solid #FFA000;border-radius:0 6px 6px 0;padding:10px 14px;font-size:13px;line-height:1.7;color:#333}
.sign-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px}
.sign-line{border-top:2px solid #1565C0;padding-top:8px;text-align:center}
.sign-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.footer{background:#f0f6ff;border-top:2px solid #e3f2fd;padding:7px 28px;display:flex;justify-content:space-between;font-size:10px;color:#888}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:7mm}}
</style></head><body>
<div class="hdr">
  <img class="hdr-logo" src="${BIZ_LOGO}" alt="LV"/>
  <div class="hdr-center">
    <div class="biz-name">La Vidriería Rosario — TALLER</div>
    <div class="biz-sub">Orden de Producción Interna</div>
  </div>
  <div class="hdr-right">
    <div class="doc-type">Orden N°</div>
    <span class="doc-num">${form.numero||"S/N"}</span>
    ${form.prod_fecha_est?`<span class="doc-badge">📅 Entrega: ${form.prod_fecha_est}</span>`:""}
  </div>
</div>
<div class="divider"></div>
<div class="body">

  <div class="client-strip">
    <div class="cf"><label>Cliente</label><p>${form.contacto_nombre||cn}</p></div>
    <div class="cf"><label>Teléfono</label><p>${form.contacto_telefono||"—"}</p></div>
    <div class="cf"><label>Domicilio</label><p>${form.contacto_domicilio||"—"}</p></div>
  </div>

  ${vrows?`<div class="st">Vidrios a Producir</div>
  <table>
    <thead><tr>
      <th style="text-align:center;width:60px">Cant.</th>
      <th style="text-align:left">Tipo de vidrio</th>
      <th style="text-align:center;width:160px">Medidas (mm)</th>
      <th style="text-align:left">Borde / Corte / Accesorios</th>
    </tr></thead>
    <tbody>${vrows}</tbody>
  </table>`:""}

  ${matLines?`<div class="st">Accesorios y Materiales</div>
  <table>
    <thead><tr><th style="text-align:left">Descripción</th></tr></thead>
    <tbody>${matLines}</tbody>
  </table>`:""}

  ${plano?`<div class="st">Plano / Croquis</div><div style="margin-top:8px">${plano}</div>`:""}

  ${(form.prod_procesos||[]).length?`<div class="st">Procesos Requeridos</div><div style="margin-top:6px">${(form.prod_procesos||[]).map(p=>`<span class="proc-chip">${p}</span>`).join("")}</div>`:""}

  ${form.prod_notas?`<div class="st">Instrucciones Especiales</div><div class="warn-box">${form.prod_notas}</div>`:""}

  <div class="sign-grid">
    <div class="sign-line"><div class="sign-label">Recibido por taller</div><div style="height:32px"></div></div>
    <div class="sign-line"><div class="sign-label">Entregado por</div><div style="height:32px"></div></div>
  </div>

</div>
<div class="footer">
  <span>Generado el ${new Date().toLocaleString("es-AR")} · VidrierApp</span>
  <span>La Vidriería Rosario · Mendoza 1783 · 341 425-1007</span>
</div>
</body></html>`;
    const w=window.open("","_blank","width=860,height=780");
    if(w){w.document.write(html.replace("BIZ_LOGO",BIZ_LOGO));w.document.close();w.onload=()=>{w.focus();w.print();};}
  };

    return(
    <div>
      {/* HEADER */}
      <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr auto",gap:10,marginBottom:16,padding:"12px 16px",background:"#071220",borderRadius:10,border:"1px solid #1e3a5a",alignItems:"end"}}>
        <div style={{paddingBottom:16}}>
          <div style={{fontSize:10,fontWeight:600,color:"#5a8ab8",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>Número</div>
          <div style={{fontSize:18,fontWeight:800,color:"#1565C0",fontFamily:"monospace",padding:"8px 14px",background:"#0a1828",borderRadius:8,border:"1px solid #1565C030",letterSpacing:"1px"}}>{form.numero||"—"}</div>
        </div>
        <Field label="Cliente"><Sel value={form.cliente} onChange={e=>set("cliente",e.target.value)}><option value="">Sin asignar</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</Sel></Field>
        <Field label="Etapa actual"><Sel value={form.etapa} onChange={e=>set("etapa",e.target.value)}>{ETAPAS.map(e=><option key={e.id} value={e.id}>{e.label}</option>)}</Sel></Field>
        <div style={{paddingBottom:16,display:"flex",gap:6,flexDirection:"column"}}>
          <Btn small variant="secondary" onClick={printOrdenPDF}><Icon name="pdf" size={14}/> PDF Completo</Btn>
          <Btn small variant="secondary" onClick={printProduccionPDF} style={{background:"#0a2a1a",border:"1px solid #26A69A40",color:"#26A69A"}}>
            <Icon name="glass" size={14}/> PDF Taller
          </Btn>
        </div>
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
        {/* CAMPOS OBLIGATORIOS */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1565C040",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#64B5F6",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:12}}>
            ✳️ Datos obligatorios del cliente
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Field label={<span>Nombre <span style={{color:"#f48fb1"}}>*</span></span>}>
              <Input value={form.contacto_nombre||""} onChange={e=>set("contacto_nombre",e.target.value)}
                placeholder="Nombre completo..."
                style={{...iS,borderColor:errors.contacto_nombre?"#f44336":"#1e3a5a"}}/>
              {errors.contacto_nombre&&<div style={{fontSize:11,color:"#f48fb1",marginTop:3}}>⚠ Campo requerido</div>}
            </Field>
            <Field label={<span>Teléfono <span style={{color:"#f48fb1"}}>*</span></span>}>
              <Input value={form.contacto_telefono||""} onChange={e=>set("contacto_telefono",e.target.value)}
                placeholder="341 000-0000..."
                style={{...iS,borderColor:errors.contacto_telefono?"#f44336":"#1e3a5a"}}/>
              {errors.contacto_telefono&&<div style={{fontSize:11,color:"#f48fb1",marginTop:3}}>⚠ Campo requerido</div>}
            </Field>
            <Field label={<span>Domicilio <span style={{color:"#f48fb1"}}>*</span></span>}>
              <Input value={form.contacto_domicilio||""} onChange={e=>set("contacto_domicilio",e.target.value)}
                placeholder="Calle y número..."
                style={{...iS,borderColor:errors.contacto_domicilio?"#f44336":"#1e3a5a"}}/>
              {errors.contacto_domicilio&&<div style={{fontSize:11,color:"#f48fb1",marginTop:3}}>⚠ Campo requerido</div>}
            </Field>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
          <Field label="Tipo de Trabajo"><Sel value={form.tipo} onChange={e=>set("tipo",e.target.value)}><option value="">Seleccionar...</option>{TIPOS_TRABAJO.map(t=><option key={t} value={t}>{t}</option>)}</Sel></Field>
          <Field label="Fecha"><Input type="date" value={form.fecha} onChange={e=>set("fecha",e.target.value)}/></Field>
          <Field label="Válido hasta"><Input type="date" value={form.pres_validez} onChange={e=>set("pres_validez",e.target.value)}/></Field>
        </div>

        {/* TABLA DE VIDRIOS */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1565C030",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#64B5F6",textTransform:"uppercase",letterSpacing:"0.5px"}}>🔷 Detalle de Vidrios</div>
            <Btn small onClick={addVidrio}><Icon name="plus" size={13}/> Agregar</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"55px 1fr 90px 90px 1fr 28px",gap:8,marginBottom:6}}>
            {["Cant.","Tipo de vidrio","Ancho (mm)","Alto (mm)","Observaciones",""].map(h=><span key={h} style={{fontSize:10,color:"#3a6a9a",fontWeight:600}}>{h}</span>)}
          </div>
          {(form.vidrios||[{cant:1,tipo:"",ancho:"",alto:"",obs:""}]).map((v,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"55px 1fr 90px 90px 1fr 28px",gap:8,marginBottom:8,alignItems:"center"}}>
              <Input type="number" min="1" value={v.cant} onChange={e=>setVidrio(i,"cant",e.target.value)} style={{textAlign:"center"}}/>
              <div>
                <Sel value={v.tipo==="__custom__"||(!TIPOS_VIDRIO.includes(v.tipo)&&v.tipo)?"__custom__":v.tipo}
                  onChange={e=>{if(e.target.value==="__custom__")setVidrio(i,"tipo","__custom__");else setVidrio(i,"tipo",e.target.value);}}>
                  <option value="">Tipo...</option>
                  {TIPOS_VIDRIO.filter(t=>t!=="Otro").map(t=><option key={t} value={t}>{t}</option>)}
                  <option value="__custom__">✏️ Escribir manualmente...</option>
                </Sel>
                {(v.tipo==="__custom__"||(!TIPOS_VIDRIO.includes(v.tipo)&&v.tipo&&v.tipo!==""))&&(
                  <Input value={v.tipo==="__custom__"?"":v.tipo} onChange={e=>setVidrio(i,"tipo",e.target.value)}
                    placeholder="Escribí el tipo de vidrio..." style={{marginTop:5}}/>
                )}
              </div>
              <Input type="number" value={v.ancho} onChange={e=>setVidrio(i,"ancho",e.target.value)} placeholder="mm"/>
              <Input type="number" value={v.alto} onChange={e=>setVidrio(i,"alto",e.target.value)} placeholder="mm"/>
              <Input value={v.obs} onChange={e=>setVidrio(i,"obs",e.target.value)} placeholder="Borde, corte..."/>
              <button onClick={()=>removeVidrio(i)} disabled={(form.vidrios||[]).length<=1} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,opacity:(form.vidrios||[]).length<=1?0.3:1,display:"flex"}}><Icon name="trash" size={13}/></button>
            </div>
          ))}
        </div>

        {/* ÍTEMS PRESUPUESTO */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase"}}>Ítems del Presupuesto</div>
            <Btn small onClick={addItem}><Icon name="plus" size={13}/> Ítem</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 60px 120px 28px",gap:8,marginBottom:5}}>
            {["Descripción","Cant.","Precio unit.",""].map(h=><span key={h} style={{fontSize:10,color:"#3a6a9a",fontWeight:600}}>{h}</span>)}
          </div>
          {(form.pres_items||[]).map((item,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 60px 120px 28px",gap:8,marginBottom:7,alignItems:"center"}}>
              <Input value={item.desc} onChange={e=>setItem(i,"desc",e.target.value)} placeholder="Ej: Mano de obra, instalación..."/>
              <Input type="number" value={item.cant} min="1" onChange={e=>setItem(i,"cant",e.target.value)} style={{textAlign:"center"}}/>
              <Input type="number" value={item.precio} onChange={e=>setItem(i,"precio",e.target.value)} placeholder="$0"/>
              <button onClick={()=>removeItem(i)} disabled={(form.pres_items||[]).length<=1} style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,opacity:(form.pres_items||[]).length<=1?0.3:1,display:"flex"}}><Icon name="trash" size={13}/></button>
            </div>
          ))}

          {/* IVA TOGGLE */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10,padding:"8px 12px",background:"#0a1828",borderRadius:8}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
              <input type="checkbox" checked={form.pres_con_iva!==false} onChange={e=>set("pres_con_iva",e.target.checked)}
                style={{width:16,height:16,accentColor:"#1565C0",cursor:"pointer"}}/>
              <span style={{fontSize:13,color:"#7ab2e8",fontWeight:600}}>Aplicar IVA (21%)</span>
            </label>
            <span style={{fontSize:11,color:"#3a6a9a",marginLeft:4}}>
              {form.pres_con_iva!==false?"Factura con IVA incluido":"Efectivo / sin IVA"}
            </span>
          </div>

          {subTotal>0&&<div style={{marginTop:10,padding:"10px 12px",background:"#0a1828",borderRadius:8,border:"1px solid #1565C025"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5a8ab8",marginBottom:2}}><span>Subtotal</span><span>${subTotal.toLocaleString("es-AR")}</span></div>
            {form.pres_con_iva!==false&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5a8ab8",marginBottom:2}}><span>IVA 21%</span><span>${iva.toLocaleString("es-AR")}</span></div>}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:700,color:"#64B5F6"}}><span>TOTAL</span><span>${totalConIva.toLocaleString("es-AR")}</span></div>
          </div>}
        </div>
        <Field label="Condiciones de pago"><Textarea value={form.pres_condiciones} onChange={e=>set("pres_condiciones",e.target.value)}/></Field>
        <Field label="Firmante (cliente)"><Input value={form.pres_firmante||""} onChange={e=>set("pres_firmante",e.target.value)} placeholder="Nombre del cliente..."/></Field>
      </div>}

      {/* TAB: MEDICIÓN — REMOVED, merged into produccion */}

      {/* TAB: PRODUCCIÓN */}
      {tab==="produccion"&&<div>

        {/* ── PLANO ── */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1565C040",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:"#64B5F6",textTransform:"uppercase",letterSpacing:"0.5px"}}>✏️ Plano / Croquis</div>
            <div style={{fontSize:11,color:"#3a6a9a"}}>Dibujá el vidrio con medidas finales</div>
          </div>
          <DrawingCanvas value={form.med_plano||[]} onChange={v=>set("med_plano",v)}/>
        </div>

        {/* ── SCANNER IA ── */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #CE93D830",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#CE93D8",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>
            🤖 Escanear remito físico con IA
          </div>
          <div style={{fontSize:12,color:"#5a8ab8",marginBottom:12,lineHeight:1.6}}>
            Sacá una foto al remito o papel con las medidas. La IA lee los vidrios, medidas y accesorios y los carga automáticamente en la tabla de arriba.
          </div>
          <ScannerRemito onResult={(vidrios,materiales)=>{
            if(vidrios&&vidrios.length) setForm(f=>({...f,vidrios:[...vidrios]}));
            if(materiales) setForm(f=>({...f,prod_materiales:materiales}));
          }}/>
        </div>

        {/* ── FOTO REMITO FÍSICO ── */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",marginBottom:10}}>📷 Fotos del remito / trabajo</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
            {(form.fotos_remito||[]).map((foto,i)=>(
              <div key={i} style={{position:"relative"}}>
                <img src={foto.data} alt={foto.nombre}
                  style={{width:80,height:80,objectFit:"cover",borderRadius:7,border:"1px solid #1e3a5a",cursor:"pointer"}}
                  onClick={()=>window.open(foto.data,"_blank")}/>
                <button onClick={()=>setForm(f=>({...f,fotos_remito:(f.fotos_remito||[]).filter((_,idx)=>idx!==i)}))}
                  style={{position:"absolute",top:-6,right:-6,width:18,height:18,borderRadius:"50%",background:"#7f2020",border:"none",color:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>✕</button>
              </div>
            ))}
            <label style={{width:80,height:80,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,background:"#0a1020",borderRadius:7,border:"2px dashed #1e3a5a",cursor:"pointer"}}>
              <span style={{fontSize:22}}>📷</span>
              <span style={{fontSize:9,color:"#3a6a9a"}}>Agregar foto</span>
              <input type="file" accept="image/*" capture="environment" multiple style={{display:"none"}} onChange={e=>{
                Array.from(e.target.files).forEach(file=>{
                  if(file.size>3*1024*1024){alert(`${file.name} es muy grande (máx 3MB)`);return;}
                  const reader=new FileReader();
                  reader.onload=ev=>setForm(f=>({...f,fotos_remito:[...(f.fotos_remito||[]),{data:ev.target.result,nombre:file.name}]}));
                  reader.readAsDataURL(file);
                });
              }}/>
            </label>
          </div>
          <div style={{fontSize:11,color:"#2a4a6a"}}>Tocá una foto para verla en grande · máx 3MB por foto</div>
        </div>
          <Field label="Materiales / Accesorios adicionales"><Textarea value={form.prod_materiales||""} onChange={e=>set("prod_materiales",e.target.value)} placeholder="Burlete D gris, bisagras inox, perfiles..."/></Field>
          <div>
            <Field label="Fecha estimada de producción"><Input type="date" value={form.prod_fecha_est||""} onChange={e=>set("prod_fecha_est",e.target.value)}/></Field>
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

        {/* STOCK CONECTADO */}
        {stockItems&&stockItems.length>0&&<div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #26A69A30",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#26A69A",textTransform:"uppercase",marginBottom:10}}>📦 Materiales del stock a usar</div>
          <div style={{fontSize:12,color:"#5a8ab8",marginBottom:10}}>Seleccioná los materiales que vas a usar. Al guardar se descuenta el stock automáticamente.</div>
          {stockItems.filter(i=>i.stock>0).map(item=>{
            const usado=(form.prod_materiales_usados||[]).find(x=>x.id===item.id);
            return(
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #0f2035"}}>
                <input type="checkbox" checked={!!usado} onChange={e=>{
                  if(e.target.checked) setForm(f=>({...f,prod_materiales_usados:[...(f.prod_materiales_usados||[]),{id:item.id,nombre:item.nombre,cant:1,unidad:item.unidad||"u."}]}));
                  else setForm(f=>({...f,prod_materiales_usados:(f.prod_materiales_usados||[]).filter(x=>x.id!==item.id)}));
                }} style={{accentColor:"#26A69A",width:16,height:16,cursor:"pointer"}}/>
                <div style={{flex:1}}>
                  <span style={{fontSize:13,color:"#c8e0f8",fontWeight:600}}>{item.nombre}</span>
                  <span style={{fontSize:11,color:"#3a6a9a",marginLeft:8}}>Stock: {item.stock} {item.unidad||"u."}</span>
                </div>
                {usado&&<div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:12,color:"#5a8ab8"}}>Cantidad:</span>
                  <input type="number" min="1" max={item.stock} value={usado.cant}
                    onChange={e=>setForm(f=>({...f,prod_materiales_usados:(f.prod_materiales_usados||[]).map(x=>x.id===item.id?{...x,cant:+e.target.value}:x)}))}
                    style={{...iS,width:70,padding:"4px 8px",fontSize:13,textAlign:"center"}}/>
                  <span style={{fontSize:12,color:"#5a8ab8"}}>{item.unidad||"u."}</span>
                </div>}
              </div>
            );
          })}
          {(form.prod_materiales_usados||[]).length>0&&<div style={{marginTop:10,padding:"8px 12px",background:"#0a2a1a",borderRadius:8,border:"1px solid #26A69A30",fontSize:12,color:"#26A69A"}}>
            ✅ Al guardar la orden se descontarán {(form.prod_materiales_usados||[]).length} material(es) del stock.
          </div>}
        </div>}
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
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <Field label="Fecha de instalación / entrega"><Input type="date" value={form.inst_fecha||""} onChange={e=>set("inst_fecha",e.target.value)}/></Field>
          <Field label="Dirección"><Input value={form.inst_direccion||""} onChange={e=>set("inst_direccion",e.target.value)} placeholder="Calle, número, piso..."/></Field>
          <Field label="Responsable instalación"><Input value={form.inst_responsable||""} onChange={e=>set("inst_responsable",e.target.value)} placeholder="Nombre del instalador..."/></Field>
          <Field label="Quién recibe / firma"><Input value={form.inst_firmante||""} onChange={e=>set("inst_firmante",e.target.value)} placeholder="Cliente o encargado..."/></Field>
          <div style={{gridColumn:"span 2"}}><Field label="Observaciones"><Textarea value={form.inst_notas||""} onChange={e=>set("inst_notas",e.target.value)} placeholder="Acceso, horarios, instrucciones..."/></Field></div>
        </div>

        {/* CONFIRMACIÓN DE ENTREGA */}
        <div style={{background:"#071220",borderRadius:10,padding:16,border:`1px solid ${form.inst_entregado?"#26A69A40":"#1e3a5a"}`}}>
          <div style={{fontSize:12,fontWeight:700,color:form.inst_entregado?"#26A69A":"#5a8ab8",textTransform:"uppercase",marginBottom:12}}>
            {form.inst_entregado?"✅ Trabajo entregado":"🚚 Confirmación de entrega"}
          </div>
          <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:form.inst_entregado?12:0}}>
            <input type="checkbox" checked={!!form.inst_entregado} onChange={e=>{
              set("inst_entregado",e.target.checked);
              if(e.target.checked && !form.inst_fecha_entrega) set("inst_fecha_entrega",new Date().toISOString().split("T")[0]);
            }} style={{width:18,height:18,accentColor:"#26A69A",cursor:"pointer"}}/>
            <span style={{fontSize:14,color:"#c8e0f8",fontWeight:600}}>Marcar trabajo como entregado al cliente</span>
          </label>
          {form.inst_entregado&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
            <Field label="Fecha real de entrega"><Input type="date" value={form.inst_fecha_entrega||""} onChange={e=>set("inst_fecha_entrega",e.target.value)}/></Field>
            <Field label="Recibió conforme"><Input value={form.inst_recibio||""} onChange={e=>set("inst_recibio",e.target.value)} placeholder="Nombre de quien recibió..."/></Field>
            <div style={{gridColumn:"span 2"}}><Field label="Observaciones de la entrega"><Textarea value={form.inst_obs_entrega||""} onChange={e=>set("inst_obs_entrega",e.target.value)} placeholder="Todo ok, pendiente de instalación de herrajes, etc..." style={{minHeight:60}}/></Field></div>
          </div>}
        </div>
      </div>}

      {/* TAB: PAGOS */}
      {tab==="pagos"&&<div>
        {totalConIva>0&&<div style={{background:"#071220",borderRadius:10,padding:"11px 16px",border:"1px solid #1565C030",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:13,color:"#5a8ab8"}}>Total presupuestado</span>
          <span style={{fontSize:18,fontWeight:800,color:"#64B5F6"}}>${totalConIva.toLocaleString("es-AR")}</span>
        </div>}

        {/* BOTONES RÁPIDOS */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",marginBottom:12}}>⚡ Registro rápido</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {/* Abonó seña en efectivo */}
            <button onClick={()=>{
              const monto=totalConIva>0?Math.round(totalConIva*0.5):"";
              set("pago_senia", form.pago_senia||monto);
              set("pago_senia_fecha", new Date().toISOString().split("T")[0]);
              set("pago_senia_metodo","efectivo");
              setForm(f=>({...f,pago_registros:[...(f.pago_registros||[]),{tipo:"seña",metodo:"efectivo",monto:form.pago_senia||monto,fecha:new Date().toISOString(),nota:"Seña en efectivo"}]}));
            }} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 14px",background:"#1a1000",border:"1px solid #FFB74D40",borderRadius:8,color:"#FFB74D",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}>
              💵 Abonó seña — Efectivo
            </button>
            {/* Abonó total en efectivo */}
            <button onClick={()=>{
              const resta=Math.max(0,totalConIva-(+form.pago_senia||0));
              set("pago_total", form.pago_total||(resta||totalConIva));
              set("pago_total_fecha", new Date().toISOString().split("T")[0]);
              set("pago_total_metodo","efectivo");
              setForm(f=>({...f,pago_registros:[...(f.pago_registros||[]),{tipo:"pago_final",metodo:"efectivo",monto:resta||totalConIva,fecha:new Date().toISOString(),nota:"Pago final en efectivo"}]}));
            }} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 14px",background:"#0a2a0f",border:"1px solid #A5D6A740",borderRadius:8,color:"#A5D6A7",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}>
              💵 Abonó total — Efectivo
            </button>
            {/* Abonó por transferencia */}
            <button onClick={()=>{
              const resta=Math.max(0,totalConIva-(+form.pago_senia||0));
              set("pago_total", form.pago_total||(resta||totalConIva));
              set("pago_total_fecha", new Date().toISOString().split("T")[0]);
              set("pago_total_metodo","transferencia");
              setForm(f=>({...f,pago_registros:[...(f.pago_registros||[]),{tipo:"pago_final",metodo:"transferencia",monto:resta||totalConIva,fecha:new Date().toISOString(),nota:"Pago por transferencia"}]}));
            }} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 14px",background:"#0a1a2a",border:"1px solid #64B5F640",borderRadius:8,color:"#64B5F6",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}>
              📲 Abonó total — Transferencia
            </button>
          </div>
        </div>

        {/* SEÑA */}
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

        {/* PAGO FINAL */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #A5D6A720",marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:"#A5D6A7",textTransform:"uppercase",marginBottom:12}}>✅ Pago Final / Saldo</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Field label="Monto cobrado ($)"><Input type="number" value={form.pago_total||""} onChange={e=>set("pago_total",e.target.value)} placeholder="0"/></Field>
            <Field label="Fecha de cobro"><Input type="date" value={form.pago_total_fecha||""} onChange={e=>set("pago_total_fecha",e.target.value)}/></Field>
            <Field label="Forma de pago"><Sel value={form.pago_total_metodo||"efectivo"} onChange={e=>set("pago_total_metodo",e.target.value)}>{METODOS.map(m=><option key={m} value={m.toLowerCase()}>{m}</option>)}</Sel></Field>
          </div>
        </div>

        {/* COMPROBANTE */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",marginBottom:10}}>📎 Comprobante de pago</div>
          {form.pago_comprobante ? (
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1,padding:"8px 12px",background:"#0a1828",borderRadius:7,fontSize:12,color:"#64B5F6",border:"1px solid #1565C030"}}>
                ✅ Comprobante cargado — {form.pago_comprobante_nombre||"archivo"}
              </div>
              <button onClick={()=>{set("pago_comprobante","");set("pago_comprobante_nombre","");}}
                style={{background:"none",border:"none",color:"#f48fb1",cursor:"pointer",padding:4,display:"flex"}}><Icon name="trash" size={14}/></button>
              {form.pago_comprobante.startsWith("data:image")&&(
                <img src={form.pago_comprobante} alt="comprobante" style={{width:60,height:60,objectFit:"cover",borderRadius:6,border:"1px solid #1e3a5a",cursor:"pointer"}}
                  onClick={()=>window.open(form.pago_comprobante,"_blank")}/>
              )}
            </div>
          ) : (
            <label style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"#0a1828",borderRadius:8,border:"2px dashed #1e3a5a",cursor:"pointer"}}>
              <span style={{fontSize:20}}>📎</span>
              <div>
                <div style={{fontSize:13,color:"#7ab2e8",fontWeight:600}}>Subir comprobante</div>
                <div style={{fontSize:11,color:"#3a6a9a"}}>Imagen o PDF del comprobante de transferencia</div>
              </div>
              <input type="file" accept="image/*,application/pdf" style={{display:"none"}} onChange={e=>{
                const file=e.target.files[0];
                if(!file) return;
                if(file.size>2*1024*1024){alert("El archivo es muy grande. Máximo 2MB.");return;}
                const reader=new FileReader();
                reader.onload=ev=>{set("pago_comprobante",ev.target.result);set("pago_comprobante_nombre",file.name);};
                reader.readAsDataURL(file);
              }}/>
            </label>
          )}
        </div>

        {/* BARRA ESTADO COBRO */}
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

        {/* HISTORIAL */}
        {(form.pago_registros||[]).length>0&&(
          <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase",marginBottom:10}}>🕐 Historial de pagos</div>
            {(form.pago_registros||[]).map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #0f2035"}}>
                <div>
                  <span style={{fontSize:12,color:"#c8e0f8",fontWeight:600}}>{r.nota}</span>
                  <span style={{fontSize:11,color:"#3a6a9a",marginLeft:8}}>{new Date(r.fecha).toLocaleDateString("es-AR")}</span>
                </div>
                <span style={{fontSize:13,fontWeight:700,color:"#A5D6A7"}}>${(+r.monto||0).toLocaleString("es-AR")}</span>
              </div>
            ))}
          </div>
        )}

        <Field label="Notas de pagos"><Textarea value={form.pago_notas||""} onChange={e=>set("pago_notas",e.target.value)} placeholder="Referencias de transferencia, cheques, observaciones..."/></Field>
      </div>}

      {/* TAB: ACTIVIDAD */}
      {tab==="actividad"&&<div>
        <p style={{color:"#5a8ab8",fontSize:13,margin:"0 0 16px"}}>Historial completo de cambios en esta orden.</p>
        {(form.actividad||[]).length===0&&(
          <div style={{textAlign:"center",padding:"32px 0",color:"#2a4a6a",fontSize:13}}>
            No hay actividad registrada aún.<br/>Los cambios aparecerán acá al guardar.
          </div>
        )}
        {(form.actividad||[]).slice().reverse().map((entry,i)=>{
          const ROL_COLOR={admin:"#64B5F6",taller:"#CE93D8",local:"#A5D6A7"};
          const fecha=new Date(entry.fecha);
          const fechaStr=fecha.toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"2-digit"});
          const horaStr=fecha.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"});
          return(
            <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid #0f2035",alignItems:"flex-start"}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:(ROL_COLOR[entry.rol]||"#64B5F6")+"20",border:`1px solid ${ROL_COLOR[entry.rol]||"#64B5F6"}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:ROL_COLOR[entry.rol]||"#64B5F6",flexShrink:0}}>
                {(entry.usuario||"?")[0].toUpperCase()}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontSize:13,fontWeight:600,color:"#c8e0f8"}}>{entry.usuario}</span>
                  <span style={{fontSize:10,color:ROL_COLOR[entry.rol]||"#64B5F6",background:(ROL_COLOR[entry.rol]||"#64B5F6")+"15",padding:"1px 7px",borderRadius:99,fontWeight:600}}>{entry.rol}</span>
                </div>
                <div style={{fontSize:13,color:"#7ab2e8"}}>{entry.accion}</div>
                <div style={{fontSize:11,color:"#3a6a9a",marginTop:2}}>{fechaStr} a las {horaStr}</div>
              </div>
            </div>
          );
        })}
      </div>}

      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16,paddingTop:14,borderTop:"1px solid #1e3a5a"}}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={()=>{if(validate())onSave(form);}}><Icon name="plus" size={16}/> {orden?"Guardar Cambios":"Crear Orden"}</Btn>
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
    const timeout = setTimeout(()=>setLoading(false), 3000);

    unsubs.push(fsSub("ordenes", docs => { setOrdenes(docs.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""))); }));
    unsubs.push(fsSub("clientes", docs => { setClientes(docs.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""))); }));
    unsubs.push(fsSub("cotizaciones", docs => { setCotizaciones(docs.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""))); }));
    unsubs.push(fsSub("stock_items", docs => { setStock(docs); }));
    unsubs.push(fsCfgSub("plantillas", val => { if(val) setPlantillas(val); }));
    unsubs.push(fsCfgSub("estados", val => { if(val) setEstados(val); }));
    unsubs.push(fsCfgSub("tipos_vidrio", val => {
      if(val&&val.length) {
        setTiposVidrio(val);
      } else {
        // Primera vez — guardar los defaults en Firebase para que queden permanentes
        fsCfgSet("tipos_vidrio", TIPOS_VIDRIO_DEFAULT);
        setTiposVidrio(TIPOS_VIDRIO_DEFAULT);
      }
    }));

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
        {filtered.map(o=>(
          <div key={o.id} style={{background:"#071220",borderRadius:11,padding:"12px 14px",border:`1px solid ${o.estado==="cancelada"?"#EF535020":"#0f2035"}`,display:"flex",alignItems:"center",gap:12,opacity:o.estado==="cancelada"?0.6:1}}>
            <div style={{background:"#0a1828",border:"1px solid #1565C025",borderRadius:7,padding:"4px 10px",minWidth:95,textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:11,fontWeight:800,color:"#1565C0",fontFamily:"monospace",letterSpacing:"0.5px"}}>{o.numero||"—"}</div>
              <div style={{fontSize:10,color:"#3a6a9a"}}>{o.fecha}</div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2,flexWrap:"wrap"}}>
                <span style={{fontSize:14,fontWeight:600,color:"#e2f0ff"}}>{o.numero||"Sin número"}</span>
                {o.tipo&&<span style={{fontSize:11,color:"#3a6a9a",background:"#0f2035",padding:"1px 7px",borderRadius:99}}>{o.tipo}</span>}
                {o.ref_cotizacion&&<span style={{fontSize:10,color:"#FFB74D",background:"#2a1a00",border:"1px solid #FFB74D30",padding:"1px 8px",borderRadius:99}}>ref. {o.ref_cotizacion}</span>}
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
  const newCotNum=(list)=>{
    const yr=new Date().getFullYear().toString().slice(-2);
    const ex=list.filter(c=>c.numero?.startsWith(`PR-${yr}`));
    const max=ex.reduce((m,c)=>{const n=parseInt(c.numero?.split("-")[2]||0);return n>m?n:m;},0);
    return `PR-${yr}-${String(max+1).padStart(4,"0")}`;
  };

  // ── MINI CANVAS (por ítem de cotización/orden) ───────────────────────────────
  const MiniCanvas=({value,onChange,itemIdx})=>{
    const canvasRef=useRef(null);
    const [tool,setTool]=useState("rect");
    const [drawing,setDrawing]=useState(null);
    const [shapes,setShapes]=useState(value||[]);
    const [selId,setSelId]=useState(null);
    const commit=(sh)=>{setShapes(sh);onChange(sh);};
    const newId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,4);

    const TOOLS=[
      {id:"rect",label:"□ Rect"},
      {id:"circle",label:"○ Perf"},
      {id:"line",label:"╱ Línea"},
      {id:"text",label:"T Nota"},
    ];

    const getPos=(e)=>{
      const c=canvasRef.current;
      if(!c) return {x:0,y:0};
      const r=c.getBoundingClientRect();
      const scaleX=c.width/r.width;
      const scaleY=c.height/r.height;
      const clientX=e.touches?e.touches[0].clientX:e.clientX;
      const clientY=e.touches?e.touches[0].clientY:e.clientY;
      return {x:(clientX-r.left)*scaleX,y:(clientY-r.top)*scaleY};
    };

    const onDown=(e)=>{
      e.preventDefault();
      const p=getPos(e);
      if(tool==="text"){
        const txt=prompt("Anotación:");
        if(txt) commit([...shapes,{id:newId(),type:"text",x:p.x,y:p.y,text:txt}]);
        return;
      }
      setDrawing({id:newId(),type:tool,x1:p.x,y1:p.y,x2:p.x,y2:p.y});
    };
    const onMove=(e)=>{
      if(!drawing) return;
      e.preventDefault();
      const p=getPos(e);
      setDrawing(d=>({...d,x2:p.x,y2:p.y}));
    };
    const onUp=(e)=>{
      if(!drawing) return;
      const dx=Math.abs(drawing.x2-drawing.x1),dy=Math.abs(drawing.y2-drawing.y1);
      if(dx>3||dy>3) commit([...shapes,drawing]);
      setDrawing(null);
    };

    const renderShape=(s,isDrawing)=>{
      const sel=selId===s.id;
      const stroke=isDrawing?"#42A5F5":sel?"#FF8A65":"#1565C0";
      const fill=isDrawing?"rgba(66,165,245,0.1)":sel?"rgba(255,138,101,0.1)":"rgba(21,101,192,0.08)";
      if(s.type==="text") return(
        <text key={s.id} x={s.x} y={s.y} fontSize="12" fill="#FFB74D" fontWeight="700" fontFamily="Arial"
          style={{cursor:"pointer"}} onClick={()=>setSelId(sel?null:s.id)}>{s.text}</text>
      );
      if(s.type==="circle"){
        const cx=(s.x1+s.x2)/2,cy=(s.y1+s.y2)/2;
        const rx=Math.abs(s.x2-s.x1)/2,ry=Math.abs(s.y2-s.y1)/2;
        return <ellipse key={s.id} cx={cx} cy={cy} rx={Math.max(rx,2)} ry={Math.max(ry,2)}
          fill={fill} stroke={stroke} strokeWidth="1.5" style={{cursor:"pointer"}}
          onClick={()=>setSelId(sel?null:s.id)}/>;
      }
      if(s.type==="line") return(
        <line key={s.id} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke={stroke} strokeWidth="1.5" strokeLinecap="round" style={{cursor:"pointer"}}
          onClick={()=>setSelId(sel?null:s.id)}/>
      );
      // rect
      const x=Math.min(s.x1,s.x2),y=Math.min(s.y1,s.y2);
      const w=Math.abs(s.x2-s.x1),h=Math.abs(s.y2-s.y1);
      return <rect key={s.id} x={x} y={y} width={w} height={h}
        fill={fill} stroke={stroke} strokeWidth="1.5" style={{cursor:"pointer"}}
        onClick={()=>setSelId(sel?null:s.id)}/>;
    };

    const allShapes=[...shapes,...(drawing?[drawing]:[])];

    return(
      <div style={{marginTop:8,background:"#050e1a",borderRadius:8,padding:8,border:"1px solid #1565C030"}}>
        <div style={{display:"flex",gap:4,marginBottom:6,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:"#3a6a9a",fontWeight:600,marginRight:4}}>Plano:</span>
          {TOOLS.map(t=>(
            <button key={t.id} onClick={()=>setTool(t.id)}
              style={{padding:"3px 8px",borderRadius:6,border:`1px solid ${tool===t.id?"#1565C0":"#1e3a5a"}`,
                background:tool===t.id?"#1565C020":"transparent",color:tool===t.id?"#64B5F6":"#3a6a9a",
                cursor:"pointer",fontSize:10,fontFamily:"inherit",fontWeight:tool===t.id?700:400}}>
              {t.label}
            </button>
          ))}
          {selId&&<button onClick={()=>{commit(shapes.filter(s=>s.id!==selId));setSelId(null);}}
            style={{padding:"3px 8px",borderRadius:6,border:"1px solid #7f2020",background:"#2a0a0a",
              color:"#f48fb1",cursor:"pointer",fontSize:10,fontFamily:"inherit",marginLeft:"auto"}}>
            ✕ Borrar
          </button>}
          {shapes.length>0&&!selId&&<button onClick={()=>{if(confirm("¿Borrar plano?"))commit([]);}}
            style={{padding:"3px 8px",borderRadius:6,border:"1px solid #1e3a5a",background:"transparent",
              color:"#3a6a9a",cursor:"pointer",fontSize:10,fontFamily:"inherit",marginLeft:"auto"}}>
            Limpiar
          </button>}
        </div>
        <svg ref={canvasRef} width="100%" viewBox="0 0 500 220"
          style={{display:"block",background:"#071220",borderRadius:6,border:"1px solid #0f2035",
            cursor:tool==="text"?"text":"crosshair",touchAction:"none"}}
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp}
          onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
          {/* Grid */}
          <defs>
            <pattern id={`grid-${itemIdx}`} width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#0f2035" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="500" height="220" fill={`url(#grid-${itemIdx})`}/>
          {allShapes.map(s=>renderShape(s,s===drawing))}
        </svg>
        {shapes.length>0&&<div style={{fontSize:10,color:"#1e3a5a",marginTop:3,textAlign:"right"}}>{shapes.length} elemento{shapes.length>1?"s":""}</div>}
      </div>
    );
  };

  // ── NUEVA COTIZACIÓN FORM ────────────────────────────────────────────────────
  const printCotizacion=(cot,clienteNombre)=>{
    const items=cot.items||[];
    const sub=items.reduce((s,i)=>s+(+i.precio*(+i.cant||1)),0);
    const conIva=cot.con_iva!==false;
    const ivaAmt=conIva?sub*0.21:0;
    const total=sub+ivaAmt;
    const vidriosRows=items.filter(i=>i.tipo_vidrio||i.ancho||i.alto||i.desc).map((it,idx)=>`
      <tr style="background:${idx%2===0?"#f8fbff":"#fff"}">
        <td style="text-align:center;font-weight:700;font-size:14px;padding:9px 12px">${it.cant||1}</td>
        <td style="padding:9px 12px;font-weight:600">${it.tipo_vidrio||"—"}</td>
        <td style="padding:9px 12px">${it.desc||""}</td>
        <td style="text-align:center;padding:9px 12px">${it.ancho&&it.alto?`${it.ancho} × ${it.alto}`:"—"}</td>
        <td style="padding:9px 12px;color:#555">${it.obs||""}</td>
        <td style="text-align:right;padding:9px 12px;font-weight:700">$${((+it.precio||0)*(+it.cant||1)).toLocaleString("es-AR")}</td>
      </tr>`).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Presupuesto ${cot.numero||""}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a2e;background:#fff}
.hdr{background:linear-gradient(135deg,#0a2a5e,#1565C0);padding:18px 28px;display:flex;justify-content:space-between;align-items:center}
.hdr-left{display:flex;align-items:center;gap:12px}
.hdr-logo{width:58px;height:58px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3))}
.biz-name{font-size:19px;font-weight:900;color:#fff}
.biz-sub{font-size:10px;color:rgba(255,255,255,0.7);margin-top:2px}
.biz-c{font-size:10px;color:rgba(255,255,255,0.85);margin-top:2px}
.hdr-right{text-align:right}
.doc-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.7)}
.doc-num{font-size:28px;font-weight:900;color:#fff;letter-spacing:1px;display:block}
.doc-date{font-size:10px;color:rgba(255,255,255,0.7);margin-top:3px;display:block}
.divider{height:3px;background:linear-gradient(90deg,#1565C0,#42A5F5,#1565C0)}
.body{padding:20px 28px}
.st{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1565C0;border-bottom:2px solid #1565C0;padding-bottom:4px;margin:16px 0 10px}
.client-box{background:#f0f6ff;border-radius:8px;padding:12px 16px;border:1px solid #e0ecff;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.f label{font-size:9px;color:#888;font-weight:700;text-transform:uppercase;display:block;margin-bottom:2px}
.f p{font-size:14px;font-weight:600}
table{width:100%;border-collapse:collapse;font-size:13px}
thead tr{background:linear-gradient(135deg,#0a2a5e,#1565C0);color:#fff}
thead th{padding:8px 12px;font-size:11px;font-weight:600}
.tot-box{margin-top:10px;display:flex;justify-content:flex-end}
.tot-inner{width:260px;background:#f0f6ff;border-radius:8px;padding:12px 16px;border:1px solid #e0ecff}
.tot-row{display:flex;justify-content:space-between;padding:3px 0;font-size:13px;color:#555}
.tot-final{display:flex;justify-content:space-between;padding:8px 0 2px;font-size:17px;font-weight:900;color:#0a2a5e;border-top:2px solid #1565C0;margin-top:4px}
.note-box{background:#f8f9ff;border-left:3px solid #1565C0;padding:10px 14px;font-size:13px;line-height:1.7;color:#333}
.sign-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:32px}
.sign-line{border-top:1.5px solid #1565C0;padding-top:8px;text-align:center}
.sign-label{font-size:10px;color:#888;text-transform:uppercase}
.sign-name{font-size:12px;font-weight:600;color:#1565C0;margin-top:3px}
.footer{background:#f0f6ff;border-top:2px solid #e3f2fd;padding:8px 28px;display:flex;justify-content:space-between;font-size:10px;color:#888}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:8mm}}
</style></head><body>
<div class="hdr">
  <div class="hdr-left">
    <img class="hdr-logo" src="BIZ_LOGO" alt="LV"/>
    <div>
      <div class="biz-name">La Vidriería Rosario</div>
      <div class="biz-sub">Vidrios · Espejos · Cerramientos · Instalaciones</div>
      <div class="biz-c">📍 Mendoza 1783, Rosario, Santa Fe · CP 2000</div>
      <div class="biz-c">📞 341 425-1007 / 341 508-4921 &nbsp;·&nbsp; ✉️ lavidrieria@gmail.com</div>
      <div class="biz-c">📸 @lavidrieriarosariooficial &nbsp;·&nbsp; 🕐 Lun-Vie 8-19hs · Sáb 8-13hs</div>
    </div>
  </div>
  <div class="hdr-right">
    <div class="doc-type">Presupuesto</div>
    <span class="doc-num">${cot.numero||"S/N"}</span>
    <span class="doc-date">Fecha: ${cot.fecha||""}</span>
    ${cot.validez?`<span class="doc-date">Válido hasta: ${cot.validez}</span>`:""}
  </div>
</div>
<div class="divider"></div>
<div class="body">
  <div class="st">Datos del Cliente</div>
  <div class="client-box">
    <div class="f"><label>Nombre</label><p>${clienteNombre||cot.contacto_nombre||"—"}</p></div>
    <div class="f"><label>Teléfono</label><p>${cot.contacto_tel||"—"}</p></div>
    <div class="f"><label>Domicilio</label><p>${cot.contacto_dom||"—"}</p></div>
  </div>
  ${cot.titulo?`<div style="margin-top:10px;padding:8px 12px;background:#f0f6ff;border-radius:6px;font-size:14px;font-weight:600;color:#0a2a5e">Trabajo: ${cot.titulo}</div>`:""}
  <div class="st">Detalle de Materiales y Servicio</div>
  <table>
    <thead><tr>
      <th style="text-align:center;width:55px">Cant.</th>
      <th style="text-align:left">Tipo de vidrio</th>
      <th style="text-align:left">Descripción</th>
      <th style="text-align:center;width:120px">Medidas (mm)</th>
      <th style="text-align:left">Observaciones</th>
      <th style="text-align:right;width:100px">Subtotal</th>
    </tr></thead>
    <tbody>${vidriosRows||"<tr><td colspan='6' style='padding:12px;text-align:center;color:#888'>Sin ítems</td></tr>"}</tbody>
  </table>
  <div class="tot-box">
    <div class="tot-inner">
      <div class="tot-row"><span>Subtotal</span><span>$${sub.toLocaleString("es-AR")}</span></div>
      ${conIva?`<div class="tot-row"><span>IVA (21%)</span><span>$${ivaAmt.toLocaleString("es-AR")}</span></div>`:`<div class="tot-row"><span style="font-style:italic;color:#aaa">Sin IVA — Efectivo</span></div>`}
      <div class="tot-final"><span>TOTAL</span><span>$${total.toLocaleString("es-AR")}</span></div>
    </div>
  </div>
  ${cot.condiciones?`<div class="st">Condiciones de Pago</div><div class="note-box">${cot.condiciones}</div>`:""}
  <div class="sign-grid">
    <div class="sign-line"><div class="sign-label">Firma del colocador</div><div style="height:34px"></div><div class="sign-name">La Vidriería Rosario</div></div>
    <div class="sign-line"><div class="sign-label">Conformidad del cliente</div><div style="height:34px"></div><div style="font-size:12px;color:#555">${clienteNombre||cot.contacto_nombre||"________________________"}</div></div>
  </div>
</div>
<div class="footer">
  <span>Generado el ${new Date().toLocaleString("es-AR")} · VidrierApp</span>
  <span>Mendoza 1783 · Rosario · 341 425-1007</span>
</div>
</body></html>`;
    const w=window.open("","_blank","width=940,height=820");
    if(w){w.document.write(html.replace("BIZ_LOGO",BIZ_LOGO));w.document.close();w.onload=()=>{w.focus();w.print();};}
  };

  // ── COTIZACIÓN FORM ──────────────────────────────────────────────────────────
  const CotizacionForm=({cot,clientes,tiposVidrio:tvProp,onSave,onClose})=>{
    const TV=tvProp||TIPOS_VIDRIO_DEFAULT;
    const EMPTY={
      titulo:"", cliente:"",
      contacto_nombre:"", contacto_tel:"", contacto_dom:"",
      fecha:new Date().toISOString().split("T")[0], validez:"",
      condiciones:"50% al confirmar, saldo contra entrega.",
      con_iva:true,
      items:[{cant:1,tipo_vidrio:"",desc:"",ancho:"",alto:"",obs:"",precio:"",plano:[]}],
      estado:"pendiente"
    };
    const [form,setForm]=useState(cot?{...EMPTY,...cot}:EMPTY);
    const set=(k,v)=>setForm(f=>({...f,[k]:v}));
    const setIt=(i,k,v)=>setForm(f=>{const arr=[...f.items];arr[i]={...arr[i],[k]:v};return{...f,items:arr};});
    const addItem=()=>setForm(f=>({...f,items:[...f.items,{cant:1,tipo_vidrio:"",desc:"",ancho:"",alto:"",obs:"",precio:"",plano:[]}]}));
    const removeItem=(i)=>setForm(f=>({...f,items:f.items.filter((_,idx)=>idx!==i)}));
    const sub=(form.items||[]).reduce((s,i)=>s+(+i.precio*(+i.cant||1)),0);
    const ivaAmt=form.con_iva!==false?sub*0.21:0;
    const total=sub+ivaAmt;
    const clienteData=clientes.find(c=>c.id===form.cliente);

    // Sync datos cliente from list
    const onClienteChange=(id)=>{
      const c=clientes.find(x=>x.id===id);
      setForm(f=>({...f,cliente:id,
        contacto_nombre:c?.nombre||f.contacto_nombre,
        contacto_tel:c?.telefono||f.contacto_tel,
        contacto_dom:c?.direccion||f.contacto_dom,
      }));
    };

    const [expandedItems,setExpandedItems]=useState({});
    const toggleExpand=(i)=>setExpandedItems(e=>({...e,[i]:!e[i]}));

    return(
      <div>
        {/* DATOS NEGOCIO + NÚMERO */}
        <div style={{background:"linear-gradient(135deg,#0a1828,#071220)",borderRadius:10,padding:"12px 16px",border:"1px solid #1565C030",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:14,fontWeight:800,color:"#64B5F6",fontFamily:"Georgia,serif"}}>La Vidriería Rosario</div>
          <div style={{flex:1}}/>
          {cot?.numero&&<div style={{fontFamily:"monospace",fontSize:16,fontWeight:700,color:"#FFB74D",background:"#1a1000",padding:"4px 12px",borderRadius:7,border:"1px solid #FFB74D30"}}>{cot.numero}</div>}
        </div>

        {/* DATOS CLIENTE */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1565C040",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#64B5F6",textTransform:"uppercase",marginBottom:10}}>Datos del Cliente</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <Field label="Seleccionar cliente">
              <Sel value={form.cliente} onChange={e=>onClienteChange(e.target.value)}>
                <option value="">Sin asignar</option>
                {clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
              </Sel>
            </Field>
            <Field label="Descripción del trabajo">
              <Input value={form.titulo} onChange={e=>set("titulo",e.target.value)} placeholder="Ej: Mampara baño planta alta"/>
            </Field>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Field label="Nombre *"><Input value={form.contacto_nombre} onChange={e=>set("contacto_nombre",e.target.value)} placeholder="Nombre completo..."/></Field>
            <Field label="Teléfono *"><Input value={form.contacto_tel} onChange={e=>set("contacto_tel",e.target.value)} placeholder="341 000-0000"/></Field>
            <Field label="Domicilio *"><Input value={form.contacto_dom} onChange={e=>set("contacto_dom",e.target.value)} placeholder="Calle y número..."/></Field>
          </div>
        </div>

        {/* DETALLE DE ÍTEMS */}
        <div style={{background:"#071220",borderRadius:10,padding:14,border:"1px solid #1e3a5a",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#5a8ab8",textTransform:"uppercase"}}>🔷 Detalle de Materiales y Servicio</div>
            <Btn small onClick={addItem}><Icon name="plus" size={13}/> Agregar ítem</Btn>
          </div>

          {(form.items||[]).map((item,i)=>(
            <div key={i} style={{background:"#0a1828",borderRadius:9,padding:12,marginBottom:10,border:`1px solid ${expandedItems[i]?"#1565C040":"#0f2035"}`}}>
              {/* Fila principal */}
              <div style={{display:"grid",gridTemplateColumns:"50px 1fr 1fr 90px 90px 110px 28px",gap:8,alignItems:"center",marginBottom:expandedItems[i]?10:0}}>
                <div>
                  <div style={{fontSize:9,color:"#3a6a9a",fontWeight:600,marginBottom:3}}>CANT.</div>
                  <Input type="number" min="1" value={item.cant} onChange={e=>setIt(i,"cant",e.target.value)} style={{textAlign:"center",padding:"6px 4px"}}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:"#3a6a9a",fontWeight:600,marginBottom:3}}>TIPO DE VIDRIO</div>
                  <div>
                    <Sel value={TV.includes(item.tipo_vidrio)||item.tipo_vidrio===""?item.tipo_vidrio:"__otro__"}
                      onChange={e=>{if(e.target.value==="__otro__")setIt(i,"tipo_vidrio","");else setIt(i,"tipo_vidrio",e.target.value);}}>
                      <option value="">Seleccionar...</option>
                      {TV.filter(t=>t!=="Otro").map(t=><option key={t} value={t}>{t}</option>)}
                      <option value="__otro__">✏️ Escribir...</option>
                    </Sel>
                    {(!TV.includes(item.tipo_vidrio)&&item.tipo_vidrio!=="")||item.tipo_vidrio===""&&(form.items[i].tipo_vidrio===""&&expandedItems[i])?null:null}
                    {!TV.filter(t=>t!=="Otro").includes(item.tipo_vidrio)&&item.tipo_vidrio!==""&&(
                      <Input value={item.tipo_vidrio} onChange={e=>setIt(i,"tipo_vidrio",e.target.value)} placeholder="Tipo personalizado..." style={{marginTop:4}}/>
                    )}
                  </div>
                </div>
                <div>
                  <div style={{fontSize:9,color:"#3a6a9a",fontWeight:600,marginBottom:3}}>DESCRIPCIÓN</div>
                  <Input value={item.desc} onChange={e=>setIt(i,"desc",e.target.value)} placeholder="Detalle del trabajo..."/>
                </div>
                <div>
                  <div style={{fontSize:9,color:"#3a6a9a",fontWeight:600,marginBottom:3}}>ANCHO mm</div>
                  <Input type="number" value={item.ancho} onChange={e=>setIt(i,"ancho",e.target.value)} placeholder="0"/>
                </div>
                <div>
                  <div style={{fontSize:9,color:"#3a6a9a",fontWeight:600,marginBottom:3}}>ALTO mm</div>
                  <Input type="number" value={item.alto} onChange={e=>setIt(i,"alto",e.target.value)} placeholder="0"/>
                </div>
                <div>
                  <div style={{fontSize:9,color:"#3a6a9a",fontWeight:600,marginBottom:3}}>PRECIO UNIT. $</div>
                  <Input type="number" value={item.precio} onChange={e=>setIt(i,"precio",e.target.value)} placeholder="0"/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,paddingTop:16}}>
                  <button onClick={()=>toggleExpand(i)} title={expandedItems[i]?"Ocultar plano":"Agregar plano"}
                    style={{background:expandedItems[i]?"#1565C020":"transparent",border:`1px solid ${expandedItems[i]?"#1565C0":"#1e3a5a"}`,
                      color:expandedItems[i]?"#64B5F6":"#3a6a9a",cursor:"pointer",padding:"4px 5px",borderRadius:5,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    ✏️
                  </button>
                  <button onClick={()=>removeItem(i)} disabled={(form.items||[]).length<=1}
                    style={{background:"none",border:"none",color:"#5a2a3a",cursor:"pointer",padding:4,opacity:(form.items||[]).length<=1?0.3:1,display:"flex"}}>
                    <Icon name="trash" size={13}/>
                  </button>
                </div>
              </div>
              {/* Observaciones */}
              <div style={{marginBottom:expandedItems[i]?8:0}}>
                <Input value={item.obs} onChange={e=>setIt(i,"obs",e.target.value)}
                  placeholder="Observaciones: borde pulido, corte especial, bisagra, perforación..."
                  style={{fontSize:12}}/>
              </div>
              {/* Mini Canvas */}
              {expandedItems[i]&&(
                <MiniCanvas value={item.plano||[]} onChange={v=>setIt(i,"plano",v)} itemIdx={i}/>
              )}
            </div>
          ))}

          {/* Totales + IVA */}
          {sub>0&&<div style={{marginTop:8,padding:"12px 14px",background:"#0a1828",borderRadius:8,border:"1px solid #1565C025"}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:8}}>
              <input type="checkbox" checked={form.con_iva!==false} onChange={e=>set("con_iva",e.target.checked)}
                style={{width:15,height:15,accentColor:"#1565C0",cursor:"pointer"}}/>
              <span style={{fontSize:12,color:"#7ab2e8",fontWeight:600}}>Aplicar IVA (21%)</span>
              <span style={{fontSize:11,color:"#3a6a9a"}}>{form.con_iva!==false?"Factura":"Efectivo / sin IVA"}</span>
            </label>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5a8ab8",marginBottom:2}}><span>Subtotal</span><span>${sub.toLocaleString("es-AR")}</span></div>
            {form.con_iva!==false&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#5a8ab8",marginBottom:2}}><span>IVA 21%</span><span>${ivaAmt.toLocaleString("es-AR")}</span></div>}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:700,color:"#64B5F6",borderTop:"1px solid #1565C030",paddingTop:6,marginTop:4}}><span>TOTAL</span><span>${total.toLocaleString("es-AR")}</span></div>
          </div>}
        </div>

        {/* CONDICIONES + FECHAS */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <Field label="Fecha"><Input type="date" value={form.fecha} onChange={e=>set("fecha",e.target.value)}/></Field>
          <Field label="Válida hasta"><Input type="date" value={form.validez} onChange={e=>set("validez",e.target.value)}/></Field>
        </div>
        <Field label="Condiciones de pago"><Textarea value={form.condiciones} onChange={e=>set("condiciones",e.target.value)}/></Field>

        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:14,paddingTop:12,borderTop:"1px solid #1e3a5a"}}>
          <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={()=>onSave(form)}><Icon name="plus" size={16}/> {cot?"Guardar":"Crear Cotización"}</Btn>
        </div>
      </div>
    );
  };

  // ── COTIZACIONES PAGE ────────────────────────────────────────────────────────
  const Cotizaciones=()=>{
    const ESTADO_COT=[
      {id:"pendiente",label:"Pendiente",color:"#FFB74D",bg:"#2a1f0a"},
      {id:"enviada",label:"Enviada",color:"#64B5F6",bg:"#1a2a3a"},
      {id:"aceptada",label:"Aceptada",color:"#A5D6A7",bg:"#0a2a0f"},
      {id:"rechazada",label:"Rechazada",color:"#F48FB1",bg:"#2a0a0a"},
      {id:"convertida",label:"→ Orden",color:"#26A69A",bg:"#0a2a26"},
    ];
    const BadgeCot=({estado})=>{const e=ESTADO_COT.find(x=>x.id===estado)||ESTADO_COT[0];return <span style={{background:e.bg,color:e.color,border:`1px solid ${e.color}40`,padding:"2px 10px",borderRadius:99,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{e.label}</span>;};

    const convertirAOrden=async(cot)=>{
      const nuevaOrden={
        cliente: cot.cliente||"",
        contacto_nombre: cot.contacto_nombre||"",
        contacto_telefono: cot.contacto_tel||"",
        contacto_domicilio: cot.contacto_dom||"",
        tipo: "",
        etapa: "presupuesto",
        estado: "pendiente",
        fecha: new Date().toISOString().split("T")[0],
        ref_cotizacion: cot.numero,
        vidrios: (cot.items||[]).map(it=>({cant:it.cant||1,tipo:it.tipo_vidrio||"",ancho:it.ancho||"",alto:it.alto||"",obs:it.obs||"",plano:it.plano||[]})),
        pres_items: cot.items||[],
        pres_condiciones: cot.condiciones||"",
        pres_con_iva: cot.con_iva!==false,
        med_plano:[],
        prod_materiales:"", prod_procesos:[], prod_notas:"", prod_fecha_est:"", prod_campos:{}, prod_materiales_usados:[],
        inst_fecha:"", inst_direccion:"", inst_responsable:"", inst_firmante:"", inst_notas:"",
        pago_senia:"", pago_senia_fecha:"", pago_senia_metodo:"efectivo",
        pago_total:"", pago_total_fecha:"", pago_total_metodo:"efectivo", pago_notas:"",
      };
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
          <div style={{display:"flex",gap:8}}>
            <Btn small variant="secondary" onClick={()=>setModal({type:"tipos_vidrio"})}><Icon name="settings" size={14}/> Tipos de vidrio</Btn>
            <Btn small onClick={()=>setModal({type:"nueva_cotizacion"})}><Icon name="plus" size={14}/> Nueva Cotización</Btn>
          </div>
        </div>
        <div style={{display:"grid",gap:8}}>
          {cotizaciones.map(c=>{
            const total=(c.items||[]).reduce((s,i)=>s+(+i.precio*(+i.cant||1)),0)*(c.con_iva!==false?1.21:1);
            const nombre=c.contacto_nombre||getNombre(c.cliente)||"Sin cliente";
            return(
              <div key={c.id} style={{background:"#071220",borderRadius:11,padding:"12px 16px",border:"1px solid #0f2035",display:"flex",alignItems:"center",gap:12}}>
                <div style={{background:"#0a1828",border:"1px solid #FFB74D25",borderRadius:7,padding:"4px 10px",minWidth:105,textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#FFB74D",fontFamily:"monospace"}}>{c.numero}</div>
                  <div style={{fontSize:10,color:"#3a6a9a"}}>{c.fecha}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#e2f0ff",marginBottom:2}}>{c.titulo||nombre}</div>
                  <div style={{fontSize:12,color:"#3a6a9a"}}>{nombre}{total>0?` · $${total.toLocaleString("es-AR")}`:""}</div>
                </div>
                <BadgeCot estado={c.estado}/>
                <div style={{display:"flex",gap:4}}>
                  {c.estado!=="convertida"&&(
                    <button onClick={()=>convertirAOrden(c)}
                      style={{background:"#0a2a0f",border:"1px solid #26A69A60",color:"#26A69A",cursor:"pointer",padding:"6px 12px",borderRadius:7,fontSize:12,fontFamily:"inherit",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
                      ✅ Convertir en Orden
                    </button>
                  )}
                  <button title="PDF" onClick={()=>printCotizacion(c,getNombre(c.cliente)||c.contacto_nombre)} style={{background:"none",border:"none",color:"#64B5F6",cursor:"pointer",padding:6,borderRadius:6,display:"flex"}}><Icon name="pdf" size={15}/></button>
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

  const pages={home:<Home/>,ordenes:<OrdenesList/>,tablero:<Tablero/>,clientes:<Clientes/>,cotizaciones:<Cotizaciones/>,stock:<Stock/>,reportes:<Reportes/>,optimize:<Optimizer/>,ayuda:<Ayuda/>};

  return(
    <div style={{minHeight:"100vh",background:"#060f1a",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#c8e0f8",display:"flex"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <Sidebar/>
      <main style={{flex:1,padding:26,overflowY:"auto",minHeight:"100vh"}}>{pages[nav]}</main>

      <Modal open={modal?.type==="nueva_orden"||modal?.type==="editar_orden"} onClose={()=>setModal(null)} title={modal?.type==="editar_orden"?"Editar Orden":"Nueva Orden de Trabajo"} wide xwide>
        <OrdenForm orden={modal?.data} plantillas={plantillas} clientes={clientes} stockItems={stock} onSave={saveOrden} onClose={()=>setModal(null)}/>
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
        <ProcessManager estados={estados} onSave={async(list)=>{await fsCfgSet("estados",list);setModal(null);}} onClose={()=>setModal(null)}/>
      </Modal>
      <Modal open={modal?.type==="nueva_cotizacion"||modal?.type==="editar_cotizacion"} onClose={()=>setModal(null)} title={modal?.type==="editar_cotizacion"?"Editar Cotización":"Nueva Cotización"} wide>
        <CotizacionForm cot={modal?.data} clientes={clientes} tiposVidrio={tiposVidrio} onSave={async(form)=>{
          const id=form.id||newId();
          const numero=form.numero||newCotNum(cotizaciones);
          await fsSet("cotizaciones",id,{...form,id,numero,createdAt:form.createdAt||new Date().toISOString()});
          setModal(null);
        }} onClose={()=>setModal(null)}/>
      </Modal>
    </div>
  );
}
