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
    });
    if (error) throw error;
    alert('Check your email for the login link!');
  } catch (error) {
    if (typeof error === 'string') {
      // Gère le cas où l'erreur est une chaîne de caractères
      console.error(error);
      alert(error);
    } else if (error instanceof Error) {
      // Gère le cas où l'erreur est une instance de Error
      console.error(error.message);
      alert(error.message);
    } else {
      // Gère les autres cas
      console.error('An unknown error occurred');
      alert('An unknown error occurred');
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <form @submit.prevent="handleLogin" class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h1 class="text-3xl text-center text-gray-700 mb-4">Supabase + Nuxt 3</h1>
      <p class="text-gray-500 text-center mb-6">Sign in via magic link with your email below</p>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input id="email" type="email" placeholder="Your email" v-model="email"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <input type="submit"
               class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
               :value="loading ? 'Loading' : 'Send magic link'"
               :disabled="loading"
               :class="{'opacity-50 cursor-not-allowed': loading}"
        />
      </div>
    </form>
  </div>
</template>
