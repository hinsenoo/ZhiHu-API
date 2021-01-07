const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 生成文档 Schema，定义一个模式
const answerSchema = new Schema({
    __v: { type: Number, select: false },
    content: { type: String, required: true },    // 内容
    answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },  // 回答者
    questionId: { type: String, required: true }, // 从属问题 id
    voteCount: { type: Number, required: true, default: 0 }, // 投票数
}, { timestamps: true });

// 使用模式“编译”模型
module.exports = model('Answer', answerSchema);