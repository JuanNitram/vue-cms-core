<template>
  <div :class="{ none : !isReady }">
    <h1 class="pb-4">Dashboard</h1>
    <analytics/>
  </div>
</template>

<script>
    import Analytics from '../components/Analytics'
    import eventBus from '../EventBus.js'

    export default{
      components: {
        Analytics
      },
      data(){
        return {
          isReady: false,
        }
      },
      created(){
        eventBus.$on('analytics-ready', () => {
          this.isReady = true
        })
      },
      computed: {
        loading(){
          return this.$store.getters.loading
        }
      }
    }
</script>

<style lang="css">
  .none{
    visibility: hidden;
  }
</style>
