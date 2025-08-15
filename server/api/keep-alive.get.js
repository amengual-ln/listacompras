import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { data } = await supabase.from('products').select('*') // Query mínima
  return { data, ok: true }
})
