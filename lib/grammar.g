export constructor ID, LITERAL, SYMBOL, CLASS, KEYWORD;

export grammar Lexer {
    start (SPACE | ID | COMMENT | LITERAL | SYMBOL | CLASS | KEYWORD)*;
    
    NEWLINE: "\r\n" | "\n";
    CONTROL: "\\t" | "\\r" | "\\n" | "\\v" | "\\f";
    UNICODE: "\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F];
    
    SPACE:      ((" " | "\t" | "\r" | "\n")+ ?= ~(" " | "\t" | "\r" | "\n"))!;
    ID:         [A-Za-z_] [A-Za-z0-9_]* ?= ~[A-Za-z0-9_] & ~KEYWORD -> ID;
    // COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" ([^\r\n] | "\r" ?= ~"\n")* ?= NEWLINE)!;
    // COMMENT:    ("/*" ~(.* "*/" .*) "*/" | "//" ([^\r\n] | "\r" ?= ~"\n")* ?= NEWLINE)!;
    COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" ~(.* NEWLINE .*) ?= NEWLINE)!;
    // COMMENT:    ("/*" ~(.* "*/" .*) "*/" | "//" ~(.* NEWLINE .*) ?= NEWLINE)!;
    LITERAL:    (
                    "\"" ([^"\\] | "\\\\" | "\\\"" | CONTROL | UNICODE)* "\""
                  | '\'' ([^'\\] | '\\\\' | '\\\'' | CONTROL | UNICODE)* '\''
                ) -> LITERAL;
    SYMBOL:     (
                    ":" | ";"
                  | "(" | ")"
                  | "*" | "+" | "?"
                  | "&" | "|" | "~"
                  | "?=" | "!" | "->" | "@"
                  | "{" | "}" | "," | "." | "<" | ">"
                ) -> SYMBOL;
    RANGE:      CHAR "-" CHAR;
    CATEGORY:   "\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\p{" [A-Za-z_]* "}" | "\\P{" [A-Za-z_]* "}";
    CHAR:       [^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | CONTROL | UNICODE | CATEGORY | "\\]";
    CLASS:      "[" (RANGE | CHAR)* ("^" (RANGE | CHAR)+)? "]" -> CLASS;
    KEYWORD:    (
                    "grammar" | "start" | "import" | "from" | "export" | "constructor"
                  | "augment" | "default" | "extends" | "super"
                ) -> KEYWORD;
}

import {ID, CLASS, LITERAL} from .lexer;

export constructor Module, Import, Export, Constructor, Grammar, Start, Rule, Augmentation;

export constructor Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Look, InstanceOf, One, Ref, Class, Literal, Default, Super, Capture;

export grammar Parser {
    start Statement* -> Module ;
    
    Statement       : Import | Export | Definition | Augmentation ;
    
    Import          : "import"! IdentifierList "from"! ModuleIdentifier ";"! -> Import ;
    IdentifierList  : "{"! @ID (":"! @ID)? (","! @ID (":"! @ID)?)* "}"! -> List
                    | @ID (","! @ID)* -> List ;
    ModuleIdentifier: "."* (@ID | @LITERAL) ("." (@ID | @LITERAL))* -> Text ;
    
    Export          : "export"! Definition -> Export ;
    
    Definition      : Constructor | Grammar ;
    
    Constructor     : "constructor"! @ID (","! @ID)* ";"! -> Constructor ;
    
    Grammar         : "grammar"! @ID ("extends"! @ID)? "{"! (Rule* -> List) "}"! -> Grammar ;
    Rule            : "start"! Expression ";"! -> Start
                    | @ID ":"! Expression ";"! -> Rule ;
    
    Augmentation    : "augment"! "grammar"! @ID "{"! (Rule* -> List) "}"! -> Augmentation ;
    
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
                | "@"! @ID -> InstanceOf
                | "."! -> One
                | @ID -> Ref
                | @CLASS -> Class
                | @LITERAL -> Literal
                | "default"! -> Default
                | "super"! -> Super ;
}

export constructor Class, Char, Control, Unicode, Range, Category, Not;

export grammar Scannerless {
    start Class;
    
    CONTROL:  ("\\t" | "\\r" | "\\n" | "\\v" | "\\f") -> Text;
    UNICODE:  ("\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]) -> Text;
    CHAR:     ([^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | "\\]") -> Text;
    CATEGORY: ("\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\p{" [A-Za-z_]* "}" | "\\P{" [A-Za-z_]+ "}") -> Text;
    
    Range:    (CHAR | UNICODE) "-"! (CHAR | UNICODE) -> Range;
    Category: CATEGORY -> Category;
    Char:     Category | CHAR -> Char | CONTROL -> Control | UNICODE -> Unicode;
    Class:    "["! ((Range | Char)* -> List) ("^"! (Range | Char)+ -> Not)? "]"! -> Class;
}
