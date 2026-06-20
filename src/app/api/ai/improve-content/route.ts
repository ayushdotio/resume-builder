import { generateAiContent } from "@/lib/gemini";
import { ImproveContentBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: ImproveContentBody = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Bad request. Missing fields.",
        },
        { status: 400 },
      );
    }

    const prompt = `
Act as a senior ATS resume consultant, professional resume writer, and technical recruiter.

Content to Improve:
${content}

Task:
Enhance and optimize the provided resume content to make it more professional, ATS-friendly, impactful, and recruiter-ready while preserving its original meaning and intent.

Guidelines:

* Improve clarity, readability, grammar, and sentence structure.
* Strengthen wording using professional and action-oriented language.
* Incorporate relevant ATS-friendly keywords naturally where appropriate.
* Improve the overall quality and professionalism of the content.
* Highlight technical expertise, responsibilities, contributions, achievements, problem-solving abilities, and business impact when applicable.
* Remove redundancy, filler words, weak phrasing, and unnecessary repetition.
* Replace generic statements with stronger and more professional language.
* Preserve all factual information from the original content.
* Do not invent skills, technologies, certifications, achievements, responsibilities, metrics, or qualifications that are not present or reasonably implied by the content.
* Avoid clichés such as:

  * Hardworking individual
  * Team player
  * Fast learner
  * Seeking opportunities
  * Passionate professional
* Avoid first-person pronouns such as:

  * I
  * Me
  * My
  * We
* Maintain a natural, modern, and professional tone.
* Keep the content concise while maximizing impact.
* Adapt the writing style to the type of content provided without explicitly identifying its type.

Output Rules:
Return ONLY the enhanced content in text form.

Do NOT return:

* Headings
* Labels
* Bullet points (unless they already exist in the input)
* Markdown
* JSON
* Explanations
* Suggestions
* Quotes
* Any text before or after the enhanced content
`;

    const result = await generateAiContent(prompt);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Content enhanced successfully.",
        data: {
          improvedContent: result,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Content enhancement mein bhi gdbd ho gai.\n", error);
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
