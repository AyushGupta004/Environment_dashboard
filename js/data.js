/**
 * EARTH FORWARD — NGO Environmental Intelligence & Action Platform
 * js/data.js — Core Data Access & Persistence Layer
 *
 * ARCHITECTURE RULE:
 * All data access goes through async functions in js/data.js:
 * getReports, getReportById, updateReportStatus, addReportNote,
 * assignReport, getAnalytics, getHotspots, getOrganizations, getFieldWorkers, resetDemoData.
 *
 * Functions return mock data merged with localStorage overlay so swapping
 * in fetch() calls later requires no UI changes.
 */

// 1. Mock organizations array (4 NGOs)
const organizations = [
  {
    id: 'ORG-01',
    name: 'Sankalp Environmental Foundation',
    alias: 'Yamuna Ecological Restoration Collective',
    acronym: 'SEF',
    lead: 'Dr. Arundhati Bose',
    email: 'contact@sankalp-eco.org',
    phone: '+91 11 2389 4410',
    focusAreas: ['Water Pollution', 'Sewage/Drainage', 'Industrial Emission'],
    jurisdiction: ['Delhi (East & North)', 'Ghaziabad (Hindon Basin)', 'Noida (Sector 128-150)'],
    activeFieldAgents: 14,
    verifiedActionsCount: 182,
    baselineReviewed: 154,
    baselineResolved: 96,
    baselineActive: 12,
    establishedYear: 2018,
    description: 'Monitors industrial effluent outfalls, drains, and safeguards Yamuna floodplain ecology through ground-truthing and remediation advocacy.'
  },
  {
    id: 'ORG-02',
    name: 'Green Earth Initiative',
    alias: 'NCR Clean Air & Climate Alliance',
    acronym: 'GEI',
    lead: 'Devendra Kumar Rathore',
    email: 'liaison@greenearth.org',
    phone: '+91 120 456 7812',
    focusAreas: ['Waste Burning', 'Crop Burning', 'Air Pollution', 'Vehicle Pollution'],
    jurisdiction: ['Ghaziabad', 'Noida (All Sectors)', 'East Delhi', 'Greater Noida West'],
    activeFieldAgents: 22,
    verifiedActionsCount: 310,
    baselineReviewed: 218,
    baselineResolved: 142,
    baselineActive: 18,
    establishedYear: 2016,
    description: 'Rapid-deployment NGO addressing open biomass burning, seasonal crop stubble fires, and localized industrial particulate plumes.'
  },
  {
    id: 'ORG-03',
    name: 'Clean Noida Network',
    alias: 'Greater Noida Eco-Action & Habitat Trust',
    acronym: 'CNN',
    lead: 'Vikramjit Singh Sandhu',
    email: 'action@cleannoida.org.in',
    phone: '+91 120 232 9904',
    focusAreas: ['Deforestation', 'Garbage Dumping', 'Plastic Waste', 'Water Pollution'],
    jurisdiction: ['Greater Noida (Alpha, Beta, Surajpur, Ecotech)', 'Yamuna Expressway Zone'],
    activeFieldAgents: 11,
    verifiedActionsCount: 144,
    baselineReviewed: 126,
    baselineResolved: 84,
    baselineActive: 9,
    establishedYear: 2020,
    description: 'Dedicated to conserving the Surajpur Wetland sanctuary rim, curbing illegal C&D debris dumping, and restoring indigenous vegetative buffers.'
  },
  {
    id: 'ORG-04',
    name: 'Eco Action Collective',
    alias: 'Delhi Green Habitat & Waste Watch',
    acronym: 'EAC',
    lead: 'Prof. Suniti Narayan',
    email: 'alerts@ecoaction.org',
    phone: '+91 11 2618 9033',
    focusAreas: ['Garbage Dumping', 'Plastic Waste', 'Sewage/Drainage', 'Industrial Emission'],
    jurisdiction: ['Delhi (South, West, Central)', 'Ghaziabad (Border Sectors)'],
    activeFieldAgents: 19,
    verifiedActionsCount: 228,
    baselineReviewed: 178,
    baselineResolved: 112,
    baselineActive: 14,
    establishedYear: 2017,
    description: 'Audits municipal unsegregated landfill perimeters, stormwater drain blockages, and toxic leachate leakage near vulnerable urban settlements.'
  }
];

// 2. Mock fieldWorkers array (5 specialists)
const fieldWorkers = [
  { id: 'FW-01', name: 'Dr. Radhika Sen', role: 'Senior Environmental Scientist', orgId: 'ORG-01', activeAssignments: 3, zone: 'Yamuna Khadar & Okhla' },
  { id: 'FW-02', name: 'Amitav Sharma', role: 'Field Verification Lead', orgId: 'ORG-02', activeAssignments: 5, zone: 'Sahibabad & Ghaziabad North' },
  { id: 'FW-03', name: 'Pooja Verma', role: 'Hydrological Quality Specialist', orgId: 'ORG-03', activeAssignments: 2, zone: 'Surajpur & Greater Noida' },
  { id: 'FW-04', name: 'Karan Malhotra', role: 'Community Action Coordinator', orgId: 'ORG-02', activeAssignments: 4, zone: 'Noida Sec 62-63 & Indirapuram' },
  { id: 'FW-05', name: 'Meera Nair', role: 'Air Quality & Emissions Analyst', orgId: 'ORG-04', activeAssignments: 2, zone: 'Anand Vihar & Ghazipur' }
];

