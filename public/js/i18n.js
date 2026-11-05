/**
 * Vizag Go - Internationalization (English / Telugu)
 * Provides seamless English / Telugu translation toggle.
 * Team: black tigers
 */

const TRANSLATIONS = {
  en: {
    // Nav
    appName: "Vizag Go",
    tagline: "Civic Radar",
    navRadar: "Radar Map",
    navCamera: "AI Camera",
    navIssues: "Issue Cards",
    navAbout: "About",
    levelPrefix: "Lvl",
    
    // Home / Hero
    heroHeadline: "A gamified civic radar that crowdsources local hazards to prevent duplicate complaints.",
    heroSub: "For daily commuters who face civic hazards, Vizag Go is a map-based reporting tool that plots nearby problems on a real-time radar. Unlike official government portals, we use crowdsourced visibility to prevent duplicate reports and build community transparency.",
    
    // Stats
    statIvrsTitle: "Toll-Free IVRS (1800-4250-0009)",
    statIvrsSub: "GVMC voice line lacks visual proof and location coordinates.",
    statSpandanaTitle: "Monday Spandana Meetings",
    statSpandanaSub: "In-person grievances take hours; same pothole reported repeatedly.",
    statDuplicateTitle: "Duplicate Reporting (ESTIMATE)",
    statDuplicateSub: "Up to 40% of municipal tickets are duplicates without a public radar.",

    // Radar Map
    radarLive: "CIVIC RADAR ACTIVE",
    filterAll: "All Hazards",
    filterRoads: "Roads",
    filterSanitation: "Sanitation",
    filterElectrical: "Electrical",
    filterWater: "Water & Drain",
    filterSafety: "Safety",
    btnScanHazard: "⚡ Scan New Hazard",
    btnViewIssue: "View Details (+1)",
    sampleBadge: "SAMPLE",
    youAreHere: "You are here (Live GPS)",

    // Camera
    cameraTitle: "AI Civic Viewfinder",
    cameraSubtitle: "Snap a photo of the hazard. Gemini AI will auto-generate title & category.",
    captureButton: "📸 Capture & Analyze with Gemini",
    locationPreview: "Location Preview:",
    placeholderNotes: "Quick notes (e.g., light dead, broken road, leaking valve)...",
    orSelectPreset: "Or pick a realistic test hazard:",
    analyzingState: "Gemini AI is analyzing hazard photo...",
    analyzingSub: "Auto-detecting category, severity, and municipal recommendations...",
    aiTitleLabel: "AI Title",
    aiCategoryLabel: "Category",
    aiSeverityLabel: "Severity",
    aiDescLabel: "Inspection Summary",
    aiActionLabel: "GVMC Action Recommended",
    btnConfirmPin: "📍 Confirm & Pin to Civic Radar (+25 XP)",
    btnRetake: "🔄 Retake Photo",
    btnTryAgain: "🔄 Try Again",
    cameraErrorTitle: "Analysis Failed",
    cameraErrorMsg: "Could not categorize the image. Please verify your photo or try again.",

    // Issues
    issuesTitle: "Crowdsourced Hazard Radar",
    issuesSubtitle: "Upvote existing issues so GVMC knows the true community priority and doesn't get flooded with duplicate tickets.",
    tabAll: "All Issues",
    tabVerified: "Verified (5+ Upvotes)",
    tabUrgent: "High Priority",
    btnUpvote: "👍 I see this too (+1)",
    btnUpvoted: "✓ Verified by You (+1)",
    duplicatePrevented: "Duplicate Spandana ticket prevented!",
    verifiedBadge: "GVMC Priority Verified",
    emptyIssues: "No hazards found in this filter.",

    // About & Why it matters
    aboutHeader: "About Vizag Go",
    teamName: "Team: black tigers",
    place: "Visakhapatnam, Andhra Pradesh, India",
    targetUsers: "Users: Tech-savvy college students & young professionals (18–28)",
    pitchTitle: "Our Pitch",
    pitchBody: "A gamified, Pokémon Go-style civic radar that publicly maps local issues to prevent duplicate reporting and build transparency.",
    problemTitle: "The Problem We Solve",
    problemBody: "Citizens and GVMC waste time on duplicate, unverified complaints because there is no shared, location-based public map of local issues.",
    solutionTitle: "Our Solution",
    solutionBody: "For daily commuters who face civic hazards, Vizag Go is a map-based reporting tool that plots nearby problems on a real-time radar. Unlike official government portals, we use crowdsourced visibility to prevent duplicate reports and build community transparency.",
    differentTitle: "What Makes Us Different",
    differentBody: "None provide a publicly visible, real-time map of local issues to prevent duplicate reporting.",
    businessTitle: "Who Pays Later (B2G / CSR Model)",
    businessBody: "Local corporations (CSR) or Government (B2G) via CSR Sponsorship at ₹2,00,000/year per sponsor.",
    
    // Live stats strip
    statsStripHeading: "Civic Impact Radar",
    statActiveRadars: "Daily Active Radars",
    statIssuesMapped: "Issues Mapped",
    statIssuesVerified: "Issues Verified",
    statDupsPrevented: "Duplicates Prevented",
    btnClearData: "🗑️ Clear My Data (Reset to Samples)",
    clearConfirm: "Are you sure you want to reset all data back to the default 10 sample records?",
    dataCleared: "Data reset to default sample records."
  },
  te: {
    // Nav
    appName: "వైజాగ్ గో",
    tagline: "సివిక్ రాడార్",
    navRadar: "రాడార్ మ్యాప్",
    navCamera: "AI కెమెరా",
    navIssues: "సమస్యల కార్డులు",
    navAbout: "గురించి",
    levelPrefix: "స్థాయి",
    
    // Home / Hero
    heroHeadline: "నకిలీ ఫిర్యాదులను నివారించడానికి స్థానిక ప్రమాదాలను క్రౌడ్‌సోర్స్ చేసే గేమిఫైడ్ సివిక్ రాడార్.",
    heroSub: "రోజూ ప్రయాణించే పౌరుల కోసం, వైజాగ్ గో అనేది స్థానిక సమస్యలను నిజ-సమయ రాడార్‌లో చూపించే మ్యాప్ ఆధారిత సాధనం. అధికారిక ప్రభుత్వ పోర్టల్‌ల వలె కాకుండా, పారదర్శకతను పెంచడానికి మేము పబ్లిక్ మ్యాప్‌ను అందిస్తాము.",
    
    // Stats
    statIvrsTitle: "టోల్-ఫ్రీ IVRS (1800-4250-0009)",
    statIvrsSub: "GVMC వాయిస్ కాల్‌లో ఫోటో లేదా కచ్చితమైన స్థాన వివరాలు ఉండవు.",
    statSpandanaTitle: "సోమవారం స్పందన సమావేశాలు",
    statSpandanaSub: "ఫిర్యాదు క్యూలు గంటల తరబడి ఉంటాయి; ఒకే గుంతపై పదే పదే ఫిర్యాదులు వస్తాయి.",
    statDuplicateTitle: "డూప్లికేట్ రిపోర్టింగ్ (అంచనా)",
    statDuplicateSub: "పబ్లిక్ డాష్‌బోర్డ్ లేకపోవడం వల్ల 40% ఫిర్యాదులు డూప్లికేట్ అవుతున్నాయి.",

    // Radar Map
    radarLive: "సివిక్ రాడార్ యాక్టివ్",
    filterAll: "అన్ని సమస్యలు",
    filterRoads: "రహదారులు",
    filterSanitation: "పారిశుధ్యం",
    filterElectrical: "విద్యుత్",
    filterWater: "తాగునీరు / డ్రెయిన్",
    filterSafety: "ప్రజా రక్షణ",
    btnScanHazard: "⚡ కొత్త సమస్యను స్కాన్ చేయండి",
    btnViewIssue: "వివరాలు చూడండి (+1)",
    sampleBadge: "నమూనా",
    youAreHere: "మీరు ఇక్కడ ఉన్నారు (లైవ్ GPS)",

    // Camera
    cameraTitle: "AI సివిక్ వ్యూఫైండర్",
    cameraSubtitle: "సమస్య ఫోటో తీయండి. జెమినీ AI శీర్షిక మరియు వర్గాన్ని స్వయంచాలకంగా నిర్ణయిస్తుంది.",
    captureButton: "📸 జెమినీ AI తో విశ్లేషించండి",
    locationPreview: "స్థాన వివరాలు:",
    placeholderNotes: "చిన్న నోట్ (ఉదా: లైట్ పనిచేయట్లేదు, రోడ్డు గుంత, నీటి లీకేజీ)...",
    orSelectPreset: "లేదా నమూనా ప్రమాదాన్ని ఎంచుకోండి:",
    analyzingState: "జెమినీ AI ఫోటోను విశ్లేషిస్తోంది...",
    analyzingSub: "వర్గం, తీవ్రత మరియు GVMC చర్యలను లెక్కిస్తోంది...",
    aiTitleLabel: "AI శీర్షిక",
    aiCategoryLabel: "వర్గం",
    aiSeverityLabel: "తీవ్రత",
    aiDescLabel: "పరిశీలన సారాంశం",
    aiActionLabel: "GVMC సిఫార్సు చేసిన చర్య",
    btnConfirmPin: "📍 రాడార్‌లో పిన్ చేయండి (+25 XP)",
    btnRetake: "🔄 మళ్ళీ ఫోటో తీయండి",
    btnTryAgain: "🔄 మళ్ళీ ప్రయత్నించండి",
    cameraErrorTitle: "విశ్లేషణ విఫలమైంది",
    cameraErrorMsg: "చిత్రాన్ని వర్గీకరించలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.",

    // Issues
    issuesTitle: "ప్రజా సమస్యల రాడార్",
    issuesSubtitle: "ఒకే సమస్యపై డూప్లికేట్ ఫిర్యాదులు రాకుండా ఇప్పటికే ఉన్న సమస్యలకు మద్దతు (+1) తెలపండి.",
    tabAll: "అన్ని సమస్యలు",
    tabVerified: "ధృవీకరించబడినవి (5+ ఓట్లు)",
    tabUrgent: "అత్యవసరం",
    btnUpvote: "👍 నేను కూడా చూశాను (+1)",
    btnUpvoted: "✓ మీరు ధృవీకరించారు (+1)",
    duplicatePrevented: "డూప్లికేట్ స్పందన ఫిర్యాదు నివారించబడింది!",
    verifiedBadge: "GVMC ప్రాధాన్యత హెచ్చరిక",
    emptyIssues: "ఈ ఫిల్టర్‌లో సమస్యలు కనుగొనబడలేదు.",

    // About & Why it matters
    aboutHeader: "వైజాగ్ గో గురించి",
    teamName: "టీమ్: black tigers",
    place: "విశాఖపట్నం, ఆంధ్రప్రదేశ్, భారతదేశం",
    targetUsers: "వినియోగదారులు: టెక్ విద్యార్థులు మరియు యువ ఉద్యోగులు (18–28)",
    pitchTitle: "మా పిచ్",
    pitchBody: "నకిలీ ఫిర్యాదులను నివారించడానికి మరియు పారదర్శకతను పెంచడానికి స్థానిక సమస్యలను పబ్లిక్‌గా మ్యాప్ చేసే పోకీమాన్ గో-శైలి సివిక్ రాడార్.",
    problemTitle: "మేము పరిష్కరించే సమస్య",
    problemBody: "పౌరులు మరియు GVMC నకిలీ, ధృవీకరించని ఫిర్యాదులపై సమయాన్ని వృధా చేస్తారు ఎందుకంటే స్థానిక సమస్యల కోసం పంచుకున్న, స్థాన-ఆధారిత పబ్లిక్ మ్యాప్ లేదు.",
    solutionTitle: "మా పరిష్కారం",
    solutionBody: "సివిక్ ప్రమాదాలను ఎదుర్కొనే రోజువారీ ప్రయాణికుల కోసం, వైజాగ్ గో అనేది రియల్-టైమ్ రాడార్‌లో సమీపంలోని సమస్యలను చూపే సాధనం. అధికారిక ప్రభుత్వ పోర్టల్‌ల వలె కాకుండా, నకిలీ నివేదికలను నిరోధించడానికి మేము పబ్లిక్ మ్యాప్‌ను ఉపయోగిస్తాము.",
    differentTitle: "మా ప్రత్యేకత",
    differentBody: "నకిలీ రిపోర్టింగ్‌ను నిరోధించడానికి స్థానిక సమస్యల యొక్క పబ్లిక్, రియల్-టైమ్ మ్యాప్‌ను ఎవరూ అందించరు.",
    businessTitle: "భవిష్యత్తు నిధులు (B2G / CSR మోడల్)",
    businessBody: "స్థానిక కార్పొరేట్లు (CSR) లేదా ప్రభుత్వం ద్వారా స్పాన్సర్‌కు సంవత్సరానికి ₹2,00,000.",
    
    // Live stats strip
    statsStripHeading: "సివిక్ ప్రభావ రాడార్",
    statActiveRadars: "రోజువారీ యాక్టివ్ రాడార్లు",
    statIssuesMapped: "మ్యాప్ చేసిన సమస్యలు",
    statIssuesVerified: "ధృవీకరించబడిన సమస్యలు",
    statDupsPrevented: "నివారించిన డూప్లికేట్లు",
    btnClearData: "🗑️ నా డేటాను క్లియర్ చేయండి",
    clearConfirm: "మీరు నిజంగా మొత్తం డేటాను రీసెట్ చేసి 10 డిఫాల్ట్ నమూనాలను పునరుద్ధరించాలనుకుంటున్నారా?",
    dataCleared: "డేటా డిఫాల్ట్ నమూనా రికార్డులకు రీసెట్ చేయబడింది."
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem("vizag_go_lang") || "en";
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      localStorage.setItem("vizag_go_lang", lang);
      this.updateDOM();
    }
  }

  toggle() {
    const next = this.currentLang === "en" ? "te" : "en";
    this.setLang(next);
    return next;
  }

  t(key) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  updateDOM() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const text = this.t(key);
      if (text) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.setAttribute("placeholder", text);
        } else {
          el.textContent = text;
        }
      }
    });

    // Update html lang attribute
    document.documentElement.lang = this.currentLang;
    
    // Update language toggle buttons
    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) {
      langBtn.textContent = this.currentLang === "en" ? "తెలుగు" : "English";
    }
  }
}

window.i18n = new I18nManager();
