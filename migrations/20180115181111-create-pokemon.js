'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pokemons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pokeid: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      hp: {
        type: Sequelize.INTEGER
      },
      attack: {
        type: Sequelize.INTEGER
      },
      defense: {
        type: Sequelize.INTEGER
      },
      spattack: {
        type: Sequelize.INTEGER
      },
      spdefense: {
        type: Sequelize.INTEGER
      },
      speed: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.INTEGER
      },
      attackone: {
        type: Sequelize.STRING
      },
      attacktwo: {
        type: Sequelize.STRING
      },
      attackthree: {
        type: Sequelize.STRING
      },
      attackfour: {
        type: Sequelize.STRING
      },
      desc: {
        type: Sequelize.STRING
      },
      weakness: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('pokemons');
  }
};