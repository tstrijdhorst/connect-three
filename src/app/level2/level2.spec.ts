import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameStateService } from '../game-state-service';
import { Level2 } from './level2';
import { Player, Square } from './level2';

describe('Level2 Component', () => {
    let component: Level2;
    let fixture: ComponentFixture<Level2>;
    let gameStateService: GameStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [Level2],
            providers: [GameStateService],
        });

        fixture = TestBed.createComponent(Level2);
        component = fixture.componentInstance;
        gameStateService = TestBed.inject(GameStateService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a winner', () => {
        // Horizontal win
        component.initializeGame();
        component.makeMove({ row: 0, column: 0 });
        component.makeMove({ row: 1, column: 0 });
        component.makeMove({ row: 0, column: 1 });
        component.makeMove({ row: 1, column: 1 });
        component.makeMove({ row: 0, column: 2 });
        expect(component.hasWinner()).toBeTrue();
        expect(component.getWinnerPlayerName()).toEqual('X');

        // Vertical win
        component.initializeGame();
        component.makeMove({ row: 0, column: 0 });
        component.makeMove({ row: 1, column: 0 });
        component.makeMove({ row: 0, column: 1 });
        component.makeMove({ row: 2, column: 0 });
        component.makeMove({ row: 0, column: 2 });
        expect(component.hasWinner()).toBeTrue();
        expect(component.getWinnerPlayerName()).toEqual('X');

        // Diagonal win
        component.initializeGame();
        component.makeMove({ row: 0, column: 0 });
        component.makeMove({ row: 1, column: 1 });
        component.makeMove({ row: 1, column: 0 });
        component.makeMove({ row: 2, column: 2 });
        component.makeMove({ row: 2, column: 0 });
        expect(component.hasWinner()).toBeTrue();
        expect(component.getWinnerPlayerName()).toEqual('X');
    });

    it('should have a vertical win in the first column', () => {
      component.initializeGame();
      component.makeMove({ row: 0, column: 0 }); // X
      component.makeMove({ row: 1, column: 1 }); // O
      component.makeMove({ row: 1, column: 0 }); // X
      component.makeMove({ row: 2, column: 1 }); // O
      component.makeMove({ row: 2, column: 0 }); // X
      expect(component.hasWinner()).toBeTrue();
      expect(component.getWinnerPlayerName()).toEqual('X');
    });

    it('should have a vertical win in the second column', () => {
      component.initializeGame();
      component.makeMove({ row: 0, column: 1 }); // X
      component.makeMove({ row: 1, column: 0 }); // O
      component.makeMove({ row: 1, column: 1 }); // X
      component.makeMove({ row: 2, column: 0 }); // O
      component.makeMove({ row: 2, column: 1 }); // X
      expect(component.hasWinner()).toBeTrue();
      expect(component.getWinnerPlayerName()).toEqual('X');
    });

    it('should have a vertical win in the third column', () => {
      component.initializeGame();
      component.makeMove({ row: 0, column: 2 }); // X
      component.makeMove({ row: 1, column: 0 }); // O
      component.makeMove({ row: 1, column: 2 }); // X
      component.makeMove({ row: 2, column: 0 }); // O
      component.makeMove({ row: 2, column: 2 }); // X
      expect(component.hasWinner()).toBeTrue();
      expect(component.getWinnerPlayerName()).toEqual('X');
    });

    it('should have a stalemate', () => {
        component.initializeGame();

        // Fill the board with moves, but leave one square empty
        component.makeMove({ row: 0, column: 0 }); // X
        component.makeMove({ row: 0, column: 2 }); // O
        component.makeMove({ row: 2, column: 0 }); // X
        component.makeMove({ row: 1, column: 1 }); // O
        component.makeMove({ row: 2, column: 2 }); // X
        component.makeMove({ row: 2, column: 1 }); // O
        component.makeMove({ row: 0, column: 1 }); // X
        component.makeMove({ row: 1, column: 0 }); // X
        component.makeMove({ row: 1, column: 2 }); // O
        expect(component.isStaleMate()).toBeTrue();
    })
});