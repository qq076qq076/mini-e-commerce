<template>
  <transition name="cart-preview-fade">
    <section v-if="visible" class="cart-preview" data-test="cart-preview">
      <header class="cart-preview-header">
        <h3>購物車預覽</h3>
      </header>

      <div v-if="items.length > 0" class="cart-preview-content">
        <ul class="cart-item-list">
          <li
            v-for="item in items"
            :key="item.productId"
            class="cart-item"
            data-test="cart-preview-item"
          >
            <p class="item-title" data-test="cart-item-title">{{ item.title }}</p>
            <div class="item-meta">
              <p>
                單價：
                <span data-test="cart-item-price">{{ formatPrice(item.price) }}</span>
              </p>
              <div class="item-quantity-row">
                <label class="item-quantity-label" :for="`cart-qty-${item.productId}`">數量：</label>
                <NumberStepperInput
                  :id="`cart-qty-${item.productId}`"
                  class="item-quantity-input"
                  :value="item.quantity"
                  :min="1"
                  :step="1"
                  input-data-test="cart-item-quantity-input"
                  @input="updateQuantity(item.productId, $event)"
                />
              </div>
              <p>
                小計：
                <span>{{ formatPrice(item.subtotal) }}</span>
              </p>
            </div>
            <button
              class="remove-item-btn"
              data-test="cart-item-remove-btn"
              type="button"
              @click="removeItem(item.productId)"
            >
              刪除
            </button>
          </li>
        </ul>
      </div>
      <p v-else class="empty-message" data-test="cart-empty-message">購物車目前沒有商品</p>

      <footer class="cart-summary">
        <span>總金額</span>
        <strong data-test="cart-total">{{ formatPrice(totalAmount) }}</strong>
      </footer>
    </section>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import NumberStepperInput from '@/components/NumberStepperInput.vue'
import { CartPreviewItem } from '@/types/cart'

export default Vue.extend({
  name: 'CartPreview',
  components: {
    NumberStepperInput
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    items: {
      type: Array as () => CartPreviewItem[],
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  methods: {
    updateQuantity(productId: string, quantityValue: number): void {
      const parsedQuantity: number = Number(quantityValue)

      if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
        return
      }

      this.$emit('update-item-quantity', {
        productId,
        quantity: parsedQuantity
      })
    },
    removeItem(productId: string): void {
      this.$emit('remove-item', { productId })
    },
    formatPrice(value: number): string {
      return `NT$ ${value}`
    }
  }
})
</script>

<style lang="scss" scoped>
.cart-preview {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 40;
  width: min(92vw, 360px);
  max-height: 420px;
  overflow: auto;
  border: 1px solid #c9d8eb;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(10, 31, 58, 0.22);
}

.cart-preview-header {
  position: sticky;
  top: 0;
  padding: 12px 14px;
  border-bottom: 1px solid #e1e9f4;
  background: #f8fbff;
}

.cart-preview-header h3 {
  margin: 0;
  font-size: 17px;
}

.cart-preview-content {
  padding: 8px 10px;
}

.cart-item-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.cart-item {
  padding: 10px;
  border-radius: 10px;
  background: #f9fcff;
}

.cart-item + .cart-item {
  margin-top: 8px;
}

.item-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.item-meta {
  margin-top: 8px;
}

.item-meta p {
  margin: 0;
  color: #44546d;
  font-size: 13px;
  line-height: 1.5;
}

.item-quantity-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 2px 0;
  color: #44546d;
  font-size: 13px;
}

.item-quantity-label {
  white-space: nowrap;
}

.item-quantity-input {
  width: 134px;
}

.remove-item-btn {
  margin-top: 8px;
  border: 1px solid #d8e3f0;
  border-radius: 8px;
  padding: 6px 10px;
  color: #385272;
  font-size: 12px;
  font-weight: 600;
  background: #ffffff;
  cursor: pointer;
}

.remove-item-btn:hover {
  border-color: #b9cce5;
  color: #253b58;
  background: #f5f9ff;
}

.empty-message {
  margin: 0;
  padding: 22px 14px;
  color: #607189;
  text-align: center;
}

.cart-summary {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px;
  border-top: 1px solid #e1e9f4;
  background: #ffffff;
}

.cart-summary strong {
  color: #0b57c1;
  font-size: 18px;
}

.cart-preview-fade-enter-active,
.cart-preview-fade-leave-active {
  transition: all 0.18s ease;
}

.cart-preview-fade-enter,
.cart-preview-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
