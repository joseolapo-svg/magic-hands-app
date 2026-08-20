import { useState, useRef } from 'react'
import logoImg from './imports/LOGO_DETAILING_SPECIALIST.png'
import { createClient } from '@supabase/supabase-js'

// ─── Supabase Client Configuration ──────────────────────────────────────────
// Asegúrate de definir VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tus variables de entorno (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'TU_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU_SUPABASE_ANON_KEY'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Color tokens ───────────────────────────────────────────────────────────
const C = {
  navy:      '#060e1e',
  navy800:   '#0c1a30',
  navy700:   '#112040',
  navy600:   '#172a52',
  gold:      '#C9A84C',
  goldL:     '#E2C47A',
  goldD:     '#9A7A32',
  blue:      '#1E6FD9',
  blueD:     '#1559B0',
  silver:    '#D8E2EE',
  silverD:   '#8899AA',
  white:     '#FFFFFF',
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
  'Paint Correction': 275,
  'Ceramic Coating': 320,
  'PPF Installation and Removal': 450,
  'Window Tint Installation and Removal': 180,
  'Leather Ceramic': 210,
  'Wheels Ceramic Coating': 160,
  'Basic Exterior Detailing': 220,
  'Basic Exterior Detailing & Detailing of Hatches': 280,
  'Interior Detailing Only': 240,
  'Basic Exterior Detailing + Hatches + Cabin': 360,
  'Exterior Detailing + Hand Wax': 320,
  'Exterior Detailing + Hand Wax + Cabin Detailing': 420,
  'Deep Detailing': 480,
  'Buffing / Polish': 400,
}

const CATEGORY_LABELS: Record<string, string> = {
  auto_workshop: 'Auto Workshop / Body Shop',
  marina: 'Marina / Boat Dealer',
  auto_parts: 'Auto Parts & Accessories',
  luxury_dealer: 'Luxury Vehicle Dealership',
  detailing_shop: 'Detailing Shop / Spa',
}

// ─── Logo Component ──────────────────────────────────────────────────────────
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

// ─── Nav Component ──────────────────────────────────────────────────────────
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

// ─── QR SVG Pattern ──────────────────────────────────────────────────────────
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

// ─── Partner Landing / Registration (Integrated with Supabase) ───────────────
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    
    setSubmitting(true)

    const slug = form.businessName.replace(/\s+/g, '').toUpperCase().slice(0, 6)
    const newPartnerId = `MH-${slug}-26`
    const joinedDate = new Date().toISOString().slice(0, 10)

    const partnerData = {
      id: newPartnerId,
      business_name: form.businessName,
      contact_name: form.contactName,
      email: form.email,
      phone: form.phone,
      category: form.category,
      joined_at: joinedDate,
    }

    try {
      const { error } = await supabase
        .from('partners') // Asegúrate de que tu tabla en Supabase se llame 'partners'
        .insert([partnerData])

      if (error) throw error

      const partner: Partner = {
        id: newPartnerId,
        businessName: form.businessName,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone,
        category: form.category,
        joinedAt: joinedDate,
      }
      onSuccess(partner)
    } catch (err: any) {
      console.error('Error saving to Supabase:', err.message)
      setErrors({ email: 'Database error. Please try again with a different email.' })
    } finally {
      setSubmitting(false)
    }
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
      <div style={{ position: 'relative', overflow: 'hidden', padding: '80px 40px 60px', textAlign: 'center' }}>
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

    ctx.fillStyle = '#060e1e'
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = C.gold
    ctx.lineWidth = 3
    ctx.strokeRect(4, 4, W - 8, H - 8)

    ctx.fillStyle = '#0c1a30'
    ctx.fillRect(4, 4, W - 8, 90)

    const logoEl = new Image()
    logoEl.onload = () => {
      ctx.drawImage(logoEl, 20, 14, 64, 64)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 18px Montserrat, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('MAGIC HANDS', 96, 42)
      ctx.fillStyle = C.gold
      ctx.font = '600 11px Montserrat, sans-serif'
      ctx.fillText('DETAILING SPECIALISTS · MIAMI', 96, 62)

      ctx.fillStyle = `${C.gold}22`
      ctx.beginPath()
      ctx.roundRect(W - 160, 26, 144, 36, 6)
      ctx.fill()
      ctx.fillStyle = C.gold
      ctx.font = 'bold 11px JetBrains Mono, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(partner.id, W - 88, 48)

      const qrPad = 20, qrSize = W - 80, qrTop = 110
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.roundRect(40, qrTop, qrSize, qrSize, 10)
      ctx.fill()

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

      const textTop = qrTop + qrSize + 24
      ctx.fillStyle = C.white
      ctx.font = 'bold 13px Montserrat, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Scan to book — your referral is automatic', W / 2, textTop)
      ctx.fillStyle = C.silverD
      ctx.font = '11px Montserrat, sans-serif'
      ctx.fillText('magichandsmiami.com · Partner Referral Program', W / 2, textTop + 22)

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

