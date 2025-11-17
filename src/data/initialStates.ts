/**
 * Initial Physiological States for Simulations
 * These represent starting points for various clinical scenarios
 */

import {
  PhysiologicalState,
  OrganSystem,
  ShockType,
  OrganSeverity,
  RespiratoryState,
  RenalState,
  CardiacState,
  HepaticState,
  CoagulationState
} from '@/types';

/**
 * Normal baseline physiological state
 */
export function getInitialPhysiologicalState(): PhysiologicalState {
  return {
    timestamp: 0,
    organs: {
      [OrganSystem.LUNGS]: {
        id: OrganSystem.LUNGS,
        name: 'Respiratory System',
        severity: 0 as OrganSeverity,
        parameters: {
          paO2: 95,
          paCO2: 40,
          fiO2: 21,
          peep: 5,
          compliance: 50,
          shuntFraction: 5,
          vqMismatch: 0,
          alveolarFluid: 0
        },
        description: 'Normal respiratory function',
        clinicalSigns: ['Clear breath sounds', 'Normal work of breathing'],
        compensation: {
          active: false,
          mechanisms: []
        }
      } as RespiratoryState,
      [OrganSystem.KIDNEYS]: {
        id: OrganSystem.KIDNEYS,
        name: 'Renal System',
        severity: 0 as OrganSeverity,
        parameters: {
          creatinine: 1.0,
          bun: 15,
          urineOutput: 60,
          gfr: 100,
          sodiumExcretion: 140,
          atnSeverity: 0,
          tubularDamage: 0
        },
        description: 'Normal renal function',
        clinicalSigns: ['Adequate urine output', 'Normal electrolytes'],
        compensation: {
          active: false,
          mechanisms: []
        }
      } as RenalState,
      [OrganSystem.HEART]: {
        id: OrganSystem.HEART,
        name: 'Cardiovascular System',
        severity: 0 as OrganSeverity,
        parameters: {
          heartRate: 75,
          map: 85,
          svr: 1000,
          cardiacOutput: 5.0,
          cardiacIndex: 2.8,
          cvp: 8,
          ejectionFraction: 60,
          myocardialDepression: 0
        },
        description: 'Normal cardiac function',
        clinicalSigns: ['Regular rhythm', 'Normal perfusion'],
        compensation: {
          active: false,
          mechanisms: []
        }
      } as CardiacState,
      [OrganSystem.LIVER]: {
        id: OrganSystem.LIVER,
        name: 'Hepatic System',
        severity: 0 as OrganSeverity,
        parameters: {
          bilirubin: 0.8,
          alt: 25,
          ast: 30,
          albumin: 4.0,
          inr: 1.0,
          lactate: 1.2,
          ammonia: 30,
          syntheticFunction: 10
        },
        description: 'Normal hepatic function',
        clinicalSigns: ['Normal liver enzymes', 'Normal synthetic function'],
        compensation: {
          active: false,
          mechanisms: []
        }
      } as HepaticState,
      [OrganSystem.COAGULATION]: {
        id: OrganSystem.COAGULATION,
        name: 'Coagulation System',
        severity: 0 as OrganSeverity,
        parameters: {
          platelets: 250,
          inr: 1.0,
          ptt: 30,
          fibrinogen: 300,
          dDimer: 200,
          microthrombi: 0,
          endothelialInjury: 0,
          dicScore: 0
        },
        description: 'Normal coagulation',
        clinicalSigns: ['Normal platelet count', 'Normal coagulation studies'],
        compensation: {
          active: false,
          mechanisms: []
        }
      } as CoagulationState
    },
    systemicParameters: {
      temperature: 37.0,
      lactate: 1.2,
      pH: 7.40,
      baseExcess: 0,
      glucose: 100,
      cytokineLevels: 0,
      inflammation: 0,
      perfusionStatus: 10
    },
    shockType: ShockType.NONE,
    timeline: [
      {
        time: 0,
        event: 'Baseline normal physiology'
      }
    ]
  };
}

