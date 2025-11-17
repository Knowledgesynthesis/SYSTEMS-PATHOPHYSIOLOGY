# **SYSTEMS PATHOPHYSIOLOGY — OPTIMIZED MASTER PROMPT FOR EDUCATIONAL APP GENERATION**  
A clinically rigorous, physiology-consistent master prompt for generating a **mobile-first, offline-capable, dark-mode educational app** that teaches trainees how *organ failures evolve and propagate across systems*. From sepsis → ARDS → AKI → DIC, and many other cascades, the app simulates the underlying **mechanisms, feedback loops, compensations, decompensations, and multi-organ interactions** in a way that is visually intuitive and clinically high-yield.

---

# **MASTER PROMPT — Systems Pathophysiology Educational App Generator (SPECIALIZED VERSION)**

## **Role & Mission**
You are a cross-functional team (PM + Staff Engineer + Senior Instructional Designer + Intensivist SME + Pathophysiology SME + Hematology/Coagulation SME + Cardiorenal Specialist + UX Writer + QA).  
Your mission: design an **interactive organ-failure progression simulator** that teaches:

**Systems Pathophysiology: Organ Failure Progression Simulator**  
—A dynamic, cross-organ reasoning environment where learners explore how dysfunction in one system cascades into others through molecular, physiological, and immunologic pathways.

This app must:
- Support **all learner levels:** MS2 → MS4 → residents → fellows → attending clinicians  
- Cover **all major organ-failure chains**, including sepsis, ARDS, AKI, cardiogenic shock, hepatic failure, endocrine crises, thrombotic microangiopathy, and coagulation failure  
- Use *synthetic physiologic values only*, never real patient data  
- Include **interactive causal maps**, **flow diagrams**, **timeline-based progression**, **simulation sliders**, and **case-based branching**  
- Be **mobile-first, offline-ready**, with a **dark-mode-first design**  
- Maintain *internal physiological consistency* with no contradictions between organ systems

---

## **Inputs (Fill These)**
- **Primary Topic(s):**  
  Always centered on **interconnected organ failure pathways**, including:  
  - Sepsis & systemic inflammation  
  - Microcirculation failure & shock  
  - Respiratory failure (ARDS, hypoxemia, V/Q mismatch)  
  - Renal failure (AKI patterns, prerenal→intrinsic transitions)  
  - Hepatic dysfunction  
  - Coagulation cascades (DIC, TMA patterns)  
  - Cardiovascular failure  
  - Endocrine modulation (stress response, adrenal crisis)  
  - Metabolic dysfunction (lactate dynamics, acidosis)  
  - Immune dysregulation  
  - Timeline-based deterioration  
  - Compensatory vs decompensatory physiology  
  - Feedback loops (positive & negative)  
  - Multi-organ recovery pathways  
- **Target Learner Levels:** {{LEVELS}}  
- **Learner Context:** {{CONTEXT}}  
  - e.g., “ICU rounds reasoning, exam prep, board review, night-float decision thinking”
- **Learning Outcomes (SMART + Bloom):** {{LEARNING_OBJECTIVES}}  
  - e.g., “Trace how sepsis leads to ARDS; explain AKI development; predict how organ failure accelerates DIC; understand systemic feedback loops”
- **Constraints/Preferences:**  
  Always include:  
  - *Mobile-first; dark mode; offline-ready; synthetic physiology; clinically correct pathways*  
- **References/Standards:** {{REFERENCES}}  
  - e.g., “Marino, Hall’s Physiology, Surviving Sepsis, ARDSNet, KDIGO, ISTH DIC guidelines”
- **Brand/Voice:** {{VOICE_TONE}}  
- **Localization:** {{LOCALE}}

---

# **Required Deliverables (Produce All)**

---

## **1. Executive Summary**
- Explain why understanding organ-failure propagation is difficult.  
- Introduce Systems Pathophysiology as the **Integrated Organ Failure Simulator + Mechanistic Map Engine**.  
- Provide 2–3 alternate names + value propositions.

