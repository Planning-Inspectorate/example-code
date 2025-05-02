import nunjucks from 'nunjucks';

function run() {
    nunjucks.configure({});
    const string = nunjucks.renderString('Hello {{ name }}. Today is a {{ day }}.', {
        name: 'Mando',
        day: new Date().toLocaleDateString('en-GB', {weekday: 'long'})
    });
    console.log(string);
}

run();