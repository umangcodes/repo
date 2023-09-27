import { useRef, useState } from "react";
import Reaptcha from "reaptcha";
import { LOADER, LOADER_PRIMARY } from "../assets";

interface Props {
  handleCallback: any
}

const ReCaptcha: React.FC<Props> = ({ handleCallback }) => {
  const [errorMessage, setErrorMessage] = useState(false);
  const captchaRef = useRef<Reaptcha>(null);
  const [loading, setLoading] = useState(true);


  function onLoad() {
    setLoading(false);
  }

  function onVerify(value: any) {
    setLoading(true);
    const apiUrl = process.env.REACT_APP_VERIFY_RECAPTCHA_API!;
    fetch(`${apiUrl}?response=${value}`, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          handleCallback()
        } else {
          captchaRef.current?.reset();
          setErrorMessage(true);
        }
        setLoading(false);
      }).catch((err) => {
        console.log(err);
        captchaRef.current?.reset();
        setErrorMessage(true);
        setLoading(false);
      })
  }


  return (
    <div className="flex flex-col items-center">
      <Reaptcha
        ref={captchaRef}
        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
        onLoad={onLoad}
        onVerify={onVerify} />
      {loading && <img src={LOADER_PRIMARY} className="h-16" />}
      {errorMessage && <p className="text-sm text-red-400 my-4">Something went wrong</p>}
    </div>
  )
}

export default ReCaptcha;