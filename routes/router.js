// var express = require('express');
import express from 'express';
// 自定义的对数据库操作的方法
var handler = require('./handler');
var router = express.Router();
// 注册信息数据库
var db = {
  dbUrl: 'mongodb://localhost:27017/',
  dbName: 'axlt'
};
router.get('/', function (req, res) {
  res.end('index');
});
router.get('/user', function (req, res) {
  handler.findMany(db, 'user', {}, {}, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(result);
  });
});
// 请求main
router.get('/mains', function (req, res) {
  handler.findMany(db, 'user', {}, {}, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(result);
  });
});
router.get('/mains/:id', function (req, res) {
  handler.findMany(db, 'mains', {
    belong: req.params.id
  }, {}, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(result);
  });
});
router.get('/items', function (req, res) {
  handler.findMany(db, 'items', {}, {}, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(result);
  });
});
router.get('/items/:id', function (req, res) {
  handler.findMany(db, 'items', {
    belong1: req.params.id
  }, {}, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(result);
  });
});
router.get('/items/:_id/:id', function (req, res) {
  handler.findMany(db, 'items', {
    belong1: req.params._id,
    belong2: req.params.id
  }, {}, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(result);
  });
});
router.post('/item/:id', function (req, res) {
  if (!req.body.name) {
    res.json({
      state: 404
    });
    return false;
  }
  if (req.body.type == 'good') {
    handler.findOneAndUpdate(db, 'items', {
      id: req.params.id
    }, {
      $inc: {
        good: 1
      }
    }, {
      returnOriginal: false
    }, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.json(result.value);
    });
  } else if (req.body.type == 'bad') {
    handler.findOneAndUpdate(db, 'items', {
      id: req.params.id
    }, {
      $inc: {
        bad: 1
      }
    }, {
      returnOriginal: false
    }, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.json(result.value);
    });
  } else {
    handler.findOne(db, 'items', {
      id: req.params.id
    }, {}, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.json(result);
    });
  }
});
// post handler

