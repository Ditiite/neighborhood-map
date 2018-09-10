# Neighborhood-map-udacity (React.js)
This project is part of *Goole Udacity Front-End Web Developer Nanodegree Program*. 
The main goal is to use any map providing API plus one more third-party API. 
Should display by our choice our best neighborhood and best destinations. For this project have chouse to display beautiful castles in Latvia.

## How to run in development mode
* fork the project
* run ```npm install```      
### Build production version
* npm run build

### Running production server
- python -m http.server --directory build
or 
- serve build


## Service worker
Service worker provides caching for local contents as 
well as dynamically added content such as google maps, 3rd party font,css etc.

Service worker is disabled for development. In production mode it is enabled.
For more information about this service worker
[visit this site](https://goo.gl/SC7cgQ)

#### (ToDoo: add following lines after passing the submition and replace my key with placeholder API_KEY:
* Please provide your own Google Map API.
    * You can do it by following this link [Google Map API key](https://developers.google.com/maps/documentation/javascript/get-api-key)
    * To get open weather API please follow this link [OpenWeatherMap](https://openweathermap.org/api)
    * Once you got your keys please place them in places markerd as API)
* To run aplication in localhost, in command line type: ``` npm start```
* open **localhost:3000**

<!--
NEED TO UPDATE LINK
 **Live version can see** [here](https://ditiite.github.io/neighborhood-map-udacity-by-dita/) -->

## Build with:
- create-react-app
- google-maps-react library
- **used API's**
    - Google Maps API
    - Open Weather Map API
- Map style from : [Snazzy Maps](https://snazzymaps.com/)

## Udacity style guide
* [Udacity CSS Style Guide](http://udacity.github.io/frontend-nanodegree-styleguide/css.html)
* [Udacity JavaScript Style Guide](http://udacity.github.io/frontend-nanodegree-styleguide/javascript.html)
* [Udacity Git Commit Message Style Guide](https://udacity.github.io/git-styleguide/)

### Known issues
The map is not rendered due to changes in API(not for free anymore).

### Author
*Dita Rahmane*
