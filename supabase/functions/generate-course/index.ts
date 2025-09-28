import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const systemPrompt = `You are an expert course designer and teacher. Create a complete, beginner-friendly course on the topic provided. 

Return the response in valid JSON format with this exact structure:
{
  "title": "Course Title",
  "lessons": [
    {
      "number": 1,
      "title": "Lesson Title",
      "explanation": "Clear and simple explanation",
      "examples": ["Example 1", "Example 2"],
      "practiceQuestions": ["Question 1", "Question 2"],
      "resources": ["Resource 1 URL or description", "Resource 2 URL or description"]
    }
  ],
  "quiz": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": "Option A"
    }
  ],
  "finalProject": "Description of the final project or assignment"
}

Rules:
- Keep explanations concise, clear, and engaging
- Assume the learner is new to the topic
- Provide practical, real-world examples
- Include 3-5 lessons for short courses, 5-7 for medium, and 7-10 for long courses
- Include 5-8 quiz questions
- Ensure the final project applies the knowledge learned`;

// Mock course generator for demonstration and fallback
function generateMockCourse(formData: any) {
  const { topic, level, duration } = formData;
  
  const lessonCount = duration === 'short' ? 4 : duration === 'medium' ? 6 : 8;
  
  const lessons = Array.from({ length: lessonCount }, (_, i) => ({
    number: i + 1,
    title: `${topic} - Lesson ${i + 1}: ${getTopicLesson(topic, i)}`,
    explanation: `In this comprehensive lesson, you'll learn the ${level === 'beginner' ? 'fundamentals' : 'advanced concepts'} of ${getTopicLesson(topic, i).toLowerCase()}. We'll explore key concepts through practical examples and hands-on exercises designed for ${level} learners.`,
    examples: [
      `Real-world example: How ${getTopicLesson(topic, i).toLowerCase()} is used in modern applications`,
      `Practical scenario: Implementing ${getTopicLesson(topic, i).toLowerCase()} in your own projects`
    ],
    practiceQuestions: [
      `What are the main benefits of ${getTopicLesson(topic, i).toLowerCase()}?`,
      `How would you apply ${getTopicLesson(topic, i).toLowerCase()} in a real project?`,
      `Compare different approaches to ${getTopicLesson(topic, i).toLowerCase()}`
    ],
    resources: [
      `https://developer.mozilla.org/en-US/docs/Learn - MDN Web Docs for ${topic}`,
      `https://www.w3schools.com - Interactive ${topic} tutorials`,
      `https://youtube.com - Video tutorials on ${getTopicLesson(topic, i)}`
    ]
  }));

  const quiz = [
    {
      question: `What is the primary purpose of ${topic}?`,
      options: [
        `To create interactive and dynamic content`,
        `To manage server infrastructure`,
        `To design database schemas`,
        `To optimize network protocols`
      ],
      correct: `To create interactive and dynamic content`
    },
    {
      question: `Which of the following best describes ${topic} for ${level}s?`,
      options: [
        `A foundational skill for modern development`,
        `An optional enhancement`,
        `A deprecated technology`,
        `A specialized niche tool`
      ],
      correct: `A foundational skill for modern development`
    },
    {
      question: `What is the recommended learning approach for ${topic}?`,
      options: [
        `Start with hands-on practice and build projects`,
        `Memorize all syntax first`,
        `Focus only on theory`,
        `Skip the basics`
      ],
      correct: `Start with hands-on practice and build projects`
    },
    {
      question: `How long does it typically take to learn ${topic} basics?`,
      options: [
        `${duration === 'short' ? '1-2 weeks' : duration === 'medium' ? '3-4 weeks' : '2-3 months'}`,
        `1 day`,
        `1 year`,
        `5 years`
      ],
      correct: `${duration === 'short' ? '1-2 weeks' : duration === 'medium' ? '3-4 weeks' : '2-3 months'}`
    },
    {
      question: `What's the most important skill when learning ${topic}?`,
      options: [
        `Consistent practice and problem-solving`,
        `Perfect memorization`,
        `Speed coding`,
        `Using only advanced features`
      ],
      correct: `Consistent practice and problem-solving`
    },
    {
      question: `Which resource is most helpful for ${level} ${topic} learners?`,
      options: [
        `Interactive tutorials and documentation`,
        `Academic research papers`,
        `Random code snippets`,
        `Outdated books`
      ],
      correct: `Interactive tutorials and documentation`
    }
  ];

  const finalProject = `Create a comprehensive ${topic} project that demonstrates your understanding of all concepts covered in this course. 

Your project should include:
1. Implementation of core ${topic} concepts from each lesson
2. At least ${lessonCount} different features showcasing various techniques
3. Clean, well-documented code following best practices
4. A README file explaining your project and the concepts used
5. ${level === 'beginner' ? 'Basic functionality with clear structure' : 'Advanced features with optimization'}

Project Ideas:
- Build an interactive ${topic} application with user input
- Create a portfolio showcasing your ${topic} skills
- Develop a tool that solves a real-world problem using ${topic}
- Design a teaching resource to help others learn ${topic}

Evaluation Criteria:
- Functionality: Does your project work as intended?
- Code Quality: Is your code clean and well-organized?
- Understanding: Does your project demonstrate mastery of the concepts?
- Creativity: Have you added your own unique touches?
- Documentation: Is your project well-documented for others to understand?`;

  return {
    title: `Complete ${topic} Course for ${level === 'beginner' ? 'Beginners' : 'Intermediate Learners'}`,
    lessons,
    quiz,
    finalProject
  };
}

function getTopicLesson(topic: string, index: number): string {
  const genericLessons = [
    'Getting Started and Setup',
    'Core Concepts and Fundamentals',
    'Working with Data and Variables',
    'Control Flow and Logic',
    'Functions and Modularity',
    'Advanced Techniques',
    'Best Practices and Patterns',
    'Real-World Applications',
    'Testing and Debugging',
    'Optimization and Performance'
  ];
  
  return genericLessons[index] || `Advanced Topic ${index + 1}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json();
    
    if (!formData || !formData.topic) {
      return new Response(JSON.stringify({ error: "Missing topic in request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try OpenAI API first if key is available
    if (openAIApiKey) {
      try {
        const userPrompt = `Topic: ${formData.topic}\nAudience Level: ${formData.level}\nPreferred Duration: ${formData.duration}\n\nPlease create a comprehensive course following the structure provided.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openAIApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: "json_object" },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          
          if (content) {
            try {
              const course = JSON.parse(content);
              console.log("Successfully generated course with OpenAI");
              return new Response(JSON.stringify({ course }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
            } catch (e) {
              console.error("Failed to parse OpenAI response, using mock data", e);
            }
          }
        } else {
          const err = await response.json().catch(() => ({}));
          console.error("OpenAI API error, using mock data instead:", err);
        }
      } catch (error) {
        console.error("Error calling OpenAI, using mock data:", error);
      }
    } else {
      console.log("No OpenAI API key configured, using mock data");
    }

    // Fallback to mock data
    const mockCourse = generateMockCourse(formData);
    console.log("Returning mock course data for:", formData.topic);
    
    return new Response(JSON.stringify({ course: mockCourse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error in generate-course function:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});