<template>
  <div class="file-upload" :class="{ 'dragging': dragging, 'has-file': hasFile }"
       @dragenter.prevent="dragging = true"
       @dragover.prevent="dragging = true"
       @dragleave.prevent="dragging = false"
       @drop.prevent="onDrop"
       @click="openPicker">
    <input ref="inputRef" type="file" accept="image/*" class="file-input" @change="onChange" />
    <template v-if="!hasFile">
      <div class="upload-icon">📎</div>
      <p class="upload-text">{{ $t('payments.uploadDrag') }}</p>
      <p class="upload-hint">PNG, JPG (max 5MB)</p>
    </template>
    <template v-else>
      <img v-if="preview" :src="preview" class="upload-preview" />
      <p class="upload-filename">{{ fileName }}</p>
      <button class="btn btn-ghost btn-sm" @click.stop="clear">{{ $t('common.delete') }}</button>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useImageCompression } from '@/composables/useImageCompression'

const props = defineProps({
  modelValue: { type: File, default: null }
})
const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const dragging = ref(false)
const fileName = ref('')
const { compress, preview } = useImageCompression()

const hasFile = computed(() => !!props.modelValue)

function openPicker() {
  inputRef.value?.click()
}

async function handleFile(file) {
  if (!file) return
  const compressed = await compress(file)
  fileName.value = file.name
  emit('update:modelValue', compressed)
  dragging.value = false
}

function onChange(e) {
  handleFile(e.target.files[0])
}

function onDrop(e) {
  handleFile(e.dataTransfer.files[0])
}

function clear() {
  if (inputRef.value) inputRef.value.value = ''
  fileName.value = ''
  preview.value = null
  emit('update:modelValue', null)
}
</script>

<style scoped>
.file-upload {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--color-bg-tertiary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
.file-upload:hover, .file-upload.dragging {
  border-color: var(--color-accent-primary);
  background: rgba(99, 102, 241, 0.08);
}
.file-upload.has-file {
  border-style: solid;
  border-color: var(--color-success);
  background: rgba(34, 197, 94, 0.05);
}
.file-input { display: none; }
.upload-icon { font-size: 32px; }
.upload-text { font-size: var(--text-sm); color: var(--color-text-secondary); }
.upload-hint { font-size: var(--text-xs); color: var(--color-text-tertiary); }
.upload-preview {
  max-height: 120px;
  max-width: 200px;
  border-radius: var(--radius-md);
  object-fit: cover;
}
.upload-filename { font-size: var(--text-xs); color: var(--color-text-tertiary); }
</style>
