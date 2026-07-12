import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  PackagePlus,
  UserCheck,
  Wrench,
  ClipboardCheck,
  BarChart3,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

const workflow = [
  {
    title: "Organization Setup",
    desc: "Admin creates departments, categories and employees.",
    icon: Building2,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Register Assets",
    desc: "Assets are registered with unique Asset IDs and QR Codes.",
    icon: PackagePlus,
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Allocate Assets",
    desc: "Assets are assigned to employees or departments.",
    icon: UserCheck,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Maintenance",
    desc: "Approval workflow handles repair requests efficiently.",
    icon: Wrench,
    color: "from-orange-500 to-yellow-500",
  },
  {
    title: "Asset Audit",
    desc: "Auditors verify assets and discrepancies automatically.",
    icon: ClipboardCheck,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Analytics",
    desc: "Generate reports and monitor utilization trends.",
    icon: BarChart3,
    color: "from-cyan-500 to-blue-500",
  },
];

export default function Workflow() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.scrollBehavior = "auto";
    };

    const onMouseLeave = () => {
      isDown = false;
    };

    const onMouseUp = () => {
      isDown = false;
      el.style.scrollBehavior = "smooth";
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section id="workflow" className="relative overflow-hidden bg-[#08111F] pt-12 pb-20">
      <style>{`
        .custom-scrollbar-hide::-webkit-scrollbar {
          display: none !important;
        }
        .custom-scrollbar-hide {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
          cursor: grab;
          user-select: none;
        }
        .custom-scrollbar-hide:active {
          cursor: grabbing;
        }
      `}</style>

      {/* Background */}

      <div className="absolute left-0 top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-[150px]" />

      <div className="absolute right-0 bottom-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >

          <h2 className="text-4xl font-black text-white md:text-5xl">

            Complete

            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

              {" "}Asset Lifecycle

            </span>

          </h2>

          <p className="mt-5 text-lg text-slate-400">

            Every asset moves through a structured workflow from
            registration to reporting.

          </p>

        </motion.div>

        {/* Desktop */}

        <div className="hidden xl:block">
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden py-10 px-4 custom-scrollbar-hide scroll-smooth"
          >
            <div className="flex w-max items-center px-2">

              {workflow.map((step, index) => (
                <div
                  key={step.title}
                  className="flex items-center shrink-0"
                >

                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * .15,
                    }}
                    whileHover={{
                      y: -10,
                    }}
                    className="group relative w-64 rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-xl"
                  >

                    <div
                      className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${step.color}`}
                    >

                      <step.icon
                        className="text-white"
                        size={30}
                      />

                    </div>

                    <h3 className="text-xl font-bold text-white">

                      {step.title}

                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-400">

                      {step.desc}

                    </p>

                    <div className="absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:scale-150" />

                  </motion.div>

                  {index !== workflow.length - 1 && (
                    <ArrowRight
                      size={40}
                      className="mx-6 text-cyan-400 shrink-0"
                    />
                  )}

                </div>
              ))}

            </div>
          </div>
        </div>

        {/* Mobile */}

        <div className="space-y-8 xl:hidden">

          {workflow.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * .12,
              }}
            >

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-xl">

                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${step.color}`}
                >

                  <step.icon
                    className="text-white"
                    size={30}
                  />

                </div>

                <h3 className="text-xl font-bold text-white">

                  {step.title}

                </h3>

                <p className="mt-4 leading-7 text-slate-400">

                  {step.desc}

                </p>

              </div>

              {index !== workflow.length - 1 && (
                <div className="flex justify-center py-4">

                  <ArrowDown
                    size={34}
                    className="text-cyan-400"
                  />

                </div>
              )}

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}