'use strict';
module.exports = (sequelize, DataTypes) => {
  var usertopokemon = sequelize.define('usertopokemon', {}, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return usertopokemon;
};