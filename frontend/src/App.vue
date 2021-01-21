<template>
    <header>
        <h1>P2P Lending Dapp</h1>
        <p>{{ account }}</p>
    </header>

    <main>
        <h3 style="font-size: 5rem">{{ totalBalance }} ETH</h3>
        <h3>Currently deposit: {{ balance }} ETH</h3>
        <input v-model="value" /> <br />
        <button @click="deposit()">Deposit</button><br />
        <button @click="withdraw()">Withdraw</button>
    </main>
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
            totalBalance: '',
            balance: '',
            value: 1,
        };
    },
    async created() {
        await Web3Service.init();
        this.account = await Web3Service.account;
        const [updatedUserBalance, updatedTotalBalance] = await Web3Service.getBalances();
        this.balance = updatedUserBalance;
        this.totalBalance = updatedTotalBalance;
    },
    methods: {
        async deposit() {
            const [updatedUserBalance, updatedTotalBalance] = await Web3Service.deposit(this.value);
            this.balance = updatedUserBalance;
            this.totalBalance = updatedTotalBalance;
            this.value = 1;
        },
        async withdraw() {
            const [updatedUserBalance, updatedTotalBalance] = await Web3Service.withdraw(
                this.value
            );
            this.balance = updatedUserBalance;
            this.totalBalance = updatedTotalBalance;
            this.value = 1;
        },
    },
});
</script>

<style lang="scss">
* {
    box-sizing: border-box;
    margin: 0;
}
html {
    height: 100%;
}
body {
    min-height: 100vh;
    background: #f2f2f2;
}
header {
    width: 100%;
    padding: 1rem;
    background: #181818;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
        font-size: 2rem;
    }
}

main {
    width: 60%;
    margin: 0 auto;
    text-align: center;
}

input {
    margin-bottom: 1rem;
}
button {
    margin-bottom: 1rem;
}
</style>
