

field = document.getElementById("inputfield");
btn = document.getElementById("evalbutton");

answer = document.getElementById("answer");


const advance = (text) => {
    return text.slice(1, text.length);
}

const printList = (list) => {
    if (!list) {
        return false;
    }

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
    const getParseTreeRecursive = (scope, isBraced=false, countOfComplex=0, countOfVars=0, countOfOps=0) => {
        if (isBraced && (countOfComplex + countOfVars > 2 || countOfOps > 1))
            return false;
        
        else if (! isBraced) {
            // if (countOfVars > 0 && countOfComplex > 0)
            //     return false;

            // else if (countOfOps > 1)
            //     return false;

            // else if (countOfVars > 0 && countOfOps > 0)
            //     return false;

            if (countOfVars > 1)
                return false;

            else if (countOfComplex > 1)
                return false;

            else if (countOfOps > 1)
                return false;
        }

        if (text.length == 0) {
            if (isBraced)
                return false;

            return scope;
        }

        let ch = text[0];

        if (ch == '(') {
            text = advance(text);
            let result = getParseTreeRecursive([], true)

            if (!result)
                return result;

            scope.push(result);
            return getParseTreeRecursive(scope, isBraced, countOfComplex + 1, countOfVars, countOfOps);
        }

        else if (ch == ')') {
            text = advance(text);

            if (! isBraced)
                return false;

            return scope;
        }

        else if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(ch)) {
            text = advance(text);

            scope.push(ch);
            return getParseTreeRecursive(scope, isBraced, countOfComplex, countOfVars + 1, countOfOps);
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

            else if (ch == '!')
                scope.push('!');

            else
                return false;

            text = advance(text);

            return getParseTreeRecursive(scope, isBraced, countOfComplex, countOfVars, countOfOps + 1);
        }

        return false;
    }

    return getParseTreeRecursive([]);
}

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