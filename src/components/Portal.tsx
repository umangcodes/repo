import { useEffect, useState } from "react"
import ReactDOM from "react-dom"

const Portal = ({ children }: { children: JSX.Element }) => {
  const [portalDiv, setPortalDiv] = useState<HTMLElement | null>();

  useEffect(() => {
    setPortalDiv(document.getElementById("portal"));
  })
  return portalDiv ? ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full min-h-screen z-50">
      {children}
    </div>, portalDiv) : null
}

export default Portal