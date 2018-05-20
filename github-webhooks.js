var fs = require('fs');
var githubhook = require('githubhook');
const exec = require('child_process').exec;

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
		exec('git pull',

		        (error, stdout, stderr) => {

				console.log(`${ stdout }`);

				console.log(`${ stderr }`);

				if (error !== null) {

			                console.log(`[GITHUB WEBHOOKS] Could not pull from repo: ${ error }`);

				} else {
					console.log("[GITHUB WEBHOOKS] Changes pulled. Restarting server...");
					exec('npm restart',

					        (error, stdout, stderr) => {

							console.log(`${ stdout }`);

							console.log(`${ stderr }`);

							if (error !== null) {

						                console.log(`[GITHUB WEBHOOKS] Could not restart server: ${ error }`);

							} else {
								console.log("[GITHUB WEBHOOKS] Server restarted after changes on master.");
							}

				        	}
        				);
				}

	        	}
        	);
	}
});