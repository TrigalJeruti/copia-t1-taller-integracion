'use strict';

const usertoken = require("../models/usertoken");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      psu_score: {
        type: Sequelize.INTEGER
      },
      university: {
        type: Sequelize.STRING
      },
      gpa_score: {
        type: Sequelize.FLOAT
      },
      job: {
        type: Sequelize.STRING
      },
      salary: {
        type: Sequelize.FLOAT
      },
      promotion: {
        type: Sequelize.BOOLEAN
      },
      hospital: {
        type: Sequelize.STRING
      },
      operations: {
        type: Sequelize.ARRAY(Sequelize.TEXT) 
      },
      medical_debt: {
        type: Sequelize.FLOAT
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};