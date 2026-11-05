/**
 * Vizag Go - Main Application Orchestrator
 * Controls screen routing, language switching, XP gamification, and user notifications.
 * Team: black tigers
 */

class VizagGoApp {
  constructor() {
    this.currentScreen = "radar";
  }

  init() {
    // Initialize i18n
    window.i18n.updateDOM();

    // Bind Navigation tabs
    this.bindNavigation();

    // Bind Language toggle button
    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        window.i18n.toggle();
        if (window.issuesManager) window.issuesManager.render();
        if (window.radarMap) window.radarMap.renderPins();
        this.updateXP();
      });
    }

    // Initialize Subsystems
    if (window.radarMap) window.radarMap.init();
    if (window.cameraManager) window.cameraManager.init();
    if (window.issuesManager) window.issuesManager.init();
    if (window.aboutManager) {
      window.aboutManager.init();
      window.aboutManager.checkKeyStatus();
    }

    // Bind Main FAB Scan button
    const fabBtn = document.getElementById("fab-scan-btn");
    if (fabBtn) {
      fabBtn.addEventListener("click", () => {
        this.switchScreen("camera");
      });
    }

    // Bind API Key modal close
    const modalClose = document.getElementById("modal-close-btn");
    if (modalClose) {
      modalClose.addEventListener("click", () => window.aboutManager.closeKeyModal());
    }

    const modalSave = document.getElementById("btn-save-key");
    if (modalSave) {
      modalSave.addEventListener("click", () => {
        const input = document.getElementById("modal-key-input");
        if (input) window.aboutManager.saveApiKey(input.value.trim());
      });
    }

    // Hash routing support (e.g. #radar, #camera, #issues, #about)
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "") || "radar";
      this.switchScreen(hash, false);
    });

    // Check initial hash
    const initialHash = window.location.hash.replace("#", "") || "radar";
    this.switchScreen(initialHash, false);

    // Initial XP badge render
    this.updateXP();

    // Keyboard navigation helper (Esc closes modal)
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        window.aboutManager.closeKeyModal();
      }
    });
  }

  bindNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetScreen = btn.getAttribute("data-screen");
        this.switchScreen(targetScreen);
      });
    });

    const brandSection = document.getElementById("brand-section");
    if (brandSection) {
      brandSection.addEventListener("click", () => {
        this.switchScreen("radar");
      });
    }
  }

  switchScreen(screenName, updateHash = true) {
    const screens = ["radar", "camera", "issues", "about"];
    if (!screens.includes(screenName)) screenName = "radar";

    this.currentScreen = screenName;
    if (updateHash) {
      window.location.hash = screenName;
    }

    // Update screen elements
    screens.forEach(s => {
      const screenEl = document.getElementById(`screen-${s}`);
      if (screenEl) {
        if (s === screenName) {
          screenEl.classList.add("active");
        } else {
          screenEl.classList.remove("active");
        }
      }
    });

    // Update nav links active state
    document.querySelectorAll(".nav-btn").forEach(btn => {
      if (btn.getAttribute("data-screen") === screenName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Screen specific triggers
    if (screenName === "radar") {
      if (window.radarMap) {
        window.radarMap.invalidateSize();
      }
    } else if (screenName === "camera") {
      if (window.cameraManager) {
        window.cameraManager.startCamera();
      }
    } else {
      if (window.cameraManager) {
        window.cameraManager.stopCamera();
      }
    }

    if (screenName === "issues") {
      if (window.issuesManager) {
        window.issuesManager.render();
      }
    }

    if (screenName === "about") {
      if (window.aboutManager) {
        window.aboutManager.updateStats();
      }
    }

    // Scroll top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateXP() {
    const xpBadge = document.getElementById("user-xp-badge");
    const userRank = window.dataManager.getUserRank();
    if (xpBadge) {
      const prefix = window.i18n.t("levelPrefix");
      xpBadge.innerHTML = `<span>${userRank.icon}</span> <span>${prefix} ${userRank.level} (${window.dataManager.userXP} XP)</span>`;
      xpBadge.title = `${userRank.rank} - Earn XP by scanning hazards (+25) and verifying community issues (+10)`;
    }
  }

  showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Instantiate and start on DOM loaded
window.addEventListener("DOMContentLoaded", () => {
  window.app = new VizagGoApp();
  window.app.init();
});
