import { useEffect, useState } from "react";

export default function DebugJira() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/jira/tickets")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Jira Ticket Debug</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
