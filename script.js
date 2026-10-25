
//更新確認用のVersion表示
console.log("version 1.0.9.2");

//. 1. 初期設定・変数

const mapContainer = document.getElementById("map-container");
const mapContent = document.getElementById("map-content");
const mapImage = document.getElementById("map-image");
const upFloorButton = document.getElementById("up-floor-button");
const downFloorButton = document.getElementById("down-floor-button");
const floorDisplay = document.getElementById("floor");
const currentMarker = document.getElementById("current-location-marker");
const MAP_WIDTH = 1400;
const MAP_HEIGHT = 720;
let floor = 1;
let currentPixelX = null;
let currentPixelY = null;
const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clear-route");

const imageCornerPoints = { //現在地算出のための座標
    NW: { lat: 35.4567725270992,  lon: 133.28876037880545, x: 0,    y: 0   },// 左上
    SW: { lat: 35.45594396885021, lon: 133.28795942296918, x: 0,    y: 720 },// 左下
    NE: { lat: 35.455699980279974,lon: 133.29048014375377, x: 1400, y: 0   },// 右上
    SE: { lat: 35.45487325850927, lon: 133.289710786676,   x: 1400, y: 720 } // 右下
};
const keyPoints = { //ルート作成のための角の各座標　番号は[参考.JPG]参照
    1: { x: 824, y: 361 }, // 1
    2: { x: 780, y: 361 }, // 2
    3: { x: 780, y: 434 }, // 3
    4: { x: 821, y: 434 }, // 4
    5: { x: 780, y: 484 }, // 5
    6: { x: 821, y: 484 }, // 6
    7: { x: 780, y: 534 }, // 7
    8: { x: 821, y: 534 }, // 8
    9: { x: 780, y: 584 }, // 9
    10: { x: 821, y: 584 },// 10
    11: { x: 780, y: 267 },// 11
    12: { x: 821, y: 63 }, // 12
    13: { x: 780, y: 218 },// 13
    14: { x: 821, y: 218 },// 14
    15: { x: 780, y: 168 },// 15
    16: { x: 821, y: 168 },// 16
    17: { x: 780, y: 118 },// 17
    18: { x: 821, y: 118 },// 18
    19: { x: 737, y: 118 },// 19
    20: { x: 737, y: 154 },// 20
    21: { x: 694, y: 118 },// 21
    22: { x: 694, y: 154 },// 22
    23: { x: 694, y: 63 }, // 23
    24: { x: 694, y: 30 }, // 24
    25: { x: 737, y: 63 }, // 25
    26: { x: 737, y: 30 }, // 26
    27:{ x: 780, y: 63 },  // 27
    28:{ x: 780, y: 30 },  // 28
    29:{ x: 740, y: 361 }, // 29
    30:{ x: 740, y: 403 }, // 30
    31:{ x: 650, y: 361 }, // 31
    32:{ x: 650, y: 403 }, // 32
    33:{ x: 503, y: 361 }, // 33
    34:{ x: 503, y: 157 }, // 34
    35:{ x: 503, y: 640 }, // 35
    36:{ x: 301, y: 361 }, // 36
    37:{ x: 301, y: 157 }, // 37
    38:{ x: 301, y: 640 }, // 38
    39:{ x: 90,  y: 361 }, // 39
    40:{ x: 90,  y: 244 }, // 40
    41:{ x: 90,  y: 497 }, // 41
    42:{ x: 90,  y: 625 }, // 42
    43:{ x: 900, y: 361 }, // 43
    44:{ x: 927, y: 428 }, // 44
    45:{ x: 1006,y: 428 }, // 45
    46:{ x: 1026,y: 374 }, // 46
    47:{ x: 1117,y: 374 }, // 47
    48:{ x: 1154,y: 374 }, // 48
    49:{ x: 1154,y: 413 }, // 49
    50:{ x: 1179,y: 413 }, // 50
    51:{ x: 1170,y: 376 }, // 51
    52:{ x: 1248,y: 413 }, // 52
    53:{ x: 1248,y: 376 }, // 53
}
const lines = {
    floor1: {
        1: [2, 43],
        2: [1, 3, 11, 29],
        3: [2, 5],
        5: [3, 7],
        7: [5, 8],
        8: [7],
        11: [2, 13],
        13: [11, 15],
        15: [13, 16, 17],
        16: [15],
        17: [15, 18, 19, 27],
        18: [17],
        19: [17, 20, 21, 25],
        20: [19],
        21: [19, 22],
        22: [21],
        23: [24, 25],
        24: [23],
        25: [19, 23, 26, 27],
        26: [25],
        27: [17, 25, 28],
        28: [27],
        29: [2, 30, 31],
        30: [29],
        31: [29, 32, 33],
        32: [31],
        33: [31, 34, 35, 36],
        34: [33],
        35: [33],
        36: [33, 37, 38, 39],
        37: [36],
        38: [36],
        39: [36, 40, 41],
        40: [39],
        41: [39, 42],
        42: [41],
        43: [1, 44],
        44: [43, 45],
        45: [44, 46],
        46: [45, 47],
        47: [46, 48],
        48: [47, 49],
        49: [48]
    },
    floor2: {
        1: [2, 43],
        2: [1, 3, 11, 29],
        3: [2, 4, 5],
        4: [3],
        5: [3, 6, 7],
        6: [5],
        7: [5, 8, 9],
        8: [7],
        9: [7, 10],
        10: [9],
        11: [2, 13],
        13: [11, 14, 15],
        14: [13],
        15: [13, 16, 17],
        16: [15],
        17: [15, 18, 19, 27],
        18: [17],
        19: [17, 20, 21, 25],
        20: [19],
        21: [19, 22],
        22: [21],
        23: [24, 25],
        24: [23],
        25: [19, 23, 26, 27],
        26: [25],
        27: [17, 25, 28],
        28: [27],
        29: [2, 30, 31],
        30: [29],
        31: [29, 32, 33],
        32: [31],
        33: [31, 34, 35, 36],
        34: [33],
        35: [33],
        36: [33, 37, 38, 39],
        37: [36],
        38: [36],
        39: [36, 40, 41],
        40: [39],
        41: [39, 42],
        42: [41],
        43: [1, 44],
        44: [43, 45],
        45: [44, 46],
        46: [45, 47],
        47: [46, 48],
        48: [47, 49],
        49: [48, 50],
        50: [49, 51, 52],
        51: [50],
        52: [50, 53],
        53: [52]
    },
    floor3: {
        1: [2, 43],
        2: [1, 11, 29],
        11: [2, 13],
        12: [27],
        13: [11, 14, 15],
        14: [13],
        15: [13, 16, 17],
        16: [15],
        17: [15, 18, 19, 27],
        18: [17],
        19: [17, 20, 21, 25],
        20: [19],
        21: [19, 22],
        22: [21],
        23: [24, 25],
        24: [23],
        25: [19, 23, 26, 27],
        26: [25],
        27: [12, 17, 25, 28],
        28: [27],
        29: [2, 30, 31],
        30: [29],
        31: [29, 32, 33],
        32: [31],
        33: [31, 34, 35, 36],
        34: [33],
        35: [33],
        36: [33, 37, 38, 39],
        37: [36],
        38: [36],
        39: [36, 40, 41],
        40: [39],
        41: [39, 42],
        42: [41],
        43: [1, 44],
        44: [43, 45],
        45: [44, 46],
        46: [45]
    },
    floor4: {
        17: [19, 27],
        19: [17, 20, 21, 25],
        20: [19],
        21: [19, 22],
        22: [21],
        23: [24, 25],
        24: [23],
        25: [23, 26, 27],
        26: [25],
        27: [17, 25, 28],
        28: [27]
    }
}
const destinations = { //教室等の場所
    //階段
    "階段1-1": {
        floor: 1,
        point: 30
    },
    "階段1-2": {
        floor: 1,
        point: 28
    },
    "階段2-1": {
        floor: 2,
        point: 30
    },
    "階段2-2": {
        floor: 2,
        point: 28
    },
    "階段3-1": {
        floor: 3,
        point: 30
    },
    "階段3-2": {
        floor: 3,
        point: 28
    },
    "階段4": {
        floor: 4,
        point: 28
    },
    "サイバーセキュリティ": {
        floor: 1,
        point: 8
    },
    "4-C": {
        floor: 1,
        point: 32
    },
    "3-J": {
        floor: 2,
        point: 4
    },
    "内田研・ハンドボール": {
        floor: 2,
        point: 6
    },
    "林研": {
        floor: 2,
        point: 8
    },
    "同窓会": {
        floor: 2,
        point: 10
    },
    "3-A": {
        floor: 2,
        point: 16
    },
    "1-5": {
        floor: 2,
        point: 18
    },
    "1-4": {
        floor: 2,
        point: 20
    },
    "1-3": {
        floor: 2,
        point: 22
    },
    "1-2": {
        floor: 2,
        point: 24
    },
    "1-1": {
        floor: 2,
        point: 26
    },
    "4-A": {
        floor: 2,
        point: 32
    },
    "2-1": {
        floor: 3,
        point: 26
    },
    "2-2": {
        floor: 3,
        point: 24
    },
    "2-3": {
        floor: 3,
        point: 22
    },
    "2-4": {
        floor :3,
        point: 20
    },
    "2-5": {
        floor: 3,
        point: 18
    },
    "3-C": {
        floor: 3,
        point: 16
    },
    "4-E": {
        floor: 3,
        point: 14
    },
    "数学研究会": {
        floor: 3,
        point : 12
    },
    "4-M": {
        floor: 4,
        point: 26
    },
    "起業家育成": {
        floor: 4,
        point: 24
    },
    "ロボコン": {
        floor: 4,
        point: 22
    },
    "4-J": {
        floor: 4,
        point: 20
    }
}

