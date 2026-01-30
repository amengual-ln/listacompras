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
    updateProduct(updatedProduct) {
      const index = this.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
    },
    addProducts(products) {
      this.products.push(...products)
    },
    toggleCheckedByIds(ids, checked) {
      this.products = this.products.map(product => {
        if (ids.includes(product.id)) {
          return { ...product, checked };
        }
        return product;
      });
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