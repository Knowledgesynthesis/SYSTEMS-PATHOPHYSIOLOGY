import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { presetStates } from '@/data/initialStates';
import { OrganSystem } from '@/types';

export default function TimelineSimulator() {
  const {
    currentState,
    isSimulationRunning,
    simulationSpeed,
    setSimulationRunning,
    setSimulationSpeed,
    stepSimulation,
    resetSimulation,
    initializeSimulation
  } = useStore();

  const [selectedPreset, setSelectedPreset] = useState<string>('earlySepsis');

  useEffect(() => {
    if (!currentState) {
      initializeSimulation();
    }
  }, [currentState, initializeSimulation]);

  useEffect(() => {
    let intervalId: number;
    if (isSimulationRunning && currentState) {
      intervalId = window.setInterval(() => {
        stepSimulation();
      }, 1000 / simulationSpeed);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSimulationRunning, simulationSpeed, stepSimulation, currentState]);

  const loadPreset = (presetName: keyof typeof presetStates) => {
    const presetState = presetStates[presetName]();
    initializeSimulation(presetState);
    setSelectedPreset(presetName);
  };

  if (!currentState) {
    return <div>Loading...</div>;
  }

  const timeline = currentState.timeline;
  const organSeverities = Object.values(currentState.organs).map((organ) => ({
    name: organ.name,
    severity: organ.severity,
    id: organ.id
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Timeline Simulator</h1>
        <p className="text-muted-foreground">
          Watch organ failures evolve over time from sepsis → ARDS → AKI → DIC
        </p>
      </div>

      {/* Preset Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Select Clinical Scenario</CardTitle>
          <CardDescription>
            Each scenario starts with different organ dysfunctions. Press "Run" to watch how organs cascade and deteriorate over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-sm">
            <p className="font-semibold mb-2">How it works:</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Normal Baseline:</strong> All organs healthy - use for experimentation</li>
              <li>• <strong>Early Sepsis:</strong> Tachycardia, hypotension, mild hypoxemia - watch progression to ARDS/AKI</li>
              <li>• <strong>Advanced Sepsis:</strong> Already has ARDS + AKI + early DIC - see multi-organ failure cascade</li>
              <li>• <strong>Cardiogenic Shock:</strong> Severe cardiac dysfunction - watch heart → lungs → kidneys → liver propagation</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant={selectedPreset === 'normal' ? 'default' : 'outline'}
              onClick={() => loadPreset('normal')}
            >
              Normal Baseline
            </Button>
            <Button
              variant={selectedPreset === 'earlySepsis' ? 'default' : 'outline'}
              onClick={() => loadPreset('earlySepsis')}
            >
              Early Sepsis
            </Button>
            <Button
              variant={selectedPreset === 'advancedSepsis' ? 'default' : 'outline'}
              onClick={() => loadPreset('advancedSepsis')}
            >
              Advanced Sepsis
            </Button>
            <Button
              variant={selectedPreset === 'cardiogenicShock' ? 'default' : 'outline'}
              onClick={() => loadPreset('cardiogenicShock')}
            >
              Cardiogenic Shock
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Button
                onClick={() => setSimulationRunning(!isSimulationRunning)}
                variant={isSimulationRunning ? 'destructive' : 'default'}
                size="lg"
              >
                {isSimulationRunning ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Run
                  </>
                )}
              </Button>
              <Button onClick={() => stepSimulation()} disabled={isSimulationRunning} variant="outline">
                Step Forward
              </Button>
              <Button onClick={resetSimulation} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <div className="ml-auto">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Time: {Math.round(currentState.timestamp * 10) / 10} hours
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FastForward className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium min-w-[120px]">Speed: {simulationSpeed}x</span>
              <Slider
                min={0.5}
                max={5}
                step={0.5}
                value={simulationSpeed}
                onValueChange={setSimulationSpeed}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organ Severity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Organ Severity Progression</CardTitle>
          <CardDescription>Real-time organ dysfunction levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {organSeverities.map((organ) => (
              <div key={organ.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{organ.name}</span>
                  <Badge
                    variant={
                      organ.severity >= 4
                        ? 'destructive'
                        : organ.severity >= 2
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {organ.severity} / 5
                  </Badge>
                </div>
                <div className="relative">
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        organ.severity >= 4
                          ? 'bg-red-500'
                          : organ.severity >= 3
                          ? 'bg-orange-500'
                          : organ.severity >= 2
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(organ.severity / 5) * 100}%` }}
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-3 flex justify-between px-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-px h-full bg-background/50"
                        style={{ marginLeft: `${(i / 5) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Events Timeline</CardTitle>
          <CardDescription>Key events and milestones in organ failure progression</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            {/* Events */}
            <div className="space-y-6">
              {timeline.map((event, index) => (
                <div key={index} className="relative pl-10">
                  {/* Dot */}
                  <div
                    className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-background ${
                      event.severity && event.severity >= 3
                        ? 'bg-red-500'
                        : event.severity && event.severity >= 2
                        ? 'bg-yellow-500'
                        : 'bg-primary'
                    }`}
                  />

                  {/* Content */}
                  <div className="pb-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        T+{event.time}h
                      </Badge>
                      {event.organAffected && (
                        <Badge variant="secondary" className="text-xs">
                          {event.organAffected}
                        </Badge>
                      )}
                      {event.intervention && (
                        <Badge className="text-xs bg-green-600">Intervention</Badge>
                      )}
                    </div>
                    <p className="text-sm">{event.event}</p>
                    {event.intervention && (
                      <p className="text-xs text-muted-foreground mt-1">→ {event.intervention}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Systemic Parameters */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hemodynamics & Perfusion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">MAP:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.HEART].parameters.map.toFixed(0)} mmHg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cardiac Index:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.HEART].parameters.cardiacIndex.toFixed(1)} L/min/m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">SVR:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.HEART].parameters.svr.toFixed(0)} dynes·s/cm⁵</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Lactate:</span>
                <span className={`font-mono ${currentState.systemicParameters.lactate > 4 ? 'text-red-500' : ''}`}>
                  {currentState.systemicParameters.lactate.toFixed(1)} mmol/L
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Respiratory & Metabolic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">PaO₂:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.LUNGS].parameters.paO2.toFixed(0)} mmHg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">PaO₂/FiO₂:</span>
                <span className="font-mono">
                  {(currentState.organs[OrganSystem.LUNGS].parameters.paO2 / (currentState.organs[OrganSystem.LUNGS].parameters.fiO2 / 100)).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">pH:</span>
                <span className={`font-mono ${currentState.systemicParameters.pH < 7.3 ? 'text-red-500' : ''}`}>
                  {currentState.systemicParameters.pH.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Temperature:</span>
                <span className="font-mono">{currentState.systemicParameters.temperature.toFixed(1)}°C</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
