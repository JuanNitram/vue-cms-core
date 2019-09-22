<template>
    <div v-show="!loading">
        <v-layout row>
            <v-flex xs12>
                <div class="text-xs-left">
                    <v-btn color="primary" dark medium icon flat @click="goBack">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
                    <v-btn v-if='$route.name == "new-subcategory"' color="primary" dark medium icon flat @click="save">
                        <v-icon>
                            done
                        </v-icon>
                    </v-btn>
                    <v-btn v-else @click="update" color="primary" dark medium icon flat>
                        <v-icon>
                            done
                        </v-icon>
                    </v-btn>
                </div>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex d-flex xs12 sm12 md8 lg7 pa-4>
                <v-layout column>
                    <v-form ref="form">
                        <v-layout row>
                            <v-flex xs12>
                                <v-layout column>
                                    <v-text-field label="Name" data-vv-name="name" v-model="subcategory.name" outline :rules="rules.name" />
                                </v-layout>
                            </v-flex>
                        </v-layout> 

                        <v-layout row>
                            <v-flex xs12>
                                <v-layout column>
                                    <SelectSimple v-if="renderSelects" :label="'Category'" :url="categoriesUrl"
                                        :section="'categories'" :selectedItem="subcategory.categories_id" :required="true"/>
                                </v-layout>
                            </v-flex>
                        </v-layout>     

                        <v-layout row>
                            <v-flex xs4>
                                <v-layout column>
                                    <v-checkbox label="Active" data-vv-name="active" type="checkbox" v-model="subcategory.active" outline required />
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import eventBus from '../../EventBus.js'
import MediasManager from '../reusable/MediasManager'
import SelectSimple from '../reusable/selects/Simple'

export default{
    components: {
        MediasManager,
        SelectSimple
    },
    props: {
        component: String,
    },
    data(){
        return {
            subcategory: {
                name: '',
                active: true,
                categories_id: null,
            },
            totalCustomComponents: 1,
            renderSelects: false,
            rules: {
                name: [
                    v => !!v || 'Name is required',
                ],
            },
        }
    },
    created(){
        this.$store.commit('SET_LOADING', true);

        eventBus.$on('component-rendered', () => {
            this.totalCustomComponents--;
            if(this.totalCustomComponents == 0){
                this.$store.commit('SET_LOADING', false);
            }
        })

        eventBus.$once('medias-change', (medias) => {
            this.subcategory.medias = medias;
        });

        eventBus.$once('medias-remove', (media) => {
            this.removeMedia(media);
        });

        eventBus.$once('elem-fetched', (data) => {
            this.subcategory = data.subcategory;
            this.renderSelects = true;
            // this.$store.commit('SET_LOADING', false);
        });

        eventBus.$on('categories-select-changed', (categories_id) => {
            this.subcategory.categories_id = categories_id;
        });

        if(this.$route.params.id){
            eventBus.$emit('get', this.$route.params.id);
        }
        if(this.$route.name == 'new-subcategory'){
            this.renderSelects = true;
            // this.$store.commit('SET_LOADING', false);
        }
    },
    methods: {
        save(){
            this.$store.commit('SET_LOADING', true);
            
            if(this.$refs.form.validate()){
                let params = this.subcategory;
                let formData = new FormData();

                for (var key in params) {
                    formData.append(key, params[key]);
                }

                if(params.medias){
                    params.medias.forEach((m) => {
                        formData.append('medias[]', m);
                    });
                }

                eventBus.$emit('save', formData);
            } else {
                this.$store.commit('SET_LOADING', false);
            }
        },
        update(){
            this.$store.commit('SET_LOADING', true);

            if(this.$refs.form.validate()){
                let params = this.subcategory;
                let formData = new FormData();

                for (var key in params) {
                    formData.append(key, params[key]);
                }

                if(params.medias){
                    params.medias.forEach((m) => {
                        formData.append('medias[]', m);
                    });
                }
                
                eventBus.$emit('update', formData);
            } else {
                this.$store.commit('SET_LOADING', false);
            }
        },
        removeMedia(media){
            let formData = new FormData();
            formData.append('media_id', media.id);
            
            eventBus.$emit('removeMedia', formData);
        },
        goBack(){
            this.$router.go(-1);
        }
    },
    computed: {
        loading(){ return this.$store.getters.loading },
        categoriesUrl(){ return this.$store.state.baseUrl + 'categories' },
    }
}
</script>
