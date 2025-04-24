import { geolocateByAddress } from './map.js'
import { setUserStore } from './user-store.js'
import Scrollbar from 'smooth-scrollbar'
//import { customScrollbar } from './custom-scrollbar.js'

export function searchRoutes(sectionId, formSelector, googleMapInstance) {
  
  if(!formSelector) {
    console.error('No form selector')
    return
  }
  if(!googleMapInstance) {
    console.error('No map instance')
    return
  }
  if(!googleMapInstance.hasOwnProperty('map')) {
    console.error('No map')
    return
  }
  if(!googleMapInstance.markers) {
    console.error('No markers')
    return
  }
  
  const form = document.querySelector(formSelector)

  if(!form) {
    console.error('Search form is missing')
    return
  }

  const input = form.querySelector('input[type="search"][name="address"]')

  if(!input) {
    console.error('Search input is missing')
    return
  }

  const notice = form.querySelector('.notice')
  const section = document.querySelector(sectionId)
  const list = section.querySelector('.places-list')
  const resetButtons = section.querySelectorAll('.reset')
  const Map = googleMapInstance.map
  const Markers = googleMapInstance.markers
  const n =  Markers.length
  let userMarker = null

  bindReset(
    input,
    section,
    resetButtons,
    list,
    googleMapInstance,
  )

  form.addEventListener('mapReset', function(e) {
    resetMarkers(userMarker)
  })

  initScrollBar(sectionId, Markers)
  //customScrollbar('#' + sectionId + ' .places-wrapper');

  const formSubmit = new Event("submit")
  autoComplete(form, input, formSubmit)

  form.addEventListener('submit', (e) => {

    e.preventDefault()

    let requestCounter = 0
    let routes = []

    resetMarkers(userMarker)
    notice.classList.remove(acseoTheme.activeClass)

    const address = validateAddress(input.value.trim())

    if(false === address) {
      return
    }
    
   geolocateByAddress(address, (position) => {

      let userIconUrl = google_map.marker_image
      if(valueExists(google_map.marker_user_image)) {
        userIconUrl = google_map.marker_user_image
      }

      userMarker = new google.maps.Marker({
        position: position,
        Map,
        icon: {
          url: userIconUrl,
          scaledSize: new google.maps.Size(30, 30),
        },
        title:'Votre position',
        placeId:'user',
      })

      const onSuccess = (response, destination) => {

        requestCounter++
        if(1 === requestCounter) {
          routes = []
        }

        let routeToPlace = {
          placeId:destination.placeId, 
          route:null
        }

        if(true === response.hasOwnProperty('routes')) {
          if(response.routes.length) {
            response.routes = sortRoutesByDistance(response.routes)
            routeToPlace = {
              placeId:destination.placeId, 
              route:response.routes[0]
            }
            routes.push(routeToPlace)
          } else {
            routeToPlace = {
              placeId:destination.placeId, 
              route:null
            }
          }
        } else {
          routeToPlace = {
            placeId:destination.placeId, 
            route:null
          }
        }

        updateListElement(list, routeToPlace)

        if(n === requestCounter) {
          
          routes = sortRoutesByDistance(routes)

          const closestPlaceId = routes[0].placeId
          setUserStore(closestPlaceId)

          const closestPlaceIds = routes.map(function(route, index){
            if(index < 4) {
              return route.placeId
            }
          })
          
          const bounds = new google.maps.LatLngBounds()
          bounds.extend({
              lat: userMarker.position.lat(),
              lng: userMarker.position.lng(),
          })

          let nearIconUrl = google_map.marker_image
          if(valueExists(google_map.marker_near_image)) {
            nearIconUrl = google_map.marker_near_image
          }
  
          Markers.forEach((marker) => {
            if(closestPlaceIds.includes(marker.placeId)) {
              bounds.extend({
                lat: marker.position.lat(),
                lng: marker.position.lng(),
              })
              marker.setIcon({
                url: nearIconUrl,
                scaledSize: new google.maps.Size(30, 30),
              })
            }
            
          })

          sortList(sectionId, closestPlaceIds)

          Map.setCenter(bounds.getCenter())
          Map.fitBounds(bounds)

          resetButtons.forEach(resetButton => {
            resetButton.classList.add(acseoTheme.activeClass)
          })
  
        }

      }
      
      if(n > 0) {
        for (let i = 0; i < n; i++) {
          computeRoutes(position, Markers[i], onSuccess, function(error){console.error(error)})
        }
      }

    }, (error) => {
      
      if('ZERO_RESULTS' === error) {
        notice.classList.add(acseoTheme.activeClass)
        notice.textContent = google_map.no_result
      }
      if('PERMISSION_DENIED' === error) {
        console.error(`Permission denied: ${error.message}`)
      }
      if('INVALID_ARGUMENT' === error) {
        console.error(`Invalid argument: ${error.message}`)
      }
    })
  })

}

function autoComplete(form, input, formSubmit) {
  
  const options = {
    fields: ["formatted_address"],
    strictBounds: true,
  }

  const autocomplete = new google.maps.places.Autocomplete(input, options)

  //bl = Saint-Bathélémy
  //nc = Nouméa
  //mu = Île Maurice
  //ma = Maroc
  //ch = Suisse
  //it = Italie
  //de = Allemagne
  //nl = Netherland
  //be = Belgique
  //lu = Luxembourg
  //es = Espagne
  //ad = Andorre
  //mc = Monaco
  autocomplete.setComponentRestrictions({
    country: ['fr','bl','nc','mu','ma','ch','it','de','nl','be','lu','es','ad','mc'],
  })

  autocomplete.addListener('place_changed', () => {

    form.dispatchEvent(formSubmit)
  })

}
         
