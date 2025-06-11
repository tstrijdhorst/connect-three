import { Component, OnInit } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { GameState } from './game-state.model';
import { GameStateService } from '../game-state-service';

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

  public getWinnerPlayerName(): string {
    return this.playerNames[this.getWinnerPlayerIndex()];
  }

  public isStaleMate(): boolean {
    if (this.hasWinner()) {
      return false;
    }

    return !this.state.boardContent.some(row => row.includes(0));
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
    return this.state.boardContent[row][column];
  }

  private setOccupyingPlayerIndex(row: number, column: number) {
    this.state.boardContent[row][column] = this.state.currentPlayerIndex;
  }
}
