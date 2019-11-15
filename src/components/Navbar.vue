<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon @click.stop="showSideBar">
      <v-icon>mdi-menu</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
    <v-progress-linear :active="loading === true" :indeterminate="true" absolute bottom></v-progress-linear>
  </v-app-bar>
</template>

<script>
  import eventBus from "../EventBus.js";

  export default {
    methods: {
      logout() {
        this.$store.dispatch("logout").then(() => {
          this.$router.push("/login");
        });
      },
      showSideBar(){
        eventBus.$emit("show-side-bar");
      }
    },

    computed: {
      user(){ return this.$store.getters.user },
      loading(){ return this.$store.getters.loading }
    }
  };
</script>
