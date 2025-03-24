ZhihumlToMarkdownMap = [{
    regularExpression: /<p><img eeimg="1" src="\/\/www.zhihu.com\/equation\?tex=(.*?)".*?alt="(.*?)".*?><\/p>/g,
    replacement: ((match, p1, p2) => {
        return '$' + p2 + '$'
    })
}]
MarkdownToZhihumlMap = [
    // {
    //     regularExpression: /\\/g,
    //     replacement: '\\\\\\\\'
    //
    // },
    {
        regularExpression: /\$\$([^$]+?)\$\$/g,
        replacement: ((match, p1) => {
             return '<br/><p><img eeimg="1" src="//www.zhihu.com/equation?tex=' + encodeURIComponent(p1) + '" alt="' + p1 + '"/></p>'
        })
    },
    // {
    //     regularExpression: /\\\[([^$]+?)\\]/g,
    //     replacement: ((match, p1) => {
    //          return '<br/><p><img eeimg="1" src="//www.zhihu.com/equation?tex=' + encodeURIComponent(p1) + '" alt="' + p1 + '"/></p>'
    //     })
    // },
    {
        regularExpression: /\$(.+?)\$/g,
        replacement: ((match, p1) => {
            return '<img eeimg="1" src="//www.zhihu.com/equation?tex=' + encodeURIComponent(p1) + '" alt="' + p1 + '"/>'
        })
    },
    // {
    //     regularExpression: /\\\(([^$]+?)\\\)/g,
    //     replacement: ((match, p1) => {
    //         return '<img eeimg="1" src="//www.zhihu.com/equation?tex=' + encodeURIComponent(p1) + '" alt="' + p1 + '"/>'
    //     })
    // },
    // {
    //     regularExpression: /\*\*(.*?)\*\*/g,
    //     replacement: ((match, p1) => {
    //         return '<b>' + p1 + '</b>'
    //     })
    // },
    // {
    //     regularExpression: /\*(.*?)\*/g,
    //     replacement: ((match, p1) => {
    //         return '<i>' + p1 + '</i>'
    //     })
    // },
    // {
    //     regularExpression: /\n/g,
    //     replacement: '<br/>'
    // }

]
DoubaoToMarkdownMap = [
    {
        regularExpression: /\\\(/g,
        replacement: '$'
    },
    {
        regularExpression: /\\\)/g,
        replacement: '$'
    },
    {
        regularExpression: /\\\[/g,
        replacement: '\$\$\$'
    },
    {
        regularExpression: /\\]/g,
        replacement: '\$\$\$'
    },
    // {
    //     regularExpression: /-/g,
    //     replacement: ''
    // },
    // {
    //     regularExpression: /[\n]+?/g,
    //     replacement: '\n'
    // },
    // {
    //     regularExpression: /\$([^$]+)\$/g,
    //     replacement: ((match, p1) => {
    //         if (p1.length > 30) {
    //             return '$$' + p1 + '$$'
    //         } else {
    //             return '$' + p1 + '$'
    //         }
    //     })
    // },
    // {
    //     regularExpression: /\$\$\s/g,
    //     replacement: '$$'
    // },
    // {
    //     regularExpression: /\$\$([^$]+)\$\$([^$])/g,
    //     replacement: ((match, p1, p2) => {
    //         return p2!=='，'&&p2!=='。'&&p2!=='、'? '$$' + p1 + '$$' + p2:'$$' + p1 + '$$'
    //     })
    // }
]
module.exports = {
    ZhihumlToMarkdownMap,
    MarkdownToZhihumlMap,
    DoubaoToMarkdownMap
}
// console.log(ZhihumlToMarkdown);