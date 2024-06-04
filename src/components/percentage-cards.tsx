import { sentimentDisplay } from '@/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface PercentageCardsProps {
    sentimentScore: {
      [key: string]: number;
    }
}

export const PercentageCards = ({sentimentScore}: PercentageCardsProps) => {
  const totalScore = Object.values(sentimentScore).reduce((a, b) => a + b, 0);
  
  return (
    <>
      {Object.entries(sentimentDisplay).map(([key, { icon, color }]) => {
        const percentage = ((sentimentScore[key] / totalScore) * 100).toFixed(1);
        return (
          <Card className="border-none drop-shadow-md" key={key}>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg lg:text-xl line-clamp-1">{key}</CardTitle>
              <CardDescription>{icon}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <span className="font-bold text-lg lg:text-xl xl:text-2xl">{percentage}%</span>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}

