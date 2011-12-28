/* http://www.w3.org/TR/REC-xml/#sec-notation */

/* 6 Notation */

grammar ::= rule*
Char ::= #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]  /* any Unicode character, excluding the surrogate blocks, FFFE, and FFFF. */
S ::= (#x20 | #x9 | #xD | #xA)+

/* symbol ::= expression */
rule ::= symbol '::=' expression

symbol ::= [a-zA-Z]+

/* #xN */
CharRef ::= '#x' [0-9a-fA-F]+

/* [a-zA-Z] */
CharRange ::= '[' (Char '-' Char)+ ']'

/* [#xN-#xN] */
CharRefRange ::= '[' (CharRef '-' CharRef)+ ']'

/* [abc] */
CharList ::= '[' Char+ ']'

/* [#xN#xN#xN] */
CharRefList ::= '[' CharRef+ ']'

/* [^a-zA-Z] */
CompCharRange ::= '[^' (Char '-' Char)+ ']'

/* [^#xN-#xN] */
CompCharRefRange ::= '[^' (CharRef '-' CharRef)+ ']'

/* [^abc] */
CompCharList ::= '[^' Char+ ']'

/* [^#xN#xN#xN] */
CompCharRefList ::= '[^' CharRef+ ']'

/* "string" */
DQLiteral ::= '"' [^"]* '"'

/* 'string' */
SQLiteral ::= "'" [^']* "'"


Terminal ::= CharRef | CharRange | CharRefRange | CharList | CharRefList
             | CompCharRange | CompCharRefRange | CompCharList | CompCharRefList
             | DQLiteral | SQLiteral

/* A | B */
/* A - B */
expression ::= expression '|' concatExpr
               expression '-' concatExpr
               | concatExpr

/* A B */
concatExpr ::= concatExpr unaryExpr
               | unaryExpr

/* A? */
/* A+ */
/* A* */
unaryExpr ::= unaryExpr '?'
              | unaryExpr '+'
              | unaryExpr '*'
              | primaryExpr

/* (expression) */
primaryExpr ::= '(' expression ')' | Symbol | Terminal

/* ... */
Comment ::= '/*' ([^*] | '*' ?! '/')* '*/'



