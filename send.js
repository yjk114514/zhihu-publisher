const {headers, accountCookie} = require('../note/src/net/config');

async function updateArticle(articleId, title, content) {
    const body = {
        "title": title.toString(),
        "content": content.toString(),
        "table_of_contents": false,
        "delta_time": 1
    };
    console.log(body)
    return fetch(`https://zhuanlan.zhihu.com/api/articles/${articleId}/draft`, {
        "headers": {
            ...headers,
            "cookie": `z_c0=${accountCookie.z_c0}`
        },
        "body": JSON.stringify(body),
        "method": "PATCH"
    }).then(
        ()=> console.log("Updated: "+ articleId)
    )
}

async function createArticle(title, content) {
    const body = {
        "title": "1",
        "delta_time": 0,
        "can_reward": false
    }

    return fetch("https://zhuanlan.zhihu.com/api/articles/drafts", {
        "headers": {
            ...headers,
            "cookie": `z_c0=${accountCookie.z_c0}`
        },
        "body": JSON.stringify(body),
        "method": "POST"
    }).then(res => res.json()).then(res => res.id).then((articleId) => {
            const body = {
                "title": title.toString(),
                "content": content.toString(),
                "table_of_contents": false,
                "delta_time": 1
            };
            fetch(`https://zhuanlan.zhihu.com/api/articles/${articleId}/draft`, {
                "headers": {
                    ...headers,
                    "cookie": `z_c0=${accountCookie.z_c0}`
                },
                "body": JSON.stringify(body),
                "method": "PATCH"
            });
            console.log("Created: "+ articleId)
            return articleId;
        }
    )
}

async function deleteArticle(articleId) {
    return fetch(`https://www.zhihu.com/api/v4/articles/${articleId}/draft`, {
        "headers": {
            ...headers,
            "cookie": `z_c0=${accountCookie.z_c0}`
        },
        "body": null,
        "method": "DELETE"
    }).then(()=> console.log("Deleted: "+ articleId));
}

exports.sendEdition = {
    createArticle,
    updateArticle,
    deleteArticle
}
