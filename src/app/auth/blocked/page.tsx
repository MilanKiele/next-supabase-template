import Logout from "@/components/auth/Logout";

export default function Blocked() {
  return (
    <main>
      <section className="blocked-page">
        <div className="flex justify-center items-center h-[90vh] text-center">
          <div className="flex flex-col items-center justify-center">
            <div>
              <h1 className="font-bold text-6xl bg-gradient-to-t from-red-600 to-red-400 bg-clip-text text-transparent">
                Access Denied
              </h1>
              <h2 className="font-bold text-2xl mt-4 text-red-500">
                Your account has been blocked.
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-md">
                This may be due to a violation of our terms of service, or your
                account may have been manually restricted. If you believe this
                is a mistake, please contact support for assistance.
              </p>
            </div>
            <div className="mt-8">
              <Logout />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
