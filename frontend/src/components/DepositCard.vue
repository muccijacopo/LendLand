<template>
    <div class="card">
        <div class="card-body">
            <p>Depositato {{ deposit.amount }} ETH</p>
            <p>Valore attuale {{ deposit.amountWithInterest }} ETH</p>
            <p>Data {{ depositDate }}</p>
            <button
                class="button"
                @click="$emit('withdraw', deposit.id)"
                :disabled="deposit.isClosed"
            >
                Withdraw all
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { defineComponent, PropType } from 'vue';
import { default as formatDate } from 'date-fns/format';
import { Deposit } from '@/models/Deposit';
export default defineComponent({
    name: 'DepositCard',
    props: {
        deposit: {
            type: Object as PropType<Deposit>,
            required: true,
        },
    },
    emits: ['withdraw'],
    computed: {
        depositDate(): string {
            return formatDate(this.deposit.date, 'dd/MM/yyyy HH:mm');
        },
    },
});
</script>

<style scoped lang="scss">
.card {
    background: white;
    border: 1px solid #047e1d;
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
