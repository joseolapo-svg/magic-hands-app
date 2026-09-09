import React, { useState, useRef, useEffect } from "react"

// ─── Design Tokens & Constants ───────────────────────────────────────────────
const C = {
  navy: "#030814",
  navy800: "#081329",
  gold: "#d4af37",
  goldL: "#f3e5ab",
  white: "#ffffff",
  silver: "#c0c0c0",
  silverD: "#8a99ad",
}

const CATEGORY_LABELS: Record<string, string> = {
  dealership: "Car Dealership",
  mechanic: "Mechanic / Workshop",
  valet: "Valet Parking",
  concierge: "Hotel Concierge",
  gas_station: "Gas Station / Service",
  other: "Other Business",
}

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen = "landing" | "success" | "dashboard" | "client"

interface Partner {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string
  category: string
  address: string
  createdAt: string
}

interface ClientReferral {
  id: string
  partnerId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  vehicleModel: string
  serviceType: string
  status: "pending" | "completed"
  date: string
}

const SEED_PARTNERS: Partner[] = [
  {
    id: "MHM-8842",
    businessName: "Brickell Luxury Motors",
    contactName: "Carlos Santana",
    email: "carlos@brickellluxury.com",
    phone: "+1 (305) 555-0143",
    category: "dealership",
    address: "1200 Brickell Ave, Miami, FL",
    createdAt: "2026-02-14",
  },
  {
    id: "MHM-3319",
    businessName: "South Beach Valet Services",
    contactName: "Mateo Rossi",
    email: "m.rossi@sbvalet.com",
    phone: "+1 (305) 555-9821",
    category: "valet",
    address: "450 Ocean Dr, Miami Beach, FL",
    createdAt: "2026-03-01",
  },
]

const SEED_REFERRALS: ClientReferral[] = [
  {
    id: "REF-101",
    partnerId: "MHM-8842",
    clientName: "Valeria Gomez",
    clientEmail: "valeria@gomez.com",
    phone: "+1 (305) 555-4321",
    vehicleModel: "Porsche 911 Carrera",
    serviceType: "Full Ceramic Coating",
    status: "completed",
    date: "2026-03-05",
  },
  {
    id: "REF-102",
    partnerId: "MHM-3319",
    clientName: "Julian Vance",
    clientEmail: "jvance@miamiinv.com",
    phone: "+1 (305) 555-8765",
    vehicleModel: "Range Rover Sport",
    serviceType: "Interior Detailing & Paint Correction",
    status: "pending",
    date: "2026-03-08",
  },
]

// Supabase configuration flag & placeholder helpers
const isSupabaseConfigured = false
const fetchPartners = async () => SEED_PARTNERS
const fetchReferrals = async () => SEED_REFERRALS
const insertPartner = async (p: Partner) => p
const insertReferral = async (r: ClientReferral) => r
const recordTermsAcceptance = async (id: string) => id

