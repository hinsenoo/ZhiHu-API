const Comment = require('../models/comments'); 

class CommentCtl {
    async find(ctx) {
        // 若无指定数量，默认 perPage 为 10
        const { per_page = 10 } = ctx.query;
        // 确保最低为 0，防止传入 -1 0
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        // 确保最低为 1，防止传入 -1 0
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        const { questionId, answerId } = ctx.params;
        const { rootCommentId } = ctx.query;
        // 查询内容是否符合某个关键字，并且精确匹配 questionId，answerId
        // 并且要返回评论人的信息
        ctx.body = await Comment
            .find({ content: q, questionId, answerId, rootCommentId })
            .limit(perPage).skip(page * perPage)
            .populate('commentator replyTo');
    }
    // 检查答案是否存在 中间件
    async checkCommentExist(ctx, next) {
        const comment = await Comment.findById(ctx.params.id).select('+commentator');
        if (!comment) { ctx.throw(404, '评论不存在'); }
        // 只有在删改查时候才检查此逻辑，赞和踩答案的时候不检查
        if (ctx.params.questionId && comment.questionId !== ctx.params.questionId) {
            ctx.throw(404, '该问题下没有此评论');
        }
        if (ctx.params.answerId && comment.answerId !== ctx.params.answerId) {
            ctx.throw(404, '该答案下没有此评论');
        }
        // 存储问题，减少重复查询
        ctx.state.comment = comment;
        // 执行后续中间件
        await next();
    }
    async findById(ctx) {
        // 默认值为空字符串
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        // 动态查找 commentator
        const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator');
        ctx.body = comment;
    }
    async create(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
            rootCommentId: { type: 'string', required: false },
            replyTo: { type: 'string', required: false },
        });
        const commentator = ctx.state.user._id;
        const { questionId, answerId } = ctx.params;
        const comment = await new Comment({ ...ctx.request.body, commentator, questionId, answerId }).save();
        ctx.body = comment;
    }
    async checkCommentator(ctx, next) {
        const { comment } = ctx.state;
        if (comment.commentator.toString() !== ctx.state.user._id ) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
    async update(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: false },
        });
        // 只允许更新评论内容
        const { content } = ctx.request.body;
        // 返回的是更新前的数据
        await ctx.state.comment.updateOne({ content });
        ctx.body = ctx.state.comment;
    }
    async delete(ctx) {
        await Comment.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }
}

module.exports = new CommentCtl;