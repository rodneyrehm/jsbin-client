
// JS API for JSBin HTTP API
// https://jsbin.com/help/experimental-features#api

var fetch = require('node-fetch');

var DEFAULT_ENDPOINT = 'https://jsbin.com/api/';

function throwResponseError(data) {
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

function responseToJson(res) {
  return res.json().then(throwResponseError);
}

function filterRemovedBins(items) {
  return items[0].url.slice(0, 8) !== 'deleted/';
}

function simplifyBinStructure(items) {
  var item = items[0];
  item.history = items.slice(1);
  if (!item.title) {
    item.title = '';
  }

  return item;
}

function JsbinClient(options) {
  this._token = options && options.token;
  this._endpoint = options && options.endpoint || DEFAULT_ENDPOINT;
}

JsbinClient.prototype._addHeaders = function(options) {
  if (!options.headers) {
    options.headers = {};
  }

  if (!options.headers['content-type']) {
    options.headers['content-type'] = 'application/json';
  }

  if (this._token) {
    options.headers.authorization = 'token ' + this._token;
  }

  return options;
};

/*
  GET /api lists all bins

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
          snapshot: 1,
        },
        …
      ]
    },
    …
  ]
*/
JsbinClient.prototype.list = function() {
  var url = 'https://jsbin.com/api/';
  var options = this._addHeaders({
    method: 'GET',
  });

  return fetch(url, options).then(responseToJson).then(function(data) {
    return data
      .filter(filterRemovedBins)
      .map(simplifyBinStructure);
  });
};

/*
  GET /api/$bin/$snapshot

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
JsbinClient.prototype.read = function(binId, binSnapshot) {
  var url = 'https://jsbin.com/api/' + binId + (binSnapshot !== undefined ? ('/' + binSnapshot) : '');
  var options = this._addHeaders({
    method: 'GET',
  });

  return fetch(url, options).then(responseToJson);
};

/*
  POST /api/save new bin
  POST /api/$bin/save create a new snapshot

  data: {
    javascript: <optional string>
    html: <optional string>
    css: <optional string>
    title: <optional string>
  }

  data.url can be used in .save() to avoid distinguishing .create() and .update()

  returns {
     url: 'aabbcc',
     snapshot: 1,
     summary: '<string>'
  }
*/
JsbinClient.prototype.create = function(data) {
  return this._save(null, data);
};
JsbinClient.prototype.save = function(data) {
  return this._save(data.url || null, data);
};
JsbinClient.prototype.update = function(binId, data) {
  return this._save(binId, data);
};

JsbinClient.prototype._save = function(binId, data) {
  var url = 'https://jsbin.com/api/' + (binId ? (binId + '/save') : 'save');
  var _settings = data.settings || {};
  if (data.title) {
    _settings.title = data.title;
  }
  var _data = {
    settings: JSON.stringify(_settings),
    javascript: data.javascript || undefined,
    css: data.html || undefined,
    html: data.html || undefined,
  };
  var options = this._addHeaders({
    method: 'POST',
    body: JSON.stringify(_data),
  });

  return fetch(url, options).then(responseToJson);
};

/*
  DELETE /api/$bin/$snapshot

  returns {
    url: 'aabbcc',
    snapshot: 1,
    deleted: true
  }
*/
JsbinClient.prototype.remove = function(binId, binSnapshot) {
  var url = 'https://jsbin.com/api/' + binId + (binSnapshot !== undefined ? ('/' + binSnapshot) : '');
  var options = this._addHeaders({
    method: 'DELETE',
  });

  return fetch(url, options).then(responseToJson);
};

module.exports = JsbinClient;
