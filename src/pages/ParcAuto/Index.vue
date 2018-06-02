<template>
    <v-layout>
        <v-card contextual-style="dark">
      <span slot="header">
        Informatii parc auto
      </span>
            <div slot="body">
                <button type="button" class="btn btn-info mb-4" @click="openModal()">Adauga detalii automibil</button>
                <modal v-if="isVisible" @close="isVisible = false"></modal>

                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th>
                            Denumire automobil
                        </th>
                        <!--<th>-->
                            <!--Nume sofer-->
                        <!--</th>-->
                        <th>
                            Numar inmatriculare
                        </th>
                        <th>
                            Tonaj
                        </th>
                        <th>
                            Km automobil
                        </th>
                        <th>
                            Km pana la revizie
                        </th>
                        <th>
                            An fabricatie
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="post in posts" :key="post.id">
                        <td>
                            {{post.denumire_auto}}
                        </td>
                        <td>
                            {{post.numar_inmatriculare}}
                        </td>
                        <td>
                            {{post.tonaj}}
                        </td>
                        <td>
                            {{post.km}}
                        </td>
                        <td>
                            {{post.revizie}}
                        </td>
                        <td>
                            {{post.an_fabricatie}}
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

    const GET_PARC_AUTO = '/parc-auto';
    const POST_PARC_AUTO = '/parc-auto';

    export default {

        /**
         * The name of the page.
         */
        name: 'parcauto',

        data() {
            return {
                posts: [],
                isVisible: false,
            }
        },

        beforeRouteEnter(to, from, next) {
            axios.get(process.env.API_LOCATION + GET_PARC_AUTO)
                .then(response => {
                    next(vm => (vm.posts = response.data))
                })
        },

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
                        automobil: {},
                        errors: null
                    }
                },
                methods: {

                    add(automobil) {
                        var vm = this;
                        axios.post(process.env.API_LOCATION + POST_PARC_AUTO, automobil)
                            .then(function (response) {
                                console.log(response);
                            })
                            .catch(function (error) {
                                if (error.response) {
                                    vm.errors = error.response.data.errors;
                                }
                            });
                    }
                },
                template: `
             <div class="modal is-active">
                        <div class="modal-background"></div>
                        <div class="modal-content">
                        <header class="modal-card-head">
                        <p class="modal-card-title">Adauga automobil</p>
                        </header>
                         <section class="modal-card-body">
                          <form @submit.prevent="add(automobil)">
                               <div class="form-group">
                                <label for="formGroupExampleInput">Denumire automobil</label>
                                <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Denumire automobil" v-model='automobil.nume'>
                              </div>
                              <div class="form-group">
                                <label for="formGroupExampleInput2">Numar inmatriculare</label>
                                <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Numar inmatriculare" v-model='automobil.numar'>
                              </div>
                               <div class="form-group">
                                <label for="formGroupExampleInput3">Tonaj</label>
                                <input type="text" class="form-control" id="formGroupExampleInput3" placeholder="Tonaj" v-model='automobil.tonaj'>
                              </div>
                              <div class="form-group">
                                <label for="formGroupExampleInput4">Km</label>
                                <input type="text" class="form-control" id="formGroupExampleInput4" placeholder="Km" v-model='automobil.km'>
                              </div>
                                 <div class="form-group">
                                <label for="formGroupExampleInput5">Revizie in km</label>
                                <input type="text" class="form-control" id="formGroupExampleInput5" placeholder="Revizie in km" v-model='automobil.revizie'>
                              </div>
                                 <div class="form-group">
                                <label for="formGroupExampleInput6">An fabricatie</label>
                                <input type="text" class="form-control" id="formGroupExampleInput6" placeholder="An fabricatie" v-model='automobil.fabricatie'>
                              </div>
                              <div class="form-group">
                                 <button class="btn btn-primary">Save</button>
                              </div>
                            </form>
                         </section>
                         <div class="alert alert-danger" role="alert" v-if="errors">
                          <ul v-for="(value, key) in errors" class="list-unstyled">
                            <li>  {{value.toString()}}</li>
                          </ul>
                         </div>


                        <button class="modal-close is-large" aria-label="close" @click="$emit('close')"></button>
             </div>
        `

            }
        },
    }

</script>