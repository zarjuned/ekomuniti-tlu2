// Supabase client wrapper — in prototype mode, this is a no-op mock.
// When VITE_USE_MOCK=true (default), stores use local mock data.

import { createClient } from '@supabase/supabase-js'

const isMock = import.meta.env.VITE_USE_MOCK === 'true'

let supabase

if (!isMock) {
  supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
} else {
  // Mock client — stores read from local Pinia stores instead
  supabase = {
    auth: {
      signInWithPassword: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({ select: () => ([]), insert: () => ({}), update: () => ({}), delete: () => ({}) }),
    storage: { from: () => ({ upload: () => ({}), getPublicUrl: () => '' }) }
  }
}

export { isMock }
export default supabase
