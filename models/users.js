'use strict';
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    bio: DataTypes.STRING,
    age: DataTypes.INTEGER,
    image: DataTypes.STRING,
    hometown: DataTypes.STRING
  }, {});

users.associate = (models) => {
  users.belongsToMany(models.pokemon,
    {
      through : 'usertopokemon',
      foreignKey : 'userid'
  })
}

  return users;
};
