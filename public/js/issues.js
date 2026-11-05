/**
 * Vizag Go - Issue Cards & Upvote Manager
 * Renders crowdsourced hazard cards with photo, AI title, and big "+1 I see this too" button.
 * Team: black tigers
 */

class IssuesManager {
  constructor() {
    this.container = null;
    this.activeTab = "all";
  }

  init() {
    this.container = document.getElementById("issues-grid-container");
    this.setupTabs();
    this.render();
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll(".issues-tab-btn");
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeTab = btn.getAttribute("data-tab") || "all";
        this.render();
      });
    });
  }

  render() {
    if (!this.container) return;

    const hazards = window.dataManager.getAllHazards();
    const filtered = hazards.filter(h => {
      if (this.activeTab === "verified") return h.upvotes >= 5;
      if (this.activeTab === "urgent") return h.severity === "High";
      return true;
    });

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🛡️</div>
          <h3 class="empty-title">${window.i18n.t("emptyIssues")}</h3>
          <p class="empty-desc">No hazards found under this filter. Be the first to scan and pin an issue!</p>
          <button class="btn-primary-big" style="max-width:280px; margin:1rem auto 0 auto;" onclick="window.app.switchScreen('camera')">
            ${window.i18n.t("btnScanHazard")}
          </button>
        </div>
      `;
      return;
    }

    this.container.innerHTML = filtered.map(h => {
      const upvoted = window.dataManager.hasUpvoted(h.id);
      const isVerified = h.upvotes >= 5;
      const progressPercent = Math.min(100, Math.round((h.upvotes / 10) * 100));
      const sevClass = `severity-${h.severity.toLowerCase()}`;

      return `
        <article class="issue-card" id="card-${h.id}">
          <div class="issue-card-media">
            <img src="${h.imageUrl}" alt="${h.title}" loading="lazy" onerror="this.src='assets/hazard-generic.svg'"/>
            ${h.isSample ? `<span class="sample-tag">${window.i18n.t("sampleBadge")}</span>` : ''}
            <span class="issue-severity-pill ${sevClass}">${h.severity.toUpperCase()}</span>
          </div>

          <div class="issue-card-body">
            <div class="issue-meta-row">
              <span class="issue-category-text">🏷️ ${h.category}</span>
              <span>🕒 ${h.reportedAt}</span>
            </div>

            <h3 class="issue-card-title">${h.title}</h3>

            <div class="issue-location-row">
              <span>📍 ${h.locationName}</span>
              <small style="font-family:monospace; color:var(--text-muted);">(${h.lat.toFixed(3)}, ${h.lng.toFixed(3)})</small>
            </div>

            <p class="issue-desc">${h.description}</p>

            <!-- Verification & Duplicate Prevention Meter -->
            <div class="issue-verify-progress">
              <div class="progress-header">
                <span>🛡️ ${isVerified ? window.i18n.t("verifiedBadge") : "Community Verification"}</span>
                <span style="color:var(--neon-green); font-family:monospace;">${h.upvotes} / 10 Goal</span>
              </div>
              <div class="progress-track" title="${h.upvotes} citizens verified this issue">
                <div class="progress-bar" style="width: ${progressPercent}%;"></div>
              </div>
              <div style="font-size:0.75rem; color:var(--radar-cyan); margin-top:4px;">
                ⚡ ${window.i18n.t("duplicatePrevented")} (${h.upvotes} citizens aligned)
              </div>
            </div>

            <!-- Big Action Button: Upvote -->
            <button 
              class="btn-upvote ${upvoted ? 'upvoted' : ''}" 
              onclick="window.issuesManager.handleUpvote('${h.id}')"
              aria-label="Upvote this hazard: ${h.title}"
            >
              <span>${upvoted ? '✓' : '👍'}</span>
              <span>${upvoted ? window.i18n.t("btnUpvoted") : window.i18n.t("btnUpvote")}</span>
              <span style="background:rgba(255,255,255,0.15); padding:2px 8px; border-radius:12px; font-size:0.85rem;">
                ${h.upvotes}
              </span>
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  handleUpvote(id) {
    const res = window.dataManager.toggleUpvote(id);
    if (res.success) {
      this.render();
      if (window.radarMap) {
        window.radarMap.renderPins();
      }
      if (window.aboutManager) {
        window.aboutManager.updateStats();
      }
      if (window.app) {
        window.app.updateXP();
        window.app.showToast(res.upvoted ? "👍 +1 Civic Upvote added! (+10 XP)" : "Upvote removed");
      }
    }
  }
}

window.issuesManager = new IssuesManager();
