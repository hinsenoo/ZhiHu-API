const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 生成文档 Schema，定义一个模式
const commentSchema = new Schema({
    __v: { type: Number, select: false },
    content: { type: String, required: true },    // 内容
    commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },  // 评论者
    questionId: { type: String, required: true }, // 从属问题 id
    answerId: { type: String, required: true }, // 从属答案 id
});

// 使用模式“编译”模型
module.exports = model('Comment', commentSchema);