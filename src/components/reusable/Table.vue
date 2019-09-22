<template>
    <v-card>
        <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details/>
        </v-card-title>

        <v-data-table :headers="headers" :items="items" :search="search" :pagination.sync="pagination" ref="sortableTable" :custom-filter="filter" disable-initial-sort>
            <template slot="items" slot-scope="props">
                <tr class="sortableRow" :key="props.item.id" @mouseover="onMouseOverRow" @mouseleave="onMouseLeaveRow">

                    <td v-for="(header, i) in headers" :class="[headerLeft(header), header.value == 'drag_check' ? 'pl-0' : '']" :key="i" >

                        <div v-if="header.value == 'drag_check'" class="d-flex">
                            <div style="cursor: move" icon class="sortHandle"><v-icon>drag_indicator</v-icon></div>
                            <v-checkbox @change="props.item.selected = toggle(props)" primary hide-details :input-value="props.item.selected"></v-checkbox>
                        </div>

                        <div v-else-if="header.value == 'media'">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                  <div v-if="props.item.thumb" v-on="on">
                                      <img :src="props.item.thumb.full_url" height="24" width="24" />
                                  </div>
                                  <div v-else v-on="on">
                                      <img :src="storageUrl + 'thumb_default.png'" height="24" width="24" />
                                  </div>
                              </template>
                              <span>
                                  <div v-if="props.item.thumb">
                                      <img :src="props.item.thumb.full_url" height="65" width="65" />
                                  </div>
                                  <div v-else>
                                      <img :src="storageUrl + 'thumb_default.png'" height="65" width="65" />
                                  </div>
                              </span>
                            </v-tooltip>
                        </div>

                        <div v-else-if="header.value == 'active'">
                            <v-icon v-if="props.item.active">check_circle_outline</v-icon>
                            <v-icon v-else>highlight_off</v-icon>
                        </div>

                        <div v-else-if="header.value == 'highlighted'">
                            <v-icon v-if="props.item.highlighted">check_circle_outline</v-icon>
                            <v-icon v-else>highlight_off</v-icon>
                        </div>

                        <div v-else-if="header.value == 'actions'" class="actions">
                            <v-tooltip bottom>
                                <v-btn  color="primary" dark small icon flat slot="activator" @click="editItem(props.item)">
                                    <v-icon small >
                                        edit
                                    </v-icon>
                                </v-btn>
                                Edit this
                            </v-tooltip>
                            <v-tooltip bottom>
                                <v-btn  color="primary" dark small icon flat slot="activator" @click="removeItem(props.item)">
                                    <v-icon small >
                                        delete
                                    </v-icon>
                                </v-btn>
                                Remove this
                            </v-tooltip>
                        </div>

                        <div v-else >
                            <div v-if="header.relation && header.type">
                                <div v-if="header.type == 'belongsTo'">
                                    {{ props.item[header.relation].name }}
                                </div>
                                <div v-else>
                                    {{ props.item[header.relation] }}
                                </div>
                            </div>
                            <div v-else>
                                {{ props.item[header.value]}}
                            </div>
                        </div>

                    </td>

                </tr>
            </template>

            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
            </v-alert>
        </v-data-table>
    </v-card>
</template>

