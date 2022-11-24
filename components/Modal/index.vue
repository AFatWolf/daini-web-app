<template>
  <div
    :id="modalId"
    ref="modalWrapper"
    class="modal fade"
    tabindex="-1"
    role="dialog"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
      :class="modalSize"
    >
      <div class="modal-content bg-white">
        <!-- header -->
        <div
          class="modal-header border-0 text-dark fw-bold d-flex flex-row align-items-center"
        >
          <div class="flex-grow-1">
            <slot name="header"></slot>
          </div>
          <div role="button" data-bs-dismiss="modal" data-role="modal-close">
            <Icon class="text-secondary" name="x" />
          </div>
        </div>
        <div class="overflow-auto">
          <!-- body -->
          <div class="modal-body pt-0 overflow-visible">
            <slot name="default"></slot>
          </div>
          <!-- footer -->
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

export default {
  props: {
    modalId: {
      type: String,
      default: 'modal-global',
    },
    size: {
      type: String,
      default: 'medium',
    },
  },
  emits: {
    /*
     * This event fires immediately when the "show" instance method is called.
     * If caused by a click, the clicked element is available as the "relatedTarget" property of the event.
     */
    show: ($event) => {
      return $event
    },
    /*
     * This event is fired when the modal has been made visible to the user (will wait for CSS transitions to complete).
     * If caused by a click, the clicked element is available as the "relatedTarget" property of the event.
     */
    shown: ($event) => {
      return $event
    },
    /*
     * 	This event is fired immediately when the "hide" instance method has been called.
     */
    hide: ($event) => {
      return $event
    },
    /*
     * This event is fired when the modal has finished being hidden from the user (will wait for CSS transitions to complete).
     */
    hidden: ($event) => {
      return $event
    },
  },
  setup(_props) {
    const modalWrapper = ref(null)

    return { modalWrapper }
  },
  computed: {
    modalSize: ({ size }) => {
      return {
        'modal-sm': size === 'small',
        'modal-lg': size === 'large',
        'modal-xl': size === 'extra-large',
      }
    },
  },
  mounted() {
    const { $emit, modalId } = this
    // some heavy works to do in web worker
    const modalEl = document.querySelector(`#${modalId}`)
    // @ts-ignore
    bootstrap.Modal.getOrCreateInstance(modalEl)

    modalEl.addEventListener('show.bs.modal', function ($event) {
      $emit('show', $event)
    })

    modalEl.addEventListener('shown.bs.modal', function ($event) {
      $emit('shown', $event)
    })

    modalEl.addEventListener('hide.bs.modal', function ($event) {
      $emit('hide', $event)
    })

    modalEl.addEventListener('hidden.bs.modal', function ($event) {
      $emit('hidden', $event)
    })
  },
}
</script>
