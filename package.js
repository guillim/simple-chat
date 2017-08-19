Package.describe({
    summary: "Easy chat window. Pop up as a bootstrap modal. Simplification of cesarve77 version",
    version: "0.4.21",
    name: "guillim:simple-chat",
    git: "https://github.com/guillim/simple-chat"
});
Package.onUse(function (api) {
    api.versionsFrom('1.4');
    api.use([
        'templating',
        'check',
        'ecmascript',
        'jquery',
        'tracker',
        'reactive-var'
    ])
    api.use(['check'], ['server', 'client'])
    api.addAssets(['assets/fonts/chat.eot','assets/fonts/chat.woff','assets/fonts/chat.svg','assets/fonts/chat.ttf'],'client')
    api.mainModule('client.js', 'client');
    api.mainModule('server.js', 'server');
});

Npm.depends({
    moment: '2.15.2'
});