---

## **2. Learner Personas & Use Cases**
Examples:
- ICU resident understanding multi-organ failure  
- ED trainee anticipating organ trajectories  
- Medical student learning system interdependence  
- Fellow analyzing shock progression  
Use cases: rapid reasoning practice, pre-rounds review, exam prep, physiology simulation.

---

## **3. Curriculum Map & Knowledge Graph**
Mapping must reflect:
**Trigger → Local response → Systemic response → Organ-specific injury → Multi-organ propagation → Terminal phase or recovery**

### **Prerequisites**
- Cellular injury pathways  
- Immune response (cytokines, complement)  
- Microcirculation  
- Organ-specific physiology  

### **Modules**

1. **Foundations of Systems Physiology**
   - Homeostasis  
   - Failure cascades  
   - Compensatory vs decompensatory responses  

2. **Trigger Events**
   - Sepsis  
   - Trauma  
   - Ischemia  
   - Toxin exposure  
   - Cardiogenic collapse  

3. **Systemic Host Response**
   - SIRS/sepsis cytokine storm  
   - Endothelial injury  
   - Microcirculatory collapse  
   - Coagulopathy activation  

4. **Organ-Specific Failure Models**
   - **Lungs:** ARDS, hypoxemia, stiff lungs, V/Q mismatch  
   - **Kidneys:** AKI—prerenal, ATN, rhabdomyolysis-related  
   - **Liver:** cholestasis, synthetic dysfunction  
   - **Heart:** septic cardiomyopathy, demand ischemia  
   - **Brain:** delirium, encephalopathy  
   - **GI:** ileus, barrier breakdown  

5. **Coagulation & Hematologic Failure**
   - DIC  
   - TMA-like patterns  
   - Platelet consumption  
   - Microthrombi  

6. **Shock Pathways**
   - Septic  
   - Hypovolemic  
   - Cardiogenic  
   - Obstructive  
   - Profound microcirculation failure  

7. **Metabolic Failure**
   - Lactic acidosis  
   - Mitochondrial dysfunction  
   - Hypoglycemia/hyperglycemia in critical states  

8. **Integrated Organ Failure Progression Models**
   - Sepsis → ARDS → AKI → DIC  
   - Cardiogenic shock → liver congestion → AKI  
   - Massive transfusion → hypocalcemia → coagulopathy  
   - Pancreatitis → SIRS → ARDS → renal failure  

9. **Recovery Pathways & Resilience**
   - Organ cross-talk during recovery  
   - Renal recovery stages  
   - Pulmonary repair  
   - De-escalation of coagulation activation  

10. **Case Engine**
   - Timelines with branching  
   - Adjust parameters → predict organ failures  
   - Physiology updates in real time  

Each module: micro-concepts, prerequisites, Bloom levels.

---

## **4. Interactives (Systems Pathophysiology–Specific)**

### **Examples**

- **Organ-Failure Propagation Graph**
  - Drag nodes (lungs, kidneys, coag, cardiac)  
  - See directional arrows and feedback loops activate  

- **Sepsis → ARDS Timeline Simulator**
  - Adjust cytokine levels, infection source control timing  
  - Watch gas exchange & PaO₂/FiO₂ decline  

- **Hemodynamics vs Microcirculation Model**
  - Change MAP, SVR, volume → see microthrombi risk change  

- **AKI Development Engine**
  - Adjust perfusion, toxins, inflammation → predict ATN progression  

- **DIC Pathway Visualizer**
  - Increase endothelial injury → track fibrinogen, platelets, INR changes  

- **Organ Cross-Talk Dashboard**
  - Change ventilator settings → see effect on cardiac output → renal perfusion → urine output  

- **Shock Type Differentiation**
  - Synthetic case → choose shock → simulator shows organ cascade  

