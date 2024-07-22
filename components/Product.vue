<template>
  <article @pointerdown="handleDeleteProduct" @pointerup="handleDeleteAbort"
    :class="`text-xl font-medium text-neutral-700 flex justify-between items-center bg-gray-100 p-4 rounded-xl select-none ${product.checked && 'opacity-75'}`">
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
let deleteTimeout

const handleProductCheck = async () => {
  const prevValue = product.checked
  store.checkProduct(product.id) // Optimistic
  const { data, error } = await supabase.from('products').update({ checked: !prevValue, updated_at: new Date().toISOString() }).eq('id', product.id)
}

const handleDeleteProduct = async () => {
  console.log('press started')
  clearTimeout(deleteTimeout)
  deleteTimeout = setTimeout(async () => {
    store.deleteProduct(product.id)
    const { deleteError } = await supabase.from('products').delete().eq('id', product.id)
  }, 3000)
}

const handleDeleteAbort = () => {
  clearTimeout(deleteTimeout)
}
</script>
