import Cascader from './src/dsh-cascader.vue'
import type { SFCWithInstall } from '@element-plus/utils'
import type { App } from 'vue'

Cascader.install = (app: App): void => {
  app.component(Cascader.name, Cascader)
}

const _Cascader = Cascader as SFCWithInstall<typeof Cascader>

export default _Cascader
export const DshCascader = _Cascader

export * from './src/dsh-cascader'
