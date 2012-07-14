

PHP.Compiler.prototype.Node_Expr_ArrayDimFetch = function( action ) {

    return this.source( action.variable ) + "."  + this.DIM_FETCH + '( this, ' + this.source( action.dim ) + " )";
};

PHP.Compiler.prototype.Node_Expr_Assign = function( action ) {

    if ( action.variable.type === "Node_Expr_Variable" && action.variable.name === "this") {
        this.FATAL_ERROR = "Cannot re-assign $this in " + this.file + " on line " + action.attributes.startLine;  
    }
    
    
    var src = this.source( action.variable ) + "." + this.ASSIGN + "(" + this.source( action.expr ) + ")";
    /*
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }*/
    return src;
};

PHP.Compiler.prototype.Node_Expr_AssignMinus = function( action ) {
    var src = this.source( action.variable ) + "." + this.VARIABLE_VALUE + " -= " + this.source( action.expr );
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }
    return src;
};

PHP.Compiler.prototype.Node_Expr_AssignPlus = function( action ) {
    var src = this.source( action.variable ) + "." + this.VARIABLE_VALUE + " += " + this.source( action.expr );
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }
    return src;
};


PHP.Compiler.prototype.Node_Expr_AssignMul = function( action ) {
    var src = this.source( action.variable ) + "." + this.VARIABLE_VALUE + " *= " + this.source( action.expr );
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }
    return src;
};


PHP.Compiler.prototype.Node_Expr_AssignDiv = function( action ) {
    var src = this.source( action.variable ) + "." + this.VARIABLE_VALUE + " /= " + this.source( action.expr );
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }
    return src;
};

PHP.Compiler.prototype.Node_Expr_AssignConcat = function( action ) {
    var src = this.source( action.variable ) + "." + this.VARIABLE_VALUE + " += " + this.source( action.expr );
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }
    return src;
};

PHP.Compiler.prototype.Node_Expr_AssignRef = function( action ) {

    var src = this.source( action.variable ) + "." + PHP.VM.Variable.prototype.REF + "(" + this.source( action.refVar ) + ")";
    console.log( action );
    return src;
};

PHP.Compiler.prototype.Node_Expr_Ternary = function( action ) {
    var src = "(( " + this.source( action.cond ) + "." + this.VARIABLE_VALUE + " ) ? " + this.source( action.If ) + " : " + this.source( action.Else ) + ")";

    return src;
};

PHP.Compiler.prototype.Node_Expr_ErrorSuppress = function( action ) {
    var src = this.CTX + this.SUPPRESS + "(function() { return " + this.source( action.expr ) + " })";
    return src;
};

PHP.Compiler.prototype.Node_Expr_FuncCall = function( action ) {

    var src = "(" + this.CTX + this.FUNCTION + '(';
    

    if ( action.func.type !== "Node_Name") {
        src +=  this.source( action.func ) + "." + this.VARIABLE_VALUE + ", arguments";
    } else {
        src += '"' + this.getName( action.func ) + '", arguments';

        if (this.getName( action.func ) === "eval") {
            src += ", $"
        // args.push("$");
        }

    }

    action.args.forEach(function( arg ){
        src += ", " + this.source( arg.value );
    //    args.push( this.source( arg.value ) );
    }, this);

    src += "))";

    return src;
};

PHP.Compiler.prototype.Node_Expr_Exit = function( action ) {
    var src = this.CTX + "exit( " + this.source(action.expr) + " )";

    return src;
};

PHP.Compiler.prototype.Node_Expr_AssignList = function( action ) {
   
    var src = this.CTX + "list( " + this.source(action.expr);

    var args = [];

    action.assignList.forEach(function( item ){
        src += ", " + this.source(item) ;
    }, this);

    src += " )";

    return src;
};

PHP.Compiler.prototype.Node_Expr_Isset = function( action ) {

    var src = this.CTX + "$isset( ";

    var args = [];
    action.variables.forEach(function( arg ){

        switch (arg.type) {
            
            case "Node_Expr_ArrayDimFetch":
                args.push( this.source( arg.variable ) + "."  + this.DIM_ISSET + '( this, ' + this.source( arg.dim ) + " )" );
                break;
            default:
                args.push( this.source( arg) );
        }

        
    }, this);

    src += args.join(", ") + " )";

    return src;
};

PHP.Compiler.prototype.Node_Expr_Empty = function( action ) {

    var src = this.CTX + "$empty( ";
    console.log(action);
    switch (action.variable.type) {
        case "Node_Expr_ArrayDimFetch":
            src += this.source( action.variable.variable ) + "."  + this.DIM_EMPTY + '( this, ' + this.source( action.variable.dim ) + " )";
            break;
        default:
            src += this.source( action.variable ) ;
    }
    src += " )";

    return src;
};

