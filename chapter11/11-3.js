const { is } = require("immutable");

var jsonString = `
    {
        "title": "habit",
        "fileds": ["title", "weight", "number_of_pages"]
    }
`;

JSON.parse(jsonString);

var searchBooksRequestSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    fieldes: {
      type: 'array',
      items: {
        enum: [
          'title',
          'full_title',
          'subtitles',
          'publisher',
          'published_date',
          'weight',
          'number_of_pages',
          'subjects',
          'publishers',
          'genre',
        ],
      },
    },
  },
  required: ['title', 'fieldes'],
};

