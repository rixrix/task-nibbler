'use strict';

var async = require('async');

/**
 * @constant {number} - Default queue concurrency level
 */
var DEFAULT_CONCURRENCY_LEVEL = 1;

/**
 * Takes care of running your task in parallel or in sequence.
 * We'll make use of async.js functionality called `queue`. See README for more details
 *
 * @NOTE
 *      - https://github.com/caolan/async/issues/1266#issuecomment-267103051
 *
 * @param {string[]} tasks - A list of tasks
 * @param {Object[]} options - optionsal parameters
 * @param {number} options[].concurrencyLevel - Sets the queue concurrency level when processing files
 * @param {requestCallback} callback - A user-defined function that gets called in the queue. It will receive the value of the array that's being processed in the queue, in this case the filename
 * @returns {Object} promise - returns a Promise
 */
exports.nibbler = function(tasks, options, callback) {
    var _options = options && typeof options !== 'function'
        ? options
        : {};
    var callback = options && typeof options !== 'function'
        ? callback
        : options;

    _options.concurrencyLevel = _options.concurrencyLevel || DEFAULT_CONCURRENCY_LEVEL;

    return new Promise(function(resolve, reject) {
        var queue = async.queue(function(task, next) {
            Promise.resolve(callback(task.name))
            .then(function() {
                async.setImmediate(next, null);
            });
        }, _options.concurrencyLevel);

        queue.push(tasks.map(function(task) {
            return {
                name: task
            };
        }));

        // once we're done, resolve the promise
        queue.drain = function() {
            resolve();
        };

        queue.error = function(error, task) {
            reject({
                error: error,
                task: task
            });
        };
    })
};
