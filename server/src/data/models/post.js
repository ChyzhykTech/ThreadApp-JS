export default (orm, DataTypes) => {
  const Post = orm.define('post', {
    body: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {
    timestramps: true,
    paranoid: true
  });

  return Post;
};
