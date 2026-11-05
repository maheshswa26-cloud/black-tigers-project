/**
 * Vizag Go - Data Manager & Sample Records
 * Handles localStorage persistence, pre-loaded sample records, upvotes, and clear data.
 * Team: black tigers
 */

const STORAGE_KEY = "vizag_go_hazards_v2"; // v2 with updated precise coordinates
const XP_STORAGE_KEY = "vizag_go_user_xp_v1";
const UPVOTED_KEY = "vizag_go_upvoted_ids_v1";

// Default pre-loaded sample records matching the exact user specification
const SAMPLE_RECORDS = [
  {
    id: "sample_1",
    title: "Pothole at Rushikonda Road",
    category: "Roads & Potholes",
    severity: "High",
    locationName: "Rushikonda Corridor",
    lat: 17.833335,
    lng: 83.332287,
    upvotes: 12,
    isSample: true,
    reportedAt: "2 hours ago",
    description: "Deep asphalt cavity in the feeder carriage lane causing sudden vehicle braking and two-wheeler skids.",
    actionRecommendation: "GVMC Engineering Wing to deploy cold-mix bituminous patch work immediately.",
    imageUrl: "assets/pothole.svg"
  },
  {
    id: "sample_2",
    title: "Overflowing garbage",
    category: "Sanitation & Garbage",
    severity: "Medium",
    locationName: "Rushikonda Beach Road",
    lat: 17.819620,
    lng: 83.355207,
    upvotes: 5,
    isSample: true,
    reportedAt: "4 hours ago",
    description: "Unattended municipal dump bins overflowing across pedestrian sidewalk, attracting stray animals.",
    actionRecommendation: "GVMC Public Health team to route dumper placer compactor truck for clearance.",
    imageUrl: "assets/garbage.svg"
  },
  {
    id: "sample_3",
    title: "Fallen tree on Beach Road",
    category: "Public Safety",
    severity: "High",
    locationName: "Beach Road near RK Beach",
    lat: 17.712,
    lng: 83.331,
    upvotes: 24,
    isSample: true,
    reportedAt: "5 hours ago",
    description: "Large banyan branch snapped by heavy coastal winds blocking northbound carriage-way towards Submarine Museum.",
    actionRecommendation: "GVMC Disaster Management Wing to clear branch with motorized chainsaws.",
    imageUrl: "assets/fallen-tree.svg"
  },
  {
    id: "sample_4",
    title: "Broken pipe leaking",
    category: "Water & Drainage",
    severity: "Medium",
    locationName: "Yendada Junction",
    lat: 17.827616,
    lng: 83.329883,
    upvotes: 8,
    isSample: true,
    reportedAt: "6 hours ago",
    description: "Potable water distribution pipeline fractured at valve chamber, gushing clean drinking water across the road.",
    actionRecommendation: "GVMC Water Works wing to isolate distribution valve and repair pipeline collar joint.",
    imageUrl: "assets/pipe-leak.svg"
  },
  {
    id: "sample_5",
    title: "Streetlight out",
    category: "Electrical & Lighting",
    severity: "Medium",
    locationName: "PM Palem Main Road",
    lat: 17.839055,
    lng: 83.333145,
    upvotes: 2,
    isSample: true,
    reportedAt: "1 day ago",
    description: "Cluster of sodium vapor streetlights dark after 7 PM, creating danger for night commuters.",
    actionRecommendation: "GVMC Electrical wing to inspect local timer switch and replace LED driver units.",
    imageUrl: "assets/streetlight.svg"
  },
  {
    id: "sample_6",
    title: "Dead animal on Highway NH16",
    category: "Public Safety",
    severity: "Medium",
    locationName: "Highway NH16 near Gajuwaka",
    lat: 17.761,
    lng: 83.220,
    upvotes: 1,
    isSample: true,
    reportedAt: "1 day ago",
    description: "Stray animal carcass on median lane creating severe visual distraction and high-speed collision risk.",
    actionRecommendation: "GVMC Sanitation Veterinary Unit to safely retrieve and dispose carcass.",
    imageUrl: "assets/dead-animal.svg"
  },
  {
    id: "sample_7",
    title: "Blocked drain",
    category: "Water & Drainage",
    severity: "High",
    locationName: "Stadium Road, PM Palem",
    lat: 17.834479,
    lng: 83.328854,
    upvotes: 15,
    isSample: true,
    reportedAt: "1 day ago",
    description: "Major stormwater culvert choked with commercial single-use plastic waste causing sewage backflow onto road.",
    actionRecommendation: "GVMC Mechanical Desilting team to deploy suction machine and unclog culvert.",
    imageUrl: "assets/drain.svg"
  },
  {
    id: "sample_8",
    title: "Missing manhole cover",
    category: "Public Safety",
    severity: "High",
    locationName: "PM Palem Sector 2",
    lat: 17.833499,
    lng: 83.325764,
    upvotes: 30,
    isSample: true,
    reportedAt: "2 days ago",
    description: "Deep open chamber completely exposed at pedestrian crossing. High risk of fatal falls for students and commuters.",
    actionRecommendation: "Install reinforced concrete manhole cover immediately; place warning barricades.",
    imageUrl: "assets/manhole.svg"
  },
  {
    id: "sample_9",
    title: "Illegal dumping",
    category: "Sanitation & Garbage",
    severity: "Medium",
    locationName: "Rushikonda Hill Route",
    lat: 17.833499,
    lng: 83.329883,
    upvotes: 4,
    isSample: true,
    reportedAt: "2 days ago",
    description: "Construction debris and plastic bags dumped covertly along the scenic hill route towards beach.",
    actionRecommendation: "GVMC Vigilance squad to inspect site, issue notice to violators, and clear debris.",
    imageUrl: "assets/illegal-dump.svg"
  },
  {
    id: "sample_10",
    title: "Broken pedestrian signal",
    category: "Traffic & Signals",
    severity: "Medium",
    locationName: "Jagadamba Junction",
    lat: 17.711,
    lng: 83.301,
    upvotes: 9,
    isSample: true,
    reportedAt: "3 days ago",
    description: "Pedestrian push-button crossing signal head shattered; countdown timer non-responsive during rush hours.",
    actionRecommendation: "GVMC Traffic Police Engineering cell to replace LED display panel and recalibrate signal.",
    imageUrl: "assets/signal.svg"
  }
];

