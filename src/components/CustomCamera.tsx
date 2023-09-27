import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { PLUS } from "../assets";
import Portal from "./Portal";

interface Props {
  setShowCamera: any,
  setCapturedPic: any,
  setShowOptions: any
}


const CustomCamera: React.FC<Props> = ({ setShowCamera, setCapturedPic, setShowOptions }) => {
  const [tempImages, setTempImages] = useState(0);

  var constraints = {
    video: {
      facingMode: "environment",
      // width: { min: 1280 },
      // height: { min: 720 }
    }, audio: false
  };
  const cameraViewRef = useRef<HTMLVideoElement>(null);
  const [track, setTrack] = useState<MediaStreamTrack[]>();
  const cameraSensorRef = useRef<HTMLCanvasElement>(null);
  const cardAreaRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLImageElement>(null);

  const innerRef = useRef<HTMLDivElement>(null);

  const borderX = Math.round(window.innerWidth * 0.1);
  const width = Math.round(window.innerWidth) - (borderX * 2);
  const height = (3 / 4) * width;
  const borderY = (Math.round(window.innerHeight) - height) / 2

  function cameraStart() {
    // console.log("cameraRef", cameraViewRef.current);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        // console.log("stream", stream);
        let tracks = stream.getTracks();
        // @ts-ignore
        setTrack(tracks);
        // if (cameraViewRef.current?.srcObject) {
        // @ts-ignore
        cameraViewRef.current.srcObject = stream;
        // }
      })
      .catch(function (error) {
        console.error("Oops. Something is broken.", error);
      });
  }


  useLayoutEffect(() => {
    cameraStart();
    // return () => stop();
  }, [cameraViewRef]);

  const stop = () => {
    if (track && cameraViewRef.current) {
      track.forEach((track) => {
        track.stop();
      });
      cameraViewRef.current.srcObject = null;
      setShowCamera(false);
    }
    setShowCamera(false);
  };

  useEffect(() => {
    if (cameraViewRef.current) {
      let timer = setTimeout(() => {
        getReferenceBoxImage(0)
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [cameraViewRef.current]);


  const detectCardImage = async (image: string) => {
    let lastIndex = image.lastIndexOf(",") + 1;
    let base64Image = image.slice(lastIndex,);

    var myHeaders = new Headers();
    myHeaders.append("API_KEY", process.env.REACT_APP_DETECT_API_KEY!);
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ "image": base64Image }),
      redirect: 'follow'
    };
    return new Promise(async (res, rej) => {
      try {
        // @ts-ignore
        const response = await fetch(process.env.REACT_APP_DETECT_API!, requestOptions);
        const result_1 = await response.json();
        console.log(result_1);
        res(result_1.respone);
      } catch (err) {
        console.log(err);
        res(err);
      }
    })

  }

  const getReferenceBoxImage = async (attempts: number) => {
    if (
      cameraSensorRef.current &&
      outputRef.current &&
      cameraViewRef.current &&
      cardAreaRef.current
    ) {
      const x = Math.round(cameraViewRef.current.videoWidth * 0.1);
      const y = Math.round(cameraViewRef.current.videoHeight * 0.3);

      let cardAreaWidth = Math.round(cameraViewRef.current.videoWidth - x * 2);
      let cardAreaHeight = Math.round(
        cameraViewRef.current.videoHeight - y * 2
      );

      cameraSensorRef.current.width = cameraViewRef.current.videoWidth;
      cameraSensorRef.current.height = cameraViewRef.current.videoHeight;

      cameraSensorRef.current
        .getContext("2d")
        ?.drawImage(
          cameraViewRef.current,
          x,
          y,
          cardAreaWidth,
          cardAreaHeight,
          x,
          y,
          cardAreaWidth,
          cardAreaHeight
        );
      const image = cameraSensorRef.current.toDataURL("image/png");
      // console.log(image);

      let res = await detectCardImage(image);
      console.log(res);

      if (res === "True") {
        setShowOptions(false)
        setCapturedPic(image);
        setShowCamera(false);
      } else {
        setTempImages(attempts + 1);
        if (attempts + 1 <= 2) {
          getReferenceBoxImage(attempts + 1);
        } else {
          setShowOptions(false)
          setShowCamera(false);
          return;
        }
      }
    }
  }

  const onCapture = () => {
    if (
      cameraSensorRef.current &&
      outputRef.current &&
      cameraViewRef.current &&
      cardAreaRef.current
    ) {
      const x = Math.round(cameraViewRef.current.videoWidth * 0.1);
      const y = Math.round(cameraViewRef.current.videoHeight * 0.3);

      let cardAreaWidth = Math.round(cameraViewRef.current.videoWidth - x * 2);
      let cardAreaHeight = Math.round(
        cameraViewRef.current.videoHeight - y * 2
      );
      console.log(x, y, cardAreaWidth, cardAreaHeight);

      cameraSensorRef.current.width = cameraViewRef.current.videoWidth;
      cameraSensorRef.current.height = cameraViewRef.current.videoHeight;

      cameraSensorRef.current
        .getContext("2d")
        ?.drawImage(
          cameraViewRef.current,
          x,
          y,
          cardAreaWidth,
          cardAreaHeight,
          x,
          y,
          cardAreaWidth,
          cardAreaHeight
        );
      const image = cameraSensorRef.current.toDataURL("image/png");
      console.log(image);
      setCapturedPic(image);
      setShowOptions(false)
      // stop();

      // cameraSensorRef.current.toBlob((blob) => {
      //   console.log(blob);
      //   // @ts-ignore
      //   setCapturedPic(URL.createObjectURL(blob))
      //   if (blob && outputRef.current) {
      //     // outputRef.current.src = URL.createObjectURL(blob);
      //   }
      // });
      setShowCamera(false);
    }
  };

  return (

    <Portal>
      <div className="fixed top-0 left-0 w-full h-full z-50">
        <div className="relative w-full h-full">
          <video
            ref={cameraViewRef}
            className="w-full h-full object-cover z-10"
            id="camera--view"
            autoPlay
            playsInline
            controls={false}
          ></video>

          <div className="absolute right-4 top-4 z-50" onClick={() => stop()}>
            <img src={PLUS} className="rotate-45 w-6 cursor-pointer" />
            {/* <MdClose
                  className="text-2xl text-white cursor-pointer"
                  onClick={() => stop()}
                /> */}
            {/* <div className="text-white">
              {width} X {height}<br />
              {(Math.round(window.screen.height) - height) / 2} <br />
              {(Math.round(window.screen.height))}
            </div> */}
          </div>

          <div
            onClick={() => onCapture()}
            className="w-16 h-16 p-2 rounded-full border-2 flex items-center justify-center border-white absolute left-1/2 -translate-x-1/2 bottom-5 z-50"
          >
            <div className="w-12 h-12 bg-white rounded-full"></div>
          </div>

          {/* <p className="text-white text-sm absolute top-2 left-2">Debug: Attemps {tempImages}</p> */}
          <div
            ref={innerRef}
            style={{
              borderTopWidth: `${borderY}px`,
              borderBottomWidth: `${borderY}px`,
              borderRightWidth: `${borderX}px`,
              borderLeftWidth: `${borderX}px`
            }}
            className={`w-full h-full absolute top-0 left-0 border-black/70 z-30`}
          >
            <h3 className="text-base text-white text-center absolute -top-10 left-1/2 -translate-x-1/2">Please place your card in this box</h3>
            <div className="absolute -top-1 left-0 w-10 h-1 bg-white"></div>
            <div className="absolute -top-1 right-0 w-10 h-1 bg-white"></div>
            <div className="absolute -top-1 -left-1 w-1 h-12 bg-white"></div>
            <div className="absolute -top-1 -right-1 w-1 h-12 bg-white"></div>

            <div className="absolute -bottom-1 left-0 w-10 h-1 bg-white"></div>
            <div className="absolute -bottom-1 right-0 w-10 h-1 bg-white"></div>
            <div className="absolute -bottom-1 -left-1 w-1 h-12 bg-white"></div>
            <div className="absolute -bottom-1 -right-1 w-1 h-12 bg-white"></div>
            <div ref={cardAreaRef} className="w-full h-full"></div>
          </div>
        </div>
        <canvas
          ref={cameraSensorRef}
          id="camera--sensor"
          className="hidden border border-black"
        ></canvas>

        <img
          ref={outputRef}
          src="//:0"
          alt=""
          id="camera--output"
          className="w-48 h-48 object-contain bg-gray-600"
        />
        <a href={outputRef.current?.src} download>
          download
        </a>
      </div>

    </Portal>


  );
};

export default CustomCamera;
