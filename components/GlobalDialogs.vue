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

    <div class="position-fixed bottom-0 end-0 px-2 z-index-tooltip">
      <Toast
        v-if="errorHandle.notify?.detail"
        :type="errorHandle.notify?.type"
        class="my-2"
        data-role="toast-notify"
      >
        {{ errorHandle.notify.detail }}
      </Toast>
      <Toast
        v-if="errorHandle.alert?.detail"
        data-role="toast-error-client"
        class="my-2"
      >
        {{ errorHandle.alert.detail }}
      </Toast>
      <Toast
        v-for="error in errorHandle.errors"
        v-else
        :key="error.code"
        :title="error.message"
        class="my-2"
        data-role="toast-error-api"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="error.detail"></div>
      </Toast>
    </div>
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

    const errorHandle = useErrorHandle()

    return { errorHandle, warningModalId, warningDialog }
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
