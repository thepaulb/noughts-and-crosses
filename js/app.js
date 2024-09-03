class Game {
	constructor(game) {
		this.game = game;
		this.jumpTo = null;
		this.winner = null;
		this.history = [];
		this.nextMove = 'X';
	  
		// html elements;
		this.status = this.game.querySelector('.status');
		this.squares = Array.from(this.game.querySelectorAll('.square'));
		this.log = this.game.querySelector('.log ol');
		
		this.updateHistory();
	  
		this.game.addEventListener('click', this);
	}
	
	handleEvent(event) {
		this.handleMove(event);
		this.handleJump(event);
	}
	
	handleJump(event) {
		let btn = event.target.closest('[data-jump-to]');
		
		if(!btn) return;	
		
		// get history index;
		this.jumpTo = Number(btn.getAttribute('data-jump-to'));

		// reset squares based on the relevant history index;
		let history = this.history[this.jumpTo];
		
		this.squares.forEach((square, index) => {
			if(history.state[index]) {
				square.setAttribute('data-isfilled', true);
			} else {
				square.removeAttribute('data-isfilled');
			}
 			square.innerHTML = history.state[index];
		});
		
		this.nextMove = history.nextMove;
		this.winner = history.winner;
		
		// clean up history and remove un-needed button;
		this.updateHistory();
		// update status;
		this.updateStatus();
	}
	
	handleMove(event) {
		let btn = event.target.closest('.square');
		
		if(!btn || btn.getAttribute('data-isfilled') || this.winner) return;
					
		btn.setAttribute('data-isfilled', true);
		btn.innerHTML = this.nextMove;
		this.nextMove = this.nextMove === 'X' ? 'O' : 'X';
		this.winner = this.checkWinner();
		
		// update history with current move;
		this.updateHistory();
		
		// update game status;
		this.updateStatus();		
	}
	
	updateHistory() {
		// handle if we aare in a history state reset;
		if(this.jumpTo !== null) {
			
			// remove jump to buttons;
			let items = this.log.querySelectorAll('li');
			items.forEach((item, index) => {
				if(index > this.jumpTo) {
					item.remove();
				}
			});
			
			// update internal history;
			this.history = this.history.slice(0, this.jumpTo + 1);
			this.jumpTo = null;
			return;
		}
		
		this.history.push({
			state: this.getSquareValues(),
			nextMove: this.nextMove,
			winner: this.winner
		});
		
		// update history state buttons, leaving 'reset game' button;
		if(this.history.length > 1) {
			let i = this.history.length - 1;
			this.log.innerHTML += `<li><button data-jump-to="${i}">Move ${i}</button</li>`;
		}
	}
	
	updateStatus() {
		if(this.winner) {
			this.status.innerHTML = `Winner: ${this.winner}`;
			return;
		}
		this.status.innerHTML = `Next move: ${this.nextMove}`;
	}x

	checkWinner() {
		// winning lines;
		let lines = [
			[0,1,2],
			[3,4,5],
			[6,7,8],
			[0,3,6],
			[1,4,7],
			[2,5,8],
			[0,4,8],
			[2,4,6]
		]
		
		let squares = this.getSquareValues();
		
		for(let i = 0; i <= lines.length - 1; i++) {
			let [a, b, c] = lines[i];
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				return squares[a];
			}
		}
		return null;
	}
	
	getSquareValues() {
		// return the vlues of squares as array;
		return this.squares.map((square) => {
			return square.innerHTML;
		})
	}

}
