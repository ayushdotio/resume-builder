import { generateAiContent } from "@/lib/gemini";
import { generateSummary } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: generateSummary = await req.json();
    const { experienceLevel, skills, jobTitle } = body;

    if (!experienceLevel || !skills || !jobTitle) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Bad request. Missing fields.",
        },
        { status: 400 },
      );
    }

    const prompt = `
Act as a senior ATS resume consultant.

Candidate Information:
- Experience Level: ${experienceLevel}
- Target Role: ${jobTitle}
- Skills: ${skills.join(", ")}

Task:
Generate a highly professional ATS-optimized resume summary that would appear at the top of a resume.

Guidelines:
- Length: 60-80 words.
- Match the tone and expectations of the target role.
- Integrate important keywords from the provided skills.
- Maintain strong readability while remaining ATS-friendly.
- Showcase technical expertise, problem-solving ability, and professional value.
- Emphasize projects and technical capabilities for freshers.
- Emphasize achievements, leadership, and impact for experienced candidates.
- Use active, professional language.
- Avoid clichés and filler content.
- Avoid first-person pronouns (I, me, my).
- Avoid unsupported claims or fabricated achievements.

Output Rules:
Return only the final resume summary paragraph text.
No headings.
No labels.
No markdown.
No explanations.
No surrounding quotes.
`;

    const result = await generateAiContent(prompt);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Summary generated successfully.",
        data: {
          summary: result,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Summary generation mein bhi gdbd ho gai.\n", error);
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
