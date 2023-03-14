

field = document.getElementById("inputfield");
btn = document.getElementById("evalbutton");

answer = document.getElementById("answer");


const advance = (text) => {
    return text.slice(1, text.length);
}

const printList = (list) => {

    let result = '['

    for (let i = 0; i < list.length; i ++) {
        if (Array.isArray(list[i])) 
            result += printList(list[i]);

        else
            result += list[i];

        if (i != list.length - 1)
            result += ' ';
    }

    result += ']';

    return result;
}

const getParseTree = (text) => {
    const getParseTreeRecursive = (scope) => {
        if (text.length == 0)
            return scope;

        let ch = text[0];

        if (ch == '(') {
            text = advance(text);
            let result = getParseTreeRecursive([])

            if (!result)
                return result;

            scope.push(result);
            return getParseTreeRecursive(scope);
        }

        else if (ch == ')') {
            text = advance(text);

            return scope;
        }

        else if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(ch)) {
            text = advance(text);

            scope.push(ch);
            return getParseTreeRecursive(scope);
        }

        else {
            if (text.length != 1 && ch == '\\' && text[1] == '/') {
                scope.push('or');
                text = advance(text);
            }

            else if (text.length != 1 && ch == '/' && text[1] == '\\') {
                scope.push('and');
                text = advance(text);
            }

            else if (text == '!')
                scope.push('!');

            else
                return false;

            text = advance(text);

            return getParseTreeRecursive(scope);
        }

        return false;
    }

    return getParseTreeRecursive([])
}

// const getParseTree = (text) => {
//     let result = [];
//     let scope = result;
//     let scopeStack = [];

//     for (let i = 0; i < text.length; i ++) {
//         let currentElement = text[i];

//         if ("\\/!".includes(currentElement))
//             continue;

//         else if (currentElement == '(') {
//             scopeStack.push(scope.slice());
//             scope = [];
//         }

//         else if (currentElement == ')') {
//             result.push(scope);
//             scope = scopeStack.pop();
//         }

//         else if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(currentElement))
//             scope.push(currentElement);
//     }

//     return result;
// }

btn.addEventListener("click", () => {
    let text = field.value;

    // parseTree = getParseTree(text)
    // terms = getAllConjunctions(parseTree);
    
    console.log(printList(getParseTree(text)));
    // answer.innerHTML = getParseTree(text);
    // answer.innerHTML = isCDNF(terms);
});

document.addEventListener("keydown", (e) => {
    if (e.key == "Enter")
        btn.click();
        
    else
        field.focus();
});