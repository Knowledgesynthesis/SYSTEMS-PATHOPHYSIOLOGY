import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { OrganSystem } from '@/types';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function OrganMatrix() {
  const {
    currentState,
    isSimulationRunning,
    setSimulationRunning,
    stepSimulation,
    resetSimulation,
    initializeSimulation,
    updateOrganParameter
  } = useStore();

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
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSimulationRunning, stepSimulation, currentState]);

  if (!currentState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Multi-Organ Matrix</h1>
        <p className="text-muted-foreground">
          Monitor all organ systems simultaneously with real-time physiological updates
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Button
              onClick={() => setSimulationRunning(!isSimulationRunning)}
              variant={isSimulationRunning ? 'destructive' : 'default'}
            >
              {isSimulationRunning ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
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
              <Badge variant="outline">Time: {Math.round(currentState.timestamp * 10) / 10}h</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organ Systems Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Lungs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Respiratory System</CardTitle>
              <Badge
                variant={
                  currentState.organs[OrganSystem.LUNGS].severity >= 4
                    ? 'destructive'
                    : currentState.organs[OrganSystem.LUNGS].severity >= 2
                    ? 'default'
                    : 'secondary'
                }
              >
                Severity {currentState.organs[OrganSystem.LUNGS].severity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>PaO₂: {currentState.organs[OrganSystem.LUNGS].parameters.paO2.toFixed(0)} mmHg</span>
                  <span className="text-xs text-muted-foreground">Normal: 80-100</span>
                </div>
                <Slider
                  min={40}
                  max={120}
                  value={currentState.organs[OrganSystem.LUNGS].parameters.paO2}
                  onValueChange={(val) => updateOrganParameter(OrganSystem.LUNGS, 'paO2', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>FiO₂: {currentState.organs[OrganSystem.LUNGS].parameters.fiO2.toFixed(0)}%</span>
                </div>
                <Slider
                  min={21}
                  max={100}
                  value={currentState.organs[OrganSystem.LUNGS].parameters.fiO2}
                  onValueChange={(val) => updateOrganParameter(OrganSystem.LUNGS, 'fiO2', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PaO₂/FiO₂:</span>
                  <span className="font-mono">
                    {(currentState.organs[OrganSystem.LUNGS].parameters.paO2 /
                      (currentState.organs[OrganSystem.LUNGS].parameters.fiO2 / 100)).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Compliance:</span>
                  <span className="font-mono">{currentState.organs[OrganSystem.LUNGS].parameters.compliance.toFixed(0)} mL/cmH₂O</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Cardiovascular System</CardTitle>
              <Badge
                variant={
                  currentState.organs[OrganSystem.HEART].severity >= 4
                    ? 'destructive'
                    : currentState.organs[OrganSystem.HEART].severity >= 2
                    ? 'default'
                    : 'secondary'
                }
              >
                Severity {currentState.organs[OrganSystem.HEART].severity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>MAP: {currentState.organs[OrganSystem.HEART].parameters.map.toFixed(0)} mmHg</span>
                  <span className="text-xs text-muted-foreground">Target: &gt;65</span>
                </div>
                <Slider
                  min={40}
                  max={120}
                  value={currentState.organs[OrganSystem.HEART].parameters.map}
                  onValueChange={(val) => updateOrganParameter(OrganSystem.HEART, 'map', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>HR: {currentState.organs[OrganSystem.HEART].parameters.heartRate.toFixed(0)} bpm</span>
                </div>
                <Slider
                  min={40}
                  max={160}
                  value={currentState.organs[OrganSystem.HEART].parameters.heartRate}
                  onValueChange={(val) => updateOrganParameter(OrganSystem.HEART, 'heartRate', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cardiac Index:</span>
                  <span className="font-mono">{currentState.organs[OrganSystem.HEART].parameters.cardiacIndex.toFixed(1)} L/min/m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">EF:</span>
                  <span className="font-mono">{currentState.organs[OrganSystem.HEART].parameters.ejectionFraction.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kidneys */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Renal System</CardTitle>
              <Badge
                variant={
                  currentState.organs[OrganSystem.KIDNEYS].severity >= 4
                    ? 'destructive'
                    : currentState.organs[OrganSystem.KIDNEYS].severity >= 2
                    ? 'default'
                    : 'secondary'
                }
              >
                Severity {currentState.organs[OrganSystem.KIDNEYS].severity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creatinine:</span>
                <span className={`font-mono ${currentState.organs[OrganSystem.KIDNEYS].parameters.creatinine > 1.5 ? 'text-red-500' : ''}`}>
                  {currentState.organs[OrganSystem.KIDNEYS].parameters.creatinine.toFixed(1)} mg/dL
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">BUN:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.KIDNEYS].parameters.bun.toFixed(0)} mg/dL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Urine Output:</span>
                <span className={`font-mono ${currentState.organs[OrganSystem.KIDNEYS].parameters.urineOutput < 30 ? 'text-red-500' : ''}`}>
                  {currentState.organs[OrganSystem.KIDNEYS].parameters.urineOutput.toFixed(0)} mL/hr
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GFR:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.KIDNEYS].parameters.gfr.toFixed(0)} mL/min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liver */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Hepatic System</CardTitle>
              <Badge
                variant={
                  currentState.organs[OrganSystem.LIVER].severity >= 4
                    ? 'destructive'
                    : currentState.organs[OrganSystem.LIVER].severity >= 2
                    ? 'default'
                    : 'secondary'
                }
              >
                Severity {currentState.organs[OrganSystem.LIVER].severity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bilirubin:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.LIVER].parameters.bilirubin.toFixed(1)} mg/dL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ALT:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.LIVER].parameters.alt.toFixed(0)} U/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">INR:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.LIVER].parameters.inr.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Albumin:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.LIVER].parameters.albumin.toFixed(1)} g/dL</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coagulation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Coagulation System</CardTitle>
              <Badge
                variant={
                  currentState.organs[OrganSystem.COAGULATION].severity >= 4
                    ? 'destructive'
                    : currentState.organs[OrganSystem.COAGULATION].severity >= 2
                    ? 'default'
                    : 'secondary'
                }
              >
                Severity {currentState.organs[OrganSystem.COAGULATION].severity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platelets:</span>
                <span className={`font-mono ${currentState.organs[OrganSystem.COAGULATION].parameters.platelets < 100 ? 'text-red-500' : ''}`}>
                  {currentState.organs[OrganSystem.COAGULATION].parameters.platelets.toFixed(0)} ×10³/μL
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">INR:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.COAGULATION].parameters.inr.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fibrinogen:</span>
                <span className="font-mono">{currentState.organs[OrganSystem.COAGULATION].parameters.fibrinogen.toFixed(0)} mg/dL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DIC Score:</span>
                <span className={`font-mono ${currentState.organs[OrganSystem.COAGULATION].parameters.dicScore >= 5 ? 'text-red-500' : ''}`}>
                  {currentState.organs[OrganSystem.COAGULATION].parameters.dicScore.toFixed(0)} / 8
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Systemic Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Systemic Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lactate:</span>
                <span className={`font-mono ${currentState.systemicParameters.lactate > 4 ? 'text-red-500' : ''}`}>
                  {currentState.systemicParameters.lactate.toFixed(1)} mmol/L
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">pH:</span>
                <span className={`font-mono ${currentState.systemicParameters.pH < 7.3 ? 'text-red-500' : ''}`}>
                  {currentState.systemicParameters.pH.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temperature:</span>
                <span className="font-mono">{currentState.systemicParameters.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Inflammation:</span>
                <span className="font-mono">{currentState.systemicParameters.inflammation.toFixed(1)} / 10</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Adjust the sliders to modify organ parameters manually. Run the simulation to see how changes propagate
            across organ systems. All values update in real-time based on the physiological simulation engine.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
