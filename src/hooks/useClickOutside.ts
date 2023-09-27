// @ts-nocheck
import { useEffect, useRef } from "react";

export const useClickOutside = (elRef: any, callback: any) => {
  const callbackRef = useRef(null);
  callbackRef.current = callback;
  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (elRef.current && !elRef.current.contains(e.target)) {
        callbackRef.current(e);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [elRef, callback]);

}