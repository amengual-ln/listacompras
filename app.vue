<template>
  <NuxtPage />
</template>

<script setup>
const store = useProductsStore()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Ensure we have a session before proceeding to subscribe to private channels.
// If no user is logged in, sign in anonymously.
if (!user.value) {
  const { error } = await supabase.auth.signInAnonymously()
  if (error) {
    console.error('Error signing in anonymously:', error)
  }
}

// Delete checked products older than 3 days
let threeDaysAgo = new Date()
threeDaysAgo.setDate(threeDaysAgo.getDate() - Math.abs(2))
const { deleteError } = await supabase.from('products').delete().eq('checked', true).lt('updated_at', threeDaysAgo.toISOString())

// Fetch initial data
const { data, error } = await supabase.from('products').select('*')
if (data) {
  store.setProducts(data)
}

// Set up Supabase real-time subscription
const channel = supabase.channel('products:all', {
  config: {
    private: true,
  },
})
.on('broadcast', { event: 'INSERT' }, ({ payload }) => {
  store.addProducts([payload])
})
.on('broadcast', { event: 'UPDATE' }, ({ payload }) => {
  store.updateProduct(payload)
})
.on('broadcast', { event: 'DELETE' }, ({ payload }) => {
  store.deleteProduct(payload.id)
})
.subscribe((status) => {
  if (status === 'SUBSCRIBED') {
    console.log('Realtime channel subscribed')
  }
})

useHead({
  title: "Lista de compras",
  favicon: "/cart.webp"
})
</script>