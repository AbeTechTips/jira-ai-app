import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState({});
  const [generating, setGenerating] = useState({});

  useEffect(() => {
    fetch("/api/jira/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.issues || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tickets:", err);
        setLoading(false);
      });
  }, []);

  const summarize = async (issueKey, description) => {
    setGenerating((prev) => ({ ...prev, [issueKey]: true }));

    const res = await fetch("/api/openai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: description }),
    });

    const data = await res.json();
    setSummaries((prev) => ({ ...prev, [issueKey]: data.summary }));
    setGenerating((prev) => ({ ...prev, [issueKey]: false }));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🧠 Jira Ticket Dashboard</h1>
        {loading ? (
          <p>Loading tickets...</p>
        ) : (
          tickets.map((issue) => (
            <div
              key={issue.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {issue.key}: {issue.fields.summary}
              </h2>
              <p className="text-sm text-gray-600">
                {issue.fields.description?.content?.[0]?.content?.[0]?.text || "No description"}
              </p>
              <button
                onClick={() =>
                  summarize(issue.key, issue.fields.description?.content?.[0]?.content?.[0]?.text || "")
                }
                disabled={generating[issue.key]}
                className="mt-3 inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded"
              >
                {generating[issue.key] ? "Summarizing..." : "Summarize with AI"}
              </button>
              {summaries[issue.key] && (
                <div className="mt-4 bg-gray-50 p-4 rounded border border-gray-200">
                  <strong className="block text-sm text-gray-700 mb-1">AI Summary:</strong>
                  <p className="text-sm text-gray-800">{summaries[issue.key]}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
