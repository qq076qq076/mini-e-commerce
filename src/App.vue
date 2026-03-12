<template>
  <div id="app">
    <div class="ambient-shape ambient-shape-left"></div>
    <div class="ambient-shape ambient-shape-right"></div>

    <AppHeader
      :cart-item-count="cartItemCount"
      :cart-preview-items="cartPreviewItems"
      :cart-total-amount="cartTotalAmount"
      :is-cart-preview-visible="isCartPreviewVisible"
      @toggle-cart-preview="toggleCartPreview"
      @update-cart-item-quantity="updateCartItemQuantity"
      @remove-cart-item="removeCartItem"
    />

    <main>
      <section id="home" class="hero">
        <div class="hero-copy">
          <p class="hero-tag">2026 3C 質感選品</p>
          <h1 class="hero-title">讓每一次升級，都精準提升你的工作與娛樂體驗</h1>
          <p class="hero-description">
            從行動續航到桌面效率，我們專注挑選實用、耐用、兼具設計感的 3C 裝備，
            幫你一次配齊高頻使用情境。
          </p>
          <div class="hero-metrics">
            <article class="metric">
              <p class="metric-value">24H</p>
              <p class="metric-label">快速出貨</p>
            </article>
            <article class="metric">
              <p class="metric-value">12M</p>
              <p class="metric-label">原廠保固</p>
            </article>
            <article class="metric">
              <p class="metric-value">4.9★</p>
              <p class="metric-label">平均評分</p>
            </article>
          </div>
        </div>
        <aside v-if="heroProduct" class="hero-product">
          <p class="hero-product-label">本週主打</p>
          <img :src="heroProduct.image" :alt="heroProduct.title" class="hero-product-image" />
          <h2 class="hero-product-title">{{ heroProduct.title }}</h2>
          <p class="hero-product-id">SKU {{ heroProduct.id }}</p>
          <p class="hero-product-price">{{ formatPrice(heroProduct.price) }}</p>
        </aside>
      </section>

      <section id="highlights" class="highlights">
        <article v-for="item in highlightItems" :key="item.title" class="highlight-card">
          <p class="highlight-metric">{{ item.metric }}</p>
          <h3 class="highlight-title">{{ item.title }}</h3>
          <p class="highlight-description">{{ item.description }}</p>
        </article>
      </section>

      <section id="products" class="products">
        <div class="section-head">
          <p class="section-tag">Product Catalog</p>
          <h2>人氣 3C 商品</h2>
          <p>每款商品皆提供透明規格與價格，協助你快速做出最適合的選擇。</p>
        </div>
        <div class="product-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @select-product="openProductDialog"
          />
        </div>
      </section>

      <section id="faq" class="faq">
        <div class="section-head">
          <p class="section-tag">Support</p>
          <h2>常見問題</h2>
        </div>
        <article v-for="item in faqItems" :key="item.question" class="faq-item">
          <h3>{{ item.question }}</h3>
          <p>{{ item.answer }}</p>
        </article>
      </section>
    </main>

    <ProductDetailDialog
      :visible="isDialogVisible"
      :product="selectedProduct"
      @close="closeProductDialog"
      @add-to-cart="addProductToCart"
    />
    <AppToast :visible="isToastVisible" :message="toastMessage" />

    <footer class="footer">
      <p>Nexus Gear © 2026</p>
      <p>打造更聰明的 3C 消費體驗</p>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppToast from '@/components/AppToast.vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductDetailDialog from '@/components/ProductDetailDialog.vue'
import { Product } from '@/types/product'
import { GetterType, MutationType, RootGetters, RootState } from '@/store'
import {
  AddToCartPayload,
  CartPreviewItem,
  RemoveFromCartPayload,
  UpdateCartItemQuantityPayload
} from '@/types/cart'

const TOAST_DURATION_MS: number = 2500

interface AppData {
  selectedProduct: Product | null
  isDialogVisible: boolean
  isCartPreviewVisible: boolean
  isToastVisible: boolean
  toastMessage: string
  toastTimerId: number | null
}

interface HighlightItem {
  title: string
  description: string
  metric: string
}

interface FaqItem {
  question: string
  answer: string
}

