import React, { useEffect, SetStateAction } from 'react'
import { ALERT_TYPE } from '~/types/alert-types';

type AlertType = keyof typeof ALERT_TYPE;

function renderSvg(alertType: AlertType): React.ReactNode {
  if (ALERT_TYPE[alertType] === ALERT_TYPE.INFO) {
    return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>)
  }
  else if (ALERT_TYPE[alertType] === ALERT_TYPE.SUCCESS) {
    return (<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)
  }
  else if (ALERT_TYPE[alertType] === ALERT_TYPE.WARNING) {
    return (<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>)
  }
  else if (ALERT_TYPE[alertType] === ALERT_TYPE.ERROR) {
    return (<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)
  }
  else {
    /* Info icon in blue */
    return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>)
  }
}

interface Props {
  alertType: AlertType
  alertMessage: string
  setShowAlert: (value: SetStateAction<Boolean>) => void
}

export const Alert: React.FC<Props> = ({alertType, alertMessage, setShowAlert}) => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAlert(false);
     }, 5000);

    return () => {
      clearTimeout(timeout);
    }
  }, [])

  const bgColor = ALERT_TYPE[alertType] === ALERT_TYPE.INFO
    ? "bg-sky-400"
    : ALERT_TYPE[alertType] === ALERT_TYPE.SUCCESS
      ? "bg-teal-400"
      : ALERT_TYPE[alertType] === ALERT_TYPE.WARNING
        ? "bg-yellow-300"
        : ALERT_TYPE[alertType] === ALERT_TYPE.ERROR
          ? "bg-rose-500"
          : "bg-slate-200";

  return (
    <div className={`alert alert-${ALERT_TYPE[alertType]} shadow-lg ${bgColor} transition delay-700 duration-300 ease-in-out `}>
      <div>
        {renderSvg(alertType)}
        <span>{alertMessage}</span>
      </div>
    </div>
  );
}