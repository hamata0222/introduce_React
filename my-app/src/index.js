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
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
        };
    }

    handleClick(i) {
        // immutableな構成にしておく。後で履歴の実装とかがしやすい。
        const squares = this.state.squares.slice();
        squares[i] = 'X';
        this.setState({squares: squares});
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        const status = 'Next player: X';

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ================================================================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
