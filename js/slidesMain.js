var mapOpts = {
  center: [4.694770, -74.158483],
  zoom: 13
};
var map = L.map('map', mapOpts);

var tileOpts = {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 5,
  maxZoom: 20,
  ext: 'png'
};
// Try some differnet basemaps:
// basemapURL = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
basemapURL = "http://basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png";

var Stamen_TonerLite = L.tileLayer(basemapURL, tileOpts).addTo(map);



var slides = [
  {title: "Bogata Airport Neighborhood",
    text: "El Dorado International Airport in Bogotá, Colombia is the busiest airport in Colombia and one of the busiest in Latin America, serving as the main international and domestic air gateway in the country. It is located adjacent to the densely-populated neighbourhood of Fontibón in the northwest of Bogotá. The airport has a long history of inadequate noise mitigation with noise levels frequently exceding national limits. It has become many people's concern that the negative impacts of the airport would harm not only the local residents, but also the diverse species live around this area. Here we should also note that Bogota is inside the Tropical Andes Biodiversity Hotspot, the most diverse hotspot region globally. In order to delve into this topic, the following slides will map out the rich natural settings in this neighborhood.",
    all: false, both: false, type: "Polygon", category:"airport"},
  {title: "All Natural Assets",
    text: "Here the green bubbles mark out most of the natural assets in proximity of the airport. You can click on them to see what kind of nature elements they are...",
    all: true, both: false, type: "Point", category:""},
  {title: "Wetlands",
    text: "Wetland ecosystems hold an important part of local biodiversity. A significant number of birds and mammals depend on freshwater wetlands for breeding or feeding. Wetlands are some of the planet’s most productive ecosystems. They provide spawning grounds for fish and ideal conditions for other species groups such as dragonflies and amphibians.This page maps out all the wetlands in this area. You can click on the markers too see their names.",
  all: false, both: false, type: "Point", category:"wetland"},
  {title: "Urban Parks",
    text: "Urban parks, on the other hand, is more artificial and less wild than wetlands. As a type of urbanized landscape, they are still important for biodiversity conservation. Here the boundaries of parks are highlighted and as always, by click on them you may say more details...",
  all: false, both: false, type: "Polygon", category:"park"},
  {title: "The Central Park",
    text: "The Simón Bolívar Metropolitan Park, best known as the Simón Bolívar Park, is a greenspace and entertainment and sports complex located in the middle of the city of Bogotá, Colombia. it has an area of about 279 acres (1.13 km2). A lake with an area of over 27 acres (110,000 m2). It features over 11 miles (18 km) of pedestrian pathways and an acoustic shell-shaped area for concerts. Major concerts and festivals mainly take place in this area. Now let's zoom in to take a look",
  all: false, both: true, type: "Point", category:"park"},
];

var currentSlide = 0;

var addTitle = (title) => {
  $('.sidebar').append(`<h2 id='title'>${title}</h2>`);
};

var addText = (text) => {
  $('.sidebar').append(`<p id='text'>${text}</p>`);
};

// var setColor = (color) => {
//   $('#map').css('background-color', color);
// };

var newLayer;


function addPopUp1(feature, layer) {
  var popupContent = "HI THERE! MY NAME IS " + feature.properties.NAME +
              ". I AM A "+ feature.properties.USE;
  layer.bindPopup(popupContent);
}

function addPopUp2(feature, layer) {
  var popupContent = feature.properties.USE;
  layer.bindPopup(popupContent).openPopup();
}

var addData1 = (category, type) => {
  newLayer = L.geoJSON(naturalAssets, {
      filter: function(feature) {
          return feature.properties.USE == category && feature.geometry.type == type;
        },
      style: function(feature) {
          switch (feature.properties.USE) {
            case 'airport': return {color: "#909090"};
            case 'park': return {color: "#339966"};}
          },
      onEachFeature: addPopUp1
      }).addTo(map);
    };

var cmOptions = {
    radius: 9,
    fillColor: "#446600",
    color: "#000000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
  };

var addData2 = (type) => {
  newLayer = L.geoJSON(naturalAssets, {
    filter: function(feature) {
      return feature.geometry.type == type;
      },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng,cmOptions);
    },
    onEachFeature: addPopUp2
    }).addTo(map);
  };

// var addData3 = (category) => {
//     newLayer = L.geoJSON(naturalAssets, {
//         filter: function(feature) {
//             return feature.properties.USE == category;
//           },
//         style: function(feature) {
//             switch (feature.properties.USE) {
//               case 'airport': return {color: "#909090"};
//               case 'park': return {color: "#339966"};}
//             },
//         onEachFeature: addPopUp1
//         }).addTo(map);
//       };

var addData3 = (category) => {
    newLayer = L.geoJSON(naturalAssets, {
        filter: function(feature) {
            return feature.properties.USE == category;
          },
        style: function(feature) {
            switch (feature.properties.USE) {
              case 'airport': return {color: "#909090"};
              case 'park': return {color: "#339966"};}
            },
        pointToLayer: function(feature, latlng) {
          var smallIcon = new L.Icon({
              iconSize: [61, 61],
              iconAnchor: [13, 27],
              popupAnchor:  [1, -24],
              iconUrl: 'images/park.png'
                    });
                    return L.marker(latlng, {icon: smallIcon});
                },
        onEachFeature: addPopUp1
        }).addTo(map);
      };

var cleanup1 = () => {
  $('#title').remove();
  $('#text').remove();
};

var cleanup2 = () => {
    map.removeLayer(newLayer);
};


var buildSlide = (slideObject) => {
  // cleanup();
  addTitle(slideObject.title);
  addText(slideObject.text);
  if (slideObject.all == true) {
    addData2(slideObject.type);
  } else if (slideObject.both == true) {
    addData3(slideObject.category);
  } else {
    addData1(slideObject.category, slideObject.type);
  }
};


buildSlide(slides[currentSlide]);
$("#previous").hide();

$("#next").click(() => {
  currentSlide = currentSlide + 1;
  cleanup1();
  if (currentSlide !== 1) {
    cleanup2();
  }
  if (currentSlide == 4) {
    map.setView({lat:4.657142, lng:-74.093628}, 16);
    $("#next").hide();
  } else {
    $("#previous").show();
    $("#next").show();
  }
  buildSlide(slides[currentSlide]);
});

$("#previous").click(() => {
  currentSlide = currentSlide - 1;
  cleanup1();
  cleanup2();
  if (currentSlide !== 4) {
    map.setView({lat:4.694770, lng:-74.158483}, 13);
    $("#next").show();
  } else {
    $("#next").hide();
    $("#previous").show();}
  if (currentSlide == 0) {
    $("#previous").hide();
  } else {$("#previous").show();}

  buildSlide(slides[currentSlide]);
});
