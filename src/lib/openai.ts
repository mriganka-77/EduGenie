import { Course, CourseFormData } from '@/types/course';
import { supabase } from '@/integrations/supabase/client';

export async function generateCourse(formData: CourseFormData): Promise<Course> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-course', {
      body: { formData },
    });

    if (error) {
      throw new Error(error.message || 'Failed to generate course');
    }

    if (!data?.course) {
      throw new Error('Invalid response from AI');
    }

    return data.course as Course;
  } catch (error) {
    console.error('Error generating course:', error);
    throw error;
  }
}
