import { useEffect, useRef, useState } from "react";
import Avatar from "avataaars";
const MOUTH_TYPES = ["Twinkle", "Smile", "Serious"];
const randomIndex = (length) => {
  return Math.floor(Math.random() * length);
};

function AvatarComponent({
  skinColor,
  eyeType,
  accessoriesType,
  clothes,
  topType,
  facialHairType,
  hairColor,
  clothesColor,
  eyebrowType,
  isSpeaking,
  content,
  animalSound,
  isEvenLeft,
  isEvenRight,
}) {
  const [mouthType, setMouthType] = useState(0);
  const audioRef = useRef(null);
  useEffect(() => {
    if (!isSpeaking) {
      return;
    }
    const interval = setInterval(() => {
      let index = randomIndex(MOUTH_TYPES.length);
      while (mouthType === index) {
        index = randomIndex(MOUTH_TYPES.length);
      }
      setMouthType(index);
    }, 500);
    return () => clearInterval(interval);
  }, [isSpeaking, mouthType]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isSpeaking) {
      audio.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isSpeaking]);

  return (
    <div className="relative">
      {isSpeaking && (
        <p
          className={`p-2 text-lg font-bold text-cente w-[80%] bg-white absolute border-4 border-solid border-[#fd0202] rounded-xl talkbubble mt-2 ${
            isEvenLeft && "left-[85%]"
          } ${isEvenRight && "right-[85%]"}`}
        >
          {content}
        </p>
      )}
      <Avatar
        avatarStyle={isSpeaking ? "Circle" : "Transparent"}
        skinColor={skinColor}
        mouthType={MOUTH_TYPES[mouthType]}
        eyebrowType={eyebrowType}
        eyeType={eyeType}
        accessoriesType={accessoriesType}
        clotheType={clothes}
        topType={topType}
        facialHairType={facialHairType}
        hairColor={hairColor}
        clotheColor={clothesColor}
      />
      {isSpeaking && <audio ref={audioRef} src={animalSound} loop></audio>}
    </div>
  );
}

export default AvatarComponent;
