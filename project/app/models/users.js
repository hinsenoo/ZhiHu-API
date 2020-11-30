const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 生成文档 Schema，定义一个模式
const userSchema = new Schema({
    __v: {type: Number, select: false},
    name: { type: String, required: true },
    password: {type: String, required: true, select: false},
    // 用户头像
    avatar_url: { type: String },
    // enum 描述可枚举，从指定字段中返回
    gender: { type: String, enum: ['male', 'famale'], default: 'male', required: true },
    // 一句话介绍
    headline: { type: String },
    // 居住地，数组
    location: { type: [{ type: String }] },
    // 行业
    business: { type: String },
    // 职业经历，多个对象字段
    employments: { 
        type: [{
            company: { type: String },
            job: { type: String },
        }],
    },
    // 教育经历
    educations: {
        type: [{
            school: { type: String },
            major: { type: String },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] },       // 学历
            entrance_year: { type: Number }, // 入学年份
            graduation_year: { type: Number }, // 毕业年份
        }]
    }
});

// 创建用户模型，使用模式“编译”模型
module.exports = model('User', userSchema);