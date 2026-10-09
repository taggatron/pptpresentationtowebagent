import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# 10 Weeks Curriculum Data
WEEKS_DATA = [
    {
        "week": 1,
        "date": "Thursday, 8 October 2026",
        "time": "18:30 – 21:00",
        "title": "Composition Viewpoints & Camera Familiarisation",
        "subtitle": "Bird's-Eye, Worm's-Eye, Eye-Level, Through-View & Safe Field Practice",
        "accent": RGBColor(37, 99, 235),       # Royal Blue
        "accent_light": RGBColor(239, 246, 255),
        "dark": RGBColor(15, 23, 42),
        "slides": [
            {
                "type": "overview",
                "title": "Week 1: Session Overview & Objectives",
                "lead": "Transforming passive seeing into intentional photographic composition and safe camera mastery.",
                "cards": [
                    ("Camera Familiarisation", "Master primary DSLR/mirrorless controls: Mode Dial, command wheels, shutter button, AF/MF switches, and display menus."),
                    ("Safe Field Practice", "Enforce strict neck-strap etiquette, proper two-handed grip posture, safe lens changes, and battery care."),
                    ("Composition Viewpoints", "Explore Bird's-eye, Worm's-eye, Eye-level, and Through-view apertures to control physical and emotional perspective."),
                    ("Introductory Review", "Establish supportive peer review protocols and analyze framing choices in our first live shoot review.")
                ]
            },
            {
                "type": "content_2col",
                "title": "Hardware Familiarisation & Safe Handling",
                "lead": "Operating your camera intuitively requires muscle memory and consistent field discipline.",
                "col1": {
                    "header": "Primary Physical Controls",
                    "bullets": [
                        "Mode Dial: Switch cleanly between Creative Modes (P, S/Tv, A/Av, M).",
                        "Main Command Wheel: Dial in primary shutter and aperture values quickly.",
                        "Two-Stage Shutter: Half-press to lock autofocus and meter; full press to capture.",
                        "AF/MF Lens Toggle: Switch to manual focus for tricky macro or low-contrast targets.",
                        "Viewfinder Diopter: Calibrate optical sharpness to your personal eyesight."
                    ]
                },
                "col2": {
                    "header": "Essential Safety & Gear Protocols",
                    "bullets": [
                        "Neck-Strap Rule: Strap around neck or wrist securely before touching camera.",
                        "Lens Swaps: Point body downwards in shelter; minimize sensor dust exposure.",
                        "Two-Hand Posture: Left palm cradles lens barrel; right hand controls the grip.",
                        "Battery Hygiene: Store spares warm; never eject cards while write LED blinks.",
                        "Tripod Etiquette: Extend thickest leg sections first; level before mounting."
                    ]
                }
            },
            {
                "type": "content_4grid",
                "title": "The Four Creative Composition Viewpoints",
                "lead": "Changing physical elevation and camera angle radically alters viewer emotion and scale.",
                "items": [
                    ("Eye-Level View", "Neutral, honest intimacy.\n\nConnects with human-scale realism, creating approachable, documentary visual engagement without artificial distortion."),
                    ("Worm's-Eye View", "Dramatic stature & power.\n\nShooting from ground-level up exaggerates vertical lines, amplifies foreground texture, and renders subjects heroic."),
                    ("Bird's-Eye View", "Graphic planar geometry.\n\nLooking straight down flattens spatial depth into patterns, shadows, geometric shapes, and abstract topographies."),
                    ("Through-View", "Environmental depth layers.\n\nPeering through doorways, windows, foliage, or arches creates a 'frame within a frame' that pulls the viewer inwards.")
                ]
            },
            {
                "type": "content_2col",
                "title": "Common Viewpoint Pitfalls & Pro Fixes",
                "lead": "Overcoming the default instinct of shooting everything from standing chest height.",
                "col1": {
                    "header": "Typical Beginner Pitfalls",
                    "bullets": [
                        "The Standing Stagnation: Shooting every subject from casual standing height.",
                        "Cluttered Apertures: Through-views blocked by distracting, unreadable foregrounds.",
                        "Crooked Horizons: Accidental tilted camera levels when tilting for low angles.",
                        "Lost Subject: Bird's-eye views where subject blends into textured background."
                    ]
                },
                "col2": {
                    "header": "The Professional Solutions",
                    "bullets": [
                        "Physical Mobility: Kneel, lie down, or climb to find unexpected angles.",
                        "Clean Foreground Framing: Ensure frame elements are intentionally blurred or sharp.",
                        "Grid & Level Overlay: Activate viewfinder electronic levels and 3x3 grids.",
                        "Contrast & Separation: Use light or color contrast to separate subject from floor."
                    ]
                }
            },
            {
                "type": "challenge",
                "title": "In-Class Practical Challenge: The 3-Angle Study",
                "lead": "Campus Field Exercise (45 Minutes) — Capture 1 Subject from 3 Radically Different Viewpoints.",
                "steps": [
                    ("Step 1: Select Your Campus Anchor", "Locate an interesting architectural element, outdoor sculpture, garden bench, or doorway on campus."),
                    ("Step 2: Capture 3 Contrasting Angles", "Shot A: Eye-level context.\nShot B: Extreme ground-level Worm's-eye looking upward.\nShot C: High-angle Bird's-eye or Through-view frame."),
                    ("Step 3: Enforce Safe Handling", "Always keep your neck strap engaged. Practice cradling lens barrel with your non-dominant hand."),
                    ("Step 4: Image Culling & Selection", "Select your best 3 images and import them for peer review in the digital darkroom lab.")
                ]
            },
            {
                "type": "review_homework",
                "title": "Constructive Critique & Weekly Homework",
                "lead": "Building visual literacy through supportive analysis and deliberate weekly practice.",
                "critique": [
                    "Focus First on Intent: Ask what emotion or visual narrative the viewpoint communicates.",
                    "Evaluate Edge Control: Check frame corners for intrusive, distracting elements.",
                    "Constructive Tone: Offer two specific strengths and one creative recommendation."
                ],
                "homework": [
                    "Assignment: Complete a '5 Viewpoints Study' of an everyday household or garden subject.",
                    "Deliverable: 5 high-res files (Eye-level, Low worm's-eye, Overhead, Through-view, Canted angle).",
                    "Next Week Preview: Week 2 delves into the Rule of Thirds, Leading Lines, and Visual Balance!"
                ]
            }
        ]
    },
    {
        "week": 2,
        "date": "Thursday, 15 October 2026",
        "time": "18:30 – 21:00",
        "title": "Composition: Rule of Thirds & Leading Lines",
        "subtitle": "Framing, Focal Points, Visual Balance, and Directing the Viewer's Eye",
        "accent": RGBColor(5, 150, 105),      # Emerald Green
        "accent_light": RGBColor(236, 253, 245),
        "dark": RGBColor(15, 23, 42),
        "slides": [
            {
                "type": "overview",
                "title": "Week 2: Session Overview & Objectives",
                "lead": "Guiding the viewer's eye through intentional compositional geometry and visual balance.",
                "cards": [
                    ("Rule of Thirds", "Utilize the 3x3 grid intersections to position key subjects dynamically off-center."),
                    ("Leading Lines", "Harness natural and built lines (paths, handrails, shorelines) to draw viewers into scenes."),
                    ("Visual Balance", "Master symmetrical stability versus asymmetrical tension using negative space."),
                    ("Practical Challenges", "Execute 3 distinct framing and line-navigation challenges on the college grounds.")
                ]
            },
            {
                "type": "content_2col",
                "title": "Mastering the Rule of Thirds",
                "lead": "Moving beyond static bullseye centering to create energy, movement, and visual tension.",
                "col1": {
                    "header": "The 3x3 Grid Geometry",
                    "bullets": [
                        "Power Points: The 4 intersections where human eyes naturally rest first.",
                        "Horizon Placement: Place horizons on upper third (foreground focus) or lower third (sky focus).",
                        "Subject Placement: Align vertical elements (trees, people, towers) along the vertical lines.",
                        "Eye Alignment in Portraits: Place subject's dominant eye directly on the upper horizontal third."
                    ]
                },
                "col2": {
                    "header": "When to Break the Rule",
                    "bullets": [
                        "Symmetry & Reflections: Central framing creates formal dignity and calm equilibrium.",
                        "Architectural Facades: Perfect centered perspective emphasizes monumental order.",
                        "Circular Motifs: Spirals, tunnels, and concentric circles benefit from central focal points.",
                        "Deliberate Claustrophobia: Edge crowding creates unsettling psychological tension."
                    ]
                }
            },
            {
                "type": "content_4grid",
                "title": "Types of Leading Lines & Visual Trajectories",
                "lead": "Lines act as visual pathways, dictating the exact speed and journey of the viewer's eye.",
                "items": [
                    ("Linear Perspective Lines", "Parallel lines converging toward a vanishing point.\n\nRoads, railway tracks, hallways, and boardwalks that pull the eye deep into the z-axis."),
                    ("Curved & S-Curves", "Gentle, lyrical pacing.\n\nWinding rivers, footpaths, shorelines, and architecture that guide the eye gracefully through the frame."),
                    ("Diagonal Energy Lines", "Dynamic motion & tension.\n\nDiagonals cut across the horizontal plane, creating speed, instability, and cinematic visual drama."),
                    ("Implied & Sight Lines", "Invisible psychological pathways.\n\nThe direction a subject gazes, or pointing gestures, that compel the viewer to look where the subject looks.")
                ]
            },
            {
                "type": "challenge",
                "title": "In-Class Practical Challenge: The Line Hunter",
                "lead": "Campus Field Exercise (45 Minutes) — Capture 3 Defined Compositional Studies.",
                "steps": [
                    ("Challenge 1: The S-Curve Journey", "Locate a curved path, staircase handrail, or architectural garden border that snakes into the frame."),
                    ("Challenge 2: The Horizon Decision", "Photograph an open outdoor scene twice: once with horizon on top third, once with horizon on bottom third."),
                    ("Challenge 3: Converging Diagonals", "Find parallel structural lines that converge toward an off-center focal subject."),
                    ("Challenge 4: Visual Review", "Compare how different line angles completely alter the mood and visual speed of the scene.")
                ]
            },
            {
                "type": "review_homework",
                "title": "Critique Rubric & Weekly Homework",
                "lead": "Evaluating compositional geometry and preparing for manual camera exposure.",
                "critique": [
                    "Does the line lead to a clear focal point, or does it lead the eye out of the frame?",
                    "Is visual weight balanced, or does one side feel unintentionally empty/heavy?",
                    "Check for distracting edge tangents where shapes awkwardly touch the frame boundary."
                ],
                "homework": [
                    "Assignment: Shoot a photo series titled 'Lines in My Environment' (Architecture or Nature).",
                    "Deliverable: 3 curated images demonstrating: (1) S-Curve, (2) Rule of Thirds, (3) Converging Lines.",
                    "Next Week Preview: Week 3 unlocks the Exposure Triangle (Aperture, Shutter Speed, and ISO)!"
                ]
            }
        ]
    },
    {
        "week": 3,
        "date": "Thursday, 22 October 2026",
        "time": "18:30 – 21:00",
        "title": "Aperture, Shutter Speed & ISO Fundamentals",
        "subtitle": "The Exposure Triangle, Depth of Field, Motion Control & Noise Management",
        "accent": RGBColor(217, 119, 6),      # Amber / Gold
        "accent_light": RGBColor(254, 243, 199),
        "dark": RGBColor(15, 23, 42),
        "slides": [
            {
                "type": "overview",
                "title": "Week 3: Session Overview & Objectives",
                "lead": "De-mystifying the three pillars of photographic exposure for complete creative autonomy.",
                "cards": [
                    ("The Exposure Triangle", "Understand how Aperture, Shutter Speed, and ISO balance light together."),
                    ("Aperture & Depth of Field", "Control plane of focus: wide f/1.8 bokeh isolation vs f/16 front-to-back sharpness."),
                    ("Shutter Speed & Motion", "Freeze fast action at 1/1000s or create silky intentional blur at 1/15s."),
                    ("ISO Sensitivity & Noise", "Balance sensor gain in low light while mitigating digital grain and artifacts.")
                ]
            },
            {
                "type": "content_2col",
                "title": "The Exposure Triangle: Balancing the Triad",
                "lead": "Exposure is a three-way seesaw: changing one setting requires compensating with another.",
                "col1": {
                    "header": "Core Functions of Each Pillar",
                    "bullets": [
                        "Aperture (f-stop): Controls light volume AND depth of field sharpness.",
                        "Shutter Speed (seconds): Controls light duration AND motion capture.",
                        "ISO (sensitivity): Controls electronic signal gain AND digital image noise.",
                        "Equivalence: 1 stop change in any pillar doubles or halves the light gathering."
                    ]
                },
                "col2": {
                    "header": "Creative Priorities in the Field",
                    "bullets": [
                        "Portraits: Prioritize Aperture (f/1.8 – f/2.8) to blur distracting backgrounds.",
                        "Fast Sports: Prioritize Shutter Speed (1/1000s+) to freeze explosive action.",
                        "Landscape: Prioritize Aperture (f/8 – f/11) and base ISO (100) on a tripod.",
                        "Night Handheld: Accept higher ISO (3200+) to preserve handheld shutter safety."
                    ]
                }
            },
            {
                "type": "content_4grid",
                "title": "Demystifying Camera Shooting Modes",
                "lead": "Graduating from Green Auto to semi-manual and fully manual exposure control.",
                "items": [
                    ("Program Mode (P)", "Intelligent baseline automation.\n\nCamera sets aperture and shutter; photographer easily shifts exposure compensation and ISO as needed."),
                    ("Aperture Priority (A / Av)", "Depth-of-field control.\n\nYou choose the f-stop; camera automatically calculates matching shutter speed. Ideal for portraits and travel."),
                    ("Shutter Priority (S / Tv)", "Motion-first control.\n\nYou lock in the shutter speed; camera adjusts the aperture. Essential for sports, wildlife, and waterfall blur."),
                    ("Full Manual Mode (M)", "Complete artistic sovereignty.\n\nYou control Aperture, Shutter, and ISO independently. Essential for studio lighting, night, and tricky light.")
                ]
            },
            {
                "type": "challenge",
                "title": "In-Class Practical Challenge: The Bokeh & Motion Lab",
                "lead": "Studio & Hallway Stations (45 Minutes) — Hands-On Exposure Control Exercises.",
                "steps": [
                    ("Station 1: Shallow vs Deep DoF", "Set lens to maximum aperture (e.g. f/2.8) and shoot a close portrait. Then shoot at f/16. Note background clarity."),
                    ("Station 2: Freeze Action vs Motion Blur", "Have a peer wave hands or walk quickly. Capture at 1/1000s (frozen crisp) and at 1/15s (creative pan/blur)."),
                    ("Station 3: ISO Noise Inspection", "Shoot the same scene at ISO 100, 800, 3200, and 12800. Zoom to 100% on LCD to observe shadow noise."),
                    ("Station 4: Exposure Compensation", "Practice dialling in +1 EV on backlit subjects to prevent silhouette underexposure.")
                ]
            },
            {
                "type": "review_homework",
                "title": "Critique Rubric & Weekly Homework",
                "lead": "Reviewing sharpness, motion intent, and exposure accuracy.",
                "critique": [
                    "Is critical focus placed precisely on the subject's nearest eye or key feature?",
                    "Is motion blur intentional and artistic, or the result of accidental camera shake?",
                    "Are highlight details preserved, or are clouds/skin blown out to pure clipped white?"
                ],
                "homework": [
                    "Assignment: Shoot a 2-part study: 'Frozen World' (1/1000s) and 'Fluid Motion' (1/15s – 1/30s).",
                    "Deliverable: Submit EXIF metadata alongside 2 contrast images demonstrating shutter control.",
                    "Important Notice: Next week is Autumn Break (29 Oct). Class resumes Week 4 on Thu 5 Nov!"
                ]
            }
        ]
    },
    {
        "week": 4,
        "date": "Thursday, 5 November 2026",
        "time": "18:30 – 21:00",
        "title": "Aperture, Shutter Speed & ISO: Changing Light",
        "subtitle": "Dynamic Environments, Motion Refinement, and Essential Digital Adjustments",
        "accent": RGBColor(124, 58, 237),     # Indigo / Purple
        "accent_light": RGBColor(245, 243, 255),
        "dark": RGBColor(15, 23, 42),
        "slides": [
            {
                "type": "overview",
                "title": "Week 4: Session Overview & Objectives",
                "lead": "Applying manual exposure in rapidly shifting ambient light and mastering non-destructive digital workflow.",
                "cards": [
                    ("Dynamic Light Response", "Adapt settings quickly as twilight fades, clouds shift, or moving indoors."),
                    ("Motion Balancing", "Balance minimum handheld shutter speeds (1/focal length rule) against high ISO."),
                    ("RAW vs JPEG Essentials", "Leverage RAW digital negative dynamic range for shadow and highlight recovery."),
                    ("Basic Digital Darkroom", "Perform global adjustments: exposure, white balance, contrast, curves, and lens profiles.")
                ]
            },
            {
                "type": "content_2col",
                "title": "Shooting in Rapidly Changing Light",
                "lead": "Transitioning from bright late-afternoon daylight into indoor corridors and evening twilight.",
                "col1": {
                    "header": "Ambient Metering Techniques",
                    "bullets": [
                        "Evaluative / Matrix: Averages the whole frame; great for general evenly lit scenes.",
                        "Center-Weighted: Prioritizes center 60%; ideal for classic environmental portraits.",
                        "Spot Metering: Reads exact 2-3% center point; vital for high-contrast stage/backlighting.",
                        "Histogram Interpretation: Mountain peak curve; avoid clipping left (shadows) or right (highlights)."
                    ]
                },
                "col2": {
                    "header": "Preventing Unwanted Camera Shake",
                    "bullets": [
                        "Reciprocal Rule: Minimum shutter speed = 1 / focal length (e.g. 1/50s for 50mm lens).",
                        "Image Stabilization (IS/VR): Gives 3-4 stops advantage, but cannot freeze subject motion.",
                        "Elbows Tucked Posture: Anchor elbows against chest and breathe out smoothly before capture.",
                        "Auto ISO Thresholds: Set maximum ISO ceiling (e.g. 6400) and minimum shutter speed in camera menu."
                    ]
                }
            },
            {
                "type": "content_4grid",
                "title": "The Digital Darkroom: 4 Core RAW Adjustments",
                "lead": "Transforming flat, uncompressed sensor data into vibrant, balanced final photographs.",
                "items": [
                    ("Exposure & Tone Curve", "Setting white and black points.\n\nExpand dynamic range by gently pulling down harsh highlights and lifting muddy shadow tones."),
                    ("White Balance Calibration", "Correcting color temperature.\n\nNeutralizing unwanted fluorescent green or incandescent orange casts to ensure lifelike skin tones."),
                    ("Clarity, Texture & Dehaze", "Midtone contrast sculpt.\n\nMicro-contrast enhancement brings out stone texture and foliage depth without crushing shadows."),
                    ("Lens Optical Correction", "Geometric & vignette profile.\n\nAutomatically remove barrel distortion, chromatic aberration purple fringing, and corner darkening.")
                ]
            },
            {
                "type": "challenge",
                "title": "In-Class Practical Challenge: Twilight Transition",
                "lead": "Outdoor/Indoor Transition Exercise (45 Minutes) — Chasing the Declining Autumn Light.",
                "steps": [
                    ("Step 1: The Golden to Blue Shift", "Begin shooting outdoors during sunset; track how your ISO must double every 10 minutes to hold shutter speed."),
                    ("Step 2: Contrast Metering Test", "Shoot a backlit doorway: meter once for the bright sky, then once for the subject's face using Spot Metering."),
                    ("Step 3: RAW File Import Lab", "Transfer capture files into Lightroom/Camera Raw in the media lab. Inspect your histogram."),
                    ("Step 4: Execute Tone Recovery", "Recover blown highlights in the sky and lift underexposed foreground shadows using sliders.")
                ]
            },
            {
                "type": "review_homework",
                "title": "Critique Rubric & Weekly Homework",
                "lead": "Analyzing dynamic range handling and non-destructive post-processing restraint.",
                "critique": [
                    "Has highlight recovery caused unnatural grey haloes around high-contrast edges?",
                    "Is color temperature balanced naturally across skin and environmental light?",
                    "Is image noise managed cleanly with subtle luminance noise reduction?"
                ],
                "homework": [
                    "Assignment: Capture 1 scene across changing light (Late afternoon, Dusk, Night street lamp).",
                    "Deliverable: Submit RAW files alongside edited JPEGs showing exposure balance adjustments.",
                    "Next Week Preview: Week 5 enters Natural & Studio Portraiture, posing, and lighting!"
                ]
            }
        ]
    },
    {
        "week": 5,
        "date": "Thursday, 12 November 2026",
        "time": "18:30 – 21:00",
        "title": "Natural and Studio Portraiture",
        "subtitle": "Available Light, Posing, Backgrounds, Studio Strobes & Ethical Practice",
        "accent": RGBColor(225, 29, 72),      # Warm Coral / Rose
        "accent_light": RGBColor(255, 241, 242),
        "dark": RGBColor(15, 23, 42),
        "slides": [
            {
                "type": "overview",
                "title": "Week 5: Session Overview & Objectives",
                "lead": "Capturing expressive, respectful human portraits using available natural light and studio lighting.",
                "cards": [
                    ("Available Natural Light", "Harness window light, open shade, and reflectors to sculpt natural facial features."),
                    ("Posing & Direction", "Guide subjects with gentle, comfortable verbal cues, natural posture, and angle breaks."),
                    ("Studio Lighting Setup", "Master the classic 3-point lighting setup: Key Light, Fill Light, and Rim/Hair Light."),
                    ("Safe & Respectful Practice", "Establish clear consent, comfortable boundaries, and ethical portrait collaboration.")
                ]
            },
            {
                "type": "content_2col",
                "title": "Natural Light vs Studio Strobe Techniques",
                "lead": "Balancing soft ambient directional light against high-precision artificial modifiers.",
                "col1": {
                    "header": "Sculpting with Natural Light",
                    "bullets": [
                        "North-Facing Window: Softest, most flattering diffuse light source available.",
                        "Open Shade: Avoids harsh midday squinting; delivers even, creamy skin tones.",
                        "5-in-1 Reflector: Silver for punchy fill; white for subtle bounce; gold for warm sunset glow.",
                        "Catchlights: Position subject so light source reflects visibly in the upper iris."
                    ]
                },
                "col2": {
                    "header": "The 3-Point Studio Setup",
                    "bullets": [
                        "Key Light (45° angle): Primary directional light defining facial contours and form.",
                        "Fill Light (opposite side): Softens harsh nose/cheek shadows; ratio 2:1 or 3:1.",
                        "Rim / Hair Light (behind): Separates dark hair and shoulders from dark studio backdrops.",
                        "Softboxes & Umbrellas: Larger light source relative to subject = softer shadow roll-off."
                    ]
                }
            },
            {
                "type": "content_4grid",
                "title": "Posing Principles & Collaborative Direction",
                "lead": "Making subjects feel confident, relaxed, and genuinely represented in front of the lens.",
                "items": [
                    ("Shoulder Angles", "Avoid flat frontal mugshots.\n\nTurn shoulders 45 degrees away from camera to create slimming lines and elegant visual depth."),
                    ("Weight Shift", "Natural bodily curves.\n\nHave subject rest weight on back foot to drop shoulders naturally and eliminate rigid stiffness."),
                    ("Chin & Jawline", "Defining separation.\n\nSlightly extend chin forward and down toward camera to eliminate double chins and sharpen jaw contours."),
                    ("Safe & Ethical Etiquette", "Absolute bodily consent.\n\nNever touch a subject to adjust pose or hair; mirror the pose physically yourself and give clear cues.")
                ]
            },
            {
                "type": "challenge",
                "title": "In-Class Practical Challenge: The Portrait Rotation",
                "lead": "Studio & Ambient Bays (45 Minutes) — Working in Pairs with Peer Subjects.",
                "steps": [
                    ("Bay 1: Soft Window Light", "Pose your partner beside large north windows. Use a white foam board to bounce soft fill into shadows."),
                    ("Bay 2: Studio Key & Rim Strobe", "Configure a softbox key at 45 degrees and a hair light. Capture 3 expressive headshots."),
                    ("Bay 3: Background Separation", "Open aperture to f/2.0 or f/2.8; pull model 3 meters away from background to achieve smooth bokeh."),
                    ("Bay 4: Review & Feedback", "Show your partner the images on back of camera, ensuring they feel flattered and respected.")
                ]
            },
            {
                "type": "review_homework",
                "title": "Critique Rubric & Weekly Homework",
                "lead": "Evaluating emotional connection, flattering lighting, and facial contouring.",
                "critique": [
                    "Are catchlights crisp and present in both eyes to give life and sparkle to the gaze?",
                    "Does the nose shadow form an elegant loop (Rembrandt/Loop lighting) without bisecting the lip?",
                    "Is the background clean, uncluttered, and complimentary to the subject's wardrobe?"
                ],
                "homework": [
                    "Assignment: Create an 'Environmental Portrait' of a family member, friend, or craftsperson.",
                    "Brief: Incorporate surrounding tools or environment that tell a story about who they are.",
                    "Next Week Preview: Week 6 dives into Abstract Vision & Macro Photography!"
                ]
            }
        ]
    },
    {
        "week": 6,
        "date": "Thursday, 19 November 2026",
        "time": "18:30 – 21:00",
        "title": "Abstract and Macro Photography",
        "subtitle": "Close-Up Techniques, Texture, Pattern, Shape & Everyday Creative Interpretation",
        "accent": RGBColor(8, 145, 178),       # Cyan / Teal
        "accent_light": RGBColor(236, 254, 255),
        "dark": RGBColor(15, 23, 42),
        "slides": [
            {
                "type": "overview",
                "title": "Week 6: Session Overview & Objectives",
                "lead": "Discovering hidden miniature universes and transforming mundane everyday objects into fine art.",
                "cards": [
                    ("Macro Gear & Mechanics", "Understand 1:1 true magnification, minimum focusing distances, and extension tubes."),
                    ("Texture & Relief Lighting", "Use raking directional side-light to emphasize microscopic tactile textures."),
                    ("Pattern, Rhythm & Shape", "Isolate repeating visual cadences and disrupt them with deliberate focal anomalies."),
                    ("Abstract Interpretation", "De-contextualize familiar everyday items until they become pure graphic art.")
                ]
            },
            {
                "type": "content_2col",
                "title": "Macro Optics & Technical Precision",
                "lead": "Working at millimeter distances requires surgical focusing and specialized camera stabilization.",
                "col1": {
                    "header": "Magnification & Focus Depth",
                    "bullets": [
                        "1:1 Reproduction: Subject appears same physical size on sensor as in the real world.",
                        "Razor-Thin DoF: At close range, depth of field shrinks to fractions of a millimeter.",
                        "Manual Focus Rocking: Set focus ring fixed, then rock body gently forward/backward.",
                        "Diffraction Limits: Avoid f/22+; diffraction softens detail. Sweet spot is f/8 – f/11."
                    ]
                },
                "col2": {
                    "header": "Stabilization & Vibration Control",
                    "bullets": [
                        "Tripod Imperative: Handheld micro-shakes ruin edge-to-edge sharpness instantly.",
                        "2-Second Shutter Delay: Eliminates mechanical finger vibration upon shutter button press.",
                        "Electronic Shutter / Mirror Lockup: Eliminates internal mirror slap vibrations.",
                        "Wind Management: Even slight outdoor breezes throw botanical subjects out of focal plane."
                    ]
                }
            },
            {
                "type": "content_4grid",
                "title": "Elements of Abstract Photographic Vision",
                "lead": "Stripping away subject identity to celebrate the fundamental building blocks of art.",
                "items": [
                    ("Tactile Texture", "Roughness, grain & weave.\n\nPeeling paint, woven textiles, rust, wood bark, and stone fissures lit with harsh side-light."),
                    ("Repeating Pattern", "Rhythm & visual cadence.\n\nBrick courses, radiator grilles, leaf veins, and tile mosaics that create hypnotic visual repetition."),
                    ("Pure Geometric Shape", "Circles, triangles & arches.\n\nFraming bold graphic silhouettes and shadows where geometry supersedes subject function."),
                    ("Color Fields & Gradients", "Atmospheric chromatic wash.\n\nExtreme soft focus blurring liquid drops or colored paper into luminous abstract gradient paintings.")
                ]
            },
            {
                "type": "challenge",
                "title": "In-Class Practical Challenge: The Micro Scavenger Hunt",
                "lead": "Studio Tabletop Lab (45 Minutes) — Discovering Art in Everyday Classroom Items.",
                "steps": [
                    ("Station 1: Textures of Decay", "Photograph rusted hinges, crumpled foil, or shredded cardboard using raking side-light."),
                    ("Station 2: Liquid Refraction & Drops", "Suspend water/glycerin droplets on glass plates; photograph colorful patterns refracted underneath."),
                    ("Station 3: Abstract Geometry", "Frame extreme close-ups of mechanical items (watch movements, typewriter keys, camera lenses)."),
                    ("Station 4: Guess the Object", "Review images with classmates: does the photo succeed as an abstract composition before identifying the item?")
                ]
            },
            {
                "type": "review_homework",
                "title": "Critique Rubric & Weekly Homework",
                "lead": "Evaluating razor sharpness, abstract graphic strength, and visual intrigue.",
                "critique": [
                    "Is critical plane of focus pinned precisely on the highest-interest micro texture?",
                    "Does the composition stand strong as an abstract piece of design without needing explanation?",
                    "Are edges and corners free from unintended out-of-focus background clutter?"
                ],
                "homework": [
                    "Assignment: Create a 4-part grid series titled 'Macro in the Kitchen'.",
                    "Subjects: Spices, fruit skin, cutlery reflections, or dish soap bubbles.",
                    "Next Week Preview: Week 7 steps outdoors for Landscape & Architectural Photography!"
                ]
            }
        ]
    },
    {
        "week": 7,
        "date": "Thursday, 26 November 2026",
        "time": "18:30 – 21:00",
        "title": "Landscape and Architecture",
        "subtitle": "Horizon Placement, Foreground Interest, Perspective, Symmetry & Natural Light Dynamics",
        "accent": RGBColor(15, 118, 110),     # Forest Slate / Pine
        "accent_light": RGBColor(240, 253, 250),
        "dark": RGBColor(15, 23, 42),
        "slides": [
            {
                "type": "overview",
                "title": "Week 7: Session Overview & Objectives",
                "lead": "Designing commanding outdoor environments and structural built forms with spatial depth.",
                "cards": [
                    ("Horizon Placement", "Dictate scene narrative: dramatic stormy sky vs rich textured foreground floor."),
                    ("Foreground Anchoring", "Use stones, wildflowers, steps, and boardwalks to create immense front-to-back depth."),
                    ("Architectural Perspective", "Master linear symmetry and correct vertical converging keystoning in buildings."),
                    ("Natural Light Dynamics", "Harness the golden hour, blue twilight, and side-directional sunlight across facades.")
                ]
            },
            {
                "type": "content_2col",
                "title": "Designing Front-to-Back Landscape Depth",
                "lead": "Translating vast 3-dimensional expanses onto a flat 2-dimensional sensor.",
                "col1": {
                    "header": "The 3-Layer Spatial Recipe",
                    "bullets": [
                        "Foreground: Rocks, shoreline puddles, or foliage within 1-2 meters of camera.",
                        "Midground: Secondary focal point (lake, barn, tree grove, winding path).",
                        "Background: Distant mountain peaks, dramatic cloud deck, or setting sun.",
                        "Hyperfocal Distance: Focus roughly one-third into scene at f/8–f/11 for infinite sharpness."
                    ]
                },
                "col2": {
                    "header": "Atmospheric Lighting Windows",
                    "bullets": [
                        "Golden Hour (Hour after sunrise/before sunset): Warm, long shadows sculpt landscape contours.",
                        "Blue Hour (Twilight after sunset): Electric cyan skies balance glowing artificial city lights.",
                        "Overcast Softbox: Ideal for woodland waterfalls, mossy canyons, and architecture textures.",
                        "Storm Light: High-contrast drama when sun breaks beneath dark rain clouds."
                    ]
                }
            },
            {
                "type": "content_4grid",
                "title": "Architectural Geometry & Keystoning",
                "lead": "Capturing man-made structures with crisp lines, formal elegance, and balanced perspective.",
                "items": [
                    ("Correcting Keystoning", "Preventing backward-falling buildings.\n\nKeep camera sensor perfectly parallel to the building facade, or correct converging verticals in post-processing."),
                    ("Formal Symmetrical Façade", "Monolithic equilibrium & order.\n\nStand on the exact center axis of grand archways, colonnades, and modern glass facades."),
                    ("Dynamic Low-Angle Corner", "Exaggerated vertical soaring.\n\nStand at the corner base with an ultra-wide lens to emphasize dramatic diagonal thrust into the sky."),
                    ("Abstract Structural Details", "Isolating rhythm & materials.\n\nZooming in on repetitive window bays, brutalist concrete textures, and steel beam intersections.")
                ]
            },
            {
                "type": "challenge",
                "title": "In-Class Practical Challenge: Campus Architecture & Grounds",
                "lead": "Campus Grounds Field Exercise (45 Minutes) — Exterior Built Environment & Landscape.",
                "steps": [
                    ("Study 1: The 3-Layer Landscape", "Find a green space on campus; get low to ground with an anchor foreground rock or flower."),
                    ("Study 2: Perfect Structural Symmetry", "Align yourself along the central axis of an entrance corridor or atrium. Verify level."),
                    ("Study 3: Vertical Convergence Study", "Shoot a multi-story campus building looking upward; intentionally contrast with a leveled perspective."),
                    ("Study 4: Tripod Stability Drill", "Lock camera onto tripod, engage 2-sec timer, and test long exposure stability in twilight.")
                ]
            },
            {
                "type": "review_homework",
                "title": "Critique Rubric & Weekly Homework",
                "lead": "Evaluating level horizons, front-to-back sharpness, and structural integrity.",
                "critique": [
                    "Is the horizon line dead level, or is water tilted downhill awkwardly?",
                    "Does the foreground element add storytelling value, or does it clutter the entry into the scene?",
                    "Are vertical lines in architecture plumb and upright, or distracting and keystoned?"
                ],
                "homework": [
                    "Assignment: Capture 'Urban or Rural Haven' — 1 Landscape and 1 Architectural study.",
                    "Brief: Shoot during Golden Hour or Blue Hour to exploit directional natural light.",
                    "Next Week Preview: Week 8 explores Shadows, Silhouettes, Dappled Light, and Reflections!"
                ]
            }
        ]
    },
    {
        "week": 8,
        "date": "Thursday, 3 December 2026",
        "time": "18:30 – 21:00",
        "title": "Shadows, Silhouettes & Dappled Light",
        "subtitle": "High-Contrast Metering, Backlighting, Gobos, Reflections & Mood",
        "accent": RGBColor(51, 65, 85),       # Slate / Charcoal
        "accent_light": RGBColor(241, 245, 249),
        "dark": RGBColor(15, 23, 42),
        "slides": [
            {
                "type": "overview",
                "title": "Week 8: Session Overview & Objectives",
                "lead": "Harnessing high-contrast illumination, graphic shadow play, and reflective surfaces for visual poetry.",
                "cards": [
                    ("High-Contrast Metering", "Expose strictly for highlights to allow deep shadows to plunge into graphic black."),
                    ("Silhouettes & Contours", "Position subjects against luminous skies or studio backdrops with crisp outer edges."),
                    ("Dappled Light & Gobos", "Cast artistic patterns across subjects using tree canopies, blinds, and lace fabrics."),
                    ("Reflective Surfaces", "Multiply visual realities through puddles, architectural glazing, and polished metallics.")
                ]
            },
            {
                "type": "content_2col",
                "title": "The Art of the Photographic Silhouette",
                "lead": "Eliminating internal surface detail to transform subjects into iconic graphic shapes.",
                "col1": {
                    "header": "Technique for True Silhouettes",
                    "bullets": [
                        "Light Placement: Light source must be positioned directly behind your subject.",
                        "Spot Meter the Bright Background: Meter the sky or backlight; do NOT meter the subject.",
                        "Stop Down Exposure: Dial in -1 to -2 EV exposure compensation to prevent shadow detail.",
                        "Clean Separation: Ensure the silhouette shape does not merge into dark foreground bushes."
                    ]
                },
                "col2": {
                    "header": "Expressive Shadow Narratives",
                    "bullets": [
                        "Shadow as Subject: Frame elongated late-afternoon shadows as the primary visual element.",
                        "Negative Space Power: Deep rich blacks provide resting areas that emphasize delicate lights.",
                        "Gobo Patterns: Cast venetian blind stripes across eyes to evoke classic film-noir intrigue.",
                        "Dappled Foliage: Filter harsh sunlight through leafy canopies for dappled impressionistic portraits."
                    ]
                }
            },
            {
                "type": "content_4grid",
                "title": "Working with Creative Reflections",
                "lead": "Doubling perspective, creating surreal symmetries, and framing worlds within worlds.",
                "items": [
                    ("Rain Puddles", "Ground-level portals.\n\nPlace lens millimeters above a rain puddle on tarmac to mirror historic architecture and street pedestrians."),
                    ("Shopfront Glazing", "Layered urban double exposures.\n\nCapture the interior store display simultaneously blended with the reflected street traffic behind you."),
                    ("Still Water Reflections", "Glass-like meditative symmetry.\n\nEarly morning lakes without wind offer perfect mirror reflections of mountain skylines and trees."),
                    ("Distorted & Ripple Glass", "Impressionistic abstraction.\n\nReflections off wavy historic window panes or ripples break rigid architecture into fluid painted ripples.")
                ]
            },
            {
                "type": "challenge",
                "title": "In-Class Practical Challenge: The High-Contrast Lab",
                "lead": "Studio & Courtyard Exercise (45 Minutes) — Experimenting with Light, Cutouts & Reflections.",
                "steps": [
                    ("Station 1: The Studio Silhouette", "Place subject in front of a white studio backdrop blasted by two strobes. Capture a profile silhouette."),
                    ("Station 2: Venetian Blind Gobo", "Shine a continuous hard Fresnel light through blinds. Cast dramatic shadow stripes across your subject's face."),
                    ("Station 3: The Mirror / Puddle Portal", "Use a shallow black tray filled with water and mirrors to photograph reflected faces and ceiling arches."),
                    ("Station 4: Exposure Compensation Test", "Under-expose deliberately by 1, 2, and 3 stops; observe how shadows turn to solid, cinematic graphic shapes.")
                ]
            },
            {
                "type": "review_homework",
                "title": "Critique Rubric & Weekly Homework",
                "lead": "Evaluating tonal contrast, silhouette readability, and reflective clarity.",
                "critique": [
                    "Is the silhouette shape immediately identifiable, or are limbs awkwardly clustered?",
                    "Are the highlights preserved without ugly electronic blown-out clipping?",
                    "Does the shadow contribute storytelling meaning, or is it an accidental dark hole?"
                ],
                "homework": [
                    "Assignment: Complete a 3-image photo series titled 'Shadows & Reflections'.",
                    "Deliverable: (1) Crisp silhouette, (1) Dappled light pattern, (1) Surface reflection.",
                    "Next Week Preview: Week 9 launches your independent Personal Capstone Project!"
                ]
            }
        ]
    },
    {
        "week": 9,
        "date": "Thursday, 10 December 2026",
        "time": "18:30 – 21:00",
        "title": "Personal Project: Conception, Shoot & Culling",
        "subtitle": "Choosing a Theme, Planning Locations & Subjects, Capture & Digital Culling",
        "accent": RGBColor(147, 51, 234),     # Electric Violet
        "accent_light": RGBColor(250, 245, 255),
        "dark": RGBColor(15, 23, 42),
        "slides": [
            {
                "type": "overview",
                "title": "Week 9: Session Overview & Objectives",
                "lead": "Transitioning from weekly technique exercises into unified, self-directed photographic storytelling.",
                "cards": [
                    ("Theme Conceptualisation", "Define a cohesive visual focus: Street Life, Botanical Study, Heritage, or Portraits."),
                    ("Location & Shoot Logistics", "Plan lighting conditions, subject permissions, shot lists, and contingency plans."),
                    ("Independent Shoot", "Execute your capture plan with artistic discipline, technical consistency, and focus."),
                    ("Rigorous Digital Culling", "Import, organize, and use star ratings to ruthlessly whittle hundreds of shots to a top 10.")
                ]
            },
            {
                "type": "content_2col",
                "title": "Developing a Cohesive Project Series",
                "lead": "A successful portfolio is not just good pictures; it is a unified body of visual work.",
                "col1": {
                    "header": "Sample Thematic Pathways",
                    "bullets": [
                        "Path A — 'Quiet Coastal Spaces': Empty seaside benches, winter light, weathered wood.",
                        "Path B — 'Faces of the Community': Environmental portraits of local shopkeepers and artisans.",
                        "Path C — 'Concrete & Glass': Brutalist geometry, architectural reflections, and shadows.",
                        "Path D — 'Micro Flora': A botanical survey of winter textures and decaying leaves."
                    ]
                },
                "col2": {
                    "header": "Visual Consistency Anchors",
                    "bullets": [
                        "Aspect Ratio & Orientation: Stick to consistent framing (all landscape or all portrait).",
                        "Focal Length Discipline: Using one prime lens (e.g. 35mm or 50mm) creates unified perspective.",
                        "Color Palette Harmony: Consistent warm golden tones, desaturated cool tones, or monochrome.",
                        "Depth of Field Unity: Keep a consistent depth approach across the entire series."
                    ]
                }
            },
            {
                "type": "content_4grid",
                "title": "The Professional Digital Culling Workflow",
                "lead": "Editing is 50% shooting and 50% curation. Ruthless elimination reveals your best work.",
                "cards": [
                    ("Pass 1: Rejection Blitz", "Mark and reject.\n\nQuickly discard technical failures: blurry motion, missed focus, accidental misfires, and blinks."),
                    ("Pass 2: Three-Star Selection", "Tag potential candidates.\n\nFlag every image with emotional resonance, strong geometry, or evocative light with 3 stars."),
                    ("Pass 3: Direct Head-to-Head", "Compare similar captures.\n\nPut identical setups side-by-side; keep only the single frame with best micro-expression or line."),
                    ("Pass 4: Five-Star Shortlist", "Curate the capstone suite.\n\nSelect your top 5–7 hero images that narrate a complete, balanced story together without repetition.")
                ]
            },
            {
                "type": "challenge",
                "title": "In-Class Practical Challenge: The Project Sprint",
                "lead": "Independent Shoot & Lab Session (60 Minutes) — Initial Capture & 1-on-1 Tutor Guidance.",
                "steps": [
                    ("Step 1: Pitch Your Brief", "Discuss your project proposal with tutor for 5 minutes; clarify technical approach and thematic boundaries."),
                    ("Step 2: Campus / Studio Shoot Sprint", "Execute your initial capture batch across the college studio, darkroom, or architectural grounds."),
                    ("Step 3: Ingest to Digital Lab", "Transfer files to student drive; create structured folders: /RAW, /Selects, /Exports."),
                    ("Step 4: Star-Rating Culling Session", "Perform Pass 1 and Pass 2 culling; select top 10 candidates for tutor review before final adjustments.")
                ]
            },
            {
                "type": "review_homework",
                "title": "Review & Week 10 Preparation",
                "lead": "Preparing your final series for printing, finishing, and the graduation exhibition.",
                "critique": [
                    "Do the images look like they belong in the same book or exhibition room?",
                    "Is there a clear hero image that anchors the visual story?",
                    "Are technical settings consistent across the entire portfolio sequence?"
                ],
                "homework": [
                    "Assignment: Finish your independent shoot and select your final 3–5 photographs.",
                    "Deliverable: Complete basic color grading, cropping, and prepare high-res TIFF/JPEG files.",
                    "Next Week Preview: Week 10 is our Grand Capstone Exhibition, Critique Celebration, and Farewell!"
                ]
            }
        ]
    },
    {
        "week": 10,
        "date": "Thursday, 17 December 2026",
        "time": "18:30 – 21:00",
        "title": "Personal Project, Exhibition & Farewell!",
        "subtitle": "Final Image Polish, Print Curation, Group Gallery Showcase & Future Pathways",
        "accent": RGBColor(234, 88, 12),      # Golden Orange / Amber Sunset
        "accent_light": RGBColor(255, 247, 237),
        "dark": RGBColor(15, 23, 42),
        "slides": [
            {
                "type": "overview",
                "title": "Week 10: Session Overview & Objectives",
                "lead": "Celebrating 10 weeks of creative transformation: final polish, gallery presentation, and future journeys.",
                "cards": [
                    ("Final Image Polish", "Apply precise final adjustments: tone curve nuance, color grading, and output sharpening."),
                    ("Curating the Final Series", "Select and sequence your final 3–5 capstone prints for optimal narrative flow."),
                    ("Group Exhibition Showcase", "Mount and display work in the studio gallery for peer celebration and critique."),
                    ("Future Pathways & Farewell", "Explore local camera clubs, advanced courses, portfolio development, and next steps.")
                ]
            },
            {
                "type": "content_2col",
                "title": "The Final Polish: Output Preparation",
                "lead": "Ensuring your digital master files translate into breathtaking physical prints and screen presentations.",
                "col1": {
                    "header": "Finishing Adjustments",
                    "bullets": [
                        "Precision Crop: Fine-tune borders to remove accidental edge distractions.",
                        "Selective Dodging & Burning: Guide viewer attention to the subject using subtle radial masks.",
                        "Dust Spot Removal: Clean sensor specks in sky and smooth background gradients.",
                        "Output Sharpening: Apply high-frequency sharpening tuned specifically for glossy/matte print."
                    ]
                },
                "col2": {
                    "header": "Exhibition Sequencing",
                    "bullets": [
                        "The Lead Opener: Strongest initial image establishing context and setting mood.",
                        "Pacing & Detail Shifts: Alternate wide environmental shots with intimate close-up details.",
                        "Tonal Harmony: Avoid placing an oversaturated photo directly next to a moody low-key print.",
                        "The Resonant Closer: A lingering, contemplative final image providing narrative resolution."
                    ]
                }
            },
            {
                "type": "content_4grid",
                "title": "10-Week Transformation Reflection",
                "lead": "Looking back at the creative and technical milestones achieved this Autumn Term.",
                "cards": [
                    ("Week 1–2 Mastery", "From passive pointing to intentional composition, bold viewpoints, and leading line geometry."),
                    ("Week 3–4 Mastery", "From automated confusion to total command of the Exposure Triangle, changing light, and RAW files."),
                    ("Week 5–8 Mastery", "Mastering light: studio portraits, macro textures, landscape depth, silhouettes, and reflections."),
                    ("Week 9–10 Mastery", "Developing an authentic photographic voice and delivering a cohesive exhibition portfolio.")
                ]
            },
            {
                "type": "challenge",
                "title": "Tonight's Event: The Autumn 2026 Showcase Exhibition",
                "lead": "Gallery Exhibition & Celebration (75 Minutes) — Studio Spotlight Wall Showcase.",
                "steps": [
                    ("18:30 – 19:15: Final Mount & Hang", "Mount your 3–5 final prints on exhibition boards with title tags and artist statement."),
                    ("19:15 – 20:15: The Gallery Walk", "Stroll the exhibition with fellow photographers. Write appreciation cards and constructive feedback notes."),
                    ("20:15 – 20:45: Tutor Commendations", "Tutor awards for Best Composition, Best Lighting, Best Technical Mastery, and Most Cohesive Series."),
                    ("20:45 – 21:00: Toast & Farewell", "Celebrate collective growth, take cohort group photograph, and swap contact info!")
                ]
            },
            {
                "type": "review_homework",
                "title": "Continuing Your Journey: Next Photographic Steps",
                "lead": "Graduation is just the beginning of your lifelong visual storytelling journey.",
                "critique": [
                    "South Devon College Advanced Term: Intermediate Studio Lighting, Darkroom & Creative Portfolios.",
                    "Local Camera Clubs & Salons: Join Torbay, Teignmouth, and Devon photographic societies.",
                    "Personal Routine: Commit to the 'One Roll / One Card a Week' shooting discipline."
                ],
                "homework": [
                    "Final Takeaway: Photography is the art of seeing what others walk past unnoticed.",
                    "Stay Connected: Keep in touch via our alumni digital portfolio sharing group.",
                    "Congratulations Autumn 2026 Cohort! Farewell and keep shooting!"
                ]
            }
        ]
    }
]

