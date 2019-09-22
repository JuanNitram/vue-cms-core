<template>
    <div class="v-align">
        <v-layout row wrap align-center justify-center>
            <v-flex xs10 lg6 md8 order-lg2>
                <div>
                    <img src="logo.png" width="200px"/>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="text-field-padding">
                        <v-text-field outline v-model="email" label="E-mail" :rules="[rules.required]" v-on:keyup.enter="login"/>
                        <v-text-field outline v-model="password" label="Password" type="password" :rules="[rules.required, rules.min]" v-on:keyup.enter="login"/>
                    </div>
                    <div class="text-xs-right">
                        <v-btn depressed large @click="login">
                            <span v-show="!isLoading">Login</span>
                            <v-progress-circular v-show="isLoading" class="progress-fix" size="20" indeterminate/>
                        </v-btn>
                    </div>
                </v-form>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
export default {
    data(){
        return {
            email : "",
            password : "",
            isLoading :false,
            rules: {
                required: value => !!value || 'Required',
                min: pass => pass.length >= 8 || 'Min 8 characters',
            }
        }
    },
    methods: {
        login: function () {
            let isValid = this.$refs.form.validate();
            if(isValid){
                this.isLoading = true;
                let email = this.email
                let password = this.password
                this.$store.dispatch('login', { email, password }).then((res) => {
                    this.isLoading = false;

                    if(res.data.success){
                        this.$router.push('/dashboard')
                    } else {
                        this.$toasted.show("Wrong email or password.", { 
                            theme: "bubble", 
                            type: 'error',
                            fitToScreen: true,
                            position: "top-right", 
                            duration : 3000
                        });
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$toasted.show("An error was ocurred.", { 
                        theme: "bubble",
                        type: 'error',
                        position: "top-right", 
                        duration : 3000
                    });
                })
            }
        }
    },
}
</script>

<style lang="css" scoped>
.text-field-padding {
    padding: 7px;
}
.logo{
    width: 250px;
}
.v-progress-circular{
    margin: 4px
}
.d_none{
    display: none!important;
}
.progress-fix {
    padding-right: 15%;
}
</style>
