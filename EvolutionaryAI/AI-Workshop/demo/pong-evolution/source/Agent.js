
(function(global) {

	const _BRAIN_REFERENCE = {
		inputs: [
			0,   0.5, // paddle position
			0,   0.8, // ball position
			0.5, 0.2  // ball speed (1.0 == 25px/frame)
		],
		outputs: [
			0.8 // targeted y position
		]
	};


	const Agent = function(data) {

		this.brain   = new Brain();
		this.fitness = 0;


		// XXX: Brain needs a reference dataset
		this.brain.initialize(
			_BRAIN_REFERENCE.inputs,
			_BRAIN_REFERENCE.outputs
		);

	};

	Agent.prototype = {

		compute: function(inputs) {
			return this.brain.compute(inputs);
		},

		learn: function(inputs, outputs) {
			return this.brain.learn(inputs, outputs);
		},

		clone: function() {

			let clone = new Agent();

			// This will copy/paste the exact same Brain
			// onto our clone. We need this method for
			// having non-linked properties, in case
			// this implementation is reused in an
			// Evolutionary algorithm.

			clone.fitness      = this.fitness;
			clone.brain.layers = JSON.parse(JSON.stringify(this.brain.layers));


			return clone;

		},

		crossover: function(agent) {

			let weights_mum = this.brain.serialize();
			let weights_dad = agent.brain.serialize();
			let dna_split   = (Math.random() * weights_mum.length) | 0;
			let babies      = [ new Agent(), new Agent() ];
			let weights_son = [];
			let weights_daughter = [];


			for (let i = 0; i < weights_mum.length; i++) {

				if (i < dna_split) {
					weights_son[i] = weights_dad[i];
					weights_daughter[i] = weights_mum[i];
				} else {
					weights_son[i] = weights_mum[i];
					weights_daughter[i] = weights_dad[i];
				}

			}

			babies[0].brain.deserialize(weights_son);
			babies[1].brain.deserialize(weights_daughter);


			return babies;

		}

	};


	global.Agent = Agent;

})(typeof global !== 'undefined' ? global : this);

