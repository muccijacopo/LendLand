<template>
    <header>
        <h1>P2P Lending Dapp</h1>
        <p>{{ account }}</p>
    </header>

    <main>
        <h3 style="font-size: 5rem">{{ totalBalance }} ETH</h3>
        <input v-model="value" /> <br />
        <button @click="deposit()">Deposit</button><br />

        <div class="grid">
            <deposit-card
                v-for="deposit in deposits"
                :key="deposit.date"
                :deposit="deposit"
                @withdraw="withdraw($event)"
            ></deposit-card>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Web3Service from './services/Web3Service';
import DepositCard from './components/DepositCard.vue';
import { Deposit } from './models/Deposit';

export default defineComponent({
    name: 'App',
    components: {
        DepositCard,
    },
    data() {
        return {
            account: '0x0',
            totalBalance: '',
            value: 1,
            deposits: [] as Deposit[],
        };
    },
    async created() {
        await Web3Service.init();
        this.account = await Web3Service.account;
        this.deposits = await Web3Service.getDepositsByAccount();
        // const [updatedUserBalance, updatedTotalBalance] = await Web3Service.getBalances();
        // this.balance = updatedUserBalance;
        // this.totalBalance = updatedTotalBalance;
    },
    methods: {
        async deposit() {
            this.deposits = await Web3Service.deposit(this.value);
            // this.balance = updatedUserBalance;
            // this.totalBalance = updatedTotalBalance;
            this.value = 1;
        },
        async withdraw(depositId: number) {
            console.log(depositId);
            this.deposits = await Web3Service.withdraw(depositId);
            // this.balance = updatedUserBalance;
            // this.totalBalance = updatedTotalBalance;
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
    margin: 30px auto;
    text-align: center;
}

.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

input {
    margin-bottom: 1rem;
}
button {
    margin-bottom: 1rem;
}
</style>
