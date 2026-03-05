import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

//Componente funcional que representa cada cuadro individual del tablero.
// Muestra un valor ('X', 'O', o vacío) y ejecuta una función cuando se hace clic.
function Square(props) {
  return (
    <button
      className={`square ${props.isWinner ? "winner" : ""}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

//Componente que renderiza la grilla de 3x3 usando el método renderSquare(),
// que a su vez crea 9 componentes Square
class Board extends React.Component {
  renderSquare(i) {
    const isWinner =
      this.props.winningSquares && this.props.winningSquares.includes(i);
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinner={isWinner}
      />
    );
  }

  render() {
    return (
      <div className="board">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>
    );
  }
}

//Componente principal que maneja:

// El estado del juego (historial de movimientos, turno actual, jugador actual)
// El método handleClick() para procesar cada movimiento
// El método jumpTo() para navegar el historial de movimientos
// La visualización del estado (ganador o siguiente jugador)
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerData = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Ir al movimiento " + move : "Juego nuevo";
      return (
        <button key={move} onClick={() => this.jumpTo(move)}>
          {desc}
        </button>
      );
    });

    let status;
    if (winnerData) {
      status = "Ganador: " + winnerData.winner;
    } else {
      status = "Siguiente jugador: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <h1>Gato, tres en raya</h1>
        <div className="board-wrapper">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={winnerData ? winnerData.line : null}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <div className="history">{moves}</div>
        </div>
      </div>
    );
  }
}

// ========================================

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <a
          href="https://github.com/anayaricardo"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          <span>GitHub</span>
        </a>
        <a
          href="https://www.linkedin.com/in/ricardoanaya/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          <span>LinkedIn</span>
        </a>
        <a
          href="https://anayaricardo.github.io/mypage/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          <span>Portafolio</span>
        </a>
      </nav>
    </header>
  );
}

ReactDOM.render(
  <div className="app-container">
    <Header />
    <Game />
  </div>,
  document.getElementById("root"),
);

//Función que verifica si hay un ganador
// comparando todas las combinaciones ganadoras posibles (8 líneas).
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c],
      };
    }
  }
  return null;
}
