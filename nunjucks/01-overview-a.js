import nunjucks from 'nunjucks';

function run() {
    nunjucks.configure({});
    const string = nunjucks.renderString('Hello {{ name }}', {name: 'Mando'});
    console.log(string);

    // some conflicting change

    /**
     * @type {Object<string, string>}
     */
    const obj = {hello: 'world'};

    for (let i = 0; i < 10; i++) {
        console.log(i);
    }


    for (const objElement of obj) {

    }
}

run();