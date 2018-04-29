var restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
      // let map = document.getElementById("map-container");
      // map.style.display = "block";
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    let error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }

      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const picture = document.getElementById('restaurant-img');

  const source360 = document.createElement('source');
  source360.setAttribute('media', '(max-width:360px)');
  source360.setAttribute('data-srcset', DBHelper.imageUrlForRestaurant(restaurant).replace('.jpg.webp', '_300.jpg.webp'));
  picture.appendChild(source360);

  const source460 = document.createElement('source');
  source460.setAttribute('media', '(max-width:460px)');
  source460.setAttribute('data-srcset', DBHelper.imageUrlForRestaurant(restaurant).replace('.jpg.webp', '_400.jpg.webp'));
  picture.appendChild(source460);

  const source300 = document.createElement('source');
  source300.setAttribute('media', '(max-width:300px)');
  source300.setAttribute('data-srcset', DBHelper.imageUrlForRestaurant(restaurant).replace('.jpg.webp', '_300.jpg.webp'));
  picture.appendChild(source300);

  const source400 = document.createElement('source');
  source400.setAttribute('media', '(max-width:400px)');
  source400.setAttribute('data-srcset', DBHelper.imageUrlForRestaurant(restaurant).replace('.jpg.webp', '_400.jpg.webp'));
  picture.appendChild(source400);

  const source600 = document.createElement('source');
  source600.setAttribute('media', '(max-width:600px)');
  source600.setAttribute('data-srcset', DBHelper.imageUrlForRestaurant(restaurant).replace('.jpg.webp', '_600.jpg.webp'));
  picture.appendChild(source600);

  const source800 = document.createElement('source');
  source800.setAttribute('media', '(min-width:601px)');
  source800.setAttribute('data-srcset', DBHelper.imageUrlForRestaurant(restaurant));
  picture.appendChild(source800);

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.setAttribute('data-src', DBHelper.imageUrlForRestaurant(restaurant));
  image.alt = 'Restaurant '.concat(restaurant.name);
  picture.appendChild(image);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  let tabindex = 9;
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review, tabindex));
    tabindex++;
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review, tabindex) => {
  const li = document.createElement('li');
  li.setAttribute('tabindex', tabindex);
  const topDiv = document.createElement('div');
  topDiv.id = 'review-header';
  const name = document.createElement('p');
  name.className = 'review-name';
  name.innerHTML = review.name;
  topDiv.appendChild(name);
  const date = document.createElement('p');
  date.className = 'review-date';
  date.innerHTML = review.date;
  topDiv.appendChild(date);
  li.appendChild(topDiv);


  const ratingDiv = document.createElement('div');
  ratingDiv.className = 'review-rating-div';

  const rating = document.createElement('p');
  rating.className = 'review-rating';
  rating.innerHTML = `Rating: ${review.rating}`;
  ratingDiv.appendChild(rating);
  li.appendChild(ratingDiv);

  const comments = document.createElement('p');
  comments.className = 'review-comment';
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  const ahref = document.createElement('a');
  ahref.setAttribute('href', '#');
  ahref.setAttribute('aria-current', 'page');
  ahref.className = 'current-page-link';
  ahref.innerHTML = restaurant.name;
  ahref.tabIndex = 3;
  li.appendChild(ahref);
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const loadIntersectionObserver = () => {


  let images = document.querySelectorAll('source, img');
  let map = document.getElementById('map');

  if ('IntersectionObserver' in window) {
    // IntersectionObserver Supported
    let config = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    };

    let observer = new IntersectionObserver(onChange, config);
    images.forEach(img => observer.observe(img));
    observer.observe(map)
    function onChange(changes, observer) {
      changes.forEach(change => {
        if (change.intersectionRatio > 0.5) {
          // Stop watching and load the image
          if (change.target === map) {
            console.log(change.intersectionRatio);
            loadMaps();
          }
          else {
            loadImage(change.target);
          }

          observer.unobserve(change.target);
        }
      });
    }

  } else {
    // IntersectionObserver NOT Supported
    images.forEach(image => loadImage(image));
  }
}
const loadImage = (image) => {
  image.classList.add('fade-in');
  if (image.dataset && image.dataset.src) {
    image.src = image.dataset.src;
  }

  if (image.dataset && image.dataset.srcset) {
    image.srcset = image.dataset.srcset;
  }
}

const loadMaps = () => {

  const scriptTag = document.createElement("script");
  scriptTag.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBFeL_3upfjewT5kik74_YRMizmEuoBFnU&libraries=places&callback=initMap";
  document.getElementsByTagName("head")[0].appendChild(scriptTag);
}


document.addEventListener('DOMContentLoaded', (event) => {
  let media = window.matchMedia("(max-width: 744px)");
  if (media.matches) {
    console.log('matched');
    injectMapsToDom(true);
  } else {
    console.log('not matched');
    injectMapsToDom(false);
  }
  media.addListener(matchMedia);

  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      // let map = document.getElementById("map-container");
      // map.style.display = "none";
      fillRestaurantHTML();
      loadIntersectionObserver();
      fillBreadcrumb();
    }
  });
});

const matchMedia = (elem) => {
  if (elem.matches) {
    console.log('matched');
    injectMapsToDom(true);
  }
  else {
    console.log('not matched');
    injectMapsToDom(false);
  }

}

const injectMapsToDom = (placeInTheBottom) => {

  let main = document.getElementById("maincontent");
  let topContainer = document.getElementById("top-container");
  let mapContainer = document.getElementById("map-container");
  if (placeInTheBottom) {
    topContainer.removeChild(mapContainer);
    main.appendChild(mapContainer);
  }
  else {
    if (mapContainer.parentNode === main) {
      main.removeChild(mapContainer);
      topContainer.appendChild(mapContainer);
    }
  }
}