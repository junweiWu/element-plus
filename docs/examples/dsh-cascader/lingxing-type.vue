<template>
  <div class="m-4">
    <p>模仿领星的demo</p>
    <dsh-cascader
      v-model="dshValues"
      :options="options"
      :props="props"
      filterable
      placeholder="国家"
      collapse-tags
      collapse-tags-tooltip
      clearable
      width="250px"
      focus-width="300px"
      :show-all-levels="false"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
  <div class="m-4">
    <p>Collapse tags</p>
    <dsh-cascader :options="options" :props="props" collapse-tags clearable />
  </div>
  <div class="m-4">
    <p>Collapse tags tooltip</p>
    <dsh-cascader
      :options="options"
      :props="props"
      collapse-tags
      collapse-tags-tooltip
      clearable
    />
  </div>
  <div class="m-4">
    <p>Max Collapse Tags</p>
    <dsh-cascader
      :options="options"
      :props="props"
      collapse-tags
      collapse-tags-tooltip
      max-collapse-tags="3"
      clearable
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = { multiple: true, expandTrigger: 'hover' }
const dshValues = ref([])
const options = [
  {
    value: 1,
    label: 'Asia',
    children: [
      {
        value: 2,
        label: 'China',
        children: [
          { value: 3, label: 'Beijing1111111111111' },
          { value: 4, label: 'Shanghai' },
          { value: 5, label: 'Hangzhou' },
        ],
      },
      {
        value: 6,
        label: 'Japan',
        children: [],
      },
      {
        value: 10,
        label: 'Korea',
        children: [
          { value: 11, label: 'Seoul' },
          { value: 12, label: 'Busan' },
          { value: 13, label: 'Taegu' },
        ],
      },
    ],
  },
  {
    value: 14,
    label: 'Europe',
    children: [
      {
        value: 15,
        label: 'France',
        children: [
          { value: 16, label: 'Paris' },
          { value: 17, label: 'Marseille' },
          { value: 18, label: 'Lyon' },
        ],
      },
      {
        value: 19,
        label: 'UK',
        children: [
          { value: 20, label: 'London' },
          { value: 21, label: 'Birmingham' },
          { value: 22, label: 'Manchester' },
        ],
      },
    ],
  },
  {
    value: 23,
    label: 'North America',
    children: [
      {
        value: 24,
        label: 'US',
        children: [
          { value: 25, label: 'New York' },
          { value: 26, label: 'Los Angeles' },
          { value: 27, label: 'Washington' },
        ],
      },
      {
        value: 28,
        label: 'Canada',
        children: [
          { value: 29, label: 'Toronto' },
          { value: 30, label: 'Montreal' },
          { value: 31, label: 'Ottawa' },
        ],
      },
    ],
  },
]
const handlerConfirm = (params) => {
  // debugger
}
const handlerCancel = (params) => {
  // debugger
}
</script>
