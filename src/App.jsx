import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import mAnimation from "./animations/m-animation.json";
import aAnimation from "./animations/a-animation.json";
import cAnimation from "./animations/c-animation.json";

function App() {
  const mAnimationContainer = useRef(null);
  const aAnimationContainer = useRef(null);
  const cAnimationContainer = useRef(null);
  let mAnimationInstance = null;
  let aAnimationInstance = null;
  let cAnimationInstance = null;

  useEffect(() => {
    try {
      mAnimationInstance = lottie.loadAnimation({
        container: mAnimationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: mAnimation,
      });

      aAnimationInstance = lottie.loadAnimation({
        container: aAnimationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: aAnimation,
      });

      cAnimationInstance = lottie.loadAnimation({
        container: cAnimationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: cAnimation,
      });
    } catch (error) {
      console.error('Error parsing Lottie JSON:', error);
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

  const playAnimations = () => {
    const playAnimation = (animationInstance, inputId) => {
      let percentage = parseFloat(document.getElementById(inputId).value);

      if (isNaN(percentage) || percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      let minFrame = 20;
      let maxFrame = 50;
      let targetFrame = minFrame + (percentage / 100) * (maxFrame - minFrame);
      targetFrame = Math.max(minFrame, Math.min(targetFrame, maxFrame));

      if (animationInstance) {
        animationInstance.goToAndPlay(0, true);
        animationInstance.playSegments([0, Math.round(targetFrame)], true);
      }
    };

    playAnimation(mAnimationInstance, 'mPercentage');
    playAnimation(aAnimationInstance, 'aPercentage');
    playAnimation(cAnimationInstance, 'cPercentage');
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex items-center relative" style={{ width: 400, height: 400 }}>
          <div id="mAnimationContainer" className="absolute" ref={mAnimationContainer} style={{ width: 400, height: 400 }}></div>
          <div id="aAnimationContainer" className="absolute" ref={aAnimationContainer} style={{ width: 400, height: 400, transform: 'rotate(-116deg)' }}></div>
          <div id="cAnimationContainer" className="absolute" ref={cAnimationContainer} style={{ width: 400, height: 400, transform: 'rotate(125deg)' }}></div>
        </div>
        <div className="flex flex-col items-center">
          <input type="number" className="text-black border border-black p-2 mb-4" id="mPercentage" placeholder="Enter percentage for mAnimation" />
          <input type="number" className="text-black border border-black p-2 mb-4" id="aPercentage" placeholder="Enter percentage for aAnimation" />
          <input type="number" className="text-black border border-black p-2 mb-4" id="cPercentage" placeholder="Enter percentage for cAnimation" />

          <button className="bg-blue-500 text-white p-2 rounded" onClick={playAnimations}>Play Animations</button>
        </div>
      </div>
    </>
  );
}

export default App;

// animate individually
// a - first
// c - bottom
// a 