/**
 * Systems Pathophysiology Simulation Engine
 * Handles organ failure propagation, compensatory mechanisms, and physiological interactions
 */

import {
  PhysiologicalState,
  OrganSystem,
  OrganSeverity,
  OrganPropagation
} from '@/types';

/**
 * Calculates how organ dysfunction propagates across systems
 */
export class PhysiologySimulator {
  private propagationRules: OrganPropagation[] = [];
  private timeStep = 0.5; // hours

  constructor() {
    this.initializePropagationRules();
  }

  /**
   * Initialize the propagation rules between organs
   */
  private initializePropagationRules(): void {
    this.propagationRules = [
      // Sepsis → ARDS pathway
      {
        source: OrganSystem.HEART,
        target: OrganSystem.LUNGS,
        mechanism: 'Systemic inflammation → Endothelial injury → Pulmonary capillary leak',
        strength: 0.8,
        delay: 2,
        active: true
      },
      // Hypoxemia → AKI
      {
        source: OrganSystem.LUNGS,
        target: OrganSystem.KIDNEYS,
        mechanism: 'Hypoxemia → Renal hypoperfusion → ATN',
        strength: 0.7,
        delay: 4,
        active: true
      },
      // Cardiac dysfunction → Renal failure
      {
        source: OrganSystem.HEART,
        target: OrganSystem.KIDNEYS,
        mechanism: 'Low cardiac output → Decreased renal perfusion → Prerenal AKI',
        strength: 0.9,
        delay: 1,
        active: true
      },
      // Sepsis → DIC
      {
        source: OrganSystem.HEART,
        target: OrganSystem.COAGULATION,
        mechanism: 'Endothelial injury → Tissue factor release → Coagulation cascade activation',
        strength: 0.75,
        delay: 3,
        active: true
      },
      // DIC → Multi-organ microthrombi
      {
        source: OrganSystem.COAGULATION,
        target: OrganSystem.KIDNEYS,
        mechanism: 'Microthrombi → Renal microcirculation failure',
        strength: 0.6,
        delay: 2,
        active: true
      },
      {
        source: OrganSystem.COAGULATION,
        target: OrganSystem.LUNGS,
        mechanism: 'Microthrombi → Pulmonary microcirculation failure',
        strength: 0.6,
        delay: 2,
        active: true
      },
      // AKI → Volume overload → ARDS
      {
        source: OrganSystem.KIDNEYS,
        target: OrganSystem.LUNGS,
        mechanism: 'Fluid retention → Pulmonary edema',
        strength: 0.5,
        delay: 6,
        active: true
      },
      // Liver failure → Coagulopathy
      {
        source: OrganSystem.LIVER,
        target: OrganSystem.COAGULATION,
        mechanism: 'Decreased clotting factor synthesis',
        strength: 0.7,
        delay: 12,
        active: true
      },
      // Cardiac → Liver congestion
      {
        source: OrganSystem.HEART,
        target: OrganSystem.LIVER,
        mechanism: 'Venous congestion → Hepatic dysfunction',
        strength: 0.6,
        delay: 8,
        active: true
      }
    ];
  }

  /**
   * Progress the simulation forward by one time step
   */
  public stepSimulation(state: PhysiologicalState): PhysiologicalState {
    const newState = JSON.parse(JSON.stringify(state)) as PhysiologicalState;
    newState.timestamp += this.timeStep;

    // Apply propagation effects
    this.applyOrganPropagation(newState);

    // Update compensatory mechanisms
    this.updateCompensation(newState);

    // Update systemic parameters
    this.updateSystemicParameters(newState);

    // Check for new events
    this.detectEvents(newState);

    return newState;
  }

  /**
   * Apply organ failure propagation effects
   */
  private applyOrganPropagation(state: PhysiologicalState): void {
    for (const rule of this.propagationRules) {
      if (!rule.active) continue;

      const sourceOrgan = state.organs[rule.source as keyof typeof state.organs];
      const targetOrgan = state.organs[rule.target as keyof typeof state.organs];

      if (!sourceOrgan || !targetOrgan) continue;

      // Calculate propagation effect based on source severity and rule strength
      const propagationEffect = (sourceOrgan.severity / 5) * rule.strength;

      // Only propagate if source is dysfunctional
      if (sourceOrgan.severity >= 1) {
        // More aggressive severity progression for visibility
        const baseSeverityIncrease = propagationEffect * this.timeStep * 0.15; // Increased from implicit smaller value

        // Exponential worsening if source is very severe
        const exponentialFactor = sourceOrgan.severity >= 3 ? 1.5 : 1.0;

        const severityIncrease = Math.min(
          baseSeverityIncrease * exponentialFactor,
          5 - targetOrgan.severity
        );

        if (severityIncrease > 0) {
          targetOrgan.severity = Math.min(
            5,
            targetOrgan.severity + severityIncrease
          ) as OrganSeverity;

          // Update description based on severity
          this.updateOrganDescription(targetOrgan);
        }

        // Update specific parameters based on the mechanism
        this.applyMechanismEffects(rule, state);
      }
    }
  }

