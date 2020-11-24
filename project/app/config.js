module.exports = {
    secret: `${process.env.TOKEN_SECRET}`, // token 密钥
    connectionStr: `mongodb+srv://hins:${process.env.DB_PASS}@hins.naxyu.mongodb.net/zhihuAPI?retryWrites=true&w=majority`,
}