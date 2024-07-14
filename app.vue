<template>
  <NuxtPage />
</template>

<script setup>
const store = useProductsStore()

const supabase = useSupabaseClient()

// Delete checked products older than 3 days
let threeDaysAgo = new Date()
threeDaysAgo.setDate(threeDaysAgo.getDate() - Math.abs(3))
const { deleteError } = await supabase.from('products').delete().eq('checked', true).lt('updated_at', threeDaysAgo.toISOString())

// Fetch products
const { data, error } = await supabase.from('products').select('*')

store.setProducts(data)

useHead({
  title: "Lista de compras",
  favicon: "/cart.webp"
})
</script>