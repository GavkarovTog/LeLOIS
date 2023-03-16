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

const countOfLists = (list) => {
    if (! list)
        return false;

    const countOfListsRecursive = (index, count) => {
        if (index == list.length)
            return count;

        else if (Array.isArray(list[index]))
            return countOfListsRecursive(index + 1, count + 1);

        return countOfListsRecursive(index + 1, count);
    }

    return countOfListsRecursive(0, 0);
}

const getParseTree = (text) => {
    const getParseTreeRecursive = (scope, isBraced=false, countOfComplex=0, countOfVars=0, countOfOps=0) => {
        if (isBraced) {
            if (countOfComplex + countOfVars > 2)
                return false;

            else if (countOfOps > 1)
                return false;
        }
        
        else if (! isBraced) {
            // if (countOfVars > 0 && countOfComplex > 0)
            //     return false;

            // else if (countOfOps > 1)
            //     return false;

            // else if (countOfVars > 0 && countOfOps > 0)
            //     return false;

            if (countOfVars > 0 && countOfComplex > 0)
                return false;

            else if (countOfVars > 1)
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

            if (isBraced && countOfOps > 0 && countOfVars + countOfComplex < 2) {
                return false;
            }

            else if (! isBraced)
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

const extractTerms = (parseTree) => {
    if (! parseTree)
        return false;

    let extractTermsRecursive = (currentTerm, isNegated=false, isDisjuncted=false) => {
        let result = []

        if (! Array.isArray(currentTerm)) {
            // if (currentTerm == 'or' || currentTerm == 'and' || currentTerm == '!')
            //     return [];

            return [currentTerm];
        }

        let negated = false;
        let disjuncted = false;
        let conjuncted = false;

        if (currentTerm.includes('!'))
            negated = true;

        else if (currentTerm.includes('or'))
            disjuncted = true;

        else if (currentTerm.includes('and'))
            conjuncted = true;

        if (isDisjuncted && conjuncted || isNegated && negated || isNegated && currentTerm.length > 1)
            return false;

        for (const term of currentTerm) {
            if (term == 'or' || term == 'and' || term == '!')
                continue;

            let extracted = extractTermsRecursive(term, negated, disjuncted);

            if (!extracted)
                return false;

            if (conjuncted && countOfLists(extracted) == 0) 
                result.push(extracted);

            else
                result = result.concat(extracted);
        }
    
        return result;
    }

    let result = extractTermsRecursive(parseTree); 

    if (result && countOfLists(result) == 0) 
        return [result];

    return result;
}

const checkForCNF = (terms) => {
    
}

btn.addEventListener("click", () => {
    let text = field.value;

    // parseTree = getParseTree(text)
    // terms = getAllConjunctions(parseTree);

    let tree = getParseTree(text);
    console.log(printList(tree));
    
    console.log(printList(extractTerms(tree)));
    // answer.innerHTML = getParseTree(text);
    // answer.innerHTML = isCDNF(terms);
});

document.addEventListener("keydown", (e) => {
    if (e.key == "Enter")
        btn.click();
        
    else
        field.focus();
});