import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrganSystem } from '@/types';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';

const organColors: Record<OrganSystem, string> = {
  [OrganSystem.LUNGS]: '#3b82f6',
  [OrganSystem.KIDNEYS]: '#ef4444',
  [OrganSystem.HEART]: '#ec4899',
  [OrganSystem.LIVER]: '#f59e0b',
  [OrganSystem.BRAIN]: '#8b5cf6',
  [OrganSystem.COAGULATION]: '#14b8a6',
  [OrganSystem.GI]: '#84cc16',
  [OrganSystem.ENDOCRINE]: '#06b6d4'
};

const organLabels: Record<OrganSystem, string> = {
  [OrganSystem.LUNGS]: 'Lungs',
  [OrganSystem.KIDNEYS]: 'Kidneys',
  [OrganSystem.HEART]: 'Heart',
  [OrganSystem.LIVER]: 'Liver',
  [OrganSystem.BRAIN]: 'Brain',
  [OrganSystem.COAGULATION]: 'Coagulation',
  [OrganSystem.GI]: 'GI Tract',
  [OrganSystem.ENDOCRINE]: 'Endocrine'
};

export default function PropagationGraph() {
  const {
    currentState,
    simulator,
    isSimulationRunning,
    setSimulationRunning,
    stepSimulation,
    resetSimulation,
    initializeSimulation
  } = useStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<OrganSystem | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!currentState) {
      initializeSimulation();
    }
  }, [currentState, initializeSimulation]);

  useEffect(() => {
    if (isSimulationRunning) {
      animationRef.current = window.setInterval(() => {
        stepSimulation();
      }, 1000);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isSimulationRunning, stepSimulation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentState) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Position organs in a circle
    const organPositions: Record<OrganSystem, { x: number; y: number }> = {} as any;
    const availableOrgans = Object.keys(currentState.organs) as OrganSystem[];
    const angleStep = (2 * Math.PI) / availableOrgans.length;

    availableOrgans.forEach((organ, index) => {
      const angle = index * angleStep - Math.PI / 2;
      organPositions[organ] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // Get active propagations
    const activePropagations = simulator.getActivePropagations(currentState);

    // Draw connections
    activePropagations.forEach((prop) => {
      const source = organPositions[prop.source];
      const target = organPositions[prop.target];

      if (source && target) {
        const sourceOrgan = currentState.organs[prop.source as keyof typeof currentState.organs];
        const opacity = (sourceOrgan.severity / 5) * 0.8;

        // Draw arrow
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(target.y - source.y, target.x - source.x);
        const arrowSize = 10;
        ctx.beginPath();
        ctx.moveTo(target.x, target.y);
        ctx.lineTo(
          target.x - arrowSize * Math.cos(angle - Math.PI / 6),
          target.y - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          target.x - arrowSize * Math.cos(angle + Math.PI / 6),
          target.y - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.fill();
      }
    });

    // Draw organ nodes
    availableOrgans.forEach((organ) => {
      const pos = organPositions[organ];
      const organState = currentState.organs[organ as keyof typeof currentState.organs];
      const nodeRadius = 40;

      // Draw circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);

      // Color based on severity
      const severity = organState.severity;
      let color = organColors[organ];
      if (severity >= 4) color = '#ef4444';
      else if (severity >= 3) color = '#f97316';
      else if (severity >= 2) color = '#eab308';

      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = selectedOrgan === organ ? '#ffffff' : '#1e293b';
      ctx.lineWidth = selectedOrgan === organ ? 3 : 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(organLabels[organ], pos.x, pos.y);

      // Draw severity badge
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`Severity: ${severity}`, pos.x, pos.y + 20);
    });

  }, [currentState, simulator, selectedOrgan]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentState) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    const availableOrgans = Object.keys(currentState.organs) as OrganSystem[];
    const angleStep = (2 * Math.PI) / availableOrgans.length;
    const nodeRadius = 40;

    for (let i = 0; i < availableOrgans.length; i++) {
      const organ = availableOrgans[i];
      const angle = i * angleStep - Math.PI / 2;
      const organX = centerX + radius * Math.cos(angle);
      const organY = centerY + radius * Math.sin(angle);

      const distance = Math.sqrt((x - organX) ** 2 + (y - organY) ** 2);
      if (distance <= nodeRadius) {
        setSelectedOrgan(organ);
        return;
      }
    }

    setSelectedOrgan(null);
  };

  if (!currentState) {
    return <div>Loading...</div>;
  }

  const selectedOrganState = selectedOrgan ? currentState.organs[selectedOrgan as keyof typeof currentState.organs] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Organ Failure Propagation Graph</h1>
        <p className="text-muted-foreground">
          Visualize how dysfunction in one organ cascades to others through physiological pathways
        </p>
      </div>

      {/* How to Use */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="font-semibold">How to use this interactive graph:</p>
            <ul className="space-y-1 text-xs ml-4">
              <li>• Click <strong>Run Simulation</strong> to watch organs deteriorate over time</li>
              <li>• <strong>Arrows appear</strong> when one organ's dysfunction affects another (e.g., low cardiac output → kidney injury)</li>
              <li>• <strong>Node colors change</strong> from normal (blue/green) → mild (yellow) → severe (orange) → critical (red)</li>
              <li>• <strong>Click any organ</strong> to see detailed parameters, severity, and compensatory mechanisms</li>
              <li>• Watch how sepsis progresses: Heart dysfunction → Lung injury (ARDS) → Kidney failure (AKI) → Coagulation problems (DIC)</li>
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
                  Run Simulation
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
            <div className="flex items-center space-x-2 ml-auto">
              <Badge variant="outline">
                Time: {Math.round(currentState.timestamp * 10) / 10}h
              </Badge>
              <Badge variant="outline">
                Shock Type: {currentState.shockType}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Graph */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Interactive Organ Network</CardTitle>
            <CardDescription>
              Click on organs to view details. Arrows show active propagation pathways.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-[500px] cursor-pointer bg-background rounded-lg border border-border"
            />
          </CardContent>
        </Card>

        {/* Organ Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>{selectedOrganState ? organLabels[selectedOrgan!] : 'Organ Details'}</span>
            </CardTitle>
            <CardDescription>
              {selectedOrganState ? 'Current status and parameters' : 'Click an organ to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedOrganState ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Severity Level</span>
                    <Badge
                      variant={
                        selectedOrganState.severity >= 4
                          ? 'destructive'
                          : selectedOrganState.severity >= 2
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {selectedOrganState.severity} / 5
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(selectedOrganState.severity / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Description</p>
                  <p className="text-sm text-muted-foreground">{selectedOrganState.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Clinical Signs</p>
                  <ul className="space-y-1">
                    {selectedOrganState.clinicalSigns.map((sign: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start">
                        <span className="mr-2">•</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedOrganState.compensation.active && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-yellow-500">Compensatory Mechanisms Active</p>
                    <ul className="space-y-1">
                      {selectedOrganState.compensation.mechanisms.map((mech: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2">•</span>
                          <span>{mech}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium mb-2">Key Parameters</p>
                  <div className="space-y-1">
                    {Object.entries(selectedOrganState.parameters).slice(0, 5).map(([key, value]: [string, number]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-mono">{typeof value === 'number' ? value.toFixed(1) : String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <p className="text-sm text-center">
                  Select an organ from the graph<br />to view detailed information
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding the Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Severity Levels</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-500" />
                  <span className="text-sm">0-1: Normal to mild dysfunction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500" />
                  <span className="text-sm">2-3: Moderate dysfunction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500" />
                  <span className="text-sm">4: Severe dysfunction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-red-500" />
                  <span className="text-sm">5: Critical failure</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Propagation Arrows</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Arrows indicate active pathways where dysfunction in one organ is affecting another.
                Arrow opacity reflects the severity of the source organ.
              </p>
              <p className="text-sm text-muted-foreground">
                Examples: Heart → Kidneys (hypoperfusion), Lungs → Kidneys (hypoxemia),
                Coagulation → Multiple organs (microthrombi)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
