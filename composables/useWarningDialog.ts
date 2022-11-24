import { useDialogStore } from '@/stores/dialog'

export const useWarningDialog = (args = {}) => {
  const dialogStore = useDialogStore()
  tryOnBeforeMount(() => {
    dialogStore.initWarning(args)
  })

  return ref(dialogStore.warning).value
}
