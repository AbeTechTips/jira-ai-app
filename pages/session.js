import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function SessionPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>You are not signed in.</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>✅ You are signed in as:</h2>
      <p>Name: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <img src={session.user.image} alt="Avatar" width={80} style={{ borderRadius: "50%" }} />
      <br />
      <button onClick={() => signOut()} style={{ marginTop: "1rem" }}>Sign out</button>
    </div>
  );
}
