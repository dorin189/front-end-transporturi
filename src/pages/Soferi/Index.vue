<!--suppress ALL -->
<template>
    <v-layout>
        <v-card contextual-style="dark">
      <span slot="header">
        Date transportatori
      </span>
            <div slot="body">
                <button type="button" class="btn btn-info mb-4" @click="openModal()" >Adauga soferi</button>
                <modal v-if="isVisible" @close="isVisible = false"></modal>

                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th>
                            Nume
                        </th>
                        <th>
                            Prenume
                        </th>
                        <th>
                            Email
                        </th>
                        <th>
                            Numar telefon
                        </th>
                        <th>
                            Data nasterii
                        </th>
                        <th>
                            Categorie permis
                        </th>
                        <th>
                            Conduce automobilul:
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="post in posts" :key="post.id">
                        <td>
                            {{post.nume}}
                        </td>
                        <td>
                            {{post.prenume}}
                        </td>
                        <td>
                            {{post.email}}
                        </td>
                        <td>
                            {{post.numar_telefon}}
                        </td>
                        <td>
                            {{post.an_nastere}}
                        </td>
                        <td>
                            {{post.categorie}}
                        </td>
                        <td>
                            {{post.parc.numar_inmatriculare}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
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

    const GET_SOFERI = '/soferi';
    const POST_SOFER = '/soferi';

    export default {

        /**
         * The name of the page.
         */
        name: 'soferi',

        data() {
            return {
                posts: [],
                isVisible: false,
            }
        },
        beforeRouteEnter(to, from, next) {
            axios.get(process.env.API_LOCATION + GET_SOFERI)
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
            methods: {
                modal: {
                    data() {
                        return {
                            sofer: {},
                            errors: {}
                        }
                    },
                    methods: {
                        add(sofer) {
                            axios.post(process.env.API_LOCATION + POST_SOFER, sofer)
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
                                    <p class="modal-card-title">Adauga Sofer</p>
                                    </header>
                                     <section class="modal-card-body">
                                      <form @submit.prevent="add(transportator)">
                                           <div class="form-group">
                                            <label for="formGroupExampleInput">Nume</label>
                                            <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Nume " v-model='sofer.nume'>
                                          </div>
                                          <div class="form-group">
                                            <label for="formGroupExampleInput2">Prenume</label>
                                            <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Prenume" v-model='sofer.prenume'>
                                          </div>
                                           <div class="form-group">
                                            <label for="formGroupExampleInput3">Email</label>
                                            <input type="text" class="form-control" id="formGroupExampleInput3" placeholder="Email" v-model='sofer.email'>
                                          </div>
                                          <div class="form-group">
                                            <label for="formGroupExampleInput4">Numar telefon</label>
                                            <input type="text" class="form-control" id="formGroupExampleInput4" placeholder="Numar Telefon" v-model='sofer.numarTelefon'>
                                          </div>
                                          <div class="form-group">
                                            <label for="formGroupExampleInput5">Data nasterii</label>
                                            <input type="text" class="form-control" id="formGroupExampleInput5" placeholder="Data nasterii" v-model='sofer.dataNasterii'>
                                          </div>
                                          <div class="form-group">
                                            <label for="formGroupExampleInput6">Categorie Permis</label>
                                            <input type="text" class="form-control" id="formGroupExampleInput6" placeholder="Categorie Permis" v-model='sofer.categoriePermis'>
                                          </div>
                                          <div class="form-group">
                                          <div class="form-group">
                                             <button class="btn btn-primary">Save</button>
                                          </div>
                                        </form>
                                     </section>

                                    </div>
                                    <button class="modal-close is-large" aria-label="close" @click="$emit('close')"></button>
                                    <h1>{{ errors}}</h1>
                         </div>
                        `
                }
            },
        },
    };
</script>
