<template>
  <div class="date-range-picker flex gap-2 items-center">
    <div class="form-group" style="margin-bottom:0">
      <label class="form-label">{{ $t('common.from') }}</label>
      <input type="date" class="form-input" :value="fromDate" @input="$emit('update:fromDate', $event.target.value)" />
    </div>
    <div class="form-group" style="margin-bottom:0">
      <label class="form-label">{{ $t('common.to') }}</label>
      <input type="date" class="form-input" :value="toDate" @input="$emit('update:toDate', $event.target.value)" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  fromDate: { type: String, default: '' },
  toDate: { type: String, default: '' }
})
defineEmits(['update:fromDate', 'update:toDate'])
</script>

<style scoped>
.date-range-picker .form-input {
  min-width: 140px;
}
</style>
