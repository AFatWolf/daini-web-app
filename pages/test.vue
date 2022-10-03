<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <!-- <h1 class="text-primary">{{ t('hello', { name: 'vue-i18n' }) }}</h1> -->
    <FormKit
      v-model="name"
      type="text"
      label="Your username"
      help="Pick a username people will remember!"
    />
    <button class="btn btn-primary text-white" role="button" @click="doThings" >Do things</button>
    <form>
      <label for="locale-select">{{ $t('language') }}: </label>
      <select id="locale-select" v-model="$i18n.locale">
        <option value="en">en</option>
        <option value="fr">fr</option>
        <option value="ja">ja</option>
      </select>
    </form>
  </div>
</template>

<script lang="ts">
import { useGun } from '@gun-vue/composables'

export default {
  setup() {
    const { t } = useLang()

    return { t }
  },
  data() {
    return {
      name: 'helloKitty'
    }
  },
  methods: {
    doThings() {
      const gun = useGun()
      const user = gun.user(this.name)

      user.once((data, key) => {
        console.log('hello')
        console.log(data, key)
      })
    }
  }
}
</script>
