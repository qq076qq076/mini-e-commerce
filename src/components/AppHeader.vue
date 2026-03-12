<template>
  <div class="top-nav-shell" :style="headerShellStyle">
    <header ref="topNav" :class="['top-nav', { 'is-scrolled': isHeaderScrolled }]">
      <a class="brand" href="#home">
        <span class="brand-mark">NG</span>
        <span class="brand-name">Nexus Gear</span>
      </a>
      <nav class="menu">
        <a href="#products">商品</a>
        <a href="#highlights">特色</a>
        <a href="#bundle">組合推薦</a>
        <a href="#faq">Q&amp;A</a>
      </nav>
      <div class="cart-wrapper">
        <button
          class="cart-button"
          data-test="cart-button"
          type="button"
          aria-label="購物車"
          @click="$emit('toggle-cart-preview')"
        >
          <span class="cart-icon" aria-hidden="true">🛒</span>
          <span v-if="cartItemCount > 0" class="cart-count" data-test="cart-count">
            {{ cartItemCount }}
          </span>
        </button>
        <CartPreview
          :visible="isCartPreviewVisible"
          :items="cartPreviewItems"
          :total-amount="cartTotalAmount"
          @update-item-quantity="$emit('update-cart-item-quantity', $event)"
          @remove-item="$emit('remove-cart-item', $event)"
        />
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CartPreview from '@/components/CartPreview.vue'
import { CartPreviewItem } from '@/types/cart'

const HEADER_SCROLL_THRESHOLD: number = 12

interface AppHeaderData {
  isHeaderScrolled: boolean
  headerHeight: number
}

export default Vue.extend({
  name: 'AppHeader',
  components: {
    CartPreview
  },
  props: {
    cartItemCount: {
      type: Number,
      required: true
    },
    cartPreviewItems: {
      type: Array as () => CartPreviewItem[],
      required: true
    },
    cartTotalAmount: {
      type: Number,
      required: true
    },
    isCartPreviewVisible: {
      type: Boolean,
      required: true
    }
  },
  data(): AppHeaderData {
    return {
      isHeaderScrolled: false,
      headerHeight: 0
    }
  },
  computed: {
    headerShellStyle(): { [key: string]: string } {
      if (!this.isHeaderScrolled) {
        return {}
      }

      return {
        height: `${this.headerHeight}px`
      }
    }
  },
  mounted(): void {
    window.addEventListener('resize', this.handleWindowResize, { passive: true })
    window.addEventListener('scroll', this.handleWindowScroll, { passive: true })
    this.syncHeaderHeight()
    this.handleWindowScroll()
  },
  beforeDestroy(): void {
    window.removeEventListener('resize', this.handleWindowResize)
    window.removeEventListener('scroll', this.handleWindowScroll)
  },
  methods: {
    syncHeaderHeight(): void {
      const headerElement: HTMLElement | undefined = this.$refs.topNav as HTMLElement | undefined

      this.headerHeight = headerElement ? headerElement.offsetHeight : 0
    },
    handleWindowResize(): void {
      this.syncHeaderHeight()
    },
    handleWindowScroll(): void {
      const currentScrollY: number = window.scrollY || window.pageYOffset || 0

      this.isHeaderScrolled = currentScrollY > HEADER_SCROLL_THRESHOLD
      this.syncHeaderHeight()
    }
  }
})
</script>

<style lang="scss" scoped>
.top-nav-shell {
  position: relative;
  z-index: 25;
}

.top-nav {
  position: relative;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1120px;
  margin: 0 auto 24px;
  padding: 14px 16px;
  box-sizing: border-box;
  border: 1px solid var(--line-color);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 18px rgba(7, 22, 43, 0.08);
  transition:
    margin 0.22s ease,
    padding 0.22s ease,
    border-radius 0.22s ease,
    border-color 0.22s ease,
    background-color 0.22s ease;
}

.top-nav.is-scrolled {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  max-width: none;
  margin: 0;
  padding: 14px var(--app-side-padding);
  border-left: none;
  border-right: none;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.98);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: #ffffff;
  font-family: 'Chakra Petch', sans-serif;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--accent));
}

.brand-name {
  font-family: 'Chakra Petch', sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.menu {
  display: flex;
  gap: 16px;
}

.menu a {
  color: var(--text-muted);
  font-size: 14px;
  text-decoration: none;
}

.menu a:hover {
  color: var(--text-main);
}

.cart-wrapper {
  position: relative;
  z-index: 30;
}

.cart-button {
  position: relative;
  border: none;
  border-radius: 12px;
  width: 46px;
  height: 46px;
  color: #ffffff;
  font-size: 22px;
  background: var(--primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cart-button:hover {
  background: var(--primary-strong);
}

.cart-icon {
  display: inline-block;
  transform: translateY(1px);
}

.cart-count {
  position: absolute;
  top: -7px;
  right: -7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  padding: 0 6px;
  color: #10315a;
  font-size: 12px;
  font-weight: 700;
  background: #f9d853;
  box-shadow: 0 0 0 2px #ffffff;
}

@media (max-width: 960px) {
  .top-nav {
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 14px;
  }

  .top-nav.is-scrolled {
    padding: 12px var(--app-side-padding);
  }

  .menu {
    order: 3;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
