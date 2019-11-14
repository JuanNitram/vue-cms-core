<template>
    <v-row justify="center" class="mt-10">
        <v-col cols="6">
            <v-form ref="form" lazy-validation>
              <v-text-field outlined v-model="email" label="E-mail" type="email" :rules="[rules.required]"
                v-on:keyup.enter="login"/>

              <v-text-field outlined v-model="password" label="Password" type="password"
                :rules="[rules.required, rules.min]" v-on:keyup.enter="login"/>

              <v-btn depressed large @click="login">
                  <span v-show="!isLoading">Login</span>
                  <v-progress-circular v-show="isLoading" class="progress-fix" size="20" indeterminate/>
              </v-btn>
            </v-form>
        </v-col>
    </v-row>
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
          login() {
              let isValid = this.$refs.form.validate();
              if(isValid === true){
                  this.isLoading = true;
                  let email = this.email;
                  let password = this.password;
                  this.$store.dispatch('login', { email, password }).then((res) => {
                      this.isLoading = false;
                      if(res.data.success){
                          this.$router.push('/dashboard')
                      } else {
                          this.$toasted.show("Wrong email or password.");
                      }
                  }).catch(err => {
                      this.isLoading = false;
                      this.$toasted.show("An error was occurred.");
                  });
              }
          }
      },
  }
</script>

<style lang="css" scoped>
.progress-fix {
    padding-right: 15%;
}
</style>
