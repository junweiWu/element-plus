// @ts-nocheck
import type { InjectionKey, VNode } from 'vue'
import type { Nullable } from '@element-plus/utils'
import type {
  default as DshCascaderNode,
  DshCascaderOption,
  DshCascaderProps,
  DshExpandTrigger,
} from './node'

export type {
  DshCascaderNode,
  DshCascaderOption,
  DshCascaderProps,
  DshExpandTrigger,
}

export type DshCascaderNodeValue = string | number
export type DshCascaderNodePathValue = DshCascaderNodeValue[]
export type DshCascaderValue =
  | DshCascaderNodeValue
  | DshCascaderNodePathValue
  | (DshCascaderNodeValue | DshCascaderNodePathValue)[]
export type DshCascaderConfig = Required<DshCascaderProps>
export type DshIsDisabled = (
  data: DshCascaderOption,
  node: DshCascaderNode
) => boolean
export type DshIsLeaf = (
  data: DshCascaderOption,
  node: DshCascaderNode
) => boolean
export type DshResolve = (dataList?: DshCascaderOption[]) => void
export type DshLazyLoad = (node: DshCascaderNode, resolve: DshResolve) => void
export type DshRenderLabel = ({
  node: DshCascaderNode,
  data: DshCascaderOption,
}) => VNode | VNode[]

export interface DshTag {
  node?: DshCascaderNode
  key: number
  text: string
  hitState?: boolean
  closable: boolean
  isCollapseTag: boolean
}

export interface DshCascaderPanelContext {
  config: DshCascaderConfig
  expandingNode: Nullable<DshCascaderNode>
  checkedNodes: DshCascaderNode[]
  isHoverMenu: boolean
  initialLoaded: boolean
  renderLabelFn: DshRenderLabel
  lazyLoad: (
    node?: DshCascaderNode,
    cb?: (dataList: DshCascaderOption[]) => void
  ) => void
  expandNode: (node: DshCascaderNode, silent?: boolean) => void
  handleCheckChange: (
    node: DshCascaderNode,
    checked: boolean,
    emitClose?: boolean
  ) => void
}

export const DSH_CASCADER_PANEL_INJECTION_KEY: InjectionKey<DshCascaderPanelContext> =
  Symbol()
