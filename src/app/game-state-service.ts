import { Injectable } from '@angular/core';
import { GameState } from './level2/game-state.model';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  constructor() { }

  private readonly STORAGE_KEY = 'game-state';
  private readonly CURRENT_VERSION = 1;

  public saveState(state: GameState) {
    const stateToSave: GameState = {
      ...state,
      version: this.CURRENT_VERSION
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
  }

  public getState(): GameState {
    const savedStateJSON = localStorage.getItem(this.STORAGE_KEY);

    if (!savedStateJSON) {
      return this.getDefaultState();
    }

    try {
      return JSON.parse(savedStateJSON) as GameState;
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
    return this.getDefaultState();
  }

  public clearState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  public getDefaultState(): GameState {
    return {
      version: this.CURRENT_VERSION,
      currentPlayerIndex: 1,
      boardContent: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    }
  }
}
