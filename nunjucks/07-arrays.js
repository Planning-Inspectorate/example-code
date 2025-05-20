import nunjucks from 'nunjucks';

function run() {
    nunjucks.configure('./templates', {});
    const string = nunjucks.render('template-7.html.njk', {
        contacts: {
            'id-123': {name: 'Mando', age: 30, job: 'Bounty Hunter'},
            'id-456': {name: 'Boba', age: 35, job: 'Bounty Hunter'},
            'id-789': {name: 'Leia', age: 28, job: 'Princess'}
        }
    });
    console.log(string);
}

run();