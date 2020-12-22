module.exports = {
    secret: `${process.env.TOKEN_SECRET}`, // token 密钥
    connectionStr: `mongodb://admin:${process.env.YUN_DB_PASS}@hinsenoo.top:27017/zhihuAPI?retryWrites=true&w=majority`,
}