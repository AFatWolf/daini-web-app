<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col-2"></div>
      <div class="col-8 d-flex flex-column align-items-center fs-2">
        {{ $t('item.sell.title') }}
      </div>
    </div>
    <div class="row">
      <div class="col-4"></div>
      <div
        class="
          col-4
          d-flex
          flex-column
          align-items-center
          border border-1
          rounded-3
          p-4
        "
      >
        <div class="text-dark fs-3">
          {{ $t('item.sell.form_title') }}
        </div>
        <SellForm @sold="onSold" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const { t } = useLang()

    return {
      t,
    }
  },
  methods: {
    onSold() {
      // console.log(this.t('item.sell.success'))
      putNotification({ message: this.t('item.sell.success') })
    },
  },
}
</script>

<style>
</style>