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
        demoData.push([ev.latLng.lat(), ev.latLng.lng()]);
        heatmapData.push({ location: new google.maps.LatLng(ev.latLng.lat(), ev.latLng.lng()), weight: 0.1 });
        covidChecks();
        trafficLevels(true);
        crowdDynamics();
        cleanUpTargets();
    });

    heatmap.setMap(map);
    cleanUI();
    covidChecks();
    trafficLevels(true);
    crowdDynamics();
    cleanUpTargets();
}

function loadHeatMap() {
    while (heatmapData.getLength() > 0) heatmapData.pop();
    demoData.forEach(loc => {
        heatmapData.push({ location: new google.maps.LatLng(loc[0], loc[1]), weight: 0.07 });
    });

    document.getElementById("actions").style.display = "inherit";
}

function initMapFirebase() {
    const coords = [41.6229474, 24.1651491];
    const dospat = new google.maps.LatLng(coords[0], coords[1]);
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
        while (heatmapDataFirebase.getLength() > 0) heatmapData.pop();
        Object.keys(data).forEach((geo) => {
            heatmapDataFirebase.push({ location: new google.maps.LatLng(data[geo].lat, data[geo].lng), weight: 0.9 });
        })
    });

    cleanUI();
}

function initMap() {
    const world = new google.maps.LatLng(35, -30);
    map = new google.maps.Map(document.getElementById('map'), {
        center: world,
        zoom: 3,
        mapTypeId: 'satellite'
    });

    cleanUI();
}

function countRect(target) {
    return demoData.filter(el => {
        return el[1] > target[0][1] && el[1] < target[1][1] && el[0] < target[1][0] && el[0] > target[2][0];
    }).length;
}

function covidChecks() {
    const targetName = "Denny Park";
    const acceptable = 215;
    const current = countRect(dennyPark);

    document.querySelector("#covid-target-name").innerHTML = targetName;
    document.querySelector("#covid-acceptable").innerHTML = acceptable;
    document.querySelector("#covid-current").innerHTML = current;

    const statusDOM = document.querySelector("#covid-status");
    if (current > acceptable) statusDOM.innerHTML = "too crowded";
    if (current <= acceptable && current > acceptable * 0.7) statusDOM.innerHTML = "mildly crowded";
    if (current < acceptable && current <= acceptable * 0.7) statusDOM.innerHTML = "not too crowded";
}

function trafficLevels(updateDOM) {
    const targets = [
        { name: "9th Ave N", data: ave9 },
        { name: "Denny Way Str", data: dennyWay },
        { name: "Dexter Ave N", data: dexterAve },
    ];

    const acceptable = [120, 105, 150];
    const currentLevels = targets.map(t => countRect(t.data));

    let resultElements = "";
    const lines = currentLevels.map((lvl, i) => {
        if (lvl > acceptable[i]) {
            resultElements += '<li>Traffic levels for "' + targets[i].name + '": ' + "<b>High</b></li>";
            return Object.assign(targets[i], {status: "high"});
        }

        if (lvl <= acceptable[i] && lvl > acceptable[i] * 0.7) {
            resultElements += '<li>Traffic levels for "' + targets[i].name + '": ' + "<b>Mild</b></li>";
            return Object.assign(targets[i], {status: "mild"});
        }

        if (lvl < acceptable[i] && lvl <= acceptable[i] * 0.7) {
            resultElements += '<li>Traffic levels for "' + targets[i].name + '": ' + "<b>Low</b></li>";
            return Object.assign(targets[i], {status: "low"});
        }
    });
    
    if (updateDOM) document.getElementById("traffic-list").innerHTML = resultElements;
    return lines;
}

function crowdDynamics() {
    let resultDOM = "";
    trafficLevels(false).forEach(el => {
        if (el.status === "high") resultDOM += "<div>Unusual crowd density on <b>" + el.name + "</b>. Possibility of <span style='cursor: pointer; text-decoration: underline;' onclick=\"alert('Take action! Send a police team or order an inspection.')\" title=\"Take action!\">an incident, a protest or a carnival</span> happening.</div>";
    });

    document.getElementById("crowd-dynamics").innerHTML = resultDOM;
}

function cleanUpTargets() {
    let result = "";
    trafficLevels(false).forEach(el => {
        if (el.status === "high" || el.status === "mild") result += el.name + "; ";
    });

    document.getElementById("cleanup-targets").innerHTML = "<span style='cursor: pointer; text-decoration: underline;' onclick=\"alert('Sending an inquiry to the pollution department.')\" title=\"Take action!\">" + result + "</span>";
}