PHP.Compiler.prototype.Node_Expr_Instanceof = function( action ) {
    
    
    var classPart;

    if (action.right.type === "Node_Name") {
        classPart = '"' + this.source(action.right) +'"';
    } else {
        classPart = this.source(action.right) + "." + this.VARIABLE_VALUE;
    }
    
    return this.source( action.left ) + "." + this.INSTANCEOF + '('  + classPart + ')';
};

PHP.Compiler.prototype.Node_Expr_UnaryPlus = function( action ) {
    return this.source( action.expr );
};

PHP.Compiler.prototype.Node_Expr_UnaryMinus = function( action ) {
    return this.source( action.expr ) + "." + this.NEG + "()";
};

PHP.Compiler.prototype.Node_Expr_BitwiseOr = function( action ) {
    return this.source( action.left ) + "." + this.VARIABLE_VALUE + " | " + this.source( action.right ) + "." + this.VARIABLE_VALUE;
};

PHP.Compiler.prototype.Node_Expr_BitwiseAnd = function( action ) {
    return this.source( action.left )  + "." + this.VARIABLE_VALUE + " & " + this.source( action.right ) + "." + this.VARIABLE_VALUE;
};

PHP.Compiler.prototype.Node_Expr_Div = function( action ) {
    return this.source( action.left ) + "." + this.DIV + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Minus = function( action ) {
    return this.source( action.left ) + "." + this.MINUS + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Mul = function( action ) {
    return this.source( action.left ) + "." + this.MUL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Mod = function( action ) {
    return this.source( action.left ) + "." + this.MOD + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Plus = function( action ) {
    return this.source( action.left ) + "." + this.ADD + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Equal = function( action ) {
    return this.source( action.left ) + "." + this.EQUAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_NotIdentical = function( action ) {
    return this.source( action.left ) + "." + this.NOT_IDENTICAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Identical = function( action ) {
    return this.source( action.left ) + "." + this.IDENTICAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_BooleanNot = function( action ) {
    console.log( action );
    return this.source( action.expr ) + "." + this.BOOLEAN_NOT + "()";
};

PHP.Compiler.prototype.Node_Expr_Smaller = function( action ) {
    return this.source( action.left ) + "." + this.SMALLER+ "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Greater = function( action ) {
    return this.source( action.left ) + "." + this.GREATER+ "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_GreaterOrEqual = function( action ) {
    return this.source( action.left ) + "." + this.GREATER_OR_EQUAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_SmallerOrEqual = function( action ) {
    return this.source( action.left ) + "." + this.SMALLER_OR_EQUAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_PreInc = function( action ) {
    return this.source( action.variable ) + "." + this.PRE_INC + "()";
};

PHP.Compiler.prototype.Node_Expr_PreDec = function( action ) {
    return this.source( action.variable ) + "." + this.PRE_DEC + "()";
};

PHP.Compiler.prototype.Node_Expr_PostInc = function( action ) {
    return this.source( action.variable ) + "." + this.POST_INC + "()";
};

PHP.Compiler.prototype.Node_Expr_PostDec = function( action ) {
    return this.source( action.variable ) + "." + this.POST_DEC + "()";
};

PHP.Compiler.prototype.Node_Expr_Concat = function( action ) {
    return this.source( action.left ) + "." + this.CONCAT + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_BooleanOr = function( action ) {

    return  this.source( action.left ) + "." + this.BOOLEAN_OR + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Print = function( action ) {

    var src = this.CTX + 'print( ';

    src += this.source(action.expr);


    src += ' )';
    return src;
};

PHP.Compiler.prototype.Node_Expr_Variable = function( action ) {
    var src = this.VARIABLE + "(";

    if ( action.name === "this" ) {
        return action.name;
    } else {

        if ( typeof action.name === "string" ) {
            src += '"' + this.source( action.name ) + '"';
        } else {
            src += this.source( action.name ) + "." + this.VARIABLE_VALUE;
        }

    //  return this.VARIABLE + '("' + this.source( action.name ) + '")';
    }

    return src + ")";
};

PHP.Compiler.prototype.Node_Expr_Cast_String = function( action ) {
    return  this.source( action.expr ) + "." + PHP.VM.Variable.prototype.CAST_STRING;
};

PHP.Compiler.prototype.Node_Expr_Include = function( action ) {
    return  this.CTX + "include( " +this.VARIABLE + ", " + this.source( action.expr ) + " )";
};

PHP.Compiler.prototype.Node_Expr_RequireOnce = function( action ) {
    return  this.CTX + "require_once( " +this.VARIABLE + ", " + this.source( action.expr ) + " )";
};

PHP.Compiler.prototype.Node_Expr_New = function( action ) {


    var classPart,
    src = "";
    
    if (action.Class.type === "Node_Name") {
        classPart = '"' + this.source(action.Class) +'"';
    } else {
        classPart = this.source(action.Class) + "." + this.VARIABLE_VALUE;
    }

    src += this.CREATE_VARIABLE + '(new (' + this.CTX + this.CLASS_GET + '(' + classPart + '))( this';

    action.args.forEach(function( arg ) {

        src += ", "  + this.source( arg.value );
    }, this);

    src += " ))";

    return src;
};



PHP.Compiler.prototype.Node_Expr_ConstFetch = function( action ) {

    if (/true|false|null/i.test(action.name.parts)) {
        return this.CREATE_VARIABLE + '(' + action.name.parts.toLowerCase() + ')';
    } else {
        return this.CTX + this.CONSTANTS + '.' + this.CONSTANT_GET + '("' + this.source( action.name ) + '")';
    }

};


PHP.Compiler.prototype.Node_Expr_MethodCall = function( action ) {

    var classPart, src = "";

    
    if (action.name.type === undefined) {
        classPart = '"' + action.name +'"';
    } else {
        classPart = this.source(action.name) + "." + this.VARIABLE_VALUE;
    }


    src += this.source( action.variable ) + "." + this.METHOD_CALL + '( ';

    src += ( action.variable.name === "this") ? "ctx" : "this";

    src += ', ' + classPart;

    action.args.forEach(function( arg ) {
        src += ", " + this.source( arg.value );
    }, this);



    src += ")";

    return src;

};

PHP.Compiler.prototype.Node_Expr_PropertyFetch = function( action ) {

    if ( action.variable.name !== "this" ) {
        return this.source( action.variable ) + "." + this.VARIABLE_VALUE + "." + this.CLASS_PROPERTY_GET + '( this, "' + this.source( action.name ) + '" )';
    } else {
        return "this." + this.CLASS_PROPERTY_GET + '( ctx, "' + this.source( action.name ) + '" )';
    }

};

PHP.Compiler.prototype.Node_Expr_ClassConstFetch = function( action ) {

    var classPart;
    
    if (action.Class.type === "Node_Name") {
        classPart = '"' + this.source(action.Class) +'"';
    } else {
        classPart = this.source(action.Class) + "." + this.VARIABLE_VALUE;
    }


    return this.CTX + this.CLASS_CONSTANT_GET + '(' + classPart + ', this, "' + action.name  + '" )';


};

PHP.Compiler.prototype.Node_Expr_StaticCall = function( action ) {

    var src = "";
    
    var classPart,
    funcPart;
    
    if (action.Class.type === "Node_Name") {
        classPart = '"' + this.source(action.Class) +'"';
    } else {
        classPart = this.source(action.Class) + "." + this.VARIABLE_VALUE;
    }
    
    if (typeof action.func === "string") {
        funcPart = '"' + this.source(action.func) + '"';
    } else {
        funcPart = this.source(action.func) + "." + this.VARIABLE_VALUE;
    }
    
    if (/^(parent|self)$/i.test( action.Class.parts )) {
        src += "this." + this.STATIC_CALL + '( ' + ( (this.INSIDE_METHOD === true) ? "ctx" : "this") + ', ' + classPart +', ' + funcPart;
    } else {
        src += this.CTX + this.CLASS_GET + '(' + classPart + ', this).' + this.STATIC_CALL + '( ' + ( (this.INSIDE_METHOD === true) ? "ctx" : "this") + ', ' + classPart +', ' + funcPart ;
    }


    action.args.forEach(function( arg ) {
        src += ", " + this.source( arg.value );
    }, this);

    src += ")";

    return src;

};

PHP.Compiler.prototype.Node_Expr_StaticPropertyFetch = function( action ) {

    var src = "",
    classPart;
    
    if (action.Class.type === "Node_Name") {
        classPart = '"' + this.source(action.Class) +'"';
    } else {
        classPart = this.source(action.Class) + "." + this.VARIABLE_VALUE;
    }
    
    if (/^(parent|self)$/i.test( action.Class.parts )) {
        src += "this." + this.STATIC_PROPERTY_GET + '( ' + ( (this.INSIDE_METHOD === true) ? "ctx" : "this") + ', ' + classPart +', "' + action.name + '"';
    } else {
        src += this.CTX + this.CLASS_GET + '(' + classPart + ', this).' + this.STATIC_PROPERTY_GET + '( ' + ( (this.INSIDE_METHOD === true) ? "ctx" : "this") + ', ' + classPart +', "' + action.name + '"';
    }

    src += ")";

    return src;

};

PHP.Compiler.prototype.Node_Expr_Array = function( action ) {

    var src = this.CTX + "array([",
    items = [];

    ((Array.isArray(action.items)) ? action.items : [ action.items ]).forEach(function( item ){

        items.push("{" + this.ARRAY_VALUE + ":" + this.source( item.value ) + ( ( item.key !== undefined) ? ", " + this.ARRAY_KEY + ":" + this.source( item.key ) : "") +  "}");
    }, this);

    src += items.join(", ") + "])";
    return src;

};

