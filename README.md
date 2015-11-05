
# JSBin Client

This is an (unofficial) implementation for the [JSBin.com](https://jsbin.com) [API](https://jsbin.com/help/experimental-features#api).

## Usage

Load the client and configure the connection:

```js
var Client = require('jsbin-client');
var client = new Client({
  token: '<your-jsbin-api-token>',
  // [optional] use a custom endpoint
  // endpoint: 'https://jsbin.com/api/',
});
```

### List Bins

```js
client.list().then(function(data) {
  console.log("listing", data.slice(0, 5));
}, function(error) {
  console.error('listing failed', error);
});

/*
  returns [
    {
      title: 'Some Bin',
      url: 'aabbcc',
      last_updated: '2015-10-31T12:29:07.000Z',
      pretty_last_updated: '4 days ago',
      snapshot: 2,
      history: [
        {
          title: 'Some Bin',
          url: 'aabbcc',
          last_updated: '2015-10-30T12:25:07.000Z',
          pretty_last_updated: '5 days ago',
          snapshot: 1
        },
        …
      ]
    },
    …
  ]
*/
```

### Read Bin

```js
client.read('aabbcc'/*, snapshot */).then(function(data) {
  console.log("read", data);
}, function(error) {
  console.error('reading failed', error);
});

/*
  returns {
    javascript: 'content of JavaScript view',
    html: 'content of HTML view',
    css: 'content of CSS view',
    settings: {
      title: 'bin title'
    },
    last_updated: '2015-10-31T12:29:07.000Z',
    url: 'aabbcc',
    snapshot: 2
  }
*/
```

### Create Bin

```js
var newBin = {
  html: '<p>new bin via api</p>',
  javascript: '// new bin via api',
  css: '/* new bin via api */',
  title: 'new bin via api',
};
client.create(newBin).then(function(data) {
  console.log("create", data);
}, function(error) {
  console.error('creating failed', error);
});

/*
  returns {
     url: 'aabbcc',
     snapshot: 1,
     summary: '<string>'
  }
*/
```

### Update Bin

```js
var changedBin = {
  html: '<p>changed bin via api</p>',
  javascript: '// changed bin via api',
  css: '/* changed bin via api */',
  title: 'changed bin via api',
};
client.update('aabbcc', changedBin).then(function(data) {
  console.log("update", data);
}, function(error) {
  console.error('updating failed', error);
});

/*
  returns {
     url: 'aabbcc',
     snapshot: 2,
     summary: '<string>'
  }
*/
```

You can use `client.save(binData)` if you you provide the binId (`aabbcc`) in `binData.url`.

### Delete Bin

```js
client.remove('aabbcc'/*, snapshot */).then(function(data) {
  console.log("removed", data);
}, function(error) {
  console.error('removing failed', error);
});

/*
  returns {
    url: 'aabbcc',
    snapshot: 1,
    deleted: true
  }
*/
```

## Changelog

### 0.1.1 (November 5th 2015) ###

* fixing client.save() to properly store `css`

### 0.1.0 (November 5th 2015) ###

* initial release

## License

jsbin-client is published under the [MIT License](http://opensource.org/licenses/mit-license).
