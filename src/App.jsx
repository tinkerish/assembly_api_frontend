import { useState } from "react";
import SimpleRecordButton from "./Audio";
import axios from "axios";
import Playground from "./Playground";
import cow from "./assets/cow.wav";
import cat from "./assets/cat.mp3";
import dog from "./assets/dog.mp3";
import elephant from "./assets/elephant.mp3";
import horse from "./assets/horse.mp3";
import upload from "./assets/upload.png";
import { utterances } from "./dummy";
const SKIN_COLORS = [
  "Tanned",
  "Yellow",
  "Pale",
  "Light",
  "Brown",
  "DarkBrown",
  "Black",
];
const EYE_TYPES = [
  "Default",
  "Happy",
  "Wink",
  "Hearts",
  "Side",
  "Squint",
  "Surprised",
  "WinkWacky",
  "Cry",
  "Close",
  "Dizzy",
  "EyeRoll",
];
const EYEBROW_TYPES = [
  "Default",
  "Angry",
  "AngryNatural",
  "FlatNatural",
  "RaisedExcited",
  "SadConcerned",
  "UnibrowNatural",
  "UpDown",
  "UpDownNatural",
  "DefaultNatural",
  "RaisedExcitedNatural",
  "SadConcernedNatural",
];
const ACCESSORIES_TYPES = [
  "Blank",
  "Kurt",
  "Prescription01",
  "Prescription02",
  "Round",
  "Sunglasses",
  "Wayfarers",
];

const CLOTHES = [
  "BlazerShirt",
  "BlazerSweater",
  "CollarSweater",
  "GraphicShirt",
  "Hoodie",
  "Overall",
  "ShirtCrewNeck",
  "ShirtScoopNeck",
  "ShirtVNeck",
];

