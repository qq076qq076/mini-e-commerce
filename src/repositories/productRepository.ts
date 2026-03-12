import productsData from '@/data/products'
import { Product } from '@/types/product'

export interface ProductRepository {
  getAll(): Product[]
}

const cloneProduct = (product: Product): Product => {
  return {
    ...product
  }
}

export class InMemoryProductRepository implements ProductRepository {
  private readonly products: Product[]

  constructor(seedProducts: Product[] = productsData) {
    this.products = seedProducts.map((product: Product): Product => cloneProduct(product))
  }

  getAll(): Product[] {
    return this.products.map((product: Product): Product => cloneProduct(product))
  }
}

export const productRepository: ProductRepository = new InMemoryProductRepository()
