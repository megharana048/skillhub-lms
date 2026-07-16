import { Link } from "react-router-dom";

function NotFoundPage({ message = "Page not found" }) {
  return (
    <section className="px-6 py-24 text-center">
      <h1 className="text-4xl font-black">{message}</h1>
      <Link to="/" className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white">
        Return Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
