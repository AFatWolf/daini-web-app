<template>
  <div id="dialogs">
    <ModalWarning
      v-if="warningDialog.modal?.isRevealed"
      :modal-id="warningModalId"
      :title="warningDialog.args.title"
      :message="warningDialog.args.message"
      :buttons="warningDialog.args.buttons"
      class="z-index-warning"
      @hidden="onWarningHidden"
      @confirm="onWarningConfirm"
    />
  </div>
</template>

<script lang="ts">
import { GLOBAL_DIALOG } from '@/constants/common'

export default {
  setup() {
    const warningDialog = useWarningDialog()

    const warningModalId = GLOBAL_DIALOG.WARNING
    watch(warningDialog, async ({ modal }) => {
      if (modal?.isRevealed) {
        await nextTick()
        useModal(warningModalId).show()
      }
    })

    return {
      warningModalId,
      warningDialog,
    }
  },
  methods: {
    onWarningHidden() {
      this.warningDialog.modal.cancel()
    },
    onWarningConfirm(id) {
      this.warningDialog.modal.confirm(id)
    },
  },
}
</script>
