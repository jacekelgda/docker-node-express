const express = require('express');
const bodyParser = require('body-parser');
const Slack = require('slack-node');
const app = express();
const config = require('config');
const https = require('https');
const postMessageMethod = 'chat.postMessage';
const listUsersMethod = 'users.list';
var resources_attachemnts = require('./resources/attachments.json');
const attachments = JSON.stringify(resources_attachemnts);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var router = express.Router();

router.use(function timeLog (req, res, next) {
  next();
})

app.get('/', function(req, res) {
  res.send('API is running ...');
});

router.post('/notify', function (req, res) {
		if (req.body.payload) {
			var payload = JSON.parse(req.body.payload);

			// extract to config
			if (config.has('api.oauth.verification_token') && payload.token == config.get('api.oauth.verification_token')) {
				var vote = payload.actions[0].value;
				var username = payload.user.name;
				switch (vote) {
				  case 'smile':
				    console.log(username, 'smile');
						var slack_api_token = getApiToken();
						url = 'https://slack.com/api/' + postMessageMethod +
							'?token=' + slack_api_token +
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
						var slack_api_token = getApiToken();
						url = 'https://slack.com/api/' + postMessageMethod +
							'?token=' + slack_api_token +
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
						var slack_api_token = getApiToken();
						url = 'https://slack.com/api/' + postMessageMethod +
							'?token=' + slack_api_token +
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
	if (config.has('test.test_user') && req.body.user_name == config.get('test.test_user')) {
    url = getUrlForRequest(getApiToken(), config.get('test.test_user'));
    makeHttpsGetRequest(url);
		res.send('"How was your week?" - notifications sent to private channels. Thanks!');
	} else {
    res.send('Error');
  }
})
// </Routers>

// <Functions>
function getApiToken() {
  if (config.has('api.oauth.api_token')) {
    slack_api_token = config.get('api.oauth.api_token');
  }

  return slack_api_token;
}

function getUrlForRequest(token, username) {
  return 'https://slack.com/api/' + postMessageMethod +
    '?token=' + token +
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
app.listen(port);
console.log('Listening to port ' + port);
