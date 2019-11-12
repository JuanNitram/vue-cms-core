<template>
    <v-container v-show="!loading">
        <v-row pa-5>
            <v-col cols="12">
                <div class="text-left">
                    <v-btn color="primary" dark medium icon flat @click="goBack">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
                    <v-btn v-if='$route.name == "new-product"' color="primary" dark medium icon flat @click="save">
                        <v-icon>done</v-icon>
                    </v-btn>
                    <v-btn v-else @click="update"  color="primary" dark medium icon flat>
                        <v-icon>done</v-icon>
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        <v-row pa-5>
            <v-col cols="12" lg="8" md="8" sm="12" xs="12">
                <v-form ref="form">
                    <v-layout>
                        <v-text-field label="Name" data-vv-name="name" v-model="product.name" outlined :rules="rules.name" />
                    </v-layout>

                    <v-layout>
                        <v-textarea  label="Description" data-vv-name="description" v-model="product.description" outlined :rules="rules.description" />
                    </v-layout>

                    <v-layout pb-7>
                        <quill-editor v-if="renderComponents" ref="myTextEditor" v-model="quill.content" :options="quill.editorOption"
                            @change="onEditorChange($event)" @ready="onEditorReady($event)"/>
                    </v-layout>

                    <v-layout>
                        <SelectSimple v-if="renderComponents" ref="category" :label="'Category'" :url="categoriesUrl"
                            :section="'categories'" :selectedItem="product.categories_id" :required="true"/>
                    </v-layout>

                    <v-layout>
                        <SelectMultiple v-if="renderComponents" ref="subcategories" :parentSelected="product.categories_id"
                            :listen="'categories'" :listenUrl="subcategoriesUrl" :label="'Subcategory'"
                            :url="subcategoriesUrl" :section="'subcategories'" :itemsSelected="product.subcategories"/>
                    </v-layout>

                    <v-layout>
                        <v-flex xs4>
                            <v-layout column>
                                <v-switch v-model="product.active" data-vv-name="active" label="Active"/>
                            </v-layout>
                        </v-flex>

                        <v-flex xs4>
                            <v-layout column>
                                <v-switch v-model="product.highlighted" data-vv-name="highlighted" label="Highlighted"/>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                <MediasManager v-if="renderComponents" ref="medias" :label="'Medias'" :limit="2" :existingMedia="product.medias.medias ? product.medias.medias.thumb : []"/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import eventBus from '../../EventBus.js'
import MediasManager from '../reusable/MediasManager'
import SelectSimple from '../reusable/selects/Simple'
import SelectMultiple from '../reusable/selects/Multiple'

export default{
    components: {
        MediasManager,
        SelectSimple,
        SelectMultiple,
    },
    props: {
        component: String,
    },
    data(){
        return {
            product: {
                name: '',
                description: '',
                description_quill: null,
                
                categories_id: null,
                subcategories: [],

                medias: [],
                existingMedias: [],
                existingMediasExtra: [],

                active: true,
                highlighted: false,
            },
            renderComponents: false,
            totalCustomComponents: 2,
            quill: {
                content: '',
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'font': [] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
                            ['clean'],
                            ['link', 'image', 'video']
                        ],
                        syntax: {
                            highlight: text => hljs.highlightAuto(text).value
                        }
                    }
                }
            },
            rules: {
                name: [
                    v => !!v || 'Name is required',
                    v => (v && v.length <= 15) || 'Name must be less than 15'
                ],
                description: [
                    v => !!v || 'Description is required',
                    v => (v && v.length <= 140) || 'Description must be less than 140'
                ]
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

        eventBus.$on('medias-remove', (media) => {
            this.removeMedia(media);
        })

        eventBus.$once('elem-fetched', (data) => {
            let subcategories = [];

            data.product.subcategories.forEach((s) => {  subcategories.push(s.id); });
            data.product.subcategories = subcategories;

            this.product = data.product;
            this.product.existingMedias = [];
            this.product.existingMediasExtra = [];

            this.renderComponents = true;
        })

        if(this.$route.params.id){
            eventBus.$emit('get', this.$route.params.id); // Captured on components/form/Form
        }

        if(this.$route.name == 'new-product'){
            this.renderComponents = true;
        }
    },
    methods: {
        save(){
            this.$store.commit('SET_LOADING', true);

            if(this.$refs.form.validate()){
                if(this.$refs.category) this.product.categories_id = this.$refs.category.selected

                let params = this.product;
                let formData = new FormData();

                for (var key in params) {
                    if(key != 'medias')
                        formData.append(key, params[key]);
                }

                if(this.$refs.subcategories.selected.length){
                    this.$refs.subcategories.selected.forEach((m) => {
                        formData.append('subcategories[]', m);
                    });
                }

                if(this.$refs.medias.medias.length){
                    this.$refs.medias.medias.forEach((m) => {
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
                if(this.$refs.category) this.product.categories_id = this.$refs.category.selected

                let params = this.product;
                let formData = new FormData();

                for (var key in params) {
                    if(key != 'medias')
                        formData.append(key, params[key]);
                }

                if(this.$refs.subcategories.selected.length){
                    this.$refs.subcategories.selected.forEach((m) => {
                        formData.append('subcategories[]', m);
                    });
                }

                if(this.$refs.medias.medias.length){
                    this.$refs.medias.medias.forEach((m) => {
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
        },
        onEditorReady(quill) {
            if(this.product.description_quill)
                quill.setContents(JSON.parse(this.product.description_quill));
        },
        onEditorChange({ quill, html, text }) {
            this.product.description_quill = JSON.stringify(quill.getContents());
            this.quill.content = html
        },
    },
    computed: {
        loading(){ return this.$store.getters.loading },
        categoriesUrl() { return this.$store.getters.baseUrl + 'categories' },
        subcategoriesUrl() { return this.$store.getters.baseUrl + 'subcategories' },
    }
}
</script>

<style>
    .quill-editor {
        border: 1px solid rgba(0,0,0,.35);
        border-radius: 4px;
    }

    .ql-container {
        border-top: 2px solid rgba(0,0,0,.54);
        border-radius: 0px;
        height: 30vh!important;
    }
</style>
