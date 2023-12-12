import { APICall} from "./GenericAPI"
import { API_URL } from "./api.config"

const getVirtualDate = async () => {
  try {
    const res = await APICall(API_URL + "/virtualclock");
    return res;
  } catch (error) {
    console.log(error);
    return { error };
  }
}

const updateVirtualDate = async (newDate) => {
  try {
    const res = await APICall(API_URL + "/virtualclock", "PUT", JSON.stringify({ date: newDate }));
    return res;
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export { getVirtualDate, updateVirtualDate }