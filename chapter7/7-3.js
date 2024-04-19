import Ajv from 'ajv';

var searchBooksRsponseSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['title', 'available'],
    properties: {
      title: { type: 'string' },
      available: { type: 'boolean' },
      subtitle: { type: 'string' },
      number_of_pages: { type: 'number' },
      subject: { 
        type: 'array',
        items: {type: "string"}
      },
      isbn: { type: 'string' },
      isbn_13: { type: 'string' },
    }
  }
};

var bookInfoSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['title', 'available'],
    properties: {
      title: { type: 'string' },
      available: { type: 'boolean' },
      subtitle: { type: 'string' },
      number_of_pages: { type: 'number' },
      subject: { 
        type: 'array',
        items: {type: "string"}
      },
      isbn: { type: 'string' },
      isbn_13: { type: 'string' },
    }
  }
}

var serachBooksResponseSchema = {
  type: 'array',
  items: bookInfoSchema
}





var ajv = new Ajv();

