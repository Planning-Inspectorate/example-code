import nunjucks from 'nunjucks';

function run() {
    nunjucks.configure('./templates', {});
    const string = nunjucks.render('template-3.html.njk', {
        contributors: ['Mando', 'Boba', 'Leia'],
        todo: [
            {task: 'Buy groceries', done: true},
            {task: 'Clean the house', done: false},
            {task: 'Finish project', done: true}
        ]
    });
    console.log(string);
}

run();