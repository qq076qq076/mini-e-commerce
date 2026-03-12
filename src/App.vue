<template>
  <div id="app">
    <header class="app-header">
      <h1 class="title">商品清單</h1>
      <p class="subtitle">核心功能 1：顯示商品 id、title、price、image</p>
    </header>
    <section class="product-grid">
      <article
        v-for="product in products"
        :key="product.id"
        class="product-card"
        data-test="product-card"
      >
        <img
          :src="product.image"
          :alt="product.title"
          class="product-image"
          data-test="product-image"
        />
        <div class="product-content">
          <p class="product-id" data-test="product-id">{{ product.id }}</p>
          <h2 class="product-title" data-test="product-title">{{ product.title }}</h2>
          <p class="product-price" data-test="product-price">NT$ {{ product.price }}</p>
        </div>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Product } from '@/types/product'
import { RootState } from '@/store'

export default Vue.extend({
  name: 'App',
  computed: {
    products(): Product[] {
      const rootState: RootState = this.$store.state as RootState

      return rootState.products
    }
  }
})
</script>

<style lang="scss">
#app {
  font-family: 'Noto Sans TC', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0 auto;
  max-width: 1100px;
  padding: 32px 20px 48px;
}

.app-header {
  margin-bottom: 24px;
}

.title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.subtitle {
  margin: 8px 0 0;
  color: #5b6677;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.product-card {
  overflow: hidden;
  border: 1px solid #d7dfea;
  border-radius: 14px;
  background-color: #ffffff;
  box-shadow: 0 4px 14px rgba(7, 29, 61, 0.06);
}

.product-image {
  display: block;
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.product-content {
  padding: 12px;
}

.product-id {
  margin: 0;
  font-size: 12px;
  color: #6f7b8b;
}

.product-title {
  margin: 8px 0 0;
  font-size: 18px;
}

.product-price {
  margin: 10px 0 0;
  font-weight: 700;
  color: #123a77;
}
</style>
