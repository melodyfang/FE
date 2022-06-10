import { Toast } from '../components/toast'
// import { Toast } from '../toast'
Toast.allowMultiple(true) // 允许多个 toast

const gkToast = (options) => {
  return Toast(options)
}

export function toast(options) {
  gkToast(options)
}

