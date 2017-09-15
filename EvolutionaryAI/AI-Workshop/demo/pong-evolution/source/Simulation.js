
(function(global) {


	const Simulation = function(data) {

		let settings = Object.assign({}, data);


		this.active = settings.active;
		this.fps    = 60;

		this.evolution = new Evolution({
			population: settings.games * 2
		});

		this.games = new Array(settings.games).fill(0).map(v => new Game());


		settings = null;

	};


	Simulation.prototype = {

		start: function() {

			let evolution  = this.evolution;
			let games      = this.games;
			let population = evolution.cycle();


			// TODO: Make start() reuse population (don't create new one)
			// TODO: Fix Game.restart() method

			let p = 0;

			games.forEach(game => {

				game.population = [
					population[p],
					population[p + 1]
				];

				game.start();

				p += 2;

			});

		},

		stop: function() {

			let games = this.games;

			for (let g = 0, gl = games.length; g < gl; g++) {
				games[g].stop();
			}

		},

		update: function() {

			let games   = this.games;
			let running = false;

			for (let g = 0, gl = games.length; g < gl; g++) {

				let game = games[g];
				if (game._has_ended === false) {
					games[g].update();
					running = true;
				}

			}


			if (running === true) {
				setTimeout(_ => this.update(), 1000 / this.fps);
			}

		},

		render: function() {

			let game = this.games[this.active] || null;
			if (game !== null) {

				game.render();

				if (game._has_ended === false) {
					requestAnimationFrame(_ => this.render());
				}

			}

		},



		/*
		 * CUSTOM API
		 */

		setActive: function(active) {

			active = typeof active === 'number' ? active : 0;


			if (active >= 0 && active < this.games.length) {

				this.active = active;

				return true;

			}


			return false;

		},

		setFPS: function(fps) {

			fps = typeof fps === 'number' ? fps : 60;


			if (this.fps !== fps) {

				this.fps = fps;

				let games = this.games;

				for (let g = 0, gl = games.length; g < gl; g++) {
					games[g].setFPS(fps);
				}


				return true;

			}


			return false;

		}

	};


	global.Simulation = Simulation;

})(typeof global !== 'undefined' ? global : this);

