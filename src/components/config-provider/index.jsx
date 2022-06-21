import { reactive, watch, defineComponent, provide, watchEffect, computed } from 'vue'

import { configProviderProps, useProvideGlobalForm } from './context'

export const defaultPrefixCls = 'ant'

const globalConfigByCom = reactive({})
const globalConfigBySet = reactive({})
export const globalConfigForApi = reactive({
  getPrefixCls: () => {},
  getRootPrefixCls: () => {}
})


function getGlobalPrefixCls() {
  return globalConfigForApi.prefixCls || defaultPrefixCls
}

function defaultRenderEmpty () {
  console.log('render empty')
}

watchEffect(() => {
  Object.assign(globalConfigForApi, globalConfigByCom, globalConfigBySet)
  globalConfigForApi.prefixCls = getGlobalPrefixCls()
  globalConfigForApi.getPrefixCls = (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls
    return suffixCls
      ? `${globalConfigForApi.prefixCls}-${suffixCls}`
      : globalConfigForApi.prefixCls
  }

  globalConfigForApi.getRootPrefixCls = (rootPrefixCls, customizePrefixCls) => {
    // Customize rootPrefixCls is first priority
    if (rootPrefixCls) {
      return rootPrefixCls
    }

    // If Global prefixCls provided, use this
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls
    }

    // [Legacy] If customize prefixCls provided, we cut it to get the prefixCls
    if (customizePrefixCls && customizePrefixCls.includes('-')) {
      return customizePrefixCls.replace(/^(.*)-[^-]*$/, '$1')
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls()
  }
})

let stopWatchEffect
const setGlobalConfig = (params) => {
  if (stopWatchEffect) {
    stopWatchEffect()
  }

  stopWatchEffect = watchEffect(() => {
    Object.assign(globalConfigBySet, reactive(params))
  })

  if (params.theme) {
    registerTheme(getGlobalPrefixCls(), params.theme)
  }
}

export const globalConfig = () => ({
  getPrefixCls: (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls();
  },
  getRootPrefixCls: (rootPrefixCls, customizePrefixCls) => {
    // Customize rootPrefixCls is first priority
    if (rootPrefixCls) {
      return rootPrefixCls
    }

    // If Global prefixCls provided, use this
    if (globalConfigForApi.prefixCls) {
      return globalConfigForApi.prefixCls
    }

    // [Legacy] If customize prefixCls provided, we cut it to get the prefixCls
    if (customizePrefixCls && customizePrefixCls.includes('-')) {
      return customizePrefixCls.replace(/^(.*)-[^-]*$/, '$1')
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls()
  },
})


const ConfigProvider = defineComponent({
  name: 'AConfigProvider',
  inheritAttrs: false,
  props: configProviderProps(),
  setup(props, { slots }) {
    console.log('slots: ', slots);
    const getPrefixCls = (suffixCls, customizePrefixCls) => {
      const { prefixCls = 'ant' } = props
      if (customizePrefixCls) return customizePrefixCls
      return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls
    }

    const renderEmptyComponent = (name) => {
      const renderEmpty = (props.renderEmpty ||
        slots.renderEmpty ||
        defaultRenderEmpty)

      return renderEmpty(name)
    }

    const getPrefixClsWrapper = (suffixCls, customizePrefixCls) => {
      const { prefixCls } = props

      if (customizePrefixCls) return customizePrefixCls

      const mergedPrefixCls = prefixCls || getPrefixCls('')

      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls
    }

    const configProvider = reactive({
      ...props,
      getPrefixCls: getPrefixClsWrapper,
      renderEmpty: renderEmptyComponent,
    })

    Object.keys(props).forEach(key => {
      watch(
        () => props[key],
        () => {
          configProvider[key] = props[key];
        },
      )
    })

    if (!props.notUpdateGlobalConfig) {
      Object.assign(globalConfigByCom, configProvider)
      watch(configProvider, () => {
        Object.assign(globalConfigByCom, configProvider)
      })
    }

    const validateMessagesRef = computed(() => {
      // Additional Form provider
      let validateMessages = {}

      if (props.form && props.form.validateMessages) {
        validateMessages = { ...validateMessages, ...props.form.validateMessages }
      }

      return validateMessages
    })

    useProvideGlobalForm({ validateMessages: validateMessagesRef })
    provide('configProvider', configProvider)

    return () => {
      <>
        {slots.default?.()}
      </>
    }
  },
})

export const defaultConfigProvider = reactive({
  getPrefixCls: (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls
    return suffixCls ? `ant-${suffixCls}` : 'ant'
  },
  renderEmpty: defaultRenderEmpty
})


ConfigProvider.config = setGlobalConfig;
ConfigProvider.install = function (app) {
  app.component(ConfigProvider.name, ConfigProvider)
}

export default ConfigProvider