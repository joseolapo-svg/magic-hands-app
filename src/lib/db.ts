import { supabase, isSupabaseConfigured } from './supabaseClient'
import type { Partner, ClientReferral } from './types'

// ─── Row shapes (snake_case) as stored in Supabase ──────────────────────────
interface PartnerRow {
  id: string
  business_name: string
  contact_name: string
  email: string
  phone: string
  category: string
  joined_at: string
}

interface ReferralRow {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  vehicle_type: string
  service_interest: string
  partner_id: string
  partner_name: string
  registered_at: string
  status: ClientReferral['status']
}

// ─── Mappers between DB rows and app types ──────────────────────────────────
const toPartner = (r: PartnerRow): Partner => ({
  id: r.id,
  businessName: r.business_name,
  contactName: r.contact_name,
  email: r.email,
  phone: r.phone,
  category: r.category,
  joinedAt: r.joined_at,
})

const fromPartner = (p: Partner): PartnerRow => ({
  id: p.id,
  business_name: p.businessName,
  contact_name: p.contactName,
  email: p.email,
  phone: p.phone,
  category: p.category,
  joined_at: p.joinedAt,
})

const toReferral = (r: ReferralRow): ClientReferral => ({
  id: r.id,
  clientName: r.client_name,
  clientEmail: r.client_email,
  clientPhone: r.client_phone,
  vehicleType: r.vehicle_type,
  serviceInterest: r.service_interest,
  partnerId: r.partner_id,
  partnerName: r.partner_name,
  registeredAt: r.registered_at,
  status: r.status,
})

const fromReferral = (r: ClientReferral): ReferralRow => ({
  id: r.id,
  client_name: r.clientName,
  client_email: r.clientEmail,
  client_phone: r.clientPhone,
  vehicle_type: r.vehicleType,
  service_interest: r.serviceInterest,
  partner_id: r.partnerId,
  partner_name: r.partnerName,
  registered_at: r.registeredAt,
  status: r.status,
})

// ─── Queries ────────────────────────────────────────────────────────────────
export async function fetchPartners(): Promise<Partner[]> {
  if (!isSupabaseConfigured || !supabase) return []
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('joined_at', { ascending: false })
  if (error) throw error
  return (data as PartnerRow[]).map(toPartner)
}

export async function fetchReferrals(): Promise<ClientReferral[]> {
  if (!isSupabaseConfigured || !supabase) return []
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .order('registered_at', { ascending: false })
  if (error) throw error
  return (data as ReferralRow[]).map(toReferral)
}

export async function insertPartner(partner: Partner): Promise<Partner> {
  if (!isSupabaseConfigured || !supabase) return partner
  const { data, error } = await supabase
    .from('partners')
    .insert(fromPartner(partner))
    .select()
    .single()
  if (error) throw error
  return toPartner(data as PartnerRow)
}

export async function insertReferral(referral: ClientReferral): Promise<ClientReferral> {
  if (!isSupabaseConfigured || !supabase) return referral
  const { data, error } = await supabase
    .from('referrals')
    .insert(fromReferral(referral))
    .select()
    .single()
  if (error) throw error
  return toReferral(data as ReferralRow)
}

// Records that a partner accepted the Terms & Conditions when registering.
export const TERMS_VERSION = 'PARTNER_TERMS_V1.0'

export async function recordTermsAcceptance(partnerId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const { error } = await supabase
    .from('partner_terms_acceptances')
    .insert({
      partner_id: partnerId,
      terms_version: TERMS_VERSION,
      accepted: true,
      source: 'partner_landing',
    })
  if (error) throw error
}
