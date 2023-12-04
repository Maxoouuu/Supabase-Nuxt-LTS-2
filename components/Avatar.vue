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
  <div class="flex flex-col items-center">
    <!-- Conteneur pour l'avatar et le bouton d'upload -->
    <div class="flex justify-center items-center mb-4">
      <!-- Avatar Image -->
      <div v-if="src" class="flex-shrink-0">
        <img :src="src" alt="Avatar" class="rounded-full w-24 h-24 object-cover" />
      </div>
      <div v-else class="rounded-full bg-gray-300 w-24 h-24 flex items-center justify-center">
        <span class="text-gray-500">No image</span>
      </div>

      <!-- Upload Button -->
      <div class="ml-4">
        <label for="single" class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 cursor-pointer">
          {{ uploading ? 'Uploading ...' : 'Upload' }}
        </label>
        <input class="opacity-0 absolute w-0 h-0" type="file" id="single" accept="image/*" @change="uploadAvatar" :disabled="uploading" />
      </div>
    </div>
    <!-- Autres éléments du formulaire ici -->
  </div>
</template>
