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
      const enstring =
        'SEA{"ct":"vCg6SE5UalyWZ/1CAKJV9xIhYKSoRp6bamwQyWAWPT8V6l98012/v+dTjIPN8YMVJLSV0a7xJvLJVRHCxNdkGfH3QcIZ3N8j2OZNqkIifyHy1HAFS+hwvBGEd97R+KkUb3i39Q8rhtUvYp8jvuVq","iv":"zuTsrphtDhbC+awzewVf","s":"cvC1DcQEPkQJ"}'
      const de = await SEA.decrypt(
        'SEA{"ct":"NyEkvG4ucYbSAdsALwMdqs3k74arq0knCHDA","iv":"qghPnkVk5qTsVQQLQEEz","s":"o9zKtdp/yEiI"} ',
        sea
      )
      const de2 = await SEA.decrypt(enstring, sea)
      const de2String = JSON.stringify(de2)
      const de3 = await SEA.decrypt(de2String, sea)

      console.log('Decrypted message: ', en, en2, de, de2, de3)

      const ec = new EC('secp256k1')

      const bcaddress =
        '04e0f75153ee523a1341f5add06a615a95bd2761dc5c967a1732a35f1bc5ef1cf1aeacb302d6b9cc34effd9a3f4f531745e670731f36fa7904b0edafc02f706d5c'
      const bcpriv =
        '690b1d9d22ebbef5bc2193a0c98411b6504b843c7351863c8dc9cede61c1980f'
      const publicKey = bcaddress.slice(2)
      const TRANS_ADDRESS =
        '0x' +
        keccak256(Buffer.from(publicKey, 'hex'))
          .slice(64 - 40)
          .toString()
      const test = ec.keyFromPrivate(bcpriv).getPublic().encode('hex')

      const myaddress = '0x19b3a45E44Ee1089299f8ae3CE4c005582CD30CA'
      const mypriv =
        'ad3787e82ddf3e0f65277252ef7536a9fefdda725ae3ce6ead83ca54ff144c0b'

      // const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545')
      // const nonce = await web3.eth.getTransactionCount(TRANS_ADDRESS, 'latest')
      // const accounts = await web3.eth.requestAccounts()
      // console.log(accounts)
      // // console.log(web3.eth.accounts.privateKeyToAccount(accounts[0])) 
      // console.log(
      //   TRANS_ADDRESS,
      //   web3.eth.accounts.privateKeyToAccount(bcpriv)
      // )
      // const transaction = {
      //   to: myaddress,
      //   value: 200000000000000000, // 2 ETH
      //   gas: 21000,
      //   nonce: nonce,
      // }

      // const signedTx = await web3.eth.accounts.signTransaction(
      //   transaction,
      //   bcpriv
      // )
      // web3.eth.sendSignedTransaction(
      //   signedTx.rawTransaction,
      //   function (error, hash) {
      //     if (!error) {
      //       console.log(
      //         '🎉 The hash of your transaction is: ',
      //         hash,
      //         "\n Check Alchemy's Mempool to view the status of your transaction!"
      //       )
      //     } else {
      //       console.log(
      //         '❗Something went wrong while submitting your transaction:',
      //         error
      //       )
      //     }
      //   }
      // )
      makeSignedTransaction(myaddress, bcpriv, 200000000000000000)
      makeTransaction(TRANS_ADDRESS, 300000000000000000)
    },
  },
}
</script>
