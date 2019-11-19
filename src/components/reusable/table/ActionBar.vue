<template>
  <div class="text-left">

    <v-btn color="primary" icon @click="$router.go(-1)" >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <v-btn v-if="manySelected === false" color="primary" icon @click="$router.push(`${section}/new`)">
      <v-icon class="fix-padding-btn">mdi-plus</v-icon>
    </v-btn>

<!--  <v-tooltip bottom>-->
<!--  <v-btn v-if="this.orderChanged" color="primary" class="caption" dark medium icon text @click="saveOrder">-->
<!--  <v-icon class="fix-padding-btn">reorder</v-icon>-->
<!--  </v-btn>-->
<!--  Save Order-->
<!--  </v-tooltip>-->

    <v-btn v-if="manySelected === true" color="primary" icon @click="handle('enable')">
      <v-icon class="fix-padding-btn">mdi-check</v-icon>
    </v-btn>

    <v-btn v-if="manySelected === true" color="primary" icon @click="handle('disable')">
      <v-icon class="fix-padding-btn">mdi-close</v-icon>
    </v-btn>

    <v-btn v-if="manySelected === true" color="primary" icon @click="handle('remove')">
      <v-icon class="fix-padding-btn">mdi-delete</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Are you sure ?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            No
          </v-btn>
          <v-btn color="green darken-1" text @click="emitAction">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  export default{
    props: {
      manySelected: Boolean,
    },

    data(){
      return {
        dialog: false,
        action: null,
      }
    },

    methods: {
      handle(action){
        this.action = action;
        this.dialog = !this.dialog;
      },

      emitAction(){
        this.$emit('action-emitted', this.action);
        this.dialog = !this.dialog;
      }
    },

    computed: {
      section(){
        return this.$route.meta.section;
      }
    }
  }
</script>

<style lang="css" scoped>
    .fix-padding-btn {
        padding-right: 2px;
    }
</style>