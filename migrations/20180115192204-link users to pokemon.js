'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
  queryInterface.addColumn(
    'usertopokemons',
    'pokeid',
    {
      type: Sequelize.INTEGER,
      allowNull:false,
      references: {
        model:'pokemons',
        key:'id'
      }
    }
  ),
  queryInterface.addColumn(
    'usertopokemons',
    'userid',
    {
      type: Sequelize.INTEGER,
      allowNull:false,
      references:{
        model:'users',
        key:'id'
      }
    }
  )
  ]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('usertopokemons','pokeid'),
      queryInterface.removeColumn('usertopokemons','userid')
    ]
  }
};
