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
  const [errorMessage, setErrorMessage] = useState("");

  const [mPercentage, setMPercentage] = useState(0);
  const [mLabel, setMLabel] = useState("");
  const [cPercentage, setCPercentage] = useState(0);
  const [cLabel, setCLabel] = useState("");
  const [aPercentage, setAPercentage] = useState(0);
  const [aLabel, setALabel] = useState("");

  const [isVisible, setIsVisible] = useState(true);

  const mAnimationInstance = useRef(null);
  const aAnimationInstance = useRef(null);
  const cAnimationInstance = useRef(null);

  const titleOptions = {
    Race: { mLabel: "Black", aLabel: "White", cLabel: "Other" },
    Age: { mLabel: "18-30", aLabel: "31-45", cLabel: "46-65" },
    Gender: { mLabel: "Female", aLabel: "Male", cLabel: "Other" },
    "Education Level": { mLabel: "Secondary", aLabel: "Under-graduate", cLabel: "Post-graduate" },
    Income: { mLabel: "R100-400k", aLabel: "R500-1000k", cLabel: "R1000k+" },
    "Geographic Location": { mLabel: "Kwa-Zulu Natal", aLabel: "Gauteng", cLabel: "Western Cape" },
    LSM: { mLabel: "1-4", aLabel: "5-7", cLabel: "8-10" },
    "Employment Type": { mLabel: "Temporary", aLabel: "Contract", cLabel: "Permanent" }
  };

  useEffect(() => {
    try {
      mAnimationInstance.current = lottie.loadAnimation({
        container: mAnimationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: mAnimation,
        rendererSettings: {
          progressiveLoad: false
        },
        initialSegment: [0, 100],
        easing: "easeInOutCubic"
      });
      // mAnimationInstance.setSpeed(.25);
  
      aAnimationInstance.current = lottie.loadAnimation({
        container: aAnimationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: aAnimation,
        rendererSettings: {
          progressiveLoad: false
        },
        initialSegment: [0, 100],
        easing: "easeInOutCubic"
      });
      // aAnimationInstance.setSpeed(.25);
  
      cAnimationInstance.current = lottie.loadAnimation({
        container: cAnimationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: cAnimation,
        rendererSettings: {
          progressiveLoad: false
        },
        initialSegment: [0, 100],
        easing: "easeInOutCubic"
      });
      // cAnimationInstance.setSpeed(.25);

      if (titleOptions[title]) {
        setMLabel(titleOptions[title].mLabel);
        setALabel(titleOptions[title].aLabel);
        setCLabel(titleOptions[title].cLabel);
      }

    } catch (error) {
      console.error("Error parsing Lottie JSON:", error);
    }
  
    return () => {
      mAnimationInstance.current?.destroy();
      aAnimationInstance.current?.destroy();
      cAnimationInstance.current?.destroy();
    };
  }, [title]);

  const validatePercentages = () => {
    const m = parseFloat(mPercentage) || 0;
    const c = parseFloat(cPercentage) || 0;
    const a = parseFloat(aPercentage) || 0;
    const total = Number((m + c + a).toFixed(3)); // Round to 3 decimal places

    // Check if the total is approximately 100 (allowing for small floating point differences)
    if (Math.abs(total - 100) > 0.001) {
      setErrorMessage("Total percentage must equal exactly 100%");
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  };

  const playAnimations = () => {
    if (!validatePercentages()) return;

    if (isVisible) {
      setIsVisible(false);
      setTimeout(() => {
        setIsVisible(true);
        generateLogo();
      }, 1000);
    } else {
      setIsVisible(true);
      generateLogo();
    }
  };

  const generateLogo = () => {
    // Destroy existing animations before starting new ones
    mAnimationInstance.current?.destroy();
    aAnimationInstance.current?.destroy();
    cAnimationInstance.current?.destroy();

    // Reinitialize animations
    mAnimationInstance.current = lottie.loadAnimation({
      container: mAnimationContainer.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: mAnimation,
      rendererSettings: {
        progressiveLoad: false
      },
      initialSegment: [0, 100],
      easing: "easeInOutCubic"
    });

    aAnimationInstance.current = lottie.loadAnimation({
      container: aAnimationContainer.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: aAnimation,
      rendererSettings: {
        progressiveLoad: false
      },
      initialSegment: [0, 100],
      easing: "easeInOutCubic"
    });

    cAnimationInstance.current = lottie.loadAnimation({
      container: cAnimationContainer.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: cAnimation,
      rendererSettings: {
        progressiveLoad: false
      },
      initialSegment: [0, 100],
      easing: "easeInOutCubic"
    });

    const playAnimation = (animationInstance, inputId, startRotation, callback) => {
      const inputValue = document.getElementById(inputId).value.trim();
      const percentage = inputValue ? parseFloat(inputValue) : 0;
      
      if (animationInstance.current && percentage > 0) {
        const totalDegrees = 360;
        const endRotation = startRotation + (percentage / 100) * totalDegrees;
        
        // Calculate animation speed based on percentage
        let speed;
        if (percentage <= 10) {
          speed = 1.0; // Slowest speed for small percentages
        } else if (percentage <= 25) {
          speed = 1.25; // Slightly faster for medium-small percentages
        } else if (percentage <= 50) {
          speed = 1.5; // Medium speed for medium percentages
        } else {
          speed = 1.75; // Full speed for large percentages
        }
        
        animationInstance.current.setSpeed(speed);
        
        // Calculate frame numbers based on percentage
        const totalFrames = animationInstance.current.totalFrames;
        const endFrame = Math.floor((percentage / 100) * totalFrames);
        
        // Calculate trigger point based on percentage
        // Larger percentages will wait longer before triggering next animation
        let triggerPercentage;
        if (percentage <= 10) {
          triggerPercentage = 0.5; // Trigger at 50% for small segments
        } else if (percentage <= 25) {
          triggerPercentage = 0.6; // Trigger at 60% for medium-small segments
        } else if (percentage <= 50) {
          triggerPercentage = 0.7; // Trigger at 70% for medium segments
        } else {
          triggerPercentage = 0.8; // Trigger at 80% for large segments
        }
        
        const triggerNextAtFrame = Math.floor(endFrame * triggerPercentage);
        
        const enterFrameHandler = () => {
          if (animationInstance.current.currentFrame >= triggerNextAtFrame) {
            if (callback) callback(endRotation);
            animationInstance.current.removeEventListener('enterFrame', enterFrameHandler);
          }
        };
        
        animationInstance.current.addEventListener('enterFrame', enterFrameHandler);
        animationInstance.current.goToAndPlay(0, true);
        animationInstance.current.playSegments([0, endFrame], true);

        return endRotation;
      } else {
        if (callback) callback(startRotation);
        return startRotation;
      }
    };

    let mEndRotation = playAnimation(mAnimationInstance, "mPercentage", 0, (mEndRotation) => {
      setAStartRotation(mEndRotation);
      let aEndRotation = playAnimation(aAnimationInstance, "aPercentage", mEndRotation, (aEndRotation) => {
        setCStartRotation(aEndRotation);
        playAnimation(cAnimationInstance, "cPercentage", aEndRotation);
      });
    });
  };
  
  const resetForm = () => {
    // Fade out first
    setIsVisible(false);
    
    // Wait for fade out animation before resetting
    setTimeout(() => {
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
      aAnimationInstance.current?.destroy();
      cAnimationInstance.current?.destroy();
    
      // Reinitialize animations with easing
      mAnimationInstance.current = lottie.loadAnimation({
        container: mAnimationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: mAnimation,
        rendererSettings: {
          progressiveLoad: false
        },
        initialSegment: [0, 100],
        easing: "easeInOutCubic"
      });
    
      aAnimationInstance.current = lottie.loadAnimation({
        container: aAnimationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: aAnimation,
        rendererSettings: {
          progressiveLoad: false
        },
        initialSegment: [0, 100],
        easing: "easeInOutCubic"
      });
    
      cAnimationInstance.current = lottie.loadAnimation({
        container: cAnimationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: cAnimation,
        rendererSettings: {
          progressiveLoad: false
        },
        initialSegment: [0, 100],
        easing: "easeInOutCubic"
      });

      setIsSubmitDisabled(false);
      
      // Fade back in after reset
      setIsVisible(true);
    }, 300); // Wait for fade out animation to complete
  };
  
  return (
    <>
      <div className="container-wrapper min-h-screen w-full bg-black">
        <div className="lg:w-1/3 p-5">
          <h1 className="heading mobile text-white mb-5 md:mt-5 fixture-semibold">GENERATE YOUR <br /> OWN CUSTOM LOGO</h1>
          <div 
            id="animation-wrapper" 
            className="flex items-center relative transition-opacity duration-300"
            style={{ opacity: isVisible ? 1 : 0 }}
          >
            <div id="mAnimationContainer" className="absolute" ref={mAnimationContainer}></div>
            <div id="cAnimationContainer" className="absolute" ref={cAnimationContainer} style={{ transform: `rotate(-${cStartRotation}deg)` }}></div>
            <div id="aAnimationContainer" className="absolute" ref={aAnimationContainer} style={{ transform: `rotate(-${aStartRotation}deg)` }}></div>
          </div>

          <div className="flex flex-col w-full">
            <div className="content-wrapper flex flex-col w-1/2">
             <img src={logo} className="logo mb-3" alt="Logo" />

              <hr className="mt-3 mb-3" />

              {title && <h2 className="text-white content-wrapper--title mb-0">{title}</h2>}

              {mPercentage > 0 && <p className="text-white content-wrapper--stats miriam-bold">{mPercentage}% <span className="miriam-regular">{mLabel}</span></p>}
              {aPercentage > 0 && <p className="text-white content-wrapper--stats miriam-bold">{aPercentage}% <span className="miriam-regular">{aLabel}</span></p>}
              {cPercentage > 0 && <p className="text-white content-wrapper--stats miriam-bold">{cPercentage}% <span className="miriam-regular">{cLabel}</span></p>}

              {description && <p className="text-white content-wrapper--description mt-0">{description}</p>}
            </div>
          
          </div>
        </div>
        <div className="lg:w-1/2 p-5">
          <div className="flex flex-col w-full">
            <h1 className="heading desktop text-white mb-5 md:mt-5 fixture-semibold">GENERATE YOUR <br /> OWN CUSTOM LOGO</h1>

            <div className="flex items-center">
              <div className="label text-white pe-2">Chart Name:</div>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-white border-b border-white p-2 w-100 rounded-none w-full"
              >
                <option value="">Select Category</option>
                {Object.keys(titleOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between mt-5">
              <div className="flex items-center w-full lg:w-auto">
                <div className="label-wrapper label text-white pe-2">Data Field M:</div>
                <input
                  type="number"
                  className="text-white border border-white p-2"
                  id="mPercentage"
                  placeholder="Enter percentage for M Animation"
                  value={mPercentage}
                  onChange={(e) => setMPercentage(e.target.value)}
                />
              </div>
              <div className="label-col flex items-center w-full">
                <div className="label-wrapper text-white pe-4 miriam-bold">Label:</div>
                <input
                  type="text"
                  className="text-white border-b border-white p-2"
                  id="mLabel"
                  placeholder="R100 to 400k"
                  value={mLabel}
                  readOnly
                  onChange={(e) => setMLabel(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-5">
              <div className="flex items-center w-full lg:w-auto">
                <div className="label-wrapper label text-white pe-2">Data Field A:</div>
                <input type="number" className="text-white border border-white p-2" id="aPercentage" placeholder="Enter percentage for A Animation" value={aPercentage} onChange={(e) => setAPercentage(e.target.value)} />
              </div>
              <div className="label-col flex items-center w-full">
                <div className="label-wrapper text-white pe-4 miriam-bold">Label:</div>
                <input type="text" className="text-white border-b border-white p-2" id="aLabel" placeholder="R500 to 1000k" readOnly value={aLabel} onChange={(e) => setALabel(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-between mt-5">
              <div className="flex items-center w-full lg:w-auto">
                <div className="label label-wrapper text-white pe-2">Data Field C:</div>
                <input type="number" className="text-white border border-white p-2" id="cPercentage" placeholder="Enter percentage for C Animation" value={cPercentage} onChange={(e) => setCPercentage(e.target.value)} />
              </div>
              <div className="label-col flex items-center w-full">
                <div className="label-wrapper text-white pe-4 miriam-bold">Label:</div>
                <input type="text" className="text-white border-b border-white p-2" id="cLabel" placeholder="R10000k+" value={cLabel} readOnly onChange={(e) => setCLabel(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-between mt-5">
              <div className="flex items-start w-full">
                <div className="label text-white pe-2 mt-2">Description:</div>
                <textarea
                  className="text-white border border-white w-full bg-transparent p-2"
                  id="description"
                  placeholder="<Leave empty if none>"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-between mt-3">
              <div className="flex items-start w-full">
                <div className="note label text-white pe-2 mt-2 miriam-regular"><span className="miriam-bold">Note:</span> Your combined percentage total must equal to 100%</div>
              </div>
            </div>
            
            <div className="flex justify-between mt-3">
              <div className="flex items-start w-full">
                <div className="label text-white pe-2 mt-2"></div>
                {errorMessage && (
                  <div className="content-warning flex justify-between items-start mt-4 mb-4 w-full justify-end pt-5 pb-5 ps-5 pe-5">
                    <p className="text-black flex-grow">
                      Unable to generate logo. The combined percentage <br className="break" /> total must be equal to <strong className="miriam-bold">100%</strong>. Please modify your values.
                    </p>
                    <div
                      className="content-warning--btn text-black pt-0"
                      onClick={() => setErrorMessage("")}
                      aria-label="Close"
                    >
                      <i className="fas fa-times"></i>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="content-wrapper--btns flex w-full justify-between mt-3 lg:justify-end">
              <button className="bg-white text-black p-2 mt-5 md:mt-0 miriam-bold" onClick={playAnimations}  disabled={isSubmitDisabled}>Generate</button>

              <button className="bg-white text-black p-2 mt-5 md:mt-0 md:ms-3 miriam-bold" onClick={resetForm}>Reset</button>
            </div>

            <div className="flex justify-end text-xs mt-3">
              <small className="text-gray-400">v1.2</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;