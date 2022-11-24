<template>
  <Modal :modal-id="modalId" data-role="modal-warning">
    <template #header>{{ title }}</template>
    <template #default>
      <div class="pre-wrap">{{ message }}</div>

      <div class="d-flex justify-content-end">
        <div
          type="button"
          class="btn-outline-secondary me-2"
          data-bs-dismiss="modal"
          :text="$t('common.cancel')"
        />
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { WARNING_TYPE } from '@/constants/common'

export default {
  props: {
    modalId: {
      type: String,
      default: 'modal-global-warning',
    },
    title: {
      type: String,
      default: 'Warning',
    },
    message: {
      type: String,
      default: '',
    },
    buttons: {
      type: Array,
      default: () => [
        {
          id: WARNING_TYPE.DELETE,
          label: 'Delete',
          class: 'btn-danger',
        },
      ],
    },
    confirmRequired: {
      type: Object,
      default: () => ({
        id: WARNING_TYPE.DELETE,
        text: '',
      }),
    },
  },
  emits: {
    confirm: ($event) => {
      return $event
    },
  },
}
</script>

<style lang="scss" scoped>
.pre-wrap {
  white-space: pre-wrap;
}
</style>
