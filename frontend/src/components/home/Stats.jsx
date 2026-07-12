import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Package,
  Users,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    icon: Package,
    value: 1245,
    suffix: "+",
    title: "Assets Managed",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: Users,
    value: 268,
    suffix: "+",
    title: "Employees",
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: CalendarDays,
    value: 438,
    suffix: "",
    title: "Active Bookings",
    color: "from-emerald-500 to-green-400",
  },
  {
    icon: ShieldCheck,
    value: 99,
    suffix: "%",
    title: "Tracking Accuracy",
    color: "from-orange-500 to-yellow-400",
  },
];

export default function Stats() {
  return (
    <section className="relative bg-[#08111F] py-24">

      <div className="absolute inset-0">

        <div className="absolute left-1/3 top-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[140px]" />

      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >

          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">

            Trusted by Organizations

          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">

            Everything You Need

            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

              {" "}In One Platform

            </span>

          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">

            Monitor assets, manage departments, automate maintenance,
            streamline bookings and improve operational efficiency.

          </p>

        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
              }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
            >

              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.color}`}
              />

              <div
                className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color}`}
              >
                <item.icon className="text-white" size={30} />
              </div>

              <h3 className="text-5xl font-black text-white">

                <CountUp
                  end={item.value}
                  duration={3}
                />

                {item.suffix}

              </h3>

              <p className="mt-4 text-slate-400">

                {item.title}

              </p>

              <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:scale-150" />

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
}