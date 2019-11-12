<template>
    <div v-show="!loading">
        <Table :headers="headers" :per-page="10"/>
    </div>
</template>

<script>
import Table from '../../components/reusable/Table'

export default {
    components: {
        Table
    },

    data () {
        return {
            headers: [
                { text: '', align: 'middle', value: 'drag_check', sortable: false},
                { text: 'Id', value: 'id' , class:'clickable'},
                { text: '', align: 'left', value: 'media', sortable: false},
                { text: 'Name', value: 'name'  , class:'clickable'},
                { text: 'Description', value: 'description'  , class:'clickable'},
                { text: 'Activo', value: 'active'  , class:'clickable'},
                { text: 'Highlighted', value: 'highlighted'  , class:'clickable'},
                { text: '', value: 'action', sortable: false},
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
