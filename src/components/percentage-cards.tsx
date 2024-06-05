import { sentimentDisplay } from '@/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { cn } from '@/lib/utils';

interface PercentageCardsProps {
    sentimentScore: {
      [key: string]: number;
    }
}

export const PercentageCards = ({sentimentScore}: PercentageCardsProps) => {
  const totalScore = Object.values(sentimentScore).reduce((a, b) => a + b, 0);
  const columns = Object.values(sentimentScore).filter(score => score !== 0).length;
  console.log(columns)
  
  return (
    <div className={cn('grid gap-4 my-4', {
      'grid-cols-1 md:grid-cols-3': columns === 3,
      'grid-cols-2 md:grid-cols-4': columns === 4
    
    })}>
      {Object.entries(sentimentDisplay).map(([key, { icon, color }]) => {
        const percentage = ((sentimentScore[key] / totalScore) * 100).toFixed(1);
        if(percentage === '0.0') return
        return (
          <Card className="border-none drop-shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out" key={key}>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className='text-xl lg:text-2xl line-clamp-1'>{key}</CardTitle>
              <CardDescription>{icon}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <span className="font-bold text-2xl">{percentage}%</span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

