<template>
    <div v-show="!loading">
        <Table :headers="headers"/>
    </div>
</template>

<script>
import Table from '../../components/reusable/table/Table'

export default {
    components: {
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
        }
    },

    computed: {
        loading(){
            return this.$store.getters.loading;
        }
    }
}
</script>
