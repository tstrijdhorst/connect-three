import { Component } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-level2',
  standalone: false,
  templateUrl: './level2.html',
  styleUrl: './level2.css'
})
export class Level2 {
  private currentPlayerIndex!: number
  private playerNames: string[];
  private boardContent!: number[][]

  constructor() {
    this.playerNames = ['', 'X', 'O']

    this.initializeGame();
  }

  public initializeGame() {
    this.boardContent = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    this.currentPlayerIndex = 1;
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
    if (this.boardContent[row][column] !== 0) {
      return
    }

    this.setOccupyingPlayerIndex(row, column);

    this.toggleCurrentPlayerIndex();
  }

  private toggleCurrentPlayerIndex() {
    this.currentPlayerIndex = this.currentPlayerIndex === 1 ? 2 : 1;
  }

  public getWinnerPlayerName(): string {
    return this.playerNames[this.getWinnerPlayerIndex()];
  }

  public isStaleMate(): boolean {
    if (this.hasWinner()) {
      return false;
    }

    return !this.boardContent.some(row => row.includes(0));
  }

  public hasWinner(): boolean {
    return this.getWinnerPlayerIndex() !== 0;
  }

  private getWinnerPlayerIndex(): number {
    //Horizontal
    if (this.getOccupyingPlayerIndex(0,0) === this.getOccupyingPlayerIndex(0,1)
      && this.getOccupyingPlayerIndex(0,1) === this.getOccupyingPlayerIndex(0,2)) {
        return this.getOccupyingPlayerIndex(0,0)
    }
    if (this.getOccupyingPlayerIndex(1,0) === this.getOccupyingPlayerIndex(1,1)
      && this.getOccupyingPlayerIndex(1,1) === this.getOccupyingPlayerIndex(1,2)) {
        return this.getOccupyingPlayerIndex(1,0)
    }
    if (this.getOccupyingPlayerIndex(2,0) === this.getOccupyingPlayerIndex(2,1)
      && this.getOccupyingPlayerIndex(2,1) === this.getOccupyingPlayerIndex(2,2)) {
        return this.getOccupyingPlayerIndex(2,0)
    }

    //Vertical
    if (this.getOccupyingPlayerIndex(0,0) === this.getOccupyingPlayerIndex(1,0)
      && this.getOccupyingPlayerIndex(1,0) === this.getOccupyingPlayerIndex(2,0)) {
        return this.getOccupyingPlayerIndex(0,0)
    }
    if (this.getOccupyingPlayerIndex(0,1) === this.getOccupyingPlayerIndex(1,1)
      && this.getOccupyingPlayerIndex(1,1) === this.getOccupyingPlayerIndex(2,1)) {
        return this.getOccupyingPlayerIndex(0,1)
    }
    if (this.getOccupyingPlayerIndex(0,2) === this.getOccupyingPlayerIndex(1,2)
      && this.getOccupyingPlayerIndex(1,2) === this.getOccupyingPlayerIndex(2,2)) {
        return this.getOccupyingPlayerIndex(0,2)
    }

    //Diagonal
    if (this.getOccupyingPlayerIndex(0,0) === this.getOccupyingPlayerIndex(1,1)
      && this.getOccupyingPlayerIndex(1,1) === this.getOccupyingPlayerIndex(2,2)) {
        return this.getOccupyingPlayerIndex(0,0)
    }
    if (this.getOccupyingPlayerIndex(0,2) === this.getOccupyingPlayerIndex(1,1)
      && this.getOccupyingPlayerIndex(1,1) === this.getOccupyingPlayerIndex(2,0)) {
        return this.getOccupyingPlayerIndex(0,2)
    }

    return 0;
  }

  private getOccupyingPlayerIndex(row: number, column: number) {
    return this.boardContent[row][column];
  }

  private setOccupyingPlayerIndex(row: number, column: number) {
    this.boardContent[row][column] = this.currentPlayerIndex;
  }
}
