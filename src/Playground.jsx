import { useEffect, useMemo, useState } from "react";
import AvatarComponent from "./Avatar";

const Playground = ({ speakers, utterances }) => {
  const [displayedUtterance, setDisplayedUtterance] = useState(null);
  const isOdd = useMemo(() => {
    return Object.keys(speakers).length % 2 !== 0;
  }, [speakers]);
  const middleIndex = useMemo(() => {
    return Math.floor(Object.keys(speakers).length / 2);
  }, [speakers]);
  let intervalId = null;
  console.log(middleIndex);

  useEffect(() => {
    if (!utterances.length) return;
    if (
      displayedUtterance !== null &&
      displayedUtterance >= utterances.length
    ) {
      clearInterval(intervalId);
      return;
    }

    intervalId = setInterval(() => {
      setDisplayedUtterance((prev) => {
        if (prev === null) return 0;
        return prev + 1;
      });
    }, getIntervalDuration(displayedUtterance));

    return () => {
      clearInterval(intervalId);
    };
  }, [utterances, displayedUtterance]);

  const getIntervalDuration = (index) => {
    if (index >= utterances.length) return 0;
    if (index === null) return 500;
    const duration = utterances[index].text.split(" ").length;
    console.log(duration);

    return Math.max(2000, duration * 500);
  };

  return (
    <div className="w-[80%]">
      <div
        className={`playground-grid ${
          isOdd ? "odd-speakers" : "even-speakers"
        }`}
      >
        {Object.keys(speakers).map((speakerName, index) => (
          <div
            key={index}
            className={` ${
              isOdd
                ? Object.keys(speakers).length === 5
                  ? index === middleIndex
                    ? "middle-speaker"
                    : index == 0 || index == 3
                    ? "left-speaker"
                    : "speaker-item "
                  : Object.keys(speakers).length === 3
                  ? index === 2
                    ? "middle-speaker"
                    : index == 0
                    ? "left-speaker"
                    : " speaker-item"
                  : "speaker-item"
                : index % 2 === 0
                ? "justify-self-start"
                : "justify-self-end"
            }`}
          >
            <AvatarComponent
              key={index}
              skinColor={speakers[speakerName].skinColor}
              eyeType={speakers[speakerName].eyeType}
              accessoriesType={speakers[speakerName].accessoriesType}
              clothes={speakers[speakerName].clothes}
              topType={speakers[speakerName].topType}
              facialHairType={speakers[speakerName].facialHairType}
              hairColor={speakers[speakerName].hairColor}
              clothesColor={speakers[speakerName].clothesColor}
              eyebrowType={speakers[speakerName].eyebrowType}
              isSpeaking={
                displayedUtterance === null ||
                displayedUtterance >= utterances.length
                  ? false
                  : utterances[displayedUtterance]?.speaker === speakerName
              }
              content={
                displayedUtterance === null ||
                displayedUtterance >= utterances.length
                  ? ""
                  : utterances[displayedUtterance]?.text
              }
              animalSound={speakers[speakerName].animalSound}
              isEvenLeft={!isOdd && index % 2 === 0}
              isEvenRight={!isOdd && index % 2 !== 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playground;
