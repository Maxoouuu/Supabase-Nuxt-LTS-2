<script setup>
const props = defineProps(['path'])
const { path } = toRefs(props)

const emit = defineEmits(['update:path', 'upload'])

const supabase = useSupabaseClient()

const uploading = ref(false)
const src = ref('')
const files = ref()

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .download(path.value)
    if (error) throw error
    src.value = URL.createObjectURL(data)
  } catch (error) {
    console.error('Error downloading image: ', error.message)
  }
}

const uploadAvatar = async (evt) => {
  files.value = evt.target.files
  try {
    uploading.value = true

    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    emit('update:path', filePath)
    emit('upload')
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}

downloadImage()

watch(path, () => {
  if (path.value) {
    downloadImage()
  }
})
</script>

<template>
  <div class="flex justify-center items-center">
    <div v-if="src" class="flex-shrink-0">
      <img :src="src" alt="Avatar" class="rounded-full w-32 h-32 object-cover" /> <!-- Taille de l'avatar réduite ici -->
    </div>
    <div v-else class="flex-shrink-0 rounded-full bg-gray-300 w-32 h-32 flex items-center justify-center">
      <span class="text-gray-500">No image</span>
    </div>
    <div class="ml-4">
      <label for="single" class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 cursor-pointer flex items-center justify-center"
             :class="{ 'opacity-50 cursor-not-allowed': uploading }">
        {{ uploading ? 'Uploading ...' : 'Upload' }}
      </label>
      <input class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" id="single" accept="image/*" @change="uploadAvatar" :disabled="uploading" />
    </div>
  </div>
</template>