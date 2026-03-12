import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils'
import App from '@/App.vue'
import { createStore, RootState } from '@/store'
import { Product } from '@/types/product'

describe('App feature three', () => {
  it('shows cart preview with item list, price, quantity and total amount', async () => {
    const localVue: ReturnType<typeof createLocalVue> = createLocalVue()

    localVue.use(Vuex)

    const quantity: number = 3
    const testStore: Store<RootState> = createStore()
    const firstProduct: Product | undefined = testStore.state.products[0]
    const wrapper: Wrapper<Vue> = mount(App, {
      localVue,
      store: testStore
    })
    const productCards: WrapperArray<Vue> = wrapper.findAll('[data-test="product-card"]')
    const cartButton: Wrapper<Vue> = wrapper.find('[data-test="cart-button"]')

    expect(firstProduct).toBeDefined()
    expect(productCards.length).toBeGreaterThan(0)

    await productCards.at(0)?.trigger('click')
    await Vue.nextTick()

    const quantityInput: Wrapper<Vue> = wrapper.find('[data-test="quantity-input"]')
    const addToCartButton: Wrapper<Vue> = wrapper.find('[data-test="add-to-cart-btn"]')

    await quantityInput.setValue(quantity.toString())
    await addToCartButton.trigger('click')
    await Vue.nextTick()
    await cartButton.trigger('click')
    await Vue.nextTick()

    const preview: Wrapper<Vue> = wrapper.find('[data-test="cart-preview"]')
    const itemTitle: string = wrapper.find('[data-test="cart-item-title"]').text()
    const itemPrice: string = wrapper.find('[data-test="cart-item-price"]').text()
    const quantityInputInCart: Wrapper<Vue> = wrapper.find('[data-test="cart-item-quantity-input"]')
    const itemQuantity: string = (quantityInputInCart.element as HTMLInputElement).value
    const totalAmount: string = wrapper.find('[data-test="cart-total"]').text()
    const expectedPrice: number = firstProduct ? firstProduct.price : 0
    const expectedTotalAmount: number = expectedPrice * quantity

    expect(preview.exists()).toBe(true)
    expect(itemTitle).toBe(firstProduct ? firstProduct.title : '')
    expect(itemPrice).toContain(expectedPrice.toString())
    expect(itemQuantity).toBe(quantity.toString())
    expect(totalAmount).toContain(expectedTotalAmount.toString())
  })

  it('updates quantity and removes item in cart preview', async () => {
    const localVue: ReturnType<typeof createLocalVue> = createLocalVue()

    localVue.use(Vuex)

    const testStore: Store<RootState> = createStore()
    const firstProduct: Product | undefined = testStore.state.products[0]
    const wrapper: Wrapper<Vue> = mount(App, {
      localVue,
      store: testStore
    })
    const productCards: WrapperArray<Vue> = wrapper.findAll('[data-test="product-card"]')
    const cartButton: Wrapper<Vue> = wrapper.find('[data-test="cart-button"]')

    expect(firstProduct).toBeDefined()
    expect(productCards.length).toBeGreaterThan(0)

    await productCards.at(0)?.trigger('click')
    await Vue.nextTick()

    const dialogQuantityInput: Wrapper<Vue> = wrapper.find('[data-test="quantity-input"]')
    const addToCartButton: Wrapper<Vue> = wrapper.find('[data-test="add-to-cart-btn"]')

    await dialogQuantityInput.setValue('1')
    await addToCartButton.trigger('click')
    await Vue.nextTick()
    await cartButton.trigger('click')
    await Vue.nextTick()

    const previewQuantityInput: Wrapper<Vue> = wrapper.find('[data-test="cart-item-quantity-input"]')

    await previewQuantityInput.setValue('4')
    await previewQuantityInput.trigger('change')
    await Vue.nextTick()

    const updatedCartCount: string = wrapper.find('[data-test="cart-count"]').text()
    const updatedTotal: string = wrapper.find('[data-test="cart-total"]').text()
    const expectedUpdatedTotalAmount: number = (firstProduct ? firstProduct.price : 0) * 4

    expect(updatedCartCount).toBe('4')
    expect(updatedTotal).toContain(expectedUpdatedTotalAmount.toString())

    const removeButton: Wrapper<Vue> = wrapper.find('[data-test="cart-item-remove-btn"]')

    await removeButton.trigger('click')
    await Vue.nextTick()

    expect(wrapper.findAll('[data-test="cart-preview-item"]').length).toBe(0)
    expect(wrapper.find('[data-test="cart-empty-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="cart-count"]').exists()).toBe(false)
  })
})
