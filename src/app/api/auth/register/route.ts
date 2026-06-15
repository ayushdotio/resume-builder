import { generateToken } from "@/lib/jwt";
import { connectToDB } from "@/lib/mongodb";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body: RegisterBody = await req.json();
    const { name, email, password, mobile } = body;

    if (!name || !email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "All field are required.",
        },
        {
          status: 400,
        },
      );
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User already exists. Try login.",
        },
        {
          status: 409,
        },
      );
    }

    const user = await UserModel.create({ name, email, password, mobile });

    const token = generateToken({ id: String(user._id) });

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User register successfully.",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });

    return response;
  } catch (error) {
    console.log("Bhai register krte time hi error aagya!!!\n", error);
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
