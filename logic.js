var example = '{"example1":"example1","example2":1234,"example3":{"example4":"example4","example5":1234}}';
$('#textInput').val(example)

$('.btn-shorten').on('click', function(){
    $('#textOutput').val('');
    let result = create($('#textInput').val());
    $('#textOutput').val(result);
});

function create(json_body){
    let json = "";
    try{
        json = JSON.parse(json_body);
    }
    catch (e) {
        console.log(e);
        return "Invalid JSON";
    }

    try{
        return handle("Root", json);
    }
    catch (e) {
        console.log(e);
        return "Failed to map to angle script.";
    }
}

// Create function to handle all json objects which can be repeated

function handle(name, json_obj){
    let result = `class ${name} { \n`;
    let extraClasses = "";
    // Create All nested objs
    Object.keys(json_obj).forEach(function(key) {
        let value = json_obj[key];
        console.log('Key : ' + key + ', Value : ' + value + ', Type: ' + typeof value + ', Array: ' + Array.isArray(value));
        if(typeof value == 'object' && !(Array.isArray(value))){
            extraClasses = handle(cap(key), value);
        }
    })

    // Set Variables
    function CreateLine(value, key, upper = false) {
        switch (typeof value) {
            case "string":
                return `string ${cap(key, upper)}`;
            case "number":
                return `int ${cap(key, upper)}`;
            case "boolean":
                return `bool ${cap(key, upper)}`;
            case "object":
                if (Array.isArray(value)) {
                    // TODO - Check what the value actually is - should it be a new obj / type of it
                    let first = value[0];
                    let type = typeof first;
                    return `array<${type}> ${cap(key)}`;
                } else {
                    return `${cap(key)}@ _${cap(key, upper)}`;
                }
        }
    }

    Object.keys(json_obj).forEach(function(key) {
        let value = json_obj[key];
        result += "\t";
        result += CreateLine(value, key, true);
        result += ";\n";
    });

    result += "\n\t";
    result += `${name}(`;

    // Create Constructor
    Object.keys(json_obj).forEach(function(key, index, array) {
        let value = json_obj[key];
        result += CreateLine(value, key)
        if (index !== (array.length -1)) {
            result += ", ";
        }
    });
    result += ") {\n";

    Object.keys(json_obj).forEach(function(key) {
        let value = json_obj[key];
        if(typeof value == 'object' && !(Array.isArray(value))){
            result += `\t\t@_${cap(key)} = _${key};\n`;
        }else{
            result += `\t\t${cap(key)} = ${key};\n`;
        }
    });
    result += "\t}\n\n";

    // Create Json Constructor
    result += `\t${name}(Json::Value data){\n`;
    Object.keys(json_obj).forEach(function(key) {
        let value = json_obj[key];
        // TODO - arrays
        if(typeof value == 'object' && !(Array.isArray(value))){
            result += `\t\t@_${cap(key)} = ${cap(key)}(data["${key}"]);\n`;
        }
        else{
            result += `\t\t${cap(key)} = data["${key}"];\n`;
        }
    });
    result += "\t}\n\n";

    // Create Json Serializer
    result += "\tJson::Value Serialize(){\n";
    result += "\t\tJson::Value obj = Json::Object();\n";

    Object.keys(json_obj).forEach(function(key, index, array) {
        let value = json_obj[key];
        // TODO - arrays
        if(typeof value == 'object' && !(Array.isArray(value))){
            result += `\t\tobj["${key}"] = _${cap(key)}.Serialize();\n`;
        }
        else{
            result += `\t\tobj["${key}"] = ${cap(key)};\n`;
        }
    });
    result += "\t\treturn obj;\n";
    result += "\t}\n\n";

    // Closing final Bracket
    result += "}\n\n";
    // Append extra classes to bottom
    result += extraClasses;
    return result;
}

function cap(string, upper = true) {
    if(upper === false) {return string}
    return string.charAt(0).toUpperCase() + string.slice(1);
}