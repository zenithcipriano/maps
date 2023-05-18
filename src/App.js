import { Alert } from "@chakra-ui/react";
import { LoadScript, GoogleMap, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef, useState, useEffect, useMemo } from "react";

const google = window.google

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ["places"]
  });
  let center = { lat: 14.167927670085424, lng: 121.24353333620257 }
  const inputRef = useRef();
  const [map, setMap] = useState(null)
  const autoCompleteRef = useRef();
  const prevMarkersRef = useRef([]);

  const defaultBounds = {
    north: center.lat + 0.05,
    south: center.lat - 0.05,
    east: center.lng + 0.05,
    west: center.lng - 0.05,
  };

  const options = {
    bounds: defaultBounds,
    componentRestrictions: { country: "ph" },
    fields: ["address_components", "geometry", "icon", "name"],
    strictBounds: false,
  };

  useEffect(() => {
    setTimeout(() => {
      if (true) {
        autoCompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current, options
          );
      }
    }, 100);
  }, []);

  function clearMarkers(markers) {
    for(let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  const reCenter = () => {
    const input = inputRef.current.value
    let request = {
      query: input,
      fields: ["name", "geometry"]
    };

    const service = new window.google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const newCenter = results[0].geometry.location
        center = newCenter
        //clear prev markers 
        clearMarkers(prevMarkersRef.current); 

        //render markers
        const marker = new window.google.maps.Marker({
            map: map, 
            position: newCenter
        });
        prevMarkersRef.current.push(marker)
        map.panTo(newCenter)
        map.setZoom(18)
        inputRef.current.value = results[0].name
      }
    });
  }
  return(
    <div style={{ height: '90vh', width: '100%' }}>
    <input ref={inputRef} id="input" placeholder="Enter your location"/>
    <button onClick={reCenter} >Default</button>
    {!isLoaded ? (
            <h1>Loading...</h1>
        ) : (
    <GoogleMap
    mapContainerStyle={{ width: '100%', height: '100%' }}
    center={ center }
    zoom={18}
    options={{
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    }}
    onLoad={map => setMap(map)}
  />)}
  </div>
  )
}

export default App;