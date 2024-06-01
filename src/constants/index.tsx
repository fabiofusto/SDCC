import React from 'react';
import { Angry, Annoyed, Meh, Smile } from 'lucide-react';

interface Sentiment {
  icon: JSX.Element;
  color: string;
  description: string;
}

type SentimentDisplay = Record<string, Sentiment>;

export const sentimentDisplay: SentimentDisplay = {
  Positive: {
    icon: <Smile className="size-6 lg:size-8 text-primary" />,
    color: 'text-primary',
    description: 'The sentiment of the text is generally positive.',
  },
  Negative: {
    icon: <Angry className="size-6 lg:size-8 text-red-500" />,
    color: 'text-red-500',
    description: 'The sentiment of the text is generally negative.',
  },
  Mixed: {
    icon: <Annoyed className="size-6 lg:size-8 text-yellow-500" />,
    color: 'text-yellow-500',
    description: 'The sentiment of the text is mixed.',
  },
  Neutral: {
    icon: <Meh className="size-6 lg:size-8 text-blue-500" />,
    color: 'text-blue-500',
    description: 'The sentiment of the text is neutral.',
  },
};