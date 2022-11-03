<template>
  <nav class="navbar navbar-expand-lg p-0 bg-primary">
    <div class="container-fluid">
      <Anchor class="navbar-brand text-white fs-4" :to="HOME_ROUTE.HOME">{{
        $t('app_name')
      }}</Anchor>
      <div class="navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <Anchor
              class="nav-link text-white"
              :class="{
                'fw-bold': isActive(HOME_ROUTE.INDEX),
              }"
              aria-current="page"
              to="/"
              >{{ $t('page.home') }}</Anchor
            >
          </li>
          <li class="nav-item">
            <Anchor
              class="nav-link text-white d-flex flex-row align-items-center"
              :class="{
                'fw-bold': isActive(MARKET_ROUTE.INDEX),
              }"
              aria-current="page"
              :to="MARKET_ROUTE.INDEX"
              ><div class="me-1">{{ $t('page.market') }}</div>
              <Icon
                name="shopping-cart"
                :size="20"
                :stroke-width="isActive(MARKET_ROUTE.INDEX) ? 2 : 1"
            /></Anchor>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <Anchor
              class="nav-link text-white d-flex flex-row align-items-cente"
              :class="{
                'fw-bold': isActive(WAREHOUSE_ROUTE.INDEX),
              }"
              aria-current="page"
              :to="WAREHOUSE_ROUTE.INDEX"
              ><div class="me-1">{{ $t('page.warehouse') }}</div>
              <Icon
                name="package"
                :size="20"
                :stroke-width="isActive(WAREHOUSE_ROUTE.INDEX) ? 2 : 1"
            /></Anchor>
          </li>
          <li class="nav-item">
            <Anchor
              class="nav-link text-white"
              :class="{
                'fw-bold': isActive(WAREHOUSE_ROUTE.SELL),
              }"
              aria-current="page"
              :to="WAREHOUSE_ROUTE.SELL"
              >{{ $t('page.sell') }}</Anchor
            >
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <Anchor
              class="nav-link text-white"
              :class="{
                'fw-bold': isActive(TRANSACTIONS_ROUTE.INDEX),
              }"
              aria-current="page"
              :to="TRANSACTIONS_ROUTE.INDEX"
              >{{ $t('page.transactions') }}</Anchor
            >
          </li>
        </ul>
      </div>
      <div class="navbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="!isLoggedIn">
          <li class="nav-item">
            <Anchor
              class="nav-link text-white"
              :class="{
                'fw-bold': isActive(HOME_ROUTE.LOGIN),
              }"
              aria-current="page"
              :to="HOME_ROUTE.LOGIN"
              >{{ $t('page.login') }}</Anchor
            >
          </li>
          <li class="nav-item">
            <Anchor
              class="nav-link text-white"
              :class="{
                'fw-bold': isActive(HOME_ROUTE.SIGNUP),
              }"
              aria-current="page"
              :to="HOME_ROUTE.SIGNUP"
            >
              {{ $t('page.signup') }}</Anchor
            >
          </li>
        </ul>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-else>
          <!-- <li class="nav-item dropdown text-white">
            <div class="my-auto" role="button" data-bs-toggle="dropdown">
              <Icon class="my-auto" name="user" :size="20" />
            </div>
          </li> -->
          <li class="nav-item dropdown text-white">
            <div role="button" class="dropdown-item" @click="logout">
              {{ $t('logout') }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import {
  HOME_ROUTE,
  MARKET_ROUTE,
  WAREHOUSE_ROUTE,
  TRANSACTIONS_ROUTE,
} from '@/constants/common'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()

    return {
      authStore,
      HOME_ROUTE,
      MARKET_ROUTE,
      WAREHOUSE_ROUTE,
      TRANSACTIONS_ROUTE,
    }
  },
  computed: {
    isLoggedIn({ authStore }) {
      return authStore.isLoggedIn
    },
  },
  methods: {
    isActive(route) {
      // https://v3.router.vuejs.org/api/#route-object-properties
      const objs = this.$route.matched
      const splittedRoute = useSplit(route, '-')

      return (
        objs.length && splittedRoute.length && objs[0].name === splittedRoute[0]
      )
    },
    logout() {
      this.authStore.logOut()
      navigateTo(HOME_ROUTE.LOGIN)
    },
  },
}
</script>

<style>
</style>