import ForgotPassword from "@/components/auth/ForgotPassword";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main>
      <div className="w-full flex mt-20 justify-center">
        <section className="flex flex-col w-[400px]">
          <h1 className="text-3xl w-full text-center font-bold mb-6">
            Forgot Password
          </h1>
          <ForgotPassword />
          <div className="mt-2 flex items-center">
            <h1>{`Remember your password?`}</h1>
            <Link className="font-bold ml-2" href="/login">
              Login instead
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
