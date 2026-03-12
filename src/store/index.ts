import Vue from 'vue'
import Vuex, { Store, StoreOptions } from 'vuex'
import { Product } from '@/types/product'
import {
  AddToCartPayload,
  CartItem,
  RemoveFromCartPayload,
  UpdateCartItemQuantityPayload
} from '@/types/cart'
import { productService, ProductService } from '@/services/productService'

Vue.use(Vuex)

export interface RootState {
  products: Product[]
  cartItems: CartItem[]
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

const createStoreOptions = (service: ProductService): StoreOptions<RootState> => {
  return {
    state: createState(service),
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
