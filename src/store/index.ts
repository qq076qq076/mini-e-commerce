import Vue from 'vue'
import Vuex, { Store, StoreOptions } from 'vuex'
import productsData from '@/data/products'
import { Product } from '@/types/product'
import {
  AddToCartPayload,
  CartItem,
  RemoveFromCartPayload,
  UpdateCartItemQuantityPayload
} from '@/types/cart'

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

const createState = (): RootState => {
  const products: Product[] = productsData.map((product: Product): Product => ({ ...product }))

  return {
    products,
    cartItems: []
  }
}

const storeOptions: StoreOptions<RootState> = {
  state: createState(),
  mutations: {
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
  },
  actions: {},
  modules: {}
}

export const createStore = (): Store<RootState> => {
  const options: StoreOptions<RootState> = {
    ...storeOptions,
    state: createState()
  }

  return new Vuex.Store<RootState>(options)
}

export default createStore()
