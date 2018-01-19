'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn (
        'pokemons',
        'image',
        {
          type : Sequelize.STRING
        }
      )
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('pokemons', 'image')
    ]
  }
};
