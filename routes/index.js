var express = require('express');
var router = express.Router();
var BCBot = require('BCBot');
var utils = require('../util.js');
var builder = require('botbuilder');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var model = 'https://api.projectoxford.ai/luis/v1/application?id=f86def56-4901-4874-89c1-19f43e9e7d9d&subscription-key=9b8a3f03610f4c5aa8f07e1b31664d27';
var bot = new BCBot(model, 'BotConnectorBot');
var cortanaBot = bot.bot;
var dialog = bot.dialog;
cortanaBot.add('/', dialog);

bot.addCommand(new utils.BotCommandFactory('set temperature', [
    function (session, args, next) {
        // Resolve and store any entities passed from LUIS.
        // var location = builder.EntityRecognizer.findEntity(args.entities, 'location');
        //
        // // Prompt for title
        // if (!location) {
        //     builder.Prompts.text(session, 'Where do you want to make it?');
        // } else {
        //     next();
        // }
        if (builder.EntityRecognizer.findEntity(args.entities, 'thermometer::target temperature') || builder.EntityRecognizer.findEntity(args.entities, 'filefolder::name')) {
          // if (builder.EntityRecognizer.findEntity(args.entities, 'filefolder::location'))
            // session.send(builder.EntityRecognizer.findEntity(args.entities, 'filefolder::location'));
          // if (builder.EntityRecognizer.findEntity(args.entities, 'filefolder::name'))
          //   session.send(builder.EntityRecognizer.findEntity(args.entities, 'filefolder::name'));
          // session.send(args.entities[0].entity);
          session.send(JSON.stringify(args.entities));
          session.send("lmao");
        } else {
          session.send("no entities found");
        }
    },
    function (session, results, next) {
        /*var alarm = session.dialogData.alarm;
        if (results.response) {
            alarm.title = results.response;
        }

        // Prompt for time (title will be blank if the user said cancel)
        if (alarm.title && !alarm.timestamp) {
            builder.Prompts.time(session, 'What time would you like to set the alarm for?');
        } else {*/
            next();
        //}
    },
    function (session, results) {
        /*var alarm = session.dialogData.alarm;
        if (results.response) {
            var time = builder.EntityRecognizer.resolveTime([results.response]);
            alarm.timestamp = time ? time.getTime() : null;
        }

        // Set the alarm (if title or timestamp is blank the user said cancel)
        if (alarm.title && alarm.timestamp) {
            // Save address of who to notify and write to scheduler.
            alarm.to = session.message.from;
            alarm.from = session.message.to;
            alarms[alarm.title] = alarm;

            // Send confirmation to user
            var date = new Date(alarm.timestamp);
            var isAM = date.getHours() < 12;
            session.send('Creating alarm named "%s" for %d/%d/%d %d:%02d%s',
                alarm.title,
                date.getMonth() + 1, date.getDate(), date.getFullYear(),
                isAM ? date.getHours() : date.getHours() - 12, date.getMinutes(), isAM ? 'am' : 'pm');
        } else {*/
            session.send('Ok... no problem.');
        //}
    }
]));

bot.setDefault(new utils.BotDefaultCommandFactory(builder.DialogAction.send("I'm sorry I didn't understand. I can only create and delete alarms.")));
router.post('/api/messages', cortanaBot.verifyBotFramework(), cortanaBot.listen());
// router.post('/api/messages', bot.verifyBotFramework(), bot.listen());

module.exports = router;
