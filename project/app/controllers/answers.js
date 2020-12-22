const Answer = require('../models/answers'); 

class AnswerCtl {
    async find(ctx) {
        // 若无指定数量，默认 perPage 为 10
        const { per_page = 10 } = ctx.query;
        // 确保最低为 0，防止传入 -1 0
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        // 确保最低为 1，防止传入 -1 0
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        // 查询内容是否符合某个关键字，并且精确匹配 questionId
        ctx.body = await Answer
            .find({ content: q, questionId: ctx.params.questionId })
            .limit(perPage).skip(page * perPage);
    }
    // 检查问题是否存在 中间件
    async checkAnswerExist(ctx, next) {
        const answer = await Answer.findById(ctx.params.id).select('+answerer');
        if (!answer) { ctx.throw(404, '答案不存在'); }
        if (answer.questionId !== ctx.params.questionId) {
            ctx.throw(404, '该问题下没有此答案');
        }
        // 存储问题，减少重复查询
        ctx.state.answer = answer;
        // 执行后续中间件
        await next();
    }
    async findById(ctx) {
        // 默认值为空字符串
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer');
        ctx.body = answer;
    }
    async create(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
        });
        const answerer = ctx.state.user._id;
        const { questionId } = ctx.params;
        const answer = await new Answer({ ...ctx.request.body, answerer, questionId }).save();
        ctx.body = answer;
    }
    async checkAnswerer(ctx, next) {
        const { answer } = ctx.state;
        if (answer.answerer.toString() !== ctx.state.user._id ) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
    async update(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: false },
        });
        // 返回的是更新前的数据
        await ctx.state.answer.updateOne(ctx.request.body);
        ctx.body = ctx.state.answer;
    }
    async delete(ctx) {
        await Answer.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }
}

module.exports = new AnswerCtl;