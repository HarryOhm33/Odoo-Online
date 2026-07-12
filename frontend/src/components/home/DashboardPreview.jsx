import { motion } from "framer-motion";
import { CheckCircle2, CalendarDays, Boxes } from "lucide-react";

import dashboard from "../../assets/dashboard-preview.png";

export default function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full max-w-2xl mx-auto lg:mx-0 lg:ml-auto"
    >
      {/* Floating Notification */}

      <motion.div
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="absolute -top-4 -right-6 z-20 hidden rounded-2xl border border-white/10 bg-[#111827]/90 py-4 px-4 backdrop-blur-xl lg:block"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green-400" />

          <div>
            <p className="font-semibold text-white">
              Asset Assigned
            </p>

            <p className="text-xs text-slate-400">
              Laptop AF-102 allocated
            </p>
          </div>
        </div>
      </motion.div>

      {/* Screenshot */}

      <motion.img
        whileHover={{
          scale: 1.02,
          rotateX: 3,
          rotateY: -3,
        }}
        transition={{
          duration: .4,
        }}
        src={dashboard}
        alt="Dashboard Preview"
        className="w-full h-auto rounded-3xl border border-white/10 shadow-[0_20px_80px_rgba(37,99,235,.35)]"
      />

      {/* Bottom Left */}

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
        }}
        className="absolute -bottom-6 -left-8 hidden rounded-2xl border border-white/10 bg-[#111827]/90 py-4 px-4 backdrop-blur-xl xl:block"
      >
        <div className="flex items-center gap-3">

          <Boxes className="text-cyan-400" />

          <div>

            <h3 className="text-2xl font-bold text-white">

              1,245

            </h3>

            <p className="text-sm text-slate-400">

              Assets

            </p>

          </div>

        </div>

      </motion.div>

      {/* Bottom Right */}

      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
        }}
        className="absolute -bottom-6 -right-8 hidden rounded-2xl border border-white/10 bg-[#111827]/90 py-4 px-4 backdrop-blur-xl xl:block"
      >
        <div className="flex items-center gap-3">

          <CalendarDays className="text-green-400" />

          <div>

            <h3 className="text-2xl font-bold text-white">

              64

            </h3>

            <p className="text-sm text-slate-400">

              Active Bookings

            </p>

          </div>

        </div>

      </motion.div>
    </motion.div>
  );
}