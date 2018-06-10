<!--suppress ALL -->
<template>
    <v-layout>
        <v-card contextual-style="dark">
      <span slot="header">
        Informatii despre comenzi
      </span>
            <div slot="body">
                <button type="button" class="btn btn-info mb-4" @click="openModal()" >Adauga Comanda</button>
                <modal v-if="isVisible" @close="isVisible = false"></modal>

                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th>
                            Nume Client
                        </th>
                        <th>
                            Adresa Client
                        </th>
                        <th>
                            Telefon Client
                        </th>
                        <th>
                            Nume Destinatar
                        </th>
                        <th>
                            Adresa Destinatar
                        </th>
                        <th>
                            Telefon Destinatar
                        </th>
                        <th>
                            Nume Produs
                        </th>
                        <th>
                            Nume Sofer
                        </th>
                        <th>
                            Actualizeaza Comanda
                        </th>
                        <th>
                            Sterge Comanda
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="post in posts" :key="post.id">
                        <td>
                            {{post.nume_client}}
                        </td>
                        <td>
                            {{post.adresa_client}}
                        </td>
                        <td>
                            {{post.telefon_client}}
                        </td>
                        <td>
                            {{post.nume_destinatar}}
                        </td>
                        <td>
                            {{post.adresa_destinatar}}
                        </td>
                        <td>
                            {{post.telefon_destinatar}}
                        </td>
                        <td>
                            {{post.nume_produs}}
                        </td>
                        <td v-if="post.is_asigned == 0">
                            <select @change="onChange($event.target.value)">
                                <option>Sofer</option>
                                <option v-for="sofer in post.soferi">{{sofer.id}} {{sofer.nume}} {{sofer.prenume}}</option>
                            </select>
                        </td>
                        <td v-if="post.is_asigned == 1">
                            {{post.nume_sofer}}
                        </td>

                        <td v-if="post.is_asigned == 0">
                            <button type="button" class="btn btn-info" @click="updateComanda(post)">Actualizeaza</button>
                        </td>
                        <td v-if="post.is_asigned == 1">

                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" @click="deleteComanda(post)">Sterge</button>
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
     * Comenzi Index Page
     * ============
     *
     */
    /* eslint-disable */
    import VLayout from '@/layouts/Default';
    import VCard from '@/components/Card';
    import axios from 'axios';
    import vmodal from 'vue-js-modal';
    import VueGoogleAutocomplete from 'vue-google-autocomplete';

    const GET_COMENZI = '/comenzi';
    const GET_SOFERI_NAME = '/soferi/info';
    const POST_COMENZI_UPDATE = '/comenzi/update';
    const DELETE_COMENDA = '/comenzi/delete';
    export default {

        /**
         * The name of the page.
         */
        name: 'comenzi',

        data() {
            return {
                posts: [],
                soferi: [],
                selected: null,
                isVisible: false,
                soferId: null,
            }
        },
        beforeRouteEnter(to, from, next) {
            axios.get(process.env.API_LOCATION + GET_COMENZI)
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
            onChange(value) {
                this.$emit('sofer', value);
                var sofer = value.split(" ");
                this.soferId = sofer[0];
                this.selected = sofer[1] + " " + sofer[2];
            },
            updateComanda(post) {
                var data = {
                    "id": post.id,
                    "is_asigned": 1,
                    "nume_sofer" : this.selected,
                    "sofer_id": this.soferId
                };


                axios.post(process.env.API_LOCATION + POST_COMENZI_UPDATE, data)
                    .then(function (response) {
                        window.location.reload(true);
                    })
                    .catch(function (error) {
                        if (error.response) {
                            // errors = error.response.data.errors;
                            console.log(vm.errors);
                        }
                    });
            },
            deleteComanda(post) {
                var id = post.id;
                this.posts.splice(post, 1);
                axios.delete(process.env.API_LOCATION + DELETE_COMENDA + "/" + id, id)
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
        components: {
            VLayout,
            VCard,
            modal: {
                data() {
                    return {
                        comanda: {
                            numeClient: "Emag Srl",
                            telefonClient: "0725.883.625",
                            dimensiuneProdus: "10",
                            numeDestinatar: "Vasile Ion",
                            telefonDestinatar: "0720802604",
                            numeProdus: "tv lg 63"

                        },
                        date: {},
                        errors: {},
                        punctPlecare: null,
                        coordonateContact: null,
                        punctDestinatar: null,
                        coordonateDestinatar: null,
                    }
                },
                methods: {
                    add(comanda) {
                        this.date = {
                           numeClient: comanda.numeClient,
                           adresaClient: this.punctPlecare,
                           coordonateContact: this.coordonateContact,
                           telefonClient: comanda.telefonClient,
                           dimensiuneProdus: comanda.dimensiuneProdus,
                           numeDestinatar: comanda.numeDestinatar,
                           adresaDestinatar: this.punctDestinatar,
                           coordonateDestinatar: this.coordonateDestinatar,
                           telefonDestinatar: comanda.telefonDestinatar,
                           numeProdus: comanda.numeProdus
                        }

                        axios.post(process.env.API_LOCATION + '/comenzi', this.date)
                            .then(function (response) {
                                document.getElementById('is-active').style.display = 'none';
                                window.location.reload(true);
                            })
                            .catch(function (error) {
                                if (error.response) {
                                    // errors = error.response.data.errors;
                                    console.log(vm.errors);
                                }
                            });
                    },

                    getContactAddressData(addressData, placeResultData, id) {
                        var obj = {};
                        obj = addressData;
                        var route = obj.route ? obj.route : '';
                        var locality = obj.locality ? obj.locality : '';
                        var street_number = obj.street_number ? obj.street_number : '';
                        this.punctPlecare = route + " " + locality + " " + street_number;
                        this.coordonateContact = obj.latitude + " " + obj.longitude;
                        console.log(this.coordonateContact);
                    },

                    getDestinatarAddressData(addressData, placeResultData, id) {
                        var obj = {};
                        obj = addressData;
                        var route = obj.route ? obj.route : '';
                        var locality = obj.locality ? obj.locality : '';
                        var street_number = obj.street_number ? obj.street_number : '';
                        this.punctDestinatar = route + " " + locality + " " + street_number;
                        this.coordonateDestinatar = obj.latitude + " " + obj.longitude;
                        console.log(this.coordonateDestinatar);
                    },
                },
                components: {
                    VueGoogleAutocomplete
                },
                template: `
             <div class="modal modal-comenzi is-active" id="is-active">
                        <div class="modal-background"></div>
                        <div class="modal-content">
                        <header class="modal-card-head">
                        <p class="modal-card-title">Adauga Comanda</p>
                        </header>
                         <section class="modal-card-body">
                          <form @submit.prevent="add(comanda)">
                                <div class="row">
                                     <div class="form-group col-md-6">
                                        <label for="formGroupExampleInput">Nume Client</label>
                                        <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Nume Client" v-model='comanda.numeClient'>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="formGroupExampleInput">Adresa Client</label>
                                        <vue-google-autocomplete
                                          id="map"
                                          classname="form-control"
                                          placeholder="Adresa Client"
                                          v-on:placechanged="getContactAddressData"
                                          country="ro"
                                            >
                                        </vue-google-autocomplete>
                                    </div>
                                </div>

                                <div class="row">
                                      <div class="form-group col-md-6">
                                        <label for="formGroupExampleInput3">Telefon Client</label>
                                        <input type="text" class="form-control" id="formGroupExampleInput3" placeholder="Telefon Client" v-model='comanda.telefonClient'>
                                      </div>
                                      <div class="form-group col-md-6">
                                        <label for="formGroupExampleInput5">Dimensiune Produs</label>
                                        <input type="text" class="form-control" id="formGroupExampleInput5" placeholder="Dimensiune Produs" v-model='comanda.dimensiuneProdus'>
                                      </div>
                                </div>
                                <hr>

                                <div class="row">

                                      <div class="form-group col-md-6">
                                         <label for="formGroupExampleInput4">Nume Destinatar</label>
                                         <input type="text" class="form-control" id="formGroupExampleInput4" placeholder="Nume Destinatar" v-model='comanda.numeDestinatar'>
                                      </div>
                                      <div class="form-group col-md-6">
                                        <label for="formGroupExampleInput5">Adresa Destinatar</label>
                                        <vue-google-autocomplete
                                          id="map2"
                                          classname="form-control"
                                          placeholder="Adresa destinatar"
                                          v-on:placechanged="getDestinatarAddressData"
                                          country="ro"
                                          >
                                        </vue-google-autocomplete>
                                     </div>
                                </div>

                                <div class="row">
                                      <div class="form-group col-md-6">
                                        <label for="formGroupExampleInput5">Telefon Destinatar</label>
                                        <input type="text" class="form-control" id="formGroupExampleInput5" placeholder="Telefon Destinatar" v-model='comanda.telefonDestinatar'>
                                     </div>
                                      <div class="form-group col-md-6">
                                          <label for="formGroupExampleInput5">Nume Produs</label>
                                            <input type="text" class="form-control" id="formGroupExampleInput5" placeholder="Nume Produs" v-model='comanda.numeProdus'>
                                     </div>
                                </div>

                                <div class="row">
                                 <div class="form-group col-md-6">
                                 <button class="btn btn-primary" style="width: 60%">Save</button>
                              </div>
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
    };
</script>
