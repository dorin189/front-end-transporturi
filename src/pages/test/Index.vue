<template>
    <v-layout>
            <div>
                <!--<form>-->
                    <!--<div class="row">-->
                        <!--<label for="adresa1">Numar masini disponibile</label>-->
                        <!--<input type="text" class="form-control" id="adresa1" v-model="address.nrMasini" />-->
                    <!--</div>-->
                    <!--<div class="row">-->
                        <!--<label for="adresa2">Plecare in cursa</label>-->
                        <!--<input type="text" class="form-control" id="adresa2" v-model="address.timp" />-->
                    <!--</div>-->
                    <!--<div class="row" style="margin-top: 20px">-->
                        <!--<div class="form-group">-->
                            <!--<button class="btn btn-outline-primary">-->
                                <!--Calculeaza-->
                            <!--</button>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</form>-->
            </div>
        <!--<div class="form-group">-->
            <!--<button class="btn btn-outline-primary" v-on:click="greet">-->
                <!--Calculeaza-->
            <!--</button>-->
        <!--</div>-->
        <div id="map" style="height: 500px"></div>
        <!-- Replace the value of the key parameter with your own API key. -->

    </v-layout>

</template>
<script>

    /* eslint-disable */
    import VLayout from '@/layouts/Default';
    import VCard from '@/components/Card';
    import axios from 'axios';


    const GET_COMENZI = '/comenzi';
    export default {


        /**
         * The name of the page.
         */
      name: 'test',
        props: ['data', 'options'],


      data() {
          return {
            address: '',
            posts: [],
            beaches: [],
            objTest: {
                labels: ['January', 'February'],
                datasets: [
                    {
                        label: 'GitHub Commits',
                        backgroundColor: '#f87979',
                        data: [40, 20]
                    }
                ]
            },
          }
      },
      // beforeRouteEnter() {
      //   axios.get(process.env.API_LOCATION + GET_COMENZI)
      //       .then(response => {
      //          console.log(response);
      //       });
      //
      //
      // },

        mounted () {
            // Overwriting base render method with actual data.
            // this.renderChart(this.data, this.options);
        },

      methods: {

      },
        components: {
            VLayout,
            VCard,
        }
    };

    // console.log(posts);

    var beaches = [
        ['a', 44.3815122, 26.152377200000046],
        ['b',45.71879329999999, 25.775300399999992],
        ['c', 47.1673149, 27.58322750000002],
        // ['Cronulla Beach', 47.1673149, 27.58322750000002, 3],
    ];

    function initialize() {

        var locatii = [];
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 6,
            center: {lat: 44.3815122, lng: 26.152377200000046}
        });

        axios.get(process.env.API_LOCATION + GET_COMENZI)
              .then(response => {
                 locatii = response.data;
                  setMarkers(map, locatii);
              });


    }

    function setMarkers(map, locatii) {
        var image = {

            url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(20, 32),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 32)
        };

        console.log(locatii.length);



        for (var i = 0; i < locatii.length; i++) {
            var a = Object.values(locatii[i]);
            console.log(a);
            var beach = a;
            console.log(parseFloat(beach[1]));
            var marker = new google.maps.Marker({
                position: {lat: parseFloat(beach[1]), lng: parseFloat(beach[2])},
                map: map,
                icon: image,

            });
        }



        // for (var i = 0; i < beaches.length; i++) {
        //     var beach = beaches[i];
        //     console.log(beach);
        //     var marker = new google.maps.Marker({
        //         position: {lat: beach[1], lng: beach[2]},
        //         map: map,
        //         icon: image,
        //
        //     });
        // }
    }

    google.maps.event.addDomListener(window, "load", initialize)
</script>