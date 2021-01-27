import postRepository from '../../data/repositories/postRepository';
import postReactionRepository from '../../data/repositories/postReactionRepository';
import postNegativeReactionRepository from '../../data/repositories/postNegativeReactionRepository';

export const getPosts = filter => postRepository.getPosts(filter);

export const getPostById = id => postRepository.getPostById(id);

export const create = (userId, post) => postRepository.create({
  ...post,
  userId
});

export const deletePost = id => postRepository.softDeletePost(id);

export const setReaction = async (userId, { postId, isLike = true }) => {
  // define the callback for future use as a promise
  const updateOrDelete = react => (react.isLike === isLike
    ? postReactionRepository.deleteById(react.id)
    : postReactionRepository.updateById(react.id, { isLike }));

  const reaction = await postReactionRepository.getPostReaction(userId, postId);

  const result = reaction
    ? await updateOrDelete(reaction)
    : await postReactionRepository.create({ userId, postId, isLike });

  // the result is an integer when an entity is deleted
  return Number.isInteger(result) ? {} : postReactionRepository.getPostReaction(userId, postId);
};

export const setNegativeReaction = async (userId, { postId, isDislike = true }) => {
  // define the callback for future use as a promise
  const updateOrDelete = react => (react.isDislike === isDislike
    ? postNegativeReactionRepository.deleteById(react.id)
    : postNegativeReactionRepository.updateById(react.id, { isDislike }));

  const reaction = await postNegativeReactionRepository.getPostNegativeReaction(userId, postId);

  const result = reaction
    ? await updateOrDelete(reaction)
    : await postNegativeReactionRepository.create({ userId, postId, isDislike });

  // the result is an integer when an entity is deleted
  return Number.isInteger(result) ? {} : postNegativeReactionRepository.getPostNegativeReaction(userId, postId);
};
