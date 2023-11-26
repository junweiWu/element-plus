import { isEqual } from 'lodash-unified'
import DshNode from './node'

import type { Nullable } from '@element-plus/utils'
import type {
  DshCascaderConfig,
  DshCascaderNodePathValue,
  DshCascaderNodeValue,
  DshCascaderOption,
} from './node'

const flatNodes = (nodes: DshNode[], leafOnly: boolean) => {
  return nodes.reduce((res, node) => {
    if (node.DshIsLeaf) {
      res.push(node)
    } else {
      !leafOnly && res.push(node)
      res = res.concat(flatNodes(node.children, leafOnly))
    }
    return res
  }, [] as DshNode[])
}

export default class Store {
  readonly nodes: DshNode[]
  readonly allNodes: DshNode[]
  readonly leafNodes: DshNode[]

  constructor(data: DshCascaderOption[], readonly config: DshCascaderConfig) {
    const nodes = (data || []).map(
      (nodeData) => new DshNode(nodeData, this.config)
    )
    const allNodes = [
      new DshNode({ label: '全选', value: 'cascader-all' }, this.config),
    ].concat(nodes)
    this.nodes = allNodes
    this.allNodes = flatNodes(allNodes, false)
    this.leafNodes = flatNodes(allNodes, true)
  }

  getNodes() {
    return this.nodes
  }

  getFlattedNodes(leafOnly: boolean) {
    return leafOnly ? this.leafNodes : this.allNodes
  }

  appendNode(nodeData: DshCascaderOption, parentNode?: DshNode) {
    const node = parentNode
      ? parentNode.appendChild(nodeData)
      : new DshNode(nodeData, this.config)

    if (!parentNode) this.nodes.push(node)

    this.allNodes.push(node)
    node.DshIsLeaf && this.leafNodes.push(node)
  }

  appendNodes(nodeDataList: DshCascaderOption[], parentNode: DshNode) {
    nodeDataList.forEach((nodeData) => this.appendNode(nodeData, parentNode))
  }

  // when checkStrictly, leaf node first
  getNodeByValue(
    value: DshCascaderNodeValue | DshCascaderNodePathValue,
    leafOnly = false
  ): Nullable<DshNode> {
    if (!value && value !== 0) return null

    const node = this.getFlattedNodes(leafOnly).find(
      (node) => isEqual(node.value, value) || isEqual(node.pathValues, value)
    )

    return node || null
  }

  getSameNode(node: DshNode): Nullable<DshNode> {
    if (!node) return null

    const node_ = this.getFlattedNodes(false).find(
      ({ value, level }) => isEqual(node.value, value) && node.level === level
    )

    return node_ || null
  }
}
