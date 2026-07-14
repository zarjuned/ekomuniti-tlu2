import { ref } from 'vue'

export function useImageCompression() {
  const preview = ref(null)
  const originalSize = ref(0)
  const compressedSize = ref(0)

  async function compress(file, options = {}) {
    const { maxSizeKB = 50, maxWidth = 1200 } = options
    originalSize.value = file.size

    // Mock compression in prototype — actually just create a blob URL
    try {
      const url = URL.createObjectURL(file)
      preview.value = url
      // Simulate compressed size
      compressedSize.value = Math.min(file.size, maxSizeKB * 1024)
      return file
    } catch {
      return file
    }
  }

  const compressionRatio = ref('')

  function reset() {
    if (preview.value) URL.revokeObjectURL(preview.value)
    preview.value = null
    originalSize.value = 0
    compressedSize.value = 0
    compressionRatio.value = ''
  }

  return {
    compress, preview, originalSize, compressedSize, compressionRatio, reset
  }
}
