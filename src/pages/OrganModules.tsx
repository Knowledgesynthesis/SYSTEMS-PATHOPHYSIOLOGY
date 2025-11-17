import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Wind, Droplets, Activity, Brain, ChevronDown, ChevronUp } from 'lucide-react';

interface OrganModule {
  id: string;
  title: string;
  icon: any;
  color: string;
  topics: string[];
  clinicalPearls: string[];
  detailedContent: {
    pathophysiology: {
      title: string;
      content: string[];
    }[];
    mechanisms: {
      title: string;
      description: string;
      steps: string[];
    }[];
    clinicalScenario: {
      presentation: string;
      labs: string[];
      management: string[];
    };
    keyEquations?: string[];
  };
}

const modules: OrganModule[] = [
  {
    id: 'lungs',
    title: 'Respiratory System',
    icon: Wind,
    color: 'text-blue-500',
    topics: [
      'ARDS pathophysiology',
      'V/Q mismatch mechanisms',
      'Hypoxemia vs hypercapnia',
      'Pulmonary capillary leak',
      'Ventilation strategies'
    ],
    clinicalPearls: [
      'PaO₂/FiO₂ < 300 defines ARDS',
      'Shunt fraction increases with alveolar flooding',
      'PEEP recruits collapsed alveoli'
    ],
    detailedContent: {
      pathophysiology: [
        {
          title: 'ARDS: Three Phases of Lung Injury',
          content: [
            '**Exudative Phase (Days 0-7):** Diffuse alveolar damage, neutrophil infiltration, hyaline membrane formation. Cytokines (IL-1, IL-6, TNF-α) drive endothelial and epithelial injury.',
            '**Proliferative Phase (Days 7-21):** Type II pneumocyte proliferation attempts to restore alveolar architecture. Fibroblast activation begins.',
            '**Fibrotic Phase (>21 days):** Collagen deposition, permanent scarring. Decreased compliance, increased dead space.'
          ]
        },
        {
          title: 'V/Q Mismatch: The Core Problem',
          content: [
            'Normal V/Q ratio = 0.8 (ventilation slightly less than perfusion at lung bases)',
            '**Shunt (V/Q = 0):** Perfusion without ventilation. Classic in ARDS with alveolar flooding. Unresponsive to supplemental O₂.',
            '**Dead Space (V/Q = ∞):** Ventilation without perfusion. Seen in PE, emphysema. Results in hypercapnia.',
            '**Low V/Q:** Atelectasis, pneumonia. Partially responsive to supplemental O₂.'
          ]
        }
      ],
      mechanisms: [
        {
          title: 'Alveolar-Capillary Barrier Breakdown',
          description: 'How sepsis destroys gas exchange',
          steps: [
            '1. Endotoxin/cytokines activate endothelium → expression of adhesion molecules (ICAM-1, VCAM-1)',
            '2. Neutrophil recruitment → release of elastase, reactive oxygen species (ROS)',
            '3. Disruption of tight junctions (claudins, occludins) → increased permeability',
            '4. Protein-rich fluid floods alveoli → surfactant inactivation',
            '5. Alveolar collapse → shunt physiology → refractory hypoxemia'
          ]
        },
        {
          title: 'Hypoxic Pulmonary Vasoconstriction (HPV)',
          description: 'Compensatory mechanism that can backfire',
          steps: [
            '1. Alveolar hypoxia (PaO₂ < 60 mmHg) sensed by pulmonary artery smooth muscle',
            '2. Calcium channels open → vasoconstriction of poorly ventilated regions',
            '3. Blood diverted to well-ventilated alveoli (improves V/Q matching)',
            '4. BUT: Global hypoxia → global vasoconstriction → pulmonary hypertension',
            '5. Right ventricular strain → cor pulmonale in severe ARDS'
          ]
        }
      ],
      clinicalScenario: {
        presentation: 'A 52-year-old with pneumonia develops worsening dyspnea despite 6L NC O₂. Bilateral infiltrates on CXR. PaO₂/FiO₂ = 180. Mechanically ventilated with ARDSNet protocol.',
        labs: [
          'ABG: pH 7.32, PaCO₂ 48, PaO₂ 65 (on FiO₂ 60%)',
          'PaO₂/FiO₂ ratio: 108 (severe ARDS)',
          'Lung compliance: 22 mL/cmH₂O (normal: 50-100)',
          'Static plateau pressure: 32 cmH₂O (target ≤30)'
        ],
        management: [
          '**ARDSNet ventilation:** Tidal volume 6 mL/kg IBW, Pplat ≤30 cmH₂O',
          '**PEEP titration:** Start 10-15 cmH₂O, adjust to optimize oxygenation/compliance',
          '**Permissive hypercapnia:** Accept pH ≥7.20 to avoid barotrauma',
          '**Prone positioning:** If PaO₂/FiO₂ <150, prone 16 hrs/day (improves mortality)',
          '**Conservative fluid management:** Target CVP 4-6, avoid fluid overload (worsens pulmonary edema)'
        ]
      },
      keyEquations: [
        'PaO₂/FiO₂ ratio = PaO₂ ÷ (FiO₂/100) — ARDS severity: Mild <300, Moderate <200, Severe <100',
        'Alveolar gas equation: PAO₂ = (FiO₂ × [Patm - PH₂O]) - (PaCO₂/0.8)',
        'A-a gradient = PAO₂ - PaO₂ — Normal <15, ↑↑ in V/Q mismatch',
        'Shunt fraction (Qs/Qt) = (CcO₂ - CaO₂) / (CcO₂ - CvO₂) — Normal <5%, ARDS can be >30%'
      ]
    }
  },
  {
    id: 'heart',
    title: 'Cardiovascular System',
    icon: Heart,
    color: 'text-red-500',
    topics: [
      'Septic cardiomyopathy',
      'Shock pathophysiology',
      'Cardiac output determinants',
      'Myocardial oxygen supply/demand',
      'Vasopressor mechanisms'
    ],
    clinicalPearls: [
      'Cardiac index < 2.2 indicates shock',
      'MAP goal ≥ 65 mmHg for perfusion',
      'Early goal-directed therapy improves outcomes'
    ],
    detailedContent: {
      pathophysiology: [
        {
          title: 'Septic Cardiomyopathy: Myocardial Depression in Sepsis',
          content: [
            '**Incidence:** 40-50% of septic patients develop reversible LV/RV dysfunction',
            '**Mechanism:** Cytokines (TNF-α, IL-1β) → myocardial depressant substances → ↓ contractility despite normal/elevated cardiac output',
            '**Paradox:** EF may drop to 30-40%, but CO maintained via extreme vasodilation (↓↓ SVR) and tachycardia',
            '**Recovery:** Usually resolves in 7-10 days if patient survives sepsis'
          ]
        },
        {
          title: 'Determinants of Cardiac Output',
          content: [
            '**CO = Stroke Volume (SV) × Heart Rate (HR)**',
            '**SV determined by:** Preload (LVEDV), Afterload (SVR), Contractility (inotropy)',
            '**Frank-Starling:** ↑ Preload → ↑ SV (up to a point — then overload)',
            '**Afterload sensitivity:** ↑ SVR → ↓ SV (critical in heart failure, compensated in healthy hearts)',
            '**HR optimization:** Too slow → low CO. Too fast → inadequate diastolic filling → low CO'
          ]
        }
      ],
      mechanisms: [
        {
          title: 'Cardiogenic Shock Cascade',
          description: 'Forward and backward failure propagation',
          steps: [
            '1. Myocardial insult (MI, myocarditis) → ↓ contractility → ↓ stroke volume',
            '2. ↓ Cardiac output → ↓ coronary perfusion → worsening ischemia (vicious cycle)',
            '3. ↑ LVEDP → pulmonary edema → hypoxemia → further myocardial injury',
            '4. Compensatory mechanisms fail: SNS overdrive → arrhythmias, RAAS → fluid retention',
            '5. ↓ Renal perfusion → prerenal AKI (cardiorenal syndrome)',
            '6. ↓ Hepatic perfusion → "shock liver" (↑↑ transaminases, ↑ bilirubin)'
          ]
        },
        {
          title: 'Septic Shock: Distributive Vasodilation',
          description: 'Opposite pathophysiology to cardiogenic shock',
          steps: [
            '1. Endotoxin → massive cytokine release → inducible nitric oxide synthase (iNOS)',
            '2. NO production → profound vasodilation → ↓↓ SVR (often <600 dynes·s/cm⁵)',
            '3. "Warm shock:" ↑ Cardiac output (compensatory), warm extremities, bounding pulses',
            '4. Microcirculatory dysfunction: Shunting, endothelial injury → tissue hypoperfusion despite ↑ CO',
            '5. Late: Septic cardiomyopathy → ↓ CO → "cold shock" (poor prognosis)',
            '6. End result: ↓ Oxygen delivery (DO₂) → ↑ lactate → multi-organ failure'
          ]
        }
      ],
      clinicalScenario: {
        presentation: 'A 68-year-old presents with chest pain, anterior STEMI. Post-cath: LAD stented, but EF 25%. Hypotensive (BP 78/52) despite IVF. Cool extremities, altered mental status.',
        labs: [
          'Cardiac index: 1.6 L/min/m² (normal: 2.5-4.0) — cardiogenic shock',
          'CVP: 18 mmHg (elevated — backward failure)',
          'Lactate: 6.2 mmol/L (tissue hypoperfusion)',
          'Troponin: 45 ng/mL (massive MI)',
          'BNP: 1200 pg/mL (volume overload)'
        ],
        management: [
          '**Inotropic support:** Dobutamine 5-10 mcg/kg/min (↑ contractility, ↓ afterload)',
          '**If still hypotensive:** Add norepinephrine (cautious — ↑ afterload can worsen CO)',
          '**Mechanical support:** Consider IABP (↑ coronary perfusion, ↓ afterload) or Impella',
          '**Diuresis:** Gentle with furosemide to ↓ pulmonary edema (avoid aggressive — worsens preload)',
          '**AVOID:** Large volume resuscitation (worsens pulmonary edema)'
        ]
      },
      keyEquations: [
        'Cardiac Output (CO) = Stroke Volume × Heart Rate',
        'Cardiac Index (CI) = CO / BSA (normal: 2.5-4.0 L/min/m²)',
        'Mean Arterial Pressure (MAP) = CO × SVR (simplified: DBP + 1/3 pulse pressure)',
        'Systemic Vascular Resistance (SVR) = 80 × (MAP - CVP) / CO (normal: 800-1200 dynes·s/cm⁵)',
        'Oxygen delivery (DO₂) = CO × CaO₂ × 10 (normal: 900-1100 mL/min)'
      ]
    }
  },
  {
    id: 'kidneys',
    title: 'Renal System',
    icon: Droplets,
    color: 'text-cyan-500',
    topics: [
      'AKI staging (KDIGO)',
      'Prerenal vs intrinsic vs postrenal',
      'ATN mechanisms',
      'Fluid responsiveness',
      'Renal recovery patterns'
    ],
    clinicalPearls: [
      'Oliguria < 0.5 mL/kg/hr for 6+ hours',
      'Creatinine rise lags behind injury',
      'FENa < 1% suggests prerenal AKI'
    ],
    detailedContent: {
      pathophysiology: [
        {
          title: 'AKI Pathophysiology: Prerenal → Intrinsic Transition',
          content: [
            '**Prerenal (70% of AKI):** ↓ Renal perfusion (hypovolemia, hypotension, CHF). Kidneys structurally intact. Reversible if perfusion restored.',
            '**Intrinsic (25%):** Direct tubular/glomerular injury. Most common: Acute tubular necrosis (ATN) from prolonged ischemia or nephrotoxins.',
            '**Postrenal (5%):** Obstruction (BPH, stones, tumor). Bilateral obstruction or single kidney required for AKI.',
            '**Critical transition:** Prerenal AKI → if untreated >24 hrs → ATN (tubular cell death, sloughing into lumen)'
          ]
        },
        {
          title: 'KDIGO Staging: Severity Classification',
          content: [
            '**Stage 1:** Creatinine 1.5-1.9× baseline OR ≥0.3 mg/dL increase OR urine <0.5 mL/kg/hr × 6-12 hrs',
            '**Stage 2:** Creatinine 2.0-2.9× baseline OR urine <0.5 mL/kg/hr × ≥12 hrs',
            '**Stage 3:** Creatinine ≥3.0× baseline OR ≥4.0 mg/dL OR urine <0.3 mL/kg/hr × ≥24 hrs OR anuria × 12 hrs',
            '**Stage 3 also:** Initiation of RRT or eGFR <35 in patients <18 years'
          ]
        }
      ],
      mechanisms: [
        {
          title: 'Acute Tubular Necrosis (ATN): Cellular Level',
          description: 'How ischemia destroys tubular cells',
          steps: [
            '1. ↓ Renal blood flow → preferential ischemia of S3 segment (medullary thick ascending limb)',
            '2. ATP depletion → Na⁺/K⁺-ATPase failure → cell swelling, loss of polarity',
            '3. Actin cytoskeleton disruption → brush border loss → tubular cells slough into lumen',
            '4. Tubular obstruction (cellular debris casts) → ↑ intratubular pressure → ↓ GFR',
            '5. Backleak of filtrate through damaged epithelium → further ↓ GFR',
            '6. Recovery: Surviving cells proliferate, tubule regenerates over 7-21 days'
          ]
        },
        {
          title: 'Cardiorenal Syndrome Type 1',
          description: 'How acute heart failure causes AKI',
          steps: [
            '1. ↓ Cardiac output → ↓ renal perfusion pressure → prerenal azotemia',
            '2. Renal hypoperfusion → RAAS activation → angiotensin II → efferent arteriole constriction',
            '3. Initially maintains GFR (↑ glomerular pressure), but worsens medullary ischemia',
            '4. Venous congestion: ↑ CVP → ↑ renal venous pressure → ↓ renal perfusion gradient',
            '5. "Backward failure:" Renal congestion may be more important than low CO',
            '6. Diuretic resistance develops → worsening volume overload → ↑ intra-abdominal pressure → abdominal compartment syndrome'
          ]
        }
      ],
      clinicalScenario: {
        presentation: 'A 62-year-old with septic shock, on norepinephrine. Day 2: Creatinine rises from 1.0 → 3.2 mg/dL. Urine output 15 mL/hr despite IVF boluses. Muddy brown casts on UA.',
        labs: [
          'Creatinine: 3.2 mg/dL (baseline 1.0) — KDIGO Stage 3 AKI',
          'BUN: 64 mg/dL, BUN/Cr ratio: 20:1 (ATN pattern, vs 20+ in prerenal)',
          'Urine sodium: 58 mEq/L (high — intrinsic), FENa: 3.2% (>2% = ATN)',
          'Urinalysis: Muddy brown granular casts (pathognomonic for ATN)',
          'Urine output: 0.1 mL/kg/hr (anuric)'
        ],
        management: [
          '**Optimize hemodynamics:** Target MAP ≥65 mmHg (but avoid excessive vasopressors — renal vasoconstriction)',
          '**Avoid nephrotoxins:** Stop NSAIDs, aminoglycosides, vancomycin (if possible)',
          '**Renally dose medications:** Adjust for GFR (e.g., antibiotics, anticoagulants)',
          '**Monitor fluid status:** Daily weights, I/Os. Avoid overload (pulmonary edema) or depletion (worsens ATN)',
          '**RRT indications:** Severe metabolic acidosis (pH <7.1), hyperkalemia (>6.5), uremia (pericarditis, encephalopathy), volume overload refractory to diuretics',
          '**Recovery:** Expect diuretic phase (polyuria) in 7-14 days as tubules regenerate'
        ]
      },
      keyEquations: [
        'FENa (Fractional Excretion of Sodium) = (UNa × PCr) / (PNa × UCr) × 100 — <1% prerenal, >2% ATN',
        'eGFR (CKD-EPI) — estimates baseline kidney function',
        'Creatinine clearance (Cockcroft-Gault) = (140 - age) × weight / (72 × Cr) × 0.85 (if female)',
        'Urine output: Normal 0.5-1.5 mL/kg/hr, Oliguria <0.5 mL/kg/hr, Anuria <50 mL/day'
      ]
    }
  },
  {
    id: 'coagulation',
    title: 'Coagulation System',
    icon: Activity,
    color: 'text-green-500',
    topics: [
      'DIC pathophysiology',
      'Thrombotic microangiopathy',
      'Platelet consumption',
      'Coagulation cascade',
      'ISTH DIC scoring'
    ],
    clinicalPearls: [
      'DIC = bleeding + clotting simultaneously',
      'Low platelets + high D-dimer suggests DIC',
      'Fibrinogen drops as it\'s consumed'
    ],
    detailedContent: {
      pathophysiology: [
        {
          title: 'DIC: Disseminated Intravascular Coagulation',
          content: [
            '**Definition:** Systemic activation of coagulation → widespread microvascular thrombosis → consumption of platelets/factors → paradoxical bleeding',
            '**Triggers:** Sepsis (most common), trauma, malignancy (especially AML, adenocarcinomas), obstetric (placental abruption, amniotic fluid embolism)',
            '**Mechanism:** Tissue factor release → thrombin generation → fibrin clots everywhere → consumption coagulopathy',
            '**Lab hallmarks:** ↓ Platelets, ↓ fibrinogen, ↑ PT/PTT, ↑↑ D-dimer, schistocytes on smear'
          ]
        },
        {
          title: 'ISTH DIC Scoring System',
          content: [
            '**Platelet count:** >100 = 0, 50-100 = 1, <50 = 2 points',
            '**D-dimer:** No increase = 0, Moderate increase = 2, Strong increase = 3',
            '**PT prolongation:** <3 sec = 0, 3-6 sec = 1, >6 sec = 2',
            '**Fibrinogen:** >100 mg/dL = 0, <100 = 1',
            '**Score ≥5 = Overt DIC** (compatible with diagnosis)'
          ]
        }
      ],
      mechanisms: [
        {
          title: 'DIC Cascade: From Sepsis to Bleeding',
          description: 'How systemic inflammation destroys coagulation',
          steps: [
            '1. Endotoxin/cytokines (TNF-α, IL-6) → tissue factor expression on endothelium/monocytes',
            '2. Tissue factor + Factor VIIa → extrinsic pathway activation → thrombin burst',
            '3. Widespread microthrombi in capillaries (brain, kidneys, lungs, skin)',
            '4. Consumption: Platelets and clotting factors (V, VIII, fibrinogen) depleted',
            '5. Fibrinolysis activation (plasmin) → breakdown of clots → ↑↑ D-dimer, fibrin split products (FSP)',
            '6. Bleeding: Surgical sites, IV sites, mucous membranes, GI tract',
            '7. Microangiopathic hemolytic anemia (MAHA): RBCs sheared by fibrin strands → schistocytes'
          ]
        },
        {
          title: 'Platelet Consumption: Thrombocytopenia in Critical Illness',
          description: 'Why platelets drop in sepsis/MODS',
          steps: [
            '1. Increased utilization: Microthrombi formation consumes platelets',
            '2. Splenic sequestration: Enlarged spleen in sepsis traps platelets',
            '3. Decreased production: Bone marrow suppression from infection/inflammation',
            '4. Antibody-mediated destruction: HIT (heparin-induced thrombocytopenia) if on heparin',
            '5. Dilutional: Massive transfusion washes out platelets',
            '6. Target: Maintain platelets >50K (bleeding), >100K (neurosurgery/active bleeding)'
          ]
        }
      ],
      clinicalScenario: {
        presentation: 'A 45-year-old with gram-negative sepsis. Day 3 ICU: Oozing from IV sites, ecchymoses. Petechiae on chest. Platelets dropped from 180K → 42K. PT/PTT elevated.',
        labs: [
          'Platelets: 42,000/μL (normal: 150-400K) — severe thrombocytopenia',
          'PT: 18.2 sec (INR 1.8), PTT: 54 sec (prolonged)',
          'Fibrinogen: 98 mg/dL (normal: 200-400) — consumed',
          'D-dimer: >20,000 ng/mL (markedly elevated)',
          'Peripheral smear: Schistocytes present (MAHA)',
          'ISTH DIC score: 7 (overt DIC)'
        ],
        management: [
          '**Treat underlying cause:** Aggressive sepsis management (antibiotics, source control)',
          '**Platelet transfusion:** If <20K (spontaneous bleeding risk) or <50K with active bleeding',
          '**FFP (Fresh Frozen Plasma):** If PT/PTT prolonged and bleeding (replaces clotting factors)',
          '**Cryoprecipitate:** If fibrinogen <100 mg/dL (contains fibrinogen, Factor VIII, vWF)',
          '**AVOID heparin** unless thrombosis predominates (rare DIC subtype)',
          '**Monitor:** CBC, PT/PTT, fibrinogen, D-dimer daily',
          '**Prognosis:** Mortality 30-50% in sepsis-associated DIC'
        ]
      },
      keyEquations: [
        'ISTH DIC Score = Platelet pts + D-dimer pts + PT pts + Fibrinogen pts (≥5 = overt DIC)',
        '4Ts Score (HIT probability) — distinguish HIT from other thrombocytopenia',
        'Bleeding time: Platelet function, vWD (rarely used clinically)',
        'Fibrinogen: Normal 200-400 mg/dL, critically low <100 mg/dL'
      ]
    }
  },
  {
    id: 'brain',
    title: 'Neurologic System',
    icon: Brain,
    color: 'text-purple-500',
    topics: [
      'Septic encephalopathy',
      'Hypoxic brain injury',
      'Delirium pathophysiology',
      'Cerebral perfusion pressure',
      'Metabolic encephalopathy'
    ],
    clinicalPearls: [
      'Altered mental status is often first sign',
      'Hypoxemia causes diffuse injury',
      'Sedation can mask neurologic decline'
    ],
    detailedContent: {
      pathophysiology: [
        {
          title: 'Septic-Associated Encephalopathy (SAE)',
          content: [
            '**Incidence:** Up to 70% of septic patients develop altered mental status',
            '**Mechanism:** Multifactorial — cytokine-mediated blood-brain barrier (BBB) disruption, cerebral hypoperfusion, microthrombi, metabolic derangements',
            '**Presentation:** Delirium, confusion, agitation → obtundation → coma (severe)',
            '**No structural lesion:** CT/MRI usually normal (diagnosis of exclusion after ruling out stroke, meningitis, etc.)',
            '**Prognosis:** Reversible if sepsis treated, but associated with long-term cognitive impairment'
          ]
        },
        {
          title: 'Cerebral Perfusion Pressure (CPP) and Autoregulation',
          content: [
            '**CPP = MAP - ICP** (normal ICP: 5-15 mmHg)',
            '**Autoregulation range:** Brain maintains constant blood flow despite MAP 60-150 mmHg',
            '**In critical illness:** Autoregulation impaired → brain perfusion becomes pressure-passive',
            '**Hypotension:** MAP <60 → cerebral hypoperfusion → ischemia',
            '**Hypertension:** MAP >150 → BBB breakdown → cerebral edema (posterior reversible encephalopathy syndrome, PRES)'
          ]
        }
      ],
      mechanisms: [
        {
          title: 'Hypoxic-Ischemic Brain Injury (HIBI)',
          description: 'From cardiac arrest to diffuse anoxic injury',
          steps: [
            '1. Cardiac arrest → cessation of cerebral blood flow → ATP depletion',
            '2. Na⁺/K⁺-ATPase failure → cellular depolarization, excitotoxicity (glutamate release)',
            '3. Calcium influx → mitochondrial dysfunction → apoptosis pathways activated',
            '4. Reperfusion (ROSC) → paradoxical: ROS generation, inflammation → secondary injury',
            '5. Selective neuronal vulnerability: Hippocampus (CA1), cerebellum (Purkinje cells), cortex (layers 3, 5, 6)',
            '6. Outcomes: Best assessed at 72 hrs post-arrest (pupillary response, motor exam, EEG, imaging)'
          ]
        },
        {
          title: 'ICU Delirium: Pathophysiology',
          description: 'Multifactorial neurotoxicity in critical illness',
          steps: [
            '1. Neurotransmitter imbalance: ↓ Acetylcholine (attention), ↑ dopamine (hallucinations)',
            '2. Inflammation: Cytokines cross BBB → neuroinflammation',
            '3. Sleep deprivation: ICU environment (alarms, lights) → circadian disruption',
            '4. Medications: Benzodiazepines (worst offenders), opioids, anticholinergics',
            '5. Metabolic: Hypoglycemia, uremia, hepatic encephalopathy',
            '6. Hypoxia/hypercapnia: CNS depression or excitation'
          ]
        }
      ],
      clinicalScenario: {
        presentation: 'A 58-year-old post-cardiac arrest (PEA, downtime 8 minutes). ROSC achieved, cooling protocol initiated. Day 2: Remains comatose, no eye opening to pain. Pupils 4 mm, minimally reactive.',
        labs: [
          'NSE (neuron-specific enolase): 82 ng/mL (>60 suggests poor prognosis)',
          'EEG: Burst suppression pattern (concerning for severe injury)',
          'CT head: Loss of gray-white differentiation (cerebral edema)',
          'MRI (Day 5): Diffuse cortical and basal ganglia DWI hyperintensity (anoxic injury)'
        ],
        management: [
          '**Targeted Temperature Management (TTM):** 32-36°C × 24 hrs (neuroprotection, controversial benefit)',
          '**Avoid hyperthermia:** Fever worsens neurologic outcomes (target normothermia)',
          '**Hemodynamic optimization:** MAP goal 65-80 mmHg (maintain CPP)',
          '**Avoid hypoxemia/hypercapnia:** Target PaO₂ >60 mmHg, normocapnia (PaCO₂ 35-45)',
          '**Seizure prophylaxis:** EEG monitoring, treat if seizures detected (can be subclinical)',
          '**Prognostication:** Delayed until ≥72 hrs post-ROSC and off sedation. Poor signs: Absent pupillary/corneal reflexes, myoclonus status, malignant EEG, high NSE',
          '**Withdraw vs continue:** Shared decision-making with family, consider multimodal prognostication'
        ]
      },
      keyEquations: [
        'CPP (Cerebral Perfusion Pressure) = MAP - ICP (target CPP >60 mmHg in TBI)',
        'GCS (Glasgow Coma Scale) = Eye (1-4) + Verbal (1-5) + Motor (1-6) — max 15, severe ≤8',
        'CAM-ICU (Confusion Assessment Method) — delirium screening in ICU',
        'RASS (Richmond Agitation-Sedation Scale) — -5 (unarousable) to +4 (combative)'
      ]
    }
  }
];

