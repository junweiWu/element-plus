import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import DshCascader from '../src/dsh-cascader.vue'

const AXIOM = 'Rem is the best girl'

describe('DshCascader.vue', () => {
  test('render test', () => {
    const wrapper = mount(() => <DshCascader>{AXIOM}</DshCascader>)

    expect(wrapper.text()).toEqual(AXIOM)
  })
})
