import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // ✅ Log the session to verify if it's reaching the backend
  console.log("🔍 SESSION FROM API:", session);

  if (!session) {
    console.warn("⛔ Unauthorized access to /api/jira/tickets");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const auth = Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
  ).toString("base64");

  console.log("🔐 Calling Jira API with auth for user:", session.user.email);

  const response = await fetch(
    `https://${process.env.JIRA_DOMAIN}/rest/api/3/search?jql=project=ATS`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Jira API call failed:", errorText);
    return res.status(response.status).json({
      message: "Failed to fetch tickets",
      error: errorText,
    });
  }

  const data = await response.json();
  console.log("✅ Jira tickets fetched:", data.issues?.length || 0, "issues");

  return res.status(200).json(data);
}
