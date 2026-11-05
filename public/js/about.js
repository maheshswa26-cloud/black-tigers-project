/**
 * Vizag Go - About Screen & Stats Manager
 * Handles Team metadata, Problem/Solution pitch, Why It Matters facts, CSR model, and Clear Data button.
 * Team: black tigers
 */

class AboutManager {
  constructor() {
    this.statActiveRadarsEl = null;
    this.statMappedEl = null;
    this.statVerifiedEl = null;
    this.statPreventedEl = null;
  }

  init() {
    this.statActiveRadarsEl = document.getElementById("stat-active-radars");
    this.statMappedEl = document.getElementById("stat-issues-mapped");
    this.statVerifiedEl = document.getElementById("stat-issues-verified");
    this.statPreventedEl = document.getElementById("stat-duplicates-prevented");

    this.bindButtons();
    this.updateStats();
  }

  bindButtons() {
    const clearBtn = document.getElementById("btn-clear-my-data");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.handleClearData());
    }

    const openKeySettingsBtn = document.getElementById("btn-open-key-settings");
    if (openKeySettingsBtn) {
      openKeySettingsBtn.addEventListener("click", () => this.openKeyModal());
    }
  }

  updateStats() {
    const stats = window.dataManager.getStats();
    if (this.statActiveRadarsEl) this.statActiveRadarsEl.textContent = stats.dailyActiveRadars.toLocaleString();
    if (this.statMappedEl) this.statMappedEl.textContent = stats.issuesMapped.toLocaleString();
    if (this.statVerifiedEl) this.statVerifiedEl.textContent = stats.issuesVerified.toLocaleString();
    if (this.statPreventedEl) this.statPreventedEl.textContent = stats.duplicatesPrevented.toLocaleString();

    // Also update result screen stats strip
    const resActive = document.getElementById("result-stat-active");
    const resMapped = document.getElementById("result-stat-mapped");
    const resVerified = document.getElementById("result-stat-verified");
    if (resActive) resActive.textContent = stats.dailyActiveRadars.toLocaleString();
    if (resMapped) resMapped.textContent = stats.issuesMapped.toLocaleString();
    if (resVerified) resVerified.textContent = stats.issuesVerified.toLocaleString();
  }

  handleClearData() {
    const confirmMsg = window.i18n.t("clearConfirm");
    if (window.confirm(confirmMsg)) {
      window.dataManager.clearMyData();
      
      // Refresh all views
      if (window.radarMap) window.radarMap.renderPins();
      if (window.issuesManager) window.issuesManager.render();
      this.updateStats();
      
      if (window.app) {
        window.app.updateXP();
        window.app.showToast(window.i18n.t("dataCleared"));
      }
    }
  }

  openKeyModal() {
    const modal = document.getElementById("api-key-modal");
    if (modal) modal.classList.add("active");
  }

  closeKeyModal() {
    const modal = document.getElementById("api-key-modal");
    if (modal) modal.classList.remove("active");
  }

  async saveApiKey(key) {
    try {
      const res = await fetch("/api/set-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key })
      });
      const data = await res.json();
      if (data.success) {
        if (window.app) window.app.showToast(key ? "Gemini API Key activated on server!" : "API Key cleared");
        this.closeKeyModal();
        this.checkKeyStatus();
      }
    } catch (e) {
      alert("Failed to update API key on server: " + e.message);
    }
  }

  async checkKeyStatus() {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      const statusPill = document.getElementById("key-status-indicator");
      if (statusPill) {
        if (data.hasGeminiKey) {
          statusPill.innerHTML = `🟢 Live Gemini Cloud Key: <span style="font-family:monospace">${data.keyMasked}</span>`;
          statusPill.style.color = "var(--neon-green)";
        } else {
          statusPill.innerHTML = `⚪ Built-in Vision AI Engine Active (Click to connect live Gemini Key)`;
          statusPill.style.color = "var(--text-secondary)";
        }
      }
    } catch (e) {
      console.warn("Could not fetch server status:", e);
    }
  }
}

window.aboutManager = new AboutManager();
