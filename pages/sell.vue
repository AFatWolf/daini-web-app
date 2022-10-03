<template>
  <div class="w-50 d-flex flex-column align-items-center">
    <div class="text-dark fs-3">
      {{ $t('item.sell.title') }}
    </div>
    <SellForm @sold="onSold" />
  </div>
</template>

<script>
export default {
  methods: {
    onSold() {},
  },
}
</script>

<style>
</style>