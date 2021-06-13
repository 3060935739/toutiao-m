// postcss 的配置文件

module.exports = {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 37.5,
            propList: ['*']
        }
    }
}