import React, { useState, useEffect, useRef } from "react";

// ==========================================
// TIPOS Y DEFINICIONES ORIGINALES
// ==========================================
type Screen = "landing" | "success" | "dashboard" | "client";

interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  created_at: string;
}

interface ClientReferral {
  id: string;
  partnerId: string;
  clientName: string;
  clientPhone: string;
  serviceType: string;
  amount: number;
  commission: number;
  status: "Pending" | "Completed" | "Paid";
  date: string;
}

const C = {
  navy: "#0A0F1D",
  cardBg: "#111827",
  border: "#1F2937",
  gold: "#F59E0B",
  goldHover: "#D97706",
  textMain: "#F9FAFB",
  textMuted: "#9CA3AF",
};

const SEED_PARTNERS: Partner[] = [
  {
    id: "MH-9921",
    name: "Carlos Mendoza",
    email: "carlos@miamidetail.com",
    phone: "+1 (305) 555-0149",
    company: "Miami Elite Detailing",
    created_at: new Date().toISOString(),
  },
];

const SEED_REFERRALS: ClientReferral[] = [
  {
    id: "REF-101",
    partnerId: "MH-9921",
    clientName: "Robert Downey",
    clientPhone: "+1 (305) 555-8811",
    serviceType: "Ceramic Pro Ion Package",
    amount: 1500,
    commission: 150,
    status: "Completed",
    date: "2026-08-28",
  },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [partners, setPartners] = useState<Partner[]>(SEED_PARTNERS);
  const [referrals, setReferrals] = useState<ClientReferral[]>(SEED_REFERRALS);
  const [currentPartner, setCurrentPartner] = useState<Partner>(SEED_PARTNERS[0]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  
  const qrRef = useRef<HTMLCanvasElement | null>(null);

  // CORRECCIÓN 1: Teléfono optimizado para Brevo (permite '+', dígitos, espacios y guiones)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d+\-\s()]/g, "");
    setForm((prev) => ({ ...prev, phone: cleaned }));
  };

  // CORRECCIÓN 2: Envío directo sin requerir check manual (sms_opt_in por defecto en true)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const rawDigits = form.phone.replace(/\D/g, "");
    if (!form.name.trim() || !form.email.trim() || rawDigits.length < 7) {
      setError("Por favor, ingresa los datos requeridos y un teléfono válido para Brevo.");
      return;
    }

    setLoading(true);
    try {
      const newPartner: Partner = {
        id: `MH-${Math.floor(1000 + Math.random() * 9000)}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim() || "Independiente",
        created_at: new Date().toISOString(),
      };

      setPartners((prev) => [newPartner, ...prev]);
      setCurrentPartner(newPartner);
      setDownloaded(false);
      setScreen("success");
    } catch (err) {
      console.error("Error en registro:", err);
      setError("Ocurrió un error al procesar el registro.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (screen === "success" && qrRef.current) {
      const canvas = qrRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = C.navy;
        ctx.fillRect(20, 20, 60, 60);
        ctx.fillRect(120, 20, 40, 40);
        ctx.fillRect(20, 120, 40, 40);
        ctx.fillStyle = C.gold;
        ctx.fillRect(30, 30, 40, 40);
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#111827";
        ctx.textAlign = "center";
        ctx.fillText(`PARTNER: ${currentPartner.id}`, canvas.width / 2, 185);
      }
    }
  }, [screen, currentPartner]);

  const downloadQR = () => {
    if (qrRef.current) {
      const link = document.createElement("a");
      link.download = `MagicHands-QR-${currentPartner.id}.png`;
      link.href = qrRef.current.toDataURL("image/png");
      link.click();
      setDownloaded(true);
    }
  };

  return (
    <div style={{ backgroundColor: C.navy, color: C.textMain, minHeight: "100vh" }} className="flex flex-col font-sans antialiased">
      {/* HEADER ORIGINAL */}
      <header className="border-b border-gray-800 px-6 py-4 flex justify-between items-center bg-gray-950/60 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-black text-gray-950 text-lg shadow-md shadow-amber-500/20">
            MH
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white">MAGIC HANDS DETAILING</h1>
            <p className="text-[10px] text-amber-400 tracking-widest uppercase font-semibold">B2B Partner Network</p>
          </div>
        </div>

        <nav className="flex space-x-2">
          <button
            onClick={() => setScreen("landing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${screen === "landing" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-gray-400 hover:text-white"}`}
          >
            Registro / Kit
          </button>
          <button
            onClick={() => setScreen("dashboard")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${screen === "dashboard" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-gray-400 hover:text-white"}`}
          >
            Panel de Socios
          </button>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL ORIGINAL */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        
        {screen === "landing" && (
          <div className="w-full grid md:grid-cols-2 gap-8 items-center py-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-wider uppercase border border-amber-500/20">
                MOTELSGROUP, LLC
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                Monetiza tu red de contactos en el sector automotriz y náutico
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Únete a nuestra red exclusiva de talleres, centros PPF y marinas. Obtén comisiones automáticas por cada cliente referido que complete sus servicios de alta gama en Magic Hands.
              </p>
              <div className="border-l-2 border-amber-500 pl-4 py-1 text-xs text-gray-300 italic">
                "Validación SMS instantánea respaldada por Brevo para una integración limpia y sin fricciones."
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Registro de Nuevo Socio B2B</h3>
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-200 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Ej. Roberto Sánchez"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="contacto@tutualler.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1">Teléfono (Formato Brevo: +1...)</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handlePhoneChange}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="+1 (305) 000-0000"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Acepta códigos internacionales y formato estándar.</span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1">Empresa / Negocio</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Nombre del establecimiento"
                  />
                </div>

                {/* BOTÓN DE ENVÍO DIRECTO SIN CHECKBOX MANUAL */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-lg text-sm transition-colors shadow-lg shadow-amber-500/10 disabled:opacity-50"
                >
                  {loading ? "Validando y Procesando..." : "Aceptar y Continuar"}
                </button>
              </form>
            </div>
          </div>
        )}

        {screen === "success" && (
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center space-y-6 shadow-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto font-bold text-xl">
              ✓
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white">¡Registro Exitoso!</h3>
              <p className="text-xs text-gray-400 mt-1">Socio verificado correctamente en el sistema B2B.</p>
            </div>

            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex flex-col items-center">
              <canvas ref={qrRef} width="200" height="200" className="rounded-lg shadow-md bg-white p-2" />
              <span className="mt-3 text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                ID: {currentPartner.id}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={downloadQR}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-lg text-sm transition-colors shadow-lg"
              >
                {downloaded ? "↓ Descargar QR Nuevamente" : "↓ Descargar Kit QR (PNG)"}
              </button>

              <button
                onClick={() => setScreen("dashboard")}
                className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg text-xs transition-colors"
              >
                Ir a mi Panel de Control →
              </button>
            </div>
          </div>
        )}

        {screen === "dashboard" && (
          <div className="w-full space-y-6 py-4">
            <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div>
                <span className="text-xs text-amber-400 uppercase font-semibold tracking-wider">Panel Comercial B2B</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{currentPartner.company}</h3>
                <p className="text-xs text-gray-400">Responsable: {currentPartner.name} ({currentPartner.id})</p>
              </div>
              <button
                onClick={() => setScreen("landing")}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-medium rounded-lg text-gray-300 transition-colors"
              >
                Nuevo Registro
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                <span className="text-xs text-gray-400 uppercase font-medium">Clientes Referidos</span>
                <p className="text-2xl font-black text-white mt-1">{referrals.length}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                <span className="text-xs text-gray-400 uppercase font-medium">Servicios Completados</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  {referrals.filter(r => r.status === "Completed" || r.status === "Paid").length}
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                <span className="text-xs text-gray-400 uppercase font-medium">Comisiones Acumuladas (10%)</span>
                <p className="text-2xl font-black text-amber-400 mt-1">
                  ${referrals.reduce((acc, curr) => acc + curr.commission, 0).toFixed(2)} USD
                </p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h4 className="font-bold text-sm text-white">Historial de Referencias y Estado</h4>
                <span className="text-xs text-gray-500 font-mono">Actualizado en tiempo real</span>
              </div>
              <div className="divide-y divide-gray-800">
                {referrals.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500">No hay referencias registradas todavía.</div>
                ) : (
                  referrals.map((ref) => (
                    <div key={ref.id} className="p-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 hover:bg-gray-950/40 transition-colors">
                      <div>
                        <div className="font-medium text-sm text-white">{ref.clientName}</div>
                        <div className="text-xs text-gray-400">{ref.serviceType} • <span className="font-mono text-gray-300">${ref.amount}</span></div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-xs font-bold text-amber-400">+${ref.commission} USD</span>
                          <span className="block text-[10px] text-gray-500">{ref.date}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ref.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {ref.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-gray-900 py-4 px-6 text-center text-[11px] text-gray-500 bg-gray-950">
        Grupo Empresarial Villacís • MOTELSGROUP, LLC &copy; 2026. Todos los derechos reservados.
      </footer>
    </div>
  );
}
