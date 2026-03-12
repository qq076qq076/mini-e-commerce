<template>
  <div
    v-if="visible && product"
    class="dialog-overlay"
    data-test="product-detail-dialog"
    @click.self="closeDialog"
  >
    <section class="dialog-panel">
      <button class="close-btn" type="button" aria-label="關閉" @click="closeDialog">×</button>
      <img :src="product.image" :alt="product.title" class="dialog-image" />
      <p class="dialog-id">SKU {{ product.id }}</p>
      <h3 class="dialog-title">{{ product.title }}</h3>
      <p class="dialog-price">{{ formatPrice(product.price) }}</p>

      <label class="quantity-label" for="quantity-input">購買數量（必填）</label>
      <NumberStepperInput
        id="quantity-input"
        v-model="quantityInput"
        class="quantity-input"
        input-data-test="quantity-input"
        :min="1"
        :step="1"
        :required="true"
      />
      <p v-if="validationMessage" class="validation-message">{{ validationMessage }}</p>

      <button class="confirm-btn" data-test="add-to-cart-btn" type="button" @click="addToCart">
        加到購物車
      </button>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NumberStepperInput from '@/components/NumberStepperInput.vue'
import { Product } from '@/types/product'

interface ProductDetailDialogData {
  quantityInput: number
  validationMessage: string
}

export default Vue.extend({
  name: 'ProductDetailDialog',
  components: {
    NumberStepperInput
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    product: {
      type: Object as () => Product | null,
      default: null
    }
  },
  data(): ProductDetailDialogData {
    return {
      quantityInput: 1,
      validationMessage: ''
    }
  },
  watch: {
    visible(isVisible: boolean): void {
      if (isVisible) {
        this.resetInput()
      }
    },
    product(): void {
      this.resetInput()
    }
  },
  methods: {
    resetInput(): void {
      this.quantityInput = 1
      this.validationMessage = ''
    },
    closeDialog(): void {
      this.$emit('close')
    },
    formatPrice(price: number): string {
      return `NT$ ${price}`
    },
    addToCart(): void {
      const parsedQuantity: number = Number(this.quantityInput)

      if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
        this.validationMessage = '請輸入 1 以上的整數數量'
        return
      }

      const currentProduct: Product | null = this.product as Product | null

      if (!currentProduct) {
        this.validationMessage = '目前沒有可加入的商品'
        return
      }

      this.validationMessage = ''
      this.$emit('add-to-cart', {
        productId: currentProduct.id,
        quantity: parsedQuantity
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(7, 19, 35, 0.55);
}

.dialog-panel {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 18px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(7, 19, 35, 0.28);
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  color: #34445d;
  background: #edf2f8;
  font-size: 20px;
  line-height: 20px;
  cursor: pointer;
}

.dialog-image {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.dialog-id {
  margin: 10px 0 0;
  color: #667892;
  font-size: 12px;
  font-weight: 600;
}

.dialog-title {
  margin: 8px 0 0;
  font-size: 24px;
}

.dialog-price {
  margin: 8px 0 0;
  color: #0b57c1;
  font-size: 24px;
  font-weight: 700;
}

.quantity-label {
  display: block;
  margin-top: 14px;
  font-size: 13px;
  font-weight: 600;
}

.quantity-input {
  margin-top: 6px;
}

.validation-message {
  margin: 8px 0 0;
  color: #c73838;
  font-size: 13px;
}

.confirm-btn {
  margin-top: 14px;
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 11px 12px;
  color: #ffffff;
  font-weight: 700;
  background: #1a78ff;
  cursor: pointer;
}

.confirm-btn:hover {
  background: #0b57c1;
}
</style>
