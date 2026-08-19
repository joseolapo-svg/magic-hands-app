import { useState, useRef } from 'react'
import logoImg from './imports/LOGO_DETAILING_SPECIALIST.png'

// ─── Color tokens ───────────────────────────────────────────────────────────
const C = {
  navy:     '#060e1e',
  navy800:  '#0c1a30',
  navy700:  '#112040',
  navy600:  '#172a52',
  gold:     '#C9A84C',
  goldL:    '#E2C47A',
  goldD:    '#9A7A32',
  blue:     '#1E6FD9',
  blueD:    '#1559B0',
  silver:   '#D8E2EE',
  silverD:  '#8899AA',
  white:    '#FFFFFF',
}

// ─── Types ──────────────────────────────────────────────────────────────────
type Screen = 'landing' | 'success' | 'dashboard' | 'client'

interface Partner {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string
  category: string
  joinedAt: string
}

interface ClientReferral {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  vehicleType: string
  serviceInterest: string
  partnerId: string
  partnerName: string
  registeredAt: string
  status: 'Pending' | 'Contacted' | 'Booked' | 'Completed'
}

// ─── Seed data ───────────────────────────────────────────────────────────────
const SEED_PARTNERS: Partner[] = [
  { id: 'MH-MIAMIL-26', businessName: 'Miami Luxury Motors', contactName: 'Carlos Rodríguez', email: 'carlos@miamiluxurymotors.com', phone: '+1 (305) 444-1122', category: 'luxury_dealer', joinedAt: '2026-06-12' },
  { id: 'MH-BAYMAR-26', businessName: 'Bayliner Marine Miami', contactName: 'Elena Fuentes', email: 'elena@baylinermarine.com', phone: '+1 (305) 555-9900', category: 'marina', joinedAt: '2026-05-03' },
  { id: 'MH-SUNRIS-26', businessName: 'Sunrise Auto Workshop', contactName: 'Jorge Mendoza', email: 'jorge@sunriseauto.com', phone: '+1 (786) 300-7812', category: 'auto_workshop', joinedAt: '2026-07-20' },
]

const SEED_REFERRALS: ClientReferral[] = [
  { id: 'REF-001', clientName: 'Carlos Menéndez', clientEmail: 'c.menendez@gmail.com', clientPhone: '+1 305 712 4490', vehicleType: '65ft Yacht', serviceInterest: 'Full Detail', partnerId: 'MH-BAYMAR-26', partnerName: 'Bayliner Marine Miami', registeredAt: '2026-08-05', status: 'Completed' },
  { id: 'REF-002', clientName: 'Sofia Restrepo', clientEmail: 's.restrepo@gmail.com', clientPhone: '+1 305 890 3312', vehicleType: 'Ferrari 488', serviceInterest: 'Ceramic Coating', partnerId: 'MH-MIAMIL-26', partnerName: 'Miami Luxury Motors', registeredAt: '2026-08-04', status: 'Completed' },
  { id: 'REF-003', clientName: 'James Whitmore', clientEmail: 'jwhitmore@me.com', clientPhone: '+1 786 220 6600', vehicleType: 'Bentley Bentayga', serviceInterest: 'Interior Restoration', partnerId: 'MH-MIAMIL-26', partnerName: 'Miami Luxury Motors', registeredAt: '2026-08-03', status: 'Booked' },
  { id: 'REF-004', clientName: 'Andrea Vásquez', clientEmail: 'avasquez@outlook.com', clientPhone: '+1 305 441 8823', vehicleType: 'Lamborghini Huracán', serviceInterest: 'Paint Correction', partnerId: 'MH-SUNRIS-26', partnerName: 'Sunrise Auto Workshop', registeredAt: '2026-08-02', status: 'Completed' },
  { id: 'REF-005', clientName: 'Elena Ruiz', clientEmail: 'elenita.r@gmail.com', clientPhone: '+1 786 550 4100', vehicleType: '40ft Sea Ray', serviceInterest: 'Nano Coating', partnerId: 'MH-BAYMAR-26', partnerName: 'Bayliner Marine Miami', registeredAt: '2026-07-30', status: 'Pending' },
]

const COMMISSION_BY_SERVICE: Record<string, number> = {
  // Magic Hands
  'Headlight Restoration': 65,
  'Bugs Off': 40,
  'Engine Cleaning': 98,
  'Rim Polish': 70,
  'Ozone Treatment': 90,
  'Shampoo': 60,
  'Pet Hair Removal': 55,
  'Magic Wash': 35,
  'Leather Conditioners': 80,
  'Mini Detailing': 110,
  'Steam Clean': 95,
  'Buffing': 130,
  'Full Detail': 135,
  'Hand Wax': 75,
  // Ceramic Pro
  'Paint Correction': 275,
  'Ceramic Coating': 320,
  'PPF Installation and Removal': 450,
  'Window Tint Installation and Removal': 180,
  'Leather Ceramic': 210,
  'Wheels Ceramic Coating': 160,
  // Yacht / Boat
  'Basic Exterior Detailing': 220,
  'Basic Exterior Detailing & Detailing of Hatches': 280,
  'Interior Detailing Only': 240,
  'Basic Exterior Detailing + Hatches + Cabin': 360,
  'Exterior Detailing + Hand Wax': 320,
  'Exterior Detailing + Hand Wax + Cabin Detailing': 420,
  'Deep Detailing': 480,
  'Buffing / Polish': 400,
}

const CAR_SERVICE_CATEGORIES: { label: string; services: string[] }[] = [
  {
    label: 'Magic Hands',
    services: [
      'Headlight Restoration', 'Bugs Off', 'Engine Cleaning', 'Rim Polish',
      'Ozone Treatment', 'Shampoo', 'Pet Hair Removal', 'Magic Wash',
      'Leather Conditioners', 'Mini Detailing', 'Steam Clean', 'Buffing',
      'Full Detail', 'Hand Wax',
    ],
  },
  {
    label: 'Ceramic Pro',
    services: [
      'Paint Correction', 'Ceramic Coating', 'PPF Installation and Removal',
      'Window Tint Installation and Removal', 'Leather Ceramic', 'Wheels Ceramic Coating',
    ],
  },
]

const BOAT_SERVICE_CATEGORIES: { label: string; services: string[] }[] = [
  {
    label: 'Yacht / Boat Detailing',
    services: [
      'Basic Exterior Detailing',
      'Basic Exterior Detailing & Detailing of Hatches',
      'Interior Detailing Only',
      'Basic Exterior Detailing + Hatches + Cabin',
      'Exterior Detailing + Hand Wax',
      'Exterior Detailing + Hand Wax + Cabin Detailing',
      'Deep Detailing',
      'Buffing / Polish',
      'Ceramic Coating',
    ],
  },
]

