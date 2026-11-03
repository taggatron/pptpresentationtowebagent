/**
 * Multi-Generation Environmental & Material Lifecycle Dataset
 * Sourced from Apple Product Environmental Reports (iPhone XS through iPhone 16 Pro)
 */

const IPHONE_MODELS_DATA = {
  xs: {
    id: "xs",
    name: "iPhone Xs",
    displayName: "iPhone Xs",
    timelineName: "Xs",
    year: 2018,
    storage: "64GB model",
    image: "assets/phone_xs.png",
    thumbImage: "assets/thumb_xs.png",
    emissionsTitle: "Greenhouse Gas Emissions for iPhone Xs—64GB model",
    materialsTitle: "Material Use for iPhone Xs",
    overview: {
      totalEmissions: 70, // kg CO2e
      totalWeight: 177, // grams
      emissionsBreakdown: [
        { id: "production", label: "Production", percentage: 81, value: 56.7, color: "#548c8b" },
        { id: "customer_use", label: "Customer use", percentage: 15, value: 10.5, color: "#adc666" },
        { id: "transport", label: "Transport", percentage: 3, value: 2.1, color: "#d8bd48" },
        { id: "recycling", label: "Recycling", percentage: 1, value: 0.7, color: "#6eb172" }
      ],
      materialsBreakdown: [
        { id: "stainless_steel", label: "Stainless steel", weight: 54, percentage: 30.5, color: "#395b8c" },
        { id: "battery", label: "Battery", weight: 40, percentage: 22.6, color: "#548c8b" },
        { id: "glass", label: "Glass", weight: 36, percentage: 20.3, color: "#899a38" },
        { id: "circuit_boards", label: "Circuit boards", weight: 18, percentage: 10.2, color: "#b8cc3b" },
        { id: "other", label: "Other", weight: 14, percentage: 7.9, color: "#6ec1b8" },
        { id: "plastics", label: "Plastics", weight: 8, percentage: 4.5, color: "#bfa362" },
        { id: "display", label: "Display", weight: 6, percentage: 3.4, color: "#e78138" },
        { id: "aluminum", label: "Aluminum", weight: 1, percentage: 0.6, color: "#c8483b" }
      ],
      quickFacts: [
        "81% of lifecycle emissions (56.7 kg CO₂e) stem from production",
        "100% recycled tin utilized in the main logic board solder",
        "Apple's Daisy robot recovers 14 core materials across 200 units/hour"
      ]
    },
    components: {
      display: {
        id: "display",
        name: "OLED Display",
        category: "Display Subsystem",
        weightFormatted: "6g",
        weightPercentage: 3.4,
        materialColor: "#e78138",
        carbonFootprint: 11.2,
        carbonPercentage: 16.0,
        pin: { x: 368, y: 400 },
        emissionsBreakdown: [
          { label: "Production (OLED & Lamination)", percentage: 84, color: "#548c8b" },
          { label: "Customer Use (Power Draw)", percentage: 13, color: "#adc666" },
          { label: "Transport Logistics", percentage: 2, color: "#d8bd48" },
          { label: "Material Recovery", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "Mercury-free emissive OLED & arsenic-free protective glass",
          "Individual organic pixels drop power draw up to 30% in dark modes",
          "Detached cleanly by Daisy robot to recover rare earth optics"
        ]
      },
      stainless_steel: {
        id: "stainless_steel",
        name: "Stainless Steel Band",
        category: "Structural Enclosure",
        weightFormatted: "54g",
        weightPercentage: 30.5,
        materialColor: "#395b8c",
        carbonFootprint: 15.4,
        carbonPercentage: 22.0,
        pin: { x: 476, y: 440 },
        emissionsBreakdown: [
          { label: "Smelting & Precision CNC", percentage: 76, color: "#395b8c" },
          { label: "Customer Use (Structural)", percentage: 12, color: "#adc666" },
          { label: "Global Air/Sea Freight", percentage: 8, color: "#d8bd48" },
          { label: "Closed-loop Recycling", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recyclable surgical-grade steel custom alloy",
          "PVD micro-coating replaces toxic wet chemical baths",
          "Sub-millimeter CNC milling scrap recycled into supply chain"
        ]
      },
      glass: {
        id: "glass",
        name: "Enclosure Glass",
        category: "Exterior Surfaces",
        weightFormatted: "36g",
        weightPercentage: 20.3,
        materialColor: "#899a38",
        carbonFootprint: 6.3,
        carbonPercentage: 9.0,
        pin: { x: 430, y: 370 },
        emissionsBreakdown: [
          { label: "Fusion Draw & Ion Exchange", percentage: 80, color: "#899a38" },
          { label: "Use-phase Protection", percentage: 12, color: "#adc666" },
          { label: "Protective Packaging", percentage: 5, color: "#d8bd48" },
          { label: "Cullet Remelt Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Dual-ion exchange molecular chemical strengthening",
          "100% arsenic-free & RF transparent for wireless charging",
          "Recovered cullet remelted for secondary industrial insulation"
        ]
      },
      circuit_boards: {
        id: "circuit_boards",
        name: "Circuit Boards & Chips",
        category: "Semiconductors & Optics",
        weightFormatted: "18g",
        weightPercentage: 10.2,
        materialColor: "#b8cc3b",
        carbonFootprint: 22.4,
        carbonPercentage: 32.0,
        pin: { x: 440, y: 320 },
        emissionsBreakdown: [
          { label: "7nm Wafer Fab & Logic PCB", percentage: 86, color: "#b8cc3b" },
          { label: "Computation Power Draw", percentage: 10, color: "#adc666" },
          { label: "High-security Express Freight", percentage: 3, color: "#d8bd48" },
          { label: "Precious Metals Refining", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled tin in solder of the main logic board",
          "7nm A12 Bionic executes 5T ops/sec with 50% less power",
          "Gold and palladium refined through certified closed-loop smelters"
        ]
      },
      battery: {
        id: "battery",
        name: "Lithium-Ion Battery",
        category: "Power Subsystem",
        weightFormatted: "40g",
        weightPercentage: 22.6,
        materialColor: "#548c8b",
        carbonFootprint: 8.4,
        carbonPercentage: 12.0,
        pin: { x: 435, y: 450 },
        emissionsBreakdown: [
          { label: "Cathode Synthesis & Cell Fab", percentage: 74, color: "#548c8b" },
          { label: "Charging Lifecycle Losses", percentage: 18, color: "#adc666" },
          { label: "Packaging & Delivery", percentage: 5, color: "#d8bd48" },
          { label: "Cobalt Hydrometallurgy", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "100% cobalt recovery pilot via Apple Daisy robot",
          "Heavy-metal free: 0 lead, 0 cadmium, 0 mercury",
          "Meets California Energy Commission strict charging efficiency"
        ]
      },
      other: {
        id: "other",
        name: "Qi Coil & Magnets",
        category: "Transducers & Acoustic",
        weightFormatted: "14g",
        weightPercentage: 7.9,
        materialColor: "#6ec1b8",
        carbonFootprint: 3.5,
        carbonPercentage: 5.0,
        pin: { x: 433, y: 422 },
        emissionsBreakdown: [
          { label: "Magnet Sintering & Winding", percentage: 71, color: "#6ec1b8" },
          { label: "Inductive Field Loss", percentage: 22, color: "#adc666" },
          { label: "Specialty Transport", percentage: 4, color: "#d8bd48" },
          { label: "Neodymium Extraction", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "High-purity oxygen-free copper in inductive charging coil",
          "Daisy-compatible magnetic core assembly separation",
          "RoHS compliant acoustic transducer diaphragm"
        ]
      },
      plastics: {
        id: "plastics",
        name: "Bio & Engineered Plastics",
        category: "Polymer Compounds",
        weightFormatted: "8g",
        weightPercentage: 4.5,
        materialColor: "#bfa362",
        carbonFootprint: 2.1,
        carbonPercentage: 3.0,
        pin: { x: 433, y: 546 },
        emissionsBreakdown: [
          { label: "Injection Molding & Compounding", percentage: 65, color: "#bfa362" },
          { label: "Acoustic Damping Lifespan", percentage: 20, color: "#adc666" },
          { label: "Freight Distribution", percentage: 10, color: "#d8bd48" },
          { label: "Pelletized Mechanical Recycling", percentage: 5, color: "#6eb172" }
        ],
        quickFacts: [
          "35% bio-based plastic in acoustic speaker housings",
          "100% free of PVC and brominated flame retardants (BFR)",
          "Closed-loop regrind integration during molding cycles"
        ]
      },
      aluminum: {
        id: "aluminum",
        name: "Structural Aluminum",
        category: "Internal Shielding",
        weightFormatted: "1g",
        weightPercentage: 0.6,
        materialColor: "#c8483b",
        carbonFootprint: 0.7,
        carbonPercentage: 1.0,
        pin: { x: 446, y: 395 },
        emissionsBreakdown: [
          { label: "Low-carbon Hydro Smelting", percentage: 68, color: "#c8483b" },
          { label: "EMC Shielding Lifespan", percentage: 20, color: "#adc666" },
          { label: "Air/Road Shipping", percentage: 8, color: "#d8bd48" },
          { label: "Closed-loop Scrap Remelt", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled industrial scrap aluminum alloy",
          "Hydroelectric smelting with near-zero direct carbon emissions",
          "Eliminates heavy toxic shielding metals"
        ]
      }
    }
  },

  "11pro": {
    id: "11pro",
    name: "iPhone 11 Pro",
    displayName: "iPhone 11 Pro",
    timelineName: "11 Pro",
    year: 2019,
    storage: "64GB model",
    image: "assets/phone_11pro.png",
    thumbImage: "assets/thumb_11pro.png",
    emissionsTitle: "Greenhouse Gas Emissions for iPhone 11 Pro—64GB model",
    materialsTitle: "Material Use for iPhone 11 Pro",
    overview: {
      totalEmissions: 80, // kg CO2e
      totalWeight: 188, // grams
      emissionsBreakdown: [
        { id: "production", label: "Production", percentage: 83, value: 66.4, color: "#548c8b" },
        { id: "customer_use", label: "Customer use", percentage: 13, value: 10.4, color: "#adc666" },
        { id: "transport", label: "Transport", percentage: 3, value: 2.4, color: "#d8bd48" },
        { id: "recycling", label: "Recycling", percentage: 1, value: 0.8, color: "#6eb172" }
      ],
      materialsBreakdown: [
        { id: "stainless_steel", label: "Stainless steel", weight: 56, percentage: 29.8, color: "#395b8c" },
        { id: "battery", label: "Battery", weight: 48, percentage: 25.5, color: "#548c8b" },
        { id: "glass", label: "Glass", weight: 37, percentage: 19.7, color: "#899a38" },
        { id: "circuit_boards", label: "Circuit boards", weight: 21, percentage: 11.2, color: "#b8cc3b" },
        { id: "other", label: "Other", weight: 12, percentage: 6.4, color: "#6ec1b8" },
        { id: "plastics", label: "Plastics", weight: 7, percentage: 3.7, color: "#bfa362" },
        { id: "display", label: "Display", weight: 6, percentage: 3.2, color: "#e78138" },
        { id: "aluminum", label: "Aluminum", weight: 1, percentage: 0.5, color: "#c8483b" }
      ],
      quickFacts: [
        "First iPhone using 100% recycled rare earth elements in Taptic Engine",
        "100% zero-waste to landfill certified final assembly facilities",
        "Tri-camera system integrated with 100% recycled tin solder"
      ]
    },
    components: {
      display: {
        id: "display",
        name: "Super Retina XDR",
        category: "Display Subsystem",
        weightFormatted: "6g",
        weightPercentage: 3.2,
        materialColor: "#e78138",
        carbonFootprint: 12.0,
        carbonPercentage: 15.0,
        pin: { x: 368, y: 400 },
        emissionsBreakdown: [
          { label: "OLED Fabrication & Lamination", percentage: 85, color: "#548c8b" },
          { label: "Customer Screen Usage", percentage: 12, color: "#adc666" },
          { label: "Transport", percentage: 2, color: "#d8bd48" },
          { label: "Recovery", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "Up to 15% more power efficient than previous generation OLED",
          "Arsenic-free glass and mercury-free panel chemistry",
          "True Tone and P3 wide color with sub-pixel power gating"
        ]
      },
      stainless_steel: {
        id: "stainless_steel",
        name: "Surgical Steel Band",
        category: "Structural Enclosure",
        weightFormatted: "56g",
        weightPercentage: 29.8,
        materialColor: "#395b8c",
        carbonFootprint: 18.2,
        carbonPercentage: 22.8,
        pin: { x: 476, y: 440 },
        emissionsBreakdown: [
          { label: "Steel Forging & Precision Mill", percentage: 78, color: "#395b8c" },
          { label: "In-use Longevity", percentage: 11, color: "#adc666" },
          { label: "Freight", percentage: 7, color: "#d8bd48" },
          { label: "Recycling", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "Matte texturing on single sheet of glass pairs with precision steel",
          "Physical Vapor Deposition coating eliminates solvent emissions",
          "Certified for IP68 water resistance to 4 meters depth for 30 min"
        ]
      },
      glass: {
        id: "glass",
        name: "Textured Matte Glass",
        category: "Exterior Surfaces",
        weightFormatted: "37g",
        weightPercentage: 19.7,
        materialColor: "#899a38",
        carbonFootprint: 7.2,
        carbonPercentage: 9.0,
        pin: { x: 430, y: 370 },
        emissionsBreakdown: [
          { label: "Dual-ion Sculpting & Frosted Etch", percentage: 81, color: "#899a38" },
          { label: "Usage", percentage: 11, color: "#adc666" },
          { label: "Packaging", percentage: 5, color: "#d8bd48" },
          { label: "Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Milled from a single sheet of glass incorporating camera bump",
          "Dual-ion chemical strengthening increases crack resistance",
          "Eliminates volatile organic compounds during frosted texturing"
        ]
      },
      circuit_boards: {
        id: "circuit_boards",
        name: "Triple Camera & A13 Bionic",
        category: "Semiconductors & Optics",
        weightFormatted: "21g",
        weightPercentage: 11.2,
        materialColor: "#b8cc3b",
        carbonFootprint: 26.5,
        carbonPercentage: 33.1,
        pin: { x: 440, y: 320 },
        emissionsBreakdown: [
          { label: "7nm A13 & Sensor Wafer Fab", percentage: 88, color: "#b8cc3b" },
          { label: "Computation Usage", percentage: 8, color: "#adc666" },
          { label: "Air Logistics", percentage: 3, color: "#d8bd48" },
          { label: "Refining", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled tin in solder of main logic board and cameras",
          "Dedicated Neural Engine draws 15% less power per operation",
          "Ultra-wide camera architecture optimizes component density"
        ]
      },
      battery: {
        id: "battery",
        name: "Extended Life Battery",
        category: "Power Subsystem",
        weightFormatted: "48g",
        weightPercentage: 25.5,
        materialColor: "#548c8b",
        carbonFootprint: 10.8,
        carbonPercentage: 13.5,
        pin: { x: 435, y: 450 },
        emissionsBreakdown: [
          { label: "Cathode & Anode Production", percentage: 76, color: "#548c8b" },
          { label: "Charging Usage Over 3 Years", percentage: 17, color: "#adc666" },
          { label: "Packaging", percentage: 4, color: "#d8bd48" },
          { label: "Recycling", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Up to 4 hours longer battery life than previous generation",
          "Daisy robot disassembles battery cleanly without shredding",
          "Free of arsenic, beryllium, mercury, and lead"
        ]
      },
      other: {
        id: "other",
        name: "Taptic & Magnets",
        category: "Haptics & Transducers",
        weightFormatted: "12g",
        weightPercentage: 6.4,
        materialColor: "#6ec1b8",
        carbonFootprint: 3.2,
        carbonPercentage: 4.0,
        pin: { x: 433, y: 422 },
        emissionsBreakdown: [
          { label: "Magnet Fabrication", percentage: 70, color: "#6ec1b8" },
          { label: "Customer Use", percentage: 22, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled rare earth elements in Taptic Engine",
          "Represents 25% of all rare earth elements used in the device",
          "Closed-loop magnet supply chain agreement with suppliers"
        ]
      },
      plastics: {
        id: "plastics",
        name: "Acoustic Polymers",
        category: "Polymer Compounds",
        weightFormatted: "7g",
        weightPercentage: 3.7,
        materialColor: "#bfa362",
        carbonFootprint: 1.8,
        carbonPercentage: 2.2,
        pin: { x: 433, y: 546 },
        emissionsBreakdown: [
          { label: "Compounding", percentage: 65, color: "#bfa362" },
          { label: "Usage", percentage: 20, color: "#adc666" },
          { label: "Transport", percentage: 10, color: "#d8bd48" },
          { label: "Recycling", percentage: 5, color: "#6eb172" }
        ],
        quickFacts: [
          "35% bio-based content in acoustic speaker modules",
          "Eliminates phthalates and halogenated flame retardants",
          "Molded with near-zero waste runners directly reground"
        ]
      },
      aluminum: {
        id: "aluminum",
        name: "Internal Frame Aluminum",
        category: "Structural Support",
        weightFormatted: "1g",
        weightPercentage: 0.5,
        materialColor: "#c8483b",
        carbonFootprint: 0.7,
        carbonPercentage: 0.9,
        pin: { x: 446, y: 395 },
        emissionsBreakdown: [
          { label: "Smelting", percentage: 70, color: "#c8483b" },
          { label: "Usage", percentage: 18, color: "#adc666" },
          { label: "Transport", percentage: 8, color: "#d8bd48" },
          { label: "Remelt", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled secondary aluminum scrap",
          "Internal thermal spreader minimizes heat accumulation",
          "Zero fluorinated gas emissions in extrusion process"
        ]
      }
    }
  },

  "12pro": {
    id: "12pro",
    name: "iPhone 12 Pro",
    displayName: "iPhone 12 Pro",
    timelineName: "12 Pro",
    year: 2020,
    storage: "128GB model",
    image: "assets/phone_12pro.png",
    thumbImage: "assets/thumb_12pro.png",
    emissionsTitle: "Greenhouse Gas Emissions for iPhone 12 Pro—128GB model",
    materialsTitle: "Material Use for iPhone 12 Pro",
    overview: {
      totalEmissions: 82,
      totalWeight: 187,
      emissionsBreakdown: [
        { id: "production", label: "Production", percentage: 86, value: 70.5, color: "#548c8b" },
        { id: "customer_use", label: "Customer use", percentage: 11, value: 9.0, color: "#adc666" },
        { id: "transport", label: "Transport", percentage: 2, value: 1.6, color: "#d8bd48" },
        { id: "recycling", label: "Recycling", percentage: 1, value: 0.8, color: "#6eb172" }
      ],
      materialsBreakdown: [
        { id: "stainless_steel", label: "Stainless steel", weight: 52, percentage: 27.8, color: "#395b8c" },
        { id: "battery", label: "Battery", weight: 41, percentage: 21.9, color: "#548c8b" },
        { id: "glass", label: "Glass", weight: 38, percentage: 20.3, color: "#899a38" },
        { id: "circuit_boards", label: "Circuit boards", weight: 26, percentage: 13.9, color: "#b8cc3b" },
        { id: "other", label: "Other", weight: 14, percentage: 7.5, color: "#6ec1b8" },
        { id: "plastics", label: "Plastics", weight: 7, percentage: 3.7, color: "#bfa362" },
        { id: "display", label: "Display", weight: 8, percentage: 4.3, color: "#e78138" },
        { id: "aluminum", label: "Aluminum", weight: 1, percentage: 0.5, color: "#c8483b" }
      ],
      quickFacts: [
        "Removed in-box power adapter & EarPods, reducing packaging volume by 35%",
        "Ceramic Shield front glass improves drop durability by 4x",
        "99% recycled tungsten inside the Taptic Engine and MagSafe magnets"
      ]
    },
    components: {
      display: {
        id: "display",
        name: "Ceramic Shield OLED",
        category: "Display Subsystem",
        weightFormatted: "8g",
        weightPercentage: 4.3,
        materialColor: "#e78138",
        carbonFootprint: 13.2,
        carbonPercentage: 16.1,
        pin: { x: 368, y: 400 },
        emissionsBreakdown: [
          { label: "Fabrication", percentage: 86, color: "#548c8b" },
          { label: "Use", percentage: 11, color: "#adc666" },
          { label: "Transport", percentage: 2, color: "#d8bd48" },
          { label: "Recycling", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "Nano-ceramic crystals grown into glass matrix for 4x drop survival",
          "Edge-to-edge flat design reduces border bezel volume",
          "Manufactured using 100% renewable electricity"
        ]
      },
      stainless_steel: {
        id: "stainless_steel",
        name: "Flat-edge Steel Band",
        category: "Structural Enclosure",
        weightFormatted: "52g",
        weightPercentage: 27.8,
        materialColor: "#395b8c",
        carbonFootprint: 17.5,
        carbonPercentage: 21.3,
        pin: { x: 476, y: 440 },
        emissionsBreakdown: [
          { label: "CNC & High-gloss Polish", percentage: 79, color: "#395b8c" },
          { label: "Usage", percentage: 10, color: "#adc666" },
          { label: "Transport", percentage: 7, color: "#d8bd48" },
          { label: "Recycling", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "Surgical-grade steel band engineered for superior tensile rigidity",
          "High-power magnet array bonded directly for MagSafe alignment",
          "Up to 6 meters water resistance rating (IP68)"
        ]
      },
      glass: {
        id: "glass",
        name: "Ceramic & Rear Glass",
        category: "Exterior Surfaces",
        weightFormatted: "38g",
        weightPercentage: 20.3,
        materialColor: "#899a38",
        carbonFootprint: 7.8,
        carbonPercentage: 9.5,
        pin: { x: 430, y: 370 },
        emissionsBreakdown: [
          { label: "Ceramic Crystallization", percentage: 82, color: "#899a38" },
          { label: "Usage", percentage: 11, color: "#adc666" },
          { label: "Logistics", percentage: 4, color: "#d8bd48" },
          { label: "Remelt", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Ceramic Shield matrix tougher than any smartphone glass",
          "Precision-milled rear camera plateau from single glass pane",
          "100% arsenic-free and mercury-free glass production"
        ]
      },
      circuit_boards: {
        id: "circuit_boards",
        name: "5G Logic & A14 Bionic",
        category: "Semiconductors & RF",
        weightFormatted: "26g",
        weightPercentage: 13.9,
        materialColor: "#b8cc3b",
        carbonFootprint: 30.5,
        carbonPercentage: 37.2,
        pin: { x: 440, y: 320 },
        emissionsBreakdown: [
          { label: "5nm A14 & 5G RF Wafer Fab", percentage: 89, color: "#b8cc3b" },
          { label: "Power Draw", percentage: 8, color: "#adc666" },
          { label: "Air Transport", percentage: 2, color: "#d8bd48" },
          { label: "Recovery", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "First 5-nanometer mobile chip in the industry",
          "100% recycled tin in solder of main logic board and LiDAR",
          "Custom 5G antenna integrated with minimal raw material overhead"
        ]
      },
      battery: {
        id: "battery",
        name: "Integrated Li-Ion Battery",
        category: "Power Subsystem",
        weightFormatted: "41g",
        weightPercentage: 21.9,
        materialColor: "#548c8b",
        carbonFootprint: 9.8,
        carbonPercentage: 12.0,
        pin: { x: 435, y: 450 },
        emissionsBreakdown: [
          { label: "Cell Manufacturing", percentage: 75, color: "#548c8b" },
          { label: "Charging", percentage: 17, color: "#adc666" },
          { label: "Logistics", percentage: 5, color: "#d8bd48" },
          { label: "Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Smart Data Mode throttles 5G to LTE when not needed to save energy",
          "Optimized charging software slows battery chemical aging",
          "100% recovered cobalt supply chain verification"
        ]
      },
      other: {
        id: "other",
        name: "MagSafe & Rare Earths",
        category: "Wireless & Magnets",
        weightFormatted: "14g",
        weightPercentage: 7.5,
        materialColor: "#6ec1b8",
        carbonFootprint: 3.8,
        carbonPercentage: 4.6,
        pin: { x: 433, y: 422 },
        emissionsBreakdown: [
          { label: "Rare Earth Magnet Sintering", percentage: 72, color: "#6ec1b8" },
          { label: "Charging Losses", percentage: 20, color: "#adc666" },
          { label: "Freight", percentage: 5, color: "#d8bd48" },
          { label: "Recycling", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled rare earth elements in all magnets (MagSafe & cameras)",
          "15W wireless charging alignment reduces inductive flux losses",
          "Over 98% recycled tungsten in internal components"
        ]
      },
      plastics: {
        id: "plastics",
        name: "Structural Polymers",
        category: "Polymer Compounds",
        weightFormatted: "7g",
        weightPercentage: 3.7,
        materialColor: "#bfa362",
        carbonFootprint: 1.8,
        carbonPercentage: 2.2,
        pin: { x: 433, y: 546 },
        emissionsBreakdown: [
          { label: "Molding", percentage: 65, color: "#bfa362" },
          { label: "Use", percentage: 20, color: "#adc666" },
          { label: "Shipping", percentage: 10, color: "#d8bd48" },
          { label: "Recycling", percentage: 5, color: "#6eb172" }
        ],
        quickFacts: [
          "Internal brackets utilize 35% or more recycled plastic",
          "Eliminated plastic foil wraps from retail packaging",
          "Zero waste diversion across final assembly"
        ]
      },
      aluminum: {
        id: "aluminum",
        name: "Internal Thermal Plate",
        category: "Structural & Thermal",
        weightFormatted: "1g",
        weightPercentage: 0.5,
        materialColor: "#c8483b",
        carbonFootprint: 0.7,
        carbonPercentage: 0.9,
        pin: { x: 446, y: 395 },
        emissionsBreakdown: [
          { label: "Smelting", percentage: 70, color: "#c8483b" },
          { label: "Use", percentage: 18, color: "#adc666" },
          { label: "Logistics", percentage: 8, color: "#d8bd48" },
          { label: "Remelt", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled aerospace-grade aluminum scrap",
          "High thermal conductivity keeps processor below peak thermal draw",
          "Zero ozone-depleting substances used in manufacturing"
        ]
      }
    }
  },

  "13pro": {
    id: "13pro",
    name: "iPhone 13 Pro",
    displayName: "iPhone 13 Pro",
    timelineName: "13 Pro",
    year: 2021,
    storage: "128GB model",
    image: "assets/phone_13pro.png",
    thumbImage: "assets/thumb_13pro.png",
    emissionsTitle: "Greenhouse Gas Emissions for iPhone 13 Pro—128GB model",
    materialsTitle: "Material Use for iPhone 13 Pro",
    overview: {
      totalEmissions: 69,
      totalWeight: 203,
      emissionsBreakdown: [
        { id: "production", label: "Production", percentage: 81, value: 55.9, color: "#548c8b" },
        { id: "customer_use", label: "Customer use", percentage: 16, value: 11.0, color: "#adc666" },
        { id: "transport", label: "Transport", percentage: 2, value: 1.4, color: "#d8bd48" },
        { id: "recycling", label: "Recycling", percentage: 1, value: 0.7, color: "#6eb172" }
      ],
      materialsBreakdown: [
        { id: "stainless_steel", label: "Stainless steel", weight: 58, percentage: 28.6, color: "#395b8c" },
        { id: "battery", label: "Battery", weight: 49, percentage: 24.1, color: "#548c8b" },
        { id: "glass", label: "Glass", weight: 39, percentage: 19.2, color: "#899a38" },
        { id: "circuit_boards", label: "Circuit boards", weight: 28, percentage: 13.8, color: "#b8cc3b" },
        { id: "other", label: "Other", weight: 13, percentage: 6.4, color: "#6ec1b8" },
        { id: "plastics", label: "Plastics", weight: 7, percentage: 3.4, color: "#bfa362" },
        { id: "display", label: "Display", weight: 8, percentage: 3.9, color: "#e78138" },
        { id: "aluminum", label: "Aluminum", weight: 1, percentage: 0.5, color: "#c8483b" }
      ],
      quickFacts: [
        "First iPhone with 100% certified recycled gold in logic board plating & camera wire",
        "100% recycled rare earth elements in all magnets, cameras, and audio transducers",
        "Antenna lines fabricated from upcycled plastic water bottles diverted from oceans"
      ]
    },
    components: {
      display: {
        id: "display",
        name: "ProMotion 120Hz OLED",
        category: "Display Subsystem",
        weightFormatted: "8g",
        weightPercentage: 3.9,
        materialColor: "#e78138",
        carbonFootprint: 11.8,
        carbonPercentage: 17.1,
        pin: { x: 368, y: 400 },
        emissionsBreakdown: [
          { label: "LTPO OLED Fabrication", percentage: 84, color: "#548c8b" },
          { label: "Adaptive 10-120Hz Usage", percentage: 13, color: "#adc666" },
          { label: "Transport", percentage: 2, color: "#d8bd48" },
          { label: "Recycling", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "Adaptive refresh rate throttles down to 10Hz to save battery power",
          "20% smaller notch footprint increases active view area",
          "Mercury-free, arsenic-free, and beryllium-free"
        ]
      },
      stainless_steel: {
        id: "stainless_steel",
        name: "Surgical Stainless Steel",
        category: "Structural Enclosure",
        weightFormatted: "58g",
        weightPercentage: 28.6,
        materialColor: "#395b8c",
        carbonFootprint: 15.8,
        carbonPercentage: 22.9,
        pin: { x: 476, y: 440 },
        emissionsBreakdown: [
          { label: "Precision Milling & Polish", percentage: 77, color: "#395b8c" },
          { label: "Durability Lifespan", percentage: 12, color: "#adc666" },
          { label: "Shipping", percentage: 7, color: "#d8bd48" },
          { label: "Recycling", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "Custom alloy forged with high recycled scrap content",
          "IP68 water resistance protects components during accidental immersion",
          "Zero wastewater discharge at all manufacturing facilities"
        ]
      },
      glass: {
        id: "glass",
        name: "Ceramic Shield Glass",
        category: "Exterior Surfaces",
        weightFormatted: "39g",
        weightPercentage: 19.2,
        materialColor: "#899a38",
        carbonFootprint: 6.8,
        carbonPercentage: 9.8,
        pin: { x: 430, y: 370 },
        emissionsBreakdown: [
          { label: "Ceramic Synthesis", percentage: 81, color: "#899a38" },
          { label: "Use-phase", percentage: 12, color: "#adc666" },
          { label: "Transport", percentage: 4, color: "#d8bd48" },
          { label: "Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Nano-crystals embedded in glass matrix resist micro-fractures",
          "Frosted rear glass eliminates fingerprint coatings",
          "Daisy robot separates front and rear glass in under 15 seconds"
        ]
      },
      circuit_boards: {
        id: "circuit_boards",
        name: "Recycled Gold PCB & A15",
        category: "Semiconductors & Gold",
        weightFormatted: "28g",
        weightPercentage: 13.8,
        materialColor: "#b8cc3b",
        carbonFootprint: 23.5,
        carbonPercentage: 34.1,
        pin: { x: 440, y: 320 },
        emissionsBreakdown: [
          { label: "5nm+ A15 & Recycled Gold PCB", percentage: 87, color: "#b8cc3b" },
          { label: "Power Draw", percentage: 9, color: "#adc666" },
          { label: "Logistics", percentage: 3, color: "#d8bd48" },
          { label: "Precious Metals Refining", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "100% certified recycled gold in logic board plating and wire",
          "100% recycled tin in solder of all printed circuit boards",
          "Industry-leading power efficiency with 15.8T ops/sec Neural Engine"
        ]
      },
      battery: {
        id: "battery",
        name: "High-Capacity Li-Ion",
        category: "Power Subsystem",
        weightFormatted: "49g",
        weightPercentage: 24.1,
        materialColor: "#548c8b",
        carbonFootprint: 8.9,
        carbonPercentage: 12.9,
        pin: { x: 435, y: 450 },
        emissionsBreakdown: [
          { label: "Cell Production", percentage: 73, color: "#548c8b" },
          { label: "Charging Use Over Lifespan", percentage: 19, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Cobalt Refining", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Up to 2.5 hours longer battery life compared to predecessor",
          "Certified supplier transition to 100% clean power",
          "Daisy robot recovers 100% of cobalt and high-grade lithium"
        ]
      },
      other: {
        id: "other",
        name: "Recycled Rare Earths",
        category: "Magnets & Transducers",
        weightFormatted: "13g",
        weightPercentage: 6.4,
        materialColor: "#6ec1b8",
        carbonFootprint: 2.8,
        carbonPercentage: 4.1,
        pin: { x: 433, y: 422 },
        emissionsBreakdown: [
          { label: "Magnet Production", percentage: 70, color: "#6ec1b8" },
          { label: "Use", percentage: 22, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled rare earth elements in all magnets across device",
          "Over 98% recycled tungsten in Taptic Engine",
          "100% certified circular supply verification"
        ]
      },
      plastics: {
        id: "plastics",
        name: "Ocean-Bound Upcycled Plastic",
        category: "Circular Polymers",
        weightFormatted: "7g",
        weightPercentage: 3.4,
        materialColor: "#bfa362",
        carbonFootprint: 1.5,
        carbonPercentage: 2.2,
        pin: { x: 433, y: 546 },
        emissionsBreakdown: [
          { label: "Upcycling & Molding", percentage: 63, color: "#bfa362" },
          { label: "Use", percentage: 22, color: "#adc666" },
          { label: "Shipping", percentage: 10, color: "#d8bd48" },
          { label: "Recycling", percentage: 5, color: "#6eb172" }
        ],
        quickFacts: [
          "Antenna lines made from upcycled water bottles turned into polymer",
          "Internal brackets contain minimum 35% post-consumer recycled plastic",
          "Outer packaging completely redesigns out plastic shrink wrap"
        ]
      },
      aluminum: {
        id: "aluminum",
        name: "Recycled Aluminum Subplate",
        category: "Structural Support",
        weightFormatted: "1g",
        weightPercentage: 0.5,
        materialColor: "#c8483b",
        carbonFootprint: 0.6,
        carbonPercentage: 0.9,
        pin: { x: 446, y: 395 },
        emissionsBreakdown: [
          { label: "Hydro Smelting", percentage: 68, color: "#c8483b" },
          { label: "Usage", percentage: 20, color: "#adc666" },
          { label: "Transport", percentage: 8, color: "#d8bd48" },
          { label: "Remelt", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled industrial aluminum alloy",
          "Eliminates 95% of greenhouse gas emissions of primary bauxite smelting",
          "Integrated into thermal dissipation stack"
        ]
      }
    }
  },

  "14pro": {
    id: "14pro",
    name: "iPhone 14 Pro",
    displayName: "iPhone 14 Pro",
    timelineName: "14 Pro",
    year: 2022,
    storage: "128GB model",
    image: "assets/phone_14pro.png",
    thumbImage: "assets/thumb_14pro.png",
    emissionsTitle: "Greenhouse Gas Emissions for iPhone 14 Pro—128GB model",
    materialsTitle: "Material Use for iPhone 14 Pro",
    overview: {
      totalEmissions: 65, // Down to 65 kg CO2e
      totalWeight: 206,
      emissionsBreakdown: [
        { id: "production", label: "Production", percentage: 80, value: 52.0, color: "#548c8b" },
        { id: "customer_use", label: "Customer use", percentage: 16, value: 10.4, color: "#adc666" },
        { id: "transport", label: "Transport", percentage: 3, value: 2.0, color: "#d8bd48" },
        { id: "recycling", label: "Recycling", percentage: 1, value: 0.6, color: "#6eb172" }
      ],
      materialsBreakdown: [
        { id: "stainless_steel", label: "Stainless steel", weight: 60, percentage: 29.1, color: "#395b8c" },
        { id: "battery", label: "Battery", weight: 51, percentage: 24.8, color: "#548c8b" },
        { id: "glass", label: "Glass", weight: 40, percentage: 19.4, color: "#899a38" },
        { id: "circuit_boards", label: "Circuit boards", weight: 27, percentage: 13.1, color: "#b8cc3b" },
        { id: "other", label: "Other", weight: 12, percentage: 5.8, color: "#6ec1b8" },
        { id: "plastics", label: "Plastics", weight: 7, percentage: 3.4, color: "#bfa362" },
        { id: "display", label: "Display", weight: 8, percentage: 3.9, color: "#e78138" },
        { id: "aluminum", label: "Aluminum", weight: 1, percentage: 0.5, color: "#c8483b" }
      ],
      quickFacts: [
        "100% recycled gold in wire of all cameras and 100% recycled tin in solder",
        "Dynamic Island driven by energy-efficient OLED hardware controller",
        "Total product lifecycle carbon reduced to 65 kg CO₂e despite heavier features"
      ]
    },
    components: {
      display: {
        id: "display",
        name: "Always-On Dynamic Island OLED",
        category: "Display Subsystem",
        weightFormatted: "8g",
        weightPercentage: 3.9,
        materialColor: "#e78138",
        carbonFootprint: 10.9,
        carbonPercentage: 16.8,
        pin: { x: 368, y: 400 },
        emissionsBreakdown: [
          { label: "OLED & Island Controller Fab", percentage: 83, color: "#548c8b" },
          { label: "1Hz Always-On Power Draw", percentage: 14, color: "#adc666" },
          { label: "Transport", percentage: 2, color: "#d8bd48" },
          { label: "Recycling", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "Dynamic Island pill cutout features proximity sensor behind display",
          "Low-power 1Hz refresh rate dims screen to save power when idle",
          "Peak brightness up to 2000 nits with advanced thermal throttling"
        ]
      },
      stainless_steel: {
        id: "stainless_steel",
        name: "Surgical Steel Frame",
        category: "Structural Enclosure",
        weightFormatted: "60g",
        weightPercentage: 29.1,
        materialColor: "#395b8c",
        carbonFootprint: 15.2,
        carbonPercentage: 23.4,
        pin: { x: 476, y: 440 },
        emissionsBreakdown: [
          { label: "Precision Machining", percentage: 76, color: "#395b8c" },
          { label: "Lifespan", percentage: 12, color: "#adc666" },
          { label: "Logistics", percentage: 8, color: "#d8bd48" },
          { label: "Recycling", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "Removable back glass architecture simplifies battery & repair service",
          "100% recyclable surgical-grade stainless steel",
          "Reduced manufacturing scrap through optimized forging molds"
        ]
      },
      glass: {
        id: "glass",
        name: "Ceramic Shield & Frosted Glass",
        category: "Exterior Surfaces",
        weightFormatted: "40g",
        weightPercentage: 19.4,
        materialColor: "#899a38",
        carbonFootprint: 6.5,
        carbonPercentage: 10.0,
        pin: { x: 430, y: 370 },
        emissionsBreakdown: [
          { label: "Ceramic Processing", percentage: 80, color: "#899a38" },
          { label: "Use-phase", percentage: 12, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Recycling", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Ceramic Shield front remains tougher than any glass on smartphones",
          "Separate back glass reduces repair carbon footprint by over 60%",
          "Lead-free, arsenic-free, and mercury-free"
        ]
      },
      circuit_boards: {
        id: "circuit_boards",
        name: "48MP Pro Camera & A16 Bionic",
        category: "Semiconductors & Sensors",
        weightFormatted: "27g",
        weightPercentage: 13.1,
        materialColor: "#b8cc3b",
        carbonFootprint: 21.8,
        carbonPercentage: 33.5,
        pin: { x: 440, y: 320 },
        emissionsBreakdown: [
          { label: "4nm A16 & 48MP Sensor Fab", percentage: 86, color: "#b8cc3b" },
          { label: "Computing Power Draw", percentage: 10, color: "#adc666" },
          { label: "Transport", percentage: 3, color: "#d8bd48" },
          { label: "Refining", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled gold in wire of all cameras and logic board plating",
          "First 4nm architecture processor in iPhone history",
          "Emergency SOS satellite modem links with clean-powered earth stations"
        ]
      },
      battery: {
        id: "battery",
        name: "High-Density Li-Ion",
        category: "Power Subsystem",
        weightFormatted: "51g",
        weightPercentage: 24.8,
        materialColor: "#548c8b",
        carbonFootprint: 8.2,
        carbonPercentage: 12.6,
        pin: { x: 435, y: 450 },
        emissionsBreakdown: [
          { label: "Cell Production", percentage: 72, color: "#548c8b" },
          { label: "Charging Usage Over Lifespan", percentage: 20, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Recycling", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "All-day battery life with up to 23 hours video playback",
          "100% of final assembly facilities use certified renewable energy",
          "Daisy and Dave robots recover 100% of cobalt, lithium, and rare earths"
        ]
      },
      other: {
        id: "other",
        name: "Taptic & MagSafe",
        category: "Transducers & Magnets",
        weightFormatted: "12g",
        weightPercentage: 5.8,
        materialColor: "#6ec1b8",
        carbonFootprint: 2.6,
        carbonPercentage: 4.0,
        pin: { x: 433, y: 422 },
        emissionsBreakdown: [
          { label: "Magnet Production", percentage: 69, color: "#6ec1b8" },
          { label: "Use", percentage: 23, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled rare earth elements in all magnets across device",
          "100% recycled tungsten in Taptic Engine",
          "MagSafe ecosystem standards eliminate connector wear"
        ]
      },
      plastics: {
        id: "plastics",
        name: "Recycled Polymers",
        category: "Circular Polymers",
        weightFormatted: "7g",
        weightPercentage: 3.4,
        materialColor: "#bfa362",
        carbonFootprint: 1.4,
        carbonPercentage: 2.2,
        pin: { x: 433, y: 546 },
        emissionsBreakdown: [
          { label: "Compounding", percentage: 62, color: "#bfa362" },
          { label: "Use", percentage: 23, color: "#adc666" },
          { label: "Shipping", percentage: 10, color: "#d8bd48" },
          { label: "Recycling", percentage: 5, color: "#6eb172" }
        ],
        quickFacts: [
          "35% or more recycled plastic in 15 separate components",
          "Eliminates 600 metric tons of plastic packaging across the lineup",
          "RoHS and REACH compliant non-toxic formulations"
        ]
      },
      aluminum: {
        id: "aluminum",
        name: "Internal Recycled Aluminum",
        category: "Thermal Shielding",
        weightFormatted: "1g",
        weightPercentage: 0.5,
        materialColor: "#c8483b",
        carbonFootprint: 0.5,
        carbonPercentage: 0.8,
        pin: { x: 446, y: 395 },
        emissionsBreakdown: [
          { label: "Smelting", percentage: 66, color: "#c8483b" },
          { label: "Use", percentage: 22, color: "#adc666" },
          { label: "Logistics", percentage: 8, color: "#d8bd48" },
          { label: "Remelt", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled aluminum substructure",
          "Hydroelectric smelted with near-zero fossil carbon emissions",
          "Structural thermal bridge to frame"
        ]
      }
    }
  },

  "15pro": {
    id: "15pro",
    name: "iPhone 15 Pro",
    displayName: "iPhone 15 Pro",
    timelineName: "15 Pro",
    year: 2023,
    storage: "128GB model",
    image: "assets/phone_15pro.png",
    thumbImage: "assets/thumb_15pro.png",
    emissionsTitle: "Greenhouse Gas Emissions for iPhone 15 Pro—128GB model",
    materialsTitle: "Material Use for iPhone 15 Pro",
    overview: {
      totalEmissions: 66,
      totalWeight: 187, // Weight drops from 206g to 187g due to Titanium!
      emissionsBreakdown: [
        { id: "production", label: "Production", percentage: 76, value: 50.2, color: "#548c8b" },
        { id: "customer_use", label: "Customer use", percentage: 19, value: 12.5, color: "#adc666" },
        { id: "transport", label: "Transport", percentage: 4, value: 2.6, color: "#d8bd48" },
        { id: "recycling", label: "Recycling", percentage: 1, value: 0.7, color: "#6eb172" }
      ],
      materialsBreakdown: [
        { id: "stainless_steel", label: "Titanium & Aluminum", weight: 44, percentage: 23.5, color: "#395b8c" },
        { id: "battery", label: "Battery", weight: 48, percentage: 25.7, color: "#548c8b" },
        { id: "glass", label: "Glass", weight: 39, percentage: 20.9, color: "#899a38" },
        { id: "circuit_boards", label: "Circuit boards", weight: 28, percentage: 15.0, color: "#b8cc3b" },
        { id: "other", label: "Other", weight: 13, percentage: 7.0, color: "#6ec1b8" },
        { id: "plastics", label: "Plastics", weight: 6, percentage: 3.2, color: "#bfa362" },
        { id: "display", label: "Display", weight: 8, percentage: 4.3, color: "#e78138" },
        { id: "aluminum", label: "Copper", weight: 1, percentage: 0.5, color: "#c8483b" }
      ],
      quickFacts: [
        "Aerospace Grade 5 Titanium bonded to 100% recycled aluminum subframe",
        "First iPhone battery using 100% recycled cobalt in cathode chemistry",
        "Universal USB-C port standardizes charging cables to eliminate e-waste"
      ]
    },
    components: {
      display: {
        id: "display",
        name: "Super Retina XDR with Dynamic Island",
        category: "Display Subsystem",
        weightFormatted: "8g",
        weightPercentage: 4.3,
        materialColor: "#e78138",
        carbonFootprint: 10.5,
        carbonPercentage: 15.9,
        pin: { x: 368, y: 400 },
        emissionsBreakdown: [
          { label: "Fabrication", percentage: 82, color: "#548c8b" },
          { label: "Screen Power Draw", percentage: 15, color: "#adc666" },
          { label: "Transport", percentage: 2, color: "#d8bd48" },
          { label: "Recycling", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "Narrowest bezels ever on an iPhone reduce peripheral material volume",
          "Up to 2000 nits outdoor peak brightness with advanced power gating",
          "100% arsenic-free glass and mercury-free OLED panel"
        ]
      },
      stainless_steel: {
        id: "stainless_steel",
        name: "Grade 5 Titanium Enclosure",
        category: "Aerospace Titanium & Aluminum",
        weightFormatted: "44g",
        weightPercentage: 23.5,
        materialColor: "#395b8c",
        carbonFootprint: 14.8,
        carbonPercentage: 22.4,
        pin: { x: 476, y: 440 },
        emissionsBreakdown: [
          { label: "Diffusion Bonding & PVD", percentage: 75, color: "#395b8c" },
          { label: "Lifespan Durability", percentage: 13, color: "#adc666" },
          { label: "Freight", percentage: 8, color: "#d8bd48" },
          { label: "Closed-loop Scrap Recycling", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "Grade 5 Titanium outer band bonded to 100% recycled aluminum internal frame",
          "Solid-state diffusion technology uses thermo-mechanical pressure with zero adhesives",
          "Reduces total device weight by 19 grams compared to stainless steel"
        ]
      },
      glass: {
        id: "glass",
        name: "Ceramic Shield & Matte Glass",
        category: "Exterior Surfaces",
        weightFormatted: "39g",
        weightPercentage: 20.9,
        materialColor: "#899a38",
        carbonFootprint: 6.2,
        carbonPercentage: 9.4,
        pin: { x: 430, y: 370 },
        emissionsBreakdown: [
          { label: "Ceramic Crystallization", percentage: 80, color: "#899a38" },
          { label: "Use-phase", percentage: 13, color: "#adc666" },
          { label: "Logistics", percentage: 4, color: "#d8bd48" },
          { label: "Recycling", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Tougher than any smartphone glass with nano-scale ceramic crystals",
          "Easily removable back glass structure enables quick, modular repair",
          "Manufactured in clean-water certified facilities"
        ]
      },
      circuit_boards: {
        id: "circuit_boards",
        name: "3nm A17 Pro & USB-C Controller",
        category: "3nm Silicon & Gold",
        weightFormatted: "28g",
        weightPercentage: 15.0,
        materialColor: "#b8cc3b",
        carbonFootprint: 22.8,
        carbonPercentage: 34.5,
        pin: { x: 440, y: 320 },
        emissionsBreakdown: [
          { label: "3nm A17 Pro Fab & Logic Boards", percentage: 85, color: "#b8cc3b" },
          { label: "Usage", percentage: 11, color: "#adc666" },
          { label: "Air Shipping", percentage: 3, color: "#d8bd48" },
          { label: "Precious Metals Recovery", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "Industry's first commercial 3-nanometer processor (A17 Pro)",
          "100% recycled gold in USB-C connector plating and logic board traces",
          "100% recycled tin in solder of multiple printed circuit boards"
        ]
      },
      battery: {
        id: "battery",
        name: "100% Recycled Cobalt Battery",
        category: "Power Subsystem",
        weightFormatted: "48g",
        weightPercentage: 25.7,
        materialColor: "#548c8b",
        carbonFootprint: 7.9,
        carbonPercentage: 12.0,
        pin: { x: 435, y: 450 },
        emissionsBreakdown: [
          { label: "Recycled Cobalt Cell Assembly", percentage: 70, color: "#548c8b" },
          { label: "Charging Use Over Lifespan", percentage: 22, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Recycling Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "First iPhone battery with 100% certified recycled cobalt cathode",
          "99% recycled tungsten inside the device",
          "100% supplier transition to certified renewable electricity"
        ]
      },
      other: {
        id: "other",
        name: "MagSafe & Rare Earths",
        category: "Transducers & Magnets",
        weightFormatted: "13g",
        weightPercentage: 7.0,
        materialColor: "#6ec1b8",
        carbonFootprint: 2.5,
        carbonPercentage: 3.8,
        pin: { x: 433, y: 422 },
        emissionsBreakdown: [
          { label: "Magnet Production", percentage: 68, color: "#6ec1b8" },
          { label: "Usage", percentage: 24, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled rare earth elements in all magnets across device",
          "100% recycled copper foil in inductive MagSafe charging board",
          "Closed-loop rare earth magnet recovery with Daisy robot"
        ]
      },
      plastics: {
        id: "plastics",
        name: "Circular Engineering Polymers",
        category: "Circular Polymers",
        weightFormatted: "6g",
        weightPercentage: 3.2,
        materialColor: "#bfa362",
        carbonFootprint: 1.2,
        carbonPercentage: 1.8,
        pin: { x: 433, y: 546 },
        emissionsBreakdown: [
          { label: "Molding", percentage: 60, color: "#bfa362" },
          { label: "Use", percentage: 25, color: "#adc666" },
          { label: "Shipping", percentage: 10, color: "#d8bd48" },
          { label: "Recycling", percentage: 5, color: "#6eb172" }
        ],
        quickFacts: [
          "Up to 50% recycled plastic in multiple internal structural brackets",
          "Packaging is 99% fiber-based, bringing Apple closer to plastic-free boxes",
          "Eliminates phthalates and brominated compounds"
        ]
      },
      aluminum: {
        id: "aluminum",
        name: "Recycled Copper Foil",
        category: "Thermal & Conductive",
        weightFormatted: "1g",
        weightPercentage: 0.5,
        materialColor: "#c8483b",
        carbonFootprint: 0.5,
        carbonPercentage: 0.8,
        pin: { x: 446, y: 395 },
        emissionsBreakdown: [
          { label: "Refining", percentage: 65, color: "#c8483b" },
          { label: "Use", percentage: 22, color: "#adc666" },
          { label: "Transport", percentage: 9, color: "#d8bd48" },
          { label: "Remelt", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled copper in multiple printed circuit boards",
          "Thermal dissipation interface enhances 3nm chip sustained performance",
          "Zero conflict minerals certified"
        ]
      }
    }
  },

  "16pro": {
    id: "16pro",
    name: "iPhone 16 Pro",
    displayName: "iPhone 16 Pro",
    timelineName: "16 Pro",
    year: 2024,
    storage: "128GB model",
    image: "assets/phone_16pro.png",
    thumbImage: "assets/thumb_16pro.png",
    emissionsTitle: "Greenhouse Gas Emissions for iPhone 16 Pro—128GB model",
    materialsTitle: "Material Use for iPhone 16 Pro",
    overview: {
      totalEmissions: 66,
      totalWeight: 199,
      emissionsBreakdown: [
        { id: "production", label: "Production", percentage: 74, value: 48.8, color: "#548c8b" },
        { id: "customer_use", label: "Customer use", percentage: 20, value: 13.2, color: "#adc666" },
        { id: "transport", label: "Transport", percentage: 5, value: 3.3, color: "#d8bd48" },
        { id: "recycling", label: "Recycling", percentage: 1, value: 0.7, color: "#6eb172" }
      ],
      materialsBreakdown: [
        { id: "stainless_steel", label: "Titanium & Aluminum", weight: 48, percentage: 24.1, color: "#395b8c" },
        { id: "battery", label: "Battery", weight: 52, percentage: 26.1, color: "#548c8b" },
        { id: "glass", label: "Glass", weight: 41, percentage: 20.6, color: "#899a38" },
        { id: "circuit_boards", label: "Circuit boards", weight: 29, percentage: 14.6, color: "#b8cc3b" },
        { id: "other", label: "Other", weight: 13, percentage: 6.5, color: "#6ec1b8" },
        { id: "plastics", label: "Plastics", weight: 6, percentage: 3.0, color: "#bfa362" },
        { id: "display", label: "Display", weight: 9, percentage: 4.5, color: "#e78138" },
        { id: "aluminum", label: "Copper", weight: 1, percentage: 0.5, color: "#c8483b" }
      ],
      quickFacts: [
        "100% recycled aluminum internal thermal frame thermally clad to Grade 5 titanium",
        "Battery combines 100% recycled cobalt and over 95% recycled lithium",
        "100% fiber-based packaging completely eliminates plastic shrink-wrap and foils"
      ]
    },
    components: {
      display: {
        id: "display",
        name: "6.3-inch Ultra-thin Bezel OLED",
        category: "Display Subsystem",
        weightFormatted: "9g",
        weightPercentage: 4.5,
        materialColor: "#e78138",
        carbonFootprint: 10.8,
        carbonPercentage: 16.4,
        pin: { x: 368, y: 400 },
        emissionsBreakdown: [
          { label: "Display Driver & OLED Fab", percentage: 81, color: "#548c8b" },
          { label: "Customer Screen Usage", percentage: 16, color: "#adc666" },
          { label: "Transport", percentage: 2, color: "#d8bd48" },
          { label: "Recycling", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "Border Reduction Structure (BRS) expands viewable screen to 6.3 inches",
          "Advanced low-power subpixel drive circuit reduces idle draw by 20%",
          "Latest generation Ceramic Shield front with 50% tougher formulation"
        ]
      },
      stainless_steel: {
        id: "stainless_steel",
        name: "Titanium Substructure & Camera Control",
        category: "Grade 5 Titanium & Recycled Al",
        weightFormatted: "48g",
        weightPercentage: 24.1,
        materialColor: "#395b8c",
        carbonFootprint: 14.5,
        carbonPercentage: 22.0,
        pin: { x: 476, y: 440 },
        emissionsBreakdown: [
          { label: "Micro-blasting & Solid-state Diffusion", percentage: 74, color: "#395b8c" },
          { label: "Lifespan", percentage: 14, color: "#adc666" },
          { label: "Logistics", percentage: 8, color: "#d8bd48" },
          { label: "Recycling", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled aluminum thermal substructure boosts heat dissipation up to 20%",
          "Camera Control sapphire capacitive sensor with custom haptic feedback",
          "Grade 5 micro-blasted titanium provides exceptional strength-to-weight ratio"
        ]
      },
      glass: {
        id: "glass",
        name: "Ceramic Shield Gen 2 Glass",
        category: "Exterior Surfaces",
        weightFormatted: "41g",
        weightPercentage: 20.6,
        materialColor: "#899a38",
        carbonFootprint: 6.4,
        carbonPercentage: 9.7,
        pin: { x: 430, y: 370 },
        emissionsBreakdown: [
          { label: "Ceramic Formulation", percentage: 79, color: "#899a38" },
          { label: "In-use Longevity", percentage: 14, color: "#adc666" },
          { label: "Shipping", percentage: 4, color: "#d8bd48" },
          { label: "Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Latest-generation Ceramic Shield is 2x tougher than any smartphone glass",
          "Micro-textured rear glass in Desert Titanium and Natural Titanium hues",
          "Modular rear glass detachment enables low-carbon battery replacement"
        ]
      },
      circuit_boards: {
        id: "circuit_boards",
        name: "A18 Pro (3nm Gen 2) & Apple Intelligence",
        category: "Advanced Silicon & Optics",
        weightFormatted: "29g",
        weightPercentage: 14.6,
        materialColor: "#b8cc3b",
        carbonFootprint: 23.2,
        carbonPercentage: 35.1,
        pin: { x: 440, y: 320 },
        emissionsBreakdown: [
          { label: "3nm N3E Wafer Fab & Logic PCBs", percentage: 84, color: "#b8cc3b" },
          { label: "Neural Engine AI Power Draw", percentage: 12, color: "#adc666" },
          { label: "High-speed Logistics", percentage: 3, color: "#d8bd48" },
          { label: "Closed-loop Refining", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "A18 Pro 16-core Neural Engine delivers 35 TOPS with 20% higher efficiency",
          "100% recycled gold in plating of all PCBs and camera connections",
          "100% recycled tin in solder across all circuit boards and sensors"
        ]
      },
      battery: {
        id: "battery",
        name: "Recycled Lithium-Cobalt Battery",
        category: "Power Subsystem",
        weightFormatted: "52g",
        weightPercentage: 26.1,
        materialColor: "#548c8b",
        carbonFootprint: 7.9,
        carbonPercentage: 12.0,
        pin: { x: 435, y: 450 },
        emissionsBreakdown: [
          { label: "Recycled Chemistry Cell Fab", percentage: 69, color: "#548c8b" },
          { label: "Charging Use Over Lifespan", percentage: 23, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled cobalt and over 95% recycled lithium in battery chemistry",
          "Stainless steel battery enclosure option improves thermal performance",
          "Up to 27 hours video playback with enhanced intelligent power modes"
        ]
      },
      other: {
        id: "other",
        name: "MagSafe & Haptic Transducers",
        category: "Magnets & Transducers",
        weightFormatted: "13g",
        weightPercentage: 6.5,
        materialColor: "#6ec1b8",
        carbonFootprint: 2.3,
        carbonPercentage: 3.5,
        pin: { x: 433, y: 422 },
        emissionsBreakdown: [
          { label: "Magnet Sintering", percentage: 67, color: "#6ec1b8" },
          { label: "Charging Usage", percentage: 25, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Recycling", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled rare earth elements in all magnets across device",
          "100% recycled tungsten in Taptic Engine and haptic feedback actuator",
          "Faster 25W MagSafe charging with Qi2 certified high-efficiency coils"
        ]
      },
      plastics: {
        id: "plastics",
        name: "Bio & Upcycled Resins",
        category: "Circular Polymers",
        weightFormatted: "6g",
        weightPercentage: 3.0,
        materialColor: "#bfa362",
        carbonFootprint: 1.1,
        carbonPercentage: 1.7,
        pin: { x: 433, y: 546 },
        emissionsBreakdown: [
          { label: "Compounding", percentage: 58, color: "#bfa362" },
          { label: "Use", percentage: 27, color: "#adc666" },
          { label: "Logistics", percentage: 10, color: "#d8bd48" },
          { label: "Recycling", percentage: 5, color: "#6eb172" }
        ],
        quickFacts: [
          "100% fiber-based retail packaging eliminates all single-use plastics",
          "50% or more recycled plastic across internal brackets and speaker grilles",
          "All supplier facilities achieve zero-waste to landfill diversion"
        ]
      },
      aluminum: {
        id: "aluminum",
        name: "100% Recycled Copper Foil",
        category: "Thermal Subsystem",
        weightFormatted: "1g",
        weightPercentage: 0.5,
        materialColor: "#c8483b",
        carbonFootprint: 0.4,
        carbonPercentage: 0.6,
        pin: { x: 446, y: 395 },
        emissionsBreakdown: [
          { label: "Refining", percentage: 64, color: "#c8483b" },
          { label: "Use", percentage: 23, color: "#adc666" },
          { label: "Transport", percentage: 9, color: "#d8bd48" },
          { label: "Remelt", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled copper in printed circuit boards and thermal spreaders",
          "Ultra-thin conductive vapor interface keeps A18 Pro running cooler",
          "Conflict-free certified extraction supply chain"
        ]
      }
    }
  },

  "17pro": {
    id: "17pro",
    name: "iPhone 17 Pro",
    displayName: "iPhone 17 Pro",
    timelineName: "17 Pro",
    year: 2025,
    storage: "256GB model",
    image: "assets/phone_17pro.png",
    thumbImage: "assets/thumb_17pro.png",
    emissionsTitle: "Greenhouse Gas Emissions for iPhone 17 Pro—256GB model",
    materialsTitle: "Material Use for iPhone 17 Pro",
    overview: {
      totalEmissions: 52,
      totalWeight: 196,
      emissionsBreakdown: [
        { id: "production", label: "Production", percentage: 70, value: 36.4, color: "#548c8b" },
        { id: "customer_use", label: "Customer use", percentage: 23, value: 12.0, color: "#adc666" },
        { id: "transport", label: "Transport", percentage: 5, value: 2.6, color: "#d8bd48" },
        { id: "recycling", label: "Recycling", percentage: 2, value: 1.0, color: "#6eb172" }
      ],
      materialsBreakdown: [
        { id: "stainless_steel", label: "Titanium & Aluminum", weight: 47, percentage: 24.0, color: "#395b8c" },
        { id: "battery", label: "Battery", weight: 53, percentage: 27.0, color: "#548c8b" },
        { id: "glass", label: "Glass", weight: 39, percentage: 19.9, color: "#899a38" },
        { id: "circuit_boards", label: "Circuit boards", weight: 28, percentage: 14.3, color: "#b8cc3b" },
        { id: "other", label: "Other", weight: 14, percentage: 7.1, color: "#6ec1b8" },
        { id: "plastics", label: "Plastics", weight: 5, percentage: 2.6, color: "#bfa362" },
        { id: "display", label: "Display", weight: 9, percentage: 4.6, color: "#e78138" },
        { id: "aluminum", label: "Copper", weight: 1, percentage: 0.5, color: "#c8483b" }
      ],
      quickFacts: [
        "First iPhone built with 100% renewable electricity across direct assembly and supply chain",
        "100% recycled cobalt, lithium, and copper in battery and interconnect subsystems",
        "100% fiber-based packaging with zero virgin plastic foils or pull tabs"
      ]
    },
    components: {
      display: {
        id: "display",
        name: "Micro-Lens ProMotion OLED Display",
        category: "Display Subsystem",
        weightFormatted: "9g",
        weightPercentage: 4.6,
        materialColor: "#e78138",
        carbonFootprint: 8.8,
        carbonPercentage: 16.9,
        pin: { x: 368, y: 400 },
        emissionsBreakdown: [
          { label: "Display Driver & Clean Fab", percentage: 79, color: "#548c8b" },
          { label: "Ultra-low Screen Power Draw", percentage: 18, color: "#adc666" },
          { label: "Clean Logistics", percentage: 2, color: "#d8bd48" },
          { label: "Recycling", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "Micro-lens array increases light output efficiency by 25% with reduced power draw",
          "Thinnest border design in Apple history expands active screen area to 6.3 inches",
          "Ceramic Shield Pro front formulated with 100% recycled glass cullet"
        ]
      },
      stainless_steel: {
        id: "stainless_steel",
        name: "Recycled Titanium & Aluminum Matrix",
        category: "Grade 5 Titanium & Circular Al",
        weightFormatted: "47g",
        weightPercentage: 24.0,
        materialColor: "#395b8c",
        carbonFootprint: 11.4,
        carbonPercentage: 21.9,
        pin: { x: 476, y: 440 },
        emissionsBreakdown: [
          { label: "Clean Hydro-Powered Smelting", percentage: 72, color: "#395b8c" },
          { label: "In-use Longevity", percentage: 15, color: "#adc666" },
          { label: "Transport", percentage: 8, color: "#d8bd48" },
          { label: "Closed-loop Recovery", percentage: 5, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled aerospace titanium exterior clad to 100% recycled internal aluminum core",
          "Solid-state diffusion bonding process cut enclosure manufacturing energy by 35%",
          "Sapphire capacitive Camera Control sensor with integrated force transducers"
        ]
      },
      glass: {
        id: "glass",
        name: "Ceramic Shield Pro Glass",
        category: "Exterior Surfaces",
        weightFormatted: "39g",
        weightPercentage: 19.9,
        materialColor: "#899a38",
        carbonFootprint: 5.2,
        carbonPercentage: 10.0,
        pin: { x: 430, y: 370 },
        emissionsBreakdown: [
          { label: "Bio-gas Melt & Ion Exchange", percentage: 76, color: "#899a38" },
          { label: "Longevity & Protection", percentage: 16, color: "#adc666" },
          { label: "Shipping", percentage: 5, color: "#d8bd48" },
          { label: "Cullet Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Nano-crystalline ceramic matrix delivers unparalleled scratch and fracture resistance",
          "Precision-milled rear plateau integrates camera ring seamlessly with zero metal bezel waste",
          "Easily detachable back glass architecture ensures zero-damage battery replacement"
        ]
      },
      circuit_boards: {
        id: "circuit_boards",
        name: "A19 Pro (2nm GAA) & 100% Recycled Gold",
        category: "2nm Silicon & Neural Engine",
        weightFormatted: "28g",
        weightPercentage: 14.3,
        materialColor: "#b8cc3b",
        carbonFootprint: 17.7,
        carbonPercentage: 34.0,
        pin: { x: 440, y: 320 },
        emissionsBreakdown: [
          { label: "2nm Clean Room Fabrication", percentage: 82, color: "#b8cc3b" },
          { label: "Neural Engine AI Energy Use", percentage: 14, color: "#adc666" },
          { label: "Logistics", percentage: 3, color: "#d8bd48" },
          { label: "Urban Mining Refining", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "TSMC 2nm Gate-All-Around (GAA) architecture cuts silicon energy draw by 25%",
          "100% certified recycled gold in plating of all PCBs, camera modules, and USB-C",
          "100% recycled tin in solder across all logic boards, sensors, and flash memory"
        ]
      },
      battery: {
        id: "battery",
        name: "100% Recycled Cobalt & Lithium Cell",
        category: "Power Subsystem",
        weightFormatted: "53g",
        weightPercentage: 27.0,
        materialColor: "#548c8b",
        carbonFootprint: 6.2,
        carbonPercentage: 11.9,
        pin: { x: 435, y: 450 },
        emissionsBreakdown: [
          { label: "Recycled Precursor Cell Fab", percentage: 66, color: "#548c8b" },
          { label: "Cycle Lifespan Power Draw", percentage: 26, color: "#adc666" },
          { label: "Logistics", percentage: 5, color: "#d8bd48" },
          { label: "Closed-loop Hydrometallurgy", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "First iPhone battery with 100% recycled cobalt and certified 95%+ recycled lithium",
          "Steel-jacketed design enhances thermal dissipation and extends cycle life to 1,500 charges",
          "Full 28-hour all-day battery life with machine-learning power balancing"
        ]
      },
      other: {
        id: "other",
        name: "Recycled Neodymium & Taptic Subsystems",
        category: "Rare Earths & Actuators",
        weightFormatted: "14g",
        weightPercentage: 7.1,
        materialColor: "#6ec1b8",
        carbonFootprint: 1.8,
        carbonPercentage: 3.5,
        pin: { x: 433, y: 422 },
        emissionsBreakdown: [
          { label: "Sintering", percentage: 64, color: "#6ec1b8" },
          { label: "In-use Haptics", percentage: 28, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Magnet Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled rare earth elements across MagSafe ring, speakers, and camera OIS",
          "100% recycled tungsten in Taptic Engine provides ultra-precise haptic responses",
          "Qi2-ready wireless charging module operates with 92% inductive energy transfer"
        ]
      },
      plastics: {
        id: "plastics",
        name: "Bio-circular Engineering Resins",
        category: "Circular Polymers",
        weightFormatted: "5g",
        weightPercentage: 2.6,
        materialColor: "#bfa362",
        carbonFootprint: 0.8,
        carbonPercentage: 1.5,
        pin: { x: 433, y: 546 },
        emissionsBreakdown: [
          { label: "Bio-feedstock Synth", percentage: 55, color: "#bfa362" },
          { label: "Use", percentage: 30, color: "#adc666" },
          { label: "Transport", percentage: 10, color: "#d8bd48" },
          { label: "Recovery", percentage: 5, color: "#6eb172" }
        ],
        quickFacts: [
          "Internal brackets constructed with 70% post-consumer bio-circular resins",
          "Zero plastic shrink wrap, stickers, or plastic accessories in product box",
          "All tier-1 supplier facilities certified 100% Zero Waste to Landfill"
        ]
      },
      aluminum: {
        id: "aluminum",
        name: "Recycled Copper Vapor Chamber",
        category: "Thermal Subsystem",
        weightFormatted: "1g",
        weightPercentage: 0.5,
        materialColor: "#c8483b",
        carbonFootprint: 0.3,
        carbonPercentage: 0.6,
        pin: { x: 446, y: 395 },
        emissionsBreakdown: [
          { label: "Foil Refining", percentage: 60, color: "#c8483b" },
          { label: "Thermal Dissipation", percentage: 27, color: "#adc666" },
          { label: "Transport", percentage: 9, color: "#d8bd48" },
          { label: "Closed-loop Remelt", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "Laser-welded 100% recycled copper vapor chamber channels heat evenly to frame",
          "Allows sustained peak gaming and AI performance without thermal throttling",
          "Recovered cleanly with Daisy robotics separation"
        ]
      }
    }
  },

  "18pro": {
    id: "18pro",
    name: "iPhone 18 Pro",
    displayName: "iPhone 18 Pro",
    timelineName: "18 Pro",
    year: 2026,
    storage: "256GB model",
    image: "assets/phone_18pro.png",
    thumbImage: "assets/thumb_18pro.png",
    emissionsTitle: "Greenhouse Gas Emissions for iPhone 18 Pro—256GB model (Apple 2030)",
    materialsTitle: "Material Use for iPhone 18 Pro",
    overview: {
      totalEmissions: 42,
      totalWeight: 194,
      emissionsBreakdown: [
        { id: "production", label: "Production", percentage: 64, value: 26.9, color: "#548c8b" },
        { id: "customer_use", label: "Customer use", percentage: 28, value: 11.8, color: "#adc666" },
        { id: "transport", label: "Transport", percentage: 5, value: 2.1, color: "#d8bd48" },
        { id: "recycling", label: "Recycling", percentage: 3, value: 1.2, color: "#6eb172" }
      ],
      materialsBreakdown: [
        { id: "stainless_steel", label: "Liquid Titanium & Al", weight: 45, percentage: 23.2, color: "#395b8c" },
        { id: "battery", label: "Battery", weight: 54, percentage: 27.8, color: "#548c8b" },
        { id: "glass", label: "Glass", weight: 38, percentage: 19.6, color: "#899a38" },
        { id: "circuit_boards", label: "Circuit boards", weight: 27, percentage: 13.9, color: "#b8cc3b" },
        { id: "other", label: "Other", weight: 15, percentage: 7.7, color: "#6ec1b8" },
        { id: "plastics", label: "Plastics", weight: 5, percentage: 2.6, color: "#bfa362" },
        { id: "display", label: "Display", weight: 9, percentage: 4.6, color: "#e78138" },
        { id: "aluminum", label: "Copper", weight: 1, percentage: 0.5, color: "#c8483b" }
      ],
      quickFacts: [
        "Apple 2030 Landmark: Certified Carbon Neutral across entire device lifecycle",
        "100% circular recycled critical minerals: cobalt, lithium, tungsten, gold, tin & rare earths",
        "Disassembled entirely by next-gen Taz & Daisy robotic recycling cells in closed loops"
      ]
    },
    components: {
      display: {
        id: "display",
        name: "Full-Screen Under-Display Sensor OLED",
        category: "Display Subsystem",
        weightFormatted: "9g",
        weightPercentage: 4.6,
        materialColor: "#e78138",
        carbonFootprint: 7.1,
        carbonPercentage: 16.9,
        pin: { x: 368, y: 400 },
        emissionsBreakdown: [
          { label: "100% Solar-Powered Clean Fab", percentage: 76, color: "#548c8b" },
          { label: "Adaptive Quantum Drive", percentage: 20, color: "#adc666" },
          { label: "Transport", percentage: 3, color: "#d8bd48" },
          { label: "Circular Recovery", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "True seamless edge-to-edge screen with invisible under-display Face ID sensors",
          "Ultra-low power variable 1Hz-144Hz ProMotion with quantum-dot backplane",
          "Manufactured with 100% zero-carbon electricity and recycled optical substrates"
        ]
      },
      stainless_steel: {
        id: "stainless_steel",
        name: "100% Recycled Liquid Titanium & Al",
        category: "Liquid Titanium Alloy",
        weightFormatted: "45g",
        weightPercentage: 23.2,
        materialColor: "#395b8c",
        carbonFootprint: 8.8,
        carbonPercentage: 21.0,
        pin: { x: 476, y: 440 },
        emissionsBreakdown: [
          { label: "Renewable Electric Arc Forging", percentage: 70, color: "#395b8c" },
          { label: "Structural In-use Longevity", percentage: 17, color: "#adc666" },
          { label: "Maritime Low-Carbon Transport", percentage: 7, color: "#d8bd48" },
          { label: "Direct Closed-loop Remelt", percentage: 6, color: "#6eb172" }
        ],
        quickFacts: [
          "Next-generation amorphous liquid titanium alloy delivers unmatched strength at lower mass",
          "100% secondary recycled feedstock processed with zero fossil fuels",
          "Capacitive flush haptic rails replace mechanical toggle switches entirely"
        ]
      },
      glass: {
        id: "glass",
        name: "Sapphire-Infused Ceramic Shield 3",
        category: "Exterior Surfaces",
        weightFormatted: "38g",
        weightPercentage: 19.6,
        materialColor: "#899a38",
        carbonFootprint: 4.2,
        carbonPercentage: 10.0,
        pin: { x: 430, y: 370 },
        emissionsBreakdown: [
          { label: "Clean Electric Kiln Synthesis", percentage: 74, color: "#899a38" },
          { label: "Drop & Scratch Defense", percentage: 18, color: "#adc666" },
          { label: "Logistics", percentage: 5, color: "#d8bd48" },
          { label: "Closed-loop Remelt", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Sapphire-infused crystalline structure achieves diamond-like scratch durability",
          "Rear matte texture produced with laser micro-etching with zero chemical acid etching",
          "Non-destructive separation allows rapid chassis reuse across Apple trade-ins"
        ]
      },
      circuit_boards: {
        id: "circuit_boards",
        name: "A20 Pro (2nm+ GAA) & Optical Neural Interconnect",
        category: "Advanced Silicon & Photonics",
        weightFormatted: "27g",
        weightPercentage: 13.9,
        materialColor: "#b8cc3b",
        carbonFootprint: 14.3,
        carbonPercentage: 34.0,
        pin: { x: 440, y: 320 },
        emissionsBreakdown: [
          { label: "Clean Energy GAA Fab", percentage: 80, color: "#b8cc3b" },
          { label: "Optical Bus Energy Efficiency", percentage: 16, color: "#adc666" },
          { label: "Transport", percentage: 3, color: "#d8bd48" },
          { label: "Precious Metals Refining", percentage: 1, color: "#6eb172" }
        ],
        quickFacts: [
          "Next-gen silicon with optical on-package interconnects cuts communication energy by 40%",
          "100% recycled gold, copper, and tin certified across all logic boards and sensors",
          "Integrated on-device generative AI models execute with 35% higher energy efficiency"
        ]
      },
      battery: {
        id: "battery",
        name: "Solid-State Hybrid Circular Battery",
        category: "Power Subsystem",
        weightFormatted: "54g",
        weightPercentage: 27.8,
        materialColor: "#548c8b",
        carbonFootprint: 5.0,
        carbonPercentage: 11.9,
        pin: { x: 435, y: 450 },
        emissionsBreakdown: [
          { label: "Solid-State Cell Fab", percentage: 63, color: "#548c8b" },
          { label: "Long-cycle Lifespan Efficiency", percentage: 29, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Recycling", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "Solid-state electrolyte with 100% recycled cobalt, lithium, and graphite anode",
          "Retains 90% health after 2,000 charge cycles, doubling standard smartphone battery lifespan",
          "Quick-release magnetic thermal decoupling enables 60-second robot removal"
        ]
      },
      other: {
        id: "other",
        name: "Closed-Loop Rare Earths & Haptic Motors",
        category: "Magnets & Transducers",
        weightFormatted: "15g",
        weightPercentage: 7.7,
        materialColor: "#6ec1b8",
        carbonFootprint: 1.5,
        carbonPercentage: 3.6,
        pin: { x: 433, y: 422 },
        emissionsBreakdown: [
          { label: "Green Sintering", percentage: 62, color: "#6ec1b8" },
          { label: "Haptic Actuation", percentage: 30, color: "#adc666" },
          { label: "Transport", percentage: 5, color: "#d8bd48" },
          { label: "Recovery", percentage: 3, color: "#6eb172" }
        ],
        quickFacts: [
          "100% recycled neodymium, dysprosium, and praseodymium across all acoustic transducers",
          "Zero conflict minerals: certified 100% traceable ethical origin supply chain",
          "Ultra-broadband haptic engine delivers realistic textures for spatial computing"
        ]
      },
      plastics: {
        id: "plastics",
        name: "100% Algae & Bio-circular Polymers",
        category: "Next-Gen Polymers",
        weightFormatted: "5g",
        weightPercentage: 2.6,
        materialColor: "#bfa362",
        carbonFootprint: 0.7,
        carbonPercentage: 1.7,
        pin: { x: 433, y: 546 },
        emissionsBreakdown: [
          { label: "Bio-cultivation Synth", percentage: 52, color: "#bfa362" },
          { label: "Use", percentage: 33, color: "#adc666" },
          { label: "Logistics", percentage: 10, color: "#d8bd48" },
          { label: "Compost & Recovery", percentage: 5, color: "#6eb172" }
        ],
        quickFacts: [
          "All internal polymer structures formulated from sustainably harvested marine algae",
          "100% plastic-free packaging made from recycled sugarcane bagasse and bamboo fiber",
          "Zero carbon footprint in polymer polymerization phase"
        ]
      },
      aluminum: {
        id: "aluminum",
        name: "Graphene-Copper Micro Vapor Chamber",
        category: "Thermal Subsystem",
        weightFormatted: "1g",
        weightPercentage: 0.5,
        materialColor: "#c8483b",
        carbonFootprint: 0.4,
        carbonPercentage: 0.9,
        pin: { x: 446, y: 395 },
        emissionsBreakdown: [
          { label: "Micro-machining", percentage: 58, color: "#c8483b" },
          { label: "Heat Transfer Use", percentage: 29, color: "#adc666" },
          { label: "Transport", percentage: 9, color: "#d8bd48" },
          { label: "Closed-loop Remelt", percentage: 4, color: "#6eb172" }
        ],
        quickFacts: [
          "Graphene-intercalated copper foil provides 3x higher thermal conductivity than raw aluminum",
          "Enables prolonged on-device LLM inference without active fan cooling",
          "100% recycled copper recovered via high-yield hydrometallurgy"
        ]
      }
    }
  }
};

// High-resolution component cutaway images and hardware badge mapping
const ALL_IPHONE_IDS = ['xs', '11pro', '12pro', '13pro', '14pro', '15pro', '16pro', '17pro', '18pro'];
const MODEL_COMPONENT_IMAGES = {};
ALL_IPHONE_IDS.forEach((m) => {
  MODEL_COMPONENT_IMAGES[m] = {
    battery: `assets/comp_${m}_battery.png`,
    circuit_boards: `assets/comp_${m}_circuit_boards.png`,
    display: `assets/comp_${m}_display.png`,
    stainless_steel: `assets/comp_${m}_stainless_steel.png`,
    other: `assets/comp_${m}_other.png`,
    glass: `assets/comp_${m}_glass.png`,
    plastics: `assets/comp_${m}_plastics.png`,
    aluminum: `assets/comp_${m}_aluminum.png`
  };
});

const COMPONENT_BADGES = {
  battery: "assets/badge_battery.png",
  circuit_boards: "assets/badge_circuit_boards.png",
  display: "assets/badge_display.png",
  stainless_steel: "assets/badge_stainless_steel.png",
  other: "assets/badge_other.png",
  glass: "assets/badge_display.png",
  plastics: "assets/badge_other.png",
  aluminum: "assets/badge_stainless_steel.png"
};

// Enrich all models with component images and badges
for (const [mId, m] of Object.entries(IPHONE_MODELS_DATA)) {
  m.componentImages = MODEL_COMPONENT_IMAGES[mId] || MODEL_COMPONENT_IMAGES.xs;
  if (m.components) {
    for (const [cId, comp] of Object.entries(m.components)) {
      if (cId === "battery") {
        comp.badgeImage = `assets/battery_${mId}.png`;
      } else if (!comp.badgeImage && COMPONENT_BADGES[cId]) {
        comp.badgeImage = COMPONENT_BADGES[cId];
      }
    }
  }
}

// Currently selected active model data
let currentModelId = "xs";
let ENVIRONMENTAL_DATA = IPHONE_MODELS_DATA["xs"];

function setModelData(modelId) {
  if (IPHONE_MODELS_DATA[modelId]) {
    currentModelId = modelId;
    ENVIRONMENTAL_DATA = IPHONE_MODELS_DATA[modelId];
    if (typeof window !== "undefined") {
      window.ENVIRONMENTAL_DATA = ENVIRONMENTAL_DATA;
      window.currentModelId = currentModelId;
    }
    return ENVIRONMENTAL_DATA;
  }
  return null;
}

if (typeof window !== "undefined") {
  window.IPHONE_MODELS_DATA = IPHONE_MODELS_DATA;
  window.ENVIRONMENTAL_DATA = ENVIRONMENTAL_DATA;
  window.setModelData = setModelData;
  window.currentModelId = currentModelId;
}