const HIGHLIGHT_ITEMS: HighlightItem[] = [
  {
    title: '嚴選供應鏈',
    description: '專注品牌正貨與售後可追蹤，避免來源不明的平行輸入風險。',
    metric: '100%'
  },
  {
    title: '即時庫存',
    description: '熱門品項提供庫存與到貨狀態，減少下單後等待的不確定性。',
    metric: 'Live'
  },
  {
    title: '專人客服',
    description: '提供產品選購建議與規格對比，降低選錯設備的機會成本。',
    metric: '1 對 1'
  }
]

const FAQ_ITEMS: FaqItem[] = [
  {
    question: '下單後多久出貨？',
    answer: '平日 14:00 前完成付款，原則上當日出貨；偏遠地區約 2 至 3 個工作天送達。'
  },
  {
    question: '有提供保固與退換貨嗎？',
    answer: '全站商品皆依品牌保固政策提供保固，並享有 7 天鑑賞期退換貨服務。'
  }
]

export default Vue.extend({
  name: 'App',
  components: {
    AppHeader,
    AppToast,
    ProductCard,
    ProductDetailDialog
  },
  data(): AppData {
    return {
      selectedProduct: null,
      isDialogVisible: false,
      isCartPreviewVisible: false,
      isToastVisible: false,
      toastMessage: '',
      toastTimerId: null
    }
  },
  computed: {
    products(): Product[] {
      const rootState: RootState = this.$store.state as RootState

      return rootState.products
    },
    heroProduct(): Product | null {
      const products: Product[] = this.products

      return products.length > 0 ? products[0] : null
    },
    cartItemCount(): number {
      const rootGetters: RootGetters = this.$store.getters as RootGetters

      return rootGetters[GetterType.CART_ITEM_COUNT]
    },
    cartPreviewItems(): CartPreviewItem[] {
      const rootGetters: RootGetters = this.$store.getters as RootGetters

      return rootGetters[GetterType.CART_PREVIEW_ITEMS]
    },
    cartTotalAmount(): number {
      const rootGetters: RootGetters = this.$store.getters as RootGetters

      return rootGetters[GetterType.CART_TOTAL_AMOUNT]
    },
    highlightItems(): HighlightItem[] {
      return HIGHLIGHT_ITEMS
    },
    faqItems(): FaqItem[] {
      return FAQ_ITEMS
    }
  },
  beforeDestroy(): void {
    if (this.toastTimerId !== null) {
      window.clearTimeout(this.toastTimerId)
      this.toastTimerId = null
    }
  },
  methods: {
    openProductDialog(product: Product): void {
      this.selectedProduct = product
      this.isDialogVisible = true
    },
    closeProductDialog(): void {
      this.isDialogVisible = false
    },
    toggleCartPreview(): void {
      this.isCartPreviewVisible = !this.isCartPreviewVisible
    },
    getProductTitleById(productId: string): string {
      const product: Product | undefined = this.products.find(
        (item: Product): boolean => item.id === productId
      )

      return product ? product.title : '商品'
    },
    showToast(message: string): void {
      if (this.toastTimerId !== null) {
        window.clearTimeout(this.toastTimerId)
      }

      this.toastMessage = message
      this.isToastVisible = true
      this.toastTimerId = window.setTimeout((): void => {
        this.isToastVisible = false
        this.toastTimerId = null
      }, TOAST_DURATION_MS)
    },
    addProductToCart(payload: AddToCartPayload): void {
      const productTitle: string = this.getProductTitleById(payload.productId)

      this.$store.commit(MutationType.ADD_TO_CART, payload)
      this.closeProductDialog()
      this.showToast(`成功將 ${productTitle} 加入購物車`)
    },
    updateCartItemQuantity(payload: UpdateCartItemQuantityPayload): void {
      const productTitle: string = this.getProductTitleById(payload.productId)

      this.$store.commit(MutationType.UPDATE_CART_ITEM_QUANTITY, payload)
      this.showToast(`已更新 ${productTitle} 數量為 ${payload.quantity}`)
    },
    removeCartItem(payload: RemoveFromCartPayload): void {
      const productTitle: string = this.getProductTitleById(payload.productId)

      this.$store.commit(MutationType.REMOVE_FROM_CART, payload)
      this.showToast(`已從購物車移除 ${productTitle}`)
    },
    formatPrice(price: number): string {
      return `NT$ ${price}`
    }
  }
})
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap');

html,
body {
  scroll-behavior: smooth;
}

