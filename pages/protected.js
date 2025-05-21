import { getSession } from "next-auth/react";

export default function ProtectedPage({ user }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🔒 Protected Page</h1>
      <p>Welcome, {user.name || user.email}!</p>
    </div>
  );
}

// Server-side authentication check
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    // Redirect to login page if not authenticated
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  // If authenticated, pass the user session to the page
  return {
    props: {
      user: session.user,
    },
  };
}
