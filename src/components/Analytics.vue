<template>
  <v-layout row wrap>

    <v-flex d-flex xs12 md6 pa-2>
      <v-layout column>
        <v-flex>
          <v-card>
            <v-layout row>
              <v-flex xs2 sm1>
                <v-card class="overlap-item">
                  <v-icon size="30">show_chart</v-icon>
                </v-card>
              </v-flex>
              <v-flex xs10 sm11>
                <v-container fluid>
                  <div id="last_visits"></div>
                </v-container>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex d-flex xs12 md6 pa-2>
      <v-layout column>
        <v-flex>
          <v-card>
            <v-layout row>
              <v-flex xs2 sm1>
                <v-card class="overlap-item">
                  <v-icon size="30">pie_chart</v-icon>
                </v-card>
              </v-flex>
              <v-flex xs10 sm11>
                <v-container fluid>
                  <div id="top_browsers"></div>
                </v-container>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex d-flex xs12 sm6 md3 pa-2>
      <v-layout column>
        <v-flex d-flex>
          <v-card>
            <v-layout row>
              <v-flex xs2>
                <v-card class="overlap-item">
                  <v-icon size="30">people</v-icon>
                </v-card>
              </v-flex>
              <v-flex xs10>
                <v-card-text class="px-0">
                  <p class="text-md-center">
                    <h4 class="headline">{{ user_types[0] ? user_types[0].type : 0 }}</h4>
                    <div> {{ user_types[0] ? user_types[0].sessions : 0 }} </div>
                  </p>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex d-flex xs12 sm6 md3 pa-2>
      <v-layout column>
        <v-flex d-flex>
          <v-card>
            <v-layout row>
              <v-flex xs2>
                <v-card class="overlap-item">
                  <v-icon size="30">repeat</v-icon>
                </v-card>
              </v-flex>
              <v-flex xs10>
                <v-card-text class="px-0">
                  <p class="text-md-center">
                    <h4 class="headline">{{ user_types[1] ? user_types[1].type : 0 }}</h4>
                    <div> {{ user_types[1] ? user_types[1].sessions : 0 }} </div>
                  </p>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex d-flex xs12 sm6 md3 pa-2>
      <v-layout column>
        <v-flex d-flex>
          <v-card>
            <v-layout row>
              <v-flex xs2>
                <v-card class="overlap-item">
                  <v-icon size="30">repeat</v-icon>
                </v-card>
              </v-flex>
              <v-flex xs10>
                <v-card-text class="px-0">
                  <p class="text-md-center">
                  <h4 class="headline">Average Session Duration</h4>
                  <div> {{ avg_session }} </div>
                  </p>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex d-flex xs12 sm6 md3 pa-2>
      <v-layout column>
        <v-flex d-flex>
          <v-card>
            <v-layout row>
              <v-flex xs2>
                <v-card class="overlap-item">
                  <v-icon size="30">repeat</v-icon>
                </v-card>
              </v-flex>
              <v-flex xs10>
                <v-card-text class="px-0">
                  <p class="text-md-center">
                  <h4 class="headline">Entrances</h4>
                  <div> {{ entrances }} </div>
                  </p>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex d-flex xs12 md6 pa-2>
      <v-layout column>
        <v-flex>
          <v-card>
            <v-layout row>
              <v-flex xs12>
                <v-container fluid>
                  <div style="display:flex; justify-content: center" id="countries_map"></div>
                </v-container>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

  </v-layout>
</template>

<script>
import eventBus from '../EventBus.js'
export default {
  data(){
    return {
      user_types: [],
      avg_session: '',
      entrances: ''
    }
  },
  created(){
    this.$store.commit('SET_LOADING', true)
    this.$http.get(this.baseUrl + 'analytics').then((res) => {

      this.user_types = res.data.data.user_types;
      this.avg_session = Math.round(res.data.data.avg_session_duration.totalsForAllResults['ga:avgSessionDuration']) + ' seconds';
      this.entrances = res.data.data.entrances.totalsForAllResults['ga:entrances'];
      let top_browsers = res.data.data.top_browsers;
      let total_visitors_page_views = res.data.data.total_visitors_page_views;
      let chartData = [];
      let donutData = [];
      let mapData = res.data.data.users_country.rows;

      total_visitors_page_views.forEach((item, index) => {
        let date = (item.date.split('T')[0]).split('-')[2];
        chartData.push([date, item.visitors])
      });

      donutData.push(['Language', 'Speakers (in millions)'])
      top_browsers.forEach((item, index) => {
        donutData.push([item.browser, item.sessions]);
      });

      new Promise((res, rej) => {
        google.charts.load('current', {'packages':['line', 'corechart']});
        google.charts.setOnLoadCallback(drawChart);
        google.charts.setOnLoadCallback(drawDonut);
        google.charts.setOnLoadCallback(drawMap);

        function drawChart() {
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Days');
          data.addColumn('number', 'Visits');

          data.addRows(
            chartData
          );

          var options = {
            chart: {
              title: 'Visits on last 30 days',
              subtitle: ''
            },
            hAxis: {
              title: 'Days',
              logScale: true
            },
            vAxis: {
              title: 'Quantity',
              logScale: false
            },
          };
          var chart = new google.charts.Line(document.getElementById('last_visits'));
          chart.draw(data, google.charts.Line.convertOptions(options));
        }

        function drawDonut() {
          var data = google.visualization.arrayToDataTable(donutData);

          var options = {
            // legend: 'none',
            // pieSliceText: 'label',
            // title: 'Top browsers on last 14 days',
            pieStartAngle: 100,
            chartArea: {width: 300, height: 170}
          };

          var chart = new google.visualization.PieChart(document.getElementById('top_browsers'));
          chart.draw(data, options);

          res()
        }

        function drawMap(){
          var chart = new google.visualization.GeoChart(document.getElementById('countries_map'));
          var data = google.visualization.arrayToDataTable(mapData);
          chart.draw(data, {width: 400, height: 250});
        }
      }).then(() => {
        eventBus.$emit('analytics-ready')
        this.$store.commit('SET_LOADING', false)
      })
    })
  },
  computed: {
    baseUrl(){
      return this.$store.getters.baseUrl
    }
  }
}
</script>
<style lang="css">
  .overlap-item {
    position: relative;
    bottom: 10px;
    left: 10px;
  }
</style>
