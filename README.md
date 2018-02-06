[![Build Status](https://travis-ci.org/nicobevilacqua/xtracter.svg?branch=master)](https://travis-ci.org/nicobevilacqua/xtracter)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Ejemplos


### Extraer parámetros específicos

```
import xtracter from 'xtracter';

const result = await xtracter(url, 'a@href');

// result === 'http://link-1'

```


### Extraer todos los links del html como array

```
import xtracter from 'xtracter';

const result = await xtracter(url, ['a@href']);

/* [ 'http://link-1',
'http://link-2',
'http://link-3',
'http://link-4',
'http://link-5' ] */

```


### Extraer como objetos

```
const result = await xtracter(url, {
  link: {
    selector: 'a',
    attr: 'href',
  },
});

/*
  {
    link: 'http://link-1'
  }
*/
```

### Extraer varios campos nombrados y con arrays

```
  const result = await xtracter(url, {
    links: {
      selector: ['a'],
      attr: 'href',
    },
  });

/*
{ links:
 [ 'http://link-1',
   'http://link-2',
   'http://link-3',
   'http://link-4',
   'http://link-5' ]
 }
*/
```


### A partir de otro campo (hijos)

```
const results = await xtracter(url, {
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
});


/*
{
  features: [
    {title: 'message1', value: 'value1'},
    {title: 'message2', value: 'value2'},
    {title: 'message3', value: 'value3'},
  ]
}
*/
```

### Pasando el html como primer parametro

```
const result = await xtracter(`
  <ul>
    <li>text1</li>
    <li>text2</li>
    <li>text3</li>
  </ul>
`, ['li@text']);

/*
  ['text1', 'text2', 'text3']
*/

```
