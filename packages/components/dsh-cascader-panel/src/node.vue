<template>
  <li
    :id="`${menuId}-${node.uid}`"
    role="menuitem"
    :aria-haspopup="!DshIsLeaf"
    :aria-owns="DshIsLeaf ? null : menuId"
    :aria-expanded="inExpandingPath"
    :tabindex="expandable ? -1 : undefined"
    :class="[
      ns.b(),
      ns.is('selectable', checkStrictly),
      ns.is('active', node.checked),
      ns.is('disabled', !expandable),
      !node.DshIsLeaf && inExpandingPath && 'in-active-path',
      inCheckedPath && 'in-checked-path',
    ]"
    @mouseenter="handleHoverExpand"
    @focus="handleHoverExpand"
    @click="handleClick(node)"
  >
    <!-- prefix -->
    <el-checkbox
      v-if="multiple"
      :model-value="node.checked"
      :indeterminate="node.indeterminate"
      :disabled="DshIsDisabled"
      @click.stop
      @update:model-value="handleSelectCheck"
    />
    <el-radio
      v-else-if="checkStrictly"
      :model-value="checkedNodeId"
      :label="node.uid"
      :disabled="DshIsDisabled"
      @update:model-value="handleSelectCheck"
      @click.stop
    >
      <!--
        Add an empty element to avoid render label,
        do not use empty fragment here for https://github.com/vuejs/vue-next/pull/2485
      -->
      <span />
    </el-radio>
    <el-icon v-else-if="DshIsLeaf && node.checked" :class="ns.e('prefix')">
      <check />
    </el-icon>

    <!-- content -->
    <dsh-node-content :only-check="onlyCheck" />

    <!-- postfix -->
    <template v-if="!DshIsLeaf">
      <el-icon v-if="node.loading" :class="[ns.is('loading'), ns.e('postfix')]">
        <loading />
      </el-icon>
      <el-icon v-else :class="['arrow-right', ns.e('postfix')]">
        <arrow-right />
      </el-icon>
    </template>
  </li>
</template>

<script lang="ts">
// @ts-nocheck
import { computed, defineComponent, inject } from 'vue'
import ElCheckbox from '@element-plus/components/checkbox'
import ElRadio from '@element-plus/components/radio'
import ElIcon from '@element-plus/components/icon'
import { useNamespace } from '@element-plus/hooks'
import { ArrowRight, Check, Loading } from '@element-plus/icons-vue'
import DshNodeContent from './dsh-node-content'
import { DSH_CASCADER_PANEL_INJECTION_KEY } from './types'
import type { default as DshCascaderNode } from './node'

import type { PropType } from 'vue'

export default defineComponent({
  name: 'DshCascaderNode',

  components: {
    ElCheckbox,
    ElRadio,
    DshNodeContent,
    ElIcon,
    Check,
    Loading,
    ArrowRight,
  },

  props: {
    node: {
      type: Object as PropType<DshCascaderNode>,
      required: true,
    },
    menuId: String,
    onlyThis: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['expand'],

  setup(props, { emit }) {
    const panel = inject(DSH_CASCADER_PANEL_INJECTION_KEY)!

    const ns = useNamespace('cascader-node')
    const isHoverMenu = computed(() => panel.isHoverMenu)
    const multiple = computed(() => panel.config.multiple)
    const checkStrictly = computed(() => panel.config.checkStrictly)
    const checkedNodeId = computed(() => panel.checkedNodes[0]?.uid)
    const DshIsDisabled = computed(() => props.node.DshIsDisabled)
    const DshIsLeaf = computed(() => props.node.DshIsLeaf)
    const expandable = computed(
      () => (checkStrictly.value && !DshIsLeaf.value) || !DshIsDisabled.value
    )
    const inExpandingPath = computed(() => isInPath(panel.expandingNode!))
    // only useful in check-strictly mode
    const inCheckedPath = computed(
      () => checkStrictly.value && panel.checkedNodes.some(isInPath)
    )

    const isInPath = (node: DshCascaderNode) => {
      const { level, uid } = props.node
      return node?.pathNodes[level - 1]?.uid === uid
    }

    const doExpand = () => {
      if (inExpandingPath.value) return
      panel.expandNode(props.node)
    }

    const doCheck = (checked: boolean) => {
      const { node } = props
      if (checked === node.checked) return
      panel.handleCheckChange(node, checked)
    }

    const onlyCheck = () => {
      const { node } = props
      panel.checkedNodes.forEach((item) => item.doCheck(false))
      panel.handleCheckChange(node, false)
      panel.onlyThisConfirm(node.value)
    }

    const doLoad = () => {
      panel.lazyLoad(props.node, () => {
        if (!DshIsLeaf.value) doExpand()
      })
    }

    const handleHoverExpand = (e: Event) => {
      if (!isHoverMenu.value) return
      handleExpand()
      !DshIsLeaf.value && emit('expand', e)
    }

    const handleExpand = () => {
      const { node } = props
      // do not exclude leaf node because the menus expanded might have to reset
      if (!expandable.value || node.loading) return
      node.loaded ? doExpand() : doLoad()
    }

    const handleClick = (node: DshCascaderNode) => {
      if (node.data?.value === 'cascader-all') {
        handleSelectCheck(!node.checked)
        panel.checkedAll(!node.checked)
        return
      } else if (isHoverMenu.value) {
        handleSelectCheck(!node.checked)
        return
      }
      if (
        DshIsLeaf.value &&
        !DshIsDisabled.value &&
        !checkStrictly.value &&
        !multiple.value
      ) {
        handleCheck(true)
      } else {
        handleExpand()
      }
    }

    const handleSelectCheck = (checked: boolean) => {
      if (checkStrictly.value) {
        doCheck(checked)
        if (props.node.loaded) {
          doExpand()
        }
      } else {
        handleCheck(checked)
      }
    }

    const handleCheck = (checked: boolean) => {
      if (!props.node.loaded) {
        doLoad()
      } else {
        doCheck(checked)
        !checkStrictly.value && doExpand()
      }
    }

    return {
      panel,
      isHoverMenu,
      multiple,
      checkStrictly,
      checkedNodeId,
      DshIsDisabled,
      DshIsLeaf,
      expandable,
      inExpandingPath,
      inCheckedPath,
      ns,
      handleHoverExpand,
      handleExpand,
      handleClick,
      handleCheck,
      handleSelectCheck,
      onlyCheck,
    }
  },
})
</script>
