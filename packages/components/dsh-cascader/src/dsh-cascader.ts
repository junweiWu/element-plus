import { DshCommonProps } from '@element-plus/components/dsh-cascader-panel'
import { buildProps, definePropType, isBoolean } from '@element-plus/utils'
import { useSizeProp } from '@element-plus/hooks'
import { useTooltipContentProps } from '@element-plus/components/tooltip'
import { tagProps } from '@element-plus/components/tag'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import type {
  DshCascaderNode,
  DshCascaderValue,
} from '@element-plus/components/dsh-cascader-panel'

export const dshCascaderProps = buildProps({
  ...DshCommonProps,
  /**
   * @description size of input
   */
  size: useSizeProp,
  /**
   * @description placeholder of input
   */
  placeholder: String,
  /**
   * @description whether Cascader is disabled
   */
  disabled: Boolean,
  /**
   * @description whether selected value can be cleared
   */
  clearable: Boolean,
  /**
   * @description whether the options can be searched
   */
  filterable: Boolean,
  /**
   * @description customize search logic, the first parameter is `node`, the second is `keyword`, and need return a boolean value indicating whether it hits.
   */
  filterMethod: {
    type: definePropType<(node: DshCascaderNode, keyword: string) => boolean>(
      Function
    ),
    default: (node: DshCascaderNode, keyword: string) =>
      node.text.includes(keyword),
  },
  /**
   * @description option label separator
   */
  separator: {
    type: String,
    default: ' / ',
  },
  /**
   * @description whether to display all levels of the selected value in the input
   */
  showAllLevels: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether to collapse tags in multiple selection mode
   */
  collapseTags: Boolean,
  /**
   * @description The max tags number to be shown. To use this, collapse-tags must be true
   */
  maxCollapseTags: {
    type: Number,
    default: 1,
  },
  /**
   * @description native input id
   */
  collapseTagsTooltip: {
    type: Boolean,
    default: false,
  },
  /**
   * @description debounce delay when typing filter keyword, in milliseconds
   */
  debounce: {
    type: Number,
    default: 300,
  },
  /**
   * @description hook function before filtering with the value to be filtered as its parameter. If `false` is returned or a `Promise` is returned and then is rejected, filtering will be aborted
   */
  beforeFilter: {
    type: definePropType<(value: string) => boolean | Promise<any>>(Function),
    default: () => true,
  },
  /**
   * @description custom class name for Cascader's dropdown
   */
  popperClass: {
    type: String,
    default: '',
  },
  /**
   * @description whether cascader popup is teleported
   */
  teleported: useTooltipContentProps.teleported,
  /**
   * @description tag type
   */
  // eslint-disable-next-line vue/require-prop-types
  tagType: { ...tagProps.type, default: 'info' },
  /**
   * @description whether to trigger form validation
   */
  validateEvent: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 显示底部按钮
   */
  showFoot: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 显示只选此项
   */
  onlyThis: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 宽度
   */
  width: {
    type: String,
    default: '100%',
  },
  /**
   * @description 聚焦时宽度
   */
  focusWidth: {
    type: String,
    default: '100%',
  },
})

export const dshCascaderEmits = {
  [UPDATE_MODEL_EVENT]: (val: DshCascaderValue) => !!val || val === null,
  [CHANGE_EVENT]: (val: DshCascaderValue) => !!val || val === null,
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  visibleChange: (val: boolean) => isBoolean(val),
  expandChange: (val: DshCascaderValue) => !!val,
  removeTag: (val: DshCascaderNode['valueByOption']) => !!val,
  confirm: (val: DshCascaderValue) => !!val || val === null,
  cancel: (val: DshCascaderValue) => !!val || val === null,
}

// Type name is taken(cascader-panel/src/node), needs discussion
// export type dshCascaderProps = ExtractPropTypes<typeof dshCascaderProps>

export type DshCascaderEmits = typeof dshCascaderEmits
