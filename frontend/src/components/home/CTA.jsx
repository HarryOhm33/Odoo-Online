import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#08111F] py-20">

      {/* Background Glow */}

      <div className="absolute inset-0">

        <div className="absolute left-0 top-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />

        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[160px]" />

      </div>

      <div className="relative mx-auto max-w-6xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="overflow-hidden rounded-[35px] border border-white/10 bg-gradient-to-br from-[#13233F] to-[#09111F] p-10 shadow-[0_20px_80px_rgba(37,99,235,.25)] md:p-16"
        >

          <div className="flex flex-col items-center text-center">

            <h2 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">

              Simplify Your

              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">

                {" "}Enterprise Operations

              </span>

            </h2>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">

              Track assets, automate workflows, prevent allocation conflicts,
              manage maintenance, streamline audits and improve productivity —
              all from one intelligent ERP platform.

            </p>

            <div className="mt-12 flex flex-col gap-5 sm:flex-row">

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: .95,
                }}
                className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(59,130,246,.4)]"
              >

                Get Started

                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-2"
                />

              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: .95,
                }}
                className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
              >

                <PlayCircle size={20} />

                Watch Demo

              </motion.button>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}