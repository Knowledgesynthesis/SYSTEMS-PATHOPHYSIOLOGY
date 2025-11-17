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

const septicShockCase: Record<string, CaseStep> = {
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
};

export default function CaseEngine() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const { initializeSimulation } = useStore();

  const handleStartCase = (caseId: string) => {
    setSelectedCase(caseId);
    setCurrentStep('intro');
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCompletedSteps([]);

    // Load the early sepsis state for the case
    initializeSimulation(presetStates.earlySepsis());
  };

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!selectedAnswer || !selectedCase) return;

    const step = septicShockCase[currentStep];
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
    const step = septicShockCase[currentStep];
    const isLastStep = currentStep === 'summary';

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Septic Shock with Multi-Organ Dysfunction</h1>
            <div className="flex items-center space-x-3">
              <Badge>Intermediate</Badge>
              <Badge variant="outline">Resident</Badge>
              <Badge variant="outline">Step {completedSteps.length + 1} of 6</Badge>
            </div>
          </div>
          <Button variant="outline" onClick={handleBackToCases}>
            Back to Cases
          </Button>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              {['intro', 'initial_management', 'progression_6h', 'icu_management', 'multiorgan_failure', 'summary'].map((stepId, idx) => (
                <div key={stepId} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    completedSteps.includes(stepId) ? 'bg-green-500 text-white' :
                    stepId === currentStep ? 'bg-primary text-primary-foreground' :
                    'bg-secondary text-secondary-foreground'
                  }`}>
                    {completedSteps.includes(stepId) ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                  </div>
                  {idx < 5 && <div className="w-8 h-0.5 bg-border" />}
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
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
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
                    You've successfully navigated through the sepsis → ARDS → AKI → DIC cascade, demonstrating understanding of multi-organ failure propagation.
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
            <p className="font-semibold">Interactive Learning:</p>
            <p className="text-xs">
              Each case progresses through decision points where you make clinical choices. You'll receive immediate feedback and see how organ failures cascade over time. Cases are based on real ICU scenarios with physiologically accurate progression.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <FileText className="h-8 w-8 text-primary" />
              <Badge>Intermediate</Badge>
            </div>
            <CardTitle className="text-xl">Septic Shock → Multi-Organ Failure</CardTitle>
            <CardDescription>
              55-year-old with pneumonia progressing to septic shock, ARDS, AKI, and DIC. Make critical decisions at each stage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Target Level:</span>
                <span className="font-medium">Resident / Fellow</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">15-20 minutes</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Learning Objectives:</h4>
              <ul className="space-y-1">
                <li className="text-xs text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  <span>Recognize and manage septic shock</span>
                </li>
                <li className="text-xs text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  <span>Understand ARDS development and criteria</span>
                </li>
                <li className="text-xs text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  <span>Identify AKI stages and patterns</span>
                </li>
                <li className="text-xs text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  <span>Diagnose DIC using ISTH criteria</span>
                </li>
              </ul>
            </div>

            <Button className="w-full" onClick={() => handleStartCase('septic-shock')}>
              Start Interactive Case
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <Badge variant="outline">Coming Soon</Badge>
            </div>
            <CardTitle className="text-xl">Cardiogenic Shock → Hepatorenal Syndrome</CardTitle>
            <CardDescription>
              Acute MI with cardiogenic shock leading to liver congestion and renal failure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Additional cases coming in future updates</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
