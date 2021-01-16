<template>
    <h1>
        P2P LENDING
    </h1>
    <p>{{ account }}</p>
    <h3>Deposit: {{ balance }} (ETH)</h3>

    <button @click="deposit()">Deposit</button><br />
    <input v-model="withdrawValue" />
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
            withdrawValue: 0,
        };
    },
    async created() {
        await Web3Service.init();
        this.account = await Web3Service.account;
        this.balance = await Web3Service.getBalance();
    },
    methods: {
        deposit() {
            console.log('deposit');
            Web3Service.deposit(1);
        },
        withdraw() {
            console.log('widthdraw');
            Web3Service.withdraw(this.withdrawValue);
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
button {
    margin-bottom: 1rem;
}
</style>
