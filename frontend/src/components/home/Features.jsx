import { motion } from "framer-motion";
import {
  Boxes,
  Users,
  CalendarDays,
  Wrench,
  ClipboardCheck,
  BellRing,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Asset Lifecycle",
    description:
      "Track every asset from registration to retirement with complete lifecycle visibility.",
    icon: Boxes,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "Smart Allocation",
    description:
      "Allocate assets to employees and departments with automatic conflict prevention.",
    icon: Users,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Resource Booking",
    description:
      "Book meeting rooms, vehicles and equipment with overlap validation.",
    icon: CalendarDays,
    gradient: "from-emerald-500 to-green-400",
  },
  {
    title: "Maintenance Workflow",
    description:
      "Approval-based maintenance process with technician assignment and history.",
    icon: Wrench,
    gradient: "from-orange-500 to-yellow-400",
  },
  {
    title: "Asset Audits",
    description:
      "Schedule audit cycles and generate discrepancy reports automatically.",
    icon: ClipboardCheck,
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Notifications",
    description:
      "Real-time alerts for overdue returns, bookings and maintenance updates.",
    icon: BellRing,
    gradient: "from-rose-500 to-red-500",
  },
];

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-[#08111F] py-28">

      {/* Background Glow */}

      <div className="absolute left-0 top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-[150px]" />

      <div className="absolute right-0 bottom-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >

          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300">

            Powerful Features

          </span>

          <h2 className="mt-7 text-4xl font-black text-white md:text-5xl">

            Everything Required

            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

              {" "}To Manage Assets

            </span>

          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">

            Built for organizations that need complete control over assets,
            employees, bookings, maintenance and audits.

          </p>

        </motion.div>

        {/* Cards */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature, index) => (

            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * .15,
                duration: .6,
              }}
              whileHover={{
                y: -12,
                scale: 1.03,
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/30"
            >

              {/* Glow */}

              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:scale-150" />

              {/* Icon */}

              <div
                className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.gradient}`}
              >

                <feature.icon
                  size={30}
                  className="text-white"
                />

              </div>

              {/* Title */}

              <h3 className="text-2xl font-bold text-white">

                {feature.title}

              </h3>

              {/* Description */}

              <p className="mt-5 leading-7 text-slate-400">

                {feature.description}

              </p>

              {/* Read More */}

              <div className="mt-8 flex items-center gap-2 font-medium text-cyan-300 transition-all duration-300 group-hover:gap-4">

                Learn More

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />

              </div>

            </motion.div>

          ))}

        </div>

      </div>
    </section>
  );
}