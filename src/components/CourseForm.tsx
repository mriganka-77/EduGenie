import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Sparkles, BookOpen, Clock, GraduationCap } from 'lucide-react';
import { CourseFormData } from '@/types/course';

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  isGenerating: boolean;
}

export default function CourseForm({ onSubmit, isGenerating }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    topic: '',
    level: 'beginner',
    duration: 'medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.topic.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="p-8 shadow-xl gradient-card border-0">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            What would you like to learn?
          </Label>
          <Input
            id="topic"
            type="text"
            placeholder="e.g., JavaScript, Photography, Cooking..."
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="text-lg py-6 border-2 focus:border-primary transition-colors"
            required
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Experience Level
          </Label>
          <RadioGroup
            value={formData.level}
            onValueChange={(value: 'beginner' | 'intermediate') => 
              setFormData({ ...formData, level: value })
            }
            disabled={isGenerating}
          >
            <div className="flex gap-4">
              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 cursor-pointer hover:border-primary transition-colors flex-1">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="cursor-pointer flex-1">
                  Beginner
                  <p className="text-sm text-muted-foreground mt-1">New to this topic</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 cursor-pointer hover:border-primary transition-colors flex-1">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="cursor-pointer flex-1">
                  Intermediate
                  <p className="text-sm text-muted-foreground mt-1">Some experience</p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Course Duration
          </Label>
          <RadioGroup
            value={formData.duration}
            onValueChange={(value: 'short' | 'medium' | 'long') => 
              setFormData({ ...formData, duration: value })
            }
            disabled={isGenerating}
          >
            <div className="flex gap-4">
              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 cursor-pointer hover:border-primary transition-colors flex-1">
                <RadioGroupItem value="short" id="short" />
                <Label htmlFor="short" className="cursor-pointer flex-1">
                  Short
                  <p className="text-sm text-muted-foreground mt-1">3-5 lessons</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 cursor-pointer hover:border-primary transition-colors flex-1">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer flex-1">
                  Medium
                  <p className="text-sm text-muted-foreground mt-1">5-7 lessons</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 cursor-pointer hover:border-primary transition-colors flex-1">
                <RadioGroupItem value="long" id="long" />
                <Label htmlFor="long" className="cursor-pointer flex-1">
                  Long
                  <p className="text-sm text-muted-foreground mt-1">7-10 lessons</p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!formData.topic.trim() || isGenerating}
          className="w-full gradient-primary text-primary-foreground py-6 text-lg font-semibold hover:opacity-90 transition-opacity"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-spin" />
              Generating Your Course...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Course
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}