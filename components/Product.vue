<template>
  <article
    :class="`text-xl font-medium text-neutral-700 flex justify-between items-center bg-gray-100 p-4 rounded-xl ${product.checked && 'opacity-75'}`">
    <h2 :class="product.checked && 'line-through opacity-50'">{{ product.name }}</h2>
    <div @click="handleProductCheck" class="bg-[#eee] rounded-full cursor-pointer">
      <span :class="`${!product.checked && 'opacity-0'} h-12 text-neutral-700`">
        <img src="/check.svg" class="h-12" alt="x">
      </span>
    </div>
  </article>
</template>

<script setup>
const { product } = defineProps(['product'])
const supabase = useSupabaseClient()
const store = useProductsStore()

const handleProductCheck = async () => {
  const prevValue = product.checked
  store.checkProduct(product.id) // Optimistic
  const { data, error } = await supabase.from('products').update({ checked: !prevValue, updated_at: new Date().toISOString() }).eq('id', product.id)
}
</script>