// 3. 50 Realistic Citizen Reports Ingested for NGO Intelligence
const environmentalReports = [
  {
    id: 'REP-2026-001',
    title: 'Dense industrial smoke emission along Sector 63 corridor',
    category: 'Industrial Emission',
    city: 'Noida',
    location: 'Block H, Sector 63, Industrial Area',
    coordinates: [28.6254, 77.3789],
    severity: 'High',
    confidence: 0.94,
    status: 'Verified',
    verified: true,
    reportDate: '2026-06-12T08:30:00Z',
    submittedBy: 'Citizen Sentinel #4102',
    description: 'AI-detected suspected issue: heavy dark particulate plumes discharged from packaging unit after midnight. Ground verification confirmed non-functional wet scrubber.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Karan Malhotra',
    priority: 'High',
    dueDate: '2026-06-18',
    notes: [
      { id: 'N-1', author: 'Karan Malhotra', timestamp: '2026-06-14T11:20:00Z', text: 'Inspected site on June 14. Plume matches sensor PM2.5 surge of 380 ug/m3. Formal notice drafted for State Pollution Control Board.' }
    ],
    aiObservations: 'Optical drone analysis detects black plume opacity exceeding Ringelmann Scale No. 3. Suspected unregistered boiler fuel.',
    estimatedAffectedPopulation: 14500
  },
  {
    id: 'REP-2026-002',
    title: 'Biomass and dried leaf open combustion in park greenbelt',
    category: 'Waste Burning',
    city: 'Greater Noida',
    location: 'Near Golf Course periphery, Sector Alpha 1',
    coordinates: [28.4815, 77.5122],
    severity: 'Medium',
    confidence: 0.88,
    status: 'Action Initiated',
    verified: true,
    reportDate: '2026-06-15T17:45:00Z',
    submittedBy: 'Citizen Sentinel #1890',
    description: 'AI-detected suspected issue: localized heat anomaly and particulate cloud consistent with municipal horticulture waste burning near residential boundary.',
    organization: 'Greater Noida Eco-Action & Habitat Trust',
    assignedTo: 'Pooja Verma',
    priority: 'Medium',
    dueDate: '2026-06-22',
    notes: [
      { id: 'N-2', author: 'Pooja Verma', timestamp: '2026-06-17T09:15:00Z', text: 'Reached maintenance supervisor. Fire doused, on-site compost mulching alternative demonstrated.' }
    ],
    aiObservations: 'Thermal satellite sensor overlay registered 65°C surface anomaly. High confidence on organic matter burning.',
    estimatedAffectedPopulation: 3200
  },
  {
    id: 'REP-2026-003',
    title: 'Untreated chemical runoff pooling near stormwater outlet',
    category: 'Water Pollution',
    city: 'Ghaziabad',
    location: 'Site 4 Industrial Area, Sahibabad',
    coordinates: [28.6758, 77.3828],
    severity: 'High',
    confidence: 0.96,
    status: 'Verified',
    verified: true,
    reportDate: '2026-06-18T10:10:00Z',
    submittedBy: 'Citizen Sentinel #3301',
    description: 'AI-detected suspected issue: discolored turquoise discharge entering secondary stormwater drain feeding Hindon canal. Chemical odor reported by residents within 800m.',
    organization: 'Yamuna Ecological Restoration Collective',
    assignedTo: 'Amitav Sharma',
    priority: 'High',
    dueDate: '2026-06-25',
    notes: [
      { id: 'N-3', author: 'Amitav Sharma', timestamp: '2026-06-19T14:40:00Z', text: 'Water samples collected. pH reads 4.2 (highly acidic), heavy metals suspected. Awaiting state lab report.' }
    ],
    aiObservations: 'Spectral analysis indicates synthetic dye residue and depleted dissolved oxygen signature.',
    estimatedAffectedPopulation: 22000
  },
  {
    id: 'REP-2026-004',
    title: 'Illegal construction debris accumulation on vacant wetland buffer',
    category: 'Garbage Dumping',
    city: 'Greater Noida',
    location: 'Surajpur Wetland Buffer Zone, Sector Ecotech III',
    coordinates: [28.5280, 77.4952],
    severity: 'High',
    confidence: 0.91,
    status: 'Under Review',
    verified: false,
    reportDate: '2026-06-21T06:20:00Z',
    submittedBy: 'Citizen Sentinel #8294',
    description: 'AI-detected suspected issue: overnight dumping of concrete slabs, brick rubble, and plastic packaging threatening seasonal wading bird habitat. Requires field verification.',
    organization: 'Greater Noida Eco-Action & Habitat Trust',
    assignedTo: 'Pooja Verma',
    priority: 'High',
    dueDate: '2026-06-28',
    notes: [],
    aiObservations: 'Elevation differential modeling shows ~140 metric tons of inert debris deposited across 400 sq meters.',
    estimatedAffectedPopulation: 1800
  },
  {
    id: 'REP-2026-005',
    title: 'High particulate smog accumulation at major interstate junction',
    category: 'Air Pollution',
    city: 'Delhi',
    location: 'Anand Vihar ISBT & Railway Crossing Interchange',
    coordinates: [28.6472, 77.3155],
    severity: 'High',
    confidence: 0.97,
    status: 'Verified',
    verified: true,
    reportDate: '2026-06-25T19:00:00Z',
    submittedBy: 'Citizen Sentinel #7011',
    description: 'Continuous particulate spike where PM10 regularly exceeds 420 ug/m3 during peak commuter hours. AI-detected suspected issue aggregates road dust re-suspension and diesel idling.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Meera Nair',
    priority: 'High',
    dueDate: '2026-07-02',
    notes: [
      { id: 'N-4', author: 'Meera Nair', timestamp: '2026-06-27T16:00:00Z', text: 'Corroborated with DPCC Anand Vihar CAAQMS data. Submitting anti-smog mist cannon deployment proposal.' }
    ],
    aiObservations: 'Multi-source correlation shows particulate envelope trapped by railway overpass microclimate.',
    estimatedAffectedPopulation: 85000
  },
  {
    id: 'REP-2026-006',
    title: 'Single-use plastic scrap burning behind wholesale mandi',
    category: 'Plastic Waste',
    city: 'Ghaziabad',
    location: 'Sahibabad Vegetable Mandi Back Road',
    coordinates: [28.6675, 77.3690],
    severity: 'Medium',
    confidence: 0.85,
    status: 'Resolved',
    verified: true,
    reportDate: '2026-06-28T21:15:00Z',
    submittedBy: 'Citizen Sentinel #2099',
    description: 'AI-detected suspected issue: toxic plastic packaging film set on fire to reduce bulk waste. Smoldering dioxin odor reported by adjacent residential colony.',
    organization: 'Delhi Green Habitat & Waste Watch',
    assignedTo: 'Amitav Sharma',
    priority: 'Medium',
    dueDate: '2026-07-03',
    notes: [
      { id: 'N-5', author: 'Amitav Sharma', timestamp: '2026-06-30T10:30:00Z', text: 'Municipal sanitary inspector mobilized. Waste pile cleared; two dedicated segregation bins installed.' }
    ],
    aiObservations: 'Thermal image detected high-temperature localized flash point matching polyethylene combustion characteristics.',
    estimatedAffectedPopulation: 6700
  },
  {
    id: 'REP-2026-007',
    title: 'Rubble dumping along Yamuna floodplains embankment',
    category: 'Garbage Dumping',
    city: 'Noida',
    location: 'Embankment Road, Sector 128 / Asagarpur',
    coordinates: [28.5140, 77.3730],
    severity: 'High',
    confidence: 0.89,
    status: 'Under Review',
    verified: false,
    reportDate: '2026-07-01T14:30:00Z',
    submittedBy: 'Citizen Sentinel #5512',
    description: 'AI-detected suspected issue: systematic nighttime truck dumping of debris on active flood plain silt beds. Requires field verification and GPS geotag audit.',
    organization: 'Yamuna Ecological Restoration Collective',
    assignedTo: 'Dr. Radhika Sen',
    priority: 'High',
    dueDate: '2026-07-07',
    notes: [],
    aiObservations: 'Satellite visual comparison reveals 18% encroachment on natural soil absorption rim over 4 weeks.',
    estimatedAffectedPopulation: 9000
  },
  {
    id: 'REP-2026-008',
    title: 'Overflowing open sewer contaminating neighborhood groundwater',
    category: 'Sewage/Drainage',
    city: 'Delhi',
    location: 'Near Mangolpuri Phase 1 Trunk Line, North West Delhi',
    coordinates: [28.6942, 77.0851],
    severity: 'High',
    confidence: 0.92,
    status: 'Verified',
    verified: true,
    reportDate: '2026-07-03T11:05:00Z',
    submittedBy: 'Citizen Sentinel #4029',
    description: 'Uncovered sewer line blockage causing blackwater overflow into public street and unpaved ground. Water potability complaints in nearby borewells.',
    organization: 'Delhi Green Habitat & Waste Watch',
    assignedTo: 'Dr. Radhika Sen',
    priority: 'High',
    dueDate: '2026-07-09',
    notes: [
      { id: 'N-6', author: 'Dr. Radhika Sen', timestamp: '2026-07-05T13:10:00Z', text: 'Confirmed presence of high coliform in tap supply. Jal Board escalation filed under Urgent.' }
    ],
    aiObservations: 'Fluid spread area exceeds 650 sq meters; high pathogen exposure threat identified.',
    estimatedAffectedPopulation: 16000
  },
  {
    id: 'REP-2026-009',
    title: 'Commercial diesel delivery vans heavy idling and black exhaust',
    category: 'Vehicle Pollution',
    city: 'Ghaziabad',
    location: 'Mohan Nagar Transport Hub, GT Road',
    coordinates: [28.6792, 77.3991],
    severity: 'Medium',
    confidence: 0.78,
    status: 'AI Analyzed',
    verified: false,
    reportDate: '2026-07-05T07:45:00Z',
    submittedBy: 'Citizen Sentinel #1203',
    description: 'AI-detected suspected issue: sustained fleet idling with visible carbon blow-by across 40+ uncertified logistics vehicles during cargo unloading.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: null,
    priority: 'Medium',
    dueDate: null,
    notes: [],
    aiObservations: 'Acoustic and computer vision indicators suggest sub-standard particulate filters on commercial light trucks.',
    estimatedAffectedPopulation: 12000
  },
  {
    id: 'REP-2026-010',
    title: 'Mature roadside Neem and Peepal tree clearing for road widening',
    category: 'Deforestation',
    city: 'Greater Noida',
    location: 'Knowledge Park III Peripheral Avenue',
    coordinates: [28.4735, 77.4889],
    severity: 'Medium',
    confidence: 0.86,
    status: 'Verified',
    verified: true,
    reportDate: '2026-07-07T12:00:00Z',
    submittedBy: 'Citizen Sentinel #9921',
    description: 'AI-detected suspected issue: unpermitted felling of 14 mature shade trees without mandatory compensatory afforestation tag displayed on site.',
    organization: 'Greater Noida Eco-Action & Habitat Trust',
    assignedTo: 'Pooja Verma',
    priority: 'Medium',
    dueDate: '2026-07-14',
    notes: [
      { id: 'N-7', author: 'Pooja Verma', timestamp: '2026-07-08T15:20:00Z', text: 'Halted contractor via local forest ranger contact. 6 surviving saplings secured.' }
    ],
    aiObservations: 'Canopy density metric dropped by 34% over a 150-meter stretch in recent aerial snapshot.',
    estimatedAffectedPopulation: 4500
  },
  {
    id: 'REP-2026-011',
    title: 'Paddy straw residual burning spotted in agricultural fringe',
    category: 'Crop Burning',
    city: 'Ghaziabad',
    location: 'Loni Rural Belt, Near Tronica City Border',
    coordinates: [28.7521, 77.2878],
    severity: 'High',
    confidence: 0.95,
    status: 'Action Initiated',
    verified: true,
    reportDate: '2026-07-09T18:30:00Z',
    submittedBy: 'Citizen Sentinel #7712',
    description: 'Early season crop residue burning over 3 acres. Plume drifting south towards residential settlements in Loni and North East Delhi.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Amitav Sharma',
    priority: 'High',
    dueDate: '2026-07-15',
    notes: [
      { id: 'N-8', author: 'Amitav Sharma', timestamp: '2026-07-10T10:00:00Z', text: 'Engaged village panchayat head. Happy Seeder machine subsidization awareness session arranged.' }
    ],
    aiObservations: 'VIIRS satellite thermal sensor confirmed 3 active fire pixels with brightness temp 325K.',
    estimatedAffectedPopulation: 31000
  },
  {
    id: 'REP-2026-012',
    title: 'Dormant leachate pond overflow near Ghazipur Landfill base',
    category: 'Garbage Dumping',
    city: 'Delhi',
    location: 'Ghazipur Dairy Farm Road, East Delhi',
    coordinates: [28.6261, 77.3280],
    severity: 'High',
    confidence: 0.98,
    status: 'Verified',
    verified: true,
    reportDate: '2026-07-12T09:10:00Z',
    submittedBy: 'Citizen Sentinel #6441',
    description: 'AI-detected suspected issue: monsoon accumulation overflowing landfill retention pond, carrying dark toxic leachate into roadside ditch.',
    organization: 'Delhi Green Habitat & Waste Watch',
    assignedTo: 'Meera Nair',
    priority: 'High',
    dueDate: '2026-07-18',
    notes: [
      { id: 'N-9', author: 'Meera Nair', timestamp: '2026-07-13T17:30:00Z', text: 'Sample conductivity reads >4000 uS/cm. Urgent containment barrier recommended in MCD report.' }
    ],
    aiObservations: 'Reflectance signature aligns with high ammoniacal nitrogen and heavy municipal leachate.',
    estimatedAffectedPopulation: 42000
  },
  {
    id: 'REP-2026-013',
    title: 'Plastic shredding unit venting unscrubbed micro-plastic dust',
    category: 'Plastic Waste',
    city: 'Noida',
    location: 'Sector 10 Industrial Cluster, Near G-Block',
    coordinates: [28.5910, 77.3190],
    severity: 'Medium',
    confidence: 0.81,
    status: 'Under Review',
    verified: false,
    reportDate: '2026-07-14T15:40:00Z',
    submittedBy: 'Citizen Sentinel #3190',
    description: 'AI-detected suspected issue: informal recycling facility expelling particulate plastic dust directly onto pedestrian lane without wet scrubber.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Karan Malhotra',
    priority: 'Medium',
    dueDate: '2026-07-21',
    notes: [],
    aiObservations: 'Optical particle counter readings from nearby mobile node report spikes in PM2.5 fractions.',
    estimatedAffectedPopulation: 5800
  },
  {
    id: 'REP-2026-014',
    title: 'Untreated dye wastewater discharge into Hindon River tributary',
    category: 'Water Pollution',
    city: 'Ghaziabad',
    location: 'Karhera Bridge, Hindon River Basin',
    coordinates: [28.6874, 77.4120],
    severity: 'High',
    confidence: 0.96,
    status: 'Action Initiated',
    verified: true,
    reportDate: '2026-07-17T06:45:00Z',
    submittedBy: 'Citizen Sentinel #4881',
    description: 'Red-tinted chemical effluent discharge observed entering the water channel under cover of early morning fog. Strong sulfur smell detected.',
    organization: 'Yamuna Ecological Restoration Collective',
    assignedTo: 'Amitav Sharma',
    priority: 'High',
    dueDate: '2026-07-24',
    notes: [
      { id: 'N-10', author: 'Amitav Sharma', timestamp: '2026-07-18T12:15:00Z', text: 'Traced outlet to unlicensed textile sizing shed 500m upstream. UPPCB alert filed.' }
    ],
    aiObservations: 'Spectroscopic absorption spikes in azo dye wavelengths; biological life absence confirmed downstream.',
    estimatedAffectedPopulation: 28000
  },
  {
    id: 'REP-2026-015',
    title: 'Suspected illegal tyre burning in scrap yard after midnight',
    category: 'Waste Burning',
    city: 'Delhi',
    location: 'Mayapuri Industrial Area Phase II',
    coordinates: [28.6310, 77.1235],
    severity: 'High',
    confidence: 0.93,
    status: 'Verified',
    verified: true,
    reportDate: '2026-07-19T01:30:00Z',
    submittedBy: 'Citizen Sentinel #5120',
    description: 'AI-detected suspected issue: black acrid smoke column rising from metal reclamation facility. Suspected pyrolysis of old radial tyres to extract steel wire.',
    organization: 'Delhi Green Habitat & Waste Watch',
    assignedTo: 'Dr. Radhika Sen',
    priority: 'High',
    dueDate: '2026-07-26',
    notes: [
      { id: 'N-11', author: 'Dr. Radhika Sen', timestamp: '2026-07-20T10:00:00Z', text: 'Night patrol recorded carbon monoxide peak. Police PCR assisted in securing premise.' }
    ],
    aiObservations: 'Nighttime thermal drone camera recorded 550°C core combustion bed.',
    estimatedAffectedPopulation: 34000
  },
  {
    id: 'REP-2026-016',
    title: 'Dust re-suspension from uncovered metro viaduct construction site',
    category: 'Air Pollution',
    city: 'Noida',
    location: 'Sector 142 Metro Station Extension Corridor',
    coordinates: [28.4980, 77.4195],
    severity: 'Low',
    confidence: 0.72,
    status: 'Reported',
    verified: false,
    reportDate: '2026-07-21T11:20:00Z',
    submittedBy: 'Citizen Sentinel #1904',
    description: 'AI-detected suspected issue: dry excavation sand mounds left without geotextile tarpaulins or water sprinkling, causing visible brown dust haze.',
    organization: null,
    assignedTo: null,
    priority: 'Low',
    dueDate: null,
    notes: [],
    aiObservations: 'Visual wind-drift model shows particulate spread toward expressway service road.',
    estimatedAffectedPopulation: 7600
  },
  {
    id: 'REP-2026-017',
    title: 'Scrap thermocol and Styrofoam dumping along stormwater drain',
    category: 'Plastic Waste',
    city: 'Greater Noida',
    location: 'Surajpur Industrial Area, Site B',
    coordinates: [28.5350, 77.4810],
    severity: 'Medium',
    confidence: 0.84,
    status: 'Verified',
    verified: true,
    reportDate: '2026-07-24T14:10:00Z',
    submittedBy: 'Citizen Sentinel #6620',
    description: 'Massive pile of packaging foam blocks obstructing culvert passage. Severe flood risk ahead of scheduled heavy monsoon downpours.',
    organization: 'Greater Noida Eco-Action & Habitat Trust',
    assignedTo: 'Pooja Verma',
    priority: 'Medium',
    dueDate: '2026-07-30',
    notes: [
      { id: 'N-12', author: 'Pooja Verma', timestamp: '2026-07-25T11:45:00Z', text: 'GNIDA drainage squad engaged. Clearance initiated; 3 trucks of Styrofoam recovered for compacting.' }
    ],
    aiObservations: 'Drain cross-sectional blockage calculated at 48% by flood risk algorithm.',
    estimatedAffectedPopulation: 9400
  },
  {
    id: 'REP-2026-018',
    title: 'Heavy diesel delivery truck idling during night freight loading',
    category: 'Vehicle Pollution',
    city: 'Delhi',
    location: 'Sanjay Gandhi Transport Nagar, GT Karnal Road',
    coordinates: [28.7490, 77.1350],
    severity: 'Medium',
    confidence: 0.79,
    status: 'AI Analyzed',
    verified: false,
    reportDate: '2026-07-26T23:40:00Z',
    submittedBy: 'Citizen Sentinel #8411',
    description: 'AI-detected suspected issue: over 60 interstate commercial carriers idling auxiliary engines throughout 4-hour loading window in unventilated bay.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: null,
    priority: 'Medium',
    dueDate: null,
    notes: [],
    aiObservations: 'Nitrogen dioxide (NO2) hotspot recognized across 1.2 sq km logistics terminal.',
    estimatedAffectedPopulation: 18000
  },
  {
    id: 'REP-2026-019',
    title: 'Suspected unauthorized tree felling in Aravalli ridge fringe',
    category: 'Deforestation',
    city: 'Delhi',
    location: 'Asola Bhatti Wildlife Sanctuary Peripheral Border',
    coordinates: [28.4890, 77.2410],
    severity: 'High',
    confidence: 0.91,
    status: 'Verified',
    verified: true,
    reportDate: '2026-07-28T09:00:00Z',
    submittedBy: 'Citizen Sentinel #3299',
    description: 'AI-detected suspected issue: chainsaw activity and tree clearings along the eco-sensitive buffer zone. 25 native Dhau and Babool trees reportedly felled.',
    organization: 'Delhi Green Habitat & Waste Watch',
    assignedTo: 'Dr. Radhika Sen',
    priority: 'High',
    dueDate: '2026-08-03',
    notes: [
      { id: 'N-13', author: 'Dr. Radhika Sen', timestamp: '2026-07-29T16:00:00Z', text: 'Forest Department joint patrol conducted. Boundary posts re-established; criminal trespass lodged.' }
    ],
    aiObservations: 'Vegetation index (NDVI) drop of 0.28 detected within designated sanctuary buffer area.',
    estimatedAffectedPopulation: 2500
  },
  {
    id: 'REP-2026-020',
    title: 'Municipal waste overflow at unserviced transit transfer station',
    category: 'Garbage Dumping',
    city: 'Ghaziabad',
    location: 'Raj Nagar Extension, Near Morti Crossing',
    coordinates: [28.7060, 77.4390],
    severity: 'Medium',
    confidence: 0.83,
    status: 'Action Initiated',
    verified: true,
    reportDate: '2026-07-30T16:50:00Z',
    submittedBy: 'Citizen Sentinel #7109',
    description: 'Piled household garbage spilling 35 meters into primary vehicular roadway. Stray cattle ingesting thin plastic carrybags.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Amitav Sharma',
    priority: 'Medium',
    dueDate: '2026-08-05',
    notes: [
      { id: 'N-14', author: 'Amitav Sharma', timestamp: '2026-08-01T14:10:00Z', text: 'Compactor truck dispatched by Nagar Nigam. Secondary bin enclosure under construction.' }
    ],
    aiObservations: 'Volumetric estimation ~85 cubic meters of mixed municipal solid waste.',
    estimatedAffectedPopulation: 14000
  },
  {
    id: 'REP-2026-021',
    title: 'Raw sewage backflow into open neighborhood park drainage',
    category: 'Sewage/Drainage',
    city: 'Noida',
    location: 'Sector 76 Central Community Park Periphery',
    coordinates: [28.5730, 77.3825],
    severity: 'Medium',
    confidence: 0.87,
    status: 'Resolved',
    verified: true,
    reportDate: '2026-08-02T10:15:00Z',
    submittedBy: 'Citizen Sentinel #2208',
    description: 'Sewage pumping station failure resulting in wastewater flooding walking tracks and grass lawns. Urgent chlorination and motor replacement needed.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Karan Malhotra',
    priority: 'Medium',
    dueDate: '2026-08-06',
    notes: [
      { id: 'N-15', author: 'Karan Malhotra', timestamp: '2026-08-03T18:00:00Z', text: 'Noida Authority pump restored. Disinfection with lime powder complete.' }
    ],
    aiObservations: 'High microbial contamination risk flagged due to proximate children play equipment.',
    estimatedAffectedPopulation: 8200
  },
  {
    id: 'REP-2026-022',
    title: 'Boiler chimney emission emitting dense soot during early morning',
    category: 'Industrial Emission',
    city: 'Delhi',
    location: 'Wazirpur Industrial Area, Block C',
    coordinates: [28.6990, 77.1650],
    severity: 'High',
    confidence: 0.93,
    status: 'Verified',
    verified: true,
    reportDate: '2026-08-04T05:30:00Z',
    submittedBy: 'Citizen Sentinel #9401',
    description: 'AI-detected suspected issue: pickling and rolling mill using furnace oil or unauthorized pet-coke fuels. Dense black smoke blanket covering railway line.',
    organization: 'Delhi Green Habitat & Waste Watch',
    assignedTo: 'Dr. Radhika Sen',
    priority: 'High',
    dueDate: '2026-08-10',
    notes: [
      { id: 'N-16', author: 'Dr. Radhika Sen', timestamp: '2026-08-05T11:00:00Z', text: 'Drone footage recorded. Sent to DPCC surveillance wing.' }
    ],
    aiObservations: 'Sulfur dioxide (SO2) column concentration substantially exceeds national ambient air quality benchmarks.',
    estimatedAffectedPopulation: 38000
  },
  {
    id: 'REP-2026-023',
    title: 'Crop residue open burn on Yamuna floodplain farmland',
    category: 'Crop Burning',
    city: 'Noida',
    location: 'Yamuna Floodplain Farmlands, Near Sector 135 Bund',
    coordinates: [28.4975, 77.4080],
    severity: 'High',
    confidence: 0.90,
    status: 'Verified',
    verified: true,
    reportDate: '2026-08-06T18:00:00Z',
    submittedBy: 'Citizen Sentinel #6122',
    description: 'AI-detected suspected issue: multiple small biomass burnings along the floodplain riverbank. Smog settling over Expressway sectors.',
    organization: 'Yamuna Ecological Restoration Collective',
    assignedTo: 'Dr. Radhika Sen',
    priority: 'High',
    dueDate: '2026-08-12',
    notes: [
      { id: 'N-17', author: 'Dr. Radhika Sen', timestamp: '2026-08-07T09:30:00Z', text: 'Met farmer collectives. Demonstration of bio-decomposer capsules carried out.' }
    ],
    aiObservations: 'Thermal imagery confirmed 4 distinct burn scars totaling ~1.8 hectares.',
    estimatedAffectedPopulation: 29000
  },
  {
    id: 'REP-2026-024',
    title: 'Municipal street sweeping dust dumped directly into open drain',
    category: 'Garbage Dumping',
    city: 'Ghaziabad',
    location: 'Vaishali Sector 4, Main Market Road',
    coordinates: [28.6465, 77.3405],
    severity: 'Low',
    confidence: 0.68,
    status: 'Reported',
    verified: false,
    reportDate: '2026-08-08T08:15:00Z',
    submittedBy: 'Citizen Sentinel #1502',
    description: 'AI-detected suspected issue: sanitation sweepers brushing street grit and leaf debris directly into stormwater grating.',
    organization: null,
    assignedTo: null,
    priority: 'Low',
    dueDate: null,
    notes: [],
    aiObservations: 'Silt deposition risk high; likely to choke downstream storm interceptors.',
    estimatedAffectedPopulation: 4100
  },
  {
    id: 'REP-2026-025',
    title: 'Groundwater discoloration from suspected battery recycling effluent',
    category: 'Water Pollution',
    city: 'Greater Noida',
    location: 'Ecotech II, Light Industrial Zone',
    coordinates: [28.5640, 77.4700],
    severity: 'High',
    confidence: 0.97,
    status: 'Under Review',
    verified: false,
    reportDate: '2026-08-10T13:40:00Z',
    submittedBy: 'Citizen Sentinel #4388',
    description: 'AI-detected suspected issue: handpump water turning yellowish-gray with metallic taste. Suspected illegal lead-acid battery washing pit.',
    organization: 'Greater Noida Eco-Action & Habitat Trust',
    assignedTo: 'Pooja Verma',
    priority: 'High',
    dueDate: '2026-08-16',
    notes: [],
    aiObservations: 'Hydrological proximity model shows 4 drinking borewells within 250m radius.',
    estimatedAffectedPopulation: 5200
  },
  {
    id: 'REP-2026-026',
    title: 'Discarded multi-layer plastic packaging accumulating along drain banks',
    category: 'Plastic Waste',
    city: 'Delhi',
    location: 'Najafgarh Drain Bank, Near Kakrola Bridge',
    coordinates: [28.6095, 76.9805],
    severity: 'Medium',
    confidence: 0.82,
    status: 'AI Analyzed',
    verified: false,
    reportDate: '2026-08-12T16:20:00Z',
    submittedBy: 'Citizen Sentinel #2810',
    description: 'AI-detected suspected issue: heavy concentration of non-recyclable multi-layered metallized chip bags choking wetland embankment vegetation.',
    organization: 'Delhi Green Habitat & Waste Watch',
    assignedTo: null,
    priority: 'Medium',
    dueDate: null,
    notes: [],
    aiObservations: 'Computer vision surface coverage estimation indicates ~2200 sq meters of plastic matting.',
    estimatedAffectedPopulation: 11000
  },
  {
    id: 'REP-2026-027',
    title: 'Persistent waste burn smoldering beside railway siding',
    category: 'Waste Burning',
    city: 'Ghaziabad',
    location: 'Old Ghaziabad Railway Goods Yard, Madhopura',
    coordinates: [28.6690, 77.4320],
    severity: 'High',
    confidence: 0.92,
    status: 'Verified',
    verified: true,
    reportDate: '2026-08-14T20:30:00Z',
    submittedBy: 'Citizen Sentinel #9021',
    description: 'Piles of mixed railway cargo packing wood, tar, and plastic wrapping burning continuously for 18 hours. Smoke drifting across passenger platforms.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Amitav Sharma',
    priority: 'High',
    dueDate: '2026-08-20',
    notes: [
      { id: 'N-18', author: 'Amitav Sharma', timestamp: '2026-08-15T08:00:00Z', text: 'Railway Protection Force coordinated to extinguish burn. Station director issued memo.' }
    ],
    aiObservations: 'Continuous PM2.5 elevated emission signature detected by railway air monitoring beacon.',
    estimatedAffectedPopulation: 36000
  },
  {
    id: 'REP-2026-028',
    title: 'Commercial bus terminus idling in unpaved dirt lot',
    category: 'Vehicle Pollution',
    city: 'Delhi',
    location: 'Kashmere Gate ISBT Northern Outflow',
    coordinates: [28.6670, 77.2340],
    severity: 'High',
    confidence: 0.89,
    status: 'Action Initiated',
    verified: true,
    reportDate: '2026-08-16T12:00:00Z',
    submittedBy: 'Citizen Sentinel #5011',
    description: 'Over 80 diesel coaches idling engines simultaneously in dusty, unpaved standby lot creating extreme localized aerosol concentration.',
    organization: 'Delhi Green Habitat & Waste Watch',
    assignedTo: 'Dr. Radhika Sen',
    priority: 'High',
    dueDate: '2026-08-22',
    notes: [
      { id: 'N-19', author: 'Dr. Radhika Sen', timestamp: '2026-08-17T14:30:00Z', text: 'Submitted proposal to Transport Dept for electrification of parking stands and anti-idling enforcement.' }
    ],
    aiObservations: 'Micro-scale air dispersion model flags severe occupational hazard for transit workers.',
    estimatedAffectedPopulation: 62000
  },
  {
    id: 'REP-2026-029',
    title: 'Mature Shisham tree cutting inside institutional green belt',
    category: 'Deforestation',
    city: 'Greater Noida',
    location: 'Gamma 2 Institutional Sector, Near Community Center',
    coordinates: [28.4800, 77.5035],
    severity: 'Low',
    confidence: 0.74,
    status: 'Resolved',
    verified: true,
    reportDate: '2026-08-18T10:40:00Z',
    submittedBy: 'Citizen Sentinel #3890',
    description: 'AI-detected suspected issue: trimming operations exceeded permissible limit, removing entire crown of 4 protected Indian rosewood trees.',
    organization: 'Greater Noida Eco-Action & Habitat Trust',
    assignedTo: 'Pooja Verma',
    priority: 'Low',
    dueDate: '2026-08-23',
    notes: [
      { id: 'N-20', author: 'Pooja Verma', timestamp: '2026-08-19T11:15:00Z', text: 'Contractor warned; institutional authority planted 20 indigenous saplings in compensation.' }
    ],
    aiObservations: 'Canopy loss verified via high-res street imagery delta.',
    estimatedAffectedPopulation: 2100
  },
  {
    id: 'REP-2026-030',
    title: 'Severe untreated effluent discharge into Shahdara Drain',
    category: 'Water Pollution',
    city: 'Delhi',
    location: 'Shahdara Outfall Drain, Near Chilla Regulator',
    coordinates: [28.6015, 77.3020],
    severity: 'High',
    confidence: 0.98,
    status: 'Verified',
    verified: true,
    reportDate: '2026-08-20T07:15:00Z',
    submittedBy: 'Citizen Sentinel #7420',
    description: 'Pitch black foaming sludge carrying foul hydrogen sulfide gas flowing at over 250 million liters/day directly toward confluence with Yamuna.',
    organization: 'Yamuna Ecological Restoration Collective',
    assignedTo: 'Dr. Radhika Sen',
    priority: 'High',
    dueDate: '2026-08-27',
    notes: [
      { id: 'N-21', author: 'Dr. Radhika Sen', timestamp: '2026-08-22T09:00:00Z', text: 'Dissolved oxygen at zero mg/L. Joint remediation petition submitted to Yamuna Monitoring Committee.' }
    ],
    aiObservations: 'Spectral absorption confirms raw untreated domestic sewage combined with metal plating effluents.',
    estimatedAffectedPopulation: 78000
  },
  {
    id: 'REP-2026-031',
    title: 'Illegal municipal landfill expansion onto agricultural pasture',
    category: 'Garbage Dumping',
    city: 'Ghaziabad',
    location: 'Pratap Vihar Sector 11 Peripheral Land',
    coordinates: [28.6530, 77.4280],
    severity: 'High',
    confidence: 0.91,
    status: 'Under Review',
    verified: false,
    reportDate: '2026-08-22T15:10:00Z',
    submittedBy: 'Citizen Sentinel #4711',
    description: 'AI-detected suspected issue: informal garbage dumping trucks diverting away from official dump site and tipping mixed waste into open farming meadows.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Amitav Sharma',
    priority: 'High',
    dueDate: '2026-08-28',
    notes: [],
    aiObservations: 'Perimeter expansion measures +320 meters over baseline cadastral maps.',
    estimatedAffectedPopulation: 19000
  },
  {
    id: 'REP-2026-032',
    title: 'Informal cable stripping and PVC insulation open burning',
    category: 'Waste Burning',
    city: 'Delhi',
    location: 'Mandoli Industrial Estate, East Delhi',
    coordinates: [28.7085, 77.3095],
    severity: 'High',
    confidence: 0.95,
    status: 'Verified',
    verified: true,
    reportDate: '2026-08-24T22:15:00Z',
    submittedBy: 'Citizen Sentinel #6399',
    description: 'AI-detected suspected issue: open pit fires burning copper electrical wires to strip PVC casing. Highly toxic dioxin and hydrochloric acid vapor detected.',
    organization: 'Delhi Green Habitat & Waste Watch',
    assignedTo: 'Meera Nair',
    priority: 'High',
    dueDate: '2026-08-30',
    notes: [
      { id: 'N-22', author: 'Meera Nair', timestamp: '2026-08-25T11:40:00Z', text: 'Raid conducted with local police. 4 burn pits doused and sealed.' }
    ],
    aiObservations: 'Aerosol mass spectrometer indicator confirms elevated chlorine and aromatic hydrocarbon traces.',
    estimatedAffectedPopulation: 27000
  },
  {
    id: 'REP-2026-033',
    title: 'Air pollution spike from brick kilns operating outside permissible season',
    category: 'Air Pollution',
    city: 'Greater Noida',
    location: 'Dhoom Manikpur Village Belt, Near GT Road',
    coordinates: [28.5390, 77.5620],
    severity: 'High',
    confidence: 0.94,
    status: 'Verified',
    verified: true,
    reportDate: '2026-08-26T04:45:00Z',
    submittedBy: 'Citizen Sentinel #8199',
    description: '3 FCBTK brick kilns observed firing non-compliant coal without zig-zag emission technology during restricted monsoon window.',
    organization: 'Greater Noida Eco-Action & Habitat Trust',
    assignedTo: 'Pooja Verma',
    priority: 'High',
    dueDate: '2026-09-01',
    notes: [
      { id: 'N-23', author: 'Pooja Verma', timestamp: '2026-08-27T15:00:00Z', text: 'Regional Officer UPPCB notified with GPS coordinates and thermal plume recordings.' }
    ],
    aiObservations: 'Plume temperature and velocity signature confirm active kilns operating at 950°C internal firing.',
    estimatedAffectedPopulation: 33000
  },
  {
    id: 'REP-2026-034',
    title: 'Chemical drum cleaning residue poured directly into ground soil',
    category: 'Water Pollution',
    city: 'Noida',
    location: 'Sector 8 Industrial Area, Near Water Tank 3',
    coordinates: [28.5990, 77.3165],
    severity: 'High',
    confidence: 0.93,
    status: 'Action Initiated',
    verified: true,
    reportDate: '2026-08-28T11:30:00Z',
    submittedBy: 'Citizen Sentinel #3510',
    description: 'AI-detected suspected issue: solvent-washing of industrial chemical barrels in open yard; washwater percolating directly into sandy aquifer.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Karan Malhotra',
    priority: 'High',
    dueDate: '2026-09-03',
    notes: [
      { id: 'N-24', author: 'Karan Malhotra', timestamp: '2026-08-29T10:20:00Z', text: 'Site manager instructed to install impermeable concrete washing apron and sump collector.' }
    ],
    aiObservations: 'Soil absorption stain detected covering 180 sq meters; solvent vapor concentration elevated.',
    estimatedAffectedPopulation: 9500
  },
  {
    id: 'REP-2026-035',
    title: 'Substandard commercial delivery auto-rickshaws emitting visible blue smoke',
    category: 'Vehicle Pollution',
    city: 'Ghaziabad',
    location: 'Kaushambi Interstate Transit Corridor',
    coordinates: [28.6455, 77.3250],
    severity: 'Low',
    confidence: 0.65,
    status: 'Reported',
    verified: false,
    reportDate: '2026-08-30T08:50:00Z',
    submittedBy: 'Citizen Sentinel #1198',
    description: 'AI-detected suspected issue: two-stroke cargo loaders mixing excessive engine oil in petrol fuel tanks.',
    organization: null,
    assignedTo: null,
    priority: 'Low',
    dueDate: null,
    notes: [],
    aiObservations: 'Optical opacity of exhaust exhaust plume exceeds 45% standard.',
    estimatedAffectedPopulation: 8900
  },
  {
    id: 'REP-2026-036',
    title: 'Plastic bottle and pouch dumping in storm drain basin',
    category: 'Plastic Waste',
    city: 'Greater Noida',
    location: 'Pari Chowk Interchange Storm Drain Intake',
    coordinates: [28.4650, 77.5110],
    severity: 'Medium',
    confidence: 0.87,
    status: 'Resolved',
    verified: true,
    reportDate: '2026-09-01T13:20:00Z',
    submittedBy: 'Citizen Sentinel #5840',
    description: 'Litter from commuter footfall and kiosks choking water passage beneath roundabout.',
    organization: 'Greater Noida Eco-Action & Habitat Trust',
    assignedTo: 'Pooja Verma',
    priority: 'Medium',
    dueDate: '2026-09-06',
    notes: [
      { id: 'N-25', author: 'Pooja Verma', timestamp: '2026-09-03T16:00:00Z', text: 'Trash traps installed on drain mouth; 420 kg of plastic retrieved and sent for recycling.' }
    ],
    aiObservations: 'Water flow reduction index marked at 62% prior to clearing intervention.',
    estimatedAffectedPopulation: 14000
  },
  {
    id: 'REP-2026-037',
    title: 'Paddy straw residual burning in suburban fringes',
    category: 'Crop Burning',
    city: 'Delhi',
    location: 'Bawana - Narela Agricultural Buffer, North Delhi',
    coordinates: [28.7980, 77.0620],
    severity: 'High',
    confidence: 0.96,
    status: 'Verified',
    verified: true,
    reportDate: '2026-09-03T17:40:00Z',
    submittedBy: 'Citizen Sentinel #7910',
    description: 'AI-detected suspected issue: intense seasonal crop stubble fires burning across multiple adjacent agricultural land parcels.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Meera Nair',
    priority: 'High',
    dueDate: '2026-09-08',
    notes: [
      { id: 'N-26', author: 'Meera Nair', timestamp: '2026-09-04T12:00:00Z', text: 'Field sensors registered PM2.5 exceeding 550 ug/m3. Quick-response bio-sprayers dispatched.' }
    ],
    aiObservations: 'Thermal anomaly confirmed by MODIS satellite overpass; rapid wind transport south-eastward.',
    estimatedAffectedPopulation: 54000
  },
  {
    id: 'REP-2026-038',
    title: 'Untreated dairy slurry and manure draining into urban creek',
    category: 'Sewage/Drainage',
    city: 'Ghaziabad',
    location: 'Bhim Nagar Nallah, Near Vijay Nagar',
    coordinates: [28.6480, 77.4430],
    severity: 'Medium',
    confidence: 0.83,
    status: 'Under Review',
    verified: false,
    reportDate: '2026-09-05T09:30:00Z',
    submittedBy: 'Citizen Sentinel #3409',
    description: 'AI-detected suspected issue: informal dairy colonies flushing hundreds of kilograms of organic cattle manure into stormwater nallah without bio-digestion.',
    organization: 'Yamuna Ecological Restoration Collective',
    assignedTo: 'Amitav Sharma',
    priority: 'Medium',
    dueDate: '2026-09-11',
    notes: [],
    aiObservations: 'High biochemical oxygen demand (BOD) indicated by rapid anaerobic gas bubbling.',
    estimatedAffectedPopulation: 17500
  },
  {
    id: 'REP-2026-039',
    title: 'Suspicious chemical smell and fugitive emissions from electroplating units',
    category: 'Industrial Emission',
    city: 'Delhi',
    location: 'Anand Parbat Industrial Area, Gali 10',
    coordinates: [28.6630, 77.1710],
    severity: 'High',
    confidence: 0.91,
    status: 'Action Initiated',
    verified: true,
    reportDate: '2026-09-06T20:10:00Z',
    submittedBy: 'Citizen Sentinel #6088',
    description: 'AI-detected suspected issue: pungent acid mist escaping unhooded chroming tanks. Resident throat irritation reported widely.',
    organization: 'Delhi Green Habitat & Waste Watch',
    assignedTo: 'Dr. Radhika Sen',
    priority: 'High',
    dueDate: '2026-09-12',
    notes: [
      { id: 'N-27', author: 'Dr. Radhika Sen', timestamp: '2026-09-08T10:45:00Z', text: 'Air scrubbers found non-functional during physical check. Show-cause notice issued.' }
    ],
    aiObservations: 'Localized VOC sensor network registered 4.2x above safe occupational thresholds.',
    estimatedAffectedPopulation: 26000
  },
  {
    id: 'REP-2026-040',
    title: 'Felling of old roadside trees along expressway link construction',
    category: 'Deforestation',
    city: 'Noida',
    location: 'Sector 150 Sports City Expressway Connector',
    coordinates: [28.4490, 77.4615],
    severity: 'Medium',
    confidence: 0.79,
    status: 'Verified',
    verified: true,
    reportDate: '2026-09-08T11:15:00Z',
    submittedBy: 'Citizen Sentinel #2740',
    description: 'AI-detected suspected issue: road expansion crew removing mature eucalyptus and neem rows without barricaded tree-protection zone.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Karan Malhotra',
    priority: 'Medium',
    dueDate: '2026-09-14',
    notes: [
      { id: 'N-28', author: 'Karan Malhotra', timestamp: '2026-09-09T14:30:00Z', text: 'Met engineering team. Adjusted median alignment saving 8 mature trees.' }
    ],
    aiObservations: 'Photogrammetric survey showed 22 trees marked for cutting without permission badges.',
    estimatedAffectedPopulation: 5100
  },
  {
    id: 'REP-2026-041',
    title: 'Commercial packaging cardboard and plastic burning in back alley',
    category: 'Waste Burning',
    city: 'Noida',
    location: 'Sector 18 Commercial Market, Pocket B Alley',
    coordinates: [28.5710, 77.3265],
    severity: 'Low',
    confidence: 0.76,
    status: 'Resolved',
    verified: true,
    reportDate: '2026-09-09T23:00:00Z',
    submittedBy: 'Citizen Sentinel #4509',
    description: 'Restaurant and retail back-alley sweepers burning packaging waste to clear space for morning deliveries.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Karan Malhotra',
    priority: 'Low',
    dueDate: '2026-09-13',
    notes: [
      { id: 'N-29', author: 'Karan Malhotra', timestamp: '2026-09-10T11:00:00Z', text: 'Market association warned; dedicated nocturnal waste pickup vehicle assigned.' }
    ],
    aiObservations: 'Thermal hotspot signature resolved within 45 minutes of reported intervention.',
    estimatedAffectedPopulation: 3400
  },
  {
    id: 'REP-2026-042',
    title: 'Hazardous electronic waste dismantling and open chemical bathing',
    category: 'Garbage Dumping',
    city: 'Ghaziabad',
    location: 'Loni Border Scrap Hub, Prakash Nagar',
    coordinates: [28.7420, 77.2910],
    severity: 'High',
    confidence: 0.95,
    status: 'Verified',
    verified: true,
    reportDate: '2026-09-11T09:00:00Z',
    submittedBy: 'Citizen Sentinel #8831',
    description: 'AI-detected suspected issue: informal acid baths for recovering gold from computer circuit boards. Toxic cyanide fumes and ground sludge discarded into drains.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Amitav Sharma',
    priority: 'High',
    dueDate: '2026-09-17',
    notes: [
      { id: 'N-30', author: 'Amitav Sharma', timestamp: '2026-09-12T13:30:00Z', text: 'Multi-agency inspection conducted. 3 illicit workshops sealed; e-waste sent to authorized recycler.' }
    ],
    aiObservations: 'Hyperspectral satellite scan identified heavy metal accumulation in roadside soils.',
    estimatedAffectedPopulation: 39000
  },
  {
    id: 'REP-2026-043',
    title: 'Dense road dust cloud from uncovered heavy quarry trucks',
    category: 'Air Pollution',
    city: 'Greater Noida',
    location: 'Ecotech III Heavy Transport Corridor',
    coordinates: [28.5620, 77.4695],
    severity: 'Medium',
    confidence: 0.81,
    status: 'AI Analyzed',
    verified: false,
    reportDate: '2026-09-12T14:45:00Z',
    submittedBy: 'Citizen Sentinel #3922',
    description: 'AI-detected suspected issue: high-speed stone grit and fly-ash carriers operating without tarpaulin canopy covers, generating severe blinding dust plumes.',
    organization: 'Greater Noida Eco-Action & Habitat Trust',
    assignedTo: null,
    priority: 'Medium',
    dueDate: null,
    notes: [],
    aiObservations: 'PM10 sensors located 400m downwind reported particulate surge of +280 ug/m3.',
    estimatedAffectedPopulation: 13000
  },
  {
    id: 'REP-2026-044',
    title: 'Turbid industrial washwater pouring into Surajpur wetland rim',
    category: 'Water Pollution',
    city: 'Greater Noida',
    location: 'Surajpur Wetland Peripheral Inflow Canal',
    coordinates: [28.5265, 77.4935],
    severity: 'High',
    confidence: 0.97,
    status: 'Verified',
    verified: true,
    reportDate: '2026-09-13T07:20:00Z',
    submittedBy: 'Citizen Sentinel #9102',
    description: 'Oily gray wastewater discharging into natural marsh feeding Sarus Crane nesting zones. Immediate containment boom required.',
    organization: 'Greater Noida Eco-Action & Habitat Trust',
    assignedTo: 'Pooja Verma',
    priority: 'High',
    dueDate: '2026-09-18',
    notes: [
      { id: 'N-31', author: 'Pooja Verma', timestamp: '2026-09-14T09:15:00Z', text: 'Installed floating oil absorbent booms at canal mouth. Forest wildlife warden briefed.' }
    ],
    aiObservations: 'High oil-grease index (OGI) and total dissolved solids (TDS) detected by optical sensor.',
    estimatedAffectedPopulation: 7100
  },
  {
    id: 'REP-2026-045',
    title: 'High-density plastic beverage containers blocking stormwater channel',
    category: 'Plastic Waste',
    city: 'Ghaziabad',
    location: 'Indirapuram Canal Road, Near Shipra Mall Culvert',
    coordinates: [28.6420, 77.3720],
    severity: 'Low',
    confidence: 0.77,
    status: 'Action Initiated',
    verified: true,
    reportDate: '2026-09-14T17:00:00Z',
    submittedBy: 'Citizen Sentinel #1624',
    description: 'AI-detected suspected issue: floating mat of PET bottles and styrofoam packaging accumulating behind bridge pilings.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Amitav Sharma',
    priority: 'Low',
    dueDate: '2026-09-20',
    notes: [
      { id: 'N-32', author: 'Amitav Sharma', timestamp: '2026-09-15T15:00:00Z', text: 'Trash net mechanism deployed. 600 kg PET bottles recovered for EPR credit processing.' }
    ],
    aiObservations: 'Surface area of plastic trap calculated at 85 sq meters with 90% coverage density.',
    estimatedAffectedPopulation: 11500
  },
  {
    id: 'REP-2026-046',
    title: 'Stubble burn embers spreading to roadside brush',
    category: 'Crop Burning',
    city: 'Greater Noida',
    location: 'Dankaur Link Road Farmlands',
    coordinates: [28.3890, 77.5450],
    severity: 'High',
    confidence: 0.94,
    status: 'Under Review',
    verified: false,
    reportDate: '2026-09-15T18:30:00Z',
    submittedBy: 'Citizen Sentinel #5301',
    description: 'AI-detected suspected issue: uncontrolled agricultural field fire threatening roadside electric transmission poles and eucalyptus groves.',
    organization: 'Greater Noida Eco-Action & Habitat Trust',
    assignedTo: 'Pooja Verma',
    priority: 'High',
    dueDate: '2026-09-19',
    notes: [],
    aiObservations: 'Thermal signature indicates front movement rate of 4.5 meters/min.',
    estimatedAffectedPopulation: 8800
  },
  {
    id: 'REP-2026-047',
    title: 'Massive unsegregated municipal garbage dump along ring road bypass',
    category: 'Garbage Dumping',
    city: 'Delhi',
    location: 'Near Jahangirpuri Outer Ring Road Bypass',
    coordinates: [28.7270, 77.1715],
    severity: 'High',
    confidence: 0.92,
    status: 'Verified',
    verified: true,
    reportDate: '2026-09-16T10:00:00Z',
    submittedBy: 'Citizen Sentinel #7244',
    description: 'AI-detected suspected issue: unauthorized open-air transit dump accumulating rotten organics, plastic, and hospital waste. Severe odor within 1 km radius.',
    organization: 'Delhi Green Habitat & Waste Watch',
    assignedTo: 'Dr. Radhika Sen',
    priority: 'High',
    dueDate: '2026-09-21',
    notes: [
      { id: 'N-33', author: 'Dr. Radhika Sen', timestamp: '2026-09-17T11:20:00Z', text: 'Bio-medical bags flagged and separated for incinerator dispatch. MCD JCB deployed.' }
    ],
    aiObservations: 'Methane emission plume identified via infrared sensor overlay.',
    estimatedAffectedPopulation: 47000
  },
  {
    id: 'REP-2026-048',
    title: 'Chemical stench and venting from solvent reclamation plant',
    category: 'Industrial Emission',
    city: 'Ghaziabad',
    location: 'Kavi Nagar Industrial Area, Sector 17',
    coordinates: [28.6720, 77.4580],
    severity: 'High',
    confidence: 0.93,
    status: 'AI Analyzed',
    verified: false,
    reportDate: '2026-09-16T22:10:00Z',
    submittedBy: 'Citizen Sentinel #4298',
    description: 'AI-detected suspected issue: solvent recycling factory venting toluene and xylene fumes during late-night shift without vapor recovery unit.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: null,
    priority: 'High',
    dueDate: null,
    notes: [],
    aiObservations: 'Ambient VOC monitoring node registered peak reading of 680 ppb.',
    estimatedAffectedPopulation: 24000
  },
  {
    id: 'REP-2026-049',
    title: 'Choked storm sewer causing street inundation with stagnant black water',
    category: 'Sewage/Drainage',
    city: 'Delhi',
    location: 'Okhla Industrial Area Phase I, Main Avenue',
    coordinates: [28.5315, 77.2725],
    severity: 'Medium',
    confidence: 0.86,
    status: 'Reported',
    verified: false,
    reportDate: '2026-09-17T08:30:00Z',
    submittedBy: 'Citizen Sentinel #1938',
    description: 'AI-detected suspected issue: heavy plastic sludge and packaging waste blocking stormwater intake, producing 30cm stagnant fetid pool.',
    organization: null,
    assignedTo: null,
    priority: 'Medium',
    dueDate: null,
    notes: [],
    aiObservations: 'Vehicle traffic velocity reduction of 72% caused by street waterlogging.',
    estimatedAffectedPopulation: 19500
  },
  {
    id: 'REP-2026-050',
    title: 'Nighttime open garbage burning along expressway embankment',
    category: 'Waste Burning',
    city: 'Noida',
    location: 'Noida-Greater Noida Expressway, Near Sector 137 Underpass',
    coordinates: [28.5090, 77.4045],
    severity: 'Medium',
    confidence: 0.89,
    status: 'Verified',
    verified: true,
    reportDate: '2026-09-17T21:40:00Z',
    submittedBy: 'Citizen Sentinel #6520',
    description: 'AI-detected suspected issue: dry grass and plastic packaging debris lit along highway embankment. Acrid smoke blinding expressway drivers.',
    organization: 'NCR Clean Air & Climate Alliance',
    assignedTo: 'Karan Malhotra',
    priority: 'Medium',
    dueDate: '2026-09-22',
    notes: [
      { id: 'N-34', author: 'Karan Malhotra', timestamp: '2026-09-18T01:10:00Z', text: 'Expressway patrol fire unit put out the flames. Surveillance camera review underway.' }
    ],
    aiObservations: 'Nighttime satellite infrared sensor confirmed active thermal fire front.',
    estimatedAffectedPopulation: 31000
  }
];