// ズーム設定
let zoom = 1;
const minZoom = 1;
const maxZoom = 5;
const zoomStep = 0.25;

// 地図の移動位置
let x = 0;
let y = 0;

// ドラッグ操作の状態
let isDragging = false;
let lastX = 0;
let lastY = 0;

// タッチ操作中のポインター
const pointers = new Map();
let lastPinchDistance = 0;

// 位置情報の監視ID
let watchId = null;

// 現在地情報
let currentLatitude = null;
let currentLongitude = null;


//. 2. 地図の表示・移動処理

// 地図の位置と拡大率を反映
function updateTransform() {
    mapContent.style.transform =
        `translate(${x}px, ${y}px) scale(${zoom})`;
}

// 地図が表示範囲から外れすぎないように制限
function clampPosition() {
    const rect = mapContainer.getBoundingClientRect();

    const minX = rect.width * (1 - zoom);
    const minY = rect.height * (1 - zoom);

    x = Math.max(minX, Math.min(0, x));
    y = Math.max(minY, Math.min(0, y));
}

// 地図を指定倍率に変更
function setZoom(newZoom, centerX, centerY) {
    const oldZoom = zoom;

    zoom = Math.max(minZoom, Math.min(maxZoom, newZoom));

    if (zoom === oldZoom) return;

    // 指定位置を中心に拡大・縮小
    const ratio = zoom / oldZoom;

    x = centerX - (centerX - x) * ratio;
    y = centerY - (centerY - y) * ratio;

    clampPosition();
    updateTransform();
}

