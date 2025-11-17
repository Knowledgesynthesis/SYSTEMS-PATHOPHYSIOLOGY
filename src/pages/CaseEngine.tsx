import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { presetStates } from '@/data/initialStates';

interface CaseStep {
  id: string;
  title: string;
  description: string;
  clinicalFindings?: string[];
  vitalSigns?: Record<string, string>;
  labValues?: Record<string, string>;
  question?: string;
  options?: {
    id: string;
    text: string;
    correct: boolean;
    feedback: string;
    nextStep?: string;
  }[];
}

interface CaseDefinition {
  id: string;
  title: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  level: string;
  duration: string;
  description: string;
  objectives: string[];
  steps: Record<string, CaseStep>;
  stepOrder: string[];
  initialState: 'normal' | 'earlySepsis' | 'advancedSepsis' | 'cardiogenicShock';
}

// CASE 1: Septic Shock → Multi-Organ Failure (Intermediate)
const septicShockCase: CaseDefinition = {
  id: 'septic-shock',
  title: 'Septic Shock → Multi-Organ Failure',
  difficulty: 'Intermediate',
  level: 'Resident / Fellow',
  duration: '15-20 min',
  description: '55-year-old with pneumonia progressing to septic shock, ARDS, AKI, and DIC',
  objectives: [
    'Recognize and manage septic shock',
    'Understand ARDS development and criteria',
    'Identify AKI stages and patterns',
    'Diagnose DIC using ISTH criteria'
  ],
  initialState: 'earlySepsis',
  stepOrder: ['intro', 'initial_management', 'progression_6h', 'icu_management', 'multiorgan_failure', 'summary'],
  steps: {
    intro: {
      id: 'intro',
      title: 'Initial Presentation',
      description: '55-year-old man presents to the ED with 3 days of cough, fever (39.2°C), and progressive shortness of breath. Today he became confused and lightheaded.',
      clinicalFindings: [
        'Appears ill, diaphoretic, altered mental status',
        'Diffuse crackles in both lung fields',
        'Tachypneic with accessory muscle use',
        'Warm, well-perfused extremities'
      ],
      vitalSigns: {
        'HR': '115 bpm',
        'BP': '88/54 mmHg',
        'RR': '28/min',
        'SpO₂': '88% on room air',
        'Temp': '39.2°C'
      },
      labValues: {
        'WBC': '18,000/μL',
        'Lactate': '3.2 mmol/L',
        'Creatinine': '1.1 mg/dL (baseline 0.9)'
      },
      question: 'What is the most likely diagnosis?',
      options: [
        {
          id: 'sepsis',
          text: 'Septic shock from pneumonia',
          correct: true,
          feedback: 'Correct! Septic shock is defined by hypotension requiring vasopressors AND lactate > 2 despite fluid resuscitation. This patient has pneumonia with SIRS criteria, hypotension, and elevated lactate.',
          nextStep: 'initial_management'
        },
        {
          id: 'cardiogenic',
          text: 'Cardiogenic shock',
          correct: false,
          feedback: 'Incorrect. Cardiogenic shock typically presents with cool extremities, pulmonary edema, and elevated JVP. This patient has warm extremities and signs of systemic infection.',
          nextStep: 'initial_management'
        },
        {
          id: 'hypovolemic',
          text: 'Hypovolemic shock',
          correct: false,
          feedback: 'Incorrect. While hypotension is present, the fever, elevated WBC, and warm extremities suggest distributive (septic) shock rather than hypovolemia.',
          nextStep: 'initial_management'
        }
      ]
    },
    initial_management: {
      id: 'initial_management',
      title: 'Initial Management - Hour 0',
      description: 'You initiate the sepsis bundle: blood cultures drawn, broad-spectrum antibiotics given, 30 mL/kg crystalloid bolus started.',
      clinicalFindings: [
        'Patient receiving 2L fluid bolus',
        'Antibiotics: ceftriaxone + azithromycin',
        'Chest X-ray shows right lower lobe consolidation'
      ],
      vitalSigns: {
        'HR': '110 bpm',
        'BP': '92/56 mmHg',
        'RR': '30/min',
        'SpO₂': '90% on 4L NC'
      },
      question: 'After 2L fluid bolus, BP remains 90/55. Lactate still 3.0. What is your next step?',
      options: [
        {
          id: 'pressors',
          text: 'Start norepinephrine to target MAP ≥ 65 mmHg',
          correct: true,
          feedback: 'Correct! Per Surviving Sepsis guidelines, if hypotension persists after 30 mL/kg fluid, start vasopressors to maintain MAP ≥ 65. Norepinephrine is first-line.',
          nextStep: 'progression_6h'
        },
        {
          id: 'more_fluids',
          text: 'Give another 2L fluid bolus before pressors',
          correct: false,
          feedback: 'Not optimal. While some additional fluid may be reasonable, persistent hypotension after 30 mL/kg is an indication to start vasopressors per guidelines. Excessive fluids risk volume overload.',
          nextStep: 'progression_6h'
        },
        {
          id: 'steroids',
          text: 'Start hydrocortisone immediately',
          correct: false,
          feedback: 'Incorrect. Steroids are considered in refractory shock not responsive to fluids AND vasopressors. Start pressors first.',
          nextStep: 'progression_6h'
        }
      ]
    },
    progression_6h: {
      id: 'progression_6h',
      title: 'Hour 6 - Worsening Respiratory Status',
      description: 'Patient on norepinephrine 0.15 mcg/kg/min, MAP 68. However, respiratory status is worsening.',
      clinicalFindings: [
        'Increasing work of breathing',
        'Bilateral crackles now',
        'Unable to maintain conversation',
        'New bilateral infiltrates on repeat CXR'
      ],
      vitalSigns: {
        'HR': '118 bpm',
        'BP': '95/60 mmHg (on pressors)',
        'RR': '35/min',
        'SpO₂': '86% on 100% non-rebreather'
      },
      labValues: {
        'ABG': 'pH 7.32, PaCO₂ 48, PaO₂ 58',
        'PaO₂/FiO₂': '58',
        'Lactate': '2.8 mmol/L',
        'Creatinine': '1.6 mg/dL'
      },
      question: 'The patient now has PaO₂/FiO₂ ratio of 58 with bilateral infiltrates. What has developed?',
      options: [
        {
          id: 'ards',
          text: 'ARDS (Acute Respiratory Distress Syndrome)',
          correct: true,
          feedback: 'Correct! ARDS is defined by: acute onset, bilateral infiltrates, PaO₂/FiO₂ < 300 (this is < 100 = severe ARDS), and respiratory failure not explained by cardiac failure. This is a classic sepsis → ARDS progression.',
          nextStep: 'icu_management'
        },
        {
          id: 'chf',
          text: 'Cardiogenic pulmonary edema',
          correct: false,
          feedback: 'Unlikely. The patient has no cardiac history, BNP would be expected to be low in sepsis, and this is occurring in the context of severe sepsis. More consistent with ARDS.',
          nextStep: 'icu_management'
        },
        {
          id: 'pna_progression',
          text: 'Just progression of pneumonia',
          correct: false,
          feedback: 'Incorrect. While pneumonia is the source, the bilateral infiltrates and severe hypoxemia out of proportion to lobar pneumonia indicate ARDS has developed.',
          nextStep: 'icu_management'
        }
      ]
    },
    icu_management: {
      id: 'icu_management',
      title: 'ICU - Day 1',
      description: 'Patient intubated and transferred to ICU. On mechanical ventilation for severe ARDS.',
      clinicalFindings: [
        'Intubated, sedated',
        'Norepinephrine 0.12 mcg/kg/min',
        'Stiff lungs, high peak pressures'
      ],
      labValues: {
        'Creatinine': '2.2 mg/dL',
        'Urine output': '15 mL/hr',
        'Platelets': '110,000/μL (was 250k)',
        'INR': '1.6',
        'Fibrinogen': '185 mg/dL'
      },
      question: 'Creatinine rising (1.1 → 2.2), oliguria present. What type of AKI is this?',
      options: [
        {
          id: 'prerenal_atn',
          text: 'Initially prerenal, now evolving to ATN',
          correct: true,
          feedback: 'Correct! Started as prerenal from hypoperfusion (septic shock), but prolonged hypoperfusion has caused tubular injury (ATN). The combination of sepsis, hypotension, and now low urine output indicates AKI Stage 2 with ATN.',
          nextStep: 'multiorgan_failure'
        },
        {
          id: 'postrenal',
          text: 'Postrenal obstruction',
          correct: false,
          feedback: 'No evidence of obstruction. This is most consistent with sepsis-induced hypoperfusion leading to ATN.',
          nextStep: 'multiorgan_failure'
        },
        {
          id: 'glomerular',
          text: 'Glomerulonephritis',
          correct: false,
          feedback: 'Unlikely in this acute setting without proteinuria or hematuria. This is hypoperfusion-induced ATN.',
          nextStep: 'multiorgan_failure'
        }
      ]
    },
    multiorgan_failure: {
      id: 'multiorgan_failure',
      title: 'Day 2 - Multi-Organ Dysfunction',
      description: 'Patient now has evidence of multi-organ failure.',
      clinicalFindings: [
        'ARDS on ARDSNet protocol ventilation',
        'AKI Stage 2 (Cr 2.8, UOP 12 mL/hr)',
        'Dropping platelets and fibrinogen',
        'Oozing from IV sites'
      ],
      labValues: {
        'Platelets': '65,000/μL',
        'INR': '2.1',
        'PTT': '52 sec',
        'Fibrinogen': '120 mg/dL',
        'D-dimer': '>5000 ng/mL',
        'DIC Score (ISTH)': '6/8'
      },
      question: 'Falling platelets, elevated PT/PTT, low fibrinogen, high D-dimer. What has developed?',
      options: [
        {
          id: 'dic',
          text: 'DIC (Disseminated Intravascular Coagulation)',
          correct: true,
          feedback: 'Correct! ISTH DIC score ≥ 5 is diagnostic. Sepsis → endothelial injury → tissue factor release → widespread coagulation activation → consumption of platelets and clotting factors → paradoxical bleeding despite clotting. Classic sepsis → ARDS → AKI → DIC cascade!',
          nextStep: 'summary'
        },
        {
          id: 'ttp',
          text: 'TTP (Thrombotic Thrombocytopenic Purpura)',
          correct: false,
          feedback: 'TTP would show schistocytes on smear, normal PT/PTT, and is not typically associated with sepsis. This is DIC.',
          nextStep: 'summary'
        },
        {
          id: 'liver_failure',
          text: 'Just liver synthetic dysfunction',
          correct: false,
          feedback: 'While liver dysfunction can cause coagulopathy, the high D-dimer, low fibrinogen, and consumption pattern indicate DIC rather than just synthetic failure.',
          nextStep: 'summary'
        }
      ]
    },
    summary: {
      id: 'summary',
      title: 'Case Summary: Multi-Organ Failure Cascade',
      description: 'This case demonstrates the classic progression of septic shock through multiple organ systems.',
      clinicalFindings: [
        'Initial: Septic shock from pneumonia',
        'Hour 6: ARDS (systemic inflammation → pulmonary capillary leak)',
        'Day 1: AKI (hypoperfusion → ATN)',
        'Day 2: DIC (endothelial injury → coagulation activation)'
      ]
    }
  }
};

