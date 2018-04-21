# wait4MongoDB

A little NodeJS module that will execute a task as soon MongoDB is ready.

## Installing

Execute the next command line for to install the module using npm.

```
npm install wait4mongodb --save
```

## Running the tests

Explain what these tests test and why

```
npm test
```

## Usage

### Using callbacks

```javascript
const wait4mongodb = require('wait4mongodb');

/* The next example will try to connect to MongoDB 20 times (every 500 milliseconds) 
 *   and will return a timeout (if MongoDB is down) after 10 sec. 
 */
wait4mongodb.tryConnect('mongodb://localhost:27017', 20, 500, (err, client) => {
  if (err) {
    console.log('MongoDB timeout');
  } else {
    console.log('MongoDB is ready!');
    // You will have available MongoDB client from here.
  }
});
```

### Using Promises

```javascript
const wait4mongodb = require('wait4mongodb');

/* The next example will try to connect to MongoDB 20 times (every 500 milliseconds) 
 *   and will return a timeout (if MongoDB is down) after 10 sec. 
 */
wait4mongodb.tryConnect('mongodb://localhost:27017', 20, 500).then(client => {
  console.log('MongoDB is ready!');
  // You will have available MongoDB client from here.
}).catch(err => {
  console.log('MongoDB timeout');
});
```

## Authors

* **Jose Antonio** - *Initial work*

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Project inspired on [arunoda/wait-for-mongo](https://github.com/arunoda/wait-for-mongo).

