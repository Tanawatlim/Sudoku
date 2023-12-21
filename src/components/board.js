import React, { useEffect } from "react";
import Cell from "./cell";
import { useState } from "react";
import "../App.css";

const Board = () => {
  const [board, setBoard] = useState();
  const [initial, setInitial] = useState();
  const [loading, setLoading] = useState(true);

  const [statusText, setStatusText] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalID, setIntervalID] = useState(null);

  const validate = (board) => {
    let isValidate = true;
    for (let i = 0; i < 4; i++) {
      const horizontal = new Set();
      const vertical = new Set();
      const square = new Set();
      for (let j = 0; j < 4; j++) {
        horizontal.add(board[i][j]);
        vertical.add(board[j][i]);
        square.add(
          board[2 * (i % 2) + (j % 2)][
            2 * Math.floor(i / 2) + Math.floor(j / 2)
          ]
        );
      }
      horizontal.delete(0);
      vertical.delete(0);
      square.delete(0);
      if (horizontal.size !== 4 || vertical.size !== 4 || square.size !== 4) {
        isValidate = false;
      }
    }
    return isValidate;
  };

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    setIntervalID(id);
    restartBoard();

    return () => {
      clearInterval(id);
    };
  }, []);

  const submit = () => {
    const isValid = validate(board);
    if (isValid) {
      clearInterval(intervalID);
    }
    setStatusText(isValid ? "Board is complete!!" : "Board is invalid :(");
  };

  const restartBoard = () => {
    setLoading(true);
    fetch(
      "https://us-central1-skooldio-courses.cloudfunctions.net/react_01/random"
    )
      .then((res) => {
        return res.json();
      })
      .then((jsonResponse) => {
        setBoard(jsonResponse.board);
        setTimer(0);
        setInitial(
          jsonResponse.board.map((row) => row.map((number) => number !== 0))
        );
        setLoading(false);
      });
  };

  return (
    <div>
      <p className="timer">Elapsed Time: {timer} seconds</p>
      <div className="board">
        {!loading &&
          board.map((row, rowIndex) =>
            row.map((number, columnIndex) => (
              <Cell
                key={`cell-${rowIndex}-${columnIndex}`}
                isInitial={initial[rowIndex][columnIndex]}
                number={number}
                onChange={(newNumber) => {
                  const newBoard = [...board];
                  newBoard[rowIndex][columnIndex] = newNumber;
                  setBoard(newBoard);
                }}
              />
            ))
          )}
      </div>
      <button className="restart-button" onClick={() => restartBoard()}>
        Restart
      </button>
      <button onClick={submit}>Submit</button>
      <p>{statusText}</p>
    </div>
  );
};

export default Board;