// CASE 2: Cardiogenic Shock → Hepatorenal Syndrome (Advanced)
const cardiogenicShockCase: CaseDefinition = {
  id: 'cardiogenic-shock',
  title: 'Cardiogenic Shock → Hepatorenal Syndrome',
  difficulty: 'Advanced',
  level: 'Fellow / Attending',
  duration: '15-20 min',
  description: 'Acute MI with cardiogenic shock leading to liver congestion, renal failure, and coagulopathy',
  objectives: [
    'Recognize cardiogenic shock vs other shock types',
    'Understand cardiorenal syndrome pathophysiology',
    'Identify hepatic congestion patterns',
    'Manage competing priorities in multi-organ failure'
  ],
  initialState: 'cardiogenicShock',
  stepOrder: ['intro', 'hemodynamics', 'hepatic_congestion', 'renal_failure', 'summary'],
  steps: {
    intro: {
      id: 'intro',
      title: 'Initial Presentation',
      description: '68-year-old woman with 2 hours of crushing chest pain arrives via EMS with severe dyspnea.',
      clinicalFindings: [
        'Severe respiratory distress, sitting upright',
        'Cool, clammy extremities',
        'Bilateral rales to apices',
        'Elevated JVP, peripheral edema',
        'S3 gallop present'
      ],
      vitalSigns: {
        'HR': '115 bpm',
        'BP': '82/55 mmHg',
        'RR': '32/min',
        'SpO₂': '84% on NRB',
        'Temp': '36.8°C'
      },
      labValues: {
        'Troponin': '8.5 ng/mL (markedly elevated)',
        'BNP': '1850 pg/mL',
        'Lactate': '4.2 mmol/L',
        'Creatinine': '1.8 mg/dL (baseline 1.0)'
      },
      question: 'What type of shock is this patient in?',
      options: [
        {
          id: 'cardiogenic',
          text: 'Cardiogenic shock',
          correct: true,
          feedback: 'Correct! Classic cardiogenic shock: acute MI (elevated troponin), pulmonary edema (rales, elevated BNP), hypoperfusion (cool extremities, elevated lactate), and hypotension. Note the contrast with septic shock: COOL not warm extremities, elevated JVP, pulmonary congestion.',
          nextStep: 'hemodynamics'
        },
        {
          id: 'septic',
          text: 'Septic shock',
          correct: false,
          feedback: 'Incorrect. Septic shock presents with WARM extremities (vasodilation), no pulmonary edema, and evidence of infection. This patient has cool extremities and cardiac pathology.',
          nextStep: 'hemodynamics'
        },
        {
          id: 'mixed',
          text: 'Mixed cardiogenic and septic shock',
          correct: false,
          feedback: 'No evidence of sepsis. The elevated troponin, BNP, and pulmonary edema point to pure cardiogenic shock from acute MI.',
          nextStep: 'hemodynamics'
        }
      ]
    },
    hemodynamics: {
      id: 'hemodynamics',
      title: 'Hour 2 - Hemodynamic Optimization',
      description: 'Patient intubated for respiratory failure. Emergent cardiac catheterization shows 100% LAD occlusion, successfully stented.',
      clinicalFindings: [
        'Post-PCI, TIMI 3 flow restored',
        'Echo: Anterior wall akinesis, EF 25%',
        'Still hypotensive despite PCI',
        'On dobutamine and norepinephrine'
      ],
      vitalSigns: {
        'HR': '105 bpm',
        'BP': '88/58 mmHg',
        'CVP': '18 mmHg',
        'Cardiac Index': '1.8 L/min/m²'
      },
      labValues: {
        'Lactate': '5.8 mmol/L',
        'Mixed venous O₂': '52%',
        'Creatinine': '2.4 mg/dL'
      },
      question: 'Despite revascularization, CI remains 1.8. CVP is 18. What explains persistent shock?',
      options: [
        {
          id: 'myocardial_stunning',
          text: 'Myocardial stunning - heart muscle needs time to recover',
          correct: true,
          feedback: 'Correct! Despite successful revascularization, stunned myocardium (reversible contractile dysfunction post-ischemia) takes hours-days to recover. The low CI (1.8, normal >2.5) with high CVP (18) indicates pump failure. This is why mechanical support (IABP, Impella) may be needed.',
          nextStep: 'hepatic_congestion'
        },
        {
          id: 'hypovolemia',
          text: 'Patient is hypovolemic and needs more fluids',
          correct: false,
          feedback: 'Dangerous answer! CVP is 18 (very high), indicating volume overload not depletion. More fluids would worsen pulmonary edema. This patient needs inotropes or mechanical support, not fluids.',
          nextStep: 'hepatic_congestion'
        },
        {
          id: 'missed_lesion',
          text: 'There must be another coronary lesion',
          correct: false,
          feedback: 'Unlikely with TIMI 3 flow. The issue is severe myocardial dysfunction from the large anterior MI, not ongoing ischemia.',
          nextStep: 'hepatic_congestion'
        }
      ]
    },
    hepatic_congestion: {
      id: 'hepatic_congestion',
      title: 'Day 1 - Hepatic Dysfunction',
      description: 'Patient remains on inotropes with persistently low cardiac output. Liver function tests show dramatic elevation.',
      clinicalFindings: [
        'Right upper quadrant tenderness',
        'Hepatomegaly on exam',
        'Elevated JVP with hepatojugular reflux',
        'Pulsatile liver edge'
      ],
      labValues: {
        'AST': '2400 U/L',
        'ALT': '1850 U/L',
        'Total bilirubin': '4.2 mg/dL',
        'INR': '2.3',
        'Albumin': '2.8 g/dL',
        'Alkaline phosphatase': '180 U/L'
      },
      question: 'AST/ALT >2000 with elevated bilirubin and INR. What is the mechanism?',
      options: [
        {
          id: 'congestion',
          text: 'Hepatic congestion from elevated CVP (congestive hepatopathy)',
          correct: true,
          feedback: 'Correct! "Shock liver" or congestive hepatopathy. High CVP (from RV failure) → hepatic venous congestion → centrilobular necrosis → dramatic transaminase elevation. The pattern: very high transaminases, moderately elevated bilirubin, prolonged INR. This is a consequence of the low cardiac output state.',
          nextStep: 'renal_failure'
        },
        {
          id: 'ischemic',
          text: 'Ischemic hepatitis from hypoperfusion alone',
          correct: false,
          feedback: 'Partially correct but incomplete. While hypoperfusion contributes, the key mechanism is VENOUS congestion from high CVP. Pure ischemic hepatitis would show different patterns. The pulsatile liver and hepatojugular reflux indicate congestion is the primary issue.',
          nextStep: 'renal_failure'
        },
        {
          id: 'drug_toxicity',
          text: 'Drug-induced liver injury from medications',
          correct: false,
          feedback: 'Unlikely. The timeline (acute elevation), clinical context (cardiogenic shock), and exam findings (pulsatile liver, elevated JVP) all point to congestive hepatopathy, not drug toxicity.',
          nextStep: 'renal_failure'
        }
      ]
    },
    renal_failure: {
      id: 'renal_failure',
      title: 'Day 2 - Cardiorenal Syndrome',
      description: 'Despite some cardiac improvement, kidney function continues to worsen.',
      clinicalFindings: [
        'Oliguria persists (10-15 mL/hr)',
        'Increasing creatinine despite diuretics',
        'Worsening metabolic acidosis',
        'Hyperkalemia developing'
      ],
      vitalSigns: {
        'BP': '95/62 mmHg (improved)',
        'Cardiac Index': '2.1 L/min/m²',
        'CVP': '16 mmHg'
      },
      labValues: {
        'Creatinine': '4.2 mg/dL',
        'BUN': '82 mg/dL',
        'K⁺': '5.8 mEq/L',
        'HCO₃': '16 mEq/L',
        'Urine Na': '8 mEq/L'
      },
      question: 'Why does renal failure persist despite improving cardiac output?',
      options: [
        {
          id: 'cardiorenal',
          text: 'Cardiorenal syndrome - combined hemodynamic and neurohormonal mechanisms',
          correct: true,
          feedback: 'Correct! Cardiorenal syndrome Type 1: Acute cardiac dysfunction → renal failure via: (1) Low cardiac output → prerenal azotemia, (2) Venous congestion → renal vein congestion impairs GFR, (3) RAAS activation → further fluid retention, (4) Diuretic resistance. Low urine Na (8) confirms avid sodium retention. May need CRRT despite "improved" hemodynamics.',
          nextStep: 'summary'
        },
        {
          id: 'atn',
          text: 'Simple ATN from initial hypoperfusion',
          correct: false,
          feedback: 'Too simplistic. While ATN may be present, cardiorenal syndrome involves ongoing hemodynamic (venous congestion) and neurohormonal (RAAS) factors that perpetuate dysfunction even as cardiac output improves. The low urine Na suggests ongoing prerenal physiology, not established ATN.',
          nextStep: 'summary'
        },
        {
          id: 'contrast',
          text: 'Contrast-induced nephropathy from the catheterization',
          correct: false,
          feedback: 'May contribute but is not the primary mechanism. The progressive worsening, low urine Na, and clinical context of persistent cardiogenic shock indicate cardiorenal syndrome as the dominant pathophysiology.',
          nextStep: 'summary'
        }
      ]
    },
    summary: {
      id: 'summary',
      title: 'Case Summary: Cardiogenic Shock Cascade',
      description: 'This case demonstrates the forward AND backward failure effects of cardiogenic shock.',
      clinicalFindings: [
        'Initial: Cardiogenic shock from acute MI',
        'Forward failure: Low cardiac output → renal hypoperfusion → AKI',
        'Backward failure: Elevated CVP → hepatic congestion → "shock liver"',
        'Combined: Cardiorenal syndrome with diuretic resistance'
      ]
    }
  }
};

