export default (orm, DataTypes) => {
  const Post = orm.define('post', {
    body: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    paranoid: true,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {});

  return Post;
};
