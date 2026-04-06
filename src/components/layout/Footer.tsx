import Link from "next/link";
import { Globe, Link2, Camera, Mail, Phone } from "lucide-react";

const aboutLinks = [
  { href: "/about", label: "About Us" },
  { href: "/our-story", label: "Our Story" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/privacy", label: "Privacy Policy" },
];

const participantLinks = [
  { href: "/search", label: "Search Services" },
  { href: "/service-request", label: "Service Request" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faqs", label: "FAQs" },
];

const providerLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/register", label: "Register" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/help", label: "Help Center" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              About
            </h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Participants */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              For Participants
            </h3>
            <ul className="space-y-3">
              {participantLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              For Providers
            </h3>
            <ul className="space-y-3">
              {providerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Connect
            </h3>
            <div className="mb-4 flex gap-4">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Facebook"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="LinkedIn"
              >
                <Link2 className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Instagram"
              >
                <Camera className="h-5 w-5" />
              </a>
            </div>
            <div className="space-y-2">
              <a
                href="mailto:hello@domain.com.au"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
              >
                <Mail className="h-4 w-4" />
                hello@domain.com.au
              </a>
              <a
                href="tel:1800000000"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
              >
                <Phone className="h-4 w-4" />
                1800 XXX XXX
              </a>
            </div>
          </div>
        </div>

        {/* Divider + Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="mb-4 text-sm leading-relaxed text-gray-400">
            We acknowledge Aboriginal and Torres Strait Islander peoples as the
            traditional custodians of the land on which we operate. We pay our
            respects to Elders past, present and emerging.
          </p>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NDIS Directory. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
