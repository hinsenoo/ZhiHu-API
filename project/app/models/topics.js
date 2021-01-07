const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 生成文档 Schema，定义一个模式
const topicSchema = new Schema({
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    avatar_url: { type: String },
    // 获取话题简介
    introduction: { type: String, select: false },
}, { timestamps: true });

// 创建用户模型，使用模式“编译”模型
module.exports = model('Topic', topicSchema);