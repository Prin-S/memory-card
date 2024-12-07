import { useState, useEffect } from 'react';
import '../styles/styles.css';

let didInit = false;

function Box({ details, onBoxClick }){
  return (
    <div id={details.number} className="box" onClick={onBoxClick}>
      <div><img id={details.number} className="img" src={details.pic} alt={details.name} /></div>
      <p id={details.number}>{details.name}</p>
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

function App() {
  const [pokeData, setPokeData] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!didInit) {
      const pokeNum = [];
      const pokeSelected = [];
      let count = 0;
      didInit = true;

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
    }
  }, []);

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
    }

    shuffleArray(newPokeData);
    setPokeData(newPokeData);
  }

  if (score < 12) {
    return (
      <>
        <p>High Score: {highScore}</p>
        <p>Score: {score}</p>
        <Display data={pokeData} onBoxClick={handleBoxClick} />
      </>
    );
  } else {
    return (
      <>
        <p>High Score: {highScore}</p>
        <p>Score: {score}</p>
        <h2>You won!</h2>
        <Display data={pokeData} />
      </>
    );
  }
}

export { App };