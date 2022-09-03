<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    const { t } = useLang()

    return { t }
  },
}
</script>
