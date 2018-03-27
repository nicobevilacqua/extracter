const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const getProperty = ($$, property) => {
  const $ = $$;
  if (property.parent) {
    const childProperties = property.properties;
    delete childProperties.parent;
    return $(property.parent).toArray().map(parent =>
      // eslint-disable-next-line no-use-before-define
      crawler($(parent).html(), childProperties)
    );
  }

  let selector = property.selector || property;
  let isArray = false;
  if (Array.isArray(selector)) {
    selector = selector[0];
    isArray = true;
  }

  const tmp = selector.split('@');
  selector = tmp[0];
  const attr = tmp[1] || property.attr || undefined;

  let result;
  if (attr) {
    if (attr === 'text') {
      result = $(selector).toArray().map(r => $(r).text());
    } else {
      result = $(selector).toArray().map(r => $(r).attr(attr));
    }
  } else {
    result = $(selector).toArray().map(r => $(r).html());
  }

  if (parseInt(property.match, 10) === property.match) {
    result = result[property.match];
  }

  // SI EL SELECTOR NO ES UN ARRAY ENTONCES DEVUELVO SOLAMENTE EL PRIMER
  // ELEMENTO
  if (!isArray && Array.isArray(result)) {
    result = result[0];
  }

  if (property.limit) {
    result = result.slice(0, property.limit);
  }

  return result;
};

const crawler = (html, _properties) => {
  const $ = cheerio.load(html, {
    normalizeWhitespace: true,
    decodeEntities: false,
  });

  let properties = _properties;

  // SI PASO UN STRING SOLO DEVUELVO UN STRING
  if (typeof properties === 'string' || Array.isArray(properties)) {
    properties = {
      default: properties,
    };
  }

  const keys = Object.keys(properties);
  const result = keys.map(key =>
    getProperty($, properties[key])
  ).reduce((inputAcum, property, i) => {
    const acum = inputAcum;
    acum[keys[i]] = property;
    return acum;
  }, {});
  if (result.default) {
    return result.default;
  }
  return result;
};

const url = require('url');

const validUrl = inputUrl => {
  const parsedUrl = url.parse(inputUrl);
  return parsedUrl.hostname && parsedUrl.host;
};

const request = require('request');
const oneLine = require('common-tags').oneLine;
// DEFAULT PROPERTIES
const agent = oneLine`
Mozilla/5.0 (X11; Linux x86_64)
AppleWebKit/537.36 (KHTML, like Gecko)
Chrome/52.0.2743.82 Safari/537.36
`;
const timeout = 10000;
const gzip = false;
const xtracter = (_connection, properties) =>
new Promise((resolve, reject) => {
  let connection = _connection;

  // SI PASO LA URL COMO PRIMER PARAMETRO
  if (typeof _connection === 'string') {
    // IS PARAM HTML TEXT?
    if (!validUrl(_connection)) {
      return resolve(_connection);
    }
    connection = {
      url: _connection,
    };
  }

  if (!connection.url) {
    return reject('No url!');
  }
  connection.timeout = connection.timeout || timeout;
  connection.headers = connection.headers || {};
  connection.headers['User-Agent'] = connection.headers['User-Agent'] || agent;
  connection.gzip = connection.gzip || gzip;

  return request(connection, (error, response, body) => {
    if (error) {
      return reject(error);
    }
    if (!response.statusCode || response.statusCode !== 200) {
      return reject(`Page error ${response.statusCode}`);
    }
    // RETURN HTML
    if (typeof body !== 'string' && connection.charset) {
      const parsedBody = iconv.decode(body, connection.charset);
      return resolve(parsedBody);
    }
    return resolve(body);
  });
}).then(html =>
  new Promise(resolve => {
    const result = crawler(html, properties);
    return resolve(result);
  })
);


module.exports = xtracter;
