/**
 * Vizag Go - AI Camera Viewfinder & Gemini AI Classifier
 * Handles camera stream, photo capture, location tagging, and structured Gemini AI analysis.
 * Team: black tigers
 */

class CameraManager {
  constructor() {
    this.stream = null;
    this.capturedImageBase64 = null;
    this.selectedPreset = null;
    this.currentLocation = {
      name: "Siripuram Junction, Visakhapatnam",
      lat: 17.729,
      lng: 83.315
    };
    this.aiResult = null;
  }

  init() {
    this.bindElements();
    this.setupLocation();
    this.setupPresets();
  }

  bindElements() {
    this.videoEl = document.getElementById("camera-video");
    this.previewImg = document.getElementById("camera-preview-img");
    this.placeholderEl = document.getElementById("viewfinder-placeholder");
    this.fileInput = document.getElementById("camera-file-input");
    this.notesInput = document.getElementById("camera-notes-input");
    this.locationCoordsEl = document.getElementById("camera-location-coords");

    // Containers for states
    this.viewfinderCard = document.getElementById("viewfinder-card");
    this.loadingContainer = document.getElementById("ai-loading-container");
    this.resultContainer = document.getElementById("ai-result-container");
    this.errorContainer = document.getElementById("ai-error-container");

    // Action buttons
    this.captureBtn = document.getElementById("btn-capture-analyze");
    this.confirmBtn = document.getElementById("btn-confirm-pin");
    this.retakeBtn = document.getElementById("btn-retake-photo");
    this.retryBtn = document.getElementById("btn-try-again");

    if (this.captureBtn) {
      this.captureBtn.addEventListener("click", () => this.handleCaptureAndAnalyze());
    }
    if (this.confirmBtn) {
      this.confirmBtn.addEventListener("click", () => this.confirmAndPublish());
    }
    if (this.retakeBtn) {
      this.retakeBtn.addEventListener("click", () => this.resetViewfinder());
    }
    if (this.retryBtn) {
      this.retryBtn.addEventListener("click", () => this.handleCaptureAndAnalyze());
    }
    if (this.fileInput) {
      this.fileInput.addEventListener("change", (e) => this.handleFileUpload(e));
    }
  }

  setupLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.updateCoords(pos.coords.latitude, pos.coords.longitude, "Live GPS Location");
        },
        err => {
          this.updateLocationDisplay();
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      this.updateLocationDisplay();
    }
  }

  updateCoords(lat, lng, name = null) {
    this.currentLocation.lat = parseFloat(lat.toFixed(4));
    this.currentLocation.lng = parseFloat(lng.toFixed(4));
    if (name) {
      this.currentLocation.name = name;
    } else if (this.currentLocation.name.includes("Siripuram")) {
      this.currentLocation.name = "Live GPS Location";
    }
    this.updateLocationDisplay();
  }

  updateLocationDisplay() {
    if (this.locationCoordsEl) {
      this.locationCoordsEl.textContent = `${this.currentLocation.name} (${this.currentLocation.lat}, ${this.currentLocation.lng})`;
    }
  }

  startCamera() {
    if (this.capturedImageBase64) return; // Keep captured preview if already set

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          this.stream = stream;
          if (this.videoEl) {
            this.videoEl.srcObject = stream;
            this.videoEl.style.display = "block";
            this.videoEl.play();
          }
          if (this.placeholderEl) this.placeholderEl.style.display = "none";
          if (this.previewImg) this.previewImg.style.display = "none";
        })
        .catch(err => {
          console.log("Webcam access optional or denied:", err.message);
          // Show upload/preset prompt in placeholder
          if (this.placeholderEl) {
            this.placeholderEl.innerHTML = `
              <div class="viewfinder-placeholder-icon">📷</div>
              <p style="font-weight:700; color:#fff; margin-bottom:4px;">Camera Ready</p>
              <p style="font-size:0.85rem; color:#94a3b8;">Upload a photo or select a realistic hazard preset below</p>
            `;
          }
        });
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoEl) {
      this.videoEl.style.display = "none";
    }
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.capturedImageBase64 = e.target.result;
      this.selectedPreset = null;
      this.displayPreview(this.capturedImageBase64);
    };
    reader.readAsDataURL(file);
  }

  displayPreview(src) {
    this.stopCamera();
    if (this.placeholderEl) this.placeholderEl.style.display = "none";
    if (this.videoEl) this.videoEl.style.display = "none";
    if (this.previewImg) {
      this.previewImg.src = src;
      this.previewImg.style.display = "block";
    }
  }

  setupPresets() {
    const presetButtons = document.querySelectorAll(".preset-btn");
    presetButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-preset");
        this.selectedPreset = type;
        
        let presetImg = "assets/streetlight.svg";
        let defaultNote = "light dead";
        let locName = "Kancharapalem Main Road";
        let lat = 17.734;
        let lng = 83.276;

        if (type === "streetlight") {
          presetImg = "assets/streetlight.svg";
          defaultNote = "light dead near junction";
          locName = "Kancharapalem Main Road";
          lat = 17.734; lng = 83.276;
        } else if (type === "pothole") {
          presetImg = "assets/pothole.svg";
          defaultNote = "huge crater on road";
          locName = "Siripuram Circle";
          lat = 17.729; lng = 83.315;
        } else if (type === "garbage") {
          presetImg = "assets/garbage.svg";
          defaultNote = "trash overflowing near food court";
          locName = "MVP Colony Sector 2";
          lat = 17.741; lng = 83.332;
        } else if (type === "pipe") {
          presetImg = "assets/pipe-leak.svg";
          defaultNote = "water leaking heavily";
          locName = "Beach Road Kurupam Circle";
          lat = 17.712; lng = 83.331;
        }

        this.capturedImageBase64 = presetImg;
        this.notesInput.value = defaultNote;
        this.currentLocation = { name: locName, lat, lng };
        this.updateLocationDisplay();
        this.displayPreview(presetImg);

        // Highlight selected preset
        presetButtons.forEach(b => b.style.borderColor = "var(--border-color)");
        btn.style.borderColor = "var(--neon-green)";
      });
    });
  }

  async handleCaptureAndAnalyze() {
    // If user has a live video stream running and clicks capture, grab a snapshot
    if (this.stream && this.videoEl && this.videoEl.videoWidth) {
      const canvas = document.createElement("canvas");
      canvas.width = this.videoEl.videoWidth;
      canvas.height = this.videoEl.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(this.videoEl, 0, 0);
      this.capturedImageBase64 = canvas.toDataURL("image/jpeg", 0.85);
      this.displayPreview(this.capturedImageBase64);
    }

    // Default to fallback preset if nothing selected or captured
    if (!this.capturedImageBase64) {
      this.capturedImageBase64 = "assets/streetlight.svg";
      if (!this.notesInput.value) {
        this.notesInput.value = "light dead";
      }
      this.displayPreview(this.capturedImageBase64);
    }

    const notes = (this.notesInput.value || "").trim();

    // Show loading state
    this.showState("loading");

    try {
      // Send to server-side Gemini API proxy
      const payload = {
        image: this.capturedImageBase64,
        notes: notes,
        preset: this.selectedPreset || "",
        location: this.currentLocation
      };

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const responseData = await res.json();
      if (!responseData.success || !responseData.data) {
        throw new Error(responseData.error || "Analysis failed");
      }

      this.aiResult = responseData.data;
      this.aiResult.source = responseData.source || "Gemini AI";
      this.renderAiResult();
      if (window.aboutManager) window.aboutManager.updateStats();
      this.showState("result");

    } catch (err) {
      console.error("Gemini AI Analysis Error:", err);
      this.showState("error");
    }
  }

  renderAiResult() {
    if (!this.aiResult) return;

    const titleEl = document.getElementById("ai-card-title");
    const categoryEl = document.getElementById("ai-card-category");
    const severityEl = document.getElementById("ai-card-severity");
    const descEl = document.getElementById("ai-card-desc");
    const actionEl = document.getElementById("ai-card-action");
    const sourceEl = document.getElementById("ai-card-source");

    if (titleEl) titleEl.textContent = this.aiResult.title || "Civic Hazard";
    if (categoryEl) categoryEl.textContent = this.aiResult.category || "General";
    if (descEl) descEl.textContent = this.aiResult.description || "Identified civic issue.";
    if (actionEl) actionEl.innerHTML = `<strong>⚡ Recommended GVMC Action:</strong> ${this.aiResult.actionRecommendation || "Inspection dispatched."}`;
    if (sourceEl) sourceEl.textContent = `Powered by: ${this.aiResult.source}`;

    if (severityEl) {
      const sev = this.aiResult.severity || "Medium";
      severityEl.textContent = sev.toUpperCase();
      severityEl.className = `ai-severity-badge severity-${sev.toLowerCase()}`;
    }
  }

  confirmAndPublish() {
    if (!this.aiResult) return;

    const newRecord = {
      title: this.aiResult.title,
      category: this.aiResult.category,
      severity: this.aiResult.severity,
      locationName: this.currentLocation.name,
      lat: this.currentLocation.lat,
      lng: this.currentLocation.lng,
      description: this.aiResult.description,
      actionRecommendation: this.aiResult.actionRecommendation,
      imageUrl: this.capturedImageBase64 || "assets/hazard-generic.svg",
      notes: this.notesInput.value
    };

    const result = window.dataManager.addHazard(newRecord);
    
    // Refresh Radar Map and Issue list
    if (window.radarMap) window.radarMap.renderPins();
    if (window.issuesManager) window.issuesManager.render();
    if (window.app) {
      window.app.updateXP();
      window.app.showToast(`🎉 Hazard pinned to Civic Radar! (+25 XP)`);
      // Switch view to Radar Map to show newly pinned hazard
      window.app.switchScreen("radar");
    }

    this.resetViewfinder();
  }

  resetViewfinder() {
    this.capturedImageBase64 = null;
    this.aiResult = null;
    this.selectedPreset = null;
    if (this.notesInput) this.notesInput.value = "";
    if (this.previewImg) {
      this.previewImg.src = "";
      this.previewImg.style.display = "none";
    }
    if (this.placeholderEl) this.placeholderEl.style.display = "block";
    this.showState("viewfinder");
    this.startCamera();
  }

  showState(state) {
    if (this.viewfinderCard) this.viewfinderCard.style.display = state === "viewfinder" ? "block" : "none";
    if (this.loadingContainer) this.loadingContainer.style.display = state === "loading" ? "block" : "none";
    if (this.resultContainer) this.resultContainer.style.display = state === "result" ? "block" : "none";
    if (this.errorContainer) this.errorContainer.style.display = state === "error" ? "block" : "none";
  }
}

window.cameraManager = new CameraManager();
