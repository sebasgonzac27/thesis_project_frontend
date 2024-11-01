import { useState } from 'react';
import { FeedbackList } from './FeedbackList';
import { FeedbackForm } from './FeedbackForm';
import { FeedbackDetail } from './FeedbackDetail';
import { FeedbackWithDetails } from '@/models';


export default function PqrsLists() {
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackWithDetails | null>(null);

  const handleCreateNew = () => {
    setView('form');
  };

  const handleSelectFeedback = (feedback: FeedbackWithDetails) => {
    setSelectedFeedback(feedback);
    setView('detail');
  };

  const handleFormSuccess = () => {
    setView('list');
  };

  const handleBack = () => {
    setView('list');
    setSelectedFeedback(null);
  };

  const handleFeedbackUpdate = () => {
    setView('list');
    setSelectedFeedback(null);
  };

  return (
    <div className="container mx-auto">
      {view === 'list' && (
        <FeedbackList
          onCreateNew={handleCreateNew}
          onSelectFeedback={handleSelectFeedback}
        />
      )}

      {view === 'form' && (
        <FeedbackForm
          onSuccess={handleFormSuccess}
          onCancel={handleBack}
        />
      )}

      {view === 'detail' && selectedFeedback && (
        <FeedbackDetail
          feedback={selectedFeedback}
          onClose={handleBack}
          onUpdate={handleFeedbackUpdate}
        />
      )}
    </div>
  );
};
