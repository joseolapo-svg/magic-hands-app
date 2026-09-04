import { useState, useRef, useEffect } from "react"
import logoImg from "./imports/LOGO_DETAILING_SPECIALIST.png"
import qrImg from "./imports/qr_vectorizado.svg"
import type { Partner, ClientReferral } from "./lib/types"
import { C, COMMISSION_BY_SERVICE, CATEGORY_LABELS } from "./lib/constants"
import { isSupabaseConfigured } from "./lib/supabaseClient"
import {
  fetchPartners,
  fetchReferrals,
  insertPartner,
  insertReferral,
  recordTermsAcceptance,
} from "./lib/db"
import ClientForm from "./ClientForm"

// ─── Types ──────────────────────────────────────────────────────────────────
type Screen = "landing" | "success" | "dashboard" | "client"

// ─── Seed data ───────────────────────────────────────────────────────────────
const SEED_PARTNERS: Partner[] = [
  {
    id: "MH-MIAMIL-26",
    businessName: "Miami Luxury Motors",
    contactName: "Carlos Rodríguez",
    email: "carlos@miamiluxurymotors.com",
    phone: "+1 (305) 444-1122",
    category: "luxury_dealer",
    joinedAt: "2026-06-12",
  },
  {
    id: "MH-BAYMAR-26",
    businessName: "Bayliner Marine Miami",
    contactName: "Elena Fuentes",
    email: "elena@baylinermarine.com",
    phone: "+1 (305) 555-9900",
    category: "marina",
    joinedAt: "2026-05-03",
  },
  {
    id: "MH-SUNRIS-26",
    businessName: "Sunrise Auto Workshop",
    contactName: "Jorge Mendoza",
    email: "jorge@sunriseauto.com",
    phone: "+1 (786) 300-7812",
    category: "auto_workshop",
    joinedAt: "2026-07-20",
  },
]