export default function OrganModules() {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Organ System Modules</h1>
        <p className="text-muted-foreground">
          Deep dive into individual organ systems and their failure mechanisms
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-sm">
            <strong>Click on any organ system below</strong> to expand detailed pathophysiology, mechanisms,
            clinical scenarios, and key equations. Each module provides board-level depth with clinical application.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {modules.map((module) => {
          const Icon = module.icon;
          const isExpanded = expandedModule === module.id;

          return (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Icon className={`h-8 w-8 ${module.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle>{module.title}</CardTitle>
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                      <CardDescription>{module.topics.length} key topics · Click to expand</CardDescription>
                    </div>
                  </div>
                  <Badge>Essential</Badge>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-6 pt-6 border-t">
                  {/* Quick Overview */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Key Topics</h4>
                      <ul className="space-y-2">
                        {module.topics.map((topic, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start">
                            <span className="mr-2 text-primary">•</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-3 flex items-center">
                        <span className="mr-2">💡</span>
                        Clinical Pearls
                      </h4>
                      <ul className="space-y-2">
                        {module.clinicalPearls.map((pearl, i) => (
                          <li key={i} className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
                            {pearl}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Detailed Pathophysiology */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Detailed Pathophysiology</h3>
                    {module.detailedContent.pathophysiology.map((section, i) => (
                      <div key={i} className="bg-secondary/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">{section.title}</h4>
                        <div className="space-y-2">
                          {section.content.map((paragraph, j) => (
                            <p key={j} className="text-sm text-muted-foreground leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mechanisms */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Cellular & Molecular Mechanisms</h3>
                    {module.detailedContent.mechanisms.map((mechanism, i) => (
                      <div key={i} className="border border-primary/20 p-4 rounded-lg">
                        <div className="mb-3">
                          <h4 className="font-semibold">{mechanism.title}</h4>
                          <p className="text-sm text-muted-foreground italic">{mechanism.description}</p>
                        </div>
                        <ol className="space-y-2">
                          {mechanism.steps.map((step, j) => (
                            <li key={j} className="text-sm text-muted-foreground pl-2">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>

                  {/* Clinical Scenario */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold border-b border-primary/30 pb-2">
                      Clinical Scenario: Application
                    </h3>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Presentation</h4>
                      <p className="text-sm text-muted-foreground">{module.detailedContent.clinicalScenario.presentation}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Labs & Findings</h4>
                      <ul className="space-y-1">
                        {module.detailedContent.clinicalScenario.labs.map((lab, i) => (
                          <li key={i} className="text-sm text-muted-foreground font-mono bg-background/50 p-2 rounded">
                            {lab}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Evidence-Based Management</h4>
                      <ul className="space-y-2">
                        {module.detailedContent.clinicalScenario.management.map((step, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start">
                            <span className="mr-2 text-primary font-bold">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Key Equations */}
                  {module.detailedContent.keyEquations && (
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Key Equations & Formulas</h3>
                      <div className="space-y-2">
                        {module.detailedContent.keyEquations.map((equation, i) => (
                          <div key={i} className="font-mono text-sm bg-background p-3 rounded border border-border">
                            {equation}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Integrated Learning */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Organ Interactions</CardTitle>
          <CardDescription>How these systems affect each other in critical illness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold mb-2">Lungs ↔ Kidneys (Pulmonary-Renal Syndrome)</h4>
              <p className="text-sm text-muted-foreground">
                <strong>ARDS → AKI:</strong> Hypoxemia from lung failure decreases renal perfusion, triggering prerenal AKI.
                High PEEP can ↓ venous return → ↓ cardiac output → worsening renal hypoperfusion.
                <br /><strong>AKI → ARDS:</strong> Fluid overload from renal failure worsens pulmonary edema and compliance.
                Uremic toxins impair alveolar-capillary barrier integrity.
              </p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold mb-2">Heart ↔ Kidneys (Cardiorenal Syndrome)</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Type 1 (Acute):</strong> Low cardiac output from acute MI/decompensated HF causes prerenal AKI.
                Venous congestion (↑ CVP) may be MORE important than low CO in causing AKI.
                <br /><strong>Type 2 (Chronic):</strong> Chronic HF → chronic kidney disease via sustained hypoperfusion and RAAS activation.
                Diuretic resistance develops as GFR ↓.
              </p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold mb-2">Coagulation ↔ All Organs (DIC)</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Mechanism:</strong> Microthrombi from DIC impair microcirculation in EVERY organ (brain, kidneys, lungs, liver, skin).
                Creates a vicious cycle: Organ ischemia → more tissue factor release → worsening DIC.
                <br /><strong>Clinical:</strong> Acral cyanosis (fingers, toes, nose), purpura fulminans (skin necrosis), renal cortical necrosis, stroke, ARDS.
                Mortality 30-80% depending on underlying cause.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
