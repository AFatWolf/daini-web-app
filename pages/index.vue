<template>
  <div class="container">
    <div class="d-flex flex-column align-items-center mb-5">
      <div class="fw-bold text-dark fs-2">
        {{ $t('tag_line_3') }}
      </div>
    </div>
    <div class="row">
      <div class="col-6 p-2">
        <Anchor class="text-decoration-none" :to="MARKET_ROUTE.INDEX">
          <div
            role="button"
            class="rounded rounded-3 bg-primary text-white p-5"
          >
            <div class="d-flex flex-column align-items-center">
              <div class="d-flex flex-row fw-bold align-items-center">
                <div class="fs-2 me-2">{{ $t('page.market') }}</div>
                <Icon name="shopping-cart" :size="24" :stroke-width="2" />
              </div>
              <div>
                {{ $t('market.description') }}
              </div>
            </div>
          </div>
        </Anchor>
      </div>

      <div class="col-6 p-2">
        <Anchor class="text-decoration-none" :to="WAREHOUSE_ROUTE.INDEX">
          <div
            role="button"
            class="rounded rounded-3 bg-primary text-white p-5"
          >
            <div class="d-flex flex-column align-items-center">
              <div class="d-flex flex-row fw-bold align-items-center">
                <div class="fs-2 me-2">{{ $t('page.warehouse') }}</div>
                <Icon name="package" :size="24" :stroke-width="2" />
              </div>
              <div>
                {{ $t('market.description') }}
              </div>
            </div>
          </div>
        </Anchor>
      </div>
    </div>
  </div>
</template>

<script>
import { MARKET_ROUTE, WAREHOUSE_ROUTE } from '@/constants/common'
export default {
  setup() {
    return {
      MARKET_ROUTE,
      WAREHOUSE_ROUTE,
    }
  },
}
</script>

<style>
</style>