import { motion } from "framer-motion";
import DashboardPreview from "./DashboardPreview";
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  ShieldCheck,
  Boxes,
  Sparkles,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#08111F] text-white">

      {/* ================= Background ================= */}

      <div className="absolute inset-0">

        {/* Grid */}

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:45px_45px]" />

        {/* Blue Glow */}

        <div className="absolute -top-44 left-0 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />

        {/* Cyan Glow */}

        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-[140px]" />

        {/* Purple Glow */}

        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[140px]" />

      </div>

      {/* ================= Hero ================= */}

      <div className="relative z-10 mx-auto flex min-h-fit lg:min-h-screen max-w-7xl flex-col items-center justify-between gap-16 px-6 pt-20 pb-12 lg:flex-row lg:px-12 lg:pb-32 lg:pt-32">

        {/* ================= Left ================= */}

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .8 }}
          className="max-w-2xl flex flex-col items-center lg:items-start text-center lg:text-left lg:-translate-x-4"
        >

          {/* Heading */}

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .3 }}
            className="text-4xl font-black leading-tight md:text-5xl xl:text-6xl text-center lg:text-left"
          >

            Manage Assets

            <br />

            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">

              Smarter.

            </span>

            <br />

            Faster.

            <br />

            Together.

          </motion.h1>

          {/* Description */}

          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .5 }}
            className="mt-3 max-w-xl text-base leading-6 text-slate-300 text-center lg:text-left"
          >

            AssetFlow simplifies enterprise asset tracking,
            department management, maintenance workflows,
            resource booking and audits through one modern ERP
            platform built for organizations of every size.

          </motion.p>

          {/* Buttons */}

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .7 }}
            className="mt-2 flex flex-col gap-5 sm:flex-row justify-center lg:justify-start w-full sm:w-auto"
          >

            <button className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold shadow-[0_0_40px_rgba(59,130,246,.35)] transition-all duration-300 hover:scale-105">

              Get Started

              <ArrowRight
                className="transition-transform duration-300 group-hover:translate-x-2"
                size={20}
              />

            </button>

            <button className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-xl transition-all duration-300 hover:bg-white/10">

              <PlayCircle size={20} />

              Live Demo

            </button>

          </motion.div>

          {/* Features */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 justify-items-center lg:justify-items-start w-full"
          >

            <div className="flex items-center gap-3">

              <ShieldCheck className="text-green-400" />

              <span className="text-sm text-slate-300">
                Secure ERP
              </span>

            </div>

            <div className="flex items-center gap-3">

              <Boxes className="text-cyan-400" />

              <span className="text-sm text-slate-300">
                Asset Lifecycle
              </span>

            </div>

            <div className="flex items-center gap-3">

              <CheckCircle2 className="text-blue-400" />

              <span className="text-sm text-slate-300">
                Smart Allocation
              </span>

            </div>

          </motion.div>

        </motion.div>

        {/* ================= Right Side ================= */}

        <motion.div

          initial={{ opacity: 0, x: 70 }}

          animate={{ opacity: 1, x: 0 }}

          transition={{ duration: .9 }}

          className="relative w-full lg:w-1/2 lg:translate-x-8 lg:translate-y-0"

        >

          {/*

          Dashboard Preview

          Part 2 will come here.

          */}

          {/* <div className="flex h-[520px] w-full max-w-[520px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] backdrop-blur-xl">

            <p className="text-slate-400">

              Dashboard Preview Coming...

            </p>

          </div> */}

          <DashboardPreview />

        </motion.div>

      </div>

    </section>
  );
};

export default Hero;