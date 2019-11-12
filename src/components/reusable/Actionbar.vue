<template>
    <v-layout row pa-2>
        <v-flex xs12>
            <div class="text-sm-left text-xs-left">

                <v-tooltip bottom>
                    <v-btn color="primary" class="caption" dark medium icon text @click="goBack" slot="activator" >
                        <v-icon class="fix-padding-btn">arrow_back</v-icon>
                    </v-btn>
                    Back
                </v-tooltip>

                <v-tooltip bottom>
                    <v-btn v-if="!this.addDisabled" color="primary" class="caption" dark medium icon text @click="formNew" slot="activator">
                        <v-icon class="fix-padding-btn">add</v-icon>
                    </v-btn>
                    Add New
                </v-tooltip>
                   
                <v-tooltip bottom>
                    <v-btn v-if="this.orderChanged" color="primary" class="caption" dark medium icon text @click="saveOrder" slot="activator">
                        <v-icon class="fix-padding-btn">reorder</v-icon>
                    </v-btn>
                    Save Order
                </v-tooltip>

                <v-tooltip bottom>
                    <v-btn v-if="this.activeMany" color="primary" class="caption" dark medium icon text @click="applyActiveMany" slot="activator">
                        <v-icon class="fix-padding-btn">check</v-icon>
                    </v-btn>        
                    Active Selected
                </v-tooltip>

                <v-tooltip bottom>
                    <v-btn v-if="this.disableMany" color="primary" class="caption" dark medium icon text @click="applyDisableMany" slot="activator">
                        <v-icon class="fix-padding-btn">close</v-icon>
                    </v-btn>
                    Disable Selected
                </v-tooltip>
                
                <v-tooltip bottom>
                    <v-btn v-if="this.removeMany" color="primary" class="caption" dark medium icon text @click="applyRemoveMany" slot="activator">
                        <v-icon class="fix-padding-btn">delete</v-icon>
                    </v-btn>
                    Remove Selected
                </v-tooltip>

            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import eventBus from '../../EventBus.js'
export default{
    data(){
        return {
            addDisabled: false,
            orderChanged: false,
            inBlockAction: false,
            removeMany: false,
            disableMany: false,
            activeMany:false,
        }
    },
    props: {
        component: String,
    },
    created(){
        eventBus.$on('order-changed', () => {
            this.orderChanged = true;
        });
        eventBus.$on('active-operations-in-block-action', () => {
            this.removeMany = true;
            this.activeMany = true;
            this.disableMany = true;
        });
        eventBus.$on('disable-operations-in-block-action', () => {
            this.removeMany = false;
            this.activeMany = false;
            this.disableMany = false;
        });
    },
    methods: {
        formNew(){
            this.$store.commit('SET_LOADING', true);
            eventBus.$emit('form-new', this.component); // Captured on Products
        },
        inBlockActionToggle(){
            this.addDisabled = true;
            this.orderChanged = false;

            eventBus.$emit('in-block-action'); // Captured on Table
        },
        saveOrder(){
            this.$store.commit('SET_LOADING', true);
            eventBus.$emit('save-order', this.component); // Captured on Table
        },
        applyRemoveMany(){
            this.$store.commit('SET_LOADING', true);
            eventBus.$emit('remove-many', this.component);
        },
        applyActiveMany(){
            this.$store.commit('SET_LOADING', true);
            eventBus.$emit('active-many', this.component);
        },
        applyDisableMany(){
            this.$store.commit('SET_LOADING', true);
            eventBus.$emit('disable-many', this.component);
        },
        goBack(){
            this.$router.go(-1);
        }
    },
}
</script>

<style lang="css" scoped>
    .fix-padding-btn {
        padding-right: 2px;
    }
</style>