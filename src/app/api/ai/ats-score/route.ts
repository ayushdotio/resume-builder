import { generateAiContent } from "@/lib/gemini";
import { GenerateATS } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateATS = await req.json();
    const { resumeText } = body;

    if (!resumeText) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Bad request. Missing fields.",
        },
        { status: 400 },
      );
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) evaluator, professional recruiter, and resume consultant.

Resume Content:
${resumeText}

Task:
Analyze the provided resume and calculate an ATS compatibility score based on industry-standard resume screening practices.

Evaluation Criteria:

1. Keyword Optimization

   * Presence of relevant technical and professional keywords.
   * Proper use of industry terminology.

2. Content Quality

   * Clarity and professionalism.
   * Strong action-oriented language.
   * Conciseness and readability.

3. Experience & Achievements

   * Demonstration of responsibilities and impact.
   * Use of measurable accomplishments where available.

4. Skills Representation

   * Relevance and quality of listed skills.
   * Alignment with modern industry expectations.

5. Resume Structure

   * Organization and logical flow.
   * Presence of important resume sections.

6. ATS Compatibility

   * ATS-friendly wording.
   * Appropriate formatting assumptions based on text content.
   * Searchability and keyword density.

Scoring Rules:

* Generate an overall ATS score between 0 and 100.
* Be realistic and critical.
* Do not automatically assign high scores.
* Deduct points for missing keywords, weak descriptions, vague content, lack of achievements, or poor structure.
* Reward strong technical content, clear achievements, relevant skills, and professional language.

Output Format:

Return ONLY valid JSON in the following format:

{
"atsScore": 0,
"strengths": [
"Strength 1",
"Strength 2",
"Strength 3"
],
"weaknesses": [
"Weakness 1",
"Weakness 2",
"Weakness 3"
],
"improvements": [
"Improvement 1",
"Improvement 2",
"Improvement 3"
],
"summary": "A concise overall evaluation of the resume."
}

Requirements:

* atsScore must be an integer between 0 and 100.
* strengths must contain 3 to 5 items.
* weaknesses must contain 3 to 5 items.
* improvements must contain 3 to 5 actionable suggestions.
* summary must be concise and professional.
* Return valid JSON only.
* No markdown.
* No code blocks.
* No explanations.
* No additional text before or after the JSON.
`;

    const result = await generateAiContent(prompt);

    const parsedResult = JSON.parse(result) as {
      atsScore: number;
      strengths: string[];
      weaknesses: string[];
      improvements: string[];
      summary: string;
    };

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "ATS score calculated successfully.",
        data: {
          atsScore: parsedResult.atsScore,
          strengths: parsedResult.strengths,
          weaknesses: parsedResult.weaknesses,
          improvements: parsedResult.improvements,
          summary: parsedResult.summary,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("ATS score calculation mein bhi gdbd ho gai.\n", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong.",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
