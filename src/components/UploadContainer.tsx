import React from "react";
// import Webcam from "react-webcam";
import axios from "axios";
import { ref, uploadBytes } from "firebase/storage";
import { useDropzone } from "react-dropzone";
import { toast, Toaster } from "react-hot-toast";
import useScript from "react-use-scripts";
import { CAMERA, CLOSE_RED, LOADER_PRIMARY, MENU, PLUS } from "../assets";
import { storage } from "../firebase";
// import modelUrl from "./card_detection_model.tflite";
import Portal from "./Portal";
import ScanImage from "./ScanImage";

const convertBase64ToBlob = (base64Image: any) => {
  // Split into two parts
  const parts = base64Image.split(";base64,");

  // Hold the content type
  const imageType = parts[0].split(":")[1];

  // Decode Base64 string
  const decodedData = window.atob(parts[1]);

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length);

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: imageType });
};

const uploadImageToStorage = async (image: any) => {
  const file = convertBase64ToBlob(image);
  const storageRef = ref(storage, `dataset/healthcard-${new Date().toISOString()}.${file.type.split("/")[1]}`);
  await uploadBytes(storageRef, file);
};

function dataURLtoFile(dataurl: string, filename: string) {
  var arr = dataurl.split(','),
    // @ts-ignore
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const UploadImage = ({ model, onSuccess, step1Data }: any) => {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [imgSrc, setImgSrc] = React.useState<string | null | undefined>(null);
  const [capturedImage, setCapturedImage] = React.useState<File>();
  const [showOptions, setShowOptions] = React.useState(false);
  const [showCamera, setShowCamera] = React.useState(false);

  const { ready: pdfjsReady } = useScript({
    src: "https://mozilla.github.io/pdf.js/build/pdf.js",
  });

  React.useEffect(() => {
    if (step1Data.healthCardImage) {
      setImgSrc(step1Data.healthCardImage)
    }
  }, [step1Data]);


  function getImageFromCard(card: any, context: CanvasRenderingContext2D) {
    const x = card.originX;
    const y = card.originY;
    const width = card.width;
    const height = card.height;
    const imageData = context.getImageData(x, y, width, height);
    const tCanvas = document.createElement("canvas");
    tCanvas.width = width;
    tCanvas.height = height;
    const tCtx = tCanvas.getContext("2d");
    if (!tCtx) return;
    tCtx.rect(0, 0, width, height);
    tCtx.fillStyle = "white";
    tCtx.fill();
    tCtx.putImageData(imageData, 0, 0);
    return tCanvas.toDataURL("image/png", 1.0);
  }

  async function detectCardFromImage(canvas: HTMLCanvasElement,) {
    const predictions = await model.detect(canvas);
    const highConfidencePredictions = predictions.filter((p: { classes: { probability: number; }[]; }) => p.classes[0].probability > 0.4);
    const card = highConfidencePredictions[0]?.boundingBox;
    return card;
  }

  const ExtractData = async (imgSrc: string) => {
    // await uploadImageToStorage(imgSrc);
    const res = await axios.post(
      "https://healthcard-ocr.nn.r.appspot.com/scan",
      {
        image: imgSrc,
      }
    );
    if (res.data) {
      let invalidFieldsCount: any = Object.values(res.data)?.reduce(
        (acc, curr) => {
          //  @ts-ignore
          if (curr?.toLowerCase() === "not detected") return acc + 1;
          return acc;
        },
        0
      );
      if (invalidFieldsCount > 2) {
        // reset();
        // setImgSrc(null);
        toast.error("Blurry image detected. Please try again.");
        return null
      }
      return res.data
    }
  }

  const onDrop = React.useCallback(
    async (acceptedFiles: any[]) => {
      try {
        setShowOptions(false);
        setLoading(true);
        setResults(null);
        setImgSrc(null);

        const file = acceptedFiles[0];
        setCapturedImage(file)
        if (file.type === "application/pdf") {
          // https://gist.github.com/ichord/9808444
          const reader = new FileReader();
          reader.addEventListener("load", async () => {
            //  @ts-ignore
            const pdfjsLib = window["pdfjs-dist/build/pdf"];
            pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

            //  @ts-ignore
            const typedarray = new Uint8Array(reader.result);
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({
              canvasContext: context,
              viewport: viewport,
            }).promise;

            if (!context) return;
            await uploadImageToStorage(canvas.toDataURL("image/png", 1.0));
            const card = await detectCardFromImage(canvas)

            if (card) {
              const imgSrc = getImageFromCard(card, context);
              setImgSrc(imgSrc);
              console.log("run api");
              const res = await axios.post("https://healthcard-ocr.nn.r.appspot.com/scan", {
                image: imgSrc,
              });

              // let a = document.createElement("a");
              // a.href = imgSrc;
              // a.download = `healthcard-${new Date().toISOString()}.png`;
              // a.click();
              setResults(res.data);
              onSuccess({ ...res.data, healthCardImage: imgSrc })
              setLoading(false);
            } else {
              toast.error((t) => (
                <div
                  className="text-sm cursor-pointer"
                  onClick={() => {
                    toast.dismiss(t.id);
                  }}
                >
                  Couldn't find a card in the image.
                  <br /> Please try again.
                </div>
              ));
              setLoading(false);
            }
          });
          reader.readAsArrayBuffer(file);
        } else {
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
          const i = new Image();
          i.onload = () => {
            const reader = new FileReader();
            reader.addEventListener("load", async () => {
              const canvas = document.createElement("canvas");
              const WIDTH = i.width;
              const HEIGHT = i.height;
              canvas.width = WIDTH;
              canvas.height = HEIGHT;
              const context = canvas.getContext("2d");
              if (!context) return;
              context.drawImage(i, 0, 0, WIDTH, HEIGHT);
              const origImgSrc = canvas.toDataURL("image/png", 1.0);
              await uploadImageToStorage(origImgSrc);

              const card = await detectCardFromImage(canvas)
              // console.log(card);
              if (card) {
                const imgSrc = getImageFromCard(card, context);
                setImgSrc(imgSrc);
                const res = await axios.post("https://healthcard-ocr.nn.r.appspot.com/scan", {
                  image: imgSrc,
                });

                setResults(res.data);
                onSuccess({ ...res.data, healthCardImage: imgSrc })
                setLoading(false);
              } else {
                toast.error((t) => (
                  <div
                    className="text-sm cursor-pointer"
                    onClick={() => {
                      toast.dismiss(t.id);
                    }}
                  >
                    Couldn't find a card in the image.
                    <br /> Please try again.
                  </div>
                ));
                setLoading(false);
              }
            });
            reader.readAsDataURL(file);
          };

          i.src = file.preview;
        }
      } catch (e) {
        toast.error((t) => (
          <div
            className="text-sm cursor-pointer"
            onClick={() => {
              toast.dismiss(t.id);
            }}
          >
            Something went wrong.
            <br /> Please try again.
          </div>
        ));

        setLoading(false);
        setResults(null);
        setImgSrc(null);
      }
    },
    [model]
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop,
    onDropRejected: () => {
      toast.error((t) => (
        <div
          className="text-sm cursor-pointer"
          onClick={() => {
            toast.dismiss(t.id);
          }}
        >
          Please upload a valid image.
        </div>
      ));
    },
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
    },
  });

  const onImageTake = async (webcamRef: any) => {
    console.log("take Image");
    setShowCamera(false)
    setShowOptions(false);
    setResults(null);
    setImgSrc(null);
    setLoading(true);

    if (!webcamRef.current) return;
    const video = webcamRef.current.video;
    const canvas = document.createElement("canvas");
    const WIDTH = video.offsetWidth;
    const HEIGHT = video.offsetHeight;
    canvas.width = video.width = WIDTH;
    canvas.height = video.height = HEIGHT;
    const context = canvas.getContext("2d");
    if (!context) return;
    setCapturedImage(dataURLtoFile(canvas.toDataURL("image/png", 1.0), "file"));
    context.drawImage(video, 0, 0, WIDTH, HEIGHT);
    const card = await detectCardFromImage(canvas)

    if (card) {
      const imgSrc = getImageFromCard(card, context);
      setImgSrc(imgSrc);
      await uploadImageToStorage(imgSrc);
      if (!imgSrc) return;
      const data = await ExtractData(imgSrc);
      if (!data) {
        setLoading(false);
        setImgSrc(null);
        return;
      }
      setResults(data);
      onSuccess({ ...data, healthCardImage: imgSrc })
      setLoading(false)
    } else {
      toast.error((t) => (
        <div
          className="text-sm cursor-pointer"
          onClick={() => {
            toast.dismiss(t.id);
          }}
        >
          Couldn't find a card in the image.
          <br /> Please try again.
        </div>
      ));
      setLoading(false)
    }
  }

  const onImageDetect = async (imgSrc: string) => {
    console.log("deteted");
    setImgSrc(imgSrc)
    setLoading(true);
    setShowCamera(false)
    setShowOptions(false);
    const data = await ExtractData(imgSrc);
    if (!data) {
      setLoading(false);
      setImgSrc(null);
      return;
    }
    setResults(data);
    onSuccess({ ...data, healthCardImage: imgSrc })
    setLoading(false);
  }

  if (showCamera && showOptions) {
    return <ScanImage
      model={model}
      setShowCamera={setShowCamera}
      imagetake={onImageTake}
      onImageDetect={onImageDetect}
    />
  }

  if (!pdfjsReady) {
    return <div className="h-full w-full flex p-4 justify-center items-center">
      <img src={LOADER_PRIMARY} className="w-16 h-16" />
    </div>;
  }

  if (imgSrc) {
    return (
      <div className="w-full flex flex-col-reverse lg:flex-row items-start gap-5 my-5 lg:border-b border-black/50">
        <div className="w-full p-4 flex flex-col border border-black/40 rounded-sm mb-5">
          {/* <div className="flex items-center justify-between mb-7">
            <h3 className="text-sm font-medium">Uploaded</h3>
            <img src={CLOSE_RED} className="w-4 cursor-pointer" onClick={() => setLoading(false)} />
          </div> */}
          <div className="w-full flex items-center">
            <div className="w-[200px] h-24 mr-7">
              {imgSrc ?
                <img src={imgSrc} className="w-full h-full object-cover" />
                :
                <img src={URL.createObjectURL(capturedImage!)} className="w-full h-full object-cover" />
              }
            </div>
            {loading ?
              <div className="flex items-center gap-2">
                <img src={LOADER_PRIMARY} className="w-8 h-8" />
                <h3 className="text-sm font-medium">Extracting Data...</h3>
              </div>
              :
              <div className="">
                {!results ?
                  <h3 className="text-xs sm:text-sm font-semibold text-red-500">Details were not added successfully.<br />
                    Please try uploading again or enter the fields manually.
                    <span className="text-primary underline underline-offset-2 cursor-pointer mx-1"
                      onClick={() => {
                        setImgSrc(null);
                      }}>try again.</span></h3>
                  :
                  <h3 className="text-xs sm:text-sm font-semibold">Your details were added successfully.<br />
                    Incase of missing any data
                    <span className="text-primary underline underline-offset-2 cursor-pointer mx-1"
                      onClick={() => {
                        setImgSrc(null);
                      }}>try again.</span></h3>
                }
              </div>
            }

          </div>
        </div>
      </div >
    )
  }


  return (
    <div className="w-full flex flex-col-reverse lg:flex-row items-start gap-5 my-5 lg:border-b border-black/50">
      <>
        {loading &&
          <div className="w-full p-4 flex flex-col border border-black/40 rounded-sm mb-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <img src={LOADER_PRIMARY} className="w-8 h-8" />
                <h3 className="text-sm font-medium">Uploading...</h3>
              </div>
              <img src={CLOSE_RED} className="w-4 cursor-pointer" onClick={() => setLoading(false)} />
            </div>

            <div className="w-full flex items-start">
              <div className="min-w-[200px] h-24 mr-7">
                {capturedImage &&
                  <img src={URL.createObjectURL(capturedImage)} className="w-full h-full object-cover" />
                }
              </div>
            </div>
          </div>
        }

        {!loading &&
          <>
            <div {...getRootProps()} className="hidden lg:flex flex-col">
              <div className="relative w-40 h-32 border-2 border-dashed border-black/50 bg-white rounded-lg flex items-center justify-center cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                  <img src={PLUS} className="w-4" />
                  <input {...getInputProps()} />
                </div>
              </div>
              <p className="w-full text-xs text-center text-black my-2">(Upload .png, .jpg)</p>
            </div>

            {/* Mobile */}
            <div onClick={() => setShowOptions(true)} className="lg:hidden relative w-full h-24 bg-primary flex items-center justify-center rounded-xl">
              <div className="w-8 h-8 flex items-center justify-center mr-2 bg-priamry border-2 border-white rounded-full">
                <img src={PLUS} className="w-4" />
              </div>
              <h3 className="text-base font-medium text-white whitespace-nowrap">Scan Your Healthcard</h3>
              {/* <input type="file" className="absolute w-full h-full opacity-0 cursor-pointer" /> */}
            </div>

            <div className="w-full max-w-xl min-h-32 rounded-2xl px-5 py-7 bg-gradient-to-r from-primary/70 to-primary/40">
              <p className="text-sm text-black mb-2 font-medium">You can upload Health card simply by clicking the plus button to auto populate the form.</p>
              <p className="text-sm text-black mb-2 font-medium"><span className="font-bold">Note:</span> In case of error, Please try uploding again</p>
            </div>
          </>
        }
        {
          showOptions &&
          <Portal>
            <div className={`w-full h-screen min-h-screen fixed top-0 left-0`}>
              <div className="relative w-full h-full flex">
                <div className="absolute w-full h-full bg-black/70" onClick={() => setShowOptions(false)}></div>
                <div className={`absolute ${showOptions ? "bottom-14" : "top-full"} delay-300 transition-all w-full px-4 flex flex-col flex-grow`}>
                  <div className="w-full bg-white p-4 flex flex-col rounded-md">
                    <div className="w-full flex items-center justify-between py-2 border-b">
                      <h1 onClick={() => setShowCamera(true)} className="w-full flex font-medium">Scan Photo</h1>
                      <img src={CAMERA} className="w-6" />
                    </div>
                    <div {...getRootProps()} className="relative w-full flex items-center justify-between py-2 border-b">
                      <h1 className="w-full flex font-medium">Browse</h1>
                      <img src={MENU} className="w-6" />
                    </div>
                  </div>
                  <div onClick={() => setShowOptions(false)} className="w-full bg-white p-2 flex flex-col items-center rounded-md my-2">
                    <h1 className="w-full py-2 border-b text-primary text-center">Cancel</h1>
                  </div>
                </div>

              </div>
            </div>
          </Portal>
        }
      </>
    </div>

  );
};