// 階層を上げる
function upFloor() {

    if (floor < 4) {
        floor++;

        mapImage.src = `./images/map/floor${floor}.JPG`;
        floorDisplay.textContent = `${floor}階`;
    }

    if (floor >= 4) {
        upFloorButton.disabled = true;
    } else {
        upFloorButton.disabled = false;
    }

    downFloorButton.disabled = false;
}

// 階層を下げる
function downFloor() {

    if (floor > 1) {
        floor--;

        mapImage.src = `./images/map/floor${floor}.JPG`;
        floorDisplay.textContent = `${floor}階`;
    }

    if (floor <= 1) {
        downFloorButton.disabled = true;
    } else {
        downFloorButton.disabled = false;
    }

    upFloorButton.disabled = false;
}

// 拡大ボタン
function zoomIn() {
    const rect = mapContainer.getBoundingClientRect();

    setZoom(
        zoom + zoomStep,
        rect.width / 2,
        rect.height / 2
    );
}

// 縮小ボタン
function zoomOut() {
    const rect = mapContainer.getBoundingClientRect();

    setZoom(
        zoom - zoomStep,
        rect.width / 2,
        rect.height / 2
    );
}

// 初期位置に戻す
function resetZoom() {
    const rect = mapContainer.getBoundingClientRect();

    zoom = 1;
    x = 0;
    y = 0;

    updateTransform();
}


