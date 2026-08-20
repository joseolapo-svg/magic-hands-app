export interface Partner {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string
  category: string
  joinedAt: string
}

export interface ClientReferral {
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
