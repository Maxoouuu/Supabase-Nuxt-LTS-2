<template>
  <nav class="flex justify-between items-center bg-gray-800 text-white p-4">
    <NuxtLink to="/" class="text-lg font-bold">Home</NuxtLink>
    <div class="relative">
      <button @click="toggleMenu" class="focus:outline-none">
        <div class="block w-8 h-1 bg-white mb-1"></div>
        <div class="block w-8 h-1 bg-white mb-1"></div>
        <div class="block w-8 h-1 bg-white"></div>
      </button>
      <div
        v-if="isMenuOpen"
        class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl"
      >
        <NuxtLink
          to="/dynamicimages"
          class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
        >
          Dynamic Images
        </NuxtLink>
        <!-- Ajoutez plus de liens ici -->
      </div>
    </div>
  </nav>
</template>

<script setup>
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