//. 3. ドラッグ・タッチ操作

// 2本指間の距離を取得
function getPinchDistance() {
    const points = Array.from(pointers.values());

    if (points.length < 2) return 0;

    const dx = points[0].x - points[1].x;
    const dy = points[0].y - points[1].y;

    return Math.hypot(dx, dy);
}

// 2本指の中心位置
function getPinchCenter() {
    const points = Array.from(pointers.values());

    return {
        x: (points[0].x + points[1].x) / 2,
        y: (points[0].y + points[1].y) / 2
    };
}

// ドラッグ開始
function onPointerDown(event) {
    // 操作ボタン上では地図のドラッグを開始しない
    if (event.target.closest("button")) return;

    pointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
    });

    mapContainer.setPointerCapture(event.pointerId);

    if (pointers.size === 1) {
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
    }

    if (pointers.size === 2) {
        isDragging = false;
        lastPinchDistance = getPinchDistance();
    }
}

// ドラッグ・ピンチ中
function onPointerMove(event) {
    if (!pointers.has(event.pointerId)) return;

    const previous = pointers.get(event.pointerId);

    pointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
    });

    // 2本指のピンチズーム
    if (pointers.size === 2) {
        const distance = getPinchDistance();
        const center = getPinchCenter();

        if (lastPinchDistance > 0 && distance > 0) {
            const ratio = distance / lastPinchDistance;
            const rect = mapContainer.getBoundingClientRect();

            setZoom(
                zoom * ratio,
                center.x - rect.left,
                center.y - rect.top
            );
        }

        lastPinchDistance = distance;
        return;
    }

    // 1本指のドラッグ
    if (!isDragging || pointers.size !== 1) return;

    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;

    // 指の移動量をそのまま地図に反映
    x += dx;
    y += dy;

    lastX = event.clientX;
    lastY = event.clientY;

    clampPosition();
    updateTransform();
}

// ドラッグ・タッチ終了
function onPointerUp(event) {
    pointers.delete(event.pointerId);

    if (pointers.size === 1) {
        const remaining = Array.from(pointers.values())[0];

        isDragging = true;
        lastX = remaining.x;
        lastY = remaining.y;
        lastPinchDistance = 0;
    } else {
        isDragging = false;
        lastPinchDistance = 0;
    }
}


//. 4. マウスホイールによるズーム

function onWheel(event) {
    event.preventDefault();

    const rect = mapContainer.getBoundingClientRect();

    const centerX = event.clientX - rect.left;
    const centerY = event.clientY - rect.top;

    const direction = event.deltaY < 0 ? 1 : -1;
    const factor = direction > 0 ? 1.1 : 1 / 1.1;

    setZoom(
        zoom * factor,
        centerX,
        centerY
    );
}


