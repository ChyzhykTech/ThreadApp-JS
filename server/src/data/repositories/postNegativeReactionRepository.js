import { PostNegativeReactionModel, PostModel } from '../models/index';
import BaseRepository from './baseRepository';

class PostNegativeReactionRepository extends BaseRepository {
  getPostNegativeReaction(userId, postId) {
    return this.model.findOne({
      group: [
        'postNegativeReaction.id',
        'post.id'
      ],
      where: { userId, postId },
      include: [{
        model: PostModel,
        attributes: ['id', 'userId']
      }]
    });
  }
}

export default new PostNegativeReactionRepository(PostNegativeReactionModel);
