import { Cell } from "../models/Cell";
import { GameState } from "../models/Game.enum";


export class CellService{

    buildBoard(rows: number, columns: number, numberOfMines: number) : Cell[][]{

        let board: Cell[][] = []
        for(let i = 0; i < rows; i++){
            let rows: Cell[] = [];
            for(let j = 0; j < columns; j++){
              let element: Cell = {status: 'toOpen', mine: false, mineProximity: 0};
              rows.push(element);
            }
            board.push(rows);
        }


        this.putMines(numberOfMines, board, rows, columns);
        this.GetMineProximity(board, rows, columns);

        return board;
    }


    putMines(numberOfMines: number, board: Cell[][], rows: number, columns: number) : Cell[][]{
        let set = new Set<([number, number])>;
        let i: number = 0;

        while(i < numberOfMines){
            let pairs: [number, number] = [Math.floor(Math.random() * (rows)), Math.floor(Math.random() * (columns))];

            if(!set.has(pairs) && !board[pairs[0]][pairs[1]].mine){
                set.add(pairs);
                board[pairs[0]][pairs[1]].mine = true;
                i++;
            }
        }

        return board;
    }


    GetMineProximity(board: Cell[][], rows: number, columns: number) : Cell[][]{
        
        const CASILLAS_ADYACENTES: number[][] = [
                                    [1, 1],
                                    [-1, -1],
                                    [-1, 1],
                                    [1, -1],
                                    [1, 0],
                                    [-1, 0],
                                    [0, 1],
                                    [0, -1]
        ];

        
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < columns; j++){
                let mines: number = 0;
                for(const pair of CASILLAS_ADYACENTES){
                    if(!this.isValid(i + pair[0], j + pair[1], rows, columns)){
                        continue;
                    }
                    
                    if(board[i + pair[0]][ j + pair[1]].mine){
                        mines++;
                    }
                }

                board[i][j].mineProximity = mines;
            }
        }

        return board;

    }


    gameOver(board: Cell[][]){
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board[i].length; j++){
                if(board[i][j].mine){
                    board[i][j].status = 'mine';
                }
            }
        }
    }


    changeDifficulty(difficulty: string) : [number, number, number]{

        let rows, columns = 5;
        let numberOfMines = 1;
        if(difficulty == "Easy"){
            rows = columns = 8;
            numberOfMines = 10;
        }
        else if(difficulty == "Medium"){
            rows = columns = 13;
            numberOfMines = 20;
        }
        else if(difficulty == "Hard"){
            rows = columns = 15;
            numberOfMines = 40;
        }
        else{
            rows = columns = 15;
            numberOfMines = 90;
        }


        return [rows, columns, numberOfMines];
    }


    getDifficultys() : string[]
    {
        return ["Easy", "Medium", "Hard", "Extreme"];
    }

    checkCell(board: Cell[][], row: number, column: number, cellsGame: any, numberOfMines: number, gameEstate: GameState) : GameState{
        
        if(board[row][column].mine){
            board[row][column].status = 'mine';
            this.gameOver(board);
            return GameState.lose;
        }
        else if((cellsGame.cellsOpened) >= (cellsGame.cells - cellsGame.numberMines)){
            return GameState.win;
        }
    
        return GameState.playing;
    }


    isValid(i: number, j: number, rows: number, columns: number) : boolean{
        if((i < 0 || j < 0) || (i >= rows || j >= columns)){
            return false;
        }

        return true;
    }

    openCell(board: Cell[][],row: number, column: number, rows: number, columns: number, cellsGame: any, PnumberOfFlags: any) : void {
        if(!this.isValid(row, column, rows, columns) || board[row][column].status == 'open' || board[row][column].mine){
            return;
        }
        else if(board[row][column].mineProximity != 0){
            if(board[row][column].status == 'flag'){
                PnumberOfFlags.flags += 1;
            }
            board[row][column].status = 'open';
            cellsGame.cellsOpened += 1;
        }
        else if(board[row][column].mineProximity == 0){
    
            if(board[row][column].status == 'flag'){
                PnumberOfFlags.flags += 1;
            }
            board[row][column].status = 'open';
            cellsGame.cellsOpened += 1;
            this.openCell(board, row + 1, column, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row - 1, column, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row, column + 1, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row, column - 1, rows, columns, cellsGame, PnumberOfFlags);

            this.openCell(board, row + 1, column + 1, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row - 1, column - 1, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row - 1, column + 1, rows, columns, cellsGame, PnumberOfFlags);
            this.openCell(board, row + 1, column - 1, rows, columns, cellsGame, PnumberOfFlags);
        }
    }

    flag(cell: Cell) : void{
        if(cell.status == 'toOpen'){
            cell.status = 'flag';
        }
        else if(cell.status == 'flag'){
            cell.status = 'toOpen';
        }
    }


    


    
}