


import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Boxes,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

const quickLinks = [
  "Home",
  "Features",
  "Workflow",
  "Dashboard",
];

const productLinks = [
  "Asset Management",
  "Resource Booking",
  "Maintenance",
  "Analytics",
];

const socialLinks = [
  {
    icon: FaGithub,
    href: "https://github.com",
  },
  {
    icon: FaLinkedin,
    href: "https://linkedin.com",
  },
  {
    icon: FaXTwitter,
    href: "https://twitter.com",
  },
];

export default function Footer() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = (name, type) => {
    if (type === "quick") {
      if (name === "Home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (name === "Features") {
        const headings = Array.from(document.querySelectorAll("h2"));
        const target = headings.find((h) => h.textContent.includes("Everything Required"));
        if (target) {
          const section = target.closest("section");
          if (section) {
            const yOffset = -90;
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }
      } else if (name === "Workflow") {
        const headings = Array.from(document.querySelectorAll("h2"));
        const target = headings.find((h) => h.textContent.includes("Complete"));
        if (target) {
          const section = target.closest("section");
          if (section) {
            const yOffset = -90;
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }
      } else if (name === "Dashboard") {
        if (!user) {
          navigate("/auth/login");
        } else if (user.role === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/app/dashboard");
        }
      }
    } else if (type === "module") {
      if (!user) {
        navigate("/auth/login");
        return;
      }

      const isAdmin = user.role === "Admin";

      if (name === "Asset Management") {
        navigate(isAdmin ? "/admin/dashboard" : "/app/assets");
      } else if (name === "Resource Booking") {
        navigate(isAdmin ? "/admin/dashboard" : "/app/bookings");
      } else if (name === "Maintenance") {
        navigate(isAdmin ? "/admin/dashboard" : "/app/maintenance");
      } else if (name === "Analytics") {
        navigate(isAdmin ? "/admin/analytics" : "/app/dashboard");
      }
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#08111F]">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[140px]" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_35px_rgba(37,99,235,.35)]">
                <Boxes className="text-white" size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">
                  AssetFlow
                </h2>

                <p className="text-xs tracking-[4px] text-cyan-400">
                  ERP PLATFORM
                </p>
              </div>
            </div>

            <p className="mt-6 leading-8 text-slate-400">
              A modern enterprise platform to manage assets,
              employees, bookings, maintenance and audits with
              complete lifecycle visibility.
            </p>

            <div className="mt-8 flex gap-4">
              {socialLinks.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{
                      y: -5,
                      scale: 1.1,
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-xl font-bold text-white">
              Quick Links
            </h3>

            <div className="space-y-4">
              {quickLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item, "quick");
                  }}
                  className="block text-slate-400 transition hover:text-cyan-400"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Modules */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-xl font-bold text-white">
              Modules
            </h3>

            <div className="space-y-4">
              {productLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item, "module");
                  }}
                  className="block text-slate-400 transition hover:text-cyan-400"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-xl font-bold text-white">
              Contact
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Mail className="mt-1 text-cyan-400 animate-pulse" />

                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=assetflow@example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 transition hover:text-cyan-400 font-medium"
                  >
                    assetflow@example.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="mt-1 text-cyan-400" />

                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <a
                    href="tel:+919876543210"
                    className="text-slate-300 transition hover:text-cyan-400 font-medium"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="mt-1 text-cyan-400 animate-bounce" />

                <div>
                  <p className="text-sm text-slate-500">Address</p>
                  <a
                    href="https://maps.google.com/?q=Bengaluru,India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 transition hover:text-cyan-400 font-medium"
                  >
                    Bengaluru, India
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AssetFlow ERP. All Rights Reserved.
          </p>

          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="transition hover:text-cyan-400">
              Privacy Policy
            </a>

            <a href="#" className="transition hover:text-cyan-400">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}