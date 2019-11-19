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
                { text: 'Id', align: 'left', value: 'id' , class:'clickable'},
                { text: 'Name', align:'middle', value: 'name'  , class:'clickable'},
                { text: 'Activo', align:'middle', value: 'active'  , class:'clickable'},
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
