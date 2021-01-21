<template>
    <div class="card">
        <div class="card-body">
            <p>Valore {{ deposit.value }}</p>
            <p>Data {{ deposit.date }}</p>
            <button @click="$emit('withdraw', deposit.id)">Withdraw</button>
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
}
button {
    margin-top: 10px;
}
</style>
