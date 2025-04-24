function adminInitMap() {

    setTimeout(() => {
        const mapElement = document.getElementById('golf-map');
        if (!mapElement) {
            return;
        }

        if (mapElement) {
            const zoom = parseInt(mapElement.dataset.zoom) || 11;
            let places = [];
            
            try {
                places = JSON.parse(mapElement.dataset.places || '[]');
            } catch (error) {
                console.error('Error parsing places data:', error);
            }

            const map = new google.maps.Map(mapElement, {
                zoom: zoom,
                center: places[0] ? { lat: parseFloat(places[0].lat), lng: parseFloat(places[0].lng) } : { lat: 0, lng: 0 }
            });
            

            places.map(place => {
                return new google.maps.Marker({
                    position: { lat: parseFloat(place.lat), lng: parseFloat(place.lng) },
                    map: map,
                    title: place.title
                });
            });
        }
    }, 3000);
}
