import { Component, OnInit } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { GameState } from './game-state.model';
import { GameStateService } from '../game-state-service';

type PlayerID = number;
type PlayerName = string;

export interface Square {
  row: number,
  column: number,
}

export interface Player {
  id: PlayerID,
  name: PlayerName,
}

@Component({
  selector: 'app-level2',
  standalone: false,
  templateUrl: './level2.html',
  styleUrl: './level2.css'
})
export class Level2 implements OnInit {
  private state!: GameState;
  private players: Player[];

  constructor(private gameStateService: GameStateService) {
    this.players = [
      { id: 1, name: 'X' },
      { id: 2, name: 'O' }
    ];
  }

  ngOnInit(): void {
    this.state = this.gameStateService.getState();
  }

  public initializeGame() {
    this.state = this.gameStateService.getDefaultState();
    this.gameStateService.saveState(this.state);
  }

  public getClassName(square: Square): string {
    if (this.getOccupyingPlayer(square) === null) {
      return ''
    }

    return `occupied-${this.getPlayerName(square)}`
  }

  public makeMove(square: Square): void {
    if (this.hasWinner()) {
      return
    }
    if (this.isOccupied(square)) {
      return
    }

    this.setOccupyingPlayer(square, this.getCurrentPlayer());

    this.toggleCurrentPlayerIndex();
    this.gameStateService.saveState(this.state);
  }

  public getPlayerName(square: Square): PlayerName | undefined {
    return this.getOccupyingPlayer(square)?.name
  }

  public getWinnerPlayerName(): PlayerName | undefined {
    return this.getWinningPlayer()?.name;
  }

  public isStaleMate(): boolean {
    if (this.hasWinner()) {
      return false;
    }

    return !this.state.boardContent.some(row => row.includes(0));
  }

  public hasWinner(): boolean {
    return this.getWinningPlayer() !== null;
  }

  private findPlayerIfEqualIn3Squares(
    square1: Square,
    square2: Square,
    square3: Square,
  ): Player | null {
    const player1 = this.getOccupyingPlayer(square1);
    const player2 = this.getOccupyingPlayer(square2);
    const player3 = this.getOccupyingPlayer(square3);

    const allSquaresMatch = player1 === player2 && player2 === player3;
    const squareNotEmpty = player1 !== null;

    return allSquaresMatch && squareNotEmpty ? player1 : null;
  }

  private getWinningPlayer(): Player | null {
    // Define all possible winning combinations
    const winningCombinations = [
      // Horizontal
      [{ row: 0, column: 0 }, { row: 0, column: 1 }, { row: 0, column: 2 }],
      [{ row: 1, column: 0 }, { row: 1, column: 1 }, { row: 1, column: 2 }],
      [{ row: 2, column: 0 }, { row: 2, column: 1 }, { row: 2, column: 2 }],

      // Vertical
      [{ row: 0, column: 0 }, { row: 1, column: 0 }, { row: 2, column: 0 }],
      [{ row: 0, column: 1 }, { row: 1, column: 1 }, { row: 2, column: 1 }],
      [{ row: 0, column: 2 }, { row: 1, column: 2 }, { row: 2, column: 2 }],

      // Diagonal
      [{ row: 0, column: 0 }, { row: 1, column: 1 }, { row: 2, column: 2 }],
      [{ row: 0, column: 2 }, { row: 1, column: 1 }, { row: 2, column: 0 }]
    ];

    // Check each combination
    for (const combination of winningCombinations) {
      const winner = this.findPlayerIfEqualIn3Squares(
        combination[0],
        combination[1],
        combination[2]
      );
      if (winner !== null) {
        return winner;
      }
    }

    return null;
  }

  private isOccupied(square: Square) {
    return this.state.boardContent[square.row][square.column] !== 0;
  }

  private getOccupyingPlayer(square: Square): Player | null {
    if (!this.isOccupied(square)) {
      return null;
    }

    return this.getPlayerById(this.state.boardContent[square.row][square.column]);
  }

  private getCurrentPlayer(): Player {
    return this.getPlayerById(this.state.currentPlayerIndex);
  }

  private toggleCurrentPlayerIndex() {
    this.state.currentPlayerIndex = this.state.currentPlayerIndex === 1 ? 2 : 1;
  }

  private getPlayerById(id: PlayerID): Player {
    return this.players[id - 1]
  }

  private setOccupyingPlayer(square: Square, player: Player): void {
    this.state.boardContent[square.row][square.column] = player.id
  }
}
