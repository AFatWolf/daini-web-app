import { defineStore } from 'pinia'

import { useConfirmDialog, UseConfirmDialogReturn } from '@vueuse/core'

export interface IDialogState {
  warning?: {
    modal: UseConfirmDialogReturn<any, any, any>
    args: {
      title: string
      message?: string
      buttons: {
        id: string
        label: string
        class: string
      }[]
    }
  }
}

export const useDialogStore = defineStore('dialog', {
  state: (): IDialogState => ({
    warning: {
      modal: null,
      args: {
        title: '',
        message: '',
        buttons: [],
      },
    },
  }),
  actions: {
    initWarning(args = {}) {
      if (process.client && !this.warning.modal) {
        this.warning.modal = useConfirmDialog()
      }

      this.warning.args = {
        ...this.warning.args,
        ...args,
      }

      return this.warning
    },
  },
})
