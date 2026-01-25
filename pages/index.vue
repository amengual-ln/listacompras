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

  const productNames = newProduct.value.split(',').map(p => p.trim()).filter(p => p !== '');

  if (productNames.length > 0) {
    await addProducts(productNames);
  }

  newProduct.value = ''
}

const addProducts = async (products) => {
  const newProducts = [];
  const productsToUncheck = [];

  for (const productName of products) {
    const lowerCaseProductName = productName.toLowerCase();

    // Don't add product if it already exists and is unchecked
    if (store.getUnchecked.some((item) => item.name.toLowerCase() === lowerCaseProductName)) {
      toast(`Produto '${productName}' ya existente`, { type: 'error' })
      continue; // Skip to the next product
    }

    // Find if product exists in the checked list
    const existingChecked = store.getChecked.find((item) => item.name.toLowerCase() === lowerCaseProductName);
    if (existingChecked) {
      productsToUncheck.push(existingChecked);
    } else {
      newProducts.push({ name: productName });
    }
  }

  // Uncheck products that were checked
  if (productsToUncheck.length > 0) {
    const idsToUncheck = productsToUncheck.map(p => p.id);
    store.toggleCheckedByIds(idsToUncheck, false);
    await supabase.from('products').update({ checked: false }).in('id', idsToUncheck);
    productsToUncheck.forEach(p => toast(`'${p.name}' movido a la lista de compra.`));
  }

  // Add all new products in a single batch
  if (newProducts.length > 0) {
    const { data, error } = await supabase.from('products').insert(newProducts).select();
    if (data) {
      store.addProducts(data);
    }
    if (error) {
      toast('Error al agregar productos', { type: 'error' });
    }
  }
}

</script>