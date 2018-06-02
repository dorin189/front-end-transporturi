<!--suppress ALL -->
<template>

    <v-layout>
      <div>
          <form @submit.prevent="calculate(adrese)">
              <div class="row">
                  <vue-google-autocomplete
                          id="map"
                          classname="form-control"
                          placeholder="Punctul de plecare"
                          v-on:placechanged="getAddressData"
                          country="ro"

                  >
                  </vue-google-autocomplete>

                  <h1>{{adrese}}</h1>
              </div>
              <hr size="30">
              <div class="row">
                  <!--<label for="adresa2">Adresa A</label>-->
                  <!--<input type="text" class="form-control" id="adresa2" v-model="address.adr2"/>-->
                  <vue-google-autocomplete
                          id="map2"
                          classname="form-control"
                          placeholder="Adresa A"
                          v-on:placechanged="getAddressData"
                          country="ro"
                  >
                  </vue-google-autocomplete>
              </div>
              <div class="row">
                  <label for="adresa3">Adresa B</label>
                  <input type="text" class="form-control" id="adresa3" v-model="address.adr3" />
              </div>
              <hr size="30">
              <div class="form-group">
                  <button class="btn btn-outline-primary">
                      Calculeaza
                  </button>
              </div>
              <h1>{{distance}}</h1>
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

          </form>
      </div>
    </v-layout>
</template>

<script>
    /* eslint-disable */
    import VLayout from '@/layouts/Default';
    import VueGoogleAutocomplete from 'vue-google-autocomplete';
    import axios from 'axios';

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

            }
        },


        methods: {
            calculate(adrese) {
                var vm = this;
                // this.startingPoint.push({position:{
                //     lat: 45.79447529999999, lng: 24.15036280000004
                // }})


                console.log(this.startingPoint);


                var origin1 = new google.maps.LatLng(this.startingPoint[0].position.lat,this.startingPoint[0].position.lng);
                // var origin2 = 'Greenwich, England';
                // var destinationA = 'Stockholm, Sweden';
                var destinationB = new google.maps.LatLng(this.startingPoint[1].position.lat, this.startingPoint[1].position.lng);
                var destinationA = new google.maps.LatLng(this.startingPoint[2].position.lat, this.startingPoint[2].position.lng);
                console.log(destinationB);

                var service = new google.maps.DistanceMatrixService();



                service.getDistanceMatrix(
                    {
                        origins: [origin1],
                        destinations: [destinationA, destinationB],
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: false
                    }, (response,status) =>{
                        if (status == 'OK') {
                            var origins = response.originAddresses;
                            var destinations = response.destinationAddresses;
                            console.log(response);
                            for (var i = 0; i < origins.length; i++) {
                                var results = response.rows[i].elements;
                                for (var j = 0; j < results.length; j++) {
                                    var element = results[j];
                                    console.log(element);
                                    var distance = element.distance.text;
                                    vm.distance = distance;
                                    vm.shortDistance.push(element.distance.value);
                                    var duration = element.duration.text;
                                    console.log(duration);
                                    var from = origins[i];
                                    var to = destinations[j];
                                }
                            }
                        }
                        vm.shortDistance.sort(function(a,b) {
                            return a - b ;
                        })

                        // console.log(this.startingPoint);

                        // this.default = this.startingPoint[2];
                        // this.startingPoint[2] = this.startingPoint[1];
                        // this.startingPoint[1] = this.default;
                        // console.log(this.startingPoint);
                        // document.getElementById("demo").innerHTML = x;
                        // vm.me = true;
                        // var x = document.getElementsByClassName('directions-info')[0].getElementsByTagName('a')[0].href;
                        // var x =document.querySelector('.directions-info a').href;


                        var iframe1 = document.getElementById('myFrame');
                        var frameDocument = iframe1.contentDocument ? iframe1.contentDocument : iframe1.contentWindow.document;
                        var x = frameDocument.getElementsByClassName('directions-info')[0];
                        console.log(x);


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
