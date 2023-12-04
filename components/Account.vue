<script setup>
const supabase = useSupabaseClient()

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_path = ref('')

loading.value = true
const user = useSupabaseUser()

const { data } = await supabase
  .from('profiles')
  .select(`username, website, avatar_url`)
  .eq('id', user.value.id)
  .single()

if (data) {
  username.value = data.username
  website.value = data.website
  avatar_path.value = data.avatar_url
}

loading.value = false

async function updateProfile() {
  try {
    loading.value = true
    const user = useSupabaseUser()

    const updates = {
      id: user.value.id,
      username: username.value,
      website: website.value,
      avatar_url: avatar_path.value,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    })

    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <form @submit.prevent="updateProfile" class="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
      <div class="mb-4">
        <Avatar v-model:path="avatar_path" @upload="updateProfile" class="w-24 h-24 mx-auto rounded-full" />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input id="email" type="text" :value="user.email" disabled
               class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"/>
      </div>
      <div class="mb-4">
        <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
        <input id="username" type="text" v-model="username"
               class="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"/>
      </div>
      <div class="mb-6">
        <label for="website" class="block text-gray-700 text-sm font-bold mb-2">Website</label>
        <input id="website" type="url" v-model="website"
               class="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"/>
      </div>

      <div class="flex flex-col space-y-4">
        <input
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
          :value="loading ? 'Loading ...' : 'Update'"
          :disabled="loading"
          :class="{'opacity-50 cursor-not-allowed': loading}"
        />

        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
                @click="signOut"
                :disabled="loading"
                :class="{'opacity-50 cursor-not-allowed': loading}">
          Sign Out
        </button>
      </div>
    </form>
  </div>
</template>