// ─── Commission Dashboard Component ──────────────────────────────────────────
function Dashboard({ partner, referrals }: { partner: Partner; referrals: ClientReferral[] }) {
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
    <div style={{ minHeight: '100vh', background: C.navy, fontFamily: 'Montserrat, sans-serif', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: C.white, marginBottom: '4px' }}>
              {partner.businessName} <span style={{ color: C.gold, fontSize: '14px', fontFamily: 'JetBrains Mono, monospace' }}>({partner.id})</span>
            </h2>
            <p style={{ fontSize: '13px', color: C.silverD }}>Partner Performance & Commissions Dashboard</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: C.navy800, padding: '24px', borderRadius: '12px', border: `1px solid ${C.gold}28` }}>
            <div style={{ fontSize: '11px', color: C.silverD, textTransform: 'uppercase', marginBottom: '8px' }}>Total Earned (Paid)</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: C.gold, fontFamily: 'JetBrains Mono, monospace' }}>${earned}</div>
          </div>
          <div style={{ background: C.navy800, padding: '24px', borderRadius: '12px', border: `1px solid ${C.gold}28` }}>
            <div style={{ fontSize: '11px', color: C.silverD, textTransform: 'uppercase', marginBottom: '8px' }}>Pending Commission</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: C.blue, fontFamily: 'JetBrains Mono, monospace' }}>${pendingAmt}</div>
          </div>
          <div style={{ background: C.navy800, padding: '24px', borderRadius: '12px', border: `1px solid ${C.gold}28` }}>
            <div style={{ fontSize: '11px', color: C.silverD, textTransform: 'uppercase', marginBottom: '8px' }}>Total Referrals</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: C.white, fontFamily: 'JetBrains Mono, monospace' }}>{myRefs.length}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {(['All', 'Completed', 'Booked', 'Pending'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
              background: filter === f ? `${C.gold}22` : C.navy800,
              color: filter === f ? C.gold : C.silverD,
              borderBottom: filter === f ? `2px solid ${C.gold}` : '2px solid transparent',
            }}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ background: C.navy800, borderRadius: '12px', border: `1px solid ${C.gold}22`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.gold}22`, color: C.silverD, fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px' }}>Client</th>
                <th style={{ padding: '16px' }}>Vehicle</th>
                <th style={{ padding: '16px' }}>Service</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Commission</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: C.silverD }}>No referrals found for this filter.</td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${C.navy700}` }}>
                  <td style={{ padding: '16px', color: C.white, fontWeight: 600 }}>{r.clientName}</td>
                  <td style={{ padding: '16px', color: C.silver }}>{r.vehicleType}</td>
                  <td style={{ padding: '16px', color: C.silverD }}>{r.serviceInterest}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 700,
                      background: `${STATUS_COLOR[r.status] || C.silverD}22`, color: STATUS_COLOR[r.status] || C.silverD,
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: C.gold, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                    ${COMMISSION_BY_SERVICE[r.serviceInterest] || 100}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Client Booking Screen ────────────────────────────────────────────────────
function ClientScreen({ partners, onAddReferral }: { partners: Partner[]; onAddReferral: (r: ClientReferral) => void }) {
  const [form, setForm] = useState({ clientName: '', clientEmail: '', clientPhone: '', vehicleType: '', serviceInterest: 'Full Detail', partnerId: partners[0]?.id || '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedPartner = partners.find(p => p.id === form.partnerId)
    const newRef: ClientReferral = {
      id: `REF-00${Math.floor(Math.random() * 900) + 100}`,
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      clientPhone: form.clientPhone,
      vehicleType: form.vehicleType,
      serviceInterest: form.serviceInterest,
      partnerId: form.partnerId,
      partnerName: selectedPartner ? selectedPartner.businessName : 'Direct Booking',
      registeredAt: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    }
    onAddReferral(newRef)
    setSubmitted(true)
  }

  const inp = {
    style: {
      width: '100%', background: `${C.navy700}`, border: `1px solid ${C.gold}28`,
      borderRadius: '7px', padding: '11px 14px', color: C.white, fontSize: '13px',
      fontFamily: 'Montserrat, sans-serif', fontWeight: 500, outline: 'none',
    } as React.CSSProperties,
  }

  const label = (text: string) => (
    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.silverD, textTransform: 'uppercase', marginBottom: '7px' }}>{text}</div>
  )

  return (
    <div style={{ minHeight: '100vh', background: C.navy, fontFamily: 'Montserrat, sans-serif', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{
          background: C.navy800, border: `1px solid ${C.gold}22`,
          borderRadius: '16px', padding: '44px',
          boxShadow: `0 0 60px ${C.gold}0a`,
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: C.white, marginBottom: '8px' }}>Client Service Booking</h2>
          <p style={{ fontSize: '13px', color: C.silverD, marginBottom: '32px' }}>Book your detailing service and credit your referring partner.</p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: C.gold, marginBottom: '12px' }}>Booking Received Successfully!</div>
              <p style={{ fontSize: '13px', color: C.silverD, marginBottom: '24px' }}>Our operations team will contact you shortly to confirm your schedule.</p>
              <button onClick={() => setSubmitted(false)} style={{
                padding: '10px 20px', background: `${C.gold}22`, border: `1px solid ${C.gold}`, borderRadius: '6px',
                color: C.gold, fontWeight: 700, cursor: 'pointer',
              }}>
                Book Another Service
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                {label('Full Name')}
                <input {...inp} required value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} placeholder="John Doe" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  {label('Email')}
                  <input {...inp} required type="email" value={form.clientEmail} onChange={e => setForm(p => ({ ...p, clientEmail: e.target.value }))} placeholder="john@example.com" />
                </div>
                <div>
                  {label('Phone')}
                  <input {...inp} required type="tel" value={form.clientPhone} onChange={e => setForm(p => ({ ...p, clientPhone: e.target.value }))} placeholder="+1 305 000 0000" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  {label('Vehicle Type')}
                  <input {...inp} required value={form.vehicleType} onChange={e => setForm(p => ({ ...p, vehicleType: e.target.value }))} placeholder="Porsche 911 / 50ft Yacht" />
                </div>
                <div>
                  {label('Service Interest')}
                  <select {...inp} value={form.serviceInterest} onChange={e => setForm(p => ({ ...p, serviceInterest: e.target.value }))}>
                    {Object.keys(COMMISSION_BY_SERVICE).map(s => <option key={s} value={s} style={{ background: C.navy800 }}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                {label('Referring Partner')}
                <select {...inp} value={form.partnerId} onChange={e => setForm(p => ({ ...p, partnerId: e.target.value }))}>
                  {partners.map(pt => <option key={pt.id} value={pt.id} style={{ background: C.navy800 }}>{pt.businessName} ({pt.id})</option>)}
                </select>
              </div>
              <button type="submit" style={{
                marginTop: '12px', padding: '15px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: C.navy, background: `linear-gradient(90deg, ${C.gold}, ${C.goldL})`,
                boxShadow: `0 0 28px ${C.gold}44`,
              }}>
                Confirm Booking →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Root App Component ──────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [currentPartner, setCurrentPartner] = useState<Partner>(SEED_PARTNERS[0])
  const [allPartners, setAllPartners] = useState<Partner[]>(SEED_PARTNERS)
  const [referrals, setReferrals] = useState<ClientReferral[]>(SEED_REFERRALS)

  const handlePartnerSuccess = (partner: Partner) => {
    setCurrentPartner(partner)
    setAllPartners(prev => [partner, ...prev])
    setScreen('success')
  }

  const handleAddReferral = (newRef: ClientReferral) => {
    setReferrals(prev => [newRef, ...prev])
  }

  return (
    <div style={{ background: C.navy, minHeight: '100vh', color: C.white }}>
      <Nav screen={screen} onNavigate={setScreen} />
      {screen === 'landing' && <LandingPage onSuccess={handlePartnerSuccess} />}
      {screen === 'success' && <SuccessScreen partner={currentPartner} onDashboard={() => setScreen('dashboard')} />}
      {screen === 'dashboard' && <Dashboard partner={currentPartner} referrals={referrals} />}
      {screen === 'client' && <ClientScreen partners={allPartners} onAddReferral={handleAddReferral} />}
    </div>
  )
}
