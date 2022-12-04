const audioClips = [
  {
    keyCode: 81,
    keyTrigger: 'Q',
    id: 'Heater-1',
    url: 'http://10.0.0.7:8000/Boom-Kick.wav'
  },
  {
    keyCode: 87,
    keyTrigger: 'W',
    id: 'Heater-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
  },
  {
    keyCode: 69,
    keyTrigger: 'E',
    id: 'Heater-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
  },
  {
    keyCode: 65,
    keyTrigger: 'A',
    id: 'Heater-4',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
  },
  {
    keyCode: 83,
    keyTrigger: 'S',
    id: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  },
  {
    keyCode: 68,
    keyTrigger: 'D',
    id: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  },
  {
    keyCode: 90,
    keyTrigger: 'Z',
    id: "Kick-n'-Hat",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  },
  {
    keyCode: 88,
    keyTrigger: 'X',
    id: 'Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  },
  {
    keyCode: 67,
    keyTrigger: 'C',
    id: 'Closed-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  }
];

function TapTime(){

  const [recording, setRecording] = React.useState(false);
  const [recordKeys, setKeys] = React.useState("");
  const [recordTime, setTime] = React.useState("");
  let lastTime = Date.now()

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

  const startRecording = () => {
    lastTime = Date.now()
    setRecording(prev => true)
    setKeys(() => "")
    setTime(() => "")
  }

  const addRecording = (key, triggerTime) => {
    if(recording) {
      const interval = triggerTime - lastTime
      setKeys(prev => prev + key + " ")
      setTime(prev => prev + interval + " ")
    }
  }

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
        {recording && (
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
          {audioClips.map(clip => (
              <DrumPad key={clip.id} clip={clip} recording={recording} addRecording={addRecording}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function DrumPad({clip, recording, addRecording}){

  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      }
  }, [recording])

  const handleKeyPress = (e) => {
      if(e.keyCode === clip.keyCode){
        playSound();
      }
  }

  const playSound = () => {
      const audioTag = document.getElementById(clip.keyTrigger);
      setActive(true);
      setTimeout(() => setActive(false), 300);
      audioTag.currentTime = 0; 
      audioTag.play();
      addRecording(clip.keyTrigger, Date.now());
  };

  const padClickHandler = event => {
    if(event.target === event.currentTarget) {
      playSound()
    }
  }

  const selectorId = clip.keyTrigger + "s"

  const setSampleUrl = event => {
    console.log("in here")
    var poops = setInterval(function(){
      var audioTag = document.getElementById(clip.keyTrigger)
      if(audioTag){
          clearInterval(poops);
          console.log("hello")
          const sample_url = document.getElementById(selectorId).value
          console.log(sample_url)
          audioTag.src = sample_url
      }
    }, 100);
    //audioTag.src = sample_url
  }

  return (
    <div 
      id = {`drum-pad ${clip.keyTrigger}`}
      onClick={padClickHandler} 
      className={`btn btn-secondary p-5 w-25 m-4  ${active && "btn-warning"}`}
    >
      <audio className="clip" id={clip.keyTrigger} src={clip.url}/>
      {clip.keyTrigger}
      <br></br>
      <select onChange={setSampleUrl} id={selectorId}>
        {samples.map( sample => (
          <option value={sample.url}>{sample.name}</option>
        ))}
      </select>
    </div>
  );
}

function SampleSelect({sample, trigger}) {
  const setSampleUrl = (sample_url, event) => {
    event.stopPropogation();
    var poops = setInterval(function(){
      var audioTag = document.getElementById(clip.keyTrigger)
      if(audioTag){
          clearInterval(poops);
          console.log("hello")
          console.log(sample_url)
          audioTag.src = sample_url
      }
    }, 100);
    //audioTag.src = sample_url
  }

  return (
    <option><button onclick={setSampleUrl}>
      {sample.name}  
    </button></option>
  )
}

const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement);
root.render(<TapTime />);