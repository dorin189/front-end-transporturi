<template>
    <v-layout>
            <div class="container">
                <div class="chart">
                    <h2>Incasare din livrari pentru fiecare sofer</h2>
                    <line-chart
                            :chart-data="datacollection"
                            :options="{responsive: false, maintainAspectRatio: false}"
                            :width="600"
                            :height="200"
                    >
                    </line-chart>
                </div>
                <div class="chart">
                    <h2>Revizie masini</h2>
                    <bar-chart
                            :chart-data="dataServiceCollection"
                            :options="{responsive: false, maintainAspectRatio: false}"
                            :width="600"
                            :height="200"
                    >
                    </bar-chart>
                </div>

            </div>
            <hr>
            <div id="map" style="height: 500px">
            </div>
            <hr>
            <h5 style="margin-bottom: 4px">
                <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" width="27" height="27"/>
                Locatii client
            </h5>
            <h5 style="margin-bottom: 4px">
                <img src="http://maps.google.com/mapfiles/ms/icons/yellow-dot.png" width="27" height="27"/>
                Locatii destinatar
            </h5>
            <h5 style="margin-bottom: 4px">
                <img src="http://maps.google.com/mapfiles/ms/icons/purple-dot.png" width="27" height="27" />
                Locatii comenzi neprocesate
            </h5>
    </v-layout>
</template>


<script>

    /* eslint-disable */
    import VLayout from '@/layouts/Default';
    import axios from 'axios';
    import LineChart from './LineChart.js';
    import BarChart from './BarChart.js';


    const GET_COMENZI_INFO = '/comenzi/info';

    const GET_SOFERI = '/soferi';
    const GET_DASHBOARD_REVIZIE = '/dashboard/revizie';
    const GET_DASHBOARD_SOFERI = '/dashboard/soferi';



    export default {
        name: 'dashboard',
        data() {
            return {
                address: '',
                posts: [],
                beaches: [],
                datacollection: null,
                dataServiceCollection: null,
                gradient: null,
                gradient2: null
            }
        },
        components: {
            VLayout,
            LineChart,
            BarChart
        },
        mounted () {
            this.aaa();
        },
        methods: {
            aaa () {
                var vm = this;
                axios.get(process.env.API_LOCATION + GET_DASHBOARD_REVIZIE)
                    .then(function (response) {
                        vm.dashboard(response.data);
                    });
                axios.get(process.env.API_LOCATION + GET_DASHBOARD_SOFERI)
                    .then(function (response) {
                        vm.fillData(response.data)
                    });
            },
            fillData (data) {
                var info = data;
                var soferId = [];
                for(var i = 0; i < info.length; i++) {
                    soferId.push(info[i].sofer_id);
                }

                var soferObj = {};
                var a = 0;

                for(var i = 0; i< info.length; i++) {
                    if(soferId[i] === info[i].sofer_id) {
                        a++;
                        soferObj = {
                        }
                    }
                }

                this.datacollection = {
                    labels: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
                    datasets: [
                        {
                            label: 'Incasare per masina',
                            backgroundColor: ['#f87979', 'blue', 'yellow'],
                            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]
                        }
                        // }, {
                        //     label: 'Data One',
                        //     backgroundColor: '#f87979',
                        //     data: [this.getRandomInt(), this.getRandomInt()]
                        // },
                        // {
                        //     label: 'Data One',
                        //     backgroundColor: '#f87979',
                        //     data: [this.getRandomInt(), this.getRandomInt()]
                        // }
                    ]
                }
            },
            dashboard (data) {
                var info = data;
                var responseLength = Object.keys(data).length;

                function getNumarInmatriculare() {
                    var arr = [];
                    for(var i = 0 ; i <= responseLength - 1; i++) {
                        arr.push(info[i].numar_inmatriculare);
                    }
                    return arr;
                }

                function getKmRevizie() {
                    var arr = [];
                    for(var i = 0 ; i <= responseLength - 1; i++) {
                        arr.push(info[i].revizie);
                    }
                    return arr;
                }

                this.dataServiceCollection = {
                    labels: getNumarInmatriculare(),
                    datasets: [
                        {
                            label: 'Km pana la revizie',
                            borderColor: '#a10404',
                            pointBackgroundColor: 'white',
                            borderWidth: 1,
                            pointBorderColor: 'white',
                            backgroundColor: '#00e5ee',
                            data: getKmRevizie()
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

        axios.get(process.env.API_LOCATION + GET_COMENZI_INFO)
            .then(response => {
                locatii = response.data;
                setMarkers(map, locatii);
            });

    }

    function setMarkers(map, locatii) {
        var image = {

            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(26, 32),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 32)
        };

        var image2 = {

            url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(26, 32),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 32)
        };

        for (var i = 0; i < locatii.length; i++) {
            var a = Object.values(locatii[i]);
            var beach = a;

            for(var b = 0; b < 2; b++) {
                console.log(beach);
                if(b === 0) {
                    var first = {
                        lat: parseFloat(beach[1]),
                        lng: parseFloat(beach[2])
                    };

                    var img1 = image;
                } else  {
                    var second = {
                        lat: parseFloat(beach[4]),
                        lng: parseFloat(beach[5])
                    };

                    var img2 = image2;
                }

                var marker = new google.maps.Marker({
                    // position: {lat: parseFloat(beach[1]), lng: parseFloat(beach[2])},
                    position: {lat: b === 0 ? first.lat : second.lat, lng: b === 0 ? first.lng : second.lng },
                    map: map,
                    icon: b === 0 ? img1 : img2,
                });

            }

        }


    }
        google.maps.event.addDomListener(window, "load", initialize);

</script>