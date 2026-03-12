import Vue from 'vue'
import Vuex, { Store, StoreOptions } from 'vuex'
import { Product } from '@/types/product'
import {
  AddToCartPayload,
  CartItem,
  CartPreviewItem,
  RemoveFromCartPayload,
  UpdateCartItemQuantityPayload
} from '@/types/cart'
import { productService, ProductService } from '@/services/productService'

Vue.use(Vuex)

export interface RootState {
  products: Product[]
  cartItems: CartItem[]
}

export enum GetterType {
  CART_ITEM_COUNT = 'cartItemCount',
  CART_PREVIEW_ITEMS = 'cartPreviewItems',
  CART_TOTAL_AMOUNT = 'cartTotalAmount'
}

export interface RootGetters {
  [GetterType.CART_ITEM_COUNT]: number
  [GetterType.CART_PREVIEW_ITEMS]: CartPreviewItem[]
  [GetterType.CART_TOTAL_AMOUNT]: number
}

export enum MutationType {
  ADD_TO_CART = 'ADD_TO_CART',
  UPDATE_CART_ITEM_QUANTITY = 'UPDATE_CART_ITEM_QUANTITY',
  REMOVE_FROM_CART = 'REMOVE_FROM_CART'
}

const createState = (service: ProductService): RootState => {
  const products: Product[] = service.getProducts()

  return {
    products,
    cartItems: []
  }
}

const mutations: StoreOptions<RootState>['mutations'] = {
  [MutationType.ADD_TO_CART](state: RootState, payload: AddToCartPayload): void {
    if (payload.quantity <= 0) {
      return
    }

    const existingItem: CartItem | undefined = state.cartItems.find(
      (item: CartItem): boolean => item.productId === payload.productId
    )

    if (existingItem) {
      existingItem.quantity += payload.quantity
      return
    }

    const newItem: CartItem = {
      productId: payload.productId,
      quantity: payload.quantity
    }

    state.cartItems.push(newItem)
  },
  [MutationType.UPDATE_CART_ITEM_QUANTITY](
    state: RootState,
    payload: UpdateCartItemQuantityPayload
  ): void {
    if (payload.quantity <= 0) {
      return
    }

    const existingItem: CartItem | undefined = state.cartItems.find(
      (item: CartItem): boolean => item.productId === payload.productId
    )

    if (!existingItem) {
      return
    }

    existingItem.quantity = payload.quantity
  },
  [MutationType.REMOVE_FROM_CART](state: RootState, payload: RemoveFromCartPayload): void {
    state.cartItems = state.cartItems.filter(
      (item: CartItem): boolean => item.productId !== payload.productId
    )
  }
}

const getters: StoreOptions<RootState>['getters'] = {
  [GetterType.CART_ITEM_COUNT](state: RootState): number {
    return state.cartItems.reduce(
      (total: number, cartItem: CartItem): number => total + cartItem.quantity,
      0
    )
  },
  [GetterType.CART_PREVIEW_ITEMS](state: RootState): CartPreviewItem[] {
    return state.cartItems.map((cartItem: CartItem): CartPreviewItem => {
      const product: Product | undefined = state.products.find(
        (item: Product): boolean => item.id === cartItem.productId
      )
      const title: string = product ? product.title : '未知商品'
      const price: number = product ? product.price : 0

      return {
        productId: cartItem.productId,
        title,
        price,
        quantity: cartItem.quantity,
        subtotal: price * cartItem.quantity
      }
    })
  },
  [GetterType.CART_TOTAL_AMOUNT](
    _state: RootState,
    localGetters: { [key: string]: unknown }
  ): number {
    const previewItems: CartPreviewItem[] = localGetters[
      GetterType.CART_PREVIEW_ITEMS
    ] as CartPreviewItem[]

    return previewItems.reduce(
      (total: number, previewItem: CartPreviewItem): number => total + previewItem.subtotal,
      0
    )
  }
}

const createStoreOptions = (service: ProductService): StoreOptions<RootState> => {
  return {
    state: createState(service),
    getters,
    mutations,
    actions: {},
    modules: {}
  }
}

export const createStore = (service: ProductService = productService): Store<RootState> => {
  const options: StoreOptions<RootState> = createStoreOptions(service)

  return new Vuex.Store<RootState>(options)
}

export default createStore()
