import Webcam from "react-webcam";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const WebcamCapture = () => (
    <Webcam
        audio={false}
        height={180}
        screenshotFormat="image/jpeg"
        width={320}
        videoConstraints={videoConstraints}
    >
        {({ getScreenshot }) => (
            <button
                onClick={() => {
                    const imageSrc = getScreenshot()
                }}
            >
                Capture photo
            </button>
        )}
    </Webcam>
);
export default function Test3(){
    return WebcamCapture();
}