<script>
    import Sortable from 'sortablejs'
    import eventBus from '../../EventBus.js'
    import { setTimeout } from 'timers';
    import { log } from 'util';

    export default {
        props: {
            headers: Array,
        },
        data(){
            return {
                pagination: {},
                renderCount: 1,
                tableReady: false,
                section: this.$route.meta.section,
                search: '',
                items: [],
                inBlockActionSelected: [],
                reorderedItems: [],
                itemKeys: new WeakMap(),
                currentItemKey: 0,
                isActiveInBlockAction: false,
            }
        },
        created(){
            if(this.$route.query.sortBy){
                let split = this.$route.query.sortBy.split('_');
                this.pagination.sortBy = split[0]
                this.pagination.descending = (split[1] == 'desc' ? true : false)
            }

            if(this.$route.query.search){
                this.search = this.$route.query.search;
            }

            this.$store.commit('SET_LOADING', true);

            this.$http.get(this.url, { params: {parent:  this.user.email}}).then((response) => {
                let res = response.data;
                if(res.success){
                    this.items = res.data[this.section];
                }
                this.$store.commit('SET_LOADING', false);
            });

            eventBus.$off('form-new').$once('form-new', (component) => {
                if(component && component == this.section)
                    this.$router.push(this.section + '/new')
            });

            eventBus.$off('save-order').$on('save-order', (component) => {
                if(component && component == this.section){
                    let items = this.items;

                    if(this.reorderedItems.length)
                        items = this.reorderedItems;

                    this.$http.post(this.url + '/save-order', { items: items.map((a) => { return a.id }) }).then((response) => {
                        let res = response.data;
                        this.$store.commit('SET_LOADING', false);
                    });
                }
            });

            eventBus.$off('remove-many').$on('remove-many', (component) => {
                if(component && component == this.section){
                    let items = this.inBlockActionSelected;
                    for (let i = 0; i < items.length ;i++){
                        let removed = false;
                        for (let j = 0; j < this.items.length && !removed ; j++){
                            if(this.items[j].id == items[i].id){
                                removed = true;
                                this.items.splice(j, 1);
                            }
                        }
                    }
                    this.$http.post(this.url + '/remove-many', { items: items.map((a) => { return a.id }) }).then((response) => {
                        let res = response.data;
                        this.$store.commit('SET_LOADING', false);
                    });
                }
            });

            eventBus.$off('active-many').$on('active-many', (component) => {
                if(component && component == this.section){
                    let items = this.inBlockActionSelected;

                    this.$http.post(this.url + '/active-many', { items: items.map((a) => { return a.id }), active: 1 }).then((response) => {
                        let res = response.data;
                        this.$store.commit('SET_LOADING', false);
                    });
                }
            });

            eventBus.$off('disable-many').$on('disable-many', (component) => {
                if(component && component == this.section){
                    let items = this.inBlockActionSelected;

                    this.$http.post(this.url + '/active-many', { items: items.map((a) => { return a.id }), active: 0 }).then((response) => {
                        let res = response.data;
                        this.$store.commit('SET_LOADING', false);
                    });
                }
            });

        },
        mounted(){
            Array.from(document.getElementsByClassName('clickable')).forEach(element => {
                    element.addEventListener('click', () => { eventBus.$emit('order-changed') })
                }
            );

            new Sortable(
                this.$refs.sortableTable.$el.getElementsByTagName('tbody')[0],
                {
                    draggable: '.sortableRow',
                    handle: '.sortHandle',
                    onEnd: this.dragReorder
                }
            );

        },
        updated(){
            if(!this.tableReady){
                if(this.renderCount > 0) {
                    this.renderCount--;
                } else {
                    this.tableReady = true;
                    // if(this.$route.query.sortBy){
                    //         let split = this.$route.query.sortBy.split('_');
                    //     this.pagination.sortBy = split[0]
                    //     this.pagination.descending = (split[1] == 'desc' ? true : false)
                        
                    // }
                    if(this.$route.query.page){
                        this.pagination.page = parseInt(this.$route.query.page)
                    }
                    if(this.$route.query.perPage){
                        this.pagination.rowsPerPage = parseInt(this.$route.query.perPage)
                    }
                }
            } else {
                if(this.pagination.sortBy){
                    this.$router.replace({
                        query: {
                            search: this.search,
                            page: this.pagination.page,
                            perPage: this.pagination.rowsPerPage,
                            sortBy: (this.pagination.sortBy ? this.pagination.sortBy : 'null') + '_' + (this.pagination.descending ? 'desc' : 'asc')
                        }
                    })
                } else {
                    this.$router.replace({
                        query: {
                            search: this.search,
                            page: this.pagination.page,
                            perPage: this.pagination.rowsPerPage,
                        }
                    })
                }
                
            }
        },
        methods: {
            onMouseOverRow(e){
                e.target.closest('tr').querySelector('.actions').classList.remove('d-none-actions')
            },
            onMouseLeaveRow(e){
                e.target.closest('tr').querySelector('.actions').classList.add('d-none-actions')
            },
            editItem(item){
                this.$router.push(this.section + '/edit/' + item.id)
            },
            removeItem(item){
                this.$http.post(this.url + '/remove/' + item.id).then((response) => {
                    let res = response.data;
                    let removed = false;
                    for(let i = 0; i < this.items.length && !removed; i++){
                        if(this.items[i].id == item.id){
                            removed = true;
                            this.items.splice(i, 1);
                        }
                    }
                    this.$store.commit('SET_LOADING', false);
                });
            },
            dragReorder ({oldIndex, newIndex, item}) {
                eventBus.$emit('order-changed'); // Captured on components/ActionBar
                const movedItem = this.items.splice(oldIndex, 1)[0];
                this.items.splice(newIndex, 0, movedItem);
                this.items[newIndex].changed = true;
            },
            itemKey (item) {
                if (!this.itemKeys.has(item)) this.itemKeys.set(item, ++this.currentItemKey)
                    return this.itemKeys.get(item)
            },
            headerLeft(header){
                if(header.value == 'id')
                    return 'text-xs-left'
                return ''
            },
            filter(items, search, filter) {
                search = search.toString().toLowerCase()
                let sorted = items.filter(i => (
                    Object.keys(i).some(j => filter(i[j], search))
                ));
                this.reorderedItems = sorted;

                return sorted;
            },
            toggle(props){
                let exists = false;

                for(let i = 0; i < this.inBlockActionSelected.length ;i++){
                    if(this.inBlockActionSelected[i].id == props.item.id){
                        exists = true;
                        this.inBlockActionSelected.splice(i, 1);
                    }
                }

                if(!exists)
                    this.inBlockActionSelected.push(props.item);

                if(props.item.selected == undefined)
                    return true;

                return !props.item.selected;
            },
        },
        watch: {
            inBlockActionSelected(){
                if(this.inBlockActionSelected.length){
                    eventBus.$emit('active-operations-in-block-action');
                } else {
                    eventBus.$emit('disable-operations-in-block-action');
                }
            },
        },
        computed: {
            url(){ return this.$store.getters.baseUrl + this.$route.meta.section },
            storageUrl(){ return this.$store.getters.storageUrl },
            user(){ return this.$store.state.user },
        }
    }

</script>

<style>
    .actions {
        display:flex;
    }
    .v-tooltip__content {
        padding: 5px 4px 0px 4px!important;
    }
</style>