//. 5. マーカー・説明表示

// マーカーを押したときに説明を表示
function showInfo(message) {
    const info = document.getElementById("info");
    const infoText = document.getElementById("info-text");

    infoText.textContent = message;
    info.hidden = false;
}

// 説明を閉じる
function hideInfo() {
    document.getElementById("info").hidden = true;
}

//. 6. 現在地の座標表示


// 取得した位置情報を画面に表示
function updateLocationDisplay(position) {
    function latLonToPixel(lat, lon) {
        const NW = imageCornerPoints.NW;
        const SW = imageCornerPoints.SW;
        const NE = imageCornerPoints.NE;

        const vxLon = NE.lon - NW.lon;
        const vxLat = NE.lat - NW.lat;

        const vyLon = SW.lon - NW.lon;
        const vyLat = SW.lat - NW.lat;

        const pxLon = lon - NW.lon;
        const pxLat = lat - NW.lat;

        const det =
            vxLon * vyLat -
            vyLon * vxLat;

        const u =
            (pxLon * vyLat -
            vyLon * pxLat) / det;

        const v =
            (vxLon * pxLat -
            pxLon * vxLat) / det;

        return {
            x: u * MAP_WIDTH,
            y: v * MAP_HEIGHT
        };
    }

    const lat = position.coords.latitude; //現在地の緯度の取得
    const lon = position.coords.longitude; //現在地の経度の取得

    const accuracy = position.coords.accuracy;
    const time = new Date(position.timestamp)
        .toLocaleTimeString("ja-JP");

    currentLatitude = lat;
    currentLongitude = lon;
    function getDisplayedImageRect() {

        const containerWidth =
            mapImage.clientWidth;

        const containerHeight =
            mapImage.clientHeight;

        const imageWidth =
            mapImage.naturalWidth;

        const imageHeight =
            mapImage.naturalHeight;

        const imageRatio =
            imageWidth / imageHeight;

        const containerRatio =
            containerWidth / containerHeight;

        let displayedWidth;
        let displayedHeight;
        let offsetX;
        let offsetY;

        if (imageRatio > containerRatio) {

            displayedWidth =
                containerWidth;

            displayedHeight =
                containerWidth / imageRatio;

            offsetX = 0;

            offsetY =
                (containerHeight -
                displayedHeight) / 2;

        } else {

            displayedHeight =
                containerHeight;

            displayedWidth =
                containerHeight * imageRatio;

            offsetY = 0;

            offsetX =
                (containerWidth -
                displayedWidth) / 2;
        }

        return {
            width: displayedWidth,
            height: displayedHeight,
            offsetX,
            offsetY
        };
    }
    const userMarker = latLonToPixel(lat, lon);

    currentPixelX = userMarker.x;
    currentPixelY = userMarker.y;

    document.getElementById("location-accuracy").textContent =
        `精度：約${Math.round(accuracy)} m`;

    document.getElementById("location-time").textContent =
        `更新時刻：${time}`;

    document.getElementById("location-status").textContent =
        `状態：取得中 (${Date.now()})`;
        const {
        width: displayedWidth,
        height: displayedHeight,
        offsetX,
        offsetY
    } = getDisplayedImageRect();

    const scaleX =
        displayedWidth / MAP_WIDTH;

    const scaleY =
        displayedHeight / MAP_HEIGHT;

    currentMarker.style.left =
        `${offsetX + userMarker.x * scaleX}px`;

    currentMarker.style.top =
        `${offsetY + userMarker.y * scaleY}px`;

    currentMarker.hidden = false;
    const test = latLonToPixel(lat, lon);
}


//. 7. Geolocation API

// 位置情報を取得できたとき
function onLocationSuccess(position) {
    updateLocationDisplay(position);
    searchButton.disabled = false;
}

