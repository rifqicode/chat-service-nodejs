module.exports = (validate, data) => {

    console.log(validate, data);
    let error = [];

    for (let index = 0; index < validate.length; index++) {
        const element = validate[index];
        
        if (data[element] == '') error.push(`${element} required`);
    }

    return error;
}