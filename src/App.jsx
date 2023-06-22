import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import Die from "../components/Die";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [timer, setTimer] = useState(30); // Initial timer value

  useEffect(() => {
    const firstValue = dice[0].value;
    const allHeld = dice.every((die) => die.held);
    const allSameNumber = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameNumber) {
      setTenzies(true);
      resetTimer();
    }
  }, [dice]);

  useEffect(() => {
    if (!tenzies && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tenzies, timer]);

  function randomDieValue() {
    return Math.ceil(Math.random() * 6);
  }

  function allNewDice() {
    const newArray = [];
    for (let i = 0; i < 10; i++) {
      const newDie = {
        value: randomDieValue(),
        held: false,
        id: i + 1,
      };
      newArray.push(newDie);
    }
    return newArray;
  }

  function rollUnheldDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die, i) =>
          die.held ? die : { value: randomDieValue(), held: false, id: i + 1 }
        )
      );
    } else {
      setDice(allNewDice());
      setTenzies(false);
      resetTimer(); // Reset the timer
    }
  }

  function holdDice(id) {
    setDice((prevDice) =>
      prevDice.map((die) =>
        die.id === id ? { ...die, held: !die.held } : die
      )
    );
  }

  function resetGame() {
    setDice(allNewDice());
    setTenzies(false);
    resetTimer(); // Reset the timer
  }

  function resetTimer() {
    setTimer(30); // Set the timer back to the initial value
  }

  const diceElements = dice.map((die) => (
    <Die key={die.id} {...die} hold={() => holdDice(die.id)} />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1>Tenzies</h1>
      <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="die-container">{diceElements}</div>
      <div className="timer">{timer === 0 ? "Game Over" : timer}</div>
      <div className="buttons-container">
      <button className="restart-game" onClick={resetGame}>
        Restart Game
      </button>
      <button className="roll-dice" onClick={rollUnheldDice} disabled={timer === 0}>
        {tenzies ? "Reset Game" : "Roll"}
      </button>
      </div>
    </main>
  );
}
