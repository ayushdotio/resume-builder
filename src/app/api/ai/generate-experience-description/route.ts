import { generateAiContent } from "@/lib/gemini";
import {
  generateExperienceDescription,
  generateSkills,
} from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: generateExperienceDescription = await req.json();
    const { experienceLevel, role, companyName, workDuration, techStack } =
      body;

    if (
      !experienceLevel ||
      !role ||
      !companyName ||
      !workDuration ||
      !techStack
    ) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Bad request. Missing fields.",
        },
        { status: 400 },
      );
    }

    const prompt = `
You are an expert resume writer, ATS optimization specialist, hiring manager, and technical recruiter.

Generate a professional work experience description based on the following information:

Role: ${role}
Company Name: ${companyName}
Work Duration: ${workDuration}
Tech Stack: ${techStack.join(", ")}
Experience Level: ${experienceLevel}

Requirements:

1. Generate a professional resume-ready experience description.
2. Length should be between 80 and 150 words.
3. Clearly describe:

   * Key responsibilities
   * Technical contributions
   * Technologies utilized
   * Business or user impact
   * Collaboration and problem-solving activities where appropriate
4. Naturally incorporate ATS-friendly keywords relevant to the role and technologies.
5. Adapt the description according to the experience level:

   * Fresher/Intern: Focus on implementation, learning, project contributions, debugging, testing, and collaboration.
   * Junior: Focus on feature development, API integration, performance improvements, and maintenance.
   * Mid-Level: Focus on architecture decisions, optimization, scalability, ownership, and mentoring.
   * Senior: Focus on technical leadership, system design, scalability, cross-functional collaboration, and strategic impact.
6. Use strong action-oriented language.
7. Ensure the experience sounds realistic and professional.
8. Highlight measurable impact where reasonably implied, but do not fabricate unrealistic achievements.
9. Do not mention ATS, recruiters, resumes, or experience level.
10. Do not use first-person pronouns such as:

    * I
    * Me
    * My
    * We
11. Avoid generic phrases such as:

    * Responsible for
    * Worked on
    * Team player
    * Hardworking individual
12. Integrate the provided technologies naturally into the description.

Output Rules:

Return ONLY the experience description paragraph.

Do NOT return:

* Headings
* Labels
* Bullet points
* Markdown
* JSON
* Quotes
* Explanations
* Additional text before or after the description

Generate the experience description now.

                `;

    const result = await generateAiContent(prompt);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Work experience description generated successfully.",
        data: {
          skills: result,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Work experience description generation mein bhi gdbd ho gai.\n", error);
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
