const sampleDataset = [];

const firebaseConfig = {
    apiKey: "AIzaSyDm-CjjiXApIMZHI2oS1BC-oyCCyayvwR4",
    authDomain: "innovaone-hackaubg.firebaseapp.com",
    databaseURL: "https://innovaone-hackaubg-default-rtdb.firebaseio.com",
    projectId: "innovaone-hackaubg",
    storageBucket: "innovaone-hackaubg.appspot.com",
    messagingSenderId: "678444236582",
    appId: "1:678444236582:web:339e2f6b6a9a6c6fc98be7",
    measurementId: "G-L9BQXSZQB6"
};

firebase.initializeApp(firebaseConfig);

function initMapDemo() {
    let heatmapData = [];

    demoData.forEach(loc => {
        heatmapData.push({ location: new google.maps.LatLng(loc[0], loc[1]), weight: 0.07 });
    });

    const seattle = new google.maps.LatLng(47.6193995, -122.3410557);

    const map = new google.maps.Map(document.getElementById('map'), {
        center: seattle,
        zoom: 18.1,
        mapTypeId: 'satellite'
    });

    const heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
    });

    map.addListener("click", (ev) => {
        sampleDataset.push([ev.latLng.lat(), ev.latLng.lng()]);
    });

    heatmap.setMap(map);
}

function initMapFirebase() {
    const coords = [41.6229474, 24.1651491];
    const dospat = new google.maps.LatLng(coords[0],coords[1]);
    const map = new google.maps.Map(document.getElementById('map'), {
        center: dospat,
        zoom: 18.1,
        mapTypeId: 'satellite'
    });

    const database = firebase.database();
    const heatmapData = new google.maps.MVCArray([]);
    const heatmap = new google.maps.visualization.HeatmapLayer({ data: heatmapData });
    heatmap.setMap(map);

    const geoDataRef = database.ref('geo/');
    geoDataRef.on('value', (snapshot) => {
        const data = snapshot.val();
        Object.keys(data).forEach((geo) => {
            heatmapData.push({ location: new google.maps.LatLng(data[geo].lat, data[geo].lng), weight: 0.5 });
        })
    });
}

function initMap() {
    initMapDemo();
}