<template>
  <div class="d-inline-flex align-items-center justify-content-center">
    <i
      v-if="!isCustom"
      :stroke-width="strokeWidth"
      class="w-100 h-100 d-inline-flex align-items-center justify-content-center"
      v-html="iconSvg"
    ></i>
    <component
      :is="`icon-${name}`"
      v-else
      :width="size"
      :height="size"
      :stroke-width="strokeWidth"
      stroke="currentColor"
      draggable="false"
    />
    <div v-show="text" class="ms-2 fs-8">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import feather from 'feather-icons'

export default {
  props: {
    name: {
      type: String,
      default: 'circle',
    },
    text: {
      type: String,
      default: '',
    },
    strokeWidth: {
      type: Number,
      default: 1,
    },
    size: {
      type: Number,
      default: 24,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconSvg: ({ name, strokeWidth, size, color }) => {
      return feather.icons[name].toSvg({
        'stroke-width': strokeWidth,
        height: size,
        width: size,
        color,
      })
    },
  },
}
</script>
