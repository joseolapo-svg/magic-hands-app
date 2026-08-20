import { useState, useRef } from 'react'
import { C, CATEGORY_LABELS } from '../lib/constants'
import type { Partner } from '../lib/types'

export default function PartnerSearchCombo({
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
