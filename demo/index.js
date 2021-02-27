const sampleDataset = [];
let heatmapData;
let map;

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

function cleanUI() {
    document.getElementById("actions").style.display = "none";
}

function initMapDemo() {
    heatmapData = new google.maps.MVCArray([])
    const seattle = new google.maps.LatLng(47.6193995, -122.3410557);
    map = new google.maps.Map(document.getElementById('map'), {
        center: seattle,
        zoom: 18,
        mapTypeId: 'satellite'
    });

    const heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
    });

    map.addListener("click", (ev) => {
        sampleDataset.push([ev.latLng.lat(), ev.latLng.lng()]);
    });

    heatmap.setMap(map);
    cleanUI();
}

function loadHeatMap() {
    while(heatmapData.getLength() > 0) heatmapData.pop();
    demoData.forEach(loc => {
        heatmapData.push({ location: new google.maps.LatLng(loc[0], loc[1]), weight: 0.07 });
    });

    document.getElementById("actions").style.display = "inherit";
}

function initMapFirebase() {
    const coords = [41.6229474, 24.1651491];
    const dospat = new google.maps.LatLng(coords[0],coords[1]);
    map = new google.maps.Map(document.getElementById('map'), {
        center: dospat,
        zoom: 13,
        mapTypeId: 'satellite'
    });

    const database = firebase.database();
    const heatmapDataFirebase = new google.maps.MVCArray([]);
    const heatmap = new google.maps.visualization.HeatmapLayer({ data: heatmapDataFirebase });
    heatmap.setMap(map);

    const geoDataRef = database.ref('geo/');
    geoDataRef.on('value', (snapshot) => {
        const data = snapshot.val();
        Object.keys(data).forEach((geo) => {
            heatmapDataFirebase.push({ location: new google.maps.LatLng(data[geo].lat, data[geo].lng), weight: 0.9 });
        })
    });

    cleanUI();
}

function initMap() {
    const world = new google.maps.LatLng(35,-30);
    map = new google.maps.Map(document.getElementById('map'), {
        center: world,
        zoom: 3,
        mapTypeId: 'satellite'
    });

    cleanUI();
}