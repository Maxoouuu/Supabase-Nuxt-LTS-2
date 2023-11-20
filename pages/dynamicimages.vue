<template>
  <Header />
  <div :style="backgroundImageStyle"></div>
</template>

<script setup>
const images = ['home-min1.jpeg', 'home-min2.jpeg', 'home-min3.jpeg']
const index = ref(0)

const backgroundImageStyle = computed(() => ({
  backgroundImage: `url('/${images[index.value]}')`,
  height: '500px',
  width: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}))

function changeImage() {
  index.value = (index.value + 1) % images.length
}

setInterval(changeImage, 5000)
</script>