// ─── Mini Logo & Mock Assets ─────────────────────────────────────────────────
const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        background: `linear-gradient(135deg, ${C.gold}, #997a15)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: "16px",
        color: C.navy,
        boxShadow: `0 0 15px ${C.gold}44`,
      }}
    >
      MH
    </div>
    <div style={{ lineHeight: 1.1 }}>
      <div
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 900,
          fontSize: "13px",
          color: C.white,
          letterSpacing: "0.08em",
        }}
      >
        MAGIC HANDS
      </div>
      <div
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          fontSize: "9px",
          color: C.gold,
          letterSpacing: "0.15em",
        }}
      >
        PARTNER NETWORK
      </div>
    </div>
  </div>
)

// Dummy base64 placeholders for canvas generation
const logoImg =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNkNGFmMzciLz48L3N2Zz4="
const qrImg =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg=="

const QRSvg = ({ size = 160 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100" height="100" fill="white" />
    <rect x="10" y="10" width="30" height="30" fill="black" />
    <rect x="15" y="15" width="20" height="20" fill="white" />
    <rect x="20" y="20" width="10" height="10" fill="black" />
    <rect x="60" y="10" width="30" height="30" fill="black" />
    <rect x="65" y="15" width="20" height="20" fill="white" />
    <rect x="70" y="20" width="10" height="10" fill="black" />
    <rect x="10" y="60" width="30" height="30" fill="black" />
    <rect x="15" y="65" width="20" height="20" fill="white" />
    <rect x="20" y="70" width="10" height="10" fill="black" />
    <rect x="45" y="45" width="10" height="10" fill="black" />
    <rect x="55" y="55" width="10" height="10" fill="black" />
    <rect x="60" y="45" width="10" height="10" fill="black" />
    <rect x="45" y="60" width="10" height="20" fill="black" />
    <rect x="70" y="60" width="20" height="10" fill="black" />
    <rect x="80" y="80" width="10" height="10" fill="black" />
    <rect x="55" y="80" width="15" height="10" fill="black" />
  </svg>
)

// ─── Navigation Header ───────────────────────────────────────────────────────
function Nav({
  screen,
  onNavigate,
}: {
  screen: Screen
  onNavigate: (s: Screen) => void
}) {
  return (
    <nav
      style={{
        borderBottom: `1px solid ${C.gold}22`,
        padding: "0 40px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: `${C.navy}f0`,
        backdropFilter: "blur(14px)",
      }}
    >
      <Logo />
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <button
          onClick={() => onNavigate("landing")}
          style={{
            background: "transparent",
            border: "none",
            color: screen === "landing" ? C.gold : C.silverD,
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Partner Sign Up
        </button>
        <button
          onClick={() => onNavigate("dashboard")}
          style={{
            background: "transparent",
            border: "none",
            color: screen === "dashboard" ? C.gold : C.silverD,
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Partner Dashboard
        </button>
        <button
          onClick={() => onNavigate("client")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: `1px solid ${C.gold}55`,
            background: `${C.gold}11`,
            color: C.gold,
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Client Booking Portal
        </button>
      </div>
    </nav>
  )
}

// ─── Landing Page / Partner Registration Form ────────────────────────────────
function LandingPage({
  onSuccess,
}: {
  onSuccess: (p: Partner) => void
}) {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    category: "dealership",
    address: "",
  })
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!terms) {
      alert("Please accept the terms and conditions.")
      return
    }
    setLoading(true)
    setTimeout(() => {
      const newPartner: Partner = {
        id: `MHM-${Math.floor(1000 + Math.random() * 9000)}`,
        ...form,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setLoading(false)
      onSuccess(newPartner)
    }, 800)
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "60px 24px 80px",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div
          style={{
            display: "inline-flex",
            padding: "6px 16px",
            borderRadius: "100px",
            background: `${C.gold}12`,
            border: `1px solid ${C.gold}33`,
            color: C.gold,
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Exclusive B2B Partner Program
        </div>
        <h1
          style={{
            fontSize: "42px",
            fontWeight: 900,
            color: C.white,
            letterSpacing: "-0.03em",
            marginBottom: "16px",
          }}
        >
          Monetize Your Client Vehicle Network with{" "}
          <span style={{ color: C.gold }}>Magic Hands</span>
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: C.silverD,
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Join Miami’s premier detailing partner ecosystem. Earn 10% cash commissions
          on every referred client for elite paint protection and ceramic coatings.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: C.navy800,
          border: `1px solid ${C.gold}28`,
          borderRadius: "20px",
          padding: "48px",
          boxShadow: `0 0 50px ${C.gold}0a`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: C.silver,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Brickell Auto Group"
              value={form.businessName}
              onChange={(e) =>
                setForm({ ...form, businessName: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                background: C.navy,
                border: `1px solid ${C.silverD}44`,
                borderRadius: "8px",
                color: C.white,
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: C.silver,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Contact Person / Manager *
            </label>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={form.contactName}
              onChange={(e) =>
                setForm({ ...form, contactName: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                background: C.navy,
                border: `1px solid ${C.silverD}44`,
                borderRadius: "8px",
                color: C.white,
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: C.silver,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Business Email *
            </label>
            <input
              type="email"
              required
              placeholder="manager@business.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: C.navy,
                border: `1px solid ${C.silverD}44`,
                borderRadius: "8px",
                color: C.white,
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: C.silver,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+1 (305) 000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: C.navy,
                border: `1px solid ${C.silverD}44`,
                borderRadius: "8px",
                color: C.white,
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: C.silver,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Business Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: C.navy,
                border: `1px solid ${C.silverD}44`,
                borderRadius: "8px",
                color: C.white,
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            >
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: C.silver,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Business Address *
            </label>
            <input
              type="text"
              required
              placeholder="Street, City, FL"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: C.navy,
                border: `1px solid ${C.silverD}44`,
                borderRadius: "8px",
                color: C.white,
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "32px", display: "flex", gap: "12px" }}>
          <input
            type="checkbox"
            id="terms"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: C.gold }}
          />
          <label
            htmlFor="terms"
            style={{ fontSize: "12px", color: C.silverD, lineHeight: 1.5 }}
          >
            I agree to the Magic Hands Partner Terms & Conditions, authorizing the
            generation of tracking links, counter QR displays, and standard 10%
            commission payouts upon verified completed services.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "10px",
            background: `linear-gradient(90deg, ${C.gold}, ${C.goldL})`,
            color: C.navy,
            fontWeight: 900,
            fontSize: "13px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            boxShadow: `0 0 30px ${C.gold}33`,
            fontFamily: "inherit",
          }}
        >
          {loading
            ? "Creating Partner Profile..."
            : "Register & Generate QR Kit →"}
        </button>
      </form>
    </div>
  )
}

// ─── Success / QR Kit Screen ──────────────────────────────────────────────────
function SuccessScreen({
  partner,
  onDashboard,
  onBack, // <--- 1. Añadimos la prop onBack para manejar el retroceso
}: {
  partner: Partner
  onDashboard: () => void
  onBack: () => void // <--- 2. Tipamos la prop
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [downloaded, setDownloaded] = useState(false)

  const downloadQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const W = 480,
      H = 580
    canvas.width = W
    canvas.height = H

    ctx.fillStyle = "#060e1e"
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = C.gold
    ctx.lineWidth = 3
    ctx.strokeRect(4, 4, W - 8, H - 8)

    ctx.fillStyle = "#0c1a30"
    ctx.fillRect(4, 4, W - 8, 90)

    const logoEl = new Image()
    logoEl.onload = () => {
      ctx.drawImage(logoEl, 20, 14, 64, 64)

      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 18px Montserrat, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("MAGIC HANDS", 96, 42)
      ctx.fillStyle = C.gold
      ctx.font = "600 11px Montserrat, sans-serif"
      ctx.fillText("DETAILING SPECIALISTS · MIAMI", 96, 62)

      ctx.fillStyle = `${C.gold}22`
      ctx.beginPath()
      ctx.roundRect(W - 160, 26, 144, 36, 6)
      ctx.fill()
      ctx.fillStyle = C.gold
      ctx.font = "bold 11px JetBrains Mono, monospace"
      ctx.textAlign = "center"
      ctx.fillText(partner.id, W - 88, 48)

      const qrPad = 20,
        qrSize = W - 80,
        qrTop = 110
      ctx.fillStyle = "#FFFFFF"
      ctx.beginPath()
      ctx.roundRect(40, qrTop, qrSize, qrSize, 10)
      ctx.fill()

      const textTop = qrTop + qrSize + 24
      ctx.fillStyle = C.white
      ctx.font = "bold 13px Montserrat, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Scan to book — your referral is automatic", W / 2, textTop)
      ctx.fillStyle = C.silverD
      ctx.font = "11px Montserrat, sans-serif"
      ctx.fillText(
        "magichandsmiami.com · Partner Referral Program",
        W / 2,
        textTop + 22,
      )

      ctx.strokeStyle = `${C.gold}55`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(40, textTop - 14)
      ctx.lineTo(W - 40, textTop - 14)
      ctx.stroke()

      const qrEl = new Image()
      qrEl.onload = () => {
        const inner = qrSize - qrPad * 2
        ctx.drawImage(qrEl, 40 + qrPad, qrTop + qrPad, inner, inner)
        const url = canvas.toDataURL("image/png")
        const a = document.createElement("a")
        a.href = url
        a.download = `${partner.id}-qr-kit.png`
        a.click()
        setDownloaded(true)
      }
      qrEl.src = qrImg
    }
    logoEl.src = logoImg
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.navy,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <nav
        style={{
          borderBottom: `1px solid ${C.gold}22`,
          padding: "0 40px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: `${C.navy}f0`,
          backdropFilter: "blur(14px)",
        }}
      >
        <Logo />
        {/* 3. Contenedor para alinear el botón de Retroceder y el de Ir al Dashboard */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={onBack}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: `1px solid ${C.silverD}44`,
              background: "transparent",
              color: C.silverD,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            ← Volver
          </button>
          <button
            onClick={onDashboard}
            style={{
              padding: "8px 20px",
              borderRadius: "6px",
              border: `1px solid ${C.gold}55`,
              background: "transparent",
              color: C.gold,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Go to Dashboard →
          </button>
        </div>
      </nav>

      <div
        style={{
          maxWidth: "740px",
          margin: "0 auto",
          padding: "60px 24px 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            margin: "0 auto 28px",
            background: `${C.gold}14`,
            border: `2px solid ${C.gold}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 40px ${C.gold}22`,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path
              d="M5 15L11 21L25 7"
              stroke={C.gold}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1
          style={{
            fontSize: "38px",
            fontWeight: 900,
            letterSpacing: "-0.025em",
            marginBottom: "12px",
            color: C.white,
          }}
        >
          Welcome, <span style={{ color: C.gold }}>{partner.businessName}</span>
          !
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: C.silverD,
            marginBottom: "52px",
            lineHeight: 1.75,
            maxWidth: "560px",
            margin: "0 auto 52px",
          }}
        >
          Your partner account is now active. Print the QR code below and
          display it at your counter — when clients scan it they will be
          automatically linked to your business in our system.
        </p>

        <div
          style={{
            background: C.navy800,
            border: `1px solid ${C.gold}28`,
            borderRadius: "20px",
            padding: "48px",
            marginBottom: "28px",
            boxShadow: `0 0 60px ${C.gold}0a`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "48px",
              alignItems: "center",
              textAlign: "left",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "100px",
                  background: `${C.gold}10`,
                  border: `1px solid ${C.gold}33`,
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: C.gold,
                    textTransform: "uppercase",
                  }}
                >
                  Your Partner QR Kit
                </span>
              </div>

              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: C.white,
                  marginBottom: "20px",
                  lineHeight: 1.25,
                }}
              >
                Place This QR at Your Counter
              </h3>

              {[
                "Client scans the QR code at your location",
                "They land on the Magic Hands booking page",
                "Your business is pre-selected as referral",
                "10% commission released after service payment",
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: `${C.gold}18`,
                      border: `1px solid ${C.gold}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        color: C.gold,
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      color: C.silver,
                      lineHeight: 1.55,
                    }}
                  >
                    {s}
                  </span>
                </div>
              ))}

              <button
                onClick={downloadQR}
                style={{
                  marginTop: "20px",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 800,
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: downloaded ? C.gold : C.navy,
                  background: downloaded
                    ? `${C.gold}18`
                    : `linear-gradient(90deg, ${C.gold}, ${C.goldL})`,
                  border: downloaded ? `1px solid ${C.gold}55` : "none",
                  boxShadow: downloaded ? "none" : `0 0 20px ${C.gold}44`,
                }}
              >
                {downloaded ? "✓ Downloaded!" : "↓ Download QR Kit (PNG)"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: C.white,
                  padding: "18px",
                  borderRadius: "12px",
                  boxShadow: `0 0 40px ${C.gold}33`,
                  border: `2px solid ${C.gold}44`,
                }}
              >
                <QRSvg size={160} />
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: C.gold,
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.1em",
                }}
              >
                {partner.id}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {[
            { l: "Partner ID", v: partner.id, mono: true },
            { l: "Commission Rate", v: "10% per service", mono: false },
            {
              l: "Category",
              v: CATEGORY_LABELS[partner.category] || partner.category,
              mono: false,
            },
          ].map(({ l, v, mono }) => (
            <div
              key={l}
              style={{
                padding: "20px",
                borderRadius: "10px",
                background: `${C.gold}06`,
                border: `1px solid ${C.gold}18`,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: C.silverD,
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                {l}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: C.silver,
                  fontFamily: mono
                    ? "JetBrains Mono, monospace"
                    : "Montserrat, sans-serif",
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard Component ─────────────────────────────────────────────────────
function Dashboard({
  partner,
  allPartners,
  referrals,
}: {
  partner: Partner
  allPartners: Partner[]
  referrals: ClientReferral[]
}) {
  const [selectedPartnerId, setSelectedPartnerId] = useState(partner.id)
  const activePartner =
    allPartners.find((p) => p.id === selectedPartnerId) || partner
  const partnerReferrals = referrals.filter(
    (r) => r.partnerId === activePartner.id,
  )

  const completedCount = partnerReferrals.filter(
    (r) => r.status === "completed",
  ).length
  const estimatedEarnings = completedCount * 150 // Mock calculation based on average ticket

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 24px 80px",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 900,
              color: C.white,
              marginBottom: "6px",
            }}
          >
            Partner Performance Dashboard
          </h1>
          <p style={{ fontSize: "13px", color: C.silverD }}>
            Track client referrals, active bookings, and commission payouts in
            real time.
          </p>
        </div>
        <div>
          <select
            value={selectedPartnerId}
            onChange={(e) => setSelectedPartnerId(e.target.value)}
            style={{
              padding: "10px 16px",
              background: C.navy800,
              border: `1px solid ${C.gold}44`,
              borderRadius: "8px",
              color: C.gold,
              fontWeight: 700,
              fontSize: "13px",
              fontFamily: "inherit",
            }}
          >
            {allPartners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.businessName} ({p.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "Total Referrals",
            value: partnerReferrals.length,
            mono: true,
          },
          {
            label: "Completed Services",
            value: completedCount,
            mono: true,
          },
          {
            label: "Commission Rate",
            value: "10%",
            mono: false,
          },
          {
            label: "Estimated Earnings",
            value: `$${estimatedEarnings}.00`,
            mono: true,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: C.navy800,
              border: `1px solid ${C.gold}22`,
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: C.silverD,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: C.gold,
                fontFamily: stat.mono
                  ? "JetBrains Mono, monospace"
                  : "Montserrat, sans-serif",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: C.navy800,
          border: `1px solid ${C.gold}22`,
          borderRadius: "16px",
          padding: "32px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: C.white,
            marginBottom: "20px",
          }}
        >
          Referred Clients Log
        </h3>
        {partnerReferrals.length === 0 ? (
          <p style={{ fontSize: "13px", color: C.silverD }}>
            No referrals recorded yet for this partner. Scan your QR code or share
            your tracking link to start earning.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${C.gold}22`,
                  textAlign: "left",
                }}
              >
                <th
                  style={{
                    padding: "12px",
                    fontSize: "11px",
                    color: C.silverD,
                    textTransform: "uppercase",
                  }}
                >
                  Client Name
                </th>
                <th
                  style={{
                    padding: "12px",
                    fontSize: "11px",
                    color: C.silverD,
                    textTransform: "uppercase",
                  }}
                >
                  Vehicle
                </th>
                <th
                  style={{
                    padding: "12px",
                    fontSize: "11px",
                    color: C.silverD,
                    textTransform: "uppercase",
                  }}
                >
                  Service
                </th>
                <th
                  style={{
                    padding: "12px",
                    fontSize: "11px",
                    color: C.silverD,
                    textTransform: "uppercase",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "12px",
                    fontSize: "11px",
                    color: C.silverD,
                    textTransform: "uppercase",
                  }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {partnerReferrals.map((r) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: `1px solid ${C.gold}11` }}
                >
                  <td
                    style={{
                      padding: "16px 12px",
                      color: C.white,
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    {r.clientName}
                  </td>
                  <td
                    style={{
                      padding: "16px 12px",
                      color: C.silver,
                      fontSize: "13px",
                    }}
                  >
                    {r.vehicleModel}
                  </td>
                  <td
                    style={{
                      padding: "16px 12px",
                      color: C.silver,
                      fontSize: "13px",
                    }}
                  >
                    {r.serviceType}
                  </td>
                  <td style={{ padding: "16px 12px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "100px",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        background:
                          r.status === "completed"
                            ? `${C.gold}22`
                            : `${C.silverD}22`,
                        color: r.status === "completed" ? C.gold : C.silverD,
                        border: `1px solid ${
                          r.status === "completed" ? C.gold : C.silverD
                        }44`,
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "16px 12px",
                      color: C.silverD,
                      fontSize: "12px",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {r.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Client Booking Form Component ───────────────────────────────────────────
function ClientForm({
  partners,
  onSubmit,
}: {
  partners: Partner[]
  onSubmit: (ref: ClientReferral) => void
}) {
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [vehicleModel, setVehicleModel] = useState("")
  const [serviceType, setServiceType] = useState("Full Ceramic Coating")
  const [selectedPartnerId, setSelectedPartnerId] = useState(
    partners[0]?.id || "",
  )
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRef: ClientReferral = {
      id: `REF-${Math.floor(100 + Math.random() * 900)}`,
      partnerId: selectedPartnerId,
      clientName,
      clientEmail,
      clientPhone,
      vehicleModel,
      serviceType,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    }
    onSubmit(newRef)
    setSubmitted(true)
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "60px 24px 80px",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 900,
            color: C.white,
            marginBottom: "12px",
          }}
        >
          Client Booking & Referral Portal
        </h1>
        <p style={{ fontSize: "14px", color: C.silverD }}>
          Book your elite detailing service. If you were referred by one of our
          partner locations, select them below to ensure credit tracking.
        </p>
      </div>

      {submitted ? (
        <div
          style={{
            background: C.navy800,
            border: `1px solid ${C.gold}44`,
            borderRadius: "20px",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: C.gold, fontSize: "24px", marginBottom: "16px" }}>
            Booking Confirmed!
          </h2>
          <p
            style={{
              color: C.silver,
              fontSize: "14px",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            Thank you, {clientName}. Your appointment request for your{" "}
            {vehicleModel} has been received. Our team will contact you shortly to
            finalize scheduling.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              padding: "12px 24px",
              background: `linear-gradient(90deg, ${C.gold}, ${C.goldL})`,
              border: "none",
              borderRadius: "8px",
              color: C.navy,
              fontWeight: 800,
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Submit Another Booking
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            background: C.navy800,
            border: `1px solid ${C.gold}28`,
            borderRadius: "20px",
            padding: "40px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: C.silver,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Referring Partner Location *
            </label>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: C.navy,
                border: `1px solid ${C.gold}44`,
                borderRadius: "8px",
                color: C.gold,
                fontWeight: 700,
                fontSize: "13px",
                fontFamily: "inherit",
              }}
            >
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.businessName} ({p.id})
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: C.silver,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: C.navy,
                  border: `1px solid ${C.silverD}44`,
                  borderRadius: "8px",
                  color: C.white,
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: C.silver,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (305) 000-0000"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: C.navy,
                  border: `1px solid ${C.silverD}44`,
                  borderRadius: "8px",
                  color: C.white,
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: C.silver,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: C.navy,
                border: `1px solid ${C.silverD}44`,
                borderRadius: "8px",
                color: C.white,
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: C.silver,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                Vehicle Model *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tesla Model S Plaid"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: C.navy,
                  border: `1px solid ${C.silverD}44`,
                  borderRadius: "8px",
                  color: C.white,
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: C.silver,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                Requested Service *
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: C.navy,
                  border: `1px solid ${C.silverD}44`,
                  borderRadius: "8px",
                  color: C.white,
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              >
                <option value="Full Ceramic Coating">
                  Full Ceramic Coating
                </option>
                <option value="Interior Detailing & Paint Correction">
                  Interior Detailing & Paint Correction
                </option>
                <option value="Paint Protection Film (PPF)">
                  Paint Protection Film (PPF)
                </option>
                <option value="Maintenance Wash & Detail">
                  Maintenance Wash & Detail
                </option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "10px",
              background: `linear-gradient(90deg, ${C.gold}, ${C.goldL})`,
              color: C.navy,
              fontWeight: 900,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Confirm Booking & Secure Referral →
          </button>
        </form>
      )}
    </div>
  )
}

// ─── Root App (Actualización en la llamada a SuccessScreen) ──────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("landing")
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null)
  const [partners, setPartners] = useState<Partner[]>(
    isSupabaseConfigured ? [] : SEED_PARTNERS,
  )
  const [referrals, setReferrals] = useState<ClientReferral[]>(
    isSupabaseConfigured ? [] : SEED_REFERRALS,
  )

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true
    ;(async () => {
      try {
        const [p, r] = await Promise.all([fetchPartners(), fetchReferrals()])
        if (!active) return
        setPartners(p)
        setReferrals(r)
      } catch (err) {
        console.error("Failed to load data from Supabase:", err)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const handlePartnerSuccess = (p: Partner) => {
    setPartners((prev) => [p, ...prev])
    setCurrentPartner(p)
    setScreen("success")
    insertPartner(p)
      .then(() => recordTermsAcceptance(p.id))
      .catch((err) =>
        console.error("Failed to save partner / terms acceptance:", err),
      )
  }

  const handleClientReferral = (ref: ClientReferral) => {
    setReferrals((prev) => [ref, ...prev])
    insertReferral(ref).catch((err) =>
      console.error("Failed to save referral:", err),
    )
  }

  const activeDashboardPartner = currentPartner ?? SEED_PARTNERS[0]

  return (
    <>
      <div style={{ minHeight: "100vh", background: C.navy, display: "flex", flexDirection: "column" }}>
        {(screen === "landing" || screen === "client") && (
          <Nav screen={screen} onNavigate={setScreen} />
        )}

        {screen === "landing" && <LandingPage onSuccess={handlePartnerSuccess} />}
        {screen === "success" && currentPartner && (
          <SuccessScreen
            partner={currentPartner}
            onDashboard={() => setScreen("dashboard")}
            onBack={() => setScreen("landing")} // <--- 4. Conectamos la acción para regresar al formulario (landing)
          />
        )}
        {screen === "dashboard" && (
          <>
            <Dashboard
              partner={activeDashboardPartner}
              allPartners={partners}
              referrals={referrals}
            />
          </>
        )}
        {screen === "client" && (
          <ClientForm partners={partners} onSubmit={handleClientReferral} />
        )}
      </div>
      <footer className="site-footer" style={{
          backgroundColor: '#111111',
          color: '#ffffff',
          textAlign: 'center',
          padding: '20px 0',
          fontFamily: 'inherit',
          fontSize: '14px',
          borderTop: '1px solid #222222',
      }}>
          <div className="footer-content">
              <p style={{ margin: 0, letterSpacing: '0.5px' }}>
                  © 2026 Magic Hands Detailing Specialists. A service operated by MOTELSGROUP, LLC.
              </p>
          </div>
      </footer>
    </>
  )
}
