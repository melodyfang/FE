import { inject } from 'vue'
import { messageApiInjectionKey } from './config'

export function useMessage () {
  const api = inject(messageApiInjectionKey, null)
  if (api === null) {
    throw new Error(`[use-message]: No outer <gk-message-provider /> founded.`)
  }
  return api
}
