const MongoClient = require('mongodb').MongoClient;
const async = require('async');

class Wait4MongoDB {
  tryConnect(url, times, interval, callback) {
    this.url = url;
    if (typeof callback === 'function') {
      async.retry(
        { times: times, interval: interval },
        callback => this.connect(callback),
        callback
      );
    } else {
      return new Promise((resolve, reject) => {
        async.retry(
          { times: times, interval: interval },
          callback => this.connect(callback),
          (err, client) => {
            if (err) {
              reject(err);
            } else {
              resolve(client);
            }
          }
        );
      });
    }
  }

  connect(callback) {
    MongoClient.connect(this.url)
      .then(client => {
        callback(null, client);
      })
      .catch(err => {
        callback(err);
      });
  }
}

module.exports = new Wait4MongoDB();
