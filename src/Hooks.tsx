import { useContext } from "react";
import { ContextApi } from "../src/Context/ContextApi";
const useUserContext = () => {
    const context = useContext(ContextApi);
    if (!context) {
        throw new Error("useUserContext must be used within a UserContext Provider");
    }
    return context;
};

export default useUserContext;