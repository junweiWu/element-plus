import { computed } from 'vue'
import { NOOP } from '@vue/shared'
import { buildProps, definePropType } from '@element-plus/utils'
import type {
  DshCascaderConfig,
  DshCascaderOption,
  DshCascaderProps,
  DshCascaderValue,
} from './node'

export const DshCommonProps = buildProps({
  /**
   * @description specify which key of node object is used as the node's value
   */
  modelValue: {
    type: definePropType<DshCascaderValue>([Number, String, Array]),
  },
  /**
   * @description data of the options, the key of `value` and `label` can be customize by `DshCascaderProps`.
   */
  options: {
    type: definePropType<DshCascaderOption[]>(Array),
    default: () => [] as DshCascaderOption[],
  },
  /**
   * @description configuration options, see the following `DshCascaderProps` table.
   */
  props: {
    type: definePropType<DshCascaderProps>(Object),
    default: () => ({} as DshCascaderProps),
  },
} as const)

export const DshDefaultProps: DshCascaderConfig = {
  /**
   * @description trigger mode of expanding options
   */
  expandTrigger: 'click',
  /**
   * @description whether multiple selection is enabled
   */
  multiple: false,
  /**
   * @description whether checked state of a node not affects its parent and child nodes
   */
  checkStrictly: false, // whether all nodes can be selected
  /**
   * @description when checked nodes change, whether to emit an array of node's path, if false, only emit the value of node.
   */
  emitPath: true, // wether to emit an array of all levels value in which node is located
  /**
   * @description whether to dynamic load child nodes, use with `lazyload` attribute
   */
  lazy: false,
  /**
   * @description method for loading child nodes data, only works when `lazy` is true
   */
  lazyLoad: NOOP,
  /**
   * @description specify which key of node object is used as the node's value
   */
  value: 'value',
  /**
   * @description specify which key of node object is used as the node's label
   */
  label: 'label',
  /**
   * @description specify which key of node object is used as the node's children
   */
  children: 'children',
  /**
   * @description specify which key of node object is used as the node's leaf
   */
  leaf: 'leaf',
  /**
   * @description specify which key of node object is used as the node's disabled
   */
  disabled: 'disabled',
  /**
   * @description hover threshold of expanding options
   */
  hoverThreshold: 500,
}

export const DshUseCascaderConfig = (props: { props: DshCascaderProps }) => {
  return computed(() => ({
    ...DshDefaultProps,
    ...props.props,
  }))
}
