<template>
    <h1>
        P2P LENDING
    </h1>
    <p>{{ account }}</p>
    <h3>Deposit: {{ balance }} (ETH)</h3>
    <input v-model="value" /> <br />
    <button @click="deposit()">Deposit</button><br />
    <button @click="withdraw()">Withdraw</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Web3Service from './services/Web3Service';

export default defineComponent({
    name: 'App',
    components: {},
    data() {
        return {
            account: '0x0',
            balance: '',
            value: 1,
        };
    },
    async created() {
        await Web3Service.init();
        this.account = await Web3Service.account;
        this.balance = await Web3Service.getBalance();
    },
    methods: {
        async deposit() {
            this.balance = await Web3Service.deposit(this.value);
        },
        async withdraw() {
            this.balance = await Web3Service.withdraw(this.value);
        },
    },
});
</script>

<style lang="scss">
html {
    margin: 0;
    height: 100%;
}
body {
    margin: 0;
    min-height: 100vh;
    background: #181818;
}
#app {
    text-align: center;
    height: 100%;
    color: #ffffff;
}
input {
    margin-bottom: 1rem;
}
button {
    margin-bottom: 1rem;
}
</style>
