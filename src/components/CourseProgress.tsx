import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, BookOpen, Target } from 'lucide-react';

interface CourseProgressProps {
  totalLessons: number;
  completedLessons: number;
  quizCompleted: boolean;
}

export default function CourseProgress({ totalLessons, completedLessons, quizCompleted }: CourseProgressProps) {
  const lessonProgress = (completedLessons / totalLessons) * 100;
  const overallProgress = ((completedLessons / totalLessons) * 0.7 + (quizCompleted ? 0.3 : 0)) * 100;

  return (
    <Card className="p-6 shadow-lg sticky top-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        Your Progress
      </h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Lessons
            </span>
            <span className="text-sm text-muted-foreground">
              {completedLessons} / {totalLessons}
            </span>
          </div>
          <Progress value={lessonProgress} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Overall
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
        
        {overallProgress === 100 && (
          <div className="p-3 rounded-lg gradient-success text-center">
            <p className="text-sm font-medium text-success-foreground">
              🎉 Congratulations! Course Complete!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}