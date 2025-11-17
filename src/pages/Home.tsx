import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GitBranch,
  Clock,
  Grid3x3,
  Heart,
  FileText,
  BookOpen,
  Activity,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    title: 'Organ Propagation Graph',
    description: 'Visualize how dysfunction in one organ cascades to others through physiological pathways',
    icon: GitBranch,
    path: '/propagation',
    color: 'text-blue-500'
  },
  {
    title: 'Timeline Simulator',
    description: 'Watch organ failures evolve over time from sepsis → ARDS → AKI → DIC',
    icon: Clock,
    path: '/timeline',
    color: 'text-green-500'
  },
  {
    title: 'Multi-Organ Matrix',
    description: 'Monitor all organ systems simultaneously with real-time physiological updates',
    icon: Grid3x3,
    path: '/matrix',
    color: 'text-purple-500'
  },
  {
    title: 'Organ Modules',
    description: 'Deep dive into individual organ systems and their failure mechanisms',
    icon: Heart,
    path: '/organs',
    color: 'text-red-500'
  },
  {
    title: 'Case Engine',
    description: 'Practice with branching clinical scenarios and make real-time decisions',
    icon: FileText,
    path: '/cases',
    color: 'text-yellow-500'
  },
  {
    title: 'Assessment Hub',
    description: 'Test your knowledge with MCQs and clinical reasoning exercises',
    icon: BookOpen,
    path: '/assessment',
    color: 'text-orange-500'
  }
];

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Activity className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Systems Pathophysiology
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Master organ failure progression through interactive simulations and mechanistic understanding
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge>Mobile-First</Badge>
          <Badge>Offline-Ready</Badge>
          <Badge>Dark Mode</Badge>
          <Badge>Evidence-Based</Badge>
        </div>
      </div>

      {/* Key Concepts */}
      <Card>
        <CardHeader>
          <CardTitle>Why Systems Pathophysiology?</CardTitle>
          <CardDescription>
            Understanding organ failure progression is critical for clinical reasoning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Interconnected Systems</h3>
              <p className="text-sm text-muted-foreground">
                Organs don't fail in isolation. Understand the cascades, feedback loops, and compensatory mechanisms.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Timeline-Based Learning</h3>
              <p className="text-sm text-muted-foreground">
                See how quickly sepsis progresses to ARDS, AKI develops, and DIC emerges over hours and days.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Clinical Reasoning</h3>
              <p className="text-sm text-muted-foreground">
                Predict next steps, anticipate complications, and understand when compensations fail.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Explore Interactive Tools</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.path} className="relative overflow-hidden transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.path}>
                    <Button variant="outline" className="w-full group">
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Learning Pathways */}
      <Card>
        <CardHeader>
          <CardTitle>Common Organ Failure Cascades</CardTitle>
          <CardDescription>
            Learn these high-yield pathophysiology patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50">
              <div className="flex-1">
                <p className="font-medium">Sepsis → ARDS → AKI → DIC</p>
                <p className="text-sm text-muted-foreground">
                  The classic multi-organ failure cascade from systemic inflammation
                </p>
              </div>
              <Badge variant="outline">Essential</Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50">
              <div className="flex-1">
                <p className="font-medium">Cardiogenic Shock → Hepatic Congestion → AKI</p>
                <p className="text-sm text-muted-foreground">
                  How cardiac failure propagates to liver and kidneys
                </p>
              </div>
              <Badge variant="outline">High-Yield</Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50">
              <div className="flex-1">
                <p className="font-medium">Massive Transfusion → Hypocalcemia → Coagulopathy</p>
                <p className="text-sm text-muted-foreground">
                  Metabolic consequences of trauma resuscitation
                </p>
              </div>
              <Badge variant="outline">Advanced</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Learners */}
      <Card>
        <CardHeader>
          <CardTitle>For All Levels</CardTitle>
          <CardDescription>
            From medical students to attending clinicians
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-3 rounded-lg border border-border">
              <p className="font-semibold">MS2-MS4</p>
              <p className="text-xs text-muted-foreground">Build foundational understanding</p>
            </div>
            <div className="p-3 rounded-lg border border-border">
              <p className="font-semibold">Residents</p>
              <p className="text-xs text-muted-foreground">ICU/ED reasoning practice</p>
            </div>
            <div className="p-3 rounded-lg border border-border">
              <p className="font-semibold">Fellows</p>
              <p className="text-xs text-muted-foreground">Advanced pathophysiology</p>
            </div>
            <div className="p-3 rounded-lg border border-border">
              <p className="font-semibold">Attendings</p>
              <p className="text-xs text-muted-foreground">Teaching & review</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Get Started */}
      <div className="flex flex-col items-center space-y-4 text-center p-8 rounded-lg bg-primary/10 border border-primary/20">
        <h2 className="text-2xl font-bold">Ready to Master Organ Failure Progression?</h2>
        <p className="text-muted-foreground max-w-[600px]">
          Start with the Organ Propagation Graph to visualize system interactions,
          then progress to the Timeline Simulator for dynamic learning.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/propagation">
            <Button size="lg">
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/cases">
            <Button size="lg" variant="outline">
              Practice Cases
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
