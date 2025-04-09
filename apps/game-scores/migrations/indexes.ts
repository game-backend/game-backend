module.exports = {
  async up(db, client) {
    db.collection('scores').createIndex({ score: -1 });
  },

  async down(db, client) {
    db.collection('scores').dropIndex({ score: -1 });
  },
};
