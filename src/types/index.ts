/**
 * Core TypeScript Types and Schemas for Systems Pathophysiology Simulator
 * These types define the structure for organ states, physiological parameters,
 * and simulation data throughout the application.
 */

// Organ failure severity levels (0 = normal, 5 = critical failure)
export type OrganSeverity = 0 | 1 | 2 | 3 | 4 | 5;

// Types of shock
export enum ShockType {
  NONE = 'none',
  SEPTIC = 'septic',
  HYPOVOLEMIC = 'hypovolemic',
  CARDIOGENIC = 'cardiogenic',
  OBSTRUCTIVE = 'obstructive',
  DISTRIBUTIVE = 'distributive'
}

// Organ system identifiers
export enum OrganSystem {
  LUNGS = 'lungs',
  KIDNEYS = 'kidneys',
  HEART = 'heart',
  LIVER = 'liver',
  BRAIN = 'brain',
  COAGULATION = 'coagulation',
  GI = 'gi',
  ENDOCRINE = 'endocrine'
}

// Individual organ state
export interface OrganState {
  id: OrganSystem;
  name: string;
  severity: OrganSeverity;
  parameters: Record<string, number>;
  description: string;
  clinicalSigns: string[];
  compensation: {
    active: boolean;
    mechanisms: string[];
  };
}

// Respiratory system parameters
export interface RespiratoryState extends OrganState {
  id: OrganSystem.LUNGS;
  parameters: {
    paO2: number;           // mmHg
    paCO2: number;          // mmHg
    fiO2: number;           // %
    peep: number;           // cmH2O
    compliance: number;     // mL/cmH2O
    shuntFraction: number;  // %
    vqMismatch: number;     // 0-10 scale
    alveolarFluid: number;  // 0-10 scale
  };
}

// Renal system parameters
export interface RenalState extends OrganState {
  id: OrganSystem.KIDNEYS;
  parameters: {
    creatinine: number;     // mg/dL
    bun: number;            // mg/dL
    urineOutput: number;    // mL/hr
    gfr: number;            // mL/min
    sodiumExcretion: number;// mEq/L
    atnSeverity: number;    // 0-10 scale
    tubularDamage: number;  // 0-10 scale
  };
}

// Cardiac system parameters
export interface CardiacState extends OrganState {
  id: OrganSystem.HEART;
  parameters: {
    heartRate: number;           // bpm
    map: number;                 // mmHg
    svr: number;                 // dynes·sec/cm5
    cardiacOutput: number;       // L/min
    cardiacIndex: number;        // L/min/m²
    cvp: number;                 // mmHg
    ejectionFraction: number;    // %
    myocardialDepression: number;// 0-10 scale
  };
}

// Hepatic system parameters
export interface HepaticState extends OrganState {
  id: OrganSystem.LIVER;
  parameters: {
    bilirubin: number;      // mg/dL
    alt: number;            // U/L
    ast: number;            // U/L
    albumin: number;        // g/dL
    inr: number;            // ratio
    lactate: number;        // mmol/L
    ammonia: number;        // μg/dL
    syntheticFunction: number; // 0-10 scale
  };
}

// Coagulation system parameters
export interface CoagulationState extends OrganState {
  id: OrganSystem.COAGULATION;
  parameters: {
    platelets: number;      // ×10³/μL
    inr: number;            // ratio
    ptt: number;            // seconds
    fibrinogen: number;     // mg/dL
    dDimer: number;         // ng/mL
    microthrombi: number;   // 0-10 scale
    endothelialInjury: number; // 0-10 scale
    dicScore: number;       // 0-8 ISTH score
  };
}

// Complete physiological state
export interface PhysiologicalState {
  timestamp: number;
  organs: {
    [OrganSystem.LUNGS]: RespiratoryState;
    [OrganSystem.KIDNEYS]: RenalState;
    [OrganSystem.HEART]: CardiacState;
    [OrganSystem.LIVER]: HepaticState;
    [OrganSystem.COAGULATION]: CoagulationState;
  };
  systemicParameters: {
    temperature: number;        // °C
    lactate: number;            // mmol/L
    pH: number;                 // 7.0-7.6
    baseExcess: number;         // mmol/L
    glucose: number;            // mg/dL
    cytokineLevels: number;     // 0-10 scale
    inflammation: number;       // 0-10 scale
    perfusionStatus: number;    // 0-10 scale
  };
  shockType: ShockType;
  timeline: TimelineEvent[];
}

// Timeline event
export interface TimelineEvent {
  time: number;                 // hours from onset
  event: string;
  organAffected?: OrganSystem;
  severity?: OrganSeverity;
  intervention?: string;
}

// Propagation relationship between organs
export interface OrganPropagation {
  source: OrganSystem;
  target: OrganSystem;
  mechanism: string;
  strength: number;             // 0-1 scale
  delay: number;                // hours
  active: boolean;
}

// Case scenario
export interface CaseScenario {
  id: string;
  title: string;
  description: string;
  initialTrigger: string;
  targetLearningLevel: 'MS2' | 'MS3' | 'MS4' | 'Resident' | 'Fellow' | 'Attending';
  initialState: PhysiologicalState;
  branchingPoints: BranchingPoint[];
  learningObjectives: string[];
  references: string[];
}

// Branching decision point
export interface BranchingPoint {
  time: number;
  question: string;
  options: {
    id: string;
    text: string;
    consequence: Partial<PhysiologicalState>;
    feedback: string;
    correct?: boolean;
  }[];
}

// Assessment question
export interface AssessmentQuestion {
  id: string;
  type: 'mcq' | 'sequence' | 'prediction' | 'interpretation';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  rationale: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
  relatedOrgans: OrganSystem[];
}

// Module content structure
export interface Module {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  learningObjectives: string[];
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  content: {
    concepts: Concept[];
    interactives: Interactive[];
    assessments: AssessmentQuestion[];
  };
  estimatedTime: number; // minutes
}

// Learning concept
export interface Concept {
  id: string;
  title: string;
  content: string;
  diagrams?: string[];
  keyPoints: string[];
}

// Interactive element
export interface Interactive {
  id: string;
  type: 'propagation-graph' | 'timeline' | 'simulation' | 'matrix' | 'case';
  title: string;
  description: string;
  defaultState?: Partial<PhysiologicalState>;
}

// User progress tracking
export interface UserProgress {
  userId: string;
  completedModules: string[];
  assessmentScores: Record<string, number>;
  timeSpent: Record<string, number>; // minutes per module
  casesCompleted: string[];
  lastAccessed: number; // timestamp
}