const CATEGORY_LABELS: Record<string, string> = {
  auto_workshop: 'Auto Workshop / Body Shop',
  marina: 'Marina / Boat Dealer',
  auto_parts: 'Auto Parts & Accessories',
  luxury_dealer: 'Luxury Vehicle Dealership',
  detailing_shop: 'Detailing Shop / Spa',
}

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo({ size = 40 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img
        src={logoImg}
        alt="MH Detailing Specialists"
        style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ fontWeight: 900, fontSize: '13px', letterSpacing: '0.08em', color: C.white, textTransform: 'uppercase' }}>
          Magic Hands
        </span>
        <span style={{ fontWeight: 600, fontSize: '10px', letterSpacing: '0.12em', color: C.gold, textTransform: 'uppercase' }}>
          Detailing Specialists
        </span>
      </div>
    </div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ screen, onNavigate }: { screen: Screen; onNavigate: (s: Screen) => void }) {
  return (
    <nav className="app-nav" style={{
      borderBottom: `1px solid ${C.gold}22`,
      paddingTop: 'max(55px, env(safe-area-inset-top, 0px))',
      paddingRight: 'max(19px, env(safe-area-inset-right, 0px))',
      paddingBottom: 0,
      paddingLeft: 'max(20px, env(safe-area-inset-left, 0px))',
      minHeight: '64px', height: 'auto',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50,
      background: `${C.navy}f0`, backdropFilter: 'blur(14px)',
    }}>
      <Logo />
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { label: 'Partnership', s: 'landing' as Screen },
          { label: 'Client Referral', s: 'client' as Screen },
        ].map(({ label, s }) => (
          <button key={s} onClick={() => onNavigate(s)} style={{
            padding: '7px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
            fontFamily: 'Montserrat, sans-serif',
            background: screen === s ? `${C.gold}22` : 'transparent',
            color: screen === s ? C.gold : C.silverD,
            borderBottom: screen === s ? `2px solid ${C.gold}` : '2px solid transparent',
            transition: 'all 0.15s',
          }}>
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}

// ─── QR SVG (21×21 static pattern) ──────────────────────────────────────────
const QR_PATTERN = [
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
  [1,1,0,1,1,0,1,1,0,1,0,0,1,1,0,1,1,0,1,1,0],
  [0,1,1,0,0,1,0,0,1,0,1,1,0,0,1,0,0,1,1,0,1],
  [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,0],
  [0,1,0,1,1,0,0,1,0,1,1,0,0,1,0,1,1,0,1,0,1],
  [1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,0,1,1,0,1,1],
  [0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
  [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,1,0,1,0,0],
  [1,0,0,0,0,0,1,0,1,1,0,1,1,0,0,1,1,0,0,1,0],
  [1,0,1,1,1,0,1,0,0,0,1,0,0,1,1,0,0,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,1,0],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,0,1,0,1,0,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,1,1,1,0,0,0],
  [1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1],
]

function QRSvg({ fill = '#060e1e', size = 168 }: { fill?: string; size?: number }) {
  const cells: React.ReactElement[] = []
  const n = 21, cell = size / n
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (QR_PATTERN[r]?.[c]) {
        cells.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell - 1} height={cell - 1} rx={0.8} />)
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g fill={fill}>{cells}</g>
    </svg>
  )
}