class DataManager {
  constructor() {
    this.hazards = [];
    this.upvotedIds = new Set();
    this.userXP = 0;
    this.init();
  }

  init() {
    // Load hazards from localStorage or initialize with updated sample records
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.hazards = JSON.parse(stored);
      } else {
        this.hazards = JSON.parse(JSON.stringify(SAMPLE_RECORDS));
        this.save();
      }
    } catch (e) {
      console.warn("Error reading localStorage, using sample records:", e);
      this.hazards = JSON.parse(JSON.stringify(SAMPLE_RECORDS));
    }

    // Load upvoted tracking
    try {
      const upvoted = localStorage.getItem(UPVOTED_KEY);
      if (upvoted) {
        this.upvotedIds = new Set(JSON.parse(upvoted));
      }
    } catch (e) {
      this.upvotedIds = new Set();
    }

    // Load user XP
    try {
      const xp = localStorage.getItem(XP_STORAGE_KEY);
      this.userXP = xp ? parseInt(xp, 10) : 40; // Starts with 40 starter XP (Level 1 Scout)
    } catch (e) {
      this.userXP = 40;
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.hazards));
    } catch (e) {
      console.error("Failed to save hazards to localStorage:", e);
    }
  }

  saveUpvotes() {
    try {
      localStorage.setItem(UPVOTED_KEY, JSON.stringify(Array.from(this.upvotedIds)));
    } catch (e) {
      console.error("Failed to save upvotes:", e);
    }
  }

  saveXP() {
    try {
      localStorage.setItem(XP_STORAGE_KEY, this.userXP.toString());
    } catch (e) {
      console.error("Failed to save XP:", e);
    }
  }

  getAllHazards() {
    return [...this.hazards];
  }

  getHazardById(id) {
    return this.hazards.find(h => h.id === id);
  }

  hasUpvoted(id) {
    return this.upvotedIds.has(id);
  }

  toggleUpvote(id) {
    const hazard = this.getHazardById(id);
    if (!hazard) return { success: false };

    const alreadyUpvoted = this.upvotedIds.has(id);
    if (alreadyUpvoted) {
      hazard.upvotes = Math.max(0, hazard.upvotes - 1);
      this.upvotedIds.delete(id);
      this.userXP = Math.max(0, this.userXP - 10);
    } else {
      hazard.upvotes += 1;
      this.upvotedIds.add(id);
      this.userXP += 10; // +10 XP for civic verification!
    }

    this.save();
    this.saveUpvotes();
    this.saveXP();

    return {
      success: true,
      hazard,
      upvoted: !alreadyUpvoted,
      upvotes: hazard.upvotes,
      newXP: this.userXP
    };
  }

  addHazard(newHazard) {
    const record = {
      id: "hazard_" + Date.now(),
      title: newHazard.title || "Civic Hazard",
      category: newHazard.category || "Public Safety",
      severity: newHazard.severity || "Medium",
      locationName: newHazard.locationName || "Visakhapatnam",
      lat: newHazard.lat || 17.833,
      lng: newHazard.lng || 83.332,
      upvotes: 1, // Submitter auto-upvotes
      isSample: false,
      reportedAt: "Just now",
      description: newHazard.description || "Reported via Vizag Go AI Camera.",
      actionRecommendation: newHazard.actionRecommendation || "GVMC field inspection required.",
      imageUrl: newHazard.imageUrl || "assets/hazard-generic.svg",
      notes: newHazard.notes || ""
    };

    // Auto upvote user's own submission
    this.upvotedIds.add(record.id);
    this.userXP += 25; // +25 XP for pinning a new hazard!

    this.hazards.unshift(record);
    this.save();
    this.saveUpvotes();
    this.saveXP();

    return { record, newXP: this.userXP };
  }

  clearMyData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("vizag_go_hazards_v1");
      localStorage.removeItem(UPVOTED_KEY);
      localStorage.removeItem(XP_STORAGE_KEY);
    } catch (e) {
      console.warn("Error clearing localStorage:", e);
    }
    this.hazards = JSON.parse(JSON.stringify(SAMPLE_RECORDS));
    this.upvotedIds.clear();
    this.userXP = 40;
    this.save();
    return true;
  }

  getStats() {
    const total = this.hazards.length;
    // Verified = upvotes >= 5
    const verified = this.hazards.filter(h => h.upvotes >= 5).length;
    // Estimated duplicates prevented: sum of upvotes on all issues
    const duplicatesPrevented = this.hazards.reduce((acc, curr) => acc + Math.max(0, curr.upvotes - 1), 0);
    return {
      dailyActiveRadars: 1420,
      issuesMapped: total,
      issuesVerified: verified,
      duplicatesPrevented: duplicatesPrevented
    };
  }

  getUserRank() {
    if (this.userXP >= 150) return { rank: "Vizag Chief Sentinel", level: 4, icon: "👑" };
    if (this.userXP >= 90) return { rank: "Civic Vanguard", level: 3, icon: "🛡️" };
    if (this.userXP >= 50) return { rank: "Radar Scout II", level: 2, icon: "⚡" };
    return { rank: "Radar Scout I", level: 1, icon: "🌱" };
  }
}

// Global instance
window.dataManager = new DataManager();
