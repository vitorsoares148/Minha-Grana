import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";

import { cn } from "../../utils/cn";
import { CATEGORIES, type Category } from "../../constants/categories";

type CategoryDropdownProps = {
  selectedCategory: Category | undefined;
  setCategory: (category: number) => void;
};

export default function CategoryDropdown({
  selectedCategory,
  setCategory,
}: CategoryDropdownProps) {
  const [openCategory, setOpenCategory] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideCategory = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setOpenCategory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideCategory);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCategory);
    };
  }, []);

  const handleCategoryChange = (id: number) => {
    setCategory(id);
    setOpenCategory(false);
  };

  return (
    <div ref={categoryRef} className="relative">
      <div
        onClick={() => setOpenCategory((prev) => !prev)}
        className={cn(
          "flex w-fit items-center gap-1",
          "cursor-pointer rounded-xl border-2 border-white/8",
          "py-2 pr-2 pl-3",
          "bg-neutral-900 font-sans text-[20px] font-semibold",
          "transition duration-200 ease-in-out",

          openCategory &&
            "border-white/50 shadow-[0_0_20px_rgba(200,200,200,0.1)] outline-0 brightness-140",
        )}
      >
        <div>
          {selectedCategory?.emoji}
          {selectedCategory?.name}
        </div>

        <FaAngleDown className="mt-1.5 h-4 w-4" />
      </div>

      {openCategory && (
        <div
          className={cn(
            "absolute bottom-full left-0 z-50",
            "w-44 overflow-hidden rounded-lg",
            "border-2 border-white/8 text-white",
            "bg-neutral-900/80 backdrop-blur-xl",
          )}
        >
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              onClick={() => handleCategoryChange(item.id)}
              className={cn(
                "block w-full px-3 py-2 text-left",
                "text-[18px] text-white",
                "hover:bg-white/8 hover:text-white",
              )}
            >
              {item.emoji}
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
