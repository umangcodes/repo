// @ts-nocheck
import React from "react";
import Webcam from "react-webcam";
import { LOADER } from "../assets";
import Portal from "./Portal";

function useInterval(callback, delay) {
  const intervalRef = React.useRef(null);
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === "number") {
      intervalRef.current = window.setInterval(tick, delay);
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);
  return intervalRef;
}

function useDelay(delay) {
  const [ready, setReady] = React.useState(false);

  const reset = React.useCallback(() => setReady(false), []);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!ready) {
        setReady(true);
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay, ready]);
  return { ready, reset };
}

const ScanImage = ({ model, setShowCamera, imagetake, onImageDetect }: any) => {
  const [loading, setLoading] = React.useState(false);
  const webcamRef = React.useRef(null);
  const { ready, reset } = useDelay(3000);

  const borderX = Math.round(window.innerWidth * 0.1);
  const width = Math.round(window.innerWidth) - (borderX * 2);
  const height = (3 / 4) * width;
  const borderY = (Math.round(window.innerHeight) - height) / 2

  React.useEffect(() => {
    setTimeout(() => {
      setShowCamera(false);
      // toast.error((t) => (
      //   <div
      //     className="text-sm cursor-pointer"
      //     onClick={() => {
      //       toast.dismiss(t.id);
      //     }}
      //   >
      //     Couldn't find a card in the image.
      //     <br /> Please try again.
      //   </div>
      // ));
    }, 30000)
  }, []);

  const onCapture = async () => {
    if (!webcamRef.current) return;
    setLoading(true);
    const video = webcamRef.current.video;
    const canvas = document.createElement("canvas");
    const WIDTH = video.offsetWidth;
    const HEIGHT = video.offsetHeight;
    canvas.width = video.width = WIDTH;
    canvas.height = video.height = HEIGHT;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, WIDTH, HEIGHT);

    const predictions = await model.detect(canvas);
    const highConfidencePredictions = predictions.filter(
      (p) => p.classes[0].probability > 0.4
    );
    const card = highConfidencePredictions[0]?.boundingBox;

    if (card) {
      const x = card.originX;
      const y = card.originY;
      const width = card.width;
      const height = card.height;
      const imageData = context.getImageData(x, y, width, height);

      const tCanvas = document.createElement("canvas");
      tCanvas.width = width;
      tCanvas.height = height;
      const tCtx = tCanvas.getContext("2d");
      tCtx.rect(0, 0, width, height);
      tCtx.fillStyle = "white";
      tCtx.fill();
      tCtx.putImageData(imageData, 0, 0);

      const imgSrc = tCanvas.toDataURL("image/png", 1.0);
      onImageDetect(imgSrc);
      setLoading(false);
      reset();
    } else {
      // toast.error((t) => (
      //   <div
      //     className="text-sm cursor-pointer"
      //     onClick={() => {
      //       toast.dismiss(t.id);
      //     }}
      //   >
      //     Couldn't find a card in the image.
      //     <br /> Please try again.
      //   </div>
      // ));
      setLoading(false);
    }
  };

  useInterval(onCapture, !ready ? null : 500);

  return (
    <Portal>
      <div className="fixed top-0 left-0 w-full h-full z-50">
        <>
          <div className="relative w-full h-full">
            <Webcam
              className="md:aspect-video h-full w-full object-cover"
              id="take-cam"
              ref={webcamRef}
              screenshotFormat="image/png"
              screenshotQuality={1}
              videoConstraints={{
                facingMode: "environment",
                width: 1920,
                height: 1080,
              }}
            />
            {ready ?
              <>
                <div
                  style={{
                    borderTopWidth: `${borderY}px`,
                    borderBottomWidth: `${borderY}px`,
                    borderRightWidth: `${borderX}px`,
                    borderLeftWidth: `${borderX}px`
                  }}
                  className={`w-full h-full absolute top-0 left-0 border-black/70 z-30`}
                >
                  <h3 className="text-base text-white text-center absolute -top-14 left-1/2 -translate-x-1/2">Please place your card in this box</h3>

                  <div className="absolute -top-1 left-0 w-10 h-1 bg-white"></div>
                  <div className="absolute -top-1 right-0 w-10 h-1 bg-white"></div>
                  <div className="absolute -top-1 -left-1 w-1 h-12 bg-white"></div>
                  <div className="absolute -top-1 -right-1 w-1 h-12 bg-white"></div>

                  <div className="absolute -bottom-1 left-0 w-10 h-1 bg-white"></div>
                  <div className="absolute -bottom-1 right-0 w-10 h-1 bg-white"></div>
                  <div className="absolute -bottom-1 -left-1 w-1 h-12 bg-white"></div>
                  <div className="absolute -bottom-1 -right-1 w-1 h-12 bg-white"></div>
                  <div className="w-full h-full"></div>
                  {loading &&
                    <div className="absolute top-[120%] left-1/2 -translate-x-1/2 flex items-center gap-4">
                      <img src={LOADER} className="w-6 h-6" />
                      <h3 className="text-base text-white text-center ">Scanning...</h3>
                    </div>
                  }
                </div>

                <div onClick={() => imagetake(webcamRef)}
                  className="w-16 h-16 p-2 rounded-full border-2 flex items-center justify-center border-white absolute left-1/2 -translate-x-1/2 bottom-5 z-50">
                  <div className="w-12 h-12 bg-white rounded-full"></div>
                </div>
              </>
              :
              <div className="w-full h-full absolute top-0 left-0 bg-black/70 flex flex-col gap-4 items-center justify-center z-30">
                <img src={LOADER} className="w-20 h-20" />
                <h3 className="text-base text-white text-center">Please wait</h3>
              </div>
            }

          </div>
        </>
      </div>
    </Portal>
  );
};

export default ScanImage