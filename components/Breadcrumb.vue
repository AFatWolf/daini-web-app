<template>
  <div class="d-flex flex-row fw-bold">
    <div v-for="(space, index) in spaces" :key="index">
      <div v-if="index != spaces.length - 1" class="d-flex flex-row">
        <Anchor :to="space.to" class="text-primary me-2 text-decoration-none">
          {{ space.text }}
        </Anchor>
        <div class="me-2">/</div>
      </div>
      <div v-else>
        <span class="text-gray-600 text-decoration-none">
          {{ space.text }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    spaces: {
      type: Array,
      default() {
        return []
      },
    },
  },
}
</script>
