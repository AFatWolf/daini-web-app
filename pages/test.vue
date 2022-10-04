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
import { useGun } from '@gun-vue/composables'
import { WAREHOUSE_KEY } from '~~/constants/common'

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
    doThings3() {
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
      const id = 'Roomba'
      // gun
      //   .get(WAREHOUSE_KEY)
      //   .map()

      //   .once((data) => {
      //     console.log('Product:', data)
      //     console.log(data.price)
      //   })

      useGun().get('l8tdkjl0XkwMjkKU4pLG').once((data) => {
        console.log('Paper data', data)
      })

      const warehouse = useGun()
        .user('helloKitty')
        .get(WAREHOUSE_KEY)
        .map()
        .once((data) => {
          console.log('77 Product:', data)
        })
      console.log('Warehouse', warehouse)
    },
  },
}
</script>
