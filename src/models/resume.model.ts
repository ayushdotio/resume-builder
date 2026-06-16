import { IResume } from "@/types/resume.types";
import { Schema, model, models } from "mongoose";

const resumeSchema = new Schema<IResume>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Resume",
    },

    summary: {
      type: String,
      trim: true,
      default: "",
    },

    personalInfo: {
      type: {
        fullname: { type: String, trim: true, default: "" },
        email: { type: String, trim: true, default: "" },
        mobile: { type: String, trim: true, default: "" },
        location: { type: String, trim: true, default: "" },
        github: { type: String, trim: true, default: "" },
        linkedIn: { type: String, trim: true, default: "" },
        portfolio: { type: String, trim: true, default: "" },
      },
      default: {},
    },

    workExperience: {
      type: [
        {
          company: { type: String, trim: true, default: "" },
          position: { type: String, trim: true, default: "" },
          startDate: { type: Date },
          endDate: { type: Date },
          description: {
            type: String,
            trim: true,
            default: "",
          },
        },
      ],
      default: [],
    },

    projects: {
      types: [
        {
          title: { type: String, trim: true, default: "" },
          description: {
            type: String,
            trim: true,
            default: "",
          },
          gitLink: { type: String, trim: true, default: "" },
          liveLink: { type: String, trim: true, default: "" },
          techStack: { type: [String], default: [] },
        },
      ],
      default: [],
    },

    education: {
      type: [
        {
          institute: { type: String, trim: true, default: "" },
          degree: { type: String, trim: true, default: "" },
          startDate: { type: Date },
          endDate: { type: Date },
          location: { type: String, trim: true, default: "" },
          gpa: { type: String, trim: true, default: "" },
        },
      ],
      default: [],
    },

    certifications: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const ResumeModel =
  models.ResumeModel || model<IResume>("Resume", resumeSchema);
export default ResumeModel;
