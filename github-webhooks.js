var fs = require('fs');
var githubhook = require('githubhook');
const spawn = require('child_process').spawn;

const options = {

  key: fs.readFileSync('/home/pi/slack-hangman/pem/github_webhooks_key.pem'),
  cert: fs.readFileSync('/home/pi/slack-hangman/pem/github_webhooks_cert.pem'),
  passphrase: process.env.GITHUB_WEBHOOKS_PEM_PASSPHRASE

};

var github = githubhook({
    secret: process.env.GITHUB_WEBHOOKS_SECRET,
    https: options,
    path: "/"
});

github.listen();

github.on('push', function (event, repo, ref, data) {
	if(repo === "refs/heads/master") {
		console.log("[GITHUB WEBHOOKS] Push on master registered. Pulling changes...");

		let pullMaster = spawn("git", ["pull"]);

		pullMaster.stdout.on('data', function (data) {
		  console.log('[GITHUB WEBHOOKS] ' + data.toString());
		});
		
		pullMaster.stderr.on('data', function (data) {
		  console.log('[GITHUB WEBHOOKS] ' + data.toString());
		});
		
		pullMaster.on('exit', function (code) {
			if(code !== 0) {
				console.error("[GITHUB WEBHOOKS] Could not pull from repo.");
			} else {
				console.log("[GITHUB WEBHOOKS] Changes pulled. Restarting server...");
				let restartServer = spawn("npm", ["restart"]);

				restartServer.stdout.on('data', function (data) {
				  console.log('[GITHUB WEBHOOKS] ' + data.toString());
				});
				
				restartServer.stderr.on('data', function (data) {
				  console.log('[GITHUB WEBHOOKS] ' + data.toString());
				});
			}		
		});
	}
});