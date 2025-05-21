import { getProviders, signIn } from "next-auth/react";

export default function SignIn({ providers }) {
  // Fallback UI if providers are not loaded
  if (!providers) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Unable to load sign-in providers. Please try again later.</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem", textAlign: "center" }}>
      <h1>Sign in to Your App</h1>
      {Object.values(providers).map((provider) => (
        <div key={provider.name} style={{ margin: "1rem 0" }}>
          <button
            onClick={() => signIn(provider.id, { callbackUrl: "/session" })}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#0070f3",
              color: "white",
            }}
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

// Server-side fetch for providers
export async function getServerSideProps() {
  try {
    const providers = await getProviders();
    return {
      props: { providers },
    };
  } catch (error) {
    console.error("Error loading providers:", error);
    return {
      props: { providers: null },
    };
  }
}
