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
      debugger
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
      // useGunDb()
      //   .get(WAREHOUSE_KEY)
      //   .get('Rope')
      //   .once((data) => {
      //     console.log('Data', data)
      //   })
      
      // const ropeNode = useGunDb().get(WAREHOUSE_KEY).get('Rope')
      // const promise_data = await useOnceToPromise(ropeNode, ropeNode)
      // console.log('Promise data 1:', promise_data)
      // ropeNode.once((data) => {
      //   console.log('Data', data)
      // })
      // // https://stackoverflow.com/questions/27232157/pass-class-function-as-parameter-to-another-class-to-use-as-callback-in-javascri
      // const promise_data_2 = await new Promise((resolve, reject) => {
      //   useGunDb()
      //     .get(WAREHOUSE_KEY)
      //     .get('Rope')
      //     .once((data) => {
      //       if (!data) return reject({ error: 'No data returned' })
      //       if (!data || data.error) return reject(data)
      //       resolve(data)
      //     })
      // })
      // console.log('Promise data 2: ', promise_data_2)

      // useGun().get('test-25122000/warehouse/betsuyon/items')
      // const warehouse = useGun()
      //   .user('hiKtty2')
      //   .get(WAREHOUSE_KEY)
      //   .map()
      //   .once((data) => {
      //     console.log('77 Product:', data)
      //   })


      useGun()
        .user('hiKitty2')
        .get('sea')
        .once((data) => {
          console.log('Test user data: ', data)
        })
      const name = this.str || 'hiKitty2'
      const authStore = useAuthStore()

      // const data = await useSetToPromise(authStore.getUserRef.get(TRANSACTIONS_KEY), {hello: 'hi'})
      const ack = await useMapOnceToPromise(authStore.getUserRef.get(TRANSACTIONS_KEY))
      const onceRef = await useOnceToPromise(authStore.getUserRef.get(TRANSACTIONS_KEY))
      console.log('onceRef: ', onceRef)
      useGun().get(onceRef['_']['#']).once((data) => {
        console.log('map data', data)
      })

      console.log("User Transaction: ", ack)
      // useGun().users.once().map().once((data) => {
      //   console.log('User: ', data)
      // })
      // console.log(await SEA.pair())
      // console.log('Warehouse', warehouse)
      const alias = 'pLgVmRcmm1G6a2bLy107lpiqV9QXxNp8zc2PTztuXvk.p58mPLRaEFhEugIek9IO4bCTRglcAJ7SM6SU0Ru5mxU'
      const user = getUserRefByAlias(alias)
      console.log('Get user lias: '. user)
    },
  },
}
</script>
