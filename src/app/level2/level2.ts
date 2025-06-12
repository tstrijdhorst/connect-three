import { Component, OnInit } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { GameState } from './game-state.model';
import { GameStateService } from '../game-state-service';

export interface Square {
  row: number,
  column: number,
}

@Component({
  selector: 'app-level2',
  standalone: false,
  templateUrl: './level2.html',
  styleUrl: './level2.css'
})
export class Level2 implements OnInit {
  private playerNames = ['', 'X', 'O'];
  private state!: GameState;

  constructor(private gameStateService: GameStateService) {
  }

  ngOnInit(): void {
    this.state = this.gameStateService.getState();
  }

  public initializeGame() {
    this.state = this.gameStateService.getDefaultState();
    this.gameStateService.saveState(this.state);
  }

  public getPlayerName(row: number, column: number): string {
    return this.playerNames[this.getOccupyingPlayerIndex(row, column)]
  }

  public getClassName(row: number, column: number): string {
    if (this.getOccupyingPlayerIndex(row, column) === 0) {
      return ''
    }

    return `occupied-${this.getPlayerName(row, column)}`
  }

  public set(row: number, column: number): void {
    if (this.hasWinner()) {
      return
    }
    if (this.state.boardContent[row][column] !== 0) {
      return
    }

    this.setOccupyingPlayerIndex(row, column);

    this.toggleCurrentPlayerIndex();
    this.gameStateService.saveState(this.state);
  }

  private toggleCurrentPlayerIndex() {
    this.state.currentPlayerIndex = this.state.currentPlayerIndex === 1 ? 2 : 1;
  }

  public getWinnerPlayerName(): string|null {
    const winningPlayerIndex = this.getWinnerPlayerIndex();

    if (winningPlayerIndex === null) {
      return null;
    }

    return this.playerNames[winningPlayerIndex];
  }

  public isStaleMate(): boolean {
    if (this.hasWinner()) {
      return false;
    }

    return !this.state.boardContent.some(row => row.includes(0));
  }

  public hasWinner(): boolean {
    return this.getWinnerPlayerIndex() !== null;
  }

  private findPlayerIfEqualIn3Squares(
    square1: Square,
    square2: Square,
    square3: Square,
  ): number | null {
    const player1 = this.getOccupyingPlayerIndex(square1.row, square1.column);
    const player2 = this.getOccupyingPlayerIndex(square2.row, square2.column);
    const player3 = this.getOccupyingPlayerIndex(square3.row, square3.column);

    const allSquaresMatch = player1 === player2 && player2 === player3;
    const squareNotEmpty = player1 !== 0;

    return allSquaresMatch && squareNotEmpty ? player1 : null;
  }

  private getWinnerPlayerIndex(): number | null {
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


  private getOccupyingPlayerIndex(row: number, column: number) {
    return this.state.boardContent[row][column];
  }

  private setOccupyingPlayerIndex(row: number, column: number) {
    this.state.boardContent[row][column] = this.state.currentPlayerIndex;
  }
}
