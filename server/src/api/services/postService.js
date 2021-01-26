import postRepository from '../../data/repositories/postRepository';
import postReactionRepository from '../../data/repositories/postReactionRepository';
import postNegativeReactionRepository from '../../data/repositories/postNegativeReactionRepository';

export const getPosts = filter => postRepository.getPosts(filter);

export const getPostById = id => postRepository.getPostById(id);

export const create = (userId, post) => postRepository.create({
  ...post,
  userId
});

export const setReaction = async (userId, { postId, isLike = true }) => {
  // define the callback for future use as a promise
  const updateOrDelete = react => (react.isLike === isLike
    ? postReactionRepository.deleteById(react.id)
    : postReactionRepository.updateById(react.id, { isLike }));

  const checkCallback = async (react, negativeReact) => {
    if (react && negativeReact) {
      if (react.isLike && negativeReact.isDislike) {
        await postNegativeReactionRepository.deleteById(negativeReact.id);
      }
    }
    return react !== null;
  };

  const reaction = await postReactionRepository.getPostReaction(userId, postId);
  const negativeReaction = await postNegativeReactionRepository.getPostNegativeReaction(userId, postId);

  const result = await checkCallback(reaction, negativeReaction)
    ? await updateOrDelete(reaction)
    : await postReactionRepository.create({ userId, postId, isLike });

  // the result is an integer when an entity is deleted
  return Number.isInteger(result) ? {} : postReactionRepository.getPostReaction(userId, postId);
};

export const setNegativeReaction = async (userId, { postId, isDislike = true }) => {
  // define the callback for future use as a promise
  const updateOrDelete = negativeReact => (negativeReact.isDislike === isDislike
    ? postNegativeReactionRepository.deleteById(negativeReact.id)
    : postNegativeReactionRepository.updateById(negativeReact.id, { isDislike }));

  const checkCallback = async (react, negativeReact) => {
    if (react && negativeReact) {
      if (react.isLike && negativeReact.isDislike) {
        await postReactionRepository.deleteById(react.id);
      }
    }
    return negativeReact !== null;
  };

  const reaction = await postReactionRepository.getPostReaction(userId, postId);
  const negativeReaction = await postNegativeReactionRepository.getPostNegativeReaction(userId, postId);

  const result = await checkCallback(reaction, negativeReaction)
    ? await updateOrDelete(negativeReaction)
    : await postNegativeReactionRepository.create({ userId, postId, isDislike });

  // the result is an integer when an entity is deleted
  return Number.isInteger(result) ? {} : postNegativeReactionRepository.getPostNegativeReaction(userId, postId);
};