// ─── Partner Landing / Registration ──────────────────────────────────────────
function LandingPage({ onSuccess }: { onSuccess: (p: Partner) => void }) {
  const [form, setForm] = useState({ businessName: '', contactName: '', email: '', phone: '', category: '', terms: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.businessName.trim()) e.businessName = 'Required'
    if (!form.contactName.trim()) e.contactName = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.category) e.category = 'Select a category'
    if (!form.terms) e.terms = 'Must accept terms'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    setTimeout(() => {
      const slug = form.businessName.replace(/\s+/g, '').toUpperCase().slice(0, 6)
      const partner: Partner = {
        id: `MH-${slug}-26`,
        businessName: form.businessName,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone,
        category: form.category,
        joinedAt: new Date().toISOString().slice(0, 10),
      }
      onSuccess(partner)
    }, 1400)
  }

  const inp = (k: string) => ({
    style: {
      width: '100%', background: `${C.navy700}`, border: `1px solid ${errors[k] ? '#ef4444' : C.gold + '28'}`,
      borderRadius: '7px', padding: '11px 14px', color: C.white, fontSize: '13px',
      fontFamily: 'Montserrat, sans-serif', fontWeight: 500, outline: 'none',
    } as React.CSSProperties,
  })

  const CATS = [
    { value: 'auto_workshop', label: 'Auto Workshop / Body Shop' },
    { value: 'marina', label: 'Marina / Boat Dealer' },
    { value: 'auto_parts', label: 'Auto Parts & Accessories' },
    { value: 'luxury_dealer', label: 'Luxury Vehicle Dealership' },
    { value: 'detailing_shop', label: 'Detailing Shop / Spa' },
  ]

  const label = (text: string) => (
    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.silverD, textTransform: 'uppercase', marginBottom: '7px' }}>{text}</div>
  )

  return (
    <div style={{ minHeight: '100vh', background: C.navy, fontFamily: 'Montserrat, sans-serif' }}>
      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '80px 40px 60px', textAlign: 'center' }}>
        {/* Radial golds */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${C.gold}14 0%, transparent 70%)` }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
          backgroundImage: `linear-gradient(${C.gold}ff 1px, transparent 1px), linear-gradient(90deg, ${C.gold}ff 1px, transparent 1px)`,
          backgroundSize: '56px 56px' }} />

        <div style={{ position: 'relative', maxWidth: '780px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: `1px solid ${C.gold}44`, borderRadius: '100px',
            padding: '5px 16px', marginBottom: '28px',
            background: `${C.gold}10`,
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.gold, boxShadow: `0 0 8px ${C.gold}` }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', color: C.gold, textTransform: 'uppercase' }}>
              Exclusive B2B Partner Program · Miami
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(30px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.07,
            letterSpacing: '-0.025em', marginBottom: '20px', color: C.white,
          }}>
            Expand Your Business Revenue:{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.goldL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Join the Magic Hands Partner Program
            </span>
          </h1>

          <p style={{ fontSize: '16px', color: C.silverD, lineHeight: 1.75, marginBottom: '44px', maxWidth: '560px', margin: '0 auto 44px' }}>
            Refer automotive and nautical clients and earn a{' '}
            <strong style={{ color: C.silver, fontWeight: 700 }}>10% commission</strong> on every
            completed detailing service. Zero cost, full transparency, premium brand alignment.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginBottom: '64px', flexWrap: 'wrap' }}>
            {[
              { v: '10%', l: 'Commission Per Service' },
              { v: '$0', l: 'Onboarding Cost' },
              { v: '48h', l: 'Payout Window' },
              { v: '140+', l: 'Active Partners' },
            ].map(({ v, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '34px', fontWeight: 900, color: C.gold, letterSpacing: '-0.03em', fontFamily: 'JetBrains Mono, monospace' }}>{v}</div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: C.silverD, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form card */}
      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: C.navy800, border: `1px solid ${C.gold}22`,
          borderRadius: '16px', padding: '44px',
          boxShadow: `0 0 60px ${C.gold}0a`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '22px', background: `linear-gradient(${C.gold}, ${C.goldD})`, borderRadius: '2px' }} />
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: C.white }}>Create Your Partner Account</h2>
          </div>
          <p style={{ fontSize: '13px', color: C.silverD, marginBottom: '32px' }}>
            Register your business — your unique QR referral kit will be generated instantly.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                {label('Business Name')}
                <input {...inp('businessName')} value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} placeholder="Miami Luxury Motors" />
                {errors.businessName && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.businessName}</p>}
              </div>
              <div>
                {label('Contact Person')}
                <input {...inp('contactName')} value={form.contactName} onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))} placeholder="Carlos Rodríguez" />
                {errors.contactName && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.contactName}</p>}
              </div>
            </div>

            <div>
              {label('Business Email')}
              <input {...inp('email')} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="contact@yourbusiness.com" />
              {errors.email && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                {label('Phone')}
                <input {...inp('phone')} type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (305) 000-0000" />
                {errors.phone && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.phone}</p>}
              </div>
              <div>
                {label('Business Category')}
                <select {...inp('category')} value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{ ...inp('category').style, color: form.category ? C.white : C.silverD }}>
                  <option value="" disabled style={{ background: C.navy800 }}>Select category</option>
                  {CATS.map(c => <option key={c.value} value={c.value} style={{ background: C.navy800 }}>{c.label}</option>)}
                </select>
                {errors.category && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.category}</p>}
              </div>
            </div>

            {/* Terms */}
            <div style={{
              marginTop: '4px', padding: '16px',
              background: `${C.gold}08`, border: `1px solid ${C.gold}28`, borderRadius: '8px',
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <div style={{ position: 'relative', flexShrink: 0, marginTop: '2px' }}>
                  <input type="checkbox" checked={form.terms} onChange={e => setForm(p => ({ ...p, terms: e.target.checked }))}
                    style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }} />
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '4px',
                    border: form.terms ? `2px solid ${C.gold}` : `2px solid ${C.gold}44`,
                    background: form.terms ? C.gold : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    {form.terms && <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>}
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: C.silverD, lineHeight: 1.65 }}>
                  I accept the <span style={{ color: C.gold, cursor: 'pointer' }}>Terms & Conditions</span>.
                  I understand that the 10% commission is released exclusively upon completion and full payment of the referred service.
                </span>
              </label>
              {errors.terms && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '8px' }}>{errors.terms}</p>}
            </div>

            <button type="submit" disabled={submitting} style={{
              marginTop: '6px', padding: '15px', borderRadius: '8px', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C.navy,
              background: submitting ? `${C.gold}80` : `linear-gradient(90deg, ${C.gold}, ${C.goldL})`,
              boxShadow: submitting ? 'none' : `0 0 28px ${C.gold}44`,
              transition: 'all 0.2s',
            }}>
              {submitting ? 'Registering Your Business…' : 'Register & Get My QR Kit →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Success / QR Kit Screen ──────────────────────────────────────────────────
function SuccessScreen({ partner, onDashboard }: { partner: Partner; onDashboard: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [downloaded, setDownloaded] = useState(false)

  const downloadQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = 480, H = 580
    canvas.width = W; canvas.height = H

    // Dark background
    ctx.fillStyle = '#060e1e'
    ctx.fillRect(0, 0, W, H)

    // Gold border
    ctx.strokeStyle = C.gold
    ctx.lineWidth = 3
    ctx.strokeRect(4, 4, W - 8, H - 8)

    // Header strip
    ctx.fillStyle = '#0c1a30'
    ctx.fillRect(4, 4, W - 8, 90)

    // Load & draw logo, then rest of canvas
    const logoEl = new Image()
    logoEl.onload = () => {
      ctx.drawImage(logoEl, 20, 14, 64, 64)

      // Brand text next to logo
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 18px Montserrat, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('MAGIC HANDS', 96, 42)
      ctx.fillStyle = C.gold
      ctx.font = '600 11px Montserrat, sans-serif'
      ctx.fillText('DETAILING SPECIALISTS · MIAMI', 96, 62)

      // Partner ID badge top-right
      ctx.fillStyle = `${C.gold}22`
      ctx.beginPath()
      ctx.roundRect(W - 160, 26, 144, 36, 6)
      ctx.fill()
      ctx.fillStyle = C.gold
      ctx.font = 'bold 11px JetBrains Mono, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(partner.id, W - 88, 48)

      // QR area white background
      const qrPad = 20, qrSize = W - 80, qrTop = 110
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.roundRect(40, qrTop, qrSize, qrSize, 10)
      ctx.fill()

      // QR cells
      const n = 21, cell = (qrSize - qrPad * 2) / n
      ctx.fillStyle = '#060e1e'
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          if (QR_PATTERN[r]?.[c]) {
            ctx.beginPath()
            ctx.roundRect(40 + qrPad + c * cell, qrTop + qrPad + r * cell, cell - 1.5, cell - 1.5, 1)
            ctx.fill()
          }
        }
      }

      // Bottom text
      const textTop = qrTop + qrSize + 24
      ctx.fillStyle = C.white
      ctx.font = 'bold 13px Montserrat, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Scan to book — your referral is automatic', W / 2, textTop)
      ctx.fillStyle = C.silverD
      ctx.font = '11px Montserrat, sans-serif'
      ctx.fillText('magichandsmiami.com · Partner Referral Program', W / 2, textTop + 22)

      // Gold divider line
      ctx.strokeStyle = `${C.gold}55`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(40, textTop - 14); ctx.lineTo(W - 40, textTop - 14)
      ctx.stroke()

      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url; a.download = `${partner.id}-qr-kit.png`; a.click()
      setDownloaded(true)
    }
    logoEl.src = logoImg
  }

  return (
    <div style={{ minHeight: '100vh', background: C.navy, fontFamily: 'Montserrat, sans-serif' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <nav style={{
        borderBottom: `1px solid ${C.gold}22`, padding: '0 40px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${C.navy}f0`, backdropFilter: 'blur(14px)',
      }}>
        <Logo />
        <button onClick={onDashboard} style={{
          padding: '8px 20px', borderRadius: '6px', border: `1px solid ${C.gold}55`,
          background: 'transparent', color: C.gold, fontSize: '12px', fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
        }}>
          Go to Dashboard →
        </button>
      </nav>

      <div style={{ maxWidth: '740px', margin: '0 auto', padding: '60px 24px 80px', textAlign: 'center' }}>
        {/* Badge */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 28px',
          background: `${C.gold}14`, border: `2px solid ${C.gold}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 40px ${C.gold}22`,
        }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M5 15L11 21L25 7" stroke={C.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-0.025em', marginBottom: '12px', color: C.white }}>
          Welcome, <span style={{ color: C.gold }}>{partner.businessName}</span>!
        </h1>
        <p style={{ fontSize: '15px', color: C.silverD, marginBottom: '52px', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto 52px' }}>
          Your partner account is now active. Print the QR code below and display it at your counter —
          when clients scan it they will be automatically linked to your business in our system.
        </p>

        {/* QR Kit card */}
        <div style={{
          background: C.navy800, border: `1px solid ${C.gold}28`, borderRadius: '20px',
          padding: '48px', marginBottom: '28px',
          boxShadow: `0 0 60px ${C.gold}0a`,
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto', gap: '48px', alignItems: 'center',
            textAlign: 'left',
          }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px',
                borderRadius: '100px', background: `${C.gold}10`, border: `1px solid ${C.gold}33`, marginBottom: '20px',
              }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: C.gold, textTransform: 'uppercase' }}>Your Partner QR Kit</span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 800, color: C.white, marginBottom: '20px', lineHeight: 1.25 }}>
                Place This QR at Your Counter
              </h3>

              {[
                'Client scans the QR code at your location',
                'They land on the Magic Hands booking page',
                'Your business is pre-selected as referral',
                '10% commission released after service payment',
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    background: `${C.gold}18`, border: `1px solid ${C.gold}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: C.gold, fontFamily: 'JetBrains Mono, monospace' }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: C.silver, lineHeight: 1.55 }}>{s}</span>
                </div>
              ))}

              <button onClick={downloadQR} style={{
                marginTop: '20px', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: downloaded ? C.gold : C.navy,
                background: downloaded ? `${C.gold}18` : `linear-gradient(90deg, ${C.gold}, ${C.goldL})`,
                border: downloaded ? `1px solid ${C.gold}55` : 'none',
                boxShadow: downloaded ? 'none' : `0 0 20px ${C.gold}44`,
              }}>
                {downloaded ? '✓ Downloaded!' : '↓ Download QR Kit (PNG)'}
              </button>
            </div>

            {/* QR visual */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: C.white, padding: '18px', borderRadius: '12px',
                boxShadow: `0 0 40px ${C.gold}33`, border: `2px solid ${C.gold}44`,
              }}>
                <QRSvg fill={C.navy} size={160} />
              </div>
              <span style={{ fontSize: '10px', color: C.gold, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>
                {partner.id}
              </span>
            </div>
          </div>
        </div>

        {/* Partner info tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { l: 'Partner ID', v: partner.id, mono: true },
            { l: 'Commission Rate', v: '10% per service', mono: false },
            { l: 'Category', v: CATEGORY_LABELS[partner.category] || partner.category, mono: false },
          ].map(({ l, v, mono }) => (
            <div key={l} style={{
              padding: '20px', borderRadius: '10px',
              background: `${C.gold}06`, border: `1px solid ${C.gold}18`, textAlign: 'left',
            }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.silverD, textTransform: 'uppercase', marginBottom: '8px' }}>{l}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: C.silver, fontFamily: mono ? 'JetBrains Mono, monospace' : 'Montserrat, sans-serif' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Commission Dashboard ─────────────────────────────────────────────────────
function Dashboard({ partner, allPartners, referrals }: { partner: Partner; allPartners: Partner[]; referrals: ClientReferral[] }) {
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending' | 'Booked'>('All')

  const myRefs = referrals.filter(r => r.partnerId === partner.id)
  const completed = myRefs.filter(r => r.status === 'Completed')
  const earned = completed.reduce((a, r) => a + (COMMISSION_BY_SERVICE[r.serviceInterest] || 100), 0)
  const pending = myRefs.filter(r => r.status !== 'Completed')
  const pendingAmt = pending.reduce((a, r) => a + (COMMISSION_BY_SERVICE[r.serviceInterest] || 100), 0)

  const filtered = filter === 'All' ? myRefs : myRefs.filter(r => r.status === filter)

  const STATUS_COLOR: Record<string, string> = {
    Completed: C.gold, Booked: C.blue, Contacted: '#a78bfa', Pending: C.silverD,
  }

  return (
    <div style={{ minHeight: '100vh', background: C.navy, fontFamily: 'Montserrat, sans-serif' }}>
      <nav style={{
        borderBottom: `1px solid ${C.gold}22`, padding: '0 40px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        background: `${C.navy}f0`, backdropFilter: 'blur(14px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Logo />
          <span style={{ color: `${C.gold}44` }}>|</span>
          <span style={{ fontSize: '12px', color: C.silverD, fontWeight: 500 }}>Partner Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: C.white }}>{partner.businessName}</div>
            <div style={{ fontSize: '10px', color: C.silverD, fontFamily: 'JetBrains Mono, monospace' }}>{partner.id}</div>
          </div>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: `${C.gold}18`, border: `1px solid ${C.gold}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: C.gold }}>{partner.businessName[0].toUpperCase()}</span>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '44px 40px' }}>
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: C.white, letterSpacing: '-0.02em', marginBottom: '5px' }}>
            Commission Overview
          </h1>
          <p style={{ fontSize: '13px', color: C.silverD }}>
            {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })} · Real-time referral tracking
          </p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '40px' }}>
          {[
            { l: 'Clients Referred', v: myRefs.length.toString(), sub: 'All time', accent: false },
            { l: 'Services Completed', v: completed.length.toString(), sub: `${pending.length} in pipeline`, accent: false },
            { l: 'Total Commission Earned', v: `$${earned.toFixed(0)}`, sub: `+$${pendingAmt} pending`, accent: true },
          ].map(({ l, v, sub, accent }) => (
            <div key={l} style={{
              padding: '28px 30px', borderRadius: '12px', position: 'relative', overflow: 'hidden',
              background: accent ? `linear-gradient(135deg, ${C.gold}12, ${C.goldD}06)` : `${C.navy800}`,
              border: accent ? `1px solid ${C.gold}44` : `1px solid ${C.gold}18`,
            }}>
              {accent && <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
                background: `radial-gradient(circle, ${C.gold}14 0%, transparent 70%)`, transform: 'translate(40%,-40%)' }} />}
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.13em', color: C.silverD, textTransform: 'uppercase', marginBottom: '12px' }}>{l}</div>
              <div style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.03em', color: accent ? C.gold : C.white, marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{v}</div>
              <div style={{ fontSize: '12px', color: accent ? `${C.gold}80` : C.silverD }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: C.navy800, border: `1px solid ${C.gold}18`, borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '22px 30px', borderBottom: `1px solid ${C.gold}14`,
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: C.white }}>Referral History</h2>
            <div style={{ display: 'flex', gap: '4px', background: `${C.navy700}`, padding: '4px', borderRadius: '8px' }}>
              {(['All', 'Completed', 'Booked', 'Pending'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '5px 14px', borderRadius: '5px', border: 'none', cursor: 'pointer',
                  fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', fontFamily: 'Montserrat, sans-serif',
                  background: filter === f ? `${C.gold}22` : 'transparent',
                  color: filter === f ? C.gold : C.silverD,
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Col headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 110px 100px', padding: '10px 30px', borderBottom: `1px solid ${C.gold}0e` }}>
            {['Date', 'Client Name', 'Service', 'Status', 'Commission'].map(col => (
              <div key={col} style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.silverD, textTransform: 'uppercase' }}>{col}</div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: C.silverD, fontSize: '14px' }}>
              No referrals yet. Share your QR code to start earning!
            </div>
          )}

          {filtered.map((ref, i) => {
            const commission = COMMISSION_BY_SERVICE[ref.serviceInterest] || 100
            const isPaid = ref.status === 'Completed'
            return (
              <div key={ref.id} style={{
                display: 'grid', gridTemplateColumns: '100px 1fr 1fr 110px 100px',
                padding: '16px 30px', borderBottom: i < filtered.length - 1 ? `1px solid ${C.gold}08` : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = `${C.gold}06`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ fontSize: '11px', color: C.silverD, fontFamily: 'JetBrains Mono, monospace', alignSelf: 'center' }}>
                  {new Date(ref.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div style={{ fontSize: '13px', color: C.white, fontWeight: 600, alignSelf: 'center' }}>{ref.clientName}</div>
                <div style={{ fontSize: '12px', color: C.silver, alignSelf: 'center', paddingRight: '12px' }}>{ref.serviceInterest}</div>
                <div style={{ alignSelf: 'center' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '100px',
                    fontSize: '10px', fontWeight: 700,
                    background: `${STATUS_COLOR[ref.status]}18`, color: STATUS_COLOR[ref.status],
                    border: `1px solid ${STATUS_COLOR[ref.status]}33`,
                  }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: STATUS_COLOR[ref.status] }} />
                    {ref.status}
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, alignSelf: 'center', color: isPaid ? C.gold : `${C.gold}55`, fontFamily: 'JetBrains Mono, monospace' }}>
                  ${commission}
                </div>
              </div>
            )
          })}

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 30px', borderTop: `1px solid ${C.gold}14`,
            background: `${C.gold}05`,
          }}>
            <span style={{ fontSize: '12px', color: C.silverD }}>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: C.silverD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>Shown Total</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: C.gold, fontFamily: 'JetBrains Mono, monospace' }}>
                ${filtered.reduce((a, r) => a + (COMMISSION_BY_SERVICE[r.serviceInterest] || 100), 0).toFixed(0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Client Referral Page ─────────────────────────────────────────────────────
// ─── Car makes & models data ─────────────────────────────────────────────────
const CAR_MAKES: Record<string, string[]> = {
  'Acura': ['ILX', 'MDX', 'RDX', 'TLX', 'NSX'],
  'Aston Martin': ['DB11', 'DBS', 'DBX', 'Vantage', 'Valkyrie'],
  'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'RS6', 'RS7', 'R8', 'e-tron GT'],
  'Bentley': ['Bentayga', 'Continental GT', 'Flying Spur', 'Mulsanne'],
  'BMW': ['2 Series', '3 Series', '4 Series', '5 Series', '7 Series', '8 Series', 'M2', 'M3', 'M4', 'M5', 'M8', 'X3', 'X5', 'X6', 'X7', 'i4', 'iX'],
  'Bugatti': ['Chiron', 'Veyron', 'Divo'],
  'Cadillac': ['CT4', 'CT5', 'Escalade', 'Lyriq'],
  'Chevrolet': ['Camaro', 'Corvette', 'Silverado', 'Suburban', 'Tahoe'],
  'Dodge': ['Challenger', 'Charger', 'Durango', 'Viper'],
  'Ferrari': ['296 GTB', '488', '812', 'F8', 'LaFerrari', 'Portofino', 'Roma', 'SF90'],
  'Ford': ['Bronco', 'F-150', 'GT', 'Mustang', 'Raptor'],
  'Genesis': ['G70', 'G80', 'G90', 'GV70', 'GV80'],
  'Honda': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Ridgeline'],
  'Jaguar': ['E-PACE', 'F-PACE', 'F-TYPE', 'I-PACE', 'XE', 'XF'],
  'Jeep': ['Gladiator', 'Grand Cherokee', 'Wrangler'],
  'Koenigsegg': ['Agera', 'Jesko', 'Regera'],
  'Lamborghini': ['Aventador', 'Huracán', 'Urus', 'Revuelto'],
  'Land Rover': ['Defender', 'Discovery', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar'],
  'Lexus': ['ES', 'GS', 'GX', 'IS', 'LC', 'LS', 'LX', 'RX', 'UX'],
  'Lincoln': ['Aviator', 'Continental', 'Corsair', 'Navigator'],
  'Maserati': ['GranTurismo', 'Ghibli', 'Levante', 'MC20', 'Quattroporte'],
  'McLaren': ['570S', '600LT', '720S', '750S', 'Artura', 'Senna', 'P1'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'G-Class', 'GLE', 'GLS', 'AMG GT', 'EQS', 'Maybach S-Class'],
  'Nissan': ['370Z', 'GT-R', 'Murano', 'Pathfinder', 'Titan'],
  'Pagani': ['Huayra', 'Zonda'],
  'Porsche': ['718', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
  'Ram': ['1500', '2500', 'TRX'],
  'Rolls-Royce': ['Cullinan', 'Dawn', 'Ghost', 'Phantom', 'Spectre', 'Wraith'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck', 'Roadster'],
  'Toyota': ['4Runner', 'Camry', 'Corolla', 'Land Cruiser', 'Supra', 'Tundra'],
  'Volkswagen': ['Golf', 'GTI', 'Jetta', 'Passat', 'Tiguan'],
  'Volvo': ['S60', 'S90', 'V90', 'XC40', 'XC60', 'XC90'],
}

const BOAT_TYPES = [
  'Small yachts (10–24 m)',
  'Large yachts (24–40 m)',
  'Superyachts (40–60 m)',
  'Megayachts (60 m+)',
]

function PartnerSearchCombo({
  partners, value, onChange, error,
}: {
  partners: Partner[]
  value: string
  onChange: (id: string) => void
  error?: string
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = partners.find(p => p.id === value)
  const filtered = partners.filter(p =>
    p.businessName.toLowerCase().includes(query.toLowerCase()) ||
    (CATEGORY_LABELS[p.category] || '').toLowerCase().includes(query.toLowerCase())
  ).slice(0, 50)

  // Close on outside click
  const handleBlur = (e: React.FocusEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false)
  }

  const inpStyle: React.CSSProperties = {
    width: '100%', background: C.navy700,
    border: `1px solid ${error ? '#ef4444' : open ? C.gold + 'aa' : C.gold + '28'}`,
    borderRadius: open ? '7px 7px 0 0' : '7px',
    padding: '11px 14px', color: C.white, fontSize: '13px',
    fontFamily: 'Montserrat, sans-serif', fontWeight: 500, outline: 'none',
    cursor: 'pointer',
  }

  return (
    <div ref={ref} style={{ position: 'relative' }} onBlur={handleBlur}>
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.gold, textTransform: 'uppercase', marginBottom: '7px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="5" cy="5" r="4" stroke={C.gold} strokeWidth="1.5"/>
          <path d="M8.5 8.5L11 11" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Referred By — Business Name
        <span style={{ color: C.silverD, fontWeight: 400, fontSize: '10px', textTransform: 'none', letterSpacing: 'normal', marginLeft: '2px' }}>(where you saw the QR code)</span>
      </div>

      {selected && !open ? (
        <div
          onClick={() => { setQuery(''); setOpen(true) }}
          style={{
            ...inpStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
            background: `${C.gold}0e`, border: `1px solid ${C.gold}55`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.gold, flexShrink: 0 }} />
            <div>
              <span style={{ fontWeight: 700, color: C.white, fontSize: '13px' }}>{selected.businessName}</span>
              <span style={{ color: C.silverD, fontSize: '11px', marginLeft: '10px' }}>{CATEGORY_LABELS[selected.category]}</span>
            </div>
          </div>
          <span style={{ color: C.gold, fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' }}>✕ Change</span>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke={C.silverD} strokeWidth="1.4"/>
            <path d="M10 10L13 13" stroke={C.silverD} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            autoFocus={open}
            style={{ ...inpStyle, paddingLeft: '36px' }}
            placeholder="Search business name or category…"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
          />
        </div>
      )}

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: C.navy800, border: `1px solid ${C.gold}44`, borderTop: 'none',
          borderRadius: '0 0 8px 8px', maxHeight: '240px', overflowY: 'auto',
          boxShadow: `0 16px 40px rgba(0,0,0,0.6)`,
        }}>
          {filtered.length === 0 && (
            <div style={{ padding: '16px', color: C.silverD, fontSize: '13px', textAlign: 'center' }}>
              No businesses found for "{query}"
            </div>
          )}
          {filtered.map((p, i) => (
            <div
              key={p.id}
              onMouseDown={() => { onChange(p.id); setQuery(''); setOpen(false) }}
              style={{
                padding: '12px 16px', cursor: 'pointer',
                borderBottom: i < filtered.length - 1 ? `1px solid ${C.gold}10` : 'none',
                background: value === p.id ? `${C.gold}12` : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = `${C.gold}0e`)}
              onMouseLeave={e => (e.currentTarget.style.background = value === p.id ? `${C.gold}12` : 'transparent')}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.white }}>{p.businessName}</div>
                <div style={{ fontSize: '10px', color: C.silverD, marginTop: '2px' }}>{CATEGORY_LABELS[p.category] || p.category}</div>
              </div>
              {value === p.id && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L5.5 10.5L12 3" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          ))}
          {partners.length > 50 && filtered.length === 50 && (
            <div style={{ padding: '10px 16px', color: C.silverD, fontSize: '11px', textAlign: 'center', borderTop: `1px solid ${C.gold}10` }}>
              Showing top 50 results — type more to narrow down
            </div>
          )}
        </div>
      )}
      {error && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '6px' }}>{error}</p>}
    </div>
  )
}

function ClientPage({ partners, onSubmit }: { partners: Partner[]; onSubmit: (ref: ClientReferral) => void }) {
  const [form, setForm] = useState({
    clientName: '', clientEmail: '', clientPhone: '',
    vehicleCategory: '' as '' | 'car' | 'boat',
    carMake: '', carModel: '', carBodyType: '', boatType: '',
    serviceInterest: '', partnerId: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isBoat = form.vehicleCategory === 'boat'
  const isCar = form.vehicleCategory === 'car'
  const availableModels = form.carMake ? (CAR_MAKES[form.carMake] || []) : []

  const vehicleSummary = () => {
    if (isBoat) return form.boatType || 'Boat'
    if (isCar && form.carMake) return [form.carBodyType, form.carMake, form.carModel].filter(Boolean).join(' ')
    return ''
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.clientName.trim()) e.clientName = 'Required'
    if (!form.clientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.clientEmail = 'Valid email required'
    if (!form.clientPhone.trim()) e.clientPhone = 'Required'
    if (!form.vehicleCategory) e.vehicleCategory = 'Select vehicle type'
    if (isCar && !form.carMake) e.carMake = 'Select a make'
    if (isBoat && !form.boatType) e.boatType = 'Select boat type'
    if (!form.serviceInterest) e.serviceInterest = 'Select a service'
    if (!form.partnerId) e.partnerId = 'Select the business that referred you'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    setTimeout(() => {
      const partner = partners.find(p => p.id === form.partnerId)
      const ref: ClientReferral = {
        id: `REF-${Date.now()}`,
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientPhone: form.clientPhone,
        vehicleType: vehicleSummary(),
        serviceInterest: form.serviceInterest,
        partnerId: form.partnerId,
        partnerName: partner?.businessName || '',
        registeredAt: new Date().toISOString().slice(0, 10),
        status: 'Pending',
      }
      onSubmit(ref)
      setSubmitting(false)
      setDone(true)
    }, 1400)
  }

  const inp = (k: string): { style: React.CSSProperties } => ({
    style: {
      width: '100%', background: C.navy700,
      border: `1px solid ${errors[k] ? '#ef4444' : C.gold + '28'}`,
      borderRadius: '7px', padding: '11px 14px', color: C.white, fontSize: '13px',
      fontFamily: 'Montserrat, sans-serif', fontWeight: 500, outline: 'none',
    },
  })

  const lbl = (text: string) => (
    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.silverD, textTransform: 'uppercase', marginBottom: '7px' }}>{text}</div>
  )


  if (done) {
    const partner = partners.find(p => p.id === form.partnerId)
    return (
      <div style={{ minHeight: '100vh', background: C.navy, fontFamily: 'Montserrat, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `${C.gold}14`, border: `2px solid ${C.gold}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: `0 0 40px ${C.gold}22` }}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path d="M6 17L12.5 23.5L28 8" stroke={C.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 900, color: C.white, letterSpacing: '-0.025em', marginBottom: '12px' }}>
          You&apos;re All Set, <span style={{ color: C.gold }}>{form.clientName.split(' ')[0]}!</span>
        </h1>
        <p style={{ fontSize: '15px', color: C.silverD, maxWidth: '520px', lineHeight: 1.75, marginBottom: '40px' }}>
          Your referral via <strong style={{ color: C.silver }}>{partner?.businessName}</strong> has been registered.
          Our Magic Hands team will contact you within <strong style={{ color: C.silver }}>24 hours</strong>.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', width: '100%', maxWidth: '480px' }}>
          {[
            { l: 'Service Requested', v: form.serviceInterest },
            { l: 'Vehicle / Vessel', v: vehicleSummary() },
            { l: 'Referred By', v: partner?.businessName || '—' },
            { l: 'Status', v: 'Pending Contact' },
          ].map(({ l, v }) => (
            <div key={l} style={{ padding: '18px', borderRadius: '10px', background: `${C.gold}07`, border: `1px solid ${C.gold}20`, textAlign: 'left' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: C.silverD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>{l}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: C.silver }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.navy, fontFamily: 'Montserrat, sans-serif' }}>
      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '72px 40px 48px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${C.blue}12 0%, transparent 70%)` }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.02, backgroundImage: `linear-gradient(${C.gold}ff 1px, transparent 1px), linear-gradient(90deg, ${C.gold}ff 1px, transparent 1px)`, backgroundSize: '56px 56px' }} />
        <div style={{ position: 'relative', maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${C.blue}55`, borderRadius: '100px', padding: '5px 16px', marginBottom: '24px', background: `${C.blue}12` }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.blue, boxShadow: `0 0 8px ${C.blue}` }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', color: C.blue, textTransform: 'uppercase' }}>Client Referral Registration</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 900, letterSpacing: '-0.025em', marginBottom: '16px', color: C.white }}>
            Book Your{' '}
            <span style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.goldL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Detailing Service
            </span>
          </h1>
          <p style={{ fontSize: '15px', color: C.silverD, lineHeight: 1.75, maxWidth: '520px', margin: '0 auto' }}>
            Referred by one of our partner businesses? Register here — we&apos;ll contact you within 24 hours and automatically credit your referrer.
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '8px 24px 80px' }}>
        <div style={{ background: C.navy800, border: `1px solid ${C.gold}22`, borderRadius: '16px', padding: '44px', boxShadow: `0 0 60px ${C.gold}0a` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '3px', height: '22px', background: `linear-gradient(${C.blue}, ${C.blueD})`, borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: C.white }}>Your Information</h2>
          </div>
          <p style={{ fontSize: '13px', color: C.silverD, marginBottom: '30px' }}>All fields are required. We&apos;ll reach out within 24 hours.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Personal info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                {lbl('Full Name')}
                <input {...inp('clientName')} value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} placeholder="Carlos Menéndez" />
                {errors.clientName && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.clientName}</p>}
              </div>
              <div>
                {lbl('Phone')}
                <input {...inp('clientPhone')} type="tel" value={form.clientPhone} onChange={e => setForm(p => ({ ...p, clientPhone: e.target.value }))} placeholder="+1 (305) 000-0000" />
                {errors.clientPhone && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.clientPhone}</p>}
              </div>
            </div>

            <div>
              {lbl('Email Address')}
              <input {...inp('clientEmail')} type="email" value={form.clientEmail} onChange={e => setForm(p => ({ ...p, clientEmail: e.target.value }))} placeholder="your@email.com" />
              {errors.clientEmail && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.clientEmail}</p>}
            </div>

            {/* ── Vehicle section ── */}
            <div style={{ borderTop: `1px solid ${C.gold}18`, paddingTop: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: C.gold, textTransform: 'uppercase', marginBottom: '14px' }}>
                Vehicle / Vessel
              </div>

              {/* Car or Boat toggle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {([
                  { k: 'car', icon: '🚗', label: 'Car / SUV / Truck' },
                  { k: 'boat', icon: '⛵', label: 'Boat / Yacht' },
                ] as const).map(({ k, icon, label }) => (
                  <button
                    key={k} type="button"
                    onClick={() => setForm(p => ({ ...p, vehicleCategory: k, carMake: '', carModel: '', carBodyType: '', boatType: '', serviceInterest: '' }))}
                    style={{
                      padding: '14px 12px', borderRadius: '10px', cursor: 'pointer',
                      border: form.vehicleCategory === k ? `2px solid ${C.gold}` : `1px solid ${C.gold}28`,
                      background: form.vehicleCategory === k ? `${C.gold}12` : C.navy700,
                      fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '13px',
                      color: form.vehicleCategory === k ? C.gold : C.silverD,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{icon}</span> {label}
                  </button>
                ))}
              </div>
              {errors.vehicleCategory && <p style={{ fontSize: '11px', color: '#f87171', marginBottom: '8px' }}>{errors.vehicleCategory}</p>}

              {/* Car: Make → Model → Body Type */}
              {isCar && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      {lbl('Make (Brand)')}
                      <select {...inp('carMake')} value={form.carMake}
                        onChange={e => setForm(p => ({ ...p, carMake: e.target.value, carModel: '' }))}
                        style={{ ...inp('carMake').style, color: form.carMake ? C.white : C.silverD }}>
                        <option value="" disabled style={{ background: C.navy800 }}>Select make</option>
                        {Object.keys(CAR_MAKES).sort().map(m => (
                          <option key={m} value={m} style={{ background: C.navy800 }}>{m}</option>
                        ))}
                      </select>
                      {errors.carMake && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.carMake}</p>}
                    </div>
                    <div>
                      {lbl('Model')}
                      <select {...inp('carModel')} value={form.carModel}
                        onChange={e => setForm(p => ({ ...p, carModel: e.target.value }))}
                        disabled={!form.carMake}
                        style={{ ...inp('carModel').style, color: form.carModel ? C.white : C.silverD, opacity: form.carMake ? 1 : 0.5, cursor: form.carMake ? 'pointer' : 'not-allowed' }}>
                        <option value="" style={{ background: C.navy800 }}>{form.carMake ? 'Select model' : 'Select make first'}</option>
                        {availableModels.map(m => (
                          <option key={m} value={m} style={{ background: C.navy800 }}>{m}</option>
                        ))}
                        <option value="Other" style={{ background: C.navy800 }}>Other / Not listed</option>
                      </select>
                    </div>
                  </div>

                  {/* Body type chips */}
                  <div>
                    {lbl('Body Type')}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {['Small / Coupe', 'Medium / Sedan', 'Large / SUV', 'Extra Large'].map(t => (
                        <button key={t} type="button"
                          onClick={() => setForm(p => ({ ...p, carBodyType: p.carBodyType === t ? '' : t }))}
                          style={{
                            padding: '7px 14px', borderRadius: '100px', cursor: 'pointer',
                            border: form.carBodyType === t ? `1.5px solid ${C.gold}` : `1px solid ${C.gold}28`,
                            background: form.carBodyType === t ? `${C.gold}18` : C.navy700,
                            color: form.carBodyType === t ? C.gold : C.silverD,
                            fontSize: '12px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif',
                            transition: 'all 0.12s',
                          }}>
                          {t}
                        </button>
                      ))}
                    </div>
                    {errors.carBodyType && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '6px' }}>{errors.carBodyType}</p>}
                  </div>
                </div>
              )}

              {/* Boat: type only */}
              {isBoat && (
                <div>
                  {lbl('Boat / Vessel Type')}
                  <select {...inp('boatType')} value={form.boatType}
                    onChange={e => setForm(p => ({ ...p, boatType: e.target.value }))}
                    style={{ ...inp('boatType').style, color: form.boatType ? C.white : C.silverD }}>
                    <option value="" disabled style={{ background: C.navy800 }}>Select boat type</option>
                    {BOAT_TYPES.map(b => <option key={b} value={b} style={{ background: C.navy800 }}>{b}</option>)}
                  </select>
                  <div style={{ marginTop: '10px', padding: '12px 14px', borderRadius: '7px', background: `${C.gold}07`, border: `1px solid ${C.gold}18` }}>
                    {[
                      { t: 'Small yachts', d: 'Measure between 10 and 24 meters.' },
                      { t: 'Large yachts', d: 'Measure between 24 and 40 meters.' },
                      { t: 'Superyachts', d: 'Measure from 40 to 60 meters.' },
                      { t: 'Megayachts', d: 'Exceed 60 meters in length.' },
                    ].map(({ t, d }) => (
                      <p key={t} style={{ fontSize: '11px', lineHeight: 1.6, color: C.silverD, fontFamily: 'Montserrat, sans-serif' }}>
                        <strong style={{ color: C.gold, fontWeight: 700 }}>{t}:</strong> {d}
                      </p>
                    ))}
                  </div>
                  {errors.boatType && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.boatType}</p>}
                </div>
              )}
            </div>

            {/* Service */}
            <div>
              {lbl('Service Interest')}
              <select {...inp('serviceInterest')} value={form.serviceInterest}
                onChange={e => setForm(p => ({ ...p, serviceInterest: e.target.value }))}
                style={{ ...inp('serviceInterest').style, color: form.serviceInterest ? C.white : C.silverD }}>
                <option value="" disabled style={{ background: C.navy800 }}>Select service</option>
                {(isBoat ? BOAT_SERVICE_CATEGORIES : CAR_SERVICE_CATEGORIES).map(cat => (
                  <optgroup key={cat.label} label={cat.label} style={{ background: C.navy800 }}>
                    {cat.services.map(s => <option key={s} value={s} style={{ background: C.navy800 }}>{s}</option>)}
                  </optgroup>
                ))}
              </select>
              {errors.serviceInterest && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors.serviceInterest}</p>}
            </div>

            {/* ── Searchable partner picker ── */}
            <div style={{ borderTop: `1px solid ${C.gold}18`, paddingTop: '18px' }}>
              <PartnerSearchCombo
                partners={partners}
                value={form.partnerId}
                onChange={id => setForm(p => ({ ...p, partnerId: id }))}
                error={errors.partnerId}
              />
            </div>

            <button type="submit" disabled={submitting} style={{
              marginTop: '4px', padding: '15px', borderRadius: '8px', border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '12px',
              letterSpacing: '0.1em', textTransform: 'uppercase', color: C.navy,
              background: submitting ? `${C.gold}80` : `linear-gradient(90deg, ${C.gold}, ${C.goldL})`,
              boxShadow: submitting ? 'none' : `0 0 28px ${C.gold}44`,
              transition: 'all 0.2s',
            }}>
              {submitting ? 'Registering Your Request…' : 'Submit My Referral Request →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null)
  const [partners, setPartners] = useState<Partner[]>(SEED_PARTNERS)
  const [referrals, setReferrals] = useState<ClientReferral[]>(SEED_REFERRALS)

  const handlePartnerSuccess = (p: Partner) => {
    setPartners(prev => [p, ...prev])
    setCurrentPartner(p)
    setScreen('success')
  }

  const handleClientReferral = (ref: ClientReferral) => {
    setReferrals(prev => [ref, ...prev])
  }

  const activeDashboardPartner = currentPartner ?? SEED_PARTNERS[0]

  return (
    <div style={{ minHeight: '100vh', background: C.navy }}>
      {/* Top-level nav only on landing/client/dashboard */}
      {(screen === 'landing' || screen === 'client') && (
        <Nav screen={screen} onNavigate={setScreen} />
      )}

      {screen === 'landing' && (
        <LandingPage onSuccess={handlePartnerSuccess} />
      )}
      {screen === 'success' && currentPartner && (
        <SuccessScreen partner={currentPartner} onDashboard={() => setScreen('dashboard')} />
      )}
      {screen === 'dashboard' && (
        <>
          <Dashboard partner={activeDashboardPartner} allPartners={partners} referrals={referrals} />
        </>
      )}
      {screen === 'client' && (
        <ClientPage partners={partners} onSubmit={handleClientReferral} />
      )}
    </div>
  )
}
