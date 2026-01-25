<template>
  <NuxtPage />
</template>

<script setup>
const store = useProductsStore()

const supabase = useSupabaseClient()

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
const channel = supabase.channel('products')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, (payload) => {
    store.addProducts([payload.new])
  })
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (payload) => {
    store.checkProduct(payload.new.id)
  })
  .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'products' }, (payload) => {
    store.deleteProduct(payload.old.id)
  })
  .subscribe()

useHead({
  title: "Lista de compras",
  favicon: "/cart.webp"
})
</script>