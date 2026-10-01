//. 1. 初期設定・変数

const mapContainer = document.getElementById("map-container");
const mapContent = document.getElementById("map-content");
const mapImage = document.getElementById("map-image");

console.log("version 1.0.2");

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

function updateLocationFromInput() {
    const input = document.getElementById("location-input").value;
    const [latStr, lonStr] = input.split(",");
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
        alert("有効な緯度と経度を入力してください。");
        return;
    }
}

//. 6. 現在地の座標表示


// 取得した位置情報を画面に表示
function updateLocationDisplay(position) {
    const currentMarker = document.getElementById("current-location-marker");

    const points = {
        NW: { lat: 35.45694144383597, lon: 133.28846130224647, x: 0,    y: 0   },// 左上
        SW: { lat: 35.45574263612581, lon: 133.28750102563885, x: 0,    y: 665 },// 左下
        NE: { lat: 35.45574300000000, lon: 133.29067900000000, x: 1280, y: 0   },// 右上
        SE: { lat: 35.45433002179459, lon: 133.28943633681803, x: 1280, y: 665 } // 右下
    };
    function latLonToPixel(lat, lon) {

        const NW = points.NW;
        const SW = points.SW;
        const NE = points.NE;

        // 緯度経度空間での基準ベクトル
        const vxLon = NE.lon - NW.lon;
        const vxLat = NE.lat - NW.lat;

        const vyLon = SW.lon - NW.lon;
        const vyLat = SW.lat - NW.lat;

        // 現在地点ベクトル
        const pxLon = lon - NW.lon;
        const pxLat = lat - NW.lat;

        // 2×2行列の逆行列
        const det =
            vxLon * vyLat -
            vyLon * vxLat;

        if (Math.abs(det) < 1e-12) {
            return { x: 0, y: 0 };
        }

        const u =
            ( pxLon * vyLat -
            vyLon * pxLat ) / det;

        const v =
            ( vxLon * pxLat -
            pxLon * vxLat ) / det;

        return {
            x: u * 1280,
            y: v * 665
        };
    }
//    const lat = position.coords.latitude;
//    const lon = position.coords.longitude;
    const lat = 35.45601124336626;
    const lon = 133.28882661496613;

    const accuracy = position.coords.accuracy;
    const time = new Date(position.timestamp)
        .toLocaleTimeString("ja-JP");

    currentLatitude = lat;
    currentLongitude = lon;

    const userMarker = latLonToPixel(lat, lon);

    document.getElementById("location-lat").textContent =
        `緯度：${lat.toFixed(6)}`;

    document.getElementById("location-lon").textContent =
        `経度：${lon.toFixed(6)}`;

    document.getElementById("location-accuracy").textContent =
        `精度：約${Math.round(accuracy)} m`;

    document.getElementById("location-time").textContent =
        `更新時刻：${time}`;

    document.getElementById("location-status").textContent =
        "状態：取得中・更新済み";


    // ここで地図上への座標変換・マーカー移動を行う。const scaleX = mapImage.clientWidth / 1280;

    // ここで地図上への座標変換・マーカー移動を行う。
    
    const displayedWidth = mapImage.clientWidth;
    const displayedHeight = mapImage.clientHeight;

    const scaleX = displayedWidth / 1280;
    const scaleY = displayedHeight / 665;

    currentMarker.style.left =
        `${userMarker.x * scaleX}px`;
    currentMarker.style.top =
        `${userMarker.y * scaleY}px`;

    document.getElementById("current-location-marker").hidden = false;
    // 自作地図の基準座標が未設定のため、
    // 現時点では座標表示のみ。
}


//. 7. Geolocation API

// 位置情報を取得できたとき
function onLocationSuccess(position) {
    updateLocationDisplay(position);
}

// 位置情報を取得できなかったとき
function onLocationError(error) {
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

    document.getElementById("location-status").textContent =
        "状態：取得を停止しました。";
}


//. 8. イベント登録・初期化

function initializeMap() {
    // 地図の初期表示
    resetZoom();

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

    // 位置情報は自動開始せず、ボタンから開始する
}

// HTMLの読み込み完了後に実行
document.addEventListener(
    "DOMContentLoaded",
    initializeMap
);