<script setup>
const user = useSupabaseUser()
const router = useRouter()

watchEffect(() => {
  // Si `user` est null, cela signifie qu'il n'y a pas d'utilisateur connecté
  if (!user.value) {
    router.push('/login') // Redirige vers la page de connexion
  }
})
</script>

<template>
  <Header />
  <div>
    <Account v-if="user" />
  </div>
</template>