const UploadContainer = ({ step1Data, setStep1Data }: any) => {
  const [model, setModel] = React.useState(null);
  const { ready: tfjsReady } = useScript({
    src: "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js",
  });
  const { ready: cocoSsdReady } = useScript({
    src: "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd",
  });
  const { ready: tfliteReady } = useScript({
    src: "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/tf-tflite.min.js",
  });

  React.useEffect(() => {
    if (!tfjsReady || !cocoSsdReady || !tfliteReady) {
      return;
    }

    //  @ts-ignore
    window.tflite.ObjectDetector.create("./card_detection_model.tflite").then((model) => {
      setModel(model);
    });

    return () => {
      setModel(null);
    };
  }, [tfjsReady, cocoSsdReady, tfliteReady]);

  if (!model) {
    return <div className="w-full flex p-4 justify-center items-center">
      <img src={LOADER_PRIMARY} className="w-16 h-16" />
    </div>;
  }

  const onSuccess = (result: any) => {
    let data = {
      dateOfBirth: result["dob"],
      expiryDate: result["expDate"],
      firstName: result["firstname"],
      healthCardID: result["heathcard"],
      issueDate: result["issueDate"],
      lastName: result["lastname"],
      middleName: "",
      sex: "",
      signature: "",
      healthCardImage: result["healthCardImage"],
    }
    data.healthCardID = data.healthCardID.toString().slice(0, 4) + "-" + data.healthCardID.toString().slice(4, 7) + "-" + data.healthCardID.toString().slice(7, 10) + "-" + data.healthCardID.toString().slice(10,);
    data.issueDate = data.issueDate.toString().slice(0, 4) + "-" + data.issueDate.toString().slice(4, 6) + "-" + data.issueDate.toString().slice(6,)
    data.expiryDate = data.expiryDate.toString().slice(0, 4) + "-" + data.expiryDate.toString().slice(4, 6) + "-" + data.expiryDate.toString().slice(6,)
    data.dateOfBirth = data.dateOfBirth.toString().slice(0, 4) + "-" + data.dateOfBirth.toString().slice(4, 6) + "-" + data.dateOfBirth.toString().slice(6,)
    setStep1Data(data);
  }

  return (
    <>
      <UploadImage step1Data={step1Data} model={model} onSuccess={onSuccess} />
      <Toaster toastOptions={{
        className: "z-[9999]"
      }} />
    </>
  );

};

export default UploadContainer;
