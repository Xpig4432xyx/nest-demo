import { HttpException, Injectable } from '@nestjs/common';
import { PostsEntity } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface PostsRo {
  list: PostsEntity[];
  count: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  /**
   * 创建文章
   * @param post
   */
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }
    return await this.postsRepository.save(post);
  }

  /**
   * 查找文章列表
   * @param query
   */
  async findAll(query): Promise<PostsRo> {
    const qb = await this.postsRepository.createQueryBuilder('posts');
    qb.where('1=1');
    qb.orderBy('posts.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset((pageNum - 1) * pageSize);
    const posts = await qb.getMany();
    return { list: posts, count };
  }

  /**
   * 获取指定文章
   * @param id
   */
  async findById(id): Promise<PostsEntity> {
    console.log('id', id);
    // const qb = await this.postsRepository.createQueryBuilder('post')
    return await this.postsRepository.findOne(id);
  }

  /**
   * 更新文章
   * @param id
   * @param post
   */
  async updateById(id, post: Partial<PostsEntity>): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException('文章不存在', 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return await this.postsRepository.save(updatePost);
  }

  /**
   * 删除文章
   * @param id
   */
  async deleteById(id): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException('文章不存在', 401);
    }
    return await this.postsRepository.remove(existPost);
  }
}
