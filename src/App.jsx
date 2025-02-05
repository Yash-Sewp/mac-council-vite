import { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import mAnimation from "./animations/m-animation.json";
import aAnimation from "./animations/a-animation.json";
import cAnimation from "./animations/c-animation.json";
import logo from "./assets/logo.svg"; // Import the logo image

function App() {
  const mAnimationContainer = useRef(null);
  const aAnimationContainer = useRef(null);
  const cAnimationContainer = useRef(null);

  const [cStartRotation, setCStartRotation] = useState(0);
  const [aStartRotation, setAStartRotation] = useState(0);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  let mAnimationInstance = null;
  let aAnimationInstance = null;
  let cAnimationInstance = null;

  useEffect(() => {
    try {
      mAnimationInstance = lottie.loadAnimation({
        container: mAnimationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: mAnimation,
      });

      cAnimationInstance = lottie.loadAnimation({
        container: cAnimationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: cAnimation,
      });

      aAnimationInstance = lottie.loadAnimation({
        container: aAnimationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: aAnimation,
      });
    } catch (error) {
      console.error("Error parsing Lottie JSON:", error);
    }

    return () => {
      if (mAnimationInstance) {
        mAnimationInstance.destroy();
      }
      if (aAnimationInstance) {
        aAnimationInstance.destroy();
      }
      if (cAnimationInstance) {
        cAnimationInstance.destroy();
      }
    };
  }, []);

  // Function to start sequential animations
  const playAnimations = () => {
    const playAnimation = (animationInstance, inputId, startRotation) => {
      const percentage = parseFloat(document.getElementById(inputId).value);

      // title = document.getElementById('title').value;
      // description = document.getElementById('description').value;

      if (animationInstance && percentage > 0) {
        const totalDegrees = 360; // Full circle
        const endRotation = startRotation + (percentage / 100) * totalDegrees;
        animationInstance.goToAndPlay(0, true);
        animationInstance.playSegments([0, percentage], true);
        return endRotation;
      }
      return startRotation;
    };

    // Start M animation at 0 degrees
    let mEndRotation = playAnimation(mAnimationInstance, 'mPercentage', 0);

    // Add event listener to start C animation when M animation completes
    mAnimationInstance.addEventListener('complete', () => {
      let cEndRotation = playAnimation(cAnimationInstance, 'cPercentage', mEndRotation);
      setCStartRotation(mEndRotation);

      // Add event listener to start A animation when C animation completes
      cAnimationInstance.addEventListener('complete', () => {
        let aEndRotation = playAnimation(aAnimationInstance, 'aPercentage', cEndRotation);
        setAStartRotation(cEndRotation);
      });
    });
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-full bg-black">
        <div className="w-1/3 p-5">
          <div className="flex items-center relative" style={{ width: 400, height: 400 }}>
            <div id="mAnimationContainer" className="absolute" ref={mAnimationContainer} style={{ width: 400, height: 400 }}></div>
            <div id="cAnimationContainer" className="absolute" ref={cAnimationContainer} style={{ width: 400, height: 400, transform: `rotate(-${cStartRotation}deg)` }}></div>
            <div id="aAnimationContainer" className="absolute" ref={aAnimationContainer} style={{ width: 400, height: 400, transform: `rotate(-${aStartRotation}deg)` }}></div>
          </div>
          {/* <img src={logo} alt="Logo" /> */}

          <hr className="w-25 mt-4 mb-4" />
          <h2 className="text-2xl">{title}</h2>
          
          <p>{description}</p>
        </div>
        <div className="w-1/2 p-5">
          <div className="flex flex-col w-full">
            <h1 className="text-white text-2xl mb-5 font-bold">GENERATE YOUR <br /> OWN CUSTOM LOGO</h1>

            <div className="flex w-full">
              <div className="text-white p-2">Chart Name:</div>
              <input
                type="text"
                className="text-white border-b border-white p-2 mb-4 bg-transparent w-100"
                id="title"
                placeholder="Income"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex mt-5 w-full">
              <div className="flex">
                <div className="text-white p-2">Date Field M:</div>
                <input type="number" className="text-white border border-white p-2 mb-4" id="mPercentage" placeholder="Enter percentage for M Animation" />
              </div>
              <div className="flex ms-5">
                <div className="text-white p-2">Label</div>
                <input type="text" className="text-white border border-white p-2 mb-4" id="mLabel" placeholder="R100 to 400k" />
              </div>
            </div>

            <div className="flex mt-5">
              <div className="flex">
                <div className="text-white p-2">Date Field C:</div>
                <input type="number" className="text-white border border-white p-2 mb-4" id="cPercentage" placeholder="Enter percentage for C Animation" />
              </div>
              <div className="flex ms-5">
                <div className="text-white p-2">Label</div>
                <input type="text" className="text-white border border-white p-2 mb-4" id="cLabel" placeholder="R10000k+" />
              </div>
            </div>

            <div className="flex mt-5">
              <div className="flex">
                <div className="text-white p-2">Date Field A:</div>
                <input type="number" className="text-white border border-white p-2 mb-4" id="aPercentage" placeholder="Enter percentage for A Animation" />
              </div>
              <div className="flex ms-5">
                <div className="text-white p-2">Label</div>
                <input type="text" className="text-white border border-white p-2 mb-4" id="aLabel" placeholder="R500 to 1000k" />
              </div>
            </div>

            <div className="flex mt-5">
              <div className="text-white p-2">Description:</div>
              <textarea
                className="text-white border border-white w-75 bg-transparent p-2"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex w-full justify-start mt-5">
              <button className="text-white p-2 rounded mt-5 w-75" onClick={playAnimations}>Submit</button>
              <button className="text-white p-2 rounded mt-5 w-75 ms-3">Reset</button>
            </div>
 
          </div>
        </div>
      </div>
    </>
  );
}

export default App;