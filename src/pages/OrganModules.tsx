import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Wind, Droplets, Activity, Brain } from 'lucide-react';

const modules = [
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  }
];

export default function OrganModules() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Organ System Modules</h1>
        <p className="text-muted-foreground">
          Deep dive into individual organ systems and their failure mechanisms
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-8 w-8 ${module.color}`} />
                    <div>
                      <CardTitle>{module.title}</CardTitle>
                      <CardDescription>{module.topics.length} key topics</CardDescription>
                    </div>
                  </div>
                  <Badge>Essential</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="pt-4 border-t border-border">
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Integrated Learning */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Organ Interactions</CardTitle>
          <CardDescription>How these systems affect each other</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold mb-2">Lungs ↔ Kidneys</h4>
              <p className="text-sm text-muted-foreground">
                Hypoxemia from lung failure decreases renal perfusion, triggering AKI.
                Conversely, fluid overload from renal failure worsens pulmonary edema.
              </p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold mb-2">Heart ↔ Kidneys</h4>
              <p className="text-sm text-muted-foreground">
                Low cardiac output causes prerenal AKI. Fluid retention from AKI increases cardiac preload,
                potentially worsening heart failure.
              </p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold mb-2">Coagulation ↔ All Organs</h4>
              <p className="text-sm text-muted-foreground">
                Microthrombi from DIC impair microcirculation in every organ, creating a vicious cycle
                of ischemia and further organ injury.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
