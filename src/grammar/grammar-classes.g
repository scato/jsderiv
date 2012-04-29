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