// CASE 3: Hemorrhagic Shock → Massive Transfusion Coagulopathy (Intermediate)
const traumaCase: CaseDefinition = {
  id: 'trauma-hemorrhage',
  title: 'Trauma → Hemorrhagic Shock → Coagulopathy',
  difficulty: 'Intermediate',
  level: 'Resident',
  duration: '12-15 min',
  description: 'Motor vehicle collision with hemorrhagic shock requiring massive transfusion',
  objectives: [
    'Recognize hemorrhagic shock',
    'Understand massive transfusion protocol',
    'Identify trauma-induced coagulopathy',
    'Manage complications of massive transfusion'
  ],
  initialState: 'normal',
  stepOrder: ['intro', 'hemorrhagic_shock', 'massive_transfusion', 'complications', 'summary'],
  steps: {
    intro: {
      id: 'intro',
      title: 'Trauma Bay - Initial Assessment',
      description: '32-year-old man, unrestrained driver in high-speed MVC. Obvious pelvic deformity and abdominal distension.',
      clinicalFindings: [
        'GCS 13 (confused but opens eyes)',
        'Pelvis unstable with gentle compression',
        'Abdomen distended, diffusely tender',
        'Cool, pale extremities',
        'Weak, thready pulse'
      ],
      vitalSigns: {
        'HR': '135 bpm',
        'BP': '78/45 mmHg',
        'RR': '28/min',
        'SpO₂': '94% on NRB',
        'Temp': '35.8°C'
      },
      labValues: {
        'Hgb': '9.2 g/dL (estimated blood loss ~30%)',
        'Lactate': '5.5 mmol/L',
        'Base deficit': '-8 mEq/L'
      },
      question: 'What class of hemorrhagic shock is this patient in?',
      options: [
        {
          id: 'class3',
          text: 'Class III hemorrhagic shock (30-40% blood loss)',
          correct: true,
          feedback: 'Correct! Class III shock: HR >120, BP decreased, confused, cool extremities. Estimated 30-40% blood volume lost (~1500-2000 mL). Requires immediate massive transfusion protocol activation. Class I-II would have normal BP, Class IV would have undetectable BP and loss of consciousness.',
          nextStep: 'hemorrhagic_shock'
        },
        {
          id: 'class2',
          text: 'Class II hemorrhagic shock (15-30% blood loss)',
          correct: false,
          feedback: 'Too low. This patient has hypotension, tachycardia >120, altered mental status, and cool extremities - all indicate Class III. Class II would have normal BP and mentatio with just tachycardia.',
          nextStep: 'hemorrhagic_shock'
        },
        {
          id: 'class4',
          text: 'Class IV hemorrhagic shock (>40% blood loss)',
          correct: false,
          feedback: 'Too severe. Class IV typically has undetectable BP and loss of consciousness. This patient still has measurable BP and is alert (GCS 13). This is Class III with potential to progress without intervention.',
          nextStep: 'hemorrhagic_shock'
        }
      ]
    },
    hemorrhagic_shock: {
      id: 'hemorrhagic_shock',
      title: 'Resuscitation - Minute 10',
      description: 'FAST exam shows massive intraperitoneal fluid. Pelvic binder applied. Activating massive transfusion protocol.',
      clinicalFindings: [
        'FAST positive - large volume free fluid',
        'Pelvic binder in place',
        'Two large-bore IVs established',
        'Preparing for emergent laparotomy'
      ],
      vitalSigns: {
        'HR': '142 bpm',
        'BP': '72/40 mmHg',
        'Temp': '35.2°C'
      },
      question: 'What is the optimal transfusion ratio in massive transfusion protocol?',
      options: [
        {
          id: 'balanced',
          text: '1:1:1 ratio (RBC:FFP:Platelets)',
          correct: true,
          feedback: 'Correct! PROPPR trial showed 1:1:1 ratio (RBCs:FFP:Platelets) reduces mortality vs 1:1:2 in severe hemorrhage. This balanced approach: (1) Replaces clotting factors, (2) Maintains platelet count, (3) Prevents dilutional coagulopathy. Give 6 units RBC : 6 units FFP : 1 apheresis platelet unit per "round."',
          nextStep: 'massive_transfusion'
        },
        {
          id: 'rbc_only',
          text: 'RBCs only until Hgb >7, then add FFP if needed',
          correct: false,
          feedback: 'Dangerously incorrect! Giving only RBCs causes dilutional coagulopathy - you\'re replacing blood that contains clotting factors with products that don\'t. In massive transfusion, give balanced products from the start to prevent "running out" of clotting factors.',
          nextStep: 'massive_transfusion'
        },
        {
          id: 'high_plasma',
          text: '1:2 ratio (1 RBC : 2 FFP)',
          correct: false,
          feedback: 'Backwards and would cause volume overload without adequate oxygen carrying capacity. The correct ratio is 1:1:1 (RBC:FFP:Platelets).',
          nextStep: 'massive_transfusion'
        }
      ]
    },
    massive_transfusion: {
      id: 'massive_transfusion',
      title: 'OR - Massive Transfusion Underway',
      description: 'Patient received 12 units RBC, 12 units FFP, 2 apheresis platelets. Pelvic bleeding controlled, spleen removed, liver packed.',
      clinicalFindings: [
        'Damage control laparotomy completed',
        'Abdomen packed, planned second-look in 24h',
        'Ongoing oozing from surgical sites',
        'Cold (34.8°C), developing coagulopathy'
      ],
      labValues: {
        'Hgb': '8.5 g/dL',
        'Platelets': '68,000/μL',
        'INR': '1.8',
        'Fibrinogen': '95 mg/dL (low!)',
        'Ionized Ca²⁺': '0.92 mmol/L (low)',
        'Temp': '34.8°C',
        'pH': '7.22'
      },
      question: 'Despite 1:1:1 transfusion, patient has worsening coagulopathy. What is the likely cause?',
      options: [
        {
          id: 'triad',
          text: 'Lethal triad: hypothermia, acidosis, coagulopathy',
          correct: true,
          feedback: 'Correct! The "lethal triad" of trauma: (1) Hypothermia (34.8°C) → impairs clotting enzyme function, (2) Acidosis (pH 7.22) → further impairs coagulation, (3) Coagulopathy → worsens bleeding → perpetuates cycle. ALSO note low fibrinogen (95, should be >150) and hypocalcemia (citrate in blood products binds Ca²⁺). Need: warming, calcium, cryoprecipitate for fibrinogen.',
          nextStep: 'complications'
        },
        {
          id: 'dic',
          text: 'DIC from tissue injury',
          correct: false,
          feedback: 'Unlikely this early. While DIC can occur in trauma, this presentation is classic for the lethal triad (hypothermia 34.8°C, acidosis pH 7.22, coagulopathy). The low fibrinogen is from dilution/consumption in massive bleeding, not DIC.',
          nextStep: 'complications'
        },
        {
          id: 'inadequate_products',
          text: 'Not enough blood products given',
          correct: false,
          feedback: 'Incorrect - 12 units each of RBC/FFP plus platelets is substantial. The issue is the lethal triad: hypothermia and acidosis are impairing the function of the clotting factors you\'ve given. Must correct temperature and pH.',
          nextStep: 'complications'
        }
      ]
    },
    complications: {
      id: 'complications',
      title: 'ICU - Post-Op Hour 6',
      description: 'Patient being actively warmed, acidosis improving. However, developing new issues.',
      clinicalFindings: [
        'Temperature now 36.8°C',
        'pH improved to 7.32',
        'Received 4 units cryoprecipitate',
        'Developing perioral numbness and tetany'
      ],
      labValues: {
        'Ionized Ca²⁺': '0.88 mmol/L',
        'K⁺': '5.9 mEq/L',
        'Mg²⁺': '1.2 mg/dL',
        'Fibrinogen': '165 mg/dL (improved)'
      },
      vitalSigns: {
        'HR': '108 bpm',
        'BP': '102/65 mmHg',
        'QTc': '485 ms (prolonged)'
      },
      question: 'Perioral numbness, tetany, prolonged QTc after massive transfusion. What is happening?',
      options: [
        {
          id: 'hypocalcemia',
          text: 'Citrate toxicity causing hypocalcemia',
          correct: true,
          feedback: 'Correct! Massive transfusion complication: Citrate (anticoagulant in blood products) binds calcium → hypocalcemia → perioral numbness, tetany, prolonged QT, cardiac dysfunction. Give calcium gluconate/chloride. ALSO note hyperkalemia (5.9) from stored RBCs releasing K⁺. Other massive transfusion complications: TRALI, TACO, hypothermia.',
          nextStep: 'summary'
        },
        {
          id: 'hypomagnesemia',
          text: 'Hypomagnesemia causing tetany',
          correct: false,
          feedback: 'While Mg is slightly low (1.2), the dominant issue is hypocalcemia from citrate toxicity. The prolonged QTc and timing post-massive transfusion point to calcium as the primary problem. Treat calcium first.',
          nextStep: 'summary'
        },
        {
          id: 'seizure',
          text: 'Seizure from head injury',
          correct: false,
          feedback: 'Unlikely. This is a metabolic issue (citrate-induced hypocalcemia) not neurologic. The perioral numbness, tetany, and prolonged QT all point to low calcium, a known complication of massive transfusion.',
          nextStep: 'summary'
        }
      ]
    },
    summary: {
      id: 'summary',
      title: 'Case Summary: Hemorrhagic Shock & Massive Transfusion',
      description: 'This case highlights the complications and management of severe hemorrhagic shock.',
      clinicalFindings: [
        'Initial: Class III hemorrhagic shock requiring massive transfusion',
        'Management: 1:1:1 ratio (RBC:FFP:Platelets) per protocol',
        'Complication: Lethal triad (hypothermia, acidosis, coagulopathy)',
        'Metabolic: Citrate toxicity → hypocalcemia, hyperkalemia from stored blood'
      ]
    }
  }
};

