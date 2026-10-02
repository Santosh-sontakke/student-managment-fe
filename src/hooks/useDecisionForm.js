import { useState } from 'react';

export function useDecisionForm() {
  const [decisionDrafts, setDecisionDrafts] = useState({});

  const updateDecisionDraft = (registrationId, field, value) => {
    setDecisionDrafts((prev) => ({
      ...prev,
      [registrationId]: {
        ...(prev[registrationId] || { status: 'PENDING', batch: '' }),
        [field]: value,
      },
    }));
  };

  const resetDecisionDraft = (registrationId) => {
    setDecisionDrafts((prev) => ({
      ...prev,
      [registrationId]: { status: 'PENDING', batch: '' },
    }));
  };

  return {
    decisionDrafts,
    updateDecisionDraft,
    resetDecisionDraft,
  };
}
