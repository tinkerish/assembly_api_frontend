import { useState, useEffect, useRef } from "react";
import record from "./assets/record.png";
import recording from "./assets/recording.png";
function SimpleRecordButton({ onChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const RECORDING_MAX_DURATION = 240;

  useEffect(() => {
    if (!audioStream) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setAudioStream(stream);
          const mediaRecorder = new MediaRecorder(stream);
          setMediaRecorder(mediaRecorder);
          let audio;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audio = [event.data];
            }
          };

          mediaRecorder.onstop = (event) => {
            const b = new Blob(audio, { type: "audio/wav" });
            setAudioBlob(b);
            onChange(b);
            console.log("audioBlob", b);
          };
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [audioStream]);

  const handleToggleRecording = (event) => {
    event.preventDefault();
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
    setAudioBlob(null);
    onChange(null);
    timerRef.current = setInterval(() => {
      setRecordingTime((prevTime) => {
        if (prevTime >= RECORDING_MAX_DURATION - 1) {
          stopRecording();
          return RECORDING_MAX_DURATION;
        }
        return prevTime + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <button
        onClick={handleToggleRecording}
        className={` hover:border-gray-600 font-bold rounded-full`}
      >
        <img
          src={isRecording ? recording : record}
          alt="mic"
          className={`w-20 ${isRecording && "animate-pulse"}`}
        />
      </button>
      <div>
        {isRecording && (
          <div>
            <p>Time: {formatTime(recordingTime)}</p>
          </div>
        )}
      </div>
      {audioBlob && (
        <div className="flex flex-col items-center justify-center">
          <audio controls className="w-[100%]">
            <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
          </audio>
          <div>Preview recording before submitting. You can record again.</div>
        </div>
      )}
    </div>
  );
}

export default SimpleRecordButton;
