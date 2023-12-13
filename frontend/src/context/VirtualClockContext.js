
/**
 * ! VIRTUAL_CLOCK: remove this component in production
 * ********* WARNING: ONLY FOR DEV SIMULATION PURPOSES ***********
 * Context used to set the current virtual date
 */

import { createContext, useEffect, useState } from "react";
import { getVirtualDate, updateVirtualDate } from "../api/VirtualClockAPI";
import { useNavigate } from "react-router-dom";

export const VirtualClockContext = createContext();

export const VirtualClockProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState("");
  const navigate = useNavigate();

  const fetchVirtualDate = async () => {
    const res = await getVirtualDate();
    res?.error ? setCurrentDate("") : setCurrentDate(res.date);
  }

  const updateCurrentDate = async (newDate) => {
    const res = await updateVirtualDate(newDate);
    !res?.error && setCurrentDate(res.date);
  }

  useEffect(() => {
    fetchVirtualDate();
  }, [navigate]);
  /*
   * navigate in the dependency list because I want to re-render this component
   * every time the url changes.
   * In this way if someone changed the virtual date
   * while I was in a certain URL, when I change page I will fetch the udpated
   * virtual date.
   * Using an SSE was too much for a simple development feature, so I think
   * this is the best way to keep the virtual clock updated very often.
   * Obviously this means more calls to the API, so more connection, but
   * it won't be a problem when this component is removed in production.
   */

  return (
    <VirtualClockContext.Provider value={{ currentDate, updateCurrentDate }}>
      {children}
    </VirtualClockContext.Provider>
  );
};
