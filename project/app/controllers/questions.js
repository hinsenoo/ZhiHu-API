const Question = require('../models/questions'); 

class QuestionCtl {
    async find(ctx) {
        // 若无指定数量，默认 perPage 为 10
        const { per_page = 10 } = ctx.query;
        // 确保最低为 0，防止传入 -1 0
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        // 确保最低为 1，防止传入 -1 0
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        // $or 匹配任意一项都能命中，匹配标题或者描述
        ctx.body = await Question
            .find({ $or: [ { title: q }, { description: q } ] })
            .limit(perPage).skip(page * perPage);
    }
    // 检查问题是否存在 中间件
    async checkQuestionExist(ctx, next) {
        const question = await Question.findById(ctx.params.id).select('+questioner');
        if (!question) { ctx.throw(404, '问题不存在'); }
        // 存储问题，减少重复查询
        ctx.state.question = question;
        // 执行后续中间件
        await next();
    }
    async findById(ctx) {
        // 默认值为空字符串
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics');
        ctx.body = question;
    }
    async create(ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: true },
            description: { type: 'string', required: false },
        });
        const question = await new Question({ ...ctx.request.body, questioner: ctx.state.user._id }).save();
        ctx.body = question;
    }
    async checkQuestioner(ctx, next) {
        const { question } = ctx.state;
        if (question.questioner.toString() !== ctx.state.user._id ) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
    async update(ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: false },
            description: { type: 'string', required: false },
        });
        // 返回的是更新前的数据
        await ctx.state.question.updateOne(ctx.request.body);
        ctx.body = ctx.state.question;
    }
    async delete(ctx) {
        await Question.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }
}

module.exports = new QuestionCtl;