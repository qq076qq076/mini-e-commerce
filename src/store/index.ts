import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import productsData from '@/data/products'
import { Product } from '@/types/product'

Vue.use(Vuex)

export interface RootState {
  products: Product[]
}

const state: RootState = {
  products: productsData
}

const storeOptions: StoreOptions<RootState> = {
  state,
  mutations: {},
  actions: {},
  modules: {}
}

export default new Vuex.Store<RootState>(storeOptions)
