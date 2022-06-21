import { provide } from 'vue'

export const GlobalFormContextKey = Symbol('GlobalFormContextKey')

export const useProvideGlobalForm = (state) => {
  provide(GlobalFormContextKey, state)
}

export const configProviderProps = () => ({
  getTargetContainer: {
    type: Function,
  },
  getPopupContainer: {
    type: Function,
  },
  prefixCls: String,
  getPrefixCls: {
    type: Function,
  },
  renderEmpty: {
    type: Function,
  },
  transformCellText: {
    type: Function,
  },
  csp: {
    type: Object,
    default: undefined,
  },
  input: {
    type: Object,
  },
  autoInsertSpaceInButton: { type: Boolean, default: undefined },
  pageHeader: {
    type: Object,
  },
  componentSize: {
    type: String,
  },
  space: {
    type: Object,
  },
  virtual: { type: Boolean, default: undefined },
  dropdownMatchSelectWidth: { type: [Number, Boolean], default: true },
  form: {
    type: Object,
    default: undefined,
  },
  // internal use
  notUpdateGlobalConfig: Boolean,
})