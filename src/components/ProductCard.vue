<template>
  <article class="product-card" data-test="product-card">
    <div class="product-image-wrapper">
      <img
        :src="product.image"
        :alt="product.title"
        class="product-image"
        data-test="product-image"
      />
    </div>
    <div class="product-content">
      <p class="product-id" data-test="product-id">{{ product.id }}</p>
      <h3 class="product-title" data-test="product-title">{{ product.title }}</h3>
      <p class="product-price" data-test="product-price">{{ formatPrice(product.price) }}</p>
      <button class="product-cta" type="button">查看詳情</button>
    </div>
  </article>
</template>

<script lang="ts">
import Vue from 'vue'
import { Product } from '@/types/product'

export default Vue.extend({
  name: 'ProductCard',
  props: {
    product: {
      type: Object as () => Product,
      required: true
    }
  },
  methods: {
    formatPrice(price: number): string {
      return `NT$ ${price}`
    }
  }
})
</script>

<style lang="scss" scoped>
.product-card {
  overflow: hidden;
  border: 1px solid var(--line-color);
  border-radius: 14px;
  background: var(--bg-surface);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(15, 43, 84, 0.12);
}

.product-image-wrapper {
  padding: 10px;
}

.product-image {
  display: block;
  width: 100%;
  height: 156px;
  object-fit: cover;
  border-radius: 10px;
}

.product-content {
  padding: 2px 12px 12px;
}

.product-id {
  margin: 0;
  color: #6a7892;
  font-size: 12px;
  font-weight: 600;
}

.product-title {
  margin: 8px 0 0;
  min-height: 48px;
  font-size: 19px;
  line-height: 1.3;
}

.product-price {
  margin: 10px 0 0;
  color: var(--primary-strong);
  font-family: 'Chakra Petch', sans-serif;
  font-size: 23px;
  font-weight: 700;
}

.product-cta {
  margin-top: 12px;
  width: 100%;
  border: 1px solid var(--line-color);
  border-radius: 10px;
  padding: 9px 12px;
  color: var(--text-main);
  font-weight: 600;
  background: #f7fbff;
  cursor: pointer;
}

.product-cta:hover {
  border-color: #bad0ed;
  background: #eef5ff;
}
</style>