// 位置情報を取得できなかったとき
function onLocationError(error) {
    searchButton.disabled = true;
    const status = document.getElementById("location-status");

    const messages = {
        1: "位置情報の使用が許可されていません。",
        2: "現在地を特定できません。",
        3: "取得がタイムアウトしました。"
    };

    status.textContent =
        `状態：${messages[error.code] || "取得に失敗しました。"}`;

    console.error("位置情報エラー:", error.code, error.message);
}

// 位置情報の取得を開始
function startLocationTracking() {
    const status = document.getElementById("location-status");

    if (!navigator.geolocation) {
        status.textContent =
            "状態：このブラウザは位置情報に対応していません。";
        return;
    }

    // HTTPSまたはlocalhost以外では利用できない
    if (
        location.protocol !== "https:" &&
        location.hostname !== "localhost"
    ) {
        status.textContent =
            "状態：HTTPS環境で開いてください。";
        return;
    }

    // 二重起動を防止
    if (watchId !== null) {
        status.textContent = "状態：すでに取得中です。";
        return;
    }

    status.textContent = "状態：位置情報を取得中...";

    watchId = navigator.geolocation.watchPosition(
        onLocationSuccess,
        onLocationError,
        {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 15000
        }
    );
}

// 位置情報の取得を停止
function stopLocationTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    searchButton.disabled = true;

    document.getElementById("location-status").textContent =
        "状態：取得を停止しました。";
}


//. 8. イベント登録・初期化

function initializeMap() {
    // 地図の初期表示
    resetZoom();

    // 階層表示の初期化
    downFloorButton.disabled = true;

    // ポインター操作
    mapContainer.addEventListener(
        "pointerdown",
        onPointerDown
    );

    mapContainer.addEventListener(
        "pointermove",
        onPointerMove
    );

    mapContainer.addEventListener(
        "pointerup",
        onPointerUp
    );

    mapContainer.addEventListener(
        "pointercancel",
        onPointerUp
    );

    // マウスホイール操作
    mapContainer.addEventListener(
        "wheel",
        onWheel,
        { passive: false }
    );

    const routeCanvas =
    document.createElement("canvas");

    routeCanvas.id = "route-canvas";

    routeCanvas.width = MAP_WIDTH;
    routeCanvas.height = MAP_HEIGHT;
    routeCanvas.style.width = "100%";
    routeCanvas.style.height = "100%";

    routeCanvas.style.position = "absolute";
    routeCanvas.style.left = "0";
    routeCanvas.style.top = "0";
    routeCanvas.style.pointerEvents = "none";
    routeCanvas.style.zIndex = "4";

    document
        .getElementById("map-image-wrapper")
        .appendChild(routeCanvas);

    createDestinationButtons();

    // 位置情報は自動開始せず、ボタンから開始する
}

//. 9. ルートシステム
// 全体の最近傍地点を調べる
function findNearestKeyPoint(x, y) {

    let nearestId = null;
    let minDistance = Infinity;

    for (const id in keyPoints) {

        const point = keyPoints[id];

        const distance = Math.hypot(
            point.x - x,
            point.y - y
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearestId = Number(id);
        }
    }

    return nearestId;
}
// 階層ごとの最近傍地点を調べる
function findNearestKeyPointInGraph(x, y, graph) {

    let nearestId = null;
    let minDistance = Infinity;

    for (const id in graph) {

        const point = keyPoints[id];

        if (!point) continue;

        const distance = Math.hypot(
            point.x - x,
            point.y - y
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearestId = Number(id);
        }
    }

    return nearestId;
}
// 2つのキーポイント間の距離を計算する関数
function getDistance(a, b) {

    const pointA = keyPoints[a];
    const pointB = keyPoints[b];

    return Math.hypot(
        pointA.x - pointB.x,
        pointA.y - pointB.y
    );
}
// ダイクストラ法で最短経路を求める関数
function findShortestPath(start, goal, graph) {

    const distances = {};
    const previous = {};
    const unvisited = new Set();

    for (const node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
        unvisited.add(Number(node));
    }

    distances[start] = 0;

    while (unvisited.size > 0) {

        let current = null;

        for (const node of unvisited) {

            if (
                current === null ||
                distances[node] < distances[current]
            ) {
                current = node;
            }
        }

        if (current === goal) {
            break;
        }

        unvisited.delete(current);

        const neighbors = graph[current] || [];

        for (const neighbor of neighbors) {

            const alt =
                distances[current] +
                getDistance(current, neighbor);

            if (alt < distances[neighbor]) {

                distances[neighbor] = alt;
                previous[neighbor] = current;
            }
        }
    }
    if (
        distances[goal] === Infinity
    ) {
        console.error(
            "目的地に到達できません"
        );
        return [];
    }

    const path = [];

    let current = goal;

    while (
        current !== null &&
        current !== undefined
    ) {
        path.unshift(current);
        current = previous[current];
    }

    return path;
}

