import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// React.Componentの子クラスとして定義する場合の書き方
// class Square extends React.Component {
//     render() {
//         return (
//             <button
//                 className="square"
//                 onClick={() => this.props.onClick()}
//             >
//               {this.props.value}
//             </button>
//         );
//     }
// }
// 関数コンポーネントとして定義する書き方
// 自身でStateを管理しないので、クラスにしなくても良い。
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const rows = [];
        const size = this.props.boardSize;
        for (let i = 0; i < size; i++) {
            const rowSquares = [];
            for (let j = 0; j < size; j++) {
                rowSquares.push(this.renderSquare((i * size) + j));
            }
            rows.push(<div className="board-row">{rowSquares}</div>);
        }

        return (<div>{rows}</div>);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.boardSize = 3;
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                hand: [null, null],
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    jumpTo(step) {
        this.setState({
            // historyは更新しない。
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            // 決着がついている、もしくはすでに着手済みのマスなら何もしない。
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        const col = (i % this.boardSize) + 1;
        const row = Math.trunc(i / this.boardSize) + 1;
        this.setState({
            // push()だと元の配列を変更してしまうため、concat()を使う。
            history: history.concat([{
                squares: squares,
                hand: [col, row],
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = history.map((step, move) => {
            const handClass = move === this.state.stepNumber ?
                'selected-hand' :
                'history-hand';
            const desc = move ?
                'Go to move #' + move + ` (${step.hand[0]}, ${step.hand[1]})` :
                'Go to game start';
            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        className={handClass}
                    >
                        {desc}
                    </button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        boardSize={this.boardSize}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

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
        if (squares[a] && (squares[a] === squares[b]) && (squares[a] === squares[c])) {
            return squares[a];
        }
    }
    return null; // 勝者なし
}
// ================================================================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
