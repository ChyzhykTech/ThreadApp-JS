import userRepository from '../../data/repositories/userRepository';

export const getUserById = async userId => {
  const { id, username, email, imageId, image } = await userRepository.getUserById(userId);
  return { id, username, email, imageId, image };
};

export const updateUser = async (userId, imageId, user) => {
  const userByName = await userRepository.getByUsername(user.username);

  if (userByName !== null && userByName.id !== userId) {
    throw new Error('Username should be unique');
  }

  const { id } = await userRepository.updateById(userId, {
    ...user,
    imageId
  });
  return getUserById(id);
};
