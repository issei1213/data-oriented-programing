import Ajv from "ajv"

var basicBookInfoSchema = {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string' },
      publishers: {
        type: "array",
        items: {type: 'string'}
      },
      number_of_pages: { type: 'integer' },
      weight: { type: 'string' },
      physical_format: { type: 'string' },
      subjects: {
        type: 'array',
        items: { type: 'string' }
      
      },
      isbn_13: {
        type: 'array',
        items:{type: "string"}
      
      },
      isbn_10: {
        type: 'array',
        items: {type: "string"}
      },
      publish_date: {type: 'string'},
      physical_dimensions: {type: 'string'}
    },
  }
  
var mandaroyIsbn13 = {
    type: 'object',
    required: ['isbn_13'],
}

var mandaroyIsbn10 = {
    type: 'object',
    required: ['isbn_10'],
}

var bookInfoShchama = {
    'allof': [
        basicBookInfoSchema,
        {
        'anyof': [mandaroyIsbn10, mandaroyIsbn13]
        }
    ]
}

var ajv = new Ajv({allErrors: true})

class OpenLibraryDataSource  {
    static rawBookInfo(isbn) {
        var url = `https://openlibrary.org/isbn/${isbn}.json`
        // レスポンスのボディでJSONを取得
        var jsonString = fetchResponseBody(url)
        return JSON.parse(jsonString)
    }

    static bookInfo(isbn, requestedFileds) {
        var relevantFileds = ['title', 'full_title', 'subtitle', 'publisher', 'publidate_date', 'weight', 'physical_dimensions']
        var rowInfo = rowBookInfo(isbn)
        if(!ajv.validate(bookInfoShchama, rowInfo)){
            var errors = ajv.errorsText(ajv, errors)        
            throw "Internet error: Unexpected result from Open Books API: " + errors
        }

        var relevantInfo = _.pick(_.pick(rowInfo, relevantFileds), requestedFileds)
        return _.set(relevantInfo, 'isbn', isbn)

    }
}