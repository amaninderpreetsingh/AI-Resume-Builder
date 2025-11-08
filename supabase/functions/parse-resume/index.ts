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
    const { fileContent, fileName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Parsing resume file:', fileName);

    const prompt = `You are a resume parser. Extract structured information from the following resume text.

RESUME TEXT:
${fileContent}

Return ONLY a JSON object with this exact structure (no markdown, no extra text):

{
  "contact_info": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string (optional)",
    "portfolio": "string (optional)"
  },
  "work_experience": [
    {
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "description": "string with key responsibilities and achievements"
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
      "technologies": ["tech1", "tech2"]
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

Return ONLY the JSON object, nothing else. If information is not available, use empty arrays or empty strings.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a resume parser. Always return valid JSON only.' },
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
    let parsedContent = data.choices[0].message.content;

    // Clean up the response
    parsedContent = parsedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse and validate
    let resumeData;
    try {
      resumeData = JSON.parse(parsedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parsedContent);
      throw new Error('AI returned invalid JSON format');
    }

    console.log('Resume parsed successfully');

    return new Response(
      JSON.stringify({ success: true, data: resumeData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-resume:', error);
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
