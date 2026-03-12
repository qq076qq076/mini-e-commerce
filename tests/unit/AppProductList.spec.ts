import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils'
import App from '@/App.vue'
import { Product } from '@/types/product'
import { RootState } from '@/store'

describe('App product list', () => {
  it('renders product id, title, price and image', () => {
    const mockProducts: Product[] = [
      {
        id: 'P-1001',
        title: '測試商品 A',
        price: 1000,
        image: 'https://picsum.photos/seed/p1001/320/180'
      },
      {
        id: 'P-1002',
        title: '測試商品 B',
        price: 2500,
        image: 'https://picsum.photos/seed/p1002/320/180'
      }
    ]
    const mockState: RootState = {
      products: mockProducts
    }
    const localVue: ReturnType<typeof createLocalVue> = createLocalVue()

    localVue.use(Vuex)

    const store: Store<RootState> = new Vuex.Store<RootState>({
      state: mockState
    })
    const wrapper: Wrapper<Vue> = mount(App, {
      localVue,
      store
    })
    const productCards: WrapperArray<Vue> = wrapper.findAll('[data-test="product-card"]')

    expect(productCards.length).toBe(mockProducts.length)

    mockProducts.forEach((product: Product, index: number): void => {
      const card: Wrapper<Vue> | undefined = productCards.at(index)

      expect(card).toBeDefined()
      expect(card ? card.find('[data-test="product-id"]').text() : '').toContain(product.id)
      expect(card ? card.find('[data-test="product-title"]').text() : '').toBe(product.title)
      expect(card ? card.find('[data-test="product-price"]').text() : '').toContain(
        product.price.toString()
      )
      expect(card ? card.find('[data-test="product-image"]').attributes('src') : '').toBe(
        product.image
      )
    })
  })
})
