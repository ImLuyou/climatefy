<template>
  <v-app>

      <v-navigation-drawer
        v-model="drawer"
        fixed
        temporary
      >

        <v-list class="pt-0" dense>
          <v-divider></v-divider>

          <v-list-tile
            v-for="item in items"
            :key="item.title"
          
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
           
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile>
           
            <v-list-tile-content>
              <v-list-tile-sub-title class="text-xs-center">Support Adrian Legaspi to continue updates</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
           
            <v-list-tile-content>
              <v-list-tile-sub-title class="text-xs-center"><a href="https://darksky.net/">Powered by Dark Sky</a></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

    <v-toolbar app>
        <v-btn
          flat icon
          @click.stop="drawer = !drawer"
        >
          <i class="material-icons">
          menu
          </i>
        </v-btn>

        <v-text-field
          @change="triggerSearch($event)"
          id="autoCity"
          preppend-icon="search"
          placeholder="Search city"
          style="width: 100%;"
        ></v-text-field>
    </v-toolbar>

    <v-content :class="'home '+$root.bgTheme">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

import axios from 'axios';

export default {
  name: 'App',
  components: {
  },
  data () {
      return {
        drawer: null,
        items: [],

        descriptionLimit: 60,
        entries: [],
        isLoading: false,
        citySearch: null,
        timer: null,
      }
  },
  mounted(){
    this.triggerSearch();
  },
  methods: {
    triggerSearch(text){
      var main = this;
      main.searchCity(text);
    },
    searchCity(text){
      console.log(text)
      var main = this;
      this.isLoading = true;
      this.search = null;

      var input = document.getElementById("autoCity");
      var autocomplete = new google.maps.places.Autocomplete(input);

      google.maps.event.addListener(autocomplete, 'place_changed', function () {
              var place = autocomplete.getPlace();

              console.log(place);
              let event = new CustomEvent("cityChanged",{"detail":{lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), locationDisplay: place.formatted_address }})
              window.dispatchEvent(event);
              //alert("This function is working!");
              //alert(place.name);
            // alert(place.address_components[0].long_name);

      });

    },

  }
}
</script>

<style>
  .home{
    transition: 1ms;
    text-shadow: 1px 1px 2px #222222;
  }
  
  .v-expansion-panel__container{
    background-color: transparent!important;
  }

  .v-expansion-panel__header__icon{
    display: none;
  }

  .v-expansion-panel__body{
    text-shadow: none;
  }

  .v-window__container{

  }

  div.accent{
    background: #F5F5F5!important;
  }

  /*weather themes */
  .day{
    background-color: #51A4DB;
    color: #FBFCFE!important;
  }

  .day .v-expansion-panel__container{
    color: #FBFCFE!important;
  }

  
  .night{
    background-color: #0A1B47;
    color: #FBFCFE!important;
  }

  .night .v-expansion-panel__container{
    color: #FBFCFE!important;
  }

  .night .v-card.v-sheet{
    background-color: #200F3C!important;
    color: #FBFCFE!important;
  }
</style>

