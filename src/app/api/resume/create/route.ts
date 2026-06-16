import { connectToDB } from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import { getCurrentUser } from "@/lib/GetCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import ResumeModel from "@/models/resume.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const id = await getCurrentUser();

    const newResume = await ResumeModel.create({
      user_id: id,
      title: "Untitled Resume",
      summary: "",
      personalInfo: {},
      workExperience: [],
      projects: [],
      education: [],
      certification: [],
      skills: [],
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume template created successfully.",
        data: {
          resume: newResume,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Bhai tera resume banana mushkil hai.\n", error);
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
