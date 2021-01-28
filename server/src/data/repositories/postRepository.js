import sequelize from '../db/connection';
import {
  PostModel,
  CommentModel,
  UserModel,
  ImageModel,
  PostReactionModel,
  PostNegativeReactionModel
} from '../models/index';
import BaseRepository from './baseRepository';

const likeCase = bool => `CASE WHEN "postReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;
const dislikeCase = bool => `CASE WHEN "postNegativeReactions"."isDislike" = ${bool} THEN 1 ELSE 0 END`;

class PostRepository extends BaseRepository {
  async getPosts(filter) {
    const {
      from: offset,
      count: limit,
      userId,
      userLikedId
    } = filter;

    const where = {};
    const whereLiked = {};
    if (userId) {
      Object.assign(where, { userId });
    }

    if (userLikedId) {
      Object.assign(whereLiked, { userId: userLikedId });
    }

    return this.model.findAll({
      where,
      attributes: {
        include: [
          [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId")`), 'commentCount'],
          [sequelize.fn('SUM', sequelize.literal(likeCase(true))), 'likeCount'],
          [sequelize.fn('SUM', sequelize.literal(dislikeCase(false))), 'dislikeCount']
        ]
      },
      include: [{
        model: ImageModel,
        attributes: ['id', 'link']
      }, {
        model: UserModel,
        attributes: ['id', 'username'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }, {
        model: PostReactionModel,
        where: whereLiked,
        attributes: ['userId'],
        duplicating: false
      }, {
        model: PostNegativeReactionModel,
        attributes: [],
        duplicating: false
      }],
      group: [
        'post.id',
        'image.id',
        'user.id',
        'user->image.id',
        'postReactions.id'
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });
  }

  getPostById(id) {
    return this.model.findOne({
      group: [
        'post.id',
        'comments.id',
        'comments->user.id',
        'comments->user->image.id',
        'user.id',
        'user->image.id',
        'image.id'
      ],
      where: { id },
      attributes: {
        include: [
          [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId")`), 'commentCount'],
          [sequelize.fn('SUM', sequelize.literal(likeCase(true))), 'likeCount'],
          [sequelize.fn('SUM', sequelize.literal(dislikeCase(false))), 'dislikeCount']
        ]
      },
      include: [{
        model: CommentModel,
        include: {
          model: UserModel,
          attributes: ['id', 'username'],
          include: {
            model: ImageModel,
            attributes: ['id', 'link']
          }
        }
      }, {
        model: UserModel,
        attributes: ['id', 'username'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }, {
        model: ImageModel,
        attributes: ['id', 'link']
      }, {
        model: PostReactionModel,
        attributes: ['userId']
      },
      {
        model: PostNegativeReactionModel,
        attributes: []
      }]
    });
  }

  softDeletePost(id) {
    return this.model.destroy({
      where: { id }
    });
  }
}

export default new PostRepository(PostModel);