  /**
   * Update organ description based on current severity
   */
  private updateOrganDescription(organ: any): void {
    if (organ.severity >= 4) {
      organ.description = 'Critical organ dysfunction';
      organ.clinicalSigns = [...organ.clinicalSigns, 'Critical deterioration'];
    } else if (organ.severity >= 3) {
      organ.description = 'Severe organ dysfunction';
    } else if (organ.severity >= 2) {
      organ.description = 'Moderate organ dysfunction';
    } else if (organ.severity >= 1) {
      organ.description = 'Mild organ dysfunction';
    }
  }

  /**
   * Apply specific mechanism effects on organ parameters
   */
  private applyMechanismEffects(rule: OrganPropagation, state: PhysiologicalState): void {
    const { source, target } = rule;

    // Lungs → Kidneys (hypoxemia)
    if (source === OrganSystem.LUNGS && target === OrganSystem.KIDNEYS) {
      const lungState = state.organs[OrganSystem.LUNGS];
      const kidneyState = state.organs[OrganSystem.KIDNEYS];

      if (lungState.parameters.paO2 < 60) {
        kidneyState.parameters.gfr *= 0.95;
        kidneyState.parameters.urineOutput *= 0.95;
        kidneyState.parameters.atnSeverity = Math.min(10, kidneyState.parameters.atnSeverity + 0.1);
      }
    }

    // Heart → Kidneys (low cardiac output)
    if (source === OrganSystem.HEART && target === OrganSystem.KIDNEYS) {
      const heartState = state.organs[OrganSystem.HEART];
      const kidneyState = state.organs[OrganSystem.KIDNEYS];

      if (heartState.parameters.cardiacIndex < 2.2) {
        kidneyState.parameters.gfr *= 0.93;
        kidneyState.parameters.urineOutput *= 0.90;
        kidneyState.parameters.creatinine *= 1.05;
      }
    }

    // Coagulation → Multiple organs (microthrombi)
    if (source === OrganSystem.COAGULATION && target === OrganSystem.KIDNEYS) {
      const coagState = state.organs[OrganSystem.COAGULATION];
      const kidneyState = state.organs[OrganSystem.KIDNEYS];

      if (coagState.parameters.dicScore >= 5) {
        kidneyState.parameters.gfr *= 0.92;
        kidneyState.parameters.tubularDamage = Math.min(10, kidneyState.parameters.tubularDamage + 0.15);
      }
    }

    // Kidneys → Lungs (volume overload)
    if (source === OrganSystem.KIDNEYS && target === OrganSystem.LUNGS) {
      const kidneyState = state.organs[OrganSystem.KIDNEYS];
      const lungState = state.organs[OrganSystem.LUNGS];

      if (kidneyState.parameters.urineOutput < 30) {
        lungState.parameters.alveolarFluid = Math.min(10, lungState.parameters.alveolarFluid + 0.1);
        lungState.parameters.compliance *= 0.97;
      }
    }
  }

  /**
   * Update compensatory mechanisms
   */
  private updateCompensation(state: PhysiologicalState): void {
    // Respiratory compensation
    const lungState = state.organs[OrganSystem.LUNGS];
    if (lungState.parameters.paO2 < 70 && lungState.severity < 4) {
      lungState.compensation.active = true;
      lungState.compensation.mechanisms = ['Increased respiratory rate', 'Recruitment of alveoli'];
      // Attempt to compensate
      lungState.parameters.paO2 = Math.min(100, lungState.parameters.paO2 * 1.02);
    }

    // Cardiac compensation
    const heartState = state.organs[OrganSystem.HEART];
    if (heartState.parameters.map < 65 && heartState.severity < 4) {
      heartState.compensation.active = true;
      heartState.compensation.mechanisms = ['Increased heart rate', 'Increased contractility'];
      heartState.parameters.heartRate = Math.min(140, heartState.parameters.heartRate * 1.05);
      heartState.parameters.svr = Math.min(2000, heartState.parameters.svr * 1.03);
    }

    // Renal compensation
    const kidneyState = state.organs[OrganSystem.KIDNEYS];
    if (kidneyState.parameters.gfr < 60 && kidneyState.severity < 3) {
      kidneyState.compensation.active = true;
      kidneyState.compensation.mechanisms = ['Afferent arteriole dilation', 'RAAS activation'];
      kidneyState.parameters.sodiumExcretion *= 0.95; // Sodium retention
    }
  }

