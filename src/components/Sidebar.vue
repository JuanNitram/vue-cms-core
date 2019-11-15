<template>
  <v-navigation-drawer v-model="drawer" app clipped>
    <v-list dense>
      <v-list-item v-for="item in items" :key="item.title" :to="item.link" @click="isLoading(item.link)" class="text-left">
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title><span class="subtitle-1 text-left">{{ item.title }}</span></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
<!--    <v-navigation-drawer v-model="drawer" app clipped>-->
<!--&lt;!&ndash;        <v-list class="pa-1">&ndash;&gt;-->
<!--&lt;!&ndash;            <v-list-tile avatar>&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <img width="40" height="40">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                <div class="v-toolbar__title">&ndash;&gt;-->
<!--&lt;!&ndash;                    <v-list-tile-content>&ndash;&gt;-->
<!--&lt;!&ndash;                        <v-list-tile-title class="title">{{ $route.meta.title }}</v-list-tile-title>&ndash;&gt;-->
<!--&lt;!&ndash;                    </v-list-tile-content>&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--&lt;!&ndash;            </v-list-tile>&ndash;&gt;-->
<!--&lt;!&ndash;        </v-list>&ndash;&gt;-->

<!--        <v-list class="pt-0" dense>-->
<!--            <v-divider></v-divider>-->
<!--            <v-list-tile class="pt-1 tile" active-class="tile-active" v-for="item in items" :key="item.title" :to="item.link" @click="isLoading(item.link)">-->
<!--                <v-list-tile-action>-->
<!--                    <v-icon>{{ item.icon }}</v-icon>-->
<!--                </v-list-tile-action>-->
<!--                <v-list-tile-content>-->
<!--                    <v-list-tile-title class="subheading">{{ item.title }}</v-list-tile-title>-->
<!--                </v-list-tile-content>-->
<!--            </v-list-tile>-->
<!--        </v-list>-->
<!--    </v-navigation-drawer>-->
</template>

<script>
import eventBus from '../EventBus.js'
import filters from '../filters.js'

export default {
    data () {
        return {
            drawer: null,
            items: [
                { title: 'Dashboard', icon: 'mdi-view-dashboard' , link: '/dashboard' },
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
