<template>
    <v-navigation-drawer v-model="drawer" absolute temporary persistent>
        <v-list class="pa-1">
            <v-list-tile avatar>
                <img :src="appUrl + 'logo-min.png'" width="40" height="40">
                <div class="v-toolbar__title">
                    <v-list-tile-content>
                        <v-list-tile-title class="title">{{ $route.meta.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </div>
            </v-list-tile>
        </v-list>

        <v-list class="pt-0" dense>
            <v-divider></v-divider>
            <v-list-tile class="pt-1 tile" active-class="tile-active" v-for="item in items" :key="item.title" :to="item.link" @click="isLoading(item.link)">
                <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title class="subheading">{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import eventBus from '../EventBus.js'
import filters from '../filters.js'

export default {
    data () {
        return {
            drawer: null,
            items: [
                { title: 'Dashboard', icon: 'dashboard' , link: '/dashboard' },
            ],
        }
    },
    created() {
        this.sections.forEach(element => {
            let section = {};
            section.title = filters.capitalize(element.name);
            section.link = '/' + element.name;
            section.icon = element.icon;
            this.items.push(section);
        });

        eventBus.$on('show-side-bar', () => {
            this.drawer = !this.drawer;
        });
    },
    methods: {
        isLoading(link){
            this.$store.commit('SET_LOADING', true);
        }
    },
    computed: {
        appUrl(){ return this.$store.getters.appUrl },
        sections(){ return this.$store.getters.user.sections }
    }
}
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
}

.tile .v-icon{
    color: inherit!important;
}

.v-toolbar__title {
    color: #2c3e50!important
}

.logo-sidebar {
    margin-left: 20px;
}
</style>
