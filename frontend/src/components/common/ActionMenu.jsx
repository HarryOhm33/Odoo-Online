import { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { createPortal } from "react-dom";

const ActionMenu = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", () => setIsOpen(false), true);
      window.addEventListener("resize", () => setIsOpen(false));
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", () => setIsOpen(false), true);
      window.removeEventListener("resize", () => setIsOpen(false));
    };
  }, [isOpen]);

  const handleAction = (e, onClick) => {
    e.stopPropagation(); // prevent row click
    setIsOpen(false);
    if (onClick) onClick();
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Check if there's enough space below, if not, open upwards
      const spaceBelow = window.innerHeight - rect.bottom;
      const isUpwards = spaceBelow < 200; 

      setPosition({
        top: isUpwards ? undefined : rect.bottom + 4,
        bottom: isUpwards ? window.innerHeight - rect.top + 4 : undefined,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
      >
        <FiMoreVertical className="w-5 h-5" />
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: position.top,
            bottom: position.bottom,
            right: position.right,
            zIndex: 9999
          }}
          className="w-48 rounded-lg bg-[#0B172A] shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-white/10"
        >
          <div className="py-1">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={(e) => handleAction(e, action.onClick)}
                className={`flex w-full items-center px-4 py-2 text-sm transition-colors ${
                  action.danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ActionMenu;
