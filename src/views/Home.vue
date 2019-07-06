<template>
  <v-container fluid style="padding: 0px">
    
    <v-tabs v-model="model" color="transparent" class="my-tabs" grow>
      <v-tab
        href="#tab-1"
      >
        Today
      </v-tab>

      <v-tab
        href="#tab-2"
      >
        7 days
      </v-tab>
    </v-tabs>

    <div v-if="forecast.currently.temperature !== null">

      <v-tabs-items touchless v-model="model">

        <v-tab-item :value="'tab-1'" >
          <v-layout row wrap >
            <v-flex class="high-low text-xs-left" xs3 offset-xs2 offset-md1 md2>
              <p>
                <v-tooltip top >
                  <span slot="activator"><i class="wi wi-direction-up"></i> {{ forecast.daily.data[0].temperatureLow }} <span class="stick-top">°</span> </span>
                  <span>Highest temperature</span>
                </v-tooltip>
                <br>
                <v-tooltip bottom>
                  <span slot="activator"><i class="wi wi-direction-down"></i> {{ forecast.daily.data[0].temperatureHigh }} <span class="stick-top">°</span> </span>
                  <span>Lowest temperature</span>
                </v-tooltip>
              </p>
            </v-flex>
            <v-flex class="text-xs-left" offset-xs1 xs6 md4 >
              <div class="inlined">
                <h1 class='grades'>{{ forecast.currently.temperature }}</h1> 
                <v-btn
                  class="grades-button"
                  flat icon
                  @click.stop="toggleDegrees"
                >
                  <span>{{ (units == "ca" ? "°C" : "°F") }}</span> 
                </v-btn>
              </div>
            </v-flex>

            <v-flex class="text-xs-center" xs12 md4 v-if="forecast.currently.icon" >

              <div class="icon-container" v-html="displayIcon">
              </div>


              <br>
              <span>{{ forecast.currently.summary }}</span>
              <br><br>
            </v-flex>

            <v-flex xs12 class="text-xs-center">
              <h3>{{ locationDisplay }}</h3>
              <p>{{ dateDisplay }}</p>
              
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex>
              <swiper style="padding: 2%;" :options="swiperOption">
                <swiper-slide v-for="item in forecast.hourly.data" >
                  <v-container class="hourly-item">
                    <v-flex v-html="getTime(item.time)" class="time-hourly"></v-flex>
                    <v-layout row>
                      <v-flex xs6>
                        {{ item.temperature+'°' }} 
                      </v-flex>
                      <v-flex xs6 v-html="returnIcon(item.icon)"></v-flex>
                    </v-layout>
                    <v-flex v-html="getAdv(item.time)"></v-flex>
                    <v-flex>{{ item.summary }}</v-flex>

                    <v-layout row wrap class="hourly-humidity" >
                      <v-flex xs12 md6>
                        <v-tooltip top >
                          <span slot="activator">{{ (item.precipProbability*100).toFixed(2) }} <i class="wi wi-humidity"></i> </span>
                          <span>Precipitation probability</span>
                        </v-tooltip>
                      </v-flex>

                      <v-flex xs12 md6>
                        <v-tooltip top >
                          <span slot="activator">{{ item.precipIntensity }} <i class="wi wi-raindrop"></i> </span>
                          <span>Precipitation intensity</span>
                        </v-tooltip>
                      </v-flex>

                      <v-flex xs12 md6>
                        <v-tooltip top >
                          <span slot="activator">{{ item.windSpeed }} Km/h <i class="wi wi-strong-wind"></i> </span>
                          <span>Wind speed</span>
                        </v-tooltip>
                      </v-flex>

                      <v-flex xs12 md6>
                        <v-tooltip top >
                          <span slot="activator">{{ item.uvIndex }} <i class="wi wi-barometer"></i> </span>
                          <span>UV Index</span>
                        </v-tooltip>
                      </v-flex>

                      
                    </v-layout>
                  </v-container>
                </swiper-slide>
              </swiper>
            </v-flex>
          </v-layout>
        </v-tab-item>

        <v-tab-item fluid :value="'tab-2'">
          <v-expansion-panel>
            <v-expansion-panel-content
              v-for="(item,i) in forecast.daily.data"
              :key="i"
              color="transparent"
            >
              <template v-slot:header>
                <v-container>
                  <v-layout row>

                    <v-flex xs3 class="week-icon text-xs-right" v-html="returnIcon(item.icon)"></v-flex>

                    <v-flex xs6 offset-xs1 v-html="dateDefaultFormater(item.time)"></v-flex>

                  </v-layout>

                  <v-layout row>
                    <v-flex xs3 class="text-xs-right" v-html="getAdv(item.time)">

                    </v-flex>
                  </v-layout>
                </v-container>
              </template>
              <v-card style="padding: 2%;">
                <v-layout row>
                  {{ item.summary }}
                </v-layout>
                
                <v-layout row>
                    <v-flex xs2 style="padding:1%">
                      <v-tooltip bottom>
                        <span slot="activator"><i class="wi wi-sunrise"></i> {{ getTime(item.sunriseTime) }} <span class="stick-top">°</span> </span>
                        <span>Sunrise</span>
                      </v-tooltip>
                    </v-flex>
                    
                    <v-flex xs2 style="padding:1%">
                      <v-tooltip bottom>
                        <span slot="activator"><i class="wi wi-sunset"></i> {{ getTime(item.sunsetTime) }} <span class="stick-top">°</span> </span>
                        <span>Sunset</span>
                      </v-tooltip>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs2 class="text-xs-right" style="padding:1%">
                      <v-tooltip bottom>
                        <span slot="activator"><i class="wi wi-direction-up"></i> {{ item.temperatureHigh }} <span class="stick-top">°</span> </span>
                        <span>Highest temperature</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex xs8 style="display:flex;justify-content:center;align-items:center;">
                      <div class="low-highBar"></div>
                    </v-flex>
                    
                    <v-flex xs2 style="padding:1%">
                      <v-tooltip bottom>
                        <span slot="activator"><i class="wi wi-direction-down"></i> {{ item.temperatureLow }} <span class="stick-top">°</span> </span>
                        <span>Lowest temperature</span>
                      </v-tooltip>
                    </v-flex>
                </v-layout>
                
                <v-layout row>
                  <v-flex class="daily-index-text" xs6>
                    Humidity
                  </v-flex>

                  <v-flex class="text-xs-left" xs6>
                    {{ item.humidity*100 }}%
                  </v-flex>
                </v-layout> 
                
                <v-layout row>
                  <v-flex class="daily-index-text" xs6>
                    Precipitation probability
                  </v-flex>

                  <v-flex class="text-xs-left" xs6>
                    {{ (item.precipProbability*100).toFixed(2) }}%
                  </v-flex>
                </v-layout> 

                <v-layout row>
                  <v-flex class="daily-index-text" xs6>
                    Wind speed
                  </v-flex>

                  <v-flex class="text-xs-left" xs6>
                    {{ item.windSpeed }} km/h
                  </v-flex>
                </v-layout> 
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-tab-item>
      </v-tabs-items>
    
    </div>

    <div v-else>
      <v-layout row>
        <v-flex xs6>
          Cargando
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
  import axios from 'axios';
  import Dater from '../dater';

  import 'swiper/dist/css/swiper.css'

  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  //import Skycons from '../skycons';

  console.log(new Dater());

  const weatherApi = "93f5798a25ea3831b07b81afa3804d55";

  export default {
    components: {
      swiper,
      swiperSlide
    },
    name: "Home",
    data(){
      return {
        today: {},
        forecast: {
          currently:{
            temperature: null,
            icon: true
          },
          hourly: {
            data: [
                  {
                  time: 1562227200,
                  summary: "Mostly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 13.58,
                  apparentTemperature: 13.58,
                  dewPoint: 11.23,
                  humidity: 0.86,
                  pressure: 1013.12,
                  windSpeed: 3.26,
                  windGust: 4.49,
                  windBearing: 232,
                  cloudCover: 0.71,
                  uvIndex: 0,
                  visibility: 13.487,
                  ozone: 343.7
                  },
                  {
                  time: 1562230800,
                  summary: "Mostly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 13.46,
                  apparentTemperature: 13.46,
                  dewPoint: 11.37,
                  humidity: 0.87,
                  pressure: 1012.75,
                  windSpeed: 3.11,
                  windGust: 4.33,
                  windBearing: 228,
                  cloudCover: 0.66,
                  uvIndex: 0,
                  visibility: 15.415,
                  ozone: 343.4
                  },
                  {
                  time: 1562234400,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.31,
                  apparentTemperature: 13.31,
                  dewPoint: 11.84,
                  humidity: 0.91,
                  pressure: 1012.27,
                  windSpeed: 3.05,
                  windGust: 4.44,
                  windBearing: 225,
                  cloudCover: 0.42,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 343
                  },
                  {
                  time: 1562238000,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.03,
                  apparentTemperature: 13.03,
                  dewPoint: 12.07,
                  humidity: 0.94,
                  pressure: 1011.9,
                  windSpeed: 2.95,
                  windGust: 4.57,
                  windBearing: 212,
                  cloudCover: 0.28,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 342.5
                  },
                  {
                  time: 1562241600,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 12.67,
                  apparentTemperature: 12.67,
                  dewPoint: 11.96,
                  humidity: 0.95,
                  pressure: 1011.88,
                  windSpeed: 2.78,
                  windGust: 4.45,
                  windBearing: 222,
                  cloudCover: 0.29,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 342.2
                  },
                  {
                  time: 1562245200,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 12.68,
                  apparentTemperature: 12.68,
                  dewPoint: 11.86,
                  humidity: 0.95,
                  pressure: 1012.2,
                  windSpeed: 2.64,
                  windGust: 4.33,
                  windBearing: 220,
                  cloudCover: 0.31,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 342.1
                  },
                  {
                  time: 1562248800,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.02,
                  precipProbability: 0.02,
                  precipType: "rain",
                  temperature: 13.05,
                  apparentTemperature: 13.05,
                  dewPoint: 11.85,
                  humidity: 0.92,
                  pressure: 1012.81,
                  windSpeed: 2.53,
                  windGust: 4.05,
                  windBearing: 217,
                  cloudCover: 0.33,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 342
                  },
                  {
                  time: 1562252400,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.02,
                  precipProbability: 0.02,
                  precipType: "rain",
                  temperature: 13.66,
                  apparentTemperature: 13.66,
                  dewPoint: 11.85,
                  humidity: 0.89,
                  pressure: 1013.26,
                  windSpeed: 2.58,
                  windGust: 3.84,
                  windBearing: 214,
                  cloudCover: 0.33,
                  uvIndex: 1,
                  visibility: 16.093,
                  ozone: 341.6
                  },
                  {
                  time: 1562256000,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 14.5,
                  apparentTemperature: 14.5,
                  dewPoint: 11.85,
                  humidity: 0.84,
                  pressure: 1013.62,
                  windSpeed: 2.69,
                  windGust: 3.76,
                  windBearing: 209,
                  cloudCover: 0.33,
                  uvIndex: 2,
                  visibility: 16.093,
                  ozone: 340.3
                  },
                  {
                  time: 1562259600,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 15.41,
                  apparentTemperature: 15.41,
                  dewPoint: 11.87,
                  humidity: 0.79,
                  pressure: 1013.93,
                  windSpeed: 2.79,
                  windGust: 3.61,
                  windBearing: 207,
                  cloudCover: 0.31,
                  uvIndex: 4,
                  visibility: 16.093,
                  ozone: 338.6
                  },
                  {
                  time: 1562263200,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.02,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 16.09,
                  apparentTemperature: 16.09,
                  dewPoint: 11.96,
                  humidity: 0.76,
                  pressure: 1014.1,
                  windSpeed: 3,
                  windGust: 3.65,
                  windBearing: 218,
                  cloudCover: 0.28,
                  uvIndex: 6,
                  visibility: 16.093,
                  ozone: 337.4
                  },
                  {
                  time: 1562266800,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 16.61,
                  apparentTemperature: 16.61,
                  dewPoint: 12.09,
                  humidity: 0.75,
                  pressure: 1014.08,
                  windSpeed: 3.53,
                  windGust: 4.22,
                  windBearing: 220,
                  cloudCover: 0.25,
                  uvIndex: 7,
                  visibility: 16.093,
                  ozone: 336.7
                  },
                  {
                  time: 1562270400,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.04,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 17.14,
                  apparentTemperature: 17.14,
                  dewPoint: 12.22,
                  humidity: 0.73,
                  pressure: 1013.91,
                  windSpeed: 4.12,
                  windGust: 4.95,
                  windBearing: 232,
                  cloudCover: 0.22,
                  uvIndex: 8,
                  visibility: 16.093,
                  ozone: 336.4
                  },
                  {
                  time: 1562274000,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 17.65,
                  apparentTemperature: 17.65,
                  dewPoint: 12.3,
                  humidity: 0.71,
                  pressure: 1013.75,
                  windSpeed: 4.5,
                  windGust: 5.5,
                  windBearing: 239,
                  cloudCover: 0.19,
                  uvIndex: 8,
                  visibility: 16.093,
                  ozone: 336.1
                  },
                  {
                  time: 1562277600,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 18.42,
                  apparentTemperature: 18.42,
                  dewPoint: 12.54,
                  humidity: 0.69,
                  pressure: 1013.1,
                  windSpeed: 4.75,
                  windGust: 5.41,
                  windBearing: 247,
                  cloudCover: 0.23,
                  uvIndex: 7,
                  visibility: 16.093,
                  ozone: 335.7
                  },
                  {
                  time: 1562281200,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 18.35,
                  apparentTemperature: 18.35,
                  dewPoint: 12.61,
                  humidity: 0.69,
                  pressure: 1012.72,
                  windSpeed: 4.94,
                  windGust: 5.85,
                  windBearing: 250,
                  cloudCover: 0.21,
                  uvIndex: 5,
                  visibility: 16.093,
                  ozone: 335.4
                  },
                  {
                  time: 1562284800,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 17.81,
                  apparentTemperature: 17.81,
                  dewPoint: 12.67,
                  humidity: 0.72,
                  pressure: 1012.48,
                  windSpeed: 4.96,
                  windGust: 6.05,
                  windBearing: 251,
                  cloudCover: 0.19,
                  uvIndex: 3,
                  visibility: 16.093,
                  ozone: 335.4
                  },
                  {
                  time: 1562288400,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 17.02,
                  apparentTemperature: 17.02,
                  dewPoint: 12.67,
                  humidity: 0.76,
                  pressure: 1012.49,
                  windSpeed: 4.7,
                  windGust: 5.89,
                  windBearing: 238,
                  cloudCover: 0.17,
                  uvIndex: 2,
                  visibility: 16.093,
                  ozone: 336.1
                  },
                  {
                  time: 1562292000,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 16.03,
                  apparentTemperature: 16.03,
                  dewPoint: 12.65,
                  humidity: 0.8,
                  pressure: 1012.65,
                  windSpeed: 4.27,
                  windGust: 5.5,
                  windBearing: 247,
                  cloudCover: 0.15,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 337.2
                  },
                  {
                  time: 1562295600,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 15.3,
                  apparentTemperature: 15.3,
                  dewPoint: 12.61,
                  humidity: 0.84,
                  pressure: 1012.87,
                  windSpeed: 3.89,
                  windGust: 5.17,
                  windBearing: 242,
                  cloudCover: 0.14,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 337.8
                  },
                  {
                  time: 1562299200,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 14.66,
                  apparentTemperature: 14.66,
                  dewPoint: 12.56,
                  humidity: 0.87,
                  pressure: 1013.18,
                  windSpeed: 3.67,
                  windGust: 5.01,
                  windBearing: 239,
                  cloudCover: 0.15,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 337.4
                  },
                  {
                  time: 1562302800,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 13.97,
                  apparentTemperature: 13.97,
                  dewPoint: 12.5,
                  humidity: 0.91,
                  pressure: 1013.54,
                  windSpeed: 3.53,
                  windGust: 4.9,
                  windBearing: 227,
                  cloudCover: 0.17,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 336.6
                  },
                  {
                  time: 1562306400,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.55,
                  apparentTemperature: 13.55,
                  dewPoint: 12.42,
                  humidity: 0.93,
                  pressure: 1013.83,
                  windSpeed: 3.44,
                  windGust: 4.82,
                  windBearing: 227,
                  cloudCover: 0.21,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 336.1
                  },
                  {
                  time: 1562310000,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.02,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.43,
                  apparentTemperature: 13.43,
                  dewPoint: 12.34,
                  humidity: 0.93,
                  pressure: 1013.97,
                  windSpeed: 3.45,
                  windGust: 4.73,
                  windBearing: 226,
                  cloudCover: 0.29,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 336.3
                  },
                  {
                  time: 1562313600,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.02,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.36,
                  apparentTemperature: 13.36,
                  dewPoint: 12.25,
                  humidity: 0.93,
                  pressure: 1014.04,
                  windSpeed: 3.52,
                  windGust: 4.66,
                  windBearing: 212,
                  cloudCover: 0.39,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 336.7
                  },
                  {
                  time: 1562317200,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.03,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.28,
                  apparentTemperature: 13.28,
                  dewPoint: 12.16,
                  humidity: 0.93,
                  pressure: 1014.05,
                  windSpeed: 3.54,
                  windGust: 4.6,
                  windBearing: 222,
                  cloudCover: 0.47,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 337.3
                  },
                  {
                  time: 1562320800,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.04,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 12.96,
                  apparentTemperature: 12.96,
                  dewPoint: 12.07,
                  humidity: 0.94,
                  pressure: 1013.97,
                  windSpeed: 3.44,
                  windGust: 4.6,
                  windBearing: 222,
                  cloudCover: 0.48,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 338
                  },
                  {
                  time: 1562324400,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.04,
                  precipProbability: 0.02,
                  precipType: "rain",
                  temperature: 12.54,
                  apparentTemperature: 12.54,
                  dewPoint: 11.98,
                  humidity: 0.96,
                  pressure: 1013.86,
                  windSpeed: 3.29,
                  windGust: 4.61,
                  windBearing: 224,
                  cloudCover: 0.48,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 338.8
                  },
                  {
                  time: 1562328000,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.04,
                  precipProbability: 0.02,
                  precipType: "rain",
                  temperature: 12.3,
                  apparentTemperature: 12.3,
                  dewPoint: 11.91,
                  humidity: 0.97,
                  pressure: 1013.88,
                  windSpeed: 3.15,
                  windGust: 4.51,
                  windBearing: 223,
                  cloudCover: 0.49,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 339.4
                  },
                  {
                  time: 1562331600,
                  summary: "Mostly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.04,
                  precipProbability: 0.02,
                  precipType: "rain",
                  temperature: 12.42,
                  apparentTemperature: 12.42,
                  dewPoint: 11.9,
                  humidity: 0.97,
                  pressure: 1014.12,
                  windSpeed: 3.01,
                  windGust: 4.19,
                  windBearing: 221,
                  cloudCover: 0.52,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 339.7
                  },
                  {
                  time: 1562335200,
                  summary: "Mostly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.03,
                  precipProbability: 0.02,
                  precipType: "rain",
                  temperature: 12.61,
                  apparentTemperature: 12.61,
                  dewPoint: 11.92,
                  humidity: 0.96,
                  pressure: 1014.49,
                  windSpeed: 2.88,
                  windGust: 3.77,
                  windBearing: 217,
                  cloudCover: 0.56,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 339.6
                  },
                  {
                  time: 1562338800,
                  summary: "Mostly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.02,
                  precipProbability: 0.02,
                  precipType: "rain",
                  temperature: 13.05,
                  apparentTemperature: 13.05,
                  dewPoint: 11.96,
                  humidity: 0.93,
                  pressure: 1014.86,
                  windSpeed: 2.82,
                  windGust: 3.43,
                  windBearing: 216,
                  cloudCover: 0.58,
                  uvIndex: 1,
                  visibility: 16.093,
                  ozone: 339.4
                  },
                  {
                  time: 1562342400,
                  summary: "Mostly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.66,
                  apparentTemperature: 13.66,
                  dewPoint: 12,
                  humidity: 0.9,
                  pressure: 1015.22,
                  windSpeed: 2.86,
                  windGust: 3.2,
                  windBearing: 218,
                  cloudCover: 0.55,
                  uvIndex: 2,
                  visibility: 16.093,
                  ozone: 338.7
                  },
                  {
                  time: 1562346000,
                  summary: "Mostly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 14.27,
                  apparentTemperature: 14.27,
                  dewPoint: 12.05,
                  humidity: 0.86,
                  pressure: 1015.57,
                  windSpeed: 2.96,
                  windGust: 3.09,
                  windBearing: 220,
                  cloudCover: 0.51,
                  uvIndex: 4,
                  visibility: 16.093,
                  ozone: 337.9
                  },
                  {
                  time: 1562349600,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 14.82,
                  apparentTemperature: 14.82,
                  dewPoint: 12.13,
                  humidity: 0.84,
                  pressure: 1015.79,
                  windSpeed: 3.18,
                  windGust: 3.24,
                  windBearing: 222,
                  cloudCover: 0.46,
                  uvIndex: 5,
                  visibility: 16.093,
                  ozone: 337.2
                  },
                  {
                  time: 1562353200,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 15.78,
                  apparentTemperature: 15.78,
                  dewPoint: 12.28,
                  humidity: 0.8,
                  pressure: 1015.84,
                  windSpeed: 3.61,
                  windGust: 3.68,
                  windBearing: 223,
                  cloudCover: 0.4,
                  uvIndex: 7,
                  visibility: 16.093,
                  ozone: 336.9
                  },
                  {
                  time: 1562356800,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 16.89,
                  apparentTemperature: 16.89,
                  dewPoint: 12.45,
                  humidity: 0.75,
                  pressure: 1015.78,
                  windSpeed: 4.15,
                  windGust: 4.29,
                  windBearing: 236,
                  cloudCover: 0.33,
                  uvIndex: 8,
                  visibility: 16.093,
                  ozone: 336.6
                  },
                  {
                  time: 1562360400,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 17.67,
                  apparentTemperature: 17.67,
                  dewPoint: 12.57,
                  humidity: 0.72,
                  pressure: 1015.6,
                  windSpeed: 4.59,
                  windGust: 4.91,
                  windBearing: 241,
                  cloudCover: 0.27,
                  uvIndex: 8,
                  visibility: 16.093,
                  ozone: 336.3
                  },
                  {
                  time: 1562364000,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 17.97,
                  apparentTemperature: 17.97,
                  dewPoint: 12.6,
                  humidity: 0.71,
                  pressure: 1015.19,
                  windSpeed: 4.86,
                  windGust: 5.52,
                  windBearing: 233,
                  cloudCover: 0.24,
                  uvIndex: 7,
                  visibility: 16.093,
                  ozone: 335.8
                  },
                  {
                  time: 1562367600,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 17.99,
                  apparentTemperature: 17.99,
                  dewPoint: 12.58,
                  humidity: 0.71,
                  pressure: 1014.68,
                  windSpeed: 5.04,
                  windGust: 6.07,
                  windBearing: 251,
                  cloudCover: 0.22,
                  uvIndex: 5,
                  visibility: 16.093,
                  ozone: 335.2
                  },
                  {
                  time: 1562371200,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 17.45,
                  apparentTemperature: 17.45,
                  dewPoint: 12.55,
                  humidity: 0.73,
                  pressure: 1014.32,
                  windSpeed: 5.07,
                  windGust: 6.36,
                  windBearing: 247,
                  cloudCover: 0.2,
                  uvIndex: 3,
                  visibility: 16.093,
                  ozone: 334.4
                  },
                  {
                  time: 1562374800,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 16.61,
                  apparentTemperature: 16.61,
                  dewPoint: 12.5,
                  humidity: 0.77,
                  pressure: 1014.23,
                  windSpeed: 4.89,
                  windGust: 6.2,
                  windBearing: 244,
                  cloudCover: 0.16,
                  uvIndex: 2,
                  visibility: 16.093,
                  ozone: 333
                  },
                  {
                  time: 1562378400,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-day",
                  precipIntensity: 0,
                  precipProbability: 0,
                  temperature: 15.47,
                  apparentTemperature: 15.47,
                  dewPoint: 12.44,
                  humidity: 0.82,
                  pressure: 1014.3,
                  windSpeed: 4.58,
                  windGust: 5.76,
                  windBearing: 239,
                  cloudCover: 0.13,
                  uvIndex: 1,
                  visibility: 16.093,
                  ozone: 331.4
                  },
                  {
                  time: 1562382000,
                  summary: "Clear",
                  icon: "clear-day",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 14.56,
                  apparentTemperature: 14.56,
                  dewPoint: 12.37,
                  humidity: 0.87,
                  pressure: 1014.41,
                  windSpeed: 4.3,
                  windGust: 5.42,
                  windBearing: 240,
                  cloudCover: 0.12,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 330.1
                  },
                  {
                  time: 1562385600,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 14.07,
                  apparentTemperature: 14.07,
                  dewPoint: 12.28,
                  humidity: 0.89,
                  pressure: 1014.61,
                  windSpeed: 4.13,
                  windGust: 5.34,
                  windBearing: 238,
                  cloudCover: 0.15,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 329.5
                  },
                  {
                  time: 1562389200,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.01,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.52,
                  apparentTemperature: 13.52,
                  dewPoint: 12.19,
                  humidity: 0.92,
                  pressure: 1014.87,
                  windSpeed: 3.98,
                  windGust: 5.36,
                  windBearing: 226,
                  cloudCover: 0.21,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 329.2
                  },
                  {
                  time: 1562392800,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.02,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.14,
                  apparentTemperature: 13.14,
                  dewPoint: 12.09,
                  humidity: 0.93,
                  pressure: 1015,
                  windSpeed: 3.85,
                  windGust: 5.36,
                  windBearing: 228,
                  cloudCover: 0.27,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 329.1
                  },
                  {
                  time: 1562396400,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.02,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.13,
                  apparentTemperature: 13.13,
                  dewPoint: 12.01,
                  humidity: 0.93,
                  pressure: 1014.92,
                  windSpeed: 3.78,
                  windGust: 5.26,
                  windBearing: 226,
                  cloudCover: 0.32,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 329.3
                  },
                  {
                  time: 1562400000,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.03,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.26,
                  apparentTemperature: 13.26,
                  dewPoint: 11.93,
                  humidity: 0.92,
                  pressure: 1014.73,
                  windSpeed: 3.74,
                  windGust: 5.13,
                  windBearing: 211,
                  cloudCover: 0.37,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 329.5
                  },
                  {
                  time: 1562403600,
                  summary: "Partly Cloudy",
                  icon: "partly-cloudy-night",
                  precipIntensity: 0.03,
                  precipProbability: 0.01,
                  precipType: "rain",
                  temperature: 13.24,
                  apparentTemperature: 13.24,
                  dewPoint: 11.85,
                  humidity: 0.91,
                  pressure: 1014.5,
                  windSpeed: 3.62,
                  windGust: 5.02,
                  windBearing: 220,
                  cloudCover: 0.4,
                  uvIndex: 0,
                  visibility: 16.093,
                  ozone: 329.9
                  }
                  ]
          },
          daily: {
            data: [
{
time: 1562223600,
summary: "Mostly cloudy throughout the day.",
icon: "partly-cloudy-day",
sunriseTime: 1562244844,
sunsetTime: 1562297793,
moonPhase: 0.09,
precipIntensity: 0.0001,
precipIntensityMax: 0.0012,
precipIntensityMaxTime: 1562299200,
precipProbability: 0.06,
precipType: "rain",
temperatureHigh: 64.81,
temperatureHighTime: 1562281200,
temperatureLow: 55.44,
temperatureLowTime: 1562331600,
apparentTemperatureHigh: 64.81,
apparentTemperatureHighTime: 1562281200,
apparentTemperatureLow: 55.44,
apparentTemperatureLowTime: 1562331600,
dewPoint: 52.87,
humidity: 0.81,
pressure: 1013.6,
windSpeed: 7.29,
windGust: 12.92,
windGustTime: 1562284800,
windBearing: 234,
cloudCover: 0.3,
uvIndex: 9,
uvIndexTime: 1562270400,
visibility: 8.632,
ozone: 342,
temperatureMin: 54.39,
temperatureMinTime: 1562245200,
temperatureMax: 64.81,
temperatureMaxTime: 1562281200,
apparentTemperatureMin: 54.39,
apparentTemperatureMinTime: 1562245200,
apparentTemperatureMax: 64.81,
apparentTemperatureMaxTime: 1562281200
},
{
time: 1562310000,
summary: "Partly cloudy throughout the day.",
icon: "partly-cloudy-day",
sunriseTime: 1562331276,
sunsetTime: 1562384181,
moonPhase: 0.13,
precipIntensity: 0.0006,
precipIntensityMax: 0.0028,
precipIntensityMaxTime: 1562320800,
precipProbability: 0.07,
precipType: "rain",
temperatureHigh: 65.03,
temperatureHighTime: 1562364000,
temperatureLow: 54.74,
temperatureLowTime: 1562414400,
apparentTemperatureHigh: 65.03,
apparentTemperatureHighTime: 1562364000,
apparentTemperatureLow: 54.74,
apparentTemperatureLowTime: 1562414400,
dewPoint: 54.21,
humidity: 0.84,
pressure: 1014.78,
windSpeed: 8.52,
windGust: 14.03,
windGustTime: 1562371200,
windBearing: 228,
cloudCover: 0.35,
uvIndex: 8,
uvIndexTime: 1562360400,
visibility: 9.971,
ozone: 338.1,
temperatureMin: 55.44,
temperatureMinTime: 1562331600,
temperatureMax: 65.03,
temperatureMaxTime: 1562364000,
apparentTemperatureMin: 55.44,
apparentTemperatureMinTime: 1562331600,
apparentTemperatureMax: 65.03,
apparentTemperatureMaxTime: 1562364000
},
{
time: 1562396400,
summary: "Partly cloudy throughout the day.",
icon: "partly-cloudy-day",
sunriseTime: 1562417709,
sunsetTime: 1562470567,
moonPhase: 0.17,
precipIntensity: 0.0006,
precipIntensityMax: 0.0016,
precipIntensityMaxTime: 1562414400,
precipProbability: 0.06,
precipType: "rain",
temperatureHigh: 63.9,
temperatureHighTime: 1562450400,
temperatureLow: 55.45,
temperatureLowTime: 1562500800,
apparentTemperatureHigh: 63.9,
apparentTemperatureHighTime: 1562450400,
apparentTemperatureLow: 55.45,
apparentTemperatureLowTime: 1562500800,
dewPoint: 53.46,
humidity: 0.82,
pressure: 1013.75,
windSpeed: 8.55,
windGust: 17.89,
windGustTime: 1562468400,
windBearing: 239,
cloudCover: 0.38,
uvIndex: 6,
uvIndexTime: 1562439600,
visibility: 10,
ozone: 337.7,
temperatureMin: 54.74,
temperatureMinTime: 1562414400,
temperatureMax: 63.9,
temperatureMaxTime: 1562450400,
apparentTemperatureMin: 54.74,
apparentTemperatureMinTime: 1562414400,
apparentTemperatureMax: 63.9,
apparentTemperatureMaxTime: 1562450400
},
{
time: 1562482800,
summary: "Partly cloudy throughout the day.",
icon: "partly-cloudy-day",
sunriseTime: 1562504143,
sunsetTime: 1562556952,
moonPhase: 0.2,
precipIntensity: 0.0004,
precipIntensityMax: 0.0012,
precipIntensityMaxTime: 1562565600,
precipProbability: 0.07,
precipType: "rain",
temperatureHigh: 61.11,
temperatureHighTime: 1562533200,
temperatureLow: 55.85,
temperatureLowTime: 1562590800,
apparentTemperatureHigh: 61.11,
apparentTemperatureHighTime: 1562533200,
apparentTemperatureLow: 55.85,
apparentTemperatureLowTime: 1562590800,
dewPoint: 53.44,
humidity: 0.86,
pressure: 1012.08,
windSpeed: 11.39,
windGust: 23.12,
windGustTime: 1562554800,
windBearing: 249,
cloudCover: 0.51,
uvIndex: 7,
uvIndexTime: 1562533200,
visibility: 10,
ozone: 341.8,
temperatureMin: 55.45,
temperatureMinTime: 1562500800,
temperatureMax: 61.11,
temperatureMaxTime: 1562533200,
apparentTemperatureMin: 55.45,
apparentTemperatureMinTime: 1562500800,
apparentTemperatureMax: 61.11,
apparentTemperatureMaxTime: 1562533200
},
{
time: 1562569200,
summary: "Mostly cloudy throughout the day.",
icon: "partly-cloudy-day",
sunriseTime: 1562590578,
sunsetTime: 1562643334,
moonPhase: 0.24,
precipIntensity: 0.0003,
precipIntensityMax: 0.0007,
precipIntensityMaxTime: 1562652000,
precipProbability: 0.08,
precipType: "rain",
temperatureHigh: 59.28,
temperatureHighTime: 1562626800,
temperatureLow: 55.6,
temperatureLowTime: 1562673600,
apparentTemperatureHigh: 59.28,
apparentTemperatureHighTime: 1562626800,
apparentTemperatureLow: 55.6,
apparentTemperatureLowTime: 1562673600,
dewPoint: 53.32,
humidity: 0.87,
pressure: 1013.38,
windSpeed: 10.53,
windGust: 19.38,
windGustTime: 1562569200,
windBearing: 244,
cloudCover: 0.7,
uvIndex: 7,
uvIndexTime: 1562619600,
visibility: 10,
ozone: 322.7,
temperatureMin: 55.85,
temperatureMinTime: 1562590800,
temperatureMax: 59.28,
temperatureMaxTime: 1562626800,
apparentTemperatureMin: 55.85,
apparentTemperatureMinTime: 1562590800,
apparentTemperatureMax: 59.28,
apparentTemperatureMaxTime: 1562626800
},
{
time: 1562655600,
summary: "Mostly cloudy throughout the day.",
icon: "partly-cloudy-day",
sunriseTime: 1562677015,
sunsetTime: 1562729715,
moonPhase: 0.28,
precipIntensity: 0.0002,
precipIntensityMax: 0.0006,
precipIntensityMaxTime: 1562655600,
precipProbability: 0.09,
precipType: "rain",
temperatureHigh: 62.25,
temperatureHighTime: 1562713200,
temperatureLow: 58.11,
temperatureLowTime: 1562731200,
apparentTemperatureHigh: 62.25,
apparentTemperatureHighTime: 1562713200,
apparentTemperatureLow: 58.11,
apparentTemperatureLowTime: 1562731200,
dewPoint: 54.76,
humidity: 0.88,
pressure: 1015.27,
windSpeed: 9.01,
windGust: 17.43,
windGustTime: 1562716800,
windBearing: 248,
cloudCover: 0.77,
uvIndex: 5,
uvIndexTime: 1562698800,
visibility: 9.905,
ozone: 310,
temperatureMin: 55.6,
temperatureMinTime: 1562673600,
temperatureMax: 62.25,
temperatureMaxTime: 1562713200,
apparentTemperatureMin: 55.6,
apparentTemperatureMinTime: 1562673600,
apparentTemperatureMax: 62.25,
apparentTemperatureMaxTime: 1562713200
},
{
time: 1562742000,
summary: "Mostly cloudy throughout the day.",
icon: "cloudy",
sunriseTime: 1562763452,
sunsetTime: 1562816094,
moonPhase: 0.31,
precipIntensity: 0.0002,
precipIntensityMax: 0.0004,
precipIntensityMaxTime: 1562749200,
precipProbability: 0.08,
precipType: "rain",
temperatureHigh: 65.65,
temperatureHighTime: 1562799600,
temperatureLow: 57.42,
temperatureLowTime: 1562846400,
apparentTemperatureHigh: 65.65,
apparentTemperatureHighTime: 1562799600,
apparentTemperatureLow: 57.42,
apparentTemperatureLowTime: 1562846400,
dewPoint: 55.9,
humidity: 0.83,
pressure: 1016.04,
windSpeed: 8.76,
windGust: 20.77,
windGustTime: 1562806800,
windBearing: 256,
cloudCover: 0.68,
uvIndex: 4,
uvIndexTime: 1562788800,
visibility: 10,
ozone: 314.1,
temperatureMin: 58.35,
temperatureMinTime: 1562756400,
temperatureMax: 65.65,
temperatureMaxTime: 1562799600,
apparentTemperatureMin: 58.35,
apparentTemperatureMinTime: 1562756400,
apparentTemperatureMax: 65.65,
apparentTemperatureMaxTime: 1562799600
},
{
time: 1562828400,
summary: "Partly cloudy throughout the day.",
icon: "partly-cloudy-day",
sunriseTime: 1562849890,
sunsetTime: 1562902472,
moonPhase: 0.35,
precipIntensity: 0.0002,
precipIntensityMax: 0.0005,
precipIntensityMaxTime: 1562846400,
precipProbability: 0.05,
precipType: "rain",
temperatureHigh: 63.98,
temperatureHighTime: 1562886000,
temperatureLow: 56.59,
temperatureLowTime: 1562929200,
apparentTemperatureHigh: 63.98,
apparentTemperatureHighTime: 1562886000,
apparentTemperatureLow: 56.59,
apparentTemperatureLowTime: 1562929200,
dewPoint: 54.58,
humidity: 0.82,
pressure: 1016.05,
windSpeed: 9.17,
windGust: 22.34,
windGustTime: 1562889600,
windBearing: 253,
cloudCover: 0.27,
uvIndex: 8,
uvIndexTime: 1562878800,
visibility: 10,
ozone: 309.5,
temperatureMin: 57.42,
temperatureMinTime: 1562846400,
temperatureMax: 63.98,
temperatureMaxTime: 1562886000,
apparentTemperatureMin: 57.42,
apparentTemperatureMinTime: 1562846400,
apparentTemperatureMax: 63.98,
apparentTemperatureMaxTime: 1562886000
}
]
          }
          
        },

        locationDisplay: "Somewhere over the rainbow",

        icons: {
          fog: true,
          clearDay: true,
          clearNight: true,
          partlyCloudyDay: true,
          partlyCloudyNight: true,
          cloudy: true,
          rain: true,
          sleet: true,
          snow: true,
          wind: true
        },

        units: "ca",

        current: {
          lat: null,
          lng: null
        },

        bgColor: "background-color: #00FFFF",
        weatherDisplay: "Nothing",
        dateDisplay: "Day",
        displayIcon: "",
        model: 'tab-1',

        swiperOption: {
          slidesPerView: 3,
          spaceBetween: 30,
          freeMode: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        }
      }
    },
    created(){
      var main = this;

      console.log(main.icons);

      this.resetIcons();

      this.forecast.currently.temperature = 26;
      this.forecast.currently.icon = true;

      this.buildUi();
      
      /*
      axios.get("http://api.ipstack.com/check?access_key=010dda01faa8aaf7c12b0cd5b6e76e07").then(response => {
          console.log(response);

          //For debbug response.data = null;

          if(response.data != null){
            if(response.data.latitude  != null && response.data.longitude != null){
              
                main.current.lat = parseInt(response.data.latitude);
                main.current.lng = parseInt(response.data.longitude);

                main.locationDisplay = response.data.city+", "+response.data.country_name;

                main.searchWeather(main.current.lat,main.current.lng);

            }else{
                main.askLocation();
            }
          }else{
              main.askLocation();
          }
          
      });

      window.addEventListener('cityChanged', function (e) {
        console.log(e)
        main.locationDisplay = e.detail.locationDisplay;

        main.searchWeather(e.detail.lat,e.detail.lng);

      }, false);*/
      
    },
    mounted(){
    },
    methods: {
      resetIcons(){
        var main = this;
        this.forecast.currently.icon = false;    
        for(var i in main.icons){
          console.log(i)
          main.icons[i] = false;
        }
      },
      toggleDegrees(){
        var main = this;

        if(main.units == "ca"){
          main.units = "us";
        }else{
          main.units = "ca";
        }

        main.searchWeather(main.current.lat,main.current.lng);
      },
      askLocation(){
        
        var main = this;

        this.$getLocation({
            enableHighAccuracy: true, //defaults to false
        }).then(coordinates => {
          console.log(coordinates);

          main.current.lat = parseInt(coordinates.lat);
          main.current.lng = parseInt(coordinates.lng);

          main.searchWeather(main.current.lat,main.current.lng);

          axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+parseInt(coordinates.lat)+","+parseInt(coordinates.lng)+"&key=AIzaSyAJ9Q8zMPPzXsf0dcif4DkdtA2Tful3U9U").then(response => {
            console.log(response)

            main.locationDisplay = response.data.results[0].formatted_address;
          });
        });
      },
      searchWeather(lat,long){
        var main = this;
        main.resetIcons();
        var urlWeather = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/"+weatherApi+"/"+lat+","+long+"?units="+main.units;
            console.log(urlWeather)

        this.current.lat = lat;
        this.current.lng = long;

        axios.get(urlWeather).then(response => {
          console.log(response);
          
          main.forecast = response.data;

          main.buildUi();
        })
      },
      returnIcon(name){
        let icons = [];
            icons["clear-day"] = `<i class="wi wi-day-sunny"></i>`;
            icons["clear-night"] = `<i class="wi wi-night-clear"></i>`;
            icons["rain"] = `<i class="wi wi-rain"></i>`;
            icons["snow"] = `<i class="wi wi-snow"></i>`;
            icons["sleet"] = `<i class="wi wi-sleet"></i>`;
            icons["wind"] = `<i class="wi wi-windy"></i>`;
            icons["fog"] = `<i class="wi wi-fog"></i>`;
            icons["cloudy"] = `<i class="wi wi-cloudy"></i>`;
            icons["partly-cloudy-day"] = `<i class="wi wi-day-cloudy"></i>`;
            icons["partly-cloudy-night"] = `<i class="wi wi-night-alt-cloudy"></i>`;
        
        return icons[name];
      },
      setDate(UNIXtime){
        var dater = new Dater("en");
        return dater.objectBuild(new Date(UNIXtime * 1000));
      },
      getTime(UNIXtime){
        var dater = new Dater("en"),
            thisTime = dater.objectBuild(new Date(UNIXtime * 1000));
        return thisTime.hour12+" "+thisTime.meridiem;
      },
      getAdv(UNIXtime){
        var dater = new Dater("en");
            
        return dater.getDateAdv(UNIXtime,true);
      },
      dateDefaultFormater(UNIXtime){
        var dater = new Dater("en"),
            thisTime = dater.objectBuild(new Date(UNIXtime * 1000));
        return thisTime.dayName+", "+thisTime.month+" "+thisTime.day;
      },
      hourlyTime(UNIXtime){
        var main = this;
        var now = new Date();
        var dater = new Dater("en");


        var aux = [];
        /*
        

            aux = main.forecast.hourly.data.shift();*/

        for(var i = 0; i <= now.getHours()-2; i++){
          main.forecast.hourly.data.shift();
        }

        for(var i = 0; i <= 24; i++){
          aux.push(main.forecast.hourly.data[i]);
        }

        main.forecast.hourly.data = aux;

        this.$forceUpdate();  
      },
      buildUi(){
        var debbugIcon = "wind";

        var main = this;

        var dater = new Dater("en");

        /* Debbug vars */ 
        main.forecast.currently.time = 1562227387;
        main.forecast.currently.summary = "Clear";

        /* Debbug vars close */
        main.weatherDisplay = main.forecast.currently.summary;

        this.hourlyTime();

        var thisTime = main.setDate(main.forecast.currently.time);
        console.log(dater);
        console.log(thisTime);
        
        var night = null;
        thisTime.hour12 = 7;

        if(thisTime.hour12 >= 6 && thisTime.hour12 <= 19){
          night = false;
          main.$root.$data.bgTheme = "day";
        }else{
          night = true;
          main.$root.$data.bgTheme = "night";
        }

        main.dateDisplay = thisTime.dayName+", "+thisTime.month+" "+thisTime.day;

        //switch(main.forecast.currently.icon){
        switch (debbugIcon){
          
          case "fog":

            if(night){
              main.displayIcon = `<i class="wi wi-night-fog"></i>`;
            }else{
              main.displayIcon = `<i class="wi wi-day-fog"></i>`;
            }
          break;

          case "clear-day":
              main.displayIcon =  `<i class="wi wi-day-sunny"></i>`;
          break;

          case "clear-night":
            //main.icons.clearNight = true;
            main.displayIcon =  `<i class="wi wi-night-clear"></i>`;
            
          break;
          
          case "partly-cloudy-day":
            //main.icons.partlyCloudyDay = true;

            main.displayIcon =  `<i class="wi wi-day-cloudy"></i>`;
          break;

          case "partly-cloudy-night":
            //main.icons.partlyCloudyNight = true;
            main.displayIcon =  `<i class="wi wi-night-cloudy"></i>`;
          break;

          case "cloudy":

            main.displayIcon =  `<i class="wi wi-cloudy"></i>`;
          break;

          case "rain":

            if(night){
              main.displayIcon =  `<i class="wi wi-night-rain"></i>`;
            }else{
              main.displayIcon =  `<i class="wi wi-day-rain"></i>`;
            }
          break;

          case "sleet":
            if(night){
              main.displayIcon =  `<i class="wi wi-night-sleet"></i>`;
            }else{
              main.displayIcon =  `<i class="wi wi-day-sleet"></i>`;
            }
          break;

          case "snow":
            if(night){
              main.displayIcon =  `<i class="wi wi-night-snow"></i>`;
            }else{
              main.displayIcon =  `<i class="wi wi-day-snow"></i>`;
            }
          break;

          case "wind":
            if(night){
              main.displayIcon =  `<i class="wi wi-night-windy"></i>`;
            }else{
              main.displayIcon =  `<i class="wi wi-day-windy"></i>`;
            }
          break;

          default:
            console.log("No icon");  
          break;
        }

        main.forecast.currently.icon = true;

        this.$forceUpdate();
        this.$root.$forceUpdate();
      }
    }
  }
