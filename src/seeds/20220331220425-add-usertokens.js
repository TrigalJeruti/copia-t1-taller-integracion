'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
        
    const usertokensArray = [];

    usertokensArray.push({
      userid: 1,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.qA8kttsYXzh9haXPA_sIyuN6Jz6RrJ6jRZa7pRT4Wro',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usertokensArray.push({
      userid: 2,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIn0.HYz7ZQK-LBrFRhLDXCXMbEIznaKBXDyY6yXGwfPCJ7s',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usertokensArray.push({
      userid: 3,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIn0.ltUvdYPvIIynPA3XDovBaSEGjgWCQC7MaYmz8ltMeWI',
      createdAt: new Date(),
      updatedAt: new Date(),
    });


    return queryInterface.bulkInsert('usertokens', usertokensArray);
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
