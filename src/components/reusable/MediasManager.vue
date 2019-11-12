<template>
    <v-container v-if="!forceReload">
        <v-row>
            <template v-if="limit">
                <v-layout align-center>
                    <h2>{{ label || '' }}</h2>
                    <v-btn v-if="totalMedias < limit" flat icon @click="triggerInputFiles">
                        <v-icon>
                            backup
                        </v-icon>
                    </v-btn>
                </v-layout>
                <input type="file" ref="file" multiple="multiple" @change="uploadFieldChange" style="display:none;"/>
            </template>
            <template v-else>
                <div class="text-sm-left">
                    <v-layout align-center>
                        <h2>{{ label || '' }}</h2>
                        <v-btn flat icon @click="triggerInputFiles">
                            <v-icon>
                                backup
                            </v-icon>
                        </v-btn>
                    </v-layout>
                    <input type="file" ref="file" multiple="multiple" @change="uploadFieldChange" style="display:none;"/>
                </div>
            </template>
        </v-row>

        <v-row>
            <v-col>
                <div v-for="(media, index) in this.existingMedia" :key="index">
                    <div class="text-sm-left">
                        <img :src="media.full_url" class="img-thumbnail" :alt="media.filename + ' (' + Number((media.size / 1024 / 1024).toFixed(1)) + 'MB)'"/>
                        <strong>
                            <span class="label label-primary">{{ media.filename | trunc(25, '...') }}</span>
                        </strong>
                        <span style="cursor: pointer;" @click="removeExistingAttachment(media)">
                            <v-btn flat icon color="black">
                                <v-icon>remove</v-icon>
                            </v-btn>
                        </span>
                    </div>
                </div>
                <div v-for="(media, index) in medias" :key="index">
                    <div class="text-sm-left">
                        <img :src="media.url" class="img-thumbnail" :alt="media.name + ' (' + Number((media.size / 1024 / 1024).toFixed(1)) + 'MB)'"/>
                        <strong>
                            <span class="label label-primary">{{ media.name | trunc(25, '...') }}</span>
                        </strong>
                        <span style="cursor: pointer;" @click="removeAttachment(media)">
                            <v-btn flat icon color="black">
                                <v-icon>remove</v-icon>
                            </v-btn>
                        </span>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import eventBus from '../../EventBus.js'

export default{
    props:{
        existingMedia: Array,
        limit: Number,
        label: String,
    },
    data(){
        return {
            medias: [],
            totalMedias: 0,
            forceReload: false
        }
    },
    created(){
      this.totalMedias = this.existingMedia.length + this.medias.length;
    },
    methods: {
        uploadFieldChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            for (var i = files.length - 1; i >= 0; i--) {
                files[i].url = URL.createObjectURL(files[i]);
                this.medias.push(files[i]);
            }
            document.getElementById("medias").value = [];
        },
        removeAttachment(media) {
            this.medias.splice(this.medias.indexOf(media), 1);
        },
        triggerInputFiles(){
            this.$refs.file.click()
        },
        removeExistingAttachment(media){
            eventBus.$emit('medias-remove', media)
            this.existingMedia.splice(this.existingMedia.indexOf(media), 1);
            this.totalMedias = this.existingMedia.length + this.medias.length
            this.forceReload = true; this.forceReload = false;
        }
    },
    watch: {
        existingMedia(){ this.totalMedias = this.existingMedia.length + this.medias.length },
        medias(){ this.totalMedias = this.existingMedia.length + this.medias.length }
    }
}
</script>

<style>
.img-thumbnail {
    width: 80px;
    height: 80px;
    display: inline;
    vertical-align: middle;
    margin: 10px;
    border-radius: 4px;
}
</style>
