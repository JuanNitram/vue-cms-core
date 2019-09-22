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
                // { text: '', align: 'middle', value: 'drag_check', sortable: false},
                { text: 'Id', align: 'left', value: 'id'},
                { text: 'Name', align:'middle', value: 'name' },
                { text: 'Email', align:'middle', value: 'email' },
                { text: 'Type', align:'middle', value: 'types_id' },
                { text: 'Active', align:'middle', value: 'active' },
                { text: '', align:'middle', value: 'actions', sortable: false, width: '5%'},
            ],
            section: this.$route.meta.section,
        }
    },
    computed: {
        loading(){
            return this.$store.getters.loading
        }
    }
}
</script>
