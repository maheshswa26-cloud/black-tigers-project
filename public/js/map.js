/**
 * Vizag Go - Mapbox GL JS v3 Radar Map Manager with Real-Time User GPS
 * Powered by Mapbox GL JS v3 with custom Mapbox Access Token.
 * Team: black tigers
 */

// User's Mapbox Access Token
const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || 'YOUR_PLACEHOLDER_TOKEN';


class RadarMapManager {
  constructor() {
    this.map = null;
    this.markers = [];
    this.userMarker = null;
    this.watchId = null;
    this.gpsLocked = false;
    this.activeFilter = "all";
    this.currentStyle = "mapbox://styles/mapbox/dark-v11"; // Default dark theme matching gamified aesthetic
    this.userCoords = { lat: 17.729, lng: 83.315 }; // Default Vizag center
    this.geolocateControl = null;
  }

  init() {
    const mapElement = document.getElementById("map-container");
    if (!mapElement) return;

    if (typeof mapboxgl === "undefined") {
      console.error("Mapbox GL JS library not loaded");
      return;
    }

    try {
      // Initialize Mapbox map centered initially on Visakhapatnam [lng, lat]
      this.map = new mapboxgl.Map({
        container: 'map-container',
        style: this.currentStyle,
        center: [this.userCoords.lng, this.userCoords.lat],
        zoom: 12.4,
        pitch: 28, // Gamified 3D perspective
        bearing: -10
      });

      // Add Mapbox Navigation Controls (Zoom In, Zoom Out, Compass)
      this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add Mapbox Geolocate Control for continuous user GPS tracking
      this.geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
      });
      this.map.addControl(this.geolocateControl, 'top-right');

      // Hook Mapbox geolocate events
      this.geolocateControl.on('geolocate', (e) => {
        const lat = e.coords.latitude;
        const lng = e.coords.longitude;
        this.onGpsSuccess(lat, lng, false);
      });

      this.geolocateControl.on('error', (err) => {
        console.warn("Mapbox GeolocateControl error:", err);
        this.updateGpsUI(null, null, false);
      });

      this.map.on('load', () => {
        // Automatically request browser GPS access on load
        this.requestRealGPS(true);
        // Render civic hazard pins
        this.renderPins();
      });