/**
 * Early sepsis state - beginning of systemic inflammation
 */
export function getEarlySepsisState(): PhysiologicalState {
  const state = getInitialPhysiologicalState();

  // Modify for early sepsis
  state.shockType = ShockType.SEPTIC;

  // Cardiovascular changes
  state.organs[OrganSystem.HEART].severity = 1 as OrganSeverity;
  state.organs[OrganSystem.HEART].parameters.heartRate = 110;
  state.organs[OrganSystem.HEART].parameters.map = 72;
  state.organs[OrganSystem.HEART].parameters.svr = 700;
  state.organs[OrganSystem.HEART].parameters.cardiacOutput = 6.5;
  state.organs[OrganSystem.HEART].clinicalSigns = ['Tachycardia', 'Warm extremities', 'Hyperdynamic'];

  // Respiratory changes
  state.organs[OrganSystem.LUNGS].parameters.paO2 = 85;
  state.organs[OrganSystem.LUNGS].parameters.fiO2 = 30;

  // Systemic inflammation
  state.systemicParameters.temperature = 38.5;
  state.systemicParameters.lactate = 2.5;
  state.systemicParameters.cytokineLevels = 4;
  state.systemicParameters.inflammation = 3;

  // Timeline
  state.timeline = [
    {
      time: 0,
      event: 'Patient develops fever and tachycardia',
      severity: 1 as OrganSeverity
    },
    {
      time: 2,
      event: 'Blood cultures sent, empiric antibiotics started',
      intervention: 'Broad-spectrum antibiotics'
    }
  ];

  return state;
}

/**
 * Advanced sepsis with ARDS and early AKI
 */
export function getAdvancedSepsisState(): PhysiologicalState {
  const state = getEarlySepsisState();
  state.timestamp = 24;

  // ARDS development
  state.organs[OrganSystem.LUNGS].severity = 3 as OrganSeverity;
  state.organs[OrganSystem.LUNGS].parameters.paO2 = 65;
  state.organs[OrganSystem.LUNGS].parameters.fiO2 = 60;
  state.organs[OrganSystem.LUNGS].parameters.peep = 12;
  state.organs[OrganSystem.LUNGS].parameters.compliance = 30;
  state.organs[OrganSystem.LUNGS].parameters.shuntFraction = 25;
  state.organs[OrganSystem.LUNGS].parameters.alveolarFluid = 6;
  state.organs[OrganSystem.LUNGS].clinicalSigns = [
    'Bilateral infiltrates',
    'Severe hypoxemia',
    'Decreased compliance'
  ];

  // AKI Stage 2
  state.organs[OrganSystem.KIDNEYS].severity = 2 as OrganSeverity;
  state.organs[OrganSystem.KIDNEYS].parameters.creatinine = 2.5;
  state.organs[OrganSystem.KIDNEYS].parameters.bun = 45;
  state.organs[OrganSystem.KIDNEYS].parameters.urineOutput = 25;
  state.organs[OrganSystem.KIDNEYS].parameters.gfr = 40;
  state.organs[OrganSystem.KIDNEYS].parameters.atnSeverity = 5;
  state.organs[OrganSystem.KIDNEYS].clinicalSigns = ['Oliguria', 'Rising creatinine'];

  // Cardiovascular worsening
  state.organs[OrganSystem.HEART].severity = 2 as OrganSeverity;
  state.organs[OrganSystem.HEART].parameters.map = 58;
  state.organs[OrganSystem.HEART].parameters.cardiacIndex = 2.0;
  state.organs[OrganSystem.HEART].parameters.myocardialDepression = 4;

  // Early DIC
  state.organs[OrganSystem.COAGULATION].severity = 2 as OrganSeverity;
  state.organs[OrganSystem.COAGULATION].parameters.platelets = 100;
  state.organs[OrganSystem.COAGULATION].parameters.inr = 1.6;
  state.organs[OrganSystem.COAGULATION].parameters.fibrinogen = 180;
  state.organs[OrganSystem.COAGULATION].parameters.dDimer = 1500;
  state.organs[OrganSystem.COAGULATION].parameters.dicScore = 5;

  // Systemic worsening
  state.systemicParameters.lactate = 4.5;
  state.systemicParameters.pH = 7.28;
  state.systemicParameters.inflammation = 7;
  state.systemicParameters.perfusionStatus = 4;

  // Timeline updates
  state.timeline.push(
    {
      time: 12,
      event: 'ARDS criteria met (PaO₂/FiO₂ = 108)',
      organAffected: OrganSystem.LUNGS,
      severity: 3 as OrganSeverity
    },
    {
      time: 18,
      event: 'AKI Stage 2 (Creatinine 2.5× baseline)',
      organAffected: OrganSystem.KIDNEYS,
      severity: 2 as OrganSeverity
    },
    {
      time: 24,
      event: 'DIC pattern developing',
      organAffected: OrganSystem.COAGULATION,
      severity: 2 as OrganSeverity
    }
  );

  return state;
}