// LocalStorage Persistence Layer Keys
const STORAGE_KEY_REPORTS = 'earthforward_reports_v1';
const STORAGE_KEY_OVERRIDES = 'earthforward_report_overrides_v1';

function getStoredReports() {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('LocalStorage read error:', err);
    }
  }
  // On first load or corrupted cache, seed from mock array
  seedStorage();
  return JSON.parse(JSON.stringify(environmentalReports));
}

function seedStorage() {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(environmentalReports));
    } catch (err) {
      console.warn('LocalStorage seed write error:', err);
    }
  }
}

function saveStoredReports(reports) {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }
}

function simulatedDelay(ms = 40) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * API: getReports(filters)
 * Swappable for fetch('/api/reports?...') later with zero caller changes
 */
async function getReports(filters = {}) {
  await simulatedDelay();
  let data = getStoredReports();

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    data = data.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      (r.city && r.city.toLowerCase().includes(q))
    );
  }

  if (filters.category && filters.category !== 'all') {
    data = data.filter(r => r.category.toLowerCase() === filters.category.toLowerCase());
  }

  if (filters.severity && filters.severity !== 'all') {
    data = data.filter(r => r.severity.toLowerCase() === filters.severity.toLowerCase());
  }

  if (filters.status && filters.status !== 'all') {
    data = data.filter(r => r.status.toLowerCase() === filters.status.toLowerCase());
  }

  if (filters.city && filters.city !== 'all') {
    data = data.filter(r => r.city.toLowerCase() === filters.city.toLowerCase());
  }

  if (filters.verified !== undefined && filters.verified !== 'all') {
    const isVer = filters.verified === true || filters.verified === 'true';
    data = data.filter(r => r.verified === isVer);
  }

  if (filters.dateFrom) {
    const fromTime = new Date(filters.dateFrom).getTime();
    data = data.filter(r => new Date(r.reportDate).getTime() >= fromTime);
  }

  if (filters.dateTo) {
    const toTime = new Date(filters.dateTo).getTime();
    data = data.filter(r => new Date(r.reportDate).getTime() <= toTime);
  }

  const sortBy = filters.sortBy || 'date_desc';
  data.sort((a, b) => {
    if (sortBy === 'date_desc') return new Date(b.reportDate) - new Date(a.reportDate);
    if (sortBy === 'date_asc') return new Date(a.reportDate) - new Date(b.reportDate);
    if (sortBy === 'confidence_desc') return b.confidence - a.confidence;
    if (sortBy === 'severity_desc') {
      const rank = { High: 3, Medium: 2, Low: 1 };
      return (rank[b.severity] || 0) - (rank[a.severity] || 0);
    }
    return 0;
  });

  const result = data.map(r => {
    if (!r.statusHistory || r.statusHistory.length === 0) {
      r.statusHistory = generateDefaultTimeline(r);
    }
    return r;
  });
  result.totalCount = result.length;
  result.reports = result; // defensive for destructured callers { reports } = await getReports()
  return result;
}

