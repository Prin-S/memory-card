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
    console.log(e.target.id);
    const itemToMarkClicked = pokeData.find(item => item.number == e.target.id);
    itemToMarkClicked.clicked = true;
    
    const newPokeData = [ ...pokeData.filter(item => item.number != e.target.id), itemToMarkClicked ];
    shuffleArray(newPokeData);
    setPokeData(newPokeData);
  }

  return (
    <>
      <Display data={pokeData} onBoxClick={handleBoxClick} />
    </>
  );
}

export { App };