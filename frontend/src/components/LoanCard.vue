<template>
    <div class="card">
        <div class="card-body">
            <p>Richiesto {{ loan.amount }} ETH</p>
            <p>Da restituire {{ loan.amountWithInterest }} ETH</p>
            <p>Data {{ loanDate }}</p>
            <button @click="$emit('repayLoan', loan.id)" :disabled="loan.isClosed">
                Repay
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { defineComponent, PropType } from 'vue';
import { default as formatDate } from 'date-fns/format';
import { Loan } from '@/models/Loan';
export default defineComponent({
    name: 'LoanCard',
    props: {
        loan: {
            type: Object as PropType<Loan>,
            required: true,
        },
    },
    emits: ['repayLoan'],
    computed: {
        loanDate(): string {
            return formatDate(this.loan.date, 'dd/MM/yyyy HH:mm');
        },
    },
});
</script>

<style scoped lang="scss">
.card {
    background: white;
    border: 1px solid #ff5454;
    border-radius: 5px;
    padding: 1rem;
    p {
        margin-bottom: 0.5rem;
    }
}
button {
    margin-top: 10px;
}
</style>
