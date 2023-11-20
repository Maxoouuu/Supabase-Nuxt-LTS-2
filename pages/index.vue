<script setup>
const user = useSupabaseUser();
const router = useRouter();

watchEffect(() => {
  // Si `user` est null, cela signifie qu'il n'y a pas d'utilisateur connecté
  if (!user.value) {
    router.push('/login'); // Redirige vers la page de connexion
  }
});
</script>

<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <Account v-if="user" />
  </div>
</template>