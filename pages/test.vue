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
      // const gun = useGun()
      // const data = gun
      //   .get('Kittykeys')
      //   .get('obj1st')
      //   .on((data, key) => {
      //     console.log('Kitty data: ', data, key)
      //   })
      // const test = gun.get('uncharted').on((data, key) => {
      //   console.log('Uncharted data: ', data, key)
      // })
      // console.log(data)
      // console.log('Test', test)

      const gun = useGunDb()
      // const id = 'Roomba'

      // const data2 = await useOnceToPromise(
      //   useGun()
      //     .get('test-25122000/transactions/["04189a2bd70ad75eab8e0ad86...')
      //     .get('seller')
      // )
      // console.log('Get just sold data: ', data2)

      const authStore = useAuthStore()
      const sea = authStore.userInfo.sea

      const en = await SEA.encrypt('hello world', sea)
      const en2 = await SEA.encrypt(en, sea)
      const enstring = "SEA{\"ct\":\"vCg6SE5UalyWZ/1CAKJV9xIhYKSoRp6bamwQyWAWPT8V6l98012/v+dTjIPN8YMVJLSV0a7xJvLJVRHCxNdkGfH3QcIZ3N8j2OZNqkIifyHy1HAFS+hwvBGEd97R+KkUb3i39Q8rhtUvYp8jvuVq\",\"iv\":\"zuTsrphtDhbC+awzewVf\",\"s\":\"cvC1DcQEPkQJ\"}"
      const de = await SEA.decrypt('SEA{"ct":"NyEkvG4ucYbSAdsALwMdqs3k74arq0knCHDA","iv":"qghPnkVk5qTsVQQLQEEz","s":"o9zKtdp/yEiI"} ', sea)
      const de2 = await SEA.decrypt(enstring, sea)
      const de2String = JSON.stringify(de2)
      const de3 = await SEA.decrypt(de2String, sea)
      debugger

      console.log('Decrypted message: ', en, en2, de, de2, de3)

      const bcaddress = '0427c2d21385a074d903c246e4f30659e93772b84e359fee242866d25872d0ff44bd2770c0f08d13677f0cf0d2cc4056f7a5a58db819307180633b262a278bf2ce'
      const bcpriv = '47705e25bfb31a042b40801e891e1f1603d1b34c81fedcaf739f12891e9cd19e'
      
    },
  },
}
</script>
