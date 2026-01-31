import { withAuth, RedirectToSignIn } from "@clerk/nextjs";

const ProtectedPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Protected Page</h1>
            <p>You are authenticated and can see this content!</p>
        </div>
    );
};

// If the user isn't signed in, redirect them to the sign-in page
export default withAuth(ProtectedPage, {
    loading: <p>Loading...</p>,
    fallback: <RedirectToSignIn />,
});