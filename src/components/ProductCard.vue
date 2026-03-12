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
