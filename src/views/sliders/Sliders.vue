<template>
    <div v-show="!loading">
        <Actionbar :component="section"/>
        <v-layout row pa-2>
            <v-flex>

                <Table :headers="headers"/>

            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import Actionbar from '../../components/reusable/Actionbar'
import Table from '../../components/reusable/Table'
import eventBus from '../../EventBus.js'

export default {
    components: {
        Actionbar,
        Table
    },
    data () {
        return {
            headers: [
                { text: '', align: 'middle', value: 'drag_check', sortable: false},
                { text: 'Id', align: 'left', value: 'id'},
                { text: '', align: 'middle', value: 'media', sortable: false},
                { text: 'Title', align:'middle', value: 'title' },
                { text: 'Subtitle', align:'middle', value: 'subtitle' },
                { text: 'Activo', align:'middle', value: 'active' },
                { text: '', align:'middle', value: 'actions', sortable: false, width: '5%'},
            ],
            section: this.$route.meta.section,
        }
    },
    created(){
        // TO-DO capture the selected row in the table from $emit Table component
    },
    computed: {
        loading(){
            return this.$store.getters.loading
        }
    }
}
</script>
