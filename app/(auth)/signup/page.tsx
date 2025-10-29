import SignUpForm from "@/components/auth/sign-up-form";
import Link from "next/link";


export default function SignUpPage() {
  return (
    <main className="flex w-screen h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Create an Account</h1>
        <SignUpForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
