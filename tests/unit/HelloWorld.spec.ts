import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  it('renders props.msg', () => {
    const msg = 'Mini E-Commerce'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })

    expect(wrapper.text()).toContain(msg)
  })
})
