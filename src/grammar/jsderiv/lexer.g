constructor ID, LITERAL, SYMBOL, CLASS, KEYWORD;

grammar Lexer {
    start (SPACE | ID | COMMENT | LITERAL | SYMBOL | CLASS | KEYWORD)*;
    
    NEWLINE: "\r\n" | "\n";
    
    SPACE:      ((" " | "\t" | "\r" | "\n")+ ?= ~(" " | "\t" | "\r" | "\n"))!;
    ID:         [A-Za-z]+ ?= ~[A-Za-z] & ~KEYWORD -> ID;
    // COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" ([^\r\n] | "\r" ?= ~"\n")* ?= NEWLINE)!;
    // COMMENT:    ("/*" ~(.* "*/" .*) "*/" | "//" ([^\r\n] | "\r" ?= ~"\n")* ?= NEWLINE)!;
    COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" ~(.* NEWLINE .*) ?= NEWLINE)!;
    // COMMENT:    ("/*" ~(.* "*/" .*) "*/" | "//" ~(.* NEWLINE .*) ?= NEWLINE)!;
    LITERAL:    (
                    "\"" ([^"\\] | "\\\\" | "\\\"" | "\\t" | "\\r" | "\\n")* "\""
                  | '\'' ([^'\\] | '\\\\' | '\\\'' | '\\t' | '\\r' | '\\n')* '\''
                ) -> LITERAL;
    SYMBOL:     (
                    ":" | ";"
                  | "(" | ")"
                  | "*" | "+" | "?"
                  | "&" | "|" | "~"
                  | "?=" | "!" | "->" | "@"
                  | "{" | "}" | "," | "."
                ) -> SYMBOL;
    RANGE:      CHAR "-" CHAR;
    CHAR:       [^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | "\\t" | "\\r" | "\\n" | "\\]";
    CLASS:      "[" (RANGE | CHAR)* ("^" (RANGE | CHAR)+)? "]" -> CLASS;
    KEYWORD:    ("grammar" | "start" | "end" | "import" | "from" | "constructor") -> KEYWORD;
}
