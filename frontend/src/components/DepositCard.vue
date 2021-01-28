<template>
    <div class="card">
        <div class="card-content">
            <p>Depositato: {{ deposit.amount }} ETH</p>
            <p>Valore attuale: {{ deposit.amountWithInterest }} ETH</p>
            <p>Effettuato il: {{ depositDate }}</p>
            <button
                class="button"
                @click="$emit('withdraw', deposit.id)"
                :disabled="deposit.isClosed"
            >
                Withdraw
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
    border: 1px solid #4bbf4b;
}
</style>
