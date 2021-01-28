export default models => {
  const {
    User,
    Post,
    PostReaction,
    PostNegativeReaction,
    Comment,
    Image
  } = models;

  Image.hasOne(User);
  Image.hasOne(Post);

  User.hasMany(Post);
  User.hasMany(Comment);
  User.hasMany(PostReaction);
  User.hasMany(PostNegativeReaction);
  User.belongsTo(Image);

  Post.belongsTo(Image);
  Post.belongsTo(User);
  Post.hasMany(PostReaction);
  Post.hasMany(PostNegativeReaction);
  Post.hasMany(Comment);

  Comment.belongsTo(User);
  Comment.belongsTo(Post);

  PostReaction.belongsTo(Post);
  PostReaction.belongsTo(User);

  PostNegativeReaction.belongsTo(Post);
  PostNegativeReaction.belongsTo(User);
};
