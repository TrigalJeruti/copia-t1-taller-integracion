'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    const usersArray = [];

    usersArray.push({
      username: 'Pepe',
      password: '123',
      name: 'Pepe',
      age: 17,
      psu_score: 18,
      university: 'Harvard',
      gpa_score: 1.5,
      job: 'Peluquero',
      salary: 40.000,
      promotion: true,
      hospital: 'El Salvador',
      operations: ['Tratamiento pulmonar', 'Cirugía al corazón'],
      medical_debt: 5.5,
      createdAt: new Date(),
      updatedAt: new Date(),

    });

    usersArray.push({
      username: 'Manu',
      password: 'manuel_2506',
      name: 'Manuel',
      age: 20,
      psu_score: 18,
      university: 'Universidad de Chile',
      gpa_score: 1.7,
      job: 'Mesero',
      salary: 50.000,
      promotion: true,
      hospital: 'El Salvador',
      operations: ['Cirugía de manos'],
      medical_debt: 4.8,
      createdAt: new Date(),
      updatedAt: new Date(),

    });

    usersArray.push({
      username: 'Dani',
      password: '_dani_13',
      name: 'Daniela',
      age: 22,
      psu_score: 30,
      university: 'Universidad Catolica',
      gpa_score: 2.5,
      job: 'Asistente de ventas',
      salary: 60.000,
      promotion: true,
      hospital: 'El Salvador',
      operations: ['Tratamiento muscular', 'Cirugia de cadera'],
      medical_debt: 3.6,
      createdAt: new Date(),
      updatedAt: new Date(),

    });

    return queryInterface.bulkInsert('users', usersArray);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
