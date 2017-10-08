module.exports = function() {
    function judge( rule, measure ) {
        if( !rule.status ) rule.status = {counter: 0};

        var broken = false;
        
        switch( rule.comportamento ) {
            case 'maiorIgual':
                if( measure >= rule.valor ) broken = true;
                break;
            case 'menorIgual':
                if( measure <= rule.valor ) broken = true;
                break;
            case 'maior':
                if( measure > rule.valor ) broken = true;
                break;
            case 'menor':
                if( measure < rule.valor ) broken = true;
                break;
            case 'variacaoPositiva':
                //if( measure >= rule.valor ) broken = true;
                broken = false;
                break;
            case 'variacaoNegativa':
                //if( measure >= rule.valor ) broken = true;
                broken = false;
                break;
            case 'igual':
                if( measure == rule.valor ) broken = true;
                break;
        }

        if( broken ) {
            rule.status.counter++;

            if( rule.status.counter >= rule.ocorrencia ) {
                rule.status.flag = true;
                rule.status.counter = 0;

                return rule;
            } 
        } else {
            rule.status.counter = 0;
        }
        
        rule.status.flag = false;
        return rule;
    }

    return {
        judge: judge
    }
}();