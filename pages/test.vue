<template>
  <div>
    <Icon name="box" />
    <!-- <NuxtWelcome /> -->
    <!-- <h1 class="text-primary">{{ t('hello', { name: 'vue-i18n' }) }}</h1> -->
    <FormKit
      v-model="name"
      type="text"
      label="Your username"
      help="Pick a username people will remember!"
    />
    <button class="btn btn-primary text-white" role="button" @click="doThings">
      Do things
    </button>
    <FormKit
      v-model="str"
      type="text"
      label="Your string"
      help="Pick a username people will remember!"
    />
    <button class="btn btn-primary text-white" role="button" @click="doThings2">
      Do things 2
    </button>
    <button class="btn btn-primary text-white" role="button" @click="doThings3">
      Do things 3
    </button>
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
import { useGun, SEA } from '@gun-vue/composables'
import { WAREHOUSE_KEY, TRANSACTIONS_KEY } from '~~/constants/common'
import { useAuthStore } from '~~/stores/auth'
import Web3 from 'web3'
import { ec as EC } from 'elliptic'
import { keccak256 } from 'js-sha3'

export default {
  setup() {
    const { t } = useLang()

    return { t }
  },
  data() {
    return {
      name: 'helloKitty',
      str: '',
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
    },
    doThings2() {
      const gun = useGun()
      const obj = gun.get('Kittykeys').put(
        {
          obj1st: {
            hello: this.str,
          },
        },
        (ack) => {
          console.log(ack)
        }
      )
      const test = gun.get('uncharted').get('character').put({
        name: 'Nathan Drake',
        age: 39,
      })
      console.log('2.1: ', obj)
      console.log('2: ', test)
    },
    async doThings3() {
      // const msg =
      //   '{"ct":"swZFNwX65lgF1OskqPQVo88mrNkQYtVWapXiC5T3FDu2mbY1WnJU0osbKfAe1NAAIgGkSL/VK5NUqrB7fMRuojy+/MrRXs988xhxIvEttmc=","iv":"d7CLg9Gi+V2nOvo3gJnk","s":"H++vFN5VA/Z8"}'
      // const passphrase = 'x19RyXl3sOcb8Kjjtpdr-AJHS06t0zm6Tyd93FOo8es'
      // const de = await SEA.decrypt(JSON.parse(msg), passphrase)
      // console.log('Decrypted: ', de)
      // debugger
      // const sea = await useOnceToPromise(useGun().get("~nFqpOGCTGHk_LbI-SBkx1Gw7xVA8rGg6zcGXfGhJWjo._hWGvjDFrytyGt3LWuBdtHbAoTnGcX2_XMjuzSfWyYA"))
      // console.log(sea)
      // debugger
      // await await putNotification({
      //   message: 'Hello',
      // })
      useGun().get("test-25122000-/test-25122000-transactions/[\"047a06997506befafab097686...").put({ product: { name: "shounen manga"} })
    },
  },
}
</script>
