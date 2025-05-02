import nunjucks from 'nunjucks';

function run() {
    nunjucks.configure({});
    const string = nunjucks.renderString('Hello {{ name }}', {name: 'Mando'});
    console.log(string);
}

run();