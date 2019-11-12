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
                { text: 'Id', align: 'left', value: 'id'},
                { text: 'Name', align:'middle', value: 'name' },
                { text: 'Email', align:'middle', value: 'email' },
                { text: 'Type', align:'middle', value: 'types_id' },
                { text: 'Active', align:'middle', value: 'active' },
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
