import nunjucks from 'nunjucks';

function run() {
    nunjucks.configure('./templates', {});
    const string = nunjucks.render('template-1.txt.njk', {
        name: 'Mando',
        day: new Date().toLocaleDateString('en-GB', {weekday: 'long'})
    });
    console.log(string);
}

run();