import nunjucks from 'nunjucks';

function run() {
    nunjucks.configure('./templates', {});
    const string = nunjucks.render('template-2.html.njk', {
        name: 'Mando',
        isBirthday: false
    });
    console.log(string);
}

run();