function sortList(sectionId, closestPlaceIds) {

  const section = document.querySelector(sectionId)
  const list = section.querySelector('.places-list')

    if(list && list.children.length > 0) {

      section.dispatchEvent(new CustomEvent('list_before_update'))
      
      let items = Array.from(list.children)
      let noRouteItems = []

      items.map(function(item) {
        if(false === valueExists(item.dataset.distance)) {
          item.classList.add('collapsed')
          noRouteItems.push(item)
        } else {
          item.classList.remove('collapsed')
        }
      })

      items = items.filter((item) => valueExists(item.dataset.distance))

      items.sort((a, b) => {
          if(a.dataset.distance && b.dataset.distance) {
            return a.dataset.distance - b.dataset.distance
          }
      })
      
      items.forEach((item, index) => {
        
          if(0 === index) {
            item.classList.add(acseoTheme.activeClass)
          } else {
            item.classList.remove(acseoTheme.activeClass)
          }
         
          let placeId = parseInt(item.dataset.id)
          if(closestPlaceIds.includes(placeId)) {
            item.classList.remove('collapsed')
          } else {
            item.classList.add('collapsed')
          }
          
          list.appendChild(item)
        
      })

      noRouteItems.forEach(item => {
        list.appendChild(item)
      })

      section.dispatchEvent(new CustomEvent('list_updated'))
      
    }

}

function initScrollBar(sectionId, markers) {
  const section = document.querySelector(sectionId)
  const list = section.querySelector('.places-list')

  if(!list) {
    return
  }

  let scrollbarInstance = new Scrollbar(list, {
    damping:1,
  })

  section.addEventListener('list_before_update',function(){
    scrollbarInstance.destroy()
  })

  section.addEventListener('list_updated',function(){
    const section = document.querySelector(sectionId)
    const list = section.querySelector('.places-list')
    scrollbarInstance = new Scrollbar(list, {
      damping:1,
    })
    scrollbarInstance.update()
    scrollbarInstance.scrollTo(0,0,300)
  })

  markers.forEach(marker => {
   
    google.maps.event.addListener(marker, 'click', function () {
      
      const item = list.querySelector('.marker[data-id="'+marker.placeId+'"]')
      
      if(!item) {
        console.log('No corresponding list item to update')
      }

      item.classList.remove('collapsed')
      item.classList.add(acseoTheme.activeClass)

      list.querySelectorAll('.marker').forEach(foreignItem => {
        if(item !== foreignItem) { 
          foreignItem.classList.remove(acseoTheme.activeClass)
          foreignItem.classList.remove('collapsed')
        }
      })

      setUserStore(marker.placeId)

      scrollbarInstance.update()
      scrollbarInstance.scrollIntoView(item)

    })

  })

}
  
function computeRoutes(origin, destination, onSuccess, onError) {
  
  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes'

  const routeOrigin = {
      "latitude": parseFloat(origin.lat),
      "longitude": parseFloat(origin.lng),
  }
  
  const routeDestination = {
    "latitude": parseFloat(destination.position.lat()),
    "longitude": parseFloat(destination.position.lng()),
  }

  const data = {
    origin: {
      location: {
        latLng: routeOrigin
      }
    },
    destination: {
      location: {
        latLng: routeDestination
      }
    },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false
    },
    languageCode: "fr-FR",
    units: "METRIC"
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': google_map.api_key,
    'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters'
  })

  fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  })
  .then(data => onSuccess(data, destination))
  .catch(error => onError(error, destination))
}

function sortRoutesByDistance(routes) {
  if(routes) {
    routes.sort((a, b) => {
      return a.route.distanceMeters - b.route.distanceMeters
    })
  }
  return routes
}

function validateAddress(address) {
  if(!address) {
    console.error('No address')
    return false
  }

  if(!RegExp(google_map.text_regex).test(address)) {
    console.error('Invalid address')
    return false
  }

  return address
}

function updateListElement(list, routeToPlace) {

  const listEl = list.querySelector('.marker[data-id="'+routeToPlace.placeId+'"]')
  if(!listEl) {
    console.log('No list element to update')
    return
  }

  const distanceEl = listEl.querySelector('.distance')
  const durationEl = listEl.querySelector('.duration')
  distanceEl.innerText = ''
  durationEl.innerText = ''

  if(!routeToPlace.route) {
    return
  }

  const distance = Math.round(routeToPlace.route.distanceMeters / 1000)
  const duration = routeToPlace.route.duration.slice(0, -1)

  distanceEl.innerText = 'à ' + distance + ' km'
  durationEl.innerText = 'à ' + Math.round(duration / 60) + ' min.'

  listEl.dataset.distance = distance
  listEl.dataset.duration = duration

}

function bindReset(input, section, resetButtons, list, googleMapInstance) {
  
  if(!resetButtons) {
    return
  }

  const items = Array.from(list.children)
  if(!items) return

  resetButtons.forEach(resetButton => {
      
    resetButton.addEventListener('click', (e) => {
        
        e.preventDefault()
        section.dispatchEvent(new CustomEvent("mapReset"))

        items.forEach((item, index) => {

          item.classList.remove(acseoTheme.activeClass)
          item.classList.remove('collapsed')
          item.dataset.distance = ''
          item.dataset.duration = ''
          item.querySelector('.distance').innerText = ''
          item.querySelector('.duration').innerText = ''

          list.appendChild(item)
        
        })
        googleMapInstance.map.setCenter(googleMapInstance.defaultPosition)
        googleMapInstance.map.setZoom(5)

    })
  })

  section.addEventListener("mapReset",function(){
    resetButtons.forEach(resetButton => {
      resetButton.classList.remove(acseoTheme.activeClass)
      input.value = ''
      input.focus()
    })
  })
  
}

function resetMarkers(userMarker) {
  if(null !== userMarker) userMarker.setMap(null)
}