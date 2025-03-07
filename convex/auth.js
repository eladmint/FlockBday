import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default {
  providers: [
    {
      domain: "https://flock-bday.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