// CASE 4: Acute Pancreatitis → SIRS → Multi-Organ Failure (Advanced)
const pancreatitisCase: CaseDefinition = {
  id: 'pancreatitis',
  title: 'Acute Pancreatitis → SIRS → Multi-Organ Failure',
  difficulty: 'Advanced',
  level: 'Fellow / Attending',
  duration: '15-18 min',
  description: 'Severe acute pancreatitis with systemic inflammation leading to ARDS and AKI',
  objectives: [
    'Recognize severe acute pancreatitis',
    'Understand SIRS vs sepsis',
    'Differentiate inflammatory vs infectious multi-organ failure',
    'Apply Ranson\'s criteria and APACHE scoring'
  ],
  initialState: 'normal',
  stepOrder: ['intro', 'severe_pancreatitis', 'sirs_response', 'multiorgan', 'summary'],
  steps: {
    intro: {
      id: 'intro',
      title: 'ED Presentation',
      description: '45-year-old man with severe epigastric pain radiating to back, nausea, vomiting for 12 hours. History of alcohol use.',
      clinicalFindings: [
        'Severe epigastric tenderness',
        'Guarding, no rebound',
        'Decreased bowel sounds',
        'Mild jaundice',
        'Tachycardic, appears ill'
      ],
      vitalSigns: {
        'HR': '118 bpm',
        'BP': '102/68 mmHg',
        'RR': '24/min',
        'SpO₂': '96% on RA',
        'Temp': '38.4°C'
      },
      labValues: {
        'Lipase': '1850 U/L (markedly elevated)',
        'WBC': '16,500/μL',
        'Calcium': '7.8 mg/dL (low)',
        'Glucose': '195 mg/dL',
        'LDH': '420 U/L'
      },
      question: 'Lipase 1850, epigastric pain to back, low calcium. What is the diagnosis?',
      options: [
        {
          id: 'pancreatitis',
          text: 'Acute pancreatitis',
          correct: true,
          feedback: 'Correct! Diagnostic criteria (need 2 of 3): (1) Typical pain (epigastric, radiating to back), (2) Lipase >3× ULN (this is ~6× upper limit), (3) Imaging findings. The hypocalcemia (7.8) occurs from calcium saponification in peripancreatic fat - a marker of severity. Common causes: alcohol (this patient), gallstones.',
          nextStep: 'severe_pancreatitis'
        },
        {
          id: 'cholecystitis',
          text: 'Acute cholecystitis',
          correct: false,
          feedback: 'Incorrect. While gallstones can CAUSE pancreatitis, cholecystitis presents with RUQ (not epigastric) pain and doesn\'t cause lipase elevation this dramatic. The low calcium and back radiation are classic for pancreatitis.',
          nextStep: 'severe_pancreatitis'
        },
        {
          id: 'perforation',
          text: 'Perforated peptic ulcer',
          correct: false,
          feedback: 'Unlikely. Perforation presents with peritoneal signs (rebound, rigidity) and would show free air on imaging. The markedly elevated lipase and hypocalcemia point to pancreatitis.',
          nextStep: 'severe_pancreatitis'
        }
      ]
    },
    severe_pancreatitis: {
      id: 'severe_pancreatitis',
      title: 'Hour 8 - Severity Assessment',
      description: 'CT abdomen shows extensive pancreatic inflammation with peripancreatic fluid collections.',
      clinicalFindings: [
        'CT: Pancreatic edema, peripancreatic stranding',
        'Fluid collections in lesser sac',
        'No clear necrosis yet (too early)',
        'Bilateral pleural effusions developing'
      ],
      labValues: {
        'WBC': '19,000/μL',
        'Hct': '52% (hemoconcentration)',
        'BUN': '28 mg/dL (elevated)',
        'Calcium': '7.2 mg/dL',
        'LDH': '580 U/L',
        'AST': '245 U/L'
      },
      question: 'Which Ranson criterion at 48 hours would indicate severe pancreatitis?',
      options: [
        {
          id: 'hct_drop',
          text: 'Hematocrit drop >10% (indicating third-spacing)',
          correct: true,
          feedback: 'Correct! Ranson\'s criteria at admission (5): Age >55, WBC >16k, glucose >200, LDH >350, AST >250. At 48 hours (6): Hct fall >10%, BUN rise >5, Ca <8, PaO₂ <60, base deficit >4, fluid sequestration >6L. This patient has several (WBC 19k, Ca 7.2, LDH 580, AST 245, Hct rising suggesting hemoconcentration). ≥3 = severe pancreatitis with ~15% mortality.',
          nextStep: 'sirs_response'
        },
        {
          id: 'fever',
          text: 'Fever >38.5°C',
          correct: false,
          feedback: 'Not part of Ranson\'s criteria. While fever is common in pancreatitis (from inflammation OR infection), Ranson\'s criteria focus on markers of severity like hemoconcentration, hypocalcemia, hypoxemia, etc.',
          nextStep: 'sirs_response'
        },
        {
          id: 'lipase',
          text: 'Lipase level >5× upper limit of normal',
          correct: false,
          feedback: 'No! Lipase level does NOT correlate with severity in pancreatitis. A patient can have mild disease with lipase >5000 or severe disease with lipase only 500. Ranson\'s criteria focus on physiologic derangements, not enzyme levels.',
          nextStep: 'sirs_response'
        }
      ]
    },
    sirs_response: {
      id: 'sirs_response',
      title: 'Day 2 - Systemic Inflammation',
      description: 'Patient worsening despite aggressive fluid resuscitation. Now meeting SIRS criteria.',
      clinicalFindings: [
        'Increasing oxygen requirement',
        'Bilateral infiltrates on CXR',
        'Persistent fever and tachycardia',
        'Abdominal distension, ileus'
      ],
      vitalSigns: {
        'HR': '128 bpm',
        'Temp': '39.1°C',
        'RR': '32/min',
        'SpO₂': '89% on 6L NC'
      },
      labValues: {
        'WBC': '22,000/μL',
        'Procalcitonin': '0.8 ng/mL (mildly elevated)',
        'Lactate': '2.8 mmol/L',
        'Blood cultures': 'Pending (drawn)'
      },
      question: 'Fever, tachycardia, leukocytosis, tachypnea. Is this SIRS or sepsis?',
      options: [
        {
          id: 'sirs',
          text: 'SIRS (Systemic Inflammatory Response Syndrome) from pancreatitis',
          correct: true,
          feedback: 'Correct! Important distinction: SIRS = systemic inflammation from ANY cause (trauma, burns, pancreatitis). Sepsis = SIRS PLUS documented/suspected infection. This patient has SIRS from sterile pancreatic inflammation. Low procalcitonin (0.8, sepsis usually >2) and sterile blood cultures support this. However, ~30% develop infected necrosis later, requiring antibiotics.',
          nextStep: 'multiorgan'
        },
        {
          id: 'sepsis',
          text: 'Sepsis - start broad-spectrum antibiotics immediately',
          correct: false,
          feedback: 'Too aggressive. While this patient has SIRS criteria (fever, tachycardia, leukocytosis, tachypnea), there\'s no clear infectious source yet. This is sterile inflammation from pancreatitis. Procalcitonin is only 0.8 (sepsis usually >2). Antibiotics are not indicated in acute pancreatitis UNLESS there\'s infected necrosis (typically Week 2-3). Unnecessary antibiotics select for resistant organisms.',
          nextStep: 'multiorgan'
        },
        {
          id: 'uncertain',
          text: 'Cannot distinguish - treat empirically with antibiotics',
          correct: false,
          feedback: 'Can distinguish! SIRS from sterile pancreatitis vs sepsis: Look at (1) clinical context (pancreatitis, no pneumonia/UTI), (2) procalcitonin (low at 0.8), (3) timing (infected necrosis occurs Week 2-3, not Day 2). This is SIRS. Overuse of empiric antibiotics in pancreatitis increases fungal infections and resistance.',
          nextStep: 'multiorgan'
        }
      ]
    },
    multiorgan: {
      id: 'multiorgan',
      title: 'Day 3 - Multi-Organ Dysfunction',
      description: 'Respiratory failure requiring intubation. Kidney function declining.',
      clinicalFindings: [
        'Intubated for hypoxemic respiratory failure',
        'Bilateral infiltrates consistent with ARDS',
        'Oliguria despite adequate resuscitation',
        'Persistent abdominal distension'
      ],
      labValues: {
        'PaO₂/FiO₂': '145',
        'Creatinine': '2.8 mg/dL (from 1.0)',
        'BUN': '52 mg/dL',
        'Lactate': '3.5 mmol/L',
        'Platelets': '95,000/μL (dropping)'
      },
      question: 'ARDS and AKI in severe pancreatitis. What is the mechanism?',
      options: [
        {
          id: 'cytokine_storm',
          text: 'Cytokine-mediated systemic inflammation → distant organ injury',
          correct: true,
          feedback: 'Correct! Severe pancreatitis → massive cytokine release (IL-1, IL-6, TNF-α) → systemic inflammatory response → distant organ injury: (1) Lungs: capillary leak → ARDS, (2) Kidneys: hypoperfusion + direct inflammatory injury → AKI, (3) Coagulation: consumption → thrombocytopenia. This is the same pathophysiology as sepsis, but from STERILE inflammation! Treatment: supportive care (ARDSNet ventilation, renal replacement if needed).',
          nextStep: 'summary'
        },
        {
          id: 'hypovolemia',
          text: 'Just hypovolemia from third-spacing',
          correct: false,
          feedback: 'Too simplistic. While third-spacing contributes, severe pancreatitis causes SYSTEMIC inflammation (cytokine storm) similar to sepsis. This affects lungs (ARDS) and kidneys (AKI) through inflammatory mediators, not just volume loss. Note the dropping platelets - sign of systemic inflammation.',
          nextStep: 'summary'
        },
        {
          id: 'infection',
          text: 'Infected pancreatic necrosis causing septic shock',
          correct: false,
          feedback: 'Too early for infected necrosis (typically Week 2-3, this is Day 3). This is sterile SIRS with multi-organ dysfunction from cytokine release. If infection develops later, it would present with worsening fever, gas in pancreatic bed on CT.',
          nextStep: 'summary'
        }
      ]
    },
    summary: {
      id: 'summary',
      title: 'Case Summary: Pancreatitis → SIRS → Multi-Organ Failure',
      description: 'This case demonstrates sterile systemic inflammation causing distant organ injury.',
      clinicalFindings: [
        'Initial: Severe acute pancreatitis (Ranson ≥3)',
        'Day 2: SIRS (NOT sepsis) - sterile inflammation',
        'Day 3: Multi-organ dysfunction (ARDS, AKI) from cytokine storm',
        'Key: Same organ failures as sepsis, but from sterile inflammation'
      ]
    }
  }
};