/**
 * API: getReportById(id)
 */
async function getReportById(id) {
  await simulatedDelay();
  const data = getStoredReports();
  const found = data.find(r => r.id === id || String(r.id) === String(id));
  if (!found) return null;

  const report = JSON.parse(JSON.stringify(found));

  // Ensure statusHistory is initialized if missing
  if (!report.statusHistory || report.statusHistory.length === 0) {
    report.statusHistory = generateDefaultTimeline(report);
  }

  return report;
}

function generateDefaultTimeline(report) {
  const baseTime = new Date(report.reportDate).getTime();
  const timeline = [
    {
      status: 'Reported',
      timestamp: new Date(baseTime).toISOString(),
      note: 'Citizen observation ingested and queued for AI analysis.'
    },
    {
      status: 'AI Analyzed',
      timestamp: new Date(baseTime + 1800000).toISOString(),
      note: `AI-detected suspected issue classified with ${Math.round((report.confidence || 0.85) * 100)}% detection confidence.`
    }
  ];

  const currentStatus = report.status;
  const statusRanks = {
    'Reported': 1,
    'AI Analyzed': 2,
    'Under Review': 3,
    'Verified': 4,
    'Action Initiated': 5,
    'Resolved': 6,
    'Rejected': 3
  };

  const rank = statusRanks[currentStatus] || 2;

  if (rank >= 3 && currentStatus !== 'Reported' && currentStatus !== 'AI Analyzed') {
    timeline.push({
      status: 'Under Review',
      timestamp: new Date(baseTime + 7200000).toISOString(),
      note: 'NGO intelligence coordinator initiated field verification triage.'
    });
  }

  if (rank >= 4 && currentStatus !== 'Under Review' && currentStatus !== 'Rejected') {
    timeline.push({
      status: 'Verified',
      timestamp: new Date(baseTime + 86400000).toISOString(),
      note: 'Ground verification confirmed suspected environmental violation.'
    });
  }

  if (rank >= 5) {
    timeline.push({
      status: 'Action Initiated',
      timestamp: new Date(baseTime + 172800000).toISOString(),
      note: report.assignedTo 
        ? `Remediation team mobilized under ${report.assignedTo}.`
        : 'Remediation dispatched to regional coalition team.'
    });
  }

  if (rank === 6) {
    timeline.push({
      status: 'Resolved',
      timestamp: new Date(baseTime + 259200000).toISOString(),
      note: 'Field cleanup completed and post-intervention inspection verified.'
    });
  }

  if (currentStatus === 'Rejected') {
    timeline.push({
      status: 'Rejected',
      timestamp: new Date(baseTime + 14400000).toISOString(),
      note: 'Observation flagged as inconclusive or out of jurisdiction scope.'
    });
  }

  return timeline;
}

