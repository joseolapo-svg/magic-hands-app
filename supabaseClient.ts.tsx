import { createClient } from '@supabase/supabase-js'

// 1. Tu URL del proyecto
const SUPABASE_URL = 'https://veknjtcgslgpirxiehkn.supabase.co'
```[cite: 4]

const SUPABASE_ANON_KEY = 'sb_publishable_EJJcC1CI_aoVUVywLPu61g_ohheSR1L' // Reemplaza los puntos suspensivos con el resto de tu clave

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
