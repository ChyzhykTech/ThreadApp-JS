export default (orm, DataTypes) => {
  const PostReaction = orm.define('postReaction', {
    isLike: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {
    timestramps: true,
    paranoid: true
  });

  return PostReaction;
};
