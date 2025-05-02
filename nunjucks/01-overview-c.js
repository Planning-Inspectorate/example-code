import nunjucks from 'nunjucks';

function run() {
    nunjucks.configure({});
    const string = nunjucks.renderString('{"userName": "{{name}}", "dateOfBirth": "{{birthdate}}"}', {
        name: 'Mando',
        birthdate: new Date('2000-01-01T00:00:00Z').toISOString()
    });
    console.log(string);
    console.log(JSON.parse(string));
}

run();