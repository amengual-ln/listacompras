export const useProductsStore = defineStore('products', {
  state: () => ({
    products: []
  }),
  actions: {
    setProducts(products) {
      this.products = products
    },
    checkProduct(id) {
      this.products = this.products.map(product => product.id === id ? { ...product, checked: !product.checked } : product)
    },
    addProduct(product) {
      this.products.push(product)
    },
    deleteProduct(id) {
      this.products = this.products.filter(product => product.id !== id)
    }
  },
  getters: {
    getUnchecked: (state) => state.products.filter(product => !product.checked),
    getChecked: (state) => state.products.filter(product => product.checked),
  }
})