/**
 * API: updateReportStatus(id, status)
 */
async function updateReportStatus(id, status) {
  await simulatedDelay();
  const data = getStoredReports();
  const index = data.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error(`Report with id ${id} not found.`);
  }

  data[index].status = status;
  if (status === 'Verified') {
    data[index].verified = true;
  } else if (status === 'Rejected') {
    data[index].verified = false;
  }

  // Append to statusHistory
  if (!data[index].statusHistory) {
    data[index].statusHistory = generateDefaultTimeline(data[index]);
  }
  data[index].statusHistory.push({
    status: status,
    timestamp: new Date().toISOString(),
    note: `Status advanced to "${status}" by NGO intelligence officer.`
  });

  // Append audit note
  if (!data[index].notes) data[index].notes = [];
  data[index].notes.unshift({
    id: 'N-' + Date.now(),
    author: 'NGO Intelligence Desk',
    timestamp: new Date().toISOString(),
    text: `Status updated to "${status}". Verification timeline appended.`
  });

  saveStoredReports(data);
  return JSON.parse(JSON.stringify(data[index]));
}

/**
 * API: addReportNote(id, noteText, authorName)
 */
async function addReportNote(id, noteText, authorName = 'NGO Field Officer') {
  await simulatedDelay();
  const data = getStoredReports();
  const index = data.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error(`Report with id ${id} not found.`);
  }

  if (!data[index].notes) data[index].notes = [];
  const newNote = {
    id: 'N-' + Date.now(),
    author: authorName,
    timestamp: new Date().toISOString(),
    text: noteText
  };
  data[index].notes.unshift(newNote);

  saveStoredReports(data);
  return JSON.parse(JSON.stringify(data[index]));
}

