import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Question } from '@/types/course';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';

interface QuizSectionProps {
  questions: Question[];
}

export default function QuizSection({ questions }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const handleAnswer = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitAnswer = () => {
    const newSubmitted = [...submitted];
    newSubmitted[currentQuestion] = true;
    setSubmitted(newSubmitted);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return answer === questions[index].correct ? score + 1 : score;
    }, 0);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <Card className="p-8 shadow-xl">
        <div className="text-center space-y-6">
          <Trophy className={`w-20 h-20 mx-auto ${percentage >= 70 ? 'text-success' : 'text-primary'}`} />
          <h2 className="text-3xl font-bold">Quiz Complete!</h2>
          <p className="text-xl">
            You scored <span className="font-bold text-primary">{score}</span> out of{' '}
            <span className="font-bold">{questions.length}</span>
          </p>
          <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${percentage >= 70 ? 'gradient-success' : 'gradient-primary'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-lg text-muted-foreground">
            {percentage >= 90 ? 'Excellent work!' :
             percentage >= 70 ? 'Great job!' :
             percentage >= 50 ? 'Good effort!' :
             'Keep practicing!'}
          </p>
          
          <div className="space-y-4 mt-8 text-left">
            <h3 className="font-semibold text-lg">Review Answers:</h3>
            {questions.map((q, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/50">
                <p className="font-medium mb-2">
                  {index + 1}. {q.question}
                </p>
                <div className="flex items-center gap-2">
                  {selectedAnswers[index] === q.correct ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className={selectedAnswers[index] === q.correct ? 'text-success' : 'text-destructive'}>
                    Your answer: {selectedAnswers[index] || 'Not answered'}
                  </span>
                </div>
                {selectedAnswers[index] !== q.correct && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Correct answer: {q.correct}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = submitted[currentQuestion];

  return (
    <Card className="p-8 shadow-xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <div className="flex gap-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentQuestion
                    ? 'bg-primary'
                    : submitted[index]
                    ? selectedAnswers[index] === questions[index].correct
                      ? 'bg-success'
                      : 'bg-destructive'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-lg font-medium">{question.question}</p>
          
          <RadioGroup
            value={selectedAnswers[currentQuestion] || ''}
            onValueChange={handleAnswer}
            disabled={isAnswered}
          >
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isCorrect = option === question.correct;
                const isSelected = selectedAnswers[currentQuestion] === option;
                
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                      isAnswered
                        ? isCorrect
                          ? 'border-success bg-success/10'
                          : isSelected
                          ? 'border-destructive bg-destructive/10'
                          : 'border-border'
                        : 'border-border hover:border-primary cursor-pointer'
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className={`flex-1 cursor-pointer ${
                        isAnswered && isCorrect ? 'text-success font-medium' :
                        isAnswered && isSelected && !isCorrect ? 'text-destructive' :
                        ''
                      }`}
                    >
                      {option}
                    </Label>
                    {isAnswered && (
                      <>
                        {isCorrect && <CheckCircle className="w-5 h-5 text-success" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex-1"
          >
            Previous
          </Button>
          
          {!isAnswered ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswers[currentQuestion]}
              className="flex-1 gradient-primary"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1 gradient-primary"
            >
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}