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
                  <span slot="activator"><i class="wi wi-direction-up"></i> {{ forecast.daily.data[0].temperatureHigh }} <span class="stick-top">°</span> </span>
                  <span>Highest temperature</span>
                </v-tooltip>
                <br>
                <v-tooltip bottom>
                  <span slot="activator"><i class="wi wi-direction-down"></i> {{ forecast.daily.data[0].temperatureLow }} <span class="stick-top">°</span> </span>
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
              <p  style="padding-top: 20px;"><span>{{ forecast.currently.summary }}</span></p>
              <br>
            </v-flex>

            <v-layout row class="text-xs-center">
              <v-flex xs4>
                <v-tooltip top >
                  <span slot="activator">{{ (forecast.daily.data[0].precipProbability*100).toFixed(2) }} <i class="wi wi-humidity"></i> </span>
                  <span>Precipitation probability</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs4>
                <v-tooltip top >
                  <span slot="activator">{{ forecast.daily.data[0].precipIntensity }} <i class="wi wi-raindrop"></i> </span>
                  <span>Precipitation intensity</span>
                </v-tooltip>
              </v-flex>

              <v-flex xs4>
                <v-tooltip top >
                  <span slot="activator">{{ forecast.daily.data[0].windSpeed }} km/h <i class="wi wi-strong-wind"></i> </span>
                  <span>Wind speed</span>
                </v-tooltip>
              </v-flex>
            </v-layout>

            <v-flex xs12 class="text-xs-center">
              <br>
              <h3>{{ locationDisplay }}</h3>
              <p>{{ dateDisplay }}</p>
              
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex>
              <swiper style="padding: 2%;" :options="swiperOption">
                <swiper-slide v-for="(item,i) in forecast.hourly.data" :key=i>
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
                    
                    <v-flex xs3 class="text-xs-right" style="padding:1%">
                      <v-tooltip bottom>
                        <span slot="activator"><i class="wi wi-direction-down"></i> {{ item.temperatureLow }} <span class="stick-top">°</span> </span>
                        <span>Lowest temperature</span>
                      </v-tooltip>
                    </v-flex>

                    <v-flex xs6 style="display:flex;justify-content:center;align-items:center;">
                      <div class="low-highBar"></div>
                    </v-flex>
                    
                    <v-flex xs3 style="padding:1%">
                      <v-tooltip bottom>
                        <span slot="activator"><i class="wi wi-direction-up"></i> {{ item.temperatureHigh }} <span class="stick-top">°</span> </span>
                        <span>Highest temperature</span>
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
            data: [] 
          },
          daily: {
            data: []
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
          slidesPerView: 2,
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

      this.resetIcons();

      this.buildUi();
      
      try{
        axios.get("https://api.ipgeolocation.io/ipgeo?apiKey=6049229ab6a347fd96910f08608e1141").then(response => {
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
      }catch(e){
        main.askLocation();
      }
      

      window.addEventListener('cityChanged', function (e) {
        console.log(e)
        main.locationDisplay = e.detail.locationDisplay;

        main.searchWeather(e.detail.lat,e.detail.lng);

      }, false);
      
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

        var main = this;

        var dater = new Dater("en");

        main.weatherDisplay = main.forecast.currently.summary;

        this.hourlyTime();

        var thisTime = main.setDate(main.forecast.currently.time);
        console.log(dater);
        console.log(thisTime);
        
        var night = null;

        if(thisTime.hour >= 6 && thisTime.hour <= 19){
          night = false;
          main.$root.$data.bgTheme = "day";
        }else{
          night = true;
          main.$root.$data.bgTheme = "night";
        }

        main.dateDisplay = thisTime.dayName+", "+thisTime.month+" "+thisTime.day;

        switch(main.forecast.currently.icon){  
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
              main.displayIcon =  `<i class="wi wi-windy"></i>`;
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

    .grades{
      font-size: 2.8em;
    }

    .grades-button{
      font-size: 1.7em;
    }
  }
</style>