<!--suppress ALL -->
<template>

    <v-layout>
        <v-card contextual-style="dark">
            <span slot="header">
            Informatii despre comenzi
            </span>
            <div slot="body">
                <table class="table table-striped">
                  <thead>
                  <tr>
                      <th>
                          Nume Sofer
                      </th>
                      <th>
                          Prenume Sofer
                      </th>
                      <th>
                          Denumire Auto
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
                          {{post.parc.denumire_auto}}
                      </td>

                      <td>
                          <button @click="calculate(post)" class="btn btn-info" style="margin-top: 10px;">Calculeaza Routa</button>
                      </td>
                      <br>
                  </tr>
                  </tbody>
                </table>
                <hr>
                <form v-if="isGenerate" class="form-inline" style="margin-top: 20px; margin-bottom: 20px;">
                  <div class="row">
                      <div class="form-group" style="margin-right: 30px">
                          <label for="name" style="margin-right: 10px">Link harta:</label>
                          <input type="text" class="form-control" id="name" v-model="info.link">
                      </div>
                      <div class="form-group" style="margin-right: 30px">
                          <label for="km" style="margin-right: 10px">Km:</label>
                          <input type="text" class="form-control" id="km" v-model="info.km">
                      </div>
                      <button class="btn btn-success" @click="sendData(info)">Trimite email catre sofer</button>
                  </div>
                </form>
                <div style="width: 100%">
                  <iframe id="myFrame" class="myIframe" ref="myIframe" style="width: 100%; height: 340px" :src="googleMapsEmbeded"
                          frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
                  </iframe>
                </div>
            </div>
        </v-card>
    </v-layout>
</template>

<script>
    /* eslint-disable */
    import VLayout from '@/layouts/Default';
    import VCard from '@/components/Card';
    import axios from 'axios';

    const GET_COMENZI_IS_ORDER = '/comenzi/is-order';
    const GET_COMENZI_BY_DRIVE = '/comenzi/get-comenzi/';
    const POST_INFO = '/test';

    export default {
        name: 'planificare',

            data() {
                return {
                    address: '',
                    adrese: [],
                    distance: null,
                    shortDistance: [],
                    posts: {},
                    googleMapsEmbeded: null,
                    origin: null,
                    isGenerate: false,
                    info: {},
                    selectedDriver: null,
                    selectedAutoKm: null,
                    driverId: null
               }
       },

        beforeRouteEnter: function (to, from, next) {
            axios.get(process.env.API_LOCATION + GET_COMENZI_IS_ORDER)
                .then(response => {
                    next(vm => (vm.posts = response.data))
                })
        },

        methods: {
            calculate(post) {
                var vm = this;
                vm.selectedDriver = post.email;
                vm.selectedAutoKm = post.parc.revizie;
                vm.driverId = post.id;
                var id = post.id;
                axios.get(process.env.API_LOCATION + GET_COMENZI_BY_DRIVE + id)
                    .then(function (response) {
                        if(response.data) {
                            localStorage.setItem('aaa', JSON.stringify(response.data));
                            vm.getComenziSofer();
                        }
                    })
            },

            getComenziSofer() {
                var a = localStorage.getItem('aaa');
                var vm = this;
                var locations = JSON.parse(a);

                var pozition = [];
                var scope = {};

                console.log(locations.length);

                if(locations.length == 1) {
                    scope['destination' + 1] = new google.maps.LatLng(locations[0].comand.lat_adresa_destinatar, locations[0].comand.lng_adresa_destinatar);
                } else if (locations.length > 1){
                    for(var i = 0 ; i <= locations.length-1 ; i++) {
                        var a = i+1;
                        scope['destination' + a] = new google.maps.LatLng(locations[i].comand.lat_adresa_destinatar, locations[i].comand.lng_adresa_destinatar);
                    }
                }

                var origin1 = new google.maps.LatLng(locations[0].comand.lat_adresa_client, locations[0].comand.lng_adresa_client);
                var service = new google.maps.DistanceMatrixService();

                function getDestionation() {
                    var lungime = Object.keys(scope).length;

                    var arr = [];
                    for(var i = 1; i <= lungime; i++) {
                        arr.push(scope['destination' + i]);
                    }
                    console.log(arr);
                    return arr;
                }


                service.getDistanceMatrix(
                    {
                        origins: [origin1],
                        destinations: getDestionation(),
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: false
                    }, (response,status) =>{
                        if (status == 'OK') {
                            vm.shortDistance = [];
                            var origins = response.originAddresses;
                            vm.origin = origins;
                            var destinations = response.destinationAddresses;
                            for (var i = 0; i < origins.length; i++) {
                                var results = response.rows[i].elements;
                                for (var j = 0; j < results.length; j++) {
                                    var element = results[j];
                                    var distance = element.distance.text;
                                    vm.distance = distance;
                                    vm.shortDistance.push(element.distance.value);
                                    var duration = element.duration.text;
                                    var from = origins[i];
                                    var to = destinations[j];
                                }
                            }
                        }
                        vm.shortDistance.sort(function(a,b) {
                            return a - b ;
                        })

                        var destinationOrder = [];
                        for(var e = 0 ; e < vm.shortDistance.length; e++) {
                            for(var a = 0; a < results.length; a++) {
                                if(vm.shortDistance[e] == results[a].distance.value) {
                                    this.totalKm += results[a].distance.value;
                                    destinationOrder.push(destinations[a]);
                                }
                            }
                        }


                        /**
                         *  generate dinamic link for google maps
                         * @returns {Array}
                         */
                        function wayPoints() {
                            var arr = [];
                            console.log(destinationOrder.length);
                            for(var i = 0 ; i < destinationOrder.length - 1; i++) {
                                if(i == 0 && destinationOrder.length > 2) {
                                    arr.push("&waypoints=" + destinationOrder[i] + "|");
                                } else if (i == 0 && destinationOrder.length == 2) {
                                    arr.push("&waypoints=" + destinationOrder[i]);
                                }
                                else if(i < destinationOrder.length - 2) {
                                    arr.push(destinationOrder[i] + "|")
                                }
                                else {
                                    arr.push(destinationOrder[i]);
                                }
                            }
                            return arr;
                        }

                        var start = vm.origin[0];
                        var startTransformToString = start.replace(/\s*,\s*/g , "+");

                        var points = wayPoints();


                        var transformToString = points.join("");
                        var waypointsTransformToString = transformToString.replace(/\s*,\s*/g , "+");

                        var destinationLength = destinationOrder.length;
                        var destination = destinationOrder[destinationLength-1];
                        var destinationTransformToString = destination.replace(/\s*,\s*/g , "+");

                        this.googleMapsEmbeded = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyBEHv_obRsxXQwTou7mzUh6p9fQcwtv0vk" +
                            "&origin=" + startTransformToString +
                            waypointsTransformToString +
                            "&destination=" + destinationTransformToString + "&avoid=tolls|highways&zoom=6"

                        vm.isGenerate = true;
                    });
            },

            sendData(info) {

                var data = {
                    'email': this.selectedDriver,
                    'linkMap': info.link,
                    'driverId': this.driverId,
                    'revizie': this.selectedAutoKm - info.km
                }

                axios.post(process.env.API_LOCATION + POST_INFO, data)
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
            VCard
        }
    }
</script>
