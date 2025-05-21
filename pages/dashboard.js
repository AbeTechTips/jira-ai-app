import { useEffect, useState } from "react";

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
    <div style={{ padding: "2rem" }}>
      <h1>🧠 Jira Ticket Dashboard</h1>
      {loading ? (
        <p>Loading tickets...</p>
      ) : (
        tickets.map((issue) => (
          <div
            key={issue.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h2>{issue.key}: {issue.fields.summary}</h2>
            <p>{issue.fields.description?.content?.[0]?.content?.[0]?.text || "No description"}</p>
            <button
              onClick={() =>
                summarize(issue.key, issue.fields.description?.content?.[0]?.content?.[0]?.text || "")
              }
              disabled={generating[issue.key]}
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {generating[issue.key] ? "Summarizing..." : "Summarize with AI"}
            </button>
            {summaries[issue.key] && (
              <div style={{ marginTop: "1rem", background: "#f4f4f4", padding: "1rem" }}>
                <strong>AI Summary:</strong>
                <p>{summaries[issue.key]}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
