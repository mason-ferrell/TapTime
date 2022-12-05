//initial audio clips to be used for each drum pad
const audioClips = [
  {
    keyCode: 81,
    keyTrigger: 'Q',
    id: 'Heater-1',
    url: 'http://localhost:18888/hihat-acoustic02.wav'
  },
  {
    keyCode: 87,
    keyTrigger: 'W',
    id: 'Heater-2',
    url: 'http://localhost:18888/snare-808.wav'
  },
  {
    keyCode: 69,
    keyTrigger: 'E',
    id: 'Heater-3',
    url: 'http://localhost:18888/hihat-reso.wav'
  },
  {
    keyCode: 65,
    keyTrigger: 'A',
    id: 'Heater-4',
    url: 'http://localhost:18888/kick-tron.wav'
  },
  {
    keyCode: 83,
    keyTrigger: 'S',
    id: 'Clap',
    url: 'http://localhost:18888/perc-tribal.wav'
  },
  {
    keyCode: 68,
    keyTrigger: 'D',
    id: 'Open-HH',
    url: 'http://localhost:18888/crash-noise.wav'
  },
  {
    keyCode: 90,
    keyTrigger: 'Z',
    id: "Kick-n'-Hat",
    url: 'http://localhost:18888/kick-electro01.wav'
  },
  {
    keyCode: 88,
    keyTrigger: 'X',
    id: 'Kick',
    url: 'http://localhost:18888/snare-tape.wav'
  },
  {
    keyCode: 67,
    keyTrigger: 'C',
    id: 'Closed-HH',
    url: 'http://localhost:18888/hihat-electro.wav'
  }
];

function TapTime(){

  //the next lines set up a series of state objects to track recordings. this acts more as an observer pattern
  //than a state pattern, though the state variable used to determine if we've started recording is definitely a state variable
  const [recording, setRecording] = React.useState(false);
  const [recordKeys, setKeys] = React.useState("");
  const [recordTime, setTime] = React.useState("");
  let lastTime = Date.now()

  //recordings are saved as keytriggers and their corresponding times. trying to pipe the output signal to actual audio
  //led to some difficulties with timing. this function will take a recording and trigger each key at its associated time.
  const playRecording = () => {
    if(recording) {
      let triggers = recordKeys.split(" ");
      let triggerTimes = recordTime.split(" ");

      for (let i = 0; i < triggers.length-1; i++) {
        let interval = triggerTimes[i];
        console.log(interval);
        setTimeout( () => {
          const audioTag = document.getElementById(triggers[i]);
          const drumPad = document.getElementById(`drum-pad ${triggers[i]}`)
          drumPad.className = `btn btn-secondary p-5 w-25 m-4 btn-warning`
          setTimeout(() => drumPad.className = `btn btn-secondary p-5 w-25 m-4`, 300);
          audioTag.currentTime = 0;
          audioTag.play();
        }, interval)
      }
    }
  };

  //when the recording button is pressed, trigger this function to tell js we're now recording
  const startRecording = () => {
    lastTime = Date.now()
    setRecording(() => true)
    setKeys(() => "")
    setTime(() => "")
  }

  //add the interval between triggers and the key itself to their respective state variables
  const addRecording = (key, triggerTime) => {
    if(recording) {
      const interval = triggerTime - lastTime
      setKeys(prev => prev + key + " ")
      setTime(prev => prev + interval + " ")
    }
  }

  //set the recording to its inital state
  const clearRecording = () => {
    setRecording(() => false)
    setKeys(() => "")
    setTime(() => "")
  }

  return (
  <div className="webPageBG min-vh-100">
      <nav className="navbar navbar-dark bg-dark text-white">
        <ul id="title_name" class="nav navbar-nav ml-auto">
          <h2>Tap Time</h2>
        </ul>
        {recording && (         //the buttons we display change with the recording variable
          <>
            <div className="btn-group-large ms-auto">
              <button onClick={playRecording} className="btn btn-success navbar-btn">Play</button>
              <button onClick={clearRecording} className="btn btn-warning navbar-btn">Clear</button>
            </div>
          </>
        )}
        {!recording && (
          <>
            <div className="btn-group-large ms-auto">
              <button onClick={startRecording} className="btn btn-large btn-danger navbar-btn navbar-left">Record</button>
            </div>
          </>
        )}
      </nav>
      <div className="drumPadContainer container-fluid w=100">
        <div className=".col-*-*">
          {audioClips.map(clip => (       //here we generate all the pads, acting as a factory pattern
              <DrumPad key={clip.id} clip={clip} recording={recording} addRecording={addRecording}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function DrumPad({clip, recording, addRecording}){
  //we use the active variable to light up the pad when its pressed
  const [active, setActive] = React.useState(false);

  //we add event listeners for keydown and click. these each check their own respective conditionals, then call playSound()
  //this acts as a decorator pattern to playSound(), whereby we decorate the function with some command-specific lines of code
  React.useEffect(() => {
      document.addEventListener('keydown', handleKeyPress);
      document.addEventListener('click', handleClick)
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
        document.removeEventListener('click', handleClick)
      }
  }, [recording])

  const handleKeyPress = (e) => {
      if(e.keyCode === clip.keyCode){
        playSound();
      }
  }

  const handleClick = event => {
    if(event.target === document.getElementById(`drum-pad ${clip.keyTrigger}`)) {
      playSound()
    }
  }

  //playSound() itself acts as a decorator on audio.play(), where it also adds some nice lighting to the pad and updates the recording.
  //it also acts as a publisher in the observer pattern, by calling addRecording and publishing its information, regardless of whether the
  //recording object will actually record this information
  const playSound = () => {
      const audioTag = document.getElementById(clip.keyTrigger);
      setActive(true);
      setTimeout(() => setActive(false), 300);
      audioTag.currentTime = 0; 
      audioTag.play();
      addRecording(clip.keyTrigger, Date.now());
  };

  const selectorId = clip.keyTrigger + "s"

  //setSampleUrl() is called whenever an item in the dropdown on a pad is clicked. The dropdown's parent pad then has
  //its audio source set to whatever was in that item. In this way, this function is part of the command pattern,
  //as we set a specific sample with the dropdown, then call our setSampleUrl, which takes this concrete sample and
  //sets it as the source. While we don't have multiple setSampleUrl functions, as a strategy pattern might in Java,
  //the underlying flow is the same
  const setSampleUrl = () => {
    //due to timing issues, we must wait so that our audio tag can render before we call this function
    //function shouldn't be called anyway, but sometimes onChange gets registered due to some way our browser loads the document objects
    var waitForLoad = setInterval(function(){
      var audioTag = document.getElementById(clip.keyTrigger)
      if(audioTag){
          clearInterval(waitForLoad);
          const sample_url = document.getElementById(selectorId).value
          audioTag.src = sample_url
      }
    }, 100);
    //audioTag.src = sample_url
  }

  return (
    <div 
      id = {`drum-pad ${clip.keyTrigger}`}
      className={`btn btn-secondary p-5 w-25 m-4  ${active && "btn-warning"}`}
    >
      <audio className="clip" id={clip.keyTrigger} src={clip.url}/>
      {clip.keyTrigger}
      <br></br>
      <select onChange={setSampleUrl} id={selectorId}>
        {samples.map( sample => (     //factory pattern to generate each dropdown
          <option value={sample.url}>{sample.name}</option>
        ))}
      </select>
    </div>
  );
}

const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement);
root.render(<TapTime />);