/**
 * API: assignReport(id, workerName, priority, dueDate, organizationName)
 */
async function assignReport(id, workerName, priority, dueDate, organizationName) {
  await simulatedDelay();
  const data = getStoredReports();
  const index = data.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error(`Report with id ${id} not found.`);
  }

  if (workerName) data[index].assignedTo = workerName;
  if (priority) data[index].priority = priority;
  if (dueDate) data[index].dueDate = dueDate;
  if (organizationName) data[index].organization = organizationName;

  if (data[index].status === 'Reported' || data[index].status === 'AI Analyzed') {
    data[index].status = 'Under Review';
  }

  if (!data[index].notes) data[index].notes = [];
  data[index].notes.unshift({
    id: 'N-' + Date.now(),
    author: 'Task Dispatcher',
    timestamp: new Date().toISOString(),
    text: `Task dispatched to ${workerName || 'Field Officer'}${priority ? ` [${priority} priority]` : ''}${dueDate ? ` (Target completion: ${dueDate})` : ''}.`
  });

  saveStoredReports(data);
  return JSON.parse(JSON.stringify(data[index]));
}

/**
 * API: getAnalytics()
 */
async function getAnalytics() {
  await simulatedDelay();
  const reports = getStoredReports();
  const total = reports.length;

  const statusCounts = {
    'Reported': 0,
    'AI Analyzed': 0,
    'Under Review': 0,
    'Verified': 0,
    'Action Initiated': 0,
    'Resolved': 0
  };

  const severityCounts = { High: 0, Medium: 0, Low: 0 };
  const categoryCounts = {};
  const cityCounts = {};
  let totalConfidence = 0;
  let verifiedCount = 0;
  let resolvedCount = 0;
  let actionInitiatedCount = 0;

  const monthlyTrends = {
    'Jun 2026': { total: 0, verified: 0, resolved: 0 },
    'Jul 2026': { total: 0, verified: 0, resolved: 0 },
    'Aug 2026': { total: 0, verified: 0, resolved: 0 },
    'Sep 2026': { total: 0, verified: 0, resolved: 0 }
  };

  reports.forEach(r => {
    if (statusCounts[r.status] !== undefined) statusCounts[r.status]++;
    if (r.verified) verifiedCount++;
    if (r.status === 'Resolved') resolvedCount++;
    if (r.status === 'Action Initiated') actionInitiatedCount++;

    if (severityCounts[r.severity] !== undefined) severityCounts[r.severity]++;
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    cityCounts[r.city] = (cityCounts[r.city] || 0) + 1;
    totalConfidence += (r.confidence || 0);

    const d = new Date(r.reportDate);
    const m = d.getMonth();
    let monthKey = 'Sep 2026';
    if (m === 5) monthKey = 'Jun 2026';
    else if (m === 6) monthKey = 'Jul 2026';
    else if (m === 7) monthKey = 'Aug 2026';

    if (monthlyTrends[monthKey]) {
      monthlyTrends[monthKey].total++;
      if (r.verified) monthlyTrends[monthKey].verified++;
      if (r.status === 'Resolved') monthlyTrends[monthKey].resolved++;
    }
  });

  const verificationRate = total > 0 ? Math.round((verifiedCount / total) * 100) : 0;
  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;
  const actionRate = total > 0 ? Math.round(((resolvedCount + actionInitiatedCount) / total) * 100) : 0;
  const avgConfidence = total > 0 ? (totalConfidence / total).toFixed(2) : '0.00';

  return {
    totalReports: total,
    verifiedCount,
    verificationRate,
    resolvedCount,
    resolutionRate,
    actionInitiatedCount,
    actionRate,
    underReviewCount: statusCounts['Under Review'] + statusCounts['AI Analyzed'] + statusCounts['Reported'],
    avgConfidence,
    statusCounts,
    severityCounts,
    categoryCounts,
    cityCounts,
    monthlyTrends,
    activeHotspotsCount: 8,
    avgResolutionDays: 4.6
  };
}

