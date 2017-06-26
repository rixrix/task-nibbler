# Task Nibbler
Sequentially or concurrently process an array of items, easily. your call.


## Use Case
I have a few tasks that pulls out data from 3rd party APIs. These tasks are a mixed of:

* short-lived
* long-running tasks
  * Some 3rd party API providers with rate limiting applied is tricky to work with. This library helps out in pulling data in burst mode - 5 concurrent downloads - or just one after the other.

## Install

### NPM

```bash
$> npm install task-nibbler
```

### Yarn
```bash
$> yarn add task-nibbler
```

## Usage

```javascript
var taskNibbler = require('task-nibbler').nibbler;
var arrayOfThings = [
    1, 2, 3,...., 10000
];

// This is your callback method for processing each item
// Note that it should return a Promise so that `task-nibbler` knows
// when to call or process the next task from the queue
function myItemThingProcessor(arrayOfThingsItem) {
    return new Promise(function(resolve, reject) {
        // work on each item like:
        // - query data from database
        // - download file from AWS S3 bucket
        // - query data from your analytics API, etc
        resolve();
    });
}

taskNibbler(arrayOfThings, myItemThingProcessor)
.then(function() {
    // done, do your post processing
})
.catch(function(error) {
    // when an error occurs
});
```

## API

### nibbler(items, [opts], callback(string))
Returns a Promise.

`items`

String[], array of items to process

opts - Object, optional flags for various flags

`opts.concurrencyLevel` is a number for setting up the concurrency level. Default level is 1, of which, roughly equates to sequential processing of each item.

Default 1

`callback`

Object, required callback method wrapped in Promise. Task Nibbler calls this function once the item is in queue and passes the item value as the first.

## Todo

* Webpack
* Test
* Hook with TravisCI
* Auto-publish to NPM, NuGet, Bower
* ES6-ify
* TypeScript definition file

## References
* [Async#queue](https://caolan.github.io/async/docs.html#queue)

## License

MIT
