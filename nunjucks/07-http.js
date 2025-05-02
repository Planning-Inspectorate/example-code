import http from 'node:http';
import nunjucks from 'nunjucks';

function run() {
    nunjucks.configure('./templates', {});

    const server = http.createServer((req, res) => {
        console.log('request', req.method, req.url);
        const renderedHtml = nunjucks.render('template-6.html.njk', {
            pageTitle: 'My App',
            navigation: [
                {name: 'Home', link: '/'},
                {name: 'About', link: '/about'},
                {name: 'Contact', link: '/contact'}
            ],
            todo: [
                {task: 'Buy groceries', done: true},
                {task: 'Clean the house', done: false},
                {task: 'Finish project', done: true}
            ],
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(renderedHtml);
    });
    server.listen(3000, () => {
        console.log('server started');
    });
}

run();

