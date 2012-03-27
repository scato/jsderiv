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
