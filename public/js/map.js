const socket = io();
let firstPositionReceived = false;

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude} = position.coords;
        socket.emit("send-location",{latitude, longitude});
    },(error)=>{
        console.error(error);
    },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

const map = L.map('map').setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
}).addTo(map);

const markers = {};

socket.on("receive-location", (data)=>{
    const {latitude, longitude, id} = data;
    
    if (!firstPositionReceived) {
        map.setView([latitude, longitude]);
        firstPositionReceived = true;
    }
    
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});


// const socket = io();
// let map;
// let markers = {};

// function initMap() {
//     map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 16
//     });

//     if (navigator.geolocation) {
//         navigator.geolocation.watchPosition((position) => {
//             const { latitude, longitude } = position.coords;
//             const userLatLng = new google.maps.LatLng(latitude, longitude);

//             if (!map.getCenter()) {
//                 map.setCenter(userLatLng);
//             }

//             socket.emit("send-location", { latitude, longitude });
//         }, (error) => {
//             console.error(error);
//         }, {
//             enableHighAccuracy: true,
//             timeout: 5000,
//             maximumAge: 0,
//         });
//     }
// }

// socket.on("receive-location", (data) => {
//     const { latitude, longitude, id } = data;
//     const latLng = new google.maps.LatLng(latitude, longitude);

//     if (markers[id]) {
//         markers[id].setPosition(latLng);
//     } else {
//         markers[id] = new google.maps.Marker({
//             position: latLng,
//             map: map
//         });

//         if (!map.getCenter()) {
//             map.setCenter(latLng);
//         }
//     }
// });