function drawRoute(path) {

    const canvas =
        document.getElementById("route-canvas");

    const imgRect =
        mapImage.getBoundingClientRect();

    const scaleX = imgRect.width / MAP_WIDTH;
    const scaleY = imgRect.height / MAP_HEIGHT;

    canvas.style.width =
    `${imgRect.width}px`;

    canvas.style.height =
        `${imgRect.height}px`;

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (path.length < 2) return;

    ctx.beginPath();

    const first =
        keyPoints[path[0]];

    ctx.moveTo(
        first.x * scaleX,
        first.y * scaleY
    );

    for (
        let i = 1;
        i < path.length;
        i++
    ) {

        const point =
            keyPoints[path[i]];

        ctx.lineTo(
            point.x * scaleX,
            point.y * scaleY
        );
    }

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#ff0000";

    ctx.stroke();
}

function navigateTo(destinationName) {
    if (
    currentPixelX === null ||
    currentPixelY === null
    ) {
        alert("先に位置情報を取得してください");
        return;
    }

    const destination =
        destinations[destinationName];

    if (!destination) {
        console.error("目的地が見つかりません");
        return;
    }

    floor = destination.floor;

    mapImage.src =
        `./images/map/floor${floor}.JPG`;

    floorDisplay.textContent =
        `${floor}階`;

    upFloorButton.disabled =
        floor >= 4;

    downFloorButton.disabled =
        floor <= 1;

    const graph =
        lines[`floor${floor}`];

    if (!graph) {
        console.error("この階の経路情報がありません");
        return;
    }

    const startPoint =
        findNearestKeyPointInGraph(
            currentPixelX,
            currentPixelY,
            graph
        );

    const path =
        findShortestPath(
            startPoint,
            destination.point,
            graph
        );

    mapImage.onload = () => {
        drawRoute(path);
    };
    clearButton.hidden = false;
}
function createDestinationButtons() {

    const list =
        document.getElementById(
            "destination-list"
        );

    list.innerHTML = "";

    for (const name in destinations) {

        const button =
            document.createElement("button");

        button.textContent = name;

        button.className =
            "destination-button";

        button.onclick = () => {

            navigateTo(name);

            toggleSearch();
        };

        list.appendChild(button);
    }
}


function toggleSearch() {

    const panel =
        document.getElementById(
            "search-panel"
        );

    panel.hidden = !panel.hidden;
}

function clearRoute() {
    const canvas =
        document.getElementById("route-canvas");

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    clearButton.hidden = true;
}

//Debug用の関数
function debugLocation(lat, lon) {
    updateLocationDisplay({
        coords: {
            latitude: lat,
            longitude: lon,
            accuracy: 1
        },
        timestamp: Date.now()
    });
}

// HTMLの読み込み完了後に実行
document.addEventListener(
    "DOMContentLoaded",
    initializeMap
);