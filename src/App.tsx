import React, { useEffect } from 'react';
import './styles/App.css';

// keyboard listener hook
const useKeyPressed = (cb: (key: string) => void) => {

  useEffect(() => {
    const downHandler = (ev: KeyboardEvent) => {
      cb(ev.key)
    }


    // Add event listeners
    window.addEventListener('keydown', downHandler)

    // Clean up listeners on unmount
    return () => {
      window.removeEventListener('keydown', downHandler)
    }
  })

}

const useTimer = (t: number) => {
  const [remaining, setRemaining] = React.useState(t)
  const [running, setRunning] = React.useState(false)
  const [expired, setExpired] = React.useState(false)
  const start = () => {
    setRunning(true)
  }

  const stop = () => {
    setRunning(false)
  }


  useEffect(() => {
    const interval = setInterval(() => {
      if(running){
        if(remaining === 0) {
          clearInterval()
          stop()
          setExpired(true)
        } else {
          setRemaining(remaining - 1)
        }
        
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [remaining, running])
  return {remaining,  start, running, expired}
}



function App() {

  // Number of letters to display before and after current letter
  const letterPadding = 20
  // word bank
  const wordBank = ["account", "act", "addition", "adjustment", "advertisement", "agreement", "air", "amount", "amusement", "animal", "answer", "apparatus", "approval", "argument", "art", "attack", "attempt", "attention", "attraction", "authority", "back", "balance", "base", "behavior", "belief", "birth", "bit", "bite", "blood", "blow", "body", "brass", "bread", "breath", "brother", "building", "burn", "burst", "business", "butter", "canvas", "care", "cause", "chalk", "chance", "change", "cloth", "coal", "color", "comfort", "committee", "company", "comparison", "competition", "condition", "connection", "control", "cook", "copper", "copy", "cork", "cotton", "cough", "country", "cover", "crack", "credit", "crime", "crush", "cry", "current", "curve", "damage", "danger", "daughter", "day", "death", "debt", "decision", "degree", "design", "desire", "destruction", "detail", "development", "digestion", "direction", "discovery", "discussion", "disease", "disgust", "distance", "distribution", "division", "doubt", "drink", "driving", "dust", "earth", "edge", "education", "effect", "end", "error", "event", "example", "exchange", "existence", "expansion", "experience", "expert", "fact", "fall", "family", "father", "fear", "feeling", "fiction", "field", "fight", "fire", "flame", "flight", "flower", "fold", "food", "force", "form", "friend", "front", "fruit"]

  // Shuffle wordBank
  const shuffle = (array: string[]) => {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  const [numCorrectWords, setNumCorrectWords] = React.useState(0)
  const [numMistakes, setNumMistakes] = React.useState(0)
  const [started, setStarted] = React.useState(false)
  // Shuffle wordBank, and create word string
  const shuffledWordList = shuffle(wordBank).join(" ")
  // Track correctly typed letters. Start with none
  const [correctLetters, setCorrectLetters] = React.useState([] as string[]);
  // Track incoming letters, start with full first word minus first letter.
  const [incomingLetters, setIncomingLetters] = React.useState(shuffledWordList.slice(1));
  // Track current letter, start with first char of first word
  const [currentLetter, setCurrentLetter] = React.useState(shuffledWordList[0]);
  const [accuracy, setAccuracy] = React.useState("100")
  // Timer hook/methods
  const {remaining, start, running, expired} = useTimer(60)

  // Callback for keyboard listener
  const onKeyPressed = (key: string) => {
    // ignore if game hasn't started
    if(!started || !running) {
      return
    }
    if(key === currentLetter) {
      setCorrectLetters([...correctLetters, key])
      setIncomingLetters(incomingLetters.slice(1))
      setCurrentLetter(incomingLetters[0])
      setAccuracy(((correctLetters.length / (correctLetters.length + numMistakes))*100).toFixed(2))
      if(currentLetter === " ") {
        setNumCorrectWords(numCorrectWords + 1)
      }
    } else {
      setNumMistakes(numMistakes + 1)
    }
  }
  useKeyPressed(onKeyPressed)


  return (
    <div className="App">
      <div className="title">Typing Game</div>
      <button onClick={() => {
        start()
        setStarted(true)
      }}>Start</button>
      <div className='timer'>{remaining}</div>

      <div className="typing-window">
        {/* Only display the last n correct letters so it stays on one line */}
        <span style={{color: "#61dafb"}}>{correctLetters.slice(-letterPadding)}</span>
        <span style={{backgroundColor: "#61dafb"}}>{currentLetter}</span>
        {/* Display the next n incoming letters */}
        <span>{incomingLetters.substring(0, letterPadding)}</span>
      </div>

      {expired && (
      <div className="stats">
        <div>Correct words: {numCorrectWords}</div>
        <div>Mistakes: {numMistakes}</div>
        {/* "Standarize" word length to 5 letters */}
        <div>WPM: {(correctLetters.length / 5)}</div> 
        <div>Accuracy: {accuracy}%</div>
      </div>
      )}
    </div>
  );
}

export default App;
