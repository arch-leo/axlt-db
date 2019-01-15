var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

function _connectDB(conf, callback) {
  MongoClient.connect(conf.dbUrl, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) {
      console.log(err);
    }
    callback(err, db);
  });
}
// 数据库增删改查方法封装
var handler = {
  insertOne: function (conf, colName, doc, options, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      var dbo = db.db(conf.dbName);
      dbo.collection(colName).insertOne(doc, function (err, res) {
        callback(err, res);
        db.close();
      });
    });
  },
  insertMany: function (conf, colName, docs, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      dbo.collection(colName).insertMany(docs, function (err, result) {
        callback(err, result);
        db.close();
      });
    });
  },
  findOne: function (conf, colName, query, options, callback) {
    _connectDB(conf, (err, db) => {
      if (err) {
        callback(err, null);
        return;
      }
      const dbo = db.db(conf.dbName);
      dbo.collection(colName).findOne(query, options, function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        callback(err, doc);
        db.close();
      });
    });
  },
  findOneAndUpdate: function (conf, colName, query, update, options, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      dbo.collection(colName).findOneAndUpdate(query, update, options, function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        callback(err, doc);
        db.close();
      });
    });
  },
  findMany: function (conf, colName, query, options, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      var limit = options.limit || 0;
      var skip = options.skip || 0;
      var sort = options.sort || {
        _id: 1
      };
      var dbo = db.db(conf.dbName);
      dbo.collection(colName).find(query).limit(limit).skip(skip).sort(sort).toArray(function (err, docs) {
        if (err) {
          console.log(err);
          return;
        }
        callback(null, docs);
        db.close();
      });
    });
  },
  deleteOne: function (conf, colName, query, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      dbo.collection(colName).deleteOne(query, function (err, result) {
        callback(err, result);
        db.close();
      });
    });
  },
  deleteMany: function (conf, colName, query, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      dbo.collection(colName).deleteMany(query, function (err, result) {
        callback(err, result);
        db.close();
      });
    });
  },
  updateOne: function (conf, colName, query, update, options, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      dbo.collection(colName).updateOne(query, update, options, function (err, result) {
        callback(err, result);
        db.close();
      });
    });
  },
  updateMany: function (conf, colName, query, update, options, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      dbo.collection(colName).updateMany(query, update, options, function (err, result) {
        callback(err, result);
        db.close();
      });
    });
  },
  findInsert: function (conf, colName, query, opts, options, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      dbo.collection(colName).findOne(query, opts, function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        if (doc) {
          if (doc.times == 4 || doc.times == 9 || doc.times == 14) {
            dbo.collection(colName).findOneAndUpdate({
              name: query.name
            }, {
              $inc: {
                times: 1,
                award: 1
              }
            }, options, function (error, result) {
              callback(err, {
                vote: 1,
                award: result.value.award
              });
              db.close();
            });
          } else if (doc.times == 15) {
            callback(err, {
              vote: 0,
              award: doc.award
            });
            db.close();
          } else {
            dbo.collection(colName).findOneAndUpdate({
              name: query.name
            }, {
              $inc: {
                times: 1
              }
            }, options, function (error, result) {
              callback(err, {
                vote: 1,
                award: 0
              });
              db.close();
            });
          }
        } else {
          query.times = 0;
          query.award = 0;
          query.type = 'vote';
          dbo.collection(colName).insertOne(query, function (err, res) {
            callback(err, res);
            db.close();
          });
        }
      });
    });
  },
  findUpdate: function (conf, colName, query, opts, options, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      dbo.collection(colName).findOne(query, opts, function (err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        if (doc.award == 0) {
          callback(err, {
            msg: 4,
            award: 0
          });
          db.close();
        } else {
          dbo.collection(colName).findOneAndUpdate({
            name: query.name
          }, {
            $inc: {
              award: -1
            }
          }, options, function (error, result) {
            callback(err, {
              msg: 4,
              award: result.value.award
            });
            db.close();
          });
        }
      });
    });
  },
  findMainUpdate: function (conf, colName, query, opts, options, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      var words = {
        belong: query.belong,
        belongId: query.belongId,
      };
      var update = {
        name: query.name,
        img: query.img
      };
      dbo.collection(colName).findOneAndUpdate(words, {
        $set: update
      }, options, function (error, result) {
        callback(err, result);
        db.close();
      });
    });
  },
  findItemUpdate: function (conf, colName, query, opts, options, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      var words = {
        belong1: query.belong1,
        belong2: query.belong2,
        name: query.keywords
      };
      var update = {
        name: query.name,
        img: query.img,
        good: parseInt(query.good),
        bad: parseInt(query.bad)
      };
      dbo.collection(colName).findOneAndUpdate(words, {
        $set: update
      }, options, function (error, result) {
        callback(err, result);
        db.close();
      });
    });
  },
  findItemClear: function (conf, colName, query, opts, options, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      dbo.collection(colName).updateMany({
        type: 'vote'
      }, {
        $set: {
          times: 0,
          award: 0
        }
      }, options, function (error, result) {
        callback(err, result);
        db.close();
      });
    });
  },
  incTimer: function (conf, colName, query, opts, options, callback) {
    _connectDB(conf, function (err, db) {
      if (err) {
        console.log(err);
        return;
      }
      dbo.collection(colName).updateMany({
        type: 'items'
      }, {
        $set: {
          times: 0,
          award: 0
        }
      }, options, function (error, result) {
        callback(err, result);
        db.close();
      });
    });
  }
};
module.exports = handler;
