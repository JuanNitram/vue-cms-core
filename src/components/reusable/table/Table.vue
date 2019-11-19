<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <ActionBar :many-selected="manySelected" @action-emitted="onActionEmitted"/>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">

        <v-data-table v-model="selected" :items="items" :headers="headers" :page.sync="page" :items-per-page="perPage"
            class="elevation-1" hide-default-footer :options.sync="options" :loading="loading"
            show-select item-key="id">

          <template v-slot:item.thumb="{ item }">
            <v-img :src="item.thumb.full_url" aspect-ratio="1"
              class="grey lighten-2" max-width="25" max-height="25"></v-img>
          </template>

          <template v-slot:item.active="{ item }">
            <v-icon v-if="item.active === true">mdi-check</v-icon>
            <v-icon v-else>mdi-close</v-icon>
          </template>

          <template v-slot:item.highlighted="{ item }">
            <v-icon v-if="item.highlighted === true">mdi-check</v-icon>
            <v-icon v-else>mdi-close</v-icon>
          </template>

          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="$router.push(`${section}/edit/${item.id}`)">mdi-pencil</v-icon>
            <v-icon small @click="onRemove(item)">mdi-delete</v-icon>
          </template>

        </v-data-table>

        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount" :total-visible="5"></v-pagination>
        </div>

        <v-dialog v-model="dialog" max-width="290">
          <v-card>
            <v-card-title class="headline">Are you sure ?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">
                No
              </v-btn>
              <v-btn color="green darken-1" text @click="remove">
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import ActionBar from './ActionBar';

  export default {
    components: {
      ActionBar,
    },

    props: {
      headers: Array,
      perPage: Number,
    },

    data(){
      return {
        selected: [],
        items: [],
        options: {},
        pageCount: 0,
        page: 1,
        loading: false,
        dialog: false,
        toRemove: null,
      }
    },

    created(){
      this.$store.commit('SET_LOADING', false);
      this.fetch();
    },

    methods: {
      fetch(){
        this.loading = true;
        this.$http.get(`${this.apiUrl}?page=${this.page}&perPage=${this.perPage}`).then(res => {
          this.items = res.data.data[this.section].data;
          this.pageCount = res.data.data[this.section].last_page;
        }).catch(ex => {
          this.$toasted.show(ex);
        }).finally(() => {
          this.loading = false;
        });
      },

      onActionEmitted(action){
        console.log(action);
      },

      onEdit(item){

      },

      onRemove(item){
        this.toRemove = item;
        this.dialog = !this.dialog;
      },

      remove(){
        this.$store.commit('SET_LOADING', true);
        this.$http.post(`${this.apiUrl}/remove/${this.toRemove.id}`).then(res => {
          this.$toasted.show(res.data.message);
        }).catch(ex =>{
          this.$toasted.show(ex);
        }).finally(() => {
          this.dialog = !this.dialog;
          this.$store.commit('SET_LOADING', false);
          this.fetch();
        });
      },

      handle(action){
        console.log(action)
      }
    },

    computed: {
      section(){
        return this.$route.meta.section;
      },
      apiUrl(){
        return this.$store.getters.apiUrl + this.section;
      },
      manySelected(){
        return this.selected.length > 0;
      }
    },

    watch: {
      page(){
        this.fetch();
      }
    }
  }
</script>