- **Full Multi-Organ Matrix**
  - One screen integrating:  
    - Ventilation  
    - Hemodynamics  
    - Renal indices  
    - Lactate  
    - Coagulation  
    - Perfusion  
  - All update after each learner action  

For each interactive:
- purpose  
- inputs/controls  
- outputs  
- visuals (nodes, curves, timelines, heatmaps)  
- preset clinical cases  
- physiology correctness guardrails

---

## **5. Assessment & Mastery**
Include:
- MCQs  
- Identify sequence of organ failures  
- Predict next deterioration step  
- Interpret multi-organ data patterns  
- Shock vs inflammatory cascade questions  
- Short answer applied pathophysiology  
Provide **10–20 items** with rationales.

---

## **6. Systems-Reasoning Framework**
Teach learners to:

1. Recognize the initiating trigger  
2. Understand local → systemic response escalation  
3. Identify earliest failing organ  
4. Map propagation to other organs  
5. Distinguish primary vs secondary organ dysfunction  
6. Anticipate complications (DIC, ARDS, AKI)  
7. Understand when compensations fail  
8. Predict recovery patterns  

Pitfalls:
- Assuming linear deterioration  
- Treating organs independently  
- Ignoring microcirculation  
- Confusing hypoxia vs hypoperfusion  
- Failing to recognize early coagulation activation

---

## **7. Accessibility & Safety**
- WCAG 2.2 AA  
- Synthetic data only  
- Physiologically conservative, evidence-based models  
- Educational use only  
- No real-time clinical decision support  

---

## **8. Tech Architecture (Mobile-First, Offline)**
- React/TypeScript  
- Tailwind + shadcn/ui  
- D3/Recharts for propagation graphs, heatmaps, timelines  
- Simulation engine in JS/TS  
- IndexedDB + Service Worker for offline mode  
- Zustand/Redux for state management  
- Physiology validation functions

---

## **9. Data Schemas (JSON)**
Schemas for:
- organ states (0–5 severity levels)  
- shock parameters  
- coagulation variables  
- renal indices  
- respiratory values  
- timelines  
- interconnected feedback rules  
- case templates  
Include sample JSON.

---

## **10. Screen Specs & Text Wireframes**
Screens:
- Home  
- Systems Foundations  
- Organ Modules (Lung/Kidney/Coag/Cardiac/etc.)  
- Organ-Failure Propagation Map  
- Timelines Simulator  
- Shock & Inflammation Module  
- Multi-Organ Matrix  
- Case Engine  
- Assessment Hub  
- Glossary  
- Settings  

Provide textual wireframes.

---

## **11. Copy & Content Kit**
Include:
- Microcopy (“Endothelial injury triggers microthrombi”)  
- Node-link diagrams  
- Organ-severity tables  
- Two full lessons + one integrated organ-failure case  

---

## **12. Analytics & A/B Plan**
UI-only:
- Node map styles  
- Organ-interaction visualization modes  
- Timeline presentation formats  

---

## **13. QA Checklist**
- Physiology rules validated  
- No contradictions (e.g., lungs affecting kidneys incorrectly)  
- Coagulation cascade accurate  
- Shock pathways consistent with evidence  
- States and propagation follow logical constraints  

---

## **14. Roadmap**
Prototype → Pilot → Organ Interaction Deep Dive → Advanced Recovery Modeling → Personalized Learning Tracks  
Include milestones, risks, acceptance criteria.

---

# **Style & Rigor Requirements**
- Physiology-first, clinically grounded  
- Interconnected systems emphasized  
- Internal consistency between organ interactions  
- Advanced but intuitive  
- Pathoma-like clarity for multi-organ failure  

---

# **Acceptance Criteria**
- Learner can trace organ-failure cascades accurately  
- All physiology is correct and interdependent  
- App reinforces a unified **Systems Pathophysiology Interaction Map**

---

# **Now Generate**
Using the inputs above, produce all deliverables in the required order.  
If any input is missing, make system-physiology–sound assumptions and label them as defaults.
