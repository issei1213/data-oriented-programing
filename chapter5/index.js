import _ from 'lodash';

// 構造的差分の実装
function diffObjects(data1, data2) {
    // _.isArrayは、引数が配列かどうかを確認する
    var emptyObject = _.isArray(data1) ? [] : {};
    if(data1 === data2) {
        return emptyObject;
    }

    // _.unionは二つの配列から一意な値を配列を作成する
    // (数学のける２つの集合の和州道と同じ)
    var keys = _.union(_.keys(data1), _.keys(data2));
    return _.reduce(keys,
        function (acc, k) {
            var res = diff(
                _.get(data1, k),
                _.get(data2, k));
            // _.isObjectは、引数がコレクション(マップまたは配列)かどうかを確認
            // _.isEmptyは、引数が空のコレクションかどうかを確認
            if((_.isObject(res) && _.isEmpty(res)) ||
                // resが"no-diff"は、2つの値が同じであることを示す手段
                (res === "no-diff")) {
                return acc;
            }
            return _.set(acc, [k], res);
        },
        emptyObject);
}

function diff(data1, data2) {
    // _.isObjectは、引数がコレクション(マップまたは配列)かどうかを確認
    if(_.isObject(data1) && _.isObject(data2)) {
        return diffObjects(data1, data2);
    }
    if(data1 !== data2) {
        return data2;
    }

    // "no-diff"は、2つの値が同じであることを示す手段
    return "no-diff";
}

//　小さな図書館のデータ
var library = {
    "catalog": {
        "booksByIsbn": {
            "978-1779501127": {
                "isbn": "978-1779501127",
                "title": "Watchmen",
                "publicationYear": 1987,
                "authorIds": ["alan-moore", "dave-gibbons"]
            }
        },
        "authorsById": {
            "alan-moore": {
                "name": "Alan Moore",
                "bookIsbns": ["978-1779501127"]
            },
            "dave-gibbons": {
                "name": "Dave Gibbons",
                "bookIsbns": ["978-1779501127"]
            }
        }
    }
};

// 競合しない２つのミューテーション
const previous = _.cloneDeep(library)

// ウォッチメンの出版年を変更するミューテーション
// var next = _.set(
//     library,
//     ["catalog", "booksByIsbn", "978-1779501127", "publicationYear"],
//     1986
// );

// ウォッチメンのタイトルを変更するミューテーション
var libraryWithUpdateTitle = _.set(
    library,
    ["catalog", "booksByIsbn", "978-1779501127", "title"],
    "The Watchmen"
);
// // 著者名を更新するミューテーション
var current = _.set(
    libraryWithUpdateTitle,
    ["catalog", "authorsById", "dave-gibbons", "name"],
    "David Chester Gibbons"
)


// (入れ子の)マップの情報パスを計算
function informationPaths (obj, path = []) {
    return _.reduce(obj,
        function(acc, v, k) {
            if (_.isObject(v)) {
                return _.concat(acc,
                    informationPaths(v,
                        _.concat(path, k)));
            }
            return _.concat(acc, [_.concat(path, k)]); // <1>
        },
        []);
}

// 二つの差分マップに共通の情報パスがあるかどうかを確認
function havePathInCommon(diff1, diff2) {
    return !_.isEmpty(_.intersection(informationPaths(diff1),
        informationPaths(diff2)));
}


//  変更を適用
_.merge(current, (diff(previous, next)));




class SystemState {
    systemData;

    get() {
        return this.systemData;
    }

    set(_systemData) {
        this.systemData = _systemData;
    }

    commit(previous, next) {
        var nextSystemData = SystemConsistency.reconcile(this.systemData, // <1>
            previous,
            next);
        if(!SystemValidity.validate(previous, nextSystemData)) {
            throw "The system data to be committed is not valid!";
        };
        this.systemData = nextSystemData;
    }
}

// 調整フロー
class SystemConsistency {
    static threeWayMerge(current, previous, next) {
        // システム計算が計算フェーズで行われたものと同じである場合は、早送りマージを実行
        var previousToCurrent = diff(previous, current);
        var previousToNext = diff(previous, next);

        if(havePathInCommon(previousToCurrent, previousToNext)) {
            return _.merge(current, previousToNext);
        }
    }

    static reconcile(current, previous, next) {
        if(current == previous) {
            // システム状態が計算フェーズで使われたものと同じである場合は、早送りマージを実行
            return next;
        }
        return SystemConsistency.threeWayMerge(current, previous, next);
    }
}