import { provide } from 'vue'

export const GlobalFormContextKey = Symbol('GlobalFormContextKey')

export const useProvideGlobalForm = (state) => {
  provide(GlobalFormContextKey, state)
}

export const configProviderProps = () => ({
  getTargetContainer: {
    type: Function,
  },
  prefixCls: String,
  getPrefixCls: {
    type: Function,
  },
  // internal use
  notUpdateGlobalConfig: Boolean,
})