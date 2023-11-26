// @ts-nocheck
import { defineComponent, h } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { definePropType } from '@element-plus/utils'
export default defineComponent({
  name: 'NodeContent',
  props: {
    onlyCheck: {
      type: definePropType<() => boolean>(Function),
      default: () => {
        // console.log('按钮被点击了')
      },
    },
  },
  setup() {
    const ns = useNamespace('cascader-node')
    return {
      ns,
    }
  },
  render() {
    const { ns } = this
    const { node, panel, onlyThis } = this.$parent
    const { data, label } = node
    const { renderLabelFn } = panel
    return h(
      'span',
      { class: ns.e('label') },
      renderLabelFn
        ? renderLabelFn({ node, data })
        : !onlyThis
        ? label
        : [
            h('div', { class: 'ak-justify-between' }, [
              h('span', { class: 'cascader-item-label' }, label),
              data.value !== 'cascader-all'
                ? h('div', { class: 'select-tag', onClick: this.onlyCheck }, [
                    h('span', {}, '仅筛选此项'),
                  ])
                : '',
            ]),
          ]
    )
  },
})
