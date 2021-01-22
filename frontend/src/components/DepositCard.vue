<template>
    <div class="card">
        <div class="card-body">
            <p>Depositato {{ deposit.value }} ETH</p>
            <p>Valore attuale ???</p>
            <p>Data {{ deposit.date }}</p>
            <button @click="$emit('withdraw', deposit.id)" :disabled="deposit.value === '0'">
                Withdraw
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue';
export default defineComponent({
    name: 'DepositCard',
    props: ['deposit'],
    emits: ['withdraw'],
});
</script>

<style scoped lang="scss">
.card {
    background: white;
    border: 1px solid #f2f2f2;
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
