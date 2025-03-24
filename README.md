# zhihu-publisher
Tools help you to publish articles just by vscode or jetbrain IDEs, like turning zhihu into a MarkDown Github

## What we do: 

Make MD file compatible with HTML on zhihu

With logging in, you can create, delete, update, publish articles on zhihu

Compare the difference between your local file and the remote file on zhihu

## How to use:

```javascript
const {publisher} = require("./src/index");

publisher.init()
publisher.setCookie("your cookie z_c0")
publisher.setWorkDir("path to your md files dir")
publisher.push()
```

