import { multi } from "@arrows/multimethod";
import _ from "lodash";

// テキスト書式のスキーマ
var textFormatSchema = {
  name: { type: 'string' },
  type: { enum: ['markdown', 'html'] },
};

// 著者のスキーマ
var authorSchema = {
  type: 'object',
  required: ['id', 'name', 'bookIsbns'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    bookIsbns: {
      type: 'array',
      items: { type: 'string' },
    },
  },
};

// Author.myNameマルチメソッドの初期化
Author.prolificityLevel = function(auhtor) {
    var books = _.size(_.get(author, "bookIsbns")) 
    if(books <= 10) {
        return "low"
    }

    if(books >= 51) {
        return "high"
    }

    return "medium"
}

var authorNameArgsSchema = {
    type: 'array',
    prefixItems: [
        authorSchema,
        {enum: ['markdown', 'html']}
    ]
}

function authorNameDispatch(author, format) {
    if(dev()) {
        if(!ajv.validate(authorNameArgsSchema, [author, format])) {
            throw("Author.myName called with invalid arguments: " + ajv.errorsText(ajv.errors));
        }
    }

    return [Author.prolificityLevel(author), format]
}

Author.myName = multi(authorNameDispatch)

// HTMLをフォーマットを処理するメソッド
function authorNameLowHtml(author, format) {
    return `<i>${_get(author, "name")}</i>`
}
Author.myName = method("low", "html", authorNameLowHtml)(Author.myName)

function authorNameMediumHtml(author, format) {
    return `<b>${_get(author, "name")}</b>`
}
Author.myName = method("medium", "html", authorNameMediumHtml)(Author.myName)

function authorNameHighHtml(author, format) {
    return `<b><i>${_get(author, "name")}</i></b>`
}
Author.myName = method("high", "html", authorNameHighHtml)(Author.myName)

// マークダウンをフォーマットするメソッド
function authorNameLowMarkdown(author, format) {
    return `*${_get(author, "name")}*`
}
Author.myName = method("low", "markdown", authorNameLowMarkdown)(Author.myName)

function authorNameMediumMarkdown(author, format) {
    return `**${_get(author, "name")}**`
}
Author.myName = method("medium", "markdown", authorNameMediumMarkdown)(Author.myName)

function authorNameHighMarkdown(author, format) {
    return `***${_get(author, "name")}***`
}
Author.myName = method("high", "markdown", authorNameHighMarkdown)(Author.myName)


// HTMLフォーマットのテスト
var yehonathan = {
    id: "book-item-123",
    name: "Yehonathan Sharvit",
    bookIsbns: ["9781718500823"]
}

Author.myName(yehonathan, "html") // => "<i>Yehonathan Sharvit</i>"
Author.myName(yehonathan, "markdown") // => "*Yehonathan Sharvit*"