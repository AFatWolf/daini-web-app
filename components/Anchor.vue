
<template>
  <NuxtLink v-if="to" tag="a" :to="to" :class="setLinkClass()">
    <slot>{{ text }}</slot>
  </NuxtLink>
  <a v-else :href="href">
    <slot>{{ text }}</slot>
  </a>
</template>

<script lang="ts" setup>
// micro compiler
const componentProps = defineProps({
  text: {
    type: String,
    default: '',
  },
  to: {
    type: [String, Object],
    default: undefined,
  },
  href: {
    type: String,
    default: '',
  },
})

// state
const href = toRef(componentProps, 'href')
const to = toRef(componentProps, 'to')
const route = useRoute()
const router = useRouter()

const setLinkClass = () => {
  if (!to.value) return

  const { path } = router.resolve(to.value)

  return {
    'router-link-active':
      useStartsWith(route.path, path.replace(/^\/+/, '')) &&
      route.path !== path,
  }
}
</script>
