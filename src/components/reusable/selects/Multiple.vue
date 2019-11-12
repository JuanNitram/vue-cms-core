<template>
    <v-select @change="selectChanged" v-model="selected" :items="items" item-text="name"
        item-value="id" :label="this.label" box chips multiple outlined/>
</template>

<script>
import eventBus from '../../../EventBus'

export default {
    props: {
        url: String,
        section: String,
        label: String,
        itemsSelected: Array,
        parentSelected: Number,
        listen: String,
        listenUrl: String,
    },
    data(){
        return {
            selected: [],
            items: [],
        }
    },
    created(){
        if(this.listen){
            let params = {};
            params[this.listen] = this.parentSelected;
            this.$http.get(this.url, { params }).then((response) => {
                let res = response.data;
                if(res.success){
                    this.items = res.data[this.section];
                    if(this.itemsSelected.length > 0)
                        this.selected = this.itemsSelected;
                }
                eventBus.$emit('component-rendered')
            });

            eventBus.$on(this.listen + '-select-changed', (selected) => {
                let params = {};
                params[this.listen] = selected;
                this.$http.get(this.url, { params }).then((response) => {
                    let res = response.data;
                    if(res.success){
                        this.items = res.data[this.section];
                        if(this.itemsSelected > 0)
                            this.selected = this.itemsSelected;
                    }
                    eventBus.$emit('component-rendered')
                });
            })
        } else {
            this.$http.get(this.url).then((response) => {
                let res = response.data;
                if(res.success){
                    this.items = res.data[this.section];
                    if(this.itemsSelected.length > 0)
                        this.selected = this.itemsSelected;
                }
                eventBus.$emit('component-rendered')
            });
        }
    },
    methods:{
        selectChanged(){
            eventBus.$emit(this.section + '-select-changed', this.selected);
        }
    }
}
</script>
