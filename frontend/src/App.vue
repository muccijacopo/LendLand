<template>
    <header class="navbar is-info">
        <div class="navbar-brand">
            <div class="navbar-item">
                <h1>P2P Lending Dapp</h1>
            </div>
        </div>
        <div class="navbar-end">
            <div class="navbar-item">
                <span>Account: {{ account }}</span>
            </div>
        </div>
    </header>

    <main class="container content my-3">
        <div class="is-flex is-align-items-center">
            <h1
                class="has-text-centered"
                style="font-size: 5rem; margin: 2.5rem auto; overflow-wrap: break-word"
            >
                <img src="@/assets/eth_icon.png" style="width: 60px; height: 60px" />
                {{ totalBalance }} ETH
            </h1>
        </div>

        <h4 class="has-text-centered">
            Deposita e guadagna interessi <br />oppure richiedi un prestito
        </h4>
        <div class="is-flex is-justify-content-center">
            <button
                class="mr-2"
                @click="selected = 'deposit'"
                :class="{ 'is-primary': selected === 'deposit' }"
            >
                Deposita</button
            ><br />
            <button @click="selected = 'loan'" :class="{ 'is-danger': selected === 'loan' }">
                Richiedi
            </button>
        </div>
        <div class="field my-3">
            <!-- <label class="label">Desposita o richiedi ETH</label> -->
            <p class="control has-icons-left">
                <input class="input mb-1" v-model="value" @keyup.enter="onEnter" />
                <span class="icon is-small is-left">
                    <img src="@/assets/eth_icon.png" style="height: 20px" />
                </span>
                <button
                    class="button w-100 is-info"
                    @click="onEnter"
                    :disabled="selected == 'loan' && value > parseInt(totalBalance)"
                >
                    Conferma
                </button>
            </p>
        </div>

        <hr />
        <h3 v-if="deposits.length">I tuoi investimenti</h3>
        <div class="grid">
            <deposit-card
                v-for="deposit in deposits"
                :key="deposit.date"
                :deposit="deposit"
                @withdraw="withdraw($event)"
            ></deposit-card>
        </div>
        <hr />
        <h3 v-if="loans.length">I tuoi prestiti</h3>
        <div class="grid">
            <loan-card
                v-for="loan in loans"
                :key="loan.date"
                :loan="loan"
                @repayLoan="repayLoan($event)"
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
            selected: null as 'deposit' | 'loan' | null,
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
        onEnter() {
            if (this.selected === 'deposit') {
                this.invest();
            } else if (this.selected === 'loan') {
                this.newLoan();
            }
        },
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
        async repayLoan(loanId: number) {
            const loan = this.loans.find(l => l.id === loanId);
            if (!loan) return;
            this.loans = await Web3Service.repayLoan(loanId, loan.amountWithInterest);
            this.totalBalance = await Web3Service.getTotalBalance();
        },
    },
});
</script>

<style lang="scss">
header {
    .navbar-brand {
        font-size: 2rem;
    }
}

.container {
    padding: 0 1rem;
}

.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 20px 0;
}

.field {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
}
</style>
