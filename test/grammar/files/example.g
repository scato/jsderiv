export constructor Var, Lit;

export grammar Scannerless {
    Var: "var"! <ID> ("="! Expr)? ";"! -> Var;
    Expr: Lit;
    Lit: [a-z]+ & ~KEYWORD -> Lit;
    
    KEYWORD: "var";
}

