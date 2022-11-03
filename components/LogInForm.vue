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
              v-model="model.username"
              type="text"
              name="username"
              :label="$t('common.name')"
              label-class="text-white fs-5"
              outer-class="mb-3"
              input-class="w-100 p-2"
            />
            <FormKit
              v-model="model.password"
              type="password"
              name="password"
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
              {{ $t('login') }}
            </button>
          </div>
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script>
// import { ISignUpParams } from '@/interfaces/auth'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

export default {
  props: {
    modelValue: {
      type: Object,
      default: {
        username: '',
        password: '',
      },
    },
  },
  setup(props, emit) {
    const model = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })
    const authStore = useAuthStore()
    const { isLoggedIn } = storeToRefs(authStore)

    return {
      model,
      authStore,
      isLoggedIn,
    }
  },
  methods: {
    onSubmit() {
      this.authStore.logIn(this.model)
      this.$emit('loggedIn')
    },
  },
}
</script>

<style>
</style>