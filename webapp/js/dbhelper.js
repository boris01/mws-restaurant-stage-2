//import {idb} from './idb.js'
//var idb = require('idb');
const indexDBVersion = 1;
const indexDBStoreName = 'restaurant-idb';
const indexDBStoreObjects = 'restaurants';
/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;

  }
  
  static async openIndexDB() {
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
      return;
    }

    let db = await idb.open(indexDBStoreName, indexDBVersion, (upgradeDb) => {
      let store = upgradeDb.createObjectStore(indexDBStoreObjects, {
        keyPath: 'id'
      });
      store.createIndex('by-id', 'id');

    });

    return db;
  }

  static async insertUpdateIndexDB(restaurants) {
    if (!restaurants) return;

    let db = await this.openIndexDB();
    if (!db) return;

    let tx = db.transaction(indexDBStoreObjects, 'readwrite');
    let store = tx.objectStore(indexDBStoreObjects);

    restaurants.forEach(async element => {
      let record = await store.get(element.id);
      await store.put(element);
    });

    db.close();

    return await this.getCacheFromIndexDB();
  }

  static async getCahedFromIndexDBByID() {
    let db = await this.openIndexDB();
    if (!db) return;

    let tx = db.transaction(indexDBStoreObjects, 'readwrite');
    let store = tx.objectStore(indexDBStoreObjects);
    let restaurant = await store.get(element.id);
    console.log(restaurant);
    db.close();
    return restaurant;
  }

  static async getCacheFromIndexDB() {
    let db = await this.openIndexDB();
    if (!db) return;

    let tx = db.transaction(indexDBStoreObjects, 'readwrite');
    let store = tx.objectStore(indexDBStoreObjects);
    let restaurantsIndex = store.index('by-id');

    let restaurants = await restaurantsIndex.getAll();
    console.log(restaurants);
    db.close();
    return restaurants;

  }


  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {


    fetch(DBHelper.DATABASE_URL, {
      method: 'GET'
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        return this.getCacheFromIndexDB();
      }
      //throw new Error(`Network response returned error. Status ${response.status}`);
    }).then(response => {
      this.insertUpdateIndexDB(response).then(res => {
        const restaurants = response;
        callback(null, restaurants);
      });
    }).catch(e => {
      this.getCacheFromIndexDB().then(response => {
        const restaurants = response;
        callback(null, restaurants);
      }).catch(e => {
        console.log(`fetchRestaurants:: error ${e.message}`);
      });
    });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg.webp`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    }
    );
    return marker;
  }

}
