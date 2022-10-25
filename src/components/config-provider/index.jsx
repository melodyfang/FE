import { reactive, watch, defineComponent, provide, watchEffect, computed } from 'vue'

export const defaultPrefixCls = 'ant'

const globalConfigByCom = reactive({})
const globalConfigBySet = reactive({})

export const globalConfigForApi = reactive({
  getPrefixCls: () => {}
})

function getGlobalPrefixCls() {
  return globalConfigForApi.prefixCls || defaultPrefixCls
}

watchEffect(() => {
  globalConfigForApi.prefixCls = getGlobalPrefixCls()

  globalConfigForApi.getPrefixCls = (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) {
      return customizePrefixCls
    }

    return suffixCls
      ? `${globalConfigForApi.prefixCls}-${suffixCls}`
      : globalConfigForApi.prefixCls
  }
})

const ConfigProvider = defineComponent({
  name: 'ConfigProvider',
  inheritAttrs: false,
  props: {
    getTargetContainer: {
      type: Function,
    },
    prefixCls: String,
    getPrefixCls: {
      type: Function,
    },
  },
  setup(props, { slots }) {
    const getPrefixCls = (suffixCls, customizePrefixCls) => {
      const { prefixCls = 'ant' } = props
      if (customizePrefixCls) {
        return customizePrefixCls
      }
      return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls
    }

    const getPrefixClsWrapper = (suffixCls, customizePrefixCls) => {
      const { prefixCls } = props

      if (customizePrefixCls) {
        return customizePrefixCls
      }

      const mergedPrefixCls = prefixCls || getPrefixCls('')

      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls
    }

    const configProvider = reactive({
      ...props,
      getPrefixCls: getPrefixClsWrapper,
    })

    Object.keys(props).forEach(key => {
      watch(
        () => props[key],
        () => {
          configProvider[key] = props[key]
        },
      )
    })

    return () => (
      <div haha>
        {slots.default?.()}
      </div> 
    )
  },
})

// ConfigProvider.config = setGlobalConfig
ConfigProvider.install = function (app) {
  app.component(ConfigProvider.name, ConfigProvider)
}

export default ConfigProvider