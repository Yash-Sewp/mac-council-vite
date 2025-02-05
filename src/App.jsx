import { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import mAnimation from "./animations/m-animation.json";
import aAnimation from "./animations/a-animation.json";
import cAnimation from "./animations/c-animation.json";

function App() {
  const mAnimationContainer = useRef(null);
  const aAnimationContainer = useRef(null);
  const cAnimationContainer = useRef(null);

  const [cStartRotation, setCStartRotation] = useState(0);
  const [aStartRotation, setAStartRotation] = useState(0);

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
        <div className="flex w-1/2 justify-center">
          <div className="flex items-center relative" style={{ width: 400, height: 400 }}>
            <div id="mAnimationContainer" className="absolute" ref={mAnimationContainer} style={{ width: 400, height: 400 }}></div>
            <div id="cAnimationContainer" className="absolute" ref={cAnimationContainer} style={{ width: 400, height: 400, transform: `rotate(-${cStartRotation}deg)` }}></div>
            <div id="aAnimationContainer" className="absolute" ref={aAnimationContainer} style={{ width: 400, height: 400, transform: `rotate(-${aStartRotation}deg)` }}></div>
          </div>
        </div>
        <div className="flex w-1/2 justify-center">
          <div className="flex flex-col items-center">
            <div className="flex">
              <div className="flex">
                <div className="text-white p-2">Date Field M:</div>
                <input type="number" className="text-white border border-white p-2 mb-4" id="mPercentage" placeholder="Enter percentage for M Animation" />
              </div>
              <div className="flex">
                <div className="text-white p-2">Label</div>
                <input type="text" className="text-white border border-white p-2 mb-4" id="mLabel" placeholder="R100 to 400k" />
              </div>
            </div>

            <div className="flex">
              <div className="flex">
                <div className="text-white p-2">Date Field C:</div>
                <input type="number" className="text-white border border-white p-2 mb-4" id="cPercentage" placeholder="Enter percentage for C Animation" />
              </div>
              <div className="flex">
                <div className="text-white p-2">Label</div>
                <input type="text" className="text-white border border-white p-2 mb-4" id="cLabel" placeholder="R10000k+" />
              </div>
            </div>

            <div className="flex">
              <div className="flex">
                <div className="text-white p-2">Date Field A:</div>
                <input type="number" className="text-white border border-white p-2 mb-4" id="aPercentage" placeholder="Enter percentage for A Animation" />
              </div>
              <div className="flex">
                <div className="text-white p-2">Label</div>
                <input type="text" className="text-white border border-white p-2 mb-4" id="aLabel" placeholder="R500 to 1000k" />
              </div>
            </div>

            <button className="text-white p-2 rounded" onClick={playAnimations}>Play Animations</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;