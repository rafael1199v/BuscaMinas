import { Component } from '@angular/core';
import { Cell } from '../models/Cell';
import { CellService } from '../services/Cell.service';
import { GameState } from '../models/Game.enum';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  
  board: Cell[][] = [];
  gameState: GameState = GameState.playing;

  rows: number;
  columns: number;
  numberOfMines: number;
  cellsGame: any;
  difficulty: string;
  numberOfFlags: number;
  

  constructor(private cellService: CellService){
    this.rows= 5;
    this.columns = 5;
    this.numberOfMines = this.numberOfFlags = 0;
    this.difficulty = "Easy"
    this.cellsGame = {cellsOpened: 0, cells: this.rows * this.columns, numberMines: this.numberOfMines};
    this.changeDifficulty();
  }


  checkCell(row: number, column: number){
    let PnumberOfFlags: any = {flags: 0};
    if(this.board[row][column].status != 'flag'){
      this.cellService.openCell(this.board, row, column, this.rows, this.columns, this.cellsGame, PnumberOfFlags);
      this.numberOfFlags += PnumberOfFlags.flags;
      this.gameState = this.cellService.checkCell(this.board, row, column, this.cellsGame, this.numberOfMines, this.gameState);
    }
  }

  flag(cell: Cell){
    this.cellService.flag(cell);

    if(cell.status == 'toOpen'){
      this.numberOfFlags++;
    }
    else if(cell.status == 'flag'){
      this.numberOfFlags--;
    }

    
    return false;
  }


  reset(){
    this.board = this.cellService.buildBoard(this.rows, this.columns, this.numberOfMines);
    this.gameState = GameState.playing;
    this.cellsGame = {cellsOpened: 0, cells: this.rows * this.columns, numberMines: this.numberOfMines};
    this.numberOfFlags = this.numberOfMines;
  }

  getDifficultys() : string[]{
    return this.cellService.getDifficultys();
  }


  changeDifficulty(){
    let changes: [number, number, number] = this.cellService.changeDifficulty(this.difficulty);
    this.rows = changes[0];
    this.columns = changes[1];
    this.numberOfMines = this.numberOfFlags = changes[2]; 
    this.reset();
  }


}
