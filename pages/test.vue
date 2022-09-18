<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <h1 class="text-primary">{{ t('hello', { name: 'vue-i18n' }) }}</h1>
    <FormKit
      type="text"
      label="Your username"
      value="calypso"
      help="Pick a username people will remember!"
    />
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
export default {
  setup() {
    const { t } = useLang()

    return { t }
  },
}
</script>
