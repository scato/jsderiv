constructor ID, LITERAL, SYMBOL, CLASS, KEYWORD;

lexical grammar Lexer {
    start (SPACE | ID | COMMENT | LITERAL | SYMBOL | CLASS | KEYWORD)*;
    
    NEWLINE: "\r\n" | "\n";
    
    SPACE:      (" " | "\t" | "\r" | "\n")+!;
    ID:         [A-Za-z]+ ?= ~[A-Za-z] & ~KEYWORD -> ID;
    // COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" (~NEWLINE)* ?= NEWLINE)!;
    COMMENT:    ("/*" ~(.* "*/" .*) "*/" | "//" (~NEWLINE)* ?= NEWLINE)!
    LITERAL:    (
                    "\"" ([^"] | "\\\\" | "\\\"")* "\""
                  | '\'' ([^'] | '\\\\' | '\\\'')* '\''
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
    CHAR:       [^\^\-\\] | "\\^" | "\\-" | "\\\\";
    CLASS:      "[" (RANGE | CHAR)* ("^" (RANGE | CHAR)+)? "]" -> CLASS;
    KEYWORD:    "grammar" | "start" | "end" | "import" | "from" | "constructor" -> KEYWORD;
}