/**
 * Cardiogenic shock state
 */
export function getCardiogenicShockState(): PhysiologicalState {
  const state = getInitialPhysiologicalState();
  state.shockType = ShockType.CARDIOGENIC;

  // Severe cardiac dysfunction
  state.organs[OrganSystem.HEART].severity = 4 as OrganSeverity;
  state.organs[OrganSystem.HEART].parameters.heartRate = 120;
  state.organs[OrganSystem.HEART].parameters.map = 55;
  state.organs[OrganSystem.HEART].parameters.cardiacOutput = 2.5;
  state.organs[OrganSystem.HEART].parameters.cardiacIndex = 1.4;
  state.organs[OrganSystem.HEART].parameters.cvp = 18;
  state.organs[OrganSystem.HEART].parameters.ejectionFraction = 25;
  state.organs[OrganSystem.HEART].clinicalSigns = [
    'Severe hypotension',
    'Pulmonary edema',
    'Cool extremities'
  ];

  // Pulmonary edema
  state.organs[OrganSystem.LUNGS].severity = 2 as OrganSeverity;
  state.organs[OrganSystem.LUNGS].parameters.paO2 = 70;
  state.organs[OrganSystem.LUNGS].parameters.alveolarFluid = 7;
  state.organs[OrganSystem.LUNGS].parameters.compliance = 35;

  // Prerenal AKI
  state.organs[OrganSystem.KIDNEYS].severity = 2 as OrganSeverity;
  state.organs[OrganSystem.KIDNEYS].parameters.creatinine = 2.0;
  state.organs[OrganSystem.KIDNEYS].parameters.urineOutput = 20;
  state.organs[OrganSystem.KIDNEYS].parameters.gfr = 35;

  // Hepatic congestion
  state.organs[OrganSystem.LIVER].severity = 1 as OrganSeverity;
  state.organs[OrganSystem.LIVER].parameters.alt = 150;
  state.organs[OrganSystem.LIVER].parameters.ast = 180;
  state.organs[OrganSystem.LIVER].parameters.bilirubin = 2.5;

  // Systemic hypoperfusion
  state.systemicParameters.lactate = 5.5;
  state.systemicParameters.perfusionStatus = 2;

  state.timeline = [
    {
      time: 0,
      event: 'Acute MI with cardiogenic shock',
      organAffected: OrganSystem.HEART,
      severity: 4 as OrganSeverity
    }
  ];

  return state;
}

// Export all preset states
export const presetStates = {
  normal: getInitialPhysiologicalState,
  earlySepsis: getEarlySepsisState,
  advancedSepsis: getAdvancedSepsisState,
  cardiogenicShock: getCardiogenicShockState
};
