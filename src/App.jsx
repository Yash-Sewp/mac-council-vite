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

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const [mPercentage, setMPercentage] = useState(0);
  const [mLabel, setMLabel] = useState("");
  const [cPercentage, setCPercentage] = useState(0);
  const [cLabel, setCLabel] = useState("");
  const [aPercentage, setAPercentage] = useState(0);
  const [aLabel, setALabel] = useState("");

  const mAnimationInstance = useRef(null);
  const aAnimationInstance = useRef(null);
  const cAnimationInstance = useRef(null);

  useEffect(() => {
    try {
      mAnimationInstance.current = lottie.loadAnimation({
        container: mAnimationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: mAnimation,
      });
  
      cAnimationInstance.current = lottie.loadAnimation({
        container: cAnimationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: cAnimation,
      });
  
      aAnimationInstance.current = lottie.loadAnimation({
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
      mAnimationInstance.current?.destroy();
      cAnimationInstance.current?.destroy();
      aAnimationInstance.current?.destroy();
    };
  }, []);
  

  // Function to start sequential animations
  const playAnimations = () => {
    setIsSubmitDisabled(true);
  
    const playAnimation = (animationInstance, inputId, startRotation) => {
      const percentage = parseFloat(document.getElementById(inputId).value);
      if (animationInstance.current && percentage > 0) {
        const totalDegrees = 360;
        const endRotation = startRotation + (percentage / 100) * totalDegrees;
        animationInstance.current.goToAndPlay(0, true);
        animationInstance.current.playSegments([0, percentage], true);
        return endRotation;
      }
      return startRotation;
    };
  
    let mEndRotation = playAnimation(mAnimationInstance, "mPercentage", 0);
  
    mAnimationInstance.current.addEventListener("complete", () => {
      let cEndRotation = playAnimation(cAnimationInstance, "cPercentage", mEndRotation);
      setCStartRotation(mEndRotation);
  
      cAnimationInstance.current.addEventListener("complete", () => {
        let aEndRotation = playAnimation(aAnimationInstance, "aPercentage", cEndRotation);
        setAStartRotation(cEndRotation);
      }, { once: true }); // Ensure it runs only once
    }, { once: true }); // Ensure it runs only once
  };
  
  const resetForm = () => {
    document.getElementById("aPercentage").value = "";
    document.getElementById("cPercentage").value = "";
    document.getElementById("mPercentage").value = "";

    setTitle("");
    setDescription("");
    setMPercentage(0);
    setMLabel("");
    setCPercentage(0);
    setCLabel("");
    setAPercentage(0);
    setALabel("");
    
    // Destroy animations completely
    mAnimationInstance.current?.destroy();
    cAnimationInstance.current?.destroy();
    aAnimationInstance.current?.destroy();
  
    // Reinitialize animations
    mAnimationInstance.current = lottie.loadAnimation({
      container: mAnimationContainer.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: mAnimation,
    });
  
    cAnimationInstance.current = lottie.loadAnimation({
      container: cAnimationContainer.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: cAnimation,
    });
  
    aAnimationInstance.current = lottie.loadAnimation({
      container: aAnimationContainer.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: aAnimation,
    });

    setIsSubmitDisabled(false);

  };
  
  return (
    <>
      <div className="container-wrapper min-h-screen w-full bg-black">
        <div className="w-1/3 p-5">
          <div className="flex items-center relative" style={{ width: 350, height: 350 }}>
            <div id="mAnimationContainer" className="absolute" ref={mAnimationContainer} style={{ width: 350, height: 350 }}></div>
            <div id="cAnimationContainer" className="absolute" ref={cAnimationContainer} style={{ width: 350, height: 350, transform: `rotate(-${cStartRotation}deg)` }}></div>
            <div id="aAnimationContainer" className="absolute" ref={aAnimationContainer} style={{ width: 350, height: 350, transform: `rotate(-${aStartRotation}deg)` }}></div>
          </div>

          <div className="flex flex-col w-full">
            <div className="content-wrapper flex flex-col w-1/2">
             <img src={logo} className="logo mb-3" alt="Logo" />

              <hr className="mt-3 mb-3" />

              {title && <h2 className="text-2xl mb-2">{title}</h2>}

              {mPercentage > 0 && <p>{mPercentage}%: <span className="ms-4">{mLabel}</span></p>}
              {cPercentage > 0 && <p>{cPercentage}%: <span className="ms-4">{cLabel}</span></p>}
              {aPercentage > 0 && <p>{aPercentage}%: <span className="ms-4">{aLabel}</span></p>}

              {description && <p className="mt-2 text-s text-gray-500">{description}</p>}
            </div>
          
          </div>
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
                <input
                  type="number"
                  className="text-white border border-white p-2 mb-4"
                  id="mPercentage"
                  placeholder="Enter percentage for M Animation"
                  value={mPercentage}
                  onChange={(e) => setMPercentage(e.target.value)}
                />
              </div>
              <div className="flex ms-5">
                <div className="text-white p-2">Label</div>
                <input
                  type="text"
                  className="text-white border border-white p-2 mb-4"
                  id="mLabel"
                  placeholder="R100 to 400k"
                  value={mLabel}
                  onChange={(e) => setMLabel(e.target.value)}
                />
              </div>
            </div>

            <div className="flex mt-5">
              <div className="flex">
                <div className="text-white p-2">Date Field C:</div>
                <input type="number" className="text-white border border-white p-2 mb-4" id="cPercentage" placeholder="Enter percentage for C Animation" value={cPercentage} onChange={(e) => setCPercentage(e.target.value)} />
              </div>
              <div className="flex ms-5">
                <div className="text-white p-2">Label</div>
                <input type="text" className="text-white border border-white p-2 mb-4" id="cLabel" placeholder="R10000k+" value={cLabel} onChange={(e) => setCLabel(e.target.value)} />
              </div>
            </div>

            <div className="flex mt-5">
              <div className="flex">
                <div className="text-white p-2">Date Field A:</div>
                <input type="number" className="text-white border border-white p-2 mb-4" id="aPercentage" placeholder="Enter percentage for A Animation" value={aPercentage} onChange={(e) => setAPercentage(e.target.value)} />
              </div>
              <div className="flex ms-5">
                <div className="text-white p-2">Label</div>
                <input type="text" className="text-white border border-white p-2 mb-4" id="aLabel" placeholder="R500 to 1000k" value={aLabel} onChange={(e) => setALabel(e.target.value)} />
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

            <div className="flex w-full justify-center mt-5">
              <button className="bg-white text-black p-2 mt-5" onClick={playAnimations}  disabled={isSubmitDisabled}>Submit</button>
              <button className="bg-white text-black p-2 mt-5 ms-3" onClick={resetForm}>Reset</button>
            </div>
 
          </div>
        </div>
      </div>
    </>
  );
}

export default App;