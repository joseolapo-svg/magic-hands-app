import { useState } from 'react'
import { C, CAR_MAKES, BOAT_TYPES, CAR_SERVICE_CATEGORIES, BOAT_SERVICE_CATEGORIES } from './lib/constants'
import type { Partner, ClientReferral } from './lib/types'
import PartnerSearchCombo from './components/PartnerSearchCombo'

export default function ClientForm({ partners, onSubmit }: { partners: Partner[]; onSubmit: (ref: ClientReferral) => void }) {
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
