export default {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'posts',
      'deletedAt',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    ),
    queryInterface.addColumn(
      'postReactions',
      'deletedAt',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    ),
    queryInterface.addColumn(
      'postNegativeReactions',
      'deletedAt',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    )
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('users', 'deletedAt'),
    queryInterface.removeColumn('posts', 'deletedAt'),
    queryInterface.removeColumn('postReactions', 'deletedAt'),
    queryInterface.removeColumn('postNegativeReactions', 'deletedAt')
  ])
};
