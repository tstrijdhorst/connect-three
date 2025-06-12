import { Level2 } from './level2';
import { GameStateService } from '../game-state-service';
import { GameState } from './game-state.model';

describe('Level2', () => {
  let component: Level2;
  let mockGameStateService: jasmine.SpyObj<GameStateService>;

  beforeEach(() => {
    mockGameStateService = jasmine.createSpyObj<GameStateService>('GameStateService', [
      'getState',
      'getDefaultState',
      'saveState'
    ]);

    mockGameStateService.getDefaultState.and.returnValue({
        version: 1,
      boardContent: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      currentPlayerIndex: 1
    });

    component = new Level2(mockGameStateService);
    component.initializeGame();
  });

  describe('win conditions', () => {
    it('should detect horizontal win on first row', () => {
      // X | X | X
      //   |   |  
      //   |   |  
      component.makeMove({row: 0, column: 0});
      component.makeMove({row: 1, column: 0});
      component.makeMove({row: 0, column: 1});
      component.makeMove({row: 1, column: 1});
      component.makeMove({row: 0, column: 2});

      expect(component.hasWinner()).toBeTrue();
      expect(component.getWinnerPlayerName()).toBe('X');
    });

    it('should detect horizontal win on second row', () => {
      //   |   |  
      // O | O | O
      //   |   |  
      component.makeMove({row: 0, column: 0});
      component.makeMove({row: 1, column: 0});
      component.makeMove({row: 2, column: 0});
      component.makeMove({row: 1, column: 1});
      component.makeMove({row: 2, column: 1});
      component.makeMove({row: 1, column: 2});

      expect(component.hasWinner()).toBeTrue();
      expect(component.getWinnerPlayerName()).toBe('O');
    });

    it('should detect vertical win on first column', () => {
      // X |   |  
      // X |   |  
      // X |   |  
      component.makeMove({row: 0, column: 0});
      component.makeMove({row: 0, column: 1});
      component.makeMove({row: 1, column: 0});
      component.makeMove({row: 1, column: 1});
      component.makeMove({row: 2, column: 0});

      expect(component.hasWinner()).toBeTrue();
      expect(component.getWinnerPlayerName()).toBe('X');
    });

    it('should detect vertical win on third column', () => {
      //   |   | O
      //   |   | O
      //   |   | O
      component.makeMove({row: 0, column: 0});
      component.makeMove({row: 0, column: 2});
      component.makeMove({row: 1, column: 0});
      component.makeMove({row: 1, column: 2});
      component.makeMove({row: 2, column: 1});
      component.makeMove({row: 2, column: 2});

      expect(component.hasWinner()).toBeTrue();
      expect(component.getWinnerPlayerName()).toBe('O');
    });

    it('should detect diagonal win (top-left to bottom-right)', () => {
      // X |   |  
      //   | X |  
      //   |   | X
      component.makeMove({row: 0, column: 0});
      component.makeMove({row: 0, column: 1});
      component.makeMove({row: 1, column: 1});
      component.makeMove({row: 0, column: 2});
      component.makeMove({row: 2, column: 2});

      expect(component.hasWinner()).toBeTrue();
      expect(component.getWinnerPlayerName()).toBe('X');
    });

    it('should detect diagonal win (top-right to bottom-left)', () => {
      //   |   | O
      //   | O |  
      // O |   |  
      component.makeMove({row: 0, column: 0});
      component.makeMove({row: 0, column: 2});
      component.makeMove({row: 1, column: 0});
      component.makeMove({row: 1, column: 1});
      component.makeMove({row: 2, column: 2});
      component.makeMove({row: 2, column: 0});

      expect(component.hasWinner()).toBeTrue();
      expect(component.getWinnerPlayerName()).toBe('O');
    });
  });

  describe('stalemate conditions', () => {
    it('should detect stalemate when board is full with no winner', () => {
      // X | O | X
      // X | O | O
      // O | X | X
      component.makeMove({row: 0, column: 0}); // X
      component.makeMove({row: 0, column: 1}); // O
      component.makeMove({row: 0, column: 2}); // X
      component.makeMove({row: 1, column: 1}); // O
      component.makeMove({row: 1, column: 0}); // X
      component.makeMove({row: 2, column: 0}); // O
      component.makeMove({row: 1, column: 2}); // X
      component.makeMove({row: 2, column: 2}); // O
      component.makeMove({row: 2, column: 1}); // X

      expect(component.hasWinner()).toBeFalse();
      expect(component.isStaleMate()).toBeTrue();
    });

    it('should not detect stalemate when board is not full', () => {
      component.makeMove({row: 0, column: 0});
      component.makeMove({row: 0, column: 1});
      component.makeMove({row: 0, column: 2});

      expect(component.isStaleMate()).toBeFalse();
    });
  });

  describe('game rules', () => {
    it('should not allow moves on occupied squares', () => {
      component.makeMove({row: 0, column: 0});
      const initialBoard = JSON.parse(JSON.stringify(component['state'].boardContent));

      // Try to make move on same square
      component.makeMove({row: 0, column: 0});

      expect(component['state'].boardContent).toEqual(initialBoard);
    });

    it('should not allow moves after game is won', () => {
      // Create winning condition
      component.makeMove({row: 0, column: 0});
      component.makeMove({row: 1, column: 0});
      component.makeMove({row: 0, column: 1});
      component.makeMove({row: 1, column: 1});
      component.makeMove({row: 0, column: 2});

      const boardAfterWin = JSON.parse(JSON.stringify(component['state'].boardContent));

      // Try to make another move
      component.makeMove({row: 2, column: 2});

      expect(component['state'].boardContent).toEqual(boardAfterWin);
    });
  });
});