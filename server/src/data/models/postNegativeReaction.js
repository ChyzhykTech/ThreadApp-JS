export default (orm, DataTypes) => {
  const postNegativeReaction = orm.define('postNegativeReaction', {
    isDislike: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  return postNegativeReaction;
};
