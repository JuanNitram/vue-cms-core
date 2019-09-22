<template>
    <div id="app">
        <v-app>
            <div v-if="!$route.meta.isLogin">
                <Navbar v-if="checked"/>
                <Sidebar/>
            </div>

            <v-container v-if="checked" fluid>
                <v-layout row wrap>
                    <v-flex xs12>
                        <transition name="fade" mode="out-in">
                            <router-view/>
                        </transition>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-container fluid>
                <v-progress-circular v-show="loading" class="progress-fix" size="70" width="7" indeterminate/>
            </v-container>

            <v-footer class="pa-3" height="8vh">
                <v-spacer></v-spacer>
                <v-flex py-3 text-xs-center xs12>
                    <div>&copy; {{ new Date().getFullYear() }} - <strong>Sideral</strong></div>
                </v-flex>
            </v-footer>

        </v-app>
        
    </div>
</template>

<script>
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

export default {
    components: {
        Navbar,
        Sidebar
    },
    data(){
        return {
            checked: false,
        }
    },
    mounted() {
        this.$store.commit('SET_LOADING', true);

        this.$http.get(process.env.VUE_APP_API_URL + "check").then(res => {
            this.$store.commit('SET_LOADING', false);
            this.checked = true;
        })
        .catch(ex => {
            this.$router.push('/login')
            this.$store.commit('SET_LOADING', false)
            this.checked = true
        });
    },
    computed: {
        loading(){
            return this.$store.getters.loading;
        },
    }
}
</script>

<style lang="css" scoped>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50!important;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

.progress-fix {
    position: fixed;
    z-index: 999;
    height: 60px;
    width: 60px;
    overflow: visible;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
</style>
