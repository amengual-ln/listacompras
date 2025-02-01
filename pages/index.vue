<template>
  <Toaster position='top-center' />
  <section class="flex flex-col gap-4 p-4 mb-20" v-auto-animate>
    <Product v-for="product in store.getUnchecked" :key="product.id" :product="product" />
    <hr>
    <Product v-for="product in store.getChecked" :key="product.id" :product="product" />
  </section>
  <div class="fixed bottom-0 w-full flex text-xl bg-[#eee]">
    <input type="text" v-model="newProduct" @keyup.enter="handleAddProduct"
      class="text-2xl pl-2 py-4 border outline-none w-[80%]">
    <button @click="handleAddProduct" class="bg-gray-800 text-white hover:bg-black w-[20%]">+</button>
  </div>
</template>

<script setup>
import { Toaster, toast } from 'vue-sonner'
const supabase = useSupabaseClient()
const store = useProductsStore()
const newProduct = ref('')

const handleAddProduct = async () => {
  if (newProduct.value.trim() === '') return
  // Don't add product if it already exists
  if (store.getUnchecked.some((item) => item.name.toLowerCase() === newProduct.value.toLowerCase())) {
    toast('Produto ya existente', { type: 'error' })
    newProduct.value = ''
    return
  }
  // Uncheck product if it already exists
  if (store.getChecked.some((item) => item.name.toLowerCase() === newProduct.value.toLowerCase())) {
    store.getChecked.find((item) => item.name.toLowerCase() === newProduct.value.toLowerCase()).checked = false
    newProduct.value = ''
    return
  }
  const { data, error } = await supabase.from('products').insert([{ name: newProduct.value.trim() }]).select()
  store.addProduct(data[0])

  newProduct.value = ''
}
</script>