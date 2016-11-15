var express = require('express');
var bodyParser = require('body-parser');
var Slack = require('slack-node');
var config = require('config');
var https = require('https');
var fs = require('fs');

var postMessageMethod = 'chat.postMessage';
var listUsersMethod = 'users.list';
var resources_attachemnts = require('./resources/attachments.json');
var attachments = JSON.stringify(resources_attachemnts);
var app = express();
const version = 'v.0.0.5';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.use(function timeLog (req, res, next) {
  next();
})

app.get('/', function(req, res) {
  res.send(version);
});

router.post('/notify', function (req, res) {
		if (req.body.payload) {
			var payload = JSON.parse(req.body.payload);

			// extract to config
			if (payload.token == getConfigVariable('VERIFICATION_TOKEN')) {
				var vote = payload.actions[0].value;
				var username = payload.user.name;
				switch (vote) {
				  case 'smile':
				    console.log(username, 'smile');
						url = 'https://slack.com/api/' + postMessageMethod +
							'?token=' + getConfigVariable('API_TOKEN') +
							'&username=Mr. Moody' +
							'&as_user=false' +
							'&icon_url=https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2016-11-04/100929399430_30f602e36ebfbc81756b_48.jpg' +
							'&channel=mrmoody-happy' +
							'&text=:smile: ' + username;

						https.get(url, (res) => {
						}).on('error', (e) => {
							console.error(e);
						});
				    break;
					case 'neutral_face':
						console.log(username, 'neutral_face');
						url = 'https://slack.com/api/' + postMessageMethod +
							'?token=' + getConfigVariable('API_TOKEN') +
							'&username=Mr. Moody' +
							'&as_user=false' +
							'&icon_url=https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2016-11-04/100929399430_30f602e36ebfbc81756b_48.jpg' +
							'&channel=mrmoody-neutral' +
							'&text=:neutral_face: ' + username;

						https.get(url, (res) => {
						}).on('error', (e) => {
							console.error(e);
						});
				    break;
					case 'disappointed':
						console.log(username, 'disappointed');
						url = 'https://slack.com/api/' + postMessageMethod +
							'?token=' + getConfigVariable('API_TOKEN') +
							'&username=Mr. Moody' +
							'&as_user=false' +
							'&icon_url=https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2016-11-04/100929399430_30f602e36ebfbc81756b_48.jpg' +
							'&channel=mrmoody-sad' +
							'&text=:disappointed: ' + username;

						https.get(url, (res) => {
						}).on('error', (e) => {
							console.error(e);
						});
				    break;
				  default:
				    console.log('wrong answer', vote);
				    break;
				}
			} else {
				console.log('token is not valid');
			}

			// reponse
			var message = {
		    "text": "Thank you for your answer. Have a great weekend!",
			};
			res.json(message);

		} else {
			res.send('Invalid param');
		}

})

router.post('/test-send', function (req, res) {
	if (req.body.user_name == getConfigVariable('TEST_USER')) {
    url = getUrlForRequest(getConfigVariable('API_TOKEN'), getConfigVariable('TEST_USER'));
    makeHttpsGetRequest(url);
		res.send('"How was your week?" - notifications sent to private channels. Thanks!');
	} else {
    res.send('Error');
  }
})
// </Routers>

// <Functions>
function getConfigVariable(variableName) {
  if (config.has('env_variables.' + variableName)) {
    return config.get('env_variables.' + variableName);
  } else {
    return process.env[variableName];
  }
}

function getUrlForRequest(token, username) {
  return 'https://slack.com/api/' + postMessageMethod +
    '?token=' + getConfigVariable('API_TOKEN') +
    '&username=Mr. Moody' +
    '&as_user=false' +
    '&icon_url=https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2016-11-04/100929399430_30f602e36ebfbc81756b_48.jpg' +
    '&channel=@' + username +
    '&attachments=' + attachments;
}

function makeHttpsGetRequest(url) {
  https.get(url, (res) => {
  }).on('error', (e) => {
    console.error(e);
  });

  return true;
}

function sendToMany() {
  // slack = new Slack(slack_api_token);
  // slack.api('users.list', {
  // }, function(err, response){
  //
  //   for(var index in response.members){
  //     if(!response.members[index].is_bot && !response.members[index].deleted) {
  //       slackUsername = response.members[index].name;
  // 				url = 'https://slack.com/api/' + postMessageMethod +
  // 		      '?token=' + slack_api_token +
  // 					'&username=Mr. Moody' +
  // 					'&as_user=false' +
  // 					'&icon_url=https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2016-11-04/100929399430_30f602e36ebfbc81756b_48.jpg' +
  // 		      '&channel=@' + slackUsername +
  // 		      '&attachments=' + attachments;
  //
  // 		    https.get(url, (res) => {
  // 		    }).on('error', (e) => {
  // 		      console.error(e);
  // 		    });
  //     }
  //   }
  // });

  return false;
}

app.use('/api', router);
app.listen(8080);
console.log(version);
