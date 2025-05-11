import type { SortDirection } from "@tanstack/react-table";
import {
    ArrowDown10,
    ArrowDownZA,
    ArrowUp01,
    ArrowUpAZ,
    ArrowUpDown,
  } from "lucide-react";
  import { AnimatePresence, motion } from "motion/react";
  
  export const SortIcon = ({ isSorted, isNumber }: {isSorted: false | SortDirection, isNumber?: boolean}) => {
    const iconClasses = "h-4 w-4";
    const upIcon = isNumber ? <ArrowUp01 className={iconClasses} /> : <ArrowUpAZ />;
    const downIcon = isNumber ? (
      <ArrowDown10 className={iconClasses} />
    ) : (
      <ArrowDownZA />
    );
  
    const renderIcon = () => {
      if (isSorted) {
        return isSorted === "asc" ? upIcon : downIcon;
      }
      return <ArrowUpDown className={iconClasses} />;
    };
  
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={String(isSorted)}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{
            ease: "easeInOut",
            duration: 0.2,
          }}
        >
          {renderIcon()}
        </motion.div>
      </AnimatePresence>
    );
  };
  