# Systems Pathophysiology

> **An Interactive Organ Failure Progression Simulator for Medical Education**

A comprehensive, mobile-first, offline-capable educational application that teaches learners how organ failures evolve and propagate across systems. From sepsis → ARDS → AKI → DIC, this app simulates the underlying mechanisms, feedback loops, compensations, decompensations, and multi-organ interactions with clinical rigor and visual clarity.

## 🎯 Mission

Teach trainees how *organ failures evolve and propagate across systems* through interactive simulations, mechanistic understanding, and clinically accurate pathophysiology.

## ✨ Key Features

### 🔄 Organ Propagation Graph
- Visualize how dysfunction in one organ cascades to others
- Interactive node-based visualization with real-time updates
- See directional arrows showing active propagation pathways
- Click organs to view detailed parameters and clinical signs

### ⏱️ Timeline Simulator
- Watch organ failures evolve over time
- Multiple preset scenarios (Early Sepsis, Advanced Sepsis, Cardiogenic Shock)
- Adjustable simulation speed
- Timeline events tracking key milestones

### 📊 Multi-Organ Matrix
- Monitor all organ systems simultaneously
- Real-time physiological parameter updates
- Interactive sliders to adjust parameters
- Instant feedback on how changes propagate

### 🫀 Organ Modules
- Deep dive into individual organ systems
- Lungs, Heart, Kidneys, Liver, Coagulation
- Clinical pearls and key concepts
- Multi-organ interaction explanations

### 📝 Case Engine
- Practice with branching clinical scenarios
- Multiple difficulty levels (Basic → Advanced)
- Target different learner levels (MS2 → Attending)
- Real-world cases with learning objectives

### 📚 Assessment Hub
- MCQs with detailed rationales
- Covers all organ systems and pathophysiology
- Immediate feedback and scoring
- Reinforces mechanistic understanding

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (dark-mode first)
- **UI Components:** Custom shadcn/ui components
- **State Management:** Zustand with persistence
- **Routing:** React Router v6
- **Offline Support:** Service Workers + PWA
- **Data Storage:** IndexedDB (via idb)
- **Visualizations:** D3.js, Recharts, Canvas API

### Project Structure

```
SYSTEMS-PATHOPHYSIOLOGY/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── Layout.tsx    # Main layout with navigation
│   ├── pages/            # Route pages
│   │   ├── Home.tsx
│   │   ├── PropagationGraph.tsx
│   │   ├── TimelineSimulator.tsx
│   │   ├── OrganMatrix.tsx
│   │   ├── OrganModules.tsx
│   │   ├── CaseEngine.tsx
│   │   ├── Assessment.tsx
│   │   └── Glossary.tsx
│   ├── engine/           # Simulation engine
│   │   └── simulator.ts  # Physiology simulation logic
│   ├── store/            # State management
│   │   └── useStore.ts   # Zustand store
│   ├── types/            # TypeScript types
│   │   └── index.ts      # All type definitions
│   ├── data/             # Initial data and states
│   │   └── initialStates.ts
│   ├── lib/              # Utilities
│   │   └── utils.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd SYSTEMS-PATHOPHYSIOLOGY

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
```

### Build

```bash
# Create a production build
npm run build

# Preview the production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 🧠 Core Simulation Engine

The application features a sophisticated physiological simulation engine that:

- **Propagates organ dysfunction** based on clinically validated pathways
- **Implements feedback loops** (both positive and negative)
- **Models compensatory mechanisms** (cardiovascular, respiratory, renal)
- **Updates systemic parameters** (lactate, pH, inflammation, perfusion)
- **Detects critical events** (ARDS onset, AKI stages, DIC criteria)
- **Maintains internal consistency** across all organ systems

### Key Propagation Pathways

1. **Sepsis → ARDS**: Systemic inflammation → Endothelial injury → Pulmonary capillary leak
2. **Hypoxemia → AKI**: Decreased PaO₂ → Renal hypoperfusion → ATN
3. **Cardiac Failure → AKI**: Low cardiac output → Prerenal azotemia
4. **Sepsis → DIC**: Endothelial injury → Tissue factor → Coagulation cascade
5. **DIC → Multi-organ**: Microthrombi → Microcirculation failure
6. **AKI → ARDS**: Fluid retention → Pulmonary edema
7. **Liver Failure → Coagulopathy**: Decreased clotting factor synthesis
8. **Cardiac → Liver**: Venous congestion → Hepatic dysfunction

## 📱 Features

### Mobile-First Design
- Responsive layouts for all screen sizes
- Touch-optimized interactions
- Optimized for mobile performance

### Dark Mode First
- Reduced eye strain for night study sessions
- Better battery life on OLED screens
- Elegant, professional appearance

### Offline Capability
- Service Worker for offline functionality
- IndexedDB for data persistence
- PWA-ready (installable on devices)

### Accessibility
- WCAG 2.2 AA compliant design
- Keyboard navigation support
- Screen reader compatible

## 🎓 Target Learners

- **MS2-MS4:** Build foundational understanding of systems physiology
- **Residents:** ICU/ED reasoning practice and board review
- **Fellows:** Advanced pathophysiology and complex cases
- **Attendings:** Teaching tool and knowledge refresher

## 📊 Learning Outcomes

After using this app, learners will be able to:

1. ✅ Trace organ failure cascades accurately (e.g., sepsis → ARDS → AKI → DIC)
2. ✅ Explain mechanisms of inter-organ propagation
3. ✅ Predict next steps in organ deterioration
4. ✅ Understand compensatory vs decompensatory physiology
5. ✅ Recognize when compensations fail
6. ✅ Anticipate complications in multi-organ failure
7. ✅ Apply systems thinking to clinical reasoning

## 🔬 Clinical Accuracy

All physiological models are based on:

- **Marino's The ICU Book**
- **Hall's Textbook of Medical Physiology**
- **Surviving Sepsis Campaign Guidelines**
- **ARDSNet Protocols**
- **KDIGO AKI Guidelines**
- **ISTH DIC Scoring**

## ⚠️ Important Notes

- **Educational Use Only**: This is a learning tool, NOT for clinical decision-making
- **Synthetic Data**: All patient data is synthetic and for educational purposes
- **Evidence-Based**: Pathophysiology models follow current clinical evidence
- **Conservative Modeling**: Physiologically conservative, avoiding speculative mechanisms

## 🛠️ Development

### Adding New Features

1. **New Organ System**: Add types in `src/types/index.ts`, update simulator in `src/engine/simulator.ts`
2. **New Propagation Rule**: Add to `initializePropagationRules()` in simulator
3. **New Page**: Create in `src/pages/`, add route in `App.tsx`
4. **New Preset State**: Add to `src/data/initialStates.ts`

### State Management

The app uses Zustand for global state management:

- `currentState`: Current physiological state
- `simulator`: Instance of PhysiologySimulator
- `isSimulationRunning`: Simulation control
- `userProgress`: Learning progress tracking

### Styling

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theming (defined in `index.css`)
- **shadcn/ui** component patterns for consistency

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional organ systems (GI, Endocrine, Brain modules)
- More preset clinical scenarios
- Enhanced visualization options
- Additional assessment questions
- Internationalization (i18n)

## 📄 License

This project is for educational purposes. Please see LICENSE file for details.

## 🙏 Acknowledgments

Built with inspiration from:
- The elegant simplicity of Pathoma
- The clinical rigor of Marino's ICU Book
- The interactive approach of modern medical education

## 📞 Support

For questions, feedback, or issues, please open an issue on the repository.

---

**Systems Pathophysiology** - Master organ failure progression through interactive simulation

*Built with ❤️ for medical education*
