<template>
    <v-layout>
            <div id="map" style="height: 500px">

            </div>
            <div>
                <line-chart
                        :chart-data="datacollection"
                        :options="{responsive: false, maintainAspectRatio: false}"
                        :width="600"
                        :height="200"
                >
                </line-chart>
            </div>
    </v-layout>
</template>


<script>

    /* eslint-disable */
    import VLayout from '@/layouts/Default';
    import axios from 'axios';
    import LineChart from './LineChart.js';


    const GET_COMENZI = '/comenzi';


    export default {
        name: 'dorin',
        data() {
            return {
                address: '',
                posts: [],
                beaches: [],
                datacollection: null
            }
        },
        components: {
            VLayout,
            LineChart
        },
        mounted () {
            this.fillData()
        },
        methods: {
            fillData () {
                this.datacollection = {
                    labels: [this.getRandomInt(), this.getRandomInt()],
                    datasets: [
                        {
                            label: 'Data One',
                            backgroundColor: '#f87979',
                            data: [this.getRandomInt(), this.getRandomInt()]
                        }, {
                            label: 'Data One',
                            backgroundColor: '#f87979',
                            data: [this.getRandomInt(), this.getRandomInt()]
                        }
                    ]
                }
            },
            getRandomInt () {
                return Math.floor(Math.random() * (50 - 5 + 1)) + 5
            }
        }
    };

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

        for (var i = 0; i < locatii.length; i++) {
            var a = Object.values(locatii[i]);
            var beach = a;
            var marker = new google.maps.Marker({
                position: {lat: parseFloat(beach[1]), lng: parseFloat(beach[2])},
                map: map,
                icon: image,

            });
        }
    }
        google.maps.event.addDomListener(window, "load", initialize);



</script>