const SEED_REFERRALS: ClientReferral[] = [
  {
    id: "REF-001",
    clientName: "Carlos Menéndez",
    clientEmail: "c.menendez@gmail.com",
    clientPhone: "+1 305 712 4490",
    vehicleType: "65ft Yacht",
    serviceInterest: "Full Detail",
    partnerId: "MH-BAYMAR-26",
    partnerName: "Bayliner Marine Miami",
    registeredAt: "2026-08-05",
    status: "Completed",
  },
  {
    id: "REF-002",
    clientName: "Sofia Restrepo",
    clientEmail: "s.restrepo@gmail.com",
    clientPhone: "+1 305 890 3312",
    vehicleType: "Ferrari 488",
    serviceInterest: "Ceramic Coating",
    partnerId: "MH-MIAMIL-26",
    partnerName: "Miami Luxury Motors",
    registeredAt: "2026-08-04",
    status: "Completed",
  },
  {
    id: "REF-003",
    clientName: "James Whitmore",
    clientEmail: "jwhitmore@me.com",
    clientPhone: "+1 786 220 6600",
    vehicleType: "Bentley Bentayga",
    serviceInterest: "Interior Restoration",
    partnerId: "MH-MIAMIL-26",
    partnerName: "Miami Luxury Motors",
    registeredAt: "2026-08-03",
    status: "Booked",
  },
  {
    id: "REF-004",
    clientName: "Andrea Vásquez",
    clientEmail: "avasquez@outlook.com",
    clientPhone: "+1 305 441 8823",
    vehicleType: "Lamborghini Huracán",
    serviceInterest: "Paint Correction",
    partnerId: "MH-SUNRIS-26",
    partnerName: "Sunrise Auto Workshop",
    registeredAt: "2026-08-02",
    status: "Completed",
  },
  {
    id: "REF-005",
    clientName: "Elena Ruiz",
    clientEmail: "elenita.r@gmail.com",
    clientPhone: "+1 786 550 4100",
    vehicleType: "40ft Sea Ray",
    serviceInterest: "Nano Coating",
    partnerId: "MH-BAYMAR-26",
    partnerName: "Bayliner Marine Miami",
    registeredAt: "2026-07-30",
    status: "Pending",
  },
]

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo({ size = 40 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img
        src={logoImg}
        alt="MH Detailing Specialists"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          flexShrink: 0,
        }}
      />
      <div
        style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}
      >
        <span
          style={{
            fontWeight: 900,
            fontSize: "13px",
            letterSpacing: "0.08em",
            color: C.white,
            textTransform: "uppercase",
          }}
        >
          Magic Hands
        </span>
        <span
          style={{
            fontWeight: 600,
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: C.gold,
            textTransform: "uppercase",
          }}
        >
          Detailing Specialists
        </span>
      </div>
    </div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({
  screen,
  onNavigate,
}: {
  screen: Screen
  onNavigate: (s: Screen) => void
}) {
  return (
    <nav
      className="app-nav"
      style={{
        borderBottom: `1px solid ${C.gold}22`,
        paddingTop: "max(55px, env(safe-area-inset-top, 0px))",
        paddingRight: "max(19px, env(safe-area-inset-right, 0px))",
        paddingBottom: 0,
        paddingLeft: "max(20px, env(safe-area-inset-left, 0px))",
        minHeight: "64px",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: `${C.navy}f0`,
        backdropFilter: "blur(14px)",
      }}
    >
     <Logo />
      <div style={{ display: "flex", gap: "8px" }}>
        {[
          { label: "Partnership", s: "landing" as Screen },
          { label: "Client Referral", s: "client" as Screen },
        ].map(({ label, s }) => {
          const isDisabled = s === "client";

          return (
            <button
              disabled={isDisabled}
              key={s}
              onClick={() => !isDisabled && onNavigate(s)}
              style={{
                padding: "7px 18px",
                borderRadius: "6px",
                border: "none",
                cursor: isDisabled ? "not-allowed" : "pointer",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                fontFamily: "Montserrat, sans-serif",
                background: screen === s ? `${C.gold}22` : "transparent",
                color: isDisabled ? `${C.silverD}55` : (screen === s ? C.gold : C.silverD),
                borderBottom:
                  screen === s ? `2px solid ${C.gold}` : "2px solid transparent",
                opacity: isDisabled ? 0.4 : 1,
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  )
}

// ─── QR SVG ─────────────────────────────────────────────────────────────────
function QRSvg({ size = 168 }: { size?: number }) {
  return (
    <img
      src={qrImg}
      alt="Magic Hands QR"
      width={size}
      height={size}
      style={{ display: "block" }}
    />
  )
}

// ─── Partner Landing / Registration ──────────────────────────────────────────
function LandingPage({ onSuccess }: { onSuccess: (p: Partner) => void }) {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    category: "",
    terms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.businessName.trim()) e.businessName = "Required"
    if (!form.contactName.trim()) e.contactName = "Required"
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Valid email required"
    if (!form.phone.trim()) e.phone = "Required"
    else if (form.phone.replace(/\D/g, "").length < 7)
      e.phone = "Enter a valid phone number (digits only)"
    if (!form.category) e.category = "Select a category"
    if (!form.terms) e.terms = "Must accept terms"
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setSubmitting(true)
    const slug = form.businessName
      .replace(/\s+/g, "")
      .toUpperCase()
      .slice(0, 6)
    const partner: Partner = {
      id: `MH-${slug}-26`,
      businessName: form.businessName,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      category: form.category,
      joinedAt: new Date().toISOString().slice(0, 10),
    }
    setTimeout(() => {
      onSuccess(partner)
    }, 1400)
  }

  const inp = (k: string) => ({
    style: {
      width: "100%",
      background: `${C.navy700}`,
      border: `1px solid ${errors[k] ? "#ef4444" : C.gold + "28"}`,
      borderRadius: "7px",
      padding: "11px 14px",
      color: C.white,
      fontSize: "13px",
      fontFamily: "Montserrat, sans-serif",
      fontWeight: 500,
      outline: "none",
    } as React.CSSProperties,
  })

  const CATS = [
    { value: "auto_workshop", label: "Auto Workshop / Body Shop" },
    { value: "marina", label: "Marina / Boat Dealer" },
    { value: "auto_parts", label: "Auto Parts & Accessories" },
    { value: "luxury_dealer", label: "Luxury Vehicle Dealership" },
    { value: "detailing_shop", label: "Detailing Shop / Spa" },
  ]

  const label = (text: string) => (
    <div
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: C.silverD,
        textTransform: "uppercase",
        marginBottom: "7px",
      }}
    >
      {text}
    </div>
  )

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.navy,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* Hero */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "80px 40px 60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${C.gold}14 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.025,
            backgroundImage: `linear-gradient(${C.gold}ff 1px, transparent 1px), linear-gradient(90deg, ${C.gold}ff 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
          }}
        />

        <div
          style={{ position: "relative", maxWidth: "780px", margin: "0 auto" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: `1px solid ${C.gold}44`,
              borderRadius: "100px",
              padding: "5px 16px",
              marginBottom: "28px",
              background: `${C.gold}10`,
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: C.gold,
                boxShadow: `0 0 8px ${C.gold}`,
              }}
            />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: C.gold,
                textTransform: "uppercase",
              }}
            >
              Exclusive B2B Partner Program · Miami
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 56px)",
              fontWeight: 900,
              lineHeight: 1.07,
              letterSpacing: "-0.025em",
              marginBottom: "20px",
              color: C.white,
            }}
          >
            Expand Your Business Revenue:{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${C.gold}, ${C.goldL})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Join the Magic Hands Partner Program
            </span>
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: C.silverD,
              lineHeight: 1.75,
              marginBottom: "44px",
              maxWidth: "560px",
              margin: "0 auto 44px",
            }}
          >
            Refer automotive and nautical clients and earn a{" "}
            <strong style={{ color: C.silver, fontWeight: 700 }}>
              10% commission
            </strong>{" "}
            on every completed detailing service. Zero cost, full transparency,
            premium brand alignment.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "48px",
              marginBottom: "64px",
              flexWrap: "wrap",
            }}
          >
            {[
              { v: "10%", l: "Commission Per Service" },
              { v: "$0", l: "Onboarding Cost" },
              { v: "48h", l: "Payout Window" },
              { v: "140+", l: "Active Partners" },
            ].map(({ v, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "34px",
                    fontWeight: 900,
                    color: C.gold,
                    letterSpacing: "-0.03em",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: C.silverD,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: "4px",
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form card */}
      <div
        style={{ maxWidth: "580px", margin: "0 auto", padding: "0 24px 80px" }}
      >
        <div
          style={{
            background: C.navy800,
            border: `1px solid ${C.gold}22`,
            borderRadius: "16px",
            padding: "44px",
            boxShadow: `0 0 60px ${C.gold}0a`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "3px",
                height: "22px",
                background: `linear-gradient(${C.gold}, ${C.goldD})`,
                borderRadius: "2px",
              }}
            />
            <h2 style={{ fontSize: "19px", fontWeight: 800, color: C.white }}>
              Create Your Partner Account
            </h2>
          </div>
          <p
            style={{ fontSize: "13px", color: C.silverD, marginBottom: "32px" }}
          >
            Register your business — your unique QR referral kit will be
            generated instantly.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div>
                {label("Business Name")}
                <input
                  {...inp("businessName")}
                  value={form.businessName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, businessName: e.target.value }))
                  }
                  placeholder="Miami Luxury Motors"
                />
                {errors.businessName && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#f87171",
                      marginTop: "4px",
                    }}
                  >
                    {errors.businessName}
                  </p>
                )}
              </div>
              <div>
                {label("Contact Person")}
                <input
                  {...inp("contactName")}
                  value={form.contactName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contactName: e.target.value }))
                  }
                  placeholder="Carlos Rodríguez"
                />
                {errors.contactName && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#f87171",
                      marginTop: "4px",
                    }}
                  >
                    {errors.contactName}
                  </p>
                )}
              </div>
            </div>

            <div>
              {label("Business Email")}
              <input
                {...inp("email")}
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="contact@yourbusiness.com"
              />
              {errors.email && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#f87171",
                    marginTop: "4px",
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div>
                {label("Phone")}
                <input
                  {...inp("phone")}
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      phone: e.target.value.replace(/[^\d+\-\s()]/g, ""),
                    }))
                  }
                  placeholder="+1 (305) 000-0000"
                />
                {errors.phone && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#f87171",
                      marginTop: "4px",
                    }}
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                {label("Business Category")}
                <select
                  {...inp("category")}
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  style={{
                    ...inp("category").style,
                    color: form.category ? C.white : C.silverD,
                  }}
                >
                  <option value="" disabled style={{ background: C.navy800 }}>
                    Select category
                  </option>
                  {CATS.map((c) => (
                    <option
                      key={c.value}
                      value={c.value}
                      style={{ background: C.navy800 }}
                    >
                      {c.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#f87171",
                      marginTop: "4px",
                    }}
                  >
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div
              style={{
                marginTop: "4px",
                padding: "16px",
                background: `${C.gold}08`,
                border: `1px solid ${C.gold}28`,
                borderRadius: "8px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, terms: e.target.checked }))
                    }
                    style={{
                      opacity: 0,
                      position: "absolute",
                      inset: 0,
                      cursor: "pointer",
                    }}
                  />
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      border: form.terms
                        ? `2px solid ${C.gold}`
                        : `2px solid ${C.gold}44`,
                      background: form.terms ? C.gold : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {form.terms && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke={C.navy}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: C.silverD,
                    lineHeight: 1.65,
                  }}
                >
                  I agree to receive marketing text messages from Magic Hands. Message &amp; data rates may apply. Message frequency varies. Reply STOP to cancel or HELP for help.{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowTermsModal(true)
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: C.gold,
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      fontSize: "inherit",
                    }}
                  >
                    [Terms &amp; Conditions]
                  </button>
                  {" | "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowTermsModal(true)
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: C.gold,
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      fontSize: "inherit",
                    }}
                  >
                    [Privacy Policy]
                  </button>
                </span>
              </label>
              {errors.terms && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#f87171",
                    marginTop: "8px",
                  }}
                >
                  {errors.terms}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: "6px",
                padding: "15px",
                borderRadius: "8px",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: C.navy,
                background: submitting
                  ? `${C.gold}80`
                  : `linear-gradient(90deg, ${C.gold}, ${C.goldL})`,
                boxShadow: submitting ? "none" : `0 0 28px ${C.gold}44`,
                transition: "all 0.2s",
              }}
            >
              {submitting
                ? "Registering Your Business…"
                : "Register & Get My QR Kit →"}
            </button>
          </form>
        </div>
      </div>

      {/* Pop-up Modal: Terms & Conditions */}
      {showTermsModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(6, 14, 30, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowTermsModal(false)}
        >
          <div
            style={{
              background: C.navy800,
              border: `1px solid ${C.gold}44`,
              borderRadius: "16px",
              maxWidth: "650px",
              width: "100%",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: `0 0 50px ${C.gold}1a`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${C.gold}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: C.navy,
              }}
            >
              <h3 style={{ color: C.white, fontSize: "16px", fontWeight: 700, margin: 0 }}>
                General Terms and Conditions for Partners
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: C.silverD,
                  fontSize: "20px",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div
              style={{
                padding: "24px",
                overflowY: "auto",
                color: C.silverD,
                fontSize: "13px",
                lineHeight: 1.6,
                flexGrow: 1,
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ color: C.gold, marginTop: 0, fontSize: "15px", marginBottom: "6px" }}>1. Program Overview</h4>
                <p style={{ margin: 0 }}>
                  By registering as a Magic Hands B2B Partner, you agree to refer prospective clients for professional automotive and nautical detailing services.
                </p>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ color: C.gold, fontSize: "15px", marginBottom: "6px" }}>2. Commission Structure</h4>
                <p style={{ margin: 0 }}>
                  Partners earn a 10% commission on all completed services generated through their designated partner QR code or unique referral link. Commissions are calculated based on the net service value before taxes.
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ color: C.gold, fontSize: "15px", marginBottom: "6px" }}>3. Payout Terms</h4>
                <p style={{ margin: 0 }}>
                  Commission payouts are processed within 48 hours following the completion and full payment of the client’s detailing service.
                </p>
              </div>

              <div style={{ marginBottom: 0 }}>
                <h4 style={{ color: C.gold, fontSize: "15px", marginBottom: "8px" }}>4. SMS Communication Terms &amp; Conditions</h4>
                <p style={{ margin: "0 0 10px 0" }}>
                  <strong style={{ color: C.white }}>Consent &amp; Purpose:</strong> By registering as a Partner and providing your mobile phone number, you explicitly consent to receive recurring marketing, promotional, operational, and transactional SMS messages from Magic Hands, operated by MOTELSGROUP, LLC.
                </p>
                <p style={{ margin: "0 0 10px 0" }}>
                  <strong style={{ color: C.white }}>Rates &amp; Frequency:</strong> Message frequency varies based on account activity. Message and data rates may apply.
                </p>
                <p style={{ margin: "0 0 10px 0" }}>
                  <strong style={{ color: C.white }}>Opt-Out Policy:</strong> You may opt out at any time by replying STOP. Reply HELP for assistance or contact support.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: C.white }}>Privacy Guarantee:</strong> No mobile information will be shared, sold, or rented to third parties or affiliates for marketing or promotional purposes under any circumstances.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: `1px solid ${C.gold}22`,
                textAlign: "right",
                background: C.navy,
              }}
            >
              <button
                onClick={() => {
                  setForm((p) => ({ ...p, terms: true }))
                  setShowTermsModal(false)
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: "6px",
                  border: "none",
                  background: `linear-gradient(90deg, ${C.gold}, ${C.goldL})`,
                  color: C.navy,
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Accept &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Success / QR Kit Screen ──────────────────────────────────────────────────
function SuccessScreen({
  partner,
  onDashboard,
}: {
  partner: Partner
  onDashboard: () => void
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

// ─── Commission Dashboard ─────────────────────────────────────────────────────
function Dashboard({
  partner,
  allPartners,
  referrals,
}: {
  partner: Partner
  allPartners: Partner[]
  referrals: ClientReferral[]
}) {
  const [filter, setFilter] =
    useState<"All" | "Completed" | "Pending" | "Booked">("All")

  const myRefs = referrals.filter((r) => r.partnerId === partner.id)
  const completed = myRefs.filter((r) => r.status === "Completed")
  const earned = completed.reduce(
    (a, r) => a + (COMMISSION_BY_SERVICE[r.serviceInterest] || 100),
    0,
  )
  const pending = myRefs.filter((r) => r.status !== "Completed")
  const pendingAmt = pending.reduce(
    (a, r) => a + (COMMISSION_BY_SERVICE[r.serviceInterest] || 100),
    0,
  )

  const filtered =
    filter === "All" ? myRefs : myRefs.filter((r) => r.status === filter)

  const STATUS_COLOR: Record<string, string> = {
    Completed: C.gold,
    Booked: C.blue,
    Contacted: "#a78bfa",
    Pending: C.silverD,
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.navy,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <nav
        style={{
          borderBottom: `1px solid ${C.gold}22`,
          padding: "0 40px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: `${C.navy}f0`,
          backdropFilter: "blur(14px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Logo />
          <span style={{ color: `${C.gold}44` }}>|</span>
          <span style={{ fontSize: "12px", color: C.silverD, fontWeight: 500 }}>
            Partner Dashboard
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: C.white }}>
              {partner.businessName}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: C.silverD,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {partner.id}
            </div>
          </div>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: `${C.gold}18`,
              border: `1px solid ${C.gold}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 800, color: C.gold }}>
              {partner.businessName[0].toUpperCase()}
            </span>
          </div>
        </div>
      </nav>

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "44px 40px" }}
      >
        <div style={{ marginBottom: "36px" }}>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 900,
              color: C.white,
              letterSpacing: "-0.02em",
              marginBottom: "5px",
            }}
          >
            Commission Overview
          </h1>
          <p style={{ fontSize: "13px", color: C.silverD }}>
            {new Date().toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}{" "}
            · Real-time referral tracking
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "18px",
            marginBottom: "40px",
          }}
        >
          {[
            {
              l: "Clients Referred",
              v: myRefs.length.toString(),
              sub: "All time",
              accent: false,
            },
            {
              l: "Services Completed",
              v: completed.length.toString(),
              sub: `${pending.length} in pipeline`,
              accent: false,
            },
            {
              l: "Total Commission Earned",
              v: `$${earned.toFixed(0)}`,
              sub: `+$${pendingAmt} pending`,
              accent: true,
            },
          ].map(({ l, v, sub, accent }) => (
            <div
              key={l}
              style={{
                padding: "28px 30px",
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden",
                background: accent
                  ? `linear-gradient(135deg, ${C.gold}12, ${C.goldD}06)`
                  : `${C.navy800}`,
                border: accent
                  ? `1px solid ${C.gold}44`
                  : `1px solid ${C.gold}18`,
              }}
            >
              {accent && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "120px",
                    height: "120px",
                    background: `radial-gradient(circle, ${C.gold}14 0%, transparent 70%)`,
                    transform: "translate(40%,-40%)",
                  }}
                />
              )}
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  color: C.silverD,
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                {l}
              </div>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: accent ? C.gold : C.white,
                  marginBottom: "6px",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {v}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: accent ? `${C.gold}80` : C.silverD,
                }}
              >
                {sub}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: C.navy800,
            border: `1px solid ${C.gold}18`,
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "22px 30px",
              borderBottom: `1px solid ${C.gold}14`,
            }}
          >
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: C.white }}>
              Referral History
            </h2>
            <div
              style={{
                display: "flex",
                gap: "4px",
                background: `${C.navy700}`,
                padding: "4px",
                borderRadius: "8px",
              }}
            >
              {(["All", "Completed", "Booked", "Pending"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    fontFamily: "Montserrat, sans-serif",
                    background: filter === f ? `${C.gold}22` : "transparent",
                    color: filter === f ? C.gold : C.silverD,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 1fr 110px 100px",
              padding: "10px 30px",
              borderBottom: `1px solid ${C.gold}0e`,
            }}
          >
            {["Date", "Client Name", "Service", "Status", "Commission"].map(
              (col) => (
                <div
                  key={col}
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: C.silverD,
                    textTransform: "uppercase",
                  }}
                >
                  {col}
                </div>
              ),
            )}
          </div>

          {filtered.length === 0 && (
            <div
              style={{
                padding: "48px",
                textAlign: "center",
                color: C.silverD,
                fontSize: "14px",
              }}
            >
              No referrals yet. Share your QR code to start earning!
            </div>
          )}

          {filtered.map((ref, i) => {
            const commission = COMMISSION_BY_SERVICE[ref.serviceInterest] || 100
            const isPaid = ref.status === "Completed"
            return (
              <div
                key={ref.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr 1fr 110px 100px",
                  padding: "16px 30px",
                  borderBottom:
                    i < filtered.length - 1 ? `1px solid ${C.gold}08` : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = `${C.gold}06`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: C.silverD,
                    fontFamily: "JetBrains Mono, monospace",
                    alignSelf: "center",
                  }}
                >
                  {new Date(ref.registeredAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: C.white,
                    fontWeight: 600,
                    alignSelf: "center",
                  }}
                >
                  {ref.clientName}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: C.silver,
                    alignSelf: "center",
                    paddingRight: "12px",
                  }}
                >
                  {ref.serviceInterest}
                </div>
                <div style={{ alignSelf: "center" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "3px 10px",
                      borderRadius: "100px",
                      fontSize: "10px",
                      fontWeight: 700,
                      background: `${STATUS_COLOR[ref.status]}18`,
                      color: STATUS_COLOR[ref.status],
                      border: `1px solid ${STATUS_COLOR[ref.status]}33`,
                    }}
                  >
                    <div
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: STATUS_COLOR[ref.status],
                      }}
                    />
                    {ref.status}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    alignSelf: "center",
                    color: isPaid ? C.gold : `${C.gold}55`,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  ${commission}
                </div>
              </div>
            )
          })}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 30px",
              borderTop: `1px solid ${C.gold}14`,
              background: `${C.gold}05`,
            }}
          >
            <span style={{ fontSize: "12px", color: C.silverD }}>
              {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
            </span>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: C.silverD,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                Shown Total
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: C.gold,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                $
                {filtered
                  .reduce(
                    (a, r) =>
                      a + (COMMISSION_BY_SERVICE[r.serviceInterest] || 100),
                    0,
                  )
                  .toFixed(0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
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
    <div style={{ minHeight: "100vh", background: C.navy }}>
      {(screen === "landing" || screen === "client") && (
        <Nav screen={screen} onNavigate={setScreen} />
      )}

      {screen === "landing" && <LandingPage onSuccess={handlePartnerSuccess} />}
      {screen === "success" && currentPartner && (
        <SuccessScreen
          partner={currentPartner}
          onDashboard={() => setScreen("dashboard")}
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
    <footer class="site-footer">
    <div class="footer-content">
        <p>© 2026 Magic Hands Detailing Specialists. A service operated by MOTELSGROUP, LLC.</p>
    </div>
</footer>

<style>
    .site-footer {
        background-color: #111111;
        color: #ffffff;
        text-align: center;
        padding: 20px 0;
        font-family: inherit;
        font-size: 14px;
        border-top: 1px solid #222222;
    }
    
    .site-footer p {
        margin: 0;
        letter-spacing: 0.5px;
    }
</style>

  )
}