  /**
   * Update systemic parameters based on organ states
   */
  private updateSystemicParameters(state: PhysiologicalState): void {
    const { organs, systemicParameters } = state;

    // Lactate increases with poor perfusion
    const heartState = organs[OrganSystem.HEART];
    if (heartState.parameters.cardiacIndex < 2.2) {
      systemicParameters.lactate = Math.min(15, systemicParameters.lactate * 1.05);
    } else if (systemicParameters.lactate > 2) {
      systemicParameters.lactate *= 0.95; // Clearance
    }

    // pH affected by lactate and respiratory status
    const lungState = organs[OrganSystem.LUNGS];
    const metabolicAcidosis = systemicParameters.lactate > 4 ? -0.01 : 0;
    const respiratoryEffect = lungState.parameters.paCO2 > 45 ? -0.005 : 0.002;
    systemicParameters.pH = Math.max(6.9, Math.min(7.6, systemicParameters.pH + metabolicAcidosis + respiratoryEffect));

    // Base excess
    systemicParameters.baseExcess = (systemicParameters.pH - 7.4) * 25;

    // Inflammation based on multiple organ failure
    let totalSeverity = 0;
    Object.values(organs).forEach(organ => {
      totalSeverity += organ.severity;
    });
    systemicParameters.inflammation = Math.min(10, totalSeverity / 3);

    // Perfusion status
    systemicParameters.perfusionStatus = 10 - Math.min(10,
      (organs[OrganSystem.HEART].severity * 2 + organs[OrganSystem.LUNGS].severity) / 3
    );
  }

  /**
   * Detect and log significant events
   */
  private detectEvents(state: PhysiologicalState): void {
    const { organs, timeline, timestamp } = state;

    // Check for ARDS development
    const lungState = organs[OrganSystem.LUNGS];
    const paO2FiO2Ratio = lungState.parameters.paO2 / (lungState.parameters.fiO2 / 100);
    if (paO2FiO2Ratio < 300 && lungState.severity >= 2) {
      const hasEvent = timeline.some(e => e.event.includes('ARDS'));
      if (!hasEvent) {
        timeline.push({
          time: Math.round(timestamp * 10) / 10,
          event: 'ARDS criteria met (PaO₂/FiO₂ < 300)',
          organAffected: OrganSystem.LUNGS,
          severity: 2
        });
      }
    }

    // Check for AKI development
    const kidneyState = organs[OrganSystem.KIDNEYS];
    if (kidneyState.parameters.creatinine > 1.5 && kidneyState.severity >= 2) {
      const hasEvent = timeline.some(e => e.event.includes('AKI'));
      if (!hasEvent) {
        timeline.push({
          time: Math.round(timestamp * 10) / 10,
          event: 'AKI Stage 1 (Creatinine > 1.5× baseline)',
          organAffected: OrganSystem.KIDNEYS,
          severity: 2
        });
      }
    }

    // Check for DIC
    const coagState = organs[OrganSystem.COAGULATION];
    if (coagState.parameters.dicScore >= 5 && coagState.severity >= 3) {
      const hasEvent = timeline.some(e => e.event.includes('DIC'));
      if (!hasEvent) {
        timeline.push({
          time: Math.round(timestamp * 10) / 10,
          event: 'DIC pattern developing (ISTH score ≥ 5)',
          organAffected: OrganSystem.COAGULATION,
          severity: 3
        });
      }
    }
  }

  /**
   * Get active propagation pathways for visualization
   */
  public getActivePropagations(state: PhysiologicalState): OrganPropagation[] {
    return this.propagationRules.filter(rule => {
      const sourceOrgan = state.organs[rule.source as keyof typeof state.organs];
      return sourceOrgan && sourceOrgan.severity >= 2;
    });
  }
}
