export constructor Var, Lit;

export grammar Scannerless {
    Var: "var"! '\s'!* <ID> '\s'!* ("="! '\s'!* Expr '\s'!*)? ";"! -> Var;
    Expr: Lit;
    Lit: <"'" [a-z]+ "'"> -> Lit;
    
    ID: '\w'+ & ~KEYWORD;
    KEYWORD: "var";
}

