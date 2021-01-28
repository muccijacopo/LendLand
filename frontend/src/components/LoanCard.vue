<template>
    <div class="card">
        <div class="card-content">
            <p>Richiesto: {{ loan.amount }} ETH</p>
            <p>Da restituire: {{ !loan.isClosed ? loan.amountWithInterest : 0 }} ETH</p>
            <p>Richiesto il: {{ loanDate }}</p>
            <button @click="$emit('repayLoan', loan.id)" :disabled="loan.isClosed">
                Ripaga
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
    border: 1px solid #981c1c;
}
button {
    margin-top: 10px;
}
</style>