</script>

<style>

  @import "~@/assets/css/weather-icons.min.css";

  .inlined h1, .inlined button{
    display: inline-block;
  }

  .grades{
    font-size: 5em;
    font-weight: bold;
    vertical-align:top;
  }

  .stick-top{
    vertical-align: top;
  }

  .grades-button{
    color: white!important;
    font-size: 3em;
    text-shadow: 1px 1px 2px #2F4F4F;
  }

  .main-icon{
    width: 50%;
    height: auto;
  }

  .my-tabs a{
    color: white;
  }

  .swiper-slide {
    padding: 1%;
    width: 100%;
    margin-right: 0px!important;
    transition: 1ms;
  }

  .swiper-slide:hover{
    border-radius: 3px;
    box-shadow: 0 0 10px #888888;
    z-index: 999px;
  }

  .accent{
    background-color: #F5F5F5!important;
  }

  .swiper-slide .v-card{
    width: 100%;
  }

  .swiper-slide:nth-child(2n) {
      width: 40%;
  }
  .swiper-slide:nth-child(3n) {
      width: 20%;
  }

  .icon-container{
    padding-top: 10%;
  }

  .icon-container i{
    font-size: 11em;
  }

  .high-low{
    font-size: 1.8em;
  }

 .hourly-item{
   font-size: 1.2em;
 }

 .time-hourly{
   font-weight: bold;
 }

  .hourly-item i.wi{
    font-size: 2.5em;
  }

  .hourly-humidity{
    font-size: 0.8em;
  }

  .hourly-humidity i{
    font-size: 2em!important;
  }

  .week-icon{
    font-size: 2em;
  }

  .low-highBar{
    width: 100%;
    height: 5px;
    border-radius: 5px;
    background: rgb(131,58,180);
    background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(254,17,17,1) 50%, rgba(252,176,69,1) 100%);
  }
  
  @media (max-width: 436px){
    .high-low, .high-low i{
      font-size: 1.3em;
    }

    .swiper-slide {
      margin-right: 20px!important;
    }
  }
</style>