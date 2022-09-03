<template>
  <div class="bg-primary rounded-5">
    <div class="d-flex flex-column align-items-center py-4 px-5">
      <div class="fs-1 text-white mb-4">
        {{ $t('login') }}
      </div>
      <div class="w-100">
        <FormKit type="form" :actions="false" @submit="onSubmit">
          <div class="d-flex flex-column justify-content-center mb-4">
            <FormKit
              type="text"
              :label="$t('common.name')"
              label-class="text-white fs-5"
              outer-class="mb-3"
              input-class="w-100 p-2"
            />
            <FormKit
              type="password"
              :label="$t('common.password')"
              label-class="text-white fs-5"
              input-class="w-100 p-2"
            />
          </div>
          <div class="d-flex justify-content-center">
            <button
              role="button"
              class="
                btn btn-ouline-primary
                bg-white
                border-1
                rounded rounded-1
                border-primary
                text-primary
                fs-4
              "
            >
              {{ $t('signup') }}
            </button>
          </div>
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onSubmit() {
      alert('Log In')
    },
  },
}
</script>

<style>
</style>