import { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";

const ActionMenu = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (e, onClick) => {
    e.stopPropagation(); // prevent row click
    setIsOpen(false);
    if (onClick) onClick();
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <FiMoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-200">
          <div className="py-1">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={(e) => handleAction(e, action.onClick)}
                className={`flex w-full items-center px-4 py-2 text-sm transition-colors ${
                  action.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
