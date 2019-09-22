<template>
    <div v-show="!loading">
        <v-layout row>
            <v-flex xs12>
                <div class="text-xs-left">
                    <v-btn color="primary" dark medium icon flat @click="goBack">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
                    <v-btn v-if='$route.name == "new-section"' color="primary" dark medium icon flat @click="save">
                        <v-icon>
                            done
                        </v-icon>
                    </v-btn>
                    <v-btn v-else @click="update"  color="primary" dark medium icon flat>
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
                                    <v-text-field label="Name" data-vv-name="name" v-model="section.name" outline :rules="rules.name" />
                                </v-layout>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex xs4>
                                <v-layout column>
                                    <v-checkbox label="Active" data-vv-name="active" type="checkbox" v-model="section.active" outline required />
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

export default{
    components: {
        MediasManager,
    },
    props: {
        component: String,
    },
    data(){
        return {
            section: {
                name: '',
                active: true,
                // medias: [],
            },
            rules: {
                name: [
                    v => !!v || 'Name is required',
                ],
            },
        }
    },
    created(){
        this.$store.commit('SET_LOADING', true);

        eventBus.$once('medias-change', (medias) => {
            this.section.medias = medias;
        });

        eventBus.$once('medias-remove', (media) => {
            this.removeMedia(media);
        });

        eventBus.$once('elem-fetched', (data) => {
            this.section = data.section;
            this.$store.commit('SET_LOADING', false);
        });
        if(this.$route.params.id){
            eventBus.$emit('get', this.$route.params.id);
        }
        if(this.$route.name == 'new-section'){
            this.$store.commit('SET_LOADING', false);
        }
    },
    methods: {
        save(){
            this.$store.commit('SET_LOADING', true);
            
            if(this.$refs.form.validate()){
                let params = this.section;
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
                let params = this.section;
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
        loading(){ return this.$store.getters.loading }
    }
}
</script>
