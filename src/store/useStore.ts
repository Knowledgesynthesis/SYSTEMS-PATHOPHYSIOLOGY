/**
 * Global Application State Management with Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PhysiologicalState,
  OrganSystem,
  UserProgress,
  CaseScenario
} from '@/types';
import { PhysiologySimulator } from '@/engine/simulator';
import { getInitialPhysiologicalState } from '@/data/initialStates';

interface AppState {
  // Simulation state
  currentState: PhysiologicalState | null;
  simulator: PhysiologySimulator;
  isSimulationRunning: boolean;
  simulationSpeed: number; // multiplier

  // User state
  userProgress: UserProgress | null;
  currentModule: string | null;
  currentCase: CaseScenario | null;

  // UI state
  darkMode: boolean;
  sidebarOpen: boolean;

  // Actions
  initializeSimulation: (initialState?: PhysiologicalState) => void;
  stepSimulation: () => void;
  resetSimulation: () => void;
  setSimulationRunning: (running: boolean) => void;
  setSimulationSpeed: (speed: number) => void;
  updateOrganParameter: (organ: OrganSystem, parameter: string, value: number) => void;
  updateSystemicParameter: (parameter: string, value: number) => void;

  setCurrentModule: (moduleId: string | null) => void;
  setCurrentCase: (caseScenario: CaseScenario | null) => void;
  completeModule: (moduleId: string) => void;

  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentState: null,
      simulator: new PhysiologySimulator(),
      isSimulationRunning: false,
      simulationSpeed: 1,

      userProgress: null,
      currentModule: null,
      currentCase: null,

      darkMode: true,
      sidebarOpen: true,

      // Initialize simulation with a state
      initializeSimulation: (initialState?: PhysiologicalState) => {
        const state = initialState || getInitialPhysiologicalState();
        set({ currentState: state, isSimulationRunning: false });
      },

      // Step simulation forward
      stepSimulation: () => {
        const { currentState, simulator } = get();
        if (!currentState) return;

        const newState = simulator.stepSimulation(currentState);
        set({ currentState: newState });
      },

      // Reset simulation to initial state
      resetSimulation: () => {
        const initialState = getInitialPhysiologicalState();
        set({ currentState: initialState, isSimulationRunning: false });
      },

      // Control simulation running state
      setSimulationRunning: (running: boolean) => {
        set({ isSimulationRunning: running });
      },

      // Set simulation speed
      setSimulationSpeed: (speed: number) => {
        set({ simulationSpeed: Math.max(0.1, Math.min(10, speed)) });
      },

      // Update a specific organ parameter
      updateOrganParameter: (organ: OrganSystem, parameter: string, value: number) => {
        const { currentState } = get();
        if (!currentState) return;

        const newState = { ...currentState };
        const organKey = organ as keyof typeof newState.organs;
        if (newState.organs[organKey]) {
          (newState.organs[organKey].parameters as any)[parameter] = value;
        }
        set({ currentState: newState });
      },

      // Update a systemic parameter
      updateSystemicParameter: (parameter: string, value: number) => {
        const { currentState } = get();
        if (!currentState) return;

        const newState = { ...currentState };
        (newState.systemicParameters as any)[parameter] = value;
        set({ currentState: newState });
      },

      // Module navigation
      setCurrentModule: (moduleId: string | null) => {
        set({ currentModule: moduleId });
      },

      // Case management
      setCurrentCase: (caseScenario: CaseScenario | null) => {
        set({ currentCase: caseScenario });
        if (caseScenario) {
          set({ currentState: caseScenario.initialState });
        }
      },

      // Complete a module
      completeModule: (moduleId: string) => {
        const { userProgress } = get();
        if (!userProgress) {
          // Initialize user progress if it doesn't exist
          const newProgress: UserProgress = {
            userId: 'default-user',
            completedModules: [moduleId],
            assessmentScores: {},
            timeSpent: {},
            casesCompleted: [],
            lastAccessed: Date.now()
          };
          set({ userProgress: newProgress });
        } else {
          if (!userProgress.completedModules.includes(moduleId)) {
            userProgress.completedModules.push(moduleId);
            userProgress.lastAccessed = Date.now();
            set({ userProgress: { ...userProgress } });
          }
        }
      },

      // UI controls
      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },
    }),
    {
      name: 'systems-pathophysiology-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        darkMode: state.darkMode,
        // Don't persist simulation state to avoid issues
      }),
    }
  )
);
