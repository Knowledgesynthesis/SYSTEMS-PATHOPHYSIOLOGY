import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const glossaryTerms = [
  {
    term: 'ARDS (Acute Respiratory Distress Syndrome)',
    definition: 'A severe form of acute lung injury characterized by bilateral pulmonary infiltrates, hypoxemia (PaO₂/FiO₂ < 300), and respiratory failure not fully explained by cardiac failure.',
    category: 'Respiratory'
  },
  {
    term: 'AKI (Acute Kidney Injury)',
    definition: 'Rapid decline in kidney function defined by increases in serum creatinine, decreases in urine output, or both. Staged using KDIGO criteria.',
    category: 'Renal'
  },
  {
    term: 'DIC (Disseminated Intravascular Coagulation)',
    definition: 'A pathological activation of coagulation resulting in simultaneous thrombosis and bleeding. Characterized by consumption of platelets and clotting factors, with widespread microthrombi formation.',
    category: 'Coagulation'
  },
  {
    term: 'Septic Shock',
    definition: 'Subset of sepsis with circulatory and metabolic abnormalities associated with higher mortality. Defined by persistent hypotension requiring vasopressors and lactate > 2 mmol/L despite adequate fluid resuscitation.',
    category: 'Shock'
  },
  {
    term: 'ATN (Acute Tubular Necrosis)',
    definition: 'Kidney injury affecting the tubular epithelial cells, commonly caused by ischemia or nephrotoxins. A common cause of intrinsic AKI.',
    category: 'Renal'
  },
  {
    term: 'V/Q Mismatch',
    definition: 'Imbalance between ventilation (V) and perfusion (Q) in the lungs, leading to impaired gas exchange and hypoxemia.',
    category: 'Respiratory'
  },
  {
    term: 'Cardiac Index',
    definition: 'Cardiac output normalized to body surface area (L/min/m²). Normal range: 2.5-4.0 L/min/m². Values < 2.2 indicate shock.',
    category: 'Cardiovascular'
  },
  {
    term: 'MAP (Mean Arterial Pressure)',
    definition: 'Average arterial pressure during a single cardiac cycle. Calculated as: MAP = (SBP + 2×DBP)/3. Target ≥ 65 mmHg for adequate organ perfusion.',
    category: 'Cardiovascular'
  },
  {
    term: 'PEEP (Positive End-Expiratory Pressure)',
    definition: 'Pressure in the lungs at the end of expiration in mechanical ventilation. Used to recruit collapsed alveoli and improve oxygenation in ARDS.',
    category: 'Respiratory'
  },
  {
    term: 'Microthrombi',
    definition: 'Small blood clots in the microcirculation, commonly seen in DIC and thrombotic microangiopathy. Cause organ ischemia and dysfunction.',
    category: 'Coagulation'
  }
];

export default function Glossary() {
  const categories = Array.from(new Set(glossaryTerms.map(t => t.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Medical Glossary</h1>
        <p className="text-muted-foreground">
          Key terms and definitions for systems pathophysiology
        </p>
      </div>

      {categories.map(category => (
        <div key={category}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Badge className="mr-3">{category}</Badge>
          </h2>
          <div className="grid gap-4">
            {glossaryTerms
              .filter(term => term.category === category)
              .map((term) => (
                <Card key={term.term}>
                  <CardHeader>
                    <CardTitle className="text-lg">{term.term}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{term.definition}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