#app {
  --bg-main: #f3f7fb;
  --bg-surface: #ffffff;
  --bg-soft: #eef3f9;
  --text-main: #142033;
  --text-muted: #53627b;
  --line-color: #d5deea;
  --primary: #1a78ff;
  --primary-strong: #0b57c1;
  --accent: #0db17f;
  --app-side-padding: 20px;
  position: relative;
  padding: var(--app-side-padding) var(--app-side-padding) 48px;
  min-height: 100vh;
  color: var(--text-main);
  background:
    radial-gradient(circle at 10% 10%, #dceaff 0%, rgba(220, 234, 255, 0) 40%),
    radial-gradient(circle at 90% 0%, #daf8ef 0%, rgba(218, 248, 239, 0) 34%), var(--bg-main);
  font-family: 'Noto Sans TC', sans-serif;
  overflow: hidden;
}

.ambient-shape {
  position: absolute;
  z-index: 0;
  border-radius: 999px;
  filter: blur(70px);
  pointer-events: none;
}

.ambient-shape-left {
  top: -70px;
  left: -80px;
  width: 280px;
  height: 280px;
  background: rgba(26, 120, 255, 0.2);
}

.ambient-shape-right {
  top: 220px;
  right: -90px;
  width: 260px;
  height: 260px;
  background: rgba(13, 177, 127, 0.2);
}

main,
.footer {
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto;
}

.hero {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 18px;
  margin-bottom: 22px;
}

.hero-copy,
.hero-product {
  border: 1px solid var(--line-color);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(4px);
}

.hero-copy {
  padding: 26px;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 6px 10px;
  border-radius: 999px;
  color: var(--primary-strong);
  font-size: 13px;
  font-weight: 600;
  background: #e4efff;
}

.hero-title {
  margin: 14px 0 0;
  font-family: 'Chakra Petch', sans-serif;
  font-size: 42px;
  line-height: 1.15;
  letter-spacing: 0.01em;
}

.hero-description {
  margin: 14px 0 0;
  max-width: 95%;
  color: var(--text-muted);
  line-height: 1.65;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 22px;
}

.metric {
  padding: 12px;
  border: 1px solid #dde5f1;
  border-radius: 10px;
  background: #f8fbff;
}

.metric-value {
  margin: 0;
  font-family: 'Chakra Petch', sans-serif;
  font-size: 24px;
  font-weight: 700;
}

.metric-label {
  margin: 4px 0 0;
  color: var(--text-muted);
  font-size: 13px;
}

.hero-product {
  padding: 18px;
}

.hero-product-label {
  margin: 0;
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
}

.hero-product-image {
  display: block;
  margin-top: 10px;
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
}

.hero-product-title {
  margin: 12px 0 0;
  font-size: 24px;
}

.hero-product-id {
  margin: 8px 0 0;
  color: var(--text-muted);
  font-size: 14px;
}

.hero-product-price {
  margin: 8px 0 0;
  color: var(--primary-strong);
  font-family: 'Chakra Petch', sans-serif;
  font-size: 28px;
  font-weight: 700;
}

.highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 22px;
}

.highlight-card {
  padding: 16px;
  border: 1px solid var(--line-color);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.86);
}

.highlight-metric {
  margin: 0;
  color: var(--primary-strong);
  font-family: 'Chakra Petch', sans-serif;
  font-size: 30px;
  font-weight: 700;
}

.highlight-title {
  margin: 6px 0 0;
  font-size: 18px;
}

.highlight-description {
  margin: 8px 0 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.products {
  margin-bottom: 22px;
}

.section-head h2 {
  margin: 6px 0 0;
  font-family: 'Chakra Petch', sans-serif;
  font-size: 34px;
}

.section-head p {
  margin: 10px 0 0;
  color: var(--text-muted);
}

.section-tag {
  margin: 0;
  color: var(--primary);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.faq {
  margin-bottom: 22px;
}

.faq-item {
  margin-top: 10px;
  padding: 14px;
  border: 1px solid var(--line-color);
  border-radius: 12px;
  background: var(--bg-surface);
}

.faq-item h3 {
  margin: 0;
  font-size: 18px;
}

.faq-item p {
  margin: 8px 0 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--line-color);
  color: #6f7d92;
  font-size: 14px;
}

@media (max-width: 960px) {
  .hero,
  .highlights {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 34px;
  }

  .section-head h2 {
    font-size: 28px;
  }

  .footer {
    flex-direction: column;
    gap: 6px;
  }
}

@media (max-width: 620px) {
  #app {
    --app-side-padding: 14px;
    padding: var(--app-side-padding) var(--app-side-padding) 30px;
  }

  .hero-copy {
    padding: 18px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
