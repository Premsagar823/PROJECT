mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: "map", // container ID
        style: "mapbox://styles/mapbox/streets-v12",  //style url
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 9, // starting zoom
    });
     
    const marker = new mapboxgl.Marker({color: "black"})
        .setLngLat(listing.geometry.coordinates)            //Listing.geometry.coordinates
        .setPopup(
            new mapboxgl.Popup({offset: 25}).setHTML(
            `<h4>${listing.title}</h4> <p>Exact locatrion will be provided after booking!</p>`
            )
        )   
        .addTo(map);