// CASE 5: ARDS from Aspiration (Basic)
const ardsCase: CaseDefinition = {
  id: 'ards-aspiration',
  title: 'Aspiration → ARDS',
  difficulty: 'Basic',
  level: 'MS4 / Intern',
  duration: '10-12 min',
  description: 'Witnessed aspiration event progressing to acute respiratory distress syndrome',
  objectives: [
    'Recognize aspiration pneumonitis vs pneumonia',
    'Understand ARDS Berlin Definition',
    'Apply ARDSNet ventilation strategy',
    'Distinguish chemical injury from infection'
  ],
  initialState: 'normal',
  stepOrder: ['intro', 'aspiration', 'ards_development', 'ventilation', 'summary'],
  steps: {
    intro: {
      id: 'intro',
      title: 'Initial Presentation',
      description: '72-year-old woman found unresponsive after vomiting. Witnessed aspiration by family.',
      clinicalFindings: [
        'Witnessed aspiration of gastric contents',
        'Decreased level of consciousness',
        'Coarse breath sounds bilaterally',
        'Hypoxemic on arrival'
      ],
      vitalSigns: {
        'HR': '102 bpm',
        'BP': '138/82 mmHg',
        'RR': '26/min',
        'SpO₂': '85% on RA → 92% on NRB',
        'Temp': '37.2°C (afebrile)'
      },
      labValues: {
        'WBC': '11,000/μL',
        'CXR': 'Bilateral infiltrates, right > left'
      },
      question: 'Witnessed aspiration with bilateral infiltrates. Initial management?',
      options: [
        {
          id: 'supportive',
          text: 'Supportive care: oxygen, intubation if needed, NO routine antibiotics yet',
          correct: true,
          feedback: 'Correct! Aspiration pneumonitis = CHEMICAL injury from gastric acid. Initial management: (1) Airway protection, (2) Oxygen/ventilation support, (3) Bronchoscopy if large particles. Antibiotics NOT indicated initially - this is sterile inflammation. If fever/infiltrates persist 48-72h or patient develops sepsis criteria, THEN consider aspiration pneumonia (bacterial infection) and start antibiotics.',
          nextStep: 'aspiration'
        },
        {
          id: 'antibiotics',
          text: 'Immediate broad-spectrum antibiotics for aspiration pneumonia',
          correct: false,
          feedback: 'Too aggressive. Aspiration pneumonitis (chemical injury, first 48h) ≠ aspiration pneumonia (bacterial infection, typically >48h). This patient is afebrile, WBC only mildly elevated. Starting antibiotics now risks resistance. Support with oxygen first, add antibiotics only if infection develops.',
          nextStep: 'aspiration'
        },
        {
          id: 'steroids',
          text: 'High-dose corticosteroids to reduce inflammation',
          correct: false,
          feedback: 'Not recommended. While aspiration causes inflammation, steroids have not shown benefit and may increase infection risk. Standard management is supportive care.',
          nextStep: 'aspiration'
        }
      ]
    },
    aspiration: {
      id: 'aspiration',
      title: 'Hour 4 - Worsening Hypoxemia',
      description: 'Despite supplemental oxygen, patient\'s respiratory status continues to decline.',
      clinicalFindings: [
        'Increased work of breathing',
        'Accessory muscle use',
        'Bilateral crackles throughout',
        'Agitated, hypoxemic'
      ],
      vitalSigns: {
        'RR': '35/min',
        'SpO₂': '86% on NRB (100% FiO₂)',
        'ABG': 'pH 7.42, PaCO₂ 38, PaO₂ 55'
      },
      question: 'PaO₂ 55 on 100% FiO₂ (PaO₂/FiO₂ = 55). What is this?',
      options: [
        {
          id: 'severe_ards',
          text: 'Severe ARDS (PaO₂/FiO₂ < 100)',
          correct: true,
          feedback: 'Correct! Berlin Definition of ARDS: (1) Acute onset (<7 days), (2) Bilateral infiltrates, (3) Not from cardiac failure, (4) Hypoxemia: Mild 200-300, Moderate 100-200, Severe <100. This patient: PaO₂/FiO₂ = 55/1.0 = 55 (severe ARDS). From aspiration → chemical injury → alveolar-capillary membrane damage → pulmonary edema → impaired gas exchange.',
          nextStep: 'ards_development'
        },
        {
          id: 'pneumonia',
          text: 'Severe pneumonia',
          correct: false,
          feedback: 'Not quite. While aspiration was the trigger, the syndrome (bilateral infiltrates, severe hypoxemia, acute onset) is ARDS. Pneumonia can CAUSE ARDS, but once PaO₂/FiO₂ <300 with bilateral infiltrates, it meets ARDS criteria - this is important for guiding ventilator management.',
          nextStep: 'ards_development'
        },
        {
          id: 'flash_edema',
          text: 'Flash pulmonary edema',
          correct: false,
          feedback: 'Unlikely. Flash pulmonary edema is cardiogenic (often from hypertensive emergency, acute MR/AR). This patient has normal BP, witnessed aspiration, and clinical picture of aspiration-induced lung injury (ARDS).',
          nextStep: 'ards_development'
        }
      ]
    },
    ards_development: {
      id: 'ards_development',
      title: 'ICU Admission - Intubation Required',
      description: 'Patient intubated for severe hypoxemic respiratory failure.',
      clinicalFindings: [
        'Intubated and sedated',
        'Stiff lungs, high plateau pressures',
        'Thick secretions suctioned',
        'Bilateral infiltrates on CXR'
      ],
      vitalSigns: {
        'On vent': 'AC mode, TV 480 mL (8 mL/kg IBW)',
        'PEEP': '5 cmH₂O',
        'FiO₂': '100%',
        'Plateau pressure': '35 cmH₂O'
      },
      labValues: {
        'ABG': 'pH 7.35, PaCO₂ 42, PaO₂ 62',
        'Compliance': '28 mL/cmH₂O (very stiff)'
      },
      question: 'Plateau pressure 35 cmH₂O in ARDS. What is the target?',
      options: [
        {
          id: 'plateau_30',
          text: 'Plateau pressure ≤ 30 cmH₂O to prevent volutrauma',
          correct: true,
          feedback: 'Correct! ARDSNet protocol: (1) Low tidal volume 6 mL/kg IBW (not 8-10), (2) Plateau pressure ≤30 to prevent barotrauma/volutrauma, (3) Permissive hypercapnia acceptable. This patient\'s Pplat 35 is too high - reduce tidal volume to 6 mL/kg, accept higher CO₂. Also increase PEEP (currently only 5) to recruit alveoli and reduce FiO₂.',
          nextStep: 'ventilation'
        },
        {
          id: 'normal_tv',
          text: 'Keep tidal volume 10 mL/kg like normal lungs',
          correct: false,
          feedback: 'Dangerously incorrect! ARDS lungs are STIFF with reduced functional capacity. Normal tidal volumes (10-12 mL/kg) cause overdistension → volutrauma → worsening ARDS. ARDSNet trial showed 6 mL/kg IBW reduces mortality. Always use LOW tidal volumes in ARDS.',
          nextStep: 'ventilation'
        },
        {
          id: 'high_peep',
          text: 'Just increase PEEP to 20 cmH₂O',
          correct: false,
          feedback: 'Partially right idea (PEEP helps recruit alveoli) but you must FIRST reduce tidal volume to achieve Pplat ≤30. High PEEP alone without low TV can worsen barotrauma. Strategy: low TV (6 mL/kg) + titrated PEEP + permissive hypercapnia.',
          nextStep: 'ventilation'
        }
      ]
    },
    ventilation: {
      id: 'ventilation',
      title: 'Day 2 - ARDSNet Protocol',
      description: 'Ventilator adjusted to lung-protective strategy.',
      clinicalFindings: [
        'Tidal volume reduced to 6 mL/kg IBW',
        'PEEP increased to 12 cmH₂O',
        'Plateau pressure now 28 cmH₂O',
        'Oxygenation improving'
      ],
      vitalSigns: {
        'On vent': 'TV 360 mL (6 mL/kg), PEEP 12',
        'FiO₂': '70%',
        'Plateau pressure': '28 cmH₂O'
      },
      labValues: {
        'ABG': 'pH 7.28, PaCO₂ 55, PaO₂ 72',
        'SpO₂': '92%'
      },
      question: 'pH 7.28, PaCO₂ 55 on ARDSNet settings. What now?',
      options: [
        {
          id: 'permissive',
          text: 'Accept permissive hypercapnia - this is expected with lung-protective ventilation',
          correct: true,
          feedback: 'Correct! Permissive hypercapnia: Accept higher CO₂ (up to pH ~7.20) to maintain low tidal volumes and prevent volutrauma. As long as pH >7.20 and patient is adequately oxygenated (SpO₂ 92%), this is acceptable. The priority in ARDS is preventing ventilator-induced lung injury, not normalizing CO₂. If pH <7.20, can give small bicarb bolus, but do NOT increase tidal volume.',
          nextStep: 'summary'
        },
        {
          id: 'increase_tv',
          text: 'Increase tidal volume to blow off CO₂',
          correct: false,
          feedback: 'Dangerously incorrect! Increasing TV in ARDS → higher plateau pressure → volutrauma → worsening ARDS and mortality. ARDSNet trial specifically showed benefit of LOW TV despite hypercapnia. Accept the elevated CO₂ as long as pH >7.20.',
          nextStep: 'summary'
        },
        {
          id: 'bicarbonate',
          text: 'Give continuous bicarbonate infusion to normalize pH',
          correct: false,
          feedback: 'Unnecessary and potentially harmful. pH 7.28 is acceptable. Bicarb can cause volume overload, hypernatremia, and masks the degree of ventilation inadequacy. Only consider if pH <7.20 AND patient is symptomatic.',
          nextStep: 'summary'
        }
      ]
    },
    summary: {
      id: 'summary',
      title: 'Case Summary: Aspiration → ARDS',
      description: 'This case demonstrates aspiration-induced ARDS and lung-protective ventilation.',
      clinicalFindings: [
        'Initial: Aspiration pneumonitis (chemical injury, NOT infection)',
        'Hour 4: Progression to severe ARDS (PaO₂/FiO₂ < 100)',
        'Management: ARDSNet protocol (6 mL/kg TV, Pplat ≤30, PEEP)',
        'Accept: Permissive hypercapnia (pH >7.20) to prevent volutrauma'
      ]
    }
  }
};

