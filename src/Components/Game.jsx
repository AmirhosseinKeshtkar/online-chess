import React, { Component } from 'react';
import './Style.css';
import Board from './board.jsx';
import King from '../pieces/king'
import FallenSoldierBlock from './fallen-soldier-block.js';
import initialiseChessBoard from '../helpers/board-initialiser.js';
import Pawn from '../pieces/pawn';
import Rook from '../pieces/rook';
import Knight from '../pieces/knight';
import Bishop from '../pieces/bishop';
import Queen from '../pieces/queen';

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      Blocks: initialiseChessBoard(),
      whiteFallenSoldiers: [],
      blackFallenSoldiers: [],
      player: 1,
      sourceSelection: -1,
      status: '',
      turn: 'white'
    }
  }

  handleClick(i) {
    const Blocks = [...this.state.Blocks];

    if (this.state.sourceSelection === -1) {
      if (!Blocks[i] || Blocks[i].player !== this.state.player) {
        this.setState({ status: "Wrong selection. Choose player " + this.state.player + " pieces." });
        Blocks[i].style = { ...Blocks[i].style, backgroundColor: "" };

      }
      else {
        Blocks[i].style = { ...Blocks[i].style, backgroundColor: "RGB(102, 204, 255)" };
        /*
        const srcToDestPath= Blocks[i].getSrcToDestPath(this.state.sourceSelection, i);
        for(let i=0; i<srcToDestPath.length;i++){
          srcToDestPath[i].style={backgroundColor: "RGB(102, 204, 255)" }
        }
        console.log(this.state.sourceSelection)
        */
        this.setState({
          status: "Choose destination for the selected piece",
          sourceSelection: i
        })
        
      }
      return
    }

    //on second click we should change block's color back to normal
    Blocks[this.state.sourceSelection].style = { ...Blocks[this.state.sourceSelection].style, backgroundColor: "" };

    //if player choosed an unvalid block or his own pieac for destination 
    if (Blocks[i] && Blocks[i].player === this.state.player) {
      this.setState({
        status: "Wrong selection. Choose valid source and destination again.",
        sourceSelection: -1,
      });
    }
    else {
      const whiteFallenSoldiers = [];
      const blackFallenSoldiers = [];
      const isDestEnemyOccupied = Boolean(Blocks[i]);
      console.log("_______________________________________________clicked on")
      const isMovePossible = Blocks[this.state.sourceSelection].isMovePossible(this.state.sourceSelection, i, isDestEnemyOccupied,Blocks);

      if (isMovePossible) {
        if (Blocks[i] !== null) {
          if (Blocks[i].player === 1) {
            whiteFallenSoldiers.push(Blocks[i]);
          }
          else {
            blackFallenSoldiers.push(Blocks[i]);
          }
        }

        //move Pieac to Destination
        Blocks[i] = Blocks[this.state.sourceSelection];
        Blocks[this.state.sourceSelection] = null;

        //pawn promotion
        if (Blocks[i] instanceof Pawn && (i < 8 || i > 55)) {
          Blocks[i]=this.pawnPromotion(Blocks, i, this.state.player)
        }

        //alert for check
         const opponent = this.state.player === 1 ? 2 : 1
        if(this.isCheckForPlayer(Blocks, opponent)){
          const KingPosition = this.getKingPosition(Blocks, opponent)
          Blocks[KingPosition].style = { ...Blocks[KingPosition].style, backgroundColor: "RGB(230, 0, 0)" };
        }else if(this.isCheckForPlayer(Blocks, this.state.player)){
          const KingPosition = this.getKingPosition(Blocks, this.state.player)
          Blocks[KingPosition].style = { ...Blocks[KingPosition].style, backgroundColor: "RGB(230, 0, 0)" };
        }

        const isCheckMe = this.isCheckForPlayer(Blocks, this.state.player)

        if (isCheckMe) {
          this.setState(oldState => ({
            status: "You have a check!",
            sourceSelection: -1,
          }))
        } else {
          //switch turn
          let player = this.state.player === 1 ? 2 : 1;
          let turn = this.state.turn === 'white' ? 'black' : 'white';

          this.setState(oldState => ({
            sourceSelection: -1,
            Blocks,
            whiteFallenSoldiers: [...oldState.whiteFallenSoldiers, ...whiteFallenSoldiers],
            blackFallenSoldiers: [...oldState.blackFallenSoldiers, ...blackFallenSoldiers],
            player,
            status: '',
            turn
          }));
        }
      } else {
        this.setState({
          status: "Wrong selection. Choose valid source and destination again.",
          sourceSelection: -1,
        });
      }
    }
  }

  pawnPromotion( Blocks, i, player) {
      console.log("end of the line")
      //const Blocks = Array(4).fill(null);
      Blocks[i]=null;
      const b=new Queen(this.state.player);
      return b;
      const Block=new Queen(player)
      return { Block}
  }

  getKingPosition(Blocks, player) {
    return Blocks.reduce((acc, curr, i) =>
      //King is only one, if we had found it, returned his position
      acc ||
      //current Block mustn't be a null
      ((curr &&
        (curr.getPlayer() === player))
        && (curr instanceof King)
        && i), // returned position if all conditions are completed
      null)
  }

  isCheckForPlayer(Blocks, player) {
    const opponent = player === 1 ? 2 : 1
    const playersKingPosition = this.getKingPosition(Blocks, player)
    const canPieceKillPlayersKing = (piece, i) => piece.isMovePossible(playersKingPosition, i, Blocks)
    return Blocks.reduce((acc, curr, idx) =>
      acc ||
      (curr && (curr.getPlayer() === opponent) && canPieceKillPlayersKing(curr, idx)),
      false)
  }

  render() {
    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board
              Blocks={this.state.Blocks}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <h3>Turn</h3>
            <div id="player-turn-box" style={{ backgroundColor: this.state.turn }}>
            </div>
            <div className="game-status">{this.state.status}</div>
            <div className="fallen-soldier-block">
              {<FallenSoldierBlock
                whiteFallenSoldiers={this.state.whiteFallenSoldiers}
                blackFallenSoldiers={this.state.blackFallenSoldiers}
              />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}