/**
 * API: getHotspots()
 */
async function getHotspots() {
  await simulatedDelay();
  const reports = getStoredReports();

  const clusters = [
    {
      id: 'HOT-01',
      name: 'Sahibabad & Karhera Industrial Corridor',
      city: 'Ghaziabad',
      coordinates: [28.6758, 77.3828],
      radiusMeters: 2800,
      primaryCategory: 'Industrial Emission & Chemical Runoff',
      riskLevel: 'High',
      aiRiskAssessment: 'AI-detected suspected recurring industrial discharge. Effluent monitoring and drain intercepts required; high soil and Hindon canal impact.',
      interventionStatus: 'Active Multi-Agency Monitoring'
    },
    {
      id: 'HOT-02',
      name: 'Ghazipur Landfill & Anand Vihar Border Basin',
      city: 'Delhi',
      coordinates: [28.6360, 77.3220],
      radiusMeters: 3200,
      primaryCategory: 'Air Pollution & Leachate Overflow',
      riskLevel: 'High',
      aiRiskAssessment: 'AI-detected suspected issue: high particulate concentration compounded by municipal landfill gas leakage and diesel interstate traffic.',
      interventionStatus: 'Urgent Remediation Proposed'
    },
    {
      id: 'HOT-03',
      name: 'Sector 62-63 Noida Commercial & Light Industrial Belt',
      city: 'Noida',
      coordinates: [28.6265, 77.3710],
      radiusMeters: 2200,
      primaryCategory: 'Industrial Emission & Waste Burning',
      riskLevel: 'High',
      aiRiskAssessment: 'AI-detected suspected issue: localized nocturnal fuel emissions and road dust re-suspension along arterial logistics links.',
      interventionStatus: 'Field Verification Underway'
    },
    {
      id: 'HOT-04',
      name: 'Surajpur Wetland & Ecotech Buffer Environs',
      city: 'Greater Noida',
      coordinates: [28.5280, 77.4945],
      radiusMeters: 2500,
      primaryCategory: 'Water Pollution & Inert Debris Dumping',
      riskLevel: 'High',
      aiRiskAssessment: 'AI-detected suspected issue: encroachment on wildlife sanctuary perimeter by construction debris and industrial washwater.',
      interventionStatus: 'Protection Team Assigned'
    },
    {
      id: 'HOT-05',
      name: 'Yamuna Khadar & Okhla Inundation Plains',
      city: 'Delhi / Noida Border',
      coordinates: [28.5300, 77.3100],
      radiusMeters: 3500,
      primaryCategory: 'Sewage/Drainage & Debris Dumping',
      riskLevel: 'High',
      aiRiskAssessment: 'AI-detected suspected issue: untreated drain outfalls into floodplain sandbanks. Ecological buffer compromised during monsoon surge.',
      interventionStatus: 'Joint River Action Initiated'
    },
    {
      id: 'HOT-06',
      name: 'Loni Industrial & Scrap Salvage Fringe',
      city: 'Ghaziabad',
      coordinates: [28.7480, 77.2890],
      radiusMeters: 2400,
      primaryCategory: 'Waste Burning & Crop Burning',
      riskLevel: 'High',
      aiRiskAssessment: 'AI-detected suspected issue: informal wire incineration and localized agricultural residue burn scars detected by satellite.',
      interventionStatus: 'Enforcement Coordination Active'
    },
    {
      id: 'HOT-07',
      name: 'Wazirpur & Jahangirpuri Industrial Pocket',
      city: 'Delhi',
      coordinates: [28.7130, 77.1680],
      radiusMeters: 2600,
      primaryCategory: 'Industrial Emission & Garbage Dumping',
      riskLevel: 'Medium',
      aiRiskAssessment: 'AI-detected suspected issue: metal plating emissions and transit waste accumulation along northern ring corridor.',
      interventionStatus: 'Scheduled Auditing'
    },
    {
      id: 'HOT-08',
      name: 'Greater Noida Alpha-Pari Chowk Junction',
      city: 'Greater Noida',
      coordinates: [28.4730, 77.5115],
      radiusMeters: 2000,
      primaryCategory: 'Plastic Waste & Biomass Burning',
      riskLevel: 'Medium',
      aiRiskAssessment: 'AI-detected suspected issue: transit commuter litter and park maintenance burnings. Rapid community cleanup feasible.',
      interventionStatus: 'Community Netting Deployed'
    }
  ];

  const hotspots = clusters.map(c => {
    const cLat = c.coordinates[0];
    const cLng = c.coordinates[1];
    let related = reports.filter(r => {
      const dLat = Math.abs(r.coordinates[0] - cLat);
      const dLng = Math.abs(r.coordinates[1] - cLng);
      return Math.sqrt(dLat * dLat + dLng * dLng) <= 0.045;
    });

    if (related.length < 3) {
      const sortedByDist = [...reports].sort((a, b) => {
        const da = Math.hypot(a.coordinates[0] - cLat, a.coordinates[1] - cLng);
        const db = Math.hypot(b.coordinates[0] - cLat, b.coordinates[1] - cLng);
        return da - db;
      });
      related = sortedByDist.slice(0, 3);
    }

    const categoryBreakdown = {};
    related.forEach(r => {
      categoryBreakdown[r.category] = (categoryBreakdown[r.category] || 0) + 1;
    });

    const highPriorityCount = related.filter(r => r.severity === 'High').length;
    const dates = related.map(r => new Date(r.reportDate).getTime()).filter(t => !isNaN(t));
    const firstReportDate = dates.length > 0 ? new Date(Math.min(...dates)).toISOString() : null;
    const latestReportDate = dates.length > 0 ? new Date(Math.max(...dates)).toISOString() : null;

    return {
      ...c,
      reportCount: related.length,
      highPriorityCount,
      categoryBreakdown,
      firstReportDate,
      latestReportDate,
      activeReports: related.filter(r => r.status !== 'Resolved').length,
      resolvedReports: related.filter(r => r.status === 'Resolved').length,
      reportsList: related.map(r => ({
        id: r.id,
        title: r.title,
        severity: r.severity,
        status: r.status,
        category: r.category,
        location: r.location,
        reportDate: r.reportDate,
        confidence: r.confidence
      }))
    };
  });

  // Rank locations by report density descending
  hotspots.sort((a, b) => b.reportCount - a.reportCount || b.highPriorityCount - a.highPriorityCount);
  return hotspots;
}

