import store, { RootState } from '@/store'
import { Product } from '@/types/product'

describe('store product list', () => {
  it('contains products with id, title, price and image', () => {
    const rootState: RootState = store.state as RootState
    const products: Product[] = rootState.products

    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)

    products.forEach((product: Product): void => {
      expect(typeof product.id).toBe('string')
      expect(product.id.length).toBeGreaterThan(0)
      expect(typeof product.title).toBe('string')
      expect(product.title.length).toBeGreaterThan(0)
      expect(typeof product.price).toBe('number')
      expect(product.price).toBeGreaterThan(0)
      expect(typeof product.image).toBe('string')
      expect(product.image.length).toBeGreaterThan(0)
    })
  })
})
