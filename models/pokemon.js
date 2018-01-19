'use strict';
module.exports = (sequelize, DataTypes) => {
  var pokemon = sequelize.define('pokemon', {
    pokeid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    hp: DataTypes.INTEGER,
    attack: DataTypes.INTEGER,
    defense: DataTypes.INTEGER,
    spattack: DataTypes.INTEGER,
    spdefense: DataTypes.INTEGER,
    speed: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    attackone: DataTypes.STRING,
    attacktwo: DataTypes.STRING,
    attackthree: DataTypes.STRING,
    attackfour: DataTypes.STRING,
    desc: DataTypes.STRING,
    weakness: DataTypes.STRING,
    image: DataTypes.STRING
  }, {});

pokemon.associate = (models) => {
  pokemon.belongsToMany(models.users,
    {
      through : 'usertopokemon',
      foreignKey : 'pokeid'
    })
}

  return pokemon;
};
