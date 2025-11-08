import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userData, jobTitle, jobDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating resume for job:', jobTitle);

    // Construct a detailed prompt for AI
    const prompt = `You are an expert resume writer. Generate tailored, professional resume content for the following job application.

TARGET JOB: ${jobTitle}
${jobDescription ? `JOB DESCRIPTION: ${jobDescription}` : ''}

USER'S CAREER INFORMATION:
${JSON.stringify(userData, null, 2)}

INSTRUCTIONS:
1. Analyze the job requirements and prioritize relevant experiences
2. Optimize for ATS (Applicant Tracking System) by using keywords from the job description
3. Create content that fits on ONE PAGE only
4. Focus on quantifiable achievements and impact
5. Use strong action verbs
6. Return ONLY a JSON object with this exact structure (no markdown, no extra text):

{
  "contact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string (optional)",
    "portfolio": "string (optional)"
  },
  "summary": "2-3 sentence professional summary tailored to the target role",
  "experience": [
    {
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "bullets": ["achievement 1", "achievement 2", "achievement 3"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "location": "string",
      "graduationDate": "MM/YYYY",
      "gpa": "string (optional)"
    }
  ],
  "skills": {
    "technical": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"],
    "soft": ["skill1", "skill2"]
  },
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["tech1", "tech2"],
      "link": "string (optional)"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "MM/YYYY"
    }
  ]
}

Return ONLY the JSON object, nothing else.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert resume writer. Always return valid JSON only.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let generatedContent = data.choices[0].message.content;

    // Clean up the response - remove markdown code blocks if present
    generatedContent = generatedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse the JSON to validate it
    let resumeData;
    try {
      resumeData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedContent);
      throw new Error('AI returned invalid JSON format');
    }

    console.log('Resume generated successfully');

    return new Response(
      JSON.stringify({ success: true, content: resumeData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-resume:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
