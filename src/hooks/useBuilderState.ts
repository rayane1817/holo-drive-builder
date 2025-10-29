import { useState, useEffect } from 'react';
import { StepId } from '../data/products';

const STATE_KEY = 'tmBuilderState_v1';

export interface BuilderState {
  selections: {
    wheelbase?: string;
    wheel?: string;
    pedals?: string;
    shifter_handbrake?: string;
    accessories?: string[];
  };
  activeStep: StepId;
}

const defaultState: BuilderState = {
  selections: {},
  activeStep: 'wheelbase'
};

// Parse query string
const parseQueryString = (): Partial<BuilderState['selections']> => {
  const params = new URLSearchParams(window.location.search);
  const selections: Partial<BuilderState['selections']> = {};
  
  const base = params.get('base');
  const wheel = params.get('wheel');
  const pedals = params.get('pedals');
  const shifter = params.get('shifter');
  const acc = params.get('acc');
  
  if (base) selections.wheelbase = base;
  if (wheel) selections.wheel = wheel;
  if (pedals) selections.pedals = pedals;
  if (shifter) selections.shifter_handbrake = shifter;
  if (acc) selections.accessories = acc.split(',');
  
  return selections;
};

// Generate share URL
export const generateShareUrl = (selections: BuilderState['selections']): string => {
  const params = new URLSearchParams();
  
  if (selections.wheelbase) params.set('base', selections.wheelbase);
  if (selections.wheel) params.set('wheel', selections.wheel);
  if (selections.pedals) params.set('pedals', selections.pedals);
  if (selections.shifter_handbrake) params.set('shifter', selections.shifter_handbrake);
  if (selections.accessories?.length) params.set('acc', selections.accessories.join(','));
  
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
};

export const useBuilderState = () => {
  const [state, setState] = useState<BuilderState>(() => {
    // Try query string first
    const querySelections = parseQueryString();
    if (Object.keys(querySelections).length > 0) {
      return {
        selections: querySelections,
        activeStep: querySelections.wheelbase ? 'wheel' : 'wheelbase'
      };
    }
    
    // Try localStorage
    try {
      const stored = localStorage.getItem(STATE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load builder state:', e);
    }
    
    return defaultState;
  });
  
  // Save to localStorage on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save builder state:', e);
      }
    }, 150);
    
    return () => clearTimeout(timeout);
  }, [state]);
  
  const setSelection = (stepId: StepId, productId: string | string[] | undefined) => {
    setState(prev => ({
      ...prev,
      selections: {
        ...prev.selections,
        [stepId]: productId
      }
    }));
  };
  
  const setActiveStep = (stepId: StepId) => {
    setState(prev => ({ ...prev, activeStep: stepId }));
  };
  
  const reset = () => {
    setState(defaultState);
    localStorage.removeItem(STATE_KEY);
  };
  
  return {
    state,
    setSelection,
    setActiveStep,
    reset
  };
};
