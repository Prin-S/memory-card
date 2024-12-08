import { useState, useEffect } from 'react';
import '../styles/styles.css';

function Box({ details, onBoxClick }){
  return (
    <div id={details.number} className="box" onClick={onBoxClick}>
      <div><img id={details.number} className="img" src={details.pic} alt={details.name} /></div>
      <p className="pokename" id={details.number}>{details.name}</p>
    </div>
  );
}

function Display({ data, onBoxClick }) {
  return (
    <div className="container">
      {data.map(item => {
        return <Box key={item.number} details={item} onBoxClick={onBoxClick} />
      })}
    </div>
  );
}

function Render({ score, pokeData, handleBoxClick, handleRestart }) {
  if (score < 12) {
    return (
      <Display data={pokeData} onBoxClick={handleBoxClick} />
    );
  } else {
    return (
      <>
        <h2>You won!</h2>
        <button className="button" onClick={handleRestart}>Restart</button>
        <Display data={pokeData} />
      </>
    );
  }
  
}

function App() {
  const [pokeData, setPokeData] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!ended) {
      const pokeNum = [];
      const pokeSelected = [];
      let count = 0;

      while (count < 12) {
        const num = Math.ceil(Math.random() * 151);

        if (!pokeNum.includes(num)) {
          pokeNum.push(num);
          pokeSelected.push({number: num});
          count++;
        }
      }
      
      count = 0;

      pokeSelected.forEach(element => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${element.number}`, {mode: 'cors'})
          .then(response => response.json())
          .then(response => {
            element.name = response.name[0].toUpperCase() + response.name.slice(1);
            element.pic = response.sprites.other['official-artwork'].front_default;
            element.clicked = false;
            count++;

            if (count == 12) {
              setPokeData(pokeSelected);
            }
          });
      })

      setEnded(true);
    }
  }, [ ended ]);

  function shuffleArray(arr) { // https://javascript.info/task/shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function handleBoxClick(e) {
    const itemToMarkClicked = pokeData.find(item => item.number == e.target.id);
    const newPokeData = [ ...pokeData.filter(item => item.number != e.target.id), itemToMarkClicked ];

    if (!itemToMarkClicked.clicked) {
      itemToMarkClicked.clicked = true;
      setScore(score + 1);
    } else {
      newPokeData.map(item => item.clicked = false);
      setHighScore(score);
      setScore(0);
      setAttempts(attempts + 1);
    }

    shuffleArray(newPokeData);
    setPokeData(newPokeData);
  }

  function handleRestart() {
    setHighScore(0);
    setScore(0);
    setAttempts(0);
    setEnded(false);
  }

  return (
    <>
      <div className="scores">
        <p>High Score: {highScore}</p>
        <p><strong>Score: {score}</strong></p>
        <p>Attempts: {attempts}</p>
      </div>
      <Render score={score} pokeData={pokeData} handleBoxClick={handleBoxClick} handleRestart={handleRestart} />
    </>
  );
}

export { App };