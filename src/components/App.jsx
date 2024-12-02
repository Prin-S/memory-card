import { useState, useEffect } from 'react';

let didInit = false;

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
            count++;

            if (count == 12) {
              setPokeData(pokeSelected);
            }
          });
      })
    }
  }, []);

  function handleClickButton() {
    console.log(pokeData);
  }

  return (
    <>
      <p>
        <button className="button" onClick={handleClickButton}>Check</button>
      </p>
    </>
  )
}

export { App };