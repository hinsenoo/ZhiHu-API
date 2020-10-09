const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 生成文档 Schema，定义结构
const userSchema = new Schema({
    name: { type: String, required: true },
});

// 用户模型
module.exports = model('User', userSchema);