import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import CourseForm from '@/components/CourseForm';
import LessonCard from '@/components/LessonCard';
import QuizSection from '@/components/QuizSection';
import FinalProject from '@/components/FinalProject';
import CourseProgress from '@/components/CourseProgress';
import { Course, CourseFormData, GenerationState } from '@/types/course';
import { generateCourse } from '@/lib/openai';
import { GraduationCap, BookOpen, Brain, Rocket, Sparkles } from 'lucide-react';

export default function Index() {
  const [course, setCourse] = useState<Course | null>(null);
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    progress: '',
  });
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();

  const handleGenerateCourse = async (formData: CourseFormData) => {
    setGenerationState({ isGenerating: true, error: null, progress: 'Generating your personalized course...' });
    
    try {
      const generatedCourse = await generateCourse(formData);
      setCourse(generatedCourse);
      setCompletedLessons(new Set());
      setQuizCompleted(false);
      
      toast({
        title: "Course Generated! 🎉",
        description: `Your ${formData.topic} course is ready to explore.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate course';
      setGenerationState({ isGenerating: false, error: errorMessage, progress: '' });
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setGenerationState(prev => ({ ...prev, isGenerating: false, progress: '' }));
    }
  };

  const handleLessonComplete = (lessonNumber: number) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonNumber)) {
        newSet.delete(lessonNumber);
      } else {
        newSet.add(lessonNumber);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full gradient-primary shadow-glow animate-float">
                <GraduationCap className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent gradient-primary animate-gradient">
              AI Course Creator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate personalized, comprehensive courses on any topic with AI-powered content creation
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!course ? (
          <div className="max-w-2xl mx-auto">
            <CourseForm onSubmit={handleGenerateCourse} isGenerating={generationState.isGenerating} />
            
            {generationState.progress && (
              <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-center flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  {generationState.progress}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Course Title */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
              <p className="text-muted-foreground">
                {course.lessons.length} lessons • Interactive quiz • Final project
              </p>
            </div>

            {/* Course Content */}
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <Tabs defaultValue="lessons" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="lessons" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Lessons
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Quiz
                    </TabsTrigger>
                    <TabsTrigger value="project" className="flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Project
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="lessons" className="space-y-4">
                    {course.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.number}
                        lesson={lesson}
                        isCompleted={completedLessons.has(lesson.number)}
                        onComplete={() => handleLessonComplete(lesson.number)}
                      />
                    ))}
                  </TabsContent>

                  <TabsContent value="quiz">
                    <QuizSection questions={course.quiz} />
                  </TabsContent>

                  <TabsContent value="project">
                    <FinalProject project={course.finalProject} />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Progress Sidebar */}
              <div className="lg:col-span-1">
                <CourseProgress
                  totalLessons={course.lessons.length}
                  completedLessons={completedLessons.size}
                  quizCompleted={quizCompleted}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}