import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-20 text-center">
      <h3 className="text-3xl font-semibold mb-4">Ready to simplify your finances?</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Join thousands of users managing their expenses smartly.
      </p>

      <Link to="/register" className="btn btn-primary text-lg px-8">
        Create Your Account
      </Link>
    </section>
  );
}
