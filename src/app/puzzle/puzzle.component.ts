import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-puzzle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css'],
  animations: [
    trigger('tileSlide', [
      transition('* => *', [
        animate('200ms ease-out')
      ])
    ])
  ]
})
export class PuzzleComponent implements OnInit {
  tiles: number[] = [];
  gridSize: number = 3;
  moves: number = 0;
  gameComplete: boolean = false;
  baseSize: number = 500;
  tileWidth: number = 0;
  tileHeight: number = 0;
  imageUrl: string = 'https://picsum.photos/500/500';
  showComplete: boolean = false;
  availableImages: any;

  ngOnInit() {
    this.tileWidth = this.baseSize / this.gridSize;
    this.tileHeight = this.baseSize / this.gridSize;
    this.initializePuzzle();
  }

  initializePuzzle() {
    this.tiles = Array.from({ length: this.gridSize * this.gridSize - 1 }, (_, i) => i + 1);
    this.tiles.push(0); // 0 represents empty tile
    this.shuffleTiles();
    this.moves = 0;
    this.gameComplete = false;
    this.showComplete = false;
  }

  shuffleTiles() {
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
    // Ensure puzzle is solvable
    if (!this.isSolvable()) {
      this.shuffleTiles();
    }
  }

  isSolvable(): boolean {
    let inversions = 0;
    for (let i = 0; i < this.tiles.length - 1; i++) {
      for (let j = i + 1; j < this.tiles.length; j++) {
        if (this.tiles[i] && this.tiles[j] && this.tiles[i] > this.tiles[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  }

  moveTile(index: number) {
    const emptyIndex = this.tiles.indexOf(0);
    if (this.isValidMove(index, emptyIndex)) {
      [this.tiles[index], this.tiles[emptyIndex]] = [this.tiles[emptyIndex], this.tiles[index]];
      this.moves++;
      this.checkWin();
    }
  }

  isValidMove(index: number, emptyIndex: number): boolean {
    const row = Math.floor(index / this.gridSize);
    const emptyRow = Math.floor(emptyIndex / this.gridSize);
    const col = index % this.gridSize;
    const emptyCol = emptyIndex % this.gridSize;

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  }

  checkWin() {
    const isComplete = this.tiles.every((tile, index) => 
      index === this.tiles.length - 1 ? tile === 0 : tile === index + 1
    );

    if (isComplete) {
      this.gameComplete = true;
      setTimeout(() => {
        this.showComplete = true;
        this.fireConfetti();
      }, 500);
    }
  }

  fireConfetti() {
    const myConfetti = confetti.create(undefined, { 
      resize: true,
      useWorker: true
    });

    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: any) {
      myConfetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        spread: 26,
        startVelocity: 55,
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }

  getTileStyle(index: number) {
    const tile = this.tiles[index];
    if (tile === 0) return { visibility: 'hidden' };

    const row = Math.floor((tile - 1) / this.gridSize);
    const col = (tile - 1) % this.gridSize;
    const currentRow = Math.floor(index / this.gridSize);
    const currentCol = index % this.gridSize;

    return {
      backgroundImage: `url(${this.imageUrl})`,
      backgroundSize: `${this.gridSize * 100}%`,
      backgroundPosition: `-${col * 100}% -${row * 100}%`,
      width: `${this.tileWidth}px`,
      height: `${this.tileHeight}px`,
      transform: `translate(${currentCol * this.tileWidth}px, ${currentRow * this.tileHeight}px)`
    };
  }

  getTilePosition(index: number) {
    const row = Math.floor(index / this.gridSize);
    const col = index % this.gridSize;
    return `translate(${col * this.tileWidth}px, ${row * this.tileHeight}px)`;
  }

  getAnimationState(index: number) {
    return {
      value: this.tiles[index],
      params: { tileTransform: this.getTilePosition(index) }
    };
  }

  // Add method to change image
  changeImage(index: number) {
    this.imageUrl = this.availableImages[index];
    this.initializePuzzle(); // Reset puzzle with new image
  }
}