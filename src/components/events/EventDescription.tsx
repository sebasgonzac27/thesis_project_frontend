import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';


interface EventDescriptionProps {
  description: string;
}


export function EventDescription({ description }: Readonly<EventDescriptionProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shortDescription = description.slice(0, 150) + '...';
  const needsExpansion = description.length > 150;

  return (
    <div className="mt-2">
      <span className="font-bold">Descripción:</span>
      <ReactMarkdown className="mt-1 pl-3 text-gray-600 text-xs leading-5">
        {isExpanded ? description : shortDescription}
      </ReactMarkdown>
      {needsExpansion && (
        <Button
          variant="link"
          className="p-0 h-auto mt-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Ver menos' : 'Ver más'}
        </Button>
      )}
    </div>
  );
}
