module.exports = {
  async up(db, client) {
    db.collection('players').createIndex({ username: 1 }, { unique: true });
  },

  async down(db, client) {
    db.collection('players').dropIndex({ username: 1 });
  },
};
