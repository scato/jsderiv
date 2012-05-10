export constructor ID, QID, LITERAL, SYMBOL, CLASS, KEYWORD;

export grammar Lexer {
    start (SPACE | ID | QID | COMMENT | LITERAL | SYMBOL | CLASS | KEYWORD)*;
    
    NEWLINE: "\r\n" | "\n";
    CONTROL: "\\t" | "\\r" | "\\n" | "\\v" | "\\f";
    UNICODE: "\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F];
    
    SPACE:      ((" " | "\t" | "\r" | "\n")+ ?= ~(" " | "\t" | "\r" | "\n"))!;
    _ID:        [A-Za-z_] [A-Za-z0-9_\-]* ?= ~[A-Za-z0-9_\-] & ~KEYWORD;
    ID:         <_ID> -> ID;
    QID:        <"."* (_ID | _LITERAL) ("." (_ID | _LITERAL))* & ~_ID & ~_LITERAL> -> QID;
    // COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" ([^\r\n] | "\r" ?= ~"\n")* ?= NEWLINE)!;
    // COMMENT:    ("/*" ~(.* "*/" .*) "*/" | "//" ([^\r\n] | "\r" ?= ~"\n")* ?= NEWLINE)!;
    COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" ~(.* NEWLINE .*) ?= NEWLINE)!;
    // COMMENT:    ("/*" ~(.* "*/" .*) "*/" | "//" ~(.* NEWLINE .*) ?= NEWLINE)!;
    _LITERAL:   (
                    "\"" ([^"\\] | "\\\\" | "\\\"" | CONTROL | UNICODE)* "\""
                  | '\'' ([^'\\] | '\\\\' | '\\\'' | CONTROL | UNICODE)* '\''
                );
    LITERAL:    <_LITERAL> -> LITERAL;
    SYMBOL:     <
                    ":" | ";"
                  | "(" | ")"
                  | "*" | "+" | "?"
                  | "&" | "|" | "~"
                  | "?=" | "!" | "->" | "@"
                  | "{" | "}" | "," | "." | "<" | ">"
                > -> SYMBOL;
    RANGE:      CHAR "-" CHAR;
    CATEGORY:   "\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\p{" [A-Za-z_]* "}" | "\\P{" [A-Za-z_]* "}";
    CHAR:       [^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | CONTROL | UNICODE | CATEGORY | "\\]";
    CLASS:      <"[" ((RANGE | CHAR)* | "^" (RANGE | CHAR)+) "]"> -> CLASS;
    KEYWORD:    <
                    "grammar" | "start" | "import" | "from" | "export" | "constructor"
                  | "augment" | "default" | "extends" | "super"
                > ?= ~[A-Za-z0-9_\-] -> KEYWORD;
}

export constructor Module, Import, Export, Constructor, Grammar, Start, Rule, Augmentation;
export constructor Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Look, Type, Value, One, Ref, Class, Literal, Default, Super, Capture;

export grammar Parser {
    start Statement* -> Module ;
    
    Statement       : Import | Export | Definition | Augmentation ;
    
    Import          : "import"! IdentifierList "from"! @QID ";"! -> Import ;
    IdentifierList  : <"{"! @ID (":"! @ID)? (","! @ID (":"! @ID)?)* "}"!>
                    | <@ID (","! @ID)*> ;
    
    Export          : "export"! Definition -> Export ;
    
    Definition      : Constructor | Grammar ;
    
    Constructor     : "constructor"! @ID (","! @ID)* ";"! -> Constructor ;
    
    Grammar         : "grammar"! @ID ("extends"! @ID)? "{"! (<Rule*>) "}"! -> Grammar ;
    Rule            : "start"! Expression ";"! -> Start
                    | @ID ":"! Expression ";"! -> Rule ;
    
    Augmentation    : "augment"! "grammar"! @ID "{"! (<Rule*>) "}"! -> Augmentation ;
    
    Expression  : OrExpr ;
    
    OrExpr      : OrExpr "|"! RedExpr -> Or
                | RedExpr ;
    RedExpr     : RedExpr "->"! @ID -> Red
                | AndExpr ;
    AndExpr     : AndExpr "&"! SeqExpr -> And
                | SeqExpr ;
    SeqExpr     : SeqExpr RightExpr -> Seq
                | RightExpr ;
    RightExpr   : RightExpr "*"! -> Any
                | RightExpr "+"! -> Many
                | RightExpr "?"! -> Maybe
                | RightExpr "!"! -> Ignore
                | LeftExpr ;
    LeftExpr    : "~"! LeftExpr -> Not
                | "?="! LeftExpr -> Look
                | Terminal ;
    
    Terminal    : "("! Expression ")"!
                | "<"! Expression ">"! -> Capture
                | "@"! @ID -> Type
                | "@"! @LITERAL -> Value
                | "."! -> One
                | @ID -> Ref
                | @CLASS -> Class
                | @LITERAL -> Literal
                | "default"! -> Default
                | "super"! -> Super ;
}