// Consolidate all cases
const allCases = [septicShockCase, cardiogenicShockCase, traumaCase, pancreatitisCase, ardsCase];

export default function CaseEngine() {
  const [selectedCase, setSelectedCase] = useState<CaseDefinition | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const { initializeSimulation } = useStore();

  const handleStartCase = (caseData: CaseDefinition) => {
    setSelectedCase(caseData);
    setCurrentStep('intro');
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCompletedSteps([]);

    // Load the appropriate initial state
    initializeSimulation(presetStates[caseData.initialState]());
  };

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!selectedAnswer || !selectedCase) return;

    const step = selectedCase.steps[currentStep];
    const selectedOption = step.options?.find(opt => opt.id === selectedAnswer);

    if (selectedOption?.correct) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (selectedOption?.nextStep) {
      setCurrentStep(selectedOption.nextStep);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleBackToCases = () => {
    setSelectedCase(null);
    setCurrentStep('intro');
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCompletedSteps([]);
  };

  if (selectedCase) {
    const step = selectedCase.steps[currentStep];
    const isLastStep = currentStep === 'summary';

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{selectedCase.title}</h1>
            <div className="flex items-center space-x-3">
              <Badge>{selectedCase.difficulty}</Badge>
              <Badge variant="outline">{selectedCase.level}</Badge>
              <Badge variant="outline">Step {completedSteps.length + 1} of {selectedCase.stepOrder.length}</Badge>
            </div>
          </div>
          <Button variant="outline" onClick={handleBackToCases}>
            Back to Cases
          </Button>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 overflow-x-auto">
              {selectedCase.stepOrder.map((stepId, idx) => (
                <div key={stepId} className="flex items-center flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    completedSteps.includes(stepId) ? 'bg-green-500 text-white' :
                    stepId === currentStep ? 'bg-primary text-primary-foreground' :
                    'bg-secondary text-secondary-foreground'
                  }`}>
                    {completedSteps.includes(stepId) ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                  </div>
                  {idx < selectedCase.stepOrder.length - 1 && <div className="w-8 h-0.5 bg-border" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Case Content */}
        <Card>
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step.clinicalFindings && (
              <div>
                <h4 className="font-semibold mb-2">Clinical Findings:</h4>
                <ul className="space-y-1">
                  {step.clinicalFindings.map((finding, i) => (
                    <li key={i} className="text-sm flex items-start">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(step.vitalSigns || step.labValues) && (
              <div className="grid md:grid-cols-2 gap-4">
                {step.vitalSigns && (
                  <div>
                    <h4 className="font-semibold mb-2">Vital Signs:</h4>
                    <div className="space-y-1">
                      {Object.entries(step.vitalSigns).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm bg-secondary/30 p-2 rounded">
                          <span className="font-medium">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step.labValues && (
                  <div>
                    <h4 className="font-semibold mb-2">Lab Values:</h4>
                    <div className="space-y-1">
                      {Object.entries(step.labValues).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm bg-secondary/30 p-2 rounded">
                          <span className="font-medium">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step.question && step.options && !isLastStep && (
              <div className="space-y-4 mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                  {step.question}
                </h4>
                <div className="space-y-3">
                  {step.options.map((option) => {
                    const isSelected = selectedAnswer === option.id;
                    const showResult = showFeedback;

                    return (
                      <button
                        key={option.id}
                        onClick={() => !showFeedback && handleAnswerSelect(option.id)}
                        disabled={showFeedback}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          showResult
                            ? option.correct
                              ? 'border-green-500 bg-green-500/10'
                              : isSelected
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-border bg-background opacity-60'
                            : isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {showResult && option.correct && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                            {!showResult && (
                              <div className={`h-5 w-5 rounded-full border-2 ${
                                isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                              }`} />
                            )}
                          </div>
                          <span className="flex-1">{option.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showFeedback && selectedAnswer && (
                  <Card className={`${
                    step.options.find(opt => opt.id === selectedAnswer)?.correct
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-yellow-500/10 border-yellow-500/20'
                  }`}>
                    <CardContent className="pt-6">
                      <p className="text-sm">
                        {step.options.find(opt => opt.id === selectedAnswer)?.feedback}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {showFeedback && (
                  <Button onClick={handleNext} className="w-full" size="lg">
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            )}

            {isLastStep && (
              <div className="mt-6 pt-6 border-t border-border space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Case Completed!</h4>
                  <p className="text-sm">
                    You've successfully navigated through this case, demonstrating understanding of the pathophysiology and clinical decision-making.
                  </p>
                </div>
                <Button onClick={handleBackToCases} variant="outline" className="w-full" size="lg">
                  Back to Case Library
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Interactive Case Engine</h1>
        <p className="text-muted-foreground">
          Practice with branching clinical scenarios and make real-time decisions
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="font-semibold">5 Complete Interactive Cases:</p>
            <p className="text-xs">
              Each case progresses through decision points where you make clinical choices. You'll receive immediate feedback based on evidence-based guidelines. Cases range from Basic (MS4/Intern) to Advanced (Fellow/Attending) difficulty.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {allCases.map((caseData) => (
          <Card key={caseData.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <FileText className="h-8 w-8 text-primary" />
                <Badge variant={caseData.difficulty === 'Advanced' ? 'default' : caseData.difficulty === 'Intermediate' ? 'secondary' : 'outline'}>
                  {caseData.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl">{caseData.title}</CardTitle>
              <CardDescription>{caseData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Target Level:</span>
                  <span className="font-medium">{caseData.level}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{caseData.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Steps:</span>
                  <span className="font-medium">{caseData.stepOrder.length}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Learning Objectives:</h4>
                <ul className="space-y-1">
                  {caseData.objectives.slice(0, 2).map((obj, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start">
                      <span className="mr-2">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                  {caseData.objectives.length > 2 && (
                    <li className="text-xs text-muted-foreground">
                      + {caseData.objectives.length - 2} more objectives
                    </li>
                  )}
                </ul>
              </div>

              <Button className="w-full" onClick={() => handleStartCase(caseData)}>
                Start Interactive Case
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
