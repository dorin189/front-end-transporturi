<!--suppress ALL -->

<template>
  <v-layout>
    <v-card contextual-style="dark">
      <span slot="header">
        Register
      </span>
      <div slot="body">
        <form @submit.prevent="register(user)">
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-addon">
                <i class="fa fa-user fa-fw"></i>
              </div>
              <input
                v-model="user.firstName"
                type="text"
                placeholder="First name"
                class="form-control"
              >
            </div>
          </div>
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-addon">
                <i class="fa fa-user fa-fw"></i>
              </div>
              <input
                v-model="user.lastName"
                type="text"
                placeholder="Last name"
                class="form-control"
              >
            </div>
          </div>
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-addon">
                <i class="fa fa-envelope fa-fw"></i>
              </div>
              <input
                v-model="user.email"
                type="email"
                placeholder="Email"
                class="form-control"
              >
            </div>
          </div>
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-addon">
                <i class="fa fa-lock fa-fw"></i>
              </div>
              <input
                v-model="user.password"
                type="password"
                placeholder="Password"
                class="form-control"
              >
            </div>
          </div>
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-addon">
                <i class="fa fa-lock fa-fw"></i>
              </div>
              <input
                v-model="user.password_confirmation"
                type="password"
                placeholder="Confirm password"
                class="form-control"
              >
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-outline-primary">
              Register
            </button>
          </div>
          <div class="alert alert-danger" role="alert" v-if="errors && !success">
            <ul v-for="(value, key) in errors" class="list-unstyled">
                <li>  {{value.toString()}}</li>
            </ul>
          </div>
            <div class="alert alert-success" v-if="success">
                Contul tau a fost creat cu success!
            </div>
        </form>
      </div>
      <div slot="footer">
        Ai deja un cont?
        <router-link :to="{ name: 'login.index' }">Login</router-link>
      </div>
    </v-card>
  </v-layout>
</template>


<script type="text/javascript">
  /* ============
   * Register Index Page
   * ============
   *
   * Page where the user can register.
   */
  /* eslint-disable */
  import VLayout from '@/layouts/Minimal';
  import VCard from '@/components/Card';
  import axios from 'axios';

  const CREATE_USER = '/users';

  export default {
    /**
     * The name of the page.
     */
    name: 'register-index',

    /**
     * The data that can be used by the page.
     *
     * @returns {Object} The view-model data.
     */
    data() {
      return {
        user: {
          // firstName: 'Iosifescu',
          // lastName: 'Dorin',
          // email: 'dorin@pionix.ro',
          // password: 'Parola1!',
          // password_confirmation: 'Parola1!',
        },
          errors: null,
          success: false,
      };
    },

    /**
     * The methods the page can use.
     */
    methods: {

      /**
       * Will register the user.
       *
       * @param {Object} user The user to be registered.
       */
      register(user) {
          // this.sendButtonDisable = true;
          var vm = this;
        axios.post(process.env.API_LOCATION + CREATE_USER, user)
            .then(function (response) {
                vm.success = true;
                console.log(response);
            })
            .catch(function (error) {
                if (error.response) {
                    vm.errors = error.response.data.errors;
                }
            });
      },
    },

    /**
     * The components the page can use.
     */
    components: {
      VLayout,
      VCard,
    },
  };
</script>
