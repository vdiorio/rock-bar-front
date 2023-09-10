import { NavigateFunction } from "react-router-dom";
import { errorToast } from "./toasts";

export const redirectAndClearStorage = (navigate: NavigateFunction) => {
  errorToast("Não autorizado");
  navigate("/login");
  localStorage.clear();
};
