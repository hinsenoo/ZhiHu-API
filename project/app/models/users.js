const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 生成文档 Schema，定义一个模式
const userSchema = new Schema({
    __v: {type: Number, select: false},
    name: { type: String, required: true },
    password: {type: String, required: true, select: false},
});

// 创建用户模型，使用模式“编译”模型
module.exports = model('User', userSchema);