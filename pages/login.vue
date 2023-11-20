<script setup lang="ts">
const supabase = useSupabaseClient();
const router = useRouter();

const loading = ref(false);
const email = ref('');

onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      router.push('/'); // Redirige vers la page d'accueil si l'utilisateur est connecté
    }
  });
});

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm',
      }
    })
    if (error) throw error
    alert('Check your email for the login link!')
  } catch (error) {
    console.error(error)
    alert(error.error_description || error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="row flex-center flex">
    <div class="col-6 form-widget">
      <h1 class="header">Supabase + Nuxt 3</h1>
      <p class="description">Sign in via magic link with your email below</p>
      <div>
        <input class="inputField" type="email" placeholder="Your email" v-model="email" />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading' : 'Send magic link'"
          :disabled="loading"
        />
      </div>
    </div>
  </form>
</template>
