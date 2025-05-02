import nunjucks from 'nunjucks';

function run() {
    nunjucks.configure('./templates', {});
    const string = nunjucks.render('template-6.html.njk', {
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
    console.log(string);
}

run();