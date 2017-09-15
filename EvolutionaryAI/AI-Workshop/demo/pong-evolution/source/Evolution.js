
(function(global) {

	const _GENERATIONS = global.GENERATIONS = [];


	const Evolution = function(data) {

		this.settings = Object.assign({
			history:     4,
			population: 16
		}, data);

	};


	Evolution.prototype = {

		cycle: function() {

			let population   = [];
			let s_history    = this.settings.history;
			let s_population = this.settings.population;


			// No Generations available
			// - fast route, just generate a new plain one

			if (_GENERATIONS.length === 0) {

				for (let p = 0; p < s_population; p++) {

					// New Population
					// - each Agent's brain is random by default

					population.push(new Agent());

				}

			} else {

				let current = _GENERATIONS[_GENERATIONS.length - 1];

				// Sort the current Population
				// - Higher fitness first (to 0)
				// - Lower fitness last (to length - 1)

				current.sort(function(agent_a, agent_b) {
					if (agent_a.fitness > agent_b.fitness) return -1;
					if (agent_a.fitness < agent_b.fitness) return  1;
					return 0;
				});


				let amount = (0.2 * current.length) | 0;

				// 20% Survivor Population
				// - Agent.clone() leads to unlinked clone
				// - this avoids coincidence of 1 Agent leading to multiple Entities

				for (let i = 0; i < amount; i++) {

					let agent = current[i];
					let clone = agent.clone();

					population.push(clone);

				}

				// 20% Mutant Population
				// - new Agent() leads to randomized Brain
				for (let i = 0; i < amount; i++) {
					population.push(new Agent());
				}



				let b = 0;

				// TODO: for the reader: Fix this for population size being 13 or so
				let remaining = ((current.length - population.length) / 2) | 0;

				// TODO: Rest of Breed Population
				// - b is automatically reset if bigger than 20%
				// - b leads to multiple incest Babies for multiple dominant Agents
				// - best Agent by fitness can now breed
				// - Babies are the ones from dominant population

				for (let i = 0; i < remaining; i++) {

					let mum = current[b];
					let dad = current[b + 1];

					// XXX: Alternative: Second genome is random part of population
					// let dad = current[(Math.random() * current.length) | 0];

					let [ son, daughter ] = mum.crossover(dad);

					population.push(son);
					population.push(daughter);

					b += 2;
					b %= amount;

				}

			}


			// Track the Population
			// - just for the sake of Debugging, tbh.

			_GENERATIONS.push(population);


			// Optionally track more Generations
			// - in case something goes wrong
			// - set settings.history to higher value

			if (_GENERATIONS.length > s_history) {
				_GENERATIONS.splice(0, _GENERATIONS.length - s_history);
			}


			return population;

		}

	};


	global.Evolution = Evolution;

})(typeof global !== 'undefined' ? global : this);

