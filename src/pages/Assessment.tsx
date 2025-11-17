import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, XCircle } from 'lucide-react';

const questions = [
  {
    id: 'q1',
    question: 'A patient with severe sepsis develops bilateral pulmonary infiltrates and a PaO₂/FiO₂ ratio of 150. Which diagnosis is most likely?',
    options: [
      'Cardiogenic pulmonary edema',
      'Acute Respiratory Distress Syndrome (ARDS)',
      'Pneumonia',
      'Pulmonary embolism'
    ],
    correctAnswer: 1,
    rationale: 'ARDS is defined by bilateral infiltrates with PaO₂/FiO₂ < 300 in the absence of cardiac failure. This patient meets criteria for moderate ARDS (PaO₂/FiO₂ 100-200). The systemic inflammatory response from sepsis causes endothelial injury and pulmonary capillary leak.',
    difficulty: 'Intermediate',
    tags: ['ARDS', 'Sepsis', 'Respiratory']
  },
  {
    id: 'q2',
    question: 'In septic shock, decreased cardiac output primarily affects the kidneys through which mechanism?',
    options: [
      'Direct tubular toxicity',
      'Glomerular inflammation',
      'Decreased renal perfusion pressure',
      'Increased sodium reabsorption'
    ],
    correctAnswer: 2,
    rationale: 'Low cardiac output in shock decreases mean arterial pressure, reducing renal perfusion pressure. This leads to prerenal azotemia and, if prolonged, acute tubular necrosis (ATN). The kidneys are highly dependent on adequate perfusion to maintain GFR.',
    difficulty: 'Basic',
    tags: ['AKI', 'Shock', 'Hemodynamics']
  },
  {
    id: 'q3',
    question: 'Which laboratory finding is MOST specific for disseminated intravascular coagulation (DIC)?',
    options: [
      'Thrombocytopenia',
      'Elevated D-dimer',
      'Low fibrinogen with elevated PT/PTT',
      'Elevated INR'
    ],
    correctAnswer: 2,
    rationale: 'While all options can be seen in DIC, the combination of low fibrinogen (consumed in clot formation) with prolonged PT/PTT is most specific. DIC involves simultaneous activation of coagulation and fibrinolysis. Isolated thrombocytopenia or elevated D-dimer can have many causes.',
    difficulty: 'Advanced',
    tags: ['DIC', 'Coagulation', 'Labs']
  },
  {
    id: 'q4',
    question: 'A patient with ARDS requires mechanical ventilation. According to ARDSNet protocol, what is the target tidal volume?',
    options: [
      '10-12 mL/kg ideal body weight',
      '8-10 mL/kg ideal body weight',
      '6-8 mL/kg ideal body weight',
      '4-6 mL/kg ideal body weight'
    ],
    correctAnswer: 2,
    rationale: 'The ARDSNet low tidal volume strategy uses 6-8 mL/kg (typically 6 mL/kg) of ideal body weight to minimize ventilator-induced lung injury. This approach has been shown to reduce mortality in ARDS. Higher tidal volumes cause barotrauma and volutrauma.',
    difficulty: 'Intermediate',
    tags: ['ARDS', 'Ventilation', 'Management']
  },
  {
    id: 'q5',
    question: 'In the progression from sepsis to multi-organ failure, which typically occurs FIRST?',
    options: [
      'Acute kidney injury',
      'DIC',
      'Cardiovascular dysfunction',
      'ARDS'
    ],
    correctAnswer: 2,
    rationale: 'Cardiovascular dysfunction (manifesting as hypotension, tachycardia, and altered SVR) typically appears first in sepsis. This initiates the cascade: impaired perfusion → ARDS (12-48h) → AKI (24-72h) → DIC (variable). However, timing can vary based on the inciting event and patient factors.',
    difficulty: 'Advanced',
    tags: ['Sepsis', 'Multi-organ failure', 'Timeline']
  }
];

export default function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowRationale(true);
    if (index === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowRationale(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowRationale(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assessment Complete</h1>
          <p className="text-muted-foreground">
            Review your results and learning points
          </p>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">
                {score} / {questions.length}
              </div>
              <div className="text-2xl">
                {percentage.toFixed(0)}%
              </div>
              <div className="pt-4">
                {percentage >= 80 ? (
                  <Badge className="text-lg px-4 py-2 bg-green-600">Excellent</Badge>
                ) : percentage >= 60 ? (
                  <Badge className="text-lg px-4 py-2">Good</Badge>
                ) : (
                  <Badge className="text-lg px-4 py-2" variant="outline">Review Needed</Badge>
                )}
              </div>
              <Button size="lg" onClick={handleReset} className="mt-6">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Questions</CardTitle>
            <CardDescription>Go back through each question to reinforce learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={q.id} className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">Question {i + 1}</h4>
                    <Badge>{q.difficulty}</Badge>
                  </div>
                  <p className="text-sm mb-2">{q.question}</p>
                  <p className="text-xs text-muted-foreground">
                    {q.tags.map(tag => `#${tag}`).join(' ')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Assessment Hub</h1>
        <p className="text-muted-foreground">
          Test your knowledge with MCQs and clinical reasoning exercises
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              Score: {score} / {currentQuestion + (selectedAnswer !== null ? 1 : 0)}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <Badge>{question.difficulty}</Badge>
          </div>
          <CardTitle className="text-xl">{question.question}</CardTitle>
          <CardDescription>
            {question.tags.map(tag => `#${tag}`).join(' ')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showResult = showRationale;

              return (
                <button
                  key={index}
                  onClick={() => !showRationale && handleAnswer(index)}
                  disabled={showRationale}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-500/10'
                        : isSelected
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-border bg-background'
                      : isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {showResult && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      {!showResult && (
                        <div className={`h-5 w-5 rounded-full border-2 ${
                          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                        }`} />
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showRationale && (
            <Card className="bg-secondary/30 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{question.rationale}</p>
              </CardContent>
            </Card>
          )}

          {showRationale && (
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
