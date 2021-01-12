<template>
    <h1>
        P2P LENDING
    </h1>
    <p>{{ account }}</p>
    <h3>Balance: {{ balance }} (FT)</h3>

    <button @click="deposit()">Deposit</button>
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
        };
    },
    async created() {
        await Web3Service.init();
        const accounts = await Web3Service.getAccounts();
        this.account = accounts[0];
        this.balance = await Web3Service.getBalance();
    },
    methods: {
        deposit() {
            console.log('deposit');
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
</style>
