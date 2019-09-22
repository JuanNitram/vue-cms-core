<template>
        <v-select :rules="required ? ruleRequired : undefined" ref="select" @change="selectChanged" v-model="selected" :items="items" item-text="name" item-value="id" :label="this.label" box outline/>
</template>

<script>
import eventBus from '../../../EventBus'
export default {
    props: {
        url: String,
        section: String,
        label: String,
        selectedItem: Number,
        required: Boolean,
    },
    data(){
        return {
            selected: undefined,
            items: [],
            ruleRequired:[
                v => !!v || this.label + ' is required'
            ]
        }
    },
    created(){
        this.$http.get(this.url).then((response) => {
            let res = response.data;
            if(res.success){
                this.items = res.data[this.section];
                if(this.selectedItem)
                    this.selected = this.selectedItem;
            }
            eventBus.$emit('component-rendered')
        });
    },
    methods:{
        selectChanged(){
            eventBus.$emit(this.section + '-select-changed', this.selected);
        }
    }
}
</script>
