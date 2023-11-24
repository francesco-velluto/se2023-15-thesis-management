import { createContext, useState } from "react";
import dayjs from "dayjs";

export const VirtualClockContext = createContext();

/**
 * ********* WARNING: ONLY FOR DEV SIMULATION PURPOSES ***********
 * Context used to set the current date (only dates after the actual date)
 */
export const VirtualClockProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));

  return (
    <VirtualClockContext.Provider value={{ currentDate, setCurrentDate }}>
      {children}
    </VirtualClockContext.Provider>
  );
};