const TOP_TYPES = [
  "NoHair",
  "Eyepatch",
  "Hat",
  "Hijab",
  "Turban",
  "WinterHat1",
  "WinterHat2",
  "WinterHat3",
  "WinterHat4",
  "LongHairBigHair",
  "LongHairBob",
  "LongHairBun",
  "LongHairCurly",
  "LongHairCurvy",
  "LongHairDreads",
  "LongHairFrida",
  "LongHairFro",
  "LongHairFroBand",
  "LongHairNotTooLong",
  "LongHairShavedSides",
  "LongHairMiaWallace",
  "LongHairStraight",
  "LongHairStraight2",
  "LongHairStraightStrand",
  "ShortHairDreads01",
  "ShortHairDreads02",
  "ShortHairFrizzle",
  "ShortHairShaggy",
  "ShortHairShaggyMullet",
  "ShortHairShortCurly",
  "ShortHairShortFlat",
  "ShortHairShortRound",
  "ShortHairShortWaved",
  "ShortHairSides",
  "ShortHairTheCaesar",
  "ShortHairTheCaesarSidePart",
];
const FACIAL_HAIR_TYPES = [
  "Blank",
  "BeardMedium",
  "BeardLight",
  "BeardMajestic",
  "MoustacheFancy",
  "MoustacheMagnum",
];
const HAIR_COLORS = [
  "Auburn",
  "Black",
  "Blonde",
  "BlondeGolden",
  "Brown",
  "BrownDark",
  "PastelPink",
  "Blue",
  "Platinum",
  "Red",
  "SilverGray",
];
const CLOTHES_COLORS = [
  "Black",
  "Blue01",
  "Blue02",
  "Blue03",
  "Gray01",
  "Gray02",
  "Heather",
  "PastelBlue",
  "PastelGreen",
  "PastelOrange",
  "PastelRed",
  "PastelYellow",
  "Pink",
  "Red",
  "White",
];
const ANIMAL_SOUNDS = [cow, cat, dog, elephant, horse];
const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];
export const App = () => {
  const [raw, setRaw] = useState(false);
  const [inputAudio, setInputAudio] = useState();
  const [transcript, setTranscript] = useState();
  const [conversation, setConversation] = useState(0);
  const [summary, setSummary] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const toggleRaw = () => {
    setInputAudio(null);
    setError(null);
    setRaw((prevRaw) => !prevRaw);
  };
  const handlePost = async () => {
    if (inputAudio) {
      const audioArrayBuffer = await inputAudio.arrayBuffer();

      try {
        setLoading(true);
        const response = await axios.post(
          "https://assembly-api-backend.onrender.com",
          audioArrayBuffer,
          {
            headers: {
              "Content-Type": "audio/wav",
            },
          }
        );
        const utterances = response.data.utterances;
        const speakers = {};
        let animal = [...ANIMAL_SOUNDS];
        let soundIndex = Math.floor(Math.random() * animal.length);
        for (let i = 0; i < utterances.length; i++) {
          const utterance = utterances[i];
          if (!speakers[utterance.speaker]) {
            speakers[utterance.speaker] = {
              skinColor: getRandomElement(SKIN_COLORS),
              eyeType: getRandomElement(EYE_TYPES),
              accessoriesType: getRandomElement(ACCESSORIES_TYPES),
              clothes: getRandomElement(CLOTHES),
              topType: getRandomElement(TOP_TYPES),
              facialHairType: getRandomElement(FACIAL_HAIR_TYPES),
              hairColor: getRandomElement(HAIR_COLORS),
              clothesColor: getRandomElement(CLOTHES_COLORS),
              eyebrowType: getRandomElement(EYEBROW_TYPES),
              animalSound: animal[soundIndex],
            };
            animal = animal.filter(
              (item) => item !== ANIMAL_SOUNDS[soundIndex]
            );
            soundIndex = Math.floor(Math.random() * animal.length);
          }
        }
        if (
          Object.keys(speakers).length < 2 ||
          Object.keys(speakers).length > 5
        ) {
          setError(
            "Use multi-speaker audio.Speakers shouldn't be more than 5."
          );
          setLoading(false);
          return;
        }
        if (response.status === 500) {
          setError(
            response.error && response.details
              ? `${response.error}: ${response.details}`
              : "Error uploading audio"
          );
        }
        setConversation(speakers);
        setTranscript(response.data);
        setSummary(response.data.summary);
        setLoading(false);
      } catch (error) {
        setError("Error uploading audio");
        setLoading(false);
      }
    } else {
      setError("Audio Input is required");
    }
  };

  if (transcript)
    return (
      <Playground
        speakers={conversation}
        utterances={utterances}
        summary={summary}
      />
    );
  return (
    <div className="flex flex-col items-center justify-center bg-white h-[80%] gap-8 w-[80%] py-4">
      <h1 className="text-xl font-bold pt-4 text-center">
        Visualize your conversation in the most fun way
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8 h-[100%] w-[100%]">
          <div className="border border-dashed border-black py-4 w-[80%] h-[70%] rounded-2xl flex justify-center items-center cursor-pointer">
            {raw ? (
              <SimpleRecordButton
                onChange={(file) => {
                  setError(null);
                  setInputAudio(file);
                }}
              />
            ) : (
              <div className="relative ">
                {inputAudio ? (
                  <audio controls className="">
                    <source
                      src={URL.createObjectURL(inputAudio)}
                      type="audio/wav/mp3"
                    />
                  </audio>
                ) : (
                  <img src={upload} alt="upload" className="w-20 " />
                )}
                <input
                  type="file"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    setError(null);
                    setInputAudio(e.target.files[0]);
                  }}
                />
              </div>
            )}
          </div>
          <div className=" w-[80%]">
            <ol className="list-disc text-gray-500">
              <li>
                {" "}
                Use multi-speaker audio. Speakers shouldn't be more than 5 .
              </li>
              <li>
                The accuracy of the Speaker Diarization model depends on several
                factors, including the quality of the audio, the number of
                speakers, and the length of the audio file. Ensuring that each
                speaker speaks for at least 30 seconds uninterrupted and
                avoiding scenarios where a person only speaks a few short
                phrases can improve accuracy. However, it's important to note
                that the model isn't perfect and may make mistakes, especially
                in more challenging scenarios.
              </li>
              <li>Audio Limit: 30MB</li>
            </ol>
          </div>
          {error && (
            <p className="text-red-700 text-lg pb-4 text-center">{error}</p>
          )}
          <div className="flex items-center justify-end gap-2 w-[80%]">
            <button
              onClick={handlePost}
              className="bg-[#ff0d00] py-2 px-4 text-white text-xl rounded-lg font-bold"
            >
              Sumbit
            </button>
            <button onClick={toggleRaw} className="text-xl ">
              {raw ? "Switch to File Upload" : "Switch to Record Audio"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
