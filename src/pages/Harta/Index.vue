<!--suppress ALL -->
<template>

    <v-layout>
      <div>
          <ul>
              <li>Sofer: Iosifescu Dorin</li>
              <li>Masina: Vw Skoda</li>
              <li>
                  <button @click="calculate()">Calculeaza Routa</button>
              </li>
              <li>
                  <button>Trimite email catre sofer</button>
              </li>
          </ul>
          <div style="width: 100%" v-if="me">
          <embed id="myFrame" style="width: 100%; height: 400px" :src="
          'https://www.google.com/maps/embed/v1/directions?key=AIzaSyAGWiEqLEilt-TAYuij2_wA5CXBHwofvE8&origin='
          + startingPoint[0].position.lat + ','
          + startingPoint[0].position.lng +
          '&waypoints=' + startingPoint[2].position.lat + ','
          + startingPoint[2].position.lng +
          '&destination=' + startingPoint[1].position.lat + ','
          + startingPoint[1].position.lng"
          frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
          </div>





      </div>
    </v-layout>
</template>

<script>
    /* eslint-disable */
    import VLayout from '@/layouts/Default';
    import VueGoogleAutocomplete from 'vue-google-autocomplete';
    import axios from 'axios';

    const GET_COMENZI_IS_ORDER = '/comenzi/is-order';

    export default {
        name: 'planificare',
        name: 'google-map',
        props: ['name'],

            data() {
                return {
                    address: '',
                    adrese: [],
                    // center: { lat: 62, lng: 10.0 },
                    // markers: [
                    //     {
                    //         position: {
                    //             lat: 1.3776586,
                    //             lng: 103.7662378
                    //         },
                    //     },
                    //     {
                    //         position: {
                    //             lat: 61.75,
                    //             lng: 11.0
                    //         },
                    //     }
                    //
                    // ],
                    // places: [],
                    // currentPlace: null
                    startingPoint: [
                        {
                            position: {
                                lat: 44.3815122,
                                lng: 26.152377200000046
                            }
                        },
                        {
                            position: {
                                lat: 45.71879329999999,
                                lng: 25.775300399999992
                            }
                        },
                        {
                            position: {
                                lat: 47.1673149,
                                lng: 27.58322750000002
                            }

                        }
                    ],
                    me: true,
                    distance: null,
                    shortDistance: [],
                    posts: {},

               }
       },

        beforeRouteEnter: function (to, from, next) {
            axios.get(process.env.API_LOCATION + GET_COMENZI_IS_ORDER)
                .then(response =>
                    next( vm => localStorage.setItem('aaa', JSON.stringify(response.data))
                    )
                )
        },


        methods: {
            calculate() {
                var a = localStorage.getItem('aaa');
                var vm = this;
                var locations = JSON.parse(a);
                console.log(locations.length);
                var size = Object.keys(this.posts).length;
                var pozition = [];
                var scope = {};
                for(var i = 1 ; i <= locations.length-1; i++) {
                    scope['destination' + i] = new google.maps.LatLng(locations[i].lat_adresa_destinatar, locations[i].lng_adresa_destinatar);
                }
                var origin1 = new google.maps.LatLng(locations[0].lat_adresa_client, locations[0].lng_adresa_client);
                var service = new google.maps.DistanceMatrixService();


                console.log(scope);
                function getDestionation() {
                    var lungime = Object.keys(scope).length;
                    var arr = [];
                    for(var i = 1; i <= lungime; i++) {
                        arr.push(scope['destination' + i]);

                    }
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
                            var origins = response.originAddresses;
                            // console.log(origins);
                            var destinations = response.destinationAddresses;
                            var a  = response;
                            console.log(a);
                            for (var i = 0; i < origins.length; i++) {
                                var results = response.rows[i].elements;
                                for (var j = 0; j < results.length; j++) {
                                    var element = results[j];
                                    // console.log(element);
                                    var distance = element.distance.text;


                                    vm.distance = distance;
                                    vm.shortDistance.push(element.distance.value);
                                    var duration = element.duration.text;
                                    // console.log(duration);
                                    var from = origins[i];
                                    var to = destinations[j];
                                }
                            }
                        }
                        vm.shortDistance.sort(function(a,b) {
                            return a - b ;
                        })

                        console.log(vm.shortDistance);

                    });





            },
            /**
             * When the location found
             * @param {Object} addressData Data of the found location
             * @param {Object} placeResultData PlaceResult object
             * @param {String} id Input container ID
             */
            getAddressData(addressData, placeResultData, id) {
                console.log(placeResultData);
                var obj = {};
                obj = addressData;
                this.adrese.push(obj);
                // console.log(this.adrese);
                // this.startingPoint.position = {};
                // this.startingPoint.position.lat = this.adrese.latitude;
                //
                // this.startingPoint.position.lng = this.adrese.longitude;
            },
        },

        components: {
            VLayout,
            VueGoogleAutocomplete
        }
    }
</script>

























<!--<form @submit.prevent="calculate(adrese)">-->
<!--<div class="row">-->
<!--<vue-google-autocomplete-->
<!--id="map"-->
<!--classname="form-control"-->
<!--placeholder="Punctul de plecare"-->
<!--v-on:placechanged="getAddressData"-->
<!--country="ro"-->

<!--&gt;-->
<!--</vue-google-autocomplete>-->

<!--<h1>{{adrese}}</h1>-->
<!--</div>-->
<!--<hr size="30">-->
<!--<div class="row">-->
<!--&lt;!&ndash;<label for="adresa2">Adresa A</label>&ndash;&gt;-->
<!--&lt;!&ndash;<input type="text" class="form-control" id="adresa2" v-model="address.adr2"/>&ndash;&gt;-->
<!--<vue-google-autocomplete-->
<!--id="map2"-->
<!--classname="form-control"-->
<!--placeholder="Adresa A"-->
<!--v-on:placechanged="getAddressData"-->
<!--country="ro"-->
<!--&gt;-->
<!--</vue-google-autocomplete>-->
<!--</div>-->
<!--<div class="row">-->
<!--<label for="adresa3">Adresa B</label>-->
<!--<input type="text" class="form-control" id="adresa3" v-model="address.adr3" />-->
<!--</div>-->
<!--<hr size="30">-->
<!--<div class="form-group">-->
<!--<button class="btn btn-outline-primary">-->
<!--Calculeaza-->
<!--</button>-->
<!--</div>-->
<!--<h1>{{distance}}</h1>-->
<!--<div style="width: 100%" v-if="me">-->
<!--<embed id="myFrame" style="width: 100%; height: 400px" :src="-->
<!--'https://www.google.com/maps/embed/v1/directions?key=AIzaSyAGWiEqLEilt-TAYuij2_wA5CXBHwofvE8&origin='-->
<!--+ startingPoint[0].position.lat + ','-->
<!--+ startingPoint[0].position.lng +-->
<!--'&waypoints=' + startingPoint[2].position.lat + ','-->
<!--+ startingPoint[2].position.lng +-->
<!--'&destination=' + startingPoint[1].position.lat + ','-->
<!--+ startingPoint[1].position.lng"-->
<!--frameborder="0" scrolling="no" marginheight="0" marginwidth="0">-->
<!--</div>-->

<!--</form>-->