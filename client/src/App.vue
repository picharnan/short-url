<template>
  <v-app>
    <v-main>
      <ShortUrl />
    </v-main>
  </v-app>
</template>

<script>
import ShortUrl from './components/ShortUrl.vue';

export default {
  name: 'App',

  components: {
    ShortUrl,
  },

  data: () => ({
    //
  }),
};
</script>