def create_deck_for_week(data, output_dir):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    week_num = data["week"]
    accent = data["accent"]
    accent_light = data["accent_light"]
    dark = data["dark"]
    white = RGBColor(255, 255, 255)
    slate_bg = RGBColor(248, 250, 252)
    slate_border = RGBColor(226, 232, 240)
    text_muted = RGBColor(100, 116, 139)
    text_dark = RGBColor(30, 41, 59)

    # 1. TITLE SLIDE
    slide = prs.slides.add_slide(blank_layout)
    # Background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = dark
    bg.line.color.rgb = dark

    # Accent Top Stripe
    stripe = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(0.1))
    stripe.fill.solid()
    stripe.fill.fore_color.rgb = accent
    stripe.line.color.rgb = accent

    # Tag / Badge
    tag = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.2), Inches(3.8), Inches(0.45))
    tag.fill.solid()
    tag.fill.fore_color.rgb = accent
    tag.line.color.rgb = accent
    tb_tag = tag.text_frame
    tb_tag.word_wrap = True
    p_tag = tb_tag.paragraphs[0]
    p_tag.text = f"WEEK {week_num} MASTERCLASS"
    p_tag.font.bold = True
    p_tag.font.size = Pt(13)
    p_tag.font.color.rgb = white
    p_tag.alignment = PP_ALIGN.CENTER

    # Main Title
    tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.733), Inches(2.2))
    tf_title = tb_title.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = data["title"]
    p_title.font.bold = True
    p_title.font.size = Pt(40)
    p_title.font.color.rgb = white

    p_sub = tf_title.add_paragraph()
    p_sub.text = data["subtitle"]
    p_sub.font.size = Pt(20)
    p_sub.font.color.rgb = RGBColor(148, 163, 184)
    p_sub.space_before = Pt(12)

    # Info Card Container
    info_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.5), Inches(11.733), Inches(2.0))
    info_card.fill.solid()
    info_card.fill.fore_color.rgb = RGBColor(30, 41, 59)
    info_card.line.color.rgb = RGBColor(51, 65, 85)
    tb_info = info_card.text_frame
    tb_info.word_wrap = True

    p_meta1 = tb_info.paragraphs[0]
    p_meta1.text = "SOUTH DEVON COLLEGE — ADULT CREATIVE ARTS & PHOTOGRAPHY"
    p_meta1.font.bold = True
    p_meta1.font.size = Pt(15)
    p_meta1.font.color.rgb = accent

    p_meta2 = tb_info.add_paragraph()
    p_meta2.text = f"Session Date: {data['date']} | Time: {data['time']}"
    p_meta2.font.size = Pt(14)
    p_meta2.font.color.rgb = white
    p_meta2.space_before = Pt(6)

    p_meta3 = tb_info.add_paragraph()
    p_meta3.text = "Curriculum Track: 10-Week Adult Beginner to Intermediate Master Series | Studio & Field Practice"
    p_meta3.font.size = Pt(13)
    p_meta3.font.color.rgb = RGBColor(203, 213, 225)
    p_meta3.space_before = Pt(6)

    # Helper function for Slide Header & Footer
    def add_slide_chrome(sld, title_text, lead_text):
        # BG
        cbg = sld.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        cbg.fill.solid()
        cbg.fill.fore_color.rgb = slate_bg
        cbg.line.color.rgb = slate_bg

        # Top Accent Line
        sline = sld.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.08))
        sline.fill.solid()
        sline.fill.fore_color.rgb = accent
        sline.line.color.rgb = accent

        # Header Title
        tb_hdr = sld.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(1.2))
        tf_hdr = tb_hdr.text_frame
        tf_hdr.word_wrap = True
        p_hdr = tf_hdr.paragraphs[0]
        p_hdr.text = title_text
        p_hdr.font.bold = True
        p_hdr.font.size = Pt(28)
        p_hdr.font.color.rgb = text_dark

        p_lead = tf_hdr.add_paragraph()
        p_lead.text = lead_text
        p_lead.font.size = Pt(14)
        p_lead.font.color.rgb = text_muted
        p_lead.space_before = Pt(4)

        # Footer
        tb_ftr = sld.shapes.add_textbox(Inches(0.8), Inches(6.9), Inches(11.733), Inches(0.4))
        tf_ftr = tb_ftr.text_frame
        p_ftr = tf_ftr.paragraphs[0]
        p_ftr.text = f"South Devon College Photography | Week {week_num}: {data['title']} | {data['date']}"
        p_ftr.font.size = Pt(10)
        p_ftr.font.color.rgb = text_muted

    # 2. SUBSEQUENT SLIDES
    for s_data in data["slides"]:
        stype = s_data["type"]
        slide = prs.slides.add_slide(blank_layout)
        add_slide_chrome(slide, s_data["title"], s_data["lead"])

        if stype == "overview":
            # 4 horizontal cards or 2x2 grid
            cards = s_data["cards"]
            coords = [
                (Inches(0.8), Inches(1.8)),
                (Inches(6.8), Inches(1.8)),
                (Inches(0.8), Inches(4.3)),
                (Inches(6.8), Inches(4.3))
            ]
            for i, (ctitle, cdesc) in enumerate(cards):
                cx, cy = coords[i]
                c_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, Inches(5.7), Inches(2.2))
                c_card.fill.solid()
                c_card.fill.fore_color.rgb = white
                c_card.line.color.rgb = slate_border
                c_card.line.width = Pt(1.5)

                tb = c_card.text_frame
                tb.word_wrap = True
                p_num = tb.paragraphs[0]
                p_num.text = f"GOAL 0{i+1}"
                p_num.font.bold = True
                p_num.font.size = Pt(11)
                p_num.font.color.rgb = accent

                p_t = tb.add_paragraph()
                p_t.text = ctitle
                p_t.font.bold = True
                p_t.font.size = Pt(16)
                p_t.font.color.rgb = text_dark
                p_t.space_before = Pt(2)

                p_d = tb.add_paragraph()
                p_d.text = cdesc
                p_d.font.size = Pt(12)
                p_d.font.color.rgb = text_muted
                p_d.space_before = Pt(4)

        elif stype == "content_2col":
            c1 = s_data["col1"]
            c2 = s_data["col2"]
            cols = [
                (c1, Inches(0.8), Inches(1.8)),
                (c2, Inches(6.8), Inches(1.8))
            ]
            for col_data, cx, cy in cols:
                card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, Inches(5.7), Inches(4.8))
                card.fill.solid()
                card.fill.fore_color.rgb = white
                card.line.color.rgb = slate_border
                card.line.width = Pt(1.5)

                tb = card.text_frame
                tb.word_wrap = True

                p_hdr = tb.paragraphs[0]
                p_hdr.text = col_data["header"]
                p_hdr.font.bold = True
                p_hdr.font.size = Pt(18)
                p_hdr.font.color.rgb = text_dark

                # Accent line inside card
                for b_text in col_data["bullets"]:
                    p_b = tb.add_paragraph()
                    p_b.text = f"• {b_text}"
                    p_b.font.size = Pt(13)
                    p_b.font.color.rgb = text_dark
                    p_b.space_before = Pt(8)

        elif stype == "content_4grid":
            items = s_data.get("items") or s_data.get("cards")
            coords = [
                (Inches(0.8), Inches(1.8)),
                (Inches(6.8), Inches(1.8)),
                (Inches(0.8), Inches(4.3)),
                (Inches(6.8), Inches(4.3))
            ]
            for i, (ititle, idesc) in enumerate(items):
                cx, cy = coords[i]
                card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, Inches(5.7), Inches(2.2))
                card.fill.solid()
                card.fill.fore_color.rgb = white
                card.line.color.rgb = slate_border
                card.line.width = Pt(1.5)

                tb = card.text_frame
                tb.word_wrap = True

                p_t = tb.paragraphs[0]
                p_t.text = ititle
                p_t.font.bold = True
                p_t.font.size = Pt(16)
                p_t.font.color.rgb = accent

                p_d = tb.add_paragraph()
                p_d.text = idesc
                p_d.font.size = Pt(12)
                p_d.font.color.rgb = text_dark
                p_d.space_before = Pt(4)

        elif stype == "challenge":
            steps = s_data["steps"]
            y_starts = [Inches(1.8), Inches(3.0), Inches(4.2), Inches(5.4)]
            for i, (stitle, sdesc) in enumerate(steps):
                sy = y_starts[i]
                card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), sy, Inches(11.733), Inches(1.05))
                card.fill.solid()
                card.fill.fore_color.rgb = white
                card.line.color.rgb = slate_border
                card.line.width = Pt(1.5)

                tb = card.text_frame
                tb.word_wrap = True

                p_t = tb.paragraphs[0]
                p_t.text = stitle
                p_t.font.bold = True
                p_t.font.size = Pt(15)
                p_t.font.color.rgb = accent

                p_d = tb.add_paragraph()
                p_d.text = sdesc
                p_d.font.size = Pt(12)
                p_d.font.color.rgb = text_dark
                p_d.space_before = Pt(2)

        elif stype == "review_homework":
            critique = s_data["critique"]
            homework = s_data["homework"]

            # Left Card: Critique
            c_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.7), Inches(4.8))
            c_card.fill.solid()
            c_card.fill.fore_color.rgb = white
            c_card.line.color.rgb = slate_border
            c_card.line.width = Pt(1.5)
            c_tb = c_card.text_frame
            c_tb.word_wrap = True
            cp_hdr = c_tb.paragraphs[0]
            cp_hdr.text = "In-Class Review & Critique Rubric"
            cp_hdr.font.bold = True
            cp_hdr.font.size = Pt(18)
            cp_hdr.font.color.rgb = text_dark

            for crit in critique:
                p = c_tb.add_paragraph()
                p.text = f"✔ {crit}"
                p.font.size = Pt(13)
                p.font.color.rgb = text_dark
                p.space_before = Pt(10)

            # Right Card: Homework
            h_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8))
            h_card.fill.solid()
            h_card.fill.fore_color.rgb = accent_light
            h_card.line.color.rgb = accent
            h_card.line.width = Pt(1.5)
            h_tb = h_card.text_frame
            h_tb.word_wrap = True
            hp_hdr = h_tb.paragraphs[0]
            hp_hdr.text = "Weekly Homework & Next Steps"
            hp_hdr.font.bold = True
            hp_hdr.font.size = Pt(18)
            hp_hdr.font.color.rgb = accent

            for hw in homework:
                p = h_tb.add_paragraph()
                p.text = f"★ {hw}"
                p.font.size = Pt(13)
                p.font.color.rgb = text_dark
                p.space_before = Pt(10)

    # Save presentation
    clean_title = data["title"].split(":")[0].replace("&", "and").replace("/", "_").replace(" ", "_")
    filename = f"Week_{week_num:02d}_{clean_title}.pptx"
    out_path = os.path.join(output_dir, filename)
    prs.save(out_path)
    print(f"Generated {out_path} ({len(prs.slides)} slides)")
    return out_path

def main():
    out_dir = "/Users/danieltagg/Desktop/Desktop - Daniel’s MacBook Pro/pptpresentationtowebagent/scratch/weekly_decks"
    os.makedirs(out_dir, exist_ok=True)
    generated = []
    for week_data in WEEKS_DATA:
        p = create_deck_for_week(week_data, out_dir)
        generated.append(p)
    print(f"\nSuccessfully generated all {len(generated)} weekly presentation decks!")

if __name__ == "__main__":
    main()
