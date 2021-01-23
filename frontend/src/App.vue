<template>
    <header>
        <h1>P2P Lending Dapp</h1>
        <p>{{ account }}</p>
    </header>

    <main>
        <h3 style="font-size: 5rem">{{ totalBalance }} ETH</h3>
        <input v-model="value" /> <br />
        <button @click="invest()">Invest</button><br />
        <button @click="newLoan()">New Loan</button>

        <h1>I tuoi investimenti</h1>
        <div class="grid">
            <deposit-card
                v-for="deposit in deposits"
                :key="deposit.date"
                :deposit="deposit"
                @withdraw="withdraw($event)"
            ></deposit-card>
        </div>
        <h1>I tuoi prestiti</h1>
        <div class="grid">
            <loan-card
                v-for="loan in loans"
                :key="loan.date"
                :loan="loan"
                @withdraw="withdraw($event)"
            ></loan-card>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Web3Service from './services/Web3Service';
import DepositCard from './components/DepositCard.vue';
import LoanCard from './components/LoanCard.vue';
import { Deposit } from './models/Deposit';
import { Loan } from './models/Loan';

export default defineComponent({
    name: 'App',
    components: {
        DepositCard,
        LoanCard,
    },
    data() {
        return {
            account: '0x0',
            totalBalance: '',
            value: 1,
            deposits: [] as Deposit[],
            loans: [] as Loan[],
        };
    },
    async created() {
        await Web3Service.init();
        this.account = await Web3Service.account;
        this.deposits = await Web3Service.getDepositsByAccount();
        this.loans = await Web3Service.getLoansByAccount();
        this.totalBalance = await Web3Service.getTotalBalance();
        // const [updatedUserBalance, updatedTotalBalance] = await Web3Service.getBalances();
        // this.balance = updatedUserBalance;
        // this.totalBalance = updatedTotalBalance;
    },
    methods: {
        async invest() {
            this.deposits = await Web3Service.deposit(this.value);
            // this.balance = updatedUserBalance;
            this.totalBalance = await Web3Service.getTotalBalance();
            this.value = 1;
        },
        async withdraw(depositId: number) {
            this.deposits = await Web3Service.withdraw(depositId);
            // this.balance = updatedUserBalance;
            this.totalBalance = await Web3Service.getTotalBalance();
            this.value = 1;
        },
        async newLoan() {
            this.loans = await Web3Service.getNewLoan(this.value);
            this.totalBalance = await Web3Service.getTotalBalance();
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
    margin: 20px 0;
}

input {
    margin-bottom: 1rem;
}
button {
    margin-bottom: 1rem;
}
</style>
