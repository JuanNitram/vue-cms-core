<template>
    <div v-show="!loading">
        <v-layout row>
            <v-flex xs12>
                <div class="text-xs-left">
                    <v-btn color="primary" dark medium icon flat @click="goBack">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
                    <v-btn v-if='$route.name == "new-admin"' color="primary" dark medium icon flat @click="save">
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
                                    <v-text-field label="Name" data-vv-name="name" v-model="admin.name" :rules="rules.name" outline />
                                </v-layout>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex xs12>
                                <v-layout column>
                                    <v-text-field label="Email" data-vv-name="email" v-model="admin.email" :rules="rules.email" outline />
                                </v-layout>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex xs12>
                                <v-layout column>
                                    <v-text-field v-if="$route.name=='edit-admin'" label="Password" data-vv-name="password" v-model="admin.password" type="password" outline />
                                    <v-text-field v-else label="Password" data-vv-name="password" v-model="admin.password" type="password" :rules="rules.password" outline />
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    
                        <v-layout row>
                            <v-flex xs12>
                                <v-layout column>
                                    <v-text-field v-if="$route.name == 'edit-admin'" label="Confirm Password" data-vv-name="c_password" v-model="admin.c_password" type="password" outline/>
                                    <v-text-field v-else label="Confirm Password" data-vv-name="c_password" v-model="admin.c_password" type="password" :rules="rules.password" outline/>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                        
                        <v-layout row>
                            <v-flex xs12>
                                <v-layout column>
                                    <SelectSimple v-if="renderSelects" :label="'Admin Type'" :url="adminsTypes_url" 
                                        :section="'adminsTypes'" :selectedItem="admin.types_id" :required="true"/>
                                    </v-layout>
                            </v-flex>
                        </v-layout>
                        
                        <v-layout row>
                            <v-flex xs12>
                                <v-layout column>
                                    <SelectMultiple v-if="renderSelects" :label="'Sections'" :url="sections_url" 
                                        :section="'sections'" :itemsSelected="admin.sections"/>
                                </v-layout>
                            </v-flex>
                        </v-layout> 

                        <v-layout row>
                            <v-flex xs4>
                                <v-layout column>
                                    <v-checkbox label="Active" data-vv-name="active" type="checkbox" v-model="admin.active" required outline/>
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
import SelectMultiple from '../reusable/selects/Multiple'
import SelectSimple from '../reusable/selects/Simple'

export default{
    components: {
        SelectMultiple,
        SelectSimple
    },
    props: {
        component: String,
    },
    data(){
        return {
            admin: {
                name: '',
                email: '',
                password: '',
                c_password: '',
                active: true,
                types_id: null,
                sections: [],
                parent: this.$store.state.user.email,
            },
            renderSelects: false,
            totalCustomComponents: 2,
            rules: {
                name: [
                    v => !!v || 'Name is required',
                ],
                email: [
                    v => !!v || 'Email is required',
                ],
                password: [
                    v => !!v || 'Password is required',
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

        eventBus.$once('elem-fetched', (data) => {
            let sections = [];
            data.admin.sections.forEach((s) => {
                sections.push(s.id);
            });
            data.admin.sections = sections;
            this.admin = data.admin;
            this.admin.parent = this.user.email;
            this.renderSelects = true;
        });

        eventBus.$on('adminsTypes-select-changed', (types_id) => {
            this.admin.types_id = types_id;
        });

        eventBus.$on('sections-select-changed', (sections) => {            
            this.admin.sections = sections;
        });

        if(this.$route.params.id){
            eventBus.$emit('get', this.$route.params.id);
        }

        if(this.$route.name == 'new-admin'){
            this.renderSelects = true;
            this.$store.commit('SET_LOADING', false);
        }
    },
    methods: {
        save(){
            this.$store.commit('SET_LOADING', true);
            if(this.$refs.form.validate()){
                let params = this.admin;
                let formData = new FormData();

                for (var key in params) {
                    formData.append(key, params[key]);
                }

                if(params.sections){
                    params.sections.forEach((m) => {
                        formData.append('sections[]', m);
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
                let params = this.admin;
                let formData = new FormData();

                for (var key in params) {
                    formData.append(key, params[key]);
                }

                if(params.sections){
                    params.sections.forEach((m) => {
                        formData.append('sections[]', m);
                    });
                }

                eventBus.$emit('update', formData);
            } else {
                this.$store.commit('SET_LOADING', false);
            }
        },
        goBack(){
            this.$router.go(-1);
        }
    },
    computed: {
        loading(){ return this.$store.getters.loading },
        user(){ return this.$store.getters.user },
        adminsTypes_url(){ return this.$store.state.baseUrl + 'adminsTypes?parent=' + this.$store.state.user.email },
        sections_url(){ return this.$store.state.baseUrl + 'sections?parent=' + this.$store.state.user.email },
    }
}
</script>

<style>
.img-thumbnail {
    width: 80px;
    height: 80px;
}
</style>
