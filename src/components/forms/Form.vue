<template>
    <v-layout row>
        <v-flex xs12>
            <component :is="component"/>
        </v-flex>
    </v-layout>
</template>

<script>
import eventBus from '../../EventBus.js'
import FormProductos from './FormProductos'
import FormAdministradores from './FormAdministradores'
import FormSliders from './FormSliders'
import FormCategories from './FormCategories'
import FormSubcategories from './FormSubcategories'
import FormSections from './FormSections'

export default{
    components: {
        FormProductos,
        FormAdministradores,
        FormSliders,
        FormCategories,
        FormSubcategories,
        FormSections
    },
    props: {
        component: String,
    },
    data(){
        return {
            section: this.$router.currentRoute.meta.section,
        }
    },
    created(){
        eventBus.$off('save').$once('save', (params) => {
            this.save(params);
        });

        eventBus.$off('update').$once('update', (params) => {
            this.update(params);
        });

        eventBus.$off('removeMedia').$on('removeMedia', (params) => {
            this.removeMedia(params);
        });

        eventBus.$off('get').$once('get', (id) => {
            this.get(id);
        });
    },
    methods: {
        save(formData){
            let url = this.url + 'save';

            this.send(formData, url, 'save');
        },
        update(formData){
            let url = this.url + 'update/' + formData.get('id');

            this.send(formData, url, 'update');
        },
        removeMedia(formData){
            let url = this.url + 'remove-media';

            this.send(formData, url, 'removeMedia');
        },
        get(id){
            let url = this.url + 'get/' + id;

            this.send(null, url, 'get');
        },
        errorToast(){
            this.$toasted.show("An error was ocurred.", { 
                theme: "bubble",
                type: 'error',
                position: "top-right", 
                duration : 3000
            });
        },
        send(formData, url, op){
            switch(op){
                case 'get':
                    this.$http.get(url, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((response) => {
                        if(response.data.success) eventBus.$emit('elem-fetched', response.data.data); // Captured on components/form/FormProductos
                        else this.errorToast()
                    }).catch((ex) => {
                        this.errorToast()
                        this.$router.push('/' + this.section)
                    });
                    break;
                case 'save':
                    this.$http.post(url, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((response) => {
                        if(!response.data.success) this.errorToast()
                        this.$router.go(-1);
                    }).catch((err) => {
                        this.errorToast()
                        this.$router.go(-1);
                    });
                    break;
                case 'update':
                    this.$http.post(url, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((response) => {
                        if(!response.data.success) this.errorToast()
                        this.$router.go(-1);
                    }).catch((err) => {
                        this.errorToast()
                        this.$router.go(-1);
                    });
                    break;
                case 'removeMedia':
                    this.$http.post(url, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((response) => {
                        if(!response.data.success) this.errorToast()
                    }).catch((err) => {
                        this.errorToast()
                    });;
                    break;
                default:
                    break;
            }
        },
    },
    computed: {
        url(){ return this.$store.state.baseUrl + this.$router.currentRoute.meta.section + '/' },
    }
}
</script>
