import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'

Vue.use(Vuex)

export interface RootState {}

const store: StoreOptions<RootState> = {
  state: {},
  mutations: {},
  actions: {},
  modules: {}
}

export default new Vuex.Store<RootState>(store)
