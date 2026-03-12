import Vue from 'vue'
import { shallowMount, Wrapper } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  it('renders props.msg', () => {
    const msg: string = 'Mini E-Commerce'
    const wrapper: Wrapper<Vue> = shallowMount(HelloWorld, {
      propsData: { msg }
    })

    expect(wrapper.text()).toContain(msg)
  })
})
