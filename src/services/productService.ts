import { productRepository, ProductRepository } from '@/repositories/productRepository'
import { Product } from '@/types/product'

export interface ProductService {
  getProducts(): Product[]
}

export class DefaultProductService implements ProductService {
  private readonly repository: ProductRepository

  constructor(repository: ProductRepository = productRepository) {
    this.repository = repository
  }

  getProducts(): Product[] {
    return this.repository.getAll()
  }
}

export const productService: ProductService = new DefaultProductService()