// 新增用户
router.post('/wash/add', (req, res) => {
  // 先判断是否已经增加过了
  console.log(req);
  const params = req.body;
  handler.findOne(db, 'wash', {
    vipNo: params.vipNo
  }, {}, (err, result) => {
    if (err) {
      res.json({
        success: false,
        message: '新增会员失败，请重试'
      });
    } else {
      // 如果能找到
      if (result) {
        res.json({
          success: false,
          message: '会员卡号已存在'
        });
      } else {
        // 没找到 则新增
        handler.insertOne(db, 'wash', params, {
          returnOriginal: false
        }, (error, results) => {
          if (error) {
            res.json({
              success: false,
              message: '新增会员失败，请重试'
            });
          } else {
            res.json({
              success: true,
              message: '新增会员成功'
            });
          }
        });
      }
    }
  });
});
// 查询用户
router.post('/wash/get', (req, res) => {
  const params = req.body;
  handler.findOne(db, 'wash', {
    vipNo: params.vipNo
  }, {}, (err, result) => {
    if (err) {
      res.json({
        success: false,
        message: '新增会员失败，请重试'
      });
    } else {
      console.log(result);
      res.json({
        success: true,
        data: result,
        message: '查询成功'
      });
    }
  });
});
router.post('/add/item', function (req, res) {
  req.body.good = parseInt(req.body.good);
  req.body.bad = parseInt(req.body.bad);
  handler.insertOne(db, 'items', req.body, {
    returnOriginal: false
  }, function (err, result) {
    if (err)
      console.log(err);
    res.json(result);
  });
});
router.post('/vote', function (req, res) {
  handler.findInsert(db, 'users', req.body, {}, {
    returnOriginal: false
  }, function (err, result) {
    if (err)
      console.log(err);
    res.json(result);
  });
});
router.post('/award', function (req, res) {
  handler.findUpdate(db, 'users', req.body, {}, {
    returnOriginal: false
  }, function (err, result) {
    if (err)
      console.log(err);
    res.json(result);
  });
});
router.post('/record', function (req, res) {
  res.json({
    msg: '暂无中奖纪录'
  });
});
// 修改数据 需要加身份验证
router.post('/update/main', function (req, res) {
  if (req.body.pwd != 'leo123456') {
    res.json({
      state: 404
    });
    return false;
  }
  handler.findMainUpdate(db, 'mains', req.body, {}, {
    returnOriginal: false
  }, function (err, result) {
    if (err)
      console.log(err);
    res.json(result);
  });
});
router.post('/update/item', function (req, res) {
  if (req.body.pwd != 'leo123456') {
    res.json({
      state: 404
    });
    return false;
  }
  handler.findItemUpdate(db, 'items', req.body, {}, {
    returnOriginal: false
  }, function (err, result) {
    if (err)
      console.log(err);
    res.json(result);
  });
});
router.get('/clear', function (req, res) {
  if (req.query.pwd != 'leo123456') {
    res.json({
      state: 404
    });
    return false;
  }
  handler.findItemClear(db, 'users', req.body, {}, {
    returnOriginal: false
  }, function (err, result) {
    if (err)
      console.log(err);
    res.json(result);
  });
});
router.get('/timer', function (req, res) {
  if (req.query.pwd != 'leo123456') {
    res.json({
      state: 404
    });
    return false;
  }
  handler.findMany(db, 'items', {
    good: {
      $gte: 0
    }
  }, {}, function (err, result) {
    if (err)
      console.log(err);

    result.forEach(function (mydoc) {
      handler.updateOne(db, 'items', {
        _id: mydoc._id
      }, {
        $inc: {
          good: parseInt(Math.random() * 40 + 40),
          bad: parseInt(Math.random() * 10 + 10)
        }
      }, {}, function (err, data) {

      })
    })
    res.json({
      state: 200
    });
  });
});
router.post('/update', function (req, res) {
  if (req.body.pwd != 'leo123456') {
    res.json({
      state: 404
    });
    return false;
  }

  function getRandom() {
    return parseInt(Math.random() * 100 + 50);
  }
  handler.updateMany(db, 'items', {
    'good': 132
  }, {
    $set: {
      'good': getRandom()
    }
  }, {
    returnOriginal: false
  }, function (err, result) {
    if (err)
      console.log(err);
    res.json(result);
  });
});
module.exports = router;


// 洗车表 字段命名 增删改查接口 其中 删除接口 需要密码验证
var washTable = {
  vipNumber: 21990, // 会员卡号 { key }
  userName: '张先生', // 字符串  { key }
  phoneNumber: '13552265334', // 手机号为字符串 如 0108882881 03942211 { key }
  carNumber: ['京PX6632', '京QX6632'], // 一个用户名下多辆车 尾号 五位 进行筛选 { key } 
  remainTimes: 12, // 剩余次数 >= 0
  cardType: '小车卡', // 摩托车卡 小车卡 打车卡 商务车卡 精洗卡 内饰清洗卡
  cardMoney: 300, // 充值卡金额
  chargeTime: '2018-12-30', // 充值时间 2018/12/30
  outofTime: '2019-12-30', // 过期时间 2018/12/30
}

// 维修保养表 字段命名
var repair = {
  userName: '张先生', // 字符串
  phoneNumber: '13552265334', // 手机号为字符串 如 0108882881 03942211
  carNumber: '京QX6632', // 车牌号  尾号 五位 进行筛选 { key }
  projects: [ // 保养项目
    {
      type: '刹车片',
      totalPrice: 218,
      finalPrice: 200,
      info: 'xxx品牌'
    },
    {
      type: '小保养',
      totalPrice: 218,
      finalPrice: 200,
      info: '美孚速霸2000 x 1桶，美孚速霸1000 x 1桶'
    },
    {
      type: '大保养',
      totalPrice: 218,
      finalPrice: 200,
      info: '美孚速霸2000 x 1桶，美孚速霸1000 x 1桶'
    },
    {
      type: '轮胎',
      totalPrice: 218,
      finalPrice: 200,
      info: '美孚速霸2000 x 1桶，美孚速霸1000 x 1桶'
    },
  ],
  repairTime: '2018-12-30 12:13:39', // 维修时间
}
