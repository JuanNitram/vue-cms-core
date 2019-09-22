<template>
  <v-toolbar>
    <img :src="this.appUrl + 'logo-min.png'" class="sidebar-img" width="40" height="40" @click="showSideBar">
    <v-toolbar-title>{{ this.$route.meta.title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-avatar class="pr-4" size="20" color="grey lighten-4">
      <img :src="this.appUrl + 'account_circle_black.png'" alt="avatar">
    </v-avatar>
    <strong>{{ adminName }}</strong>
    <v-menu bottom left>
      <v-btn slot="activator" icon>
        <v-icon>expand_more</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile class="tile" @click="configuration">
          <v-list-tile-title>Configuracion
            <v-icon>build</v-icon>
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile class="tile" @click="logout">
          <v-list-tile-title>Logout
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import eventBus from "../EventBus.js";

export default {
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
    configuration() {},
    showSideBar: () => {
      eventBus.$emit("show-side-bar");
    }
  },
  computed: {
    appUrl(){ return this.$store.state.appUrl },
    adminName(){ return this.$store.state.user.name },
  }
};
</script>
<style>
.tile .v-list__tile {
    height: 48px;
    margin: 3px!important;
    border-radius: 4px;
    color:#2c3e50!important
}

.tile .tile-active {
    color:#f5f5f5!important;
    background: #2c3e50;
}

.tile .v-list__tile:hover {
    background: #2c3e50!important;
    color: #f5f5f5!important;
    transition: background-color 100ms linear;
}

.tile .v-icon{
    color: inherit!important;
    transition: background-color 100ms linear;
}

.v-toolbar__content {
  color:#2c3e50!important
}

.sidebar-img:hover {
  transform: scale(1.15, 1.15);
}

.sidebar-img {
  transition: all 0.5s;
}
</style>
