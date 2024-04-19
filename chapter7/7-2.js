import Ajv from 'ajv';

var searchBooksRequestSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    fields: {
      type: 'array',
      items: {
        enum: ['publisher', 'number_of_pages', 'weight', 'physical_format', 'subject', 'publish_date', 'physical_dimensions'],
      },
    },
  },
  required: ['title', 'fields'],
};

var serachBooksRequest = {
    title: "habit",
    fields: ["publisher", "weight", "number_of_pages"]
}

var ajv = new Ajv();
console.log(ajv.validate(searchBooksRequestSchema, serachBooksRequest))
// true

