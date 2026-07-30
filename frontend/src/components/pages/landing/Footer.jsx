import { Heart, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const serviceLinks = [
  { label: "Book appointment", href: "/bookappointment" },
  { label: "All doctors", href: "/alldoctors" },
  { label: "Medical records", href: "/medicalReport" },
  { label: "AI diagnostics", href: "/chatbot" },
];

const companyLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Services", href: "/#services" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-surface-800 bg-surface-900 py-16 text-surface-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center gap-2 text-white">
              <div className="rounded-lg bg-primary-600 p-2">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">Arogyam</span>
            </div>
            <p className="mb-6 text-sm leading-relaxed opacity-80">
              Empowering you to take control of your health with connected technology and
              compassionate care.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="transition-colors hover:text-white" aria-label="Social link">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-white">Services</h4>
            <ul className="space-y-3 text-sm">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-white">Explore</h4>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-white">Get started</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/signin" className="transition-colors hover:text-white">
                  Patient sign in
                </Link>
              </li>
              <li>
                <Link to="/doctor/signin" className="transition-colors hover:text-white">
                  Doctor sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-surface-800 pt-8 text-center text-sm opacity-60">
          &copy; {new Date().getFullYear()} Arogyam Healthcare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
