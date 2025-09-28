import { Card } from '@/components/ui/card';
import { Rocket, Target, FileText } from 'lucide-react';

interface FinalProjectProps {
  project: string;
}

export default function FinalProject({ project }: FinalProjectProps) {
  return (
    <Card className="p-8 shadow-xl gradient-card border-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full gradient-primary">
            <Rocket className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Final Project</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Project Objective</h3>
              <p className="text-foreground/90 leading-relaxed">{project}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Submission Guidelines</h3>
              <ul className="space-y-2 text-foreground/90">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Apply all concepts learned throughout the course</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Document your process and decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Focus on practical implementation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Be creative and add your personal touch</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-foreground/80">
            <strong>Tip:</strong> This project is your opportunity to demonstrate mastery of the course material. 
            Take your time and don't hesitate to revisit the lessons for reference.
          </p>
        </div>
      </div>
    </Card>
  );
}