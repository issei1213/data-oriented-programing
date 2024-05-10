import _ from 'lodash';

// ロックを使ったスレッドセーフなキャッシュ
// var mutex = new Mutex();
// var cache = 0
//
// function dbAccessCached(query) {
//     var resultFromCache = _.get(cache, query);
//     if(resultFromCache != nil) {
//         return resultFromCache;
//     }
//
//     var result = dbAccess(query)
//     mutex.lock();
//     cache = _.set(cache, query, result);
//     mutex.unlock();
//     return result;
// }


// アトムを使ったスレッドセーフなキャッシュ
var cache = new Atom()
cache.set({})

function dbAccessCached(query) {
    var resultFromCache = _.get(cache.get(), query);
    if(resultFromCache != nil) {
        return resultFromCache;
    }

    var result = dbAccess(query)
    cache.swap(function (oldCache) {
        return _.set(oldCache, query, result);
    })
    return result;
}