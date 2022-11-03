<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <div class="d-flex flex-column align-content-center">
          <div class="fs-64">{{ $t('tag_line_1') }}</div>
          <div class="fs-64">{{ $t('tag_line_2') }}</div>
          <TagImage />
        </div>
      </div>
      <div class="col-1"></div>
      <div class="d-flex flex-column justify-content-center col-5">
        <LogInForm @logged-in="onLoggedIn" />
      </div>
    </div>
  </div>
</template>

<script>
import { HOME_ROUTE } from '@/constants/common'
export default {
  methods: {
    onLoggedIn() {
      navigateTo(HOME_ROUTE.HOME)
    },
  },
}
</script>

<style>
</style>