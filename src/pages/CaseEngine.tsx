import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

const cases = [
  {
    id: 'case-1',
    title: 'Septic Shock with Multi-Organ Dysfunction',
    difficulty: 'Intermediate',
    learningLevel: 'Resident',
    duration: '15-20 min',
    description: '55-year-old with pneumonia progressing to septic shock, ARDS, and AKI',
    objectives: [
      'Recognize early sepsis signs',
      'Understand progression to ARDS',
      'Anticipate AKI development',
      'Manage fluid resuscitation'
    ],
    scenario: 'A 55-year-old man presents to the ED with 3 days of cough, fever, and shortness of breath...'
  },
  {
    id: 'case-2',
    title: 'Cardiogenic Shock Post-MI',
    difficulty: 'Advanced',
    learningLevel: 'Fellow',
    duration: '20-25 min',
    description: 'Acute MI complicated by cardiogenic shock, hepatic congestion, and renal failure',
    objectives: [
      'Differentiate shock types',
      'Understand cardiorenal syndrome',
      'Recognize hepatic congestion',
      'Balance hemodynamics'
    ],
    scenario: 'A 68-year-old woman with chest pain for 2 hours arrives via EMS...'
  },
  {
    id: 'case-3',
    title: 'DIC in Severe Sepsis',
    difficulty: 'Advanced',
    learningLevel: 'Fellow',
    duration: '15-20 min',
    description: 'Progression from sepsis to DIC with bleeding and thrombosis',
    objectives: [
      'Recognize DIC criteria',
      'Understand coagulation cascade',
      'Manage bleeding vs clotting',
      'Calculate ISTH DIC score'
    ],
    scenario: 'A 42-year-old with abdominal sepsis now showing petechiae and oozing from IV sites...'
  },
  {
    id: 'case-4',
    title: 'ARDS Management',
    difficulty: 'Intermediate',
    learningLevel: 'Resident',
    duration: '10-15 min',
    description: 'Ventilator management in severe ARDS from pneumonia',
    objectives: [
      'Apply ARDSNet protocol',
      'Optimize PEEP strategy',
      'Understand prone positioning',
      'Monitor lung compliance'
    ],
    scenario: 'Day 3 of ICU admission for pneumonia. PaO₂/FiO₂ ratio is 85...'
  }
];

export default function CaseEngine() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const handleStartCase = (caseId: string) => {
    setSelectedCase(caseId);
    setStarted(true);
  };

  if (started && selectedCase) {
    const caseData = cases.find(c => c.id === selectedCase);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{caseData?.title}</h1>
            <div className="flex items-center space-x-3">
              <Badge>{caseData?.difficulty}</Badge>
              <Badge variant="outline">{caseData?.learningLevel}</Badge>
              <Badge variant="outline">{caseData?.duration}</Badge>
            </div>
          </div>
          <Button variant="outline" onClick={() => setStarted(false)}>
            Back to Cases
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Case Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{caseData?.scenario}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {caseData?.objectives.map((obj, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg font-medium">This case is interactive and branching</p>
              <p className="text-sm text-muted-foreground">
                In the full version, you would make clinical decisions at key branch points,
                and the simulation would update based on your choices. Each decision affects
                the patient's organ systems in real-time.
              </p>
              <Button size="lg" className="mt-4">
                Start Interactive Case
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Case Engine</h1>
        <p className="text-muted-foreground">
          Practice with branching clinical scenarios and make real-time decisions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {cases.map((caseData) => (
          <Card key={caseData.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex gap-2">
                  <Badge variant={caseData.difficulty === 'Advanced' ? 'default' : 'secondary'}>
                    {caseData.difficulty}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-xl">{caseData.title}</CardTitle>
              <CardDescription>{caseData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Target Level:</span>
                  <span className="font-medium">{caseData.learningLevel}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{caseData.duration}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Learning Objectives</h4>
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

              <Button className="w-full" onClick={() => handleStartCase(caseData.id)}>
                Start Case
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
