<template>
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
        <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
        <v-icon small @click="remove(item)">mdi-delete</v-icon>
      </template>

    </v-data-table>

    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>

  </v-col>
</v-row>
</template>

<script>
  export default {
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
          console.log(ex)
        }).finally(() => {
          this.loading = false;
        });
      },

      edit(){

      },

      remove(){

      },
    },

    computed: {
      section(){
        return this.$route.meta.section;
      },
      apiUrl(){
        return this.$store.getters.apiUrl + this.section;
      }
    }
  }
</script>
