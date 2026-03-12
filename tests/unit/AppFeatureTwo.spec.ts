import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import App from '@/App.vue'
import { createStore, RootState } from '@/store'

describe('App feature two', () => {
  it('opens product detail dialog when product card is clicked', async () => {
    const localVue: ReturnType<typeof createLocalVue> = createLocalVue()

    localVue.use(Vuex)

    const testStore: Store<RootState> = createStore()
    const wrapper: Wrapper<Vue> = mount(App, {
      localVue,
      store: testStore
    })
    const productCard: Wrapper<Vue> = wrapper.find('[data-test="product-card"]')

    await productCard.trigger('click')
    await Vue.nextTick()

    expect(wrapper.find('[data-test="product-detail-dialog"]').exists()).toBe(true)
  })

  it('shows cart count after adding product with quantity', async () => {
    const localVue: ReturnType<typeof createLocalVue> = createLocalVue()

    localVue.use(Vuex)

    const testStore: Store<RootState> = createStore()
    const wrapper: Wrapper<Vue> = mount(App, {
      localVue,
      store: testStore
    })
    const productCard: Wrapper<Vue> = wrapper.find('[data-test="product-card"]')
    const productTitle: string = wrapper.find('[data-test="product-title"]').text()

    await productCard.trigger('click')
    await Vue.nextTick()

    const quantityInput: Wrapper<Vue> = wrapper.find('[data-test="quantity-input"]')
    const addToCartButton: Wrapper<Vue> = wrapper.find('[data-test="add-to-cart-btn"]')

    await quantityInput.setValue('2')
    await addToCartButton.trigger('click')
    await Vue.nextTick()

    const toast: Wrapper<Vue> = wrapper.find('[data-test="toast"]')

    expect(wrapper.find('[data-test="cart-count"]').text()).toBe('2')
    expect(toast.exists()).toBe(true)
    expect(toast.text()).toContain('成功將')
    expect(toast.text()).toContain(productTitle)
    expect(toast.text()).toContain('加入購物車')
  })
})
