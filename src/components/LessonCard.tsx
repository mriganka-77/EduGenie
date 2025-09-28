import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, BookOpen, Target, Link, CheckCircle } from 'lucide-react';
import { Lesson } from '@/types/course';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function LessonCard({ lesson, isCompleted, onComplete }: LessonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`p-6 transition-all duration-300 ${isExpanded ? 'shadow-xl' : 'shadow-md'} ${isCompleted ? 'border-success bg-success/5' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${isCompleted ? 'gradient-success text-success-foreground' : 'gradient-primary text-primary-foreground'}`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : lesson.number}
            </span>
            <h3 className="text-xl font-bold">{lesson.title}</h3>
          </div>
          
          {!isExpanded && (
            <p className="text-muted-foreground line-clamp-2 ml-13">
              {lesson.explanation}
            </p>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4"
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-6 animate-in slide-in-from-top-2">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Explanation
            </h4>
            <p className="text-foreground/90 leading-relaxed">{lesson.explanation}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Real-World Examples
            </h4>
            <ul className="space-y-2">
              {lesson.examples.map((example, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-foreground/90">{example}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Practice Questions
            </h4>
            <ul className="space-y-2">
              {lesson.practiceQuestions.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary font-semibold">{index + 1}.</span>
                  <span className="text-foreground/90">{question}</span>
                </li>
              ))}
            </ul>
          </div>

          {lesson.resources && lesson.resources.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Link className="w-4 h-4 text-primary" />
                Additional Resources
              </h4>
              <ul className="space-y-2">
                {lesson.resources.map((resource, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span className="text-foreground/90">{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            onClick={onComplete}
            className={`w-full ${isCompleted ? 'bg-success hover:bg-success/90' : 'gradient-primary hover:opacity-90'}`}
          >
            {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
          </Button>
        </div>
      )}
    </Card>
  );
}