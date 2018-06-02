<!--suppress ALL -->
<template>
    <v-layout>
        <v-card contextual-style="dark">
      <span slot="header">
        Date transportatori
      </span>
            <div slot="body">
                <button type="button" class="btn btn-info mb-4" @click="openModal()" >Adauga transportator</button>
                <modal v-if="isVisible" @close="isVisible = false"></modal>

                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th>
                            Nume Firma
                        </th>
                        <th>
                            Persoana Contact
                        </th>
                        <th>
                            Email
                        </th>
                        <th>
                            Numar telefon
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="post in posts" :key="post.id">
                        <td>
                            {{post.nume}}
                        </td>
                        <td>
                            {{post.persoana_contact}}
                        </td>
                        <td>
                            {{post.email}}
                        </td>
                        <td>
                            {{post.numar_telefon}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--<div slot="footer">-->
                <!--Made with love by Vivid Web-->
            <!--</div>-->
        </v-card>
    </v-layout>
</template>
<script>
    /* ============
     * Account Index Page
     * ============
     *
     * Page where the user can view the account information.
     */
    /* eslint-disable */
    import VLayout from '@/layouts/Default';
    import VCard from '@/components/Card';
    import axios from 'axios';
    import vmodal from 'vue-js-modal';

    const GET_TRANSPORTATORI = '/transportatori';

    export default {

        /**
         * The name of the page.
         */
        name: 'transportatori',

        data() {
            return {
                posts: [],
                isVisible: false,
            }
        },
        beforeRouteEnter(to, from, next) {
            axios.get(process.env.API_LOCATION + GET_TRANSPORTATORI)
                .then(response => {
                    next(vm => (vm.posts = response.data))
                })
        },

        /**
         * The components that the page can use.
         */
        methods: {
            openModal() {
                this.isVisible = true;
            },

        },
      components: {
        VLayout,
        VCard,
        modal: {
            data() {
                return {
                    transportator: {},
                    errors: {}
                }
            },
            methods: {
                add(transportator) {
                    axios.post(process.env.API_LOCATION + '/transportatori', transportator)
                        .then(function (response) {
                            console.log(response);
                        })
                        .catch(function (error) {
                            if (error.response) {
                                // errors = error.response.data.errors;
                                console.log(vm.errors);
                            }
                        });
                }
            },
            template: `
             <div class="modal is-active">
                        <div class="modal-background"></div>
                        <div class="modal-content">
                        <header class="modal-card-head">
                        <p class="modal-card-title">Adauga Transportator</p>
                        </header>
                         <section class="modal-card-body">
                          <form @submit.prevent="add(transportator)">
                               <div class="form-group">
                                <label for="formGroupExampleInput">Nume Firma</label>
                                <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Nume Firma" v-model='transportator.nume'>
                              </div>
                              <div class="form-group">
                                <label for="formGroupExampleInput2">Persoana Contact</label>
                                <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Persoana Contact" v-model='transportator.persoanaContact'>
                              </div>
                               <div class="form-group">
                                <label for="formGroupExampleInput3">Email</label>
                                <input type="text" class="form-control" id="formGroupExampleInput3" placeholder="Email" v-model='transportator.email'>
                              </div>
                              <div class="form-group">
                                <label for="formGroupExampleInput4">Numar telefon</label>
                                <input type="text" class="form-control" id="formGroupExampleInput4" placeholder="Numar Telefon" v-model='transportator.numarTelefon'>
                              </div>
                              <div class="form-group">
                                 <button class="btn btn-primary">Save</button>
                              </div>
                              <h1>{{ transportator.nume}}</h1>
                            </form>
                         </section>

                        </div>
                        <button class="modal-close is-large" aria-label="close" @click="$emit('close')"></button>
                        <h1>{{ errors}}</h1>
             </div>
        `
        }
      },
    };
</script>