      // Re-render markers if map style is switched
      this.map.on('style.load', () => {
        this.renderUserMarker();
        this.renderPins();
      });

    } catch (e) {
      console.error("Error initializing Mapbox map:", e);
    }

    // Attach listeners
    this.attachFilterListeners();
    this.attachStyleSwitchers();
    this.attachGpsControls();
  }

  /**
   * Request real GPS coordinates from browser Geolocation API
   * and fly map directly to user's position.
   */
  requestRealGPS(flyToUser = true) {
    if (!("geolocation" in navigator)) {
      this.updateGpsUI(null, null, false, "Geolocation not supported");
      return;
    }

    this.updateGpsUI(null, null, null, "Acquiring GPS Signal...");

    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.onGpsSuccess(lat, lng, flyToUser);
        this.startWatchingGPS();
      },
      err => {
        console.warn("GPS access denied or error:", err.message);
        this.updateGpsUI(null, null, false, "GPS Access Needed (Click to Allow)");
        this.renderUserMarker(); // Render default marker
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  startWatchingGPS() {
    if (this.watchId !== null) return;
    if ("geolocation" in navigator) {
      this.watchId = navigator.geolocation.watchPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          this.userCoords = { lat, lng };
          this.gpsLocked = true;
          this.renderUserMarker();
          this.updateGpsUI(lat, lng, true);
          if (window.cameraManager) {
            window.cameraManager.updateCoords(lat, lng);
          }
        },
        err => console.log("watchPosition notification:", err.message),
        { enableHighAccuracy: true, maximumAge: 3000 }
      );
    }
  }

  onGpsSuccess(lat, lng, flyToUser = true) {
    this.userCoords = { lat, lng };
    this.gpsLocked = true;
    this.renderUserMarker();
    this.updateGpsUI(lat, lng, true);

    // Update camera manager so hazard scanning uses real GPS
    if (window.cameraManager) {
      window.cameraManager.updateCoords(lat, lng);
    }

    // Smoothly fly map to user's real GPS position
    if (flyToUser && this.map) {
      this.map.flyTo({
        center: [lng, lat],
        zoom: 15,
        speed: 1.2,
        curve: 1.4,
        essential: true
      });
    }

    if (window.app) {
      window.app.showToast(`🎯 Live GPS locked! (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  }

  updateGpsUI(lat, lng, locked, customMsg = null) {
    const pill = document.getElementById("gps-status-pill");
    if (!pill) return;

    if (customMsg) {
      pill.innerHTML = `<span>🛰️</span> <span>${customMsg}</span>`;
      pill.style.borderColor = "var(--border-color)";
      pill.style.color = "var(--text-secondary)";
      return;
    }

    if (locked && lat && lng) {
      pill.innerHTML = `<span class="pulse-dot" style="background:#00e5ff; box-shadow:0 0 10px #00e5ff;"></span> <span>GPS Locked: ${lat.toFixed(4)}, ${lng.toFixed(4)}</span>`;
      pill.style.borderColor = "#00e5ff";
      pill.style.color = "#00e5ff";
      pill.style.background = "rgba(0, 229, 255, 0.12)";
    } else {
      pill.innerHTML = `<span>⚠️</span> <span>Enable Live GPS</span>`;
      pill.style.borderColor = "var(--alert-orange)";
      pill.style.color = "var(--alert-orange)";
      pill.style.background = "rgba(255, 87, 34, 0.12)";
    }
  }

  renderUserMarker() {
    if (!this.map) return;
    if (this.userMarker) {
      this.userMarker.remove();
    }

    const userEl = document.createElement("div");
    userEl.className = "user-radar-icon";
    userEl.innerHTML = `
      <div style="
        position: relative;
        width: 24px;
        height: 24px;
        background: #00e5ff;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 20px #00e5ff;
        cursor: pointer;
      ">
        <div style="
          position: absolute;
          top: -12px;
          left: -12px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid #00e5ff;
          animation: radarPulse 1.8s infinite ease-out;
          pointer-events: none;
        "></div>
      </div>
    `;

    const statusText = this.gpsLocked ? "Live GPS Location" : "Default Location";
    const popup = new mapboxgl.Popup({ offset: 20 })
      .setHTML(`
        <div style="padding:4px; font-family:inherit;">
          <div style="color:#00e5ff; font-weight:800; font-size:12px; margin-bottom:2px;">📍 ${statusText}</div>
          <div style="color:#fff; font-weight:700; font-size:13px;">${window.i18n.t("youAreHere")}</div>
          <div style="color:#94a3b8; font-family:monospace; font-size:11px; margin-top:2px;">
            ${this.userCoords.lat.toFixed(5)}, ${this.userCoords.lng.toFixed(5)}
          </div>
        </div>
      `);

    this.userMarker = new mapboxgl.Marker({ element: userEl })
      .setLngLat([this.userCoords.lng, this.userCoords.lat])
      .setPopup(popup)
      .addTo(this.map);
  }

  renderPins() {
    if (!this.map) return;

    // Remove existing Mapbox markers
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const hazards = window.dataManager.getAllHazards();
    const filtered = hazards.filter(h => {
      if (this.activeFilter === "all") return true;
      if (this.activeFilter === "roads") return h.category.toLowerCase().includes("road");
      if (this.activeFilter === "sanitation") return h.category.toLowerCase().includes("sanitation");
      if (this.activeFilter === "electrical") return h.category.toLowerCase().includes("electrical");
      if (this.activeFilter === "water") return h.category.toLowerCase().includes("water");
      if (this.activeFilter === "safety") return h.category.toLowerCase().includes("safety");
      return true;
    });

    filtered.forEach(h => {
      const pinColor = h.severity === "High" ? "#ff5722" : (h.severity === "Medium" ? "#ffb703" : "#00ff87");
      const iconEmoji = this.getCategoryEmoji(h.category);
      const isSampleLabel = h.isSample ? `<span style="background:#263345;color:#94a3b8;font-size:10px;padding:2px 6px;border-radius:10px;font-weight:bold;">${window.i18n.t("sampleBadge")}</span>` : '';
      const upvoted = window.dataManager.hasUpvoted(h.id);

      // Create Custom DOM Marker
      const el = document.createElement("div");
      el.className = "hazard-radar-pin";
      el.innerHTML = `
        <div style="
          position: relative;
          background: #121721;
          border: 2px solid ${pinColor};
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.7), 0 0 12px ${pinColor}88;
          cursor: pointer;
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
          <span>${iconEmoji}</span>
          <div style="
            position: absolute;
            bottom: -4px;
            right: -4px;
            background: ${pinColor};
            color: #000;
            font-size: 10px;
            font-weight: 800;
            border-radius: 8px;
            padding: 1px 4px;
          ">${h.upvotes}</div>
        </div>
      `;

      // Mapbox Popup
      const popupContent = `
        <div style="font-family: inherit; width: 230px; color: #f8fafc; padding: 4px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            ${isSampleLabel}
            <span style="font-size:11px; font-weight:700; color:${pinColor}">${h.severity.toUpperCase()}</span>
          </div>
          <img src="${h.imageUrl}" alt="${h.title}" style="width:100%; height:90px; object-fit:cover; border-radius:6px; margin-bottom:6px;" onerror="this.src='assets/hazard-generic.svg'"/>
          <h4 style="font-size:13px; font-weight:800; margin:0 0 4px 0; color:#fff;">${h.title}</h4>
          <p style="font-size:11px; color:#94a3b8; margin:0 0 8px 0;">📍 ${h.locationName}</p>
          <button 
            onclick="window.radarMap.handlePopupUpvote('${h.id}')"
            id="popup-btn-${h.id}"
            style="
              width: 100%;
              background: ${upvoted ? '#00ff8722' : '#1e2430'};
              border: 1px solid ${upvoted ? '#00ff87' : '#334155'};
              color: ${upvoted ? '#00ff87' : '#fff'};
              padding: 6px 10px;
              border-radius: 6px;
              font-weight: 700;
              font-size: 12px;
              cursor: pointer;
            ">
            ${upvoted ? '✓ ' + window.i18n.t("btnUpvoted") : '👍 ' + window.i18n.t("btnUpvote")} (${h.upvotes})
          </button>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: true, maxWidth: "260px" })
        .setHTML(popupContent);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([h.lng, h.lat])
        .setPopup(popup)
        .addTo(this.map);

      this.markers.push(marker);
    });
  }

  handlePopupUpvote(id) {
    const res = window.dataManager.toggleUpvote(id);
    if (res.success) {
      this.renderPins();
      if (window.issuesManager) {
        window.issuesManager.render();
      }
      if (window.app) {
        window.app.updateXP();
        window.app.showToast(res.upvoted ? "👍 +1 Civic Upvote added! (+10 XP)" : "Upvote removed");
      }
    }
  }

  getCategoryEmoji(cat) {
    const c = (cat || "").toLowerCase();
    if (c.includes("road") || c.includes("pothole")) return "⚠️";
    if (c.includes("sanitation") || c.includes("garbage")) return "🗑️";
    if (c.includes("electrical") || c.includes("light")) return "💡";
    if (c.includes("water") || c.includes("drain")) return "🚰";
    if (c.includes("signal") || c.includes("traffic")) return "🚦";
    return "📍";
  }

  attachFilterListeners() {
    const chips = document.querySelectorAll(".filter-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.activeFilter = chip.getAttribute("data-filter") || "all";
        this.renderPins();
      });
    });
  }

  attachStyleSwitchers() {
    const styleBtns = document.querySelectorAll(".mapbox-style-btn");
    styleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        styleBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const styleUri = btn.getAttribute("data-style");
        if (styleUri && this.map) {
          this.currentStyle = styleUri;
          this.map.setStyle(styleUri);
        }
      });
    });
  }

  attachGpsControls() {
    const locateBtn = document.getElementById("btn-locate-me");
    if (locateBtn) {
      locateBtn.addEventListener("click", () => {
        if (this.geolocateControl) {
          this.geolocateControl.trigger();
        } else {
          this.requestRealGPS(true);
        }
      });
    }

    const vizagBtn = document.getElementById("btn-vizag-hub");
    if (vizagBtn) {
      vizagBtn.addEventListener("click", () => {
        if (this.map) {
          this.map.flyTo({
            center: [83.315, 17.729],
            zoom: 12.4,
            speed: 1.2,
            curve: 1.4
          });
        }
      });
    }

    const statusPill = document.getElementById("gps-status-pill");
    if (statusPill) {
      statusPill.addEventListener("click", () => {
        this.requestRealGPS(true);
      });
    }
  }

  invalidateSize() {
    if (this.map) {
      setTimeout(() => {
        this.map.resize();
      }, 200);
    }
  }
}

window.radarMap = new RadarMapManager();
