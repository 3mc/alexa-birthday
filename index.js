"use strict";
const Alexa = require('alexa-sdk');

//ステートを定義
const states = {
    BIRTHDAYMODE: '_BIRTHDAYMODE'
};

//家族の呼び名を定義
//もうちょっと良い書き方があると思っている。
const familyCalledAs = {
    'パパ':'dad',
    'お父さん':'dad',
    'ママ':'mom',
    'お母さん':'mom',
    '長男':'firstSon',
    '次男':'secondSon',
};

//誕生日を格納
const birthdayOfFamily = {
  'dad':'2000年1月1日',
  'mom':'2001年1月1日',
  'firstSon':'2003年1月1日',
  'secondSon':'2004年1月1日'
};

// Lambda関数のメイン処理
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context); // Alexa SDKのインスタンス生成
    //alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers); // ハンドラの登録
    alexa.execute();                  // インスタンスの実行
};

var handlers = {
    // インテントに紐付かないリクエスト。起動時に呼ばれる。
    'LaunchRequest': function () {
    this.emit('sayHello'); // sayHelloの呼び出し
    },
    'birthdayIntent': function () {
        this.emit('sayWhom'); 
    },
    'sayHello': function () {
        const greeting = 'わかりました。誰の誕生日を知りたいですか。'
        this.emit(':ask',greeting); 
    },
    'sayWhom': function() {
        var speechOutput ='';
        if(!this.event.request.intent.slots.family.value) {
            speechOutput = 'すみません。聞き取れませんでした。もう一度お願いしします。'
            this.emit(':ask',speechOutput);
        }
        else {
            this.attributes['familyName'] = this.event.request.intent.slots.family.value;
            var nameCalledAs = this.attributes['familyName']; // スロットmyFamilyを参照
            var oneToCalled = familyCalledAs[nameCalledAs];
            var birthdayOfWhom = birthdayOfFamily[oneToCalled];
            var message = nameCalledAs + 'の生まれた日は' + birthdayOfWhom + 'です'; // 応答メッセージ文字列の作成
            this.emit(':tell', message); // レスポンスの生成
        }
    },
    // スキルの使い方を尋ねるインテント
    'AMAZON.HelpIntent': function () {
        this.emit(':tell', '家族の誕生日をお知らせします' +
            'たとえば、パパの誕生日を教えてと聞いてください');
    }
};
