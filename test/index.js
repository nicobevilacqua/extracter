/* global describe, it, before */
const chai = require('chai');

chai.config.includeStack = true;
chai.config.showDiff = true;

const expect = chai.expect;
const extracter = require('../index');

// NOCK AVENIDA HOME AND PRODUCT
const fs = require('fs');
const nock = require('nock');

// PARAMETERS
const url = 'http://www.basic.com';

describe('Response types', () => {
  before(() => {
    const html = fs.readFileSync('./test/html/basic.html');
    nock(url).persist().get('/').reply(200, html);
  });
  it('url as string', () =>
    extracter(url, 'a@href').then(response => {
      /* http://link-1 */
      console.log(response);
      expect(response).to.be.an('string');
    })
  );
  it('urls array', () =>
    extracter(url, ['a@href']).then(response => {
      /* [ 'http://link-1',
      'http://link-2',
      'http://link-3',
      'http://link-4',
      'http://link-5' ] */
      console.log(response);
      expect(response)
        .to.be.instanceof(Array)
        .to.not.be.empty;
    })
  );
  it('urls as object', () =>
    extracter(url, {
      link: {
        selector: 'a',
        attr: 'href',
      },
    }).then(response => {
      /*
      {
        link: http://link-1
      }
      */
      console.log(response);
      expect(response)
        .to.be.an('object')
        .and.to.have.key('link');
      expect(response.link).to.be.an('string');
    })
  );
  it('asdasd', () => {
    extracter(url, {
      links: {
        selector: ['a'],
        attr: 'href',
      },
    }).then(response => {
      /*
      { links:
       [ 'http://link-1',
         'http://link-2',
         'http://link-3',
         'http://link-4',
         'http://link-5' ]
       }
      */
      console.log(response);
      expect(response)
        .to.be.an('object')
        .and.to.have.key('links');
      expect(response.links).to.be.an('string');
    });
  });
  it('urls as array in an object', () =>
    extracter(url, {
      links: ['a@href'],
    }).then(response => {
      /*
      { links:
       [ 'http://link-1',
         'http://link-2',
         'http://link-3',
         'http://link-4',
         'http://link-5' ]
       }
      */
      console.log(response);
      // eslint-disable-next-line no-unused-expressions
      expect(response).to.be.an('object').and.to.not.be.empty;
      expect(response).and.to.have.property('links');
      expect(response.links).to.be.instanceof(Array);
    })
  );
  it('Get childrens', () =>
    extracter(url, {
      features: {
        parent: 'table tbody tr',
        properties: {
          title: {
            selector: 'td span',
            match: 0,
            attr: 'text',
          },
          value: {
            selector: 'td span',
            match: 1,
            attr: 'text',
          },
        },
      },
    }).then(response => {
      /* {
        features: [
          {title: 'message1', value: 'value1'},
          {title: 'message2', value: 'value2'},
          {title: 'message3', value: 'value3'},
        ]
      } */
      console.log(response);
      expect(response).to.be.an('object');
      expect(response).to.have.key('features');
      // eslint-disable-next-line no-unused-expressions
      expect(response.features).to.be.instanceof(Array).and.not.be.empty;
      response.features.forEach(feature => {
        expect(feature).to.have.all.keys('title', 'value');
        // eslint-disable-next-line no-unused-expressions
        expect(feature.title).to.be.an('string').an.not.be.empty;
        // eslint-disable-next-line no-unused-expressions
        expect(feature.value).to.be.an('string').an.not.be.empty;
      });
    })
  );
  it('Get childrens inline attr', () =>
    extracter(url, {
      features: {
        parent: 'table tbody tr',
        properties: {
          title: {
            selector: 'td span@text',
            match: 0,
          },
          value: {
            selector: 'td span@text',
            match: 1,
          },
        },
      },
    }).then(response => {
      /* {
        features: [
          {title: 'message1', value: 'value1'},
          {title: 'message2', value: 'value2'},
          {title: 'message3', value: 'value3'},
        ]
      } */
      console.log(response);
      expect(response).to.be.an('object');
      expect(response).to.have.key('features');
      // eslint-disable-next-line no-unused-expressions
      expect(response.features).to.be.instanceof(Array).and.not.be.empty;
      response.features.forEach(feature => {
        expect(feature).to.have.all.keys('title', 'value');
        // eslint-disable-next-line no-unused-expressions
        expect(feature.title).to.be.an('string').an.not.be.empty;
        // eslint-disable-next-line no-unused-expressions
        expect(feature.value).to.be.an('string').an.not.be.empty;
      });
    })
  );
});
