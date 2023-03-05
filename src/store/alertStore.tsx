import * as React from 'react';
import { ALERT_TYPE } from "~/types/alert-types";

const useAlertStore = () => {
  const [alert, setAlert] = React.useState<Alert | null>({
    showAlert: false,
    alertMessage: "",
    alertType: 'INFO'
  });

  return {
    alert,
    setAlert: (alert: Alert | null) => setAlert(alert)
  }
}

interface AlertContextType {
  alert: Alert | null,
  setAlert: (alert: Alert | null) => void
}

export interface Alert {
  showAlert: boolean;
  alertType: keyof typeof ALERT_TYPE;
  alertMessage: string
}

const AlertContext = React.createContext<AlertContextType | null>(null);

export const AlertContextProvider = ({ children }: { children: React.ReactNode}) => (
  <AlertContext.Provider value={useAlertStore()} >
    {children}
  </AlertContext.Provider>
);

export const useAlert = () => React.useContext(AlertContext)!.alert;
export const useSetAlert = () => React.useContext(AlertContext)!.setAlert;