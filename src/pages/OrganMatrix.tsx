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
    updateOrganParameter,
    updateSystemicParameter
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

      {/* How to Use */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Interactive Dashboard:</p>
            <ul className="space-y-1 text-xs ml-4">
              <li>• <strong>Adjust sliders</strong> to manually change parameters (PaO₂, MAP, Creatinine, Platelets, Bilirubin, Lactate, etc.)</li>
              <li>• Click <strong>Run</strong> to see how changes propagate across organ systems automatically</li>
              <li>• Watch how <strong>lowering cardiac output</strong> worsens kidney function and causes lactic acidosis</li>
              <li>• See how <strong>increasing lactate/lowering pH</strong> affects organ perfusion and severity scores</li>
              <li>• Observe how <strong>liver dysfunction (↑Bilirubin, ↑ALT)</strong> impacts coagulation and systemic inflammation</li>
              <li>• All parameters update based on physiologically accurate propagation rules</li>
            </ul>
          </div>
        </CardContent>
      </Card>

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
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Creatinine: {currentState.organs[OrganSystem.KIDNEYS].parameters.creatinine.toFixed(1)} mg/dL</span>
                  <span className="text-xs text-muted-foreground">Normal: 0.7-1.3</span>
                </div>
                <Slider
                  min={0.5}
                  max={8}
                  step={0.1}
                  value={currentState.organs[OrganSystem.KIDNEYS].parameters.creatinine}
                  onValueChange={(val) => updateOrganParameter(OrganSystem.KIDNEYS, 'creatinine', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Urine Output: {currentState.organs[OrganSystem.KIDNEYS].parameters.urineOutput.toFixed(0)} mL/hr</span>
                  <span className="text-xs text-muted-foreground">Normal: &gt;30</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  value={currentState.organs[OrganSystem.KIDNEYS].parameters.urineOutput}
                  onValueChange={(val) => updateOrganParameter(OrganSystem.KIDNEYS, 'urineOutput', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GFR:</span>
                  <span className="font-mono">{currentState.organs[OrganSystem.KIDNEYS].parameters.gfr.toFixed(0)} mL/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BUN:</span>
                  <span className="font-mono">{currentState.organs[OrganSystem.KIDNEYS].parameters.bun.toFixed(0)} mg/dL</span>
                </div>
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
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Bilirubin: {currentState.organs[OrganSystem.LIVER].parameters.bilirubin.toFixed(1)} mg/dL</span>
                  <span className="text-xs text-muted-foreground">Normal: 0.3-1.2</span>
                </div>
                <Slider
                  min={0.3}
                  max={20}
                  step={0.1}
                  value={currentState.organs[OrganSystem.LIVER].parameters.bilirubin}
                  onValueChange={(val) => updateOrganParameter(OrganSystem.LIVER, 'bilirubin', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ALT: {currentState.organs[OrganSystem.LIVER].parameters.alt.toFixed(0)} U/L</span>
                  <span className="text-xs text-muted-foreground">Normal: 7-56</span>
                </div>
                <Slider
                  min={10}
                  max={2000}
                  value={currentState.organs[OrganSystem.LIVER].parameters.alt}
                  onValueChange={(val) => updateOrganParameter(OrganSystem.LIVER, 'alt', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">INR:</span>
                  <span className="font-mono">{currentState.organs[OrganSystem.LIVER].parameters.inr.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Albumin:</span>
                  <span className="font-mono">{currentState.organs[OrganSystem.LIVER].parameters.albumin.toFixed(1)} g/dL</span>
                </div>
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
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Platelets: {currentState.organs[OrganSystem.COAGULATION].parameters.platelets.toFixed(0)} ×10³/μL</span>
                  <span className="text-xs text-muted-foreground">Normal: 150-400</span>
                </div>
                <Slider
                  min={20}
                  max={400}
                  value={currentState.organs[OrganSystem.COAGULATION].parameters.platelets}
                  onValueChange={(val) => updateOrganParameter(OrganSystem.COAGULATION, 'platelets', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fibrinogen: {currentState.organs[OrganSystem.COAGULATION].parameters.fibrinogen.toFixed(0)} mg/dL</span>
                  <span className="text-xs text-muted-foreground">Normal: 200-400</span>
                </div>
                <Slider
                  min={50}
                  max={500}
                  value={currentState.organs[OrganSystem.COAGULATION].parameters.fibrinogen}
                  onValueChange={(val) => updateOrganParameter(OrganSystem.COAGULATION, 'fibrinogen', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">INR:</span>
                  <span className="font-mono">{currentState.organs[OrganSystem.COAGULATION].parameters.inr.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DIC Score:</span>
                  <span className={`font-mono ${currentState.organs[OrganSystem.COAGULATION].parameters.dicScore >= 5 ? 'text-red-500' : ''}`}>
                    {currentState.organs[OrganSystem.COAGULATION].parameters.dicScore.toFixed(0)} / 8
                  </span>
                </div>
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
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Lactate: {currentState.systemicParameters.lactate.toFixed(1)} mmol/L</span>
                  <span className="text-xs text-muted-foreground">Normal: 0.5-2.2</span>
                </div>
                <Slider
                  min={0.5}
                  max={15}
                  step={0.1}
                  value={currentState.systemicParameters.lactate}
                  onValueChange={(val) => updateSystemicParameter('lactate', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Temperature: {currentState.systemicParameters.temperature.toFixed(1)}°C</span>
                  <span className="text-xs text-muted-foreground">Normal: 36-37.5</span>
                </div>
                <Slider
                  min={35}
                  max={42}
                  step={0.1}
                  value={currentState.systemicParameters.temperature}
                  onValueChange={(val) => updateSystemicParameter('temperature', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>pH: {currentState.systemicParameters.pH.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">Normal: 7.35-7.45</span>
                </div>
                <Slider
                  min={6.8}
                  max={7.8}
                  step={0.01}
                  value={currentState.systemicParameters.pH}
                  onValueChange={(val) => updateSystemicParameter('pH', val)}
                  disabled={isSimulationRunning}
                />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inflammation:</span>
                  <span className="font-mono">{currentState.systemicParameters.inflammation.toFixed(1)} / 10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Glucose:</span>
                  <span className="font-mono">{currentState.systemicParameters.glucose.toFixed(0)} mg/dL</span>
                </div>
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
