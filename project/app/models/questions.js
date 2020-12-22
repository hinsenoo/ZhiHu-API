const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 生成文档 Schema，定义一个模式
const questionsSchema = new Schema({
    __v: { type: Number, select: false },
    title: { type: String, required: true },
    description: { type: String },
    questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    topics: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
        select: false,
    }
});

// 使用模式“编译”模型
module.exports = model('Question', questionsSchema);