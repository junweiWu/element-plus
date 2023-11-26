// @ts-nocheck
import { isFunction } from '@vue/shared'
import { capitalize, isEmpty, isUndefined } from '@element-plus/utils'
import type { VNode } from 'vue'

export type DshCascaderNodeValue = string | number
export type DshCascaderNodePathValue = DshCascaderNodeValue[]
export type DshCascaderValue =
  | DshCascaderNodeValue
  | DshCascaderNodePathValue
  | (DshCascaderNodeValue | DshCascaderNodePathValue)[]
export type DshCascaderConfig = Required<DshCascaderProps>
export type DshExpandTrigger = 'click' | 'hover'
export type DshIsDisabled = (data: DshCascaderOption, node: DshNode) => boolean
export type DshIsLeaf = (data: DshCascaderOption, node: DshNode) => boolean
export type DshResolve = (dataList?: DshCascaderOption[]) => void
export type DshLazyLoad = (node: DshNode, resolve: DshResolve) => void
export type DshRenderLabel = ({
  node: DshNode,
  data: DshCascaderOption,
}) => VNode | VNode[]
export interface DshCascaderOption extends Record<string, unknown> {
  label?: string
  value?: DshCascaderNodeValue
  children?: DshCascaderOption[]
  disabled?: boolean
  leaf?: boolean
}

export interface DshCascaderProps {
  expandTrigger?: DshExpandTrigger
  multiple?: boolean
  checkStrictly?: boolean
  emitPath?: boolean
  lazy?: boolean
  lazyLoad?: DshLazyLoad
  value?: string
  label?: string
  children?: string
  disabled?: string | DshIsDisabled
  leaf?: string | DshIsLeaf
  hoverThreshold?: number
}

export type Nullable<T> = null | T

type ChildrenData = DshCascaderOption[] | undefined

let uid = 0

const calculatePathNodes = (node: DshNode) => {
  const nodes = [node]
  let { parent } = node

  while (parent) {
    nodes.unshift(parent)
    parent = parent.parent
  }

  return nodes
}

class DshNode {
  readonly uid: number = uid++
  readonly level: number
  readonly value: DshCascaderNodeValue
  readonly label: string
  readonly pathNodes: DshNode[]
  readonly pathValues: DshCascaderNodePathValue
  readonly pathLabels: string[]

  childrenData: ChildrenData
  children: DshNode[]
  text: string
  loaded: boolean
  /**
   * Is it checked
   *
   * @default false
   */
  checked = false
  /**
   * Used to indicate the intermediate state of unchecked and fully checked child nodes
   *
   * @default false
   */
  indeterminate = false
  /**
   * Loading Status
   *
   * @default false
   */
  loading = false

  constructor(
    readonly data: Nullable<DshCascaderOption>,
    readonly config: DshCascaderConfig,
    readonly parent?: DshNode,
    readonly root = false
  ) {
    const { value: valueKey, label: labelKey, children: childrenKey } = config

    const childrenData = data[childrenKey] as ChildrenData
    const pathNodes = calculatePathNodes(this)

    this.level = root ? 0 : parent ? parent.level + 1 : 1
    this.value = data[valueKey] as DshCascaderNodeValue
    this.label = data[labelKey] as string
    this.pathNodes = pathNodes
    this.pathValues = pathNodes.map((node) => node.value)
    this.pathLabels = pathNodes.map((node) => node.label)
    this.childrenData = childrenData
    this.children = (childrenData || []).map(
      (child) => new DshNode(child, config, this)
    )
    this.loaded = !config.lazy || this.DshIsLeaf || !isEmpty(childrenData)
  }

  get DshIsDisabled(): boolean {
    const { data, parent, config } = this
    const { disabled, checkStrictly } = config
    const DshIsDisabled = isFunction(disabled)
      ? disabled(data, this)
      : !!data[disabled]
    return DshIsDisabled || (!checkStrictly && parent?.DshIsDisabled)
  }

  get DshIsLeaf(): boolean {
    const { data, config, childrenData, loaded } = this
    const { lazy, leaf } = config
    const DshIsLeaf = isFunction(leaf) ? leaf(data, this) : data[leaf]

    return isUndefined(DshIsLeaf)
      ? lazy && !loaded
        ? false
        : !(Array.isArray(childrenData) && childrenData.length)
      : !!DshIsLeaf
  }

  get valueByOption() {
    return this.config.emitPath ? this.pathValues : this.value
  }

  appendChild(childData: DshCascaderOption) {
    const { childrenData, children } = this
    const node = new DshNode(childData, this.config, this)

    if (Array.isArray(childrenData)) {
      childrenData.push(childData)
    } else {
      this.childrenData = [childData]
    }

    children.push(node)

    return node
  }

  calcText(allLevels: boolean, separator: string) {
    const text = allLevels ? this.pathLabels.join(separator) : this.label
    this.text = text
    return text
  }

  broadcast(event: string, ...args: unknown[]) {
    const handlerName = `onParent${capitalize(event)}`
    this.children.forEach((child) => {
      if (child) {
        // bottom up
        child.broadcast(event, ...args)
        child[handlerName] && child[handlerName](...args)
      }
    })
  }

  emit(event: string, ...args: unknown[]) {
    const { parent } = this
    const handlerName = `onChild${capitalize(event)}`
    if (parent) {
      parent[handlerName] && parent[handlerName](...args)
      parent.emit(event, ...args)
    }
  }

  onParentCheck(checked: boolean) {
    if (!this.DshIsDisabled) {
      this.setCheckState(checked)
    }
  }

  onChildCheck() {
    const { children } = this
    const validChildren = children.filter((child) => !child.DshIsDisabled)
    const checked = validChildren.length
      ? validChildren.every((child) => child.checked)
      : false

    this.setCheckState(checked)
  }

  setCheckState(checked: boolean) {
    const totalNum = this.children.length
    const checkedNum = this.children.reduce((c, p) => {
      const num = p.checked ? 1 : p.indeterminate ? 0.5 : 0
      return c + num
    }, 0)

    this.checked =
      this.loaded &&
      this.children
        .filter((child) => !child.DshIsDisabled)
        .every((child) => child.loaded && child.checked) &&
      checked
    this.indeterminate =
      this.loaded && checkedNum !== totalNum && checkedNum > 0
  }

  doCheck(checked: boolean) {
    if (this.checked === checked) return

    const { checkStrictly, multiple } = this.config

    if (checkStrictly || !multiple) {
      this.checked = checked
    } else {
      // bottom up to unify the calculation of the indeterminate state
      this.broadcast('check', checked)
      this.setCheckState(checked)
      this.emit('check')
    }
  }
}

export default DshNode