/**
 * API: getOrganizations()
 */
async function getOrganizations() {
  await simulatedDelay();
  return JSON.parse(JSON.stringify(organizations));
}

/**
 * API: getFieldWorkers()
 */
async function getFieldWorkers() {
  await simulatedDelay();
  return JSON.parse(JSON.stringify(fieldWorkers));
}

/**
 * API: resetDemoData()
 */
function resetDemoData() {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY_REPORTS);
      localStorage.removeItem(STORAGE_KEY_OVERRIDES);
    } catch (e) {
      console.warn('LocalStorage clear warning during resetDemoData:', e);
    }
  }
  seedStorage();
  return true;
}

// Auto-seed on load
if (typeof window !== 'undefined') {
  if (typeof localStorage !== 'undefined' && !localStorage.getItem(STORAGE_KEY_REPORTS)) {
    seedStorage();
  }
  // Expose both globally and as a clean namespace
  window.environmentalReports = environmentalReports;
  window.organizations = organizations;
  window.fieldWorkers = fieldWorkers;
  window.getReports = getReports;
  window.getReportById = getReportById;
  window.updateReportStatus = updateReportStatus;
  window.addReportNote = addReportNote;
  window.assignReport = assignReport;
  window.getAnalytics = getAnalytics;
  window.getHotspots = getHotspots;
  window.getOrganizations = getOrganizations;
  window.getFieldWorkers = getFieldWorkers;
  window.resetDemoData = resetDemoData;

  window.EarthData = {
    environmentalReports,
    organizations,
    fieldWorkers,
    getReports,
    getReportById,
    updateReportStatus,
    addReportNote,
    assignReport,
    getAnalytics,
    getHotspots,
    getOrganizations,
    getFieldWorkers,
    resetDemoData
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    environmentalReports,
    organizations,
    fieldWorkers,
    getReports,
    getReportById,
    updateReportStatus,
    addReportNote,
    assignReport,
    getAnalytics,
    getHotspots,
    getOrganizations,
    getFieldWorkers,
    resetDemoData
  };
}
